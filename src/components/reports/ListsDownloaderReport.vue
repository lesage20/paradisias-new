<template>
  <div class="space-y-6">
    <!-- En-tête du téléchargeur -->
    <div class="bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold">Téléchargeur de Listes</h2>
          <p class="text-gray-100 mt-1">Export et téléchargement de données complètes</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-100">Dernière mise à jour</p>
          <p class="text-lg font-semibold">{{ currentTime }}</p>
        </div>
      </div>
    </div>

    <!-- Sélection des listes à télécharger -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Liste des clients -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users class="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Clients</h3>
              <p class="text-sm text-gray-600">{{ clientsData.length }} enregistrements</p>
            </div>
          </div>
        </div>
        
        <div class="space-y-3">
          <div class="text-sm text-gray-600">
            <p>• Informations personnelles</p>
            <p>• Historique des séjours</p>
            <p>• Données de contact</p>
          </div>
          
          <div class="flex space-x-2">
            <button 
              @click="downloadList('clients', 'csv')"
              class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
            >
              <Download class="w-4 h-4 mr-1" />
              CSV
            </button>
            <button 
              @click="downloadList('clients', 'excel')"
              class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100"
            >
              <FileSpreadsheet class="w-4 h-4 mr-1" />
              Excel
            </button>
          </div>
        </div>
      </div>

      <!-- Liste des locations -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar class="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Locations</h3>
              <p class="text-sm text-gray-600">{{ locationsData.length }} enregistrements</p>
            </div>
          </div>
        </div>
        
        <div class="space-y-3">
          <div class="text-sm text-gray-600">
            <p>• Détails des séjours</p>
            <p>• Tarification</p>
            <p>• Dates et durées</p>
          </div>
          
          <div class="flex space-x-2">
            <button 
              @click="downloadList('locations', 'csv')"
              class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
            >
              <Download class="w-4 h-4 mr-1" />
              CSV
            </button>
            <button 
              @click="downloadList('locations', 'excel')"
              class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100"
            >
              <FileSpreadsheet class="w-4 h-4 mr-1" />
              Excel
            </button>
          </div>
        </div>
      </div>

      <!-- Liste des réservations -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen class="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Réservations</h3>
              <p class="text-sm text-gray-600">{{ reservationsData.length }} enregistrements</p>
            </div>
          </div>
        </div>
        
        <div class="space-y-3">
          <div class="text-sm text-gray-600">
            <p>• Statuts des réservations</p>
            <p>• Dates de création</p>
            <p>• Informations client</p>
          </div>
          
          <div class="flex space-x-2">
            <button 
              @click="downloadList('reservations', 'csv')"
              class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
            >
              <Download class="w-4 h-4 mr-1" />
              CSV
            </button>
            <button 
              @click="downloadList('reservations', 'excel')"
              class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100"
            >
              <FileSpreadsheet class="w-4 h-4 mr-1" />
              Excel
            </button>
          </div>
        </div>
      </div>

      <!-- Liste des chambres -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Building class="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Chambres</h3>
              <p class="text-sm text-gray-600">{{ chambersData.length }} enregistrements</p>
            </div>
          </div>
        </div>
        
        <div class="space-y-3">
          <div class="text-sm text-gray-600">
            <p>• Configuration des chambres</p>
            <p>• Types et tarifs</p>
            <p>• État et disponibilité</p>
          </div>
          
          <div class="flex space-x-2">
            <button 
              @click="downloadList('chambres', 'csv')"
              class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
            >
              <Download class="w-4 h-4 mr-1" />
              CSV
            </button>
            <button 
              @click="downloadList('chambres', 'excel')"
              class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100"
            >
              <FileSpreadsheet class="w-4 h-4 mr-1" />
              Excel
            </button>
          </div>
        </div>
      </div>

      <!-- Liste des dépenses -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <CreditCard class="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Dépenses</h3>
              <p class="text-sm text-gray-600">{{ expensesData.length }} enregistrements</p>
            </div>
          </div>
        </div>
        
        <div class="space-y-3">
          <div class="text-sm text-gray-600">
            <p>• Détail des dépenses</p>
            <p>• Catégorisation</p>
            <p>• Dates et montants</p>
          </div>
          
          <div class="flex space-x-2">
            <button 
              @click="downloadList('depenses', 'csv')"
              class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
            >
              <Download class="w-4 h-4 mr-1" />
              CSV
            </button>
            <button 
              @click="downloadList('depenses', 'excel')"
              class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100"
            >
              <FileSpreadsheet class="w-4 h-4 mr-1" />
              Excel
            </button>
          </div>
        </div>
      </div>

      <!-- Liste du personnel -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <UserCheck class="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Personnel</h3>
              <p class="text-sm text-gray-600">{{ employeesData.length }} enregistrements</p>
            </div>
          </div>
        </div>
        
        <div class="space-y-3">
          <div class="text-sm text-gray-600">
            <p>• Informations employés</p>
            <p>• Rôles et permissions</p>
            <p>• Données de contact</p>
          </div>
          
          <div class="flex space-x-2">
            <button 
              @click="downloadList('employes', 'csv')"
              class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
            >
              <Download class="w-4 h-4 mr-1" />
              CSV
            </button>
            <button 
              @click="downloadList('employes', 'excel')"
              class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100"
            >
              <FileSpreadsheet class="w-4 h-4 mr-1" />
              Excel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Export complet -->
    <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Archive class="w-5 h-5 mr-2" />
        Export complet de toutes les données
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-3">
          <p class="text-sm text-gray-600">
            Téléchargez toutes les données de l'hôtel dans un fichier unique comprenant :
          </p>
          <ul class="text-sm text-gray-600 space-y-1">
            <li>• Toutes les listes ci-dessus</li>
            <li>• Métadonnées et relations</li>
            <li>• Horodatage de l'export</li>
            <li>• Validation des données</li>
          </ul>
        </div>
        
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <button 
              @click="downloadComplete('csv')"
              :disabled="isExporting"
              class="inline-flex items-center justify-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
            >
              <Download class="w-4 h-4 mr-2" />
              <span v-if="isExporting">Export...</span>
              <span v-else>CSV Complet</span>
            </button>
            <button 
              @click="downloadComplete('excel')"
              :disabled="isExporting"
              class="inline-flex items-center justify-center px-4 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 disabled:opacity-50"
            >
              <FileSpreadsheet class="w-4 h-4 mr-2" />
              <span v-if="isExporting">Export...</span>
              <span v-else>Excel Complet</span>
            </button>
          </div>
          
          <p class="text-xs text-gray-500">
            L'export complet peut prendre quelques minutes selon la quantité de données.
          </p>
        </div>
      </div>
    </div>

    <!-- Filtres et options -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Filter class="w-5 h-5 mr-2" />
          Options de filtrage
        </h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Filtre par période -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Période</label>
            <select 
              v-model="filterPeriod"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les données</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
              <option value="custom">Période personnalisée</option>
            </select>
          </div>
          
          <!-- Date de début (si période personnalisée) -->
          <div v-if="filterPeriod === 'custom'">
            <label class="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
            <input 
              v-model="customStartDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <!-- Date de fin (si période personnalisée) -->
          <div v-if="filterPeriod === 'custom'">
            <label class="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
            <input 
              v-model="customEndDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <!-- Format d'export par défaut -->
          <div v-if="filterPeriod !== 'custom'">
            <label class="block text-sm font-medium text-gray-700 mb-2">Format par défaut</label>
            <select 
              v-model="defaultFormat"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
            </select>
          </div>
        </div>
        
        <div class="mt-6 flex items-center space-x-4">
          <label class="flex items-center">
            <input 
              v-model="includeMetadata"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">Inclure les métadonnées</span>
          </label>
          
          <label class="flex items-center">
            <input 
              v-model="compressFiles"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">Compresser les fichiers (ZIP)</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Historique des exports -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <History class="w-5 h-5 mr-2" />
          Historique des exports
        </h3>
      </div>
      <div class="p-6">
        <div v-if="exportHistory.length === 0" class="text-center py-8 text-gray-500">
          <History class="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p>Aucun export récent</p>
        </div>
        <div v-else class="space-y-3">
          <div 
            v-for="export_ in exportHistory" 
            :key="export_.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Download class="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ export_.name }}</p>
                <p class="text-xs text-gray-500">{{ formatDateTime(export_.date) }} • {{ export_.size }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span 
                class="text-xs px-2 py-1 rounded-full"
                :class="getStatusClass(export_.status)"
              >
                {{ getStatusText(export_.status) }}
              </span>
              <button 
                v-if="export_.status === 'completed'"
                @click="redownload(export_)"
                class="text-blue-600 hover:text-blue-800 text-sm"
              >
                Retélécharger
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { 
  Users, Calendar, BookOpen, Building, CreditCard, UserCheck, 
  Download, FileSpreadsheet, Archive, Filter, History 
} from 'lucide-vue-next'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  period: {
    type: String,
    default: 'today'
  },
  customDate: {
    type: String,
    default: ''
  }
})

