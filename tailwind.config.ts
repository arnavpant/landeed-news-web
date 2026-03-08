/**
 * Tailwind CSS v4 Configuration Reference
 *
 * In Tailwind v4, theme configuration is done via @theme in globals.css.
 * This file documents the design tokens for reference.
 *
 * Active theme values are defined in src/app/globals.css using @theme inline.
 */

const config = {
  darkMode: "class" as const,
  theme: {
    extend: {
      colors: {
        primary: "#8551e6",
        "background-light": "#f7f6f8",
        "background-dark": "#171121",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
      },
    },
  },
};

export default config;
