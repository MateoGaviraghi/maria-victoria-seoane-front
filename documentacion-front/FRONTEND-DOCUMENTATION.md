# 📱 Frontend - María Victoria Seoane Platform

## 🎯 Introducción al Proyecto

### Contexto General

Este documento describe la implementación completa del **frontend** para la plataforma de cursos online de **María Victoria Seoane**. El proyecto consiste en una aplicación web moderna que permite a los usuarios explorar, comprar y consumir cursos educativos, con un panel de administración robusto para la gestión de contenido, ventas y configuraciones.

### Estado Actual del Backend

El backend está **100% funcional** y cuenta con las siguientes funcionalidades implementadas:

#### ✅ Fase 1 - Sistema de Ventas (COMPLETO)

- **Carrito de compras**: Agregar/quitar cursos, persistencia por usuario
- **Cupones de descuento**: Códigos promocionales, validación, tipos de descuento
- **Checkout**: Proceso de compra con validaciones
- **Órdenes**: Gestión completa del ciclo de vida de pedidos
- **Pagos**: Integración con MercadoPago (sandbox testeado y funcionando)
- **Cursos y Categorías**: CRUD completo, multimedia, niveles, precios

#### ✅ Fase 2 - Sistema de Emails (COMPLETO)

- **Emails transaccionales**: Verificación, bienvenida, compras, accesos
- **Emails de marketing**: Carrito abandonado (3 niveles), cumpleaños, nuevos cursos
- **Configuración dinámica**: Panel admin para modificar intervalos y descuentos
- **Sistema de logs**: Historial completo, estadísticas, reenvío de emails
- **Cron jobs**: Automatización de emails programados

#### ✅ Autenticación y Usuarios

- **JWT Authentication**: Login, registro, refresh tokens
- **Roles**: SUPER_ADMIN, OWNER, STUDENT
- **Verificación de email**: Sistema de tokens
- **Recuperación de contraseña**: Flow completo
- **Perfiles**: Gestión de datos personales

### Tecnologías del Frontend

```
Frontend Framework:     Next.js 14 (App Router)
UI Library:            React 18
Language:              TypeScript 5
Styling:               Tailwind CSS 3 + shadcn/ui
State Management:      Zustand + React Query (TanStack Query)
Forms:                 React Hook Form + Zod
HTTP Client:           Axios
Video Player:          Video.js / Plyr
Payments:              MercadoPago SDK
Charts:                Recharts / Chart.js
Authentication:        NextAuth.js / Custom JWT
```

### Arquitectura de la Aplicación

```
maría-victoria-seoane-front/
├── 📱 App Pública (Estudiantes)
│   ├── Landing Page
│   ├── Catálogo de Cursos
│   ├── Detalles de Curso
│   ├── Carrito y Checkout
│   ├── Mi Cuenta
│   ├── Reproductor de Curso
│   └── Autenticación
│
├── 🔧 Panel de Administración
│   ├── Dashboard General
│   ├── Gestión de Cursos
│   ├── Gestión de Usuarios
│   ├── Órdenes y Ventas
│   ├── Cupones
│   ├── Configuración de Emails
│   └── Configuración General
│
└── 🔗 Integraciones
    ├── API Backend (NestJS)
    ├── MercadoPago
    └── Sistema de Emails
```

### Conexión con el Backend

**Base URL API**: `http://localhost:3000` (dev) / `https://api.mariavictoriaseoane.com` (prod)

#### Endpoints Principales Disponibles:

| Módulo       | Endpoints                                             | Funcionalidad            |
| ------------ | ----------------------------------------------------- | ------------------------ |
| **Auth**     | `/auth/login`, `/auth/register`, `/auth/verify-email` | Autenticación y registro |
| **Cursos**   | `/courses`, `/courses/:id`, `/categories`             | Catálogo y detalles      |
| **Carrito**  | `/cart`, `/cart/items`                                | Gestión del carrito      |
| **Checkout** | `/checkout/create`, `/checkout/process`               | Proceso de compra        |
| **Órdenes**  | `/orders`, `/orders/:id`                              | Historial de compras     |
| **Pagos**    | `/payments/create-preference`, `/payments/webhook`    | MercadoPago              |
| **Cupones**  | `/coupons/validate`, `/coupons` (admin)               | Descuentos               |
| **Emails**   | `/emails/logs`, `/emails/stats`                       | Gestión de emails        |
| **Config**   | `/site-config`, `/site-config/emails/settings`        | Configuración            |
| **Usuarios** | `/users/me`, `/users/:id`                             | Perfil y gestión         |

