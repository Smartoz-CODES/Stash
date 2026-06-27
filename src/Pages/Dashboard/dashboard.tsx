import { useState, useEffect, useMemo, useCallback } from "react";
import { useResources } from "../../Hooks/use-resource";
import { useCategories } from "../../Hooks/use-categories";
import ResourceCard from "../../Components/resource-card";
import ResourceForm from "../../Components/resource-form";
import ConfirmDialog from "../../Components/confirm-dialog";
import SearchBar from "../../Components/search-bar";
import ViewToggle from "../../Components/view-toggle";
import type { FilterParams, ResourceCounts } from "../../Types/filters";
import type { Resource, CreateResourceInput } from "../../Types/resource";
import type { Category } from "../../Types/category";
import "../../Styles/dashboard.css";

const Dashboard = () => {
  const {
    resources,
    loading,
    fetchResources,
    createResource,
    updateResource,
    deleteResource,
    markAsRead,
    toggleFavourite,
    toggleRevisit,
  } = useResources();

  const { categories } = useCategories();

  const [activeFilters, setActiveFilters] = useState<FilterParams>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Debounced search
  const stableFetch = useCallback(
    (f: FilterParams) => fetchResources(f),
    [fetchResources],
  );

  useEffect(() => {
    const combined: FilterParams = {
      ...activeFilters,
      searchTerm: searchTerm || undefined,
    };
    const timer = setTimeout(() => stableFetch(combined), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, activeFilters, stableFetch]);

  // Derived counts
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

  const getCategoryName = (id: string): string => {
    const match = categories.find((c: Category) => c.id === id);
    return match ? match.name : "Uncategorised";
  };

  // Handlers
  const handleOpen = (id: string) => {
    const r = resources.find((res: Resource) => res.id === id);
    if (!r) return;
    markAsRead(id);
    if (r.url) window.open(r.url, "_blank");
  };

  const handleEdit = (id: string) => {
    const r = resources.find((res: Resource) => res.id === id);
    if (r) {
      setEditingResource(r);
      setShowForm(true);
    }
  };

  const handleFormSubmit = async (data: CreateResourceInput) => {
    if (editingResource) {
      await updateResource(editingResource.id, data);
    } else {
      await createResource(data);
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingId) {
      await deleteResource(deletingId);
      setDeletingId(null);
    }
  };

  if (loading && resources.length === 0) {
    return (
      <div className="dash-loading">
        <p>Loading your library...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dash-header">
        <div className="dash-title-area">
          <h1 className="dash-title">Library</h1>
          <span className="dash-count">{counts.total} resources saved</span>
        </div>
        <div className="dash-actions">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <ViewToggle view={viewMode} onChange={setViewMode} />
          <button
            className="dash-save-btn"
            onClick={() => {
              setEditingResource(null);
              setShowForm(true);
            }}
          >
            + Save Resource
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        <div className="stat-card">
          <span className="stat-num">{counts.total}</span>
          <span className="stat-lbl">Total</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{counts.unread}</span>
          <span className="stat-lbl">Unread</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{counts.read}</span>
          <span className="stat-lbl">Read</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{counts.revisit}</span>
          <span className="stat-lbl">Revisit</span>
        </div>
      </div>

      {/* Grid */}
      {resources.length === 0 ? (
        <div className="dash-empty">
          <h2>No resources found</h2>
          <p>
            {Object.keys(activeFilters).length > 0 || searchTerm
              ? "No resources match your filters. Try adjusting or save something new."
              : "Your library is empty. Click 'Save Resource' to get started."}
          </p>
          {(Object.keys(activeFilters).length > 0 || searchTerm) && (
            <button
              className="dash-clear-btn"
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
        <div className={`dash-grid ${viewMode}`}>
          {resources.map((r: Resource) => (
            <ResourceCard
              key={r.id}
              resource={r}
              view={viewMode}
              categoryName={getCategoryName(r.category_id)}
              onOpen={handleOpen}
              onEdit={handleEdit}
              onDelete={(id: string) => setDeletingId(id)}
              onToggleFavourite={toggleFavourite}
              onToggleRevisit={toggleRevisit}
            />
          ))}
        </div>
      )}

      {/* Resource Form Modal */}
      {showForm && (
        <ResourceForm
          mode={editingResource ? "edit" : "create"}
          initialData={editingResource}
          categories={categories}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingResource(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deletingId && (
        <ConfirmDialog
          title="Delete Resource"
          message="This action cannot be undone. Are you sure?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
