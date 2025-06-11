<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Structure Hôtel</h1>
      <p class="text-gray-600 mt-1">Configuration de la structure de l'hôtel</p>
    </div>

    <!-- Navigation des sous-sections -->
    <nav class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.name"
        :to="tab.to"
        class="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-all"
        :class="[
          $route.name === tab.name
            ? 'bg-white text-paradisias-700 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        ]"
      >
        <component :is="tab.icon" class="w-4 h-4 mr-2" />
        {{ tab.label }}
      </RouterLink>
    </nav>

    <!-- Contenu des sous-routes -->
    <RouterView />
  </div>
</template>

<script setup>
import { Building2, Layers, Home, DollarSign, Tag, Wrench } from 'lucide-vue-next'

const tabs = [
  {
    name: 'room-types',
    label: 'Types de chambres',
    to: '/hotel-structure',
    icon: Building2
  },
  {
    name: 'floors',
    label: 'Étages',
    to: '/hotel-structure/floors',
    icon: Layers
  },
  {
    name: 'rooms',
    label: 'Chambres',
    to: '/hotel-structure/rooms',
    icon: Home
  },
  {
    name: 'price-manager',
    label: 'Prix',
    to: '/hotel-structure/price-manager',
    icon: DollarSign
  },
  {
    name: 'coupons',
    label: 'Coupons',
    to: '/hotel-structure/coupons',
    icon: Tag
  },
  {
    name: 'housekeeping',
    label: 'Entretien',
    to: '/hotel-structure/housekeeping',
    icon: Wrench
  }
]
</script> 