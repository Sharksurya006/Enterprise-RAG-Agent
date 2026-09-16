/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Source Serif 4'", "Georgia", "serif"],
        sans: ["'IBM Plex Sans'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        ink: {
          50: "#EEF0F3",
          100: "#D9DEE6",
          200: "#B7C0CF",
          300: "#8D99AF",
          400: "#5B6885",
          500: "#3C4661",
          600: "#2A324A",
          700: "#1F2538",
          800: "#171B29",
          900: "#10131D",
          950: "#0A0C13",
        },
        brass: {
          50: "#FBF4E6",
          100: "#F3E1B8",
          200: "#E6C583",
          300: "#D6A951",
          400: "#C08A2E",
          500: "#A5721F",
          600: "#845916",
          700: "#634211",
        },
        kb: {
          light: "#3F7D58",
          dark: "#6FBF8C",
        },
        web: {
          light: "#3B6FA0",
          dark: "#7DAEDD",
        },
      },
      boxShadow: {
        panel: "0 1px 2px 0 rgba(16, 19, 29, 0.06), 0 1px 3px 0 rgba(16, 19, 29, 0.08)",
      },
    },
  },
  plugins: [],
};
