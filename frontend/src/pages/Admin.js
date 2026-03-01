import { useEffect, useState, useMemo } from "react";
import API from "../api/api";

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
    --amber:  #e8a84c;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--black); color: var(--white); font-family: 'Jost', sans-serif; overflow-x: hidden; }

  /* ── PAGE ───────────────────────────────────────────────────────── */
  .ad-page { min-height: 100svh; background: var(--black); display: flex; flex-direction: column; }

  /* ── TOPBAR ─────────────────────────────────────────────────────── */
  .ad-topbar {
    background: var(--dark); border-bottom: 1px solid var(--border);
    padding: 1.25rem 3rem;
    display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;
    position: sticky; top: 0; z-index: 100;
  }
  .ad-topbar__brand {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.3rem;
    letter-spacing: 0.18em; color: var(--white);
  }
  .ad-topbar__brand span { color: var(--gold); }
  .ad-topbar__right { display: flex; align-items: center; gap: 1rem; }
  .ad-topbar__badge {
    font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase;
    border: 1px solid rgba(201,168,76,0.3); padding: 0.25rem 0.75rem; color: var(--gold);
  }
  .ad-refresh {
    background: transparent; border: 1px solid var(--border); color: var(--muted);
    font-family: 'Jost', sans-serif; font-size: 0.72rem; letter-spacing: 0.1em;
    text-transform: uppercase; padding: 0.5rem 1.1rem; cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }
  .ad-refresh:hover { border-color: var(--gold); color: var(--white); }

  /* ── BODY ───────────────────────────────────────────────────────── */
  .ad-body { flex: 1; padding: 2.5rem 3rem; display: flex; flex-direction: column; gap: 2.5rem; }

  /* ── KPI CARDS ──────────────────────────────────────────────────── */
  .ad-kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border); }
  .ad-kpi {
    background: var(--dark); padding: 1.75rem 1.5rem;
    display: flex; flex-direction: column; gap: 0.5rem;
    transition: background 0.25s;
  }
  .ad-kpi:hover { background: var(--panel); }
  .ad-kpi__label {
    font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted);
  }
  .ad-kpi__value {
    font-family: 'Bebas Neue', sans-serif; font-size: 2.2rem;
    letter-spacing: 0.04em; line-height: 1; color: var(--gold);
  }
  .ad-kpi__sub { font-size: 0.72rem; color: var(--muted); }
  .ad-kpi__sub--green { color: var(--green); }
  .ad-kpi__sub--red   { color: var(--red);   }

  /* ── TOOLBAR ────────────────────────────────────────────────────── */
  .ad-toolbar {
    display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
  }

  .ad-search {
    position: relative; flex: 1; min-width: 200px; max-width: 320px;
  }
  .ad-search__icon {
    position: absolute; left: 0.9rem; top: 50%; transform: translateY(-50%);
    font-size: 0.8rem; color: var(--muted); pointer-events: none;
  }
  .ad-search__input {
    width: 100%; background: var(--panel); border: 1px solid var(--border);
    color: var(--white); font-family: 'Jost', sans-serif; font-size: 0.8rem;
    padding: 0.6rem 1rem 0.6rem 2.3rem; outline: none; transition: border-color 0.2s;
    letter-spacing: 0.04em;
  }
  .ad-search__input::placeholder { color: var(--muted); }
  .ad-search__input:focus { border-color: var(--gold); }

  .ad-filter {
    background: transparent; border: 1px solid var(--border); color: var(--muted);
    font-family: 'Jost', sans-serif; font-size: 0.72rem; letter-spacing: 0.1em;
    text-transform: uppercase; padding: 0.55rem 1.1rem; cursor: pointer;
    transition: all 0.2s; white-space: nowrap;
  }
  .ad-filter:hover  { border-color: var(--gold); color: var(--white); }
  .ad-filter.active { background: var(--gold); color: var(--black); border-color: var(--gold); }

  .ad-sort {
    background: var(--panel); border: 1px solid var(--border); color: var(--muted);
    font-family: 'Jost', sans-serif; font-size: 0.72rem; letter-spacing: 0.06em;
    padding: 0.58rem 2rem 0.58rem 0.9rem; outline: none; cursor: pointer;
    appearance: none; -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 0.7rem center;
    transition: border-color 0.2s;
  }
  .ad-sort:focus { border-color: var(--gold); }
  .ad-sort option { background: var(--dark); }

  .ad-toolbar__count {
    margin-left: auto; font-size: 0.72rem; letter-spacing: 0.08em; color: var(--muted);
  }
  .ad-toolbar__count span { color: var(--gold); }

  /* ── TABLE ──────────────────────────────────────────────────────── */
  .ad-table-wrap { overflow-x: auto; border: 1px solid var(--border); }
  .ad-table { width: 100%; border-collapse: collapse; }

  .ad-table th {
    background: var(--dark); padding: 0.9rem 1.25rem; text-align: left;
    font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--muted); border-bottom: 1px solid var(--border); white-space: nowrap;
    font-weight: 400;
  }

  .ad-table td {
    padding: 1.1rem 1.25rem; border-bottom: 1px solid rgba(201,168,76,0.07);
    font-size: 0.82rem; color: var(--white); vertical-align: middle;
  }
  .ad-table tr:last-child td { border-bottom: none; }
  .ad-table tbody tr { transition: background 0.2s; cursor: pointer; }
  .ad-table tbody tr:hover { background: rgba(201,168,76,0.04); }

  /* id cell */
  .ad-order-id {
    font-family: 'Jost', sans-serif; font-size: 0.7rem; color: var(--muted);
    letter-spacing: 0.04em; max-width: 100px; overflow: hidden;
    text-overflow: ellipsis; white-space: nowrap; display: block;
  }

  /* email */
  .ad-email { color: var(--white); font-size: 0.82rem; }

  /* amount */
  .ad-amount {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem;
    letter-spacing: 0.05em; color: var(--gold);
  }

  /* delivery badge */
  .ad-delivery {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.2rem 0;
    color: var(--muted);
  }

  /* status badge */
  .ad-status {
    display: inline-block; padding: 0.25rem 0.75rem;
    font-size: 0.62rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 500;
    border-radius: 2px;
  }
  .ad-status--paid      { background: rgba(109,191,130,0.15); color: var(--green); border: 1px solid rgba(109,191,130,0.3); }
  .ad-status--pending   { background: rgba(232,168,76,0.12);  color: var(--amber); border: 1px solid rgba(232,168,76,0.3); }
  .ad-status--cancelled { background: rgba(224,90,74,0.12);   color: var(--red);   border: 1px solid rgba(224,90,74,0.3); }
  .ad-status--unknown   { background: rgba(136,136,136,0.1);  color: var(--muted); border: 1px solid rgba(136,136,136,0.2); }

  /* date */
  .ad-date { color: var(--muted); font-size: 0.76rem; }

  /* items count chip */
  .ad-items-chip {
    display: inline-flex; align-items: center; justify-content: center;
    width: 1.6rem; height: 1.6rem; border-radius: 50%;
    border: 1px solid var(--border); font-size: 0.7rem; color: var(--muted);
  }

  /* expand arrow */
  .ad-expand { color: var(--muted); font-size: 0.7rem; transition: transform 0.25s; }
  .ad-expand.open { transform: rotate(90deg); color: var(--gold); }

  /* ── EXPANDED ROW ───────────────────────────────────────────────── */
  .ad-expanded {
    background: var(--dark); border-bottom: 1px solid var(--border);
    animation: adSlideDown 0.25s ease;
  }
  .ad-expanded td { padding: 0; }
  .ad-expanded__inner { padding: 1.5rem 1.25rem; display: flex; flex-direction: column; gap: 1.25rem; }

  .ad-expanded__label {
    font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold);
    margin-bottom: 0.6rem;
  }

  /* items in expanded */
  .ad-exp-items { display: flex; flex-direction: column; gap: 0; }
  .ad-exp-item {
    display: flex; align-items: center; gap: 1rem;
    padding: 0.65rem 0; border-bottom: 1px solid rgba(201,168,76,0.06);
    font-size: 0.8rem;
  }
  .ad-exp-item:last-child { border-bottom: none; }
  .ad-exp-item__name { flex: 1; color: var(--white); }
  .ad-exp-item__variant {
    font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold);
    border: 1px solid rgba(201,168,76,0.25); padding: 0.15rem 0.5rem;
  }
  .ad-exp-item__qty { color: var(--muted); font-size: 0.75rem; width: 3rem; text-align: right; }
  .ad-exp-item__price {
    font-family: 'Bebas Neue', sans-serif; font-size: 1rem; color: var(--gold);
    letter-spacing: 0.05em; width: 6rem; text-align: right;
  }

  /* stripe session */
  .ad-session {
    font-size: 0.7rem; color: var(--muted); letter-spacing: 0.04em;
    font-family: monospace; word-break: break-all;
  }

  /* status update */
  .ad-status-select {
    background: var(--panel); border: 1px solid var(--border); color: var(--white);
    font-family: 'Jost', sans-serif; font-size: 0.75rem; padding: 0.45rem 0.85rem;
    outline: none; cursor: pointer; transition: border-color 0.2s;
  }
  .ad-status-select:focus { border-color: var(--gold); }
  .ad-status-select option { background: var(--dark); }

  .ad-update-btn {
    background: var(--yellow); color: var(--black);
    font-family: 'Jost', sans-serif; font-size: 0.72rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    border: none; padding: 0.45rem 1.1rem; cursor: pointer; transition: background 0.2s;
  }
  .ad-update-btn:hover { background: var(--gold2); }
  .ad-update-btn:disabled { background: #222; color: #555; cursor: not-allowed; }

  /* ── EMPTY / LOADING ────────────────────────────────────────────── */
  .ad-state {
    padding: 6rem 2rem; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1.5rem; text-align: center;
  }
  .ad-state__icon { font-size: 2.5rem; opacity: 0.3; }
  .ad-state__title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 300; color: var(--white);
  }
  .ad-state__sub { font-size: 0.85rem; color: var(--muted); }

  /* skeleton */
  .ad-skel td {
    padding: 1.1rem 1.25rem;
  }
  .ad-skel-line {
    height: 0.75rem; border-radius: 2px;
    background: linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
  }

  /* ── KEYFRAMES ──────────────────────────────────────────────────── */
  @keyframes fadeUp      { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes shimmer     { from { background-position: 200% 0; } to { background-position: -200% 0; } }
  @keyframes adSlideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }

  /* ── RESPONSIVE ─────────────────────────────────────────────────── */
  @media (max-width: 1100px) { .ad-kpis { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 700px) {
    .ad-body { padding: 1.5rem; gap: 1.5rem; }
    .ad-topbar { padding: 1rem 1.5rem; }
    .ad-kpis { grid-template-columns: 1fr 1fr; }
    .ad-toolbar { flex-direction: column; align-items: stretch; }
    .ad-search { max-width: 100%; }
    .ad-toolbar__count { margin-left: 0; }
  }
`;

/* ── HELPERS ──────────────────────────────────────────────────────── */
const fmt = (val) => `SGD ${Number(val ?? 0).toFixed(2)}`;

const fmtDate = (ts) => {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleDateString("en-SG", { day: "2-digit", month: "short", year: "numeric" })
    + " " + d.toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit" });
};

const statusClass = (s) => {
  if (!s) return "ad-status ad-status--unknown";
  const map = { paid: "paid", complete: "paid", succeeded: "paid",
                pending: "pending", unpaid: "pending",
                cancelled: "cancelled", canceled: "cancelled", failed: "cancelled" };
  return `ad-status ad-status--${map[s.toLowerCase()] ?? "unknown"}`;
};

const statusLabel = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "Unknown";

/* ── ORDER ROW ─────────────────────────────────────────────────────── */
const OrderRow = ({ order, onStatusUpdate }) => {
  const [open,     setOpen]     = useState(false);
  const [newStatus, setNewStatus] = useState(order.payment_status ?? "");
  const [updating,  setUpdating]  = useState(false);

  const items = Array.isArray(order.items) ? order.items : [];

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await API.patch(`/admin/orders/${order.id}`, { payment_status: newStatus });
      onStatusUpdate(order.id, newStatus);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <tr onClick={() => setOpen((o) => !o)}>
        <td>
          <span className="ad-order-id" title={order.id}>{order.id}</span>
        </td>
        <td className="ad-email">{order.email ?? "—"}</td>
        <td>
          <span className="ad-amount">{fmt(order.total_amount)}</span>
        </td>
        <td>
          <span className="ad-delivery">
            {order.delivery_option === "delivery" ? "🚚 Delivery" : "📍 Self Collect"}
          </span>
        </td>
        <td>
          <span className={statusClass(order.payment_status)}>
            {statusLabel(order.payment_status)}
          </span>
        </td>
        <td><span className="ad-date">{fmtDate(order.created_at)}</span></td>
        <td><span className="ad-items-chip">{items.length}</span></td>
        <td><span className={`ad-expand${open ? " open" : ""}`}>›</span></td>
      </tr>

      {open && (
        <tr className="ad-expanded">
          <td colSpan={8}>
            <div className="ad-expanded__inner">

              {/* items */}
              {items.length > 0 && (
                <div>
                  <p className="ad-expanded__label">Order Items</p>
                  <div className="ad-exp-items">
                    {items.map((item, i) => (
                      <div key={i} className="ad-exp-item">
                        <span className="ad-exp-item__name">{item.name ?? "Unknown"}</span>
                        {item.variant && (
                          <span className="ad-exp-item__variant">{item.variant}</span>
                        )}
                        <span className="ad-exp-item__qty">×{item.quantity ?? 1}</span>
                        <span className="ad-exp-item__price">
                          {fmt((item.price ?? 0) * (item.quantity ?? 1))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* stripe session */}
              {order.stripe_session_id && (
                <div>
                  <p className="ad-expanded__label">Stripe Session</p>
                  <p className="ad-session">{order.stripe_session_id}</p>
                </div>
              )}

              {/* update status */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <p className="ad-expanded__label" style={{ marginBottom: 0 }}>Update Status</p>
                <select
                  className="ad-status-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  className="ad-update-btn"
                  onClick={(e) => { e.stopPropagation(); handleUpdate(); }}
                  disabled={updating || newStatus === order.payment_status}
                >
                  {updating ? "Saving…" : "Update"}
                </button>
              </div>

            </div>
          </td>
        </tr>
      )}
    </>
  );
};

/* ── ADMIN DASHBOARD ───────────────────────────────────────────────── */
const Admin = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");
  const [sort,    setSort]    = useState("newest");
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  const fetchOrders = () => {
    setLoading(true);
    setError(null);
    API.get("/admin/orders")
      .then((res) => { setOrders(res.data); setLoading(false); setLastRefresh(Date.now()); })
      .catch((e) => { console.error(e); setError("Failed to load orders."); setLoading(false); });
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, payment_status: newStatus } : o))
    );
  };

  /* KPIs */
  const kpis = useMemo(() => {
    const paid      = orders.filter((o) => ["paid","complete","succeeded"].includes((o.payment_status ?? "").toLowerCase()));
    const pending   = orders.filter((o) => ["pending","unpaid"].includes((o.payment_status ?? "").toLowerCase()));
    const revenue   = paid.reduce((s, o) => s + (o.total_amount ?? 0), 0);
    const avgOrder  = paid.length ? revenue / paid.length : 0;
    return { total: orders.length, paid: paid.length, pending: pending.length, revenue, avgOrder };
  }, [orders]);

  /* filter + search + sort */
  const displayed = useMemo(() => {
    let list = [...orders];

    if (filter !== "all") {
      const map = { paid: ["paid","complete","succeeded"], pending: ["pending","unpaid"], cancelled: ["cancelled","canceled","failed"] };
      list = list.filter((o) => (map[filter] ?? []).includes((o.payment_status ?? "").toLowerCase()));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((o) =>
        o.email?.toLowerCase().includes(q) ||
        o.id?.toLowerCase().includes(q) ||
        o.stripe_session_id?.toLowerCase().includes(q)
      );
    }

    if (sort === "newest")    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (sort === "oldest")    list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    if (sort === "high")      list.sort((a, b) => (b.total_amount ?? 0) - (a.total_amount ?? 0));
    if (sort === "low")       list.sort((a, b) => (a.total_amount ?? 0) - (b.total_amount ?? 0));

    return list;
  }, [orders, filter, search, sort]);

  return (
    <>
      <style>{css}</style>
      <div className="ad-page">

        {/* TOPBAR */}
        <div className="ad-topbar">
          
          <div className="ad-topbar__right">
           
            
          </div>
        </div>

        <div className="ad-body">
          <button className="ad-refresh" onClick={fetchOrders}>↻ Refresh</button>
          {/* KPI STRIP */}
          <div className="ad-kpis">
            {[
              { label: "Total Orders",   value: kpis.total,             fmt: (v) => v,                       sub: `Since launch`,              subClass: "" },
              { label: "Paid Orders",    value: kpis.paid,              fmt: (v) => v,                       sub: `${kpis.pending} pending`,    subClass: kpis.pending ? "ad-kpi__sub--red" : "" },
              { label: "Total Revenue",  value: fmt(kpis.revenue),      fmt: (v) => v,                       sub: "SGD · all time",            subClass: "ad-kpi__sub--green" },
              { label: "Avg Order Value",value: fmt(kpis.avgOrder),     fmt: (v) => v,                       sub: "Paid orders only",          subClass: "" },
            ].map((k) => (
              <div key={k.label} className="ad-kpi">
                <span className="ad-kpi__label">{k.label}</span>
                <span className="ad-kpi__value">{typeof k.value === "number" ? k.fmt(k.value) : k.value}</span>
                <span className={`ad-kpi__sub${k.subClass ? " " + k.subClass : ""}`}>{k.sub}</span>
              </div>
            ))}
          </div>

          {/* TOOLBAR */}
          <div className="ad-toolbar">
            <div className="ad-search">
              <span className="ad-search__icon">🔍</span>
              <input
                className="ad-search__input"
                placeholder="Search email, order ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {["all","paid","pending","cancelled"].map((f) => (
              <button
                key={f}
                className={`ad-filter${filter === f ? " active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}

            <select className="ad-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="high">Highest Value</option>
              <option value="low">Lowest Value</option>
            </select>

            {!loading && (
              <span className="ad-toolbar__count">
                <span>{displayed.length}</span> order{displayed.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* TABLE */}
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Delivery</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {/* loading skeletons */}
                {loading && Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="ad-skel">
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j}>
                        <div className="ad-skel-line" style={{ width: `${[80,130,70,90,60,110,30,20][j]}px` }} />
                      </td>
                    ))}
                  </tr>
                ))}

                {/* error */}
                {!loading && error && (
                  <tr><td colSpan={8}>
                    <div className="ad-state">
                      <span className="ad-state__icon">⚠️</span>
                      <p className="ad-state__title">Failed to load orders</p>
                      <p className="ad-state__sub">{error}</p>
                    </div>
                  </td></tr>
                )}

                {/* empty */}
                {!loading && !error && displayed.length === 0 && (
                  <tr><td colSpan={8}>
                    <div className="ad-state">
                      <span className="ad-state__icon">📭</span>
                      <p className="ad-state__title">No orders found</p>
                      <p className="ad-state__sub">Try adjusting your search or filter.</p>
                    </div>
                  </td></tr>
                )}

                {/* rows */}
                {!loading && !error && displayed.map((order) => (
                  <OrderRow key={order.id} order={order} onStatusUpdate={handleStatusUpdate} />
                ))}
              </tbody>
            </table>
          </div>

          {/* last refresh */}
          {!loading && (
            <p style={{ fontSize: "0.68rem", color: "var(--muted)", letterSpacing: "0.06em" }}>
              Last refreshed: {fmtDate(new Date(lastRefresh).toISOString())}
            </p>
          )}

        </div>
      </div>
    </>
  );
};

export default Admin;