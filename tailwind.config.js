/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "./src/**/*.{js,jsx,ts,tsx}", "./src/styles.css"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0c0eff",
          light: "#85a8ff",
          dark: "#0609cd",
          subtle: "#d5e4ff",
        },
        secondary: {
          DEFAULT: "#f500ff",
          light: "#ff94f9",
          dark: "#ad00b1",
          subtle: "#ffe1fe",
        },
        success: {
          DEFAULT: "#07e500",
          light: "#9eff90",
          dark: "#008000",
          subtle: "#ccffc4",
        },
        warning: {
          DEFAULT: "#ffc71b",
          light: "#ffeb85",
          dark: "#e27c00",
          subtle: "#fff5c5",
        },
        danger: {
          DEFAULT: "#FF0000",
          light: "#FF9494",
          dark: "#D70000",
          subtle: "#FFDDDD",
        },
        info: {
          DEFAULT: "#00ffff",
          light: "#81fbff",
          dark: "#00b2b7",
          subtle: "#c0feff",
        },
        dark: "#14171A",
        light: "#F8F9FA",
        white: "#FFFFFF",
        black: "#000000",
      },
      screens: {
        mobile: "480px",
        tablet: "768px",
        laptop: "1024px",
        desktop: "1280px",
      },
      container: {
        center: true,
        padding: "1rem",
        maxWidth: "90%",
      },
    },
  },
  plugins: [],
};
