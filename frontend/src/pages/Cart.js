import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  :root {
    --black:  #000000;
    --dark:   #0a0a0a;
    --panel:  #111111;
    --gold:   #C9A84C;
    --gold2:  #E2B84A;
    --yellow: #D4C028;
    --white:  #FFFFFF;
    --muted:  #888888;
    --border: rgba(201,168,76,0.2);
    --red:    rgba(180,60,40,0.85);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--black); color: var(--white); font-family: 'Jost', sans-serif; overflow-x: hidden; }

  /* ── PAGE ───────────────────────────────────────────────────────── */
  .cart-page {
    min-height: 100svh;
    background: var(--black);
    display: flex;
    flex-direction: column;
  }

  /* ── HERO ───────────────────────────────────────────────────────── */
  .cart-hero {
    position: relative;
    padding: 10rem 3rem 4rem;
    border-bottom: 1px solid var(--border);
    overflow: hidden;
  }
  .cart-hero__wordmark {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none; user-select: none; z-index: 0;
  }
  .cart-hero__wordmark span {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(8rem, 20vw, 18rem);
    color: transparent;
    -webkit-text-stroke: 1px rgba(201,168,76,0.07);
    white-space: nowrap; letter-spacing: 0.02em;
  }
  .cart-hero__glow {
    position: absolute; bottom: -80px; right: -80px;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(180,130,40,0.1) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .cart-hero__content {
    position: relative; z-index: 1;
    display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; flex-wrap: wrap;
  }
  .cart-hero__eyebrow {
    font-size: 0.68rem; letter-spacing: 0.28em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 1rem;
    animation: fadeUp 0.7s ease forwards 0.2s; opacity: 0;
  }
  .cart-hero__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 7vw, 6.5rem);
    letter-spacing: 0.03em; color: var(--white); line-height: 0.95;
    animation: fadeUp 0.8s ease forwards 0.3s; opacity: 0;
  }
  .cart-hero__title span { color: var(--gold); }
  .cart-hero__meta {
    font-size: 0.78rem; color: var(--muted); letter-spacing: 0.06em;
    animation: fadeUp 0.8s ease forwards 0.45s; opacity: 0;
    align-self: flex-end; padding-bottom: 0.4rem;
  }
  .cart-hero__meta span { color: var(--white); }

  /* ── LAYOUT ─────────────────────────────────────────────────────── */
  .cart-layout {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 380px;
    align-items: start;
    gap: 0;
    border-bottom: 1px solid var(--border);
  }

  /* ── ITEMS COLUMN ───────────────────────────────────────────────── */
  .cart-items {
    border-right: 1px solid var(--border);
    padding: 3rem;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .cart-items__header {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
    margin-bottom: 0;
  }
  .cart-items__col {
    font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted);
  }
  .cart-items__col--right { text-align: right; }

  /* single item row */
  .cart-item {
    display: grid;
    grid-template-columns: 64px 1fr auto auto;
    align-items: center;
    gap: 1.5rem;
    padding: 1.75rem 0;
    border-bottom: 1px solid var(--border);
    transition: background 0.2s;
    animation: fadeUp 0.5s ease both;
  }

  /* image thumbnail */
  .cart-item__img {
    width: 64px; height: 80px;
    background: var(--panel);
    border: 1px solid var(--border);
    overflow: hidden;
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; color: var(--muted);
  }
  .cart-item__img img {
    width: 100%; height: 100%; object-fit: cover; object-position: center;
    filter: brightness(0.9);
  }

  /* name + category */
  .cart-item__info { display: flex; flex-direction: column; gap: 0.3rem; min-width: 0; }
  .cart-item__category {
    font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold);
  }
  .cart-item__name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem; font-weight: 400; color: var(--white); line-height: 1.2;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .cart-item__unit {
    font-size: 0.72rem; color: var(--muted);
  }

  /* qty stepper */
  .cart-item__qty {
    display: flex; align-items: center; gap: 0;
    border: 1px solid var(--border);
    flex-shrink: 0;
  }
  .cart-item__qty-btn {
    width: 2rem; height: 2rem;
    background: transparent; border: none; color: var(--muted);
    font-size: 1rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, color 0.2s;
    flex-shrink: 0;
  }
  .cart-item__qty-btn:hover { background: var(--panel); color: var(--white); }
  .cart-item__qty-num {
    width: 2.5rem; text-align: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem; letter-spacing: 0.08em; color: var(--white);
    border-left: 1px solid var(--border); border-right: 1px solid var(--border);
    line-height: 2rem;
  }

  /* subtotal + remove */
  .cart-item__right {
    display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem; flex-shrink: 0;
  }
  .cart-item__subtotal {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.3rem; letter-spacing: 0.06em; color: var(--gold); line-height: 1;
  }
  .cart-item__remove {
    background: transparent; border: none;
    font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(136,136,136,0.5); cursor: pointer;
    transition: color 0.2s; padding: 0;
  }
  .cart-item__remove:hover { color: #e05a4a; }

  /* continue shopping */
  .cart-continue {
    display: inline-flex; align-items: center; gap: 0.5rem;
    margin-top: 2rem;
    font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); text-decoration: none;
    transition: color 0.2s;
  }
  .cart-continue:hover { color: var(--gold); }

  /* ── SUMMARY COLUMN ─────────────────────────────────────────────── */
  .cart-summary {
    padding: 3rem 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    position: sticky;
    top: 0;
  }

  .cart-summary__title {
    font-size: 0.65rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold);
    padding-bottom: 1.5rem; border-bottom: 1px solid var(--border);
  }

  .cart-summary__rows { display: flex; flex-direction: column; gap: 0; }
  .cart-summary__row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.9rem 0; border-bottom: 1px solid rgba(201,168,76,0.08);
  }
  .cart-summary__row-label { font-size: 0.82rem; color: var(--muted); }
  .cart-summary__row-val   { font-size: 0.82rem; color: var(--white); }
  .cart-summary__row-val--gold { color: var(--gold); font-weight: 500; }
  .cart-summary__row-val--free {
    font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: #6dbf82; font-weight: 500;
  }

  .cart-summary__total {
    display: flex; justify-content: space-between; align-items: baseline;
    padding-top: 1.5rem; border-top: 1px solid var(--border);
  }
  .cart-summary__total-label {
    font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted);
  }
  .cart-summary__total-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.2rem; letter-spacing: 0.05em; color: var(--gold); line-height: 1;
  }

  /* loyalty points preview */
  .cart-loyalty {
    background: var(--panel);
    border: 1px solid var(--border);
    padding: 1.2rem 1.5rem;
    display: flex; align-items: center; gap: 1rem;
  }
  .cart-loyalty__icon { font-size: 1.3rem; }
  .cart-loyalty__text { font-size: 0.78rem; color: var(--muted); line-height: 1.5; }
  .cart-loyalty__text strong { color: var(--gold); font-weight: 500; display: block; }

  /* promo code */
  .cart-promo {
    display: flex; gap: 0;
    border: 1px solid var(--border);
  }
  .cart-promo__input {
    flex: 1; background: transparent; border: none;
    font-family: 'Jost', sans-serif; font-size: 0.8rem; color: var(--white);
    padding: 0.75rem 1rem; outline: none; letter-spacing: 0.05em;
  }
  .cart-promo__input::placeholder { color: var(--muted); }
  .cart-promo__btn {
    background: transparent; border: none; border-left: 1px solid var(--border);
    font-family: 'Jost', sans-serif; font-size: 0.72rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold);
    padding: 0.75rem 1.25rem; cursor: pointer; transition: background 0.2s;
    white-space: nowrap;
  }
  .cart-promo__btn:hover { background: rgba(201,168,76,0.08); }

  /* checkout button */
  .cart-checkout {
    display: flex; align-items: center; justify-content: center; gap: 0.6rem;
    background: var(--yellow); color: var(--black);
    font-family: 'Jost', sans-serif; font-size: 0.85rem; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    border: none; padding: 1.1rem 2rem; cursor: pointer; text-decoration: none;
    transition: background 0.2s, transform 0.15s;
    width: 100%; text-align: center;
  }
  .cart-checkout:hover { background: var(--gold2); transform: translateY(-2px); }

  .cart-summary__secure {
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    font-size: 0.68rem; color: var(--muted); letter-spacing: 0.06em;
  }

  /* ── EMPTY STATE ────────────────────────────────────────────────── */
  .cart-empty {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 2rem; padding: 8rem 2rem; text-align: center;
  }
  .cart-empty__icon {
    font-size: 4rem; opacity: 0.25;
    animation: fadeUp 0.8s ease forwards; opacity: 0;
  }
  .cart-empty__title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 300; color: var(--white);
    animation: fadeUp 0.8s ease forwards 0.15s; opacity: 0;
  }
  .cart-empty__title em { font-style: italic; color: var(--gold); }
  .cart-empty__sub {
    font-size: 0.88rem; color: var(--muted); max-width: 36ch; line-height: 1.8;
    animation: fadeUp 0.8s ease forwards 0.3s; opacity: 0;
  }
  .cart-empty__cta {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--yellow); color: var(--black);
    font-family: 'Jost', sans-serif; font-size: 0.82rem; font-weight: 500;
    letter-spacing: 0.08em; border: none; padding: 0.85rem 2.2rem;
    border-radius: 3px; cursor: pointer; text-decoration: none;
    transition: background 0.2s, transform 0.15s;
    animation: fadeUp 0.8s ease forwards 0.45s; opacity: 0;
  }
  .cart-empty__cta:hover { background: var(--gold2); transform: translateY(-2px); }

  /* ── FOOTER ─────────────────────────────────────────────────────── */
  .yt-footer {
    background: var(--black); border-top: 1px solid var(--border);
    padding: 2rem 3rem; display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 1rem; font-family: 'Jost', sans-serif;
  }
  .yt-footer__brand { font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; letter-spacing: 0.2em; color: var(--gold); }
  .yt-footer__links { display: flex; gap: 2rem; list-style: none; }
  .yt-footer__links a { font-size: 0.72rem; letter-spacing: 0.08em; color: var(--muted); text-decoration: none; text-transform: uppercase; transition: color 0.2s; }
  .yt-footer__links a:hover { color: var(--gold); }
  .yt-footer__copy { font-size: 0.72rem; color: rgba(136,136,136,0.5); }

  /* ── KEYFRAMES ──────────────────────────────────────────────────── */
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

  /* ── RESPONSIVE ─────────────────────────────────────────────────── */
  @media (max-width: 900px) {
    .cart-layout { grid-template-columns: 1fr; }
    .cart-items  { border-right: none; padding: 2rem 1.5rem; }
    .cart-summary { position: static; border-top: 1px solid var(--border); padding: 2rem 1.5rem; }
    .cart-hero { padding: 8rem 1.5rem 3rem; }
    .cart-item { grid-template-columns: 56px 1fr auto; gap: 1rem; }
    .cart-item__right { grid-column: 2 / -1; flex-direction: row; align-items: center; justify-content: space-between; }
    .yt-footer { flex-direction: column; align-items: center; text-align: center; }
  }
  @media (max-width: 480px) {
    .cart-items__header { display: none; }
    .cart-item { grid-template-columns: 56px 1fr; }
    .cart-item__qty  { grid-column: 2; }
    .cart-item__right { grid-column: 1 / -1; }
  }
