import type { Config } from "tailwindcss";

/**
 * [DISPATCH_TAILWIND] Round-2 redesign 2026-05-08 — OpenAI reference applied.
 *
 * Canvas pivots from dark forest to OpenAI's pure white. Neutral palette is
 * achromatic (1% colorfulness) per the OpenAI design reference at
 * /Users/keer/projects/prin7r/design-references/openai.md. The Dispatch
 * brand essence (editorial dispatch, schedule-as-promise) is preserved
 * through Fraunces editorial display + a single carmine accent reserved
 * for the few decisive moments. Inter is BANNED — Geist carries body/UI.
 *
 * Mirrored in `app/globals.css` and documented in /DESIGN.md sections 4-6.
 */

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", md: "2.5rem" }
    },
    extend: {
      colors: {
        // Round 2 redesign 2026-05-08 — OpenAI achromatic palette.
        canvas: "#FFFFFF",        // page background — pure white
        milk: "#FAFAF8",          // section bands — milky white only when needed
        chalk: "#F1F1F1",         // hover surface, soft chip background
        fog: "#E5E7EB",           // every border / divider on the page
        ash: "#8F8F8F",           // tertiary labels, disabled
        graphite: "#666666",      // secondary body text
        void: "#000000",          // primary text + filled CTA background

        // Brand essence retained — used sparingly, never on backgrounds.
        forest: "#0F2A26",        // discrete accent: footer rule, inline emphasis
        carmine: "#C24656",       // decisive moments only (refund clause, kickoff)

        // Legacy aliases — keep cream/bone classnames resolving to the new tokens.
        cream: "#FFFFFF",
        bone: "#FFFFFF",
        "bone-dim": "#666666",
        ink: "#000000",
        "ink-2": "#FAFAF8",
        "ink-3": "#F1F1F1",
        linen: "#8F8F8F",
        cedar: "#A07A2C"
      },
      fontFamily: {
        // Round 2: editorial display kept; sans rotates to Geist (premium grotesk).
        // OpenAI's "OpenAI Sans" substitute list lists Inter — but the brief
        // BANS Inter, so we use Geist + Plus Jakarta Sans + system stack.
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Geist", "Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Geist Mono", "ui-monospace", "monospace"]
      },
      maxWidth: {
        prose: "1200px"
      },
      borderRadius: {
        none: "0",
        // OpenAI's two-radii system — pills + the precise 6.08px card radius.
        card: "6.08px",
        sm: "4px",
        soft: "40px",
        full: "9999px"
      },
      boxShadow: {
        // OpenAI's only shadow — barely-there print-artifact elevation.
        sm: "rgba(0, 0, 0, 0.02) 0px 4px 6px 0px, rgba(0, 0, 0, 0.05) 0px 0px 2px 0px"
      },
      letterSpacing: {
        tightest: "-0.03em",
        tight: "-0.012em",
        ledger: "0.143px",
        caps: "0.011em"
      },
      fontSize: {
        // OpenAI scale: 13 / 14 / 16 / 17 / 18 / 22 / 28 / 48 — extended up
        // for Dispatch's editorial hero so headlines still feel carved.
        caption: ["13px", { lineHeight: "1.64" }],
        heading: ["22px", { lineHeight: "1.26" }],
        "heading-lg": ["28px", { lineHeight: "1.21" }],
        display: ["48px", { lineHeight: "1.16", letterSpacing: "-1.44px" }],
        "display-lg": ["72px", { lineHeight: "1.05", letterSpacing: "-2.16px" }],
        "display-xl": ["96px", { lineHeight: "1.02", letterSpacing: "-2.88px" }]
      },
      keyframes: {
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".35" }
        }
      },
      animation: {
        pulse: "pulse 1.6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
