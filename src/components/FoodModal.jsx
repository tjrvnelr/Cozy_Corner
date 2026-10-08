import { useEffect, useRef, useState } from "react";
import FavoriteButton from "./FavoriteButton.jsx";
import { formatPrice, priceForOption } from "../data/menuData.js";
import { CloseIcon, MinusIcon, PlusIcon } from "./Icons.jsx";

export default function FoodModal({
  item,
  favorite,
  onToggleFavorite,
  onAdd,
  onClose,
}) {
  const [quantity, setQuantity] = useState(1);
  const [option, setOption] = useState(item.options?.[0] || "Regular");
  const dialogRef = useRef(null);

  useEffect(() => {
    const priorOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && dialogRef.current) {
        const nodes = [
          ...dialogRef.current.querySelectorAll(
            "button:not(:disabled), select, a[href]",
          ),
        ];
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = priorOverflow;
      window.removeEventListener("keydown", onKeyDown);
      if (
        !dialogRef.current &&
        previouslyFocused instanceof HTMLElement &&
        previouslyFocused.isConnected
      )
        requestAnimationFrame(() =>
          previouslyFocused.focus({ preventScroll: true }),
        );
    };
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="food-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="food-modal-title"
        ref={dialogRef}
        tabIndex={-1}
      >
        <button
          className="modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close item details"
        >
          <CloseIcon />
        </button>
        <div className="food-modal-image-wrap">
          <img
            src={item.image}
            alt={item.name}
            onError={(event) =>
              event.currentTarget.classList.add("image-failed")
            }
          />
          <FavoriteButton
            active={favorite}
            onClick={onToggleFavorite}
            itemName={item.name}
          />
          {!item.available && (
            <span className="unavailable-tag">Currently unavailable</span>
          )}
        </div>
        <div className="food-modal-copy">
          <p className="eyebrow">
            {item.category}
            {item.popular && (
              <span className="modal-popular"> · HOUSE FAVORITE</span>
            )}
          </p>
          <div className="food-modal-title-row">
            <h2 id="food-modal-title">{item.name}</h2>
            <strong className="modal-price">
              {formatPrice(priceForOption(item, option))}
            </strong>
          </div>
          <p className="modal-description">{item.description}</p>
          <div className="ingredient-block">
            <h3>What’s in it</h3>
            <div className="ingredient-list">
              {item.ingredients.map((ingredient) => (
                <span key={ingredient}>{ingredient}</span>
              ))}
            </div>
          </div>
          {item.options?.length > 0 && (
            <label className="option-field">
              <span>Make it yours</span>
              <select
                value={option}
                onChange={(event) => setOption(event.target.value)}
                disabled={!item.available}
              >
                {item.options.map((choice) => (
                  <option key={choice} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="modal-bottom-row">
            <div className="quantity-stepper" aria-label="Quantity selector">
              <button
                type="button"
                onClick={() =>
                  setQuantity((current) => Math.max(1, current - 1))
                }
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <MinusIcon />
              </button>
              <output aria-live="polite" aria-label={`Quantity ${quantity}`}>
                {quantity}
              </output>
              <button
                type="button"
                onClick={() => setQuantity((current) => current + 1)}
                aria-label="Increase quantity"
              >
                <PlusIcon />
              </button>
            </div>
            <button
              className="button button-accent modal-add"
              type="button"
              onClick={() => onAdd(item, quantity, option)}
              disabled={!item.available}
            >
              Add to order{" "}
              <span>
                {formatPrice(priceForOption(item, option) * quantity)}
              </span>
            </button>
          </div>
          {!item.available && (
            <p className="modal-unavailable-note">
              This dish is having a little rest. Please check back soon.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
