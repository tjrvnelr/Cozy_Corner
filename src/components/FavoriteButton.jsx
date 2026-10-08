import { HeartIcon } from "./Icons.jsx";

export default function FavoriteButton({ active, onClick, itemName }) {
  return (
    <button
      className={`favorite-button ${active ? "is-favorite" : ""}`}
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={`${active ? "Remove" : "Add"} ${itemName} ${active ? "from" : "to"} favorites`}
    >
      <HeartIcon filled={active} size={19} />
    </button>
  );
}
