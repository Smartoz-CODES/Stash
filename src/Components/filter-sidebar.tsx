import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Hooks/use-auth";
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

const DashboardIcon = () => (
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
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

const LibraryIcon = () => (
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
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const FolderIcon = () => (
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
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const SettingsIcon = () => (
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
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export default function FilterSidebar({
  categories,
  allTags,
  activeFilters,
  resourceCounts,
  onFilterChange,
  onManageCategories,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

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

  const isDashboard = location.pathname === "/dashboard";
  const isLibrary = location.pathname === "/library";

  // Derive display values from the authenticated user
  const fullName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    "Amelia John";
  const avatarInitial = fullName.charAt(0).toUpperCase();
  const role = user?.user_metadata?.role || "Owner/Co-founder";

  return (
    <aside className="filter-sidebar">
      {/* App logo */}
      <div className="sb-logo">
        <img src="/images/stash.png" alt="Stash" className="sb-logo-img" />
      </div>

      {/* Primary navigation, Dashboard, Library, Favorites */}
      <nav className="sb-nav">
        <p className="sb-label">MENU</p>
        <button
          className={`sb-nav-item ${isDashboard ? "active" : ""}`}
          onClick={() => {
            clearAll();
            navigate("/dashboard");
          }}
        >
          <span className="sb-nav-left">
            <DashboardIcon />
            Dashboard
          </span>
        </button>
        <button
          className={`sb-nav-item ${isLibrary ? "active" : ""}`}
          onClick={() => navigate("/library")}
        >
          <span className="sb-nav-left">
            <LibraryIcon />
            Library
          </span>
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
          <span className="sb-nav-left">
            <HeartIcon filled={activeFilters.isFavourite} />
            Favorite
          </span>
          <span className="sb-badge">{resourceCounts.favourites}</span>
        </button>
      </nav>

      {/* Category filters */}
      <div className="sb-section">
        <p className="sb-label">CATEGORIES</p>
        {categories.map((c: Category) => (
          <button
            key={c.id}
            className={`sb-filter ${activeFilters.categoryId === c.id ? "active" : ""}`}
            onClick={() =>
              activeFilters.categoryId === c.id
                ? removeFilter("categoryId")
                : setFilter({ categoryId: c.id })
            }
          >
            <span className="sb-nav-left">
              <FolderIcon />
              {c.name}
            </span>
          </button>
        ))}
      </div>

      {/* Tag cloud */}
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

      {/* Pushes Settings and user profile to the bottom of the sidebar */}
      <div className="sb-spacer" />

      <button className="sb-nav-item sb-settings" onClick={onManageCategories}>
        <span className="sb-nav-left">
          <SettingsIcon />
          Settings
        </span>
      </button>

      <div
        className="sb-user"
        onClick={() => navigate("/profile")}
        style={{ cursor: "pointer" }}
      >
        <div className="sb-user-avatar">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt={fullName}
              className="sb-user-avatar-img"
            />
          ) : (
            <img
              src="/images/profile.png"
              alt={fullName}
              className="sb-user-avatar-img"
              onError={(e) => {
                // If image fails to load, show initial instead
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement!.innerText = avatarInitial;
              }}
            />
          )}
        </div>
        <div className="sb-user-info">
          <span className="sb-user-name">{fullName}</span>
          <span className="sb-user-role">{role}</span>
        </div>
      </div>
    </aside>
  );
}
