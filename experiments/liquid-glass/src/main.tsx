import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import { GlassLink } from "./components/ui/glass-link";
import "./styles.css";

// Upgrade only these links, after the module and its stylesheet both loaded.
export function mountGlassLinks(actions: HTMLElement) {
  if (actions.dataset.glassReady) return;
  const originals = [
    ...actions.querySelectorAll<HTMLAnchorElement>(":scope > a"),
  ];
  if (originals.length !== 2) return;
  const links = originals.map((a) => ({
    href: a.getAttribute("href")!,
    label: a.textContent!.trim(),
  }));
  const host = document.createElement("div");
  host.className = "liquid-glass-actions";
  host.hidden = true;
  actions.append(host);
  let root: Root;
  function restore() {
    delete actions.dataset.glassReady;
    host.hidden = true;
    document.documentElement.dataset.glass = "original";
  }
  root = createRoot(host, { onUncaughtError: restore });
  try {
    flushSync(() =>
      root.render(
        <>
          {links.map((link, i) => (
            <GlassLink
              key={link.href}
              tone={i === 0 ? "cream" : "ember"}
              href={link.href}
            >
              {link.label}
            </GlassLink>
          ))}
        </>,
      ),
    );
    host.hidden = false;
    actions.dataset.glassReady = "true";
    document.documentElement.dataset.glass = "liqui";
  } catch (error) {
    restore();
    root.unmount();
    host.remove();
    throw error;
  }
}
