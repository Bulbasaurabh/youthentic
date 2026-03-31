import { useState } from "react";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";
import API from "../api/api";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@300;400;500&display=swap');

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
    --green:  #6dbf82;
    --red:    #e05a4a;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--black); color: var(--white); font-family: 'Jost', sans-serif; overflow-x: hidden; }

  /* ── PAGE ───────────────────────────────────────────────────────── */
  .co-page { min-height: 100svh; background: var(--black); display: flex; flex-direction: column; }

  /* ── HERO ───────────────────────────────────────────────────────── */
  .co-hero {
    position: relative; padding: 9rem 3rem 3.5rem;
    border-bottom: 1px solid var(--border); overflow: hidden;
  }
  .co-hero__wordmark {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    pointer-events: none; user-select: none; z-index: 0;
  }
  .co-hero__wordmark span {
    font-family: 'Bebas Neue', sans-serif; font-size: clamp(7rem, 18vw, 16rem);
    color: transparent; -webkit-text-stroke: 1px rgba(201,168,76,0.07);
    white-space: nowrap; letter-spacing: 0.02em;
  }
  .co-hero__glow {
    position: absolute; top: -60px; right: -60px; width: 500px; height: 400px;
    border-radius: 50%; background: radial-gradient(circle, rgba(180,130,40,0.1) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .co-hero__content { position: relative; z-index: 1; }
  .co-hero__eyebrow {
    font-size: 0.68rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold);
    margin-bottom: 0.75rem; animation: fadeUp 0.7s ease forwards 0.2s; opacity: 0;
  }
  .co-hero__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 7vw, 6rem); letter-spacing: 0.03em; color: var(--white); line-height: 0.95;
    animation: fadeUp 0.8s ease forwards 0.3s; opacity: 0;
  }
  .co-hero__title span { color: var(--gold); }

  /* ── STEPS INDICATOR ────────────────────────────────────────────── */
  .co-steps {
    display: flex; align-items: center; gap: 0;
    border-bottom: 1px solid var(--border);
    background: var(--dark);
    padding: 0 3rem;
    overflow-x: auto;
  }
  .co-step {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 1.1rem 2rem 1.1rem 0;
    position: relative; flex-shrink: 0;
  }
  .co-step:not(:last-child)::after {
    content: '›'; color: var(--border); font-size: 1.2rem;
    margin-left: 2rem; position: absolute; right: 0;
  }
  .co-step__num {
    width: 1.6rem; height: 1.6rem; border-radius: 50%;
    border: 1px solid var(--border); display: flex; align-items: center; justify-content: center;
    font-size: 0.65rem; font-weight: 500; color: var(--muted);
    flex-shrink: 0; transition: all 0.3s;
  }
  .co-step__label { font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
  .co-step.active .co-step__num  { background: var(--gold); border-color: var(--gold); color: var(--black); }
  .co-step.active .co-step__label { color: var(--white); }
  .co-step.done .co-step__num   { background: var(--green); border-color: var(--green); color: var(--black); }
  .co-step.done .co-step__label { color: var(--muted); }

  /* ── LAYOUT ─────────────────────────────────────────────────────── */
  .co-layout {
    flex: 1; display: grid; grid-template-columns: 1fr 380px;
    align-items: start;
  }

  /* ── LEFT PANEL ─────────────────────────────────────────────────── */
  .co-left {
    border-right: 1px solid var(--border);
    padding: 3rem; display: flex; flex-direction: column; gap: 2.5rem;
  }

  /* section block */
  .co-section {
    display: flex; flex-direction: column; gap: 1.25rem;
  }
  .co-section__title {
    font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold);
    padding-bottom: 1rem; border-bottom: 1px solid var(--border);
  }

  /* ── DELIVERY OPTION ────────────────────────────────────────────── */
  .co-delivery-opts { display: flex; flex-direction: column; gap: 0; }
  .co-delivery-opt {
    display: flex; align-items: flex-start; gap: 1.25rem;
    padding: 1.5rem; border: 1px solid var(--border);
    cursor: pointer; transition: border-color 0.25s, background 0.25s;
    margin-bottom: -1px; position: relative;
  }
  .co-delivery-opt:hover { border-color: rgba(201,168,76,0.4); z-index: 1; }
  .co-delivery-opt.selected {
    border-color: var(--gold); background: rgba(201,168,76,0.04); z-index: 2;
  }
  .co-delivery-opt__radio {
    width: 1.1rem; height: 1.1rem; border-radius: 50%; border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 0.15rem; transition: border-color 0.2s;
  }
  .co-delivery-opt.selected .co-delivery-opt__radio { border-color: var(--gold); }
  .co-delivery-opt__radio-inner {
    width: 0.5rem; height: 0.5rem; border-radius: 50%; background: var(--gold);
    opacity: 0; transition: opacity 0.2s;
  }
  .co-delivery-opt.selected .co-delivery-opt__radio-inner { opacity: 1; }
  .co-delivery-opt__body { flex: 1; }
  .co-delivery-opt__label {
    font-size: 0.88rem; font-weight: 500; color: var(--white); margin-bottom: 0.25rem;
  }
  .co-delivery-opt__sub { font-size: 0.76rem; color: var(--muted); line-height: 1.5; }
  .co-delivery-opt__price {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem;
    letter-spacing: 0.06em; color: var(--gold); align-self: center; flex-shrink: 0;
  }
  .co-delivery-opt__price--free {
    font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--green); font-family: 'Jost', sans-serif; font-weight: 500;
  }

  /* self collect address */
  .co-collect-info {
    background: var(--panel); border: 1px solid var(--border);
    padding: 1.25rem 1.5rem; display: flex; gap: 1rem; align-items: flex-start;
    animation: fadeUp 0.4s ease;
  }
  .co-collect-info__icon { font-size: 1.2rem; flex-shrink: 0; }
  .co-collect-info__text { font-size: 0.8rem; line-height: 1.7; color: var(--muted); }
  .co-collect-info__text strong { display: block; color: var(--white); margin-bottom: 0.2rem; }

  /* ── ORDER ITEMS RECAP ──────────────────────────────────────────── */
  .co-items { display: flex; flex-direction: column; gap: 0; }
  .co-item {
    display: flex; align-items: center; gap: 1.25rem;
    padding: 1rem 0; border-bottom: 1px solid rgba(201,168,76,0.07);
  }
  .co-item:first-child { padding-top: 0; }
  .co-item__img {
    width: 48px; height: 60px; background: var(--panel);
    border: 1px solid var(--border); flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; color: var(--muted); overflow: hidden;
  }
  .co-item__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.85); }
  .co-item__info { flex: 1; min-width: 0; }
  .co-item__name {
    font-family: 'Cormorant Garamond', serif; font-size: 1rem;
    font-weight: 400; color: var(--white); line-height: 1.2;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .co-item__meta { font-size: 0.7rem; color: var(--muted); margin-top: 0.2rem; }
  .co-item__meta span { color: var(--gold); }
  .co-item__price {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem;
    letter-spacing: 0.05em; color: var(--gold); flex-shrink: 0;
  }

  /* ── RIGHT SUMMARY ──────────────────────────────────────────────── */
  .co-summary {
    padding: 3rem 2.5rem; display: flex; flex-direction: column;
    gap: 1.5rem; position: sticky; top: 0;
  }
  .co-summary__title {
    font-size: 0.65rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold);
    padding-bottom: 1.5rem; border-bottom: 1px solid var(--border);
  }
  .co-summary__rows { display: flex; flex-direction: column; }
  .co-summary__row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.85rem 0; border-bottom: 1px solid rgba(201,168,76,0.07);
    font-size: 0.82rem;
  }
  .co-summary__row-label { color: var(--muted); }
  .co-summary__row-val   { color: var(--white); }
  .co-summary__row-val--gold  { color: var(--gold); }
  .co-summary__row-val--green { color: var(--green); font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500; }

  .co-summary__total {
    display: flex; justify-content: space-between; align-items: baseline;
    padding-top: 1.5rem; border-top: 1px solid var(--border);
  }
  .co-summary__total-label {
    font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted);
  }
  .co-summary__total-val {
    font-family: 'Bebas Neue', sans-serif; font-size: 2.2rem;
    letter-spacing: 0.05em; color: var(--gold); line-height: 1;
  }

  /* loyalty earn */
  .co-loyalty {
    background: var(--panel); border: 1px solid var(--border);
    padding: 1rem 1.25rem; display: flex; gap: 0.75rem; align-items: center;
  }
  .co-loyalty__icon { font-size: 1.1rem; }
  .co-loyalty__text { font-size: 0.75rem; color: var(--muted); line-height: 1.5; }
  .co-loyalty__text strong { color: var(--gold); display: block; font-size: 0.8rem; }

  /* pay button */
  .co-pay-btn {
    display: flex; align-items: center; justify-content: center; gap: 0.75rem;
    background: var(--yellow); color: var(--black);
    font-family: 'Jost', sans-serif; font-size: 0.88rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    border: none; padding: 1.15rem 2rem; cursor: pointer; width: 100%;
    transition: background 0.2s, transform 0.15s;
    position: relative; overflow: hidden;
  }
  .co-pay-btn:hover:not(:disabled) { background: var(--gold2); transform: translateY(-2px); }
  .co-pay-btn:disabled { background: #1a1a1a; color: #555; cursor: not-allowed; transform: none; }
  .co-pay-btn.loading { background: #1a1a1a; color: var(--gold); pointer-events: none; }

  /* spinner */
  .co-spinner {
    width: 1rem; height: 1rem; border-radius: 50%;
    border: 2px solid rgba(201,168,76,0.2);
    border-top-color: var(--gold);
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  .co-secure {
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    font-size: 0.68rem; color: var(--muted); letter-spacing: 0.06em;
  }

  /* error banner */
  .co-error {
    background: rgba(180,60,40,0.1); border: 1px solid rgba(224,90,74,0.4);
    padding: 0.9rem 1.25rem; display: flex; gap: 0.75rem; align-items: center;
    animation: fadeUp 0.4s ease;
  }
  .co-error__icon { font-size: 1rem; flex-shrink: 0; }
  .co-error__text { font-size: 0.78rem; color: var(--red); line-height: 1.5; }

  /* empty state */
  .co-empty {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 1.5rem; padding: 6rem 2rem; text-align: center;
  }
  .co-empty__icon { font-size: 3rem; opacity: 0.25; }
  .co-empty__title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 4vw, 3rem); font-weight: 300; color: var(--white);
  }
  .co-empty__title em { font-style: italic; color: var(--gold); }
  .co-empty__sub { font-size: 0.85rem; color: var(--muted); max-width: 34ch; line-height: 1.8; }
  .co-empty__cta {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--yellow); color: var(--black);
    font-family: 'Jost', sans-serif; font-size: 0.82rem; font-weight: 500;
    letter-spacing: 0.08em; border: none; padding: 0.85rem 2rem; border-radius: 3px;
    cursor: pointer; text-decoration: none; transition: background 0.2s;
  }
  .co-empty__cta:hover { background: var(--gold2); }

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

  /* ── SHIPPING INFO ──────────────────────────────────────────────── */
  .co-shipping {
    border-top: 1px solid var(--border);
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border);
  }
  .co-shipping__item {
    background: var(--dark); padding: 1.25rem 1.5rem;
    display: flex; flex-direction: column; gap: 0.35rem;
  }
  .co-shipping__icon  { font-size: 1.1rem; }
  .co-shipping__label { font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); }
  .co-shipping__val   { font-size: 0.82rem; font-weight: 500; color: var(--white); line-height: 1.3; }
  .co-shipping__sub   { font-size: 0.68rem; color: var(--muted); line-height: 1.5; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin   { to { transform: rotate(360deg); } }

  /* ── RESPONSIVE ─────────────────────────────────────────────────── */
  @media (max-width: 900px) {
    .co-layout { grid-template-columns: 1fr; }
    .co-left   { border-right: none; padding: 2rem 1.5rem; }
    .co-summary { position: static; border-top: 1px solid var(--border); padding: 2rem 1.5rem; }
    .co-hero { padding: 7rem 1.5rem 2.5rem; }
    .co-steps { padding: 0 1.5rem; }
    .yt-footer { flex-direction: column; align-items: center; text-align: center; }
  }
`;

/* ── IMAGE LOADER ─────────────────────────────────────────────────── */
const getImage = (name) => {
  try { return require(`../assets/${name}.png`); }
  catch { return null; }
};

/* ── CHECKOUT ─────────────────────────────────────────────────────── */
const Checkout = () => {
  const { cart, deliveryOption, setDeliveryOption, finalTotal, DELIVERY_FEE } = useCart();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const subtotal     = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingCost = deliveryOption === "delivery" ? DELIVERY_FEE : 0;
  const orderTotal   = subtotal + shippingCost;
  const loyaltyPts   = Math.floor(subtotal);
  const fmt          = (val) => `SGD ${Number(val).toFixed(2)}`;

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post("/create-checkout-session", {
        items: cart,
        deliveryOption,
      });
      // redirectToCheckout is deprecated — use the session URL directly
      const { url } = response.data;
      if (!url) throw new Error("No checkout URL returned from server.");
      window.location.href = url;
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again or contact support."
      );
      setLoading(false);
    }
  };

  /* ── EMPTY CART ─────────────────────────────────────────────────── */
  if (cart.length === 0) {
    return (
      <>
        <style>{css}</style>
        <div className="co-page">
          <div className="co-empty">
            <span className="co-empty__icon">🛒</span>
            <h1 className="co-empty__title">Nothing to<br /><em>checkout.</em></h1>
            <p className="co-empty__sub">Add some scents to your cart before proceeding to checkout.</p>
            <Link to="/products" className="co-empty__cta">Browse the Collection →</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="co-page">

        {/* HERO */}
        <section className="co-hero">
          <div className="co-hero__wordmark" aria-hidden="true"><span>CHECKOUT</span></div>
          <div className="co-hero__glow" aria-hidden="true" />
          <div className="co-hero__content">
            <p className="co-hero__eyebrow">Youthentic Singapore · Secure Checkout</p>
            <h1 className="co-hero__title">COMPLETE<br /><span>YOUR ORDER.</span></h1>
          </div>
        </section>

        {/* STEPS */}
        <div className="co-steps">
          {[
            { num: "1", label: "Cart",     state: "done"   },
            { num: "2", label: "Checkout", state: "active" },
            { num: "3", label: "Payment",  state: ""       },
            { num: "4", label: "Confirm",  state: ""       },
          ].map((s) => (
            <div key={s.label} className={`co-step${s.state ? ` ${s.state}` : ""}`}>
              <div className="co-step__num">
                {s.state === "done" ? "✓" : s.num}
              </div>
              <span className="co-step__label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* LAYOUT */}
        <div className="co-layout">

          {/* LEFT */}
          <div className="co-left">

            {/* DELIVERY OPTION */}
            <div className="co-section">
              <p className="co-section__title">Delivery Method</p>
              <div className="co-delivery-opts">
                {[
                  {
                    value: "self",
                    label: "Self Collect",
                    sub:   "Pick up from our Singapore collection point. Ready within 1–2 business days.",
                    price: null,
                  },
                  {
                    value: "delivery",
                    label: "Home Delivery",
                    sub:   "Islandwide delivery. Estimated 3–5 business days.",
                    price: DELIVERY_FEE,
                  },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    className={`co-delivery-opt${deliveryOption === opt.value ? " selected" : ""}`}
                    onClick={() => setDeliveryOption(opt.value)}
                    role="radio"
                    aria-checked={deliveryOption === opt.value}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setDeliveryOption(opt.value)}
                  >
                    <div className="co-delivery-opt__radio">
                      <div className="co-delivery-opt__radio-inner" />
                    </div>
                    <div className="co-delivery-opt__body">
                      <p className="co-delivery-opt__label">{opt.label}</p>
                      <p className="co-delivery-opt__sub">{opt.sub}</p>
                    </div>
                    {opt.price != null
                      ? <span className="co-delivery-opt__price">{fmt(opt.price)}</span>
                      : <span className="co-delivery-opt__price--free">Free</span>
                    }
                  </div>
                ))}
              </div>

              {/* self collect info */}
              {deliveryOption === "self" && (
                <div className="co-collect-info">
                  <span className="co-collect-info__icon">📍</span>
                  <div className="co-collect-info__text">
                    <strong>Collection Point</strong>
                    To be confirmed upon order. We'll reach out via email with the address and available slots.
                  </div>
                </div>
              )}
            </div>

            {/* ORDER RECAP */}
            <div className="co-section">
              <p className="co-section__title">Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} items)</p>
              <div className="co-items">
                {cart.map((item) => {
                  const imgSrc = getImage(item.name);
                  return (
                    <div key={item.cartKey} className="co-item">
                      <div className="co-item__img">
                        {imgSrc
                          ? <img src={imgSrc} alt={item.name} />
                          : <span>🫧</span>
                        }
                      </div>
                      <div className="co-item__info">
                        <p className="co-item__name">{item.name}</p>
                        <p className="co-item__meta">
                          Qty {item.quantity}
                          {item.variant && item.variant !== "bundle" && (
                            <> · <span>{item.variant}</span></>
                          )}
                          {item.variant === "bundle" && (
                            <> · <span>Bundle</span></>
                          )}
                        </p>
                      </div>
                      <span className="co-item__price">
                        {fmt(item.price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* back to cart */}
            <Link to="/cart" style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem", transition: "color 0.2s" }}
              onMouseEnter={(e) => e.target.style.color = "var(--gold)"}
              onMouseLeave={(e) => e.target.style.color = "var(--muted)"}
            >
              ← Back to Cart
            </Link>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="co-summary">
            <p className="co-summary__title">Price Breakdown</p>

            <div className="co-summary__rows">
              <div className="co-summary__row">
                <span className="co-summary__row-label">Subtotal</span>
                <span className="co-summary__row-val">{fmt(subtotal)}</span>
              </div>
              <div className="co-summary__row">
                <span className="co-summary__row-label">Delivery</span>
                {deliveryOption === "delivery"
                  ? <span className="co-summary__row-val co-summary__row-val--gold">{fmt(DELIVERY_FEE)}</span>
                  : <span className="co-summary__row-val--green">Free</span>
                }
              </div>
            </div>

            <div className="co-summary__total">
              <span className="co-summary__total-label">Total</span>
              <span className="co-summary__total-val">{fmt(orderTotal)}</span>
            </div>

            {/* loyalty points */}
            <div className="co-loyalty">
              <span className="co-loyalty__icon">✦</span>
              <div className="co-loyalty__text">
                <strong>+{loyaltyPts} points on this order</strong>
                Redeemable on your next Youthentic purchase.
              </div>
            </div>

            {/* error */}
            {error && (
              <div className="co-error">
                <span className="co-error__icon">⚠️</span>
                <p className="co-error__text">{error}</p>
              </div>
            )}

            {/* PAY BUTTON */}
            <button
              className={`co-pay-btn${loading ? " loading" : ""}`}
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading
                ? <><div className="co-spinner" /> Redirecting to Stripe...</>
                : <>Pay {fmt(orderTotal)} with Stripe →</>
              }
            </button>

            <p className="co-secure">🔒 &nbsp;256-bit SSL · Powered by Stripe</p>
          </div>
        </div>

        {/* SHIPPING TRANSPARENCY */}
        <div className="co-shipping">
          {[
            { icon: "🚚", label: "Home Delivery",    val: "3–5 Business Days",  sub: "Islandwide Singapore · SGD 5.00 flat" },
            { icon: "📍", label: "Self Collection",  val: "1–2 Business Days",  sub: "Location confirmed via email after order" },
            { icon: "💰", label: "No Hidden Duties", val: "SGD · GST Included", sub: "Checkout price is final — no surprises" },
            { icon: "🔒", label: "Secure Payment",   val: "Stripe Checkout",    sub: "256-bit SSL · Visa · MC · Amex · PayNow" },
          ].map((s) => (
            <div key={s.label} className="co-shipping__item">
              <span className="co-shipping__icon">{s.icon}</span>
              <span className="co-shipping__label">{s.label}</span>
              <span className="co-shipping__val">{s.val}</span>
              <span className="co-shipping__sub">{s.sub}</span>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;