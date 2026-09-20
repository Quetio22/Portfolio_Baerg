// Run synchronously in the head, after CSS and before the body is parsed.
// This restores the theme before content paints and lets WebKit style native fields correctly.
(() => {
  let theme = 'light';
  try {
    if (localStorage.getItem('baerg-theme') === 'dark') theme = 'dark';
  } catch {
    // The switch still works when browser storage is unavailable.
  }
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content =
    theme === 'dark' ? '#1C1D22' : '#FFFFFF';
})();
