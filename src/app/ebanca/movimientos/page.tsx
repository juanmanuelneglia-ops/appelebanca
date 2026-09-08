import { TransactionList } from "@/components/ebanca/TransactionList";
import { ACCOUNTS, TRANSACTIONS } from "@/lib/data";

export default function EbancaMovimientosPage() {
  const grouped = ACCOUNTS.map((account) => ({
    account,
    items: TRANSACTIONS.filter((tx) => tx.accountId === account.id),
  }));

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ba-muted">
          Historial
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-ba-ink">
          Movimientos
        </h1>
      </div>

      {grouped.map(({ account, items }) => (
        <section key={account.id} className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-ba-ink">
            {account.name}
          </h2>
          <TransactionList
            items={items}
            emptyLabel="Sin movimientos en esta cuenta."
          />
        </section>
      ))}
    </div>
  );
}
