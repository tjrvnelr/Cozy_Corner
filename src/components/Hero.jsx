import { ArrowRightIcon } from "./Icons.jsx";

const heroImage =
  "/manus-storage/async-images/vPmaq8qSR3Wy2wW4L48Lh1/image-1.webp";

export default function Hero({ onExplore, onPopular }) {
  return (
    <section className="hero section-wrap" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title">
          Made for Comfort,
          <br />
          <em>Made for You.</em>
        </h1>
        <p className="hero-description">
          Cozy Corner is a warm and welcoming place for comforting food, freshly served with care.
        </p>
        <div className="hero-actions">
          <button
            className="button button-accent"
            type="button"
            onClick={onExplore}
          >
            Explore Menu <ArrowRightIcon />
          </button>
          <button
            className="button button-text"
            type="button"
            onClick={onPopular}
          >
            View Popular <span aria-hidden="true">↓</span>
          </button>
        </div>
      </div>
      <div className="hero-visual">
        <img
          className="hero-image"
          src={heroImage}
          alt="A freshly made cheeseburger, golden fries, and a chilled citrus drink"
          fetchPriority="high"
          onError={(event) => {
            const image = event.currentTarget;
            if (!image.dataset.fallback) {
              image.dataset.fallback = "true";
              image.src =
                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1100&q=82";
            }
          }}
        />
        <span className="hero-stamp" aria-hidden="true">
          <span>COZY</span>
          <span>FLAVORS</span>
          <span className="stamp-star">✳</span>
        </span>
      </div>
    </section>
  );
}
