document.documentElement.classList.add('js');

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');
function closeMenu(returnFocus = false) {
  menuToggle.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
  if (returnFocus) menuToggle.focus();
}
menuToggle.addEventListener('click', () => {
  const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(opening));
  navigation.classList.toggle('is-open', opening);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true')
    closeMenu(true);
});
document.addEventListener('click', (event) => {
  if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});
document.addEventListener('focusin', (event) => {
  if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});
matchMedia('(min-width: 601px)').addEventListener('change', () => closeMenu());

const form = document.querySelector('#contact-form');
if (form) {
  const feedback = document.querySelector('#form-feedback');
  const submit = form.querySelector('button[type="submit"]');
  const label = submit.querySelector('span');
  let sending = false;
  let requestId = crypto.randomUUID();
  let previousPayload = '';
  const startedAt = Date.now();
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    if (form.dataset.ready !== 'true') {
      feedback.textContent = 'Le formulaire n’est pas encore ouvert. Aucun message n’a été envoyé.';
      return;
    }
    if (!form.reportValidity()) return;
    const fields = Object.fromEntries(new FormData(form));
    const serialized = JSON.stringify(fields);
    if (previousPayload && previousPayload !== serialized) requestId = crypto.randomUUID();
    previousPayload = serialized;
    sending = true;
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    label.textContent = 'Envoi en cours…';
    feedback.textContent = '';
    feedback.dataset.state = 'pending';
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, requestId, startedAt }),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok || !result.ok)
        throw new Error(
          result.message || 'L’envoi n’a pas pu être confirmé. Vos saisies sont conservées.',
        );
      feedback.dataset.state = 'success';
      feedback.textContent =
        'Votre message a été accepté par notre service de messagerie. Merci de nous avoir présenté votre projet.';
      form.reset();
      previousPayload = '';
      requestId = crypto.randomUUID();
    } catch (error) {
      feedback.dataset.state = 'error';
      feedback.textContent =
        error.name === 'TimeoutError' || error instanceof TypeError
          ? 'L’envoi n’a pas pu être confirmé. Vérifiez votre connexion et réessayez. Vos saisies sont conservées.'
          : error.message;
    } finally {
      sending = false;
      submit.disabled = false;
      form.removeAttribute('aria-busy');
      label.textContent = 'Envoyer mon message';
      feedback.focus();
    }
  });
}
