/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 40px rgba(236,72,153,.25)',
      },
      backgroundImage: {
        'casino-gradient':
          'linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(88,28,135,1) 45%, rgba(30,41,59,1) 100%)',
      },
    },
  },
  plugins: [],
};