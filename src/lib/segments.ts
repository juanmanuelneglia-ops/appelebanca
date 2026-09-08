export type SegmentBenefit = {
  title: string;
  description: string;
};

export type SegmentCard = {
  title: string;
  description: string;
  href: string;
  cta?: string;
};

export type SegmentPageData = {
  slug: "preferencial" | "pyme" | "empresas";
  label: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  heroTone: string;
  benefitsTitle: string;
  benefits: SegmentBenefit[];
  cardsTitle: string;
  cards: SegmentCard[];
  ctaTitle: string;
  ctaBody: string;
  ctaHref: string;
  ctaLabel: string;
};

export const SEGMENTS: Record<string, SegmentPageData> = {
  preferencial: {
    slug: "preferencial",
    label: "Preferencial",
    eyebrow: "Bienvenido a Banca Preferencial",
    headline: "aquí comienza tu experiencia exclusiva",
    subheadline:
      "Haz crecer tu patrimonio con un portafolio pensado para ti, vive experiencias únicas y disfruta de una atención cercana y personalizada.",
    heroTone: "linear-gradient(135deg, #1a1b1a 0%, #3a2a55 55%, #6b4fa0 100%)",
    benefitsTitle: "Conoce todos los beneficios con los que cuentas",
    benefits: [
      {
        title: "Acompañamos tus proyectos",
        description:
          "Eres nuestra prioridad: cuentas con un ejecutivo para asesorarte en tus necesidades y metas.",
      },
      {
        title: "Experiencias Preferenciales",
        description:
          "Ventas cerradas, charlas, eventos sociales exclusivos y asesorías pensadas para ti.",
      },
      {
        title: "Acompañamos tus inversiones",
        description:
          "Conoce soluciones de inversión para fortalecer tu capital según tu perfil.",
      },
      {
        title: "Tu estilo de vida",
        description:
          "Gastronomía, viajes, compras o momentos en familia: acumula más puntos con nuestros beneficios.",
      },
      {
        title: "Todo lo que buscas está aquí",
        description:
          "Inversiones, estudios, pagos, seguros, vivienda o créditos con atención ágil.",
      },
      {
        title: "¡Más exclusivos!",
        description:
          "Forma parte del club con ofertas únicas, descuentos especiales y más puntos.",
      },
    ],
    cardsTitle: "¿Aún no la tienes? ¡Solicítala hoy!",
    cards: [
      {
        title: "Mastercard Black",
        description:
          "Beneficios exclusivos en viajes y compras. Acumula hasta 3 puntos Bancoagrícola.",
        href: "/tarjetas",
        cta: "Descubre más",
      },
      {
        title: "Visa Infinite",
        description:
          "Estilo de vida, gastronomía y más. Acumula hasta 3 puntos Bancoagrícola.",
        href: "/tarjetas",
        cta: "Descubre más",
      },
      {
        title: "Visa Infinite Lifemiles",
        description:
          "Para viajeros frecuentes: lifemiles, bonos anuales y acceso a salas VIP.",
        href: "/tarjetas",
        cta: "Descubre más",
      },
    ],
    ctaTitle: "Somos tu aliado en todo momento",
    ctaBody:
      "Preferencial, Preferencial Plus, Preferencial Premium y Banca Privada: cuatro formas de relacionarnos, pensadas especialmente para ti. Línea exclusiva: 2527-6101.",
    ctaHref: "/login",
    ctaLabel: "Ir a E-Banca",
  },
  pyme: {
    slug: "pyme",
    label: "Pyme",
    eyebrow: "Banca PYME Bancoagrícola",
    headline: "Acompañamos tu crecimiento",
    subheadline:
      "Explora soluciones de financiamiento, pagos, inversión y protección diseñadas para impulsar tu Pyme.",
    heroTone: "linear-gradient(135deg, #0f2a33 0%, #1a5a66 50%, #57cbe6 100%)",
    benefitsTitle: "Soluciones destacadas para tu negocio",
    benefits: [
      {
        title: "Crédito Mujer Futuro",
        description:
          "Apoyamos empresas lideradas por mujeres con tasas preferenciales y asesoría personalizada.",
      },
      {
        title: "Negocios con propósito",
        description:
          "Líneas de crédito para eficiencia energética, energía renovable y sostenibilidad.",
      },
      {
        title: "Wompi",
        description:
          "Crea enlaces de pago y códigos QR. Vende más fácil por el canal que prefieras.",
      },
      {
        title: "Depósito a Plazo Empresarial Digital",
        description:
          "Contrata plazos desde un mes en e-banca Empresarial o App Bancoagrícola Empresas.",
      },
      {
        title: "Línea de crédito rotativa",
        description:
          "Liquidez inmediata para inventario, nómina o proveedores.",
      },
      {
        title: "POS y pago con QR",
        description:
          "Recibe pagos con tarjetas o Transferencias QR de forma rápida y segura.",
      },
    ],
    cardsTitle: "Explora las soluciones para tu Pyme",
    cards: [
      {
        title: "Financiamiento",
        description:
          "Crédito decreciente, líneas fijas/rotativas, sobregiro y créditos productivos.",
        href: "/creditos",
        cta: "Conoce más",
      },
      {
        title: "Medios de pago",
        description: "Wompi, POS y pago con QR para cobrar presencial u online.",
        href: "/cuentas",
        cta: "Conoce más",
      },
      {
        title: "Inversión y protección",
        description:
          "Depósitos a plazo, fondos de inversión, asistencia Pyme y plan empresarial.",
        href: "/inversiones",
        cta: "Conoce más",
      },
    ],
    ctaTitle: "Bienvenido a la nueva e-banca Empresarial",
    ctaBody:
      "Realiza consultas, transferencias y pagos desde donde te encuentres, de forma fácil, rápida y segura. WhatsApp exclusivo para clientes Pyme.",
    ctaHref: "/login",
    ctaLabel: "Abrir E-Banca",
  },
  empresas: {
    slug: "empresas",
    label: "Empresas y Gobierno",
    eyebrow: "Empresas y Gobierno",
    headline: "Conectamos a empresas con posibilidades",
    subheadline:
      "Impulsamos el crecimiento de tu empresa con asesoría especializada y un portafolio integral acorde a tus necesidades.",
    heroTone: "linear-gradient(135deg, #111111 0%, #1f3a2e 50%, #09c58d 100%)",
    benefitsTitle: "Descubre nuestras soluciones",
    benefits: [
      {
        title: "Financiamiento",
        description:
          "Apoyamos las metas de su empresa con alternativas competitivas de crédito.",
      },
      {
        title: "Transfer365 CA-RD",
        description:
          "Transferencias entre bancos de Centroamérica y República Dominicana.",
      },
      {
        title: "Negocios Especializados",
        description:
          "Soluciones competitivas para la administración de su negocio.",
      },
      {
        title: "Factura Electrónica",
        description:
          "Integración en línea con el Ministerio de Hacienda para DTE.",
      },
      {
        title: "Crédito Desarrollo Sostenible",
        description:
          "Portafolio de créditos para proyectos sostenibles y un mejor futuro.",
      },
      {
        title: "Depósito a Plazo Digital Empresarial",
        description:
          "Contrátalo desde e-banca Empresarial o App Bancoagrícola Empresas.",
      },
    ],
    cardsTitle: "Te hacemos la vida más fácil",
    cards: [
      {
        title: "App Bancoagrícola Empresas",
        description:
          "Controla transacciones de tu empresa desde el móvil, donde estés.",
        href: "/login",
        cta: "Conoce más",
      },
      {
        title: "Servicios Internacionales",
        description:
          "Pagos a proveedores, filiales y operaciones en el extranjero en múltiples monedas.",
        href: "/promociones",
        cta: "Conoce más",
      },
      {
        title: "Wompi",
        description:
          "Pasarela de pagos online autogestionable para vender por web o redes.",
        href: "/cuentas",
        cta: "Ingresa aquí",
      },
    ],
    ctaTitle: "Negocios con Propósito",
    ctaBody:
      "Ponemos a su disposición financiamiento destinado al desarrollo de proyectos sostenibles. Cotice divisas o hable con un especialista.",
    ctaHref: "/#contacto",
    ctaLabel: "Contáctanos",
  },
};

export function getSegment(slug: string) {
  return SEGMENTS[slug] ?? null;
}
