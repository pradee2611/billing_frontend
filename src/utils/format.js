const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 2 });

export const formatMoney = (value) => currency.format(Number(value));

export const formatDate = (isoDate) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const formatTime = (isoDateTime) =>
  new Date(isoDateTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

export const formatDateTime = (isoDateTime) =>
  new Date(isoDateTime).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export const todayIso = () => new Date().toLocaleDateString("en-CA");

export const PAYMENT_MODES = [
  { value: "CASH", label: "Cash", key: "F8" },
  { value: "GPAY", label: "GPay", key: "F9" },
  { value: "SPLIT", label: "Split", key: "F10" },
];

/** A split needs cash strictly between 0 and the total; GPay pays the rest. */
export const splitInvalid = (total, cashAmount) => {
  const cash = Number(cashAmount);
  return !(cash > 0 && cash < total);
};

export const paymentLabel = (value) => PAYMENT_MODES.find((m) => m.value === value)?.label ?? value;

export const SHEET_URL = import.meta.env.VITE_SHEET_URL || "";

export const sumBy = (rows, pick) => rows.reduce((sum, row) => sum + Number(pick(row)), 0);
