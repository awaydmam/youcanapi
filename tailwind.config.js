/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pulse: {
          primary: '#7c3aed',
          'primary-deep': '#5b21b6',
          secondary: '#6b7280',
          bg: '#eff6ff',
          'bg-canvas': '#f5f5f5',
          surface: '#ffffff',
          'surface-dark': '#f3f4f6',
          ink: '#111827',
          body: '#374151',
          mute: '#607080',
          hairline: '#e5e7eb',
          success: '#22c55e',
          warning: '#f59e0b',
          info: '#3b82f6',
          danger: '#ef4444',
          link: '#7c3aed',
        },
        dark: {
          primary: '#a78bfa',
          bg: '#0f172a',
          'bg-canvas': '#020617',
          surface: '#1e293b',
          ink: '#f8fafc',
          body: '#e5e7eb',
          mute: '#94a3b8',
          hairline: '#334155',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
      },
    },
  },
  plugins: [],
}
