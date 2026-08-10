# GesRutas iClient — Plan de Desarrollo

> Hoja de ruta técnica para evolucionar el portal B2B de Sindoni desde su estado actual (catálogo + carrito + pedidos) hacia una plataforma completa de autogestión para clientes.

---

## Estado Actual del Ecosistema

### GesRutas iClient (Frontend — React 19 + TypeScript + Vite + Tailwind)

| Módulo | Estado | Ruta |
|--------|--------|------|
| Login | Completo | `/` |
| Sidebar + Header modular | Completo (colapsable, drawer móvil, campana de notificaciones sin backend aún) | — |
| Dashboard | Completo (hero, KPIs, crédito, último pedido, mapa, visitas) | `/dashboard` |
| Selección de empresa | Completo | `/inicio` |
| Catálogo por empresa | Completo (búsqueda + categoría real + rango de precio + orden) | `/catalogo/:empresaId` |
| Carrito multi-empresa | Completo | `/carrito` |
| Confirmación 3 pasos | Completo | `/confirmacion` |
| Historial de pedidos | Completo (ver, filtrar por estado, seguimiento de aprobación vendedor→admin, N.° SAP) | `/pedidos` |
| Perfil | Completo (datos, créditos, cambio password) | `/perfil` |
| Identidad visual | Completo — rebrand a **GesRutas iClient**, paleta navy/dorado/tricolor italiano extraída del empaque real | — |
| Cuentas/Facturas | UI con candado "Próximamente" — sin backend (Fase 4) | — |
| Pagos | UI con candado "Próximamente" — sin backend (Fase 4) | — |
| Reclamos | **No existe** (Fase 5) | — |
| Notificaciones | Completo — campana conectada a datos reales (contexto con polling, dropdown, marcar leída/todas) | — |

### GesRutasApi (Backend — Laravel 11)

| Recurso | Estado |
|---------|--------|
| Auth Sanctum (cookie SPA) | Completo (`cliente_web` guard) |
| CRUD Carrito + Items | Completo (5 endpoints) |
| Pedidos Web (crear, listar, detalle) | Completo (3 endpoints) |
| Catálogo con precios B3 | Completo (1 endpoint) |
| Perfil (datos, contactos, créditos) | Completo (2 endpoints) |
| Empresas por cliente | Completo (1 endpoint) |
| Aprobación/rechazo de pedidos web | Completo — status extendido (pendiente/aprobado_vendedor/aprobado/rechazado/modificado), historial, notificación interna hacia Plus |
| Dashboard agregado | Completo — `GET /mercadito/dashboard` |
| Visitas comerciales para cliente | Completo — `GET /mercadito/visitas?tipo=ultimas\|proxima` |
| Tasa BCV | Completo — `GET /mercadito/tasa-bcv` (lee `table_dolar_bcv`, sincronizada por Plus) |
| Facturas/Cuentas por cobrar | **No existe** (datos en SAP, sin modelo local) |
| Pagos | **No existe** |
| Reclamos | **No existe** |
| Notificaciones a clientes | Completo — tabla `notificaciones_cliente` + endpoints (`index`, `marcarLeida`, `marcarTodasLeidas`) + endpoint interno recibido desde Plus |
| Categorías de materiales | Completo — relación real vía `materiales_categoria` (se corrigió `Materiales::categoriaAsociada()`, la relación original `categoria()` estaba rota) |

### GesRutasPlus (Admin — Laravel 10)

| Recurso | Estado |
|---------|--------|
| Bandeja de pedidos (móvil/escritorio) | Completo (pendientes, aprobados, rechazados) |
| Aprobación → SAP (síncrono) | Completo (`SapService`) |
| RBAC personalizado | Completo (Rol, Permission, middleware) |
| Notificaciones (database + broadcast) | Completo (pedidos, jobs, exportaciones) |
| Gestión de clientes | Completo (CRUD, mapa, importación) |
| Visitas comerciales | Completo (FormVisita, Itinerario) |
| Gestión de ClienteWebUser | **No existe** |
| Bandeja de pedidos de clientes | Completo — módulo propio con KPIs, bandejas por estado e historial. Vendedor completa canal/sector/clase/ítems reutilizando la pantalla real de crear pedido (sin duplicar el cálculo de IVA/retención) y aprueba; admin revisa y sube a SAP desde ahí mismo — automático, ya no manual. Notifica al cliente con el detalle de lo que cambió |
| Indicador de origen de pedido | Completo — campo `origen` (móvil/escritorio/cliente) en `pedidos_web` |
| Módulo de reclamos | **No existe** |

---

## Progreso — Fase 1

**Completo:**
- ✅ Sidebar colapsable + Header (`Sidebar.tsx`, `Header.tsx`, `MainLayout.tsx`, `useSidebar.ts`)
- ✅ Dashboard con hero, KPIs, estado de cuenta, último pedido, mapa, visitas (`DashboardPage.tsx` + `widgets/`)
- ✅ Endpoints backend: `/mercadito/dashboard`, `/mercadito/tasa-bcv`, `/mercadito/visitas`
- ✅ Filtros del catálogo: categoría (relación real `materiales_categoria`), rango de precio (slider doble), orden
- ✅ Rebrand completo: **GesRutas iClient**, paleta navy/dorado extraída del empaque real Sindoni, tipografía Bricolage Grotesque, franja tricolor italiana (sidebar + cards principales del dashboard y perfil)
- ✅ Bandeja de pedidos de clientes en GesRutasPlus — módulo completo (`PedidosWebController`, `PedidoWebService`):
  - Dashboard con KPIs (pendientes, en revisión final, aprobados, rechazados) + accesos rápidos
  - Bandejas por estado y vista de historial, con roles bien diferenciados: vendedor (solo su cartera), admin (observador en "pendiente", actúa en "revisión final"), super usuario (ve y actúa en todo)
  - El vendedor completa canal/sector/clase/lista de precio y ajusta los ítems reutilizando la pantalla real de crear pedido (`pedidos.create` prellenada) — cero duplicación del motor de IVA/retención/precio promedio
  - Al aprobar el admin, sube a SAP automáticamente desde el pedido real ya completado (`PedidosController::subirPedido`) — ya no es un registro manual
  - Notificación al cliente con diff automático de lo que cambió respecto a lo que pidió originalmente
