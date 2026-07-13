/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        idbi: {
          green: 'var(--idbi-green)',
          darkGreen: 'var(--idbi-dark-green)',
          lightGreen: 'var(--idbi-light-green)',
          accentGreen: 'var(--idbi-green)',
          orange: 'var(--idbi-orange)',
          darkOrange: 'var(--idbi-dark-orange)',
          lightOrange: 'var(--idbi-light-green)',
          bg: 'var(--idbi-bg)',
          card: 'var(--idbi-card)',
          sidebar: 'var(--idbi-sidebar)',
          navbar: 'var(--idbi-navbar)',
          text: 'var(--idbi-text)',
          textSec: 'var(--idbi-text-sec)',
          muted: 'var(--idbi-muted)',
          border: 'var(--idbi-border)'
        },
        slate: {
          50: 'var(--idbi-text)',
          100: 'var(--idbi-text)',
          200: 'var(--idbi-text-sec)',
          300: 'var(--idbi-text-sec)',
          400: 'var(--idbi-muted)',
          500: 'var(--idbi-muted)',
          600: 'var(--idbi-text-sec)',
          700: 'var(--idbi-border)',
          800: 'var(--idbi-border)', // Map nested borders/containers
          900: 'var(--idbi-card)', // Card bg
          950: 'var(--idbi-bg)', // Body bg
        },
        gray: {
          50: 'var(--idbi-text)',
          100: 'var(--idbi-text)',
          200: 'var(--idbi-text-sec)',
          300: 'var(--idbi-text-sec)',
          400: 'var(--idbi-muted)',
          500: 'var(--idbi-muted)',
          600: 'var(--idbi-text-sec)',
          700: 'var(--idbi-border)',
          800: 'var(--idbi-border)',
          900: 'var(--idbi-card)',
          950: 'var(--idbi-bg)',
        },
        zinc: {
          50: 'var(--idbi-text)',
          100: 'var(--idbi-text)',
          200: 'var(--idbi-text-sec)',
          300: 'var(--idbi-text-sec)',
          400: 'var(--idbi-muted)',
          500: 'var(--idbi-muted)',
          600: 'var(--idbi-text-sec)',
          700: 'var(--idbi-border)',
          800: 'var(--idbi-border)',
          900: 'var(--idbi-card)',
          950: 'var(--idbi-bg)',
        },
        neutral: {
          50: 'var(--idbi-text)',
          100: 'var(--idbi-text)',
          200: 'var(--idbi-text-sec)',
          300: 'var(--idbi-text-sec)',
          400: 'var(--idbi-muted)',
          500: 'var(--idbi-muted)',
          600: 'var(--idbi-text-sec)',
          700: 'var(--idbi-border)',
          800: 'var(--idbi-border)',
          900: 'var(--idbi-card)',
          950: 'var(--idbi-bg)',
        },
        teal: {
          50: 'var(--idbi-light-green)',
          100: 'var(--idbi-light-green)',
          200: 'var(--idbi-light-green)',
          300: 'var(--idbi-light-green)',
          400: 'var(--idbi-green)', // Accent Green -> Primary Green
          500: 'var(--idbi-green)', // Primary Green
          600: 'var(--idbi-dark-green)', // Dark Green
          700: 'var(--idbi-dark-green)',
          800: 'var(--idbi-dark-green)',
          900: 'var(--idbi-dark-green)',
          950: 'var(--idbi-dark-green)',
        },
        emerald: {
          50: 'var(--idbi-light-green)',
          100: 'var(--idbi-light-green)',
          200: 'var(--idbi-light-green)',
          300: 'var(--idbi-light-green)',
          400: 'var(--idbi-green)',
          500: 'var(--idbi-success)', // Success Green
          600: 'var(--idbi-dark-green)',
          700: 'var(--idbi-green)',
          800: 'var(--idbi-dark-green)',
          900: 'var(--idbi-dark-green)',
        },
        green: {
          50: 'var(--idbi-light-green)',
          100: 'var(--idbi-light-green)',
          200: 'var(--idbi-light-green)',
          300: 'var(--idbi-light-green)',
          400: 'var(--idbi-green)',
          500: 'var(--idbi-green)',
          600: 'var(--idbi-dark-green)',
          700: 'var(--idbi-dark-green)',
          800: 'var(--idbi-dark-green)',
          900: 'var(--idbi-dark-green)',
        },
        amber: {
          50: 'var(--idbi-light-green)', // Keep bg tint green
          100: 'var(--idbi-light-green)',
          200: 'var(--idbi-light-green)',
          300: 'var(--idbi-orange)', // Light Orange -> Accent Orange
          400: 'var(--idbi-orange)',
          500: 'var(--idbi-orange)', // Primary Orange
          600: 'var(--idbi-dark-orange)', // Dark Orange
          700: 'var(--idbi-dark-orange)',
          800: 'var(--idbi-dark-orange)',
          900: 'var(--idbi-dark-orange)',
        },
        orange: {
          50: 'var(--idbi-light-green)',
          100: 'var(--idbi-light-green)',
          200: 'var(--idbi-light-green)',
          300: 'var(--idbi-orange)',
          400: 'var(--idbi-orange)',
          500: 'var(--idbi-orange)',
          600: 'var(--idbi-dark-orange)',
          700: 'var(--idbi-dark-orange)',
          800: 'var(--idbi-dark-orange)',
          900: 'var(--idbi-dark-orange)',
        },
        indigo: {
          50: 'var(--idbi-light-green)',
          100: 'var(--idbi-light-green)',
          200: 'var(--idbi-light-green)',
          300: 'var(--idbi-light-green)',
          400: 'var(--idbi-green)',
          500: 'var(--idbi-green)', // Map Indigo to IDBI Green
          600: 'var(--idbi-dark-green)',
          700: 'var(--idbi-dark-green)',
          800: 'var(--idbi-dark-green)',
          900: 'var(--idbi-dark-green)',
        },
        rose: {
          50: 'var(--idbi-light-green)',
          100: 'var(--idbi-light-green)',
          200: 'var(--idbi-light-green)',
          300: 'var(--idbi-error)',
          400: 'var(--idbi-error)',
          500: 'var(--idbi-error)', // Error Red
          600: 'var(--idbi-error)',
          700: 'var(--idbi-error)',
          800: 'var(--idbi-error)',
          900: 'var(--idbi-error)',
        },
        red: {
          50: 'var(--idbi-light-green)',
          100: 'var(--idbi-light-green)',
          200: 'var(--idbi-light-green)',
          300: 'var(--idbi-error)',
          400: 'var(--idbi-error)',
          500: 'var(--idbi-error)',
          600: 'var(--idbi-error)',
          700: 'var(--idbi-error)',
          800: 'var(--idbi-error)',
          900: 'var(--idbi-error)',
        },
        blue: {
          50: 'var(--idbi-light-green)',
          100: 'var(--idbi-light-green)',
          200: 'var(--idbi-light-green)',
          300: 'var(--idbi-info)',
          400: 'var(--idbi-info)',
          500: 'var(--idbi-info)', // Info Blue
          600: 'var(--idbi-info)',
          700: 'var(--idbi-info)',
          800: 'var(--idbi-info)',
          900: 'var(--idbi-info)',
        }
      }
    },
  },
  plugins: [],
}
