<template>
  <button
    @click="$emit('click')"
    :class="[
      'flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:shadow-sm group',
      'text-center space-y-2 min-h-24'
    ]"
  >
    <div :class="[
      'w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200',
      getColorClasses()
    ]">
      <component :is="getIcon()" class="w-5 h-5" />
    </div>
    
    <span class="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
      {{ label }}
    </span>
  </button>
</template>

<script setup>
import { 
  Plus, Users, FileText, Settings, BarChart3, Calendar, UserCheck, UserX 
} from 'lucide-vue-next'

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'blue',
    validator: value => ['green', 'blue', 'purple', 'yellow', 'orange', 'red', 'gray', 'indigo', 'emerald'].includes(value)
  }
})

const emit = defineEmits(['click'])

const getIcon = () => {
  const icons = {
    Plus,
    Users,
    FileText,
    Settings,
    BarChart3,
    Calendar,
    UserCheck,
    UserX
  }
  return icons[props.icon] || Plus
}

const getColorClasses = () => {
  const colorMap = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    gray: 'bg-gray-100 text-gray-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    emerald: 'bg-emerald-100 text-emerald-600'
  }
  return colorMap[props.color] || colorMap.blue
}
</script> 