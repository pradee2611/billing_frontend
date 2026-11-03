import { formatMoney } from "../utils/format.js";
import ProductImage from "./ProductImage.jsx";
import QuantityInput from "./QuantityInput.jsx";

export default function ProductTable({ products, cart, activeCode }) {
  return (
    <div className="table-responsive product-scroll">
      <table className="table align-middle table-hover">
        <thead>
          <tr>
            <th style={{ width: 64 }}>Code</th>
            <th>Item</th>
            <th className="text-end d-none d-sm-table-cell">Price</th>
            <th className="text-end">Bill</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const line = cart.lines[product.id];
            return (
              <tr
                key={product.id}
                id={`row-${product.code}`}
                className={[line && "row-selected", product.code === activeCode && "row-active"].filter(Boolean).join(" ") || undefined}
              >
                <td><span className="code-badge">{product.code}</span></td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <span className="d-none d-sm-block"><ProductImage name={product.name} size={36} /></span>
                    <div className="lh-sm">
                      <div className="fw-medium">{product.name}</div>
                      <div className="small text-secondary">{product.name_ta}</div>
                      <div className="d-sm-none small num mt-1"><strong>{formatMoney(product.price)}</strong> <s className="text-secondary">{formatMoney(product.mrp)}</s></div>
                    </div>
                  </div>
                </td>
                <td className="num text-end d-none d-sm-table-cell">
                  <div className="fw-semibold">{formatMoney(product.price)}</div>
                  <s className="small text-secondary">{formatMoney(product.mrp)}</s>
                </td>
                <td className="text-end">
                  {line ? (
                    <div className="d-flex justify-content-end">
                      <QuantityInput value={line.quantity} onChange={(q) => cart.setQuantity(product.id, q)} />
                    </div>
                  ) : (
                    <button className="btn btn-sm btn-outline-primary px-3" onClick={() => cart.add(product, 1)}>+ Add</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
