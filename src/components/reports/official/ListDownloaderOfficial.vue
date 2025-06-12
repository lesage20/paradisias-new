<template>
  <div class="bg-white rounded-lg border border-gray-200">
    <!-- En-tête avec sélection de liste -->
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Téléchargeur de listes</h3>
      </div>
      
      <!-- Sélection du type de liste -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <button 
          @click="selectedList = 'location'"
          :class="selectedList === 'location' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-white text-gray-700 border-gray-300'"
          class="inline-flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          <Building class="w-4 h-4 mr-2" />
          Locations
        </button>
        <button 
          @click="selectedList = 'reservation'"
          :class="selectedList === 'reservation' ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-white text-gray-700 border-gray-300'"
          class="inline-flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          <Calendar class="w-4 h-4 mr-2" />
          Réservations
        </button>
        <button 
          @click="selectedList = 'depense'"
          :class="selectedList === 'depense' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-white text-gray-700 border-gray-300'"
          class="inline-flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          <DollarSign class="w-4 h-4 mr-2" />
          Dépenses
        </button>
      </div>

      <!-- Sélection de la période -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          @click="selectedRange = 'all'"
          :class="selectedRange === 'all' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-white text-gray-700 border-gray-300'"
          class="inline-flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          <List class="w-4 h-4 mr-2" />
          Tout
        </button>
        <button 
          @click="selectedRange = 'day'"
          :class="selectedRange === 'day' ? 'bg-teal-100 text-teal-700 border-teal-300' : 'bg-white text-gray-700 border-gray-300'"
          class="inline-flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          <Calendar class="w-4 h-4 mr-2" />
          Aujourd'hui
        </button>
        <button 
          @click="selectedRange = 'week'"
          :class="selectedRange === 'week' ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-white text-gray-700 border-gray-300'"
          class="inline-flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          <Calendar class="w-4 h-4 mr-2" />
          Semaine
        </button>
        <button 
          @click="selectedRange = 'month'"
          :class="selectedRange === 'month' ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-white text-gray-700 border-gray-300'"
          class="inline-flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          <Calendar class="w-4 h-4 mr-2" />
          Mois
        </button>
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
        <h1 class="text-xl font-bold uppercase">Liste de {{ selectedList }}s</h1>
        <p class="text-sm text-gray-600 mt-2">
          Période: {{ getPeriodText() }}
        </p>
      </div>

      <!-- Tableau des données -->
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th v-for="column in columns" :key="column.name" 
                  class="border border-gray-300 px-3 py-2 text-center font-medium text-xs">
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in currentSelectionRows" :key="item.id">
              <td v-for="column in columns" :key="column.name"
                  class="border border-gray-300 px-3 py-2 text-center text-xs">
                {{ getColumnValue(item, column) }}
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
          {{ currentSelectionRows.length }} élément(s) sélectionné(s)
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
          <h3 class="text-lg font-medium text-gray-900">Aperçu - Liste de {{ selectedList }}s</h3>
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
import { Eye, Download, X, Calendar, Building, DollarSign, List } from 'lucide-vue-next'
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

const selectedList = ref('location')
const selectedRange = ref('all')
const showPreview = ref(false)
const isGenerating = ref(false)

// Configuration des colonnes pour chaque type de liste
const columnsConfig = {
  location: [
    { name: 'id', label: 'ID' },
    { name: 'client', label: 'Client' },
    { name: 'chambre', label: 'Chambre' },
    { name: 'checkIn', label: 'Check-in' },
    { name: 'checkOut', label: 'Check-out' },
    { name: 'totalPrice', label: 'Prix Total' },
    { name: 'status', label: 'Statut' }
  ],
  reservation: [
    { name: 'id', label: 'ID' },
    { name: 'client', label: 'Client' },
    { name: 'chambre', label: 'Chambre' },
    { name: 'dateReservation', label: 'Date Réservation' },
    { name: 'checkIn', label: 'Check-in' },
    { name: 'checkOut', label: 'Check-out' },
    { name: 'status', label: 'Statut' }
  ],
  depense: [
    { name: 'id', label: 'ID' },
    { name: 'description', label: 'Description' },
    { name: 'montant', label: 'Montant' },
    { name: 'date', label: 'Date' },
    { name: 'categorie', label: 'Catégorie' },
    { name: 'employe', label: 'Employé' }
  ]
}

