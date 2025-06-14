<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Onglets -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex" :class="[centered ? 'justify-center' : '', fullWidth ? '' : 'space-x-8 px-6']">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="selectTab(tab.id)"
          :class="[
            'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center',
            fullWidth ? 'flex-1 justify-center' : '',
            activeTab === tab.id
              ? `${themeClasses.borderPrimary} ${themeClasses.textPrimary}`
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <component 
            v-if="tab.icon" 
            :is="tab.icon" 
            class="w-4 h-4 mr-2" 
            :class="activeTab === tab.id ? themeClasses.textPrimary : 'text-gray-400'"
          />
          {{ tab.label }}
          <span 
            v-if="tab.count !== undefined" 
            :class="[
              'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium',
              activeTab === tab.id 
                ? `${themeClasses.bgPrimaryLight} ${themeClasses.textPrimary}` 
                : 'bg-gray-100 text-gray-900'
            ]"
          >
            {{ tab.count }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Contenu des onglets -->
    <div class="p-6">
      <slot :activeTab="activeTab" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    // Format: [{ id: 'tab1', label: 'Tab 1', icon: IconComponent, count: 5 }]
  },
  defaultTab: {
    type: String,
    default: null
  },
  centered: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'tab-change'])

// Store
const themeStore = useThemeStore()

// Computed
const themeClasses = computed(() => themeStore.themeClasses)

const activeTab = ref(props.modelValue || props.defaultTab || props.tabs[0]?.id)

const selectTab = (tabId) => {
  activeTab.value = tabId
  emit('update:modelValue', tabId)
  emit('tab-change', tabId)
}

// Synchroniser avec v-model
watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue !== activeTab.value) {
    activeTab.value = newValue
  }
})

// Émettre la valeur initiale
if (props.modelValue === null) {
  emit('update:modelValue', activeTab.value)
}
</script> 