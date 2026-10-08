import { LeafMark } from "./Icons.jsx";

export default function Footer({ onMenu, onPopular }) {
  return (
    <footer className="site-footer">
      <div className="footer-top section-wrap">
        <a
          className="brand footer-brand"
          href="#top"
          aria-label="FoodMenu home"
        >
          <span className="brand-mark">
            <LeafMark size={37} />
          </span>
          <span className="brand-copy">
            <span className="brand-name">Cozy Corner</span>
            <span className="brand-caption">Little Corner of Comfort</span>
          </span>
        </a>
        <p className="footer-note">
          Good things are best shared.
          <br />
          <span>Made with care, served with quality.</span>
        </p>
        <nav className="footer-links" aria-label="Footer navigation">
          <button type="button" onClick={onMenu}>
            Our menu
          </button>
          <button type="button" onClick={onPopular}>
            Popular picks
          </button>
          <a href="#top">Back to top ↑</a>
        </nav>
      </div>
      <div className="footer-bottom section-wrap">
        <span>
          © {new Date().getFullYear()} Cozy Corner. All good things reserved.
        </span>
        <span>Little Corner of Comfort</span>
      </div>
    </footer>
  );
}
