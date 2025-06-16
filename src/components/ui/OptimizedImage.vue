<template>
  <div class="relative overflow-hidden" :class="containerClass">
    <!-- Placeholder pendant le chargement -->
    <div 
      v-if="isLoading" 
      class="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
    >
      <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    </div>

    <!-- Image principale -->
    <img
      v-show="!isLoading && !hasError"
      :src="optimizedSrc"
      :alt="alt"
      :class="imageClass"
      :loading="loading"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- Image de fallback en cas d'erreur -->
    <div 
      v-if="hasError" 
      class="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-gray-500"
    >
      <svg class="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
      </svg>
      <span class="text-sm">{{ fallbackText }}</span>
    </div>

    <!-- Slot pour contenu superposé -->
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: 800
  },
  height: {
    type: [String, Number],
    default: 600
  },
  quality: {
    type: Number,
    default: 80
  },
  loading: {
    type: String,
    default: 'lazy',
    validator: (value) => ['lazy', 'eager'].includes(value)
  },
  containerClass: {
    type: String,
    default: ''
  },
  imageClass: {
    type: String,
    default: 'w-full h-full object-cover'
  },
  fallbackText: {
    type: String,
    default: 'Image non disponible'
  }
})

const isLoading = ref(true)
const hasError = ref(false)

// Optimiser l'URL Unsplash avec les paramètres appropriés
const optimizedSrc = computed(() => {
  if (props.src.includes('unsplash.com')) {
    const url = new URL(props.src)
    url.searchParams.set('auto', 'format')
    url.searchParams.set('fit', 'crop')
    url.searchParams.set('w', props.width.toString())
    url.searchParams.set('h', props.height.toString())
    url.searchParams.set('q', props.quality.toString())
    return url.toString()
  }
  return props.src
})

const handleLoad = () => {
  isLoading.value = false
  hasError.value = false
}

const handleError = () => {
  isLoading.value = false
  hasError.value = true
  console.warn('Erreur de chargement d\'image:', props.src)
}
</script> 