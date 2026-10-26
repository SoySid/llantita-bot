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
        display: ["var(--font-display)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-display)", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
