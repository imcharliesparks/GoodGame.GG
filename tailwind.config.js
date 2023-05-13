/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    fontFamily: {
      nunito: ['"Nunito", sans-serif'],
    },
    extend: {
      zIndex: {
        1: "1",
        2: "2",
        3: "3",
        999: "999",
      },
      colors: {
        // SETUP TODO: Add colors for app here
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    // SETUP TODO: Set true if you want dark mode support
    themes: false,
  },
};
