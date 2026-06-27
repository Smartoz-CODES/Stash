import "../Styles/empty-state.css";

type Props = {
  type: "library" | "favourite" | "filtered";
  onAddResource: () => void;
  onClearFilters?: () => void;
};

export default function EmptyState({
  type,
  onAddResource,
  onClearFilters,
}: Props) {
  const content = {
    library: {
      image: "/images/add.png",
      alt: "Empty library — no resources saved yet",
      title: "Your Library is Empty",
      subtitle: "Save your first resource to get started",
      showAdd: true,
      showClear: false,
    },
    favourite: {
      image: "/images/fav.png",
      alt: "Empty favourites — no resources hearted yet",
      title: "Your Favorite is Empty",
      subtitle: "heart your first resource to get started",
      showAdd: true,
      showClear: false,
    },
    filtered: {
      image: "/images/stash.png",
      alt: "No results found for the current filters",
      title: "No Resources Found",
      subtitle:
        "No resources match your filters. Try adjusting or save something new.",
      showAdd: false,
      showClear: true,
    },
  }[type];

  return (
    <div className="empty-state">
      <div className="empty-state-illustration">
        <img src={content.image} alt={content.alt} />
      </div>
      <h2 className="empty-state-title">{content.title}</h2>
      <p className="empty-state-subtitle">{content.subtitle}</p>
      <div className="empty-state-actions">
        {content.showAdd && (
          <button className="empty-state-btn" onClick={onAddResource}>
            + Add Resource
          </button>
        )}
        {content.showClear && onClearFilters && (
          <button className="empty-state-btn" onClick={onClearFilters}>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
