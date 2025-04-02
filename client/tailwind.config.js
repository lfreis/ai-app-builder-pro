/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx}", // Scan all JavaScript and JSX files in the src directory and subdirectories
  ],
  theme: {
    extend: {}, // Empty extend object for future theme customizations
  },
  plugins: [], // Empty plugins array for future plugin additions
};