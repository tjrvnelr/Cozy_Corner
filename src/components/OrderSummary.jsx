import { formatPrice } from "../data/menuData.js";

export default function OrderSummary({
  subtotal,
  deliveryFee,
  total,
  deliveryMode,
  onDeliveryModeChange,
  onPlaceOrder,
  disabled,
}) {
  return (
    <div className="order-summary">
      <h3>How would you like it?</h3>
      <div
        className="delivery-options"
        role="radiogroup"
        aria-label="Choose pickup or delivery"
      >
        <label
          className={`delivery-option ${deliveryMode === "pickup" ? "selected" : ""}`}
        >
          <input
            type="radio"
            name="delivery-mode"
            value="pickup"
            checked={deliveryMode === "pickup"}
            onChange={() => onDeliveryModeChange("pickup")}
          />
          <span className="delivery-option-title">Pick up</span>
          <span className="delivery-option-note">Free</span>
        </label>
        <label
          className={`delivery-option ${deliveryMode === "delivery" ? "selected" : ""}`}
        >
          <input
            type="radio"
            name="delivery-mode"
            value="delivery"
            checked={deliveryMode === "delivery"}
            onChange={() => onDeliveryModeChange("delivery")}
          />
          <span className="delivery-option-title">Delivery</span>
          <span className="delivery-option-note">₱49 fee</span>
        </label>
      </div>
      <div className="summary-lines">
        <div>
          <span>Subtotal</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <div>
          <span>Delivery fee</span>
          <strong>{deliveryFee ? formatPrice(deliveryFee) : "—"}</strong>
        </div>
        <div className="summary-total">
          <span>Total</span>
          <strong>{formatPrice(total)}</strong>
        </div>
      </div>
      <button
        className="button button-accent place-order-button"
        type="button"
        onClick={onPlaceOrder}
        disabled={disabled}
      >
        Place Order <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
