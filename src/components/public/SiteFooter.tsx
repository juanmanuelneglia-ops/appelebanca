import Link from "next/link";

const columns = [
  {
    title: "Links directos",
    links: [
      "Sala de prensa",
      "Desarrollo sostenible",
      "Innovación",
      "Educación Financiera",
      "Lo Lindo del Fútbol",
      "Preguntas Frecuentes FAQs",
      "Línea ética",
    ],
  },
  {
    title: "Nuestro Banco",
    links: [
      "Somos Bancoagrícola",
      "Transparencia",
      "Únete a nuestro equipo",
      "Rincón mágico",
      "Aviso de Privacidad y Política de cookies",
      "Formularios de derechos ARCO-POL",
    ],
  },
  {
    title: "Información corporativa",
    links: [
      "Gobierno corporativo Bancoagrícola",
      "Gobierno valores Banagrícola",
      "Gobierno corporativo Gestora",
      "Sociedad ACCELERA",
      "Sociedad Arfinsa",
      "Relación con inversionistas",
    ],
  },
  {
    title: "Tasas de interés",
    links: ["Tarifas de Tasas de Interés"],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#2c2a29] text-white">
      <div className="ba-container grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-4">
        {columns.map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-[18px] font-bold">{col.title}</p>
            <ul className="m-0 list-none space-y-2 p-0">
              {col.links.map((link) => (
                <li key={link}>
                  <Link
                    href="/"
                    className="text-[12px] text-white/90 hover:text-[#fdda24]"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-4 text-center text-[14px] text-white/80">
        Copyright © {new Date().getFullYear()} Grupo Cibest · Demo local
      </div>
    </footer>
  );
}
