import {useEffect, useState} from "react";
import {getOrders, getReceipts, getIssues} from "../services/api.js";

const TABS = {
    orders: {label: "Orders", fetcher: getOrders},
    receipts: {label: "Receipts", fetcher: getReceipts},
    issues: {label: "Issues", fetcher: getIssues},
};

export default function History() {
    const [tab, setTab] = useState("orders");
    const [rows, setRows] = useState([]);

    useEffect(() => {
        TABS[tab].fetcher().then(setRows);
    }, [tab]);

    return (
        <div>
            <h1>Inventory Log / History</h1>
            <div>
                {Object.entries(TABS).map(([key, {label}]) => (
                    <button key={key} onClick={() => setTab(key)} disabled={tab === key}>
                        {label}
                    </button>
                ))}
            </div>
            <pre>{JSON.stringify(rows, null, 2)}</pre>
            {/* TODO: replace with a real table per tab */}
        </div>
    );
}
