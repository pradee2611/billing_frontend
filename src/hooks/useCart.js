import { useMemo, useState } from "react";

const MAX_QTY = 10000;
const clamp = (q) => Math.max(1, Math.min(MAX_QTY, q || 1));

export default function useCart() {
  const [lines, setLines] = useState({});

  /** Adding an item already in the bill increases its quantity. */
  const add = (product, quantity = 1) =>
    setLines((prev) => ({
      ...prev,
      // keep the product (and price) already on the bill, so editing an old bill never reprices it
      [product.id]: { product: prev[product.id]?.product ?? product, quantity: clamp((prev[product.id]?.quantity ?? 0) + quantity) },
    }));

  const setQuantity = (id, quantity) =>
    setLines((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], quantity: clamp(quantity) } } : prev));

  const remove = (id) =>
    setLines((prev) => {
      const { [id]: _removed, ...rest } = prev;
      return rest;
    });

  const clear = () => setLines({});

  /** Replace the whole bill, e.g. when opening an old bill for editing. */
  const load = (entries) =>
    setLines(Object.fromEntries(entries.map(({ product, quantity }) => [product.id, { product, quantity: clamp(quantity) }])));

  // Newest line first, so the item just keyed in is always at the top of the bill.
  const items = useMemo(() => Object.values(lines).reverse(), [lines]);
  const totals = useMemo(() => {
    const total = items.reduce((sum, l) => sum + Number(l.product.price) * l.quantity, 0);
    const mrp = items.reduce((sum, l) => sum + Number(l.product.mrp) * l.quantity, 0);
    return { total, mrp, savings: mrp - total, count: items.reduce((sum, l) => sum + l.quantity, 0) };
  }, [items]);

  return { lines, items, ...totals, add, setQuantity, remove, clear, load };
}
