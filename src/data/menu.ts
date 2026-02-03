// Menu data - PLACEHOLDER
// Replace with real menu items from the restaurant

export interface MenuItem {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  price?: number;
  isPlaceholder?: boolean;
  allergens?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
}

export interface MenuSection {
  id: string;
  titleKey: string;
  descriptionKey: string;
  items: MenuItem[];
}

// PLACEHOLDER DATA - Replace with real menu items
export const menuData: MenuSection[] = [
  {
    id: "breakfast",
    titleKey: "menu.sections.breakfast.title",
    descriptionKey: "menu.sections.breakfast.description",
    items: [
      {
        id: "breakfast-1",
        name: "Desayuno Completo",
        nameEn: "Full Breakfast",
        description: "Café, zumo de naranja, tostada con tomate y aceite",
        descriptionEn: "Coffee, orange juice, toast with tomato and olive oil",
        isPlaceholder: true,
      },
      {
        id: "breakfast-2",
        name: "Tostada con Jamón",
        nameEn: "Toast with Ham",
        description: "Tostada de pan artesano con jamón serrano",
        descriptionEn: "Artisan bread toast with serrano ham",
        isPlaceholder: true,
      },
      {
        id: "breakfast-3",
        name: "Café con Bollería",
        nameEn: "Coffee with Pastry",
        description: "Café y croissant o napolitana",
        descriptionEn: "Coffee and croissant or chocolate pastry",
        isPlaceholder: true,
      },
    ],
  },
  {
    id: "dailyMenu",
    titleKey: "menu.sections.dailyMenu.title",
    descriptionKey: "menu.sections.dailyMenu.description",
    items: [
      {
        id: "daily-1",
        name: "Menú del Día",
        nameEn: "Daily Menu",
        description: "Primer plato + segundo plato + postre o café + bebida",
        descriptionEn: "First course + main course + dessert or coffee + drink",
        isPlaceholder: true,
      },
    ],
  },
  {
    id: "tapas",
    titleKey: "menu.sections.tapas.title",
    descriptionKey: "menu.sections.tapas.description",
    items: [
      {
        id: "tapas-1",
        name: "Patatas Bravas",
        nameEn: "Spicy Potatoes",
        description: "Patatas fritas con salsa brava casera",
        descriptionEn: "Fried potatoes with homemade spicy sauce",
        isPlaceholder: true,
      },
      {
        id: "tapas-2",
        name: "Croquetas Caseras",
        nameEn: "Homemade Croquettes",
        description: "Croquetas de jamón ibérico (6 uds.)",
        descriptionEn: "Iberian ham croquettes (6 pcs.)",
        isPlaceholder: true,
      },
      {
        id: "tapas-3",
        name: "Tortilla Española",
        nameEn: "Spanish Omelette",
        description: "Tortilla de patatas tradicional",
        descriptionEn: "Traditional potato omelette",
        isPlaceholder: true,
      },
      {
        id: "tapas-4",
        name: "Jamón Ibérico",
        nameEn: "Iberian Ham",
        description: "Ración de jamón ibérico de bellota",
        descriptionEn: "Portion of acorn-fed Iberian ham",
        isPlaceholder: true,
      },
      {
        id: "tapas-5",
        name: "Tabla de Quesos",
        nameEn: "Cheese Board",
        description: "Selección de quesos con membrillo",
        descriptionEn: "Cheese selection with quince paste",
        isPlaceholder: true,
      },
    ],
  },
  {
    id: "drinks",
    titleKey: "menu.sections.drinks.title",
    descriptionKey: "menu.sections.drinks.description",
    items: [
      {
        id: "drinks-1",
        name: "Caña",
        nameEn: "Draft Beer",
        description: "Cerveza de barril",
        descriptionEn: "Draft beer",
        isPlaceholder: true,
      },
      {
        id: "drinks-2",
        name: "Vino de la Casa",
        nameEn: "House Wine",
        description: "Tinto, blanco o rosado",
        descriptionEn: "Red, white or rosé",
        isPlaceholder: true,
      },
      {
        id: "drinks-3",
        name: "Vermut",
        nameEn: "Vermouth",
        description: "Vermut de grifo con aceituna",
        descriptionEn: "Draft vermouth with olive",
        isPlaceholder: true,
      },
      {
        id: "drinks-4",
        name: "Refrescos",
        nameEn: "Soft Drinks",
        description: "Coca-Cola, Fanta, Aquarius...",
        descriptionEn: "Coca-Cola, Fanta, Aquarius...",
        isPlaceholder: true,
      },
    ],
  },
];

// Gallery images - PLACEHOLDER
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  altEn?: string;
  category: "interior" | "terrace" | "food" | "drinks" | "team";
  isPlaceholder?: boolean;
}

export const galleryImages: GalleryImage[] = [
  {
    id: "gallery-1",
    src: "/images/gallery/placeholder-1.jpg",
    alt: "Interior del restaurante",
    altEn: "Restaurant interior",
    category: "interior",
    isPlaceholder: true,
  },
  {
    id: "gallery-2",
    src: "/images/gallery/placeholder-2.jpg",
    alt: "Nuestra terraza",
    altEn: "Our terrace",
    category: "terrace",
    isPlaceholder: true,
  },
  {
    id: "gallery-3",
    src: "/images/gallery/placeholder-3.jpg",
    alt: "Tapas variadas",
    altEn: "Assorted tapas",
    category: "food",
    isPlaceholder: true,
  },
  {
    id: "gallery-4",
    src: "/images/gallery/placeholder-4.jpg",
    alt: "Vermut de grifo",
    altEn: "Draft vermouth",
    category: "drinks",
    isPlaceholder: true,
  },
  {
    id: "gallery-5",
    src: "/images/gallery/placeholder-5.jpg",
    alt: "Menú del día",
    altEn: "Daily menu",
    category: "food",
    isPlaceholder: true,
  },
  {
    id: "gallery-6",
    src: "/images/gallery/placeholder-6.jpg",
    alt: "Ambiente del local",
    altEn: "Restaurant atmosphere",
    category: "interior",
    isPlaceholder: true,
  },
];

// Events/Promotions
export interface Event {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  date?: string;
  isOngoing?: boolean;
  image?: string;
  isPlaceholder?: boolean;
}

export const eventsData: Event[] = [
  {
    id: "loyalty-card",
    title: "Tarjeta Bono",
    titleEn: "Loyalty Card",
    description: "Sella cada menú del día o desayuno. Al completar 10 sellos, el siguiente es completamente gratis.",
    descriptionEn: "Stamp each daily menu or breakfast. After 10 stamps, the next one is completely free.",
    isOngoing: true,
    isPlaceholder: false, // This is verified
  },
];
