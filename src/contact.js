import { createHash, randomBytes } from 'node:crypto';
import { budgets, projectTypes } from './content.js';

export const emailPattern = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;
export function validateContact(body, now = Date.now()) {
  if (!body || typeof body !== 'object' || Array.isArray(body))
    return { error: 'La demande est invalide.' };
  const fields = {};
  for (const key of [
    'name',
    'email',
    'message',
    'company',
    'projectType',
    'budget',
    'website',
    'requestId',
  ]) {
    if (body[key] !== undefined && typeof body[key] !== 'string')
      return { error: 'Le format des champs est invalide.' };
    fields[key] = (body[key] || '').trim();
  }
  if (fields.website) return { error: 'La demande a été bloquée par la protection antispam.' };
  if (
    !Number.isFinite(body.startedAt) ||
    now - body.startedAt < 2000 ||
    now - body.startedAt > 24 * 60 * 60 * 1000
  )
    return {
      error:
        'Veuillez patienter quelques secondes avant l’envoi. Si la page est ouverte depuis longtemps, rechargez-la.',
    };
  if (!fields.name || fields.name.length > 100 || /[\r\n\x00-\x1f]/.test(fields.name))
    return { error: 'Renseignez un nom valide de 100 caractères maximum.' };
  if (!emailPattern.test(fields.email) || fields.email.length > 254)
    return { error: 'Renseignez une adresse e-mail valide.' };
  if (fields.message.length < 10 || fields.message.length > 5000 || fields.message.includes('\0'))
    return { error: 'Votre message doit contenir entre 10 et 5 000 caractères.' };
  if (fields.company.length > 160 || /[\r\n\x00-\x1f]/.test(fields.company))
    return { error: 'Le nom de l’entreprise est invalide.' };
  fields.projectType ||= 'À définir';
  fields.budget ||= 'À définir';
  if (!projectTypes.includes(fields.projectType) || !budgets.includes(fields.budget))
    return { error: 'Choisissez un type de projet et un budget proposés.' };
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(fields.requestId)
  )
    return { error: 'Rechargez la page avant de réessayer.' };
  return { fields };
}

export function createRateLimiter({
  limit = 5,
  windowMs = 15 * 60 * 1000,
  maxEntries = 10000,
  now = Date.now,
} = {}) {
  const entries = new Map();
  const salt = randomBytes(32);
  function clean() {
    for (const [key, entry] of entries) if (entry.expires <= now()) entries.delete(key);
  }
  const timer = setInterval(clean, 30000);
  timer.unref();
  return {
    check(address) {
      const key = createHash('sha256').update(salt).update(address).digest('hex');
      let entry = entries.get(key);
      if (!entry || entry.expires <= now()) {
        clean();
        if (entries.size >= maxEntries) return false;
        entry = { count: 0, expires: now() + windowMs };
        entries.set(key, entry);
      }
      entry.count += 1;
      return entry.count <= limit;
    },
    close() {
      clearInterval(timer);
      entries.clear();
    },
  };
}

export async function sendContact(fields, env, fetchImpl = fetch) {
  const text = [
    `Nom : ${fields.name}`,
    `E-mail : ${fields.email}`,
    `Entreprise : ${fields.company || 'Non renseignée'}`,
    `Projet : ${fields.projectType}`,
    `Budget : ${fields.budget}`,
    '',
    fields.message,
  ].join('\n');
  // Identique lors d'une nouvelle tentative du même envoi. Aucun contenu personnel dans la clé.
  const idempotency = createHash('sha256').update(fields.requestId).update(text).digest('hex');
  const response = await fetchImpl('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `contact/${idempotency}`,
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: fields.email,
      subject: 'Nouvelle demande — Baerg Design',
      text,
    }),
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) return false;
  const result = await response.json();
  return typeof result.id === 'string' && result.id.length > 0;
}
