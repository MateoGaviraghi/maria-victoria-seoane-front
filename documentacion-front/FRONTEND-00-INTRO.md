# 📱 FASE 00 - Introducción al Proyecto Frontend

## 🎯 Contexto General

Este documento describe la implementación completa del **frontend** para la plataforma de cursos online de **María Victoria Seoane**. El proyecto consiste en una aplicación web moderna que permite a los usuarios explorar, comprar y consumir cursos educativos, con un panel de administración robusto para la gestión de contenido, ventas y configuraciones.

---

## 🏗️ Estado Actual del Backend

El backend está **100% funcional** y cuenta con las siguientes funcionalidades implementadas:

### ✅ Fase 1 - Sistema de Ventas (COMPLETO)

- **Carrito de compras**: Agregar/quitar cursos, persistencia por usuario
- **Cupones de descuento**: Códigos promocionales, validación, tipos de descuento
- **Checkout**: Proceso de compra con validaciones
- **Órdenes**: Gestión completa del ciclo de vida de pedidos
- **Pagos**: Integración con MercadoPago (sandbox testeado y funcionando)
- **Cursos y Categorías**: CRUD completo, multimedia, niveles, precios

### ✅ Fase 2 - Sistema de Emails (COMPLETO)

- **Emails transaccionales**: Verificación, bienvenida, compras, accesos
- **Emails de marketing**: Carrito abandonado (3 niveles), cumpleaños, nuevos cursos
- **Configuración dinámica**: Panel admin para modificar intervalos y descuentos
- **Sistema de logs**: Historial completo, estadísticas, reenvío de emails
- **Cron jobs**: Automatización de emails programados

### ✅ Autenticación y Usuarios

- **JWT Authentication**: Login, registro, refresh tokens
- **Roles**: SUPER_ADMIN, OWNER, STUDENT
- **Verificación de email**: Sistema de tokens
- **Recuperación de contraseña**: Flow completo
- **Perfiles**: Gestión de datos personales

---

## 🛠️ Tecnologías del Frontend

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
Authentication:        Custom JWT
```

---

## 📐 Arquitectura de la Aplicación

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

---

## 🔌 Conexión con el Backend

**Base URL API**: `http://localhost:3000` (dev) / `https://api.mariavictoriaseoane.com` (prod)

### Endpoints Principales Disponibles:

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

---

## ✨ Features Principales del Frontend

### 👥 Para Estudiantes:

#### 1. Exploración de Cursos

- Catálogo con filtros (categoría, nivel, precio)
- Búsqueda inteligente
- Vista de detalles con preview de contenido
- Sistema de favoritos

#### 2. Compra de Cursos

- Carrito de compras persistente
- Aplicación de cupones de descuento
- Checkout en 3 pasos (Carrito → Datos → Pago)
- Integración MercadoPago (tarjetas, transferencias, efectivo)
- Confirmación por email automática

#### 3. Consumo de Contenido

- Reproductor de video personalizado
- Seguimiento de progreso por lección
- Descarga de materiales
- Certificado al completar (futura fase)

#### 4. Gestión de Cuenta

- Perfil personal editable
- Historial de órdenes
- Mis cursos activos
- Cambio de contraseña
- Gestión de notificaciones

### 🔧 Para Administradores:

#### 1. Dashboard Analítico

- Ventas del día/semana/mes
- Usuarios registrados
- Cursos más vendidos
- Ingresos totales
- Gráficos interactivos

#### 2. Gestión de Cursos

- CRUD completo de cursos
- Upload de videos y recursos
- Organización en módulos y lecciones
- Configuración de precios y descuentos
- Publicar/despublicar cursos

#### 3. Gestión de Usuarios

- Lista completa de usuarios
- Filtros por rol, estado, fecha
- Edición de perfiles
- Asignación de roles
- Historial de compras por usuario

#### 4. Gestión de Ventas

- Lista de órdenes con filtros
- Detalles de cada venta
- Cancelación de órdenes
- Exportación a Excel/CSV
- Estadísticas de ventas

#### 5. Gestión de Cupones

