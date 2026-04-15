import { useEffect, useState, useMemo } from "react";
import Footer from "../components/Footer";
import API from "../api/api";
import "./Admin.css";


/* ── HELPERS ──────────────────────────────────────────────────────── */
const fmt = (val) => `SGD ${Number(val ?? 0).toFixed(2)}`;

const fmtDate = (ts) => {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleDateString("en-SG", { day: "2-digit", month: "short", year: "numeric" })
    + " " + d.toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit" });
};

const statusClass = (s) => {
  if (!s) return "adm-status adm-status--unknown";
  const map = { paid: "paid", complete: "paid", succeeded: "paid",
                pending: "pending", unpaid: "pending",
                cancelled: "cancelled", canceled: "cancelled", failed: "cancelled" };
  return `adm-status adm-status--${map[s.toLowerCase()] ?? "unknown"}`;
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
          <span className="adm-order-id" title={order.id}>{order.id}</span>
        </td>
        <td className="adm-email">{order.email ?? "—"}</td>
        <td>
          <span className="adm-amount">{fmt(order.total_amount)}</span>
        </td>
        <td>
          <span className="adm-delivery">
            {order.delivery_option === "delivery" ? "🚚 Delivery" : "📍 Self Collect"}
          </span>
        </td>
        <td>
          <span className={statusClass(order.payment_status)}>
            {statusLabel(order.payment_status)}
          </span>
        </td>
        <td><span className="adm-date">{fmtDate(order.created_at)}</span></td>
        <td><span className="adm-items-chip">{items.length}</span></td>
        <td><span className={`adm-expand${open ? " open" : ""}`}>›</span></td>
      </tr>

      {open && (
        <tr className="adm-expanded">
          <td colSpan={8}>
            <div className="adm-expanded__inner">

              {/* items */}
              {items.length > 0 && (
                <div>
                  <p className="adm-expanded__label">Order Items</p>
                  <div className="adm-exp-items">
                    {items.map((item, i) => (
                      <div key={i} className="adm-exp-item">
                        <span className="adm-exp-item__name">{item.name ?? "Unknown"}</span>
                        {item.variant && (
                          <span className="adm-exp-item__variant">{item.variant}</span>
                        )}
                        <span className="adm-exp-item__qty">×{item.quantity ?? 1}</span>
                        <span className="adm-exp-item__price">
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
                  <p className="adm-expanded__label">Stripe Session</p>
                  <p className="adm-session">{order.stripe_session_id}</p>
                </div>
              )}

              {/* update status */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <p className="adm-expanded__label" style={{ marginBottom: 0 }}>Update Status</p>
                <select
                  className="adm-status-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  className="adm-update-btn"
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
      <div className="adm-page">

        {/* TOPBAR */}
        <div className="adm-topbar">
          
          <div className="adm-topbar__right">
           
            
          </div>
        </div>

        <div className="adm-body">
          <button className="adm-refresh" onClick={fetchOrders}>↻ Refresh</button>
          {/* KPI STRIP */}
          <div className="adm-kpis">
            {[
              { label: "Total Orders",   value: kpis.total,             fmt: (v) => v,                       sub: `Since launch`,              subClass: "" },
              { label: "Paid Orders",    value: kpis.paid,              fmt: (v) => v,                       sub: `${kpis.pending} pending`,    subClass: kpis.pending ? "adm-kpi__sub--red" : "" },
              { label: "Total Revenue",  value: fmt(kpis.revenue),      fmt: (v) => v,                       sub: "SGD · all time",            subClass: "adm-kpi__sub--green" },
              { label: "Avg Order Value",value: fmt(kpis.avgOrder),     fmt: (v) => v,                       sub: "Paid orders only",          subClass: "" },
            ].map((k) => (
              <div key={k.label} className="adm-kpi">
                <span className="adm-kpi__label">{k.label}</span>
                <span className="adm-kpi__value">{typeof k.value === "number" ? k.fmt(k.value) : k.value}</span>
                <span className={`adm-kpi__sub${k.subClass ? " " + k.subClass : ""}`}>{k.sub}</span>
              </div>
            ))}
          </div>

          {/* TOOLBAR */}
          <div className="adm-toolbar">
            <div className="adm-search">
              <span className="adm-search__icon">🔍</span>
              <input
                className="adm-search__input"
                placeholder="Search email, order ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {["all","paid","pending","cancelled"].map((f) => (
              <button
                key={f}
                className={`adm-filter${filter === f ? " active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}

            <select className="adm-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="high">Highest Value</option>
              <option value="low">Lowest Value</option>
            </select>

            {!loading && (
              <span className="adm-toolbar__count">
                <span>{displayed.length}</span> order{displayed.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* TABLE */}
          <div className="adm-table-wrap">
            <table className="adm-table">
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
                  <tr key={i} className="adm-skel">
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j}>
                        <div className="adm-skel-line" style={{ width: `${[80,130,70,90,60,110,30,20][j]}px` }} />
                      </td>
                    ))}
                  </tr>
                ))}

                {/* error */}
                {!loading && error && (
                  <tr><td colSpan={8}>
                    <div className="adm-state">
                      <span className="adm-state__icon">⚠️</span>
                      <p className="adm-state__title">Failed to load orders</p>
                      <p className="adm-state__sub">{error}</p>
                    </div>
                  </td></tr>
                )}

                {/* empty */}
                {!loading && !error && displayed.length === 0 && (
                  <tr><td colSpan={8}>
                    <div className="adm-state">
                      <span className="adm-state__icon">📭</span>
                      <p className="adm-state__title">No orders found</p>
                      <p className="adm-state__sub">Try adjusting your search or filter.</p>
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

      <Footer />
    </>
  );
};

export default Admin;