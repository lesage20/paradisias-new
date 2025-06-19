import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import { MotionPlugin } from '@vueuse/motion'
import VueApexCharts from 'vue3-apexcharts'

import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/theme'

const app = createApp(App)

// Configuration Pinia avec persistance
const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

app.use(pinia)
app.use(router)
app.use(MotionPlugin)
app.use(VueApexCharts)

// Initialisation du thème
const themeStore = useThemeStore()
themeStore.initTheme()

// Variables globales
app.config.globalProperties.$formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-CI', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

app.config.globalProperties.$formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  }).format(new Date(date))
}

app.mount('#app')
