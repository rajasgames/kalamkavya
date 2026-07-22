/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-canvas)',
        surface: 'var(--bg-surface)',
        deep: 'var(--bg-deep)',
        ink: 'var(--bg-ink)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        ghost: 'var(--text-ghost)',
        terracotta: 'var(--terracotta)',
        sage: 'var(--sage)',
        'dusty-blue': 'var(--dusty-blue)',
        subtle: 'var(--cream-border)',
      },
      fontFamily: {
        sans: ['"DM Sans"', '"Inter"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', '"EB Garamond"', 'serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        hover: 'var(--shadow-hover)',
      }
    },
  },
  plugins: [],
}
