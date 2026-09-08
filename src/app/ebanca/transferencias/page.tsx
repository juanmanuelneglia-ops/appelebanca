import { TransferForm } from "@/components/ebanca/TransferForm";

export default function EbancaTransferenciasPage() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ba-muted">
          Operaciones
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-ba-ink">
          Transferencias
        </h1>
        <p className="mt-1 text-sm text-ba-muted">
          Envía dinero a otra cuenta. Esta demo no mueve fondos reales.
        </p>
      </div>
      <TransferForm />
    </div>
  );
}
