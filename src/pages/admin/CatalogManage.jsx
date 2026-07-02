import {useEffect, useState} from "react";
import {getCatalog, createCatalogItem} from "../../services/api.js";

// Admin-only: add/edit Inventory Catalog items (Category, Manufacturer, etc).
export default function CatalogManage() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        getCatalog().then(setItems);
    }, []);

    return (
        <div>
            <h1>Catalog Management</h1>
            <p>{items.length} items</p>
            {/* TODO: add/edit form, calling createCatalogItem() */}
        </div>
    );
}
