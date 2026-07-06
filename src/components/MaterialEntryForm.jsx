import {useState} from "react";
import MaterialSearchPanel from "./MaterialSearchPanel.jsx";
import MaterialBrowsePanel from "./MaterialBrowsePanel.jsx";

const first = (value) => (Array.isArray(value) ? value[0] : value);

/**
 * Shared "which material, how many" entry form. Used by OrderForm now, and
 * intended to be reused by the invoice-generation feature later (per the
 * original spec: "the item-entry form should be identical to the order
 * record form; use the same component").
 *
 * `catalog` is the full Inventory Catalog list (from getCatalog()). Search
 * and Browse are two independent paths to the same result: both only read
 * from and write to `selectedMaterialId`, never to each other.
 */
export default function MaterialEntryForm({catalog, onSubmit}) {
    const [selectedMaterialId, setSelectedMaterialId] = useState(null);
    const [qty, setQty] = useState(1);

    const selectedItem = catalog.find((item) => item.id === selectedMaterialId) ?? null;

    function handleAdd() {
        if (!selectedMaterialId || qty <= 0) return;
        onSubmit({materialId: selectedMaterialId, qty});
        setSelectedMaterialId(null);
        setQty(1);
    }

    return (
        <div>
            <div style={{display: "flex", alignItems: "flex-start", gap: 16}}>
                <div style={{flex: 1}}>
                    <MaterialSearchPanel catalog={catalog} selectedItem={selectedItem} onSelect={setSelectedMaterialId}/>
                </div>
                <div style={{alignSelf: "stretch", display: "flex", alignItems: "center", padding: "0 8px"}}>
                    or
                </div>
                <div style={{flex: 1}}>
                    <MaterialBrowsePanel catalog={catalog} selectedItem={selectedItem} onSelect={setSelectedMaterialId}/>
                </div>
            </div>

            <div style={{marginTop: 16, border: "1px solid #E5E7EB", padding: 12}}>
                <h3>Selected material</h3>
                {!selectedItem ? (
                    <p>No material selected yet.</p>
                ) : (
                    <>
                        <table>
                            <tbody>
                            <tr>
                                <td>MDG Code</td>
                                <td>{selectedItem.mdgCode}</td>
                            </tr>
                            <tr>
                                <td>Category</td>
                                <td>{first(selectedItem.categoryName)}</td>
                            </tr>
                            <tr>
                                <td>Size</td>
                                <td>{selectedItem.size}</td>
                            </tr>
                            <tr>
                                <td>Manufacturer</td>
                                <td>{first(selectedItem.manufacturerName)}</td>
                            </tr>
                            <tr>
                                <td>Part Number</td>
                                <td>{selectedItem.partNumber}</td>
                            </tr>
                            <tr>
                                <td>Stock on hand</td>
                                <td>{selectedItem.stock}</td>
                            </tr>
                            </tbody>
                        </table>
                        <label>
                            Quantity
                            <input
                                type="number"
                                min={1}
                                value={qty}
                                onChange={(e) => setQty(Number(e.target.value))}
                            />
                        </label>
                        <button type="button" onClick={handleAdd}>Add</button>
                    </>
                )}
            </div>
        </div>
    );
}
