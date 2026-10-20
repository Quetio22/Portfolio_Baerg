const filters = document.querySelector('.filters');
const buttons = [...filters.querySelectorAll('button')];
const categories = [...document.querySelectorAll('.menu-category')];
const status = document.querySelector('#filter-status');
filters.hidden = false;
filters.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-filter]');
  if (!button) return;
  const selected = button.dataset.filter;
  buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  categories.forEach((category) => {
    category.hidden = selected !== 'all' && category.dataset.category !== selected;
  });
  status.textContent =
    selected === 'all'
      ? 'Toute la carte est affichée : 6 propositions.'
      : `${button.textContent} : 2 propositions affichées.`;
});