- Crear cupones (porcentaje/monto fijo)
- Configurar validez (fechas, usos)
- Aplicar a cursos específicos o todos
- Ver estadísticas de uso
- Desactivar cupones

#### 6. Configuración de Emails

- Ajustar intervalos de carrito abandonado
- Configurar descuentos automáticos
- Habilitar/deshabilitar tipos de emails
- Ver logs de emails enviados
- Reenviar emails fallidos

---

## 🔄 Flujos de Usuario Principales

### 🛒 Flujo de Compra:

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

### 📧 Flujo de Carrito Abandonado (Automático):

```
1. Usuario agrega curso al carrito pero no compra
2. Después de X horas (configurable): Email recordatorio
3. Después de Y horas (configurable): Email con cupón 10%
4. Después de Z horas (configurable): Email con cupón 15%
```

### 🎓 Flujo de Consumo de Curso:

```
1. Usuario accede a "Mis Cursos"
2. Selecciona curso comprado
3. Ve módulos y lecciones disponibles
4. Reproduce video
5. Sistema guarda progreso automáticamente
6. Puede descargar materiales
7. Completa curso → Certificado (futura fase)
```

---

## 🎨 Consideraciones de Diseño

### Responsive Design:

- **Mobile-first approach**
- Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Navegación adaptativa
- Reproductor de video optimizado para móviles

### Performance:

- **Lazy loading** de imágenes y videos
- **Code splitting** por rutas
- **Caching** de datos con React Query
- **Optimización de imágenes** con Next.js Image
- **Prefetching** de rutas críticas

### Seguridad:

- **Validación de formularios** con Zod
- **Sanitización** de inputs del usuario
- **Tokens JWT** en httpOnly cookies (o localStorage según implementación)
- **CORS** configurado correctamente
- **Rate limiting** del lado del cliente

### UX/UI:

- **Feedback visual** en todas las acciones
- **Loading states** consistentes
- **Error handling** amigable
- **Confirmaciones** para acciones destructivas
- **Animaciones** sutiles con Framer Motion

---

## 🔗 Integraciones Clave

### 🔐 Autenticación:

```typescript
// Login automático después de registro exitoso
// Refresh tokens para sesiones largas
// Redirección post-login según rol (admin → dashboard, user → cursos)
```

### 💳 MercadoPago:

```typescript
// Crear preferencia de pago desde backend
// Redirección a checkout de MercadoPago
// Webhook para confirmar pago
// Actualización de orden automática
```

### 📧 Sistema de Emails:

```typescript
// Emails automáticos por eventos del usuario
// Panel admin para ver logs y estadísticas
// Reenvío manual de emails fallidos
// Configuración de intervalos y descuentos
```

---

## 🚀 Próximas Fases del Proyecto

Una vez implementado el frontend básico, se pueden agregar:

### Fase 3 - Funcionalidades Avanzadas:

- Sistema de comentarios en lecciones
- Foro de discusión por curso
- Chat en vivo con soporte
- Sistema de calificaciones/reviews
- Certificados automáticos al completar

### Fase 4 - Gamificación:

- Badges por logros
- Sistema de puntos
- Ranking de estudiantes
- Desafíos y quizzes

### Fase 5 - Webinars y Clases en Vivo:

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

## 🎯 Objetivos de Aprendizaje

Al completar esta documentación, habrás aprendido a:

✅ Estructurar una aplicación Next.js 14 con App Router  
✅ Implementar autenticación JWT con roles  
✅ Integrar MercadoPago para procesamiento de pagos  
✅ Gestionar estado con Zustand y React Query  
✅ Crear formularios robustos con React Hook Form + Zod  
✅ Diseñar interfaces responsive con Tailwind + shadcn/ui  
✅ Optimizar performance y SEO con Next.js  
✅ Implementar un panel admin completo  
✅ Crear un reproductor de video personalizado

---

**✅ Fase 00 Completa - Continuar con → [FASE 01 - Estructura Front e Instalaciones](./FRONTEND-01-ESTRUCTURA.md)**
