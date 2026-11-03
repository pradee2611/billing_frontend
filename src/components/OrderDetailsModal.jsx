import { getOrder } from "../api/client.js";
import useAsync from "../hooks/useAsync.js";
import BillModal from "./BillModal.jsx";
import StatusMessage from "./StatusMessage.jsx";

export default function OrderDetailsModal({ order, onClose }) {
  const { data, loading, error } = useAsync(() => getOrder(order.id), [order.id]);

  if (data) return <BillModal order={data} onClose={onClose} />;
  return (
    <>
      <div className="modal d-block" onClick={onClose}>
        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content"><StatusMessage loading={loading} error={error} /></div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  );
}
