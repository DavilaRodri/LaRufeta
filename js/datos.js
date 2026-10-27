/*
  La Rufeta: datos editables de la web.
  Todo lo que cambia (horario, carta, promociones) vive aquí.
  El MENÚ DEL DÍA no se toca aquí: llega solo desde TuMenú cuando el bar
  lo manda por WhatsApp.
*/
window.RUFETA = {
  telefono: '+34676939354',
  telefonoVisible: '676 93 93 54',
  whatsapp: '34676939354',
  direccion: 'Av. del Camino de Santiago, 21',
  zona: '28050 Madrid · Las Tablas',
  mapa: 'https://www.google.com/maps/search/?api=1&query=La+Rufeta+Av.+del+Camino+de+Santiago+21+Madrid',
  resenas: 'https://www.google.com/maps/search/?api=1&query=La+Rufeta+Las+Tablas+Madrid',

  // TuMenú: slug del bar en tumenu.bar
  tumenu: { api: 'https://tumenu.bar/api/menu/', slug: 'la-rufeta' },

  // Horario por día de la semana (0 = domingo). null = cerrado.
  // "cierra" puede pasar de medianoche (ej. '01:00').
  horario: {
    1: { abre: '09:00', cierra: '01:00' },
    2: { abre: '09:00', cierra: '01:00' },
    3: { abre: '09:00', cierra: '01:00' },
    4: { abre: '09:00', cierra: '01:00' },
    5: { abre: '09:00', cierra: '01:00' },
    6: { abre: '09:00', cierra: '01:00' },
    0: { abre: '09:00', cierra: '01:00' }
  },
  // Franja del menú del día
  menuFranja: { dias: [1, 2, 3, 4, 5], desde: '13:00', hasta: '16:00' },

  // Promociones y carteles. Se muestran solas entre "desde" y "hasta" (ambos incluidos).
  // imagen: el cartel (cuadrado o vertical) en img/promos/. Sin cartel, se usa la foto indicada.
  promos: [
    {
      titulo: 'Halloween',
      fecha: 'Sábado 31 de octubre',
      texto: 'Celebra Halloween con nosotros. Reserva tu mesa en el comedor o en la terraza.',
      desde: '2026-10-20', hasta: '2026-10-31',
      imagen: '', foto: 'img/exterior-fachada.jpg',
      accion: 'Reservar mesa'
    },
    {
      titulo: 'Cenas de Navidad',
      fecha: 'Del 1 al 23 de diciembre',
      texto: 'La cena de empresa o de amigos, en La Rufeta. Pregúntanos por el menú de Navidad y te guardamos la mesa.',
      desde: '2026-10-20', hasta: '2026-12-23',
      imagen: '', foto: 'img/plato-carne-patatas.jpg',
      accion: 'Pedir el menú de Navidad'
    }
  ],

  // Carta. Cada plato: [nombre, precio]. El precio puede ser número (euros) o texto.
  carta: [
    {
      grupo: 'Para picar',
      foto: 'img/plato-croquetas.jpg',
      platos: [
        ['Croquetas artesanas de jamón', 12],
        ['Alitas de pollo', 14],
        ['Tiras de pollo empanadas', 14],
        ['Oreja a la plancha', 14],
        ['Mollejas de cordero', 15],
        ['Tacos de solomillo de cerdo ibérico', 12],
        ['Conejo al ajillo', 18],
        ['Patas de pulpo gallego a la parrilla', 25]
      ]
    },
    {
      grupo: 'Huevos rotos y hamburguesas',
      foto: 'img/plato-huevos-rotos-gambas.jpg',
      platos: [
        ['Huevos rotos con jamón ibérico de bellota D.O. Guijuelo', 12],
        ['Huevos rotos La Rufeta, con pimientos de padrón y tacos de solomillo al ajillo', 12],
        ['Huevos rotos con gambas', 12],
        ['Hamburguesa clásica con queso y bacon (200 g)', 12],
        ['Hamburguesa La Rufeta con gorgonzola y tomate seco (200 g)', 16]
      ]
    },
    {
      grupo: 'Carnes',
      foto: 'img/plato-carne-patatas.jpg',
      nota: 'Las carnes de Ávila, para compartir.',
      platos: [
        ['Presa ibérica D.O. Guijuelo', 20],
        ['Entrecot trinchado de Ávila (400 g)', 20],
        ['Cachopo asturiano (1,4 kg)', 39],
        ['Chuletón de ternera de Ávila (1 kg aprox.)', 49],
        ['Chuletón de vaca madurada de Ávila (1 kg aprox.)', 55]
      ]
    },
    {
      grupo: 'Postres',
      foto: 'img/postre-coulant-chocolate.jpg',
      platos: [
        ['Coulant de chocolate con helado de vainilla', 5],
        ['Helado de turrón con tejas de Tolosa', 4],
        ['Queso Idiazábal con membrillo y nueces', 7]
      ]
    },
    {
      grupo: 'Cervezas y bebidas',
      foto: 'img/interior-barra.jpg',
      nota: 'Mahou de grifo de barril de cobre. Con cada consumición, tapa.',
      platos: [
        ['Doble de Mahou Clásica', 3],
        ['Doble de Mahou Maestra', 3.9],
        ['Doble de Mahou Sin', 3.6],
        ['Tercio Alhambra 1925', 3.6],
        ['Tercio Coronita', 3.7],
        ['Refresco', 3],
        ['Café solo o infusión', 1.6],
        ['Café con leche o cortado', 1.8],
        ['Combinado nacional', 7],
        ['Combinado de importación', 9]
      ]
    }
  ],

  // Fotos del local. escena: entra en la foto fija de arriba. pos: encuadre (object-position).
  fotos: [
    { src: 'img/exterior-fachada.jpg', alt: 'Fachada de La Rufeta en la Av. del Camino de Santiago', escena: true, pos: '30% center' },
    { src: 'img/plato-torreznos.jpg', alt: 'Torreznos con patatas paja', escena: true, plato: true },
    { src: 'img/interior-barra.jpg', alt: 'La barra y el botellero', escena: true, pos: 'center' },
    { src: 'img/plato-croquetas.jpg', alt: 'Croquetas artesanas de jamón', escena: true, plato: true },
    { src: 'img/plato-huevos-rotos-gambas.jpg', alt: 'Huevos rotos con gambas', plato: true },
    { src: 'img/plato-carne-patatas.jpg', alt: 'Carne con patatas y pimientos', plato: true },
    { src: 'img/plato-huevos-rotos-jamon.jpg', alt: 'Huevos rotos con jamón ibérico', plato: true },
    { src: 'img/plato-cachopo-pimientos.jpg', alt: 'Cachopo con pimientos de padrón', plato: true },
    { src: 'img/postre-coulant-chocolate.jpg', alt: 'Coulant de chocolate con helado', plato: true, pie: true }
  ],

  // Opiniones reales de Google (copiadas tal cual)
  google: { nota: '4,2', opiniones: 162 },
  resenasDestacadas: [
    { texto: 'Un lugar muy agradable, con un muy buen servicio y una comida muy buena. Un menú muy correcto. En la terraza se está fenomenal.', autor: 'Joel Bolancell' },
    { texto: 'Buen lugar de tapeo y raciones en Las Tablas. Servicio atento y amable. Carta con raciones bien presentadas y ricas. Terraza exterior con ambiente.', autor: 'carisa bel' },
    { texto: 'Sitio muy limpio, agradable y muy rico todo. Totalmente recomendable.', autor: 'Antonio C' }
  ]
};
