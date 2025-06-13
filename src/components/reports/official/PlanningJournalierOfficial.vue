<template>
  <div class="bg-white rounded-lg border border-gray-200">
    <!-- En-tête avec sélection de date -->
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Planning journalier</h3>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Date:</label>
            <input 
              v-model="selectedDate"
              type="date"
              class="px-3 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <button 
            @click="goToToday"
            class="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200"
          >
            Aujourd'hui
          </button>
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
        <h1 class="text-xl font-bold uppercase">Planning d'occupation journalière</h1>
        <p class="text-sm text-gray-600 mt-2">
          Date: {{ formatDate(selectedDate) }}
        </p>
      </div>

      <!-- Résumé -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-blue-50 border border-blue-200 rounded p-3 text-center">
          <div class="text-2xl font-bold text-blue-600">{{ totalRooms }}</div>
          <div class="text-xs text-blue-600">Total Chambres</div>
        </div>
        <div class="bg-green-50 border border-green-200 rounded p-3 text-center">
          <div class="text-2xl font-bold text-green-600">{{ occupiedRooms }}</div>
          <div class="text-xs text-green-600">Occupées</div>
        </div>
        <div class="bg-orange-50 border border-orange-200 rounded p-3 text-center">
          <div class="text-2xl font-bold text-orange-600">{{ arrivalsToday }}</div>
          <div class="text-xs text-orange-600">Arrivées</div>
        </div>
        <div class="bg-red-50 border border-red-200 rounded p-3 text-center">
          <div class="text-2xl font-bold text-red-600">{{ departuresToday }}</div>
          <div class="text-xs text-red-600">Départs</div>
        </div>
      </div>

      <!-- Tableau du planning -->
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-3 py-2 text-center font-medium text-xs">Chambre</th>
              <!-- <th class="border border-gray-300 px-3 py-2 text-center font-medium text-xs">Type</th> -->
              <!-- <th class="border border-gray-300 px-3 py-2 text-center font-medium text-xs">Statut</th> -->
              <th class="border border-gray-300 px-3 py-2 text-center font-medium text-xs">Client</th>
              <th class="border border-gray-300 px-3 py-2 text-center font-medium text-xs">Entrée</th>
              <th class="border border-gray-300 px-3 py-2 text-center font-medium text-xs">Sortie</th>
              <th class="border border-gray-300 px-3 py-2 text-center font-medium text-xs">Observations</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="chamber in planningData" :key="chamber.id">
              <td class="border border-gray-300 px-3 py-2 text-center text-xs font-medium">
                {{ chamber.numero || chamber.number }}
              </td>
              <!-- <td class="border border-gray-300 px-3 py-2 text-center text-xs">
                {{ chamber.type || 'Standard' }}
              </td> -->
              <!-- <td class="border border-gray-300 px-3 py-2 text-center text-xs">
                <span :class="getStatusClass(chamber.status)">
                  {{ chamber.status }}
                </span>
              </td> -->
              <td class="border border-gray-300 px-3 py-2 text-center text-xs">
                {{ chamber.clientName || '-' }}
              </td>
              <td class="border border-gray-300 px-3 py-2 text-center text-xs">
                {{ chamber.checkIn || '-' }}
              </td>
              <td class="border border-gray-300 px-3 py-2 text-center text-xs">
                {{ chamber.checkOut || '-' }}
              </td>
              <td class="border border-gray-300 px-3 py-2 text-center text-xs">
                <input 
                  v-model="chamber.observation"
                  type="text"
                  class="w-full border-none bg-transparent focus:outline-none text-center"
                  placeholder="-"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Notes additionnelles -->
      <div class="mt-6">
        <h4 class="font-medium text-gray-900 mb-3">Notes du planning</h4>
        <div class="border border-gray-300 rounded p-4 bg-gray-50">
          <textarea 
            v-model="planningNotes"
            rows="3"
            class="w-full border-none bg-transparent resize-none focus:outline-none"
            placeholder="Ajouter des notes sur le planning du jour..."
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-600">
          Planning du {{ formatDate(selectedDate) }} • {{ occupiedRooms }}/{{ totalRooms }} chambres occupées
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
          <h3 class="text-lg font-medium text-gray-900">Aperçu - Planning journalier</h3>
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

const selectedDate = ref(new Date().toISOString().split('T')[0])
const planningNotes = ref('')
const showPreview = ref(false)
const isGenerating = ref(false)

// Données calculées
const totalRooms = computed(() => props.data.chambers?.length || 0)

