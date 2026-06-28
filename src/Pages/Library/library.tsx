import { useState, useEffect, useMemo, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../Hooks/use-auth";
import ResourceCard from "../../Components/resource-card";
import ResourceForm from "../../Components/resource-form";
import ConfirmDialog from "../../Components/confirm-dialog";
import SearchBar from "../../Components/search-bar";
import FilterButton from "../../Components/filter-button";
import FilterDrawer from "../../Components/filter-drawer";
import EmptyState from "../../Components/empty-state";
import type { FilterParams, ResourceCounts } from "../../Types/filters";
import type { Resource, CreateResourceInput } from "../../Types/resource";
import type { Category } from "../../Types/category";
import "../../Styles/library.css";

type OutletCtx = {
  activeFilters: FilterParams;
  setActiveFilters: (f: FilterParams) => void;
  resources: Resource[];
  loading: boolean;
  fetchResources: (f?: FilterParams) => Promise<void>;
  createResource: (data: CreateResourceInput) => Promise<void>;
  updateResource: (id: string, data: Partial<Resource>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  toggleFavourite: (id: string, current: boolean) => Promise<void>;
  toggleRevisit: (id: string, current: boolean) => Promise<void>;
  categories: Category[];
  allTags: string[];
};

type SortOption = "newest" | "oldest" | "recently-read";
const Library = () => {
  const {
    activeFilters,
    setActiveFilters,
    resources,
    loading,
    fetchResources,
    createResource,
    updateResource,
    deleteResource,
    markAsRead,
    toggleFavourite,
    toggleRevisit,
    categories,
  } = useOutletContext<OutletCtx>();

  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    resources.forEach((r: Resource) =>
      r.tags?.forEach((t: string) => tagSet.add(t)),
    );
    return Array.from(tagSet);
  }, [resources]);

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

  const sortedResources = useMemo(() => {
    // getCategoryName defined inside useMemo so it's a stable dependency
    const getCatName = (id: string): string => {
      const match = categories.find((c: Category) => c.id === id);
      return match ? match.name : "Uncategorised";
    };

    const base = [...resources];
    if (searchTerm) {
      const term = searchTerm.trim().toLowerCase();
      const ids = new Set(base.map((r: Resource) => r.id));
      resources.forEach((r: Resource) => {
        if (
          !ids.has(r.id) &&
          getCatName(r.category_id).toLowerCase().includes(term)
        ) {
          base.push(r);
        }
      });
    }

    if (sortBy === "newest")
      return base.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    if (sortBy === "oldest")
      return base.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
    if (sortBy === "recently-read")
      return base.sort((a, b) => {
        if (!a.last_opened_at) return 1;
        if (!b.last_opened_at) return -1;
        return (
          new Date(b.last_opened_at).getTime() -
          new Date(a.last_opened_at).getTime()
        );
      });
    return base;
  }, [resources, sortBy, searchTerm, categories]);

  const getCategoryName = (id: string): string => {
    const match = categories.find((c: Category) => c.id === id);
    return match ? match.name : "Uncategorised";
  };

  const handleOpen = (id: string) => {
    markAsRead(id);
    window.location.href = `/resource/${id}`;
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

  const statusChips = [
    {
      label: "Reading",
      count: resources.filter((r: Resource) => !r.is_read && r.is_revisit)
        .length,
      key: "reading",
    },
    { label: "Completed", count: counts.read, key: "completed" },
    { label: "To Read", count: counts.revisit, key: "to-read" },
  ];

  const avatarInitial = (
    user?.user_metadata?.username ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "U"
  )
    .charAt(0)
    .toUpperCase();

  const sortLabels: Record<SortOption, string> = {
    newest: "Recently Saved",
    oldest: "Oldest First",
    "recently-read": "Recently Read",
  };

  if (showForm) {
    return (
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
    );
  }

  return (
    <div className="library-page">
      {/* Top bar */}
      <div className="library-topbar">
        <div className="library-topbar-left">
          <h1 className="library-title">Library</h1>
          <span className="library-count">{counts.total} resources saved</span>
        </div>
        <div className="library-topbar-right">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <FilterButton
            onClick={() => setShowDrawer(true)}
            hasActiveFilters={Object.keys(activeFilters).length > 0}
          />
          <button
            className="library-add-btn"
            onClick={() => {
              setEditingResource(null);
              setShowForm(true);
            }}
          >
            + Add Resource
          </button>
          <div className="library-avatar">{avatarInitial}</div>
        </div>
      </div>

      {/* Status chips and sort */}
      <div className="library-controls">
        <div className="library-chips">
          {statusChips.map((chip) => (
            <button key={chip.key} className="library-chip">
              <span className={`chip-dot chip-dot--${chip.key}`} />
              {chip.label} {chip.count}
            </button>
          ))}
        </div>
        <div className="library-sort">
          <button
            className="library-sort-btn"
            onClick={() => setShowSortMenu(!showSortMenu)}
          >
            <SortIcon />
            Sorted by <strong>{sortLabels[sortBy]}</strong>
          </button>
          {showSortMenu && (
            <div className="library-sort-menu">
              {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                <button
                  key={key}
                  className={`sort-option ${sortBy === key ? "active" : ""}`}
                  onClick={() => {
                    setSortBy(key);
                    setShowSortMenu(false);
                  }}
                >
                  {sortLabels[key]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Resource grid */}
      {loading && sortedResources.length === 0 ? (
        <div className="library-loading">
          <p>Loading your library...</p>
        </div>
      ) : sortedResources.length === 0 ? (
        <EmptyState
          type={
            Object.keys(activeFilters).length > 0 || searchTerm
              ? "filtered"
              : "library"
          }
          onAddResource={() => {
            setEditingResource(null);
            setShowForm(true);
          }}
          onClearFilters={() => {
            setSearchTerm("");
            setActiveFilters({});
          }}
        />
      ) : (
        <div className="library-grid">
          {sortedResources.map((r: Resource) => (
            <ResourceCard
              key={r.id}
              resource={r}
              view="grid"
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

      {showDrawer && (
        <FilterDrawer
          categories={categories}
          allTags={allTags}
          activeFilters={activeFilters}
          onApply={setActiveFilters}
          onClose={() => setShowDrawer(false)}
        />
      )}

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

const SortIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

export default Library;