### Features Principales del Frontend

#### 👥 Para Estudiantes:

1. **Exploración de Cursos**
   - Catálogo con filtros (categoría, nivel, precio)
   - Búsqueda inteligente
   - Vista de detalles con preview de contenido
   - Sistema de favoritos

2. **Compra de Cursos**
   - Carrito de compras persistente
   - Aplicación de cupones de descuento
   - Checkout en 3 pasos (Carrito → Datos → Pago)
   - Integración MercadoPago (tarjetas, transferencias, efectivo)
   - Confirmación por email automática

3. **Consumo de Contenido**
   - Reproductor de video personalizado
   - Seguimiento de progreso por lección
   - Descarga de materiales
   - Certificado al completar (futura fase)

4. **Gestión de Cuenta**
   - Perfil personal editable
   - Historial de órdenes
   - Mis cursos activos
   - Cambio de contraseña
   - Gestión de notificaciones

#### 🔧 Para Administradores:

1. **Dashboard Analítico**
   - Ventas del día/semana/mes
   - Usuarios registrados
   - Cursos más vendidos
   - Ingresos totales
   - Gráficos interactivos

2. **Gestión de Cursos**
   - CRUD completo de cursos
   - Upload de videos y recursos
   - Organización en módulos y lecciones
   - Configuración de precios y descuentos
   - Publicar/despublicar cursos

3. **Gestión de Usuarios**
   - Lista completa de usuarios
   - Filtros por rol, estado, fecha
   - Edición de perfiles
   - Asignación de roles
   - Historial de compras por usuario

4. **Gestión de Ventas**
   - Lista de órdenes con filtros
   - Detalles de cada venta
   - Cancelación de órdenes
   - Exportación a Excel/CSV
   - Estadísticas de ventas

5. **Gestión de Cupones**
   - Crear cupones (porcentaje/monto fijo)
   - Configurar validez (fechas, usos)
   - Aplicar a cursos específicos o todos
   - Ver estadísticas de uso
   - Desactivar cupones

6. **Configuración de Emails**
   - Ajustar intervalos de carrito abandonado
   - Configurar descuentos automáticos
   - Habilitar/deshabilitar tipos de emails
   - Ver logs de emails enviados
   - Reenviar emails fallidos

### Flujos de Usuario Principales

#### 🛒 Flujo de Compra:

```
1. Usuario explora catálogo
2. Agrega curso al carrito
3. Aplica cupón de descuento (opcional)
4. Completa datos de facturación
5. Selecciona método de pago en MercadoPago
6. Realiza el pago
7. Recibe email de confirmación
8. Accede inmediatamente al curso
```

#### 📧 Flujo de Carrito Abandonado (Automático):

```
1. Usuario agrega curso al carrito pero no compra
2. Después de X horas (configurable): Email recordatorio
3. Después de Y horas (configurable): Email con cupón 10%
4. Después de Z horas (configurable): Email con cupón 15%
```

#### 🎓 Flujo de Consumo de Curso:

```
1. Usuario accede a "Mis Cursos"
2. Selecciona curso comprado
3. Ve módulos y lecciones disponibles
4. Reproduce video
5. Sistema guarda progreso automáticamente
6. Puede descargar materiales
7. Completa curso → Certificado (futura fase)
```

### Consideraciones de Diseño

#### Responsive Design:

- **Mobile-first approach**
- Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Navegación adaptativa
- Reproductor de video optimizado para móviles

#### Performance:

- **Lazy loading** de imágenes y videos
- **Code splitting** por rutas
- **Caching** de datos con React Query
- **Optimización de imágenes** con Next.js Image
- **Prefetching** de rutas críticas

#### Seguridad:

- **Validación de formularios** con Zod
- **Sanitización** de inputs del usuario
- **Tokens JWT** en httpOnly cookies
- **CORS** configurado correctamente
- **Rate limiting** del lado del cliente

