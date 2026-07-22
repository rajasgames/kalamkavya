import { heroui } from "@heroui/react";
import daisyui from "daisyui";

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
      },
      fontFamily: {
        sans: ['"Inter"', '"Outfit"', 'sans-serif'],
        serif: ['"Merriweather"', '"Lora"', 'serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        hover: 'var(--shadow-hover)',
        'focus-ring': 'var(--focus-ring)', // keyboard-only focus indicator
      }
    },
  },
  plugins: [heroui(), daisyui],
  daisyui: {
    themes: [
      {
        "midnight-velvet": {
          "primary": "#D97706",
          "secondary": "#8B5CF6",
          "accent": "#F59E0B",
          "neutral": "#262B38",
          "base-100": "#0F1117",
          "base-200": "#1E222D",
          "base-300": "#262B38",
          "base-content": "#F0EBDF",
          "info": "#6366F1",
          "success": "#10B981",
          "warning": "#F59E0B",
          "error": "#EF4444",
        },
        "warm-parchment": {
          "primary": "#D97706",
          "secondary": "#8B5CF6",
          "accent": "#F59E0B",
          "neutral": "#E5E0D8",
          "base-100": "#FBF9F4",
          "base-200": "#FFFFFF",
          "base-300": "#E5E0D8",
          "base-content": "#2D2A26",
          "info": "#6366F1",
          "success": "#10B981",
          "warning": "#F59E0B",
          "error": "#EF4444",
        },
      },
      "dark",
      "light",
    ],
    darkTheme: "midnight-velvet",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: false,
  },
}


