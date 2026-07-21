/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand & Accent — Miro-inspired
        'brand-yellow': '#FFD02F',
        'brand-yellow-deep': '#E5B800',
        'yellow-light': '#FFF8E1',
        'yellow-dark': '#5C4B00',
        'brand-blue': '#2B6BF3',
        'blue-pressed': '#1A4FCC',
        'brand-coral': '#F27E63',
        'coral-light': '#FFF0ED',
        'coral-dark': '#7A1F0A',
        'brand-rose': '#F5B5C8',
        'brand-teal': '#0CA789',
        'teal-light': '#E8F8F4',
        'moss-dark': '#0B5E4A',
        'brand-pink': '#FDE8F0',
        'brand-orange-light': '#FFF3E6',
        // Core UI
        'surface': '#FFFFFF',
        'surface-alt': '#F7F8FA',
        'ink': '#050038',
        'body': '#37352F',
        'mute': '#6B6F76',
        'hairline': '#E6E6E6',
        'footer-bg': '#050038',
        // Semantic
        'success': '#0CA789',
        'danger': '#E5484D',
        'warning': '#F5A623',
        'info': '#2B6BF3',
      },
      borderRadius: {
        'pill': '9999px',
      },
    },
  },
  plugins: [],
}
