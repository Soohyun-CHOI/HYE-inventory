import "./PageLayout.css";

export default function PageLayout({ children }) {
    return (
        <div className="page-layout">
            <div className="page-layout__content">
                {children}
            </div>
        </div>
    );
}