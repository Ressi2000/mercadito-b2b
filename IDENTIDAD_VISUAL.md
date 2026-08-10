# GesRutas iClient — Manual de Identidad Visual

> Portal B2B de Sindoni. Este documento define la paleta, tipografía, tokens Tailwind y patrones de diseño que **toda nueva pantalla o componente debe respetar**.
>
> La paleta está extraída directamente del empaque real de producto Sindoni: fondo azul profundo, cinta dorada, ribete negro, y el detalle tricolor de la bandera italiana bajo el logo ("Qualità e tradizione").

---

## 1. Paleta de Colores

### Primary (Dorado)

Acción principal, CTAs, enlaces, focus rings, badges activos. Reemplaza el rojo de la versión anterior.

| Token | Hex | Uso |
|---|---|---|
| `brand-primary-50` | `#fdf8ec` | Fondos sutiles, hover states |
| `brand-primary-100` | `#faedc7` | Fondos de badges, alerts suaves |
| `brand-primary-200` | `#f4d78e` | Bordes claros, outlines |
| `brand-primary-300` | `#eabf56` | Indicadores secundarios |
| `brand-primary-400` | `#deab3c` | Accents suaves |
| `brand-primary-500` | `#d4a72c` | **Dorado base** — barras de progreso, pines de mapa |
| `brand-primary-600` | `#ba8c22` | **Botones, links, acciones principales** |
| `brand-primary-700` | `#a5791a` | Hover de botones primarios |
| `brand-primary-800` | `#7d5c15` | Gradientes oscuros |
| `brand-primary-900` | `#5c4310` | Detalles muy oscuros |

> **Contraste**: el dorado es un tono claro-medio. Los botones y badges primarios usan **texto oscuro** (`text-brand-neutral-900`), nunca blanco — ver sección de Componentes.

### Neutral (Azul Navy)

Fondos, textos, bordes, superficies, y el sidebar/header oscuro. Extraída del azul del empaque.

| Token | Hex | Uso |
|---|---|---|
| `brand-neutral-50` | `#f3f5f9` | Fondo de página |
| `brand-neutral-100` | `#e8ecf5` | Fondos alternos, scrollbar track |
| `brand-neutral-200` | `#e3e7f0` | Bordes, skeletons, dividers |
| `brand-neutral-300` | `#c7cee0` | Bordes secundarios, scrollbar thumb |
| `brand-neutral-400` | `#9aa6c2` | Texto muted, placeholders |
| `brand-neutral-500` | `#6b7690` | Texto secundario |
| `brand-neutral-600` | `#4d5876` | Texto terciario |
| `brand-neutral-700` | `#334066` | Labels, subtítulos |
| `brand-neutral-800` | `#123059` | Navy — sidebar, header, cards oscuras |
| `brand-neutral-900` | `#0a1a35` | Navy profundo — texto principal, fondos más oscuros |

### Accent (Rojo bandera)

Uso puntual: alertas, estados críticos, y el segmento rojo de la franja tricolor. **No** es el color de acción — ese rol lo cumple el dorado.

| Token | Hex |
|---|---|
| `brand-accent-50` | `#fdecee` |
| `brand-accent-100` | `#fad0d4` |
| `brand-accent-200` | `#f2a3ab` |
| `brand-accent-300` | `#e8747f` |
| `brand-accent-400` | `#dc4a56` |
| `brand-accent-500` | `#ce2b37` |
| `brand-accent-600` | `#b32029` |
| `brand-accent-700` | `#8f1922` |
| `brand-accent-800` | `#6e141b` |
| `brand-accent-900` | `#521015` |

### Colores Semánticos (fuera del brand)

| Rol | Clase Tailwind | Cuándo |
|---|---|---|
| Error de validación | `red-50/200/800` (Tailwind nativo) | Formularios — no confundir con `brand-accent`, que es solo para estados críticos de negocio (ej. crédito agotado) |
| Éxito | `green-*` | Confirmaciones, pedidos aprobados |
| Advertencia | `amber-*` | Pedidos pendientes |
| Info | `blue-*` | Mensajes informativos |

---

## 2. El toque italiano

Guiño directo a la cinta "Qualità e tradizione" del empaque Sindoni: una franja tricolor (verde/blanco/rojo) de 3px, usada con moderación.

**Dónde aparece:**
- Bajo el wordmark del sidebar
- Como borde superior en los cards principales del dashboard (Estado de cuenta, Último pedido, Ubicación, Visitas)

