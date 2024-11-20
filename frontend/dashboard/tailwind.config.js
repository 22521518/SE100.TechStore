/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx,html,css}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx,html,css}',
    './public/index.html'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#D4CFCB',
          200: '#A69B94',
          300: '#D9CEC7'
        },
        secondary: {
          100: '#FFF5EE',
          200: '#B07F61',
          300: '#CCC2BB',
          400: '#AAA099'
        },

        neural: '#FFEEEE',
        accent: '#08050c'
      },
      white: '#f7f5ff',
      star: '#99AABB'
    }
  },
  plugins: [require('tailwind-scrollbar')]
};
