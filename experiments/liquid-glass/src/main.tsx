import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import { LiquiGlass } from "@liqui-design/glass";
import "./styles.css";

type NativeAction = HTMLAnchorElement | HTMLButtonElement;
// Decorate the existing element instead of replacing it: href, form association,
// disabled state, event listeners, native keyboard and modifier clicks stay intact.
export function mountGlassControls(targets: NativeAction[]) {
  let count = 0;
  for (const action of targets) {
    if (action.closest(".glass-shell,.home-hero-actions")) continue;
    const computed = getComputedStyle(action);
    const bg = computed.backgroundColor.match(/[\d.]+/g)?.map(Number) ?? [];
    const colored =
      bg.length >= 3 &&
      bg[0] > 130 &&
      bg[0] > bg[1] * 1.45 &&
      (bg[3] ?? 1) > 0.3;
    const darkInk = (
      computed.color
        .match(/[\d.]+/g)
        ?.slice(0, 3)
        .map(Number) ?? []
    ).every((channel) => channel < 130);
    const tone = colored
      ? "orange"
      : (bg[3] ?? 0) > 0.3 || darkInk
        ? "cream"
        : "clear";
    const kind = action.classList.contains("menu-toggle")
      ? "menu"
      : action.classList.contains("dialog-close")
        ? "close"
        : action.classList.contains("legal-link")
          ? "legal"
          : "action";
    const shell = document.createElement("div");
    shell.className = `glass-shell glass-shell--${tone}`;
    shell.dataset.kind = kind;
    shell.style.setProperty("--glass-ink", computed.color);
    const host = document.createElement("div");
    host.className = "glass-underlay";
    host.setAttribute("aria-hidden", "true");
    action.before(shell);
    shell.append(host, action);
    let root: Root | undefined;
    const restore = () => {
      action.classList.remove("glass-native");
      shell.before(action);
      shell.remove();
    };
    try {
      root = createRoot(host, { onUncaughtError: restore });
      flushSync(() =>
        root!.render(
          <LiquiGlass
            radius={kind === "close" ? 12 : 8}
            blur={0.8}
            bezel={kind === "action" ? 9 : 7}
            refraction={kind === "action" ? 38 : 24}
            dispersion={0}
            frost={tone === "orange" ? 0.22 : tone === "cream" ? 0.7 : 0.45}
            specular={tone === "orange" ? 1 : 0.8}
            saturation={1.02}
            className="glass-skin"
          />,
        ),
      );
      action.classList.add("glass-native");
      const positionSurface = () => {
        // Offsets, not viewport coordinates: scroll does not require per-frame work.
        host.style.left = `${action.offsetLeft}px`;
        host.style.top = `${action.offsetTop}px`;
        host.style.width = `${action.offsetWidth}px`;
        host.style.height = `${action.offsetHeight}px`;
      };
      const observer = new ResizeObserver(positionSurface);
      observer.observe(action);
      observer.observe(shell);
      positionSurface();
      count++;
    } catch {
      root?.unmount();
      restore();
    }
  }
  document.documentElement.dataset.glass = count ? "site" : "original";
}
