<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestion des Prix et Paiements</h1>
        <p class="text-gray-600 mt-1">Suivi des paiements, dettes et deposits des locations actives</p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <button @click="refreshData" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': isLoading }" />
          Actualiser
        </button>
        <button @click="openPaymentModal" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
          <CreditCard class="w-4 h-4 mr-2" />
          Nouveau Paiement
        </button>
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
            <p class="text-sm font-medium text-gray-600">Revenus aujourd'hui</p>
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
            <p class="text-sm font-medium text-gray-600">Revenus du mois</p>
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
        <div v-if="activeTab === 'locations'" class="space-y-4">
          <div v-for="location in filteredLocations" :key="location.id" class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Bed class="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ location.guestName }}</h3>
                  <p class="text-sm text-gray-600">{{ location.locationId }} • Chambre {{ location.roomNumber }} • {{ location.roomType }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(location.checkIn) }} - {{ formatDate(location.checkOut) }} ({{ location.totalDays }} jours)</p>
                </div>
              </div>
              <div class="text-right">
                <span :class="getPaymentStatusClass(location.paymentStatus)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ getPaymentStatusLabel(location.paymentStatus) }}
                </span>
                <p class="text-sm text-gray-600 mt-1">{{ formatCurrency(location.dailyRate) }}/jour</p>
              </div>
            </div>

            <!-- Détails financiers -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs text-gray-600">Prix total</p>
                <p class="text-lg font-semibold text-gray-900">{{ formatCurrency(location.totalPrice) }}</p>
              </div>
              <div class="bg-green-50 rounded-lg p-3">
                <p class="text-xs text-green-600">Payé</p>
                <p class="text-lg font-semibold text-green-700">{{ formatCurrency(location.paidAmount) }}</p>
              </div>
              <div class="bg-red-50 rounded-lg p-3">
                <p class="text-xs text-red-600">Dette</p>
                <p class="text-lg font-semibold text-red-700">{{ formatCurrency(location.debtAmount) }}</p>
              </div>
              <div class="bg-blue-50 rounded-lg p-3">
                <p class="text-xs text-blue-600">Deposit</p>
                <p class="text-lg font-semibold text-blue-700">{{ formatCurrency(location.depositAmount) }}</p>
              </div>
            </div>

            <!-- Progression des jours -->
            <div class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-medium text-gray-700">Progression du séjour</p>
                <p class="text-sm text-gray-600">{{ location.daysElapsed }}/{{ location.totalDays }} jours</p>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: (location.daysElapsed / location.totalDays * 100) + '%' }"
                ></div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-2">
              <button 
                @click="openPaymentModal(location)"
                class="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700"
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
              <button 
                @click="toggleLocationHistory(location.id)"
                class="inline-flex items-center px-3 py-2 border border-purple-300 rounded-lg text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100"
              >
                <component :is="expandedLocationHistory[location.id] ? 'ChevronUp' : 'ChevronDown'" class="w-4 h-4 mr-1" />
                Détails
              </button>
            </div>

            <!-- Historique des paiements de cette location (collapsible) -->
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-96"
              leave-active-class="transition-all duration-300 ease-in"
              leave-from-class="opacity-100 max-h-96"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-show="expandedLocationHistory[location.id]" class="mt-4 border-t border-gray-200 pt-4 overflow-hidden">
                <h4 class="text-sm font-medium text-gray-900 mb-3">Historique des paiements - {{ location.locationId }}</h4>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                  <div 
                    v-for="payment in getLocationPayments(location.locationId)" 
                    :key="payment.id"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CreditCard class="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ formatCurrency(payment.amount) }}</p>
                        <p class="text-xs text-gray-600">{{ formatDateTime(payment.date) }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <span :class="getPaymentTypeClass(payment.type)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                        {{ getPaymentTypeLabel(payment.type) }}
                      </span>
                      <p class="text-xs text-gray-600 mt-1">{{ payment.daysPaid }} jour{{ payment.daysPaid > 1 ? 's' : '' }} • {{ getPaymentMethodLabel(payment.method) }}</p>
                    </div>
                  </div>
                  <div v-if="getLocationPayments(location.locationId).length === 0" class="text-center py-4 text-gray-500 text-sm">
                    Aucun paiement enregistré pour cette location
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Onglet Historique des Paiements -->
        <div v-if="activeTab === 'payments'" class="space-y-4">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chambre</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jours payés</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="payment in filteredPayments" :key="payment.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDateTime(payment.date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600">
                    {{ payment.locationId }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ payment.guestName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ payment.roomNumber }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {{ formatCurrency(payment.amount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ payment.daysPaid }} jour{{ payment.daysPaid > 1 ? 's' : '' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getPaymentTypeClass(payment.type)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {{ getPaymentTypeLabel(payment.type) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ getPaymentMethodLabel(payment.method) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {{ payment.status === 'completed' ? 'Complété' : 'En attente' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Onglet Deposits -->
        <div v-if="activeTab === 'deposits'" class="space-y-4">
          <div v-for="deposit in activeDepositsList" :key="deposit.id" class="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ deposit.guestName }}</h3>
                <p class="text-sm text-gray-600">Chambre {{ deposit.roomNumber }} • Créé le {{ formatDate(deposit.createdAt) }}</p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-blue-600">{{ formatCurrency(deposit.remainingAmount) }}</p>
                <p class="text-sm text-gray-600">sur {{ formatCurrency(deposit.totalAmount) }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div class="bg-white rounded-lg p-3">
                <p class="text-xs text-gray-600">Tarif journalier</p>
                <p class="text-lg font-semibold text-gray-900">{{ formatCurrency(deposit.dailyRate) }}</p>
              </div>
              <div class="bg-white rounded-lg p-3">
                <p class="text-xs text-gray-600">Jours restants</p>
                <p class="text-lg font-semibold text-gray-900">{{ deposit.daysRemaining }}</p>
              </div>
              <div class="bg-white rounded-lg p-3">
                <p class="text-xs text-gray-600">Prochaine déduction</p>
                <p class="text-lg font-semibold text-gray-900">{{ formatDate(deposit.nextDeduction) }}</p>
              </div>
            </div>

            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: ((deposit.totalAmount - deposit.remainingAmount) / deposit.totalAmount * 100) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Paiement -->
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="closePaymentModal">
      <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto" @click.stop>
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            {{ selectedLocation ? `Paiement - ${selectedLocation.guestName}` : 'Nouveau Paiement' }}
          </h3>
          <button @click="closePaymentModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="processPayment" class="p-6 space-y-6">
          <div v-if="selectedLocation" class="bg-gray-50 rounded-lg p-4">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Chambre:</span>
                <span class="font-medium ml-2">{{ selectedLocation.roomNumber }}</span>
              </div>
              <div>
                <span class="text-gray-600">Prix total:</span>
                <span class="font-medium ml-2">{{ formatCurrency(selectedLocation.totalPrice) }}</span>
              </div>
              <div>
                <span class="text-gray-600">Déjà payé:</span>
                <span class="font-medium ml-2 text-green-600">{{ formatCurrency(selectedLocation.paidAmount) }}</span>
              </div>
              <div>
                <span class="text-gray-600">Dette restante:</span>
                <span class="font-medium ml-2 text-red-600">{{ formatCurrency(selectedLocation.debtAmount) }}</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Type de paiement</label>
              <select v-model="paymentForm.type" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="pj">Payer jour actuel (PJ)</option>
                <option value="dp">Payer plusieurs jours (DP)</option>
                <option value="deposit">Payer toute la location (Deposit)</option>
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

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Notes (optionnel)</label>
            <textarea v-model="paymentForm.notes" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"></textarea>
          </div>
          
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
import {
  CreditCard, RefreshCw, TrendingUp, AlertTriangle, Wallet, DollarSign,
  Search, Bed, History, X, Calendar, Clock, CheckCircle, ChevronUp, ChevronDown
} from 'lucide-vue-next'

// État
const isLoading = ref(false)
const isProcessing = ref(false)
const activeTab = ref('locations')
const showPaymentModal = ref(false)
const selectedLocation = ref(null)
const expandedLocationHistory = ref({})

// Données mockées (en attendant l'API)
const locations = ref([
  {
    id: 1,
    locationId: 'LOC-2024-001',
    guestName: 'Jean Dupont',
    roomNumber: '101',
    roomType: 'Standard',
    checkIn: '2024-01-15',
    checkOut: '2024-01-20',
    totalPrice: 250000,
    paidAmount: 150000,
    debtAmount: 100000,
    depositAmount: 0,
    paymentStatus: 'dp',
    totalDays: 5,
    daysElapsed: 3,
    dailyRate: 50000
  },
  {
    id: 2,
    locationId: 'LOC-2024-002',
    guestName: 'Marie Martin',
    roomNumber: '205',
    roomType: 'Deluxe',
    checkIn: '2024-01-16',
    checkOut: '2024-01-23',
    totalPrice: 420000,
    paidAmount: 420000,
    debtAmount: 0,
    depositAmount: 280000,
    paymentStatus: 'pj',
    totalDays: 7,
    daysElapsed: 2,
    dailyRate: 60000
  },
  {
    id: 3,
    locationId: 'LOC-2024-003',
    guestName: 'Paul Durand',
    roomNumber: '103',
    roomType: 'Standard',
    checkIn: '2024-01-17',
    checkOut: '2024-01-19',
    totalPrice: 120000,
    paidAmount: 60000,
    debtAmount: 60000,
    paymentStatus: 'dj',
    totalDays: 2,
    daysElapsed: 1,
    dailyRate: 60000
  }
])

const payments = ref([
  {
    id: 1,
    locationId: 'LOC-2024-001',
    date: '2024-01-18T10:30:00',
    guestName: 'Jean Dupont',
    roomNumber: '101',
    amount: 50000,
    type: 'pj',
    method: 'espece',
    status: 'completed',
    daysPaid: 1,
    notes: 'Paiement jour 3 du séjour'
  },
  {
    id: 2,
    locationId: 'LOC-2024-001',
    date: '2024-01-16T09:15:00',
    guestName: 'Jean Dupont',
    roomNumber: '101',
    amount: 100000,
    type: 'dp',
    method: 'visa',
    status: 'completed',
    daysPaid: 2,
    notes: 'Paiement anticipé 2 jours'
  },
  {
    id: 3,
    locationId: 'LOC-2024-002',
    date: '2024-01-16T14:15:00',
    guestName: 'Marie Martin',
    roomNumber: '205',
    amount: 420000,
    type: 'deposit',
    method: 'visa',
    status: 'completed',
    daysPaid: 7,
    notes: 'Paiement complet du séjour'
  },
  {
    id: 4,
    locationId: 'LOC-2024-003',
    date: '2024-01-17T09:45:00',
    guestName: 'Paul Durand',
    roomNumber: '103',
    amount: 60000,
    type: 'dp',
    method: 'cheque',
    status: 'completed',
    daysPaid: 1,
    notes: 'Paiement premier jour'
  }
])

const deposits = ref([
  {
    id: 1,
    locationId: 'LOC-2024-002',
    guestName: 'Marie Martin',
    roomNumber: '205',
    totalAmount: 420000,
    remainingAmount: 280000,
    dailyRate: 60000,
    daysRemaining: 5,
    createdAt: '2024-01-16',
    nextDeduction: '2024-01-19'
  }
])

// Filtres
const filters = ref({
  search: '',
  paymentStatus: '',
  paymentType: '',
  date: ''
})

// Formulaire de paiement
const paymentForm = ref({
  type: 'pj',
  method: 'espece',
  amount: 0,
  days: 1,
  notes: ''
})

// Onglets
const tabs = computed(() => [
  {
    id: 'locations',
    name: 'Locations Actives',
    icon: Bed,
    count: locations.value.length
  },
  {
    id: 'payments',
    name: 'Historique Paiements',
    icon: CreditCard,
    count: payments.value.length
  },
  {
    id: 'deposits',
    name: 'Deposits Actifs',
    icon: Wallet,
    count: deposits.value.length
  }
])

// Computed - Statistiques
const todayRevenue = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return payments.value
    .filter(p => p.date.startsWith(today) && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)
})

const totalDebts = computed(() => {
  return locations.value.reduce((sum, l) => sum + l.debtAmount, 0)
})

const activeDeposits = computed(() => {
  return deposits.value.reduce((sum, d) => sum + d.remainingAmount, 0)
})

const monthlyRevenue = computed(() => {
  const currentMonth = new Date().getMonth()
  return payments.value
    .filter(p => new Date(p.date).getMonth() === currentMonth && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)
})

// Computed - Données filtrées
const filteredLocations = computed(() => {
  let filtered = locations.value

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

const filteredPayments = computed(() => {
  let filtered = payments.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(p => 
      p.guestName.toLowerCase().includes(search) || 
      p.roomNumber.includes(search) ||
      p.locationId.toLowerCase().includes(search)
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

const activeDepositsList = computed(() => {
  return deposits.value.filter(d => d.remainingAmount > 0)
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

// Méthode pour obtenir les paiements d'une location spécifique
const getLocationPayments = (locationId) => {
  return payments.value
    .filter(payment => payment.locationId === locationId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

// Méthode pour basculer l'affichage de l'historique d'une location
const toggleLocationHistory = (locationId) => {
  expandedLocationHistory.value[locationId] = !expandedLocationHistory.value[locationId]
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

const processPayment = () => {
  isProcessing.value = true
  
  // Simuler le traitement du paiement
  setTimeout(() => {
    // Calculer le nombre de jours payés
    const daysPaid = paymentForm.value.type === 'dp' ? paymentForm.value.days : 
                    paymentForm.value.type === 'deposit' ? selectedLocation.value?.totalDays || 1 : 1
    
    // Ajouter le paiement à l'historique
    const newPayment = {
      id: payments.value.length + 1,
      locationId: selectedLocation.value?.locationId || 'LOC-NEW',
      date: new Date().toISOString(),
      guestName: selectedLocation.value?.guestName || 'Client',
      roomNumber: selectedLocation.value?.roomNumber || 'N/A',
      amount: paymentForm.value.amount,
      type: paymentForm.value.type,
      method: paymentForm.value.method,
      status: 'completed',
      daysPaid: daysPaid,
      notes: paymentForm.value.notes || `Paiement ${getPaymentTypeLabel(paymentForm.value.type)}`
    }
    
    payments.value.unshift(newPayment)
    
    // Mettre à jour la location si sélectionnée
    if (selectedLocation.value) {
      const location = locations.value.find(l => l.id === selectedLocation.value.id)
      if (location) {
        location.paidAmount += paymentForm.value.amount
        location.debtAmount = Math.max(0, location.debtAmount - paymentForm.value.amount)
        
        // Créer un deposit si paiement complet
        if (paymentForm.value.type === 'deposit') {
          const newDeposit = {
            id: deposits.value.length + 1,
            locationId: location.locationId,
            guestName: location.guestName,
            roomNumber: location.roomNumber,
            totalAmount: paymentForm.value.amount,
            remainingAmount: paymentForm.value.amount,
            dailyRate: location.dailyRate,
            daysRemaining: location.totalDays - location.daysElapsed,
            createdAt: new Date().toISOString().split('T')[0],
            nextDeduction: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
          deposits.value.push(newDeposit)
          location.depositAmount = newDeposit.remainingAmount
        }
        
        // Mettre à jour le statut de paiement
        if (location.debtAmount === 0) {
          location.paymentStatus = 'pj'
        } else if (location.paidAmount > 0) {
          location.paymentStatus = 'dp'
        }
      }
    }
    
    isProcessing.value = false
    closePaymentModal()
  }, 2000)
}

const viewPaymentHistory = (location) => {
  activeTab.value = 'payments'
  filters.value.search = location.locationId
}

const viewDepositDetails = (location) => {
  activeTab.value = 'deposits'
  filters.value.search = location.locationId
}

// Lifecycle
onMounted(() => {
  refreshData()
})
</script> 