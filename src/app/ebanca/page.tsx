import Link from "next/link";
import { AccountCard } from "@/components/ebanca/AccountCard";
import { TransactionList } from "@/components/ebanca/TransactionList";
import { ACCOUNTS, DEMO_USER, TRANSACTIONS } from "@/lib/data";
import { formatMoney } from "@/lib/format";

export default function EbancaDashboardPage() {
  const totalAvailable = ACCOUNTS.filter((a) => a.type !== "tarjeta").reduce(
    (sum, a) => sum + a.balance,
    0,
  );
  const recent = TRANSACTIONS.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ba-muted">
            Resumen
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ba-ink">
            Hola, {DEMO_USER.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-ba-muted">
            Saldo disponible total:{" "}
            <span className="font-semibold text-ba-ink">
              {formatMoney(totalAvailable)}
            </span>
          </p>
        </div>
        <Link
          href="/ebanca/transferencias"
          className="rounded-full bg-ba-yellow px-5 py-2.5 text-sm font-semibold text-ba-black transition hover:bg-ba-yellow-deep"
        >
          Nueva transferencia
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {ACCOUNTS.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-ba-ink">
            Últimos movimientos
          </h2>
          <Link
            href="/ebanca/movimientos"
            className="text-sm font-medium text-ba-muted hover:text-ba-ink"
          >
            Ver todos
          </Link>
        </div>
        <TransactionList items={recent} />
      </section>
    </div>
  );
}
