import { useMemo, useState } from "react";
import type { ReactElement } from "react";
import { useAuth } from "../../Hooks/use-auth";
import { useResources } from "../../Hooks/use-resource";
import { useCategories } from "../../Hooks/use-categories";
import { supabase } from "../../Lib/supabase";
import type { Resource } from "../../Types/resource";
import type { Category } from "../../Types/category";
import "../../Styles/profile.css";

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

const categoryIcons: Record<string, ReactElement> = {
  Videos: (
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
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  Articles: (
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Documents: (
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  Tutorials: (
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
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  ),
  Tools: (
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
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  Podcasts: (
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
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
};

const categoryColors: Record<string, { bg: string; color: string }> = {
  Videos: { bg: "#ede9fe", color: "#6344e3" },
  Articles: { bg: "#fef3c7", color: "#d97706" },
  Documents: { bg: "#dbeafe", color: "#2563eb" },
  Tutorials: { bg: "#d1fae5", color: "#059669" },
  Tools: { bg: "#fce7f3", color: "#db2777" },
  Podcasts: { bg: "#fee2e2", color: "#dc2626" },
};

const Profile = () => {
  const { user } = useAuth();
  const { resources } = useResources();
  const { categories } = useCategories();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editRole, setEditRole] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const fullName =
    user?.user_metadata?.username ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";
  const avatarInitial = fullName.charAt(0).toUpperCase();
  const email = user?.email || "";
  const location = user?.user_metadata?.location || "";
  const bio = user?.user_metadata?.bio || "";
  const role = user?.user_metadata?.role || "Member";

  const openEdit = () => {
    setEditUsername(fullName);
    setEditLocation(location);
    setEditBio(bio);
    setEditRole(role);
    setSaveError("");
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (!editUsername.trim()) {
      setSaveError("Username is required.");
      return;
    }
    setSaving(true);
    setSaveError("");
    const { error } = await supabase.auth.updateUser({
      data: {
        username: editUsername.trim(),
        full_name: editUsername.trim(),
        location: editLocation.trim(),
        bio: editBio.trim(),
        role: editRole.trim(),
      },
    });
    setSaving(false);
    if (error) {
      setSaveError(error.message);
      return;
    }
    setShowEditModal(false);
    window.location.reload();
  };

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "";

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
      {/* Top bar */}
      <div className="profile-topbar">
        <div className="profile-topbar-right">
          <button className="profile-edit-btn" onClick={openEdit}>
            <EditIcon />
            Edit Profile
          </button>
          <div className="profile-avatar-sm">
            <div className="profile-avatar-initial-sm">{avatarInitial}</div>
          </div>
        </div>
      </div>

      <h1 className="profile-title">Profile</h1>

      <div className="profile-card">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar-lg">
            <div className="profile-avatar-initial-lg">{avatarInitial}</div>
          </div>
          <div className="profile-identity">
            <h2 className="profile-name">{fullName}</h2>
            <p className="profile-role">{role}</p>
            <div className="profile-meta">
              {memberSince && (
                <span className="profile-meta-item">
                  <CalendarIcon />
                  Member since {memberSince}
                </span>
              )}
              {location && (
                <span className="profile-meta-item">
                  <LocationIcon />
                  {location}
                </span>
              )}
              <span className="profile-meta-item">
                <ResourceIcon />+{counts.total} Resources saved
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="profile-body">
          <div className="profile-section profile-info">
            <h3 className="profile-section-title">Personal Info</h3>
            <div className="profile-info-row">
              <span className="profile-info-label">Username</span>
              <span className="profile-info-value">{fullName}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Email</span>
              <span className="profile-info-value">{email}</span>
            </div>
            {location && (
              <div className="profile-info-row">
                <span className="profile-info-label">Location</span>
                <span className="profile-info-value">{location}</span>
              </div>
            )}
            {bio && (
              <div className="profile-info-row">
                <span className="profile-info-label">Bio</span>
                <span className="profile-info-value profile-bio">{bio}</span>
              </div>
            )}
          </div>

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

        {/* Categories */}
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

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div
          className="edit-modal-overlay"
          onClick={() => setShowEditModal(false)}
        >
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="edit-modal-title">Edit Profile</h2>

            <div className="edit-modal-field">
              <label>Username</label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="Your username"
              />
            </div>
            <div className="edit-modal-field">
              <label>Role / Title</label>
              <input
                type="text"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                placeholder="e.g. Designer, Student, Developer"
              />
            </div>
            <div className="edit-modal-field">
              <label>Location</label>
              <input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                placeholder="e.g. Lagos, Nigeria"
              />
            </div>
            <div className="edit-modal-field">
              <label>Bio</label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Tell us a bit about yourself"
                rows={3}
              />
            </div>

            {saveError && <p className="edit-modal-error">{saveError}</p>}

            <div className="edit-modal-actions">
              <button
                className="edit-modal-cancel"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="edit-modal-save"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
