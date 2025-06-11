import { useAuthStore } from '@/stores/auth'

// Configuration de base pour l'API
const API_BASE_URL = 'http://localhost:9001'

// Mode développement - pour tester sans authentification (à désactiver en production)
const DEV_MODE = process.env.NODE_ENV === 'development'

// Helper pour les requêtes HTTP
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  // Ajouter l'authentification si disponible
  let token = null
  try {
    // Essayer d'utiliser le store auth directement
    try {
      const authStore = useAuthStore()
      token = authStore.token
    } catch (error) {
      // Si le store n'est pas disponible, récupérer depuis localStorage
      const authStoreData = localStorage.getItem('auth')
      if (authStoreData) {
        const parsedStore = JSON.parse(authStoreData)
        token = parsedStore.token
      }
    }
  } catch (error) {
    console.warn('Erreur lors de la récupération du token:', error)
  }

  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`
  } else if (DEV_MODE) {
    console.warn('⚠️ Mode développement: Aucun token d\'authentification trouvé')
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error('❌ Erreur 401: Non authentifié. Redirection vers la page de connexion recommandée.')
        
        // Si on est dans un composant Vue, on peut rediriger
        if (typeof window !== 'undefined' && window.location) {
          // Éviter les redirections infinies
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }
        }
        
        throw new Error('Authentification requise. Veuillez vous reconnecter.')
      }
      
      // Autres erreurs HTTP
      const errorData = await response.text()
      throw new Error(`Erreur HTTP ${response.status}: ${errorData}`)
    }

    // Retourner la réponse vide pour les DELETE
    if (response.status === 204) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error(`❌ Erreur API sur ${endpoint}:`, error.message)
    
    // Re-lancer l'erreur pour que les composants puissent la gérer
    throw error
  }
}

// Service pour les locations
export const locationsAPI = {
  // Lister les locations avec filtres optionnels
  async getLocations(filters = {}) {
    const params = new URLSearchParams()
    
    if (filters.checkIn_date) {
      params.append('checkIn_date', filters.checkIn_date)
    }
    if (filters.checkOut_date) {
      params.append('checkOut_date', filters.checkOut_date)
    }

    const endpoint = `/hotel/locations/${params.toString() ? '?' + params.toString() : ''}`
    return await apiRequest(endpoint)
  },

  // Obtenir une location spécifique
  async getLocation(id) {
    return await apiRequest(`/hotel/locations/${id}/`)
  },

  // Créer une nouvelle location
  async createLocation(locationData) {
    return await apiRequest('/hotel/locations/', {
      method: 'POST',
      body: JSON.stringify(locationData),
    })
  },

  // Mettre à jour une location
  async updateLocation(id, locationData) {
    return await apiRequest(`/hotel/locations/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(locationData),
    })
  },

  // Mise à jour partielle d'une location
  async patchLocation(id, partialData) {
    return await apiRequest(`/hotel/locations/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(partialData),
    })
  },

  // Supprimer une location
  async deleteLocation(id) {
    return await apiRequest(`/hotel/locations/${id}/`, {
      method: 'DELETE',
    })
  },
}

// Service pour les réservations
export const reservationsAPI = {
  // Lister toutes les réservations
  async getReservations() {
    return await apiRequest('/hotel/reservations/')
  },

  // Obtenir une réservation spécifique
  async getReservation(id) {
    return await apiRequest(`/hotel/reservations/${id}/`)
  },

  // Créer une nouvelle réservation
  async createReservation(reservationData) {
    return await apiRequest('/hotel/reservations/', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    })
  },

  // Mettre à jour une réservation
  async updateReservation(id, reservationData) {
    return await apiRequest(`/hotel/reservations/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(reservationData),
    })
  },

  // Mise à jour partielle d'une réservation
  async patchReservation(id, partialData) {
    return await apiRequest(`/hotel/reservations/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(partialData),
    })
  },

  // Supprimer une réservation
  async deleteReservation(id) {
    return await apiRequest(`/hotel/reservations/${id}/`, {
      method: 'DELETE',
    })
  },
}

// Services pour les autres entités nécessaires
export const roomsAPI = {
  async getRooms(filters = {}) {
    const params = new URLSearchParams()
    
    if (filters.number) {
      params.append('number', filters.number)
    }
    if (filters.type) {
      params.append('type', filters.type)
    }

    const endpoint = `/hotel/chambres/${params.toString() ? '?' + params.toString() : ''}`
    return await apiRequest(endpoint)
  },

  async getRoom(id) {
    return await apiRequest(`/hotel/chambres/${id}/`)
  },
}

export const roomTypesAPI = {
  async getRoomTypes() {
    return await apiRequest('/hotel/types_chambre/')
  },
}

export const clientsAPI = {
  async getClients() {
    return await apiRequest('/accounts/clients/')
  },

  async getClient(id) {
    return await apiRequest(`/accounts/clients/${id}`)
  },

  async createClient(clientData) {
    return await apiRequest('/accounts/clients/', {
      method: 'POST',
      body: JSON.stringify(clientData),
    })
  },

  async updateClient(id, clientData) {
    return await apiRequest(`/accounts/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    })
  },

  async patchClient(id, partialData) {
    return await apiRequest(`/accounts/clients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(partialData),
    })
  },

  async deleteClient(id) {
    return await apiRequest(`/accounts/clients/${id}`, {
      method: 'DELETE',
    })
  },
}

// Helpers pour le mapping des statuts
export const statusMapping = {
  locations: {
    'pj': 'pending',
    'dj': 'confirmed', 
    'dt': 'checked_in',
    'dp': 'checked_out',
    'archive': 'cancelled'
  },
  reservations: {
    'en attente': 'pending',
    'confirmée': 'confirmed',
    'annulée': 'cancelled'
  }
}

// Helper pour convertir les statuts de l'API vers l'interface
export const mapStatusFromAPI = (status, type = 'locations') => {
  const mapping = statusMapping[type]
  for (const [apiStatus, uiStatus] of Object.entries(mapping)) {
    if (apiStatus === status) return uiStatus
  }
  return status
}

// Helper pour convertir les statuts de l'interface vers l'API
export const mapStatusToAPI = (status, type = 'locations') => {
  const mapping = statusMapping[type]
  for (const [apiStatus, uiStatus] of Object.entries(mapping)) {
    if (uiStatus === status) return apiStatus
  }
  return status
} 