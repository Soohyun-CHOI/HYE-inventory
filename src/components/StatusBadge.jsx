const STYLES = {
    "Awaiting receipt": {bg: '#FEF3C7', fg: '#92400E'},
    Available: {bg: '#D1FAE5', fg: '#065F46'},
    "Out of stock": {bg: '#F3F4F6', fg: '#6B7280'},
};

export default function StatusBadge({status}) {
    const style = STYLES[status] || STYLES["Out of stock"];
    return (
        <span
            style={{
                background: style.bg,
                color: style.fg,
                padding: "2px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: "nowrap",
            }}
        >
      {status || '—'}
    </span>
    );
}
