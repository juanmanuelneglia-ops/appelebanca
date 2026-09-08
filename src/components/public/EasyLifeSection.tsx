import Image from "next/image";
import Link from "next/link";

export function EasyLifeSection() {
  return (
    <section className="bg-[#f4f4f4] py-10">
      <div className="ba-container">
        <h2 className="mb-6 text-[28px] font-bold text-[#1a1b1a]">Conoce más</h2>
        <div className="grid gap-4 lg:grid-cols-12">
          <article className="overflow-hidden bg-[#57cbe6] shadow lg:col-span-8">
            <div className="grid min-h-[300px] md:grid-cols-2">
              <div className="relative min-h-[185px]">
                <Image
                  src="/images/internacional.jpg"
                  alt="Servicios internacionales"
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              </div>
              <div className="flex flex-col justify-center p-6">
                <h3 className="text-[22px] font-bold text-[#1a1b1a]">
                  Servicios internacionales
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[#1a1b1a]">
                  Si eres persona natural, envía o recibe dinero de familiares en
                  cualquier parte del mundo de forma rápida y segura, en
                  múltiples monedas. También puedes recibir pagos desde PayPal,
                  Airbnb, Deel, Google y más
                </p>
                <Link href="/promociones" className="btn-ba-outline mt-4 w-fit">
                  Conoce más
                </Link>
              </div>
            </div>
          </article>

          <article className="overflow-hidden bg-white shadow lg:col-span-4">
            <div className="relative h-[170px] bg-[#57cbe6]">
              <Image
                src="/images/ebanca.jpg"
                alt="e-banca Personas"
                fill
                className="object-cover"
                sizes="300px"
              />
            </div>
            <div className="p-5">
              <h3 className="pt-1 text-[22px] font-bold text-[#1a1b1a]">
                e-banca Personas
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#1a1b1a]">
                Realiza todas tus transacciones y pagos en línea, desde cualquier
                lugar y en el momento que lo necesites de forma fácil y segura
                desde tu e-banca Personas en línea.
              </p>
              <Link href="/login" className="btn-ba-outline mt-4 w-fit">
                Conoce más
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
