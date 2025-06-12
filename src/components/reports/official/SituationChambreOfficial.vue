<template>
  <div class="bg-white rounded-lg border border-gray-200">
    <!-- En-tête avec outils -->
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Feuille de situation des chambres</h3>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Chambres Hors service:</label>
            <input 
              v-model="roomHS" 
              type="number" 
              min="0"
              class="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Non Arrivées:</label>
            <input 
              v-model="nonArriv" 
              type="number" 
              min="0"
              class="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
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
        <h1 class="text-xl font-bold uppercase">Feuille de situation des chambres</h1>
        <p class="text-sm text-gray-600 mt-2">Date: {{ formatDate(new Date()) }}</p>
      </div>

      <!-- Tableau des données -->
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2 text-left font-medium">Label</th>
              <th class="border border-gray-300 px-4 py-2 text-center font-medium">Valeur</th>
              <th class="border border-gray-300 px-4 py-2 text-left font-medium">Observations</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.label">
              <td class="border border-gray-300 px-4 py-2">{{ row.label }}</td>
              <td class="border border-gray-300 px-4 py-2 text-center">
                {{ formatValue(row.value, row.isPercent) }}
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
    </div>

    <!-- Actions -->
    <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-600">
          Dernière mise à jour: {{ formatDateTime(new Date()) }}
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
          <h3 class="text-lg font-medium text-gray-900">Aperçu - Feuille de situation des chambres</h3>
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
import { ref, computed, watch } from 'vue'
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
  }
})

const roomHS = ref(0)
const nonArriv = ref(0)
const showPreview = ref(false)
const isGenerating = ref(false)
const pdfContent = ref(null)

// Calculs basés sur les données
const totalRooms = computed(() => props.data.chambers?.length || 0)

const busyRooms = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return props.data.locations?.filter(location => {
    const checkIn = new Date(location.checkIn_date || location.checkIn).toISOString().split('T')[0]
    const checkOut = new Date(location.checkOut_date || location.checkOut).toISOString().split('T')[0]
    return checkIn <= today && checkOut >= today
  }).length || 0
})

const waitingCheckIn = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return props.data.reservations?.filter(reservation => {
    const checkIn = new Date(reservation.checkIn_date || reservation.checkIn).toISOString().split('T')[0]
    return checkIn === today
  }).length || 0
})

const waitingCheckOut = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return props.data.locations?.filter(location => {
    const checkOut = new Date(location.checkOut_date || location.checkOut).toISOString().split('T')[0]
    return checkOut === today
  }).length || 0
})

const freeLocations = computed(() => {
  return props.data.locations?.filter(location => location.totalPrice === 0).length || 0
})

const freeRooms = computed(() => totalRooms.value - busyRooms.value - roomHS.value)

const totalBusyRooms = computed(() => busyRooms.value + freeLocations.value)

const occupationRate = computed(() => {
  if (totalRooms.value === 0) return 0
  return Math.round((totalBusyRooms.value * 100) / totalRooms.value)
})

// Données du tableau
const tableRows = ref([
  {
    label: 'Total Chambre',
    value: totalRooms,
    isPercent: false,
    editable: true,
    observation: ''
  },
  {
    label: 'Chambres Occupées',
    value: busyRooms,
    isPercent: false,
    editable: true,
    observation: ''
  },
  {
    label: 'Arrivées Prévues',
    value: waitingCheckIn,
    isPercent: false,
    editable: true,
    observation: ''
  },
  {
    label: 'Départs Prévus',
    value: waitingCheckOut,
    isPercent: false,
    editable: true,
    observation: ''
  },
  {
    label: 'Chambres Occupées Gratuites',
    value: freeLocations,
    isPercent: false,
    editable: true,
    observation: ''
  },
  {
    label: 'Hors Services',
    value: roomHS,
    isPercent: false,
    editable: true,
    observation: ''
  },
  {
    label: 'Non Arrivées',
    value: nonArriv,
    isPercent: false,
    editable: true,
    observation: ''
  },
  {
    label: 'Chambres Libres',
    value: freeRooms,
    isPercent: false,
    editable: true,
    observation: ''
  },
  {
    label: 'Total Chambres Occupées',
    value: totalBusyRooms,
    isPercent: false,
    editable: true,
    observation: ''
  },
  {
    label: 'Taux Occupation',
    value: occupationRate,
    isPercent: true,
    editable: true,
    observation: ''
  }
])

// Méthodes utilitaires
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('fr-FR')
}

const formatValue = (value, isPercent = false) => {
  const val = typeof value === 'function' ? value.value : value
  return isPercent ? `${val}%` : val.toString()
}

const getPdfContent = () => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6b7280; margin-bottom: 20px;">
        <span>Paradisias Hotel</span>
        <span>Tel: +225 0787572030</span>
      </div>
      <hr style="margin-bottom: 30px;">
      
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 18px; font-weight: bold; margin: 0; text-transform: uppercase;">Feuille de situation des chambres</h1>
        <p style="font-size: 14px; color: #6b7280; margin: 10px 0;">Date: ${formatDate(new Date())}</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="background-color: #f9fafb;">
            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Label</th>
            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: center;">Valeur</th>
            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Observations</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows.value.map(row => `
            <tr>
              <td style="border: 1px solid #e5e7eb; padding: 8px;">${row.label}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: center;">${formatValue(row.value, row.isPercent)}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px;">${row.observation || ''}</td>
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
      filename: `situation_chambre_${formatDate(new Date()).replace(/\//g, '-')}.pdf`,
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

// Watcher pour mettre à jour les valeurs calculées
watch([roomHS, nonArriv], () => {
  // Les computed values se mettront à jour automatiquement
})
</script> 