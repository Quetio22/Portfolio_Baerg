import { LiquiGlass, type LiquiGlassProps } from "@liqui-design/glass";
import type { ComponentProps } from "react";

// Optical settings from Liqui Design's registry Button, adapted to navigation:
// the interactive element stays an actual <a>, with no role=button or click hijack.
const optics = {
  radius: 12,
  blur: 1,
  refraction: 45,
  bezel: 11,
  dispersion: 0,
} satisfies Partial<LiquiGlassProps>;
type Props = ComponentProps<"a"> & { tone: "cream" | "ember" };
export function GlassLink({ tone, children, ...props }: Props) {
  return (
    <a {...props} className={`glass-action glass-action--${tone}`}>
      <LiquiGlass
        {...optics}
        refraction={tone === "cream" ? 45 : 32}
        bezel={tone === "cream" ? 11 : 9}
        frost={tone === "cream" ? 0.52 : 0.27}
        specular={tone === "cream" ? 0.9 : 0.7}
        saturation={1.03}
        className="glass-action__surface"
        contentClassName="glass-action__content lgx:flex lgx:items-center lgx:justify-between lgx:gap-3"
      >
        <span className="glass-action__label">{children}</span>
        <svg
          className="glass-action__arrow"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 19 19 5M5 5h14v14"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
      </LiquiGlass>
    </a>
  );
}