const planningData = computed(() => {
  const chambers = props.data.chambers || []
  const locations = props.data.locations || []
  const clients = props.data.clients || []
  
  return chambers.map(chamber => {
    const activeLocation = getLocationForDate(chamber, locations, selectedDate.value)
    
    // Récupérer le client en gérant les deux formats possibles: client ou guest
    let client = null
    if (activeLocation) {
      const clientId = activeLocation.client || activeLocation.guest
      client = clientId ? clients.find(c => c.id === clientId) : null
    }
    
    let status = 'Libre'
    let clientName = '-'
    let checkIn = '-'
    let checkOut = '-'
    
    if (activeLocation) {
      status = 'Occupée'
      
      // Construire le nom complet avec nom et prénom
      if (client) {
        const nom = client.nom || client.name || ''
        const prenom = client.prenom || client.firstname || ''
        
        if (nom && prenom) {
          clientName = `${nom} ${prenom}`
        } else if (nom) {
          clientName = nom
        } else if (prenom) {
          clientName = prenom
        } else {
          clientName = 'Client inconnu'
        }
      } else {
        clientName = 'Client inconnu'
      }
      
      checkIn = formatDate(activeLocation.checkIn_date || activeLocation.checkIn)
      checkOut = formatDate(activeLocation.checkOut_date || activeLocation.checkOut)
      
      // Vérifier si c'est une arrivée ou un départ
      const checkInDate = new Date(activeLocation.checkIn_date || activeLocation.checkIn).toISOString().split('T')[0]
      const checkOutDate = new Date(activeLocation.checkOut_date || activeLocation.checkOut).toISOString().split('T')[0]
      
      if (checkInDate === selectedDate.value) {
        status = 'Arrivée'
      } else if (checkOutDate === selectedDate.value) {
        status = 'Départ'
      }
    }
    
    return {
      ...chamber,
      status,
      clientName,
      checkIn,
      checkOut,
      observation: ''
    }
  })
})

const occupiedRooms = computed(() => 
  planningData.value.filter(chamber => ['Occupée', 'Arrivée', 'Départ'].includes(chamber.status)).length
)

const arrivalsToday = computed(() => 
  planningData.value.filter(chamber => chamber.status === 'Arrivée').length
)

const departuresToday = computed(() => 
  planningData.value.filter(chamber => chamber.status === 'Départ').length
)

// Fonctions utilitaires
const getLocationForDate = (chamber, locations, date) => {
  return locations.find(location => {
    const checkIn = new Date(location.checkIn_date || location.checkIn).toISOString().split('T')[0]
    const checkOut = new Date(location.checkOut_date || location.checkOut).toISOString().split('T')[0]
    const roomMatch = location.chambre?.id === chamber.id || location.room === chamber.id
    
    return roomMatch && checkIn <= date && checkOut >= date
  })
}

const getStatusClass = (status) => {
  return {
    'text-green-600 bg-green-100 px-2 py-1 rounded': status === 'Occupée',
    'text-orange-600 bg-orange-100 px-2 py-1 rounded': status === 'Arrivée',
    'text-red-600 bg-red-100 px-2 py-1 rounded': status === 'Départ',
    'text-gray-600 bg-gray-100 px-2 py-1 rounded': status === 'Libre'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const goToToday = () => {
  selectedDate.value = new Date().toISOString().split('T')[0]
}

const getPdfContent = () => {
  const tableRows = planningData.value.map(chamber => [
    chamber.numero || chamber.number,
    chamber.type || 'Standard',
    chamber.status,
    chamber.clientName,
    chamber.checkIn,
    chamber.checkOut,
    chamber.observation || '-'
  ])
  
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6b7280; margin-bottom: 20px;">
        <span>Paradisias Hotel</span>
        <span>Tel: +225 0787572030</span>
      </div>
      <hr style="margin-bottom: 30px;">
      
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 18px; font-weight: bold; margin: 0; text-transform: uppercase;">Planning d'occupation journalière</h1>
        <p style="font-size: 14px; color: #6b7280; margin: 10px 0;">Date: ${formatDate(selectedDate.value)}</p>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px;">
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 10px; text-align: center; border-radius: 5px;">
          <div style="font-size: 18px; font-weight: bold; color: #2563eb;">${totalRooms.value}</div>
          <div style="font-size: 10px; color: #2563eb;">Total Chambres</div>
        </div>
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 10px; text-align: center; border-radius: 5px;">
          <div style="font-size: 18px; font-weight: bold; color: #16a34a;">${occupiedRooms.value}</div>
          <div style="font-size: 10px; color: #16a34a;">Occupées</div>
        </div>
        <div style="background-color: #fff7ed; border: 1px solid #fed7aa; padding: 10px; text-align: center; border-radius: 5px;">
          <div style="font-size: 18px; font-weight: bold; color: #ea580c;">${arrivalsToday.value}</div>
          <div style="font-size: 10px; color: #ea580c;">Arrivées</div>
        </div>
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 10px; text-align: center; border-radius: 5px;">
          <div style="font-size: 18px; font-weight: bold; color: #dc2626;">${departuresToday.value}</div>
          <div style="font-size: 10px; color: #dc2626;">Départs</div>
        </div>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
        <thead>
          <tr style="background-color: #f9fafb;">
            <th style="border: 1px solid #e5e7eb; padding: 6px; text-align: center;">Chambre</th>
            <th style="border: 1px solid #e5e7eb; padding: 6px; text-align: center;">Type</th>
            <th style="border: 1px solid #e5e7eb; padding: 6px; text-align: center;">Statut</th>
            <th style="border: 1px solid #e5e7eb; padding: 6px; text-align: center;">Client</th>
            <th style="border: 1px solid #e5e7eb; padding: 6px; text-align: center;">Check-in</th>
            <th style="border: 1px solid #e5e7eb; padding: 6px; text-align: center;">Check-out</th>
            <th style="border: 1px solid #e5e7eb; padding: 6px; text-align: center;">Observations</th>
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
      
      ${planningNotes.value ? `
        <div style="margin-top: 30px;">
          <h4 style="font-weight: bold; margin: 0 0 15px 0;">Notes du planning</h4>
          <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 5px; background-color: #fafafa;">
            <p style="margin: 0; line-height: 1.6;">${planningNotes.value}</p>
          </div>
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
      filename: `planning_journalier_${selectedDate.value.replace(/-/g, '_')}.pdf`,
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