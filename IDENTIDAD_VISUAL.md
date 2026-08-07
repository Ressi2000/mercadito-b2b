# GesClientes — Manual de Identidad Visual

> Portal B2B de Sindoni. Este documento define la paleta, tipografía, tokens Tailwind y patrones de diseño que **toda nueva pantalla o componente debe respetar**.

---

## 1. Paleta de Colores

### Primary (Rojo Sindoni)

Acción principal, CTAs, enlaces, focus rings, badges activos.

| Token | Hex | Uso |
|---|---|---|
| `brand-primary-50` | `#fef2f2` | Fondos sutiles, hover states |
| `brand-primary-100` | `#fee2e2` | Fondos de badges, alerts suaves |
| `brand-primary-200` | `#fecaca` | Bordes claros, outlines |
| `brand-primary-300` | `#fca5a5` | Indicadores secundarios, spinners |
| `brand-primary-400` | `#f87171` | Puntos decorativos, accents suaves |
| `brand-primary-500` | `#ef4444` | Focus rings, badges, accent medio |
| `brand-primary-600` | `#dc2626` | **Botones, links, acciones principales** |
| `brand-primary-700` | `#b91c1c` | Hover de botones primarios |
| `brand-primary-800` | `#991b1b` | Gradientes oscuros |
| `brand-primary-900` | `#7f1d1d` | Fondos oscuros con tinte rojo |

### Neutral (Stone — Gris cálido)

Fondos, textos, bordes, superficies. Reemplaza la escala slate fría por tonos cálidos que complementan el rojo.

| Token | Hex | Uso |
|---|---|---|
| `brand-neutral-50` | `#fafaf9` | Fondo de página |
| `brand-neutral-100` | `#f5f5f4` | Fondos alternos, scrollbar track |
| `brand-neutral-200` | `#e7e5e4` | Bordes, skeletons, dividers |
| `brand-neutral-300` | `#d6d3d0` | Bordes secundarios, scrollbar thumb |
| `brand-neutral-400` | `#a8a29e` | Texto muted, placeholders |
| `brand-neutral-500` | `#78716c` | Texto secundario |
| `brand-neutral-600` | `#57534e` | Texto terciario |
| `brand-neutral-700` | `#44403c` | Labels, subtítulos |
| `brand-neutral-800` | `#292524` | Fondos dark, header, cards oscuras |
| `brand-neutral-900` | `#1c1917` | Texto principal, fondos más oscuros |

### Accent (Dorado cálido)

Uso moderado: highlights, badges premium, detalles decorativos.

| Token | Hex |
|---|---|
| `brand-accent-50` | `#fffbeb` |
| `brand-accent-100` | `#fef3c7` |
| `brand-accent-200` | `#fde68a` |
| `brand-accent-300` | `#fcd34d` |
| `brand-accent-400` | `#fbbf24` |
| `brand-accent-500` | `#f59e0b` |
| `brand-accent-600` | `#d97706` |
| `brand-accent-700` | `#b45309` |
| `brand-accent-800` | `#92400e` |
| `brand-accent-900` | `#78350f` |

### Colores Semánticos (fuera del brand)

Estos usan las clases nativas de Tailwind, **no** el namespace `brand-`:

| Rol | Clase Tailwind | Cuándo |
|---|---|---|
| Error | `red-50/200/800` | Validación de formularios, mensajes de error |
| Éxito | `green-*` | Confirmaciones, estados completados |
| Advertencia | `yellow-*` / `amber-*` | Alertas, estados pendientes |
| Info | `blue-*` | Mensajes informativos |

> **Nota**: El rojo de error (`red-800`) y el rojo de marca (`brand-primary-600`) coexisten. Se diferencian por contexto (icono de error + mensaje vs. botón de acción).

---

## 2. Tipografía

**Familia**: `Inter` (variable, Google Fonts) — definida en `tailwind.config.js` como `fontFamily.sans`.

| Rol | Peso | Tamaño | Clase ejemplo |
|---|---|---|---|
| Heading principal | 700 (bold) | `text-2xl` / `text-3xl` | `text-2xl font-bold` |
| Heading secundario | 600 (semibold) | `text-xl` | `text-xl font-semibold` |
| Subtítulo / label | 600 (semibold) | `text-sm` | `text-sm font-semibold` |
| Cuerpo | 400 (normal) | `text-sm` / `text-base` | `text-sm` |
| Caption / muted | 400 | `text-xs` | `text-xs text-brand-neutral-400` |
| Badge / chip | 700 (bold) | `text-[10px]` | `text-[10px] font-bold` |
| Datos tabulares | 400 | `text-sm` | `text-sm tabular-nums` |

---

## 3. Componentes

### Botones

