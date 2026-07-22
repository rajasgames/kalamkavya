import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-canvas)',
        surface: 'var(--bg-surface)',
        deep: 'var(--bg-deep)',
        elevated: 'var(--bg-deep)', // Alias for legacy components
        ink: 'var(--bg-ink)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        ghost: 'var(--text-ghost)',
        terracotta: 'var(--terracotta)',
        'amber-from': 'var(--terracotta)', // Alias for legacy components
        'amber-to': 'var(--terracotta)',   // Alias for legacy components
        sage: 'var(--sage)',
        'dusty-blue': 'var(--dusty-blue)',
        info: 'var(--dusty-blue)',         // semantic alias for informational states
        subtle: 'var(--cream-border)',
        'border-subtle': 'var(--border-subtle)', // direct border utility
        destructive: 'var(--destructive)',
      },
      fontFamily: {
        sans: ['"Inter"', '"Geist"', 'sans-serif'],
        serif: ['"Lora"', '"Merriweather"', 'serif'],
        display: ['"Playfair Display"', 'serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        hover: 'var(--shadow-hover)',
        'focus-ring': 'var(--focus-ring)', // keyboard-only focus indicator
      }
    },
  },
  plugins: [heroui()],
}

