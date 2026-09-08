import Image from "next/image";
import Link from "next/link";

const cards = [
  {
    tag: "Cuentas",
    title: "La Cuenta que se adapta a ti",
    description:
      "Encuentra tu opción ideal y administra tu dinero de forma fácil y segura.",
    href: "/cuentas",
    image: "/images/card-cuentas.jpg",
    bg: "#FFD7C4",
    border: "#f0813c",
    tagBg: "#ffc6ab",
    cta: "Conoce más",
  },
  {
    tag: "Educación Financiera",
    title: "La Casa de la Plata",
    description:
      "Recorre cada habitación y encontrarás situaciones cotidianas aplicadas al manejo de tu dinero.",
    href: "/inversiones",
    image: "/images/card-casa-plata.png",
    bg: "#ffffff",
    border: "#f4f4f4",
    tagBg: "#f4f4f4",
    cta: "Conoce más",
  },
  {
    tag: "Canales digitales",
    title: "Biblioteca Digital",
    description:
      "Encontrarás información, contenidos, tutoriales, videos y materiales de mucho interés con funcionalidades de nuestras soluciones digitales.",
    href: "/promociones",
    image: "/images/card-biblioteca.jpg",
    bg: "#57cbe652",
    border: "#5fc8d7",
    tagBg: "#5acceaa8",
    cta: "Ver tutoriales",
  },
];

export function SolutionsSection() {
  return (
    <section className="bg-white pt-4">
      <div className="ba-container">
        <h2 className="mb-6 text-[28px] font-light text-black">
          Soluciones pensadas para ti
        </h2>
        <div className="flex flex-wrap justify-start gap-y-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex w-full justify-center md:w-1/2 lg:w-1/3"
            >
              <article
                className="mx-2 flex w-full max-w-[340px] flex-col overflow-hidden rounded-[10px] shadow-[0px_3px_12px_rgb(0_0_0_/_10%)]"
                style={{
                  height: 470,
                  background: card.bg,
                  border: `1px solid ${card.border}`,
                }}
              >
                <div className="relative h-[192px] w-full bg-white">
                  <Image
                    src={card.image}
                    alt={card.tag}
                    fill
                    className="rounded-t-[10px] object-cover"
                    sizes="295px"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <span
                    className="inline-flex w-fit items-center px-3 py-0.5 text-[16px] font-bold"
                    style={{ background: card.tagBg }}
                  >
                    {card.tag}
                  </span>
                  <h3 className="mt-3 pr-2 text-[18px] font-bold text-black">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-black">
                    {card.description}
                  </p>
                  <div className="mt-auto pt-4">
                    <Link href={card.href} className="btn-ba-outline">
                      {card.cta}
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