const currentTime = ref('')
const isExporting = ref(false)
const filterPeriod = ref('all')
const customStartDate = ref('')
const customEndDate = ref('')
const defaultFormat = ref('csv')
const includeMetadata = ref(true)
const compressFiles = ref(false)

// Mettre à jour l'heure actuelle
const updateCurrentTime = () => {
  currentTime.value = new Date().toLocaleTimeString('fr-FR')
}

onMounted(() => {
  updateCurrentTime()
  setInterval(updateCurrentTime, 1000)
})

// Données filtrées
const clientsData = computed(() => props.data.clients || [])
const locationsData = computed(() => props.data.locations || [])
const reservationsData = computed(() => props.data.reservations || [])
const chambersData = computed(() => props.data.chambers || [])
const expensesData = computed(() => props.data.expenses || [])
const employeesData = computed(() => props.data.employees || [])

// Historique des exports (simulation)
const exportHistory = ref([
  {
    id: 1,
    name: 'Export complet clients',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    size: '2.3 MB',
    status: 'completed',
    format: 'excel'
  },
  {
    id: 2,
    name: 'Export locations du mois',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    size: '1.8 MB',
    status: 'completed',
    format: 'csv'
  },
  {
    id: 3,
    name: 'Export en cours...',
    date: new Date().toISOString(),
    size: '...',
    status: 'processing',
    format: 'excel'
  }
])

