import { AccountCard } from "@/components/ebanca/AccountCard";
import { ACCOUNTS } from "@/lib/data";

export default function EbancaCuentasPage() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ba-muted">
          Productos
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-ba-ink">
          Mis cuentas
        </h1>
        <p className="mt-1 text-sm text-ba-muted">
          Consulta saldos y detalle de tus productos activos.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {ACCOUNTS.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}
