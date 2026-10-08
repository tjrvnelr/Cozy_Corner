import FoodCard from "./FoodCard.jsx";
import { ArrowRightIcon } from "./Icons.jsx";

export default function FeaturedSection({
  items,
  favorites,
  onToggleFavorite,
  onAdd,
  onDetails,
  onViewAll,
}) {
  return (
    <section
      className="featured-section section-wrap"
      id="featured"
      aria-labelledby="featured-title"
    >
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">The neighborhood favorites</p>
          <h2 id="featured-title">A little something special.</h2>
        </div>
        <button className="text-link" type="button" onClick={onViewAll}>
          See the whole menu <ArrowRightIcon />
        </button>
      </div>
      <div className="featured-grid">
        {items.map((item, index) => (
          <FoodCard
            key={item.id}
            item={item}
            favorite={favorites.includes(item.id)}
            onToggleFavorite={() => onToggleFavorite(item)}
            onAdd={() => onAdd(item)}
            onDetails={() => onDetails(item)}
            featuredIndex={index}
          />
        ))}
      </div>
    </section>
  );
}
