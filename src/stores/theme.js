import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // État du thème actuel
  const currentTheme = ref('violet')
  
  // Définition des thèmes disponibles
  const themes = {
    violet: {
      name: 'Violet',
      colors: {
        primary: 'purple-600',
        primaryHover: 'purple-700',
        primaryLight: 'purple-50',
        secondary: 'pink-600',
        secondaryHover: 'pink-700',
        accent: 'purple-600',
        accentHover: 'purple-700'
      },
      textColors: {
        primaryBtn: 'white',
        secondaryBtn: 'white'
      }
    },
    vert: {
      name: 'Vert Paradisias',
      colors: {
        primary: 'theme-green-paradisias',
        primaryHover: 'theme-green-paradisias-hover',
        primaryLight: 'theme-green-paradisias-light',
        secondary: 'theme-salmon-paradisias',
        secondaryHover: 'theme-salmon-paradisias-hover',
        accent: 'theme-green-paradisias',
        accentHover: 'theme-green-paradisias-hover'
      },
      textColors: {
        primaryBtn: 'white',
        secondaryBtn: 'white'
      }
    },
    saumon: {
      name: 'Saumon Paradisias',
      colors: {
        primary: 'theme-salmon-primary',
        primaryHover: 'theme-salmon-primary-hover',
        primaryLight: 'theme-salmon-primary-light',
        secondary: 'theme-green-secondary',
        secondaryHover: 'theme-green-secondary-hover',
        accent: 'theme-salmon-primary',
        accentHover: 'theme-salmon-primary-hover'
      },
      textColors: {
        primaryBtn: 'white',
        secondaryBtn: 'white'
      }
    },
    bleu: {
      name: 'Bleu',
      colors: {
        primary: 'blue-600',
        primaryHover: 'blue-700',
        primaryLight: 'blue-50',
        secondary: 'cyan-600',
        secondaryHover: 'cyan-700',
        accent: 'blue-600',
        accentHover: 'blue-700'
      },
      textColors: {
        primaryBtn: 'white',
        secondaryBtn: 'white'
      }
    },
    indigo: {
      name: 'Indigo',
      colors: {
        primary: 'indigo-600',
        primaryHover: 'indigo-700',
        primaryLight: 'indigo-50',
        secondary: 'purple-600',
        secondaryHover: 'purple-700',
        accent: 'indigo-600',
        accentHover: 'indigo-700'
      },
      textColors: {
        primaryBtn: 'white',
        secondaryBtn: 'white'
      }
    },
    emeraude: {
      name: 'Émeraude',
      colors: {
        primary: 'emerald-600',
        primaryHover: 'emerald-700',
        primaryLight: 'emerald-50',
        secondary: 'teal-600',
        secondaryHover: 'teal-700',
        accent: 'emerald-600',
        accentHover: 'emerald-700'
      },
      textColors: {
        primaryBtn: 'white',
        secondaryBtn: 'white'
      }
    },
    rouge: {
      name: 'Rouge',
      colors: {
        primary: 'red-600',
        primaryHover: 'red-700',
        primaryLight: 'red-50',
        secondary: 'pink-600',
        secondaryHover: 'pink-700',
        accent: 'red-600',
        accentHover: 'red-700'
      },
      textColors: {
        primaryBtn: 'white',
        secondaryBtn: 'white'
      }
    },
    orange: {
      name: 'Orange',
      colors: {
        primary: 'orange-600',
        primaryHover: 'orange-700',
        primaryLight: 'orange-50',
        secondary: 'amber-600',
        secondaryHover: 'amber-700',
        accent: 'orange-600',
        accentHover: 'orange-700'
      },
      textColors: {
        primaryBtn: 'white',
        secondaryBtn: 'white'
      }
    },
    rose: {
      name: 'Rose',
      colors: {
        primary: 'pink-600',
        primaryHover: 'pink-700',
        primaryLight: 'pink-50',
        secondary: 'rose-600',
        secondaryHover: 'rose-700',
        accent: 'pink-600',
        accentHover: 'pink-700'
      },
      textColors: {
        primaryBtn: 'white',
        secondaryBtn: 'white'
      }
    },
    ardoise: {
      name: 'Ardoise',
      colors: {
        primary: 'slate-600',
        primaryHover: 'slate-700',
        primaryLight: 'slate-50',
        secondary: 'gray-600',
        secondaryHover: 'gray-700',
        accent: 'slate-600',
        accentHover: 'slate-700'
      },
      textColors: {
        primaryBtn: 'white',
        secondaryBtn: 'white'
      }
    }
  }

  // Computed pour obtenir le thème actuel
  const theme = computed(() => themes[currentTheme.value])
  
  // Computed pour obtenir les classes CSS du thème actuel
  const themeClasses = computed(() => {
    const t = theme.value
    return {
      // Boutons primaires
      btnPrimary: `bg-${t.colors.primary} hover:bg-${t.colors.primaryHover} text-${t.textColors.primaryBtn}`,
      btnSecondary: `bg-${t.colors.secondary} hover:bg-${t.colors.secondaryHover} text-${t.textColors.secondaryBtn}`,
      
      // Textes et accents
      textPrimary: `text-${t.colors.primary}`,
      textSecondary: `text-${t.colors.secondary}`,
      
      // Backgrounds
      bgPrimary: `bg-${t.colors.primary}`,
      bgSecondary: `bg-${t.colors.secondary}`,
      bgPrimaryLight: `bg-${t.colors.primaryLight}`,
      
      // Hover states
      hoverPrimary: `hover:text-${t.colors.primary}`,
      hoverSecondary: `hover:text-${t.colors.secondary}`,
      
      // Bordures
      borderPrimary: `border-${t.colors.primary}`,
      borderSecondary: `border-${t.colors.secondary}`,
      
      // États actifs
      activePrimary: `bg-${t.colors.primary} text-${t.textColors.primaryBtn}`,
      activeSecondary: `bg-${t.colors.secondary} text-${t.textColors.secondaryBtn}`,
      
      // Focus pour les checkboxes et inputs
      checkboxFocus: `text-${t.colors.primary} focus:ring-${t.colors.primary}`,
      inputFocus: `focus:ring-${t.colors.primary} focus:border-${t.colors.primary}`
    }
  })

  // Actions
  const setTheme = (themeName) => {
    if (themes[themeName]) {
      currentTheme.value = themeName
      localStorage.setItem('theme', themeName)
    }
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && themes[savedTheme]) {
      currentTheme.value = savedTheme
    }
  }

  const getThemesList = () => {
    return Object.keys(themes).map(key => ({
      key,
      ...themes[key]
    }))
  }

  return {
    currentTheme,
    theme,
    themeClasses,
    themes,
    setTheme,
    initTheme,
    getThemesList
  }
}) 