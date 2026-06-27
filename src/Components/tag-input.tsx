import { useState } from "react";
import "../Styles/tag-input.css";

type Props = {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
};

export default function TagInput({ tags, onChange, placeholder }: Props) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  };

  return (
    <div className="tag-input">
      {tags.map((tag: string) => (
        <span key={tag} className="chip">
          #{tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((t: string) => t !== tag))}
            aria-label={`Remove ${tag}`}
          >
            &times;
          </button>
        </span>
      ))}
      <input
        value={input}
        placeholder={tags.length === 0 ? placeholder || "+Add Tag" : "+Add Tag"}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Backspace" && input === "" && tags.length > 0) {
            onChange(tags.slice(0, -1));
          }
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
          }
        }}
        onBlur={addTag}
      />
    </div>
  );
}
