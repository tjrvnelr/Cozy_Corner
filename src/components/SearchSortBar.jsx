import { SearchIcon } from "./Icons.jsx";

export default function SearchSortBar({
  query,
  onQueryChange,
  sort,
  onSortChange,
  inputRef,
  favoritesOnly,
  onClearFavorites,
}) {
  return (
    <div className="menu-tools">
      <label className="menu-search">
        <SearchIcon size={19} />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search dishes, ingredients, or flavors"
          aria-label="Search menu by name, category, or description"
        />
        {query && (
          <button
            type="button"
            className="clear-search"
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </label>
      <div className="menu-tools-right">
        {favoritesOnly && (
          <button
            className="favorites-filter-chip"
            type="button"
            onClick={onClearFavorites}
          >
            ♡ Showing saved <span aria-hidden="true">×</span>
          </button>
        )}
        <label className="sort-select-wrap">
          <span>Sort by</span>
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            aria-label="Sort menu items"
          >
            <option value="popular">Popularity</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </label>
      </div>
    </div>
  );
}
