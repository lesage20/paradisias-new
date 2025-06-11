<script setup>
// Configuration globale et initialisation
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  // Vérifier l'authentification au démarrage
  if (authStore.token) {
    authStore.checkAuth()
  }
})
</script>

<template>
  <div id="app">
    <RouterView />
    </div>
</template>

<style>
/* Styles globaux pour l'application */
#app {
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
