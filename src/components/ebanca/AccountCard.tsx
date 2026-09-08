import Link from "next/link";
import type { Account } from "@/lib/data";
import { formatMoney, maskAccount } from "@/lib/format";

export function AccountCard({ account }: { account: Account }) {
  const isCard = account.type === "tarjeta";

  return (
    <article
      className={`relative overflow-hidden p-5 text-white ${
        isCard
          ? "bg-[linear-gradient(135deg,#1a1a1a,#3a3208)]"
          : "bg-ba-black"
      }`}
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-ba-yellow/20 blur-xl" />
      <p className="text-xs uppercase tracking-[0.16em] text-white/60">
        {account.name}
      </p>
      <p className="mt-4 font-display text-3xl font-bold tracking-tight">
        {formatMoney(account.balance)}
      </p>
      <p className="mt-2 text-sm text-white/70">{maskAccount(account.number)}</p>
      <Link
        href="/ebanca/movimientos"
        className="mt-5 inline-block text-sm font-semibold text-ba-yellow hover:underline"
      >
        Ver movimientos
      </Link>
    </article>
  );
}
