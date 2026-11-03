import { formatDateTime, formatMoney, paymentLabel } from "./format.js";

export const cleanPhone = (value) => String(value ?? "").replace(/\D/g, "").slice(-10);

/** The bill as a WhatsApp message (*text* is bold in WhatsApp). */
export function billMessage(order) {
  const less = Number(order.less_amount) || 0;
  const payment =
    order.payment_mode === "SPLIT"
      ? `Cash ${formatMoney(order.cash_amount)} + GPay ${formatMoney(order.gpay_amount)}`
      : paymentLabel(order.payment_mode);

  return [
    "*Friends Crackers* · பட்டாசு கடை",
    `Bill ${order.number} · ${formatDateTime(order.created_at)}`,
    order.customer_name ? `Customer: ${order.customer_name}` : null,
    "",
    ...order.items.map(
      (i) => `${i.code}. ${i.product_name} — ${i.quantity} × ${formatMoney(i.unit_price)} = ${formatMoney(i.line_total)}`
    ),
    "",
    less > 0 ? `Total ${formatMoney(order.total)}` : null,
    less > 0 ? `Less (round off) − ${formatMoney(less)}` : null,
    `*${less > 0 ? "Amount received" : "Total"}: ${formatMoney(order.payable)}*`,
    `You saved ${formatMoney(order.savings)} (80% off)`,
    `Paid by ${payment}`,
    "",
    "நன்றி! Thank you, visit again! 🎆",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

/** wa.me link that opens a chat with the customer (Indian mobile numbers, +91) with the bill filled in. */
export const whatsappUrl = (order, phone) =>
  `https://wa.me/91${cleanPhone(phone)}?text=${encodeURIComponent(billMessage(order))}`;
