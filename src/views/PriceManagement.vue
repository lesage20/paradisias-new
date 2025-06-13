<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Paiements</h1>
        <p class="text-gray-600 mt-1">Suivi des paiements, dettes et deposits des séjours</p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <button @click="refreshData" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': isLoading }" />
          Actualiser
        </button>
        <!-- <button @click="openPaymentModal" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-green-700 hover:to-green-800">
          <Plus class="w-4 h-4 mr-2" />
          Nouveau Paiement
        </button> -->
      </div>
    </div>

    <!-- Statistiques financières -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <TrendingUp class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Paiement d'aujourd'hui</p>
            <p class="text-2xl font-bold text-green-600">{{ formatCurrency(todayRevenue) }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle class="w-6 h-6 text-red-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Dettes totales</p>
            <p class="text-2xl font-bold text-red-600">{{ formatCurrency(totalDebts) }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Wallet class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Deposits actifs</p>
            <p class="text-2xl font-bold text-blue-600">{{ formatCurrency(activeDeposits) }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <DollarSign class="w-6 h-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Dettes total jours</p>
            <p class="text-2xl font-bold text-purple-600">{{ formatCurrency(monthlyRevenue) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="filters.search"
              type="text"
              placeholder="Client, chambre..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Statut de paiement</label>
          <select v-model="filters.paymentStatus" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option value="">Tous les statuts</option>
            <option value="pj">Payé jour</option>
            <option value="dp">Dette payée</option>
            <option value="dj">Dette jour</option>
            <option value="dt">Dette totale</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type de paiement</label>
          <select v-model="filters.paymentType" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option value="">Tous les types</option>
            <option value="espece">Espèces</option>
            <option value="cheque">Chèque</option>
            <option value="visa">Carte bancaire</option>
            <option value="devise">Devise</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            v-model="filters.date"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>

    <!-- Onglets -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8 px-6">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === tab.id
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <component :is="tab.icon" class="w-4 h-4 mr-2 inline" />
            {{ tab.name }}
            <span v-if="tab.count" class="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Contenu des onglets -->
      <div class="p-6">
        <!-- Onglet Locations Actives -->
        <div v-if="activeTab === 'active'" class="space-y-4">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chambre</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="location in activeLocations" :key="location.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Bed class="w-5 h-5 text-purple-600" />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ location.guestName }}</div>
                        <div class="text-sm text-gray-500">{{ location.booking }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">Chambre {{ location.room_details?.room_number }}</div>
                    <div class="text-sm text-gray-500">{{ location.room_details?.room_type }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(location.checkIn) }} </div>
                    <div class="text-sm text-gray-500">{{ formatDate(location.checkOut) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ formatCurrency(location.totalPrice) }}</div>
                    <!-- <div class="text-sm text-gray-500">{{ formatCurrency(location.dailyRate) }}/jour</div> -->
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <!-- <span :class="getPaymentStatusClass(location.paymentStatus)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {{ getPaymentStatusLabel(location.paymentStatus) }}
                    </span> -->
                    <div class="text-sm text-gray-500">
                      Payé: {{ formatCurrency(location.amountPaid) }}
                    </div>
                    <div class="text-sm text-red-500">
                      Dette: {{ formatCurrency(location.amountDue) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button 
                      @click="openPaymentModal(location)"
                      class="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-green-700"
                    >
                      <CreditCard class="w-4 h-4 mr-1" />
                      Paiement
                    </button>
                    <button 
                      @click="viewPaymentHistory(location)"
                      class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <History class="w-4 h-4 mr-1" />
                      Historique
                    </button>
                    <button 
                      v-if="location.depositAmount > 0"
                      @click="viewDepositDetails(location)"
                      class="inline-flex items-center px-3 py-2 border border-blue-300 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                    >
                      <Wallet class="w-4 h-4 mr-1" />
                      Deposit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Onglet Locations Passées -->
        <div v-if="activeTab === 'past'" class="space-y-4">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chambre</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix Total</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant Payé</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant Restant</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="location in pastLocations" :key="location.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <User class="w-5 h-5 text-purple-600" />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ location.guest_details?.name + ' ' + location.guest_details?.firstname }}</div>
                        <div class="text-sm text-gray-500">{{ location.guest_details?.phone }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">Chambre {{ location.room_details?.number }}</div>
                    <div class="text-sm text-gray-500">{{ location.room_details?.type }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(location.checkIn) }} </div>
                    <div class="text-sm text-gray-500">{{ formatDate(location.checkOut) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ formatCurrency(location.totalPrice) }}</div>
                    <!-- <div class="text-sm text-gray-500">{{ formatCurrency(location.dailyRate) }}/jour</div> -->
                  </td>
                  <td class="px-6 py-4 text-green-700 whitespace-nowrap">
                      {{ formatCurrency(location.amountPaid) }}
                  </td>
                  <td class="px-6 py-4 text-red-700 whitespace-nowrap">
                      {{ formatCurrency(location.amountDue) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button 
                      @click="openPaymentModal(location)"
                      class="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100"
                    >
                      <Plus class="w-4 h-4 mr-1" />
                      Ajouter Paiement
                    </button>
                    <button 
                      title="Historique des paiements"
                      @click="viewPaymentHistory(location)"
                      class="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-50"
                    >
                      <History class="w-4 h-4 mr-1" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Onglet Historique des Paiements -->
        <div v-if="activeTab === 'payments'" class="space-y-4">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chambre</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="payment in filteredPayments" :key="payment.id" class="hover:bg-gray-50">
                  
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ payment.booking_details?.guest_name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ payment.booking_details?.room_number }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {{ formatCurrency(payment.amount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getPaymentTypeClass(payment.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {{ getPaymentTypeLabel(payment.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ getPaymentMethodLabel(payment.type) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDateTime(payment.created_at) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Paiement -->
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="closePaymentModal">
      <div class="bg-white rounded-lg max-w-xl w-full mx-4 max-h-screen overflow-y-auto" @click.stop>
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            {{ selectedLocation ? `Paiement - ${selectedLocation.guest_details?.name + ' ' + selectedLocation.guest_details?.firstname}` : 'Nouveau Paiement' }}
          </h3>
          <button @click="closePaymentModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="processPayment" class="p-6 ">
          <div v-if="selectedLocation" class="bg-gray-100 rounded-lg p-4 mb-2">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Chambre:</span>
                <span class="font-medium ml-2">{{ selectedLocation.room_details?.number }}</span>
              </div>
              <div>
                <span class="text-gray-600">Prix total:</span>
                <span class="font-medium ml-2">{{ formatCurrency(selectedLocation.totalPrice) }}</span>
              </div>
              <div>
                <span class="text-gray-600">Déjà payé:</span>
                <span class="font-medium ml-2 text-green-600">{{ formatCurrency(selectedLocation.amountPaid) }}</span>
              </div>
              <div>
                <span class="text-gray-600">Dette restante:</span>
                <span class="font-medium ml-2 text-red-600">{{ formatCurrency(selectedLocation.amountDue) }}</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1  gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Type de paiement</label>
              <select v-model="paymentForm.status" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="pj">Payer jour actuel (PJ)</option>
                <option value="dp">Dette Payée (DP)</option>
                <option value="deposit">Payer tout le séjour (Deposit)</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Méthode de paiement</label>
              <select v-model="paymentForm.method" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="espece">Espèces</option>
                <option value="cheque">Chèque</option>
                <option value="visa">Carte bancaire</option>
                <option value="devise">Devise</option>
              </select>
            </div>

            <div v-if="paymentForm.type === 'dp'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de jours</label>
              <input v-model.number="paymentForm.days" type="number" min="1" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Montant</label>
              <input v-model.number="paymentForm.amount" type="number" step="0.01" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
          </div>

          <!-- <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Notes (optionnel)</label>
            <textarea v-model="paymentForm.notes" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"></textarea>
          </div> -->
          
          <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button type="button" @click="closePaymentModal" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800" :disabled="isProcessing">
              <span v-if="isProcessing">Traitement...</span>
              <span v-else>Confirmer le paiement</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { locationsAPI, paymentsAPI } from '@/services/api'
import {
  CreditCard, RefreshCw, TrendingUp, AlertTriangle, Wallet, DollarSign,
  Search, Bed, History, X,User, Plus, Calendar, Clock, CheckCircle, ChevronUp, ChevronDown
} from 'lucide-vue-next'

// État
const isLoading = ref(false)
const isProcessing = ref(false)
const activeTab = ref('active')
const showPaymentModal = ref(false)
const selectedLocation = ref(null)
const expandedLocationHistory = ref({})

// Données
const locations = ref([])
const payments = ref([])

// Filtres
const filters = ref({
  search: '',
  paymentStatus: '',
  paymentType: '',
  date: ''
})

// Formulaire de paiement
const paymentForm = ref({
  status: 'pj',
  method: 'espece',
  amount: 0,
  days: 1,
  notes: ''
})

// Onglets
const tabs = computed(() => [
  {
    id: 'active',
    name: 'Locations Actives',
    icon: Bed,
    count: activeLocations.value.length
  },
  {
    id: 'past',
    name: 'Locations Passées',
    icon: History,
    count: pastLocations.value.length
  },
  {
    id: 'payments',
    name: 'Historique Paiements',
    icon: CreditCard,
    count: payments.value.length
  }
])

// Computed - Locations filtrées
const activeLocations = computed(() => {
  let filtered = locations.value.filter(l => new Date(l.checkOut) >= new Date())

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(l => 
      l.guestName.toLowerCase().includes(search) || 
      l.roomNumber.includes(search)
    )
  }

  if (filters.value.paymentStatus) {
    filtered = filtered.filter(l => l.paymentStatus === filters.value.paymentStatus)
  }

  return filtered
})

const pastLocations = computed(() => {
  let filtered = locations.value.filter(l => new Date(l.checkOut) < new Date())

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(l => 
      l.guestName.toLowerCase().includes(search) || 
      l.roomNumber.includes(search)
    )
  }

  if (filters.value.paymentStatus) {
    filtered = filtered.filter(l => l.paymentStatus === filters.value.paymentStatus)
  }

  return filtered
})

// Computed - Statistiques
const todayRevenue = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return payments.value
    .filter(p => p.created_at.startsWith(today))
    .reduce((sum, p) => sum + p.amount, 0)
})

const totalDebts = computed(() => {
  return locations.value.reduce((sum, l) => sum + l.amountDue, 0)
})

const activeDeposits = computed(() => {
  return payments.value
    .filter(p => p.type === 'deposit' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)
})

const monthlyRevenue = computed(() => {
  const currentMonth = new Date().getMonth()
  return payments.value
    .filter(p => new Date(p.date).getMonth() === currentMonth && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)
})

// Computed - Données filtrées
const filteredPayments = computed(() => {
  let filtered = payments.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(p => 
      p.guestName.toLowerCase().includes(search) || 
      p.roomNumber.includes(search) ||
      p.booking.toLowerCase().includes(search)
    )
  }

  if (filters.value.paymentType) {
    filtered = filtered.filter(p => p.method === filters.value.paymentType)
  }

  if (filters.value.date) {
    filtered = filtered.filter(p => p.date.startsWith(filters.value.date))
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

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('fr-FR')
}

const getPaymentStatusClass = (status) => {
  const classes = {
    'pj': 'bg-green-100 text-green-800',
    'dp': 'bg-blue-100 text-blue-800',
    'dj': 'bg-yellow-100 text-yellow-800',
    'dt': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getPaymentStatusLabel = (status) => {
  const labels = {
    'pj': 'Payé jour',
    'dp': 'Dette payée',
    'dj': 'Dette jour',
    'dt': 'Dette totale'
  }
  return labels[status] || status
}

const getPaymentTypeClass = (type) => {
  const classes = {
    'pj': 'bg-green-100 text-green-800',
    'dp': 'bg-blue-100 text-blue-800',
    'deposit': 'bg-purple-100 text-purple-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getPaymentTypeLabel = (type) => {
  const labels = {
    'pj': 'Payé jour',
    'dp': 'Dette payée',
    'deposit': 'Deposit'
  }
  return labels[type] || type
}

const getPaymentMethodLabel = (method) => {
  const labels = {
    'espece': 'Espèces',
    'cheque': 'Chèque',
    'visa': 'Carte bancaire',
    'devise': 'Devise'
  }
  return labels[method] || method
}

const getRoomTypeColor = (roomType) => {
  const colors = {
    'standard': 'bg-blue-100 text-blue-600',
    'deluxe': 'bg-purple-100 text-purple-600',
    'suite': 'bg-amber-100 text-amber-600',
    'presidentielle': 'bg-emerald-100 text-emerald-600',
    'familiale': 'bg-rose-100 text-rose-600',
    'default': 'bg-gray-100 text-gray-600'
  }
  return colors[roomType?.toLowerCase()] || colors.default
}

// Méthode pour obtenir les paiements d'une location spécifique
const getLocationPayments = (booking) => {
  return payments.value
    .filter(payment => payment.booking === booking)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

// Méthode pour basculer l'affichage de l'historique d'une location
const toggleLocationHistory = (booking) => {
  expandedLocationHistory.value[booking] = !expandedLocationHistory.value[booking]
}

// Méthodes pour l'API
const fetchLocations = async () => {
  try {
    isLoading.value = true
    locations.value = await locationsAPI.getLocations()
  } catch (error) {
    console.error('Erreur lors de la récupération des locations:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchPayments = async () => {
  try {
    payments.value = await paymentsAPI.getPayments()
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error)
  }
}

const processPayment = async () => {
  try {
    isProcessing.value = true
    
    await paymentsAPI.createPayment({
      booking: selectedLocation.value?.id,
      ...paymentForm.value
    })

    // Rafraîchir les données
    await Promise.all([
      fetchLocations(),
      fetchPayments()
    ])

    closePaymentModal()
  } catch (error) {
    console.error('Erreur lors du traitement du paiement:', error)
  } finally {
    isProcessing.value = false
  }
}

// Actions
const refreshData = () => {
  isLoading.value = true
  // Simuler un appel API
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
}

const openPaymentModal = (location = null) => {
  selectedLocation.value = location
  if (location) {
    // Calculer le montant suggéré basé sur le tarif journalier
    const suggestedAmount = location.debtAmount > 0 ? Math.min(location.dailyRate, location.debtAmount) : location.dailyRate
    paymentForm.value.amount = suggestedAmount
  }
  showPaymentModal.value = true
}

const closePaymentModal = () => {
  showPaymentModal.value = false
  selectedLocation.value = null
  paymentForm.value = {
    type: 'pj',
    method: 'espece',
    amount: 0,
    days: 1,
    notes: ''
  }
}

const viewPaymentHistory = (location) => {
  activeTab.value = 'payments'
  filters.value.search = location.booking
}

const viewDepositDetails = (location) => {
  activeTab.value = 'payments'
  filters.value.search = location.booking
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchLocations(),
    fetchPayments()
  ])
})
</script> 