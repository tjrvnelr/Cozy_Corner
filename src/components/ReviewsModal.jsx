import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "./Icons.jsx";

const ratingLabels = ["Very poor", "Needs work", "Good", "Very good", "Excellent"];

export default function FeedbackModal({ onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const dialogRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && dialogRef.current) {
        const nodes = [
          ...dialogRef.current.querySelectorAll(
            "button:not(:disabled), textarea",
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
  }, [onClose]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!rating) return;
    onSubmit({ rating, comment });
  };

  return (
    <div
      className="modal-backdrop feedback-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="feedback-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        ref={dialogRef}
        tabIndex={-1}
      >
        <button
          className="modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close feedback form"
        >
          <CloseIcon />
        </button>
        <p className="eyebrow">Your experience matters</p>
        <h2 id="feedback-title">Tell us how we did.</h2>
        <p className="feedback-intro">
          Your thoughts help us make every visit a little cozier.
        </p>
        <form onSubmit={handleSubmit}>
          <fieldset className="feedback-rating-fieldset">
            <legend>How would you rate your experience?</legend>
            <div className="feedback-rating" role="radiogroup">
              {ratingLabels.map((label, index) => {
                const value = index + 1;
                return (
                  <button
                    className={`feedback-star ${rating >= value ? "selected" : ""}`}
                    type="button"
                    key={label}
                    role="radio"
                    aria-checked={rating === value}
                    aria-label={`${value} out of 5: ${label}`}
                    onClick={() => setRating(value)}
                  >
                    ★
                  </button>
                );
              })}
            </div>
            <span className="feedback-rating-label">
              {rating ? ratingLabels[rating - 1] : "Choose a rating"}
            </span>
          </fieldset>
          <label className="feedback-field">
            <span>
              Tell us more <small>Optional</small>
            </span>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="What did you enjoy, or what could we improve?"
              rows="4"
            />
          </label>
          <button
            className="button button-accent feedback-submit"
            type="submit"
            disabled={!rating}
          >
            Send feedback <span aria-hidden="true">→</span>
          </button>
        </form>
      </section>
    </div>
  );
}
