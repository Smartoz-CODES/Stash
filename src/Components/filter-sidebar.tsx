import type { Category } from "../Types/category";
import type { FilterParams, ResourceCounts } from "../Types/filters";
import "../Styles/components.css";

type Props = {
  categories: Category[];
  allTags: string[];
  activeFilters: FilterParams;
  resourceCounts: ResourceCounts;
  onFilterChange: (filters: FilterParams) => void;
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
  const isActiveCategory = (id: string | undefined): boolean => {
    return activeFilters.categoryId === id;
  };

  const setFilter = (updates: Partial<FilterParams>) => {
    onFilterChange({ ...activeFilters, ...updates });
  };

  const removeFilter = (...keys: (keyof FilterParams)[]) => {
    const updated = { ...activeFilters };
    keys.forEach((key) => {
      delete updated[key];
    });
    onFilterChange(updated);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return (
    <aside className="filter-sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">S</span>
        <span className="logo-text">stash</span>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-label">MENU</p>

        <button
          className={`nav-item ${!activeFilters.categoryId && !activeFilters.isFavourite ? "active" : ""}`}
          onClick={clearAllFilters}
        >
          <span>📋</span>
          <span>Dashboard</span>
        </button>

        <button className="nav-item" onClick={clearAllFilters}>
          <span>📁</span>
          <span>Library</span>
          <span className="badge">{resourceCounts.total}</span>
        </button>

        <button
          className={`nav-item ${activeFilters.isFavourite ? "active" : ""}`}
          onClick={() => {
            if (activeFilters.isFavourite) {
              removeFilter("isFavourite");
            } else {
              setFilter({ isFavourite: true });
            }
          }}
        >
          <span>♡</span>
          <span>Favourites</span>
          <span className="badge">{resourceCounts.favourites}</span>
        </button>
      </nav>

      <div className="sidebar-section">
        <p className="sidebar-label">CATEGORIES</p>

        <button
          className={`filter-item ${!activeFilters.categoryId ? "active" : ""}`}
          onClick={() => removeFilter("categoryId")}
        >
          All
        </button>

        {categories.map((category: Category) => (
          <button
            key={category.id}
            className={`filter-item ${isActiveCategory(category.id) ? "active" : ""}`}
            onClick={() => setFilter({ categoryId: category.id })}
          >
            {category.name}
          </button>
        ))}

        <button className="manage-link" onClick={onManageCategories}>
          Manage Categories
        </button>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-label">STATUS</p>

        <button
          className={`filter-item ${activeFilters.isRead === undefined && !activeFilters.neverOpened ? "active" : ""}`}
          onClick={() => removeFilter("isRead", "neverOpened")}
        >
          All
        </button>

        <button
          className={`filter-item ${activeFilters.isRead === false ? "active" : ""}`}
          onClick={() => setFilter({ isRead: false, neverOpened: undefined })}
        >
          Unread
          <span className="badge">{resourceCounts.unread}</span>
        </button>

        <button
          className={`filter-item ${activeFilters.isRead === true ? "active" : ""}`}
          onClick={() => setFilter({ isRead: true, neverOpened: undefined })}
        >
          Read
          <span className="badge">{resourceCounts.read}</span>
        </button>

        <button
          className={`filter-item ${activeFilters.neverOpened ? "active" : ""}`}
          onClick={() => setFilter({ neverOpened: true, isRead: undefined })}
        >
          Never Opened
        </button>

        <button
          className={`filter-item ${activeFilters.isRevisit ? "active" : ""}`}
          onClick={() => {
            if (activeFilters.isRevisit) {
              removeFilter("isRevisit");
            } else {
              setFilter({ isRevisit: true });
            }
          }}
        >
          Revisit Later
          <span className="badge">{resourceCounts.revisit}</span>
        </button>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-label">DATE SAVED</p>

        <button
          className={`filter-item ${!activeFilters.dateRange ? "active" : ""}`}
          onClick={() => removeFilter("dateRange")}
        >
          All Time
        </button>

        <button
          className={`filter-item ${activeFilters.dateRange === "week" ? "active" : ""}`}
          onClick={() => setFilter({ dateRange: "week" })}
        >
          Last 7 Days
        </button>

        <button
          className={`filter-item ${activeFilters.dateRange === "month" ? "active" : ""}`}
          onClick={() => setFilter({ dateRange: "month" })}
        >
          This Month
        </button>

        <button
          className={`filter-item ${activeFilters.dateRange === "older" ? "active" : ""}`}
          onClick={() => setFilter({ dateRange: "older" })}
        >
          Older
        </button>
      </div>

      {allTags.length > 0 && (
        <div className="sidebar-section">
          <p className="sidebar-label">TAGS</p>

          <div className="tag-list">
            {allTags.map((tag: string) => (
              <button
                key={tag}
                className={`tag-filter ${activeFilters.tag === tag ? "active" : ""}`}
                onClick={() => {
                  if (activeFilters.tag === tag) {
                    removeFilter("tag");
                  } else {
                    setFilter({ tag });
                  }
                }}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <button className="clear-all-btn" onClick={clearAllFilters}>
          Clear All Filters
        </button>
      )}
    </aside>
  );
}
