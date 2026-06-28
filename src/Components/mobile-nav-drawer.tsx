import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Hooks/use-auth";
import type { Category } from "../Types/category";
import type { FilterParams, ResourceCounts } from "../Types/filters";
import "../Styles/mobile-nav-drawer.css";

type Props = {
  categories: Category[];
  allTags: string[];
  activeFilters: FilterParams;
  resourceCounts: ResourceCounts;
  onFilterChange: (f: FilterParams) => void;
  onClose: () => void;
};

const XIcon = () => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const HomeIcon = () => (
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
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
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

const LogoutIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function MobileNavDrawer({
  categories,
  allTags,
  activeFilters,
  resourceCounts,
  onFilterChange,
  onClose,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const fullName =
    user?.user_metadata?.username ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";
  const avatarInitial = fullName.charAt(0).toUpperCase();
  const role = user?.user_metadata?.role || "Member";

  const isDashboard = location.pathname === "/dashboard";
  const isLibrary =
    location.pathname === "/library" && !activeFilters.isFavourite;

  const setFilter = (u: Partial<FilterParams>) =>
    onFilterChange({ ...activeFilters, ...u });
  const removeFilter = (...keys: (keyof FilterParams)[]) => {
    const up = { ...activeFilters };
    keys.forEach((k) => delete up[k]);
    onFilterChange(up);
  };

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <>
      {/* Overlay */}
      <div className="mnd-overlay" onClick={onClose} />

      {/* Drawer */}
      <aside className="mnd-drawer">
        {/* Header */}
        <div className="mnd-header">
          <img src="/images/stash.png" alt="Stash" className="mnd-logo" />
          <button
            className="mnd-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <XIcon />
          </button>
        </div>

        {/* Nav */}
        <nav className="mnd-nav">
          <p className="mnd-label">MENU</p>
          <button
            className={`mnd-item ${isDashboard ? "active" : ""}`}
            onClick={() => handleNav("/dashboard")}
          >
            <HomeIcon />
            Dashboard
          </button>
          <button
            className={`mnd-item ${isLibrary ? "active" : ""}`}
            onClick={() => handleNav("/library")}
          >
            <LibraryIcon />
            Library
            <span className="mnd-badge">{resourceCounts.total}</span>
          </button>
          <button
            className={`mnd-item ${activeFilters.isFavourite ? "active" : ""}`}
            onClick={() => {
              if (activeFilters.isFavourite) {
                removeFilter("isFavourite");
              } else {
                setFilter({ isFavourite: true });
              }
              onClose();
            }}
          >
            <HeartIcon filled={activeFilters.isFavourite} />
            Favorites
            <span className="mnd-badge">{resourceCounts.favourites}</span>
          </button>
        </nav>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mnd-section">
            <p className="mnd-label">CATEGORIES</p>
            {categories.map((c) => (
              <button
                key={c.id}
                className={`mnd-item mnd-item--sm ${activeFilters.categoryId === c.id ? "active" : ""}`}
                onClick={() => {
                  if (activeFilters.categoryId === c.id) {
                    removeFilter("categoryId");
                  } else {
                    setFilter({ categoryId: c.id });
                  }
                  onClose();
                }}
              >
                <FolderIcon />
                {c.name}
              </button>
            ))}
          </div>
        )}

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="mnd-section">
            <p className="mnd-label">TAGS</p>
            <div className="mnd-tags">
              {allTags.map((t) => (
                <button
                  key={t}
                  className={`mnd-tag ${activeFilters.tag === t ? "active" : ""}`}
                  onClick={() => {
                    if (activeFilters.tag === t) {
                      removeFilter("tag");
                    } else {
                      setFilter({ tag: t });
                    }
                    onClose();
                  }}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* User row */}
        <div className="mnd-user">
          <div className="mnd-avatar">{avatarInitial}</div>
          <div className="mnd-user-info">
            <span className="mnd-user-name">{fullName}</span>
            <span className="mnd-user-role">{role}</span>
          </div>
          <button
            className="mnd-logout"
            onClick={handleLogout}
            aria-label="Log out"
          >
            <LogoutIcon />
          </button>
        </div>
      </aside>
    </>
  );
}
