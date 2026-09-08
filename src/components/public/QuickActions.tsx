import Link from "next/link";

const actions = [
  {
    label: "Banca Móvil",
    href: "/login",
    icon: "/images/ico-banca-movil.png",
  },
  {
    label: "Gestiones en línea",
    href: "/login",
    icon: "/images/ico-gestiones.png",
  },
  {
    label: "Mi Casa Bancoagrícola",
    href: "/creditos",
    icon: "/images/ico-mi-casa.png",
  },
  {
    label: "Educación Financiera",
    href: "/inversiones",
    icon: "/images/ico-educacion.png",
  },
  {
    label: "Mapa de ubicaciones",
    href: "/#puntos",
    icon: "/images/ico-mapa.png",
  },
  {
    label: "Productos digitales",
    href: "/cuentas",
    icon: "/images/ico-productos.png",
  },
];

export function QuickActions() {
  return (
    <section className="bg-[#f4f4f4] py-[30px]">
      <div className="ba-container">
        <h2 className="mb-6 text-center text-[28px] font-bold text-[#1a1b1a] md:text-[30px]">
          ¿Qué quieres hacer hoy?
        </h2>
        <div className="flex flex-wrap justify-center">
          {actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              id={`link_menuhome_${action.label}`}
              className="m-[0_10px_15px] box-border flex h-[130px] w-[130px] flex-col items-center rounded-[5px] bg-white p-[15px] text-center shadow-[0px_0px_5px_#ccc]"
            >
              <span
                className="mb-1 inline-block h-[70px] w-[70px] bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${action.icon})` }}
              />
              <span className="block text-[13px] leading-none text-[#1a1b1a]">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
