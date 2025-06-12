<template>
  <div class="space-y-6">
    <!-- Header avec actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Gestion des Employés</h2>
        <p class="text-gray-600 mt-1">{{ employees.length }} employé{{ employees.length > 1 ? 's' : '' }} enregistré{{ employees.length > 1 ? 's' : '' }}</p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <button @click="refreshData" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': isLoading }" />
          Actualiser
        </button>
        <button @click="openEmployeeModal" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
          <UserPlus class="w-4 h-4 mr-2" />
          Nouvel Employé
        </button>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="filters.search"
              type="text"
              placeholder="Nom, prénom, téléphone..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
          <select v-model="filters.role" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Tous les rôles</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Genre</label>
          <select v-model="filters.gender" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Tous</option>
            <option value="M">Homme</option>
            <option value="F">Femme</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Liste des employés -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Liste des Employés</h3>
      </div>
      
      <div v-if="isLoading" class="p-8 text-center">
        <div class="inline-flex items-center">
          <RefreshCw class="w-5 h-5 animate-spin text-blue-600 mr-2" />
          <span class="text-gray-600">Chargement des employés...</span>
        </div>
      </div>

      <div v-else-if="filteredEmployees.length === 0" class="p-8 text-center">
        <Users class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun employé trouvé</h3>
        <p class="text-gray-600">{{ filters.search ? 'Aucun employé ne correspond à votre recherche.' : 'Commencez par ajouter votre premier employé.' }}</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="employee in filteredEmployees" :key="employee.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span class="text-white font-medium text-sm">{{ getInitials(employee.name, employee.firstname) }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ employee.name }} {{ employee.firstname }}</div>
                    <div class="text-sm text-gray-500">ID: {{ employee.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ employee.phone || 'N/A' }}</div>
                <div class="text-sm text-gray-500">{{ employee.email || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ getRoleName(employee.group) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ employee.gender === 'M' ? 'Homme' : employee.gender === 'F' ? 'Femme' : 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Actif
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button @click="editEmployee(employee)" class="text-blue-600 hover:text-blue-900">
                  <Edit class="w-4 h-4" />
                </button>
                <button @click="deleteEmployee(employee)" class="text-red-600 hover:text-red-900">
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Employé -->
    <div v-if="showEmployeeModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="closeEmployeeModal">
      <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto" @click.stop>
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            {{ selectedEmployee ? 'Modifier l\'employé' : 'Nouvel employé' }}
          </h3>
          <button @click="closeEmployeeModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveEmployee" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
              <input v-model="employeeForm.name" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
              <input v-model="employeeForm.firstname" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
              <input v-model="employeeForm.phone" type="tel" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input v-model="employeeForm.email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Genre</label>
              <select v-model="employeeForm.gender" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Sélectionner</option>
                <option value="M">Homme</option>
                <option value="F">Femme</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Rôle *</label>
              <select v-model="employeeForm.group" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Sélectionner un rôle</option>
                <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
              </select>
            </div>
          </div>
          
          <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button type="button" @click="closeEmployeeModal" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" :disabled="isProcessing">
              <span v-if="isProcessing">{{ selectedEmployee ? 'Modification...' : 'Création...' }}</span>
              <span v-else>{{ selectedEmployee ? 'Modifier' : 'Créer' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import {
  Users, UserPlus, RefreshCw, Search, Edit, Trash2, X
} from 'lucide-vue-next'

// Stores
const authStore = useAuthStore()

// État
const isLoading = ref(false)
const isProcessing = ref(false)
const showEmployeeModal = ref(false)
const selectedEmployee = ref(null)

// Données
const employees = ref([])
const roles = ref([])

// Filtres
const filters = ref({
  search: '',
  role: '',
  gender: ''
})

// Formulaire employé
const employeeForm = ref({
  name: '',
  firstname: '',
  phone: '',
  email: '',
  gender: '',
  group: ''
})

// Computed
const filteredEmployees = computed(() => {
  let filtered = employees.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(emp => 
      emp.name.toLowerCase().includes(search) || 
      emp.firstname.toLowerCase().includes(search) ||
      (emp.phone && emp.phone.includes(search))
    )
  }

  if (filters.value.role) {
    filtered = filtered.filter(emp => emp.group === parseInt(filters.value.role))
  }

  if (filters.value.gender) {
    filtered = filtered.filter(emp => emp.gender === filters.value.gender)
  }

  return filtered
})

// Méthodes utilitaires
const getInitials = (name, firstname) => {
  return `${name?.charAt(0) || ''}${firstname?.charAt(0) || ''}`.toUpperCase()
}

const getRoleName = (groupId) => {
  const role = roles.value.find(r => r.id === groupId)
  return role ? role.name : 'N/A'
}

// Actions
const refreshData = async () => {
  isLoading.value = true
  try {
    const [employeesRes, rolesRes] = await Promise.all([
      axios.get(`${authStore.apiUrl}accounts/employes/`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
      axios.get(`${authStore.apiUrl}accounts/groups/`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
    ])
    
    employees.value = employeesRes.data
    roles.value = rolesRes.data
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
    // TODO: Afficher une notification d'erreur
  } finally {
    isLoading.value = false
  }
}

const openEmployeeModal = (employee = null) => {
  selectedEmployee.value = employee
  if (employee) {
    employeeForm.value = { ...employee }
  } else {
    employeeForm.value = {
      name: '',
      firstname: '',
      phone: '',
      email: '',
      gender: '',
      group: ''
    }
  }
  showEmployeeModal.value = true
}

const closeEmployeeModal = () => {
  showEmployeeModal.value = false
  selectedEmployee.value = null
}

const editEmployee = (employee) => {
  openEmployeeModal(employee)
}

const deleteEmployee = async (employee) => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer ${employee.name} ${employee.firstname} ?`)) {
    return
  }

  try {
    await axios.delete(`${authStore.apiUrl}accounts/employes/${employee.id}/`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    
    employees.value = employees.value.filter(emp => emp.id !== employee.id)
    // TODO: Afficher une notification de succès
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    // TODO: Afficher une notification d'erreur
  }
}

const saveEmployee = async () => {
  isProcessing.value = true
  
  try {
    if (selectedEmployee.value) {
      // Modification
      const response = await axios.put(
        `${authStore.apiUrl}accounts/employes/${selectedEmployee.value.id}/`,
        employeeForm.value,
        { headers: { Authorization: `Bearer ${authStore.token}` } }
      )
      
      const index = employees.value.findIndex(emp => emp.id === selectedEmployee.value.id)
      if (index !== -1) {
        employees.value[index] = response.data
      }
    } else {
      // Création
      const response = await axios.post(
        `${authStore.apiUrl}accounts/employes/`,
        employeeForm.value,
        { headers: { Authorization: `Bearer ${authStore.token}` } }
      )
      
      employees.value.push(response.data)
    }
    
    closeEmployeeModal()
    // TODO: Afficher une notification de succès
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    // TODO: Afficher une notification d'erreur
  } finally {
    isProcessing.value = false
  }
}

// Lifecycle
onMounted(() => {
  refreshData()
})
</script> 