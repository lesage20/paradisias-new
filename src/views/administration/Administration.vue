<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Administration</h1>
      <p class="text-gray-600 mt-1">Gestion administrative de l'hôtel</p>
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
            ? 'bg-white text-accent-700 shadow-sm'
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
import { BarChart3, DollarSign, Users } from 'lucide-vue-next'

const tabs = [
  {
    name: 'statistics',
    label: 'Statistiques',
    to: '/administration',
    icon: BarChart3
  },
  {
    name: 'expenses',
    label: 'Dépenses',
    to: '/administration/expenses',
    icon: DollarSign
  },
  {
    name: 'employees',
    label: 'Employés',
    to: '/administration/employees',
    icon: Users
  }
]
</script> 