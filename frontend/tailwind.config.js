/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
          light: '#dbeafe',
        },
        secondary: {
          DEFAULT: '#0d9488',
          light: '#ccfbf1',
        },
        surface: {
          DEFAULT: '#ffffff',
          hover: '#f8fafc',
          subtle: '#f1f4f0',
        },
        dark: {
          main: '#0f172a',
          secondary: '#475569',
          muted: '#64748b',
        }
      }
    },
  },
  plugins: [],
}
