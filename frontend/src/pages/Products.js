import { useEffect, useState, useMemo } from "react";
import Footer from "../components/Footer";
import API from "../api/api";
import ProductCard from "../components/ProductCard";

/* ── WEBSITE EXCLUSIVE PRODUCTS ─────────────────────────────────────
   Add or remove product names here to control the exclusive tag.
   Must match exactly what's in your database (case-sensitive).
─────────────────────────────────────────────────────────────────────── */
const EXCLUSIVE_PRODUCTS = [
  "Evening",
  "Citrus Rush",
  "Starter Kit",
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@300;400;500&display=swap');

  :root {
    --black:  #000000; --dark: #0a0a0a; --panel: #111111;
    --gold: #C9A84C; --gold2: #E2B84A; --yellow: #D4C028;
    --white: #FFFFFF; --muted: #888888; --border: rgba(201,168,76,0.2);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--black); color: var(--white); font-family: 'Jost', sans-serif; overflow-x: hidden; }

  /* ── HERO ───────────────────────────────────────────────────────── */
  .pr-hero {
    position: relative; padding: 10rem 3rem 5rem;
    background: var(--black); border-bottom: 1px solid var(--border);
    overflow: hidden; display: flex; flex-direction: column; gap: 1.2rem;
  }
  .pr-hero__wordmark {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none; user-select: none; z-index: 0;
  }
  .pr-hero__wordmark span {
    font-family: 'Bebas Neue', sans-serif; font-size: clamp(8rem, 18vw, 16rem);
    letter-spacing: 0.02em; color: transparent;
    -webkit-text-stroke: 1px rgba(201,168,76,0.08);
    white-space: nowrap; animation: fadeIn 1.2s ease forwards;
  }
  .pr-hero__glow {
    position: absolute; top: -80px; right: -80px;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(180,130,40,0.12) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .pr-hero__eyebrow {
    position: relative; z-index: 1;
    font-size: 0.68rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold);
    animation: fadeUp 0.8s ease forwards 0.2s; opacity: 0;
  }
  .pr-hero__title {
    position: relative; z-index: 1;
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3.5rem, 8vw, 8rem); letter-spacing: 0.03em; color: var(--white); line-height: 0.95;
    animation: fadeUp 0.9s ease forwards 0.35s; opacity: 0;
  }
  .pr-hero__title span { color: var(--gold); }
  .pr-hero__sub {
    position: relative; z-index: 1;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1rem, 1.5vw, 1.2rem); font-weight: 300; font-style: italic;
    color: var(--muted); max-width: 48ch; line-height: 1.7;
    animation: fadeUp 0.9s ease forwards 0.5s; opacity: 0;
  }

  /* exclusive banner */
  .pr-exclusive-banner {
    position: relative; z-index: 1;
    display: inline-flex; align-items: center; gap: 0.75rem;
    border: 1px solid rgba(201,168,76,0.3);
    padding: 0.6rem 1.25rem; align-self: flex-start;
    animation: fadeUp 0.9s ease forwards 0.65s; opacity: 0;
    background: rgba(201,168,76,0.04);
  }
  .pr-exclusive-banner__dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--gold);
    animation: pulse 2s ease-in-out infinite;
  }
  .pr-exclusive-banner__text {
    font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold);
  }

  /* ── TOOLBAR ────────────────────────────────────────────────────── */
  .pr-toolbar {
    position: sticky; top: 0; z-index: 50;
    background: rgba(0,0,0,0.96); backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border);
    padding: 1rem 3rem; display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;
  }
  .pr-search { position: relative; flex: 1; min-width: 200px; max-width: 360px; }
  .pr-search__icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 0.85rem; pointer-events: none; }
  .pr-search__input {
    width: 100%; background: var(--panel); border: 1px solid var(--border);
    color: var(--white); font-family: 'Jost', sans-serif; font-size: 0.82rem;
    letter-spacing: 0.04em; padding: 0.65rem 1rem 0.65rem 2.5rem;
    border-radius: 3px; outline: none; transition: border-color 0.2s;
  }
  .pr-search__input::placeholder { color: var(--muted); }
  .pr-search__input:focus { border-color: var(--gold); }

  .pr-filters { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .pr-filter {
    background: transparent; border: 1px solid var(--border); color: var(--muted);
    font-family: 'Jost', sans-serif; font-size: 0.7rem; letter-spacing: 0.12em;
    text-transform: uppercase; padding: 0.45rem 1.1rem; border-radius: 2px;
    cursor: pointer; transition: all 0.2s; white-space: nowrap;
  }
  .pr-filter:hover { border-color: var(--gold); color: var(--white); }
  .pr-filter.active { background: var(--gold); color: var(--black); border-color: var(--gold); }

  /* exclusive filter pill — gold outline style */
  .pr-filter--exclusive {
    border-color: rgba(201,168,76,0.5); color: var(--gold);
    display: flex; align-items: center; gap: 0.4rem;
  }
  .pr-filter--exclusive.active { background: var(--gold); color: var(--black); }
  .pr-filter--exclusive-dot {
    width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0;
  }

  .pr-sort {
    background: var(--panel); border: 1px solid var(--border); color: var(--muted);
    font-family: 'Jost', sans-serif; font-size: 0.75rem; letter-spacing: 0.06em;
    padding: 0.6rem 2.2rem 0.6rem 1rem; border-radius: 3px; outline: none;
    cursor: pointer; transition: border-color 0.2s; appearance: none; -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 0.75rem center;
  }
  .pr-sort:focus { border-color: var(--gold); }
  .pr-sort option { background: var(--dark); }

  .pr-count { font-size: 0.72rem; letter-spacing: 0.08em; color: var(--muted); margin-left: auto; white-space: nowrap; }
  .pr-count span { color: var(--gold); }

  /* ── GRID ───────────────────────────────────────────────────────── */
  .pr-body { background: var(--black); padding: 4rem 3rem 6rem; }

  /* exclusive section header */
  .pr-section-label {
    display: flex; align-items: center; gap: 1rem;
    margin-bottom: 1px; padding: 1.25rem 0 1rem;
  }
  .pr-section-label__line { flex: 1; height: 1px; background: var(--border); }
  .pr-section-label__text {
    font-size: 0.62rem; letter-spacing: 0.28em; text-transform: uppercase;
    color: var(--gold); white-space: nowrap; display: flex; align-items: center; gap: 0.5rem;
  }
  .pr-section-label__dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); }

  .pr-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1px; background: var(--border);
  }

  /* ── EXCLUSIVE CARD WRAPPER ─────────────────────────────────────── */
  .pr-exclusive-wrap { position: relative; }
  .pr-exclusive-tag {
    position: absolute; top: 0; left: 0; z-index: 10;
    background: var(--gold); color: var(--black);
    font-family: 'Jost', sans-serif; font-size: 0.55rem;
    font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 0.3rem 0.75rem;
    clip-path: polygon(0 0, 100% 0, 90% 100%, 0 100%);
    pointer-events: none;
  }

  /* ── STATES ─────────────────────────────────────────────────────── */
  .pr-state {
    background: var(--black); grid-column: 1 / -1;
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 1.5rem; padding: 8rem 2rem; text-align: center;
  }
  .pr-state__icon { font-size: 3rem; opacity: 0.4; }
  .pr-state__title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 300; color: var(--white); }
  .pr-state__sub { font-size: 0.85rem; color: var(--muted); max-width: 36ch; line-height: 1.7; }

  .pr-skeleton-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1px; background: var(--border); }
  .pr-skeleton { background: var(--dark); display: flex; flex-direction: column; }
  .pr-skeleton__img {
    width: 100%; aspect-ratio: 3/4;
    background: linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%);
    background-size: 200% 100%; animation: shimmer 1.6s ease-in-out infinite;
  }
  .pr-skeleton__body { padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
  .pr-skeleton__line {
    height: 0.8rem; border-radius: 2px;
    background: linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%);
    background-size: 200% 100%; animation: shimmer 1.6s ease-in-out infinite;
  }
  .pr-skeleton__line--title { width: 65%; height: 1.1rem; }
  .pr-skeleton__line--sm    { width: 45%; }

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
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
  @keyframes pulse   { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  /* ── RESPONSIVE ─────────────────────────────────────────────────── */
  @media (max-width: 768px) {
    .pr-hero { padding: 8rem 1.5rem 3.5rem; }
    .pr-toolbar { padding: 0.75rem 1.5rem; }
    .pr-body { padding: 2.5rem 1.5rem 4rem; }
    .pr-search { max-width: 100%; }
    .pr-count { display: none; }
    .yt-footer { flex-direction: column; align-items: center; text-align: center; }
  }
`;

const SkeletonCard = () => (
  <div className="pr-skeleton">
    <div className="pr-skeleton__img" />
    <div className="pr-skeleton__body">
      <div className="pr-skeleton__line pr-skeleton__line--title" />
      <div className="pr-skeleton__line" />
      <div className="pr-skeleton__line pr-skeleton__line--sm" />
    </div>
  </div>
);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [sort,     setSort]     = useState("default");
  const [showExclusive, setShowExclusive] = useState(false);

  useEffect(() => {
    setLoading(true);
    API.get("/products")
      .then((res) => { setProducts(res.data); setLoading(false); })
      .catch((err) => { console.error(err); setError("Couldn't load products. Please try again."); setLoading(false); });
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return ["All", ...cats];
  }, [products]);

  const displayed = useMemo(() => {
    let list = [...products];

    if (showExclusive) {
      list = list.filter((p) => EXCLUSIVE_PRODUCTS.includes(p.name));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name?.toLowerCase().includes(q) ||
               p.description?.toLowerCase().includes(q) ||
               p.category?.toLowerCase().includes(q)
      );
    }

    if (category !== "All") {
      list = list.filter((p) => p.category === category);
    }

    if (sort === "price-asc")  list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name-asc")   list.sort((a, b) => a.name.localeCompare(b.name));
    // Put exclusive products first in default sort
    if (sort === "default") {
      list.sort((a, b) => {
        const aEx = EXCLUSIVE_PRODUCTS.includes(a.name) ? 0 : 1;
        const bEx = EXCLUSIVE_PRODUCTS.includes(b.name) ? 0 : 1;
        return aEx - bEx;
      });
    }

    return list;
  }, [products, search, category, sort, showExclusive]);

  const exclusiveCount = products.filter((p) => EXCLUSIVE_PRODUCTS.includes(p.name)).length;

  return (
    <>
      <style>{css}</style>

      {/* HERO */}
      <section className="pr-hero">
        <div className="pr-hero__wordmark" aria-hidden="true"><span>COLLECTION</span></div>
        <div className="pr-hero__glow" aria-hidden="true" />
        <p className="pr-hero__eyebrow">Youthentic Singapore · 2025 Collection</p>
        <h1 className="pr-hero__title">FIND YOUR<br /><span>SCENT.</span></h1>
        <p className="pr-hero__sub">
          Pocket-sized luxury, crafted in Indonesia.
          Every formula heat-tested and humidity-stable for Singapore.
        </p>
        <div className="pr-exclusive-banner">
          <div className="pr-exclusive-banner__dot" />
          <span className="pr-exclusive-banner__text">
            {exclusiveCount} Website Exclusive scents available
          </span>
        </div>
      </section>

      {/* TOOLBAR */}
      <div className="pr-toolbar">
        <div className="pr-search">
          <span className="pr-search__icon">🔍</span>
          <input
            className="pr-search__input"
            type="text"
            placeholder="Search scents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search products"
          />
        </div>

        <div className="pr-filters" role="group" aria-label="Filter by category">
          {/* {categories.map((cat) => (
            <button
              key={cat}
              className={`pr-filter${category === cat ? " active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))} */}
          {/* exclusive filter pill */}
          <button
            className={`pr-filter pr-filter--exclusive${showExclusive ? " active" : ""}`}
            onClick={() => setShowExclusive((v) => !v)}
          >
            <span className="pr-filter--exclusive-dot" />
            Web Exclusive
          </button>
        </div>

        <select className="pr-sort" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
          <option value="default">Featured</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="name-asc">Name: A → Z</option>
        </select>

        {!loading && (
          <div className="pr-count">
            <span>{displayed.length}</span> product{displayed.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* GRID */}
      <main className="pr-body">
        {loading && (
          <div className="pr-skeleton-grid">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && error && (
          <div className="pr-grid">
            <div className="pr-state">
              <span className="pr-state__icon">⚠️</span>
              <p className="pr-state__title">Something went wrong</p>
              <p className="pr-state__sub">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && displayed.length === 0 && (
          <div className="pr-grid">
            <div className="pr-state">
              <span className="pr-state__icon">🫧</span>
              <p className="pr-state__title">No scents found</p>
              <p className="pr-state__sub">Try a different search term or category.</p>
            </div>
          </div>
        )}

        {!loading && !error && displayed.length > 0 && (
          <>
            {/* if not filtering exclusively, show exclusive section label */}
            {showExclusive && displayed.some((p) => EXCLUSIVE_PRODUCTS.includes(p.name)) && (
              <div className="pr-section-label">
                <div className="pr-section-label__line" />
                <span className="pr-section-label__text">
                  <span className="pr-section-label__dot" />
                  Website Exclusives
                </span>
                <div className="pr-section-label__line" />
              </div>
            )}

            <div className="pr-grid">
              {displayed.map((product) => {
                const isExclusive = EXCLUSIVE_PRODUCTS.includes(product.name);
                return (
                  <div key={product.id} className={isExclusive ? "pr-exclusive-wrap" : ""}>
                    {isExclusive && (
                      <div className="pr-exclusive-tag">✦ Web Exclusive</div>
                    )}
                    <ProductCard product={product} />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* FOOTER */}
      {/* FOOTER */}
      <Footer />
    </>
  );
};

export default Products;