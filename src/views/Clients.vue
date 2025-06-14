<template>
  <div class="space-y-6">
    <!-- Header avec actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Clients</h1>
        <p class="text-gray-600 mt-1">Gestion de la base de données clients</p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <button @click="exportData" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200">
          <Download class="w-4 h-4 mr-2" />
          Exporter
        </button>
        <button @click="openCreateModal" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200">
          <Plus class="w-4 h-4 mr-2" />
          Nouveau client
        </button>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total clients</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalClients }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <UserPlus class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Ce mois</p>
            <p class="text-2xl font-bold text-gray-900">{{ newClientsThisMonth }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <UserCheck class="w-6 h-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Avec email</p>
            <p class="text-2xl font-bold text-gray-900">{{ clientsWithEmail }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Globe class="w-6 h-6 text-orange-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Nationalités</p>
            <p class="text-2xl font-bold text-gray-900">{{ uniqueNationalities }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="filters.search"
              type="text"
              placeholder="Nom, prénom, téléphone..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Genre</label>
          <select v-model="filters.gender" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option value="">Tous</option>
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type de pièce</label>
          <select v-model="filters.idType" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option value="">Tous les types</option>
            <option value="cni">CNI</option>
            <option value="passeport">Passeport</option>
            <option value="attestation">Attestation</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nationalité</label>
          <select v-model="filters.nationality" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option value="">Toutes</option>
            <option v-for="nat in allNationalities" :key="nat" :value="nat">
              {{ nat }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button @click="resetFilters" class="text-sm text-gray-500 hover:text-gray-700">
            Réinitialiser filtres
          </button>
          <span class="text-sm text-gray-500">{{ filteredClients.length }} résultat(s)</span>
        </div>
        
        <div v-if="selectedClients.length > 0" class="flex items-center space-x-2">
          <span class="text-sm text-gray-500">{{ selectedClients.length }} sélectionné(s)</span>
          <button @click="bulkDelete" class="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-white bg-red-600 hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200">
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Loading spinner -->
    <div v-if="isLoading && !clients.length" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>

    <!-- Tableau des clients -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Liste des clients</h3>
          <div class="flex items-center space-x-2">
            <button
              v-for="view in ['grid', 'list']"
              :key="view"
              @click="currentView = view"
              :class="[
                'p-2 rounded-lg',
                currentView === view ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'
              ]"
            >
              <component :is="view === 'grid' ? Grid : List" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Vue liste -->
      <div v-if="currentView === 'list'" class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  :checked="selectedClients.length === filteredClients.length && filteredClients.length > 0"
                  @change="toggleSelectAll"
                  class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identité</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nationalité</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inscription</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="client in paginatedClients" :key="client.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <input
                  type="checkbox"
                  :value="client.id"
                  v-model="selectedClients"
                  class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User class="w-5 h-5 text-purple-600" />
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ client.name }} {{ client.firstname }}</div>
                    <div class="text-sm text-gray-500">{{ client.gender === 'homme' ? 'M.' : 'Mme' }} - {{ calculateAge(client.dob) }} ans</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ client.phone }}</div>
                <div class="text-sm text-gray-500">{{ client.email || 'Pas d\'email' }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ formatIdType(client.idType) }}</div>
                <div class="text-sm text-gray-500">{{ client.idNumber }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ client.nationnalite || 'Non renseignée' }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ formatDate(client.created_at) }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <button @click="viewClient(client)" class="text-purple-600 hover:text-purple-900">
                    <Eye class="w-4 h-4" />
                  </button>
                  <button @click="editClient(client)" class="text-blue-600 hover:text-blue-900">
                    <Edit class="w-4 h-4" />
                  </button>
                  <button @click="deleteClient(client)" class="text-red-600 hover:text-red-900">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Vue grille -->
      <div v-else class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="client in paginatedClients"
            :key="client.id"
            class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <User class="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-900">{{ client.name }} {{ client.firstname }}</h4>
                  <p class="text-xs text-gray-500">{{ client.gender === 'homme' ? 'Monsieur' : 'Madame' }}</p>
                </div>
              </div>
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ calculateAge(client.dob) }} ans
              </span>
            </div>
            
            <div class="space-y-2 mb-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Téléphone</span>
                <span class="font-medium">{{ client.phone }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Email</span>
                <span class="font-medium">{{ client.email || 'N/A' }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Pièce d'identité</span>
                <span class="font-medium">{{ formatIdType(client.idType) }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Nationalité</span>
                <span class="font-medium">{{ client.nationnalite || 'N/A' }}</span>
              </div>
            </div>
            
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
              <button @click="viewClient(client)" class="text-purple-600 hover:text-purple-900 text-sm font-medium">
                Détails
              </button>
              <div class="flex items-center space-x-2">
                <button @click="editClient(client)" class="text-blue-600 hover:text-blue-900">
                  <Edit class="w-4 h-4" />
                </button>
                <button @click="deleteClient(client)" class="text-red-600 hover:text-red-900">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-700">Afficher</span>
          <select v-model="itemsPerPage" class="border border-gray-300 rounded px-2 py-1 text-sm">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span class="text-sm text-gray-700">par page</span>
        </div>
        
        <div class="flex items-center space-x-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
          >
            Précédent
          </button>
          
          <div class="flex items-center space-x-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-3 py-1 text-sm rounded',
                currentPage === page
                  ? 'bg-purple-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de création/édition -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEditing ? 'Modifier le client' : 'Nouveau client' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveClient" class="p-6 space-y-6">
          <!-- Informations personnelles -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Informations personnelles</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  maxlength="50"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Nom de famille"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Prénom(s) *</label>
                <input
                  v-model="form.firstname"
                  type="text"
                  required
                  maxlength="100"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Prénom(s)"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Genre *</label>
                <select
                  v-model="form.gender"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date de naissance *</label>
                <input
                  v-model="form.dob"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Lieu de naissance</label>
                <input
                  v-model="form.place_of_birth"
                  type="text"
                  maxlength="50"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ville de naissance"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nationalité</label>
                <input
                  v-model="form.nationnalite"
                  type="text"
                  maxlength="50"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ivoirienne, Française, etc."
                />
              </div>
            </div>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Contact</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  required
                  maxlength="50"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="+225 XX XX XX XX"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  maxlength="250"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="email@exemple.com"
                />
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <input
                  v-model="form.address"
                  type="text"
                  maxlength="50"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Adresse complète"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Domicile</label>
                <input
                  v-model="form.domicile"
                  type="text"
                  maxlength="150"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Lieu de résidence"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Profession</label>
                <input
                  v-model="form.job"
                  type="text"
                  maxlength="50"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Profession"
                />
              </div>
            </div>
          </div>

          <!-- Pièce d'identité -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Pièce d'identité</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Type de pièce *</label>
                <select
                  v-model="form.idType"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  <option value="cni">CNI</option>
                  <option value="passeport">Passeport</option>
                  <option value="attestation">Attestation</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Numéro *</label>
                <input
                  v-model="form.idNumber"
                  type="text"
                  required
                  maxlength="20"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Numéro de la pièce"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date de délivrance *</label>
                <input
                  v-model="form.id_delivered_at"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Lieu de délivrance *</label>
                <input
                  v-model="form.id_delivered_place"
                  type="text"
                  required
                  maxlength="150"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Lieu de délivrance"
                />
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Délivrée par *</label>
                <input
                  v-model="form.id_delivered_by"
                  type="text"
                  required
                  maxlength="150"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Autorité de délivrance"
                />
              </div>
            </div>
          </div>

          <!-- Informations familiales -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Informations familiales (optionnel)</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom du père</label>
                <input
                  v-model="form.father"
                  type="text"
                  maxlength="150"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Nom complet du père"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom de la mère</label>
                <input
                  v-model="form.mother"
                  type="text"
                  maxlength="150"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Nom complet de la mère"
                />
              </div>
            </div>
          </div>
          
          <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button type="button" @click="closeModal" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200">
              Annuler
            </button>
            <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200" :disabled="isSaving">
              <span v-if="isSaving">Enregistrement...</span>
              <span v-else>{{ isEditing ? 'Mettre à jour' : 'Créer le client' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  Plus, Search, Download, Grid, List, User, Eye, Edit, Trash2, X,
  Users, UserPlus, UserCheck, Globe
} from 'lucide-vue-next'
import { clientsAPI } from '../services/api.js'

// État
const showModal = ref(false)
const isEditing = ref(false)
const isLoading = ref(false)
const isSaving = ref(false)
const currentView = ref('list')
const currentPage = ref(1)
const itemsPerPage = ref(25)
const selectedClients = ref([])

// Données
const clients = ref([])

// Filtres
const filters = ref({
  search: '',
  gender: '',
  idType: '',
  nationality: ''
})

// Formulaire
const form = ref({
  name: '',
  firstname: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  dob: '',
  place_of_birth: '',
  department: '',
  nationnalite: '',
  job: '',
  domicile: '',
  idType: '',
  idNumber: '',
  id_delivered_at: '',
  id_delivered_place: '',
  id_delivered_by: '',
  father: '',
  mother: ''
})

// Computed - Statistiques
const totalClients = computed(() => {
  return clients.value.length
})

const newClientsThisMonth = computed(() => {
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  
  return clients.value.filter(client => {
    if (!client.created_at) return false
    const createdDate = new Date(client.created_at)
    return createdDate.getMonth() === thisMonth && createdDate.getFullYear() === thisYear
  }).length
})

const clientsWithEmail = computed(() => {
  return clients.value.filter(client => client.email && client.email.trim() !== '').length
})

const uniqueNationalities = computed(() => {
  const nationalities = new Set()
  clients.value.forEach(client => {
    if (client.nationnalite && client.nationnalite.trim() !== '') {
      nationalities.add(client.nationnalite)
    }
  })
  return nationalities.size
})

const allNationalities = computed(() => {
  const nationalities = new Set()
  clients.value.forEach(client => {
    if (client.nationnalite && client.nationnalite.trim() !== '') {
      nationalities.add(client.nationnalite)
    }
  })
  return Array.from(nationalities).sort()
})

// Computed - Filtrage et pagination
const filteredClients = computed(() => {
  let filtered = clients.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(client => {
      const fullName = `${client.name} ${client.firstname}`.toLowerCase()
      const phone = client.phone?.toLowerCase() || ''
      const email = client.email?.toLowerCase() || ''
      
      return fullName.includes(search) ||
             phone.includes(search) ||
             email.includes(search)
    })
  }

  if (filters.value.gender) {
    filtered = filtered.filter(client => client.gender === filters.value.gender)
  }

  if (filters.value.idType) {
    filtered = filtered.filter(client => client.idType === filters.value.idType)
  }

  if (filters.value.nationality) {
    filtered = filtered.filter(client => client.nationnalite === filters.value.nationality)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredClients.value.length / itemsPerPage.value))

const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredClients.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxPages = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxPages / 2))
  let end = Math.min(totalPages.value, start + maxPages - 1)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Méthodes utilitaires
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR')
}

const calculateAge = (birthDate) => {
  if (!birthDate) return 'N/A'
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

const formatIdType = (idType) => {
  const types = {
    'cni': 'CNI',
    'passeport': 'Passeport',
    'attestation': 'Attestation'
  }
  return types[idType] || idType
}

// Méthodes de chargement des données
const loadClients = async () => {
  try {
    isLoading.value = true
    const response = await clientsAPI.getClients()
    clients.value = response || []
  } catch (error) {
    console.error('Erreur lors du chargement des clients:', error)
  } finally {
    isLoading.value = false
  }
}

// Méthodes d'actions
const resetFilters = () => {
  filters.value = {
    search: '',
    gender: '',
    idType: '',
    nationality: ''
  }
}

const toggleSelectAll = () => {
  if (selectedClients.value.length === filteredClients.value.length) {
    selectedClients.value = []
  } else {
    selectedClients.value = filteredClients.value.map(client => client.id)
  }
}

const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    name: '',
    firstname: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    dob: '',
    place_of_birth: '',
    department: '',
    nationnalite: '',
    job: '',
    domicile: '',
    idType: '',
    idNumber: '',
    id_delivered_at: '',
    id_delivered_place: '',
    id_delivered_by: '',
    father: '',
    mother: ''
  }
  showModal.value = true
}