```
Primario:   bg-brand-primary-600 hover:bg-brand-primary-700 text-white
            rounded-xl px-6 py-3 font-semibold shadow-lg
            hover:shadow-xl hover:-translate-y-0.5 transition-all

Secundario: bg-brand-neutral-100 hover:bg-brand-neutral-200
            text-brand-neutral-700 border border-brand-neutral-200
            rounded-xl px-4 py-2 font-medium

Ghost:      text-brand-neutral-500 hover:text-brand-primary-600
            hover:bg-brand-primary-50 rounded-lg px-3 py-1.5

Disabled:   opacity-50 cursor-not-allowed (cualquier variante)
```

### Inputs

```
Base:       bg-white border border-brand-neutral-200
            rounded-xl px-4 py-3 text-sm text-brand-neutral-900
            placeholder:text-brand-neutral-400
            focus:ring-2 focus:ring-brand-primary-500/20
            focus:border-brand-primary-400

Error:      border-red-300 focus:ring-red-500/20
            + mensaje en text-red-600 text-xs
```

### Cards

```
Default:    bg-white/70 backdrop-blur-xl border border-white/20
            shadow-xl rounded-2xl p-6

Elevated:   bg-white/80 backdrop-blur-xl border border-white/20
            shadow-2xl rounded-2xl p-6
            hover:-translate-y-1 hover:shadow-2xl

Flat:       bg-white border border-brand-neutral-200
            shadow-sm rounded-2xl p-6
```

### Badges

```
Primario:   bg-brand-primary-100 text-brand-primary-700
            px-2.5 py-0.5 rounded-full text-xs font-semibold

Neutral:    bg-brand-neutral-100 text-brand-neutral-600
            px-2.5 py-0.5 rounded-full text-xs font-medium

Accent:     bg-brand-accent-100 text-brand-accent-700
            px-2.5 py-0.5 rounded-full text-xs font-semibold
```

---

## 4. Patrones de Diseño

### Glassmorphism

Se usa en cards, modales y dropdowns sobre fondos oscuros:

```css
background: rgba(255, 255, 255, 0.7);   /* light surface */
backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.2);
```

Para superficies oscuras (header, dropdowns):

```css
background: rgba(28, 25, 23, 0.97);     /* brand-neutral-900 @ 97% */
backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### Orbs Decorativos

Esferas de gradiente radial animadas, usadas en headers y fondos de auth:

```html
<!-- Orb rojo (primario) -->
<div style="background: radial-gradient(circle, #dc2626, transparent 70%)"
     class="absolute w-48 h-48 rounded-full opacity-20 blur-3xl animate-float" />

<!-- Orb dorado (accent) -->
<div style="background: radial-gradient(circle, #f59e0b, transparent 70%)"
     class="absolute w-36 h-36 rounded-full opacity-15 blur-2xl" />
```

### Grid Pattern (fondo sutil)

```css
background-image:
  linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px);
background-size: 40px 40px;
opacity: 0.03;
```

### Gradient Line (separador de header)

```html
<div class="h-[2px] bg-gradient-to-r from-transparent via-brand-primary-500 to-transparent opacity-60" />
```

---

## 5. Layout

| Zona | Spec |
|---|---|
| Max-width contenido | `max-w-7xl` (1280px) |
| Padding horizontal | `px-8` |
| Padding vertical página | `py-12` |
| Fondo de página | `bg-brand-neutral-50` |
| Header | Gradiente `brand-neutral-900 → 800 → 900`, sticky, glassmorphism |
| Border-radius estándar | `rounded-2xl` (cards), `rounded-xl` (botones, inputs) |
| Transiciones | `transition-all duration-200` (hover), `duration-300` (cards) |

---

## 6. Reglas

### Hacer

- Usar **siempre** tokens `brand-primary`, `brand-neutral`, `brand-accent` para colores de marca
- Respetar la escala tipográfica definida
- Aplicar glassmorphism en superficies elevadas
- Usar `rounded-2xl` para cards y `rounded-xl` para controles
- Mantener transiciones suaves en interacciones
- Usar `tabular-nums` en datos numéricos alineados

### No hacer

- Usar `teal-*`, `slate-*` ni los hex antiguos (`#0d9488`, `#14b8a6`, `#0f172a`)
- Mezclar bordes redondeados (`rounded-lg` con `rounded-2xl` en el mismo nivel)
- Usar colores semánticos (`red-*`, `green-*`) para acciones de UI — esos son solo para estados
- Aplicar `backdrop-blur` sin un fondo semitransparente (no tiene efecto visual)
- Inventar nuevos shades fuera de la escala 50–900 definida
- Usar clases de Tailwind default (`bg-red-600`) en lugar de `brand-primary-600` para acciones

---

## 7. Referencia Rápida — Archivo Fuente

Todos los tokens están definidos en `tailwind.config.js` bajo `theme.extend.colors.brand`. Ese archivo es la **fuente de verdad**; este documento es la guía de uso.

```
tailwind.config.js     → definición de tokens
src/index.css          → utilidades CSS custom (glass, animations)
src/components/ui/     → componentes reutilizables (Button, Card, Input)
```