#### UX/UI:

- **Feedback visual** en todas las acciones
- **Loading states** consistentes
- **Error handling** amigable
- **Confirmaciones** para acciones destructivas
- **Animaciones** sutiles con Framer Motion

### Integraciones Clave

#### 🔐 Autenticación:

```typescript
// Login automático después de registro exitoso
// Refresh tokens para sesiones largas
// Redirección post-login según rol (admin → dashboard, user → cursos)
```

#### 💳 MercadoPago:

```typescript
// Crear preferencia de pago desde backend
// Redirección a checkout de MercadoPago
// Webhook para confirmar pago
// Actualización de orden automática
```

#### 📧 Sistema de Emails:

```typescript
// Emails automáticos por eventos del usuario
// Panel admin para ver logs y estadísticas
// Reenvío manual de emails fallidos
// Configuración de intervalos y descuentos
```

### Próximas Fases del Proyecto

Una vez implementado el frontend básico, se pueden agregar:

**Fase 3 - Funcionalidades Avanzadas:**

- Sistema de comentarios en lecciones
- Foro de discusión por curso
- Chat en vivo con soporte
- Sistema de calificaciones/reviews
- Certificados automáticos al completar

**Fase 4 - Gamificación:**

- Badges por logros
- Sistema de puntos
- Ranking de estudiantes
- Desafíos y quizzes

**Fase 5 - Webinars y Clases en Vivo:**

- Integración con Zoom/Google Meet
- Calendario de sesiones en vivo
- Grabaciones disponibles post-evento

---

## 📋 Resumen de Tecnologías

| Categoría   | Tecnología      | Versión | Propósito                    |
| ----------- | --------------- | ------- | ---------------------------- |
| Framework   | Next.js         | 14.x    | SSR, routing, optimizaciones |
| UI          | React           | 18.x    | Componentes, interactividad  |
| Lenguaje    | TypeScript      | 5.x     | Type safety                  |
| Estilos     | Tailwind CSS    | 3.x     | Utility-first CSS            |
| Componentes | shadcn/ui       | Latest  | Componentes pre-construidos  |
| Estado      | Zustand         | Latest  | Estado global ligero         |
| Servidor    | React Query     | Latest  | Cache, sincronización API    |
| Formularios | React Hook Form | Latest  | Gestión de formularios       |
| Validación  | Zod             | Latest  | Schemas de validación        |
| HTTP        | Axios           | Latest  | Cliente HTTP                 |
| Video       | Video.js        | Latest  | Reproductor de video         |
| Pagos       | MercadoPago SDK | Latest  | Integración de pagos         |
| Charts      | Recharts        | Latest  | Gráficos del dashboard       |

---

## ✅ Checklist de Preparación

Antes de comenzar con la implementación, verificar que tienes:

- [x] Backend NestJS corriendo en `localhost:3000`
- [x] Base de datos PostgreSQL con datos de prueba
- [x] Variables de entorno del backend configuradas
- [x] MercadoPago sandbox credentials
- [x] SMTP configurado para emails
- [x] Postman collection para testear endpoints
- [ ] Node.js 18+ instalado
- [ ] Git configurado
- [ ] Editor de código (VSCode recomendado)
- [ ] Extensiones VSCode para React/TypeScript

---

**¿Listo para comenzar con la Fase 1 - Estructura Front e Instalaciones?** 🚀

---

---

# 🏗️ FASE 1 - Estructura Front e Instalaciones

## 📋 Objetivos de esta Fase

En esta fase vamos a:

1. ✅ Crear el proyecto Next.js 14 con TypeScript
2. ✅ Instalar y configurar todas las dependencias necesarias
3. ✅ Configurar Tailwind CSS y shadcn/ui
4. ✅ Definir la estructura de carpetas del proyecto
5. ✅ Configurar variables de entorno
6. ✅ Configurar ESLint y Prettier
7. ✅ Crear el sistema de configuración base

---

## 1️⃣ Creación del Proyecto Next.js

### Paso 1: Crear el proyecto

