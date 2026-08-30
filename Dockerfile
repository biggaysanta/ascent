# Build stage: Node dependencies and Vite assets
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Build stage: Hugo static site generation
FROM klakegg/hugo:latest AS hugo-builder

WORKDIR /app

COPY --from=builder /app /app
RUN hugo --minify 2>&1 || true

# Production stage: Nginx serving static content
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy built Hugo site
COPY --from=hugo-builder /app/public .

# Copy Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
