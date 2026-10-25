// Shared focus, not two independent cards. Content is never hidden.
const duo = document.querySelector("[data-studio-duo]");
if (duo) {
  const controls = [...duo.querySelectorAll("[data-duo-select]")];
  let pinned = null;
  function show(value) {
    duo.dataset.focus = value || "both";
  }
  function select(value) {
    pinned = pinned === value ? null : value;
    controls.forEach((control) =>
      control.setAttribute(
        "aria-pressed",
        String(control.dataset.duoSelect === pinned),
      ),
    );
    show(pinned);
  }
  controls.forEach((control, i) => {
    const card = control.closest(".duo-card");
    control.hidden = false;
    card.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "touch") show(control.dataset.duoSelect);
    });
    card.addEventListener("pointerleave", () => show(pinned));
    card.addEventListener("focusin", () => show(control.dataset.duoSelect));
    card.addEventListener("focusout", (event) => {
      if (!duo.contains(event.relatedTarget)) show(pinned);
    });
    control.addEventListener("click", () => select(control.dataset.duoSelect));
    control.addEventListener("keydown", (event) => {
      if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
      ) {
        event.preventDefault();
        controls[1 - i].focus();
      }
      if (event.key === "Escape") {
        pinned = null;
        controls.forEach((c) => c.setAttribute("aria-pressed", "false"));
        show(null);
      }
    });
  });
  const history = duo.querySelector(".duo-card--history");
  const joint = () =>
    duo.style.setProperty("--duo-joint", `${history.offsetHeight + 11}px`);
  new ResizeObserver(joint).observe(history);
  joint();
  duo.dataset.ready = "true";
}
