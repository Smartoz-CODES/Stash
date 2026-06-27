import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../Lib/supabase";
import { useCategories } from "../../Hooks/use-categories";
import { useResources } from "../../Hooks/use-resource";
import type { Resource } from "../../Types/resource";
import "../../Styles/resource-detail.css";

/* ── Icons ── */
const BackIcon = () => (
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
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const EditIcon = () => (
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
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill={filled ? "#6344e3" : "none"}
    stroke={filled ? "#6344e3" : "#6b7280"}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const GlobeIcon = () => (
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
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ExternalLinkIcon = () => (
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
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
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

const CategoryIcon = () => (
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

const StatusIcon = () => (
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
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

const ClockIcon = () => (
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
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const TagIcon = () => (
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
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const KeyIcon = () => (
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
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

/* ── Status helpers ── */
const getStatusLabel = (resource: Resource): string => {
  if (resource.is_read) return "Completed";
  if (resource.is_revisit) return "To be read";
  return "Reading";
};

const getStatusClass = (resource: Resource): string => {
  if (resource.is_read) return "status--completed";
  if (resource.is_revisit) return "status--to-read";
  return "status--reading";
};

/* ── Date helpers ── */
const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const timeAgo = (dateStr: string) => {
  const now = new Date();
  const then = new Date(dateStr);
  const diff = now.getTime() - then.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
};

/* ── Component ── */
const ResourceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories } = useCategories();
  const { toggleFavourite, updateResource } = useResources();

  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [newTag, setNewTag] = useState("");
  const [addingTag, setAddingTag] = useState(false);

  /* Fetch single resource */
  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const load = async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("id", id)
        .single();

      if (!isMounted) return;
      if (error) {
        console.error("Failed to fetch resource:", error.message);
        navigate("/dashboard");
        return;
      }
      setResource(data);
      setLoading(false);
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  const getCategoryName = (categoryId: string) => {
    const match = categories.find((c) => c.id === categoryId);
    return match ? match.name : "Uncategorised";
  };

  const handleToggleFavourite = async () => {
    if (!resource) return;
    await toggleFavourite(resource.id, resource.is_favourite);
    setResource((prev) =>
      prev ? { ...prev, is_favourite: !prev.is_favourite } : prev,
    );
  };

  const handleAddTag = async () => {
    if (!resource || !newTag.trim()) return;
    const trimmed = newTag.trim().toLowerCase();
    if (resource.tags.includes(trimmed)) {
      setNewTag("");
      return;
    }
    const updatedTags = [...resource.tags, trimmed];
    await updateResource(resource.id, { tags: updatedTags });
    setResource((prev) => (prev ? { ...prev, tags: updatedTags } : prev));
    setNewTag("");
    setAddingTag(false);
  };

  const handleRemoveTag = async (tag: string) => {
    if (!resource) return;
    const updatedTags = resource.tags.filter((t) => t !== tag);
    await updateResource(resource.id, { tags: updatedTags });
    setResource((prev) => (prev ? { ...prev, tags: updatedTags } : prev));
  };

  if (loading) {
    return (
      <div className="rd-loading">
        <p>Loading resource...</p>
      </div>
    );
  }

  if (!resource) return null;

  return (
    <div className="rd-page">
      <div className="rd-breadcrumb">
        <Link to="/dashboard" className="rd-breadcrumb-link">
          <BackIcon />
          Library
        </Link>
        <span className="rd-breadcrumb-sep">/</span>
        <span className="rd-breadcrumb-current">{resource.title}</span>
      </div>

      {/* ── Page header ── */}
      <div className="rd-header">
        <h1 className="rd-title">{resource.title}</h1>
        <div className="rd-header-actions">
          <button
            className="rd-edit-btn"
            onClick={() => navigate("/dashboard")}
          >
            <EditIcon />
            Edit resource
          </button>
          <span className={`rd-status-badge ${getStatusClass(resource)}`}>
            {resource.is_read && (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {getStatusLabel(resource)}
          </span>
          <button
            className="rd-heart-btn"
            onClick={handleToggleFavourite}
            aria-label={resource.is_favourite ? "Unfavourite" : "Favourite"}
          >
            <HeartIcon filled={resource.is_favourite} />
          </button>
        </div>
      </div>

      {/* ── Meta row ── */}
      <div className="rd-meta-row">
        <span className="rd-cat-badge">
          {getCategoryName(resource.category_id)}
        </span>
        {!resource.is_read && <span className="rd-reading-badge">Reading</span>}
        <span className="rd-saved-date">
          <CalendarIcon />
          Saved {formatDate(resource.created_at)}
        </span>
      </div>

      {/* ── Two column layout ── */}
      <div className="rd-body">
        {/* ── Left, content card ── */}
        <div className="rd-content-card">
          {/* URL preview bar */}
          {resource.url && (
            <div className="rd-url-bar">
              <span className="rd-url-icon">
                <GlobeIcon />
              </span>
              <span className="rd-url-text">{resource.url}</span>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rd-url-open"
                aria-label="Open URL"
              >
                <ExternalLinkIcon />
              </a>
            </div>
          )}

          {/* Thumbnail */}
          {resource.thumbnail_url && (
            <div className="rd-thumbnail">
              <img src={resource.thumbnail_url} alt={resource.title} />
            </div>
          )}

          {/* Title & description */}
          <div className="rd-article">
            <h2 className="rd-article-title">{resource.title}</h2>
            {resource.description && (
              <p className="rd-article-desc">{resource.description}</p>
            )}
          </div>

          {resource.description && resource.description.length > 100 && (
            <div className="rd-takeaways">
              <div className="rd-takeaways-header">
                <KeyIcon />
                <span>Key Takeaways</span>
              </div>
              <ul className="rd-takeaways-list">
                {resource.description
                  .split(".")
                  .filter((s) => s.trim().length > 20)
                  .slice(0, 3)
                  .map((point, i) => (
                    <li key={i}>{point.trim()}.</li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        {/* ── Right info panel ── */}
        <div className="rd-info-panel">
          {/* Resource Info */}
          <div className="rd-info-card">
            <h3 className="rd-info-title">Resource Info</h3>
            <div className="rd-info-rows">
              {resource.url && (
                <div className="rd-info-row">
                  <span className="rd-info-icon">
                    <GlobeIcon />
                  </span>
                  <span className="rd-info-label">Url</span>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rd-info-url"
                  >
                    {resource.url.replace(/^https?:\/\//, "").slice(0, 30)}
                    {resource.url.length > 30 ? "..." : ""}
                  </a>
                </div>
              )}
              <div className="rd-info-row">
                <span className="rd-info-icon">
                  <CategoryIcon />
                </span>
                <span className="rd-info-label">Category</span>
                <span className="rd-info-cat-badge">
                  {getCategoryName(resource.category_id)}
                </span>
              </div>
              <div className="rd-info-row">
                <span className="rd-info-icon">
                  <StatusIcon />
                </span>
                <span className="rd-info-label">Status</span>
                <span className={`rd-info-status ${getStatusClass(resource)}`}>
                  {getStatusLabel(resource)}
                </span>
              </div>
              <div className="rd-info-row">
                <span className="rd-info-icon">
                  <CalendarIcon />
                </span>
                <span className="rd-info-label">Date saved</span>
                <span className="rd-info-value">
                  Saved {formatDate(resource.created_at)}
                </span>
              </div>
              {resource.last_opened_at && (
                <div className="rd-info-row">
                  <span className="rd-info-icon">
                    <ClockIcon />
                  </span>
                  <span className="rd-info-label">Last visited</span>
                  <span className="rd-info-value">
                    {timeAgo(resource.last_opened_at)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="rd-info-card">
            <div className="rd-tags-header">
              <div className="rd-tags-title-row">
                <TagIcon />
                <h3 className="rd-info-title">Tags</h3>
              </div>
              <button
                className="rd-add-tag-btn"
                onClick={() => setAddingTag(true)}
              >
                <PlusIcon />
                Add Tag
              </button>
            </div>

            <div className="rd-tags-list">
              {resource.tags.map((tag) => (
                <span key={tag} className="rd-tag">
                  #{tag}
                  <button
                    className="rd-tag-remove"
                    onClick={() => handleRemoveTag(tag)}
                    aria-label={`Remove ${tag}`}
                  >
                    &times;
                  </button>
                </span>
              ))}
              {resource.tags.length === 0 && !addingTag && (
                <span className="rd-no-tags">No tags yet</span>
              )}
            </div>

            {addingTag && (
              <div className="rd-tag-input-row">
                <input
                  className="rd-tag-input"
                  type="text"
                  placeholder="Tag name..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTag();
                    if (e.key === "Escape") {
                      setAddingTag(false);
                      setNewTag("");
                    }
                  }}
                  autoFocus
                />
                <button className="rd-tag-save" onClick={handleAddTag}>
                  Add
                </button>
                <button
                  className="rd-tag-cancel"
                  onClick={() => {
                    setAddingTag(false);
                    setNewTag("");
                  }}
                >
                  &times;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;
