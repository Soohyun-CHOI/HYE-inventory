import {useState} from "react";
import {createIssue} from "../services/api.js";

/**
 * Confirm-quantity screen for issuing stock out. `item` is an Inventory
 * Catalog record; default qty is the current total stock on hand.
 */
export default function IssueConfirm({item, onDone}) {
    const [qty, setQty] = useState(item.stock);

    async function handleConfirm() {
        await createIssue({
            material: [item.id],
            issueQty: qty,
            issueDate: new Date().toISOString().slice(0, 10),
        });
        onDone?.();
    }

    return (
        <div>
            <h2>Confirm issue</h2>
            <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))}/>
            <button onClick={handleConfirm}>Confirm</button>
        </div>
    );
}
