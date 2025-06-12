<template>
  <div class="space-y-6">
    <!-- Header avec actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Gestion des Dépenses</h2>
        <p class="text-gray-600 mt-1">{{ expenses.length }} dépense{{ expenses.length > 1 ? 's' : '' }} enregistrée{{ expenses.length > 1 ? 's' : '' }}</p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <button @click="refreshData" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': isLoading }" />
          Actualiser
        </button>
        <button @click="openExpenseModal" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
          <Plus class="w-4 h-4 mr-2" />
          Nouvelle Dépense
        </button>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <DollarSign class="w-6 h-6 text-red-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total aujourd'hui</p>
            <p class="text-2xl font-bold text-red-600">{{ formatCurrency(todayTotal) }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Calendar class="w-6 h-6 text-orange-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Ce mois</p>
            <p class="text-2xl font-bold text-orange-600">{{ formatCurrency(monthTotal) }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <TrendingUp class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Moyenne/jour</p>
            <p class="text-2xl font-bold text-blue-600">{{ formatCurrency(dailyAverage) }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <FileText class="w-6 h-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Transactions</p>
            <p class="text-2xl font-bold text-purple-600">{{ expenses.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="filters.search"
              type="text"
              placeholder="Titre, description..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
          <input v-model="filters.startDate" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
          <input v-model="filters.endDate" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Montant minimum</label>
          <input v-model.number="filters.minAmount" type="number" placeholder="0" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
        </div>
      </div>
    </div>

    <!-- Liste des dépenses -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Liste des Dépenses</h3>
      </div>
      
      <div v-if="isLoading" class="p-8 text-center">
        <div class="inline-flex items-center">
          <RefreshCw class="w-5 h-5 animate-spin text-red-600 mr-2" />
          <span class="text-gray-600">Chargement des dépenses...</span>
        </div>
      </div>

      <div v-else-if="filteredExpenses.length === 0" class="p-8 text-center">
        <DollarSign class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune dépense trouvée</h3>
        <p class="text-gray-600">{{ filters.search ? 'Aucune dépense ne correspond à votre recherche.' : 'Commencez par ajouter votre première dépense.' }}</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payé par</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="expense in filteredExpenses" :key="expense.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(expense.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ expense.title }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs truncate">{{ expense.description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-red-600">{{ formatCurrency(expense.amount) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ getEmployeeName(expense.spent_by) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button @click="editExpense(expense)" class="text-blue-600 hover:text-blue-900">
                  <Edit class="w-4 h-4" />
                </button>
                <button @click="deleteExpense(expense)" class="text-red-600 hover:text-red-900">
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Dépense -->
    <div v-if="showExpenseModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="closeExpenseModal">
      <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto" @click.stop>
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            {{ selectedExpense ? 'Modifier la dépense' : 'Nouvelle dépense' }}
          </h3>
          <button @click="closeExpenseModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveExpense" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
              <input v-model="expenseForm.title" type="text" required maxlength="50" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Montant *</label>
              <input v-model.number="expenseForm.amount" type="number" required min="0" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date *</label>
              <input v-model="expenseForm.date" type="date" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Payé par *</label>
              <select v-model="expenseForm.spent_by" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                <option value="">Sélectionner un employé</option>
                <option v-for="employee in employees" :key="employee.id" :value="employee.id">
                  {{ employee.name }} {{ employee.firstname }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea v-model="expenseForm.description" required rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"></textarea>
          </div>
          
          <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button type="button" @click="closeExpenseModal" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800" :disabled="isProcessing">
              <span v-if="isProcessing">{{ selectedExpense ? 'Modification...' : 'Création...' }}</span>
              <span v-else>{{ selectedExpense ? 'Modifier' : 'Créer' }}</span>
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
  DollarSign, Plus, RefreshCw, Search, Edit, Trash2, X, Calendar, TrendingUp, FileText
} from 'lucide-vue-next'

// Stores
const authStore = useAuthStore()

// État
const isLoading = ref(false)
const isProcessing = ref(false)
const showExpenseModal = ref(false)
const selectedExpense = ref(null)

// Données
const expenses = ref([])
const employees = ref([])

// Filtres
const filters = ref({
  search: '',
  startDate: '',
  endDate: '',
  minAmount: null
})

// Formulaire dépense
const expenseForm = ref({
  title: '',
  description: '',
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  spent_by: ''
})

// Computed - Statistiques
const todayTotal = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return expenses.value
    .filter(exp => exp.date === today)
    .reduce((sum, exp) => sum + exp.amount, 0)
})

const monthTotal = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  return expenses.value
    .filter(exp => {
      const expDate = new Date(exp.date)
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear
    })
    .reduce((sum, exp) => sum + exp.amount, 0)
})

const dailyAverage = computed(() => {
  if (expenses.value.length === 0) return 0
  const total = expenses.value.reduce((sum, exp) => sum + exp.amount, 0)
  const days = Math.max(1, expenses.value.length / 30) // Approximation
  return Math.round(total / days)
})

// Computed - Données filtrées
const filteredExpenses = computed(() => {
  let filtered = expenses.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(exp => 
      exp.title.toLowerCase().includes(search) || 
      exp.description.toLowerCase().includes(search)
    )
  }

  if (filters.value.startDate) {
    filtered = filtered.filter(exp => exp.date >= filters.value.startDate)
  }

  if (filters.value.endDate) {
    filtered = filtered.filter(exp => exp.date <= filters.value.endDate)
  }

  if (filters.value.minAmount) {
    filtered = filtered.filter(exp => exp.amount >= filters.value.minAmount)
  }

  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
})

// Méthodes utilitaires
const formatCurrency = (amount) => {
  if (!amount) return '0 FCFA'
  return new Intl.NumberFormat('fr-CI', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const getEmployeeName = (employeeId) => {
  const employee = employees.value.find(emp => emp.id === employeeId)
  return employee ? `${employee.name} ${employee.firstname}` : 'N/A'
}

// Actions
const refreshData = async () => {
  isLoading.value = true
  try {
    const [expensesRes, employeesRes] = await Promise.all([
      axios.get(`${authStore.apiUrl}hotel/depenses/`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
      axios.get(`${authStore.apiUrl}accounts/employes/`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
    ])
    
    expenses.value = expensesRes.data
    employees.value = employeesRes.data
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
    // TODO: Afficher une notification d'erreur
  } finally {
    isLoading.value = false
  }
}

const openExpenseModal = (expense = null) => {
  selectedExpense.value = expense
  if (expense) {
    expenseForm.value = { ...expense }
  } else {
    expenseForm.value = {
      title: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      spent_by: authStore.profile?.id || ''
    }
  }
  showExpenseModal.value = true
}

const closeExpenseModal = () => {
  showExpenseModal.value = false
  selectedExpense.value = null
}

const editExpense = (expense) => {
  openExpenseModal(expense)
}

const deleteExpense = async (expense) => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer la dépense "${expense.title}" ?`)) {
    return
  }

  try {
    await axios.delete(`${authStore.apiUrl}hotel/depenses/${expense.id}/`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    
    expenses.value = expenses.value.filter(exp => exp.id !== expense.id)
    // TODO: Afficher une notification de succès
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    // TODO: Afficher une notification d'erreur
  }
}

const saveExpense = async () => {
  isProcessing.value = true
  
  try {
    if (selectedExpense.value) {
      // Modification
      const response = await axios.put(
        `${authStore.apiUrl}hotel/depenses/${selectedExpense.value.id}/`,
        expenseForm.value,
        { headers: { Authorization: `Bearer ${authStore.token}` } }
      )
      
      const index = expenses.value.findIndex(exp => exp.id === selectedExpense.value.id)
      if (index !== -1) {
        expenses.value[index] = response.data
      }
    } else {
      // Création
      const response = await axios.post(
        `${authStore.apiUrl}hotel/depenses/`,
        expenseForm.value,
        { headers: { Authorization: `Bearer ${authStore.token}` } }
      )
      
      expenses.value.unshift(response.data)
    }
    
    closeExpenseModal()
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