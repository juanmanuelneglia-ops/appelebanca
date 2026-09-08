export const PREFERENCIAL_NAV = [
  { label: "Cuentas", href: "/cuentas" },
  { label: "Tarjetas", href: "/tarjetas" },
  { label: "Créditos", href: "/creditos" },
  { label: "Salvadoreños en el Exterior", href: "/promociones" },
  { label: "Promociones Exclusivas", href: "/promociones" },
];

export type PrefBenefit = {
  title: string;
  description: string;
  icon: string;
};

export const PREF_BENEFITS: PrefBenefit[] = [
  {
    title: "Acompañamos tus proyectos",
    description:
      "Eres nuestra prioridad, cuentas con un ejecutivo para asesorarte en tus necesidades para la realización de tus proyectos y metas.",
    icon: "/images/preferencial/ico-proyectos.png",
  },
  {
    title: "Experiencias Preferenciales",
    description:
      "Ventas cerradas, charlas de temas de interés, eventos sociales exclusivos, asesorías; entre otros.",
    icon: "/images/preferencial/ico-experiencias.png",
  },
  {
    title: "Acompañamos tus inversiones",
    description:
      "Conoce las soluciones de inversión disponibles para ti, fortalece tu capital y alcanza las metas de inversión de acuerdo a tu perfil.",
    icon: "/images/preferencial/ico-inversiones.png",
  },
  {
    title: "Tu estilo de vida",
    description:
      "Ya sea que disfrutes de la mejor gastronomía, los viajes, las compras o momentos en familia, acumularás mas puntos con nuestros beneficios.",
    icon: "/images/preferencial/ico-estilo.png",
  },
  {
    title: "Todo lo que buscas está aquí",
    description:
      "Inversiones, estudios, pagos, seguros, vivienda o créditos. Facilitamos los procesos con atención ágil.",
    icon: "/images/preferencial/ico-todo.png",
  },
  {
    title: "¡Más exclusivos!",
    description:
      "Forma parte del club que te brinda ofertas únicas, descuentos especiales y más puntos por tus compras.",
    icon: "/images/preferencial/ico-exclusivos.png",
  },
];

export type PrefCard = {
  title: string;
  description: string;
  image: string;
  href: string;
};

export const PREF_CARDS: PrefCard[] = [
  {
    title: "Mastercard Black",
    description:
      "Obtén beneficios exclusivos en viajes, compras locales e internacionales, acumula hasta 3 puntos Bancoagricola y más.",
    image: "/images/preferencial/card-black.png",
    href: "/tarjetas",
  },
  {
    title: "Visa Infinite",
    description:
      "Disfruta tu estilo de vida con beneficios exclusivos en gastronomía y otros, acumula hasta 3 puntos Bancoagricola y más.",
    image: "/images/preferencial/card-infinite.png",
    href: "/tarjetas",
  },
  {
    title: "Visa Infinite lifemiles",
    description:
      "Con beneficios exclusivos para viajeros frecuentes. Acumula lifemiles y gana bonos anuales por tus compras, acceso a salas VIP aeropuertos.",
    image: "/images/preferencial/card-lifemiles.png",
    href: "/tarjetas",
  },
];

export type PrefLifestyle = {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
};

export const PREF_LIFESTYLE: PrefLifestyle[] = [
  {
    id: "club",
    label: "Club Más Exclusivos",
    title: "Club Más Exclusivos",
    description:
      "¡Descubre un mundo de exclusividad con nuestro Programa de Beneficios para Tarjetahabientes Black e Infinite! Prepárate para disfrutar de promociones, beneficios, experiencias únicas y más.",
    image: "/images/preferencial/club.jpg",
  },
  {
    id: "experiencias",
    label: "Experiencias",
    title: "VISA 50 BEST: Una Experiencia Gastronómica Única",
    description:
      "Nuestros clientes preferenciales vivieron una experiencia gastronómica de 50 Best, utilizando sus tarjetas Visa Platinum e Infinite.",
    image: "/images/preferencial/experiencia.jpg",
  },
  {
    id: "gastronomia",
    label: "Gastronomía",
    title: "Cena en Restaurante El XOLO",
    description:
      "Una velada exclusiva con menú degustación que fusionó lo mejor de la cocina salvadoreña y contemporánea.",
    image: "/images/preferencial/exp-3.jpg",
  },
  {
    id: "viajes",
    label: "Viajes",
    title: "Vive una experiencia en tus viajes",
    description:
      "Disfruta de tus viajes con acceso a salas VIP, servicio de concierge, asistencias y seguros para alquiler de vehículos.",
    image: "/images/preferencial/exp-1.jpg",
  },
  {
    id: "puntos",
    label: "Puntos",
    title: "Acumulación de puntos",
    description:
      "Acumula más puntos Bancoagrícola con tus tarjetas Black e Infinite y canjéalos por experiencias, viajes y beneficios exclusivos.",
    image: "/images/preferencial/exp-2.jpg",
  },
];

