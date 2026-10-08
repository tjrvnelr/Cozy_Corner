import { formatPrice } from "../data/menuData.js";
import { MinusIcon, PlusIcon } from "./Icons.jsx";

export default function CartItem({ item, onUpdateQuantity }) {
  return (
    <article className="cart-item">
      <img
        src={item.image}
        alt=""
        loading="lazy"
        onError={(event) => event.currentTarget.classList.add("image-failed")}
      />
      <div className="cart-item-main">
        <div className="cart-item-title-row">
          <div>
            <h3>{item.name}</h3>
            {item.option && item.option !== "Regular" && (
              <p className="cart-item-option">{item.option}</p>
            )}
          </div>
          <strong>{formatPrice(item.lineTotal)}</strong>
        </div>
        <div className="cart-item-bottom">
          <span className="cart-unit-price">
            {formatPrice(item.price)} each
          </span>
          <div
            className="quantity-stepper compact-stepper"
            aria-label={`Quantity for ${item.name}`}
          >
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.lineId, item.quantity - 1)}
              aria-label={`Remove one ${item.name}`}
            >
              <MinusIcon size={13} />
            </button>
            <output>{item.quantity}</output>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.lineId, item.quantity + 1)}
              aria-label={`Add one ${item.name}`}
            >
              <PlusIcon size={13} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
