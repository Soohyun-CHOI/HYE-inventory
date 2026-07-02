import {listRecords, createRecords} from "../_lib/airtable.js";
import {TABLES, FIELDS, mapRecords, toAirtableFields} from "../_lib/mappers.js";
import {getUserFromRequest, requireRole} from "../_lib/auth.js";

export default async function handler(req, res) {
    try {
        if (req.method === "GET") {
            const {purchaseOrderId, materialId} = req.query;
            let filterByFormula;
            if (purchaseOrderId) filterByFormula = `{Purchase Order} = '${purchaseOrderId}'`;
            if (materialId) filterByFormula = `{Material} = '${materialId}'`;

            const data = await listRecords(TABLES.orderLog, {pageSize: 100, filterByFormula});
            return res.status(200).json(mapRecords(data.records, FIELDS.orderLog));
        }

        if (req.method === "POST") {
            const user = await getUserFromRequest(req);
            requireRole(user, ["admin", "operator"]);

            // Body: { purchaseOrder: [recId], material: [recId], orderQty }
            // orderDate is a Lookup from Purchase Order — do not send it, Airtable fills it in.
            const fields = toAirtableFields(
                {
                    purchaseOrder: req.body.purchaseOrder,
                    material: req.body.material,
                    orderQty: req.body.orderQty,
                    orderedBy: user.name,
                },
                FIELDS.orderLog
            );
            const data = await createRecords(TABLES.orderLog, [{fields}]);
            return res.status(201).json(mapRecords(data.records, FIELDS.orderLog)[0]);
        }

        res.setHeader("Allow", "GET, POST");
        return res.status(405).end("Method not allowed");
    } catch (err) {
        console.error(err);
        return res.status(err.status || 500).json({error: err.message});
    }
}