`;

/* ── IMAGE LOADER (same pattern as ProductCard) ─────────────────── */
const getImage = (name) => {
  try {
    return require(`../assets/${name}.png`);
  } catch {
    return null;
  }
};

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, finalTotal } = useCart();

  const subtotal   = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShipping = subtotal >= 50;          // free over SGD 50
  const shipping   = freeShipping ? 0 : 3.50;  // SGD 3.50 flat
  const loyaltyPts = Math.floor(subtotal);       // 1 pt per SGD spent

  const fmt = (val) => `SGD ${Number(val).toFixed(2)}`;

  /* ── EMPTY STATE ──────────────────────────────────────────────── */
  if (cart.length === 0) {
    return (
      <>
        <style>{css}</style>
        <div className="cart-page">
          <div className="cart-empty">
            <span className="cart-empty__icon">🛒</span>
            <h1 className="cart-empty__title">
              Your cart is<br /><em>empty.</em>
            </h1>
            <p className="cart-empty__sub">
              Discover your signature scent from our full Singapore collection —
              pocket-sized luxury, crafted for this city.
            </p>
            <Link to="/products" className="cart-empty__cta">
              Browse the Collection →
            </Link>
          </div>
          <footer className="yt-footer">
            <span className="yt-footer__brand">YOUTHENTIC</span>
            <ul className="yt-footer__links">
              <li><Link to="/products">Shop</Link></li>
              <li><Link to="/brand-story">About</Link></li>
              <li><Link to="/loyalty">Rewards</Link></li>
            </ul>
            <span className="yt-footer__copy">© 2025 Youthentic Fragrances · Singapore</span>
          </footer>
        </div>
      </>
    );
  }

  /* ── FILLED CART ──────────────────────────────────────────────── */
  return (
    <>
      <style>{css}</style>
      <div className="cart-page">

        {/* HERO */}
        <section className="cart-hero">
          <div className="cart-hero__wordmark" aria-hidden="true"><span>YOUR CART</span></div>
          <div className="cart-hero__glow" aria-hidden="true" />
          <div className="cart-hero__content">
            <div>
              <p className="cart-hero__eyebrow">Youthentic Singapore</p>
              <h1 className="cart-hero__title">
                YOUR<br /><span>CART.</span>
              </h1>
            </div>
            <p className="cart-hero__meta">
              <span>{cart.reduce((s, i) => s + i.quantity, 0)}</span>{" "}
              {cart.reduce((s, i) => s + i.quantity, 0) === 1 ? "item" : "items"}
            </p>
          </div>
        </section>

        {/* LAYOUT */}
        <div className="cart-layout">

          {/* ITEMS */}
          <div className="cart-items">
            <div className="cart-items__header">
              <span className="cart-items__col">Product</span>
              <span className="cart-items__col">Qty</span>
              <span className="cart-items__col cart-items__col--right">Subtotal</span>
            </div>

            {cart.map((item, i) => {
              const imgSrc = getImage(item.name);
              return (
                <div
                  key={item.id}
                  className="cart-item"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  {/* thumbnail */}
                  <div className="cart-item__img">
                    {imgSrc
                      ? <img src={imgSrc} alt={item.name} />
                      : <span>🫧</span>
                    }
                  </div>

                  {/* info */}
                  <div className="cart-item__info">
                    {item.category && (
                      <span className="cart-item__category">{item.category}</span>
                    )}
                    <span className="cart-item__name">{item.name}</span>
                    <span className="cart-item__unit">
                    {fmt(item.price)} each
                    {item.variant && item.variant !== "bundle" && (
                      <span style={{marginLeft:"0.4rem", color:"#C9A84C", fontSize:"0.6rem", letterSpacing:"0.1em", textTransform:"uppercase"}}>
                        · {item.variant}
                      </span>
                    )}
                  </span>
                  </div>

                  {/* qty stepper */}
                  <div className="cart-item__qty">
                    <button
                      className="cart-item__qty-btn"
                      onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="cart-item__qty-num">{item.quantity}</span>
                    <button
                      className="cart-item__qty-btn"
                      onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* subtotal + remove */}
                  <div className="cart-item__right">
                    <span className="cart-item__subtotal">
                      {fmt(item.price * item.quantity)}
                    </span>
                    <button
                      className="cart-item__remove"
                      onClick={() => removeFromCart(item.cartKey)}
                      aria-label={`Remove ${item.name}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            <Link to="/products" className="cart-continue">
              ← Continue Shopping
            </Link>
          </div>

          {/* SUMMARY */}
          <div className="cart-summary">
            <p className="cart-summary__title">Order Summary</p>

            <div className="cart-summary__rows">
              <div className="cart-summary__row">
                <span className="cart-summary__row-label">Subtotal</span>
                <span className="cart-summary__row-val">{fmt(subtotal)}</span>
              </div>
              <div className="cart-summary__row">
                <span className="cart-summary__row-label">Shipping</span>
                {freeShipping
                  ? <span className="cart-summary__row-val--free">Free 🇸🇬</span>
                  : <span className="cart-summary__row-val">{fmt(shipping)}</span>
                }
              </div>
              {!freeShipping && (
                <div className="cart-summary__row">
                  <span className="cart-summary__row-label" style={{ fontSize: "0.72rem", fontStyle: "italic" }}>
                    Add {fmt(50 - subtotal)} more for free shipping
                  </span>
                </div>
              )}
            </div>

            <div className="cart-summary__total">
              <span className="cart-summary__total-label">Total</span>
              <span className="cart-summary__total-val">
                {fmt((finalTotal ?? subtotal) + shipping)}
              </span>
            </div>

            {/* loyalty preview */}
            <div className="cart-loyalty">
              <span className="cart-loyalty__icon">✦</span>
              <div className="cart-loyalty__text">
                <strong>+{loyaltyPts} Youthentic Points</strong>
                You'll earn points on this order to redeem on future purchases.
              </div>
            </div>

            {/* promo code */}
            <div className="cart-promo">
              <input
                className="cart-promo__input"
                type="text"
                placeholder="Promo code"
                aria-label="Promo code"
              />
              <button className="cart-promo__btn">Apply</button>
            </div>

            {/* checkout */}
            <Link to="/checkout" className="cart-checkout">
              Proceed to Checkout →
            </Link>

            <p className="cart-summary__secure">
              🔒 &nbsp;Secure checkout · Powered by Stripe
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="yt-footer">
          <span className="yt-footer__brand">YOUTHENTIC</span>
          <ul className="yt-footer__links">
            <li><Link to="/products">Shop</Link></li>
            <li><Link to="/brand-story">About</Link></li>
            <li><Link to="/loyalty">Rewards</Link></li>
            <li><Link to="/admin">Admin</Link></li>
          </ul>
          <span className="yt-footer__copy">© 2025 Youthentic Fragrances · Singapore</span>
        </footer>
      </div>
    </>
  );
};

export default Cart;