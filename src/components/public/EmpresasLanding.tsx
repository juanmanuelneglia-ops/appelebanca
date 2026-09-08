import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { EMPRESAS_SOLUTIONS } from "@/lib/empresas";

export function EmpresasLanding() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-white">
        {/* Hero — texto izq / foto der */}
        <section className="bg-[#f7f7f7]">
          <div className="ba-container grid items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-14">
            <div>
              <h1 className="max-w-xl text-[32px] font-bold leading-[1.15] text-[#1a1b1a] md:text-[42px]">
                Conectamos a empresas con posibilidades
              </h1>
              <p className="mt-5 max-w-lg text-[16px] font-light leading-relaxed text-[#555] md:text-[17px]">
                Impulsamos el crecimiento de tu empresa con asesoría
                especializada y un portafolio integral de productos acorde a tus
                necesidades.
              </p>
            </div>
            <div className="relative mx-auto aspect-[648/320] w-full max-w-[620px] overflow-hidden">
              <Image
                src="/images/empresas/hero.jpg"
                alt="Bancoagrícola empresas"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 620px"
                priority
              />
            </div>
          </div>
        </section>

        {/* Soluciones */}
        <section id="soluciones" className="bg-white py-12">
          <div className="ba-container px-4">
            <h2 className="text-[26px] font-bold text-[#1a1b1a] md:text-[28px]">
              Descubre nuestras soluciones
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {EMPRESAS_SOLUTIONS.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[8px] border border-[#ececec] bg-white p-5 shadow-[0_1px_6px_rgba(0,0,0,0.05)]"
                >
                  <Image
                    src={item.icon}
                    alt=""
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                  <Link
                    href={item.href}
                    className="mt-4 block text-[16px] font-bold text-[#1a1b1a] underline underline-offset-2 hover:opacity-80"
                  >
                    {item.title}
                  </Link>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#666]">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Te hacemos la vida más fácil */}
        <section id="canales" className="bg-[#f5f5f5] py-12">
          <div className="ba-container px-4">
            <h2 className="text-[26px] font-bold text-[#1a1b1a] md:text-[28px]">
              Te hacemos la vida más fácil
            </h2>
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              <article className="overflow-hidden rounded-[8px] bg-white shadow-[0_1px_6px_rgba(0,0,0,0.05)] md:grid md:grid-cols-2">
                <div className="relative min-h-[220px] w-full">
                  <Image
                    src="/images/empresas/app.jpg"
                    alt="App Bancoagrícola Empresas"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 25vw"
                  />
                </div>
                <div className="flex flex-col justify-center p-6">
                  <h3 className="text-[22px] font-bold text-[#1a1b1a]">
                    App Bancoagrícola Empresas
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-[#555]">
                    Disfrute los beneficios de llevar su empresa con usted. Con
                    nuestra App Empresarial tiene el control de sus
                    transacciones desde su móvil.
                  </p>
                  <Link
                    href="/login"
                    className="mt-5 inline-flex w-fit rounded-full border border-[#1a1b1a] px-6 py-2 text-[13px] font-bold uppercase tracking-wide text-[#1a1b1a] hover:bg-[#1a1b1a] hover:text-white"
                  >
                    Conoce más
                  </Link>
                </div>
              </article>

              <article className="overflow-hidden rounded-[8px] bg-white shadow-[0_1px_6px_rgba(0,0,0,0.05)]">
                <div className="relative h-[200px] w-full">
                  <Image
                    src="/images/empresas/internacional.jpg"
                    alt="Servicios Internacionales"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="bg-[#5bc2e7] p-6">
                  <h3 className="text-[22px] font-bold text-[#1a1b1a]">
                    Servicios Internacionales
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-[#1a1b1a]">
                    Realiza pagos a proveedores internacionales, transfiere
                    fondos a tus filiales o realiza operaciones en el extranjero
                    en múltiples monedas.
                  </p>
                  <Link
                    href="/promociones"
                    className="mt-5 inline-flex rounded-full border border-[#1a1b1a] bg-transparent px-6 py-2 text-[13px] font-bold uppercase tracking-wide text-[#1a1b1a] hover:bg-[#1a1b1a] hover:text-white"
                  >
                    Conoce más
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Divisas */}
        <section className="bg-[#f5f5f5] pb-6">
          <div className="ba-container overflow-hidden px-4">
            <div className="grid overflow-hidden rounded-[8px] md:grid-cols-2">
              <div className="relative min-h-[240px]">
                <Image
                  src="/images/empresas/divisas.jpg"
                  alt="Compra y venta de Divisas"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-col justify-center bg-[#fdda24] px-8 py-10 md:px-12">
                <h2 className="text-[28px] font-bold leading-tight text-[#1a1b1a] md:text-[32px]">
                  Compra y venta de Divisas
                </h2>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#1a1b1a]">
                  Conoce nuestros productos y cotice los tipos de cambio
                  completando el formulario de contacto o a través de uno de
                  nuestros especialistas.
                </p>
                <div className="mt-7">
                  <Link
                    href="/#contacto"
                    className="inline-flex rounded-full border-2 border-[#1a1b1a] px-7 py-2.5 text-[13px] font-bold uppercase tracking-wide text-[#1a1b1a] hover:bg-[#1a1b1a] hover:text-white"
                  >
                    Cotizar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Wompi */}
        <section className="bg-[#f5f5f5] pb-6">
          <div className="ba-container overflow-hidden px-4">
            <div className="grid overflow-hidden rounded-[8px] md:grid-cols-2">
              <div className="relative min-h-[280px]">
                <Image
                  src="/images/empresas/wompi.jpg"
                  alt="Wompi"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-col justify-center bg-[#f1a7c1] px-8 py-10 md:px-12">
                <h2 className="text-[28px] font-bold leading-tight text-[#1a1b1a] md:text-[32px]">
                  Seguro, confiable y fácil de usar
                </h2>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#1a1b1a]">
                  Wompi es una pasarela de pagos en línea 100% autogestionable
                  sin membresía, que permitirá que tus cliente compren online
                  desde tus redes sociales o sitio web de la forma más fácil y
                  segura.
                </p>
                <p className="mt-4 text-[15px] font-bold text-[#1a1b1a]">
                  ¡Empieza a vender por internet con Wompi!
                </p>
                <div className="mt-6">
                  <Link
                    href="/cuentas"
                    className="inline-flex rounded-full border-2 border-[#1a1b1a] px-7 py-2.5 text-[13px] font-bold uppercase tracking-wide text-[#1a1b1a] hover:bg-[#1a1b1a] hover:text-white"
                  >
                    Ingresa aquí
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Negocios con Propósito */}
        <section className="bg-[#f5f5f5] pb-12">
          <div className="ba-container overflow-hidden px-4">
            <div className="grid overflow-hidden rounded-[8px] md:grid-cols-2">
              <div className="relative order-2 min-h-[280px] md:order-1">
                <Image
                  src="/images/empresas/proposito.jpg"
                  alt="Negocios con Propósito"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="order-1 flex flex-col justify-center bg-[#00c389] px-8 py-10 text-[#1a1b1a] md:order-2 md:px-12">
                <h2 className="text-[28px] font-bold leading-tight md:text-[32px]">
                  Negocios con Propósito
                </h2>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed">
                  Ponemos a su disposición una alternativa de financiamiento
                  destinada para el desarrollo de proyectos sostenibles.
                </p>
                <div className="mt-7">
                  <Link
                    href="/creditos"
                    className="inline-flex rounded-full border-2 border-[#1a1b1a] px-7 py-2.5 text-[13px] font-bold uppercase tracking-wide text-[#1a1b1a] hover:bg-[#1a1b1a] hover:text-white"
                  >
                    Conoce más
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section id="contacto" className="bg-white py-12">
          <div className="ba-container px-4">
            <h2 className="text-[28px] font-bold text-[#1a1b1a]">Contáctanos</h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ContactCard title="Chat en línea" href="/login" label="Abrir chat" />
              <ContactCard title="2210-0000" href="tel:22100000" label="Llamar" />
              <ContactCard
                title="Escríbenos"
                href="mailto:atencionempresarial@bancoagricola.com.sv"
                label="Enviar correo"
              />
              <ContactCard
                title="WhatsApp"
                href="https://api.whatsapp.com/send?phone=50322100000"
                label="Escribir"
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <a
        href="/login"
        aria-label="Chat en línea"
        className="fixed bottom-5 right-5 z-50 grid h-[58px] w-[58px] place-items-center rounded-full border-[3px] border-white bg-[#fdda24] shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7 text-[#1a1b1a]"
          fill="currentColor"
        >
          <path d="M12 3a7 7 0 00-7 7v1.5A3.5 3.5 0 008.5 15H9v2.2A5.8 5.8 0 0014.8 23h.2v-2h-.2A3.8 3.8 0 0111 17.2V15h1.5A3.5 3.5 0 0016 11.5V10a7 7 0 00-7-7zm-5 8.5V10a5 5 0 1110 0v1.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 017 11.5z" />
        </svg>
      </a>
    </>
  );
}

function ContactCard({
  title,
  href,
  label,
}: {
  title: string;
  href: string;
  label: string;
}) {
  return (
    <article className="rounded-[10px] border border-[#eee] bg-[#fafafa] p-5">
      <h3 className="text-[18px] font-bold text-[#1a1b1a]">{title}</h3>
      <Link
        href={href}
        className="mt-3 inline-block text-[14px] font-semibold text-[#1a1b1a] underline underline-offset-2"
      >
        {label}
      </Link>
    </article>
  );
}
