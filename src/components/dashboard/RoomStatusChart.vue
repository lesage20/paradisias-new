<template>
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-6">État des chambres</h3>

        <div class="relative">
            <!-- Graphique ApexCharts -->
            <apexchart v-if="chartData.series.length > 0" type="donut" height="300" :options="chartOptions"
                :series="chartData.series" />

            <!-- État de chargement -->
            <div v-else-if="isLoading" class="flex items-center justify-center h-64">
                <div class="flex items-center space-x-2">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                    <span class="text-sm text-gray-500">Chargement...</span>
                </div>
            </div>

            <!-- Message d'erreur -->
            <div v-else class="flex items-center justify-center h-64">
                <p class="text-sm text-gray-500">Aucune donnée disponible</p>
            </div>
        </div>

        <!-- Légende personnalisée -->
        <div class="mt-6 space-y-2">
            <div v-for="(item, index) in legendItems" :key="index" class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.color }"></div>
                    <span class="text-sm text-gray-700">{{ item.label }}</span>
                </div>
                <span class="text-sm font-medium text-gray-900">{{ item.value }}</span>
            </div>
        </div>

        <!-- Taux d'occupation global -->
        <!-- <div class="mt-6 pt-6 border-t border-gray-200">
            <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">{{ occupancyRate }}%</div>
                <p class="text-sm text-gray-500 mt-1">Taux d'occupation</p>
            </div>
        </div> -->
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { reportsAPI } from '@/services/api'

// État
const isLoading = ref(false)
const chartData = ref({
    labels: [],
    series: []
})

// Configuration du graphique ApexCharts
const chartOptions = computed(() => ({
    chart: {
        type: 'donut',
        fontFamily: 'Inter, sans-serif',
    },
    labels: chartData.value.labels,
    colors: ['#10B981', '#EF4444', '#F59E0B', '#6B7280'], // Vert, Rouge, Jaune, Gris
    legend: {
        show: false // On utilise notre propre légende
    },
    plotOptions: {
        pie: {
            donut: {
                size: '70%',
                labels: {
                    show: true,
                    name: {
                        show: true,
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#374151'
                    },
                    value: {
                        show: true,
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#111827',
                        formatter: function (val) {
                            return parseInt(val)
                        }
                    },
                    total: {
                        show: true,
                        showAlways: true,
                        label: 'Total',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#6B7280',
                        formatter: function (w) {
                            return w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                        }
                    }
                }
            }
        }
    },
    dataLabels: {
        enabled: false
    },
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                height: 250
            }
        }
    }],
    tooltip: {
        y: {
            formatter: function (val, opts) {
                const label = opts.w.globals.labels[opts.seriesIndex]
                return `${val} ${label.toLowerCase()}`
            }
        }
    }
}))

// Légende personnalisée
const legendItems = computed(() => {
    if (!chartData.value.labels.length) return []

    const colors = ['#10B981', '#EF4444', '#F59E0B', '#6B7280']

    return chartData.value.labels.map((label, index) => ({
        label,
        value: chartData.value.series[index] || 0,
        color: colors[index % colors.length]
    }))
})

// Calcul du taux d'occupation
const occupancyRate = computed(() => {
    if (!chartData.value.series.length) return 0

    const totalRooms = chartData.value.series.reduce((sum, value) => sum + value, 0)
    if (totalRooms === 0) return 0

    // Supposons que l'index 1 correspond aux chambres occupées (selon l'ordre de l'API)
    const occupiedRooms = chartData.value.series[1] || 0

    return Math.round((occupiedRooms / totalRooms) * 100)
})

// Méthodes
const fetchRoomStatusData = async () => {
    isLoading.value = true

    try {
        const response = await reportsAPI.getRoomStatusChart()

        if (response && response.labels && response.data) {
            chartData.value = {
                labels: response.labels,
                series: response.data
            }
        }
    } catch (error) {
        console.error('Erreur lors du chargement des données de statut des chambres:', error)
        // Garder les données vides en cas d'erreur
        chartData.value = {
            labels: [],
            series: []
        }
    } finally {
        isLoading.value = false
    }
}

// Méthode pour actualiser les données
const refreshData = async () => {
    await fetchRoomStatusData()
}

// Exposer la méthode refresh pour utilisation par le composant parent
defineExpose({
    refreshData
})

// Charger les données au montage
onMounted(() => {
    fetchRoomStatusData()
})
</script>