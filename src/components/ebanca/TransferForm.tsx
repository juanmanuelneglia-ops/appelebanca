"use client";

import {
  useEffect,
  useMemo,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { ACCOUNTS, type Transaction } from "@/lib/data";
import { formatMoney } from "@/lib/format";

const STORAGE_KEY = "ba_extra_transactions";

type FormState = {
  fromId: string;
  toName: string;
  toAccount: string;
  amount: string;
  note: string;
};

const initialForm: FormState = {
  fromId: ACCOUNTS[0].id,
  toName: "",
  toAccount: "",
  amount: "",
  note: "",
};

export function TransferForm() {
  const [form, setForm] = useState(FormStateSafe());
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw) as Transaction[]);
    } catch {
      /* ignore */
    }
  }, []);

  const fromAccount = useMemo(
    () => ACCOUNTS.find((a) => a.id === form.fromId) ?? ACCOUNTS[0],
    [form.fromId],
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const amount = Number(form.amount);
    if (!form.toName.trim() || !form.toAccount.trim()) {
      setError("Completa el beneficiario y la cuenta destino.");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Ingresa un monto válido.");
      return;
    }
    if (fromAccount.type === "tarjeta") {
      setError("No puedes transferir desde una tarjeta en esta demo.");
      return;
    }
    if (amount > fromAccount.balance) {
      setError("Saldo insuficiente en la cuenta origen.");
      return;
    }

    startTransition(() => {
      const tx: Transaction = {
        id: `local-${Date.now()}`,
        accountId: form.fromId,
        date: new Date().toISOString().slice(0, 10),
        description: `Transferencia a ${form.toName.trim()}${
          form.note ? ` — ${form.note.trim()}` : ""
        }`,
        amount: -amount,
        category: "Transferencia",
      };
      const next = [tx, ...history];
      setHistory(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setMessage(
        `Transferencia de ${formatMoney(amount)} enviada a ${form.toName.trim()}.`,
      );
      setForm({ ...initialForm, fromId: form.fromId });
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <form
        onSubmit={onSubmit}
        className="space-y-4 border border-ba-line bg-white p-6"
      >
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Cuenta origen</span>
          <select
            value={form.fromId}
            onChange={(e) => setForm((f) => ({ ...f, fromId: e.target.value }))}
            className="w-full border border-ba-line bg-ba-surface px-3 py-2.5 outline-none focus:border-ba-black focus:bg-white"
          >
            {ACCOUNTS.filter((a) => a.type !== "tarjeta").map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} · {formatMoney(account.balance)}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Nombre del beneficiario</span>
          <input
            value={form.toName}
            onChange={(e) => setForm((f) => ({ ...f, toName: e.target.value }))}
            className="w-full border border-ba-line bg-ba-surface px-3 py-2.5 outline-none focus:border-ba-black focus:bg-white"
            placeholder="Ej. María López"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Cuenta destino</span>
          <input
            value={form.toAccount}
            onChange={(e) =>
              setForm((f) => ({ ...f, toAccount: e.target.value }))
            }
            className="w-full border border-ba-line bg-ba-surface px-3 py-2.5 outline-none focus:border-ba-black focus:bg-white"
            placeholder="Número de cuenta"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Monto (USD)</span>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            className="w-full border border-ba-line bg-ba-surface px-3 py-2.5 outline-none focus:border-ba-black focus:bg-white"
            placeholder="0.00"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Concepto (opcional)</span>
          <input
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            className="w-full border border-ba-line bg-ba-surface px-3 py-2.5 outline-none focus:border-ba-black focus:bg-white"
            placeholder="Pago, regalo, alquiler…"
          />
        </label>

        {error ? (
          <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ba-yellow px-6 py-2.5 text-sm font-semibold text-ba-black transition hover:bg-ba-yellow-deep disabled:opacity-60"
        >
          {pending ? "Procesando…" : "Transferir"}
        </button>
      </form>

      <aside className="border border-ba-line bg-ba-surface p-6">
        <h2 className="font-display text-lg font-bold text-ba-ink">
          Transferencias de esta sesión
        </h2>
        <p className="mt-1 text-sm text-ba-muted">
          Se guardan en tu navegador (demo local).
        </p>
        <ul className="mt-4 space-y-3">
          {history.length === 0 ? (
            <li className="text-sm text-ba-muted">Aún no has transferido.</li>
          ) : (
            history.slice(0, 6).map((tx) => (
              <li key={tx.id} className="border border-ba-line bg-white px-3 py-2.5">
                <p className="text-sm font-medium text-ba-ink">{tx.description}</p>
                <p className="text-xs text-ba-muted">
                  {tx.date} · {formatMoney(Math.abs(tx.amount))}
                </p>
              </li>
            ))
          )}
        </ul>
      </aside>
    </div>
  );
}

function FormStateSafe(): FormState {
  return { ...initialForm };
}
