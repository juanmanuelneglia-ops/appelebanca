import Image from "next/image";
import Link from "next/link";

const contacts = [
  { title: "Chat en línea", href: "/login", icon: "/images/ico-chat.png" },
  { title: "2210-0000", href: "tel:22100000", icon: "/images/ico-phone.png" },
  { title: "Escríbenos", href: "/#contacto", icon: "/images/ico-mail.png" },
  {
    title: "Whatsapp",
    href: "https://api.whatsapp.com/send?phone=50322100000",
    icon: "/images/ico-whatsapp.png",
  },
  {
    title: "Puntos de servicio",
    href: "/#puntos",
    icon: "/images/ico-puntos.png",
  },
];

export function ContactSection() {
  return (
    <section id="contacto" className="bg-white py-10">
      <div className="ba-container text-center">
        <h2 className="text-[28px] font-light text-black">Contáctanos</h2>
        <div
          id="puntos"
          className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-4"
        >
          {contacts.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="inline-flex items-center gap-2 px-4 py-3 text-[16px] font-semibold text-black underline"
            >
              <Image src={item.icon} alt="" width={38} height={38} />
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
