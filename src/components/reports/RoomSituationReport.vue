<template>
  <div class="room-situation-report">
    <!-- Contrôles pour saisir les données manuelles -->
    <div class="controls mb-6 bg-gray-50 p-4 rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Chambres Hors Service</label>
          <input 
            v-model.number="roomsOutOfService" 
            type="number" 
            min="0" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Non Arrivées</label>
          <input 
            v-model.number="noShows" 
            type="number" 
            min="0" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>

    <PdfGenerator :title="`situation_chambres_${formatDateForFilename(new Date())}`">
      <template #content>
        <div class="report-header">
          <div class="hotel-info">
            <span class="hotel-name">Paradisias Hotel</span>
            <span class="hotel-contact">Tel: +225 0787572030</span>
          </div>
          <div class="separator"></div>
          <h1 class="report-title">FEUILLE DE SITUATION DES CHAMBRES</h1>
          <p class="report-date">Date: {{ formatDate(new Date()) }}</p>
        </div>

        <div class="report-content">
          <table class="report-table">
            <thead>
              <tr>
                <th>Indicateur</th>
                <th>Valeur</th>
                <th>Observation</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in situationRows" :key="index">
                <td class="indicator">{{ row.label }}</td>
                <td class="value">{{ row.value }}{{ row.isPercentage ? ' %' : '' }}</td>
                <td class="observation">
                  <textarea 
                    v-model="row.observation" 
                    class="w-full border-none resize-none focus:outline-none bg-transparent"
                    rows="1"
                    placeholder="Ajouter une observation..."
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </PdfGenerator>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PdfGenerator from './PdfGenerator.vue'

// Props
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
    default: null
  }
})

// État local
const roomsOutOfService = ref(0)
const noShows = ref(0)

// Calculs des statistiques
const totalRooms = computed(() => {
  return props.data?.chambers?.length || 0
})

const busyRooms = computed(() => {
  if (!props.data?.locations) return 0
  
  const today = new Date().toISOString().split('T')[0]
  return props.data.locations.filter(location => {
    const checkIn = new Date(location.checkIn_date || location.checkIn).toISOString().split('T')[0]
    const checkOut = new Date(location.checkOut_date || location.checkOut).toISOString().split('T')[0]
    
    return checkIn <= today && checkOut >= today
  }).length
})

const arrivalsExpected = computed(() => {
  if (!props.data?.reservations) return 0
  
  const today = new Date().toISOString().split('T')[0]
  return props.data.reservations.filter(reservation => {
    const checkIn = new Date(reservation.checkIn_date || reservation.checkIn).toISOString().split('T')[0]
    return checkIn === today
  }).length
})

const departuresExpected = computed(() => {
  if (!props.data?.locations) return 0
  
  const today = new Date().toISOString().split('T')[0]
  return props.data.locations.filter(location => {
    const checkOut = new Date(location.checkOut_date || location.checkOut).toISOString().split('T')[0]
    return checkOut === today
  }).length
})

const freeOccupiedRooms = computed(() => {
  if (!props.data?.locations) return 0
  
  const today = new Date().toISOString().split('T')[0]
  return props.data.locations.filter(location => {
    const checkIn = new Date(location.checkIn_date || location.checkIn).toISOString().split('T')[0]
    const checkOut = new Date(location.checkOut_date || location.checkOut).toISOString().split('T')[0]
    
    return checkIn <= today && checkOut >= today && (location.totalPrice === 0 || location.totalPrice === null)
  }).length
})

const freeRooms = computed(() => {
  return totalRooms.value - busyRooms.value - roomsOutOfService.value
})

const totalOccupiedRooms = computed(() => {
  return busyRooms.value + freeOccupiedRooms.value
})

const occupancyRate = computed(() => {
  if (totalRooms.value === 0) return 0
  return Math.round((totalOccupiedRooms.value * 100) / totalRooms.value)
})

// Lignes du tableau de situation
const situationRows = computed(() => [
  {
    label: 'Total Chambres',
    value: totalRooms.value,
    observation: '',
    isPercentage: false
  },
  {
    label: 'Chambres Occupées',
    value: busyRooms.value,
    observation: '',
    isPercentage: false
  },
  {
    label: 'Arrivées Prévues',
    value: arrivalsExpected.value,
    observation: '',
    isPercentage: false
  },
  {
    label: 'Départs Prévus',
    value: departuresExpected.value,
    observation: '',
    isPercentage: false
  },
  {
    label: 'Chambres Occupées Gratuites',
    value: freeOccupiedRooms.value,
    observation: '',
    isPercentage: false
  },
  {
    label: 'Hors Services',
    value: roomsOutOfService.value,
    observation: '',
    isPercentage: false
  },
  {
    label: 'Non Arrivées',
    value: noShows.value,
    observation: '',
    isPercentage: false
  },
  {
    label: 'Chambres Libres',
    value: freeRooms.value,
    observation: '',
    isPercentage: false
  },
  {
    label: 'Total Chambres Occupées',
    value: totalOccupiedRooms.value,
    observation: '',
    isPercentage: false
  },
  {
    label: 'Taux d\'Occupation',
    value: occupancyRate.value,
    observation: '',
    isPercentage: true
  }
])

// Méthodes utilitaires
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatDateForFilename = (date) => {
  if (!date) return new Date().toISOString().split('T')[0]
  return new Date(date).toISOString().split('T')[0]
}
</script>

<style scoped>
.room-situation-report {
  width: 100%;
}

.controls {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.report-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e5e7eb;
}

.hotel-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 20px;
}

.hotel-name {
  font-weight: 500;
}

.hotel-contact {
  font-weight: 500;
}

.separator {
  height: 1px;
  background-color: #e5e7eb;
  margin: 10px 0;
}

.report-title {
  font-size: 24px;
  font-weight: bold;
  margin: 20px 0 10px 0;
  text-transform: uppercase;
  color: #1f2937;
}

.report-date {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.report-content {
  margin-top: 20px;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.report-table th,
.report-table td {
  border: 1px solid #d1d5db;
  padding: 12px;
  text-align: left;
}

.report-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.indicator {
  font-weight: 500;
  color: #1f2937;
  width: 40%;
}

.value {
  text-align: center;
  font-weight: 600;
  color: #059669;
  width: 20%;
}

.observation {
  width: 40%;
}

.observation textarea {
  min-height: 24px;
  line-height: 1.4;
  font-size: 12px;
}

/* Styles spécifiques pour le PDF */
@media print {
  .controls {
    display: none !important;
  }
  
  .report-table {
    font-size: 12px;
  }
  
  .report-table th,
  .report-table td {
    padding: 8px;
  }
  
  .observation textarea {
    border: none !important;
    background: transparent !important;
    resize: none !important;
    outline: none !important;
  }
}
</style> 