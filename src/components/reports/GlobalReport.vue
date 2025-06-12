<template>
  <div class="global-report">
    <PdfGenerator :title="`rapport_global_${formatDateForFilename(selectedDate)}`">
      <template #content>
        <div class="report-header">
          <div class="hotel-info">
            <span class="hotel-name">Paradisias Hotel</span>
            <span class="hotel-contact">Tel: +225 0787572030</span>
          </div>
          <div class="separator"></div>
          <h1 class="report-title">RAPPORT {{ periodText.toUpperCase() }}</h1>
          <p class="report-date">{{ periodText }}</p>
        </div>

        <div class="report-content">
          <!-- Résumé général -->
          <div class="summary-section">
            <div class="chart-container">
              <div class="chart-placeholder">
                <div class="pie-chart">
                  <svg width="300" height="300" viewBox="0 0 300 300">
                    <!-- Graphique en secteurs simple -->
                    <circle cx="150" cy="150" r="100" :stroke-dasharray="`${revenuePercentage * 6.28} 628`" stroke-dashoffset="0" stroke="#10b981" stroke-width="20" fill="none" />
                    <circle cx="150" cy="150" r="100" :stroke-dasharray="`${expensePercentage * 6.28} 628`" :stroke-dashoffset="`${revenuePercentage * 6.28}`" stroke="#ef4444" stroke-width="20" fill="none" />
                  </svg>
                  <div class="chart-legend">
                    <div class="legend-item">
                      <div class="legend-color bg-green-500"></div>
                      <span>Revenus</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-color bg-red-500"></div>
                      <span>Dépenses</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="summary-text">
              <p>
                {{ periodText }} nous avons eu <strong>{{ periodData.locations }}</strong> locations qui ont généré 
                <strong>{{ formatCurrency(periodData.revenue) }}</strong> de revenus bruts, avec 
                <strong>{{ periodData.expenses }}</strong> dépense{{ periodData.expenses > 1 ? 's' : '' }}
                qui {{ periodData.expenses > 1 ? 'ont' : 'a' }} coûté <strong>{{ formatCurrency(periodData.expenseAmount) }}</strong>.
              </p>
              <p class="mt-4">
                Le bénéfice net pour cette période est de <strong>{{ formatCurrency(periodData.profit) }}</strong>.
              </p>
              <p class="mt-2">
                Ci-dessous les tableaux détaillés des locations et dépenses {{ periodText.toLowerCase() }}.
              </p>
            </div>
          </div>

          <!-- Tableau des locations -->
          <div class="table-section">
            <h3 class="table-title">Tableau récapitulatif des locations</h3>
            <table class="report-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Chambre</th>
                  <th>Date d'entrée</th>
                  <th>Date de sortie</th>
                  <th>Montant</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="location in filteredLocations" :key="location.id">
                  <td>{{ getClientName(location.guest) }}</td>
                  <td class="text-center">{{ getRoomNumber(location.room) }}</td>
                  <td class="text-center">{{ formatDate(location.checkIn_date || location.checkIn) }}</td>
                  <td class="text-center">{{ formatDate(location.checkOut_date || location.checkOut) }}</td>
                  <td class="text-right">{{ formatCurrency(location.totalPrice) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Tableau des dépenses -->
          <div class="table-section">
            <h3 class="table-title">Tableau récapitulatif des dépenses</h3>
            <table class="report-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Date</th>
                  <th>Montant</th>
                  <th>Responsable</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="expense in filteredExpenses" :key="expense.id">
                  <td>{{ expense.title }}</td>
                  <td class="text-center">{{ formatDate(expense.date) }}</td>
                  <td class="text-right">{{ formatCurrency(expense.amount) }}</td>
                  <td>{{ getEmployeeName(expense.spent_by) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
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

// Date sélectionnée
const selectedDate = computed(() => {
  if (props.period === 'custom' && props.customDate) {
    return new Date(props.customDate)
  }
  return new Date()
})

// Texte de la période
const periodText = computed(() => {
  switch (props.period) {
    case 'today':
      return 'Aujourd\'hui'
    case 'week':
      return 'Cette semaine'
    case 'month':
      return 'Ce mois'
    case 'custom':
      return `Le ${formatDate(selectedDate.value)}`
    default:
      return 'Aujourd\'hui'
  }
})

// Données filtrées selon la période
const filteredLocations = computed(() => {
  if (!props.data?.locations) return []
  
  return filterDataByPeriod(props.data.locations)
})

const filteredExpenses = computed(() => {
  if (!props.data?.expenses) return []
  
  return filterDataByPeriod(props.data.expenses, 'date')
})

// Données récapitulatives de la période
const periodData = computed(() => {
  const locations = filteredLocations.value
  const expenses = filteredExpenses.value
  
  const revenue = locations.reduce((sum, loc) => sum + (loc.totalPrice || 0), 0)
  const expenseAmount = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
  
  return {
    locations: locations.length,
    expenses: expenses.length,
    revenue,
    expenseAmount,
    profit: revenue - expenseAmount
  }
})

// Pourcentages pour le graphique
const revenuePercentage = computed(() => {
  const total = periodData.value.revenue + periodData.value.expenseAmount
  return total > 0 ? (periodData.value.revenue / total) * 100 : 50
})

const expensePercentage = computed(() => {
  const total = periodData.value.revenue + periodData.value.expenseAmount
  return total > 0 ? (periodData.value.expenseAmount / total) * 100 : 50
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

const formatCurrency = (amount) => {
  if (!amount) return '0 FCFA'
  return new Intl.NumberFormat('fr-CI', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const getClientName = (clientId) => {
  if (!clientId || !props.data?.clients) return 'Client inconnu'
  
  const client = props.data.clients.find(c => c.id === clientId)
  return client ? `${client.name} ${client.firstname}` : 'Client inconnu'
}

const getRoomNumber = (roomId) => {
  if (!roomId || !props.data?.chambers) return 'N/A'
  
  const room = props.data.chambers.find(r => r.id === roomId)
  return room ? room.number : 'N/A'
}

const getEmployeeName = (employeeId) => {
  if (!employeeId || !props.data?.employees) return 'N/A'
  
  const employee = props.data.employees.find(e => e.id === employeeId)
  return employee ? `${employee.name} ${employee.firstname}` : 'N/A'
}

const filterDataByPeriod = (data, dateField = 'checkIn_date') => {
  if (!data || data.length === 0) return []
  
  const today = new Date()
  let startDate, endDate
  
  switch (props.period) {
    case 'today':
      startDate = new Date(today)
      endDate = new Date(today)
      break
    case 'week':
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay() + 1)
      startDate = weekStart
      endDate = new Date(weekStart)
      endDate.setDate(weekStart.getDate() + 6)
      break
    case 'month':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      break
    case 'custom':
      startDate = new Date(props.customDate)
      endDate = new Date(props.customDate)
      break
    default:
      startDate = new Date(today)
      endDate = new Date(today)
  }
  
  return data.filter(item => {
    const itemDate = new Date(item[dateField] || item.checkIn || item.date)
    const itemDateStr = itemDate.toISOString().split('T')[0]
    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]
    
    return itemDateStr >= startDateStr && itemDateStr <= endDateStr
  })
}
</script>

<style scoped>
.global-report {
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

.summary-section {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  align-items: center;
}

.chart-container {
  flex-shrink: 0;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pie-chart {
  position: relative;
}

.chart-legend {
  margin-top: 20px;
  display: flex;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 2px;
}

.summary-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
}

.table-section {
  margin-bottom: 40px;
  page-break-inside: avoid;
}

.table-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #1f2937;
  text-align: center;
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

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

/* Styles spécifiques pour le PDF */
@media print {
  .summary-section {
    flex-direction: column;
    text-align: center;
  }
  
  .chart-container {
    margin-bottom: 20px;
  }
  
  .report-table {
    font-size: 10px;
  }
  
  .report-table th,
  .report-table td {
    padding: 6px;
  }
}
</style> 