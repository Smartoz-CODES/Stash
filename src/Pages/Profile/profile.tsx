import { useMemo } from "react";
import type { ReactElement } from "react";
import { useAuth } from "../../Hooks/use-auth";
import { useResources } from "../../Hooks/use-resource";
import { useCategories } from "../../Hooks/use-categories";
import type { Resource } from "../../Types/resource";
import type { Category } from "../../Types/category";
import "../../Styles/profile.css";

/* ── Icons ── */
const EditIcon = () => (
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
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9ca3af"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CalendarIcon = () => (
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
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const LocationIcon = () => (
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
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ResourceIcon = () => (
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
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

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

/* ── Category icons ── */
const categoryIcons: Record<string, ReactElement> = {
  Design: (
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
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  ),
  Work: (
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
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Personal: (
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
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Business: (
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
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  Fun: (
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

const categoryColors: Record<string, { bg: string; color: string }> = {
  Design: { bg: "#ede9fe", color: "#6344e3" },
  Work: { bg: "#fef3c7", color: "#d97706" },
  Personal: { bg: "#dbeafe", color: "#2563eb" },
  Business: { bg: "#d1fae5", color: "#059669" },
  Fun: { bg: "#fee2e2", color: "#dc2626" },
};

/* ── Component ── */
const Profile = () => {
  const { user } = useAuth();
  const { resources } = useResources();
  const { categories } = useCategories();

  /* Derive user details from auth metadata — uses username set at signup */
  const fullName =
    user?.user_metadata?.username ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";
  const firstName = fullName.split(" ")[0];
  const avatarInitial = firstName.charAt(0).toUpperCase();
  const email = user?.email || "";
  const location = user?.user_metadata?.location || "";
  const bio = user?.user_metadata?.bio || "";
  const role = user?.user_metadata?.role || "Member";
  const avatarUrl = user?.user_metadata?.avatar_url || null;

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Jan 25";

  const counts = useMemo(
    () => ({
      total: resources.length,
      unread: resources.filter((r: Resource) => !r.is_read).length,
      read: resources.filter((r: Resource) => r.is_read).length,
      revisit: resources.filter((r: Resource) => r.is_revisit).length,
    }),
    [resources],
  );

  const categoryStats = useMemo(
    () =>
      categories.map((c: Category) => ({
        ...c,
        count: resources.filter((r: Resource) => r.category_id === c.id).length,
      })),
    [categories, resources],
  );

  return (
    <div className="profile-page">
      {/* ── Top bar ── */}
      <div className="profile-topbar">
        <div className="profile-search">
          <SearchIcon />
          <input placeholder="Search by title, tags or category" />
          <button className="profile-search-clear" aria-label="Clear search">
            &#10005;
          </button>
        </div>
        <div className="profile-topbar-right">
          <button className="profile-edit-btn">
            <EditIcon />
            Edit Profile
          </button>
          <div className="profile-avatar-sm">
            <img
              src={avatarUrl}
              alt={fullName}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.textContent = avatarInitial;
                  parent.classList.add("profile-avatar-fallback");
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Page title ── */}
      <h1 className="profile-title">Profile</h1>

      {/* ── Main card ── */}
      <div className="profile-card">
        {/* Header row */}
        <div className="profile-header">
          <div className="profile-avatar-lg">
            <img
              src={avatarUrl}
              alt={fullName}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.textContent = avatarInitial;
                  parent.classList.add("profile-avatar-fallback-lg");
                }
              }}
            />
          </div>
          <div className="profile-identity">
            <h2 className="profile-name">{fullName}</h2>
            <p className="profile-role">{role}</p>
            <div className="profile-meta">
              <span className="profile-meta-item">
                <CalendarIcon />
                Member since {memberSince}
              </span>
              <span className="profile-meta-item">
                <LocationIcon />
                {location}
              </span>
              <span className="profile-meta-item">
                <ResourceIcon />+{counts.total} Resources saved
              </span>
            </div>
          </div>
        </div>

        {/* ── Two column body ── */}
        <div className="profile-body">
          {/* Personal Info */}
          <div className="profile-section profile-info">
            <h3 className="profile-section-title">Personal Info</h3>
            <div className="profile-info-row">
              <span className="profile-info-label">Full Name</span>
              <span className="profile-info-value">{fullName}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Email</span>
              <span className="profile-info-value">{email}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Location</span>
              <span className="profile-info-value">{location}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Bio</span>
              <span className="profile-info-value profile-bio">{bio}</span>
            </div>
          </div>

          {/* Account Stats */}
          <div className="profile-section profile-stats">
            <h3 className="profile-section-title">Account Stat</h3>
            <div className="profile-stat-grid">
              <div className="profile-stat-card">
                <div className="profile-stat-icon stat-icon--total">
                  <StackIcon />
                </div>
                <div className="profile-stat-info">
                  <span className="profile-stat-num">{counts.total}</span>
                  <span className="profile-stat-lbl">Total Resources</span>
                </div>
                <span className="profile-stat-sub">&#8599; +12 this week</span>
              </div>
              <div className="profile-stat-card">
                <div className="profile-stat-icon stat-icon--unread">
                  <BookmarkIcon />
                </div>
                <div className="profile-stat-info">
                  <span className="profile-stat-num">{counts.unread}</span>
                  <span className="profile-stat-lbl">Unread</span>
                </div>
                <span className="profile-stat-sub stat-sub--amber">
                  Recently saved
                </span>
              </div>
              <div className="profile-stat-card">
                <div className="profile-stat-icon stat-icon--read">
                  <CheckIcon />
                </div>
                <div className="profile-stat-info">
                  <span className="profile-stat-num">{counts.read}</span>
                  <span className="profile-stat-lbl">Read</span>
                </div>
                <span className="profile-stat-sub stat-sub--green">
                  &#10003; Completed
                </span>
              </div>
              <div className="profile-stat-card">
                <div className="profile-stat-icon stat-icon--revisit">
                  <RevisitIcon />
                </div>
                <div className="profile-stat-info">
                  <span className="profile-stat-num">{counts.revisit}</span>
                  <span className="profile-stat-lbl">Revisit</span>
                </div>
                <span className="profile-stat-sub stat-sub--blue">
                  &#9873; Flagged
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Overview — shows resource count per category */}
        <div className="profile-categories">
          <h3 className="profile-section-title">Categories Overview</h3>
          <div className="profile-cat-grid">
            {categoryStats.length === 0 ? (
              <p className="profile-cat-empty">
                No categories yet. Add resources to see your category breakdown.
              </p>
            ) : (
              categoryStats.map((c) => {
                const style = categoryColors[c.name] || {
                  bg: "#f3f4f6",
                  color: "#6b7280",
                };
                const icon = categoryIcons[c.name] || <ResourceIcon />;
                return (
                  <div key={c.id} className="profile-cat-card">
                    <div
                      className="profile-cat-icon"
                      style={{ background: style.bg, color: style.color }}
                    >
                      {icon}
                    </div>
                    <div className="profile-cat-info">
                      <span className="profile-cat-name">{c.name}</span>
                      <span className="profile-cat-count">
                        {c.count} resources
                      </span>
                    </div>
                    <span
                      className="profile-cat-badge"
                      style={{ background: style.bg, color: style.color }}
                    >
                      {c.count}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
