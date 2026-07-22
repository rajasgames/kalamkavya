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
        ink: 'var(--bg-ink)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        ghost: 'var(--text-ghost)',
        terracotta: 'var(--terracotta)',
        sage: 'var(--sage)',
        'dusty-blue': 'var(--dusty-blue)',
        info: 'var(--dusty-blue)',         // semantic alias for informational states
        subtle: 'var(--cream-border)',
        'border-subtle': 'var(--border-subtle)', // direct border utility
      },
      fontFamily: {
        sans: ['"DM Sans"', '"Inter"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', '"EB Garamond"', 'serif'],
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
        "inkwell-dark": {
          "primary": "#D4956E",      // terracotta
          "secondary": "#8FA07A",    // sage
          "accent": "#8A9BB0",       // dusty-blue
          "neutral": "#2D2922",       // deep
          "base-100": "#181612",     // canvas
          "base-200": "#221E19",     // surface
          "base-300": "#2D2922",     // deep surface
          "base-content": "#F0EBDF", // text-primary
          "info": "#8A9BB0",
          "success": "#8FA07A",
          "warning": "#E6B800",
          "error": "#D9534F",
        },
        "warm-parchment": {
          "primary": "#C47A5A",
          "secondary": "#7A8B6E",
          "accent": "#6B7A8F",
          "neutral": "#EDE8DA",
          "base-100": "#FBF8F1",
          "base-200": "#F5F0E6",
          "base-300": "#EDE8DA",
          "base-content": "#2D2A26",
          "info": "#6B7A8F",
          "success": "#7A8B6E",
          "warning": "#D97706",
          "error": "#C92A2A",
        },
      },
      "dark",
      "light",
    ],
    darkTheme: "inkwell-dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: false,
  },
}


