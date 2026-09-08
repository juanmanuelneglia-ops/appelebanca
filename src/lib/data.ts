export type Account = {
  id: string;
  name: string;
  type: "ahorro" | "corriente" | "tarjeta";
  number: string;
  balance: number;
  currency: "USD";
};

export type Transaction = {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
  category: string;
};

export const DEMO_USER = {
  username: "cliente",
  password: "demo123",
  name: "Camila Rivas",
  document: "0****567-8",
};

export const ACCOUNTS: Account[] = [
  {
    id: "acc-ahorro",
    name: "Cuenta de Ahorro",
    type: "ahorro",
    number: "0012 3456 7890",
    balance: 2840.55,
    currency: "USD",
  },
  {
    id: "acc-corriente",
    name: "Cuenta Corriente",
    type: "corriente",
    number: "0098 7654 3210",
    balance: 1250.0,
    currency: "USD",
  },
  {
    id: "acc-tarjeta",
    name: "Tarjeta Clásica",
    type: "tarjeta",
    number: "5412 75** **** 4412",
    balance: -320.4,
    currency: "USD",
  },
];

export const TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    accountId: "acc-ahorro",
    date: "2026-08-10",
    description: "Transferencia recibida — M. López",
    amount: 150,
    category: "Transferencia",
  },
  {
    id: "tx-2",
    accountId: "acc-ahorro",
    date: "2026-08-09",
    description: "Supermercado La Despensa",
    amount: -48.75,
    category: "Compras",
  },
  {
    id: "tx-3",
    accountId: "acc-corriente",
    date: "2026-08-08",
    description: "Pago de planilla",
    amount: 980,
    category: "Ingreso",
  },
  {
    id: "tx-4",
    accountId: "acc-tarjeta",
    date: "2026-08-07",
    description: "Gasolinera Puma",
    amount: -35.2,
    category: "Transporte",
  },
  {
    id: "tx-5",
    accountId: "acc-ahorro",
    date: "2026-08-06",
    description: "Pago servicio eléctrico",
    amount: -62.1,
    category: "Servicios",
  },
  {
    id: "tx-6",
    accountId: "acc-corriente",
    date: "2026-08-05",
    description: "Retiro ATM Centro",
    amount: -100,
    category: "Retiro",
  },
  {
    id: "tx-7",
    accountId: "acc-tarjeta",
    date: "2026-08-04",
    description: "Restaurante El Fogón",
    amount: -28.9,
    category: "Comidas",
  },
  {
    id: "tx-8",
    accountId: "acc-ahorro",
    date: "2026-08-02",
    description: "Intereses del mes",
    amount: 3.45,
    category: "Intereses",
  },
];

export const PRODUCTS = [
  {
    slug: "cuentas",
    title: "Cuentas",
    headline: "Tu dinero, organizado a tu ritmo",
    description:
      "Ahorro, corriente y paquetes digitales para manejar el día a día sin fricción.",
    points: ["Sin comisiones en canales digitales", "Alertas en tiempo real", "Apertura 100% en línea"],
  },
  {
    slug: "tarjetas",
    title: "Tarjetas",
    headline: "Paga, viaja y acumula beneficios",
    description:
      "Crédito y débito con promociones en comercios, viajes y cashback seleccionado.",
    points: ["Control desde la app", "Bloqueo instantáneo", "Promociones exclusivas"],
  },
  {
    slug: "creditos",
    title: "Créditos",
    headline: "Financia lo que importa",
    description:
      "Personal, hipotecario y vehicular con tasas competitivas y simulación clara.",
    points: ["Simulador transparente", "Aprobación ágil", "Cuotas adaptables"],
  },
  {
    slug: "inversiones",
    title: "Inversiones",
    headline: "Haz crecer tu capital",
    description:
      "Depósitos a plazo y opciones de inversión según tu perfil de riesgo.",
    points: ["Rendimientos competitivos", "Asesoría guiada", "Montos desde $100"],
  },
  {
    slug: "seguros",
    title: "Seguros",
    headline: "Protege lo que construyes",
    description:
      "Vida, auto, hogar y más, con coberturas pensadas para El Salvador.",
    points: ["Cotización rápida", "Asistencia 24/7", "Planes familiares"],
  },
  {
    slug: "promociones",
    title: "Promociones",
    headline: "Beneficios que se sienten",
    description:
      "Descuentos, sorteos y experiencias exclusivas para clientes Bancoagrícola.",
    points: ["Actualizadas cada mes", "Canje fácil", "Aliados nacionales"],
  },
] as const;

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}
