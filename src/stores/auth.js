import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // État
  const loggedIn = ref(false)
  const token = ref(null)
  const user = ref({ username: undefined })
  const permissions = ref([])
  const profile = ref({})
  const isLoading = ref(false)

  // Fonction pour obtenir l'URL API de manière dynamique
  const getApiUrl = () => {
    return window.APP_CONFIG?.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:9001/'
  }

  // Getters
  const isAuthenticated = computed(() => loggedIn.value && !!token.value)
  const userRole = computed(() => user.value?.groups?.[0]?.name || null)
  const isAdmin = computed(() => userRole.value === 'admin')

  // Helper pour les requêtes HTTP avec authentification
  const apiRequest = async (endpoint, options = {}) => {
    const url = `${getApiUrl()}${endpoint}`
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    // Ajouter l'authentification si disponible
    if (token.value) {
      defaultOptions.headers['Authorization'] = `Bearer ${token.value}`
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
          console.error('❌ Erreur 401: Non authentifié')
          logout() // Déconnexion automatique si le token est invalide
          throw new Error('Authentification requise. Veuillez vous reconnecter.')
        }
        
        const errorData = await response.text()
        throw new Error(`Erreur HTTP ${response.status}: ${errorData}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`❌ Erreur API sur ${endpoint}:`, error.message)
      throw error
    }
  }

  // Actions
  const login = async (credentials) => {
    isLoading.value = true
    
    try {
      console.log('Tentative de connexion sur:', getApiUrl())
      
      const data = await apiRequest('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        }),
      })

      // Structure de réponse attendue : { access_token, user: { ... } }
      loggedIn.value = true
      token.value = data.access_token
      user.value = data.user
      
      // Récupérer les permissions si l'utilisateur a des groupes
      if (data.user.groups && data.user.groups.length > 0) {
        permissions.value = data.user.groups[0].permissions || []
      }

      // Récupérer le profil utilisateur si disponible
      if (data.user.profil) {
        try {
          const profileData = await apiRequest(`/accounts/profiles/${data.user.profil}`)
          profile.value = profileData
        } catch (profileErr) {
          console.warn('Impossible de charger le profil utilisateur:', profileErr)
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      
      let errorMessage = 'Une erreur est survenue lors de la connexion'
      
      if (error.message.includes('401')) {
        errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect'
      } else if (error.message.includes('Network Error') || error.message.includes('fetch')) {
        errorMessage = 'Impossible de se connecter au serveur'
      } else if (error.message.includes('500')) {
        errorMessage = 'Erreur serveur interne'
      }

      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    loggedIn.value = false
    token.value = null
    user.value = { username: undefined }
    permissions.value = []
    profile.value = {}
  }

  const checkAuth = async () => {
    if (!token.value) {
      return false
    }

    try {
      await apiRequest('/auth/token/verify/', {
        method: 'POST',
        body: JSON.stringify({
          token: token.value
        }),
      })
      return true
    } catch (error) {
      console.warn('Token invalide, déconnexion:', error)
      logout()
      return false
    }
  }

  const setProfile = (data) => {
    profile.value = data
  }

  const setPermissions = (data) => {
    permissions.value = data
  }

  return {
    // État
    loggedIn,
    token,
    user,
    permissions,
    profile,
    isLoading,
    
    // Getters
    isAuthenticated,
    userRole,
    isAdmin,
    getApiUrl, // Exposer la fonction pour le debug
    
    // Actions
    login,
    logout,
    checkAuth,
    setProfile,
    setPermissions
  }
}, {
  persist: true
}) 