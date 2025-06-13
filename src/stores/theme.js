import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // État du thème actuel
  const currentTheme = ref('default')
  
  // Définition des thèmes disponibles
  const themes = {
    default: {
      name: 'Thème par défaut',
      colors: {
        primary: 'purple-600',
        primaryHover: 'purple-700',
        primaryLight: 'purple-50',
        secondary: 'pink-600',
        secondaryHover: 'pink-700',
        accent: 'purple-600',
        accentHover: 'purple-700'
      }
    },
    paradisias: {
      name: 'Paradisias',
      colors: {
        primary: '[#09402C]',
        primaryHover: '[#0a4d35]',
        primaryLight: '[#09402C]/10',
        secondary: '[#D99791]',
        secondaryHover: '[#c88a85]',
        accent: '[#09402C]',
        accentHover: '[#0a4d35]'
      }
    },
    ocean: {
      name: 'Océan',
      colors: {
        primary: 'blue-600',
        primaryHover: 'blue-700',
        primaryLight: 'blue-50',
        secondary: 'cyan-600',
        secondaryHover: 'cyan-700',
        accent: 'blue-600',
        accentHover: 'blue-700'
      }
    },
    forest: {
      name: 'Forêt',
      colors: {
        primary: 'green-600',
        primaryHover: 'green-700',
        primaryLight: 'green-50',
        secondary: 'emerald-600',
        secondaryHover: 'emerald-700',
        accent: 'green-600',
        accentHover: 'green-700'
      }
    },
    sunset: {
      name: 'Coucher de soleil',
      colors: {
        primary: 'orange-600',
        primaryHover: 'orange-700',
        primaryLight: 'orange-50',
        secondary: 'red-600',
        secondaryHover: 'red-700',
        accent: 'orange-600',
        accentHover: 'orange-700'
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
      btnPrimary: `bg-${t.colors.primary} hover:bg-${t.colors.primaryHover} text-white`,
      btnSecondary: `bg-${t.colors.secondary} hover:bg-${t.colors.secondaryHover} text-white`,
      
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
      activePrimary: `bg-${t.colors.primary} text-white`,
      activeSecondary: `bg-${t.colors.secondary} text-white`
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