**Cómo implementarla** — clase utilitaria en `index.css`:

```html
<div class="tricolor-stripe w-11">
  <span style="background: #009246"></span>
  <span style="background: #f2f2f2"></span>
  <span style="background: #ce2b37"></span>
</div>
```

O como borde superior de un card (ver componente `TricolorEdge.tsx` en `src/pages/dashboard/widgets/`).

**Regla**: es un detalle de marca, no un patrón decorativo repetible en cualquier lugar. Se usa en el sidebar (una vez) y en los cards de mayor jerarquía del dashboard — no en botones, badges ni elementos pequeños.

---

## 3. Tipografía

**Display** (títulos, h1, wordmark): `Bricolage Grotesque` — grotesco bold y contemporáneo, peso 700–800, en clase Tailwind `font-display`.

**Body** (todo el resto): `Inter` — clase por defecto, no requiere clase adicional.

| Rol | Fuente | Peso | Tamaño | Clases |
|---|---|---|---|---|
| Heading principal (h1) | Bricolage Grotesque | 800 | `text-2xl`–`text-3xl` | `font-display font-extrabold` |
| Heading de card | Bricolage Grotesque | 700 | `text-base` | `font-display font-bold` |
| Wordmark sidebar | Bricolage Grotesque | 800 | `text-sm` | `font-display font-extrabold` |
| Cuerpo | Inter | 400 | `text-sm` / `text-base` | (default) |
| Caption / muted | Inter | 400 | `text-xs` | `text-brand-neutral-400` |
| Badge / chip | Inter | 700 | `text-[10px]`–`text-[11px]` | `font-bold` |
| Datos tabulares | Inter | 400–700 | `text-sm`–`text-2xl` | `tabular-nums` |

---

## 4. Componentes

### Botones

**Regla del dorado**: una sola acción primaria visible por pantalla — la que
hace avanzar el flujo (confirmar, enviar, continuar, nuevo pedido, iniciar
sesión). Nunca dos botones dorados a la vista al mismo tiempo, ni siquiera
en estados distintos de una misma vista (ej. header + estado vacío). Todo lo
demás compite por atención en `secondary` o `ghost` — incluido "hacer mi
primer pedido" en un estado vacío si ya hay un CTA dorado persistente en el
header. Dentro de una card o componente autocontenido (ej. `ProductCard`) el
dorado puede repetirse una vez por instancia porque cada card es su propia
unidad de decisión, no compite con el resto de la pantalla.

```
Primario:   bg-brand-primary-600 hover:bg-brand-primary-700
            text-brand-neutral-900 (¡nunca texto blanco sobre dorado!)
            rounded-xl px-6 py-3 font-semibold shadow-lg
            hover:shadow-xl hover:-translate-y-0.5 transition-all

Secundario: bg-brand-neutral-100 hover:bg-brand-neutral-200
            text-brand-neutral-700 border border-brand-neutral-200
            rounded-xl px-4 py-2 font-medium

Ghost:      text-brand-neutral-500 hover:text-brand-primary-700
            hover:bg-brand-primary-50 rounded-lg px-3 py-1.5

Disabled:   opacity-50 cursor-not-allowed (cualquier variante)
```

### Inputs

```
Base:       bg-white border border-brand-neutral-200
            rounded-xl px-4 py-3 text-sm text-brand-neutral-900
            placeholder:text-brand-neutral-400
            focus:ring-2 focus:ring-brand-primary-500/30
            focus:border-transparent

Error:      border-red-300 focus:ring-red-500/20
            + mensaje en text-red-600 text-xs
```

### Cards

```
Default:    bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl p-6

Elevated:   bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-6
            hover:-translate-y-1 hover:shadow-2xl

Flat:       bg-white shadow-sm rounded-2xl p-6

Con franja: relative overflow-hidden + <TricolorEdge /> como primer hijo
            (solo en cards principales del dashboard)
```

**Jerarquía de cards** — el borde (prop `border` de `Card`, ver `KpiCard`/`ModuleCard`)
comunica el nivel de la card, independiente del `variant` (que solo define
fondo/sombra):

| Nivel | `border` | Cuándo | Ejemplo |
|---|---|---|---|
| Dorado | `gold` | Indicadores/KPIs — la fila de números destacados de una pantalla | `KpiCard` |
| Tricolor | `subtle` + `<TricolorEdge />` | Módulo principal de la pantalla, cuerpo de contenido | `ModuleCard` con `tricolor` |
| Sin borde | `none` | Cards secundarias o de menor jerarquía — solo sombra, sin línea | `ProximamenteWidget` |

