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
        cream: "#F4EDE0",
        "cream-2": "#EAE0CD",
        forest: "#0F2A26",
        graphite: "#1F2422",
        linen: "#857C71",
        carmine: "#C24656",
        cedar: "#A07A2C"
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"]
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
        masthead: "0 1px 0 0 rgba(15,42,38,.06)"
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