- ✅ Indicador de origen del pedido (`origen`: móvil/escritorio/cliente) en `pedidos_web`, código `PC-...` para pedidos de cliente en la tabla `pedidos`
- ✅ Notificaciones reales al cliente: tabla `notificaciones_cliente`, endpoint interno Plus→Api (token compartido), endpoints cliente (`index`/`marcarLeida`/`marcarTodasLeidas`), campana del header conectada (`NotificacionContext` con polling cada 60s, `NotificacionDropdown`)
- ✅ `PedidosPage` actualizada con los nuevos estados (`aprobado_vendedor`, `modificado`) y detalle de pedido con vendedor/N.° SAP/seguimiento

**Pendiente:**
- ⬜ Gestión de `ClienteWebUser` desde GesRutasPlus (alta/edición de credenciales del portal)
- ⬜ Módulo de reclamos (Fase 5)

---

## Fase 1: Dashboard, Sidebar y Mejoras de Pedidos

### 1.1 Sidebar y Navegación — ✅ Implementado

**Problema**: El header actual tiene navegación plana (Pedidos, Carrito, Perfil, Logout). No escala para múltiples módulos.

**Solución**: Reemplazar la navegación por un sidebar colapsable + header compacto.

#### Estructura de navegación

```
┌─ Header ──────────────────────────────────────────────┐
│ [≡] GesRutas iClient          🔔 Notificaciones  [Avatar] │
└───────────────────────────────────────────────────────┘
┌─ Sidebar ─┐ ┌─ Content ─────────────────────────────┐
│ Dashboard  │ │                                       │
│ Pedidos   ▸│ │  (página activa)                      │
│  Empresas  │ │                                       │
│  Catálogo  │ │                                       │
│  Carrito   │ │                                       │
│  Historial │ │                                       │
│ Cuentas  ▸ │ │                                       │
│ Pagos    ▸ │ │                                       │
│ Soporte  ▸ │ │                                       │
│            │ │                                       │
│ ─────────  │ │                                       │
│ Mi Perfil  │ │                                       │
│ Cerrar ses │ │                                       │
└────────────┘ └───────────────────────────────────────┘
```

#### Frontend — Cambios

| Archivo | Cambio |
|---------|--------|
| `src/components/layout/MainLayout.tsx` | Refactorizar: extraer header a componente, crear `Sidebar.tsx`, layout flex con sidebar + content |
| `src/components/layout/Sidebar.tsx` | **Nuevo**. Sidebar colapsable. Items con iconos, submenús, indicador de ruta activa. Responsive: drawer en móvil, fixed en desktop |
| `src/components/layout/Header.tsx` | **Nuevo**. Header compacto: logo, toggle sidebar, campana notificaciones, avatar usuario |
| `src/app/routes.tsx` | Agregar ruta `/dashboard` como página principal (reemplaza `/inicio`). Mantener `/inicio` como redirect |

#### Comportamiento responsive

- **Desktop** (≥1024px): Sidebar visible, colapsable a iconos
- **Tablet** (768–1023px): Sidebar colapsada por defecto (solo iconos), expandible
- **Móvil** (<768px): Sidebar oculta, accesible como drawer desde botón hamburguesa

#### Módulos con candado

Cuentas y Pagos aparecen en el sidebar pero deshabilitados con tooltip "Próximamente". Esto prepara la UI para fases futuras sin funcionalidad vacía.

---

### 1.2 Dashboard — ✅ Implementado

**Página principal** que muestra un resumen ejecutivo del cliente.

#### Widgets

| Widget | Fuente de datos | Endpoint API | Prioridad |
|--------|----------------|--------------|-----------|
| Estado de cuenta (resumen crédito) | `cliente_creditos` | `GET /mercadito/dashboard` | P1 |
| Pedidos abiertos (count pendientes) | `pedidos_web` WHERE status=pendiente | `GET /mercadito/dashboard` | P1 |
| Último pedido (código, fecha, total, estado) | `pedidos_web` ORDER BY created_at DESC LIMIT 1 | `GET /mercadito/dashboard` | P1 |
| Empresas activas | `cliente_mercancias` | `GET /mercadito/dashboard` | P1 |
| Tasa BCV | Tabla de tasas o API externa | `GET /mercadito/tasa-bcv` | P1 |
| Facturas pendientes | **Bloqueado** (sin datos en BD) | — | P3 (Fase 4) |
| Reclamos en proceso | **Bloqueado** (sin módulo) | — | P3 (Fase 5) |
| Últimas visitas comerciales | `form_visitas` + `historial_general` | `GET /mercadito/visitas?tipo=ultimas` | P2 |
| Próxima visita comercial | `itinerarios` WHERE fecha ≥ hoy | `GET /mercadito/visitas?tipo=proxima` | P2 |
| Mapa de ubicación | `clientes.latitud_cliente`, `longitud_cliente` | Incluido en `/mercadito/dashboard` | P2 |

