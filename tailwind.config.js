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
        bcprimary: "#EFEFEF",
        bcsecondary: "#F6F6F6",
        bcaccent: "#FFFFFF",

        qrprimary: "#403631",
        qraccent: "#9F887B",

        dpprimary: "#7077A1",
        dpaccent: "#2D3250",

        error: "#CF5858",
        warn: "#CFB558",
      },
    },
  },
  plugins: [],
};
