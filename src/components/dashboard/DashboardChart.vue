<template>
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900">
                {{ chartTitle }}
            </h3>
            <div class="flex items-center space-x-2">
                <button v-for="chart in chartButtonOptions" :key="chart.key" @click="selectChart(chart.key)" :class="[
                    'px-3 py-1 text-xs font-medium rounded-full transition-colors',
                    selectedChart === chart.key
                        ? `${themeClasses.bgPrimaryLight} ${themeClasses.textPrimary}`
                        : 'text-gray-500 hover:text-gray-700'
                ]">
                    {{ chart.label }}
                </button>
            </div>
        </div>

        <!-- Graphique ApexCharts -->
        <div class="h-80">
            <div v-if="isLoading" class="h-full flex items-center justify-center">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                    <p class="text-sm text-gray-500">Chargement des données...</p>
                </div>
            </div>

            <div v-else-if="error" class="h-full flex items-center justify-center bg-red-50 rounded-lg">
                <div class="text-center">
                    <AlertCircle class="w-12 h-12 text-red-400 mx-auto mb-2" />
                    <p class="text-sm text-red-600">{{ error }}</p>
                    <button @click="fetchChartData"
                        class="mt-2 px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200">
                        Réessayer
                    </button>
                </div>
            </div>

            <apexchart v-else-if="chartData.series.length > 0" :type="chartType" :options="apexChartOptions"
                :series="chartData.series" height="100%">
            </apexchart>

            <div v-else class="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <div class="text-center">
                    <BarChart3 class="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p class="text-sm text-gray-500">Aucune donnée disponible</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { reportsAPI } from '@/services/api'
import { BarChart3, AlertCircle } from 'lucide-vue-next'

const props = defineProps({
    userRole: {
        type: String,
        default: 'guest'
    },
    period: {
        type: String,
        default: 'today'
    }
})

// Stores
const themeStore = useThemeStore()

// État réactif
const selectedChart = ref('revenue')
const isLoading = ref(false)
const error = ref(null)
const chartData = ref({
    series: [],
    categories: []
})

// Options de graphiques selon le rôle utilisateur
const availableCharts = computed(() => {
    const charts = {
        admin: [
            { key: 'revenue', label: 'Revenus', type: 'bar' },
            { key: 'occupancy', label: 'Occupation', type: 'line' },
            { key: 'reservations', label: 'Réservations', type: 'area' },
            { key: 'payments', label: 'Paiements', type: 'bar' }
        ],
        manager: [
            { key: 'revenue', label: 'Revenus', type: 'bar' },
            { key: 'occupancy', label: 'Occupation', type: 'line' },
            { key: 'reservations', label: 'Réservations', type: 'area' }
        ],
        receptionist: [
            { key: 'occupancy', label: 'Occupation', type: 'line' },
            { key: 'reservations', label: 'Réservations', type: 'area' }
        ]
    }
    return charts[props.userRole] || charts.receptionist
})

// Options de graphiques pour les boutons
const chartButtonOptions = computed(() => availableCharts.value)

// Titre du graphique
const chartTitle = computed(() => {
    const chart = availableCharts.value.find(c => c.key === selectedChart.value)
    return chart ? `Graphique ${chart.label}` : 'Graphique'
})

// Type de graphique
const chartType = computed(() => {
    const chart = availableCharts.value.find(c => c.key === selectedChart.value)
    return chart ? chart.type : 'bar'
})

// Classes de thème
const themeClasses = computed(() => themeStore.themeClasses)

// Configuration ApexCharts
const apexChartOptions = computed(() => ({
    chart: {
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        }
    },
    colors: [themeStore.primaryColor, themeStore.secondaryColor, '#10B981', '#F59E0B'],
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: chartType.value === 'line' ? 3 : 0
    },
    xaxis: {
        categories: chartData.value.categories,
        labels: {
            style: {
                colors: '#6B7280'
            }
        }
    },
    yaxis: {
        labels: {
            style: {
                colors: '#6B7280'
            },
            formatter: function (value) {
                if (selectedChart.value === 'revenue' || selectedChart.value === 'payments') {
                    return value.toLocaleString('fr-FR') + ' FCFA'
                }
                return value
            }
        }
    },
    grid: {
        borderColor: '#E5E7EB',
        strokeDashArray: 4
    },
    legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        labels: {
            colors: '#6B7280'
        }
    },
    tooltip: {
        theme: 'light',
        y: {
            formatter: function (value) {
                if (selectedChart.value === 'revenue' || selectedChart.value === 'payments') {
                    return value.toLocaleString('fr-FR') + ' FCFA'
                }
                return value
            }
        }
    },
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                height: 200
            },
            legend: {
                position: 'bottom'
            }
        }
    }]
}))

// Méthodes
const selectChart = (chartKey) => {
    selectedChart.value = chartKey
    fetchChartData()
}

const fetchChartData = async () => {
    isLoading.value = true
    error.value = null

    try {
        console.log('Récupération des données graphiques:', selectedChart.value, props.period)

        const response = await reportsAPI.getDashboardCharts({
            type: selectedChart.value,
            period: props.period
        })

        if (response && response.data) {
            chartData.value = {
                series: response.data.series || [],
                categories: response.data.categories || []
            }
        } else {
            // Données de test si l'API ne retourne rien
            generateTestData()
        }

    } catch (err) {
        console.error('Erreur lors de la récupération des données graphiques:', err)
        error.value = err.message || 'Erreur lors du chargement des données'

        // Afficher des données de test en cas d'erreur
        generateTestData()
    } finally {
        isLoading.value = false
    }
}

const generateTestData = () => {
    const testData = {
        revenue: {
            series: [
                { name: 'Revenus', data: [65000, 59000, 80000, 81000, 56000, 55000, 40000] }
            ],
            categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
        },
        occupancy: {
            series: [
                { name: 'Taux d\'occupation', data: [65, 59, 80, 81, 56, 55, 40] }
            ],
            categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
        },
        reservations: {
            series: [
                { name: 'Nouvelles réservations', data: [10, 15, 12, 8, 14, 16, 18] },
                { name: 'Confirmées', data: [8, 12, 10, 6, 12, 14, 15] }
            ],
            categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
        },
        payments: {
            series: [
                { name: 'Paiements reçus', data: [45000, 52000, 48000, 61000, 42000, 58000, 67000] }
            ],
            categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
        }
    }

    chartData.value = testData[selectedChart.value] || testData.revenue
}

// Watchers
watch(() => props.period, () => {
    fetchChartData()
})

// Lifecycle
onMounted(() => {
    // Sélectionner le premier graphique disponible
    if (availableCharts.value.length > 0) {
        selectedChart.value = availableCharts.value[0].key
    }
    fetchChartData()
})
</script>

<style scoped>
/* Styles spécifiques au composant si nécessaire */
</style>