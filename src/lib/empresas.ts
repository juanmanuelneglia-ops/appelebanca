export const EMPRESAS_NAV = [
  { label: "Financiación", href: "/empresas#soluciones" },
  { label: "Cuentas", href: "/cuentas" },
  { label: "Cash Management", href: "/empresas#soluciones" },
  { label: "Inversiones", href: "/inversiones" },
  { label: "Canales Digitales Empresariales", href: "/empresas#canales" },
];

export type EmpresasSolution = {
  title: string;
  description: string;
  href: string;
  icon: string;
};

export const EMPRESAS_SOLUTIONS: EmpresasSolution[] = [
  {
    title: "Financiamiento",
    description:
      "Apoyamos las metas de su empresa con las mejores alternativas de financiamiento.",
    href: "/creditos",
    icon: "/images/empresas/ico-financiamiento.png",
  },
  {
    title: "Transfer365 CA-RD del Banco Central de Reserva",
    description:
      "Realiza transferencias entre bancos de Centroamérica y República Dominicana, a través de e-banca Personas y e-banca Empresarial.",
    href: "/promociones",
    icon: "/images/empresas/ico-transfer.png",
  },
  {
    title: "Negocios Especializados",
    description:
      "Le ofrecemos soluciones competitivas para llevar a cabo la administración de su negocio.",
    href: "/empresas#soluciones",
    icon: "/images/empresas/ico-negocios.png",
  },
  {
    title: "Factura Electrónica",
    description:
      "Integración en línea con el Ministerio de Hacienda para el control y almacenamiento de los Documentos Tributarios Electrónicos (DTE)",
    href: "/empresas#soluciones",
    icon: "/images/empresas/ico-factura.png",
  },
  {
    title: "Crédito Desarrollo Sostenible",
    description:
      "Construyamos un mejor futuro. Conoce el Portafolio de Créditos para el Desarrollo Sostenible.",
    href: "/creditos",
    icon: "/images/empresas/ico-sostenible.png",
  },
  {
    title: "Documentos Contratos de Crédito Depositados",
    description:
      "Consulte documentación acerca de Contrato mutuo Mercantil, Aperturas de líneas de Crédito Rotativas y no Rotativas y Anexos",
    href: "/creditos",
    icon: "/images/empresas/ico-docs.png",
  },
  {
    title: "Contracargos",
    description:
      "Un espacio donde encontrarás guías del proceso de contracargos de Bancoagrícola para facilitar la resolución a tus consultas.",
    href: "/tarjetas",
    icon: "/images/empresas/ico-transfer.png",
  },
  {
    title: "Depósito a Plazo Digital Empresarial",
    description:
      "Contrátalo desde e-banca Empresarial o App Bancoagrícola Empresas en el plazo que mejor se adapte a tus necesidades",
    href: "/inversiones",
    icon: "/images/empresas/ico-deposito.png",
  },
];
