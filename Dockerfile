# syntax=docker.io/docker/dockerfile:1

# Etapa base con Node.js Alpine
FROM node:18-alpine AS base

# Etapa para instalar dependencias
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copia los archivos necesarios para instalar dependencias
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# Instala dependencias según el lockfile
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Etapa de build
FROM base AS builder
WORKDIR /app

# Copia node_modules y código fuente
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ejecuta el build
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Imagen final para producción
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Crear usuario seguro para ejecutar la app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos públicos y la build standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./standalone/.next/static

# Establecer permisos y usuario
USER nextjs

# Exponer el puerto de la app
EXPOSE 3000
ENV PORT=3000

# Mover al directorio donde está server.js y ejecutar
WORKDIR /app/standalone
CMD ["node", "server.js"]
