<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-600">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ value }}</p>
        
        <!-- Tendance -->
        <div v-if="showTrend && trend" class="flex items-center mt-2">
          <component 
            :is="trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : ''" 
            :class="[
              'w-4 h-4 mr-1',
              trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'
            ]" 
          />
          <span 
            :class="[
              'text-sm font-medium',
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
            ]"
          >
            {{ getTrendText }}
          </span>
        </div>
      </div>
      
      <!-- Icône -->
      <div :class="[
        'w-12 h-12 rounded-lg flex items-center justify-center',
        getColorClasses()
      ]">
        <component :is="getIcon()" class="w-6 h-6" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  TrendingUp, TrendingDown,  DollarSign, BarChart3, Star, Calendar, 
  UserCheck, UserX, Users
} from 'lucide-vue-next'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  previousValue: {
    type: [String, Number],
    default: null
  },
  // trend: {
  //   type: String,
  //   validator: value => ['up', 'down', 'equal', null, undefined].includes(value),
  //   default: null
  // },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'blue',
    validator: value => ['green', 'blue', 'purple', 'yellow', 'orange', 'red', 'gray', 'indigo', 'emerald'].includes(value)
  },
  showTrend: {
    type: Boolean,
    default: true
  }
})

const getIcon = () => {
  const icons = {
    DollarSign,
    BarChart3,
    TrendingUp,
    Star,
    Calendar,
    UserCheck,
    UserX,
    Users
  }
  return icons[props.icon] || DollarSign
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


const trend = computed(() => {
  if (!props.previousValue) return null
  const current = parseFloat(props.value.toString().replace(/[^\d.-]/g, ''))
  const previous = parseFloat(props.previousValue.toString().replace(/[^\d.-]/g, ''))
  return current > previous ? 'up' : current < previous ? 'down' : 'equal'
})

const getTrendText = computed(() => {
  if (!props.previousValue) return ''
  
  // Calculer le pourcentage de variation
  const current = parseFloat(props.value.toString().replace(/[^\d.-]/g, ''))
  const previous = parseFloat(props.previousValue.toString().replace(/[^\d.-]/g, ''))
  
  if (isNaN(current) || isNaN(previous) || previous === 0) {
    if (trend.value == 'up') {
      return 'En hausse'
    } else if (trend.value == 'down') {
      return 'En baisse'
    } else {
      return 'Stable'
    }
  }
  
  const percentage = Math.abs(((current - previous) / previous) * 100).toFixed(1)
  const direction = trend.value === 'up' ? '+' : '-'
  
  return `${direction}${percentage}%`
})
</script> 