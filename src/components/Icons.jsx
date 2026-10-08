export function SearchIcon({ size = 18 }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="10.8"
        cy="10.8"
        r="6.8"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m16 16 4.4 4.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HeartIcon({ size = 18, filled = false }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
    >
      <path
        d="M20.3 8.8c0 4-8.3 10-8.3 10s-8.3-6-8.3-10a4.6 4.6 0 0 1 8.3-2.7 4.6 4.6 0 0 1 8.3 2.7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BagIcon({ size = 19 }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M5 8.5h14l1 12H4l1-12Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9 9V6.3a3 3 0 0 1 6 0V9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArrowRightIcon({ size = 17 }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M4.5 12h14m-5.5-5.5 5.5 5.5-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloseIcon({ size = 18 }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PlusIcon({ size = 15 }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MinusIcon({ size = 15 }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LeafMark({ size = 20 }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10.4"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M8 15.9c.8-4.6 4.1-7.5 8.5-8.1-.2 4.6-3 7.9-8.5 8.1Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="m8.2 16 5.7-5.8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