export type PrefNivel = {
  id: string;
  label: string;
  image: string;
  description: string;
};

export const PREF_NIVELES: PrefNivel[] = [
  {
    id: "preferencial",
    label: "Preferencial",
    image: "/images/preferencial/nivel-pref.jpg",
    description:
      "Atención personalizada y beneficios pensados para acompañarte en cada etapa de tu patrimonio.",
  },
  {
    id: "plus",
    label: "Preferencial Plus",
    image: "/images/preferencial/nivel-plus.jpg",
    description:
      "Mayor exclusividad, acceso a experiencias y acompañamiento cercano de tu ejecutivo.",
  },
  {
    id: "premium",
    label: "Preferencial Premium",
    image: "/images/preferencial/nivel-premium.jpg",
    description:
      "Servicio premium con prioridad en atención y un portafolio ampliado de beneficios.",
  },
  {
    id: "privada",
    label: "Banca Privada",
    image: "/images/preferencial/nivel-privada.jpg",
    description:
      "Asesoría patrimonial especializada y una relación bancaria diseñada a tu medida.",
  },
];

export type PrefSolutionCat = {
  id: string;
  label: string;
  products: { title: string; href: string }[];
};

export const PREF_SOLUTIONS: PrefSolutionCat[] = [
  {
    id: "ahorros",
    label: "Ahorros",
    products: [
      { title: "Cuenta corriente Preferencial Élite", href: "/cuentas" },
      { title: "Tarjeta de Débito Preferencial", href: "/tarjetas" },
      { title: "App Banca Móvil", href: "/login" },
      { title: "Billetera Digital", href: "/cuentas" },
      { title: "Cuenta de Ahorro Preferencial", href: "/cuentas" },
      { title: "Paga con QR", href: "/cuentas" },
      { title: "Soluciones de Pago", href: "/cuentas" },
    ],
  },
  {
    id: "inversion",
    label: "Inversión",
    products: [
      { title: "Depósito a Plazo", href: "/inversiones" },
      { title: "Fondos de Inversión", href: "/inversiones" },
      { title: "Mercado de Capitales", href: "/inversiones" },
    ],
  },
  {
    id: "tarjetas",
    label: "Tarjetas de Crédito",
    products: [
      { title: "Mastercard Black", href: "/tarjetas" },
      { title: "Visa Infinite", href: "/tarjetas" },
      { title: "Visa Infinite lifemiles", href: "/tarjetas" },
    ],
  },
  {
    id: "financiacion",
    label: "Financiación",
    products: [
      { title: "Crédito personal con cargo a cuenta", href: "/creditos" },
      { title: "Crédito personal con orden de descuento", href: "/creditos" },
      { title: "Crédito personal con garantía hipotecaria", href: "/creditos" },
      { title: "Sobregiro elite", href: "/creditos" },
      { title: "Extrafinanciamiento", href: "/creditos" },
      { title: "Adelanto de Salario", href: "/creditos" },
      { title: "Crédito de estudio", href: "/creditos" },
    ],
  },
  {
    id: "vivienda",
    label: "Vivienda",
    products: [
      { title: "Crédito hipotecario", href: "/creditos" },
      { title: "Mi Casa", href: "/creditos" },
    ],
  },
  {
    id: "servicios",
    label: "Servicios no financieros",
    products: [
      { title: "Asesoría patrimonial", href: "/#contacto" },
      { title: "Concierge", href: "/#contacto" },
    ],
  },
];

export const PREF_CENTROS = [
  "Agencia La Mascota",
  "Agencia Millennium Plaza",
  "Agencia Santa Elena",
  "Agencia Merliot",
  "Agencia Masferrer",
  "Agencia Clínicas Médicas",
];
