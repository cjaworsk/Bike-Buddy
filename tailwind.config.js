/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",      // pages router files
    "./src/app/**/*.{js,ts,jsx,tsx}",        // app router files
    "./src/components/**/*.{js,ts,jsx,tsx}", // components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

