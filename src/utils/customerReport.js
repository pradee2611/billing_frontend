import { formatDate, formatMoney, sumBy } from "./format.js";

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/** One row per bill that has a customer name and/or phone. Bills with neither are left out of the report only. */
export function customerRows(groups) {
  return (groups ?? []).flatMap((group) =>
    group.orders
      .filter((o) => (o.customer_name || "").trim() || (o.customer_phone || "").trim())
      .map((o) => ({
        date: group.date,
        number: o.number,
        name: (o.customer_name || "").trim(),
        phone: (o.customer_phone || "").trim(),
        amount: Number(o.payable),
      }))
  );
}

/** Opens a standalone customer report and prints it (choose "Save as PDF"). Does not touch the app's own page or bills. */
export function printCustomerReport(groups) {
  const rows = customerRows(groups);
  const win = window.open("", "_blank");
  if (!win) return false;
  const body = rows
    .map(
      (r, i) => `<tr><td>${i + 1}</td><td>${esc(formatDate(r.date))}</td><td>${esc(r.number)}</td><td>${esc(r.name || "—")}</td><td>${esc(r.phone || "—")}</td><td class="r">${esc(formatMoney(r.amount))}</td></tr>`
    )
    .join("");
  win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Friends Crackers - Customers</title>
<style>
@page { margin: 10mm; }
body { font-family: "Segoe UI", Roboto, Arial, sans-serif; color: #222; font-size: 13px; }
h1 { font-size: 20px; margin: 0 0 2px; color: #7b1e1e; }
.sub { color: #666; margin-bottom: 12px; }
table { width: 100%; border-collapse: collapse; }
th { text-align: left; font-size: 11px; text-transform: uppercase; color: #8a5a44; border-bottom: 1.5px solid #333; padding: 6px 6px; }
td { padding: 6px; border-bottom: 1px solid #ddd; }
tr { page-break-inside: avoid; }
.r { text-align: right; }
tfoot td { font-weight: 700; font-size: 15px; border-top: 2px solid #333; border-bottom: 0; }
</style></head><body>
<h1>Friends Crackers — Customers</h1>
<div class="sub">${rows.length} customer bill${rows.length === 1 ? "" : "s"} · generated ${esc(new Date().toLocaleString("en-IN"))}</div>
<table><thead><tr><th>#</th><th>Date</th><th>Bill no.</th><th>Name</th><th>Phone</th><th class="r">Amount</th></tr></thead>
<tbody>${body}</tbody>
<tfoot><tr><td colspan="5">Total</td><td class="r">${esc(formatMoney(sumBy(rows, (r) => r.amount)))}</td></tr></tfoot></table>
</body></html>`);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 300);
  return true;
}
