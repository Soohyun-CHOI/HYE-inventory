import StatusBadge from "./StatusBadge.jsx";

/**
 * Renders the current-inventory grid (mirrors the original 입출고 Total sheet).
 * `items` are already camelCase-mapped Inventory Catalog records (see
 * api/_lib/mappers.js — FIELDS.inventoryCatalog).
 */
export default function InventoryTable({items, onReceive, onIssue}) {
    return (
        <table style={{width: "100%", borderCollapse: "collapse"}}>
            <thead>
            <tr style={{textAlign: "left", borderBottom: "1px solid #E5E7EB"}}>
                <th>MDG Code</th>
                <th>Size</th>
                <th>Manufacturer</th>
                <th>Back Order</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Last Activity</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {items.map((item) => (
                <tr key={item.id} style={{borderBottom: "1px solid #F3F4F6"}}>
                    <td>{item.mdgCode}</td>
                    <td>{item.size}</td>
                    <td>{Array.isArray(item.manufacturerName) ? item.manufacturerName[0] : item.manufacturerName}</td>
                    <td>{item.backOrder}</td>
                    <td>{item.stock}</td>
                    <td><StatusBadge status={item.status}/></td>
                    <td>{typeof item.lastActivity === "string" ? item.lastActivity : "—"}</td>
                    <td>
                        {item.backOrder > 0 && (
                            <button onClick={() => onReceive(item)}>Receive</button>
                        )}
                        {item.stock > 0 && (
                            <button onClick={() => onIssue(item)}>Issue</button>
                        )}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
