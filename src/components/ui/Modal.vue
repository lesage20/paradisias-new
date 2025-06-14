<template>
  <Teleport to="body">
    <Transition name="modal-overlay" appear>
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click="handleOverlayClick"
        @keydown.esc="handleEscape"
      >
        <!-- Overlay avec animation -->
        <div class="absolute inset-0 bg-black/50 transition-all duration-300"></div>
        
        <!-- Contenu du modal avec animation -->
        <Transition name="modal-content" appear>
          <div
            v-if="modelValue"
            ref="modalContent"
            :class="[
              'relative bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden',
              sizeClasses[size],
              'transform-gpu' // Optimisation pour les animations
            ]"
            @click.stop
            role="dialog"
            :aria-labelledby="titleId"
            :aria-describedby="descriptionId"
            aria-modal="true"
          >
            <!-- En-tête du modal -->
            <div v-if="$slots.header || title" class="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div class="flex items-center justify-between">
                <div>
                  <h3 :id="titleId" class="text-lg font-semibold text-gray-900">
                    <slot name="title">{{ title }}</slot>
                  </h3>
                  <p v-if="subtitle" :id="descriptionId" class="text-sm text-gray-600 mt-1">
                    {{ subtitle }}
                  </p>
                </div>
                <button
                  v-if="showCloseButton"
                  @click="close"
                  class="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                  :aria-label="closeButtonLabel"
                >
                  <X class="w-5 h-5" />
                </button>
              </div>
              <slot name="header"></slot>
            </div>

            <!-- Contenu principal -->
            <div class="overflow-y-auto max-h-[calc(90vh-8rem)]">
              <slot></slot>
            </div>

            <!-- Pied du modal -->
            <div v-if="$slots.footer || showDefaultButtons" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <slot name="footer">
                <!-- Boutons par défaut si showDefaultButtons est true -->
                <div v-if="showDefaultButtons" class="flex items-center justify-end space-x-3">
                  <button 
                    type="button" 
                    @click="handleCancel"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    {{ cancelText }}
                  </button>
                  <button 
                    type="button" 
                    @click="handleConfirm"
                    :disabled="disabled || loading"
                    :class="[
                      'inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200',
                      themeClasses.btnPrimary
                    ]"
                  >
                    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span v-if="loading">Chargement...</span>
                    <span v-else>{{ confirmText }}</span>
                  </button>
                </div>
              </slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  },
  closeOnEscape: {
    type: Boolean,
    default: true
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  closeButtonLabel: {
    type: String,
    default: 'Fermer le modal'
  },
  persistent: {
    type: Boolean,
    default: false
  },
  // Props pour les boutons par défaut
  showDefaultButtons: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: 'Annuler'
  },
  confirmText: {
    type: String,
    default: 'Enregistrer'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'close', 'open', 'cancel', 'confirm'])

// Store
const themeStore = useThemeStore()

// Refs
const modalContent = ref(null)

// Computed
const sizeClasses = {
  xs: 'max-w-sm w-full',
  sm: 'max-w-md w-full',
  md: 'max-w-lg w-full',
  lg: 'max-w-2xl w-full',
  xl: 'max-w-4xl w-full',
  full: 'max-w-7xl w-full mx-4'
}

const titleId = computed(() => `modal-title-${Math.random().toString(36).substr(2, 9)}`)
const descriptionId = computed(() => `modal-description-${Math.random().toString(36).substr(2, 9)}`)

const themeClasses = computed(() => themeStore.themeClasses)

// Methods
const close = () => {
  if (!props.persistent) {
    emit('update:modelValue', false)
    emit('close')
  }
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close()
  }
}

const handleEscape = () => {
  if (props.closeOnEscape) {
    close()
  }
}

// Méthodes pour les boutons par défaut
const handleCancel = () => {
  emit('cancel')
  close()
}

const handleConfirm = () => {
  emit('confirm')
}

// Gestion du focus et du scroll améliorée
let lastActiveElement = null
let originalBodyOverflow = ''
let originalBodyPaddingRight = ''

// Fonction pour calculer la largeur de la scrollbar
const getScrollbarWidth = () => {
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll'
  outer.style.msOverflowStyle = 'scrollbar'
  document.body.appendChild(outer)

  const inner = document.createElement('div')
  outer.appendChild(inner)

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
  document.body.removeChild(outer)

  return scrollbarWidth
}

// Fonction pour désactiver le scroll de manière fluide
const disableBodyScroll = () => {
  const body = document.body
  originalBodyOverflow = body.style.overflow
  originalBodyPaddingRight = body.style.paddingRight

  const scrollbarWidth = getScrollbarWidth()
  
  // Ajouter un padding pour compenser la disparition de la scrollbar
  if (scrollbarWidth > 0) {
    const currentPadding = parseInt(window.getComputedStyle(body).paddingRight) || 0
    body.style.paddingRight = `${currentPadding + scrollbarWidth}px`
  }
  
  body.style.overflow = 'hidden'
}

// Fonction pour réactiver le scroll
const enableBodyScroll = () => {
  const body = document.body
  body.style.overflow = originalBodyOverflow
  body.style.paddingRight = originalBodyPaddingRight
}

