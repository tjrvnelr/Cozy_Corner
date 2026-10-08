import { useEffect, useRef } from "react";
import { formatPrice } from "../data/menuData.js";
import { CloseIcon } from "./Icons.jsx";

export default function ConfirmationModal({ order, onClose, onBack }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const previous = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && dialogRef.current) {
        const nodes = [
          ...dialogRef.current.querySelectorAll(
            "button:not(:disabled), a[href]",
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
      document.body.style.overflow = previous;
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
      className="modal-backdrop confirmation-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="confirmation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        ref={dialogRef}
        tabIndex={-1}
      >
        <button
          className="modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close order confirmation"
        >
          <CloseIcon />
        </button>
        <div className="confirmation-seal" aria-hidden="true">
          <span>✓</span>
        </div>
        <h2 id="confirmation-title">
          Order received.
          <br />
          <em>Good choice.</em>
        </h2>
        <p className="confirmation-number">
          Order <strong>#{order.number}</strong> <span>·</span>{" "}
          {order.mode === "delivery" ? "Delivery" : "Pickup"}
        </p>
        <div className="confirmation-items">
          {order.items.map((item) => (
            <div key={item.lineId}>
              <span>
                {item.quantity} × {item.name}
                {item.option && item.option !== "Regular"
                  ? ` · ${item.option}`
                  : ""}
              </span>
              <strong>{formatPrice(item.lineTotal)}</strong>
            </div>
          ))}
        </div>
        <div className="confirmation-total">
          <span>Total</span>
          <strong>{formatPrice(order.total)}</strong>
        </div>
        <div className="eta-box">
          <span />
          <span>
            <b>Estimated</b>{" "}
            <b>{order.mode === "delivery" ? "delivery " : "Preparing "}</b>
            <b>time</b>
          </span>
          <strong>{order.eta}</strong>
        </div>
        <button
          className="button button-accent confirmation-return"
          type="button"
          onClick={onBack}
        >
          Back to Menu <span aria-hidden="true">↗</span>
        </button>
      </section>
    </div>
  );
}
