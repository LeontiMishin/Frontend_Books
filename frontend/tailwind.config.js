/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1F2937',
        parchment: '#FFF8EE',
        ember: '#C96A3C',
        moss: '#2E5E4E',
        gold: '#E8B95B',
      },
      boxShadow: {
        card: '0 20px 50px rgba(84, 54, 28, 0.12)',
      },
    },
  },
  plugins: [],
};
