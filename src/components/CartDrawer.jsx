import { useEffect, useRef } from "react";
import CartItem from "./CartItem.jsx";
import OrderSummary from "./OrderSummary.jsx";
import { BagIcon, CloseIcon } from "./Icons.jsx";

export default function CartDrawer({
  open,
  items,
  subtotal,
  count,
  deliveryMode,
  deliveryFee,
  total,
  onDeliveryModeChange,
  onClose,
  onClear,
  onUpdateQuantity,
  onPlaceOrder,
}) {
  const panelRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const priorOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && panelRef.current) {
        const nodes = [
          ...panelRef.current.querySelectorAll(
            "button:not(:disabled), input:not(:disabled), a[href]",
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
        !panelRef.current &&
        previouslyFocused instanceof HTMLElement &&
        previouslyFocused.isConnected
      )
        requestAnimationFrame(() =>
          previouslyFocused.focus({ preventScroll: true }),
        );
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="drawer-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        ref={panelRef}
        tabIndex={-1}
      >
        <header className="drawer-header">
          <div>
            <h2 id="cart-title">
              Your order <span className="drawer-count">{count}</span>
            </h2>
          </div>
          <button
            className="modal-close"
            type="button"
            onClick={onClose}
            aria-label="Close cart"
          >
            <CloseIcon />
          </button>
        </header>
        {items.length ? (
          <>
            <div className="cart-items-list">
              <div className="cart-list-caption">
                <span>
                  {count} {count === 1 ? "item" : "items"} in your bag
                </span>
                <button type="button" onClick={onClear}>
                  Clear all
                </button>
              </div>
              {items.map((item) => (
                <CartItem
                  key={item.lineId}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                />
              ))}
            </div>
            <OrderSummary
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
              deliveryMode={deliveryMode}
              onDeliveryModeChange={onDeliveryModeChange}
              onPlaceOrder={onPlaceOrder}
              disabled={!items.length}
            />
          </>
        ) : (
          <div className="empty-cart">
            <span className="empty-cart-icon">
              <BagIcon size={28} />
            </span>
            <h3>Your bag is taking a little break.</h3>
            <p>Find something delicious and add it here.</p>
            <button
              className="button button-dark"
              type="button"
              onClick={onClose}
            >
              Explore the menu <span aria-hidden="true">↗</span>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
