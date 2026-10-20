const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); };
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); }
});
const legal = document.querySelector('#legal-dialog');
document.querySelector('[data-legal]')?.addEventListener('click', () => legal.showModal());
document.querySelectorAll('dialog').forEach(d => {
  d.querySelector('.dialog-close').addEventListener('click', () => d.close());
  d.addEventListener('click', e => {
    if (e.target !== d) return;
    const r = d.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
  });
});
const motion = document.querySelector('.motion-control');
motion?.addEventListener('click', () => {
  const off = document.body.classList.toggle('motion-off');
  motion.setAttribute('aria-pressed', String(off)); motion.textContent = off ? 'Mouvement : arrêté' : 'Mouvement : actif';
});
const form = document.querySelector('#project-form');
if (form) {
  form.querySelector('button[type=submit]').disabled = false;
  const selected = { creation: 'Création de site', refonte: 'Refonte de site', autre: 'Autre projet' }[new URLSearchParams(location.search).get('projet')];
  if (selected) form.elements.projectType.value = selected;
  if (new URLSearchParams(location.search).get('option') === 'photographies') {
    form.elements.message.value = 'Je souhaite une refonte de mon site avec l’option de photographies professionnelles.';
  }
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const values = new FormData(form);
    const draft = [['Nom', 'name'], ['E-mail', 'email'], ['Entreprise', 'company'], ['Projet', 'projectType'], ['Budget', 'budget'], ['Message', 'message']].map(([label, key]) => `${label} : ${values.get(key) || 'Non précisé'}`).join('\n\n');
    const status = document.querySelector('#form-feedback');
    try {
      await navigator.clipboard.writeText(draft);
      document.querySelector('#draft-fallback').hidden = true;
      status.textContent = 'Brouillon copié. Aucun message envoyé.';
    } catch {
      document.querySelector('#draft-fallback').hidden = false;
      const text = document.querySelector('#draft-text'); text.value = draft; text.focus(); text.select();
      status.textContent = 'Copiez le brouillon ci-dessous avec votre clavier. Aucun message envoyé.';
    }
  });
}
