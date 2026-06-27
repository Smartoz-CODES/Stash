import "../Styles/filter-button.css";

type Props = {
  onClick: () => void;
  hasActiveFilters: boolean;
};

const FilterIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

export default function FilterButton({ onClick, hasActiveFilters }: Props) {
  return (
    <button
      className={`filter-btn ${hasActiveFilters ? "filter-btn--active" : ""}`}
      onClick={onClick}
      aria-label="Open filters"
    >
      <FilterIcon />
      Filter
      {hasActiveFilters && <span className="filter-btn-dot" />}
    </button>
  );
}
