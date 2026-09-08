export type PymeHeroSlide = {
  id: number;
  badge: string;
  badgeBg: string;
  badgeIcon?: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  image: string;
  panelBg: string;
};

export type PymeProduct = {
  title: string;
  description: string;
  href: string;
  icon: string;
  iconBg: string;
};

export type PymeCategory = {
  id: string;
  label: string;
  icon: string;
  products: PymeProduct[];
};

export type PymeCourse = {
  id: string;
  title: string;
  description: string;
  href: string;
};

export const PYME_NAV = [
  { label: "Plataformas de Pago", href: "/pyme#pagos" },
  { label: "Wompi", href: "/pyme#pagos" },
  { label: "Financiamiento", href: "/pyme#soluciones" },
  { label: "Seguros Pyme", href: "/pyme#soluciones" },
  { label: "Canales Digitales Empresariales", href: "/pyme#ebanca" },
];

export const PYME_HERO: PymeHeroSlide[] = [
  {
    id: 1,
    badge: "Medios de pago",
    badgeBg: "#ff7f41",
    badgeIcon: "/images/pyme/ico-pagomovil.png",
    title: "Con Wompi vende más y más fácil",
    body: "Puedes crear y personalizar enlaces de pago fácilmente, a través de links cortos o Códigos QR. Compártelos con tus clientes por el medio que prefieras.",
    href: "/cuentas",
    cta: "Ver más",
    image: "/images/pyme/hero-wompi.jpg",
    panelBg: "#f8d9ca",
  },
  {
    id: 2,
    badge: "Negocios con propósito",
    badgeBg: "#00c389",
    badgeIcon: "/images/pyme/ico-sostenible.png",
    title: "¿Quieres tener acceso a líneas de crédito especializadas?",
    body: "Te ofrecemos alternativas de crédito para que tu empresa realice proyectos de eficiencia energética, energía renovable y medidas de sostenibilidad",
    href: "/creditos",
    cta: "Ver más",
    image: "/images/pyme/hero-sostenible.jpg",
    panelBg: "#a7efda",
  },
  {
    id: 3,
    badge: "Crédito Mujer Futuro",
    badgeBg: "#f4b5cd",
    badgeIcon: "/images/pyme/ico-pago.png",
    title: "Apoyamos a las empresas lideradas por MUJERES",
    body: "Creemos en tu historia y en cada paso que das para crecer. Estamos aquí para acompañarte.",
    href: "/creditos",
    cta: "Ver más",
    image: "/images/pyme/hero-mujer.jpg",
    panelBg: "#fadde8",
  },
  {
    id: 4,
    badge: "Inversión",
    badgeBg: "#00cae7",
    badgeIcon: "/images/pyme/ico-ahorro.png",
    title: "Activa tu Depósito a Plazo Empresarial Digital",
    body: "Puedes contratar plazos desde un mes. Solicítalo en e-banca Empresarial o App Bancoagrícola Empresas.",
    href: "/inversiones",
    cta: "Ver más",
    image: "/images/pyme/hero-deposito.jpg",
    panelBg: "#bbeefb",
  },
];

