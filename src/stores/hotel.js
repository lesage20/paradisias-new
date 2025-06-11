import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useHotelStore = defineStore('hotel', () => {
  // Stores liés
  const authStore = useAuthStore()

  // État principal
  const isLoading = ref(false)
  const error = ref(null)

  // Données hôtel
  const rooms = ref([])
  const roomTypes = ref([])
  const floors = ref([])
  const locations = ref([])
  const reservations = ref([])
  const guests = ref([])
  const employees = ref([])
  const expenses = ref([])
  const coupons = ref([])
  const reports = ref([])

  // Statistiques
  const statistics = ref({
    totalRevenue: 0,
    monthlyRevenue: 0,
    dailyRevenue: 0,
    totalLocations: 0,
    totalGuests: 0,
    totalRooms: 0,
    occupancyRate: 0
  })

  // Getters
  const availableRooms = computed(() => {
    return rooms.value.filter(room => room.status === 'available')
  })

  const occupiedRooms = computed(() => {
    return rooms.value.filter(room => room.status === 'occupied')
  })

  const pendingReservations = computed(() => {
    return reservations.value.filter(res => res.status === 'en attente')
  })

  const todayLocations = computed(() => {
    const today = new Date().toDateString()
    return locations.value.filter(loc => 
      new Date(loc.checkIn).toDateString() === today
    )
  })

  const monthlyRevenue = computed(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    return locations.value
      .filter(loc => {
        const locDate = new Date(loc.checkIn)
        return locDate.getMonth() === currentMonth && 
               locDate.getFullYear() === currentYear &&
               loc.status === 'payée'
      })
      .reduce((total, loc) => total + (loc.totalPrice || 0), 0)
  })

  const weeklyRevenueData = computed(() => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    const revenues = Array(7).fill(0)
    const expenses = Array(7).fill(0)
    
    // Calcul des revenus par jour de la semaine
    locations.value.forEach(loc => {
      if (loc.status === 'payée') {
        const dayIndex = new Date(loc.checkIn).getDay()
        revenues[dayIndex === 0 ? 6 : dayIndex - 1] += loc.totalPrice || 0
      }
    })
    
    return { days, revenues, expenses }
  })

  // Actions - Gestion des chambres
  const fetchRooms = async () => {
    isLoading.value = true
    try {
      const response = await axios.get(`${authStore.apiUrl}rooms/`)
      rooms.value = response.data
    } catch (err) {
      error.value = 'Erreur lors du chargement des chambres'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const createRoom = async (roomData) => {
    try {
      const response = await axios.post(`${authStore.apiUrl}rooms/`, roomData)
      rooms.value.push(response.data)
      return { success: true, data: response.data }
    } catch (err) {
      error.value = 'Erreur lors de la création de la chambre'
      return { success: false, error: err.response?.data }
    }
  }

  const updateRoom = async (roomId, roomData) => {
    try {
      const response = await axios.put(`${authStore.apiUrl}rooms/${roomId}/`, roomData)
      const index = rooms.value.findIndex(r => r.id === roomId)
      if (index !== -1) {
        rooms.value[index] = response.data
      }
      return { success: true, data: response.data }
    } catch (err) {
      error.value = 'Erreur lors de la mise à jour de la chambre'
      return { success: false, error: err.response?.data }
    }
  }

  // Actions - Gestion des types de chambres
  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get(`${authStore.apiUrl}room-types/`)
      roomTypes.value = response.data
    } catch (err) {
      error.value = 'Erreur lors du chargement des types de chambres'
    }
  }

  // Actions - Gestion des étages
  const fetchFloors = async () => {
    try {
      const response = await axios.get(`${authStore.apiUrl}floors/`)
      floors.value = response.data
    } catch (err) {
      error.value = 'Erreur lors du chargement des étages'
    }
  }

  // Actions - Gestion des locations
  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${authStore.apiUrl}locations/`)
      locations.value = response.data
    } catch (err) {
      error.value = 'Erreur lors du chargement des locations'
    }
  }

  const createLocation = async (locationData) => {
    try {
      const response = await axios.post(`${authStore.apiUrl}locations/`, locationData)
      locations.value.push(response.data)
      return { success: true, data: response.data }
    } catch (err) {
      error.value = 'Erreur lors de la création de la location'
      return { success: false, error: err.response?.data }
    }
  }

  const updateLocationStatus = async (locationId, status) => {
    try {
      const response = await axios.patch(`${authStore.apiUrl}locations/${locationId}/`, { status })
      const index = locations.value.findIndex(l => l.id === locationId)
      if (index !== -1) {
        locations.value[index] = { ...locations.value[index], status }
      }
      return { success: true }
    } catch (err) {
      error.value = 'Erreur lors de la mise à jour du statut'
      return { success: false, error: err.response?.data }
    }
  }

  // Actions - Gestion des réservations
  const fetchReservations = async () => {
    try {
      const response = await axios.get(`${authStore.apiUrl}reservations/`)
      reservations.value = response.data
    } catch (err) {
      error.value = 'Erreur lors du chargement des réservations'
    }
  }

  const confirmReservation = async (reservationId) => {
    try {
      const response = await axios.patch(`${authStore.apiUrl}reservations/${reservationId}/`, { 
        status: 'confirmée' 
      })
      const index = reservations.value.findIndex(r => r.id === reservationId)
      if (index !== -1) {
        reservations.value[index] = response.data
      }
      return { success: true }
    } catch (err) {
      error.value = 'Erreur lors de la confirmation'
      return { success: false, error: err.response?.data }
    }
  }

  // Actions - Gestion des clients
  const fetchGuests = async () => {
    try {
      const response = await axios.get(`${authStore.apiUrl}guests/`)
      guests.value = response.data
    } catch (err) {
      error.value = 'Erreur lors du chargement des clients'
    }
  }

  const createGuest = async (guestData) => {
    try {
      const response = await axios.post(`${authStore.apiUrl}guests/`, guestData)
      guests.value.push(response.data)
      return { success: true, data: response.data }
    } catch (err) {
      error.value = 'Erreur lors de la création du client'
      return { success: false, error: err.response?.data }
    }
  }

  // Actions - Statistiques
  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${authStore.apiUrl}statistics/`)
      statistics.value = response.data
    } catch (err) {
      error.value = 'Erreur lors du chargement des statistiques'
    }
  }

  const calculateStatistics = () => {
    // Calcul local des statistiques
    const totalRevenue = locations.value
      .filter(loc => loc.status === 'payée')
      .reduce((total, loc) => total + (loc.totalPrice || 0), 0)

    const occupancyRate = rooms.value.length > 0 
      ? (occupiedRooms.value.length / rooms.value.length) * 100 
      : 0

    statistics.value = {
      totalRevenue,
      monthlyRevenue: monthlyRevenue.value,
      dailyRevenue: todayLocations.value.reduce((total, loc) => 
        total + (loc.totalPrice || 0), 0),
      totalLocations: locations.value.length,
      totalGuests: guests.value.length,
      totalRooms: rooms.value.length,
      occupancyRate: Math.round(occupancyRate)
    }
  }

  // Actions - Initialisation
  const initializeData = async () => {
    isLoading.value = true
    try {
      await Promise.all([
        fetchRooms(),
        fetchRoomTypes(),
        fetchFloors(),
        fetchLocations(),
        fetchReservations(),
        fetchGuests()
      ])
      calculateStatistics()
    } catch (err) {
      error.value = 'Erreur lors de l\'initialisation des données'
    } finally {
      isLoading.value = false
    }
  }

  return {
    // État
    isLoading,
    error,
    
    // Données
    rooms,
    roomTypes,
    floors,
    locations,
    reservations,
    guests,
    employees,
    expenses,
    coupons,
    reports,
    statistics,
    
    // Getters
    availableRooms,
    occupiedRooms,
    pendingReservations,
    todayLocations,
    monthlyRevenue,
    weeklyRevenueData,
    
    // Actions
    fetchRooms,
    createRoom,
    updateRoom,
    fetchRoomTypes,
    fetchFloors,
    fetchLocations,
    createLocation,
    updateLocationStatus,
    fetchReservations,
    confirmReservation,
    fetchGuests,
    createGuest,
    fetchStatistics,
    calculateStatistics,
    initializeData
  }
}, {
  persist: {
    paths: ['statistics']
  }
}) 