<template>
  <div class="space-y-6">


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