export default function CategoryFilter({ categories, active, onSelect }) {
  return (
    <div
      className="category-scroller"
      role="group"
      aria-label="Filter menu by category"
    >
      {categories.map((name) => (
        <button
          key={name}
          className={`category-chip ${active === name ? "selected" : ""}`}
          type="button"
          onClick={() => onSelect(name)}
          aria-pressed={active === name}
        >
          {name}
          {name === "All" && (
            <span className="category-all-mark" aria-hidden="true">
              ✳
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
