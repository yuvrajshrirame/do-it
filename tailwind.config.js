/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        cardForeground: 'var(--card-foreground)',
        border: 'var(--border)',
        primary: 'var(--primary)',
        primaryForeground: 'var(--primary-foreground)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 255, 255, 0.1), inset 0 0 5px rgba(255, 255, 255, 0.05)' },
          '100%': { boxShadow: '0 0 15px rgba(255, 255, 255, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.1)' },
        }
      }
    },
  },
  plugins: [],
}