#### Backend — Nuevos endpoints en GesRutasApi

**`GET /mercadito/dashboard`** — Endpoint agregado que retorna todo en una sola llamada:

```typescript
interface DashboardData {
  creditos: {
    mercancia_id: number;
    nombre_mercancia: string;
    limite_credito: number;
    credito_usado: number;
    disponible: number;
    moneda: string;
  }[];
  pedidos_abiertos: number;
  ultimo_pedido: {
    id: number;
    codigo_pedido_web: string;
    empresa: string;
    total: number;
    moneda: string;
    status: string;
    fecha: string;
  } | null;
  empresas_activas: number;
  ubicacion: {
    latitud: number | null;
    longitud: number | null;
    direccion: string;
    poblacion: string;
    estado: string;
  };
}
```

**`GET /mercadito/tasa-bcv`** — Retorna la tasa del día:

```typescript
interface TasaBCV {
  tasa: number;
  fecha: string;
  fuente: string;
}
```

> **Nota**: GesRutasPlus tiene `ActualizarDolarYPreciosJob` que sincroniza tasas. Verificar si existe una tabla de tasas o si se debe crear. Si no hay tabla, crear `tasas_bcv` con campos `fecha`, `tasa`, `fuente` y alimentarla desde el job existente.

**`GET /mercadito/visitas`** — Visitas comerciales del cliente:

```typescript
// ?tipo=ultimas (últimas 5 visitas realizadas)
// ?tipo=proxima (próxima visita agendada)
interface VisitaCliente {
  fecha: string;
  vendedor: string;
  tipo_visita: string;
  presencial: boolean;
  observaciones?: string;
}
```

#### Backend — Archivos a crear/modificar

| Archivo | Acción |
|---------|--------|
| `app/Http/Controllers/Api/MercaditoDashboardController.php` | **Crear**. Método `index()` que agrega datos del cliente autenticado |
| `app/Http/Controllers/Api/MercaditoVisitasController.php` | **Crear**. Consulta `form_visitas` e `itinerarios` filtrados por `cliente_id` |
| `app/Http/Controllers/Api/MercaditoTasaController.php` | **Crear**. Retorna tasa BCV del día |
| `routes/api.php` | Agregar 3 rutas bajo grupo `mercadito` |
| Modelo `TasaBcv` + migración | **Crear** si no existe tabla de tasas |

#### Frontend — Archivos a crear

| Archivo | Descripción |
|---------|-------------|
| `src/pages/dashboard/DashboardPage.tsx` | Página principal con grid de widgets |
| `src/pages/dashboard/widgets/CreditoWidget.tsx` | Card con barras de crédito por empresa |
| `src/pages/dashboard/widgets/PedidosWidget.tsx` | Counter de pedidos abiertos + último pedido |
| `src/pages/dashboard/widgets/TasaBcvWidget.tsx` | Tasa del día con fecha de actualización |
| `src/pages/dashboard/widgets/VisitasWidget.tsx` | Timeline de visitas + próxima visita |
| `src/pages/dashboard/widgets/MapaWidget.tsx` | Mapa con marcador de ubicación del cliente |
| `src/pages/dashboard/widgets/EmpresasWidget.tsx` | Count de empresas activas con acceso rápido |
| `src/services/dashboardService.ts` | Llamadas API para dashboard |
| `src/models/Dashboard.ts` | Interfaces TypeScript |

#### Mapa

Para el widget de mapa, opciones:
- **Leaflet + OpenStreetMap** (gratuito, sin API key) — Recomendado
- Integrar como `<iframe>` de OpenStreetMap para MVP rápido, migrar a Leaflet para interactividad

---

### 1.3 Filtros del Catálogo — ✅ Implementado

**Problema**: Solo existe búsqueda por texto. No hay filtro por categoría ni rango de precio.

#### Frontend — Cambios en CatalogoPage

```typescript
interface FiltrosCatalogo {
  busqueda: string;           // ya existe
  categoria_id: number | null; // nuevo
  precio_min: number | null;   // nuevo
  precio_max: number | null;   // nuevo
  orden: 'nombre_asc' | 'nombre_desc' | 'precio_asc' | 'precio_desc'; // nuevo
}
```

- Agregar panel de filtros lateral o barra de filtros superior
- Los filtros se aplican client-side (todos los materiales ya están cargados en memoria)
- Agregar un `<select>` con categorías obtenidas de los materiales cargados
- Agregar inputs para rango de precio con slider o inputs numéricos

#### Backend — Cambios

| Archivo | Cambio |
|---------|--------|
| `MercaditoCatalogoController.php` | Incluir `categoria` en la respuesta de cada material (JOIN con `categoria_materiales`) |

Necesario verificar:
- ¿La tabla `categoria_materiales` tiene datos?
- ¿El campo `Materiales.categoria_id` (si existe) está poblado?
- Si `CategoriaMateriales` no tiene datos útiles, usar `TipoMaterial` como agrupador alternativo

#### Frontend — Archivos a modificar/crear

| Archivo | Cambio |
|---------|--------|
| `src/pages/catalogo/CatalogoPage.tsx` | Agregar panel de filtros, lógica de filtrado |
| `src/pages/catalogo/FiltrosCatalogo.tsx` | **Nuevo**. Componente de filtros (categoría, precio, orden) |
| `src/models/Material.ts` | Agregar `categoria?: { id: number; nombre: string }` |

