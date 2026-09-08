import Link from "next/link";
import type { ReactNode } from "react";

const variants = {
  primary:
    "bg-ba-yellow text-ba-black hover:bg-ba-yellow-deep shadow-[0_8px_24px_rgba(255,210,0,0.28)]",
  dark: "bg-ba-black text-white hover:bg-ba-ink",
  outline:
    "border border-white/70 text-white hover:bg-white hover:text-ba-black",
  ghost: "border border-ba-line text-ba-ink hover:border-ba-black",
} as const;

type Props = {
  href?: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
}: Props) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
