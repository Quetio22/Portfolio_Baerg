// Experimental opt-in. The default page never downloads React or the glass CSS.
if (new URLSearchParams(location.search).get("glass") === "liqui") {
  const actions = document.querySelector(".home-hero-actions");
  const canBlur =
    typeof CSS !== "undefined" &&
    (CSS.supports("backdrop-filter", "blur(1px)") ||
      CSS.supports("-webkit-backdrop-filter", "blur(1px)"));
  if (actions && canBlur) {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "/assets/liquid-glass/glass.css";
    const styles = new Promise((resolve, reject) => {
      css.onload = resolve;
      css.onerror = () => reject(new Error("Glass stylesheet unavailable"));
    });
    document.head.append(css);
    Promise.all([styles, import("/assets/liquid-glass/glass.js")])
      .then(([, module]) => module.mountGlassLinks(actions))
      .catch(() => {
        css.remove();
        document.documentElement.dataset.glass = "original";
      });
  } else if (actions) {
    document.documentElement.dataset.glass = "original";
  }
}
