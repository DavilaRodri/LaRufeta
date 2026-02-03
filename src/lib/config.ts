// Business configuration - Single source of truth
// Update these values with real business information

export const businessConfig = {
  name: "La Rufeta",
  legalName: "La Rufeta", // Update with legal business name
  tagline: "El nuevo lugar de encuentro del barrio",
  
  // Contact
  phone: "+34 676 93 93 54",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "34676939354",
  email: process.env.RESTAURANT_BOOKINGS_EMAIL || "reservas@larufeta.es",
  
  // Address
  address: {
    street: "Av. del Camino de Santiago, 21",
    postalCode: "28050",
    city: "Madrid",
    region: "Comunidad de Madrid",
    country: "ES",
    neighborhood: "Las Tablas",
    full: "Av. del Camino de Santiago, 21, 28050 Madrid",
  },
  
  // Coordinates (approximate - verify with Google Maps)
  coordinates: {
    latitude: 40.5003,
    longitude: -3.6508,
  },
  
  // Opening hours - PLACEHOLDER: Update with real hours
  // Format: ISO 8601 day abbreviations
  openingHours: {
    isPlaceholder: true, // Set to false when confirmed
    hours: [
      // { days: "Mo-Fr", open: "08:00", close: "23:00" },
      // { days: "Sa-Su", open: "09:00", close: "24:00" },
    ] as Array<{ days: string; open: string; close: string }>,
  },
  
  // Features (verified)
  features: {
    terrace: true,
    dailyMenu: true,
    breakfast: true,
    tapas: true,
    loyaltyCard: true,
  },
  
  // Loyalty program (verified)
  loyaltyProgram: {
    enabled: true,
    stampsRequired: 10,
    appliesTo: ["menú del día", "desayuno"],
    reward: "Siguiente gratis",
  },
  
  // Social media - PLACEHOLDER: Update with real links
  social: {
    isPlaceholder: true,
    instagram: "", // e.g., "https://instagram.com/larufeta"
    facebook: "", // e.g., "https://facebook.com/larufeta"
    google: "", // Google Business Profile URL
  },
  
  // Categories for structured data
  categories: [
    "Bar",
    "Restaurant",
    "Spanish Restaurant",
    "Tapas Restaurant",
  ],
  
  // Price range (1-4, $ to $$$$)
  priceRange: "$$",
  
  // Cuisine types
  cuisineType: ["Spanish", "Mediterranean", "Tapas"],
  
  // Accepts
  accepts: {
    reservations: true,
    walkIns: true,
    // creditCards: true, // Uncomment when verified
    // cash: true, // Uncomment when verified
  },
  
  // Services offered
  services: {
    dineIn: true,
    // takeout: true, // Uncomment when verified
    // delivery: false, // Uncomment when verified
  },
};

export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://larufeta.es",
  locale: "es-ES",
  alternateLocales: ["en"],
  email: process.env.RESTAURANT_BOOKINGS_EMAIL || "reservas@larufeta.es",
  
  // Analytics
  analytics: {
    plausibleDomain: process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN || "",
  },
  
  // reCAPTCHA
  recaptcha: {
    enabled: !!(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && process.env.RECAPTCHA_SECRET_KEY),
    siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "",
  },
  
  // Legal pages
  legal: {
    lastUpdated: "2024-01-15", // Update when legal documents are updated
  },
};

// Content checklist for admin panel
export const contentChecklist = [
  {
    id: "hours",
    category: "Información básica",
    title: "Horario de apertura",
    description: "Horario de lunes a domingo",
    status: "pending" as const,
    location: "src/lib/config.ts → openingHours",
  },
  {
    id: "menu-breakfast",
    category: "Carta",
    title: "Desayunos",
    description: "Lista de desayunos con precios",
    status: "pending" as const,
    location: "src/data/menu.ts → breakfast",
  },
  {
    id: "menu-daily",
    category: "Carta",
    title: "Menú del día",
    description: "Descripción y precio del menú",
    status: "pending" as const,
    location: "src/data/menu.ts → dailyMenu",
  },
  {
    id: "menu-tapas",
    category: "Carta",
    title: "Tapas y raciones",
    description: "Lista de tapas con precios",
    status: "pending" as const,
    location: "src/data/menu.ts → tapas",
  },
  {
    id: "menu-drinks",
    category: "Carta",
    title: "Bebidas",
    description: "Lista de bebidas con precios",
    status: "pending" as const,
    location: "src/data/menu.ts → drinks",
  },
  {
    id: "menu-pdf",
    category: "Carta",
    title: "PDF de la carta",
    description: "Archivo PDF descargable",
    status: "pending" as const,
    location: "public/menu.pdf",
  },
  {
    id: "photos-hero",
    category: "Imágenes",
    title: "Foto de portada",
    description: "Imagen principal del hero (1920x1080 recomendado)",
    status: "pending" as const,
    location: "public/images/hero.jpg",
  },
  {
    id: "photos-gallery",
    category: "Imágenes",
    title: "Galería de fotos",
    description: "6-12 fotos del local, terraza y platos",
    status: "pending" as const,
    location: "public/images/gallery/",
  },
  {
    id: "logo",
    category: "Imágenes",
    title: "Logotipo",
    description: "Logo en formato SVG o PNG transparente",
    status: "pending" as const,
    location: "public/images/logo.svg",
  },
  {
    id: "social-instagram",
    category: "Redes sociales",
    title: "Instagram",
    description: "Enlace al perfil de Instagram",
    status: "pending" as const,
    location: "src/lib/config.ts → social.instagram",
  },
  {
    id: "social-facebook",
    category: "Redes sociales",
    title: "Facebook",
    description: "Enlace a la página de Facebook",
    status: "pending" as const,
    location: "src/lib/config.ts → social.facebook",
  },
  {
    id: "legal-cif",
    category: "Legal",
    title: "CIF/NIF del negocio",
    description: "Identificación fiscal para aviso legal",
    status: "pending" as const,
    location: "Políticas legales",
  },
  {
    id: "email-production",
    category: "Configuración",
    title: "Email de reservas",
    description: "Email donde recibir las solicitudes",
    status: "pending" as const,
    location: ".env.local → RESTAURANT_BOOKINGS_EMAIL",
  },
  {
    id: "resend-api",
    category: "Configuración",
    title: "API Key de Resend",
    description: "Para envío de emails en producción",
    status: "pending" as const,
    location: ".env.local → RESEND_API_KEY",
  },
];
