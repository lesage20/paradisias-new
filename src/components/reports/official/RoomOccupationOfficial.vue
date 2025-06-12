<template>
  <div class="bg-white rounded-lg border border-gray-200">
    <!-- En-tête avec filtres -->
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Rapport d'occupation des chambres</h3>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <label class="flex items-center space-x-2">
              <input 
                v-model="reception" 
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm font-medium text-gray-700">Mode Réception</span>
            </label>
          </div>
          <div class="flex items-center space-x-2">
            <button 
              @click="selectedRange = 'day'"
              :class="selectedRange === 'day' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-700'"
              class="px-3 py-1 rounded text-sm font-medium"
            >
              Aujourd'hui
            </button>
            <button 
              @click="selectedRange = 'month'"
              :class="selectedRange === 'month' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'"
              class="px-3 py-1 rounded text-sm font-medium"
            >
              Ce mois
            </button>
            <input 
              v-model="customDateRange"
              type="date"
              class="px-3 py-1 border border-gray-300 rounded text-sm"
              @change="selectedRange = customDateRange"
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
        <h1 class="text-xl font-bold uppercase">
          Rapport d'occupation des chambres {{ reception ? '-- Réception' : 'de l\'hôtel' }}
        </h1>
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
              <th v-if="!reception" class="border border-gray-300 px-3 py-2 text-center font-medium text-xs">Adultes</th>
              <th v-if="!reception" class="border border-gray-300 px-3 py-2 text-center font-medium text-xs">Enfants</th>
              <th class="border border-gray-300 px-3 py-2 text-center font-medium text-xs">Client</th>
              <th class="border border-gray-300 px-3 py-2 text-center font-medium text-xs">Check-in</th>
              <th class="border border-gray-300 px-3 py-2 text-center font-medium text-xs">Check-out</th>
              <th v-if="!reception" class="border border-gray-300 px-3 py-2 text-center font-medium text-xs">Prix</th>
              <th v-if="reception" class="border border-gray-300 px-3 py-2 text-center font-medium text-xs">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="chamber in chambersData" :key="chamber.id">
              <td class="border border-gray-300 px-3 py-2 text-center text-xs">{{ chamber.numero || chamber.number }}</td>
              <td v-if="!reception" class="border border-gray-300 px-3 py-2 text-center text-xs">{{ chamber.adults || 0 }}</td>
              <td v-if="!reception" class="border border-gray-300 px-3 py-2 text-center text-xs">{{ chamber.children || 0 }}</td>
              <td class="border border-gray-300 px-3 py-2 text-center text-xs">{{ getClientName(chamber) }}</td>
              <td class="border border-gray-300 px-3 py-2 text-center text-xs">{{ getCheckInDate(chamber) }}</td>
              <td class="border border-gray-300 px-3 py-2 text-center text-xs">{{ getCheckOutDate(chamber) }}</td>
              <td v-if="!reception" class="border border-gray-300 px-3 py-2 text-center text-xs">{{ getPrice(chamber) }}</td>
              <td v-if="reception" class="border border-gray-300 px-3 py-2 text-center text-xs">{{ getStatus(chamber) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Actions -->
    <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-600">
          {{ chambersData.length }} chambre(s) • {{ getOccupiedCount() }} occupée(s)
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
          <h3 class="text-lg font-medium text-gray-900">Aperçu - Rapport d'occupation des chambres</h3>
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

const reception = ref(false)
const selectedRange = ref('day')
const customDateRange = ref(new Date().toISOString().split('T')[0])
const showPreview = ref(false)
const isGenerating = ref(false)

// Données des chambres avec leurs locations
const chambersData = computed(() => {
  const chambers = props.data.chambers || []
  const locations = props.data.locations || []
  const clients = props.data.clients || []
  
  return chambers.map(chamber => {
    // Trouver la location active pour cette chambre
    const activeLocation = getActiveLocation(chamber, locations)
    
    // Récupérer le client en gérant les deux formats possibles: client ou guest
    let client = null
    if (activeLocation) {
      const clientId = activeLocation.client || activeLocation.guest
      client = clientId ? clients.find(c => c.id === clientId) : null
    }
    
    return {
      ...chamber,
      activeLocation,
      client,
      adults: activeLocation?.adults || 0,
      children: activeLocation?.children || 0
    }
  })
})

// Fonctions utilitaires
const getActiveLocation = (chamber, locations) => {
  const today = new Date().toISOString().split('T')[0]
  const targetDate = selectedRange.value === 'day' ? today : 
                   selectedRange.value === 'month' ? today :
                   selectedRange.value
  
  return locations.find(location => {
    const checkIn = new Date(location.checkIn_date || location.checkIn).toISOString().split('T')[0]
    const checkOut = new Date(location.checkOut_date || location.checkOut).toISOString().split('T')[0]
    const roomMatch = location.chambre?.id === chamber.id || location.room === chamber.id
    
    return roomMatch && checkIn <= targetDate && checkOut >= targetDate
  })
}

const getClientName = (chamber) => {
  if (!chamber.client) return '-'
  
  // Construire le nom complet avec nom et prénom
  const nom = chamber.client.nom || chamber.client.name || ''
  const prenom = chamber.client.prenom || chamber.client.firstname || ''
  
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

const getCheckInDate = (chamber) => {
  if (!chamber.activeLocation) return '-'
  return formatDate(chamber.activeLocation.checkIn_date || chamber.activeLocation.checkIn)
}

const getCheckOutDate = (chamber) => {
  if (!chamber.activeLocation) return '-'
  return formatDate(chamber.activeLocation.checkOut_date || chamber.activeLocation.checkOut)
}

const getPrice = (chamber) => {
  if (!chamber.activeLocation) return '-'
  return formatCurrency(chamber.activeLocation.totalPrice || 0)
}

const getStatus = (chamber) => {
  if (!chamber.activeLocation) return 'Libre'
  return 'Occupée'
}

const getOccupiedCount = () => {
  return chambersData.value.filter(chamber => chamber.activeLocation).length
}

const formatDisplayDate = () => {
  const date = selectedRange.value === 'day' ? new Date() :
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
  const headerCols = reception.value 
    ? ['Chambre', 'Client', 'Check-in', 'Check-out', 'Statut']
    : ['Chambre', 'Adultes', 'Enfants', 'Client', 'Check-in', 'Check-out', 'Prix']
  
  const tableRows = chambersData.value.map(chamber => {
    if (reception.value) {
      return [
        chamber.numero || chamber.number,
        getClientName(chamber),
        getCheckInDate(chamber),
        getCheckOutDate(chamber),
        getStatus(chamber)
      ]
    } else {
      return [
        chamber.numero || chamber.number,
        chamber.adults || 0,
        chamber.children || 0,
        getClientName(chamber),
        getCheckInDate(chamber),
        getCheckOutDate(chamber),
        getPrice(chamber)
      ]
    }
  })
  
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6b7280; margin-bottom: 20px;">
        <span>Paradisias Hotel</span>
        <span>Tel: +225 0787572030</span>
      </div>
      <hr style="margin-bottom: 30px;">
      
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 18px; font-weight: bold; margin: 0; text-transform: uppercase;">
          Rapport d'occupation des chambres ${reception.value ? '-- Réception' : 'de l\'hôtel'}
        </h1>
        <p style="font-size: 14px; color: #6b7280; margin: 10px 0;">Journée du ${formatDisplayDate()}</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
        <thead>
          <tr style="background-color: #f9fafb;">
            ${headerCols.map(col => `<th style="border: 1px solid #e5e7eb; padding: 6px; text-align: center;">${col}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${tableRows.map(row => `
            <tr>
              ${row.map(cell => `<td style="border: 1px solid #e5e7eb; padding: 6px; text-align: center;">${cell}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
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
      filename: `rapport_occupation_chambre_hotel_${formatDisplayDate().replace(/\//g, '-')}.pdf`,
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