import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import FeaturedSection from "./components/FeaturedSection.jsx";
import CategoryFilter from "./components/CategoryFilter.jsx";
import SearchSortBar from "./components/SearchSortBar.jsx";
import FoodGrid from "./components/FoodGrid.jsx";
import FoodModal from "./components/FoodModal.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import PaymentMethod from "./components/PaymentMethod.jsx";
import ConfirmationModal from "./components/ConfirmationModal.jsx";
import Toast from "./components/Toast.jsx";
import Footer from "./components/Footer.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import FeedbackModal from "./components/ReviewsModal.jsx";
import {
  categories,
  formatPrice,
  priceForOption,
} from "./data/menuData.js";
import { usePersistentState } from "./hooks/usePersistentState.js";
import { supabase } from "./lib/supabase.js";

const DELIVERY_FEE = 49;

export default function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = usePersistentState("foodmenu.cart.v1", []);
  const [favorites, setFavorites] = usePersistentState(
    "foodmenu.favorites.v1",
    [],
  );
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("popular");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState("pickup");
  const [paymentOrder, setPaymentOrder] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = usePersistentState("foodmenu.theme.v1", "light");
  const [isLoading, setIsLoading] = useState(true);
  const searchRef = useRef(null);
  const toastTimer = useRef(null);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const closeDetails = useCallback(() => setSelectedItem(null), []);
  const closeConfirmation = useCallback(() => setConfirmation(null), []);
  const closeFeedback = useCallback(() => setFeedbackOpen(false), []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const { data, error } = await supabase
          .from("menu_items")
          .select("*")
          .order("name");
        
        if (error) throw error;
        setMenuItems(data || []);
      } catch (err) {
        console.error("Error fetching menu:", err);
        showToast("Failed to load menu", "error");
      } finally {
        setIsLoading(false);
      }
    }
    fetchMenu();
  }, []);

  useLayoutEffect(() => {
    const nextTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
  }, [theme]);

  const showToast = (message, kind = "success") => {
    window.clearTimeout(toastTimer.current);
    setToast({ message, kind, key: Date.now() });
    toastTimer.current = window.setTimeout(() => setToast(null), 2700);
  };

  const toggleFavorite = (item) => {
    if (!item || typeof item.id !== "string") return;
    const isSaved = favorites.includes(item.id);
    setFavorites((current) =>
      isSaved ? current.filter((id) => id !== item.id) : [...current, item.id],
    );
    showToast(
      isSaved
        ? `${item.name} removed from favorites`
        : `${item.name} added to favorites`,
      "favorite",
    );
  };

  const addToCart = (item, quantity = 1, option) => {
    if (!item || typeof item.id !== "string") {
      showToast("This menu item is unavailable", "error");
      return;
    }
    if (!item.available) {
      showToast("This item is currently unavailable", "error");
      return;
    }
    const chosenOption = option || item.options?.[0] || "Regular";
    const lineId = `${item.id}::${chosenOption}`;
    const unitPrice = priceForOption(item, chosenOption);
    setCart((current) => {
      const safeCurrent = Array.isArray(current)
        ? current.filter((line) => line && typeof line.lineId === "string")
        : [];
      const existing = safeCurrent.find((line) => line.lineId === lineId);
      if (existing) {
        return safeCurrent.map((line) =>
          line.lineId === lineId
            ? { ...line, quantity: Number(line.quantity || 0) + quantity }
            : line,
        );
      }
      return [
        ...safeCurrent,
        { lineId, id: item.id, option: chosenOption, quantity, unitPrice },
      ];
    });
    setSelectedItem(null);
    showToast(`${item.name} added to your order`);
  };

  const updateQuantity = (lineId, nextQuantity) => {
    setCart((current) => {
      const safeCurrent = Array.isArray(current)
        ? current.filter((line) => line && typeof line.lineId === "string")
        : [];
      return nextQuantity <= 0
        ? safeCurrent.filter((line) => line.lineId !== lineId)
        : safeCurrent.map((line) =>
            line.lineId === lineId ? { ...line, quantity: nextQuantity } : line,
          );
    });
  };

  const cartItems = useMemo(
    () =>
      (Array.isArray(cart) ? cart : []).flatMap((line) => {
        if (!line || typeof line.id !== "string") return [];
        const item = menuItems.find((candidate) => candidate.id === line.id);
        const quantity = Math.floor(Number(line.quantity));
        if (!item || !Number.isFinite(quantity) || quantity < 1) return [];
        const option = line.option || item.options?.[0] || "Regular";
        const unitPrice = priceForOption(item, option);
        return [
          {
            ...item,
            basePrice: item.price,
            price: unitPrice,
            lineId: line.lineId || `${item.id}::${option}`,
            option,
            quantity,
            lineTotal: unitPrice * quantity,
          },
        ];
      }),
    [cart],
  );
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryFee =
    deliveryMode === "delivery" && cartItems.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const visibleItems = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    const rows = menuItems.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesFavorite = !favoritesOnly || favorites.includes(item.id);
      const matchesSearch =
        !normalized ||
        `${item.name} ${item.category} ${item.description}`
          .toLocaleLowerCase()
          .includes(normalized);
      return matchesCategory && matchesFavorite && matchesSearch;
    });
    return rows.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return (
        Number(b.popular) - Number(a.popular) || a.name.localeCompare(b.name)
      );
    });
  }, [category, favoritesOnly, favorites, query, sort]);

  const placeOrder = () => {
    if (!cartItems.length) return;
    const fee = deliveryMode === "delivery" ? DELIVERY_FEE : 0;
    const order = {
      number: `CC-${String(Date.now()).slice(-6)}`,
      items: cartItems.map((item) => ({ ...item })),
      subtotal,
      deliveryFee: fee,
      total: subtotal + fee,
      mode: deliveryMode,
      eta: deliveryMode === "delivery" ? "35–45 minutes" : "20–30 minutes",
      orderedAt: new Date().toISOString(),
    };
    setPaymentOrder(order);
    setCartOpen(false);
  };

  const completePayment = ({ customerName, method, status }) => {
    if (!paymentOrder) return;
    setConfirmation({
      ...paymentOrder,
      customerName,
      paymentMethod: method,
      paymentStatus: status,
    });
    setPaymentOrder(null);
    setCart([]);
  };

  const scrollTo = (id) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="app-shell" id="top">
      {isLoading && <LoadingScreen />}
      <Navbar
        query={query}
        onQueryChange={setQuery}
        favoritesOnly={favoritesOnly}
        onToggleFavorites={() => {
          setFavoritesOnly((current) => !current);
          scrollTo("menu");
        }}
        favoritesCount={favorites.length}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onFocusSearch={() => searchRef.current?.focus()}
        theme={theme}
        onToggleTheme={() =>
          setTheme((current) => (current === "dark" ? "light" : "dark"))
        }
      />
      <main>
        <Hero
          onExplore={() => scrollTo("menu")}
          onPopular={() => scrollTo("featured")}
        />
        <FeaturedSection
          items={menuItems
            .filter((item) => item.popular && item.available)
            .slice(0, 4)}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onAdd={addToCart}
          onDetails={setSelectedItem}
          onViewAll={() => scrollTo("menu")}
        />
        <section
          className="menu-section section-wrap"
          id="menu"
          aria-labelledby="menu-title"
        >
          <div className="menu-heading">
            <div>
              <p className="eyebrow">Made fresh, made for you</p>
              <h2 id="menu-title">Find your favorite.</h2>
              <p className="section-description">
                A little comfort, ready when you are.
              </p>
            </div>
            <div className="menu-count">
              <span>{visibleItems.length.toString().padStart(2, "0")}</span>{" "}
              dishes to explore
            </div>
          </div>
          <CategoryFilter
            categories={categories}
            active={category}
            onSelect={(next) => {
              setCategory(next);
              setFavoritesOnly(false);
            }}
          />
          <SearchSortBar
            query={query}
            onQueryChange={setQuery}
            sort={sort}
            onSortChange={setSort}
            inputRef={searchRef}
            favoritesOnly={favoritesOnly}
            onClearFavorites={() => setFavoritesOnly(false)}
          />
          <FoodGrid
            items={visibleItems}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onAdd={addToCart}
            onDetails={setSelectedItem}
            onReset={() => {
              setQuery("");
              setCategory("All");
              setFavoritesOnly(false);
            }}
          />
        </section>
      </main>
      <Footer
        onMenu={() => scrollTo("menu")}
        onPopular={() => scrollTo("featured")}
        onFeedback={() => setFeedbackOpen(true)}
      />
      <CartDrawer
        open={cartOpen}
        items={cartItems}
        subtotal={subtotal}
        count={cartCount}
        deliveryMode={deliveryMode}
        deliveryFee={deliveryFee}
        total={total}
        onDeliveryModeChange={setDeliveryMode}
        onClose={closeCart}
        onClear={() => {
          setCart([]);
          showToast("Your cart has been cleared");
        }}
        onUpdateQuantity={updateQuantity}
        onPlaceOrder={placeOrder}
      />
      {paymentOrder && (
        <PaymentMethod
          order={paymentOrder}
          onCancel={() => {
            setPaymentOrder(null);
            setCartOpen(true);
          }}
          onPaid={completePayment}
        />
      )}
      {selectedItem && (
        <FoodModal
          key={selectedItem.id}
          item={selectedItem}
          favorite={favorites.includes(selectedItem.id)}
          onToggleFavorite={() => toggleFavorite(selectedItem)}
          onAdd={addToCart}
          onClose={closeDetails}
        />
      )}
      {confirmation && (
        <ConfirmationModal
          order={confirmation}
          onClose={closeConfirmation}
          onBack={() => {
            setConfirmation(null);
            scrollTo("menu");
          }}
        />
      )}
      {feedbackOpen && (
        <FeedbackModal
          onClose={closeFeedback}
          onSubmit={() => {
            setFeedbackOpen(false);
            showToast("Thanks for sharing your feedback!");
          }}
        />
      )}
      {toast && (
        <Toast key={toast.key} message={toast.message} kind={toast.kind} />
      )}
      {cartCount > 0 && !cartOpen && (
        <button
          className="mobile-cart-pill"
          type="button"
          onClick={() => setCartOpen(true)}
          aria-label={`Open cart with ${cartCount} ${cartCount === 1 ? "item" : "items"}, ${formatPrice(subtotal)}`}
        >
          <span className="mobile-cart-label">
            Your order <span className="mobile-cart-count">{cartCount}</span>
          </span>
          <strong>{formatPrice(subtotal)}</strong>
        </button>
      )}
    </div>
  );
}
