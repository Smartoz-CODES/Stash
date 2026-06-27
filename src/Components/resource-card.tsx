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
  return (
    <div
      className={`resource-card ${view} ${resource.is_read ? "read" : "unread"}`}
      onClick={() => onOpen(resource.id)}
    >
      {!resource.is_read && <span className="unread-dot" />}
      <button
        className="heart-btn"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavourite(resource.id, resource.is_favourite);
        }}
      >
        {resource.is_favourite ? "\u2764\uFE0F" : "\uD83E\uDD0D"}
      </button>
      <div className="card-body">
        <div className="card-badges">
          <span className="cat-badge">{categoryName}</span>
          {resource.is_revisit && (
            <button
              className="revisit-badge"
              onClick={(e) => {
                e.stopPropagation();
                onToggleRevisit(resource.id, resource.is_revisit);
              }}
            >
              Revisit
            </button>
          )}
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
        <div className="card-footer">
          <span className="card-date">
            Saved{" "}
            {new Date(resource.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <div className="card-actions">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(resource.id);
              }}
              className="act-btn"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(resource.id);
              }}
              className="act-btn act-del"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
