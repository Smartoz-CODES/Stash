import { useState } from "react";
import type { Category } from "../Types/category";
import type { FilterParams } from "../Types/filters";
import "../Styles/filter-drawer.css";

type Props = {
  categories: Category[];
  allTags: string[];
  activeFilters: FilterParams;
  onApply: (filters: FilterParams) => void;
  onClose: () => void;
};

const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CalendarIcon = () => (
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
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export default function FilterDrawer({
  categories,
  allTags,
  activeFilters,
  onApply,
  onClose,
}: Props) {
  const [localFilters, setLocalFilters] = useState<FilterParams>({
    ...activeFilters,
  });
  const [dateSearch, setDateSearch] = useState("");

  const toggleCategory = (id: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      categoryId: prev.categoryId === id ? undefined : id,
    }));
  };

  const toggleStatus = (
    key: keyof FilterParams,
    value: boolean | undefined,
  ) => {
    setLocalFilters((prev) => {
      const updated = { ...prev };
      delete updated.isRead;
      delete updated.isRevisit;
      delete updated.neverOpened;
      if (value !== undefined) {
        if (key === "isRead") updated.isRead = value as boolean;
        if (key === "isRevisit") updated.isRevisit = value as boolean;
        if (key === "neverOpened") updated.neverOpened = value as boolean;
      }
      return updated;
    });
  };

  const toggleTag = (tag: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      tag: prev.tag === tag ? undefined : tag,
    }));
  };

  const toggleFavourite = () => {
    setLocalFilters((prev) => ({ ...prev, isFavourite: !prev.isFavourite }));
  };

  const handleReset = () => {
    setLocalFilters({});
    onApply({});
    onClose();
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const statusOptions = [
    { label: "Read", key: "isRead" as keyof FilterParams, value: true },
    { label: "Unread", key: "isRead" as keyof FilterParams, value: false },
    { label: "To Read", key: "isRevisit" as keyof FilterParams, value: true },
    {
      label: "Revisit Later",
      key: "neverOpened" as keyof FilterParams,
      value: true,
    },
  ];

  const isStatusActive = (key: keyof FilterParams, value: boolean) => {
    if (key === "isRead") return localFilters.isRead === value;
    if (key === "isRevisit") return localFilters.isRevisit === value;
    if (key === "neverOpened") return localFilters.neverOpened === value;
    return false;
  };

  return (
    <>
      {/* Clicking the backdrop closes the drawer without applying changes */}
      <div className="fd-overlay" onClick={onClose} />

      <div className="fd-drawer">
        <div className="fd-header">
          <h2 className="fd-title">Filter Resources</h2>
          <button className="fd-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div className="fd-body">
          {/* Filter by category */}
          <div className="fd-section">
            <h3 className="fd-section-title">Category</h3>
            <div className="fd-check-list">
              {categories.map((c) => (
                <label key={c.id} className="fd-check-item">
                  <input
                    type="checkbox"
                    checked={localFilters.categoryId === c.id}
                    onChange={() => toggleCategory(c.id)}
                    className="fd-checkbox"
                  />
                  <span className="fd-check-label">{c.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter by read status */}
          <div className="fd-section">
            <h3 className="fd-section-title">Status</h3>
            <div className="fd-check-list">
              {statusOptions.map((opt) => (
                <label key={opt.label} className="fd-check-item">
                  <input
                    type="checkbox"
                    checked={isStatusActive(opt.key, opt.value)}
                    onChange={() => toggleStatus(opt.key, opt.value)}
                    className="fd-checkbox"
                  />
                  <span className="fd-check-label">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tag filter */}
          {allTags.length > 0 && (
            <div className="fd-section">
              <h3 className="fd-section-title">Tags</h3>
              <div className="fd-tags">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    className={`fd-tag ${localFilters.tag === tag ? "active" : ""}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                    {localFilters.tag === tag && (
                      <span className="fd-tag-x">&times;</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filter by date range the resource was saved */}
          <div className="fd-section">
            <h3 className="fd-section-title">Date Saved</h3>
            <div className="fd-date-input">
              <span className="fd-date-icon">
                <CalendarIcon />
              </span>
              <input
                type="text"
                placeholder="Search Resources"
                value={dateSearch}
                onChange={(e) => setDateSearch(e.target.value)}
                className="fd-date-field"
              />
            </div>
            <div className="fd-date-options">
              {[
                { label: "This Week", value: "week" },
                { label: "This Month", value: "month" },
                { label: "Older", value: "older" },
              ].map((opt) => (
                <label key={opt.value} className="fd-check-item">
                  <input
                    type="checkbox"
                    checked={localFilters.dateRange === opt.value}
                    onChange={() =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        dateRange:
                          prev.dateRange === opt.value
                            ? undefined
                            : (opt.value as "week" | "month" | "older"),
                      }))
                    }
                    className="fd-checkbox"
                  />
                  <span className="fd-check-label">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Toggle to show only resources the user has hearted */}
          <div className="fd-section">
            <h3 className="fd-section-title">Favorites</h3>
            <div className="fd-toggle-row">
              <span className="fd-toggle-label">Show Favorites Only</span>
              <button
                className={`fd-toggle ${localFilters.isFavourite ? "active" : ""}`}
                onClick={toggleFavourite}
                role="switch"
                aria-checked={!!localFilters.isFavourite}
                aria-label="Show favourites only"
              >
                <span className="fd-toggle-thumb" />
              </button>
            </div>
          </div>
        </div>

        {/* Reset clears all filters and closes; Apply sends them to the dashboard */}
        <div className="fd-footer">
          <button className="fd-reset-btn" onClick={handleReset}>
            Reset Filter
          </button>
          <button className="fd-apply-btn" onClick={handleApply}>
            Apply Filter
          </button>
        </div>
      </div>
    </>
  );
}