export const PYME_CATEGORIES: PymeCategory[] = [
  {
    id: "financiacion",
    label: "Financiación",
    icon: "/images/pyme/ico-financiacion.png",
    products: [
      {
        title: "Crédito decreciente",
        description:
          "Financia activos para tu negocio: locales, maquinaria o remodelaciones.",
        href: "/creditos",
        icon: "/images/pyme/ico-bill.png",
        iconBg: "#ff7f41",
      },
      {
        title: "Línea de crédito rotativa",
        description:
          "Obtén liquidez inmediata para cubrir gastos urgentes como inventario, nómina o proveedores.",
        href: "/creditos",
        icon: "/images/pyme/ico-bank.png",
        iconBg: "#00c389",
      },
      {
        title: "Línea de crédito fija",
        description:
          "Financia inversiones clave como maquinaria, equipos o proyectos de expansión.",
        href: "/creditos",
        icon: "/images/pyme/ico-card.png",
        iconBg: "#9063CD",
      },
      {
        title: "Sobregiro autorizado",
        description:
          "Accede a fondos al instante para cubrir gastos urgentes o imprevistos.",
        href: "/creditos",
        icon: "/images/pyme/ico-cash.png",
        iconBg: "#00cae7",
      },
      {
        title: "Crédito mujer futuro",
        description:
          "Financiamiento con tasas preferenciales y asesoría personalizada para mujeres líderes",
        href: "/creditos",
        icon: "/images/pyme/ico-pago.png",
        iconBg: "#f4b5cd",
      },
      {
        title: "Tarjetas Pyme",
        description:
          "Diseñadas para cubrir las necesidades operativas y estratégicas de tu empresa",
        href: "/tarjetas",
        icon: "/images/pyme/ico-proteccion.png",
        iconBg: "#fdda24",
      },
    ],
  },
  {
    id: "ahorro",
    label: "Ahorro e inversión",
    icon: "/images/pyme/ico-ahorro.png",
    products: [
      {
        title: "Productos bursátiles",
        description:
          "Accede a mercados de capitales como acciones y bonos. Obtén liquidez cuando lo necesites",
        href: "/inversiones",
        icon: "/images/pyme/ico-tienda.png",
        iconBg: "#ff7f41",
      },
      {
        title: "Depósito a Plazo Digital Empresarial",
        description:
          "Obtén una tasa de interés más atractiva para tus ahorros al contratarlo 100% digital",
        href: "/inversiones",
        icon: "/images/pyme/ico-ahorro.png",
        iconBg: "#00c389",
      },
      {
        title: "Fondos de Inversión",
        description: "Rentabilidad y liquidez con disponibilidad inmediata",
        href: "/inversiones",
        icon: "/images/pyme/ico-financiacion.png",
        iconBg: "#9063CD",
      },
    ],
  },
  {
    id: "pagos",
    label: "Plataformas de pago",
    icon: "/images/pyme/ico-pago.png",
    products: [
      {
        title: "Wompi",
        description:
          "Impulsa tus ventas a través de diferentes formas de recibir tus pagos",
        href: "/cuentas",
        icon: "/images/pyme/ico-pagomovil.png",
        iconBg: "#ff7f41",
      },
      {
        title: "Pago con QR",
        description:
          "Sin uso de efectivo o tarjetas por medio de Transferencias QR",
        href: "/cuentas",
        icon: "/images/pyme/ico-qr.png",
        iconBg: "#00c389",
      },
      {
        title: "POS",
        description:
          "¡Adquiere tu POS ya! Y entrégale a tu cliente seguridad y rapidez en su forma de pago.",
        href: "/cuentas",
        icon: "/images/pyme/ico-card.png",
        iconBg: "#00cae7",
      },
    ],
  },
  {
    id: "proteccion",
    label: "Protección a tu negocio",
    icon: "/images/pyme/ico-proteccion.png",
    products: [
      {
        title: "Asistencia PYME / Plan Empresarial",
        description:
          "Gestiona y mitiga los riesgos asociados a la operación de tu empresa y tus colaboradores.",
        href: "/seguros",
        icon: "/images/pyme/ico-security.png",
        iconBg: "#ff7f41",
      },
      {
        title: "Cotización de moneda en línea",
        description:
          "Cotiza cambio de moneda en tiempo real desde e-Banca Empresarial.",
        href: "/login",
        icon: "/images/pyme/ico-cash.png",
        iconBg: "#00c389",
      },
      {
        title: "Seguro Plan Empresarial",
        description:
          "Protege tu empresa de las pérdidas o daños materiales que sufran tus bienes.",
        href: "/seguros",
        icon: "/images/pyme/ico-proteccion.png",
        iconBg: "#9063CD",
      },
    ],
  },
];

export const PYME_COURSES: PymeCourse[] = [
  {
    id: "micromentor",
    title: "MicroMentor",
    description:
      "Es la comunidad global más grande de emprendedores, con asesoramiento de mentores expertos",
    href: "https://www.micromentor.org/",
  },
  {
    id: "odisea",
    title: "La Odisea del Emprendedor",
    description:
      "Es una plataforma educativa que comparte y destaca videos de académicos de forma mundial, emprendedores exitosos, expertos de Mastercard y líderes de opinión",
    href: "/promociones",
  },
  {
    id: "conectadas",
    title: "Todas conectadas",
    description:
      "Plataforma dirigida a mujeres con múltiples herramientas para desarrollar habilidades digitales y nuevas oportunidades económicas y laborales",
    href: "/promociones",
  },
];
