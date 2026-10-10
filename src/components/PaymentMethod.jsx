import { useEffect, useRef, useState } from "react";
import { formatPrice } from "../data/menuData.js";
import { CloseIcon } from "./Icons.jsx";

const gcashQrPath = import.meta.env.VITE_GCASH_QR_PATH;
const mayaQrPath = import.meta.env.VITE_MAYA_QR_PATH;

const paymentMethods = {
  gcash: {
    label: "GCash",
    description: "Scan or open GCash to pay",
    qrLabel: "GCash / QRPh merchant QR",
    qrSrc: import.meta.env.VITE_GCASH_QR_PATH || gcashQrPath,
  },
  maya: {
    label: "Maya",
    description: "Scan or open Maya to pay",
    qrLabel: "Maya / QRPh merchant QR",
    qrSrc: import.meta.env.VITE_MAYA_QR_PATH || mayaQrPath,
  },
  cashier: {
    label: "Face-to-face cashier",
    description: "Pay in person when you arrive",
  },
};

export default function PaymentMethod({ order, onCancel, onPaid }) {
  const dialogRef = useRef(null);
  const [selectedMethod, setSelectedMethod] = useState("gcash");
  const selected = paymentMethods[selectedMethod];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") onCancel();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const nodes = [
        ...dialogRef.current.querySelectorAll(
          "button:not(:disabled), a[href], input:not(:disabled)",
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
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      if (
        previouslyFocused instanceof HTMLElement &&
        previouslyFocused.isConnected
      ) {
        requestAnimationFrame(() =>
          previouslyFocused.focus({ preventScroll: true }),
        );
      }
    };
  }, [onCancel]);

  const finishPayment = () => {
    onPaid({
      method: selectedMethod,
      status: selectedMethod === "cashier" ? "pay_at_cashier" : "paid",
    });
  };

  return (
    <div
      className="modal-backdrop payment-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        className="payment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-title"
        ref={dialogRef}
        tabIndex={-1}
      >
        <button
          className="modal-close"
          type="button"
          onClick={onCancel}
          aria-label="Close payment"
        >
          <CloseIcon />
        </button>

        <p className="eyebrow">Almost there</p>
        <h2 id="payment-title">Choose how to pay.</h2>
        <p className="payment-intro">
          Order <strong>#{order.number}</strong> · Total{" "}
          <strong>{formatPrice(order.total)}</strong>
        </p>

        <div
          className="payment-method-options"
          role="radiogroup"
          aria-label="Payment method"
        >
          {Object.entries(paymentMethods).map(([id, method]) => (
            <label
              className={
                "payment-method-option" +
                (selectedMethod === id ? " selected" : "")
              }
              key={id}
            >
              <input
                type="radio"
                name="payment-method"
                value={id}
                checked={selectedMethod === id}
                onChange={() => setSelectedMethod(id)}
              />
              <span className="payment-method-copy">
                <strong>{method.label}</strong>
                <small>{method.description}</small>
              </span>
            </label>
          ))}
        </div>

        {selectedMethod === "cashier" ? (
          <div className="cashier-payment-note">
            <span className="cashier-payment-icon" aria-hidden="true">
              ₱
            </span>
            <div>
              <strong>Pay at the cashier</strong>
              <p>Show your order number at the counter and pay face-to-face.</p>
            </div>
          </div>
        ) : (
          <div className="digital-payment-panel">
            <div className="payment-qr-wrap">
              <img
                src={selected.qrSrc}
                alt={selected.label + " merchant QR code"}
              />
              <span>{selected.qrLabel}</span>
            </div>
            <div className="digital-payment-copy">
              <h3>Pay with {selected.label}</h3>
              <p>
                Scan the QR code with your {selected.label} app
              </p>
            </div>
          </div>
        )}

        <p className="payment-disclaimer">
          {selectedMethod === "cashier"
            ? "Your order will be marked for payment at the cashier."
            : "After paying, tap the button below to finish your order."}
        </p>
        <button
          className="button button-accent payment-complete-button"
          type="button"
          onClick={finishPayment}
        >
          {selectedMethod === "cashier"
            ? "Confirm cashier payment"
            : "I've completed payment"}{" "}
          <span aria-hidden="true">→</span>
        </button>
      </section>
    </div>
  );
}