---

### 1.4 Integración GesRutasPlus — Bandeja de Pedidos de Clientes

**Flujo de aprobación de pedidos de clientes (dos filtros)**:

```
Cliente (GesRutas iClient)          Vendedor (GesRutasPlus)         Admin (GesRutasPlus)
─────────────────────          ───────────────────────         ────────────────────
Crea pedido web         →      Ve en bandeja vendedor    →     Ve en bandeja admin
status: pendiente              Puede: revisar, editar,        Puede: aprobar → SAP
                               aprobar, rechazar (motivo)              rechazar (motivo)
                               ↓ aprueba                      ↓ aprueba
                               status: aprobado_vendedor      Convierte a Pedido SAP
                               ↓ rechaza                      ↓ rechaza
                               status: rechazado               status: rechazado
                               (motivo visible al cliente)     (motivo visible al cliente)
```

#### Indicador de Origen

Los pedidos necesitan distinguirse visualmente según su origen:

| Origen | Prefijo código | Icono | Color badge |
|--------|---------------|-------|-------------|
| Móvil (app vendedor) | `PM-` | 📱 | Azul |
| Escritorio (panel admin) | `PE-` | 🖥️ | Gris |
| Cliente (GesRutas iClient) | `PC-` | 🌐 | Verde |

#### Backend GesRutasApi — Cambios

| Archivo | Cambio |
|---------|--------|
| Migración `pedidos_web` | Agregar columna `status`: expandir enum a `pendiente`, `aprobado_vendedor`, `aprobado`, `rechazado`, `modificado` |
| Migración `pedidos_web` | Agregar columna `vendedor_id` (nullable, FK → users) — quién lo aprobó/rechazó como vendedor |
| Migración `pedidos_web` | Agregar columna `admin_id` (nullable, FK → users) — quién lo aprobó/rechazó como admin |
| Migración `pedidos_web` | Agregar columna `origen` ENUM('movil','escritorio','cliente') DEFAULT 'cliente' |
| Modelo `PedidoWeb` | Agregar nuevos campos, relaciones, helpers (`isAprobadoVendedor()`) |
| `MercaditoPedidoController` | Agregar método `show()` mejorado que incluya historial de estados |

#### Backend GesRutasPlus — Nuevos archivos

| Archivo | Descripción |
|---------|-------------|
| `app/Http/Controllers/PedidosWebController.php` | **Crear**. CRUD para pedidos de clientes: index (bandeja), show (detalle), aprobar, rechazar, editar |
| `resources/views/pedidos-web/index.blade.php` | **Crear**. Bandeja de pedidos de clientes (DataTables) |
| `resources/views/pedidos-web/show.blade.php` | **Crear**. Vista detalle con acciones aprobar/rechazar |
| `resources/views/pedidos-web/edit.blade.php` | **Crear**. Edición de items del pedido |
| `database/migrations/add_origen_to_pedidos.php` | **Crear**. Agregar campo `origen` a tabla `pedidos` existente |
| Permisos | Crear: `ver_bandeja_pedidos_clientes`, `aprobar_pedidos_clientes` |
| `routes/web.php` | Agregar rutas `/pedidos-web/*` con permisos |

#### Flujo técnico de aprobación vendedor → admin

Cuando el vendedor aprueba un pedido web:

1. `PedidosWebController::aprobar($id)`:
   - Cambia `PedidoWeb.status` a `aprobado_vendedor`
   - Registra `vendedor_id`
   - Crea registro en `HistorialPedidos` (o tabla equivalente para pedidos web)
   - **Opción A**: El pedido permanece como `PedidoWeb` y el admin lo ve en su propia bandeja filtrada
   - **Opción B**: Se convierte a un `Pedidos` (tabla principal) y entra al flujo existente de aprobación

**Recomendación: Opción A** — Mantener todo en la tabla `pedidos_web` con estados extendidos. Razón: los pedidos de cliente tienen estructura diferente (no tienen visita, no tienen firma digital, no tienen descuentos SAP). Convertir perdería información y añadiría complejidad innecesaria. El admin simplemente ve pedidos web con status `aprobado_vendedor` en su bandeja.

Cuando el admin aprueba:
1. `PedidosWebController::aprobarAdmin($id)`:
   - Crea un `Pedidos` (tabla principal) con los datos del `PedidoWeb` para enviar a SAP
   - Llama a `SapService::enviarPedido()` con el pedido convertido
   - Actualiza `PedidoWeb.status` a `aprobado`
   - Registra `admin_id` y `pedido_sap` (número SAP)

#### Notificaciones al cliente

Cuando cambia el estado del pedido, notificar al cliente:

| Evento | Notificación al cliente |
|--------|------------------------|
| Vendedor aprueba | "Tu pedido PC-XXXX fue revisado y aprobado por tu ejecutivo comercial. Está en proceso de aprobación final." |
| Admin aprueba (SAP) | "Tu pedido PC-XXXX fue aprobado y procesado. Número SAP: XXXXXXXX" |
| Vendedor rechaza | "Tu pedido PC-XXXX fue rechazado. Motivo: [texto]" |
| Admin rechaza | "Tu pedido PC-XXXX fue rechazado en revisión final. Motivo: [texto]" |
| Vendedor modifica | "Tu pedido PC-XXXX fue modificado por tu ejecutivo comercial. [Resumen cambios]" |

**Implementación técnica de notificaciones**:

