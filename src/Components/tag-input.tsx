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
          {tag}
          <button
            onClick={() => onChange(tags.filter((t: string) => t !== tag))}
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={input}
        placeholder={placeholder || "Add tag"}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Backspace" && input === "" && tags.length > 0) {
            onChange(tags.slice(0, -1));
          }
          if (e.key === "Enter") {
            e.preventDefault();
            addTag();
          }
        }}
      />
    </div>
  );
}
