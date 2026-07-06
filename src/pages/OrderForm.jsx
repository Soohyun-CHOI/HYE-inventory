import {useEffect, useState} from "react";
import {getCatalog, createPurchaseOrder, createOrder} from "../services/api.js";
import MaterialEntryForm from "../components/MaterialEntryForm.jsx";

export default function OrderForm() {
    const [catalog, setCatalog] = useState([]);
    const [lineItems, setLineItems] = useState([]); // [{ materialId, qty }]

    useEffect(() => {
        getCatalog().then(setCatalog);
    }, []);

    function addLineItem(item) {
        setLineItems((prev) => [...prev, item]);
    }

    async function handleCreateOrder() {
        const po = await createPurchaseOrder({poDate: new Date().toISOString().slice(0, 10)});
        await Promise.all(
            lineItems.map((li) =>
                createOrder({purchaseOrder: [po.id], material: [li.materialId], orderQty: li.qty})
            )
        );
        setLineItems([]);
        // TODO: navigate back to Dashboard, show success toast
    }

    return (
        <div>
            <h1>New Order</h1>
            <MaterialEntryForm catalog={catalog} onSubmit={addLineItem}/>
            <ul>
                {lineItems.map((li, i) => {
                    const material = catalog.find(item => item.id === li.materialId);

                    return (
                        <li key={i}>
                            {material ? (
                                <>
                                    {material.mdgCode} - {material.categoryName?.[0]} -{" "}
                                    {material.size} - {material.manufacturerName?.[0]} ×{" "}
                                    {li.qty}{" "}{material.unit}
                                </>
                            ) : (
                                <>
                                    {li.materialId} × {li.qty}
                                </>
                            )}
                        </li>
                    )
                })}
            </ul>
            <button disabled={lineItems.length === 0} onClick={handleCreateOrder}>
                Create order
            </button>
            {/* TODO: "Generate invoice" button — future feature */}
        </div>
    );
}
