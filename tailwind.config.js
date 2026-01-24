/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'background-light': '#ffffff',
        'background-dark': '#1a1a1a',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
