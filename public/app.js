document.documentElement.classList.add('js');

const themeToggle = document.querySelector('.theme-toggle');
function applyTheme(theme) {
  const dark = theme === 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  themeToggle.setAttribute('aria-pressed', String(dark));
  themeToggle.title = dark ? 'Passer en mode clair' : 'Passer en mode sombre';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#1C1D22' : '#FFFFFF';
}
applyTheme(document.documentElement.dataset.theme);
themeToggle.hidden = false;
themeToggle.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(theme);
  try {
    localStorage.setItem('baerg-theme', theme);
  } catch {
    // Keep the current page usable even if storage is blocked.
  }
});
window.addEventListener('storage', (event) => {
  if (event.key === 'baerg-theme' || event.key === null) applyTheme(event.newValue);
});

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');
const siteHeader = document.querySelector('.site-header');

let previousScrollY = Math.max(window.scrollY, 0);
let headerScrollFrame = 0;

function revealHeader() {
  siteHeader.classList.remove('is-hidden');
}

function updateHeaderOnScroll() {
  const currentScrollY = Math.max(window.scrollY, 0);
  const isMenuOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  const headerHasFocus = siteHeader.contains(document.activeElement);

  if (currentScrollY === 0 || currentScrollY < previousScrollY || isMenuOpen || headerHasFocus) {
    revealHeader();
  } else if (currentScrollY > previousScrollY && currentScrollY > siteHeader.offsetHeight) {
    siteHeader.classList.add('is-hidden');
  }

  previousScrollY = currentScrollY;
  headerScrollFrame = 0;
}

window.addEventListener(
  'scroll',
  () => {
    if (!headerScrollFrame) {
      headerScrollFrame = window.requestAnimationFrame(updateHeaderOnScroll);
    }
  },
  { passive: true },
);

window.addEventListener(
  'wheel',
  (event) => {
    if (event.deltaY < 0) revealHeader();
  },
  { passive: true },
);

let previousTouchY = null;
window.addEventListener(
  'touchstart',
  (event) => {
    previousTouchY = event.touches[0]?.clientY ?? null;
  },
  { passive: true },
);
window.addEventListener(
  'touchmove',
  (event) => {
    const currentTouchY = event.touches[0]?.clientY;
    if (previousTouchY !== null && currentTouchY > previousTouchY) revealHeader();
    previousTouchY = currentTouchY ?? null;
  },
  { passive: true },
);
window.addEventListener('touchend', () => {
  previousTouchY = null;
});

window.addEventListener('keydown', (event) => {
  if (
    event.key === 'ArrowUp' ||
    event.key === 'PageUp' ||
    event.key === 'Home' ||
    (event.key === ' ' && event.shiftKey)
  )
    revealHeader();
});

siteHeader.addEventListener('focusin', revealHeader);

function closeMenu(returnFocus = false) {
  menuToggle.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
  if (returnFocus) menuToggle.focus();
}
menuToggle.addEventListener('click', () => {
  const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
  if (opening) revealHeader();
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
matchMedia('(min-width: 801px)').addEventListener('change', () => closeMenu());

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
