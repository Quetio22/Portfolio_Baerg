const header = document.querySelector('[data-scroll-header]');

if (header) {
  let previousY = Math.max(0, window.scrollY);
  let scheduled = false;

  function updateNavigation() {
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const y = Math.min(maxY, Math.max(0, window.scrollY));
    const delta = y - previousY;
    const keyboardFocus =
      header.contains(document.activeElement) && document.activeElement.matches(':focus-visible');

    if (y <= header.offsetHeight || delta < 0 || keyboardFocus) {
      header.classList.remove('is-scroll-hidden');
    } else if (delta > 0) {
      header.classList.add('is-scroll-hidden');
    }
    previousY = y;
    scheduled = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(updateNavigation);
      }
    },
    { passive: true },
  );

  header.addEventListener('focusin', () => header.classList.remove('is-scroll-hidden'));
  window.addEventListener('resize', () => {
    previousY = Math.max(0, window.scrollY);
    header.classList.remove('is-scroll-hidden');
  });
}
