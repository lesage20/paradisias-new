<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="$emit('click', $event)"
    v-bind="$attrs"
  >
    <!-- Spinner de chargement -->
    <svg 
      v-if="loading" 
      class="animate-spin -ml-1 mr-2 h-4 w-4" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>

    <!-- Icône à gauche -->
    <component 
      v-if="iconLeft && !loading" 
      :is="iconLeft" 
      :class="iconClasses" 
    />

    <!-- Contenu du bouton -->
    <span v-if="loading && loadingText">{{ loadingText }}</span>
    <span v-else-if="$slots.default"><slot></slot></span>
    <span v-else>{{ text }}</span>

    <!-- Icône à droite -->
    <component 
      v-if="iconRight && !loading" 
      :is="iconRight" 
      :class="iconClasses" 
    />
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

// Props
const props = defineProps({
  // Contenu
  text: {
    type: String,
    default: ''
  },
  
  // Type de bouton
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  
  // Variantes
  flat: {
    type: Boolean,
    default: false
  },
  
  outline: {
    type: Boolean,
    default: false
  },
  
  // Tailles
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  
  // États
  disabled: {
    type: Boolean,
    default: false
  },
  
  loading: {
    type: Boolean,
    default: false
  },
  
  loadingText: {
    type: String,
    default: 'Chargement...'
  },
  
  // Icônes
  iconLeft: {
    type: [Object, Function],
    default: null
  },
  
  iconRight: {
    type: [Object, Function],
    default: null
  },
  
  // Largeur complète
  fullWidth: {
    type: Boolean,
    default: false
  },
  
  // Coins arrondis
  rounded: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg', 'full'].includes(value)
  }
})

// Emits
defineEmits(['click'])

// Store
const themeStore = useThemeStore()

// Computed
const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    'border shadow-sm'
  ]
  
  // Tailles
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }
  
  // Coins arrondis
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full'
  }
  
  // Largeur
  const widthClasses = props.fullWidth ? 'w-full' : ''
  
  // Styles selon la variante
  let variantClasses = ''
  
  if (props.flat) {
    // Mode flat : arrière-plan clair + texte couleur primaire
    variantClasses = `${themeStore.themeClasses.bgPrimaryLight} ${themeStore.themeClasses.textPrimary} ${themeStore.themeClasses.borderPrimary} ${themeStore.themeClasses.hoverPrimary} hover:${themeStore.themeClasses.bgPrimary} hover:text-white hover:shadow-md`
  } else if (props.outline) {
    // Mode outline : bordure + texte couleur primaire
    variantClasses = `bg-transparent ${themeStore.themeClasses.textPrimary} ${themeStore.themeClasses.borderPrimary} ${themeStore.themeClasses.hoverPrimary} hover:${themeStore.themeClasses.bgPrimary} hover:text-white hover:shadow-md`
  } else {
    // Mode normal : utilise directement btnPrimary du thème
    variantClasses = `${themeStore.themeClasses.btnPrimary} border-transparent hover:shadow-md`
  }
  
  // Focus ring avec couleur du thème
  const focusClasses = `focus:ring-${themeStore.theme.colors.primary}`
  
  return [
    ...baseClasses,
    sizeClasses[props.size],
    roundedClasses[props.rounded],
    widthClasses,
    variantClasses,
    focusClasses
  ].filter(Boolean).join(' ')
})

const iconClasses = computed(() => {
  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  }
  
  const marginClasses = []
  if (props.iconLeft) marginClasses.push('mr-2')
  if (props.iconRight) marginClasses.push('ml-2')
  
  return [sizeMap[props.size], ...marginClasses].join(' ')
})
</script> 