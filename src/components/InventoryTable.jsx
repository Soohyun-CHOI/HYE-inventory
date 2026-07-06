import {useEffect, useRef, useState} from "react";
import StatusBadge from "./StatusBadge.jsx";
import {CATEGORY_NAME_LINES} from "../data/categoryNameLines.js";

const CATEGORY_IMAGE_WIDTH = 130;
const CATEGORY_NAME_WIDTH = 190;
const SIZE_COLUMN_WIDTH = 130;
const SIZE_COLUMN_PADDING = 16; // rough allowance for the cell's own left/right padding
const MDG_CODE_WIDTH = 100;
const MANUFACTURER_WIDTH = 120;
const QTY_COLUMN_WIDTH = 110;
const STATUS_WIDTH = 130;
const LAST_ACTIVITY_WIDTH = 120;
const ACTIONS_WIDTH = 150;

let measureCanvas;

function measureTextWidth(text, font) {
    if (!measureCanvas) measureCanvas = document.createElement("canvas");
    const ctx = measureCanvas.getContext("2d");
    ctx.font = font;
    return ctx.measureText(text).width;
}

/**
 * Renders the current-inventory grid (mirrors the original 입출고 Total sheet).
 * `items` are already camelCase-mapped Inventory Catalog records (see
 * api/_lib/mappers.js — FIELDS.inventoryCatalog).
 */
const first = (value) => (Array.isArray(value) ? value[0] : value);

/** For each item, how many rows its Category cell should span (0 = merged
 * into a preceding row's span). Assumes same-category items are already
 * contiguous, which holds as long as the list is sorted by Original Order. */
function categoryRowSpans(items) {
    const spans = new Array(items.length).fill(0);
    let i = 0;
    while (i < items.length) {
        const categoryId = first(items[i].category);
        let j = i + 1;
        while (j < items.length && first(items[j].category) === categoryId) j++;
        spans[i] = j - i;
        i = j;
    }
    return spans;
}

/** Only break when the plain text would actually overflow the Size column's
 * width, and even then only right before the opening "(" — never mid-word/
 * mid-number (e.g. never split "63" into "6" / "3"). */
function SizeCell({size, font}) {
    if (!size) return null;
    const parenIdx = size.indexOf("(");
    if (parenIdx === -1) return size;
    const fitsOneLine = !font || measureTextWidth(size, font) <= SIZE_COLUMN_WIDTH - SIZE_COLUMN_PADDING;
    if (fitsOneLine) return size;
    return (
        <>
            {size.slice(0, parenIdx)}
            <br/>
            {size.slice(parenIdx)}
        </>
    );
}

export default function InventoryTable({items, onOrder, onReceive, onIssue}) {
    const spans = categoryRowSpans(items);
    const tableRef = useRef(null);
    const [font, setFont] = useState(null);

    useEffect(() => {
        if (tableRef.current) {
            const style = getComputedStyle(tableRef.current);
            setFont(`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`);
        }
    }, []);

    return (
        <table ref={tableRef}
               style={{width: "100%", borderCollapse: "collapse", tableLayout: "fixed", textAlign: "center"}}>
            <thead>
            <tr style={{textAlign: "center", borderBottom: "1px solid #E5E7EB"}}>
                <th style={{width: CATEGORY_IMAGE_WIDTH}}>Category Image</th>
                <th style={{width: CATEGORY_NAME_WIDTH}}>Category Name</th>
                <th style={{width: SIZE_COLUMN_WIDTH}}>Size (in)</th>
                <th style={{width: MDG_CODE_WIDTH}}>MDG Code</th>
                <th style={{width: MANUFACTURER_WIDTH}}>Manufacturer</th>
                <th style={{width: QTY_COLUMN_WIDTH}}>Back Order</th>
                <th style={{width: QTY_COLUMN_WIDTH}}>Stock</th>
                <th style={{width: STATUS_WIDTH}}>Status</th>
                <th style={{width: LAST_ACTIVITY_WIDTH}}>Last Activity</th>
                <th style={{width: ACTIONS_WIDTH}}></th>
            </tr>
            </thead>
            <tbody>
            {items.map((item, idx) => {
                const span = spans[idx];
                const isGroupStart = span > 0;
                const groupBorder = idx > 0 && isGroupStart ? "2px solid #9CA3AF" : undefined;
                const image = first(item.categoryImage);
                const categoryName = first(item.categoryName);
                const nameLines = CATEGORY_NAME_LINES[categoryName] || [categoryName];
                return (
                    <tr key={item.id} style={{borderBottom: "1px solid #F3F4F6"}}>
                        {isGroupStart && (
                            <td rowSpan={span} style={{borderTop: groupBorder}}>
                                {image && (
                                    <img
                                        src={image.thumbnails?.large?.url || image.url}
                                        alt={categoryName || ""}
                                        style={{width: 96, height: 128, objectFit: "contain"}}
                                    />
                                )}
                            </td>
                        )}
                        {isGroupStart && (
                            <td rowSpan={span} style={{borderTop: groupBorder}}>
                                {nameLines.map((line, i) => (
                                    <div key={i}>{line || " "}</div>
                                ))}
                            </td>
                        )}
                        <td style={{width: SIZE_COLUMN_WIDTH, whiteSpace: "normal", borderTop: groupBorder}}>
                            <SizeCell size={item.size} font={font}/>
                        </td>
                        <td style={{borderTop: groupBorder}}>{item.mdgCode}</td>
                        <td style={{borderTop: groupBorder}}>{first(item.manufacturerName)}</td>
                        <td style={{width: QTY_COLUMN_WIDTH, borderTop: groupBorder}}>{item.backOrder}</td>
                        <td style={{width: QTY_COLUMN_WIDTH, borderTop: groupBorder}}>{item.stock}</td>
                        <td style={{borderTop: groupBorder}}><StatusBadge status={item.status}/></td>
                        <td style={{borderTop: groupBorder}}>{typeof item.lastActivity === "string" ? item.lastActivity : "—"}</td>
                        <td style={{borderTop: groupBorder}}>
                            <button onClick={() => onOrder(item)}>Order</button>
                            {item.backOrder > 0 && (
                                <button onClick={() => onReceive(item)}>Receive</button>
                            )}
                            {item.stock > 0 && (
                                <button onClick={() => onIssue(item)}>Issue</button>
                            )}
                        </td>
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
}
