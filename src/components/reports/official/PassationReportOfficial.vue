<template>
  <div class="bg-white rounded-lg border border-gray-200">
    <!-- En-tête avec informations de passation -->
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Rapport de passation</h3>
      </div>
      
      <!-- Équipes de passation -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Équipe sortante:</label>
          <select v-model="departing" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option value="">Sélectionner équipe</option>
            <option v-for="employee in employees" :key="employee.id" :value="employee.id">
              {{ employee.nom || employee.name }}
            </option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Équipe entrante:</label>
          <select v-model="entering" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option value="">Sélectionner équipe</option>
            <option v-for="employee in employees" :key="employee.id" :value="employee.id">
              {{ employee.nom || employee.name }}
            </option>
          </select>
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
        <h1 class="text-xl font-bold uppercase">Rapport de passation</h1>
        <p class="text-sm text-gray-600 mt-2">
          Date: {{ formatDate(new Date()) }} à {{ formatTime(new Date()) }}
        </p>
      </div>

      <!-- Informations de passation -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="border border-gray-300 rounded p-4">
          <h3 class="font-medium text-gray-900 mb-2">Équipe Sortante</h3>
          <p class="text-sm text-gray-600">{{ getDepartingTeamName() }}</p>
        </div>
        <div class="border border-gray-300 rounded p-4">
          <h3 class="font-medium text-gray-900 mb-2">Équipe Entrante</h3>
          <p class="text-sm text-gray-600">{{ getEnteringTeamName() }}</p>
        </div>
      </div>

      <!-- Tableau des données de passation -->
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2 text-left font-medium">Élément</th>
              <th class="border border-gray-300 px-4 py-2 text-center font-medium">Valeur</th>
              <th class="border border-gray-300 px-4 py-2 text-left font-medium">Observations</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in passationRows" :key="row.label">
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

      <!-- Section des remarques -->
      <div class="mt-6">
        <h4 class="font-medium text-gray-900 mb-3">Remarques et Instructions</h4>
        <div class="border border-gray-300 rounded p-4">
          <textarea 
            v-model="additionalNotes"
            rows="4"
            class="w-full border-none resize-none focus:outline-none"
            placeholder="Ajouter des remarques importantes, instructions spéciales, ou problèmes à signaler..."
          ></textarea>
        </div>
      </div>

      <!-- Signatures -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div class="text-center">
          <div class="border-t border-gray-300 pt-2">
            <p class="text-sm font-medium">Signature Équipe Sortante</p>
            <p class="text-xs text-gray-600 mt-1">{{ getDepartingTeamName() }}</p>
          </div>
        </div>
        <div class="text-center">
          <div class="border-t border-gray-300 pt-2">
            <p class="text-sm font-medium">Signature Équipe Entrante</p>
            <p class="text-xs text-gray-600 mt-1">{{ getEnteringTeamName() }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-600">
          Passation du {{ formatDate(new Date()) }}
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
          <h3 class="text-lg font-medium text-gray-900">Aperçu - Rapport de passation</h3>
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
  }
})

const departing = ref('')
const entering = ref('')
const additionalNotes = ref('')
const showPreview = ref(false)
const isGenerating = ref(false)

// Données des employés
const employees = computed(() => props.data.employees || [])

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

const todayRevenue = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return props.data.locations?.filter(location => {
    const checkIn = new Date(location.checkIn_date || location.checkIn).toISOString().split('T')[0]
    return checkIn === today
  }).reduce((sum, location) => sum + (location.totalPrice || 0), 0) || 0
})

const cashAmount = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return props.data.locations?.filter(location => {
    const checkIn = new Date(location.checkIn_date || location.checkIn).toISOString().split('T')[0]
    return checkIn === today && location.payment === 'espece'
  }).reduce((sum, location) => sum + (location.totalPrice || 0), 0) || 0
})

const pendingReservations = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return props.data.reservations?.filter(reservation => {
    const checkIn = new Date(reservation.checkIn_date || reservation.checkIn).toISOString().split('T')[0]
    return checkIn === today
  }).length || 0
})

