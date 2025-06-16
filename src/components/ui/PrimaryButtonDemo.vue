<template>
  <div class="p-8 space-y-8">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Démonstration PrimaryButton</h1>
      <p class="text-gray-600">Ce composant s'adapte automatiquement au thème actif de l'application.</p>
    </div>

    <!-- Variantes principales -->
    <div class="space-y-6">
      <h2 class="text-xl font-semibold text-gray-900">Variantes</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Normal -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-700">Normal</h3>
          <div class="space-y-3">
            <PrimaryButton text="Bouton normal" />
            <PrimaryButton text="Avec icône" :icon-left="Plus" />
            <PrimaryButton text="Chargement" :loading="true" />
            <PrimaryButton text="Désactivé" :disabled="true" />
          </div>
        </div>

        <!-- Flat -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-700">Flat</h3>
          <div class="space-y-3">
            <PrimaryButton text="Bouton flat" flat />
            <PrimaryButton text="Avec icône" :icon-left="Heart" flat />
            <PrimaryButton text="Chargement" :loading="true" flat />
            <PrimaryButton text="Désactivé" :disabled="true" flat />
          </div>
        </div>

        <!-- Outline -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-700">Outline</h3>
          <div class="space-y-3">
            <PrimaryButton text="Bouton outline" outline />
            <PrimaryButton text="Avec icône" :icon-left="Star" outline />
            <PrimaryButton text="Chargement" :loading="true" outline />
            <PrimaryButton text="Désactivé" :disabled="true" outline />
          </div>
        </div>
      </div>
    </div>

    <!-- Tailles -->
    <div class="space-y-6">
      <h2 class="text-xl font-semibold text-gray-900">Tailles</h2>
      
      <div class="flex flex-wrap items-center gap-4">
        <PrimaryButton text="XS" size="xs" />
        <PrimaryButton text="SM" size="sm" />
        <PrimaryButton text="MD" size="md" />
        <PrimaryButton text="LG" size="lg" />
        <PrimaryButton text="XL" size="xl" />
      </div>
    </div>

    <!-- Coins arrondis -->
    <div class="space-y-6">
      <h2 class="text-xl font-semibold text-gray-900">Coins arrondis</h2>
      
      <div class="flex flex-wrap items-center gap-4">
        <PrimaryButton text="None" rounded="none" />
        <PrimaryButton text="SM" rounded="sm" />
        <PrimaryButton text="MD" rounded="md" />
        <PrimaryButton text="LG" rounded="lg" />
        <PrimaryButton text="Full" rounded="full" />
      </div>
    </div>

    <!-- Largeur complète -->
    <div class="space-y-6">
      <h2 class="text-xl font-semibold text-gray-900">Largeur complète</h2>
      
      <div class="space-y-3">
        <PrimaryButton text="Bouton normal" />
        <PrimaryButton text="Largeur complète" full-width />
        <PrimaryButton text="Flat largeur complète" flat full-width />
      </div>
    </div>

    <!-- Avec icônes -->
    <div class="space-y-6">
      <h2 class="text-xl font-semibold text-gray-900">Avec icônes</h2>
      
      <div class="flex flex-wrap items-center gap-4">
        <PrimaryButton text="Icône gauche" :icon-left="Download" />
        <PrimaryButton text="Icône droite" :icon-right="ArrowRight" />
        <PrimaryButton :icon-left="Plus" :icon-right="ArrowRight">
          Les deux côtés
        </PrimaryButton>
      </div>
    </div>

    <!-- Exemples d'usage -->
    <div class="space-y-6">
      <h2 class="text-xl font-semibold text-gray-900">Exemples d'usage</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-3">
          <h3 class="text-lg font-medium text-gray-700">Actions principales</h3>
          <PrimaryButton text="Enregistrer" :icon-left="Save" />
          <PrimaryButton text="Créer nouveau" :icon-left="Plus" />
          <PrimaryButton text="Télécharger" :icon-left="Download" />
        </div>

        <div class="space-y-3">
          <h3 class="text-lg font-medium text-gray-700">Actions secondaires</h3>
          <PrimaryButton text="Modifier" :icon-left="Edit" flat />
          <PrimaryButton text="Partager" :icon-left="Share" outline />
          <PrimaryButton text="Favoris" :icon-left="Heart" flat />
        </div>
      </div>
    </div>

    <!-- Test de changement de thème -->
    <div class="space-y-6">
      <h2 class="text-xl font-semibold text-gray-900">Test de thème</h2>
      <p class="text-gray-600">Changez le thème dans les paramètres pour voir les boutons s'adapter automatiquement !</p>
      
      <div class="flex flex-wrap items-center gap-4">
        <PrimaryButton text="Normal" />
        <PrimaryButton text="Flat" flat />
        <PrimaryButton text="Outline" outline />
      </div>
    </div>
  </div>
</template>

<script setup>
import { PrimaryButton } from '@/components/ui'
import { 
  Plus, Heart, Star, Download, ArrowRight, Save, Edit, Share
} from 'lucide-vue-next'
</script> 