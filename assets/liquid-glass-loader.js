// The two hero links always retain their original treatment. ?glass=original
// remains available for direct comparison or a lightweight native-only view.
const actions = [
  ...document.querySelectorAll(
    "a.button, a.text-link, button.button, .menu-toggle, .legal-link, .dialog-close, .duo-select",
  ),
].filter((el) => !el.closest(".home-hero-actions"));
const nativeMode =
  new URLSearchParams(location.search).get("glass") === "original";
const canBlur =
  typeof CSS !== "undefined" &&
  (CSS.supports("backdrop-filter", "blur(1px)") ||
    CSS.supports("-webkit-backdrop-filter", "blur(1px)"));
if (!nativeMode && canBlur && actions.length) {
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "/assets/liquid-glass/glass.css";
  const styles = new Promise((resolve, reject) => {
    css.onload = resolve;
    css.onerror = () => reject(Error("Glass stylesheet unavailable"));
  });
  document.head.append(css);
  Promise.all([styles, import("/assets/liquid-glass/glass.js")])
    .then(([, module]) => module.mountGlassControls(actions))
    .catch(() => {
      css.remove();
      document.documentElement.dataset.glass = "original";
    });
} else {
  document.documentElement.dataset.glass = "original";
}
