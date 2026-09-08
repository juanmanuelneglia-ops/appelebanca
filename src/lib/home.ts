export const HOME_SOLUTIONS = [
  {
    tag: "Cuentas",
    title: "La Cuenta que se adapta a ti",
    description:
      "Encuentra tu opción ideal y administra tu dinero de forma fácil y segura.",
    href: "/cuentas",
    image: "/images/solucion-cuentas.jpg",
    tone: "peach",
    cta: "Conoce más",
  },
  {
    tag: "Tarjetas Mastercard",
    title: "¡Los ganadores están aquí!",
    description: "¡Sus compras los llevan a Bariloche, Argentina!",
    href: "/tarjetas",
    image: "/images/solucion-tarjetas.jpg",
    tone: "white",
    cta: "Conoce más",
  },
  {
    tag: "Educación Financiera",
    title: "La Casa de la Plata",
    description:
      "Recorre cada habitación y encontrarás situaciones cotidianas aplicadas al manejo de tu dinero.",
    href: "/inversiones",
    image: "/images/solucion-educacion.jpg",
    tone: "mint",
    cta: "Conoce más",
  },
  {
    tag: "Canales digitales",
    title: "Biblioteca Digital",
    description:
      "Encontrarás información, contenidos, tutoriales, videos y materiales de mucho interés con funcionalidades de nuestras soluciones digitales.",
    href: "/promociones",
    image: "/images/solucion-digital.jpg",
    tone: "sky",
    cta: "Ver tutoriales",
  },
] as const;

export const HOME_PRODUCTS = [
  {
    title: "Cuentas de ahorro",
    description:
      "Ahorra y administra tu dinero de manera fácil y segura a través de tu Cuenta de Ahorro.",
    href: "/cuentas",
  },
  {
    title: "Tarjetas de crédito",
    description:
      "Conoce un mundo de nuevas oportunidades y experiencias, al disfrutar de múltiples beneficios exclusivos al comprar con tus Tarjetas de Crédito.",
    href: "/tarjetas",
  },
  {
    title: "Créditos",
    description:
      "Encuentra el producto que mejor responda a tus necesidades y haz realidad tus proyectos de vida.",
    href: "/creditos",
  },
  {
    title: "Seguros",
    description:
      "Asegura tu futuro con soluciones integrales que te brindan tranquilidad y el respaldo que nos caracteriza.",
    href: "/seguros",
  },
  {
    title: "Cobro de Remesas",
    description:
      "Recibe tu remesa familiar de la forma más rápida y segura, con más de mil puntos de servicio a tu alcance.",
    href: "/promociones",
  },
  {
    title: "Salvadoreños en el exterior",
    description:
      "Fortalece tus lazos de cercanía llevando a cabo tus proyectos personales y familiares.",
    href: "/promociones",
  },
  {
    title: "Factura electrónica",
    description:
      "Integración en línea con el Ministerio de Hacienda para el control y almacenamiento de los Documentos Tributarios Electrónicos (DTE).",
    href: "/cuentas",
  },
  {
    title: "Compras con Código QR",
    description:
      "Paga de forma fácil y segura a través de código QR desde tu Banca Móvil.",
    href: "/login",
  },
  {
    title: "Compra y venta de Divisas",
    description:
      "Cotice los tipos de cambio completando el formulario de contacto o a través de uno de nuestros especialistas.",
    href: "/#tipo-cambio",
  },
  {
    title: "Promociones Bancoagrícola",
    description:
      "Aprovecha las mejores promociones con tus Tarjetas de Crédito, Débito y Puntos Bancoagrícola.",
    href: "/promociones",
  },
] as const;

export const EXCHANGE_RATES = [
  { code: "CAD", name: "Dólares Canadienses", buy: 0.6864, sell: 0.7484 },
  { code: "CHF", name: "Francos Suizos", buy: 1.1998, sell: 1.2698 },
  { code: "EUR", name: "Euro", buy: 1.1141, sell: 1.1846 },
  { code: "GBP", name: "Libras Esterlinas", buy: 1.3121, sell: 1.3931 },
  { code: "JPY", name: "Yenes Japoneses", buy: 0.0059, sell: 0.0066 },
  { code: "MXN", name: "Pesos Mexicanos", buy: 0.056, sell: 0.0608 },
  { code: "GTQ", name: "Quetzales", buy: 0.1259, sell: 0.1408 },
  { code: "CNY", name: "Yuan", buy: 0.1332, sell: 0.1632 },
] as const;
