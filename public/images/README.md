# Imágenes del sitio web

Este directorio contiene las imágenes utilizadas en el sitio web de La Rufeta.

## Estructura recomendada

```
images/
├── logo.png           # Logo principal (PNG con transparencia, ~400x400px)
├── logo-white.png     # Logo blanco para fondos oscuros
├── hero.jpg           # Imagen principal (1920x1080px mínimo)
├── gallery/           # Fotos para la galería
│   ├── local-1.jpg    # Interior del local
│   ├── local-2.jpg    # Terraza
│   ├── plato-1.jpg    # Platos destacados
│   └── ...
├── menu/              # Fotos de platos para el menú
│   └── ...
└── og-image.jpg       # Imagen para compartir en redes (1200x630px)
```

## Especificaciones

### Logo
- Formato: PNG con transparencia
- Tamaño recomendado: 400x400px
- Versión clara y oscura si es posible

### Imagen Hero
- Formato: JPG/WebP
- Tamaño mínimo: 1920x1080px
- Optimizada para web (< 500KB si es posible)

### Galería
- Formato: JPG/WebP
- Tamaño recomendado: 1200x800px
- 8-12 fotos variadas (local, terraza, platos, ambiente)

### Open Graph
- Tamaño exacto: 1200x630px
- Incluir logo y/o nombre del negocio
- Imagen atractiva del local o plato estrella

## Optimización

Las imágenes deben estar optimizadas para web:
- Usar formato WebP cuando sea posible
- Comprimir con herramientas como TinyPNG o Squoosh
- Proporcionar versiones 1x y 2x para retina si es posible

## Notas

Las imágenes placeholder actuales en el código usan servicios como Unsplash o colores sólidos. Reemplazar con fotos reales antes del lanzamiento.
