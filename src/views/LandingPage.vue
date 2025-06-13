<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center">
            <img src="@/assets/images/logo3-removebg-preview.png" alt="Logo Paradisias Hotel" class="h-12 w-auto mr-3" />
            <div>
              <h1 class="text-2xl font-bold text-[#09402C]">PARADISIAS</h1>
              <span class="text-xs text-[#D99791] font-medium tracking-wider text-center">HOTEL</span>
            </div>
          </div>
          <div class="hidden md:flex space-x-8">
            <a href="#accueil" class="text-gray-700 hover:text-[#09402C] transition-colors font-medium">Accueil</a>
            <a href="#chambres" class="text-gray-700 hover:text-[#09402C] transition-colors font-medium">Chambres</a>
            <a href="#services" class="text-gray-700 hover:text-[#09402C] transition-colors font-medium">Services</a>
            <a href="#testimonials" class="text-gray-700 hover:text-[#09402C] transition-colors font-medium">Avis</a>
            <a href="#contact" class="text-gray-700 hover:text-[#09402C] transition-colors font-medium">Contact</a>
          </div>
          <div class="flex items-center space-x-6">
            <button @click="$router.push('/register')" class="text-[#09402C] font-semibold hover:text-[#D99791] transition-colors">
              Créer un compte
            </button>
            <button @click="$router.push('/login')" class="text-[#D99791] font-semibold hover:text-[#09402C] transition-colors">
              Connexion
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="accueil" class="relative h-screen flex items-center justify-center overflow-hidden">
      <!-- Image de fond avec filtre noir transparent optimisé -->
      <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3')] bg-cover bg-center"></div>
      <div class="absolute inset-0 bg-black/60"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-[#09402C]/30 via-transparent to-[#09402C]/40"></div>
      
      <div class="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <div class="animate-fadeInUp">
          <img src="@/assets/images/logo3-removebg-preview.png" alt="Logo Paradisias Hotel" class="h-24 w-auto mx-auto mb-8 drop-shadow-2xl" />
          <h1 class="text-6xl md:text-8xl font-bold mb-8 leading-tight drop-shadow-2xl">
            Bienvenue au
            <span class="text-[#D99791] block">Paradis</span>
          </h1>
          <p class="text-2xl md:text-3xl mb-6 text-gray-100 font-light drop-shadow-lg">
            Maison d'Hôtes Man - Côte d'Ivoire
          </p>
          <p class="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed text-gray-200 drop-shadow-lg">
            Découvrez l'élégance et la sérénité dans un cadre naturel exceptionnel. 
            Une expérience unique vous attend dans notre havre de paix.
          </p>
          <div class="flex flex-col sm:flex-row gap-6 justify-center">
            <button class="bg-[#D99791] text-white px-10 py-4 rounded-full font-semibold text-xl hover:bg-[#c88a85] transition-all transform hover:scale-105 shadow-2xl">
              Réserver Maintenant
            </button>
            <!-- <button class="border-2 border-white text-white px-10 py-4 rounded-full font-semibold text-xl hover:bg-white hover:text-[#09402C] transition-all shadow-2xl">
              Découvrir l'Hôtel
            </button> -->
          </div>
        </div>
      </div>
      <!-- <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg class="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div> -->
    </section>

    <!-- About Section -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div class="order-2 lg:order-1">
            <div class="bg-gradient-to-br from-[#09402C] to-[#0a4d35] rounded-3xl p-12 text-white shadow-2xl">
              <h3 class="text-3xl font-bold mb-8 text-center">Pourquoi Choisir Paradisias ?</h3>
              <ul class="space-y-6">
                <li class="flex items-start">
                  <span class="text-[#D99791] mr-4 text-2xl">✓</span>
                  <span class="text-lg">Emplacement privilégié avec vue panoramique sur les montagnes</span>
                </li>
                <li class="flex items-start">
                  <span class="text-[#D99791] mr-4 text-2xl">✓</span>
                  <span class="text-lg">Chambres climatisées avec tout le confort moderne</span>
                </li>
                <li class="flex items-start">
                  <span class="text-[#D99791] mr-4 text-2xl">✓</span>
                  <span class="text-lg">Restaurant gastronomique avec spécialités locales</span>
                </li>
                <li class="flex items-start">
                  <span class="text-[#D99791] mr-4 text-2xl">✓</span>
                  <span class="text-lg">Service de conciergerie personnalisé 24h/24</span>
                </li>
                <li class="flex items-start">
                  <span class="text-[#D99791] mr-4 text-2xl">✓</span>
                  <span class="text-lg">Parking sécurisé et WiFi haut débit gratuit</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="order-1 lg:order-2">
            <h2 class="text-5xl font-bold text-[#09402C] mb-8 leading-tight">
              Un Cadre Sécurisé, Reposant et 
              <span class="text-[#D99791]">Paradisiaque</span>
            </h2>
            <p class="text-xl text-gray-700 mb-8 leading-relaxed">
              Niché au cœur des montagnes de Man, l'Hôtel Paradisias vous offre une expérience d'hébergement unique 
              alliant confort moderne et authenticité ivoirienne.
            </p>
            <p class="text-xl text-gray-700 mb-10 leading-relaxed">
              Notre établissement familial privilégie l'accueil personnalisé et l'attention aux détails pour 
              vous garantir un séjour inoubliable.
            </p>
            <div class="grid grid-cols-3 gap-8">
              <div class="text-center">
                <div class="text-4xl font-bold text-[#D99791] mb-2">20+</div>
                <div class="text-gray-600 font-medium">Chambres</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-bold text-[#D99791] mb-2">5★</div>
                <div class="text-gray-600 font-medium">Service</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-bold text-[#D99791] mb-2">24/7</div>
                <div class="text-gray-600 font-medium">Sécurité</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Chambres Section avec Carousel -->
    <section id="chambres" class="py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-bold text-[#09402C] mb-6">Nos Chambres d'Exception</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos chambres élégamment décorées, conçues pour votre confort et votre bien-être
          </p>
        </div>
        
        <div class="relative">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Chambre Standard -->
            <div class="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div class="h-64 bg-gradient-to-br from-[#09402C] to-[#0a4d35] relative">
                <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3')] bg-cover bg-center"></div>
                <div class="absolute top-4 right-4 bg-[#D99791] text-white px-4 py-2 rounded-full font-semibold">
                  À partir de 25,000 FCFA
                </div>
              </div>
              <div class="p-8">
                <h3 class="text-2xl font-bold text-[#09402C] mb-4">Chambre Standard</h3>
                <p class="text-gray-600 mb-6">Chambre confortable avec lit double, climatisation, TV satellite et salle de bain privée.</p>
                <ul class="space-y-2 mb-6">
                  <li class="flex items-center text-gray-600">
                    <span class="text-[#D99791] mr-2">•</span> Lit double confortable
                  </li>
                  <li class="flex items-center text-gray-600">
                    <span class="text-[#D99791] mr-2">•</span> Climatisation
                  </li>
                  <li class="flex items-center text-gray-600">
                    <span class="text-[#D99791] mr-2">•</span> WiFi gratuit
                  </li>
                </ul>
                <button class="w-full bg-[#09402C] text-white py-3 rounded-full font-semibold hover:bg-[#0a4d35] transition-colors">
                  Réserver
                </button>
              </div>
            </div>

            <!-- Chambre Deluxe -->
            <div class="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div class="h-64 bg-gradient-to-br from-[#09402C] to-[#0a4d35] relative">
                <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3')] bg-cover bg-center"></div>
                <div class="absolute top-4 right-4 bg-[#D99791] text-white px-4 py-2 rounded-full font-semibold">
                  À partir de 35,000 FCFA
                </div>
              </div>
              <div class="p-8">
                <h3 class="text-2xl font-bold text-[#09402C] mb-4">Chambre Deluxe</h3>
                <p class="text-gray-600 mb-6">Chambre spacieuse avec vue panoramique, minibar et espace salon privé.</p>
                <ul class="space-y-2 mb-6">
                  <li class="flex items-center text-gray-600">
                    <span class="text-[#D99791] mr-2">•</span> Vue panoramique
                  </li>
                  <li class="flex items-center text-gray-600">
                    <span class="text-[#D99791] mr-2">•</span> Minibar inclus
                  </li>
                  <li class="flex items-center text-gray-600">
                    <span class="text-[#D99791] mr-2">•</span> Espace salon
                  </li>
                </ul>
                <button class="w-full bg-[#09402C] text-white py-3 rounded-full font-semibold hover:bg-[#0a4d35] transition-colors">
                  Réserver
                </button>
              </div>
            </div>

            <!-- Suite Présidentielle -->
            <div class="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div class="h-64 bg-gradient-to-br from-[#09402C] to-[#0a4d35] relative">
                <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3')] bg-cover bg-center"></div>
                <div class="absolute top-4 right-4 bg-[#D99791] text-white px-4 py-2 rounded-full font-semibold">
                  À partir de 50,000 FCFA
                </div>
              </div>
              <div class="p-8">
                <h3 class="text-2xl font-bold text-[#09402C] mb-4">Suite Présidentielle</h3>
                <p class="text-gray-600 mb-6">Suite luxueuse avec terrasse privée, jacuzzi et service personnalisé.</p>
                <ul class="space-y-2 mb-6">
                  <li class="flex items-center text-gray-600">
                    <span class="text-[#D99791] mr-2">•</span> Terrasse privée
                  </li>
                  <li class="flex items-center text-gray-600">
                    <span class="text-[#D99791] mr-2">•</span> Jacuzzi privé
                  </li>
                  <li class="flex items-center text-gray-600">
                    <span class="text-[#D99791] mr-2">•</span> Service VIP
                  </li>
                </ul>
                <button class="w-full bg-[#09402C] text-white py-3 rounded-full font-semibold hover:bg-[#0a4d35] transition-colors">
                  Réserver
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-bold text-[#09402C] mb-6">Nos Services d'Excellence</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Une gamme complète de services pensés pour votre confort et votre bien-être
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div class="text-center group">
            <div class="w-20 h-20 bg-gradient-to-br from-[#D99791] to-[#c88a85] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-[#09402C] mb-4">Hébergement Premium</h3>
            <p class="text-gray-600 text-lg">Chambres spacieuses et élégantes avec vue imprenable, climatisation et équipements modernes.</p>
          </div>

          <div class="text-center group">
            <div class="w-20 h-20 bg-gradient-to-br from-[#D99791] to-[#c88a85] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-[#09402C] mb-4">Restaurant Gastronomique</h3>
            <p class="text-gray-600 text-lg">Cuisine raffinée mêlant saveurs locales et internationales dans un cadre exceptionnel.</p>
          </div>

          <div class="text-center group">
            <div class="w-20 h-20 bg-gradient-to-br from-[#D99791] to-[#c88a85] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-[#09402C] mb-4">Sécurité 24/7</h3>
            <p class="text-gray-600 text-lg">Surveillance continue et système de sécurité moderne pour votre tranquillité absolue.</p>
          </div>

          <div class="text-center group">
            <div class="w-20 h-20 bg-gradient-to-br from-[#D99791] to-[#c88a85] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-[#09402C] mb-4">Conciergerie</h3>
            <p class="text-gray-600 text-lg">Notre équipe vous accompagne pour organiser vos excursions et découvertes.</p>
          </div>

          <div class="text-center group">
            <div class="w-20 h-20 bg-gradient-to-br from-[#D99791] to-[#c88a85] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-[#09402C] mb-4">Événements</h3>
            <p class="text-gray-600 text-lg">Organisez vos séminaires, mariages et événements dans nos espaces dédiés.</p>
          </div>

          <div class="text-center group">
            <div class="w-20 h-20 bg-gradient-to-br from-[#D99791] to-[#c88a85] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-[#09402C] mb-4">WiFi Haut Débit</h3>
            <p class="text-gray-600 text-lg">Connexion internet gratuite et performante dans tout l'établissement.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-bold text-[#09402C] mb-6">Ce Que Disent Nos Clients</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les témoignages de nos clients satisfaits
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div class="flex items-center mb-6">
              <div class="flex text-[#D99791]">
                <span class="text-2xl">★★★★★</span>
              </div>
            </div>
            <p class="text-gray-700 text-lg mb-6 italic">
              "Un séjour absolument parfait ! L'accueil chaleureux, les chambres impeccables et la vue magnifique. 
              Je recommande vivement Paradisias Hotel."
            </p>
            <div class="flex items-center">
              <div class="w-12 h-12 bg-[#09402C] rounded-full flex items-center justify-center text-white font-bold mr-4">
                M.K
              </div>
              <div>
                <h4 class="font-semibold text-[#09402C]">Marie Kouassi</h4>
                <p class="text-gray-600">Abidjan, Côte d'Ivoire</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div class="flex items-center mb-6">
              <div class="flex text-[#D99791]">
                <span class="text-2xl">★★★★★</span>
              </div>
            </div>
            <p class="text-gray-700 text-lg mb-6 italic">
              "Service exceptionnel et cadre paradisiaque ! L'équipe est aux petits soins et la cuisine est délicieuse. 
              Une expérience inoubliable."
            </p>
            <div class="flex items-center">
              <div class="w-12 h-12 bg-[#09402C] rounded-full flex items-center justify-center text-white font-bold mr-4">
                J.D
              </div>
              <div>
                <h4 class="font-semibold text-[#09402C]">Jean Diabaté</h4>
                <p class="text-gray-600">Yamoussoukro, Côte d'Ivoire</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div class="flex items-center mb-6">
              <div class="flex text-[#D99791]">
                <span class="text-2xl">★★★★★</span>
              </div>
            </div>
            <p class="text-gray-700 text-lg mb-6 italic">
              "L'hôtel parfait pour un séjour d'affaires ou de détente. Tout est pensé pour le confort des clients. 
              Je reviendrai certainement !"
            </p>
            <div class="flex items-center">
              <div class="w-12 h-12 bg-[#09402C] rounded-full flex items-center justify-center text-white font-bold mr-4">
                A.T
              </div>
              <div>
                <h4 class="font-semibold text-[#09402C]">Aminata Traoré</h4>
                <p class="text-gray-600">Bouaké, Côte d'Ivoire</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-bold text-[#09402C] mb-6">Contactez-Nous</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions
          </p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div class="space-y-8">
              <div class="flex items-start">
                <div class="w-12 h-12 bg-[#D99791] rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-[#09402C] mb-2">Adresse</h3>
                  <p class="text-gray-600 text-lg">Man, Région des Montagnes<br>Côte d'Ivoire</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="w-12 h-12 bg-[#D99791] rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-[#09402C] mb-2">Téléphone</h3>
                  <p class="text-gray-600 text-lg">+225 XX XX XX XX<br>+225 XX XX XX XX</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="w-12 h-12 bg-[#D99791] rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-[#09402C] mb-2">Email</h3>
                  <p class="text-gray-600 text-lg">contact@paradisias-hotel.ci<br>reservation@paradisias-hotel.ci</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-2xl p-8">
            <form class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-[#09402C] font-semibold mb-2">Nom</label>
                  <input type="text" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#D99791] focus:outline-none">
                </div>
                <div>
                  <label class="block text-[#09402C] font-semibold mb-2">Email</label>
                  <input type="email" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#D99791] focus:outline-none">
                </div>
              </div>
              <div>
                <label class="block text-[#09402C] font-semibold mb-2">Sujet</label>
                <input type="text" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#D99791] focus:outline-none">
              </div>
              <div>
                <label class="block text-[#09402C] font-semibold mb-2">Message</label>
                <textarea rows="5" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#D99791] focus:outline-none"></textarea>
              </div>
              <button type="submit" class="w-full bg-[#09402C] text-white py-4 rounded-lg font-semibold hover:bg-[#0a4d35] transition-colors">
                Envoyer le Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-gradient-to-br from-[#09402C] to-[#0a4d35] text-white">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-5xl font-bold mb-8">
          Prêt à Vivre l'Expérience 
          <span class="text-[#D99791]">Paradisias</span> ?
        </h2>
        <p class="text-xl mb-12 text-gray-200 max-w-2xl mx-auto">
          Réservez dès maintenant et découvrez pourquoi nos clients nous font confiance 
          pour leurs séjours à Man. Une expérience inoubliable vous attend.
        </p>
        <div class="flex flex-col sm:flex-row gap-6 justify-center">
          <button class="bg-[#D99791] text-white px-12 py-4 rounded-full font-semibold text-xl hover:bg-[#c88a85] transition-all transform hover:scale-105 shadow-2xl">
            Réserver Maintenant
          </button>
          <button class="border-2 border-[#D99791] text-[#D99791] px-12 py-4 rounded-full font-semibold text-xl hover:bg-[#D99791] hover:text-white transition-all shadow-2xl">
            Nous Contacter
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-3xl font-bold text-[#D99791] mb-6">PARADISIAS</h3>
            <p class="text-gray-400 mb-6 text-lg">
              Votre maison d'hôtes de référence à Man, pour un séjour alliant confort, sécurité et authenticité.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="w-10 h-10 bg-[#D99791] rounded-full flex items-center justify-center hover:bg-[#c88a85] transition-colors">
                <span class="text-white font-bold">f</span>
              </a>
              <a href="#" class="w-10 h-10 bg-[#D99791] rounded-full flex items-center justify-center hover:bg-[#c88a85] transition-colors">
                <span class="text-white font-bold">@</span>
              </a>
              <a href="#" class="w-10 h-10 bg-[#D99791] rounded-full flex items-center justify-center hover:bg-[#c88a85] transition-colors">
                <span class="text-white font-bold">W</span>
              </a>
            </div>
          </div>
          <div>
            <h4 class="font-bold mb-6 text-xl">Contact</h4>
            <div class="space-y-3 text-gray-400">
              <p class="flex items-center">
                <span class="mr-3">📍</span> Man, Côte d'Ivoire
              </p>
              <p class="flex items-center">
                <span class="mr-3">📞</span> +225 XX XX XX XX
              </p>
              <p class="flex items-center">
                <span class="mr-3">✉️</span> contact@paradisias-hotel.ci
              </p>
            </div>
          </div>
          <div>
            <h4 class="font-bold mb-6 text-xl">Services</h4>
            <ul class="space-y-3 text-gray-400">
              <li><a href="#" class="hover:text-[#D99791] transition-colors">Hébergement</a></li>
              <li><a href="#" class="hover:text-[#D99791] transition-colors">Restaurant</a></li>
              <li><a href="#" class="hover:text-[#D99791] transition-colors">Événements</a></li>
              <li><a href="#" class="hover:text-[#D99791] transition-colors">Conciergerie</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-6 text-xl">Liens Utiles</h4>
            <ul class="space-y-3 text-gray-400">
              <li><a href="#" class="hover:text-[#D99791] transition-colors">À propos</a></li>
              <li><a href="#" class="hover:text-[#D99791] transition-colors">Galerie</a></li>
              <li><a href="#" class="hover:text-[#D99791] transition-colors">Conditions</a></li>
              <li><a href="#" class="hover:text-[#D99791] transition-colors">Politique de confidentialité</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Hôtel Paradisias. Tous droits réservés. Conçu avec ❤️ pour votre confort.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Smooth scroll pour la navigation
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
/* Animations personnalisées */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 1s ease-out;
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}

/* Hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}
</style> 