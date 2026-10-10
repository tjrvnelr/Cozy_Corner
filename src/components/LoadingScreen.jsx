export default function LoadingScreen() {
  return (
    <div className="loading-screen" role="status" aria-label="Loading Cozy Corner">
      <div className="loading-art" aria-hidden="true">
        <div className="loading-steam loading-steam-one" />
        <div className="loading-steam loading-steam-two" />
        <svg className="loading-food" viewBox="0 0 100 100" fill="none">
          <ellipse
            className="loading-plate"
            cx="50"
            cy="79"
            rx="35"
            ry="8"
            fill="currentColor"
            opacity="0.16"
          />
          <g className="loading-food-spin">
            <path
              d="M22 47c1-11 12-19 28-19s27 8 28 19H22Z"
              fill="#d97742"
            />
            <path
              d="M24 47h52c0 4-2 7-5 9H29c-3-2-5-5-5-9Z"
              fill="#f5c45e"
            />
            <path d="M27 56h46v8H27v-8Z" fill="#6a7655" />
            <path d="M29 64h42c-2 7-9 10-21 10s-19-3-21-10Z" fill="#a74729" />
            <path
              d="M22 47h56"
              stroke="#87371e"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M29 39c7-4 35-4 42 0"
              stroke="#f5e8e2"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>
        </svg>
      </div>
      <p className="loading-eyebrow">Cozy Corner</p>
      <p className="loading-message">
        Preparing something delicious<span className="loading-dots" aria-hidden="true">...</span>
      </p>
    </div>
  );
}