// Données du tableau de passation
const passationRows = ref([
  {
    label: 'Chambres Occupées',
    value: busyRooms,
    isPrice: false,
    editable: true,
    observation: ''
  },
  {
    label: 'Chambres Libres',
    value: () => totalRooms.value - busyRooms.value,
    isPrice: false,
    editable: true,
    observation: ''
  },
  {
    label: 'Recettes du Jour',
    value: todayRevenue,
    isPrice: true,
    editable: true,
    observation: ''
  },
  {
    label: 'Montant en Caisse',
    value: cashAmount,
    isPrice: true,
    editable: true,
    observation: ''
  },
  {
    label: 'Réservations en Attente',
    value: pendingReservations,
    isPrice: false,
    editable: true,
    observation: ''
  },
  {
    label: 'État du Matériel',
    value: () => 'À vérifier',
    isPrice: false,
    editable: true,
    observation: ''
  },
  {
    label: 'Problèmes Signalés',
    value: () => 'Aucun',
    isPrice: false,
    editable: true,
    observation: ''
  }
])

// Fonctions utilitaires
const getDepartingTeamName = () => {
  const employee = employees.value.find(e => e.id === departing.value)
  return employee?.nom || employee?.name || 'Non défini'
}

const getEnteringTeamName = () => {
  const employee = employees.value.find(e => e.id === entering.value)
  return employee?.nom || employee?.name || 'Non défini'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const formatCurrency = (amount) => {
  if (!amount) return '0 FCFA'
  return new Intl.NumberFormat('fr-CI', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatValue = (value, isPrice = false) => {
  const val = typeof value === 'function' ? value() : (value.value !== undefined ? value.value : value)
  return isPrice ? formatCurrency(val) : val.toString()
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
        <h1 style="font-size: 18px; font-weight: bold; margin: 0; text-transform: uppercase;">Rapport de passation</h1>
        <p style="font-size: 14px; color: #6b7280; margin: 10px 0;">Date: ${formatDate(new Date())} à ${formatTime(new Date())}</p>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
        <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 5px;">
          <h3 style="font-weight: bold; margin: 0 0 10px 0;">Équipe Sortante</h3>
          <p style="margin: 0; color: #6b7280;">${getDepartingTeamName()}</p>
        </div>
        <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 5px;">
          <h3 style="font-weight: bold; margin: 0 0 10px 0;">Équipe Entrante</h3>
          <p style="margin: 0; color: #6b7280;">${getEnteringTeamName()}</p>
        </div>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 30px;">
        <thead>
          <tr style="background-color: #f9fafb;">
            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Élément</th>
            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: center;">Valeur</th>
            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Observations</th>
          </tr>
        </thead>
        <tbody>
          ${passationRows.value.map(row => `
            <tr>
              <td style="border: 1px solid #e5e7eb; padding: 8px;">${row.label}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: center;">${formatValue(row.value, row.isPrice)}</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px;">${row.observation || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="margin-bottom: 30px;">
        <h4 style="font-weight: bold; margin: 0 0 15px 0;">Remarques et Instructions</h4>
        <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 5px; background-color: #fafafa;">
          <p style="margin: 0; line-height: 1.6;">${additionalNotes.value || 'Aucune remarque particulière.'}</p>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px;">
        <div style="text-align: center;">
          <div style="border-top: 1px solid #6b7280; padding-top: 10px;">
            <p style="margin: 0; font-weight: bold; font-size: 12px;">Signature Équipe Sortante</p>
            <p style="margin: 5px 0 0 0; font-size: 10px; color: #6b7280;">${getDepartingTeamName()}</p>
          </div>
        </div>
        <div style="text-align: center;">
          <div style="border-top: 1px solid #6b7280; padding-top: 10px;">
            <p style="margin: 0; font-weight: bold; font-size: 12px;">Signature Équipe Entrante</p>
            <p style="margin: 5px 0 0 0; font-size: 10px; color: #6b7280;">${getEnteringTeamName()}</p>
          </div>
        </div>
      </div>
      
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
      filename: `rapport_passation_${formatDate(new Date()).replace(/\//g, '-')}.pdf`,
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