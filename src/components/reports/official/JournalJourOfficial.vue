<template>
  <div class="bg-white rounded-lg border border-gray-200">
    <!-- En-tête avec filtres -->
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Journal du jour</h3>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <button 
              @click="selectedRange = 'day'"
              :class="selectedRange === 'day' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-700'"
              class="px-3 py-1 rounded text-sm font-medium"
            >
              <Calendar class="w-4 h-4 mr-1 inline" />
              Aujourd'hui
            </button>
            <button 
              @click="selectedRange = 'week'"
              :class="selectedRange === 'week' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'"
              class="px-3 py-1 rounded text-sm font-medium"
            >
              <Calendar class="w-4 h-4 mr-1 inline" />
              Semaine
            </button>
            <button 
              @click="selectedRange = 'month'"
              :class="selectedRange === 'month' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'"
              class="px-3 py-1 rounded text-sm font-medium"
            >
              <Calendar class="w-4 h-4 mr-1 inline" />
              Mois
            </button>
            <input 
              v-model="customDate"
              type="date"
              class="px-3 py-1 border border-gray-300 rounded text-sm"
              @change="selectedRange = customDate"
            />
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
        <h1 class="text-xl font-bold uppercase">Journal du jour</h1>
        <p class="text-sm text-gray-600 mt-2">
          Journée du {{ formatDisplayDate() }}
        </p>
      </div>

      <!-- Tableau des chambres -->
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-3 py-2 text-center font-medium text-xs">Chambre</th>
              <th class="border border-gray-300 px-3 py-2 text-center font-medium text-xs">Client</th>
              <th class="border border-gray-300 px-3 py-2 text-center font-medium text-xs">Dette Totale</th>
              <th class="border border-gray-300 px-3 py-2 text-center font-medium text-xs">Dette Payée</th>
              <th class="border border-gray-300 px-3 py-2 text-center font-medium text-xs">Dette Jour</th>
              <th class="border border-gray-300 px-3 py-2 text-center font-medium text-xs">Payé Jour</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reservation in filteredReservations" :key="reservation.id">
              <td class="border border-gray-300 px-3 py-2 text-center text-xs">
                {{ getChamberNumber(reservation) }}
              </td>
              <td class="border border-gray-300 px-3 py-2 text-center text-xs">
                {{ getClientName(reservation) }}
              </td>
              <td class="border border-gray-300 px-3 py-2 text-center text-xs">
                {{ formatCurrency(reservation.totalPrice || 0) }}
              </td>
              <td class="border border-gray-300 px-3 py-2 text-center text-xs">
                {{ formatCurrency(reservation.paidAmount || 0) }}
              </td>
              <td class="border border-gray-300 px-3 py-2 text-center text-xs">
                {{ formatCurrency(getDailyDebt(reservation)) }}
              </td>
              <td class="border border-gray-300 px-3 py-2 text-center text-xs">
                {{ formatCurrency(getDailyPayment(reservation)) }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-gray-50 font-medium">
              <td colspan="2" class="border border-gray-300 px-3 py-2 text-right text-xs">TOTAUX:</td>
              <td class="border border-gray-300 px-3 py-2 text-center text-xs">
                {{ formatCurrency(totalDebt) }}
              </td>
              <td class="border border-gray-300 px-3 py-2 text-center text-xs">
                {{ formatCurrency(totalPaid) }}
              </td>
              <td class="border border-gray-300 px-3 py-2 text-center text-xs">
                {{ formatCurrency(totalDailyDebt) }}
              </td>
              <td class="border border-gray-300 px-3 py-2 text-center text-xs">
                {{ formatCurrency(totalDailyPayment) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Actions -->
    <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-600">
          {{ filteredReservations.length }} location(s) • Dette totale: {{ formatCurrency(totalDebt) }}
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
      <div class="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-screen overflow-y-auto" @click.stop>
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Aperçu - Journal du jour</h3>
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
import { Eye, Download, X, Calendar } from 'lucide-vue-next'
import html2pdf from 'html2pdf.js'
import { isToday, isThisWeek, isThisMonth, isWithinInterval } from 'date-fns'

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

const selectedRange = ref('day')
const customDate = ref(new Date().toISOString().split('T')[0])
const showPreview = ref(false)
const isGenerating = ref(false)

// Données filtrées selon la période
const filteredReservations = computed(() => {
  const locations = props.data.locations || []
  
  return locations.filter(location => {
    const checkInDate = new Date(location.checkIn_date || location.checkIn)
    
    switch (selectedRange.value) {
      case 'day':
        return isToday(checkInDate)
      case 'week':
        return isThisWeek(checkInDate)
      case 'month':
        return isThisMonth(checkInDate)
      default:
        // Date personnalisée
        const targetDate = new Date(selectedRange.value)
        return checkInDate.toDateString() === targetDate.toDateString()
    }
  })
})

// Calculs des totaux
const totalDebt = computed(() => 
  filteredReservations.value.reduce((sum, res) => sum + (res.totalPrice || 0), 0)
)

const totalPaid = computed(() => 
  filteredReservations.value.reduce((sum, res) => sum + (res.paidAmount || 0), 0)
)

const totalDailyDebt = computed(() => 
  filteredReservations.value.reduce((sum, res) => sum + getDailyDebt(res), 0)
)

const totalDailyPayment = computed(() => 
  filteredReservations.value.reduce((sum, res) => sum + getDailyPayment(res), 0)
)

// Fonctions utilitaires
const getChamberNumber = (reservation) => {
  // Vérifier les différents formats possibles pour l'ID de la chambre
  const chamberId = reservation.chambre?.id || reservation.room || reservation.chambre
  if (!chamberId) return 'N/A'
  
  const chamber = props.data.chambers?.find(c => c.id === chamberId)
  if (!chamber) return 'N/A'
  
  // Vérifier les deux formats de numéro possibles
  return chamber.numero || chamber.number || 'N/A'
}

const getClientName = (reservation) => {
  // Vérifier les deux formats possibles: client ou guest
  const clientId = reservation.client || reservation.guest
  if (!clientId) return 'Client inconnu'
  
  const client = props.data.clients?.find(c => c.id === clientId)
  if (!client) return 'Client inconnu'
  
  // Construire le nom complet avec nom et prénom
  const nom = client.nom || client.name || ''
  const prenom = client.prenom || client.firstname || ''
  
  if (nom && prenom) {
    return `${nom} ${prenom}`
  } else if (nom) {
    return nom
  } else if (prenom) {
    return prenom
  } else {
    return 'Client inconnu'
  }
}

// Calculs pour la dette et paiement du jour (à adapter selon le gestionnaire de prix)
const getDailyDebt = (reservation) => {
  // Pour l'instant, calcul basique - sera remplacé par le gestionnaire de prix
  const totalDays = Math.ceil((new Date(reservation.checkOut_date || reservation.checkOut) - new Date(reservation.checkIn_date || reservation.checkIn)) / (1000 * 60 * 60 * 24))
  return totalDays > 0 ? Math.round((reservation.totalPrice || 0) / totalDays) : 0
}

const getDailyPayment = (reservation) => {
  // Pour l'instant, calcul basique - sera remplacé par le gestionnaire de prix
  const totalDays = Math.ceil((new Date(reservation.checkOut_date || reservation.checkOut) - new Date(reservation.checkIn_date || reservation.checkIn)) / (1000 * 60 * 60 * 24))
  return totalDays > 0 ? Math.round((reservation.paidAmount || 0) / totalDays) : 0
}

const formatDisplayDate = () => {
  const date = selectedRange.value === 'day' ? new Date() :
               selectedRange.value === 'week' ? new Date() :
               selectedRange.value === 'month' ? new Date() :
               new Date(selectedRange.value)
  return date.toLocaleDateString('fr-FR')
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR')
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
  const tableRows = filteredReservations.value.map(reservation => [
    getChamberNumber(reservation),
    getClientName(reservation),
    formatCurrency(reservation.totalPrice || 0),
    formatCurrency(reservation.paidAmount || 0),
    formatCurrency(getDailyDebt(reservation)),
    formatCurrency(getDailyPayment(reservation))
  ])
  
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6b7280; margin-bottom: 20px;">
        <span>Paradisias Hotel</span>
        <span>Tel: +225 0787572030</span>
      </div>
      <hr style="margin-bottom: 30px;">
      
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 18px; font-weight: bold; margin: 0; text-transform: uppercase;">Journal du jour</h1>
        <p style="font-size: 14px; color: #6b7280; margin: 10px 0;">Journée du ${formatDisplayDate()}</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
        <thead>
          <tr style="background-color: #f9fafb;">
            <th style="border: 1px solid #e5e7eb; padding: 6px; text-align: center;">Chambre</th>
            <th style="border: 1px solid #e5e7eb; padding: 6px; text-align: center;">Client</th>
            <th style="border: 1px solid #e5e7eb; padding: 6px; text-align: center;">Dette Totale</th>
            <th style="border: 1px solid #e5e7eb; padding: 6px; text-align: center;">Dette Payée</th>
            <th style="border: 1px solid #e5e7eb; padding: 6px; text-align: center;">Dette Jour</th>
            <th style="border: 1px solid #e5e7eb; padding: 6px; text-align: center;">Payé Jour</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows.map(row => `
            <tr>
              ${row.map(cell => `<td style="border: 1px solid #e5e7eb; padding: 6px; text-align: center;">${cell}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr style="background-color: #f9fafb; font-weight: bold;">
            <td colspan="2" style="border: 1px solid #e5e7eb; padding: 6px; text-align: right;">TOTAUX:</td>
            <td style="border: 1px solid #e5e7eb; padding: 6px; text-align: center;">${formatCurrency(totalDebt.value)}</td>
            <td style="border: 1px solid #e5e7eb; padding: 6px; text-align: center;">${formatCurrency(totalPaid.value)}</td>
            <td style="border: 1px solid #e5e7eb; padding: 6px; text-align: center;">${formatCurrency(totalDailyDebt.value)}</td>
            <td style="border: 1px solid #e5e7eb; padding: 6px; text-align: center;">${formatCurrency(totalDailyPayment.value)}</td>
          </tr>
        </tfoot>
      </table>
      
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
      filename: `journal_jour_${formatDisplayDate().replace(/\//g, '-')}.pdf`,
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