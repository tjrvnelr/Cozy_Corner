import FoodCard from "./FoodCard.jsx";

export default function FoodGrid({
  items,
  favorites,
  onToggleFavorite,
  onAdd,
  onDetails,
  onReset,
}) {
  if (!items.length) {
    return (
      <div className="empty-menu" role="status">
        <span className="empty-menu-mark" aria-hidden="true">
          ⌕
        </span>
        <h3>Nothing on the menu just yet.</h3>
        <p>Try a different search or take a look at all of our good things.</p>
        <button
          className="button button-outline"
          type="button"
          onClick={onReset}
        >
          Show the full menu
        </button>
      </div>
    );
  }
  return (
    <div className="food-grid" aria-live="polite">
      {items.map((item) => (
        <FoodCard
          key={item.id}
          item={item}
          favorite={favorites.includes(item.id)}
          onToggleFavorite={() => onToggleFavorite(item)}
          onAdd={() => onAdd(item)}
          onDetails={() => onDetails(item)}
        />
      ))}
    </div>
  );
}
