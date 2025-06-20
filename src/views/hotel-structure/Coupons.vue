<template>
  <div class="space-y-6">
    <!-- Header avec actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Coupons</h1>
        <p class="text-gray-600 mt-1">Gestion des codes de réduction et promotions</p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <button @click="exportData"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200">
          <Download class="w-4 h-4 mr-2" />
          Exporter
        </button>
        <button @click="openCreateModal"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200">
          <Plus class="w-4 h-4 mr-2" />
          Nouveau coupon
        </button>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Ticket class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total coupons</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalCoupons }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Actifs</p>
            <p class="text-2xl font-bold text-gray-900">{{ activeCoupons }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Percent class="w-6 h-6 text-orange-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Réduction max</p>
            <p class="text-2xl font-bold text-gray-900">{{ maxDiscount }}%</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Calendar class="w-6 h-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Expire bientôt</p>
            <p class="text-2xl font-bold text-gray-900">{{ expiringSoon }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Rechercher</label>
          <input v-model="filters.search" type="text" placeholder="Code, nom du coupon..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <select v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm">
            <option value="">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
            <option value="expiré">Expiré</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select v-model="filters.type"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm">
            <option value="">Tous les types</option>
            <option value="pourcentage">Pourcentage</option>
            <option value="fixe">Montant fixe</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading spinner -->
    <div v-if="isLoading && !coupons.length" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>

    <!-- Grille des coupons -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="coupon in filteredCoupons" :key="coupon.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <!-- Header avec statut -->
        <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Ticket class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ coupon.code }}</h3>
                <p class="text-sm text-purple-600 font-medium">{{ coupon.name }}</p>
              </div>
            </div>
            <span :class="getCouponStatusClass(coupon)"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
              {{ getCouponStatusLabel(coupon) }}
            </span>
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="p-6">
          <!-- Valeur de réduction -->
          <div class="text-center mb-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <p class="text-xs text-green-600 font-medium mb-1">RÉDUCTION</p>
            <p class="text-3xl font-bold text-green-700">
              {{ formatDiscount(coupon) }}
            </p>
          </div>

          <!-- Détails -->
          <div class="space-y-3 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Utilisations:</span>
              <span class="font-medium">{{ coupon.usage_count || 0 }} / {{ coupon.usage_limit || '∞' }}</span>
            </div>
            <!-- <div class="flex items-center justify-between">
              <span class="text-gray-600">Date début:</span>
              <span class="font-medium">{{ formatDate(coupon.start_date) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Date fin:</span>
              <span class="font-medium">{{ formatDate(coupon.end_date) }}</span>
            </div> -->
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
            <div class="flex items-center space-x-2">
              <button @click="toggleCouponStatus(coupon)"
                :class="coupon.is_active ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'"
                class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                :title="coupon.is_active ? 'Désactiver' : 'Activer'">
                <Power class="w-4 h-4" />
              </button>
              <button @click="editCoupon(coupon)"
                class="p-2 rounded-lg text-blue-600 hover:text-blue-900 hover:bg-blue-50 transition-colors duration-200">
                <Edit class="w-4 h-4" />
              </button>
            </div>
            <button @click="deleteCoupon(coupon)"
              class="p-2 rounded-lg text-red-600 hover:text-red-900 hover:bg-red-50 transition-colors duration-200">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Carte pour ajouter un nouveau coupon -->
      <div @click="openCreateModal"
        class="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-dashed border-purple-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:from-purple-100 hover:to-purple-200 cursor-pointer transition-all duration-200 min-h-[320px]">
        <div class="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mb-4">
          <Plus class="w-8 h-8 text-purple-600" />
        </div>
        <h3 class="text-lg font-semibold text-purple-700 mb-2">Nouveau coupon</h3>
        <p class="text-sm text-purple-600">Créer un code de réduction</p>
      </div>
    </div>

    <!-- Modal de création/édition -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="closeModal">
      <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto" @click.stop>
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEditing ? 'Modifier le coupon' : 'Nouveau coupon' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>

        <form @submit.prevent="saveCoupon" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Code du coupon *</label>
              <input v-model="form.code" type="text" required maxlength="20"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                placeholder="Ex: SUMMER2024" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom du coupon *</label>
              <input v-model="form.title" type="text" required maxlength="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ex: Promotion été" />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea v-model="form.description" rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Description de la promotion..."></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Type de réduction *</label>
              <select v-model="form.type" required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="pourcentage">Pourcentage</option>
                <option value="fixe">Montant fixe</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Valeur de réduction *
                <span v-if="form.type === 'pourcentage'" class="text-xs text-gray-500">(en %)</span>
                <span v-else class="text-xs text-gray-500">(en FCFA)</span>
              </label>
              <input v-model.number="form.discount" type="number" required min="0"
                :max="form.type === 'pourcentage' ? 100 : undefined"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                :placeholder="form.type === 'pourcentage' ? '20' : '10000'" />
            </div>


            <div class="md:col-span-2">
              <label class="flex items-center">
                <input v-model="form.is_active" type="checkbox"
                  class="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50" />
                <span class="ml-2 text-sm font-medium text-gray-700">Coupon actif</span>
              </label>
            </div>
          </div>

          <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button type="button" @click="closeModal"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200">
              Annuler
            </button>
            <button type="submit"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              :disabled="isSaving">
              <span v-if="isSaving">Enregistrement...</span>
              <span v-else>{{ isEditing ? 'Mettre à jour' : 'Créer le coupon' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Plus, Download, Ticket, CheckCircle, Percent, Calendar,
  Edit, Trash2, X, Power
} from 'lucide-vue-next'
import { couponsAPI } from '../../services/api.js'

// État
const showModal = ref(false)
const isEditing = ref(false)
const isLoading = ref(false)
const isSaving = ref(false)

// Données
const coupons = ref([])

// Filtres
const filters = ref({
  search: '',
  status: '',
  type: ''
})

// Formulaire
const form = ref({
  code: '',
  title: '',
  description: '',
  type: 'pourcentage',
  discount: 0,
  is_active: true
})

// Computed - Statistiques
const totalCoupons = computed(() => coupons.value.length)
const activeCoupons = computed(() => coupons.value.filter(coupon => coupon.is_active && !isExpired(coupon)).length)
const maxDiscount = computed(() => {
  if (coupons.value.length === 0) return 0
  const percentageCoupons = coupons.value.filter(c => c.type === 'pourcentage')
  if (percentageCoupons.length === 0) return 0
  return Math.max(...percentageCoupons.map(c => c.discount || 0))
})
const expiringSoon = computed(() => {
  const today = new Date()
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  return coupons.value.filter(coupon => {
    const endDate = new Date(coupon.end_date)
    return endDate > today && endDate <= nextWeek && coupon.is_active
  }).length
})

// Computed - Filtres
const filteredCoupons = computed(() => {
  let filtered = coupons.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(coupon =>
      coupon.code.toLowerCase().includes(search) ||
      coupon.name.toLowerCase().includes(search)
    )
  }

  if (filters.value.status) {
    filtered = filtered.filter(coupon => {
      if (filters.value.status === 'actif') {
        return coupon.is_active && !isExpired(coupon)
      } else if (filters.value.status === 'inactif') {
        return !coupon.is_active
      } else if (filters.value.status === 'expiré') {
        return isExpired(coupon)
      }
      return true
    })
  }

  if (filters.value.type) {
    filtered = filtered.filter(coupon => coupon.type === filters.value.type)
  }

  return filtered
})

// Méthodes utilitaires
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatDiscount = (coupon) => {
  if (coupon.type === 'pourcentage') {
    return `${coupon.discount}%`
  } else {
    return `${new Intl.NumberFormat('fr-CI').format(coupon.discount)} FCFA`
  }
}

const isExpired = (coupon) => {
  const today = new Date()
  const endDate = new Date(coupon.end_date)
  return endDate < today
}

const getCouponStatusLabel = (coupon) => {
  if (isExpired(coupon)) return 'Expiré'
  if (!coupon.is_active) return 'Inactif'
  return 'Actif'
}

const getCouponStatusClass = (coupon) => {
  if (isExpired(coupon)) return 'bg-red-100 text-red-800'
  if (!coupon.is_active) return 'bg-gray-100 text-gray-800'
  return 'bg-green-100 text-green-800'
}

// Méthodes de chargement des données
const loadCoupons = async () => {
  try {
    isLoading.value = true
    const response = await couponsAPI.getCoupons()
    coupons.value = response || []
  } catch (error) {
    console.error('Erreur lors du chargement des coupons:', error)
  } finally {
    isLoading.value = false
  }
}

// Méthodes d'actions
const openCreateModal = () => {
  isEditing.value = false
  const today = new Date().toISOString().split('T')[0]
  form.value = {
    code: '',
    name: '',
    description: '',
    type: 'pourcentage',
    discount: 0,
    start_date: today,
    end_date: '',
    usage_limit: null,
    minimum_amount: null,
    is_active: true
  }
  showModal.value = true
}

const editCoupon = (coupon) => {
  isEditing.value = true
  form.value = {
    id: coupon.id,
    code: coupon.code || '',
    name: coupon.name || '',
    description: coupon.description || '',
    type: coupon.type || 'pourcentage',
    discount: coupon.discount || 0,
    start_date: coupon.start_date ? coupon.start_date.split('T')[0] : '',
    end_date: coupon.end_date ? coupon.end_date.split('T')[0] : '',
    usage_limit: coupon.usage_limit,
    minimum_amount: coupon.minimum_amount,
    is_active: coupon.is_active ?? true
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
}

const saveCoupon = async () => {
  try {
    isSaving.value = true

    const couponData = { ...form.value }
    delete couponData.id

    if (isEditing.value) {
      await couponsAPI.updateCoupon(form.value.id, couponData)
    } else {
      await couponsAPI.createCoupon(couponData)
    }

    await loadCoupons()
    closeModal()

  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    isSaving.value = false
  }
}

const toggleCouponStatus = async (coupon) => {
  try {
    const newStatus = !coupon.is_active
    await couponsAPI.patchCoupon(coupon.id, { is_active: newStatus })
    await loadCoupons()
  } catch (error) {
    console.error('Erreur lors du changement de statut:', error)
  }
}

const deleteCoupon = async (coupon) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le coupon "${coupon.code}" ?`)) {
    try {
      await couponsAPI.deleteCoupon(coupon.id)
      await loadCoupons()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

const exportData = () => {
  console.log('Export des coupons')
  // TODO: implémenter l'export
}

// Chargement initial
onMounted(async () => {
  await loadCoupons()
})
</script>