```bash
# Navegar al directorio donde quieres crear el proyecto
cd C:/Users/mateo/Desktop

# Crear proyecto Next.js con TypeScript
npx create-next-app@latest maria-victoria-seoane-front

# Durante la instalación, responder:
✔ Would you like to use TypeScript? → Yes
✔ Would you like to use ESLint? → Yes
✔ Would you like to use Tailwind CSS? → Yes
✔ Would you like to use `src/` directory? → Yes
✔ Would you like to use App Router? → Yes
✔ Would you like to customize the default import alias (@/*)? → Yes
✔ What import alias would you like configured? → @/*

# Navegar al proyecto
cd maria-victoria-seoane-front
```

### Paso 2: Verificar instalación

```bash
# Ejecutar el servidor de desarrollo
npm run dev

# Debería abrir en http://localhost:3000
# Verificar que carga la página de bienvenida de Next.js
```

---

## 2️⃣ Instalación de Dependencias

### Dependencias Principales

```bash
# State Management y Data Fetching
npm install zustand @tanstack/react-query @tanstack/react-query-devtools axios

# Formularios y Validación
npm install react-hook-form @hookform/resolvers zod

# UI Components (shadcn/ui dependencies)
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot @radix-ui/react-toast @radix-ui/react-avatar @radix-ui/react-popover @radix-ui/react-tabs @radix-ui/react-tooltip

# Utilidades
npm install class-variance-authority clsx tailwind-merge lucide-react date-fns

# Video Player
npm install video.js @types/video.js react-player

# Gráficos (Dashboard)
npm install recharts

# Animaciones
npm install framer-motion

# MercadoPago SDK
npm install @mercadopago/sdk-react

# Next Auth (opcional, si usas NextAuth en lugar de custom JWT)
npm install next-auth
```

### Dependencias de Desarrollo

```bash
npm install -D @types/node @types/react @types/react-dom typescript eslint eslint-config-next prettier prettier-plugin-tailwindcss @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

---

## 3️⃣ Configuración de shadcn/ui

### Paso 1: Inicializar shadcn/ui

```bash
npx shadcn-ui@latest init