```
GesRutasPlus (cambio de estado)
  → POST /api/mercadito/notificaciones/pedido (endpoint nuevo en GesRutasApi)
    → Crear registro en tabla notificaciones_cliente
    → (Futuro: push notification, email, websocket)

GesRutas iClient (frontend)
  → GET /mercadito/notificaciones (polling cada 60s o WebSocket)
  → Campana en header con badge de count
  → Dropdown con lista de notificaciones
```

#### Backend GesRutasApi — Notificaciones

| Archivo | Acción |
|---------|--------|
| Migración `notificaciones_cliente` | **Crear**. Campos: `id`, `cliente_web_user_id`, `tipo` (pedido_aprobado, pedido_rechazado, pedido_modificado, reclamo_actualizado), `titulo`, `mensaje`, `data` (JSON), `leida` (bool), `timestamps` |
| Modelo `NotificacionCliente` | **Crear** |
| `MercaditoNotificacionController` | **Crear**. Métodos: `index()` (listar), `marcarLeida($id)`, `marcarTodasLeidas()` |
| `routes/api.php` | Agregar rutas y endpoint interno para recibir notificaciones de Plus |

#### Frontend — Notificaciones

| Archivo | Descripción |
|---------|-------------|
| `src/contexts/NotificacionContext.tsx` | **Nuevo**. Polling de notificaciones, count no leídas, mark as read |
| `src/components/layout/NotificacionDropdown.tsx` | **Nuevo**. Dropdown en header con lista de notificaciones recientes |
| `src/services/notificacionService.ts` | **Nuevo**. API calls |
| `src/models/Notificacion.ts` | **Nuevo**. Interface TypeScript |

---

## Fase 2: Rediseño del Navbar

> **Nota**: Esta fase se ejecuta junto con la Fase 1, ya que el sidebar es prerequisito del dashboard.

### Principios de diseño

1. **Consistencia con identidad visual** — Seguir `IDENTIDAD_VISUAL.md`
2. **Sidebar como navegación principal** — Los módulos viven en el sidebar, no en el header
3. **Header mínimo** — Logo, toggle sidebar, notificaciones, avatar
4. **Breadcrumbs** — Contexto de navegación dentro de cada módulo
5. **Responsive first** — Drawer en móvil, colapsado en tablet, expandido en desktop

### Header nuevo

```
┌──────────────────────────────────────────────────────────────┐
│ [≡]  GesRutas iClient                    🔔(3)  Usuario ▾ [foto] │
└──────────────────────────────────────────────────────────────┘
```

- `[≡]`: Toggle sidebar (mobile: abre drawer, desktop: colapsa/expande)
- `🔔(3)`: Campana con badge de notificaciones no leídas
- `Usuario ▾`: Dropdown con email, rol, "Mi perfil", "Cerrar sesión"

### Sidebar

```
┌────────────────────────┐
│  ┌──┐                  │
│  │🏠│ Dashboard         │  ← activo: fondo brand-primary-50, borde izquierdo brand-primary-600
│  └──┘                  │
│  ┌──┐                  │
│  │📦│ Pedidos          ▸│  ← expandible
│  └──┘                  │
│     Nuevo pedido        │  ← sub-items
│     Mis pedidos         │
│  ┌──┐                  │
│  │📊│ Cuentas       🔒 │  ← candado = próximamente
│  └──┘                  │
│  ┌──┐                  │
│  │💳│ Pagos         🔒 │
│  └──┘                  │
│  ┌──┐                  │
│  │🎧│ Soporte          │
│  └──┘                  │
│                        │
│ ────────────────────── │
│  ┌──┐                  │
│  │👤│ Mi Perfil         │
│  └──┘                  │
└────────────────────────┘
```

### Archivos

| Archivo | Acción |
|---------|--------|
| `src/components/layout/Sidebar.tsx` | **Crear**. Componente con estado colapsado/expandido, responsive drawer |
| `src/components/layout/Header.tsx` | **Crear**. Header compacto con toggle, notificaciones, usuario |
| `src/components/layout/MainLayout.tsx` | **Refactorizar**. Composición: Header + Sidebar + Content area |
| `src/components/layout/Breadcrumbs.tsx` | **Crear**. Breadcrumbs automáticos basados en la ruta |
| `src/hooks/useSidebar.ts` | **Crear**. Hook para estado del sidebar (persistido en localStorage) |

---

## Fase 3: Perfil del Cliente

### 3.1 Perfil mejorado en GesRutas iClient

**Estado actual**: Muestra email, datos básicos, créditos por empresa, cambio de contraseña.

**Mejorar con**:

| Sección | Datos | Fuente en BD |
|---------|-------|-------------|
| Datos generales | Razón social, RIF, código cliente, dirección completa, teléfono, contacto | `clientes` |
| Ubicación | Mapa con marcador, dirección formateada | `clientes.latitud_cliente`, `longitud_cliente` |
| Área de ventas | Empresa, canal, sector, condición de pago, región por cada mercancía | `area_venta_clientes` |
| Contactos | Lista de contactos con nombre y teléfono | `cliente_contactos` |
| Créditos | Ya existe, mantener | `cliente_creditos` |
| Empresas asociadas | Lista de mercancias con foto | `cliente_mercancias` + `mercancias` |
| Datos fiscales | Retenciones por empresa | `cliente_retencion` |
| Bloqueos | Indicadores de bloqueo (pedido, entrega, facturación, contabilidad) | `clientes.BloqueoPed`, etc. |

#### Backend — Cambios

| Archivo | Cambio |
|---------|--------|
| `MercaditoPerfilController::show()` | Expandir respuesta para incluir: area_venta, retenciones, bloqueos, ubicación, empresas con foto |

