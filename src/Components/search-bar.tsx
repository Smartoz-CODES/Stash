import "../Styles/search-bar.css";

type Props = { value: string; onChange: (term: string) => void };

const SearchIcon = () => (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// Maximum characters allowed in a search query.
const MAX_SEARCH_LENGTH = 100;

export default function SearchBar({ value, onChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Silently truncate input beyond the max length rather than showing an error,
    if (raw.length <= MAX_SEARCH_LENGTH) {
      onChange(raw);
    }
  };

  return (
    <div className="search-bar">
      <span className="search-icon">
        <SearchIcon />
      </span>
      <input
        type="text"
        className="search-input"
        placeholder="Search by title, tags or category"
        value={value}
        onChange={handleChange}
        maxLength={MAX_SEARCH_LENGTH}
        autoComplete="off"
        spellCheck={false}
      />
      {value && (
        <button
          className="search-clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          &#10005;
        </button>
      )}
    </div>
  );
}
