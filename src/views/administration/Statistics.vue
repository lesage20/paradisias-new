<template>
  <div class="space-y-6">
    <!-- Vue d'ensemble -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Carte Employés -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Employés</h3>
                <p class="text-sm text-gray-600">Gestion du personnel</p>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Total employés:</span>
                <span class="font-medium text-gray-900">{{ employeesStats.total }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Actifs:</span>
                <span class="font-medium text-green-600">{{ employeesStats.active }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Rôles:</span>
                <span class="font-medium text-gray-900">{{ employeesStats.roles }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-200">
          <RouterLink 
            to="/administration/employees"
            class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Gérer les employés
            <ArrowRight class="w-4 h-4 ml-1" />
          </RouterLink>
        </div>
      </div>

      <!-- Carte Dépenses -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <DollarSign class="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Dépenses</h3>
                <p class="text-sm text-gray-600">Suivi financier</p>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Ce mois:</span>
                <span class="font-medium text-red-600">{{ formatCurrency(expensesStats.thisMonth) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Aujourd'hui:</span>
                <span class="font-medium text-gray-900">{{ formatCurrency(expensesStats.today) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Transactions:</span>
                <span class="font-medium text-gray-900">{{ expensesStats.count }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-200">
          <RouterLink 
            to="/administration/expenses"
            class="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700"
          >
            Gérer les dépenses
            <ArrowRight class="w-4 h-4 ml-1" />
          </RouterLink>
        </div>
      </div>

      <!-- Carte Statistiques -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 class="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Rapports</h3>
                <p class="text-sm text-gray-600">Analyses avancées</p>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Revenus/Dépenses:</span>
                <span class="font-medium text-green-600">{{ formatCurrency(revenueVsExpenses) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Taux occupation:</span>
                <span class="font-medium text-gray-900">{{ occupancyRate }}%</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Dernière MAJ:</span>
                <span class="font-medium text-gray-900">{{ lastUpdate }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-200">
          <button 
            @click="refreshStats"
            class="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700"
            :disabled="isLoading"
          >
            <RefreshCw class="w-4 h-4 mr-1" :class="{ 'animate-spin': isLoading }" />
            Actualiser les données
          </button>
        </div>
      </div>
    </div>

    <!-- Graphiques et tendances -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Graphique des dépenses -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Dépenses des 7 derniers jours</h3>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <span class="text-sm text-gray-600">Dépenses</span>
          </div>
        </div>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div class="text-center">
            <TrendingDown class="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p class="text-sm text-gray-600">Graphique des dépenses</p>
            <p class="text-xs text-gray-500">Données simulées</p>
          </div>
        </div>
      </div>

      <!-- Activités récentes -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Activités récentes</h3>
        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="activity.iconBg">
              <component :is="activity.icon" class="w-4 h-4" :class="activity.iconColor" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
              <p class="text-xs text-gray-600">{{ activity.description }}</p>
            </div>
            <div class="text-xs text-gray-500">{{ activity.time }}</div>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-200">
          <button class="text-sm font-medium text-gray-600 hover:text-gray-900">
            Voir toutes les activités
          </button>
        </div>
      </div>
    </div>

    <!-- Actions rapides -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">Actions rapides</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          @click="$router.push('/administration/employees')"
          class="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <UserPlus class="w-6 h-6 text-blue-600" />
          <div class="text-left">
            <p class="font-medium text-gray-900">Ajouter un employé</p>
            <p class="text-sm text-gray-600">Nouveau membre du personnel</p>
          </div>
        </button>
        
        <button 
          @click="$router.push('/administration/expenses')"
          class="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Plus class="w-6 h-6 text-red-600" />
          <div class="text-left">
            <p class="font-medium text-gray-900">Nouvelle dépense</p>
            <p class="text-sm text-gray-600">Enregistrer une dépense</p>
          </div>
        </button>
        
        <button 
          @click="generateReport"
          class="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FileText class="w-6 h-6 text-purple-600" />
          <div class="text-left">
            <p class="font-medium text-gray-900">Générer rapport</p>
            <p class="text-sm text-gray-600">Rapport mensuel</p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  BarChart3, DollarSign, Users, ArrowRight, RefreshCw, TrendingDown,
  UserPlus, Plus, FileText, CreditCard, AlertTriangle, CheckCircle
} from 'lucide-vue-next'

// État
const isLoading = ref(false)

// Données mockées (en attendant l'intégration API)
const employeesStats = ref({
  total: 12,
  active: 11,
  roles: 4
})

const expensesStats = ref({
  thisMonth: 850000,
  today: 45000,
  count: 23
})

const revenueVsExpenses = computed(() => {
  // Simulation: revenus - dépenses
  return 2500000 - expensesStats.value.thisMonth
})

const occupancyRate = ref(78)
const lastUpdate = ref('Il y a 2h')

const recentActivities = ref([
  {
    id: 1,
    title: 'Nouvelle dépense ajoutée',
    description: 'Achat de produits d\'entretien - 25 000 FCFA',
    time: '2h',
    icon: DollarSign,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600'
  },
  {
    id: 2,
    title: 'Employé ajouté',
    description: 'Marie Kouassi - Femme de ménage',
    time: '4h',
    icon: UserPlus,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    id: 3,
    title: 'Paiement reçu',
    description: 'Location chambre 205 - 60 000 FCFA',
    time: '6h',
    icon: CreditCard,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: 4,
    title: 'Rapport généré',
    description: 'Rapport hebdomadaire des revenus',
    time: '1j',
    icon: FileText,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  }
])

// Méthodes utilitaires
const formatCurrency = (amount) => {
  if (!amount) return '0 FCFA'
  return new Intl.NumberFormat('fr-CI', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

// Actions
const refreshStats = () => {
  isLoading.value = true
  // Simuler un appel API
  setTimeout(() => {
    lastUpdate.value = 'Maintenant'
    isLoading.value = false
  }, 1500)
}

const generateReport = () => {
  // Simuler la génération d'un rapport
  alert('Génération du rapport en cours...')
}

// Lifecycle
onMounted(() => {
  // Charger les données initiales
  refreshStats()
})
</script> 