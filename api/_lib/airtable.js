import Airtable from "airtable"

if (!process.env.AIRTABLE_API_TOKEN || !process.env.AIRTABLE_BASE_ID) {
    console.warn("AIRTABLE_API_TOKEN / AIRTABLE_BASE_ID environment variables are not set.")
}

const base = new Airtable({apiKey: process.env.AIRTABLE_API_TOKEN}).base(process.env.AIRTABLE_BASE_ID,)

export function table(tableId) {
    return base(tableId)
}

export async function listRecords(tableId, options = {}) {
    const records = []
    await table(tableId)
        .select(options) // { maxRecords, view, filterByFormula, sort ... }
        .eachPage((pageRecords, fetchNextPage) => {
            pageRecords.forEach((r) => records.push({id: r.id, fields: r.fields}))
            fetchNextPage()
        })
    return {records}
}

export async function getRecord(tableId, id) {
    const record = await table(tableId).find(id)
    return {id: record.id, fields: record.fields}
}

export async function createRecords(tableId, records) {
    const created = await table(tableId).create(records)
    return {records: created.map((r) => ({id: r.id, fields: r.fields}))}
}

export async function updateRecords(tableId, records) {
    const updated = await table(tableId).update(records)
    return {records: updated.map((r) => ({id: r.id, fields: r.fields}))}
}

export async function deleteRecords(tableId, recordIds) {
    const deleted = await table(tableId).destroy(recordIds)
    return {records: deleted.map((r) => ({id: r.id, deleted: true}))}
}
