<template>
  <div>
    <!-- Header avec icône et titres -->
    <div class="text-center mb-6">
      <div class="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-2xl shadow-purple-500/30 animate-float">
        <Building2 class="w-8 h-8 text-white" />
      </div>
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Paradisias Hotel</h1>
      <p class="text-gray-600 text-sm mb-4">Système de gestion hôtelière</p>
      <h2 class="text-xl font-semibold text-gray-800">Connexion</h2>
    </div>

    <form @submit.prevent="login" class="space-y-5">
      <!-- Champs du formulaire -->
      <div class="space-y-4">
        <!-- Nom d'utilisateur -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
            Nom d'utilisateur
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User class="h-5 w-5 text-gray-400 transition-colors" />
            </div>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              class="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 bg-white transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Entrez votre nom d'utilisateur"
              :disabled="isLoading"
              @focus="clearErrors"
            />
          </div>
        </div>

        <!-- Mot de passe -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock class="h-5 w-5 text-gray-400 transition-colors" />
            </div>
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 bg-white transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Entrez votre mot de passe"
              :disabled="isLoading"
              @focus="clearErrors"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-500 transition-colors"
              :disabled="isLoading"
            >
              <component :is="showPassword ? EyeOff : Eye" class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Options -->
      <div class="flex items-center justify-between">
        <label class="flex items-center">
          <input
            v-model="rememberMe"
            type="checkbox"
            class="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            :disabled="isLoading"
          />
          <span class="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
        </label>
        <a href="#" class="text-sm text-purple-600 hover:text-purple-500 transition-colors">
          Mot de passe oublié ?
        </a>
      </div>

      <!-- Messages d'erreur/succès -->
      <Transition name="fade">
        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center">
            <AlertCircle class="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </Transition>

      <Transition name="fade">
        <div v-if="successMessage" class="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center">
            <CheckCircle class="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
            <p class="text-sm text-green-700">{{ successMessage }}</p>
          </div>
        </div>
      </Transition>

      <!-- Bouton de connexion -->
      <button
        type="submit"
        :disabled="isLoading || !isFormValid"
        class="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-base font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <div v-if="isLoading" class="flex items-center">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
          <span>Connexion...</span>
        </div>
        <div v-else class="flex items-center">
          <LogIn class="h-5 w-5 mr-2" />
          <span>Se connecter</span>
        </div>
      </button>


    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  User, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle, 
  Shield, Users, Building2
} from 'lucide-vue-next'

// Stores et router
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// État réactif
const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const error = ref('')
const successMessage = ref('')

// État de chargement depuis le store
const isLoading = computed(() => authStore.isLoading)

// Validation des champs
const isFormValid = computed(() => {
  return username.value.trim() !== '' && password.value.trim() !== ''
})

// Méthodes
const clearErrors = () => {
  error.value = ''
  successMessage.value = ''
}

const fillDemoCredentials = (type) => {
  if (type === 'admin') {
    username.value = 'admin'
    password.value = 'admin123'
  } else if (type === 'staff') {
    username.value = 'staff'
    password.value = 'staff123'
  }
  clearErrors()
}

const login = async () => {
  clearErrors()

  // Validation côté client
  if (!isFormValid.value) {
    error.value = 'Veuillez remplir tous les champs'
    return
  }

  try {
    // Appel de l'API
    const result = await authStore.login({
      username: username.value.trim(),
      password: password.value
    })
    
    if (result.success) {
      successMessage.value = 'Connexion réussie !'
      
      // Redirection
      setTimeout(() => {
        const redirectPath = route.query.redirect || '/dashboard'
        router.push(redirectPath)
      }, 1000)
    } else {
      error.value = result.error || 'Échec de la connexion'
    }
  } catch (err) {
    console.error('Erreur lors de la connexion:', err)
    error.value = 'Une erreur est survenue'
  }
}
</script>

<style scoped>
/* Animation pour l'icône */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Animations plus subtiles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Focus ring personnalisé */
input:focus {
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}
</style> 