import {
  studio,
  navigation,
  services,
  method,
  projects,
  projectTypes,
  budgets,
} from './content.js';
import { assetUrl } from './assets.js';

export const escapeHtml = (value = '') =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  );
const e = escapeHtml;
export function siteUrl(value = process.env.SITE_URL) {
  if (!value) return '';
  const url = new URL(value);
  if (
    !['https:', 'http:'].includes(url.protocol) ||
    url.pathname !== '/' ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  )
    throw new Error('SITE_URL doit être une origine HTTP(S), sans chemin.');
  return url.origin;
}
export function publicationReady(env = process.env) {
  return (
    env.PUBLICATION_READY === 'true' &&
    Boolean(siteUrl(env.SITE_URL)) &&
    Object.values(studio.legal).every(Boolean)
  );
}
export function contactReady(env = process.env) {
  return publicationReady(env) && Boolean(env.RESEND_API_KEY && env.CONTACT_FROM && env.CONTACT_TO);
}
export const arrow =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5"/></svg>';
const diagonal =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.4"/></svg>';
const star =
  '<svg viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="M50 0c0 37-13 50-50 50 37 0 50 13 50 50 0-37 13-50 50-50C63 50 50 37 50 0Z" fill="currentColor"/></svg>';
const logo = '<span class="logo-script">Baerg</span><span class="logo-design">DESIGN</span>';
const button = (href, text, secondary = false) =>
  `<a class="${secondary ? 'text-link' : 'button'}" href="${href}">${text}${arrow}</a>`;
const eyebrow = (text, number) =>
  `<div class="eyebrow">${number ? `<span class="section-number">${number} /</span>` : '<span class="tiny-cross" aria-hidden="true">+</span>'}${text}</div>`;

