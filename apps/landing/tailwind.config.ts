import type { Config } from "tailwindcss";

/**
 * [DISPATCH_TAILWIND] Locked tokens for the chatbot-agency landing.
 * Source of truth for the Dispatch palette + type pair. Mirrored in
 * `app/globals.css` and documented in /DESIGN.md sections 4-6.
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
        // Wave 2 redesign 2026-05-08: deep forest canvas, off-white surfaces.
        // `cream` is retained as the *ink* role on dark canvas (former forest role).
        ink: "#0A1F1B",          // deepest canvas, primary background
        "ink-2": "#0E2622",      // section band / second surface
        "ink-3": "#143028",      // raised cards on dark canvas
        bone: "#FAFAF8",         // off-white text on ink (was cream)
        "bone-dim": "#E7E2D7",   // muted bone for body copy
        cream: "#FAFAF8",        // alias for bone, preserves legacy class names
        "cream-2": "#0E2622",    // alias for ink-2 (legacy)
        forest: "#0A1F1B",       // alias for ink (legacy)
        graphite: "#C7C2B6",     // muted body text (was dark, now light on dark)
        linen: "#8A8275",        // captions / monoglyph stripe
        carmine: "#D45D6B",      // brighter carmine for dark canvas (was #C24656)
        cedar: "#C9A267"         // warmer cedar for the kickoff stamp pulse
      },
      fontFamily: {
        // Wave 2: Inter banned. Geist as primary grotesk, Fraunces stays for editorial.
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Geist", "Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Geist Mono", "ui-monospace", "monospace"]
      },
      maxWidth: {
        prose: "1140px"
      },
      borderRadius: {
        none: "0",
        sm: "2px",
        full: "9999px"
      },
      boxShadow: {
        masthead: "0 1px 0 0 rgba(250,250,248,.06)",
        // Haptic depth for tier cards on dark canvas — colored shadow tinted to match the surface.
        haptic: "0 1px 0 0 rgba(250,250,248,.05) inset, 0 30px 60px -30px rgba(0,0,0,.45)",
        "haptic-lift": "0 1px 0 0 rgba(250,250,248,.08) inset, 0 40px 80px -30px rgba(0,0,0,.6)"
      },
      letterSpacing: {
        tightest: "-0.012em",
        ledger: "0.16em"
      },
      fontSize: {
        display: ["112px", { lineHeight: "0.96", letterSpacing: "-0.02em" }],
        masthead: ["56px", { lineHeight: "1.0", letterSpacing: "-0.012em" }]
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
