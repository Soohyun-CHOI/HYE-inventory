import {useEffect, useState} from "react";
import {getCatalog} from "../services/api.js";
import InventoryTable from "../components/InventoryTable.jsx";

export default function Dashboard() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("active"); // "active" | "all"

    useEffect(() => {
        setLoading(true);
        setError(null);
        // Filtering happens in the Airtable query itself (see api/catalog), so
        // switching to "active" only ever fetches the smaller subset — we never
        // pull all 593 rows just to filter them out client-side.
        const params = filter === "active" ? {active: "true"} : {};
        getCatalog(params)
            .then(setItems)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [filter]);

    return (
        <div>
            <h1>Current Inventory</h1>
            <div>
                <button onClick={() => setFilter("active")} disabled={filter === "active"}>
                    Currently ordered/using
                </button>
                <button onClick={() => setFilter("all")} disabled={filter === "all"}>
                    All catalog
                </button>
            </div>
            {loading && <p>Loading…</p>}
            {error && <p>Failed to load inventory: {error}</p>}
            {!loading && !error && (
                <InventoryTable
                    items={items}
                    onReceive={(item) => {
                        // TODO: open the receive-confirm modal for this item
                    }}
                    onIssue={(item) => {
                        // TODO: open the issue-confirm modal for this item
                    }}
                />
            )}
        </div>
    );
}