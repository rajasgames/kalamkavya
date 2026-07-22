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
        base: 'var(--bg-base)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        glass: 'var(--bg-glass)',
        subtle: 'var(--border-subtle)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        ghost: 'var(--text-ghost)',
        amber: {
          from: 'var(--amber-from)',
          to: 'var(--amber-to)',
          glow: 'var(--amber-glow)',
        },
        sage: 'var(--sage)',
        clay: 'var(--clay)',
      },
      backgroundImage: {
        'amber-grad': 'var(--amber-grad)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Crimson Pro"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        hand: ['Caveat', 'cursive'],
      },
    },
  },
  plugins: [],
}
