import Airtable from "airtable"

if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    console.warn("AIRTABLE_API_KEY / AIRTABLE_BASE_ID environment variables are not set.")
}

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID,
)

export function table(tableName) {
    return base(tableName)
}

export async function listRecords(tableName, options = {}) {
    const records = []
    await table(tableName)
        .select(options) // { maxRecords, view, filterByFormula, sort ... }
        .eachPage((pageRecords, fetchNextPage) => {
            pageRecords.forEach((r) => records.push({ id: r.id, fields: r.fields }))
            fetchNextPage()
        })
    return records
}

export async function getRecord(tableName, id) {
    const record = await table(tableName).find(id)
    return { id: record.id, fields: record.fields }
}

export async function createRecord(tableName, fields) {
    const [created] = await table(tableName).create([{ fields }])
    return { id: created.id, fields: created.fields }
}

export async function createRecords(tableName, recordsToCreate) {
    const created = await table(tableName).create(
        recordsToCreate.map((fields) => ({ fields })),
    )
    return created.map((r) => ({ id: r.id, fields: r.fields }))
}

export async function updateRecord(tableName, id, fields) {
    const [updated] = await table(tableName).update([{ id, fields }])
    return { id: updated.id, fields: updated.fields }
}

export async function deleteRecord(tableName, id) {
    await table(tableName).destroy([id])
    return { id, deleted: true }
}