#### Frontend — Cambios

| Archivo | Cambio |
|---------|--------|
| `src/pages/perfil/PerfilPage.tsx` | Rediseñar en secciones con tabs o acordeón |
| `src/models/Perfil.ts` | **Crear**. Interfaces para datos expandidos |

### 3.2 Gestión de clientes web en GesRutasPlus

**Nuevo módulo** en el panel admin para crear y administrar usuarios del portal GesRutas iClient.

#### Funcionalidades

- Listar clientes web (`clientes_web_users`) con estado activo/inactivo
- Crear nuevo usuario web vinculado a un cliente existente
- Activar/desactivar acceso
- Resetear contraseña
- Ver actividad (último login, pedidos realizados)

#### Backend GesRutasPlus — Nuevos archivos

| Archivo | Descripción |
|---------|-------------|
| `app/Http/Controllers/ClienteWebController.php` | **Crear**. CRUD para `ClienteWebUser` |
| `resources/views/clientes-web/index.blade.php` | **Crear**. Lista con DataTables |
| `resources/views/clientes-web/create.blade.php` | **Crear**. Form: seleccionar cliente, email, password |
| `resources/views/clientes-web/edit.blade.php` | **Crear**. Edición, activar/desactivar, reset password |
| Permiso `ver_gestion_clientes_web` | **Crear** |
| `routes/web.php` | Agregar rutas `/clientes-web/*` |

> **Nota**: El modelo `ClienteWebUser` ya existe en GesRutasApi. GesRutasPlus comparte la misma base de datos, por lo que puede acceder directamente a la tabla `clientes_web_users`.

---

## Fase 4: Gestión de Cuentas y Pagos

> **Estado: BLOQUEADA** — Requiere definir la fuente de datos (SAP, tabla intermedia, API externa).

### 4.1 Arquitectura propuesta (pendiente de datos)

#### Consulta de cuentas

| Recurso | Tabla/Fuente necesaria | Estado |
|---------|----------------------|--------|
| Facturas abiertas | Sync desde SAP → tabla `facturas` | **No existe** |
| Vencimientos | Calculado desde facturas (fecha_vencimiento < hoy) | Depende de facturas |
| Notas de crédito | Sync desde SAP → tabla `notas_credito` | **No existe** |
| Retenciones | `cliente_retencion` (parcial, sin detalle transaccional) | Parcial |

#### Modelo de datos sugerido

```sql
-- Tabla para facturas sincronizadas desde SAP
CREATE TABLE facturas_cliente (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  cliente_id VARCHAR(10),          -- codigo_cliente
  mercancia_id BIGINT UNSIGNED,
  numero_factura VARCHAR(20),
  fecha_factura DATE,
  fecha_vencimiento DATE,
  monto_total DECIMAL(15,2),
  monto_pendiente DECIMAL(15,2),
  moneda VARCHAR(5),
  estado ENUM('abierta','parcial','pagada','anulada'),
  referencia_sap VARCHAR(50),
  timestamps
);

-- Tabla para notas de crédito
CREATE TABLE notas_credito_cliente (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  cliente_id VARCHAR(10),
  mercancia_id BIGINT UNSIGNED,
  numero_nota VARCHAR(20),
  fecha DATE,
  monto DECIMAL(15,2),
  moneda VARCHAR(5),
  factura_id BIGINT UNSIGNED NULLABLE, -- factura asociada
  referencia_sap VARCHAR(50),
  timestamps
);
```

#### Registro de pagos

| Funcionalidad | Descripción |
|---------------|-------------|
| Carga de comprobante | Cliente sube foto/PDF del comprobante de pago |
| Datos del pago | Banco, referencia, monto, fecha, moneda |
| Estado | Pendiente de verificación → Verificado → Rechazado |
| Notificación | Admin recibe notificación de nuevo pago cargado |

```sql
CREATE TABLE pagos_cliente (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  cliente_web_user_id BIGINT UNSIGNED,
  cliente_id VARCHAR(10),
  factura_id BIGINT UNSIGNED NULLABLE,
  monto DECIMAL(15,2),
  moneda VARCHAR(5),
  banco VARCHAR(100),
  referencia VARCHAR(50),
  fecha_pago DATE,
  comprobante_path VARCHAR(500),   -- ruta del archivo
  observaciones TEXT NULLABLE,
  estado ENUM('pendiente','verificado','rechazado') DEFAULT 'pendiente',
  motivo_rechazo TEXT NULLABLE,
  verificado_por BIGINT UNSIGNED NULLABLE, -- user_id del admin
  timestamps
);
```

#### Prerequisitos para desbloquear

1. Definir cómo se obtienen las facturas de SAP (API, sync nocturno como los otros datos, o tabla intermedia manual)
2. Crear job de sincronización similar a los existentes en GesRutasPlus (`SyncFacturasClienteJob`)
3. Definir almacenamiento para comprobantes (S3, disco local, etc.)

---

## Fase 5: Atención al Cliente (Reclamos)

### 5.1 Arquitectura del sistema de tickets

```
┌─ GesRutas iClient ─────────┐     ┌─ GesRutasApi ──────┐     ┌─ GesRutasPlus ─────────┐
│                        │     │                    │     │                        │
│ Crear reclamo          │────▸│ API Reclamos       │◂────│ Bandeja de reclamos    │
│ Ver mis reclamos       │     │ Almacenar archivos │     │ Gestión y escalamiento │
│ Ver estado/respuestas  │     │ Notificaciones     │     │ Respuestas             │
│ Adjuntar evidencia     │     │                    │     │ Asignación a depto.    │
│                        │     │                    │     │ Métricas/KPIs          │
└────────────────────────┘     └────────────────────┘     └────────────────────────┘
```

