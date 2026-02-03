# La Rufeta - Website

Página web moderna para La Rufeta, bar-restaurante en Las Tablas, Madrid.

## 🛠 Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: TailwindCSS
- **Componentes**: shadcn/ui (personalizado)
- **i18n**: next-intl (ES + EN)
- **Formularios**: React Hook Form + Zod
- **Email**: Resend

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y configura las variables:

```bash
cp .env.example .env.local
```

Variables requeridas:
- `RESEND_API_KEY` - API key de Resend para envío de emails
- `RESTAURANT_BOOKINGS_EMAIL` - Email donde recibir las reservas
- `NEXT_PUBLIC_SITE_URL` - URL del sitio en producción

### 3. Iniciar servidor de desarrollo

```bash
npm run dev
```

El sitio estará disponible en [http://localhost:3000](http://localhost:3000)

### 4. Compilar para producción

```bash
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Rutas y páginas (App Router)
│   ├── page.tsx           # Página principal
│   ├── menu/              # Página de carta
│   ├── reservas/          # Página de reservas
│   ├── galeria/           # Galería de fotos
│   ├── eventos/           # Eventos y promociones
│   ├── contacto/          # Información de contacto
│   ├── legal/             # Páginas legales
│   └── admin/             # Panel de administración
├── components/
│   ├── ui/                # Componentes base (shadcn)
│   ├── layout/            # Header, Footer, etc.
│   └── home/              # Secciones de la home
├── data/
│   └── menu.ts            # Datos del menú
├── i18n/
│   └── messages/          # Traducciones ES/EN
└── lib/
    ├── config.ts          # Configuración del negocio
    └── utils.ts           # Utilidades
```

## ✅ Checklist de Contenidos

Antes del lanzamiento, actualizar:

### Información del Negocio (`src/lib/config.ts`)
- [ ] Horario de apertura
- [ ] CIF/NIF del negocio
- [ ] Nombre legal completo
- [ ] Redes sociales (Instagram, Facebook, Google)

### Menú (`src/data/menu.ts`)
- [ ] Carta de tapas con precios
- [ ] Menú del día con precio
- [ ] Carta de bebidas
- [ ] Desayunos con precios

### Imágenes (`public/images/`)
- [ ] Logo del establecimiento
- [ ] Foto hero principal
- [ ] Fotos del local (8-12 para galería)
- [ ] Fotos de platos destacados

### Legal
- [ ] Revisar política de privacidad con abogado
- [ ] Revisar política de cookies
- [ ] Revisar aviso legal

### Configuración
- [ ] Configurar Resend para emails
- [ ] Añadir dominio en producción
- [ ] Configurar Google Analytics (opcional)

## 🌍 Internacionalización

El sitio soporta español (por defecto) e inglés.

Los textos están en:
- `src/i18n/messages/es.json` - Español
- `src/i18n/messages/en.json` - Inglés

## 📧 Envío de Emails

Se usa [Resend](https://resend.com) para el envío de emails de reserva.

### Modo Desarrollo
Si no hay API key configurada, los emails se registran en la consola del servidor.

### Modo Producción
1. Crear cuenta en Resend
2. Obtener API key
3. Verificar dominio
4. Configurar `RESEND_API_KEY` y `RESTAURANT_BOOKINGS_EMAIL`

## 🔐 Seguridad

### Formulario de Reservas
- Validación con Zod
- Campo honeypot anti-spam
- Rate limiting (10 solicitudes/hora por IP)
- Sanitización de entradas

### Página de Admin
- Protegida con contraseña
- Acceder en `/admin/content-checklist`
- Contraseña por defecto: `larufeta2024`
- Cambiar en `NEXT_PUBLIC_ADMIN_PASSWORD`

## 📱 Responsive

El diseño es mobile-first y se adapta a:
- Móviles (< 640px)
- Tablets (640px - 1024px)
- Desktop (> 1024px)

## 🎨 Personalización

### Colores (Tailwind)
Los colores de marca están en `tailwind.config.ts`:

```javascript
rufeta: {
  red: '#B91C1C',
  orange: '#EA580C',
  cream: '#FEF3C7',
  brown: '#78350F',
  gold: '#D97706',
}
```

### Fuentes
- **Sans**: Inter
- **Display**: Playfair Display

## 📄 Licencia

Propiedad de La Rufeta. Todos los derechos reservados.
