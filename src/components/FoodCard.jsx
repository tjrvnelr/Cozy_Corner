import { formatPrice } from "../data/menuData.js";
import FavoriteButton from "./FavoriteButton.jsx";
import { ArrowRightIcon } from "./Icons.jsx";

export default function FoodCard({
  item,
  favorite,
  onToggleFavorite,
  onAdd,
  onDetails,
  featuredIndex,
}) {
  return (
    <article
      className={`food-card ${featuredIndex !== undefined ? "featured-card" : ""}`}
    >
      <div className="food-card-image-wrap">
        <button
          className="food-image-button"
          type="button"
          onClick={onDetails}
          aria-label={`View details for ${item.name}`}
        >
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            onError={(event) =>
              event.currentTarget.classList.add("image-failed")
            }
          />
        </button>
        {featuredIndex !== undefined && (
          <span className="popular-tag">
            <span aria-hidden="true">✳</span> HOUSE FAVORITE
          </span>
        )}
        <FavoriteButton
          active={favorite}
          onClick={onToggleFavorite}
          itemName={item.name}
        />
      </div>
      <div className="food-card-body">
        <div className="food-card-heading">
          <span className="food-category-label">{item.category}</span>
          <span className="food-price">{formatPrice(item.price)}</span>
        </div>
        <button className="food-title-button" type="button" onClick={onDetails}>
          <h3>{item.name}</h3>
        </button>
        <p className="food-description">{item.description}</p>
        <p
          className={`availability-label availability-${item.available ? "available" : "unavailable"}`}
        >
          <span className="availability-dot" aria-hidden="true" />
          {item.available ? "Available" : "Currently unavailable"}
        </p>
        <div className="food-card-actions">
          <button
            className="add-button"
            type="button"
            onClick={onAdd}
            disabled={!item.available}
            aria-label={`Add ${item.name} to cart${!item.available ? " — unavailable" : ""}`}
          >
            Add to Cart <span aria-hidden="true">+</span>
          </button>
          <button
            className="details-button"
            type="button"
            onClick={onDetails}
            aria-label={`View details for ${item.name}`}
            title="View details"
          >
            <span>Details</span>
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </article>
  );
}
