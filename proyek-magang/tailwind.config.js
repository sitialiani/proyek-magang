/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/views/**/*.ejs"
  ],
  theme: {
    extend: {
      colors: {
        'sidebar-bg': '#8EAAB8',
        'content-bg': '#E7EEF0',
        'sidebar-hover': '#708d9a',
        'sidebar-active': '#5c7a89',
      },
    },
  },
  plugins: [],
}