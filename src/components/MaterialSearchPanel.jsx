import {useEffect, useState} from "react";

const first = (value) => (Array.isArray(value) ? value[0] : value);

const MAX_RESULTS = 8;

function matchesQuery(item, query) {
    const haystacks = [
        String(item.mdgCode ?? ""),
        item.partNumber ?? "",
        first(item.categoryName) ?? "",
        first(item.manufacturerName) ?? "",
    ];
    return haystacks.some((field) => field.toLowerCase().includes(query));
}

/**
 * Free-text search across MDG code, part number, category, and manufacturer.
 * Only ever reads `selectedItem` and calls `onSelect(item.id)` — it never
 * talks to the browse panel directly.
 */
export default function MaterialSearchPanel({catalog, selectedItem, onSelect}) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Reflect a selection made elsewhere (e.g. the browse panel), and clear
    // back to empty once the selection is cleared (e.g. after Add resets it).
    useEffect(() => {
        setQuery(selectedItem ? String(selectedItem.mdgCode) : "");
    }, [selectedItem?.id]);

    const trimmed = query.trim().toLowerCase();
    const results = trimmed ? catalog.filter((item) => matchesQuery(item, trimmed)).slice(0, MAX_RESULTS) : [];

    function handleSelect(item) {
        onSelect(item.id);
        setIsOpen(false);
    }

    return (
        <div style={{position: "relative"}}>
            <h3>Search</h3>
            <input
                type="text"
                placeholder="MDG code, part number, category, manufacturer…"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 150)}
                style={{width: "100%", boxSizing: "border-box"}}
            />
            {isOpen && results.length > 0 && (
                <ul
                    style={{
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                        border: "1px solid #E5E7EB",
                        position: "absolute",
                        width: "100%",
                        background: "white",
                        zIndex: 10,
                    }}
                >
                    {results.map((item) => (
                        <li key={item.id}>
                            <button
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleSelect(item)}
                                style={{display: "block", width: "100%", textAlign: "left"}}
                            >
                                {item.mdgCode} — {first(item.categoryName)} — {item.size} — {first(item.manufacturerName)}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
