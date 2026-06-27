import "../Styles/search-bar.css";

type Props = { value: string; onChange: (term: string) => void };

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="search-bar">
      <span className="search-icon">&#128269;</span>
      <input
        type="text"
        className="search-input"
        placeholder="Search by title, tags or category"
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
