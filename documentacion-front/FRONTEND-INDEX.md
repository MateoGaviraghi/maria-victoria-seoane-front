# 📱 Frontend - María Victoria Seoane Platform

## 📚 Índice de Documentación

Esta documentación está organizada en fases modulares. Cada fase tiene su propio archivo detallado.

---

### 📖 Documentación Disponible

| Fase | Título                               | Archivo                                                              | Estado       |
| ---- | ------------------------------------ | -------------------------------------------------------------------- | ------------ |
| 00   | **Introducción al Proyecto**         | [FRONTEND-00-INTRO.md](./FRONTEND-00-INTRO.md)                       | ✅ Completo  |
| 01   | **Estructura Front e Instalaciones** | [FRONTEND-01-ESTRUCTURA.md](./FRONTEND-01-ESTRUCTURA.md)             | ✅ Completo  |
| 02   | **Tipos y Servicios Base**           | [FRONTEND-02-TIPOS-SERVICIOS.md](./FRONTEND-02-TIPOS-SERVICIOS.md)   | ✅ Completo  |
| 03   | **Stores y Hooks Personalizados**    | [FRONTEND-03-STORES-HOOKS.md](./FRONTEND-03-STORES-HOOKS.md)         | ✅ Completo  |
| 04   | **Layouts y Componentes Comunes**    | [FRONTEND-04-LAYOUT.md](./FRONTEND-04-LAYOUT.md)                     | ✅ Completo  |
| 05   | **Páginas Públicas**                 | [FRONTEND-05-PAGINAS-PUBLICAS.md](./FRONTEND-05-PAGINAS-PUBLICAS.md) | ✅ Completo  |
| 06   | **Carrito y Checkout**               | [FRONTEND-06-CARRITO-CHECKOUT.md](./FRONTEND-06-CARRITO-CHECKOUT.md) | ✅ Completo  |
| 07   | **Área de Estudiante**               | [FRONTEND-07-AREA-ESTUDIANTE.md](./FRONTEND-07-AREA-ESTUDIANTE.md)   | ✅ Completo  |
| 08   | **Panel de Administración**          | [FRONTEND-08-PANEL-ADMIN.md](./FRONTEND-08-PANEL-ADMIN.md)           | ⏳ Pendiente |
| 09   | **Gestión de Cursos (Admin)**        | [FRONTEND-09-ADMIN-CURSOS.md](./FRONTEND-09-ADMIN-CURSOS.md)         | ⏳ Pendiente |
| 10   | **Gestión de Usuarios (Admin)**      | [FRONTEND-10-ADMIN-USUARIOS.md](./FRONTEND-10-ADMIN-USUARIOS.md)     | ⏳ Pendiente |
| 11   | **Gestión de Órdenes (Admin)**       | [FRONTEND-11-ADMIN-ORDENES.md](./FRONTEND-11-ADMIN-ORDENES.md)       | ⏳ Pendiente |
| 12   | **Gestión de Cupones (Admin)**       | [FRONTEND-12-ADMIN-CUPONES.md](./FRONTEND-12-ADMIN-CUPONES.md)       | ⏳ Pendiente |
| 13   | **Gestión de Emails (Admin)**        | [FRONTEND-13-ADMIN-EMAILS.md](./FRONTEND-13-ADMIN-EMAILS.md)         | ⏳ Pendiente |
| 14   | **Configuración General (Admin)**    | [FRONTEND-14-ADMIN-CONFIG.md](./FRONTEND-14-ADMIN-CONFIG.md)         | ⏳ Pendiente |
| 15   | **Testing y Deployment**             | [FRONTEND-15-TESTING-DEPLOY.md](./FRONTEND-15-TESTING-DEPLOY.md)     | ⏳ Pendiente |

---

## 📝 Detalle de Cada Fase

### **FASE 00: Introducción al Proyecto** ✅

**Contenido:**

- Visión general del proyecto
- Arquitectura del sistema (frontend + backend)
- Stack tecnológico completo
- Características principales de la plataforma
- Flujo de usuarios (público, estudiante, admin)

### **FASE 01: Estructura Front e Instalaciones** ✅

**Contenido:**

- Crear proyecto Next.js 14
- Instalar todas las dependencias (Tailwind, shadcn/ui, Zustand, React Query, etc.)
- Configurar archivos base (tailwind.config, next.config, etc.)
- Estructura de carpetas completa
- Variables de entorno

