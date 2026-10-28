/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas)",
        surface: "var(--surface)",
        "surface-card": "var(--surface-card)",
        "surface-elevated": "var(--surface-elevated)",
        "surface-border": "var(--surface-border)",
        bone: "var(--surface-bone)",
        ink: {
          DEFAULT: "var(--ink)",
          secondary: "var(--ink-secondary)",
          muted: "var(--ink-muted)",
        },
        mech: {
          bg: "#0d0b0a",
          dark: "#110f0e",
          surface: "#1c1917",
          card: "#23201c",
          elevated: "#2a2621",
          border: "#3a332a",
          "border-light": "#574c40",
        },
        "amber-glow": {
          DEFAULT: "#ff6a1a",
          dark: "#ff5100",
          light: "#ffa366",
          soft: "rgba(255, 106, 26, 0.18)",
        },
        infrared: {
          DEFAULT: "var(--accent-infrared)",
          hover: "var(--accent-infrared-hover)",
          soft: "var(--accent-infrared-soft)",
        },
        volt: {
          DEFAULT: "var(--accent-volt)",
          soft: "var(--accent-volt-soft)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        teko: ["var(--font-teko)", "sans-serif"],
        barlow: ["var(--font-barlow)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        display: ["var(--font-barlow)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
