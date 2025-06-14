<template>
  <div>
    <!-- Overlay -->
    <div v-if="isOpen" @click="close" 
         class="fixed inset-0 bg-black/50 z-40 transition-opacity"></div>
    
    <!-- Panneau de paramètres -->
    <div :class="[
      'fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col',
      isOpen ? 'translate-x-0' : 'translate-x-full'
    ]">
      <!-- Header fixe -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
        <h2 class="text-xl font-bold text-gray-900">Paramètres</h2>
        <button @click="close" class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Contenu scrollable -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Section Thèmes -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Thèmes de couleur</h3>
          <p class="text-sm text-gray-600 mb-6">Choisissez un thème pour personnaliser l'interface</p>
          
          <div class="space-y-3">
            <div v-for="themeOption in themesList" :key="themeOption.key"
                 @click="selectTheme(themeOption.key)"
                 class="flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md"
                 :class="[
                   currentTheme === themeOption.key 
                     ? 'border-blue-500 bg-blue-50' 
                     : 'border-gray-200 hover:border-gray-300'
                 ]">
              <div class="flex items-center space-x-3">
                <!-- Aperçu des couleurs -->
                <div class="flex space-x-1">
                  <div :class="getColorPreview(themeOption, 'primary')" 
                       class="w-4 h-4 rounded-full"></div>
                  <div :class="getColorPreview(themeOption, 'secondary')" 
                       class="w-4 h-4 rounded-full"></div>
                </div>
                <span class="font-medium text-gray-900">{{ themeOption.name }}</span>
              </div>
              
              <!-- Indicateur de sélection -->
              <div v-if="currentTheme === themeOption.key" 
                   class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <Check class="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </div>

        <!-- Aperçu du thème -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Aperçu</h3>
          <div class="space-y-3">
            <!-- Bouton primaire -->
            <button :class="themeClasses.btnPrimary" 
                    class="w-full py-2 px-4 rounded-lg font-medium transition-colors">
              Bouton primaire
            </button>
            
            <!-- Bouton secondaire -->
            <button :class="themeClasses.btnSecondary" 
                    class="w-full py-2 px-4 rounded-lg font-medium transition-colors">
              Bouton secondaire
            </button>
            
            <!-- Texte avec accent -->
            <div class="p-3 bg-gray-50 rounded-lg">
              <p :class="themeClasses.textPrimary" class="font-medium">
                Texte avec couleur primaire
              </p>
              <p :class="themeClasses.textSecondary" class="text-sm">
                Texte avec couleur secondaire
              </p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="border-t border-gray-200 pt-6">
          <button @click="resetToDefault" 
                  class="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Réinitialiser au thème Violet
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { X, Check } from 'lucide-vue-next'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close'])

// Store
const themeStore = useThemeStore()

// Computed
const currentTheme = computed(() => themeStore.currentTheme)
const themeClasses = computed(() => themeStore.themeClasses)
const themesList = computed(() => themeStore.getThemesList())

// Méthodes
const close = () => {
  emit('close')
}

const selectTheme = (themeName) => {
  themeStore.setTheme(themeName)
}

const resetToDefault = () => {
  themeStore.setTheme('violet')
}

const getColorPreview = (theme, colorType) => {
  const color = theme.colors[colorType]
  
  // Mapping des couleurs personnalisées vers leurs équivalents CSS
  const colorMapping = {
    // Couleurs Paradisias
    'theme-green-paradisias': 'bg-[#09402C]',
    'theme-salmon-paradisias': 'bg-[#c88a85]',
    'theme-salmon-primary': 'bg-[#c88a85]',
    'theme-green-secondary': 'bg-[#09402C]',
    
    // Couleurs standards Tailwind
    'purple-600': 'bg-purple-600',
    'pink-600': 'bg-pink-600',
    'blue-600': 'bg-blue-600',
    'cyan-600': 'bg-cyan-600',
    'indigo-600': 'bg-indigo-600',
    'emerald-600': 'bg-emerald-600',
    'teal-600': 'bg-teal-600',
    'red-600': 'bg-red-600',
    'orange-600': 'bg-orange-600',
    'amber-600': 'bg-amber-600',
    'rose-600': 'bg-rose-600',
    'slate-600': 'bg-slate-600',
    'gray-600': 'bg-gray-600'
  }
  
  // Vérifier si on a un mapping pour cette couleur
  if (colorMapping[color]) {
    return colorMapping[color]
  }
  
  // Gestion des couleurs personnalisées avec crochets (ancien système)
  if (color.startsWith('[') && color.endsWith(']')) {
    return `bg-${color}`
  }
  
  // Par défaut, essayer d'utiliser la couleur telle quelle
  return `bg-${color}`
}
</script> 