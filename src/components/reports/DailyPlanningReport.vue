<template>
  <div class="daily-planning-report">
    <PdfGenerator :title="`planning_journalier_${formatDateForFilename(selectedDate)}`">
      <template #content>
        <div class="report-header">
          <div class="hotel-info">
            <span class="hotel-name">Paradisias Hotel</span>
            <span class="hotel-contact">Tel: +225 0787572030</span>
          </div>
          <div class="separator"></div>
          <h1 class="report-title">PLANNING D'OCCUPATION JOURNALIÈRE DES CHAMBRES</h1>
          <p class="report-date">Journée du {{ formatDate(selectedDate) }}</p>
        </div>

        <div class="report-content">
          <div v-if="filteredChambers.length === 0" class="no-data">
            <p>Aucune donnée disponible pour cette période</p>
          </div>
          <table v-else class="report-table">
            <thead>
              <tr>
                <th>Chambre</th>
                <th>Client</th>
                <th>Date d'entrée</th>
                <th>Date de sortie</th>
                <th>Statut</th>
                <th>Téléphone</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="chamber in filteredChambers" :key="chamber.id">
                <td class="chamber-number">{{ chamber.number }}</td>
                <td class="client-name">{{ getClientName(chamber) }}</td>
                <td class="date">{{ getCheckInDate(chamber) }}</td>
                <td class="date">{{ getCheckOutDate(chamber) }}</td>
                <td class="status">{{ getStatus(chamber) }}</td>
                <td class="phone">{{ getClientPhone(chamber) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </PdfGenerator>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
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

// État
const selectedDate = computed(() => {
  if (props.period === 'custom' && props.customDate) {
    return new Date(props.customDate)
  }
  return new Date()
})

// Données filtrées selon la période
const filteredChambers = computed(() => {
  if (!props.data?.chambers || !props.data?.locations) return []
  
  const targetDate = selectedDate.value.toISOString().split('T')[0]
  
  return props.data.chambers.map(chamber => {
    // Trouver les locations pour cette chambre à la date donnée
    const chamberLocations = props.data.locations.filter(location => {
      const checkIn = new Date(location.checkIn_date || location.checkIn).toISOString().split('T')[0]
      const checkOut = new Date(location.checkOut_date || location.checkOut).toISOString().split('T')[0]
      
      return location.room === chamber.id && checkIn <= targetDate && checkOut >= targetDate
    })
    
    return {
      ...chamber,
      currentLocation: chamberLocations[0] || null
    }
  }).sort((a, b) => a.number - b.number)
})

// Méthodes utilitaires
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatDateForFilename = (date) => {
  if (!date) return new Date().toISOString().split('T')[0]
  return new Date(date).toISOString().split('T')[0]
}

const getClientName = (chamber) => {
  if (!chamber.currentLocation) return 'Libre'
  
  const client = props.data.clients?.find(c => c.id === chamber.currentLocation.guest)
  return client ? `${client.name} ${client.firstname}` : 'Client inconnu'
}

const getClientPhone = (chamber) => {
  if (!chamber.currentLocation) return '-'
  
  const client = props.data.clients?.find(c => c.id === chamber.currentLocation.guest)
  return client?.phone || '-'
}

const getCheckInDate = (chamber) => {
  if (!chamber.currentLocation) return '-'
  return formatDate(chamber.currentLocation.checkIn_date || chamber.currentLocation.checkIn)
}

const getCheckOutDate = (chamber) => {
  if (!chamber.currentLocation) return '-'
  return formatDate(chamber.currentLocation.checkOut_date || chamber.currentLocation.checkOut)
}

const getStatus = (chamber) => {
  if (!chamber.currentLocation) return 'Libre'
  
  const today = new Date().toISOString().split('T')[0]
  const checkIn = new Date(chamber.currentLocation.checkIn_date || chamber.currentLocation.checkIn).toISOString().split('T')[0]
  const checkOut = new Date(chamber.currentLocation.checkOut_date || chamber.currentLocation.checkOut).toISOString().split('T')[0]
  
  if (checkIn === today) return 'Arrivée'
  if (checkOut === today) return 'Départ'
  if (checkIn < today && checkOut > today) return 'Occupée'
  
  return chamber.currentLocation.status || 'En cours'
}
</script>

<style scoped>
.daily-planning-report {
  width: 100%;
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

.no-data {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.report-table th,
.report-table td {
  border: 1px solid #d1d5db;
  padding: 8px;
  text-align: left;
}

.report-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.chamber-number {
  text-align: center;
  font-weight: 600;
  color: #1f2937;
}

.client-name {
  font-weight: 500;
}

.date {
  text-align: center;
  white-space: nowrap;
}

.status {
  text-align: center;
  font-weight: 500;
}

.phone {
  text-align: center;
}

/* Styles spécifiques pour le PDF */
@media print {
  .report-table {
    font-size: 10px;
  }
  
  .report-table th,
  .report-table td {
    padding: 6px;
  }
}
</style> 