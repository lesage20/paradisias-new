/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    // Classes de thèmes pour s'assurer qu'elles sont incluses dans le build
    'bg-theme-green-paradisias',
    'bg-theme-green-paradisias-hover',
    'bg-theme-green-paradisias-light',
    'bg-theme-salmon-paradisias',
    'bg-theme-salmon-paradisias-hover',
    'bg-theme-salmon-primary',
    'bg-theme-salmon-primary-hover',
    'bg-theme-salmon-primary-light',
    'bg-theme-green-secondary',
    'bg-theme-green-secondary-hover',
    'text-theme-green-paradisias',
    'text-theme-green-paradisias-hover',
    'text-theme-salmon-paradisias',
    'text-theme-salmon-paradisias-hover',
    'text-theme-salmon-primary',
    'text-theme-salmon-primary-hover',
    'text-theme-green-secondary',
    'text-theme-green-secondary-hover',
    'hover:bg-theme-green-paradisias',
    'hover:bg-theme-green-paradisias-hover',
    'hover:bg-theme-salmon-paradisias',
    'hover:bg-theme-salmon-paradisias-hover',
    'hover:bg-theme-salmon-primary',
    'hover:bg-theme-salmon-primary-hover',
    'hover:bg-theme-green-secondary',
    'hover:bg-theme-green-secondary-hover',
    'hover:text-theme-green-paradisias',
    'hover:text-theme-salmon-paradisias',
    'hover:text-theme-salmon-primary',
    'hover:text-theme-green-secondary',
    // Classes de texte pour les boutons
    'text-white',
    'text-black',
    'text-gray-900',
    'text-gray-800',
    // Classes d'aperçu des couleurs pour les indicateurs
    'bg-[#09402C]',
    'bg-[#c88a85]',
    // Classes standards pour les autres thèmes
    {
      pattern: /bg-(purple|pink|blue|cyan|indigo|emerald|teal|red|orange|amber|rose|slate|gray)-(50|600|700)/,
    },
    {
      pattern: /text-(purple|pink|blue|cyan|indigo|emerald|teal|red|orange|amber|rose|slate|gray)-(600|700)/,
    },
    {
      pattern: /hover:bg-(purple|pink|blue|cyan|indigo|emerald|teal|red|orange|amber|rose|slate|gray)-(600|700)/,
    },
    {
      pattern: /hover:text-(purple|pink|blue|cyan|indigo|emerald|teal|red|orange|amber|rose|slate|gray)-(600|700)/,
    }
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
        
        // Couleurs spécifiques Paradisias pour les thèmes
        'paradisias-green': '#09402C', // Vert foncé Paradisias
        'paradisias-salmon': '#D99791', // Rose saumon Paradisias
        
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
        
        // Couleurs des thèmes personnalisés
        theme: {
          // Violet (thème par défaut)
          'violet-primary': '#9333ea',
          'violet-primary-hover': '#7c3aed',
          'violet-primary-light': '#faf5ff',
          'violet-secondary': '#db2777',
          'violet-secondary-hover': '#be185d',
          
          // Vert Paradisias
          'green-paradisias': '#09402C',
          'green-paradisias-hover': '#0a4d35',
          'green-paradisias-light': 'rgba(9, 64, 44, 0.1)',
          'salmon-paradisias': '#c88a85',
          'salmon-paradisias-hover': '#b87a74',
          
          // Saumon Paradisias (inversé) - couleurs plus foncées pour meilleur contraste
          'salmon-primary': '#c88a85',
          'salmon-primary-hover': '#b87a74',
          'salmon-primary-light': 'rgba(200, 138, 133, 0.1)',
          'green-secondary': '#09402C',
          'green-secondary-hover': '#0a4d35',
          
          // Bleu
          'blue-primary': '#2563eb',
          'blue-primary-hover': '#1d4ed8',
          'blue-primary-light': '#eff6ff',
          'cyan-secondary': '#0891b2',
          'cyan-secondary-hover': '#0e7490',
          
          // Indigo
          'indigo-primary': '#4f46e5',
          'indigo-primary-hover': '#4338ca',
          'indigo-primary-light': '#eef2ff',
          'purple-secondary': '#9333ea',
          'purple-secondary-hover': '#7c3aed',
          
          // Émeraude
          'emerald-primary': '#059669',
          'emerald-primary-hover': '#047857',
          'emerald-primary-light': '#ecfdf5',
          'teal-secondary': '#0d9488',
          'teal-secondary-hover': '#0f766e',
          
          // Rouge
          'red-primary': '#dc2626',
          'red-primary-hover': '#b91c1c',
          'red-primary-light': '#fef2f2',
          'pink-secondary': '#db2777',
          'pink-secondary-hover': '#be185d',
          
          // Orange
          'orange-primary': '#ea580c',
          'orange-primary-hover': '#c2410c',
          'orange-primary-light': '#fff7ed',
          'amber-secondary': '#d97706',
          'amber-secondary-hover': '#b45309',
          
          // Rose
          'pink-primary': '#db2777',
          'pink-primary-hover': '#be185d',
          'pink-primary-light': '#fdf2f8',
          'rose-secondary': '#e11d48',
          'rose-secondary-hover': '#be123c',
          
          // Ardoise
          'slate-primary': '#475569',
          'slate-primary-hover': '#334155',
          'slate-primary-light': '#f8fafc',
          'gray-secondary': '#6b7280',
          'gray-secondary-hover': '#4b5563',
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