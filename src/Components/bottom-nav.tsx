import { useNavigate, useLocation } from "react-router-dom";
import type { FilterParams } from "../Types/filters";
import "../Styles/bottom-nav.css";

type Props = {
  activeFilters: FilterParams;
};

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill={active ? "#6344e3" : "none"}
    stroke={active ? "#6344e3" : "#9ca3af"}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ResourceIcon = ({ active }: { active: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={active ? "#6344e3" : "#9ca3af"}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" fill={active ? "#6344e3" : "none"} />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const CategoriesIcon = ({ active }: { active: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={active ? "#6344e3" : "#9ca3af"}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const SettingsIcon = ({ active }: { active: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={active ? "#6344e3" : "#9ca3af"}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export default function BottomNav({ activeFilters }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/dashboard";
  const isLibrary =
    location.pathname === "/library" && !activeFilters.isFavourite;
  const isCategories =
    location.pathname === "/library" && !!activeFilters.categoryId;
  const isSettings = location.pathname === "/profile";

  return (
    <nav className="bottom-nav">
      <button
        className={`bottom-nav-tab ${isHome ? "active" : ""}`}
        onClick={() => navigate("/dashboard")}
      >
        <HomeIcon active={isHome} />
        <span className="bottom-nav-label">Home</span>
      </button>

      <button
        className={`bottom-nav-tab ${isLibrary ? "active" : ""}`}
        onClick={() => navigate("/library")}
      >
        <ResourceIcon active={isLibrary} />
        <span className="bottom-nav-label">Resource</span>
      </button>

      <button
        className={`bottom-nav-tab ${isCategories ? "active" : ""}`}
        onClick={() => navigate("/library?filter=true")}
      >
        <CategoriesIcon active={isCategories} />
        <span className="bottom-nav-label">Categories</span>
      </button>

      <button
        className={`bottom-nav-tab ${isSettings ? "active" : ""}`}
        onClick={() => navigate("/profile")}
      >
        <SettingsIcon active={isSettings} />
        <span className="bottom-nav-label">Settings</span>
      </button>
    </nav>
  );
}
