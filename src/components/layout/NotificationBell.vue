<template>
  <div class="relative">
    <button
      @click="toggleNotifications"
      class="relative p-2 rounded-lg hover:bg-paradisias-100 transition-colors"
    >
      <Bell class="w-5 h-5 text-paradisias-600" />
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error-500 text-xs text-white font-medium"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
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
        v-if="notificationsOpen"
        class="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
        @click.stop
      >
        <div class="p-4 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-gray-900">Notifications</h3>
            <button
              v-if="unreadCount > 0"
              @click="markAllAsRead"
              class="text-sm text-paradisias-600 hover:text-paradisias-700"
            >
              Tout marquer comme lu
            </button>
          </div>
        </div>

        <div class="max-h-80 overflow-y-auto">
          <div v-if="notifications.length === 0" class="p-6 text-center">
            <Bell class="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500">Aucune notification</p>
          </div>
          
          <div v-else>
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
              :class="{ 'bg-blue-50': !notification.read }"
              @click="markAsRead(notification.id)"
            >
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center"
                    :class="getNotificationColor(notification.type)"
                  >
                    <component :is="getNotificationIcon(notification.type)" class="w-4 h-4" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900" :class="{ 'font-semibold': !notification.read }">
                    {{ notification.title }}
                  </p>
                  <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
                  <p class="text-xs text-gray-400 mt-2">{{ formatTime(notification.timestamp) }}</p>
                </div>
                <div v-if="!notification.read" class="w-2 h-2 bg-paradisias-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-3 border-t border-gray-100">
          <button class="w-full text-sm text-paradisias-600 hover:text-paradisias-700 text-center">
            Voir toutes les notifications
          </button>
        </div>
      </div>
    </Transition>

    <!-- Overlay -->
    <div
      v-if="notificationsOpen"
      @click="closeNotifications"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Bell, CheckCircle, AlertTriangle, Info, Calendar, User } from 'lucide-vue-next'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

// État local
const notificationsOpen = ref(false)

// Données simulées des notifications
const notifications = ref([
  {
    id: 1,
    type: 'success',
    title: 'Réservation confirmée',
    message: 'La réservation #R2024001 a été confirmée avec succès.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false
  },
  {
    id: 2,
    type: 'warning',
    title: 'Chambre nécessite entretien',
    message: 'La chambre 205 nécessite un entretien urgent.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false
  },
  {
    id: 3,
    type: 'info',
    title: 'Nouveau client enregistré',
    message: 'Un nouveau client a été ajouté à la base de données.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    read: true
  }
])

// Computed
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// Méthodes
const toggleNotifications = () => {
  notificationsOpen.value = !notificationsOpen.value
}

const closeNotifications = () => {
  notificationsOpen.value = false
}

const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const getNotificationIcon = (type) => {
  const icons = {
    success: CheckCircle,
    warning: AlertTriangle,
    info: Info,
    reservation: Calendar,
    user: User
  }
  return icons[type] || Info
}

const getNotificationColor = (type) => {
  const colors = {
    success: 'bg-success-100 text-success-600',
    warning: 'bg-warning-100 text-warning-600',
    info: 'bg-info-100 text-info-600',
    reservation: 'bg-paradisias-100 text-paradisias-600',
    user: 'bg-lagoon-100 text-lagoon-600'
  }
  return colors[type] || 'bg-gray-100 text-gray-600'
}

const formatTime = (timestamp) => {
  return formatDistanceToNow(timestamp, { addSuffix: true, locale: fr })
}
</script> 