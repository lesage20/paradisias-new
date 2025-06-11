<template>
  <div class="relative">
    <button
      @click="toggleMenu"
      class="flex items-center space-x-2 p-2 rounded-lg hover:bg-paradisias-100 transition-colors"
    >
      <div class="w-8 h-8 rounded-full bg-gradient-to-br from-paradisias-500 to-lagoon-500 flex items-center justify-center">
        <User class="w-4 h-4 text-white" />
      </div>
      <ChevronDown class="w-4 h-4 text-paradisias-600" :class="{ 'rotate-180': menuOpen }" />
    </button>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-1"
    >
      <div
        v-if="menuOpen"
        class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
        @click.stop
      >
        <div class="p-4 border-b border-gray-100">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-paradisias-500 to-lagoon-500 flex items-center justify-center">
              <component :is="authStore.isAdmin ? Shield : User" class="w-5 h-5 text-white" />
            </div>
            <div>
              <p class="font-semibold text-gray-900">{{ authStore.userName }}</p>
              <p class="text-sm text-gray-500 capitalize">{{ authStore.userRole }}</p>
            </div>
          </div>
        </div>

        <div class="p-2">
          <button
            @click="toggleTheme"
            class="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <component :is="isDark ? Sun : Moon" class="w-4 h-4 mr-3" />
            {{ isDark ? 'Mode clair' : 'Mode sombre' }}
          </button>
          
          <button
            class="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings class="w-4 h-4 mr-3" />
            Paramètres
          </button>
          
          <button
            class="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <HelpCircle class="w-4 h-4 mr-3" />
            Aide
          </button>
        </div>

        <div class="p-2 border-t border-gray-100">
          <button
            @click="logout"
            class="w-full flex items-center px-3 py-2 text-sm text-error-600 hover:bg-error-50 rounded-lg transition-colors"
          >
            <LogOut class="w-4 h-4 mr-3" />
            Déconnexion
          </button>
        </div>
      </div>
    </Transition>

    <!-- Overlay -->
    <div
      v-if="menuOpen"
      @click="closeMenu"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  User, Shield, ChevronDown, Settings, HelpCircle, LogOut, Moon, Sun 
} from 'lucide-vue-next'

// Stores et router
const authStore = useAuthStore()
const router = useRouter()

// État local
const menuOpen = ref(false)
const isDark = ref(false)

// Méthodes
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  // TODO: Implémenter le changement de thème
  closeMenu()
}

const logout = () => {
  authStore.logout()
  router.push('/login')
  closeMenu()
}
</script> 