const columns = computed(() => columnsConfig[selectedList.value] || [])

// Données filtrées selon le type et la période
const currentSelectionRows = computed(() => {
  let data = []
  
  switch (selectedList.value) {
    case 'location':
      data = props.data.locations || []
      break
    case 'reservation':
      data = props.data.reservations || []
      break
    case 'depense':
      data = props.data.expenses || []
      break
  }

  if (selectedRange.value === 'all') {
    return data
  }

  return data.filter(item => {
    const dateField = selectedList.value === 'depense' ? 'date' : 'checkIn_date'
    const itemDate = new Date(item[dateField] || item.checkIn || item.date)
    
    switch (selectedRange.value) {
      case 'day':
        return isToday(itemDate)
      case 'week':
        return isThisWeek(itemDate)
      case 'month':
        return isThisMonth(itemDate)
      default:
        return true
    }
  })
})

// Fonctions utilitaires
const getColumnValue = (item, column) => {
  switch (column.name) {
    case 'client':
      // Gérer les deux formats possibles: client ou guest
      const clientId = item.client || item.guest
      if (!clientId) return 'N/A'
      const client = props.data.clients?.find(c => c.id === clientId)
      if (!client) return 'N/A'
      
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
        return 'N/A'
      }
    
    case 'chambre':
      // Gérer les différents formats possibles pour l'ID de la chambre
      const chamberId = item.chambre?.id || item.room || item.chambre
      if (!chamberId) return 'N/A'
      const chamber = props.data.chambers?.find(c => c.id === chamberId)
      return chamber?.numero || chamber?.number || 'N/A'
    
    case 'employe':
      const employee = props.data.employees?.find(e => e.id === item.employe)
      return employee?.nom || employee?.name || 'N/A'
    
    case 'checkIn':
    case 'checkOut':
    case 'date':
    case 'dateReservation':
      return formatDate(item[column.name + '_date'] || item[column.name])
    
    case 'totalPrice':
    case 'montant':
      return formatCurrency(item[column.name] || 0)
    
    case 'status':
      return getStatusText(item)
    
    default:
      return item[column.name] || 'N/A'
  }
}

const getStatusText = (item) => {
  if (selectedList.value === 'location') {
    const debt = (item.totalPrice || 0) - (item.paidAmount || 0)
    if (debt <= 0) return 'Payé'
    if ((item.paidAmount || 0) > 0) return 'Partiel'
    return 'Impayé'
  }
  return item.status || 'En cours'
}

const getPeriodText = () => {
  switch (selectedRange.value) {
    case 'all': return 'Toutes les données'
    case 'day': return 'Aujourd\'hui'
    case 'week': return 'Cette semaine'
    case 'month': return 'Ce mois'
    default: return 'Période sélectionnée'
  }
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
  const headerCols = columns.value.map(col => col.label)
  const tableRows = currentSelectionRows.value.map(item => 
    columns.value.map(col => getColumnValue(item, col))
  )
  
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6b7280; margin-bottom: 20px;">
        <span>Paradisias Hotel</span>
        <span>Tel: +225 0787572030</span>
      </div>
      <hr style="margin-bottom: 30px;">
      
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 18px; font-weight: bold; margin: 0; text-transform: uppercase;">Liste de ${selectedList.value}s</h1>
        <p style="font-size: 14px; color: #6b7280; margin: 10px 0;">Période: ${getPeriodText()}</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
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
      filename: `liste_${selectedList.value}_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.pdf`,
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