### 5.2 Modelo de datos

```sql
-- Categorías de reclamo
CREATE TABLE reclamo_categorias (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100),        -- Pedido incompleto, Producto dañado, etc.
  descripcion TEXT NULLABLE,
  departamento VARCHAR(100),  -- Departamento destino por defecto
  activo BOOLEAN DEFAULT true,
  prioridad_default ENUM('baja','media','alta','urgente') DEFAULT 'media',
  sla_horas INT DEFAULT 48,  -- SLA en horas para resolución
  timestamps
);

-- Reclamos (tickets)
CREATE TABLE reclamos (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  codigo_reclamo VARCHAR(20) UNIQUE, -- RC-YYYY-NNNNN
  cliente_web_user_id BIGINT UNSIGNED,
  cliente_id VARCHAR(10),
  mercancia_id BIGINT UNSIGNED NULLABLE,
  categoria_id BIGINT UNSIGNED,
  pedido_web_id BIGINT UNSIGNED NULLABLE, -- pedido relacionado (opcional)
  numero_factura VARCHAR(20) NULLABLE,     -- factura relacionada (opcional)
  
  -- Descripción
  asunto VARCHAR(200),
  descripcion TEXT,
  
  -- Estado y prioridad
  estado ENUM('abierto','en_revision','en_proceso','escalado','resuelto','cerrado') DEFAULT 'abierto',
  prioridad ENUM('baja','media','alta','urgente'),
  
  -- Asignación
  asignado_a BIGINT UNSIGNED NULLABLE,     -- user_id en GesRutasPlus
  departamento VARCHAR(100) NULLABLE,
  
  -- Resolución
  resolucion TEXT NULLABLE,
  fecha_resolucion TIMESTAMP NULLABLE,
  satisfaccion_cliente INT NULLABLE,       -- 1-5 estrellas (feedback del cliente)
  
  -- SLA
  fecha_limite TIMESTAMP NULLABLE,         -- calculado: created_at + sla_horas
  sla_cumplido BOOLEAN NULLABLE,
  
  timestamps
);

-- Evidencias adjuntas
CREATE TABLE reclamo_evidencias (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  reclamo_id BIGINT UNSIGNED,
  tipo ENUM('imagen','video','documento'),
  nombre_archivo VARCHAR(255),
  ruta_archivo VARCHAR(500),
  mime_type VARCHAR(100),
  tamano_bytes BIGINT,
  subido_por_tipo ENUM('cliente','admin'),
  subido_por_id BIGINT UNSIGNED,
  timestamps
);

-- Comentarios / historial de conversación
CREATE TABLE reclamo_comentarios (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  reclamo_id BIGINT UNSIGNED,
  autor_tipo ENUM('cliente','vendedor','admin','sistema'),
  autor_id BIGINT UNSIGNED,
  autor_nombre VARCHAR(100),
  mensaje TEXT,
  es_interno BOOLEAN DEFAULT false,   -- true = solo visible para staff
  timestamps
);

-- Historial de cambios de estado
CREATE TABLE reclamo_historial (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  reclamo_id BIGINT UNSIGNED,
  estado_anterior VARCHAR(30),
  estado_nuevo VARCHAR(30),
  user_id BIGINT UNSIGNED NULLABLE,
  user_tipo ENUM('cliente','vendedor','admin','sistema'),
  motivo TEXT NULLABLE,
  timestamps
);
```

### 5.3 Categorías predefinidas

| Categoría | Departamento destino | Prioridad default | SLA (horas) |
|-----------|---------------------|-------------------|-------------|
| Pedido incompleto | Logística / Despacho | Alta | 24 |
| Producto dañado | Calidad | Alta | 48 |
| Error de facturación | Administración / Finanzas | Media | 48 |
| Falta de entrega | Logística / Despacho | Urgente | 12 |
| Calidad | Calidad / Producción | Media | 72 |

### 5.4 Flujo del reclamo

```
Estado            Quién actúa          Qué pasa
──────────────────────────────────────────────────────
abierto        →  Cliente crea         Se asigna categoría, se calcula SLA
en_revision    →  Vendedor revisa      Validar info, pedir más evidencia si falta
en_proceso     →  Depto. asignado      Investigar, coordinar solución
escalado       →  Admin/Gerencia       Casos complejos o fuera de SLA
resuelto       →  Staff marca          Se notifica al cliente, se pide feedback
cerrado        →  Auto (7 días) o      Ticket archivado
                  cliente confirma
```

### 5.5 Backend GesRutasApi — Endpoints

```
POST   /mercadito/reclamos                    → Crear reclamo
GET    /mercadito/reclamos                    → Listar mis reclamos
GET    /mercadito/reclamos/{id}               → Detalle con evidencias y comentarios
POST   /mercadito/reclamos/{id}/evidencias    → Subir archivo (multipart)
POST   /mercadito/reclamos/{id}/comentarios   → Agregar comentario (lado cliente)
PATCH  /mercadito/reclamos/{id}/satisfaccion  → Calificar resolución (1-5)
GET    /mercadito/reclamos/categorias         → Listar categorías activas
```

### 5.6 Backend GesRutasPlus — Módulo admin

