import {useEffect, useState} from "react";

const first = (value) => (Array.isArray(value) ? value[0] : value);

/** Dedupe while preserving first-seen order (catalog is already sorted by
 * Original Order, so this keeps options in the original Excel order). */
function uniqueInOrder(values) {
    const seen = new Set();
    const out = [];
    for (const value of values) {
        if (value && !seen.has(value)) {
            seen.add(value);
            out.push(value);
        }
    }
    return out;
}

/**
 * Cascading Category -> Size -> Manufacturer picker. Only ever reads
 * `selectedItem` and calls `onSelect(item.id)` — it never talks to the
 * search panel directly.
 */
export default function MaterialBrowsePanel({catalog, selectedItem, onSelect}) {
    const [category, setCategory] = useState("");
    const [size, setSize] = useState("");
    const [manufacturer, setManufacturer] = useState("");

    // Reflect a selection made elsewhere (e.g. the search panel), and clear
    // back to empty once the selection is cleared (e.g. after Add resets it).
    useEffect(() => {
        if (selectedItem) {
            setCategory(first(selectedItem.categoryName) ?? "");
            setSize(selectedItem.size ?? "");
            setManufacturer(first(selectedItem.manufacturerName) ?? "");
        } else {
            setCategory("");
            setSize("");
            setManufacturer("");
        }
    }, [selectedItem?.id]);

    const categoryOptions = uniqueInOrder(catalog.map((item) => first(item.categoryName)));
    const sizeOptions = uniqueInOrder(
        catalog.filter((item) => !category || first(item.categoryName) === category).map((item) => item.size)
    );
    const manufacturerOptions = uniqueInOrder(
        catalog
            .filter((item) => (!category || first(item.categoryName) === category) && (!size || item.size === size))
            .map((item) => first(item.manufacturerName))
    );

    // Auto-select the manufacturer when Category + Size only leave one option,
    // but keep the select itself visible and interactive either way.
    useEffect(() => {
        if (category && size && !manufacturer && manufacturerOptions.length === 1) {
            setManufacturer(manufacturerOptions[0]);
        }
    }, [category, size, manufacturer, manufacturerOptions.length, manufacturerOptions[0]]);

    // Converge to a single material once all three selections narrow it down
    // to exactly one — never fire on partial selections.
    useEffect(() => {
        if (!category || !size || !manufacturer) return;
        const matches = catalog.filter(
            (item) =>
                first(item.categoryName) === category &&
                item.size === size &&
                first(item.manufacturerName) === manufacturer
        );
        if (matches.length === 1) onSelect(matches[0].id);
    }, [category, size, manufacturer, catalog, onSelect]);

    function handleCategoryChange(value) {
        setCategory(value);
        setSize("");
        setManufacturer("");
    }

    function handleSizeChange(value) {
        setSize(value);
        setManufacturer("");
    }

    return (
        <div>
            <h3>Browse by category</h3>
            <label>
                Category
                <select value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
                    <option value="">Select category…</option>
                    {categoryOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </label>
            <label>
                Size
                <select value={size} onChange={(e) => handleSizeChange(e.target.value)}>
                    <option value="">Select size…</option>
                    {sizeOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </label>
            <label>
                Manufacturer
                <select value={manufacturer} onChange={(e) => setManufacturer(e.target.value)}>
                    <option value="">Select manufacturer…</option>
                    {manufacturerOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </label>
        </div>
    );
}
