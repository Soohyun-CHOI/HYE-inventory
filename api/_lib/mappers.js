/**
 * Table IDs and field NAMES for the Materials Inventory base, plus helpers
 * that translate between Airtable records and the camelCase objects the
 * rest of the app (and the frontend) works with.
 *
 * IMPORTANT: we key by field NAME here, not field ID. The official
 * `airtable` npm SDK (used in api/_lib/airtable.js) always returns
 * 'record.fields' keyed by field name — it has no option to return field IDs
 * like the raw REST API does with ?returnFieldsByFieldId=true. Field names
 * must therefore match exactly what's in Airtable (case-sensitive). If a
 * field gets renamed in Airtable, update it here too.
 */

export const TABLES = {
    category: "tblZ4ok8vtHvQoKrC",
    manufacturer: "tblOwVYtIed2x58PG",
    inventoryCatalog: "tblkumfEEnyoddZ0G",
    purchaseOrder: "tblYYIpea13Gsrr61",
    orderLog: "tblxVknl1UV1Vg8W3",
    receiptLog: "tblw3CqWaevisf6pb",
    issueLog: "tbloddkWJrIrpctrQ",
};

export const FIELDS = {
    category: {
        name: "Category Name",
        image: "Category Image",
        originalOrder: "Original Order",
    },
    manufacturer: {
        name: "Manufacturer Name",
        address: "Address",
        contact: "Contact",
    },
    inventoryCatalog: {
        mdgCode: "MDG Code",
        category: "Category",
        categoryImage: "Category Image (from Category)",
        size: "Size",
        partNumber: "Part Number",
        manufacturer: "Manufacturer",
        manufacturerName: "Manufacturer Name",
        unit: "Unit",
        totalOrderQty: "Total Order Qty",
        totalReceiptQty: "Total Receipt Qty",
        totalIssueQty: "Total Issue Qty",
        backOrder: "Back Order",
        stock: "Stock",
        status: "Status",
        lastActivityDate: "Last Activity Date",
        lastActivityType: "Last Activity Type",
        lastActivity: "Last Activity",
    },
    purchaseOrder: {
        poId: "PO ID",
        poDate: "PO Date",
        requestedBy: "Requested By",
        status: "Status",
        orderLog: "Order Log",
        totalOrderQty: "Total Order Qty",
        totalReceiptQty: "Total Receipt Qty",
    },
    orderLog: {
        orderId: "Order ID",
        purchaseOrder: "Purchase Order",
        material: "Material",
        orderDate: "Order Date",
        orderQty: "Order Qty",
        orderedBy: "Ordered By",
    },
    receiptLog: {
        receiptId: "Receipt ID",
        order: "Order",
        receiptDate: "Receipt Date",
        receiptQty: "Receipt Qty",
        receivedBy: "Received By",
    },
    issueLog: {
        issueId: "Issue ID",
        material: "Material",
        issueDate: "Issue Date",
        issueQty: "Issue Qty",
        issuedBy: "Issued By",
    },
};

/** Build a { camelKey: value } object from an Airtable record's `fields`,
 * given a { camelKey: fieldName } map (one of the FIELDS.* objects above). */
export function mapRecord(record, fieldMap) {
    const out = {id: record.id};
    for (const [key, fieldName] of Object.entries(fieldMap)) {
        out[key] = record.fields ? record.fields[fieldName] : undefined;
    }
    return out;
}

export function mapRecords(records, fieldMap) {
    return records.map((r) => mapRecord(r, fieldMap));
}

/** Build an Airtable `fields` object (field-name keys) from a partial
 * camelCase object, given the same field map. Only keys present in `data`
 * are included, so this works for both create and update payloads. */
export function toAirtableFields(data, fieldMap) {
    const fields = {};
    for (const [key, value] of Object.entries(data)) {
        const fieldName = fieldMap[key];
        if (fieldName && value !== undefined) fields[fieldName] = value;
    }
    return fields;
}