| Archivo | Descripción |
|---------|-------------|
| `app/Http/Controllers/ReclamosController.php` | CRUD completo: bandeja, detalle, asignar, escalar, resolver, comentar |
| `resources/views/reclamos/index.blade.php` | Bandeja con filtros (estado, categoría, prioridad, SLA) y KPIs |
| `resources/views/reclamos/show.blade.php` | Detalle: timeline de comentarios, evidencias, historial de estados, acciones |
| Permisos | `ver_reclamos`, `gestionar_reclamos`, `escalar_reclamos` |

### 5.7 Frontend GesRutas iClient

| Archivo | Descripción |
|---------|-------------|
| `src/pages/soporte/ReclamosPage.tsx` | Lista de mis reclamos con filtros |
| `src/pages/soporte/NuevoReclamoPage.tsx` | Formulario: categoría, pedido/factura relacionado, asunto, descripción, evidencias |
| `src/pages/soporte/DetalleReclamoPage.tsx` | Timeline del reclamo, chat con staff, adjuntar más evidencia, calificar resolución |
| `src/services/reclamoService.ts` | API calls |
| `src/models/Reclamo.ts` | Interfaces TypeScript |

### 5.8 Consideraciones técnicas

**Almacenamiento de archivos**:
- Fotos: max 10MB, formatos jpg/png/webp
- Videos: max 50MB, formatos mp4/mov
- Documentos: max 20MB, formatos pdf/doc/docx
- Almacenar en disco con ruta relativa, servir vía endpoint autenticado
- Considerar S3/MinIO para producción

**Validaciones**:
- Max 5 archivos por reclamo al crear, max 10 total
- Asunto: 10–200 caracteres
- Descripción: 20–2000 caracteres
- No permitir crear reclamo duplicado sobre el mismo pedido+categoría en 24h

---

## Resumen de Impacto por Repositorio

### GesRutasApi

| Fase | Archivos nuevos | Archivos modificados | Migraciones |
|------|----------------|---------------------|-------------|
| 1 | ~6 controllers/models | `routes/api.php`, `PedidoWeb.php` | 2–3 (notificaciones, tasa_bcv, alter pedidos_web) |
| 3 | 0 | `MercaditoPerfilController.php` | 0 |
| 4 | ~4 controllers/models | `routes/api.php` | 3 (facturas, notas_credito, pagos) |
| 5 | ~4 controllers/models | `routes/api.php` | 5 (reclamos, evidencias, comentarios, historial, categorias) |

### GesRutasPlus

| Fase | Archivos nuevos | Archivos modificados | Migraciones |
|------|----------------|---------------------|-------------|
| 1 | ~6 controllers/views | `routes/web.php`, seeds de permisos | 1 (add origen to pedidos) |
| 3 | ~4 controllers/views | `routes/web.php`, seeds de permisos | 0 |
| 5 | ~6 controllers/views | `routes/web.php`, seeds de permisos | 0 (migraciones viven en Api) |

### GesRutas iClient (Frontend)

| Fase | Archivos nuevos | Archivos modificados | Componentes UI nuevos |
|------|----------------|---------------------|-----------------------|
| 1+2 | ~25 | ~5 | Sidebar, Header, Breadcrumbs, widgets, filtros, notificaciones |
| 3 | ~3 | ~2 | Tabs/acordeón de perfil |
| 4 | ~8 | ~2 | Cards facturas, form pago, upload comprobante |
| 5 | ~8 | ~2 | Form reclamo, timeline, upload evidencia, rating |

---

## Orden de Ejecución Recomendado

```
Semana 1-2:  Fase 2 (Sidebar/Header) + Fase 1.2 (Dashboard backend + frontend)
Semana 3:    Fase 1.3 (Filtros catálogo) + Fase 1.4 backend (bandeja Plus, endpoints Api)
Semana 4:    Fase 1.4 frontend (notificaciones) + Fase 3.2 (gestión clientes web en Plus)
Semana 5:    Fase 3.1 (perfil mejorado)
Semana 6-7:  Fase 5 (reclamos — backend + frontend + admin)
Fase 4:      Cuando los datos de facturación estén disponibles
```

> Las fases 1 y 2 se ejecutan en paralelo porque el sidebar es prerequisito del dashboard.

---

## Convenciones de Desarrollo

### Nombrado

- **Modelos Laravel**: PascalCase singular (`PedidoWeb`, `ReclamoCategoria`)
- **Tablas**: snake_case plural (`pedidos_web`, `reclamo_categorias`)
- **Controllers**: PascalCase + Controller (`MercaditoReclamoController`)
- **Rutas API**: kebab-case bajo prefijo `/mercadito/` (`/mercadito/reclamos/{id}/evidencias`)
- **Componentes React**: PascalCase (`ReclamosPage.tsx`, `CreditoWidget.tsx`)
- **Services/hooks**: camelCase (`reclamoService.ts`, `useSidebar.ts`)
- **Interfaces TS**: PascalCase (`ReclamoDetalle`, `DashboardData`)

### Commits

```
feat: descripción corta del feature
fix: descripción del bug corregido
refactor: cambio sin impacto funcional
chore: mantenimiento, dependencias
```

### Permisos GesRutasPlus

Nuevos permisos siguen el patrón existente `ver_<modulo>`:
- `ver_bandeja_pedidos_clientes`
- `aprobar_pedidos_clientes`
- `ver_gestion_clientes_web`
- `ver_reclamos`
- `gestionar_reclamos`
- `escalar_reclamos`

### API responses

Seguir el patrón existente:
```json
{
  "success": true,
  "message": "Descripción",
  "data": { ... }
}
```

### Errores

```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": { "campo": ["Validación fallida"] }
}
```
