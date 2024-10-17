/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#D4CFCB',
          200: '#A69B94'
        },
        secondary: {
          100: '#FFF5EE',
          200: '#996E50'
        },
        neural: '#FFF5EE',
        accent: '#08050c'
      },
      white: '#f7f5ff'
    }
  },
  plugins: [require('tailwind-scrollbar')]
};
