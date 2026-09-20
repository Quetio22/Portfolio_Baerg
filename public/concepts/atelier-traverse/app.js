const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
toggle.hidden = false;
document.documentElement.classList.add('js');

function closeMenu(returnFocus = false) {
  toggle.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
  if (returnFocus) toggle.focus();
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', (event) => {
  if (!navigation.contains(event.target) && !toggle.contains(event.target)) closeMenu();
});
document.addEventListener('focusin', (event) => {
  if (!navigation.contains(event.target) && !toggle.contains(event.target)) closeMenu();
});
matchMedia('(min-width: 801px)').addEventListener('change', () => closeMenu());
