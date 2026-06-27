import { useState } from "react";
import type { Resource, CreateResourceInput } from "../Types/resource";
import type { Category } from "../Types/category";
import TagInput from "./tag-input";
import "../Styles/resource-form.css";

type Props = {
  mode: "create" | "edit";
  initialData: Partial<Resource> | null;
  categories: Category[];
  onSubmit: (data: CreateResourceInput) => Promise<void>;
  onClose: () => void;
};

export default function ResourceForm({
  mode,
  initialData,
  categories,
  onSubmit,
  onClose,
}: Props) {
  // Initialize state directly from initialData instead of using useEffect.
  // This works because the component mounts fresh each time the modal opens
  // (it's conditionally rendered with {showForm && <ResourceForm />}).
  // When showForm becomes false, React unmounts the component entirely.
  // When it becomes true again, React creates a new instance with fresh state.
  const [title, setTitle] = useState(initialData?.title || "");
  const [url, setUrl] = useState(initialData?.url || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit({
        title: title.trim(),
        url: url.trim() || undefined,
        description: description.trim() || undefined,
        category_id: categoryId,
        tags,
      });
      onClose();
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rf-overlay" onClick={onClose}>
      <div className="rf-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="rf-heading">
          {mode === "create" ? "Add Resource" : "Edit Resource"}
        </h2>
        <p className="rf-sub">
          {mode === "create"
            ? "Save a new resource to your library."
            : "Update this resource."}
        </p>

        <form onSubmit={handleSubmit} className="rf-body">
          <div className="rf-group">
            <label htmlFor="rf-url">Resource URL</label>
            <input
              id="rf-url"
              type="url"
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="rf-group">
            <label htmlFor="rf-title">Title *</label>
            <input
              id="rf-title"
              type="text"
              placeholder="Resource title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="rf-group">
            <label htmlFor="rf-desc">Description</label>
            <textarea
              id="rf-desc"
              placeholder="What is this resource about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="rf-group">
            <label htmlFor="rf-cat">Category *</label>
            <select
              id="rf-cat"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rf-group">
            <label>Tags</label>
            <TagInput
              tags={tags}
              onChange={setTags}
              placeholder="Add a tag and press Enter"
            />
          </div>

          {error && <p className="rf-error">{error}</p>}

          <div className="rf-actions">
            <button type="button" className="rf-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="rf-submit" disabled={submitting}>
              {submitting
                ? "Saving..."
                : mode === "create"
                  ? "Add Resource"
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
