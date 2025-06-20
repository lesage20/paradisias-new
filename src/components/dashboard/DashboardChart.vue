<template>
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h3 class="text-lg font-medium text-gray-900">
                    {{ chartData.title || chartTitle }}
                </h3>
                <p v-if="chartData.subtitle" class="text-sm text-gray-500 mt-1">
                    {{ chartData.subtitle }}
                </p>
                <p v-if="chartData.total !== undefined && chartData.unit"
                    class="text-xs text-purple-600 font-medium mt-1">
                    Total: {{ chartData.total.toLocaleString('fr-FR') }} {{ chartData.unit }}
                </p>
            </div>
            <div class="flex items-center space-x-4">
                <!-- Sélecteur de période -->
                <select v-model="selectedPeriod" @change="onPeriodChange"
                    class="px-3 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option v-for="period in periodOptions" :key="period.value" :value="period.value">
                        {{ period.label }}
                    </option>
                </select>

                <!-- Boutons de types de graphiques -->
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
const selectedChart = ref('revenus')
const selectedPeriod = ref('day')
const isLoading = ref(false)
const error = ref(null)
const chartData = ref({
    series: [],
    categories: [],
    title: '',
    subtitle: '',
    unit: '',
    total: 0,
    periodInfo: ''
})

// Options de périodes
const periodOptions = ref([
    { value: 'day', label: 'Jour' },
    { value: 'week', label: 'Semaine' },
    { value: 'month', label: 'Mois' },
    { value: 'year', label: 'Année' }
])

// Options de graphiques selon le rôle utilisateur
const availableCharts = computed(() => {
    const charts = {
        admin: [
            { key: 'revenus', label: 'Revenus', type: 'bar' },
            { key: 'occupation', label: 'Occupation', type: 'area' },
            { key: 'reservations', label: 'Réservations', type: 'area' }
        ],
        manager: [
            { key: 'revenus', label: 'Revenus', type: 'bar' },
            { key: 'occupation', label: 'Occupation', type: 'area' },
            { key: 'reservations', label: 'Réservations', type: 'area' }
        ],
        receptionist: [
            { key: 'occupation', label: 'Occupation', type: 'area' },
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
        },
        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
                enabled: true,
                delay: 150
            },
            dynamicAnimation: {
                enabled: true,
                speed: 350
            }
        }
    },
    // colors: [themeStore.primaryColor, themeStore.secondaryColor, '#10B981', '#F59E0B'],
    plotOptions: {
        bar: {
            borderRadius: 4,
            dataLabels: {
                position: 'top'
            }
        },
        area: {
            fillTo: 'origin'
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,  // TOUJOURS afficher le stroke
        curve: 'smooth',
        width: chartType.value === 'line' ? 4 : chartType.value === 'area' ? 3 : 0,
        lineCap: 'round'
    },
    markers: {
        size: chartType.value === 'line' ? 6 : chartType.value === 'area' ? 4 : 0,
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
            size: chartType.value === 'line' ? 8 : 6,
            sizeOffset: 3
        }
    },
    fill: {
        type: chartType.value === 'area' ? 'gradient' : 'solid',
        gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.25,
            gradientToColors: [themeStore.secondaryColor],
            inverseColors: false,
            opacityFrom: 0.7,
            opacityTo: 0.3,
            stops: [0, 100]
        }
    },
    xaxis: {
        categories: chartData.value.categories,
        labels: {
            style: {
                colors: themeStore.primaryColor
            }
        }
    },
    yaxis: {
        labels: {
            style: {
                colors: themeStore.primaryColor
            },
            formatter: function (value) {
                if (chartData.value.unit) {
                    return value.toLocaleString('fr-FR') + ' ' + chartData.value.unit
                }
                return value
            }
        },
        forceNiceScale: true,
        decimalsInFloat: 0
    },
    grid: {
        borderColor: '#E5E7EB',
        strokeDashArray: 4
    },
    legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        labels: {
            colors: themeStore.primaryColor
        }
    },
    tooltip: {
        theme: 'light',
        y: {
            formatter: function (value) {
                if (chartData.value.unit) {
                    return value.toLocaleString('fr-FR') + ' ' + chartData.value.unit
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

const onPeriodChange = () => {
    fetchChartData()
}

const getDataName = () => {
    switch (selectedChart.value) {
        case 'revenus':
            return 'Revenus'
        case 'occupation':
            return 'Taux d\'occupation'
        case 'reservations':
            return 'Réservations'
        default:
            return 'Données'
    }
}

const fetchChartData = async () => {
    isLoading.value = true
    error.value = null

    try {
        console.log('Récupération des données graphiques:', selectedChart.value, selectedPeriod.value)

        const response = await reportsAPI.getDashboardCharts({
            type: selectedChart.value,
            period: selectedPeriod.value
        })

        if (response && response.labels && response.data) {
            console.log('=== DONNÉES REÇUES DE L\'API ===')
            console.log('Response:', response)
            console.log('Chart Type:', chartType.value)
            console.log('Selected Chart:', selectedChart.value)

            chartData.value = {
                series: [{ name: getDataName(), data: response.data }],
                categories: response.labels,
                title: response.chart_title || getDataName(),
                subtitle: response.chart_subtitle || '',
                unit: response.unit || '',
                total: response.total || 0,
                periodInfo: response.period_info || ''
            }

            console.log('=== CONFIGURATION DU GRAPHIQUE ===')
            console.log('ChartData configuré:', chartData.value)
            console.log('Stroke config:', {
                show: true,
                curve: 'smooth',
                width: chartType.value === 'line' ? 4 : chartType.value === 'area' ? 3 : 0,
                type: chartType.value
            })
        } else {
            // Données de test si l'API ne retourne rien
            console.log('Utilisation des données de test')
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
    // Données de test selon la période
    const getTestDataByPeriod = () => {
        switch (selectedPeriod.value) {
            case 'day':
                return {
                    categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
                    multiplier: 1
                }
            case 'week':
                return {
                    categories: ['S1', 'S2', 'S3', 'S4'],
                    multiplier: 7
                }
            case 'month':
                return {
                    categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
                    multiplier: 30
                }
            case 'year':
                return {
                    categories: ['2020', '2021', '2022', '2023', '2024'],
                    multiplier: 365
                }
            default:
                return {
                    categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
                    multiplier: 1
                }
        }
    }

    const periodData = getTestDataByPeriod()
    const baseData = [65, 59, 80, 81, 56, 55, 40].slice(0, periodData.categories.length)

    chartData.value = {
        series: [{ name: getDataName(), data: baseData.map(v => v * 1000 * periodData.multiplier) }],
        categories: periodData.categories,
        title: `${getDataName()} - Test`,
        subtitle: `Période de test`,
        unit: selectedChart.value === 'revenus' ? 'FCFA' : selectedChart.value === 'occupation' ? '%' : '',
        total: baseData.reduce((acc, v) => acc + (v * 1000 * periodData.multiplier), 0),
        periodInfo: `Test ${selectedPeriod.value}`
    }
}

// Watchers
watch(selectedPeriod, () => {
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