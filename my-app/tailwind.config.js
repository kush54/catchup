/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          customBlue: '#2E3A87',
          customRed: '#FF6F61',
          customGreen: '#67B26F',
          customGray: '#F5F5F5',
        },
        gridTemplateRows: {
          '[auto,auto,1fr]': 'auto auto 1fr',
        },
      },
    },
    plugins: [ require('@tailwindcss/aspect-ratio'),require('@tailwindcss/forms'),],
  }