import "../Styles/components.css";

type Props = {
  view: "grid" | "list";
  onChange: (view: "grid" | "list") => void;
};

export default function ViewToggle({ view, onChange }: Props) {
  return (
    <div className="view-toggle">
      <button
        className={`toggle-btn ${view === "list" ? "active" : ""}`}
        onClick={() => onChange("list")}
        aria-label="List view"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="1" y="2" width="16" height="2" rx="1" fill="currentColor" />
          <rect x="1" y="8" width="16" height="2" rx="1" fill="currentColor" />
          <rect x="1" y="14" width="16" height="2" rx="1" fill="currentColor" />
        </svg>
      </button>

      <button
        className={`toggle-btn ${view === "grid" ? "active" : ""}`}
        onClick={() => onChange("grid")}
        aria-label="Grid view"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="1" y="1" width="7" height="7" rx="1" fill="currentColor" />
          <rect x="10" y="1" width="7" height="7" rx="1" fill="currentColor" />
          <rect x="1" y="10" width="7" height="7" rx="1" fill="currentColor" />
          <rect x="10" y="10" width="7" height="7" rx="1" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}
