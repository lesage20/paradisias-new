<template>
  <div class="bg-white rounded-lg border border-gray-200">
    <!-- En-tête avec filtres -->
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Rapport global</h3>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <button 
              @click="selectedPeriod = 'day'"
              :class="selectedPeriod === 'day' ? 'bg-teal-100 text-teal-700 border-teal-300' : 'bg-white text-gray-700 border-gray-300'"
              class="px-3 py-1 border rounded text-sm font-medium"
            >
              Jour
            </button>
            <button 
              @click="selectedPeriod = 'week'"
              :class="selectedPeriod === 'week' ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-white text-gray-700 border-gray-300'"
              class="px-3 py-1 border rounded text-sm font-medium"
            >
              Semaine
            </button>
            <button 
              @click="selectedPeriod = 'month'"
              :class="selectedPeriod === 'month' ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-white text-gray-700 border-gray-300'"
              class="px-3 py-1 border rounded text-sm font-medium"
            >
              Mois
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu PDF -->
    <div ref="pdfContent" class="p-6">
      <!-- En-tête PDF -->
      <div class="flex justify-between items-center text-xs text-gray-600 mb-4">
        <span>Paradisias Hotel</span>
        <span>Tel: +225 0787572030</span>
      </div>
      <hr class="mb-6">
      
      <!-- Titre -->
      <div class="text-center mb-6">
        <h1 class="text-xl font-bold uppercase">Rapport global d'activité</h1>
        <p class="text-sm text-gray-600 mt-2">
          Période: {{ getPeriodText() }}
        </p>
      </div>

      <!-- Section Hébergement -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">HÉBERGEMENT</h3>
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2 text-left font-medium">Indicateur</th>
              <th class="border border-gray-300 px-4 py-2 text-center font-medium">Valeur</th>
              <th class="border border-gray-300 px-4 py-2 text-left font-medium">Observations</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in accommodationRows" :key="row.label">
              <td class="border border-gray-300 px-4 py-2">{{ row.label }}</td>
              <td class="border border-gray-300 px-4 py-2 text-center">
                {{ formatValue(row.value, row.isPrice, row.isPercent) }}
              </td>
              <td class="border border-gray-300 px-4 py-2">
                <input 
                  v-if="row.editable"
                  v-model="row.observation"
                  type="text"
                  class="w-full border-none bg-transparent focus:outline-none"
                  placeholder="Ajouter une observation..."
                />
                <span v-else>{{ row.observation || '' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Section Financière -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">FINANCES</h3>
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2 text-left font-medium">Indicateur</th>
              <th class="border border-gray-300 px-4 py-2 text-center font-medium">Montant</th>
              <th class="border border-gray-300 px-4 py-2 text-left font-medium">Observations</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in financialRows" :key="row.label">
              <td class="border border-gray-300 px-4 py-2">{{ row.label }}</td>
              <td class="border border-gray-300 px-4 py-2 text-center">
                {{ formatValue(row.value, row.isPrice) }}
              </td>
              <td class="border border-gray-300 px-4 py-2">
                <input 
                  v-if="row.editable"
                  v-model="row.observation"
                  type="text"
                  class="w-full border-none bg-transparent focus:outline-none"
                  placeholder="Ajouter une observation..."
                />
                <span v-else>{{ row.observation || '' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Section Opérationnelle -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">OPÉRATIONS</h3>
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2 text-left font-medium">Indicateur</th>
              <th class="border border-gray-300 px-4 py-2 text-center font-medium">Valeur</th>
              <th class="border border-gray-300 px-4 py-2 text-left font-medium">Observations</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in operationalRows" :key="row.label">
              <td class="border border-gray-300 px-4 py-2">{{ row.label }}</td>
              <td class="border border-gray-300 px-4 py-2 text-center">
                {{ formatValue(row.value, row.isPrice) }}
              </td>
              <td class="border border-gray-300 px-4 py-2">
                <input 
                  v-if="row.editable"
                  v-model="row.observation"
                  type="text"
                  class="w-full border-none bg-transparent focus:outline-none"
                  placeholder="Ajouter une observation..."
                />
                <span v-else>{{ row.observation || '' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Synthèse -->
      <div class="mt-8 p-4 bg-gray-50 border border-gray-300 rounded">
        <h4 class="font-semibold text-gray-900 mb-3">Synthèse de la période</h4>
        <textarea 
          v-model="globalNotes"
          rows="4"
          class="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ajouter une synthèse globale, points d'attention, recommandations..."
        ></textarea>
      </div>
    </div>

    <!-- Actions -->
    <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-600">
          Rapport global • Période: {{ getPeriodText() }}
        </div>
        <div class="flex space-x-3">
          <button 
            @click="showPreview = true"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Eye class="w-4 h-4 mr-2" />
            Aperçu PDF
          </button>
          <button 
            @click="generatePdf"
            :disabled="isGenerating"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Download class="w-4 h-4 mr-2" />
            <span v-if="isGenerating">Génération...</span>
            <span v-else>Télécharger PDF</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal d'aperçu -->
    <div v-if="showPreview" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="showPreview = false">
      <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto" @click.stop>
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Aperçu - Rapport global</h3>
          <button @click="showPreview = false" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>
        <div class="p-6">
          <div v-html="getPdfContent()" class="prose max-w-none"></div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button @click="showPreview = false" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Fermer
          </button>
          <button @click="generatePdf" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            Télécharger PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Eye, Download, X } from 'lucide-vue-next'
import html2pdf from 'html2pdf.js'
import { isToday, isThisWeek, isThisMonth } from 'date-fns'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  period: {
    type: String,
    default: 'today'
  }
})

const selectedPeriod = ref('day')
const globalNotes = ref('')
const showPreview = ref(false)
const isGenerating = ref(false)

// Calculs de base
const filteredData = computed(() => {
  const locations = props.data.locations || []
  const reservations = props.data.reservations || []
  const expenses = props.data.expenses || []
  
  const filtered = {
    locations: locations.filter(item => matchesPeriod(item.checkIn_date || item.checkIn)),
    reservations: reservations.filter(item => matchesPeriod(item.checkIn_date || item.checkIn)),
    expenses: expenses.filter(item => matchesPeriod(item.date))
  }
  
  return filtered
})

const matchesPeriod = (dateString) => {
  if (!dateString) return false
  const date = new Date(dateString)
  
  switch (selectedPeriod.value) {
    case 'day': return isToday(date)
    case 'week': return isThisWeek(date)
    case 'month': return isThisMonth(date)
    default: return true
  }
}

// Métriques d'hébergement
const totalRooms = computed(() => props.data.chambers?.length || 0)
const occupiedRooms = computed(() => filteredData.value.locations.length)
const occupancyRate = computed(() => totalRooms.value > 0 ? Math.round((occupiedRooms.value / totalRooms.value) * 100) : 0)
const avgStayDuration = computed(() => {
  const locations = filteredData.value.locations
  if (locations.length === 0) return 0
  
  const totalDays = locations.reduce((sum, loc) => {
    const checkIn = new Date(loc.checkIn_date || loc.checkIn)
    const checkOut = new Date(loc.checkOut_date || loc.checkOut)
    return sum + Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
  }, 0)
  
  return Math.round(totalDays / locations.length)
})

// Métriques financières
const totalRevenue = computed(() => 
  filteredData.value.locations.reduce((sum, loc) => sum + (loc.totalPrice || 0), 0)
)
const totalExpenses = computed(() => 
  filteredData.value.expenses.reduce((sum, exp) => sum + (exp.montant || 0), 0)
)
const netIncome = computed(() => totalRevenue.value - totalExpenses.value)
const averageRate = computed(() => 
  occupiedRooms.value > 0 ? Math.round(totalRevenue.value / occupiedRooms.value) : 0
)

// Métriques opérationnelles
const totalReservations = computed(() => filteredData.value.reservations.length)
const pendingPayments = computed(() => 
  filteredData.value.locations.filter(loc => (loc.totalPrice || 0) > (loc.paidAmount || 0)).length
)

// Données des tableaux
const accommodationRows = ref([
  { label: 'Nombre total de chambres', value: totalRooms, editable: true, observation: '' },
  { label: 'Chambres occupées', value: occupiedRooms, editable: true, observation: '' },
  { label: 'Taux d\'occupation', value: occupancyRate, isPercent: true, editable: true, observation: '' },
  { label: 'Durée moyenne de séjour', value: avgStayDuration, editable: true, observation: 'jours' },
  { label: 'Nouvelles réservations', value: totalReservations, editable: true, observation: '' }
])

const financialRows = ref([
  { label: 'Chiffre d\'affaires', value: totalRevenue, isPrice: true, editable: true, observation: '' },
  { label: 'Dépenses', value: totalExpenses, isPrice: true, editable: true, observation: '' },
  { label: 'Résultat net', value: netIncome, isPrice: true, editable: true, observation: '' },
  { label: 'Tarif moyen', value: averageRate, isPrice: true, editable: true, observation: '' }
])

const operationalRows = ref([
  { label: 'Locations avec paiement en attente', value: pendingPayments, editable: true, observation: '' },
  { label: 'Taux de satisfaction', value: () => '95%', editable: true, observation: 'Estimation' },
  { label: 'Incidents signalés', value: () => 0, editable: true, observation: '' },
  { label: 'Maintenance préventive', value: () => 'À jour', editable: true, observation: '' }
])

// Fonctions utilitaires
const getPeriodText = () => {
  switch (selectedPeriod.value) {
    case 'day': return 'Aujourd\'hui'
    case 'week': return 'Cette semaine'
    case 'month': return 'Ce mois'
    default: return 'Période sélectionnée'
  }
}

const formatValue = (value, isPrice = false, isPercent = false) => {
  const val = typeof value === 'function' ? value() : (value.value !== undefined ? value.value : value)
  
  if (isPrice) return formatCurrency(val)
  if (isPercent) return `${val}%`
  return val.toString()
}

const formatCurrency = (amount) => {
  if (!amount) return '0 FCFA'
  return new Intl.NumberFormat('fr-CI', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const getPdfContent = () => {
  const renderTable = (title, rows) => `
    <div style="margin-bottom: 30px;">
      <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">${title}</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="background-color: #f9fafb;">
            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Indicateur</th>
            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: center;">Valeur</th>
            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Observations</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              <td style="border: 1px solid #e5e7eb; padding: 8px;">${row.label}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: center;">${formatValue(row.value, row.isPrice, row.isPercent)}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px;">${row.observation || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
  
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6b7280; margin-bottom: 20px;">
        <span>Paradisias Hotel</span>
        <span>Tel: +225 0787572030</span>
      </div>
      <hr style="margin-bottom: 30px;">
      
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 18px; font-weight: bold; margin: 0; text-transform: uppercase;">Rapport global d'activité</h1>
        <p style="font-size: 14px; color: #6b7280; margin: 10px 0;">Période: ${getPeriodText()}</p>
      </div>
      
      ${renderTable('HÉBERGEMENT', accommodationRows.value)}
      ${renderTable('FINANCES', financialRows.value)}
      ${renderTable('OPÉRATIONS', operationalRows.value)}
      
      ${globalNotes.value ? `
        <div style="margin-top: 30px; padding: 15px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 5px;">
          <h4 style="font-weight: bold; margin: 0 0 15px 0;">Synthèse de la période</h4>
          <p style="margin: 0; line-height: 1.6;">${globalNotes.value}</p>
        </div>
      ` : ''}
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #6b7280;">
        <div style="display: flex; justify-content: space-between;">
          <span>Paradisias Hotel est situé à Man non loin du lycée moderne de Man</span>
          <span>Contact: +225 0787572030</span>
        </div>
      </div>
    </div>
  `
}

const generatePdf = async () => {
  isGenerating.value = true
  
  try {
    const options = {
      margin: [5, 5],
      filename: `rapport_global_${getPeriodText().toLowerCase().replace(/'/g, '').replace(/ /g, '_')}_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { dpi: 75, scale: 2, letterRendering: true },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      jsPDF: {
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      }
    }

    const content = getPdfContent()
    
    await html2pdf()
      .from(content)
      .set(options)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages()
        
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i)
          pdf.setFontSize(10)
          pdf.setTextColor(150)
          pdf.text('Paradisias Hotel est situé à Man non loin du lycée moderne de Man', 10, 290)
          pdf.text('Contact: +225 0787572030', 157, 290)
        }
      })
      .save()
    
    showPreview.value = false
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error)
  } finally {
    isGenerating.value = false
  }
}
</script> 