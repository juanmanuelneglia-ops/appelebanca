export function formatMoney(amount: number, currency = "USD") {
  return new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-SV", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function maskAccount(number: string) {
  const digits = number.replace(/\s/g, "");
  if (digits.length < 4) return number;
  return `•••• ${digits.slice(-4)}`;
}
