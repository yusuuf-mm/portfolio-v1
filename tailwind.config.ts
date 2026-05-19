import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark — Smoked Glass
        void: '#08090C',
        glass: 'rgba(255,255,255,0.04)',
        'glass-border': 'rgba(255,255,255,0.07)',
        // Light — Precision Linen
        linen: '#F4F2EE',
        'linen-glass': 'rgba(255,255,255,0.75)',
        'linen-border': 'rgba(0,0,0,0.07)',
        // Shared accents
        bronze: '#B8935A',
        navy: '#1C2B3A',
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)', 'monospace'],
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        serif: ['var(--font-instrument-serif)', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
