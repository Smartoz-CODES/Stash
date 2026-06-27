import { useState } from "react";
import type { Category } from "../Types/category";
import "../Styles/category-manager.css";

type Props = {
  categories: Category[];
  onCreate: (name: string) => Promise<void>;
  onRename: (id: string, name: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
};

/* ── Icons ── */
const CloseIcon = () => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const EditIcon = () => (
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
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
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
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const FolderIcon = () => (
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
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

export default function CategoryManager({
  categories,
  onCreate,
  onRename,
  onDelete,
  onClose,
}: Props) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ── Create ── */
  const handleCreate = async () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      setError("Category name cannot be empty.");
      return;
    }
    const duplicate = categories.some(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (duplicate) {
      setError("A category with this name already exists.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await onCreate(trimmed);
      setNewName("");
    } catch {
      setError("Failed to create category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Rename ── */
  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
    setError("");
  };

  const handleRename = async (id: string) => {
    const trimmed = editingName.trim();
    if (!trimmed) {
      setError("Category name cannot be empty.");
      return;
    }
    const duplicate = categories.some(
      (c) => c.id !== id && c.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (duplicate) {
      setError("A category with this name already exists.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await onRename(id, trimmed);
      setEditingId(null);
    } catch {
      setError("Failed to rename category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      await onDelete(id);
      setDeletingId(null);
    } catch {
      setError("Failed to delete category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cm-overlay" onClick={onClose}>
      <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cm-header">
          <h2 className="cm-title">Manage Categories</h2>
          <button className="cm-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <p className="cm-subtitle">
          Create, rename or delete your categories. Resources in a deleted
          category will become uncategorised.
        </p>
        {/* Add new category */}
        <div className="cm-add-row">
          <input
            className="cm-input"
            type="text"
            placeholder="New category name..."
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
            disabled={loading}
          />
          <button
            className="cm-add-btn"
            onClick={handleCreate}
            disabled={loading || !newName.trim()}
          >
            + Add
          </button>
        </div>
        {error && <p className="cm-error">{error}</p>}
        {/* Category list */}
        <ul className="cm-list">
          {categories.length === 0 && (
            <li className="cm-empty">No categories yet. Add one above.</li>
          )}
          {categories.map((cat) => (
            <li key={cat.id} className="cm-item">
              {editingId === cat.id ? (
                /* Rename mode */
                <div className="cm-edit-row">
                  <input
                    className="cm-input cm-edit-input"
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename(cat.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    autoFocus
                    disabled={loading}
                  />
                  <button
                    className="cm-icon-btn cm-save-btn"
                    onClick={() => handleRename(cat.id)}
                    disabled={loading}
                    aria-label="Save"
                  >
                    <CheckIcon />
                  </button>
                  <button
                    className="cm-icon-btn cm-cancel-btn"
                    onClick={() => setEditingId(null)}
                    aria-label="Cancel"
                  >
                    <CloseIcon />
                  </button>
                </div>
              ) : deletingId === cat.id ? (
                /* Delete confirmation */
                <div className="cm-delete-confirm">
                  <span className="cm-delete-warning">
                    Delete <strong>{cat.name}</strong>? Resources will become
                    uncategorised.
                  </span>
                  <div className="cm-delete-actions">
                    <button
                      className="cm-icon-btn cm-cancel-btn"
                      onClick={() => setDeletingId(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="cm-icon-btn cm-confirm-delete-btn"
                      onClick={() => handleDelete(cat.id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                /* Default view */
                <>
                  <div className="cm-item-left">
                    <span className="cm-folder-icon">
                      <FolderIcon />
                    </span>
                    <span className="cm-item-name">{cat.name}</span>
                  </div>
                  <div className="cm-item-actions">
                    <button
                      className="cm-icon-btn cm-edit-btn"
                      onClick={() => startEdit(cat)}
                      aria-label={`Rename ${cat.name}`}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="cm-icon-btn cm-trash-btn"
                      onClick={() => setDeletingId(cat.id)}
                      aria-label={`Delete ${cat.name}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        <div className="cm-footer">
          <button className="cm-done-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
