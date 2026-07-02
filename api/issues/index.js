import {listRecords, createRecords} from "../_lib/airtable.js";
import {TABLES, FIELDS, mapRecords, toAirtableFields} from "../_lib/mappers.js";
import {getUserFromRequest, requireRole} from "../_lib/auth.js";

export default async function handler(req, res) {
    try {
        if (req.method === "GET") {
            const {materialId} = req.query;
            const filterByFormula = materialId ? `{Material} = '${materialId}'` : undefined;
            const data = await listRecords(TABLES.issueLog, {pageSize: 100, filterByFormula});
            return res.status(200).json(mapRecords(data.records, FIELDS.issueLog));
        }

        if (req.method === "POST") {
            const user = await getUserFromRequest(req);
            requireRole(user, ["admin", "operator"]);

            // Body: { material: [recId], issueQty, issueDate }
            const fields = toAirtableFields(
                {
                    material: req.body.material,
                    issueQty: req.body.issueQty,
                    issueDate: req.body.issueDate,
                    issuedBy: user.name,
                },
                FIELDS.issueLog
            );
            const data = await createRecords(TABLES.issueLog, [{fields}]);
            return res.status(201).json(mapRecords(data.records, FIELDS.issueLog)[0]);
        }

        res.setHeader("Allow", "GET, POST");
        return res.status(405).end("Method not allowed");
    } catch (err) {
        console.error(err);
        return res.status(err.status || 500).json({error: err.message});
    }
}
