import { useState, useEffect, useMemo, useCallback } from "react";
import { useResources } from "../../Hooks/use-resource";
import { useCategories } from "../../Hooks/use-categories";
import SearchBar from "../../Components/search-bar";
import ViewToggle from "../../Components/view-toggle";
import type { FilterParams, ResourceCounts } from "../../Types/filters";
import type { Resource } from "../../Types/resource";
import type { Category } from "../../Types/category";
import "../../Styles/dashboard.css";

const DashboardPage = () => {
  // ─── Hooks ───
  const {
    resources,
    loading: resourcesLoading,
    fetchResources,
    deleteResource,
    markAsRead,
    toggleFavourite,
    toggleRevisit,
  } = useResources();

  const { categories } = useCategories();

  // ─── Local State ───
  const [activeFilters, setActiveFilters] = useState<FilterParams>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deletingResourceId, setDeletingResourceId] = useState<string | null>(
    null,
  );

  // ─── Debounced Search ───
  const stableFetchResources = useCallback(
    (filters: FilterParams) => fetchResources(filters),
    [fetchResources],
  );

  useEffect(() => {
    const filtersWithSearch: FilterParams = {
      ...activeFilters,
      searchTerm: searchTerm || undefined,
    };

    const timer = setTimeout(() => {
      stableFetchResources(filtersWithSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, activeFilters, stableFetchResources]);

  // ─── Derived Data ───
  const counts: ResourceCounts = useMemo(
    () => ({
      total: resources.length,
      unread: resources.filter((r: Resource) => !r.is_read).length,
      read: resources.filter((r: Resource) => r.is_read).length,
      favourites: resources.filter((r: Resource) => r.is_favourite).length,
      revisit: resources.filter((r: Resource) => r.is_revisit).length,
    }),
    [resources],
  );

  // Look up category name from ID
  const getCategoryName = (categoryId: string): string => {
    const match = categories.find((c: Category) => c.id === categoryId);
    return match ? match.name : "Uncategorised";
  };

  // ─── Event Handlers ───
  const handleOpenResource = (id: string) => {
    const resource = resources.find((r: Resource) => r.id === id);
    if (!resource) return;

    markAsRead(id);

    if (resource.url) {
      window.open(resource.url, "_blank");
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingResourceId(id);
  };

  const handleConfirmDelete = async () => {
    if (deletingResourceId) {
      await deleteResource(deletingResourceId);
      setDeletingResourceId(null);
    }
  };

  // ─── Loading State ───
  if (resourcesLoading && resources.length === 0) {
    return (
      <div className="dashboard-loading">
        <p>Loading your library...</p>
      </div>
    );
  }

  // ─── Render ───
  return (
    <div className="dashboard-page">
      {/* Top bar */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Library</h1>
          <span className="resource-count">{counts.total} resources saved</span>
        </div>

        <div className="dashboard-actions">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <ViewToggle view={viewMode} onChange={setViewMode} />

          <button className="save-button">+ Save Resource</button>
        </div>
      </div>

      {/* Status summary cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-number">{counts.total}</span>
          <span className="stat-label">Total Resources</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{counts.unread}</span>
          <span className="stat-label">Unread</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{counts.read}</span>
          <span className="stat-label">Read</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{counts.revisit}</span>
          <span className="stat-label">Revisit</span>
        </div>
      </div>

      {/* Resource grid/list */}
      {resources.length === 0 ? (
        <div className="empty-state">
          <h2>No resources found</h2>
          <p>
            {Object.keys(activeFilters).length > 0 || searchTerm
              ? "We couldn't find any resources matching your filters. Try adjusting your filters or save new resources to get started."
              : "Your library is empty. Click 'Save Resource' to add your first link, article, or note."}
          </p>
          {(Object.keys(activeFilters).length > 0 || searchTerm) && (
            <button
              className="clear-filters-button"
              onClick={() => {
                setActiveFilters({});
                setSearchTerm("");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className={`resource-grid ${viewMode}`}>
          {resources.map((resource: Resource) => (
            // Replace with <ResourceCard /> when Dev C delivers the updated version.
            <div
              key={resource.id}
              className={`resource-card-placeholder ${resource.is_read ? "read" : "unread"}`}
              onClick={() => handleOpenResource(resource.id)}
            >
              {!resource.is_read && <span className="unread-dot" />}

              <span className="category-badge">
                {getCategoryName(resource.category_id)}
              </span>

              {resource.is_revisit && (
                <span className="revisit-badge">Revisit</span>
              )}

              <h3 className="resource-title">{resource.title}</h3>

              {resource.description && (
                <p className="resource-description">{resource.description}</p>
              )}

              {resource.tags.length > 0 && (
                <div className="resource-tags">
                  {resource.tags.map((tag: string) => (
                    <span key={tag} className="tag-pill">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="resource-footer">
                <span className="resource-date">
                  Saved{" "}
                  {new Date(resource.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>

                <div className="resource-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavourite(resource.id, resource.is_favourite);
                    }}
                    className={`favourite-btn ${resource.is_favourite ? "active" : ""}`}
                  >
                    {resource.is_favourite ? "♥" : "♡"}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRevisit(resource.id, resource.is_revisit);
                    }}
                    className="revisit-btn"
                  >
                    ↻
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(resource.id);
                    }}
                    className="delete-btn"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deletingResourceId && (
        <div
          className="modal-overlay"
          onClick={() => setDeletingResourceId(null)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Resource</h3>
            <p>This action cannot be undone. Are you sure?</p>
            <div className="modal-actions">
              <button onClick={() => setDeletingResourceId(null)}>
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="delete-confirm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
