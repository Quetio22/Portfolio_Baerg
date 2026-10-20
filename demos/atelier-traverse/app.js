// Local demonstration only: no network requests or browser storage.
const dialog = document.querySelector('#contact-demo');
const trigger = document.querySelector('[data-contact]');
const form = dialog.querySelector('form');
const result = dialog.querySelector('.form-result');
if (typeof dialog.showModal === 'function') {
  trigger.disabled = false;
  trigger.addEventListener('click', () => {
    result.hidden = true;
    dialog.showModal();
  });
}
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    dialog.close();
});
dialog.addEventListener('close', () => {
  form.reset();
  result.hidden = true;
  trigger.focus({ preventScroll: true });
});
form.addEventListener('submit', (event) => {
  event.preventDefault();
  result.hidden = false;
});
form.addEventListener('input', () => {
  result.hidden = true;
});
// Frozen from the saved quiet motion configuration; no storage or studio dependency.
(() => {
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  let entrance = null;
  function cancel() {
    if (entrance) {
      entrance.cancel();
      entrance = null;
    }
  }
  if (!mq.matches) {
    entrance = document.querySelector('.wordmark').animate(
      [
        { transform: 'translateY(5px)', opacity: 0.9 },
        { transform: 'translateY(0)', opacity: 1 },
      ],
      { duration: 360, easing: 'cubic-bezier(.2,.7,.2,1)' },
    );
    entrance.onfinish = () => {
      entrance = null;
    };
  }
  mq.addEventListener('change', () => {
    if (mq.matches) cancel();
  });
  window.addEventListener('pagehide', cancel);
})();

// Explicit user selection only: no autoplay or timers. Native buttons support
// Enter/Space; arrow keys also move selection and focus between the two studies.
const gallery = document.querySelector('.project-grid');
const cards = [...gallery.querySelectorAll('article')];
const galleryButtons = [...gallery.querySelectorAll('.gallery-select')];
function selectStudy(index, moveFocus = false) {
  cards.forEach((card, i) => {
    const active = i === index;
    card.classList.toggle('is-active', active);
    galleryButtons[i].setAttribute('aria-pressed', String(active));
    galleryButtons[i].setAttribute(
      'aria-label',
      `${active ? 'Vue agrandie' : 'Agrandir'} : ${card.querySelector('h3').textContent}`,
    );
  });
  if (moveFocus) galleryButtons[index].focus({ preventScroll: true });
}
galleryButtons.forEach((button, index) => {
  button.hidden = false;
  button.addEventListener('click', () => selectStudy(index));
  button.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? cards.length - 1
          : (index + (event.key === 'ArrowRight' ? 1 : -1) + cards.length) % cards.length;
    selectStudy(next, true);
  });
});
selectStudy(0);
gallery.classList.add('is-interactive');
