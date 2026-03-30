import { useLocation, Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  :root {
    --black: #000; --dark: #0a0a0a; --panel: #111;
    --gold: #C9A84C; --gold2: #E2B84A; --yellow: #D4C028;
    --white: #fff; --muted: #888; --border: rgba(201,168,76,0.2);
    --green: #6dbf82; --amber: #e8a84c; --red: #e05a4a;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--black); color: var(--white); font-family: 'Jost', sans-serif; }

  .ord-page { min-height: 100svh; background: var(--black); display: flex; flex-direction: column; }

  /* hero */
  .ord-hero {
    position: relative; padding: 8rem 3rem 4rem;
    border-bottom: 1px solid var(--border); overflow: hidden;
  }
  .ord-hero__wordmark {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    pointer-events: none; user-select: none;
  }
  .ord-hero__wordmark span {
    font-family: 'Bebas Neue', sans-serif; font-size: clamp(6rem, 16vw, 14rem);
    color: transparent; -webkit-text-stroke: 1px rgba(201,168,76,0.07); white-space: nowrap;
  }
  .ord-hero__glow {
    position: absolute; top: -60px; right: -60px; width: 500px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(180,130,40,0.1) 0%, transparent 70%);
    pointer-events: none;
  }
  .ord-hero__content { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 0.75rem; }
  .ord-hero__eyebrow { font-size: 0.65rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); }
  .ord-hero__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 6vw, 5.5rem); letter-spacing: 0.04em; color: var(--white); line-height: 0.95;
  }
  .ord-hero__title span { color: var(--gold); }
  .ord-hero__email { font-size: 0.82rem; color: var(--muted); margin-top: 0.5rem; }
  .ord-hero__email strong { color: var(--white); }

  /* body */
  .ord-body { flex: 1; padding: 3rem; display: flex; flex-direction: column; gap: 1.5rem; max-width: 900px; width: 100%; margin: 0 auto; }

  /* summary strip */
  .ord-summary {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border);
  }
  .ord-summary__item {
    background: var(--dark); padding: 1.25rem 1.5rem;
    display: flex; flex-direction: column; gap: 0.3rem;
  }
  .ord-summary__label { font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); }
  .ord-summary__val {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem;
    letter-spacing: 0.05em; color: var(--gold); line-height: 1;
  }

  /* order cards */
  .ord-list { display: flex; flex-direction: column; gap: 1px; background: var(--border); }
  .ord-card { background: var(--dark); }
  .ord-card__header {
    padding: 1.5rem; display: flex; align-items: center;
    justify-content: space-between; gap: 1rem; flex-wrap: wrap;
    cursor: pointer; transition: background 0.2s;
  }
  .ord-card__header:hover { background: rgba(201,168,76,0.03); }
  .ord-card__left { display: flex; flex-direction: column; gap: 0.35rem; }
  .ord-card__id { font-size: 0.68rem; color: var(--muted); letter-spacing: 0.04em; font-family: monospace; }
  .ord-card__date { font-size: 0.75rem; color: var(--muted); }
  .ord-card__right { display: flex; align-items: center; gap: 1rem; }
  .ord-card__amount {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.3rem;
    letter-spacing: 0.05em; color: var(--gold);
  }
  .ord-card__delivery { font-size: 0.72rem; color: var(--muted); }

  /* status badge */
  .ord-status { display: inline-block; padding: 0.25rem 0.75rem; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 500; border-radius: 2px; }
  .ord-status--paid      { background: rgba(109,191,130,0.15); color: var(--green); border: 1px solid rgba(109,191,130,0.3); }
  .ord-status--pending   { background: rgba(232,168,76,0.12);  color: var(--amber); border: 1px solid rgba(232,168,76,0.3); }
  .ord-status--cancelled { background: rgba(224,90,74,0.12);   color: var(--red);   border: 1px solid rgba(224,90,74,0.3); }
  .ord-status--unknown   { background: rgba(136,136,136,0.1);  color: var(--muted); border: 1px solid rgba(136,136,136,0.2); }

  .ord-card__expand { color: var(--muted); font-size: 0.75rem; transition: transform 0.25s; }
  .ord-card__expand.open { transform: rotate(90deg); color: var(--gold); }

  /* items */
  .ord-card__items {
    border-top: 1px solid rgba(201,168,76,0.08);
    padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 0;
    background: #0d0d0d;
    animation: ordSlideDown 0.25s ease;
  }
  .ord-item {
    display: flex; align-items: center; gap: 1rem;
    padding: 0.75rem 0; border-bottom: 1px solid rgba(201,168,76,0.06);
    font-size: 0.82rem;
  }
  .ord-item:last-child { border-bottom: none; }
  .ord-item__name { flex: 1; color: var(--white); }
  .ord-item__variant {
    font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--gold); border: 1px solid rgba(201,168,76,0.25); padding: 0.15rem 0.5rem;
  }
  .ord-item__qty  { color: var(--muted); font-size: 0.72rem; }
  .ord-item__price {
    font-family: 'Bebas Neue', sans-serif; font-size: 1rem; color: var(--gold); letter-spacing: 0.05em;
  }

  /* empty state */
  .ord-empty {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 1.5rem; padding: 6rem 2rem; text-align: center;
  }
  .ord-empty__icon { font-size: 3rem; opacity: 0.25; }
  .ord-empty__title {
    font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 300; color: var(--white);
  }
  .ord-empty__title em { font-style: italic; color: var(--gold); }
  .ord-empty__sub { font-size: 0.85rem; color: var(--muted); max-width: 34ch; line-height: 1.8; }
  .ord-empty__btn {
    background: var(--yellow); color: var(--black);
    font-family: 'Jost', sans-serif; font-size: 0.82rem; font-weight: 500;
    letter-spacing: 0.08em; border: none; padding: 0.85rem 2rem;
    cursor: pointer; text-decoration: none; transition: background 0.2s;
  }
  .ord-empty__btn:hover { background: var(--gold2); }

  .ord-back {
    font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--muted); text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;
    transition: color 0.2s; align-self: flex-start;
  }
  .ord-back:hover { color: var(--gold); }

  @keyframes ordSlideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }

  @media (max-width: 768px) {
    .ord-hero { padding: 7rem 1.5rem 3rem; }
    .ord-body { padding: 2rem 1.5rem; }
    .ord-summary { grid-template-columns: 1fr 1fr; }
    .ord-card__header { flex-direction: column; align-items: flex-start; }
  }
