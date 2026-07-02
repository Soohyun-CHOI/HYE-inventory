/**
 * All frontend data access goes through this file. It only ever calls our
 * own /api/* serverless functions — never Airtable directly, since the
 * Airtable token must stay server-side.
 */

async function request(path, options = {}) {
    const res = await fetch(path, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`);
    }
    return data;
}

// ---- Catalog / current inventory ----
// getCatalog({ active: true }) -> only non-"Out of stock" items (filtered
// server-side, in the Airtable query itself, not after fetching everything)
export const getCatalog = (params = {}) =>
    request(`/api/catalog?${new URLSearchParams(params)}`);
export const createCatalogItem = (item) =>
    request("/api/catalog", { method: "POST", body: JSON.stringify(item) });

// ---- Purchase orders ----
export const getPurchaseOrders = () => request("/api/purchase-orders");
export const createPurchaseOrder = (po) =>
    request("/api/purchase-orders", { method: "POST", body: JSON.stringify(po) });

// ---- Order log ----
export const getOrders = (params = {}) =>
    request(`/api/orders?${new URLSearchParams(params)}`);
export const createOrder = (order) =>
    request("/api/orders", { method: "POST", body: JSON.stringify(order) });

// ---- Receipt log ----
export const getReceipts = (params = {}) =>
    request(`/api/receipts?${new URLSearchParams(params)}`);
export const createReceipt = (receipt) =>
    request("/api/receipts", { method: "POST", body: JSON.stringify(receipt) });

// ---- Issue log ----
export const getIssues = (params = {}) =>
    request(`/api/issues?${new URLSearchParams(params)}`);
export const createIssue = (issue) =>
    request("/api/issues", { method: "POST", body: JSON.stringify(issue) });