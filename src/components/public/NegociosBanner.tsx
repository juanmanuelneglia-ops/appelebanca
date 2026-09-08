import Image from "next/image";
import Link from "next/link";

export function NegociosBanner() {
  return (
    <section id="pyme" className="bg-white pt-3">
      <div className="ba-container py-4">
        <div className="grid items-center gap-4 md:grid-cols-12">
          <div className="md:col-span-5">
            <Image
              src="/images/negocios.png"
              alt="Independiente y Negocios"
              width={560}
              height={420}
              className="h-auto w-full"
            />
          </div>
          <div className="bg-[#6b4fa0] px-4 py-6 text-white md:col-span-7 md:px-6">
            <p className="mb-2 text-[24px] font-light">Independiente y Negocios</p>
            <h2 className="m-0 text-[28px] font-bold leading-tight">
              Transformamos tus sueños en realidades
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-white/95">
              Reconocemos que eres parte del motor de la economía del país. Por
              eso, estamos comprometidos a trabajar junto a ti, ofreciéndote
              soluciones que te benefician a ti y a tu negocio de forma segura y
              confiable.
            </p>
            <Link
              href="/creditos"
              className="btn-ba-primary mt-5 inline-flex w-[211px] gap-2 normal-case"
            >
              Descubre más
              <Image
                src="/images/arrow-right.png"
                alt=""
                width={20}
                height={20}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
