<template>
  <div class="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
    <!-- Effets de fond subtils -->
    <div class="absolute inset-0 opacity-20">
      <!-- Gradients flottants plus subtils -->
      <div class="absolute top-20 -left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div class="absolute top-40 -right-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-20 left-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Contenu centré -->
    <div class="relative z-10 h-full flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <!-- Card de connexion -->
        <div class="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white border-opacity-20 p-8">
          <!-- Formulaire -->
          <RouterView />
        </div>

        <!-- Footer minimal -->
        <div class="text-center mt-4">
          <p class="text-purple-200 text-sm opacity-75">
            © 2024 Paradisias Hotel - Man, Côte d'Ivoire
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Plus besoin d'importer Building2 car l'icône sera dans Login.vue
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 8s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style> 