// Fonctions d'export
const downloadList = async (listType, format) => {
  console.log(`Téléchargement de la liste ${listType} en format ${format}`)
  
  // Simuler le processus d'export
  const exportData = getDataForExport(listType)
  const fileName = `${listType}_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.${format}`
  
  if (format === 'csv') {
    downloadCSV(exportData, fileName)
  } else if (format === 'excel') {
    downloadExcel(exportData, fileName)
  }
  
  // Ajouter à l'historique
  addToHistory(fileName, format)
}

const downloadComplete = async (format) => {
  isExporting.value = true
  
  try {
    console.log(`Export complet en format ${format}`)
    
    // Simuler le temps d'export
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const fileName = `export_complet_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.${format}`
    
    // Préparer toutes les données
    const completeData = {
      clients: clientsData.value,
      locations: locationsData.value,
      reservations: reservationsData.value,
      chambres: chambersData.value,
      depenses: expensesData.value,
      employes: employeesData.value,
      metadata: {
        exportDate: new Date().toISOString(),
        totalRecords: getTotalRecords(),
        filters: getActiveFilters()
      }
    }
    
    if (format === 'csv') {
      downloadMultipleCSV(completeData, fileName)
    } else {
      downloadCompleteExcel(completeData, fileName)
    }
    
    addToHistory(fileName, format)
  } finally {
    isExporting.value = false
  }
}

