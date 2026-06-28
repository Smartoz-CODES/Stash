import { useState, useEffect, useMemo, useCallback } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useAuth } from "../../Hooks/use-auth";
import ResourceCard from "../../Components/resource-card";
import ResourceForm from "../../Components/resource-form";
import ConfirmDialog from "../../Components/confirm-dialog";
import SearchBar from "../../Components/search-bar";
import ViewToggle from "../../Components/view-toggle";
import EmptyState from "../../Components/empty-state";
import FilterDrawer from "../../Components/filter-drawer";
import FilterButton from "../../Components/filter-button";
import type { FilterParams, ResourceCounts } from "../../Types/filters";
import type { Resource, CreateResourceInput } from "../../Types/resource";
import type { Category } from "../../Types/category";
import "../../Styles/dashboard.css";

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

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

const Dashboard = () => {
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
    allTags,
  } = useOutletContext<OutletCtx>();

  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showForm, setShowForm] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

  const getCategoryName = (id: string): string => {
    const match = categories.find((c: Category) => c.id === id);
    return match ? match.name : "Uncategorised";
  };

  const displayedResources = useMemo(() => {
    if (!searchTerm) return resources;
    const term = searchTerm.trim().toLowerCase();
    const ids = new Set(resources.map((r: Resource) => r.id));
    const merged = [...resources];
    resources.forEach((r: Resource) => {
      const catName =
        categories
          .find((c: Category) => c.id === r.category_id)
          ?.name?.toLowerCase() || "";
      if (!ids.has(r.id) && catName.includes(term)) merged.push(r);
    });
    return merged;
  }, [resources, searchTerm, categories]);

  const handleOpen = (id: string) => {
    markAsRead(id);
    navigate(`/resource/${id}`);
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

  const firstName =
    user?.user_metadata?.username ||
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "there";
  const avatarInitial = firstName.charAt(0).toUpperCase();

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
    <div className="dashboard">
      {/* Top bar */}
      <div className="dash-topbar">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <FilterButton
          onClick={() => setShowDrawer(true)}
          hasActiveFilters={Object.keys(activeFilters).length > 0}
        />
        <div className="dash-topbar-right">
          <button
            className="dash-add-btn"
            onClick={() => {
              setEditingResource(null);
              setShowForm(true);
            }}
          >
            + Add Resource
          </button>
          <div className="dash-avatar">{avatarInitial}</div>
        </div>
      </div>

      {/* Greeting */}
      <div className="dash-greeting-area">
        <h1 className="dash-greeting">
          {getGreeting()}, {firstName}{" "}
          <span role="img" aria-label="waving hand">
            &#x1F44B;
          </span>
        </h1>
        <p className="dash-greeting-sub">
          You have {counts.unread} unread resources and {counts.revisit} items
          to revisit today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="dash-stats">
        <div className="stat-card">
          <div className="stat-icon stat-icon--total">
            <StackIcon />
          </div>
          <div className="stat-info">
            <span className="stat-num">{counts.total}</span>
            <span className="stat-lbl">Total Resources</span>
          </div>
          <span className="stat-sub">&#8599; +12 this week</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--unread">
            <BookmarkIcon />
          </div>
          <div className="stat-info">
            <span className="stat-num">{counts.unread}</span>
            <span className="stat-lbl">Unread</span>
          </div>
          <span className="stat-sub stat-sub--amber">Recently saved</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--read">
            <CheckIcon />
          </div>
          <div className="stat-info">
            <span className="stat-num">{counts.read}</span>
            <span className="stat-lbl">Read</span>
          </div>
          <span className="stat-sub stat-sub--green">&#10003; Completed</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--revisit">
            <RevisitIcon />
          </div>
          <div className="stat-info">
            <span className="stat-num">{counts.revisit}</span>
            <span className="stat-lbl">Revisit</span>
          </div>
          <span className="stat-sub stat-sub--blue">&#9873; Flagged</span>
        </div>
      </div>

      {/* Section header */}
      <div className="dash-section-header">
        <h2 className="dash-section-title">Recent Resource</h2>
        <ViewToggle view={viewMode} onChange={setViewMode} />
      </div>

      {/* Grid */}
      {displayedResources.length === 0 ? (
        <EmptyState
          type={
            activeFilters.isFavourite
              ? "favourite"
              : Object.keys(activeFilters).length > 0 || searchTerm
                ? "filtered"
                : "library"
          }
          onAddResource={() => {
            setEditingResource(null);
            setShowForm(true);
          }}
          onClearFilters={() => setSearchTerm("")}
        />
      ) : (
        <div className={`dash-grid ${viewMode}`}>
          {displayedResources.map((r: Resource) => (
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

const StackIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const BookmarkIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const RevisitIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default Dashboard;
