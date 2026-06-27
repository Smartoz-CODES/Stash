import type { Category } from "../Types/category";
import type { FilterParams, ResourceCounts } from "../Types/filters";
import "../Styles/filter-sidebar.css";

type Props = {
  categories: Category[];
  allTags: string[];
  activeFilters: FilterParams;
  resourceCounts: ResourceCounts;
  onFilterChange: (f: FilterParams) => void;
  onManageCategories: () => void;
};

export default function FilterSidebar({
  categories,
  allTags,
  activeFilters,
  resourceCounts,
  onFilterChange,
  onManageCategories,
}: Props) {
  const setFilter = (u: Partial<FilterParams>) =>
    onFilterChange({ ...activeFilters, ...u });
  const removeFilter = (...keys: (keyof FilterParams)[]) => {
    const up = { ...activeFilters };
    keys.forEach((k) => {
      delete up[k];
    });
    onFilterChange(up);
  };
  const clearAll = () => onFilterChange({});

  return (
    <aside className="filter-sidebar">
      <div className="sb-logo">
        <span className="sb-logo-icon">S</span>
        <span className="sb-logo-text">stash</span>
      </div>
      <nav className="sb-nav">
        <p className="sb-label">MENU</p>
        <button
          className={`sb-nav-item ${!activeFilters.categoryId && !activeFilters.isFavourite ? "active" : ""}`}
          onClick={clearAll}
        >
          <span>Dashboard</span>
        </button>
        <button className="sb-nav-item" onClick={clearAll}>
          <span>Library</span>
          <span className="sb-badge">{resourceCounts.total}</span>
        </button>
        <button
          className={`sb-nav-item ${activeFilters.isFavourite ? "active" : ""}`}
          onClick={() =>
            activeFilters.isFavourite
              ? removeFilter("isFavourite")
              : setFilter({ isFavourite: true })
          }
        >
          <span>Favourites</span>
          <span className="sb-badge">{resourceCounts.favourites}</span>
        </button>
      </nav>
      <div className="sb-section">
        <p className="sb-label">CATEGORIES</p>
        <button
          className={`sb-filter ${!activeFilters.categoryId ? "active" : ""}`}
          onClick={() => removeFilter("categoryId")}
        >
          All
        </button>
        {categories.map((c: Category) => (
          <button
            key={c.id}
            className={`sb-filter ${activeFilters.categoryId === c.id ? "active" : ""}`}
            onClick={() => setFilter({ categoryId: c.id })}
          >
            {c.name}
          </button>
        ))}
        <button className="sb-manage" onClick={onManageCategories}>
          Manage Categories
        </button>
      </div>
      <div className="sb-section">
        <p className="sb-label">STATUS</p>
        <button
          className={`sb-filter ${activeFilters.isRead === undefined && !activeFilters.neverOpened ? "active" : ""}`}
          onClick={() => removeFilter("isRead", "neverOpened")}
        >
          All
        </button>
        <button
          className={`sb-filter ${activeFilters.isRead === false ? "active" : ""}`}
          onClick={() => setFilter({ isRead: false, neverOpened: undefined })}
        >
          Unread <span className="sb-badge">{resourceCounts.unread}</span>
        </button>
        <button
          className={`sb-filter ${activeFilters.isRead === true ? "active" : ""}`}
          onClick={() => setFilter({ isRead: true, neverOpened: undefined })}
        >
          Read <span className="sb-badge">{resourceCounts.read}</span>
        </button>
        <button
          className={`sb-filter ${activeFilters.isRevisit ? "active" : ""}`}
          onClick={() =>
            activeFilters.isRevisit
              ? removeFilter("isRevisit")
              : setFilter({ isRevisit: true })
          }
        >
          Revisit <span className="sb-badge">{resourceCounts.revisit}</span>
        </button>
      </div>
      {allTags.length > 0 && (
        <div className="sb-section">
          <p className="sb-label">TAGS</p>
          <div className="sb-tags">
            {allTags.map((t: string) => (
              <button
                key={t}
                className={`sb-tag ${activeFilters.tag === t ? "active" : ""}`}
                onClick={() =>
                  activeFilters.tag === t
                    ? removeFilter("tag")
                    : setFilter({ tag: t })
                }
              >
                #{t}
              </button>
            ))}
          </div>
        </div>
      )}
      {Object.keys(activeFilters).length > 0 && (
        <button className="sb-clear" onClick={clearAll}>
          Clear All Filters
        </button>
      )}
    </aside>
  );
}
