# 🚀 Fase 15 - Deployment

> **Documentación Frontend - Maria Victoria Seoane**  
> Configuración y despliegue a producción

---

## 📋 Contenido

1. [Variables de Entorno](#variables-de-entorno)
2. [Configuración Next.js](#configuración-nextjs)
3. [Build de Producción](#build-de-producción)
4. [Deploy en Vercel](#deploy-en-vercel)
5. [Deploy en VPS](#deploy-en-vps)
6. [Docker](#docker)
7. [CI/CD con GitHub Actions](#cicd-con-github-actions)
8. [Checklist](#checklist)

---

## 1️⃣ Variables de Entorno

**Archivo:** `.env.production`

```bash
# API
NEXT_PUBLIC_API_URL=https://api.tudominio.com

# MercadoPago
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Site URL
NEXT_PUBLIC_SITE_URL=https://tudominio.com
```

**Archivo:** `.env.example`

```bash
# Copiar a .env.local para desarrollo
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MP_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 2️⃣ Configuración Next.js

**Archivo:** `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Imágenes externas permitidas
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'api.tudominio.com',
      },
    ],
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## 3️⃣ Build de Producción

### Comandos

```bash
# Instalar dependencias
npm ci

# Build de producción
npm run build

# Analizar bundle
npm run build -- --analyze

# Iniciar servidor de producción
npm start
```

### Script package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "analyze": "ANALYZE=true next build"
  }
}
```

### Verificar Build

```bash
# Ver tamaño del bundle
ls -la .next/static/chunks

# Test de producción local
npm run build && npm start
```

---

## 4️⃣ Deploy en Vercel

### Opción A: CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy producción
vercel --prod
```

### Opción B: GitHub Integration

1. Ir a [vercel.com](https://vercel.com)
2. Import Project → Seleccionar repositorio
3. Configurar variables de entorno
4. Deploy automático en cada push

### Variables en Vercel

```bash
# En Settings → Environment Variables
NEXT_PUBLIC_API_URL=https://api.tudominio.com
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-xxx
NEXT_PUBLIC_GA_ID=G-xxx
NEXT_PUBLIC_SITE_URL=https://tudominio.com
```

### Dominio Personalizado

```bash
# En Settings → Domains
tudominio.com
www.tudominio.com
```

---

## 5️⃣ Deploy en VPS

### Con PM2

```bash
# Instalar PM2
npm install -g pm2

# Build
npm run build

# Iniciar con PM2
pm2 start npm --name "frontend" -- start

# Guardar configuración
pm2 save

# Startup automático
pm2 startup
```

### Archivo ecosystem.config.js

```javascript
module.exports = {
  apps: [
    {
      name: 'maria-victoria-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/frontend',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      instances: 'max',
      exec_mode: 'cluster',
    },
  ],
};
```

### Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/frontend

server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL con Certbot

```bash
# Instalar certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tudominio.com -d www.tudominio.com

# Renovación automática
sudo certbot renew --dry-run
```

---

## 6️⃣ Docker

### Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '3000:3000'
    environment:
      - NEXT_PUBLIC_API_URL=https://api.tudominio.com
      - NEXT_PUBLIC_MP_PUBLIC_KEY=${MP_PUBLIC_KEY}
    restart: unless-stopped
```

### Comandos Docker

```bash
# Build imagen
docker build -t maria-victoria-frontend .

# Ejecutar contenedor
docker run -p 3000:3000 maria-victoria-frontend

# Con docker-compose
docker-compose up -d

# Ver logs
docker-compose logs -f frontend
```

### next.config.js para Docker

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // ... resto de config
};

module.exports = nextConfig;
```

---

## 7️⃣ CI/CD con GitHub Actions

**Archivo:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
          NEXT_PUBLIC_MP_PUBLIC_KEY: ${{ secrets.NEXT_PUBLIC_MP_PUBLIC_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Secrets en GitHub

```
Settings → Secrets and variables → Actions

VERCEL_TOKEN=xxx
VERCEL_ORG_ID=xxx
VERCEL_PROJECT_ID=xxx
NEXT_PUBLIC_API_URL=https://api.tudominio.com
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-xxx
```

---

## ✅ Checklist Deployment

### Pre-Deploy

- [ ] Variables de entorno configuradas
- [ ] Build sin errores (`npm run build`)
- [ ] Lint sin errores (`npm run lint`)
- [ ] Imágenes optimizadas

### Vercel

- [ ] Repositorio conectado
- [ ] Variables de entorno en dashboard
- [ ] Dominio configurado
- [ ] SSL activo

### VPS (Opcional)

- [ ] Node.js instalado
- [ ] PM2 configurado
- [ ] Nginx configurado
- [ ] SSL con Certbot

### Docker (Opcional)

- [ ] Dockerfile creado
- [ ] `output: 'standalone'` en next.config
- [ ] docker-compose configurado

### Post-Deploy

- [ ] Verificar página principal
- [ ] Verificar login/registro
- [ ] Verificar checkout MercadoPago
- [ ] Verificar panel admin
- [ ] Configurar monitoreo (Vercel Analytics)

---

## 🐛 Troubleshooting

### Error: Build failed

```bash
# Limpiar cache
rm -rf .next node_modules
npm ci
npm run build
```

### Error: 500 en producción

```bash
# Verificar variables de entorno
printenv | grep NEXT_PUBLIC
```

### Error: Imágenes no cargan

Verificar `next.config.js` → `images.remotePatterns`

---

**¡Fase 15 completada! 🎉**
