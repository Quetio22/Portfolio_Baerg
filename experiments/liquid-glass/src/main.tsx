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
    // A single contrast rule: orange on light sections, cream on warm/dark sections.
    // Read the surrounding text color, not the old button background.
    const surrounding = getComputedStyle(action.parentElement!);
    const channels = surrounding.color
      .match(/[\d.]+/g)
      ?.slice(0, 3)
      .map(Number) ?? [255, 255, 255];
    const lightSection =
      channels.reduce((sum, value) => sum + value, 0) / 3 < 145;
    const tone = lightSection ? "orange" : "cream";
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
    shell.style.setProperty(
      "--glass-ink",
      tone === "orange" ? "#fff8eb" : "#48200f",
    );
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
            radius={kind === "action" ? 28 : 12}
            blur={0.8}
            bezel={kind === "action" ? 9 : 7}
            refraction={kind === "action" ? 38 : 24}
            dispersion={0}
            frost={tone === "orange" ? 0.18 : tone === "cream" ? 0.7 : 0.45}
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
