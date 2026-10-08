import { BagIcon, HeartIcon, SearchIcon } from "./Icons.jsx";

export default function Navbar({
  query,
  onQueryChange,
  favoritesOnly,
  onToggleFavorites,
  favoritesCount,
  cartCount,
  onOpenCart,
  onFocusSearch,
}) {
  return (
    <header className="site-header" id="top">
      <div className="topbar section-wrap">
        <a className="brand" href="#top" aria-label="FoodMenu home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 42 42" fill="none">
              <circle
                cx="21"
                cy="21"
                r="19"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M13 25.7c1.4-7.1 6.6-11.4 14.3-12.2-.4 7.4-5 12-14.3 12.2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="m13.5 26 9-9.2"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="brand-copy">
            <span className="brand-name">Cozy Corner</span>
            <span className="brand-caption">Little Corner of Comfort</span>
          </span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#menu">Menu</a>
          <a href="#featured">Popular</a>
        </nav>
        <div className="header-actions">
          <label className="nav-search">
            <SearchIcon size={17} />
            <input
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Find something good"
              aria-label="Search menu by name, category, or description"
            />
            <button
              className="search-jump"
              type="button"
              onClick={onFocusSearch}
              aria-label="Jump to menu search"
            >
              ↵
            </button>
          </label>
          <button
            className={`icon-action favorite-nav ${favoritesOnly ? "active" : ""}`}
            type="button"
            onClick={onToggleFavorites}
            aria-pressed={favoritesOnly}
            aria-label={`${favoritesOnly ? "Show all menu items" : "Show favorites"}${favoritesCount ? `, ${favoritesCount} saved` : ""}`}
          >
            <span className="icon-with-badge">
              <HeartIcon filled={favoritesOnly} />
              <span className="action-label">Saved</span>
              {favoritesCount > 0 && (
                <span className="action-count">{favoritesCount}</span>
              )}
            </span>
          </button>
          <button
            className="icon-action cart-nav"
            type="button"
            onClick={onOpenCart}
            aria-label={`Open cart with ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
          >
            <span className="icon-with-badge">
              <BagIcon />
              <span className="action-label">Cart</span>
              <span className="cart-badge">{cartCount}</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