# Responder:
✔ Would you like to use TypeScript (recommended)? → yes
✔ Which style would you like to use? → Default
✔ Which color would you like to use as base color? → Slate
✔ Where is your global CSS file? → src/app/globals.css
✔ Would you like to use CSS variables for colors? → yes
✔ Are you using a custom tailwind prefix? → no
✔ Where is your tailwind.config.js located? → tailwind.config.js
✔ Configure the import alias for components? → @/components
✔ Configure the import alias for utils? → @/lib/utils
✔ Are you using React Server Components? → yes
```

### Paso 2: Agregar componentes base de shadcn/ui

```bash
# Componentes esenciales para empezar
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add select
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add table
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add form
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add progress
```

---

## 4️⃣ Estructura de Carpetas del Proyecto

```
maria-victoria-seoane-front/
├── public/
│   ├── images/
│   │   ├── logo.png
│   │   ├── hero-bg.jpg
│   │   └── placeholder-course.jpg
│   ├── icons/
│   └── videos/
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (public)/                 # Rutas públicas (sin layout admin)
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── cursos/
│   │   │   │   ├── page.tsx          # Catálogo de cursos
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Detalle de curso
│   │   │   ├── carrito/
│   │   │   │   └── page.tsx          # Carrito de compras
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx          # Proceso de pago
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── register/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── verificar-email/
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx            # Layout público
│   │   │
│   │   ├── (dashboard)/              # Rutas de panel de admin
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # Dashboard principal
│   │   │   ├── cursos-admin/
│   │   │   │   ├── page.tsx          # Lista de cursos
│   │   │   │   ├── crear/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── editar/
│   │   │   │           └── page.tsx
│   │   │   ├── usuarios/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── ordenes/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── cupones/
│   │   │   │   ├── page.tsx
│   │   │   │   └── crear/
│   │   │   │       └── page.tsx
│   │   │   ├── emails/
│   │   │   │   ├── logs/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── configuracion/
│   │   │   │       └── page.tsx
│   │   │   ├── configuracion/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx            # Layout admin con sidebar
│   │   │
│   │   ├── (student)/                # Rutas de estudiante autenticado
│   │   │   ├── mi-cuenta/
│   │   │   │   └── page.tsx
│   │   │   ├── mis-cursos/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Reproductor de curso
│   │   │   ├── mis-ordenes/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx            # Layout para estudiantes
│   │   │
│   │   ├── api/                      # API Routes (Next.js)
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   └── webhooks/
│   │   │       └── mercadopago/
│   │   │           └── route.ts
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Estilos globales
│   │   └── not-found.tsx             # Página 404
│   │
│   ├── components/                   # Componentes reutilizables
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/                   # Componentes de layout
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navbar.tsx
│   │   │
│   │   ├── curso/                    # Componentes de cursos
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CourseGrid.tsx
│   │   │   ├── CourseDetail.tsx
│   │   │   ├── VideoPlayer.tsx
│   │   │   └── LessonList.tsx
│   │   │
│   │   ├── carrito/                  # Componentes de carrito
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── CouponInput.tsx
│   │   │
│   │   ├── checkout/                 # Componentes de checkout
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── PaymentMethods.tsx
│   │   │   └── OrderSummary.tsx
│   │   │
│   │   ├── dashboard/                # Componentes del dashboard
│   │   │   ├── StatsCard.tsx
│   │   │   ├── SalesChart.tsx
│   │   │   ├── RecentOrders.tsx
│   │   │   └── UsersList.tsx
│   │   │
│   │   ├── forms/                    # Formularios
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── CourseForm.tsx
│   │   │   └── ProfileForm.tsx
│   │   │
│   │   └── common/                   # Componentes comunes
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorMessage.tsx
│   │       ├── Pagination.tsx
│   │       └── SearchBar.tsx
│   │
│   ├── lib/                          # Utilidades y configuraciones
│   │   ├── utils.ts                  # Funciones utilitarias
│   │   ├── api.ts                    # Configuración de Axios
│   │   ├── validations/              # Schemas de Zod
│   │   │   ├── auth.ts
│   │   │   ├── course.ts
│   │   │   ├── user.ts
│   │   │   └── checkout.ts
│   │   └── constants.ts              # Constantes globales
│   │
│   ├── hooks/                        # Custom React Hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useCourses.ts
│   │   └── useToast.ts
│   │
│   ├── store/                        # Zustand Stores
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   └── uiStore.ts
│   │
│   ├── services/                     # Servicios de API
│   │   ├── authService.ts
│   │   ├── coursesService.ts
│   │   ├── cartService.ts
│   │   ├── checkoutService.ts
│   │   ├── ordersService.ts
│   │   ├── couponsService.ts
│   │   ├── usersService.ts
│   │   └── emailsService.ts
│   │
│   ├── types/                        # TypeScript Types/Interfaces
│   │   ├── auth.ts
│   │   ├── course.ts
│   │   ├── user.ts
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   └── api.ts
│   │
│   └── config/                       # Configuraciones
│       ├── site.ts                   # Configuración del sitio
│       └── routes.ts                 # Rutas de la app
│
├── .env.local                        # Variables de entorno (local)
├── .env.production                   # Variables de entorno (producción)
├── .eslintrc.json                    # Configuración ESLint
├── .prettierrc                       # Configuración Prettier
├── next.config.js                    # Configuración Next.js
├── tailwind.config.js                # Configuración Tailwind
├── tsconfig.json                     # Configuración TypeScript
├── package.json
└── README.md
```

---

## 5️⃣ Configuración de Variables de Entorno

### Archivo `.env.local`

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001

# MercadoPago
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key-aqui

# NextAuth (si lo usas)
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=tu-secret-key-super-segura-aqui

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_CHAT=false
```

### Archivo `.env.production`

```env
# API Backend
NEXT_PUBLIC_API_URL=https://api.mariavictoriaseoane.com
NEXT_PUBLIC_FRONTEND_URL=https://mariavictoriaseoane.com

# MercadoPago
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP-tu-production-key-aqui

# NextAuth
NEXTAUTH_URL=https://mariavictoriaseoane.com
NEXTAUTH_SECRET=production-secret-key-super-segura

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_CHAT=true
```

---

## 6️⃣ Configuración de ESLint y Prettier

