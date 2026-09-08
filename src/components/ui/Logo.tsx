import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center">
      <Image
        src={compact ? "/images/logo-responsive.svg" : "/images/logo.png"}
        alt="logo banco agrícola"
        width={compact ? 140 : 170}
        height={compact ? 36 : 42}
        className="h-9 w-auto object-contain md:h-10"
        priority
      />
    </Link>
  );
}
