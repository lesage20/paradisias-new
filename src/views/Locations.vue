<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Locations</h1>
        <p class="text-gray-600 mt-1">Gestion des locations et réservations</p>
      </div>
      <button class="btn-primary">
        <Plus class="w-4 h-4 mr-2" />
        Nouvelle location
      </button>
    </div>

    <div class="card p-6">
      <div class="text-center py-12">
        <BookOpen class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Page en construction</h3>
        <p class="text-gray-600">La gestion des locations sera bientôt disponible.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { BookOpen, Plus } from 'lucide-vue-next'
</script> 