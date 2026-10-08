export default function Toast({ message, kind = "success" }) {
  return (
    <div className={`toast toast-${kind}`} role="status" aria-live="polite">
      <span className="toast-check" aria-hidden="true">
        {kind === "error" ? "!" : kind === "favorite" ? "♡" : "✓"}
      </span>
      <span>{message}</span>
    </div>
  );
}
