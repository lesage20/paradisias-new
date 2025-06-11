/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette principale Paradisias - Extraite des images de la marque
        paradisias: {
          900: '#0A2E4E', // Bleu Nuit Océan
          800: '#1A5F8A', // Bleu Océan Profond
          700: '#1E6A5A', // Vert Forêt Tropicale
          600: '#3DAD8F', // Vert Lagon
          500: '#25C4D3', // Turquoise Vif
          400: '#6BB4D7', // Bleu Ciel Clair
          300: '#89E5E3', // Turquoise Pastel
          200: '#E5DCCF', // Sable Humide
          100: '#F4EFE9', // Sable Clair
          50:  '#FFFFFF', // Blanc Pur
        },
        // Renommage des anciennes palettes pour conserver la logique
        ocean: { // Anciennement paradisias
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        sun: { // Anciennement tropical
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        vegetation: { // Anciennement nature
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Couleurs sémantiques utilisant la nouvelle palette via les variables CSS
        primary: 'var(--paradisias-primary)',
        secondary: 'var(--paradisias-secondary)',
        accent: 'var(--paradisias-accent)',
        neutral: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
        // Couleurs fonctionnelles (valeurs directes pour la simplicité)
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#0ea5e9',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'serif': ['Playfair Display', 'ui-serif', 'serif'],
        'display': ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'tropical': '0 20px 25px -5px rgba(14, 165, 233, 0.1), 0 10px 10px -5px rgba(14, 165, 233, 0.04)',
        'golden': '0 20px 25px -5px rgba(245, 158, 11, 0.1), 0 10px 10px -5px rgba(245, 158, 11, 0.04)',
      },
      backgroundImage: {
        'gradient-tropical': 'linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
      }
    },
  },
  plugins: [],
} 