const getDataForExport = (listType) => {
  const dataMap = {
    clients: clientsData.value.map(client => ({
      ID: client.id,
      Nom: client.nom || client.name,
      Email: client.email,
      Téléphone: client.telephone || client.phone,
      Adresse: client.adresse || client.address,
      'Date création': formatDate(client.created_at || client.dateCreation),
      'Nombre séjours': getClientStayCount(client.id)
    })),
    locations: locationsData.value.map(location => ({
      ID: location.id,
      Client: location.client?.nom || 'N/A',
      Chambre: location.chambre?.numero || 'N/A',
      'Check-in': formatDate(location.checkIn_date || location.checkIn),
      'Check-out': formatDate(location.checkOut_date || location.checkOut),
      'Prix total': location.totalPrice || 0,
      Statut: location.status || 'active'
    })),
    reservations: reservationsData.value.map(reservation => ({
      ID: reservation.id,
      Client: reservation.client?.nom || 'N/A',
      Chambre: reservation.chambre?.numero || 'N/A',
      'Date création': formatDate(reservation.created_at || reservation.dateCreation),
      'Check-in prévu': formatDate(reservation.checkIn_date || reservation.checkIn),
      'Check-out prévu': formatDate(reservation.checkOut_date || reservation.checkOut),
      'Prix total': reservation.totalPrice || 0,
      Statut: reservation.status || 'pending'
    })),
    chambres: chambersData.value.map(chamber => ({
      ID: chamber.id,
      Numéro: chamber.numero,
      Type: chamber.typeChambre?.nom || 'Standard',
      Étage: chamber.etage?.nom || 'N/A',
      'Prix par nuit': chamber.typeChambre?.prix || 0,
      Statut: chamber.status || 'available'
    })),
    depenses: expensesData.value.map(expense => ({
      ID: expense.id,
      Description: expense.description,
      Montant: expense.montant || expense.amount,
      Catégorie: expense.categorie || expense.category,
      Date: formatDate(expense.date || expense.created_at),
      'Créé par': expense.created_by || 'N/A'
    })),
    employes: employeesData.value.map(employee => ({
      ID: employee.id,
      Nom: employee.nom || employee.name,
      Poste: employee.poste || employee.position,
      Email: employee.email,
      Téléphone: employee.telephone || employee.phone,
      'Date embauche': formatDate(employee.date_embauche || employee.hireDate),
      Statut: employee.status || 'active'
    }))
  }
  
  return dataMap[listType] || []
}

const downloadCSV = (data, fileName) => {
  if (data.length === 0) {
    alert('Aucune donnée à exporter')
    return
  }
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  link.click()
}

const downloadExcel = (data, fileName) => {
  console.log(`Export Excel simulé pour ${fileName}`)
  // En pratique, utiliser une bibliothèque comme SheetJS/xlsx
  alert(`Export Excel simulé: ${fileName}`)
}

const downloadMultipleCSV = (completeData, fileName) => {
  console.log(`Export CSV multiple simulé pour ${fileName}`)
  alert(`Export CSV complet simulé: ${fileName}`)
}

const downloadCompleteExcel = (completeData, fileName) => {
  console.log(`Export Excel complet simulé pour ${fileName}`)
  alert(`Export Excel complet simulé: ${fileName}`)
}

const addToHistory = (fileName, format) => {
  exportHistory.value.unshift({
    id: Date.now(),
    name: fileName,
    date: new Date().toISOString(),
    size: Math.random() > 0.5 ? `${(Math.random() * 5 + 0.5).toFixed(1)} MB` : `${Math.floor(Math.random() * 900 + 100)} KB`,
    status: 'completed',
    format
  })
  
  // Garder seulement les 10 derniers exports
  if (exportHistory.value.length > 10) {
    exportHistory.value = exportHistory.value.slice(0, 10)
  }
}

const redownload = (export_) => {
  console.log(`Retéléchargement de ${export_.name}`)
  alert(`Retéléchargement simulé de ${export_.name}`)
}

// Fonctions utilitaires
const getClientStayCount = (clientId) => {
  return locationsData.value.filter(location => location.client?.id === clientId).length
}

const getTotalRecords = () => {
  return clientsData.value.length + 
         locationsData.value.length + 
         reservationsData.value.length + 
         chambersData.value.length + 
         expensesData.value.length + 
         employeesData.value.length
}

const getActiveFilters = () => {
  return {
    period: filterPeriod.value,
    customStartDate: customStartDate.value,
    customEndDate: customEndDate.value,
    includeMetadata: includeMetadata.value,
    compressFiles: compressFiles.value
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('fr-FR')
}

const getStatusClass = (status) => {
  const classes = {
    completed: 'bg-green-100 text-green-800',
    processing: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800'
  }
  return classes[status] || classes.completed
}

const getStatusText = (status) => {
  const texts = {
    completed: 'Terminé',
    processing: 'En cours',
    failed: 'Échec'
  }
  return texts[status] || texts.completed
}
</script> 