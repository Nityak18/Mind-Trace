/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0d1117",
        surface: "#161b27",
        "surface-elevated": "#1e2536",
        primary: "#7c6af7",
        secondary: "#4ecdc4",
        tertiary: "#f7b731",
        success: "#2ecc71",
        warning: "#f39c12",
        danger: "#e74c3c",
        "text-primary": "#edf2f7",
        "text-secondary": "#94a3b8",
        "text-muted": "#4a5568",
        border: "rgba(255, 255, 255, 0.06)",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.3)',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      },
      animation: {
        blob: 'blob 12s infinite',
      }
    },
  },
  plugins: [],
}