### **FASE 02: Tipos y Servicios Base** ✅

**Contenido:**

- **Tipos TypeScript** (8 archivos):
  - User, Course, Category, Module, Lesson
  - Cart, Order, Coupon
- **Validaciones Zod** (3 archivos):
  - authSchemas, courseSchemas, userSchemas
- **Servicios API** (10 archivos):
  - authService, coursesService, categoriesService
  - cartService, ordersService, couponsService
  - usersService, emailService, statsService, settingsService
- Cliente Axios configurado con interceptores

### **FASE 03: Stores y Hooks Personalizados** ✅

**Contenido:**

- **Stores Zustand** (3 stores):
  - authStore: gestión de usuario, login/logout
  - cartStore: carrito con persistencia localStorage
  - uiStore: sidebar, modals, loading global
- **Custom Hooks React Query** (14 hooks):
  - useAuth, useLogin, useRegister, useUpdateProfile
  - useCourses, useCourse, useCategories
  - useCart, useAddToCart, useRemoveFromCart
  - useOrders, useOrder, useCoupons, useValidateCoupon
- **Utility Hooks** (4 hooks):
  - useDebounce, useLocalStorage, useMediaQuery, useOnClickOutside

### **FASE 04: Layouts y Componentes Comunes** ✅

**Contenido:**

- **4 Layouts**:
  - RootLayout (app/layout.tsx)
  - PublicLayout (público)
  - StudentLayout (área estudiante)
  - AdminLayout (panel admin)
- **Componentes de Navegación**:
  - Header con UserMenu y CartButton
  - Footer con links y redes sociales
  - Sidebar admin con navegación
  - DashboardNavbar para admin
- **Componentes Comunes** (5 componentes):
  - LoadingSpinner, ErrorMessage, EmptyState
  - Breadcrumbs, BackButton

### **FASE 05: Páginas Públicas** ✅

**Contenido:**

- **Landing Page** (app/page.tsx):
  - Hero section con CTA
  - FeaturedCourses
  - Testimonials, FAQ
- **Catálogo** (app/cursos/page.tsx):
  - Filtros por categoría, precio, nivel
  - SearchBar
  - CourseCard component
  - Paginación
- **Detalle de Curso** (app/cursos/[slug]/page.tsx):
  - Hero con video preview
  - Descripción, objetivos, requisitos
  - Curriculum (módulos/lecciones)
  - Instructor info
  - Botón agregar al carrito
- **Auth Pages**:
  - Login (app/login/page.tsx)
  - Register (app/registro/page.tsx)
  - Forgot Password (app/recuperar-password/page.tsx)

### **FASE 06: Carrito y Checkout** ✅

**Contenido:**

- **Carrito** (app/carrito/page.tsx):
  - CartItem component
  - CartSummary con cupones
  - Botón ir a checkout
- **Checkout** (app/checkout/page.tsx):
  - CheckoutForm (datos facturación)
  - Resumen de orden
  - Integración MercadoPago
  - Creación de preference
- **Páginas de Resultado**:
  - Success (app/checkout/success/page.tsx)
  - Failure (app/checkout/failure/page.tsx)
  - Pending (app/checkout/pending/page.tsx)

### **FASE 07: Área de Estudiante** ✅

**Contenido:**

- **Mi Cuenta** (app/mi-cuenta/page.tsx):
  - Tabs: Perfil / Seguridad
  - ProfileForm (editar datos)
  - ChangePasswordForm
- **Mis Cursos** (app/mis-cursos/page.tsx):
  - Lista de cursos comprados
  - EnrolledCourseCard con progreso
  - Link a plataforma educativa externa (campus.mariavictoriaseoane.com)
- **Mis Órdenes** (app/mis-ordenes/page.tsx):
  - OrderCard component
  - Filtros por estado
  - Detalle de orden (app/mis-ordenes/[id]/page.tsx)

### **FASE 08: Panel de Administración** ⏳

**Contenido:**

- **Dashboard** (app/admin/page.tsx):
  - StatsCards (ventas, usuarios, cursos, órdenes)
  - Gráficos de ventas (Recharts)
  - Últimas órdenes
  - Cursos más vendidos
- **Componentes Admin**:
  - StatCard
  - RevenueChart
  - RecentOrders
  - TopCourses
- Sidebar de navegación admin
- Protección de rutas (middleware)

### **FASE 09: Gestión de Cursos (Admin)** ⏳

**Contenido:**