### `.eslintrc.json`

```json
{
  "extends": ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "react/no-unescaped-entities": "off",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### `.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### Agregar scripts en `package.json`

```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 7️⃣ Configuración de Tailwind CSS

### `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

---

## 8️⃣ Configuración de Next.js

### `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.mariavictoriaseoane.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
```

---

## 9️⃣ Archivos Base de Configuración

### `src/lib/api.ts` - Cliente HTTP Axios

```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Para enviar cookies
});

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado, redirigir al login
      localStorage.removeItem('access_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  },
);
```

### `src/lib/utils.ts` - Funciones Utilitarias

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
```

### `src/lib/constants.ts` - Constantes Globales

```typescript
export const SITE_NAME = 'María Victoria Seoane';
export const SITE_DESCRIPTION = 'Plataforma de cursos online';

export const ROUTES = {
  HOME: '/',
  COURSES: '/cursos',
  CART: '/carrito',
  CHECKOUT: '/checkout',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  MY_ACCOUNT: '/mi-cuenta',
  MY_COURSES: '/mis-cursos',
  DASHBOARD: '/dashboard',
} as const;

export const COURSE_LEVELS = {
  BEGINNER: 'Principiante',
  INTERMEDIATE: 'Intermedio',
  ADVANCED: 'Avanzado',
} as const;

export const ORDER_STATUS = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
} as const;
```

---

## 🎯 Checklist de Verificación - Fase 1

Antes de pasar a la Fase 2, verificar que todo está instalado y configurado:

- [ ] Proyecto Next.js creado y corriendo en `http://localhost:3001`
- [ ] Todas las dependencias instaladas sin errores
- [ ] shadcn/ui configurado y componentes base agregados
- [ ] Estructura de carpetas creada
- [ ] Variables de entorno configuradas (`.env.local`)
- [ ] ESLint y Prettier funcionando
- [ ] Tailwind CSS compilando correctamente
- [ ] Archivo `src/lib/api.ts` creado con cliente Axios
- [ ] Archivo `src/lib/utils.ts` con funciones utilitarias
- [ ] Archivo `src/lib/constants.ts` con constantes
- [ ] `next.config.js` configurado para imágenes
- [ ] Scripts de package.json actualizados
- [ ] Git inicializado y primer commit realizado

### Comandos para verificar:

```bash
# Verificar que todo compila
npm run build

# Verificar ESLint
npm run lint

# Verificar formato
npm run format

# Verificar tipos TypeScript
npm run type-check

# Ejecutar en desarrollo
npm run dev
```

---

## 📦 Resultado Final de package.json

```json
{
  "name": "maria-victoria-seoane-front",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.3",
    "@tanstack/react-query": "^5.14.2",
    "@tanstack/react-query-devtools": "^5.14.2",
    "axios": "^1.6.2",
    "zustand": "^4.4.7",
    "react-hook-form": "^7.49.2",
    "@hookform/resolvers": "^3.3.3",
    "zod": "^3.22.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-tooltip": "^1.0.7",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.303.0",
    "date-fns": "^3.0.6",
    "video.js": "^8.9.0",
    "react-player": "^2.13.0",
    "recharts": "^2.10.3",
    "framer-motion": "^10.16.16",
    "@mercadopago/sdk-react": "^0.0.15",
    "next-auth": "^4.24.5"
  },
  "devDependencies": {
    "@types/node": "^20.10.6",
    "@types/react": "^18.2.46",
    "@types/react-dom": "^18.2.18",
    "@types/video.js": "^7.3.56",
    "@typescript-eslint/eslint-plugin": "^6.16.0",
    "@typescript-eslint/parser": "^6.16.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.0.4",
    "postcss": "^8.4.32",
    "prettier": "^3.1.1",
    "prettier-plugin-tailwindcss": "^0.5.10",
    "tailwindcss": "^3.4.0",
    "tailwindcss-animate": "^1.0.7"
  }
}
```

---

## 🚀 Siguiente Paso

Una vez que hayas completado todos los pasos de esta fase y verificado el checklist:

**✅ FASE 1 COMPLETA - ¿Listo para la Fase 2 - Tipos y Servicios Base?**
