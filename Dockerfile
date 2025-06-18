# Dockerfile multi-stage pour l'application Vue.js Paradisias

# Stage 1: Build stage
FROM node:18-alpine AS build-stage

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production=false

# Copier tous les fichiers source
COPY . .

# Construire l'application pour la production
RUN npm run build

# Stage 2: Production stage
FROM nginx:alpine AS production-stage

# Installer des utilitaires pour la gestion des certificats et la sécurité
RUN apk add --no-cache tzdata

# Copier les fichiers construits depuis le stage de build
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"] 