const trapFocus = (e) => {
  if (!modalContent.value) return
  
  const focusableElements = modalContent.value.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  )
  
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]
  
  if (e.key === 'Tab') {
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus()
        e.preventDefault()
      }
    }
  }
}

// Watchers
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    emit('open')
    lastActiveElement = document.activeElement
    
    // Désactiver le scroll avec compensation
    disableBodyScroll()
    
    nextTick(() => {
      // Focus sur le premier élément focusable ou sur le modal lui-même
      const firstFocusable = modalContent.value?.querySelector(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
      )
      if (firstFocusable) {
        firstFocusable.focus()
      } else {
        modalContent.value?.focus()
      }
    })
    document.addEventListener('keydown', trapFocus)
  } else {
    document.removeEventListener('keydown', trapFocus)
    
    // Réactiver le scroll
    enableBodyScroll()
    
    if (lastActiveElement) {
      lastActiveElement.focus()
      lastActiveElement = null
    }
  }
})

// Cleanup
onUnmounted(() => {
  document.removeEventListener('keydown', trapFocus)
  enableBodyScroll()
})
</script>

<style scoped>
/* Animation moderne et professionnelle pour l'overlay */
.modal-overlay-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.modal-overlay-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.modal-overlay-enter-from {
  opacity: 0;
}

.modal-overlay-enter-to {
  opacity: 1;
}

.modal-overlay-leave-from {
  opacity: 1;
}

.modal-overlay-leave-to {
  opacity: 0;
}

/* Animation sophistiquée pour le contenu - Inspired by modern UIs */
.modal-content-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center center;
}

.modal-content-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-origin: center center;
}

.modal-content-enter-from {
  opacity: 0;
  transform: scale(0.7) translateY(-50px) rotateX(10deg);
  filter: blur(10px) brightness(0.8);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
}

.modal-content-enter-to {
  opacity: 1;
  transform: scale(1) translateY(0px) rotateX(0deg);
  filter: blur(0px) brightness(1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-content-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0px) rotateX(0deg);
  filter: blur(0px) brightness(1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.85) translateY(30px) rotateX(-5deg);
  filter: blur(5px) brightness(1.2);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
}

/* Optimisation pour les performances */
.modal-content-enter-active,
.modal-content-leave-active {
  will-change: transform, opacity, filter, box-shadow;
  backface-visibility: hidden;
  perspective: 1000px;
}

/* Animation sophistiquée en étapes */
@keyframes modal-entrance {
  0% {
    opacity: 0;
    transform: scale(0.6) translateY(-60px) rotateX(15deg);
    filter: blur(15px) brightness(0.7);
  }
  20% {
    opacity: 0.3;
    transform: scale(0.75) translateY(-30px) rotateX(8deg);
    filter: blur(8px) brightness(0.85);
  }
  50% {
    opacity: 0.8;
    transform: scale(0.95) translateY(-5px) rotateX(2deg);
  }
  70% {
    opacity: 0.95;
    transform: scale(1.02) translateY(2px) rotateX(-1deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0px) rotateX(0deg);
  }
}

@keyframes modal-exit {
  0% {
    opacity: 1;
    transform: scale(1) translateY(0px) rotateX(0deg);
  }
  30% {
    opacity: 0.8;
    transform: scale(0.98) translateY(5px) rotateX(-2deg);
  }
  70% {
    opacity: 0.3;
    transform: scale(0.88) translateY(20px) rotateX(-8deg);
  }
  100% {
    opacity: 0;
    transform: scale(0.75) translateY(40px) rotateX(-12deg);
  }
}

/* Appliquer les animations par étapes pour un effet ultra-smooth */
.modal-content-enter-active {
  animation: modal-entrance 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.modal-content-leave-active {
  animation: modal-exit 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
}

/* Amélioration GPU et optimisations */
.transform-gpu {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
  will-change: transform;
}

/* Animation de pulsation subtile quand ouvert */
@keyframes subtle-pulse {
  0%, 100% {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
  50% {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  }
}

.modal-content-enter-to {
  animation: modal-entrance 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards,
             subtle-pulse 6s ease-in-out infinite 1s;
}

/* Micro-interactions pour les éléments internes */
.modal-content-enter-active .px-6 {
  animation: fade-in-up 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s both;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Support pour les écrans haute résolution */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .modal-content-enter-active,
  .modal-content-leave-active {
    transform: translateZ(0);
  }
}

/* Préférences d'accessibilité respectées */
@media (prefers-reduced-motion: reduce) {
  .modal-overlay-enter-active,
  .modal-overlay-leave-active,
  .modal-content-enter-active,
  .modal-content-leave-active {
    transition: opacity 0.3s ease !important;
    animation: none !important;
  }
  
  .modal-content-enter-from,
  .modal-content-leave-to {
    transform: none !important;
    filter: none !important;
  }
  
  .modal-content-enter-to {
    animation: none !important;
  }
}

/* Support pour les appareils avec peu de ressources */
@media (prefers-reduced-data: reduce) {
  .modal-content-enter-active,
  .modal-content-leave-active {
    filter: none !important;
    backdrop-filter: none !important;
  }
}
</style> 