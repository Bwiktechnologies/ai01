/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Critical: dark mode by class as per specification
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        gold: 'var(--color-gold)',
        bg: 'var(--color-bg)',
        card: 'var(--color-card)',
        border: 'var(--color-border)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-hint': 'var(--color-text-hint)',
        success: 'var(--color-success)',
        error: 'var(--color-error)',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0px 2px 16px rgba(0,0,0,0.05)',
        'card-hover': '0px 8px 32px rgba(0,0,0,0.10)',
        'orange': '0px 4px 14px rgba(255,107,53,0.35)',
        'orange-hover': '0px 6px 20px rgba(255,107,53,0.45)',
        'modal': '0px 20px 60px rgba(0,0,0,0.18)',
        'sidebar': '2px 0px 16px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
