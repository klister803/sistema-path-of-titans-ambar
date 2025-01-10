/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'gold-light': 'rgb(var(--color-gold-light) / <alpha-value>)',
        'gold': 'rgb(var(--color-gold) / <alpha-value>)',
        'gold-dark': 'rgb(var(--color-gold-dark) / <alpha-value>)',
        'obsidian': 'rgb(var(--color-obsidian) / <alpha-value>)',
        'magma': 'rgb(var(--color-magma) / <alpha-value>)',
      },
      backgroundImage: {
        'cracked-texture': "url('https://images.unsplash.com/photo-1589756033371-c2e57f7f7b53')",
      },
    },
  },
  plugins: [],
};