`;

const fmt     = (v) => `SGD ${Number(v ?? 0).toFixed(2)}`;
const fmtDate = (ts) => {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleDateString("en-SG", { day: "2-digit", month: "short", year: "numeric" });
};
const statusClass = (s) => {
  if (!s) return "ord-status ord-status--unknown";
  const map = { paid:"paid", complete:"paid", succeeded:"paid", pending:"pending", unpaid:"pending", cancelled:"cancelled", canceled:"cancelled", failed:"cancelled" };
  return `ord-status ord-status--${map[s.toLowerCase()] ?? "unknown"}`;
};
const statusLabel = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "Unknown";

/* single expandable order card */
const OrderCard = ({ order }) => {
  const [open, setOpen] = useState(false);
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="ord-card">
      <div className="ord-card__header" onClick={() => setOpen((o) => !o)}>
        <div className="ord-card__left">
          <span className="ord-card__id">#{order.id?.slice(0, 8).toUpperCase()}</span>
          <span className="ord-card__date">{fmtDate(order.created_at)}</span>
        </div>
        <div className="ord-card__right">
          <span className="ord-card__delivery">
            {order.delivery_option === "delivery" ? "🚚 Delivery" : "📍 Self Collect"}
          </span>
          <span className={statusClass(order.payment_status)}>
            {statusLabel(order.payment_status)}
          </span>
          <span className="ord-card__amount">{fmt(order.total_amount / 100)}</span>
          <span className={`ord-card__expand${open ? " open" : ""}`}>›</span>
        </div>
      </div>

      {open && items.length > 0 && (
        <div className="ord-card__items">
          {items.map((item, i) => (
            <div key={i} className="ord-item">
              <span className="ord-item__name">{item.name ?? "Unknown"}</span>
              {item.variant && <span className="ord-item__variant">{item.variant}</span>}
              <span className="ord-item__qty">×{item.quantity ?? 1}</span>
              <span className="ord-item__price">{fmt((item.price ?? 0) * (item.quantity ?? 1))}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Orders = () => {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const orders     = state?.orders ?? [];
  const email      = state?.email  ?? "";

  // if navigated directly without state, send back to login
  if (!state) {
    navigate("/login");
    return null;
  }

  const totalSpent = orders.reduce((s, o) => s + (o.total_amount ?? 0), 0);
  const paidOrders = orders.filter((o) => ["paid","complete","succeeded"].includes((o.payment_status ?? "").toLowerCase()));

  return (
    <>
      <style>{css}</style>
      <div className="ord-page">

        {/* HERO */}
        <div className="ord-hero">
          <div className="ord-hero__wordmark" aria-hidden="true"><span>ORDERS</span></div>
          <div className="ord-hero__glow" aria-hidden="true" />
          <div className="ord-hero__content">
            <p className="ord-hero__eyebrow">Youthentic Singapore · Order History</p>
            <h1 className="ord-hero__title">YOUR<br /><span>ORDERS.</span></h1>
            {email && (
              <p className="ord-hero__email">Showing orders for <strong>{email}</strong></p>
            )}
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="ord-empty">
            <span className="ord-empty__icon">📭</span>
            <h2 className="ord-empty__title">No orders <em>found.</em></h2>
            <p className="ord-empty__sub">
              We couldn't find any orders for {email}. Double-check the email you used at checkout.
            </p>
            <Link to="/login" className="ord-empty__btn">Try Another Email →</Link>
          </div>
        ) : (
          <div className="ord-body">
            <Link to="/login" className="ord-back">← Search Another Email</Link>

            {/* SUMMARY STRIP */}
            <div className="ord-summary">
              <div className="ord-summary__item">
                <span className="ord-summary__label">Total Orders</span>
                <span className="ord-summary__val">{orders.length}</span>
              </div>
              <div className="ord-summary__item">
                <span className="ord-summary__label">Paid Orders</span>
                <span className="ord-summary__val">{paidOrders.length}</span>
              </div>
              <div className="ord-summary__item">
                <span className="ord-summary__label">Total Spent</span>
                <span className="ord-summary__val" style={{ fontSize: "1.2rem" }}>
                  {fmt(totalSpent / 100)}
                </span>
              </div>
            </div>

            {/* ORDER LIST */}
            <div className="ord-list">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default Orders;