import type { Resource } from "../Types/resource";
import "../Styles/resource-card.css";

type Props = {
  resource: Resource;
  view: "grid" | "list";
  categoryName: string;
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavourite: (id: string, current: boolean) => void;
  onToggleRevisit: (id: string, current: boolean) => void;
};

const FileIcon = ({ url }: { url?: string | null }) => {
  if (!url) return <DefaultIcon />;
  if (url.includes("figma")) return <FigmaIcon />;
  if (url.match(/\.(pdf)$/i)) return <PdfIcon />;
  if (url.match(/youtube|vimeo|video/i)) return <VideoIcon />;
  return <DefaultIcon />;
};

const FigmaIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
    <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
    <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
    <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 0 1-7 0z" />
    <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
  </svg>
);

const PdfIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="15" x2="15" y2="15" />
    <line x1="9" y1="11" x2="15" y2="11" />
  </svg>
);

const VideoIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="15" height="10" rx="2" />
    <polygon points="17 9 22 6 22 18 17 15" />
  </svg>
);

const DefaultIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

/* Desktop: star. Mobile: heart (via CSS the button is the same, icon swaps) */
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill={filled ? "#ef4444" : "none"}
    stroke={filled ? "#ef4444" : "#9ca3af"}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="13"
    height="13"
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

export default function ResourceCard({
  resource,
  view,
  categoryName,
  onOpen,
  onEdit,
  onDelete,
  onToggleFavourite,
  onToggleRevisit,
}: Props) {
  const formattedDate = new Date(resource.created_at).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  const statusLabel = resource.is_read ? "Completed" : "To be read";
  const statusClass = resource.is_read ? "status--read" : "status--unread";

  return (
    <div
      className={`resource-card ${view} ${resource.is_read ? "read" : "unread"}`}
      onClick={() => onOpen(resource.id)}
    >
      {/* Mobile-only: category badge + status pill row at top */}
      <div className="card-badges">
        <span className="cat-badge">{categoryName}</span>
        <span
          className={`card-status ${statusClass}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleRevisit(resource.id, resource.is_revisit);
          }}
        >
          {statusLabel}
        </span>
      </div>

      {/* Top row */}
      <div className="card-header">
        <div className="card-file-icon">
          <FileIcon url={resource.url} />
        </div>
        <button
          className="card-star-btn"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavourite(resource.id, resource.is_favourite);
          }}
          aria-label={resource.is_favourite ? "Unfavourite" : "Favourite"}
        >
          <HeartIcon filled={resource.is_favourite} />
        </button>
      </div>

      <h3 className="card-title">{resource.title}</h3>

      {resource.description && (
        <p className="card-desc">{resource.description}</p>
      )}

      {resource.tags.length > 0 && (
        <div className="card-tags">
          {resource.tags.slice(0, 3).map((tag: string) => (
            <span key={tag} className="card-tag">
              #{tag}
            </span>
          ))}
          {resource.tags.length > 3 && (
            <span className="card-tag card-tag-more">
              +{resource.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="card-footer">
        <div className="card-footer-left">
          <span className="cat-badge">{categoryName}</span>
          <span
            className={`card-status ${statusClass}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleRevisit(resource.id, resource.is_revisit);
            }}
          >
            {statusLabel}
          </span>
        </div>
        <div className="card-date">
          <CalendarIcon />
          <span>Saved {formattedDate}</span>
        </div>
      </div>

      {/* Edit + Delete */}
      <div className="card-actions" onClick={(e) => e.stopPropagation()}>
        <button className="act-btn" onClick={() => onEdit(resource.id)}>
          Edit
        </button>
        <button
          className="act-btn act-del"
          onClick={() => onDelete(resource.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
