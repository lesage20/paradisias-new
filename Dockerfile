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

# Créer le script d'entrée dynamique
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'API_URL=${API_BASE_URL:-http://localhost:9001}' >> /docker-entrypoint.sh && \
    echo 'echo "window.APP_CONFIG = { API_BASE_URL: \"$API_URL\" }" > /usr/share/nginx/html/config.js' >> /docker-entrypoint.sh && \
    echo 'echo "Configuration API: $API_URL"' >> /docker-entrypoint.sh && \
    echo 'nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Exposer le port 80
EXPOSE 80

CMD ["/docker-entrypoint.sh"] 