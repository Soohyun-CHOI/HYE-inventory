import {useState} from "react";

/**
 * Shared "which material, how many" entry form. Used by OrderForm now, and
 * intended to be reused by the invoice-generation feature later (per the
 * original spec: "품목 입력 form은 주문기록과 동일; use the same component").
 *
 * `catalog` is the full Inventory Catalog list (from getCatalog()), used to
 * populate the category -> size -> manufacturer / MDG code lookup.
 */
export default function MaterialEntryForm({catalog, onSubmit}) {
    const [materialId, setMaterialId] = useState('');
    const [qty, setQty] = useState(1);

    function handleSubmit(e) {
        e.preventDefault();
        if (!materialId || qty <= 0) return;
        onSubmit({materialId, qty});
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Material
                <select value={materialId} onChange={(e) => setMaterialId(e.target.value)}>
                    <option value="">Select a material…</option>
                    {catalog.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.mdgCode} — {item.size} — {item.manufacturer}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Quantity
                <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                />
            </label>
            <button type="submit">Add</button>
        </form>
    );
}
