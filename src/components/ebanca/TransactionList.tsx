import type { Transaction } from "@/lib/data";
import { formatDate, formatMoney } from "@/lib/format";

export function TransactionList({
  items,
  emptyLabel = "No hay movimientos.",
}: {
  items: Transaction[];
  emptyLabel?: string;
}) {
  if (items.length === 0) {
    return (
      <p className="border border-dashed border-ba-line px-4 py-10 text-center text-sm text-ba-muted">
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul className="divide-y divide-ba-line border border-ba-line bg-white">
      {items.map((tx) => (
        <li
          key={tx.id}
          className="flex items-center justify-between gap-4 px-4 py-3.5"
        >
          <div>
            <p className="text-sm font-medium text-ba-ink">{tx.description}</p>
            <p className="mt-0.5 text-xs text-ba-muted">
              {formatDate(tx.date)} · {tx.category}
            </p>
          </div>
          <p
            className={`shrink-0 text-sm font-semibold ${
              tx.amount >= 0 ? "text-emerald-700" : "text-ba-ink"
            }`}
          >
            {tx.amount >= 0 ? "+" : ""}
            {formatMoney(tx.amount)}
          </p>
        </li>
      ))}
    </ul>
  );
}