- **Lista de Cursos** (app/admin/cursos/page.tsx):
  - Tabla de cursos con acciones
  - Filtros y búsqueda
  - Botón crear curso
- **Crear/Editar Curso** (app/admin/cursos/nuevo, /[id]/editar):
  - CourseForm completo
  - Upload de imagen
  - Gestión de módulos y lecciones
  - CourseModuleManager component
  - LessonForm modal
- **Categorías** (app/admin/categorias):
  - CRUD de categorías
  - CategoryForm

### **FASE 10: Gestión de Usuarios (Admin)** ⏳

**Contenido:**

- **Lista de Usuarios** (app/admin/usuarios/page.tsx):
  - Tabla con filtros por rol
  - Búsqueda
  - Acciones: editar, activar/desactivar
- **Crear/Editar Usuario** (app/admin/usuarios/nuevo, /[id]/editar):
  - UserForm
  - Asignación de roles
  - Gestión de permisos
- **Detalle de Usuario** (app/admin/usuarios/[id]/page.tsx):
  - Información completa
  - Cursos comprados
  - Historial de órdenes

### **FASE 11: Gestión de Órdenes (Admin)** ⏳

**Contenido:**

- **Lista de Órdenes** (app/admin/ordenes/page.tsx):
  - Tabla con filtros (estado, fecha, monto)
  - Búsqueda
  - Exportar a Excel
- **Detalle de Orden** (app/admin/ordenes/[id]/page.tsx):
  - Información completa
  - Items de la orden
  - Estado de pago
  - Datos de facturación
  - Timeline de eventos
- **Componentes**:
  - OrderTimeline
  - OrderItems

### **FASE 12: Gestión de Cupones (Admin)** ⏳

**Contenido:**

- **Lista de Cupones** (app/admin/cupones/page.tsx):
  - Tabla de cupones activos/expirados
  - Estadísticas de uso
- **Crear/Editar Cupón** (app/admin/cupones/nuevo, /[id]/editar):
  - CouponForm
  - Tipos: porcentaje / monto fijo
  - Fecha inicio/fin
  - Límite de usos
  - Cursos aplicables

### **FASE 13: Gestión de Emails (Admin)** ⏳

**Contenido:**

- **Templates de Email** (app/admin/emails/page.tsx):
  - Lista de plantillas
  - Vista previa
  - EmailTemplateEditor
- **Configuración SMTP** (app/admin/emails/config):
  - SMTPConfigForm
  - Test de envío
- **Log de Emails** (app/admin/emails/logs):
  - Historial de emails enviados
  - Estados: enviado, fallido, pendiente

### **FASE 14: Configuración General (Admin)** ⏳

**Contenido:**

- **Configuración del Sitio** (app/admin/configuracion/page.tsx):
  - GeneralSettingsForm (nombre, logo, etc.)
  - SEO settings
  - Redes sociales
- **MercadoPago Config** (app/admin/configuracion/mercadopago):
  - API Keys
  - Test de conexión
- **Políticas y Términos** (app/admin/configuracion/legal):
  - Editor de términos y condiciones
  - Políticas de privacidad

### **FASE 15: Testing y Deployment** ⏳

**Contenido:**

- **Testing**:
  - Setup de Jest y React Testing Library
  - Tests unitarios de componentes
  - Tests de integración de stores
  - Tests E2E con Playwright
- **Optimización**:
  - Análisis de bundle (next/bundle-analyzer)
  - Optimización de imágenes
  - Code splitting
  - Performance audit
- **Deployment**:
  - Build de producción
  - Deploy en Vercel
  - Variables de entorno
  - Configuración de dominio
  - Monitoreo y analytics

---

## 🚀 Orden de Implementación Recomendado

### **Etapa 1: Fundamentos (Fases 00-04)** ✅ COMPLETADO

1. ✅ **Fase 00**: Introducción y arquitectura del proyecto
2. ✅ **Fase 01**: Estructura del proyecto y dependencias
3. ✅ **Fase 02**: Tipos TypeScript, validaciones Zod, servicios API
4. ✅ **Fase 03**: Stores Zustand, hooks React Query, utility hooks
5. ✅ **Fase 04**: Layouts (público, estudiante, admin), navegación, componentes comunes

### **Etapa 2: Funcionalidad E-commerce (Fases 05-07)** ✅ COMPLETADO