No combinar dorado y tricolor en la misma card — cada card tiene un solo
nivel. El default (`subtle`, sin franja) queda para cards que no encajan en
ninguno de los tres casos anteriores.

### Badges

```
Primario/dorado: bg-brand-primary-100 text-brand-primary-800
                 px-2.5 py-0.5 rounded-full text-xs font-semibold

Neutral:         bg-brand-neutral-100 text-brand-neutral-600
                 px-2.5 py-0.5 rounded-full text-xs font-medium

Crítico:         bg-brand-accent-100 text-brand-accent-700
                 px-2.5 py-0.5 rounded-full text-xs font-semibold
```

### KPI destacado (dashboard)

El primer stat card de una fila puede marcarse `featured`: borde superior con gradiente dorado (`from-brand-primary-300 via-brand-primary-500 to-brand-primary-700`) e ícono sobre fondo `brand-neutral-900` con el ícono en `brand-primary-300`. Ver `StatCard.tsx`.

---

## 5. Patrones de Diseño

### Hero navy con skyline

El dashboard abre con un banner de gradiente navy (`from-brand-neutral-900 via-brand-neutral-800 to-brand-neutral-900`) con una silueta de edificios sutil de fondo (SVG inline, opacidad 10%) — guiño al ilustrado que aparece detrás del logo Sindoni en el empaque.

### Ribbon "Nueva imagen"

Cinta diagonal dorada en la esquina superior derecha de elementos destacados, replicando la cinta real del empaque. Uso puntual — no repetir en cada pantalla.

```css
position: absolute; top: 22px; right: -58px; width: 230px;
background: linear-gradient(135deg, #f2cf6e, #d4a72c 55%, #a5791a);
transform: rotate(35deg);
```

### Glassmorphism

Se mantiene igual que antes, con el tono oscuro ahora en navy:

```css
/* superficie clara */
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.2);

/* superficie oscura (sidebar, dropdowns) */
background: rgba(10, 26, 53, 0.7);  /* neutral-900 @ 70% */
backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### Grid Pattern (fondo sutil)

Sin cambios respecto a la versión anterior — se mantiene el patrón de líneas al 3% de opacidad en fondos oscuros (AuthLayout).

---

## 6. Layout

| Zona | Spec |
|---|---|
| Max-width contenido | `max-w-7xl` (1280px) |
| Padding horizontal | `px-4 sm:px-6 lg:px-8` |
| Padding vertical página | `py-8 lg:py-10` |
| Fondo de página | `bg-brand-neutral-50` |
| Sidebar | Gradiente navy, colapsable a íconos, drawer en móvil |
| Header | Blanco translúcido con blur, sticky |
| Border-radius estándar | `rounded-2xl` (cards), `rounded-xl` (botones, inputs) |
| Transiciones | `transition-all duration-200` (hover), `duration-300` (cards) |

---

## 7. Reglas

### Hacer

- Usar **siempre** tokens `brand-primary` (dorado), `brand-neutral` (navy), `brand-accent` (rojo, solo alertas)
- Texto **oscuro** sobre fondos dorados, nunca blanco
- Reservar el toque tricolor italiano para el sidebar y los cards principales del dashboard
- Usar `font-display` (Bricolage Grotesque) en headings principales; todo lo demás en Inter
- Aplicar glassmorphism en superficies elevadas
- Usar `tabular-nums` en datos numéricos alineados

### No hacer

- Usar los hex antiguos de la versión roja (`#dc2626`, `#9e1f1a`, `#f59e0b`) o `red-*`/`amber-*` de Tailwind para elementos de marca
- Poner texto blanco sobre `brand-primary-*` (falla de contraste)
- Repetir la franja tricolor en botones, badges o elementos pequeños — es un detalle de marca puntual
- Mezclar `brand-accent` (rojo, alertas) con acciones de UI — ese rol es del dorado
- Inventar nuevos shades fuera de la escala 50–900 definida

---

## 8. Referencia Rápida — Archivo Fuente

```
tailwind.config.js                        → definición de tokens (primary/neutral/accent)
src/index.css                             → @font-face, .tricolor-stripe, glass, animations
src/components/ui/                        → Button, Card, Input (componentes base)
src/pages/dashboard/widgets/TricolorEdge.tsx → franja tricolor reutilizable para cards
```
