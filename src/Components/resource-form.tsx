import { useState, useEffect, useRef } from "react";
import type { Resource, CreateResourceInput } from "../Types/resource";
import type { Category } from "../Types/category";
import { useMetadata } from "../Hooks/use-metadata";
import TagInput from "./tag-input";
import "../Styles/resource-form.css";

type Props = {
  mode: "create" | "edit";
  initialData: Partial<Resource> | null;
  categories: Category[];
  onSubmit: (data: CreateResourceInput) => Promise<void>;
  onClose: () => void;
};

const LinkIcon = () => (
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
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const ChevronDown = () => (
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
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CloseIcon = () => (
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

export default function ResourceForm({
  mode,
  initialData,
  categories,
  onSubmit,
  onClose,
}: Props) {
  const { fetchMetadata, loading: metaLoading } = useMetadata();

  const [title, setTitle] = useState(initialData?.title || "");
  const [url, setUrl] = useState(initialData?.url || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );

  // Refs let us read the latest title/description inside the metadata effect
  // without adding them as dependencies (which would trigger a new fetch on every keystroke)
  const titleRef = useRef(title);
  const descriptionRef = useRef(description);
  useEffect(() => {
    titleRef.current = title;
  }, [title]);
  useEffect(() => {
    descriptionRef.current = description;
  }, [description]);

  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [metaPreview, setMetaPreview] = useState<{
    title?: string | null;
    description?: string | null;
    image?: string | null;
    siteName?: string | null;
  } | null>(null);

  // Call the Supabase Edge Function 800ms after the user stops typing a URL.
  // Pre-fills title and description only if the fields are still empty.
  useEffect(() => {
    if (!url || !url.startsWith("http")) return;

    const timer = setTimeout(async () => {
      const data = await fetchMetadata(url);
      if (data) {
        setMetaPreview({
          title: data.title,
          description: data.description,
          image: data.thumbnailUrl,
          siteName: new URL(url).hostname,
        });
        if (!titleRef.current && data.title) setTitle(data.title);
        if (!descriptionRef.current && data.description)
          setDescription(data.description);
      } else {
        setMetaPreview(null);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [url, fetchMetadata]);

  // Validates that a URL is a proper http/https link before saving.
  const isValidUrl = (value: string): boolean => {
    if (!value) return true; // URL is optional — empty is fine
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Strips leading/trailing whitespace from each tag and lowercases it.
  const sanitizeTags = (rawTags: string[]): string[] =>
    rawTags
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0 && t.length <= 50);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (title.trim().length > 200) {
      setError("Title must be under 200 characters.");
      return;
    }
    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    // Reject URLs that aren't proper http/https links
    if (url.trim() && !isValidUrl(url.trim())) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        url: url.trim() || undefined,
        description: description.trim() || undefined,
        category_id: categoryId,
        tags: sanitizeTags(tags),
      });
      onClose();
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rf-page">
      <div className="rf-page-header">
        <h1 className="rf-page-title">
          {mode === "create" ? "Add Resource" : "Edit Resource"}
        </h1>
        <button className="rf-close-btn" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>
      </div>

      <div className="rf-card">
        <form onSubmit={handleSubmit} className="rf-body">
          {/* Pasting a URL here triggers automatic metadata fetch */}
          <div className="rf-group">
            <label htmlFor="rf-url">Resource url</label>
            <div className="rf-input-wrap">
              <span className="rf-input-icon">
                <LinkIcon />
              </span>
              <input
                id="rf-url"
                type="text"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (!e.target.value || !e.target.value.startsWith("http")) {
                    setMetaPreview(null);
                  }
                }}
              />
              {mode === "edit" && (
                <span className="rf-input-suffix">
                  <ChevronDown />
                </span>
              )}
            </div>
          </div>

          {/* Live page preview shown while metadata is loading or once it arrives */}
          {metaLoading && (
            <div className="rf-meta-loading">Fetching page info...</div>
          )}
          {metaPreview && !metaLoading && (
            <div className="rf-meta-preview">
              {metaPreview.image && (
                <img
                  src={metaPreview.image}
                  alt="Preview"
                  className="rf-meta-image"
                />
              )}
              <div className="rf-meta-info">
                {metaPreview.siteName && (
                  <span className="rf-meta-site">{metaPreview.siteName}</span>
                )}
                {metaPreview.title && (
                  <p className="rf-meta-title">{metaPreview.title}</p>
                )}
                {metaPreview.description && (
                  <p className="rf-meta-desc">{metaPreview.description}</p>
                )}
              </div>
            </div>
          )}

          <div className="rf-two-col">
            <div className="rf-col">
              <div className="rf-group">
                <label htmlFor="rf-title">Title*</label>
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
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="rf-group">
            <label htmlFor="rf-cat">Category</label>
            <div className="rf-select-wrap">
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
              <span className="rf-select-icon">
                <ChevronDown />
              </span>
            </div>
          </div>

          <div className="rf-group">
            <label>Tags</label>
            <TagInput tags={tags} onChange={setTags} placeholder="+Add Tag" />
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
                  : "Update Resource"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
