import {useState} from "react";
import {createReceipt} from "../services/api.js";

/**
 * Confirm-quantity screen for receiving. `order` is an Order Log record
 * (camelCase-mapped); default qty is the outstanding back-order amount,
 * editable per the original spec.
 */
export default function ReceiveConfirm({order, defaultQty, onDone}) {
    const [qty, setQty] = useState(defaultQty);

    async function handleConfirm() {
        await createReceipt({
            order: [order.id],
            receiptQty: qty,
            receiptDate: new Date().toISOString().slice(0, 10),
        });
        onDone?.();
    }

    return (
        <div>
            <h2>Confirm receipt</h2>
            <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))}/>
            <button onClick={handleConfirm}>Confirm</button>
        </div>
    );
}