6. ✅ **Fase 05**: Landing page, catálogo de cursos, detalle de curso, páginas de autenticación
7. ✅ **Fase 06**: Carrito de compras, checkout, integración MercadoPago, páginas de resultado
8. ✅ **Fase 07**: Mi cuenta (perfil/seguridad), mis cursos comprados, historial de órdenes

### **Etapa 3: Panel Administrativo (Fases 08-14)** ⏳ EN PROGRESO

9. ⏳ **Fase 08**: Dashboard admin con estadísticas, gráficos, resumen de ventas
10. ⏳ **Fase 09**: CRUD completo de cursos, módulos, lecciones, categorías
11. ⏳ **Fase 10**: Gestión de usuarios, roles, permisos
12. ⏳ **Fase 11**: Gestión de órdenes, ventas, exportación de datos
13. ⏳ **Fase 12**: Gestión de cupones de descuento
14. ⏳ **Fase 13**: Configuración de emails, plantillas, SMTP
15. ⏳ **Fase 14**: Configuración general del sitio, SEO, integraciones

### **Etapa 4: Finalización (Fase 15)** ⏳ PENDIENTE

16. ⏳ **Fase 15**: Testing (unit, integration, E2E), optimización, deployment

---

## 📋 Estado Actual del Backend

El backend NestJS está **100% completo** y funcionando con:

✅ **Sistema de Ventas**: Carrito, cupones, checkout, órdenes, pagos (MercadoPago)  
✅ **Sistema de Emails**: Transaccionales, marketing, carrito abandonado, configuración dinámica  
✅ **Autenticación**: JWT, roles (SUPER_ADMIN, OWNER, STUDENT)  
✅ **CRUD Completo**: Cursos, categorías, módulos, lecciones, usuarios

---

## 🛠️ Stack Tecnológico

```
Frontend:      Next.js 14 + React 18 + TypeScript 5
Estilos:       Tailwind CSS 3 + shadcn/ui
Estado:        Zustand + React Query (TanStack Query)
Formularios:   React Hook Form + Zod
HTTP:          Axios
Video:         Video.js
Pagos:         MercadoPago SDK
Charts:        Recharts
```

---

## 📖 Cómo Usar Esta Documentación

### Para Desarrolladores:

1. **Comenzar por Fase 00** - Entender el contexto completo del proyecto
2. **Seguir el orden numérico** - Cada fase asume que las anteriores están completas
3. **Revisar el checklist** - Al final de cada fase hay una lista de verificación
4. **Testear cada fase** - Antes de pasar a la siguiente, asegurar que todo funciona

### Para Project Managers:

- Cada fase es un **milestone** independiente
- Tiempo estimado: **1-3 días** por fase (según complejidad)
- Las fases 01-04 son **fundamentales** antes de comenzar desarrollo de features
- Las fases 05-08 son el **MVP** para usuarios finales
- Las fases 09-14 son el **panel admin** completo

---

## ✅ Prerequisitos Antes de Comenzar

Antes de empezar con Fase 01, asegurar:

- [x] Backend NestJS corriendo en `http://localhost:3000`
- [x] Base de datos PostgreSQL operativa
- [x] Variables de entorno del backend configuradas
- [x] MercadoPago sandbox credentials disponibles
- [x] SMTP configurado para envío de emails
- [x] Postman collection para testear endpoints
- [ ] Node.js 18+ instalado localmente
- [ ] Git configurado
- [ ] Editor de código (VSCode recomendado)

---

## 🆘 Soporte y Recursos

### Documentación de Tecnologías:

- [Next.js 14 Docs](https://nextjs.org/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MercadoPago SDK](https://www.mercadopago.com.ar/developers)

### Backend API:

- Postman Collection: `postman/postman-collection.json`
- API Base URL (dev): `http://localhost:3000`
- Swagger Docs: `http://localhost:3000/api` (si está habilitado)

---

## 📌 Notas Importantes

⚠️ **IMPORTANTE**:

- Cada fase debe completarse antes de pasar a la siguiente
- Los archivos de código deben respetar la estructura definida en Fase 01
- Usar TypeScript estricto en todo el proyecto
- Seguir las convenciones de nomenclatura de Next.js 14 App Router

💡 **TIPS**:

- Hacer commits frecuentes al finalizar cada fase
- Testear en diferentes navegadores y dispositivos
- Usar React Query DevTools para debugging
- Aprovechar Next.js Image para optimización automática

---

**🚀 ¿Listo para comenzar? → Ir a [FASE 00 - Introducción](./FRONTEND-00-INTRO.md)**