const editClient = (client) => {
  isEditing.value = true
  form.value = {
    id: client.id,
    name: client.name || '',
    firstname: client.firstname || '',
    gender: client.gender || '',
    phone: client.phone || '',
    email: client.email || '',
    address: client.address || '',
    dob: client.dob || '',
    place_of_birth: client.place_of_birth || '',
    department: client.department || '',
    nationnalite: client.nationnalite || '',
    job: client.job || '',
    domicile: client.domicile || '',
    idType: client.idType || '',
    idNumber: client.idNumber || '',
    id_delivered_at: client.id_delivered_at || '',
    id_delivered_place: client.id_delivered_place || '',
    id_delivered_by: client.id_delivered_by || '',
    father: client.father || '',
    mother: client.mother || ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
}

const saveClient = async () => {
  try {
    isSaving.value = true
    
    // Préparer les données pour l'API
    const clientData = { ...form.value }
    delete clientData.id // Retirer l'ID pour l'API
    
    if (isEditing.value) {
      await clientsAPI.updateClient(form.value.id, clientData)
    } else {
      await clientsAPI.createClient(clientData)
    }
    
    await loadClients()
    closeModal()
    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    // TODO: afficher une notification d'erreur
  } finally {
    isSaving.value = false
  }
}

const viewClient = (client) => {
  console.log('Voir détails du client:', client)
  // TODO: implémenter la vue détaillée
}

const deleteClient = async (client) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${client.name} ${client.firstname} ?`)) {
    try {
      await clientsAPI.deleteClient(client.id)
      await loadClients()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

const bulkDelete = async () => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedClients.value.length} clients sélectionnés ?`)) {
    try {
      // Supprimer en série (attention aux limitations API)
      for (const clientId of selectedClients.value) {
        await clientsAPI.deleteClient(clientId)
      }
      
      selectedClients.value = []
      await loadClients()
    } catch (error) {
      console.error('Erreur lors de la suppression en masse:', error)
    }
  }
}

const exportData = () => {
  console.log('Export des données clients')
  // TODO: implémenter l'export
}

// Surveillance des filtres de recherche
watch(() => filters.value.search, () => {
  currentPage.value = 1
})

// Chargement initial
onMounted(async () => {
  await loadClients()
})
</script> 