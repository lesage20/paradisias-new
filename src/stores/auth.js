import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  // État
  const loggedIn = ref(false)
  const token = ref(null)
  const user = ref({ username: undefined })
  const permissions = ref([])
  const profile = ref({})
  const isLoading = ref(false)

  // URL de l'API - compatible avec l'ancien système
  const apiUrl = ref(window.APP_CONFIG?.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:9001/')

  // Getters
  const isAuthenticated = computed(() => loggedIn.value && !!token.value)
  const userRole = computed(() => user.value?.groups?.[0]?.name || null)
  const isAdmin = computed(() => userRole.value === 'admin')

  // Actions
  const login = async (credentials) => {
    isLoading.value = true
    
    try {
        console.log('login', apiUrl.value)
      const response = await axios.post(`${apiUrl.value}auth/login/`, {
        username: credentials.username,
        password: credentials.password
      })

      // Structure de réponse attendue : { access_token, user: { ... } }
      const data = response.data
      
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
          const profileResponse = await axios.get(
            `${apiUrl.value}accounts/profiles/${data.user.profil}`,
            {
              headers: { Authorization: `Bearer ${token.value}` }
            }
          )
          profile.value = profileResponse.data
        } catch (profileErr) {
          console.warn('Impossible de charger le profil utilisateur:', profileErr)
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      
      let errorMessage = 'Une erreur est survenue lors de la connexion'
      
      if (error.response) {
        if (error.response.status === 400 || error.response.status === 401) {
          errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect'
        } else {
          errorMessage = `Erreur serveur (${error.response.status})`
        }
      } else if (error.message === 'Network Error') {
        errorMessage = 'Impossible de se connecter au serveur'
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
      await axios.post(`${apiUrl.value}auth/token/verify/`, {
        token: token.value
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
    apiUrl,
    
    // Getters
    isAuthenticated,
    userRole,
    isAdmin,
    
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