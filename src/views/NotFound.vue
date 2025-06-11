<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="mb-8">
        <h1 class="text-6xl font-bold text-gray-900">404</h1>
        <h2 class="text-2xl font-semibold text-gray-700 mt-4">Page non trouvée</h2>
        <p class="text-gray-600 mt-2">La page que vous cherchez n'existe pas.</p>
      </div>
      
      <RouterLink to="/" class="btn-primary">
        <Home class="w-4 h-4 mr-2" />
        Retour à l'accueil
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { Home } from 'lucide-vue-next'
</script> 