function header(path) {
  return `<header class="site-header"><div class="container header-inner"><a class="logo" href="/" aria-label="Baerg Design, accueil">${logo}</a><button class="menu-toggle" aria-expanded="false" aria-controls="main-navigation"><span>Menu</span><span class="menu-lines" aria-hidden="true"></span></button><nav id="main-navigation" aria-label="Navigation principale">${navigation.map((link) => `<a href="${link.href}"${link.href === path ? ' aria-current="page"' : ''}>${link.label}</a>`).join('')}</nav><a class="header-cta" href="/contact/">Discutons de votre projet ${diagonal}</a></div></header>`;
}
function footer() {
  return `<footer class="site-footer"><div class="container"><div class="footer-top"><a class="logo" href="/" aria-label="Baerg Design, accueil">${logo}</a><p>Du sens dans le fond.<br>Du caractère dans la forme.</p><nav aria-label="Navigation de pied de page">${navigation
    .slice(1)
    .map((link) => `<a href="${link.href}">${link.label}</a>`)
    .join(
      '',
    )}</nav></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Baerg Design</span><span>Imaginé et développé à deux.</span><div><a href="/mentions-legales/">Mentions légales</a><a href="/confidentialite/">Confidentialité</a></div></div></div></footer>`;
}
function finalCta() {
  return `<section class="final-cta"><div class="container cta-inner"><div>${eyebrow('ET SI ON EN PARLAIT ?')}<h2>Votre idée, <em>notre prochain échange.</em></h2><p>Un projet précis ou une première intuition. Tout commence par une conversation.</p></div><a class="button" href="/contact/">Parler de votre projet${diagonal}</a></div></section>`;
}
export function studioArt() {
  return `<figure class="studio-art"><div class="art-scene" aria-hidden="true"><div class="art-grid"></div><div class="art-note">DANS L’ATELIER<br>ÉTUDE N° 01</div><div class="brand-sheet"><div class="sheet-top"><span>BAERG DESIGN</span><span>DESIGN & WEB</span></div><div class="brand-signature">${logo}</div></div><div class="browser-sheet"><div class="browser-bar"><span class="browser-dots"><i></i><i></i><i></i></span><span>Étude d’interface / réservation</span><span>↗</span></div><div class="prototype"><div class="prototype-header"><b>l’atelier.</b><span>Les cours &nbsp; À propos</span></div><strong class="prototype-title">Du temps pour<br>créer de ses mains.</strong><span class="prototype-description">Des ateliers créatifs, ouverts aux curieux.</span><div class="prototype-session"><span class="prototype-date"><b>24</b>OCT.</span><span class="prototype-session-title"><b>Initiation à la céramique</b><small>Samedi · 14 h – 16 h · Débutants</small></span><span class="prototype-action">Choisir ce cours ↗</span></div></div></div><div class="art-annotation"><b>Notre choix ↗</b><br>Le cours, la date et l’inscription réunis au même endroit.</div></div><figcaption><span>Concept du studio · non commandé</span><span>Une interface de réservation, pensée pour réunir le cours, la date et l’inscription.</span></figcaption></figure>`;
}
function serviceIcon(name) {
  const paths = {
    window:
      '<rect x="4" y="5" width="24" height="22" rx="1"/><path d="M4 11h24M8 8h1m3 0h1m-3 9-3 3 3 3m12-6 3 3-3 3m-4-7-3 8"/>',
    refresh: '<path d="M26 13a10 10 0 0 0-17-5l-4 4m0-7v7h7M6 19a10 10 0 0 0 17 5l4-4m0 7v-7h-7"/>',
    devices:
      '<path d="M18 23H4V5h24v7M10 28h7m-4-5v5"/><rect x="21" y="14" width="9" height="15" rx="1"/><path d="M24 26h3"/>',
  };
  return `<svg class="service-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">${paths[name]}</svg>`;
}
function projectList(limit) {
  const available = projects.filter((project) => project.published).slice(0, limit);
  if (!available.length)
    return `<div class="projects-empty"><div class="empty-symbol" aria-hidden="true">${star}</div><div><span class="eyebrow">LES PREMIÈRES PAGES D’UNE HISTOIRE</span><h3>La suite s’écrit <em>ici.</em></h3><p>Notre portfolio se construit. Nous partagerons ici nos réalisations, avec leur contexte et les choix qui les ont guidées.</p></div><span class="empty-note">Pas encore de projet<br>publié.</span></div>`;
  return `<div class="project-grid">${available.map((project) => `<article class="project"><img src="${e(project.image)}" alt="${e(project.imageAlt)}" width="${Number(project.width)}" height="${Number(project.height)}" loading="lazy" decoding="async"><div class="project-heading"><h3>${e(project.name)}</h3><span class="project-nature">${e(project.nature)}</span></div><p><strong>Le besoin.</strong> ${e(project.problem)}</p><p><strong>Notre réponse.</strong> ${e(project.solution)}</p>${project.technologies?.length ? `<p class="project-tech">${project.technologies.map(e).join(' · ')}</p>` : ''}${project.url ? `<a class="text-link" href="${e(project.url)}" rel="noopener noreferrer">Voir le site${diagonal}</a>` : ''}</article>`).join('')}</div>`;
}
function home() {
  return `<div class="hero-band"><section class="home-hero container"><div class="hero-copy">${eyebrow('STUDIO WEB INDÉPENDANT')}<h1>Des sites web<br>avec du fond.<br>Et du <em>caractère.</em></h1><p class="hero-description">Nous sommes deux apprentis développeurs. Ensemble, nous dessinons et développons des sites pour donner une place à votre activité.</p><div class="hero-actions">${button('/contact/', 'Parler de votre projet')}${button('/realisations/', 'Voir nos réalisations', true)}</div><div class="hero-footnote"><span class="dual-dot" aria-hidden="true"><i></i><i></i></span><span>Du premier croquis à la mise en ligne, vous échangez avec nous deux.</span></div></div>${studioArt()}</section></div><div class="container"><div class="intro-strip"><span>LE BEAU A DU SENS.<br>LE WEB AUSSI.</span><p>Un site qui vous ressemble.<br><em>Et qui parle à vos visiteurs.</em></p><a href="#besoins" aria-label="Découvrir notre approche">↓</a></div></div><section id="besoins" class="section container split-section"><div>${eyebrow('LE BON POINT DE DÉPART', '01')}<h2>Votre site devrait<br>vous <em>simplifier la vie.</em></h2></div><div class="needs"><p class="section-intro">Vous lancez votre activité ? Votre site a pris un coup de vieux ? Ou vos visiteurs ne trouvent pas l’essentiel ?</p><p>Nous vous aidons à poser les bonnes bases : une présentation claire, une navigation naturelle et une identité qui vous correspond.</p><a class="text-link" href="/a-propos/">Faire connaissance${arrow}</a></div></section><section class="services-section"><div class="container section"><div class="section-heading"><div>${eyebrow('CE QUE NOUS FAISONS', '02')}<h2>De l’idée à l’écran.</h2></div><p>Juste ce qu’il faut pour donner<br>à votre activité une place sur le web.</p></div><div class="services-grid">${services.map((service) => `<article class="service"><div class="service-top">${serviceIcon(service.icon)}<span>${service.number}</span></div><h3>${service.name}</h3><p>${service.text}</p><span class="service-tags">${service.tags}</span></article>`).join('')}</div></div></section><section class="section container"><div class="section-heading"><div>${eyebrow('LES RÉALISATIONS', '03')}<h2>${projects.some((project) => project.published) ? 'Des idées <em>devenues sites.</em>' : 'Du concret, <em>bientôt ici.</em>'}</h2></div>${button('/realisations/', 'Explorer les réalisations', true)}</div>${projectList(2)}</section><section class="method-section"><div class="container section"><div class="section-heading"><div>${eyebrow('COMMENT ON AVANCE', '04')}<h2>Un chemin clair.<br><em>À chaque étape.</em></h2></div><p>Vous faites partie du projet,<br>du premier échange au dernier détail.</p></div><ol class="method-grid">${method.map((step, index) => `<li><div class="step-number">0${index + 1}<span aria-hidden="true">${arrow}</span></div><h3>${step.name}</h3><p>${step.text}</p></li>`).join('')}</ol></div></section>${finalCta()}`;
}
function about() {
  return `<section class="container page-intro">${eyebrow('LE STUDIO')}<div class="page-intro-grid"><h1>Deux regards.<br>Une même <em>envie.</em></h1><p>Faire du web avec soin, apprendre chaque jour et construire des sites dont nous pouvons être fiers. Ensemble, et avec vous.</p></div></section><section class="container about-story"><div class="about-art" aria-hidden="true"><span class="about-art-top">BAERG DESIGN / LE STUDIO</span><div class="studio-notebook"><div><span>01 /</span><b>Comprendre.</b></div><div><span>02 /</span><b>Dessiner.</b></div><div><span>03 /</span><b>Développer.</b></div></div><span class="about-art-bottom">Deux regards sur chaque étape.</span></div><div class="about-copy">${eyebrow('À TAILLE HUMAINE')}<h2>Un jeune studio.<br><em>Une vraie implication.</em></h2><p>Baerg Design, c’est nous : deux apprentis développeurs full-stack qui avons choisi de créer ensemble.</p><p>Nous proposons la création et la refonte de sites web aux entreprises, aux indépendants et aux particuliers. Notre parcours est en construction ; notre attention à votre projet est déjà là.</p><p>Vous échangez directement avec les personnes qui conçoivent et développent votre site. Nous vous expliquons nos choix, nous écoutons vos retours et nous avançons avec vous.</p></div></section><section class="section container"><div class="section-heading"><div>${eyebrow('NOTRE FAÇON DE FAIRE')}<h2>Les choses simples,<br>faites avec soin.</h2></div></div><div class="values-grid"><article><span class="eyebrow">01 / ÉCOUTER</span><h3>Comprendre avant de créer.</h3><p>Votre activité a son histoire et ses besoins. C’est le point de départ de nos choix, du contenu jusqu’au design.</p></article><article><span class="eyebrow">02 / ÊTRE CLAIRS</span><h3>Se parler simplement.</h3><p>Des explications accessibles, des étapes définies ensemble et de la transparence sur ce que nous pouvons réaliser.</p></article><article><span class="eyebrow">03 / S’IMPLIQUER</span><h3>Prendre le temps du détail.</h3><p>Nous relisons, ajustons et testons pour proposer un site cohérent, agréable à parcourir et facile à comprendre.</p></article></div></section><section class="skills-section"><div class="container split-section section"><div>${eyebrow('NOTRE TERRAIN DE TRAVAIL')}<h2>Le design rencontre<br><em>le développement.</em></h2></div><div><p class="section-intro">Notre formation full-stack nous amène à travailler sur les interfaces et sur leur fonctionnement côté serveur.</p><p>Pour votre site, nous réunissons conception des pages, développement et adaptation aux différents écrans. Les choix techniques se définissent selon les besoins du projet.</p><p>Nous continuons à apprendre. Si une demande dépasse notre expérience, nous vous le disons.</p></div></div></section>${finalCta()}`;
}
function work() {
  return `<section class="container page-intro">${eyebrow('LES RÉALISATIONS')}<div class="page-intro-grid"><h1>Des idées qui<br>prennent <em>forme.</em></h1><p>Les sites que nous construisons, les questions qu’ils posent et les réponses que nous leur apportons.</p></div></section><section class="container work-section"><div class="work-section-head"><span class="eyebrow">LE PORTFOLIO</span><span>${projects
    .filter((project) => project.published)
    .length.toString()
    .padStart(
      2,
      '0',
    )} projet${projects.filter((project) => project.published).length > 1 ? 's' : ''} publié${projects.filter((project) => project.published).length > 1 ? 's' : ''}</span></div>${projectList()}<div class="work-note"><span aria-hidden="true">↳</span><p>Chaque réalisation sera présentée pour ce qu’elle est : un projet client, personnel, scolaire ou un concept non commandé.</p></div></section>${finalCta()}`;
}
function contact() {
  const ready = contactReady();
  const select = (id, label, values) =>
    `<div class="field"><label for="${id}">${label} <span>facultatif</span></label><select id="${id}" name="${id}">${values.map((value) => `<option>${e(value)}</option>`).join('')}</select></div>`;
  return `<section class="container page-intro contact-intro">${eyebrow('PRENONS CONTACT')}<h1>Tout commence<br>par un <em>échange.</em></h1></section><section class="container contact-layout"><aside class="contact-aside"><h2>Parlez-nous<br>de <em>votre idée.</em></h2><p>Une création, une refonte ou quelques questions. Racontez-nous ce que vous avez en tête, même si tout n’est pas encore défini.</p><div class="contact-details"><span class="eyebrow">ET ENSUITE ?</span><p>Nous prendrons connaissance de votre demande pour discuter de vos besoins et de la suite à envisager.</p></div>${studio.email ? `<a class="text-link" href="mailto:${e(studio.email)}">${e(studio.email)}${diagonal}</a>` : ''}<div class="contact-mark" aria-hidden="true">${star}</div></aside><div class="form-wrap">${!ready ? '<div class="form-notice" role="status"><strong>Le formulaire n’est pas encore ouvert.</strong><p>Le service de messagerie et les informations de contact sont en cours de configuration. Aucun message ne peut être transmis pour le moment.</p></div>' : ''}<form id="contact-form" action="/api/contact" method="post" data-ready="${ready}"><p class="form-required">Les champs marqués d’un <span aria-hidden="true">*</span> sont obligatoires.</p><div class="form-grid"><div class="field"><label for="name">Votre nom <span>*</span></label><input id="name" name="name" autocomplete="name" required maxlength="100" placeholder="Prénom et nom"></div><div class="field"><label for="email">Votre e-mail <span>*</span></label><input id="email" name="email" type="email" autocomplete="email" required maxlength="254" placeholder="vous@exemple.ch"></div><div class="field field-full"><label for="company">Entreprise <span>facultatif</span></label><input id="company" name="company" autocomplete="organization" maxlength="160" placeholder="Le nom de votre activité"></div>${select('projectType', 'Votre projet', projectTypes)}${select('budget', 'Budget envisagé', budgets)}<div class="field field-full"><label for="message">Votre message <span>*</span></label><textarea id="message" name="message" required minlength="10" maxlength="5000" rows="6" placeholder="Votre activité, vos envies, ce que vous aimeriez faire évoluer…"></textarea><span class="field-hint">10 caractères minimum.</span></div></div><div class="honeypot" aria-hidden="true"><label for="website">Laisser ce champ vide</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div><p class="privacy-note">Les informations transmises servent uniquement à étudier votre demande et à vous répondre. Aucun usage publicitaire. <a href="/confidentialite/">En savoir plus sur vos données.</a></p><div class="form-bottom"><button class="button" type="submit" ${!ready ? 'disabled' : ''}><span>Envoyer mon message</span>${arrow}</button><span class="form-note">Faisons connaissance.</span></div><div id="form-feedback" role="status" aria-live="polite" tabindex="-1"></div><noscript><p>Activez JavaScript pour utiliser le formulaire sécurisé. Aucun message n’a été envoyé.</p></noscript></form></div></section>`;
}
function legal() {
  const labels = {
    publisher: 'Éditeur',
    legalForm: 'Forme juridique',
    address: 'Adresse',
    registration: 'Immatriculation ou statut applicable',
    publicationDirector: 'Responsable de publication',
    hostName: 'Hébergeur',
    hostAddress: 'Adresse de l’hébergeur',
    hostContact: 'Contact de l’hébergeur',
  };
  const missing = Object.entries(labels).filter(([key]) => !studio.legal[key]);
  return `<section class="container legal-page">${eyebrow('INFORMATIONS DU SITE')}<h1>Mentions <em>légales.</em></h1>${missing.length ? '<div class="form-notice"><strong>Informations en cours de préparation.</strong><p>Ce site est une prévisualisation. Les informations ci-dessous doivent être complétées avant sa publication.</p></div>' : ''}<h2>Éditeur et hébergement</h2><dl>${Object.entries(
    labels,
  )
    .filter(([key]) => studio.legal[key])
    .map(([key, label]) => `<dt>${label}</dt><dd>${e(studio.legal[key])}</dd>`)
    .join(
      '',
    )}</dl>${missing.length ? `<p>Informations encore nécessaires : ${missing.map(([, label]) => label.toLowerCase()).join(', ')}.</p>` : ''}<h2>Contenus et ressources</h2><p>Les textes et compositions graphiques ont été créés pour Baerg Design. Les polices Pinyon Script, Cormorant Garamond et DM Sans sont utilisées sous licence SIL Open Font License 1.1 et hébergées localement.</p><h2>Données personnelles</h2><p>Consultez la <a href="/confidentialite/">politique de confidentialité</a> pour comprendre le fonctionnement du formulaire et le traitement des données.</p></section>`;
}
function privacy() {
  const legal = studio.legal;
  return `<section class="container legal-page">${eyebrow('VOS DONNÉES')}<h1>En toute <em>transparence.</em></h1>${!publicationReady() ? '<div class="form-notice"><strong>Politique à compléter avant publication.</strong><p>Le responsable du traitement, le contact pour exercer vos droits, la durée de conservation et les lieux de traitement doivent être confirmés. Le formulaire reste désactivé jusque-là.</p></div>' : ''}<h2>Qui traite vos données ?</h2><p>${legal.publisher ? e(legal.publisher) : 'L’identité juridique du responsable de Baerg Design reste à renseigner.'}${legal.address ? ` Adresse : ${e(legal.address)}.` : ''}</p><h2>Ce que le formulaire recueille</h2><p>Votre nom, votre adresse e-mail et votre message sont nécessaires pour comprendre votre demande et vous répondre. Le nom de votre entreprise, le type de projet et votre budget sont facultatifs. Évitez d’inclure des informations sensibles dans votre message.</p><h2>Pourquoi et comment ?</h2><p>Ces informations servent uniquement à examiner votre demande et à échanger avec vous au sujet d’un éventuel projet. Ce traitement répond à votre demande de contact et, selon son objet, prépare les échanges précontractuels. Elles ne servent pas à vous envoyer de publicité.</p><p>Lorsque le service est activé, le serveur transmet votre demande par e-mail via Resend à la boîte de réception configurée du studio. Le site ne possède pas de base de données de contacts. Les personnes habilitées du studio et les prestataires nécessaires à la transmission et à l’hébergement peuvent traiter ces données.</p><p>${legal.processingLocation ? `Lieux de traitement et garanties applicables : ${e(legal.processingLocation)}` : 'Les lieux de traitement des prestataires et les garanties en cas de transfert international restent à confirmer avant activation.'}</p><h2>Durée de conservation</h2><p>${legal.retention ? e(legal.retention) : 'La durée de conservation des demandes dans la messagerie doit être définie par le studio avant l’ouverture du formulaire.'}</p><p>Pour limiter les abus, une empreinte temporaire de l’adresse réseau est conservée dans la mémoire du serveur pendant quinze minutes environ. Le contenu des messages n’est pas écrit dans les journaux applicatifs. Les éventuels journaux de l’hébergeur doivent être documentés lors du choix de l’hébergement.</p><h2>Vos droits</h2><p>Vous pouvez demander l’accès, la rectification ou l’effacement de vos données et, selon la réglementation applicable, la limitation du traitement, vous y opposer ou demander leur portabilité. Vous pouvez également saisir l’autorité de protection des données compétente.</p><p>${legal.privacyContact ? `Pour exercer vos droits : ${e(legal.privacyContact)}.` : 'Le contact permettant d’exercer ces droits doit encore être renseigné.'}</p><h2>Cookies et ressources externes</h2><p>Ce site ne dépose pas de cookies et n’intègre aucun outil de mesure d’audience ni traceur publicitaire. Les polices sont hébergées avec le site. Aucun chargement depuis Google Fonts n’a lieu pendant votre visite.</p></section>`;
}
export const pages = {
  '/': {
    title: 'Baerg Design — Des sites web avec du caractère',
    description:
      'Baerg Design, studio de deux apprentis développeurs full-stack. Création et refonte de sites web pour entreprises, indépendants et particuliers.',
    render: home,
  },
  '/a-propos/': {
    title: 'Le studio — Baerg Design',
    description:
      'Deux apprentis développeurs full-stack, une même envie : construire avec vous un site clair et soigné. Découvrez le studio Baerg Design.',
    render: about,
  },
  '/realisations/': {
    title: 'Réalisations — Baerg Design',
    description:
      'Le portfolio de Baerg Design se construit. Retrouvez ici les projets publiés, leur contexte et les choix de conception.',
    render: work,
  },
  '/contact/': {
    title: 'Parlons de votre projet — Baerg Design',
    description:
      'Un nouveau site, une refonte ou une première idée ? Présentez votre projet au studio Baerg Design.',
    render: contact,
  },
  '/mentions-legales/': {
    title: 'Mentions légales — Baerg Design',
    description:
      'Informations relatives à l’éditeur, à l’hébergement et aux ressources du site Baerg Design.',
    render: legal,
  },
  '/confidentialite/': {
    title: 'Confidentialité — Baerg Design',
    description:
      'Comment Baerg Design traite les données du formulaire de contact et protège votre vie privée.',
    render: privacy,
  },
  '/404/': {
    title: 'Page introuvable — Baerg Design',
    description: 'Cette page n’existe pas. Retrouvez le studio Baerg Design depuis l’accueil.',
    render: () =>
      `<section class="container not-found">${eyebrow('ERREUR 404')}<span class="error-number" aria-hidden="true">404</span><h1>Une page <em>de côté.</em></h1><p>Ce lien ne mène plus au bon endroit.<br>Reprenons depuis le début.</p>${button('/', 'Revenir à l’accueil')}</section>`,
  },
};
export function renderPage(path) {
  const page = pages[path] || pages['/404/'];
  const origin = siteUrl();
  const indexable = publicationReady() && page !== pages['/404/'];
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${e(page.title)}</title><meta name="description" content="${e(page.description)}"><meta name="robots" content="${indexable ? 'index, follow' : 'noindex, nofollow'}"><meta name="theme-color" content="#FFFFFF"><meta property="og:type" content="website"><meta property="og:locale" content="fr_CH"><meta property="og:site_name" content="Baerg Design"><meta property="og:title" content="${e(page.title)}"><meta property="og:description" content="${e(page.description)}">${origin ? `<link rel="canonical" href="${e(origin + path)}"><meta property="og:url" content="${e(origin + path)}"><meta property="og:image" content="${e(origin + assetUrl('/images/og.png'))}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Baerg Design — Des sites web avec du fond et du caractère.">` : ''}<meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${assetUrl('/favicon.svg')}" type="image/svg+xml"><link rel="preload" href="/fonts/cormorant-regular.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/dm-sans.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/pinyon.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="${assetUrl('/styles.css')}"><script src="${assetUrl('/app.js')}" defer></script></head><body><a class="skip-link" href="#main">Aller au contenu</a>${header(path)}<main id="main">${page.render()}</main>${footer()}</body></html>`;
}
