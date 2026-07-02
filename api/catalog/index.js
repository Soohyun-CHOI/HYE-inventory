import {listRecords, createRecords} from "../_lib/airtable.js";
import {TABLES, FIELDS, mapRecords, toAirtableFields} from "../_lib/mappers.js";
import {getUserFromRequest, requireRole} from "../_lib/auth.js";

export default async function handler(req, res) {
    try {
        if (req.method === "GET") {
            // ?active=true -> only items that aren't "Out of stock" (the default
            // Dashboard view). Filtering happens in the Airtable query itself,
            // not after the fact in the frontend, so we don't pay the cost of
            // fetching all 593 catalog rows just to throw most of them away.
            const {active} = req.query;
            const options = {pageSize: 100, sort: [{field: "Original Order", direction: "asc"}]};
            if (active === "true") {
                options.filterByFormula = "{Status} != 'Out of stock'";
            }

            const data = await listRecords(TABLES.inventoryCatalog, options);
            return res.status(200).json(mapRecords(data.records, FIELDS.inventoryCatalog));
        }

        if (req.method === "POST") {
            const user = await getUserFromRequest(req);
            requireRole(user, ["admin"]); // only admins manage the catalog directly

            const fields = toAirtableFields(req.body, FIELDS.inventoryCatalog);
            const data = await createRecords(TABLES.inventoryCatalog, [{fields}]);
            return res.status(201).json(mapRecords(data.records, FIELDS.inventoryCatalog)[0]);
        }

        res.setHeader("Allow", "GET, POST");
        return res.status(405).end("Method not allowed");
    } catch (err) {
        console.error(err);
        return res.status(err.status || 500).json({error: err.message});
    }
}