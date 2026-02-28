import { useState, useEffect, useCallback } from "react";
import { useCart } from "../context/CartContext";

/* ─── IMAGE LOADER ─────────────────────────────────────────────── */
const getImage = (name) => {
  try {
    return require(`../assets/${name}.png`);
  } catch {
    return null;
  }
};

/* ─── STYLES ───────────────────────────────────────────────────── */
const css = `
  /* ── CARD ─────────────────────────────────────────────────────── */
  .yt-pcard {
    position: relative;
    background: #0a0a0a;
    border: 1px solid rgba(201,168,76,0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: border-color 0.35s, transform 0.35s, box-shadow 0.35s;
    cursor: pointer;
  }
  .yt-pcard:hover {
    border-color: rgba(201,168,76,0.5);
    transform: translateY(-5px);
    box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.08);
  }
  .yt-pcard::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, #C9A84C, #E2B84A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s ease;
  }
  .yt-pcard:hover::after { transform: scaleX(1); }

  /* image */
  .yt-pcard__img-wrap {
    position: relative; width: 100%; aspect-ratio: 3/4;
    overflow: hidden; background: #111; flex-shrink: 0;
  }
  .yt-pcard__img {
    width: 100%; height: 100%; object-fit: cover; object-position: center;
    transition: transform 0.6s ease, filter 0.4s ease; filter: brightness(0.88);
  }
  .yt-pcard:hover .yt-pcard__img { transform: scale(1.06); filter: brightness(1); }
  .yt-pcard__img-fallback {
    width: 100%; height: 100%;
    background: radial-gradient(ellipse at 50% 30%, rgba(201,168,76,0.15) 0%, #0a0a0a 70%);
    display: flex; align-items: center; justify-content: center; font-size: 3rem; opacity: 0.3;
  }

  /* badges */
  .yt-pcard__badge {
    position: absolute; top: 1rem; left: 1rem;
    background: rgba(0,0,0,0.75); border: 1px solid rgba(201,168,76,0.35);
    backdrop-filter: blur(6px); padding: 0.3rem 0.75rem;
    font-family: 'Jost', sans-serif; font-size: 0.62rem;
    letter-spacing: 0.18em; text-transform: uppercase; color: #C9A84C;
  }
  .yt-pcard__variant-badge {
    position: absolute; top: 1rem; right: 1rem;
    background: rgba(0,0,0,0.8); border: 1px solid rgba(201,168,76,0.25);
    backdrop-filter: blur(6px); padding: 0.25rem 0.65rem;
    font-family: 'Jost', sans-serif; font-size: 0.6rem;
    letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.6);
  }
  .yt-pcard__variant-badge--bundle {
    color: #C9A84C; border-color: rgba(201,168,76,0.5);
  }
  .yt-pcard__stock {
    position: absolute; bottom: 1rem; right: 1rem;
    background: rgba(180,60,40,0.85); padding: 0.25rem 0.65rem;
    font-family: 'Jost', sans-serif; font-size: 0.6rem;
    letter-spacing: 0.12em; text-transform: uppercase; color: #fff;
  }

  /* hover overlay */
  .yt-pcard__overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.3s; pointer-events: none;
  }
  .yt-pcard:hover .yt-pcard__overlay { opacity: 1; pointer-events: all; }
  .yt-pcard__overlay-btn {
    background: rgba(10,10,10,0.9); border: 1px solid #C9A84C;
    color: #C9A84C; font-family: 'Jost', sans-serif; font-size: 0.72rem;
    font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
    padding: 0.75rem 1.8rem; cursor: pointer;
    transform: translateY(8px); transition: transform 0.3s, background 0.2s, color 0.2s;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .yt-pcard:hover .yt-pcard__overlay-btn { transform: translateY(0); }
  .yt-pcard__overlay-btn:hover { background: #C9A84C; color: #000; }

  /* content */
  .yt-pcard__content {
    padding: 1.5rem; display: flex; flex-direction: column;
    gap: 0.5rem; flex: 1; border-top: 1px solid rgba(201,168,76,0.1);
  }
  .yt-pcard__collection {
    font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: #C9A84C;
  }
  .yt-pcard__name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 400; color: #fff; line-height: 1.2; margin: 0;
  }
  .yt-pcard__desc {
    font-size: 0.76rem; line-height: 1.6; color: #888; font-style: italic;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .yt-pcard__footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 1rem; border-top: 1px solid rgba(201,168,76,0.1); margin-top: auto;
    gap: 0.5rem;
  }
  .yt-pcard__price-wrap { display: flex; flex-direction: column; gap: 0.1rem; }
  .yt-pcard__price {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem;
    letter-spacing: 0.06em; color: #C9A84C; line-height: 1;
  }
  .yt-pcard__price-from {
    font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; color: #666;
  }
  .yt-pcard__sizes {
    display: flex; gap: 0.35rem;
  }
  .yt-pcard__size-chip {
    border: 1px solid rgba(201,168,76,0.3); padding: 0.2rem 0.5rem;
    font-family: 'Jost', sans-serif; font-size: 0.6rem; letter-spacing: 0.1em;
    text-transform: uppercase; color: #888; border-radius: 2px;
  }

  /* ── MODAL OVERLAY ────────────────────────────────────────────── */
  .yt-modal-overlay {
    position: fixed; inset: 0; z-index: 500;
    background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 1.5rem;
    animation: modalOverlayIn 0.3s ease;
  }

  /* ── MODAL BOX ────────────────────────────────────────────────── */
  .yt-modal {
    background: #0a0a0a;
    border: 1px solid rgba(201,168,76,0.25);
    width: 100%; max-width: 820px; max-height: 90svh;
    overflow-y: auto; position: relative;
    display: grid; grid-template-columns: 1fr 1fr;
    animation: modalIn 0.35s cubic-bezier(0.22,1,0.36,1);
  }
  .yt-modal::-webkit-scrollbar { width: 4px; }
  .yt-modal::-webkit-scrollbar-track { background: #0a0a0a; }
  .yt-modal::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); }

  /* modal close */
  .yt-modal__close {
    position: absolute; top: 1rem; right: 1rem; z-index: 10;
    width: 2rem; height: 2rem; background: rgba(0,0,0,0.8);
    border: 1px solid rgba(201,168,76,0.25); color: #888;
    font-size: 1.1rem; cursor: pointer; display: flex;
    align-items: center; justify-content: center;
    transition: border-color 0.2s, color 0.2s;
  }
  .yt-modal__close:hover { border-color: #C9A84C; color: #fff; }

  /* modal image panel */
  .yt-modal__img-panel {
    position: relative; aspect-ratio: 3/4; overflow: hidden; background: #111;
  }
  .yt-modal__img {
    width: 100%; height: 100%; object-fit: cover; object-position: center;
    filter: brightness(0.9);
  }
  .yt-modal__img-fallback {
    width: 100%; height: 100%;
    background: radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.12) 0%, #0a0a0a 70%);
    display: flex; align-items: center; justify-content: center; font-size: 5rem; opacity: 0.2;
  }
  .yt-modal__img-badge {
    position: absolute; bottom: 1.25rem; left: 1.25rem;
    background: rgba(0,0,0,0.8); border: 1px solid rgba(201,168,76,0.35);
    backdrop-filter: blur(6px); padding: 0.3rem 0.9rem;
    font-family: 'Jost', sans-serif; font-size: 0.62rem;
    letter-spacing: 0.18em; text-transform: uppercase; color: #C9A84C;
  }

  /* modal content panel */
  .yt-modal__panel {
    padding: 2.5rem 2rem; display: flex; flex-direction: column;
    gap: 1.25rem; overflow-y: auto;
  }

  .yt-modal__collection {
    font-size: 0.62rem; letter-spacing: 0.25em; text-transform: uppercase; color: #C9A84C;
  }
  .yt-modal__name {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 300; line-height: 1.1; color: #fff;
  }
  .yt-modal__desc {
    font-size: 0.84rem; line-height: 1.85; color: #888; border-top: 1px solid rgba(201,168,76,0.1);
    padding-top: 1.25rem;
  }

  /* notes section */
  .yt-modal__notes { display: flex; flex-direction: column; gap: 0.6rem; }
  .yt-modal__notes-title {
    font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: #C9A84C;
    margin-bottom: 0.25rem;
  }
  .yt-modal__note-row {
    display: flex; align-items: baseline; gap: 0.75rem;
  }
  .yt-modal__note-label {
    font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: #555; width: 3.5rem; flex-shrink: 0;
  }
  .yt-modal__note-pills { display: flex; flex-wrap: wrap; gap: 0.35rem; }
  .yt-modal__note-pill {
    border: 1px solid rgba(201,168,76,0.2); padding: 0.2rem 0.6rem;
    font-family: 'Jost', sans-serif; font-size: 0.68rem; letter-spacing: 0.06em;
    color: #aaa; border-radius: 2px; transition: border-color 0.2s, color 0.2s;
  }
  .yt-modal__note-pill:hover { border-color: #C9A84C; color: #C9A84C; }

  /* meta pills row */
  .yt-modal__meta { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .yt-modal__meta-chip {
    display: flex; align-items: center; gap: 0.4rem;
    border: 1px solid rgba(201,168,76,0.12); padding: 0.3rem 0.75rem;
    font-size: 0.68rem; color: #777; letter-spacing: 0.06em;
  }
  .yt-modal__meta-chip span:first-child { font-size: 0.8rem; }

  /* bundle items */
  .yt-modal__bundle { display: flex; flex-direction: column; gap: 0; }
  .yt-modal__bundle-title {
    font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase;
    color: #C9A84C; margin-bottom: 0.5rem;
  }
  .yt-modal__bundle-item {
    display: flex; align-items: center; gap: 1rem;
    padding: 0.75rem 0; border-bottom: 1px solid rgba(201,168,76,0.08);
  }
  .yt-modal__bundle-item:last-child { border-bottom: none; }
  .yt-modal__bundle-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #C9A84C; flex-shrink: 0;
  }
  .yt-modal__bundle-name { font-size: 0.84rem; color: #fff; flex: 1; }
  .yt-modal__bundle-vol {
    font-size: 0.7rem; letter-spacing: 0.1em; color: #666; text-transform: uppercase;
  }

  /* variant toggle */
  .yt-modal__variant-section { display: flex; flex-direction: column; gap: 0.75rem; }
  .yt-modal__variant-label {
    font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: #C9A84C;
  }
  .yt-modal__variant-toggle {
    display: flex; gap: 0; border: 1px solid rgba(201,168,76,0.2); align-self: flex-start;
  }
  .yt-modal__variant-btn {
    padding: 0.65rem 1.5rem; background: transparent; border: none; cursor: pointer;
    font-family: 'Jost', sans-serif; font-size: 0.78rem; font-weight: 400;
    letter-spacing: 0.08em; color: #666; transition: background 0.2s, color 0.2s;
    display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
  }
  .yt-modal__variant-btn + .yt-modal__variant-btn {
    border-left: 1px solid rgba(201,168,76,0.2);
  }
  .yt-modal__variant-btn.active {
    background: rgba(201,168,76,0.12); color: #C9A84C;
  }
  .yt-modal__variant-btn.active .yt-modal__vbtn-price { color: #E2B84A; }
  .yt-modal__vbtn-size { font-size: 0.82rem; font-weight: 500; }
  .yt-modal__vbtn-price {
    font-family: 'Bebas Neue', sans-serif; font-size: 1rem;
    letter-spacing: 0.06em; color: #555; transition: color 0.2s;
  }
  .yt-modal__vbtn-sub { font-size: 0.6rem; letter-spacing: 0.08em; color: #555; }

  /* selected price display */
  .yt-modal__price-display {
    display: flex; align-items: baseline; gap: 0.75rem;
  }
  .yt-modal__price {
    font-family: 'Bebas Neue', sans-serif; font-size: 2.5rem;
    letter-spacing: 0.05em; color: #C9A84C; line-height: 1;
  }
  .yt-modal__price-note {
    font-size: 0.72rem; color: #666; letter-spacing: 0.06em;
  }

  /* add to cart button */
  .yt-modal__add {
    display: flex; align-items: center; justify-content: center; gap: 0.6rem;
    background: #D4C028; color: #000;
    font-family: 'Jost', sans-serif; font-size: 0.82rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase; border: none;
    padding: 1rem 2rem; cursor: pointer; width: 100%;
    transition: background 0.2s, transform 0.15s;
  }
  .yt-modal__add:hover { background: #E2B84A; transform: translateY(-2px); }
  .yt-modal__add.added { background: #1a1a1a; color: #C9A84C; border: 1px solid #C9A84C; pointer-events: none; }
  .yt-modal__add:disabled { background: #222; color: #555; cursor: not-allowed; transform: none; }

  .yt-modal__stock-warn {
    font-size: 0.72rem; color: #e05a4a; letter-spacing: 0.08em; text-align: center;
  }

  /* ── KEYFRAMES ─────────────────────────────────────────────────── */
  @keyframes modalOverlayIn { from { opacity:0; } to { opacity:1; } }
  @keyframes modalIn {
    from { opacity:0; transform: scale(0.96) translateY(16px); }
    to   { opacity:1; transform: scale(1) translateY(0); }
  }

  /* ── RESPONSIVE ────────────────────────────────────────────────── */
  @media (max-width: 700px) {
    .yt-modal { grid-template-columns: 1fr; max-height: 95svh; }
    .yt-modal__img-panel { aspect-ratio: 4/3; }
    .yt-modal__panel { padding: 1.5rem; }
    .yt-modal__variant-toggle { align-self: stretch; }
    .yt-modal__variant-btn { flex: 1; }
  }
`;

/* ─── PRODUCT MODAL ─────────────────────────────────────────────── */
const ProductModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [variant, setVariant] = useState("10ml");
  const [added,   setAdded]   = useState(false);
  const [imgErr,  setImgErr]  = useState(false);

  const isBundle    = product.variant_type === "bundle";
  const has50ml     = product.price_50ml != null;
  const isOutOfStock = product.stock === 0;

  const currentPrice =
    variant === "50ml" && has50ml ? product.price_50ml : product.price;

  // close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleAdd = () => {
    if (added || isOutOfStock) return;
    addToCart(product, isBundle ? "bundle" : variant);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const imgSrc = getImage(product.name);

  const variantLabel =
    product.variant_type === "single_50ml" ? "50ml"
    : product.variant_type === "bundle"    ? "Bundle"
    : "10ml";

  return (
    <div
      className="yt-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div className="yt-modal">
        <button className="yt-modal__close" onClick={onClose} aria-label="Close">✕</button>

        {/* ── IMAGE PANEL ───────────────────────────────────────── */}
        <div className="yt-modal__img-panel">
          {imgSrc && !imgErr
            ? <img className="yt-modal__img" src={imgSrc} alt={product.name} onError={() => setImgErr(true)} />
            : <div className="yt-modal__img-fallback">🫧</div>
          }
          <span className="yt-modal__img-badge">{variantLabel}</span>
        </div>

        {/* ── CONTENT PANEL ─────────────────────────────────────── */}
        <div className="yt-modal__panel">
          {product.collection && (
            <p className="yt-modal__collection">{product.collection}</p>
          )}
          <h2 className="yt-modal__name">{product.name}</h2>

          {product.description && (
            <p className="yt-modal__desc">{product.description}</p>
          )}

          {/* NOTES — single products */}
          {!isBundle && (product.top_notes?.length || product.middle_notes?.length || product.base_notes?.length) && (
            <div className="yt-modal__notes">
              <p className="yt-modal__notes-title">Fragrance Notes</p>
              {product.top_notes?.length > 0 && (
                <div className="yt-modal__note-row">
                  <span className="yt-modal__note-label">Top</span>
                  <div className="yt-modal__note-pills">
                    {product.top_notes.map((n) => <span key={n} className="yt-modal__note-pill">{n}</span>)}
                  </div>
                </div>
              )}
              {product.middle_notes?.length > 0 && (
                <div className="yt-modal__note-row">
                  <span className="yt-modal__note-label">Heart</span>
                  <div className="yt-modal__note-pills">
                    {product.middle_notes.map((n) => <span key={n} className="yt-modal__note-pill">{n}</span>)}
                  </div>
                </div>
              )}
              {product.base_notes?.length > 0 && (
                <div className="yt-modal__note-row">
                  <span className="yt-modal__note-label">Base</span>
                  <div className="yt-modal__note-pills">
                    {product.base_notes.map((n) => <span key={n} className="yt-modal__note-pill">{n}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BUNDLE CONTENTS */}
          {isBundle && product.bundle_items?.length > 0 && (
            <div className="yt-modal__bundle">
              <p className="yt-modal__bundle-title">Bundle Contents</p>
              {product.bundle_items.map((item, i) => (
                <div key={i} className="yt-modal__bundle-item">
                  <div className="yt-modal__bundle-dot" />
                  <span className="yt-modal__bundle-name">
                    {item.quantity > 1 ? `${item.quantity}× ` : ""}{item.name}
                  </span>
                  <span className="yt-modal__bundle-vol">{item.volume_ml}ml</span>
                </div>
              ))}
            </div>
          )}

          {/* META CHIPS */}
          {(product.longevity || product.projection || product.gender) && (
            <div className="yt-modal__meta">
              {product.longevity  && <div className="yt-modal__meta-chip"><span>⏱</span> {product.longevity}</div>}
              {product.projection && <div className="yt-modal__meta-chip"><span>〰</span> {product.projection}</div>}
              {product.gender     && <div className="yt-modal__meta-chip"><span>✦</span> {product.gender}</div>}
            </div>
          )}

          {/* SIZE TOGGLE — only for single products that have both sizes */}
          {!isBundle && has50ml && (
            <div className="yt-modal__variant-section">
              <p className="yt-modal__variant-label">Select Size</p>
              <div className="yt-modal__variant-toggle">
                <button
                  className={`yt-modal__variant-btn${variant === "10ml" ? " active" : ""}`}
                  onClick={() => setVariant("10ml")}
                >
                  <span className="yt-modal__vbtn-size">10ml</span>
                  <span className="yt-modal__vbtn-price">SGD {Number(product.price).toFixed(0)}</span>
                  <span className="yt-modal__vbtn-sub">Travel size</span>
                </button>
                <button
                  className={`yt-modal__variant-btn${variant === "50ml" ? " active" : ""}`}
                  onClick={() => setVariant("50ml")}
                >
                  <span className="yt-modal__vbtn-size">50ml</span>
                  <span className="yt-modal__vbtn-price">SGD {Number(product.price_50ml).toFixed(0)}</span>
                  <span className="yt-modal__vbtn-sub">Full size</span>
                </button>
              </div>
            </div>
          )}

          {/* PRICE */}
          <div className="yt-modal__price-display">
            <span className="yt-modal__price">SGD {Number(currentPrice).toFixed(2)}</span>
            {!isBundle && (
              <span className="yt-modal__price-note">
                {variant === "50ml" ? "50ml · Full size" : "10ml · Travel size"}
              </span>
            )}
          </div>

          {/* STOCK WARNING */}
          {product.stock <= 5 && product.stock > 0 && (
            <p className="yt-modal__stock-warn">Only {product.stock} left in stock</p>
          )}

          {/* ADD TO CART */}
          <button
            className={`yt-modal__add${added ? " added" : ""}`}
            onClick={handleAdd}
            disabled={isOutOfStock}
          >
            {added         ? "✓ Added to Cart"
             : isOutOfStock ? "Out of Stock"
             : isBundle     ? `Add Bundle to Cart`
             : `Add ${variant} to Cart`}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── PRODUCT CARD ──────────────────────────────────────────────── */
const ProductCard = ({ product }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [imgError,  setImgError]  = useState(false);
  const openModal  = useCallback(() => setModalOpen(true),  []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  // all hooks must be above any early return
  if (!product) return null;

  const isBundle     = product.variant_type === "bundle";
  const has50ml      = product.price_50ml != null;
  const isLowStock   = product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0;
  const imgSrc = getImage(product.name);

  return (
    <>
      <style>{css}</style>

      <div className="yt-pcard" onClick={openModal} role="button" tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && openModal()}
        aria-label={`View ${product.name}`}
      >
        {/* IMAGE */}
        <div className="yt-pcard__img-wrap">
          {imgSrc && !imgError
            ? <img className="yt-pcard__img" src={imgSrc} alt={product.name} onError={() => setImgError(true)} />
            : <div className="yt-pcard__img-fallback">🫧</div>
          }

          {/* collection badge */}
          {product.collection && (
            <span className="yt-pcard__badge">{product.collection}</span>
          )}

          {/* variant type badge */}
          <span className={`yt-pcard__variant-badge${isBundle ? " yt-pcard__variant-badge--bundle" : ""}`}>
            {isBundle ? "Bundle" : has50ml ? "10ml · 50ml" : "10ml"}
          </span>

          {/* stock */}
          {isLowStock  && <span className="yt-pcard__stock">Only {product.stock} left</span>}
          {isOutOfStock && <span className="yt-pcard__stock">Sold Out</span>}

          {/* hover overlay */}
          <div className="yt-pcard__overlay">
            <button className="yt-pcard__overlay-btn" tabIndex={-1}>
              {isBundle ? "View Bundle" : "Select Size"} →
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="yt-pcard__content">
          {product.collection && <span className="yt-pcard__collection">{product.collection}</span>}
          <h3 className="yt-pcard__name">{product.name}</h3>
          {product.description && <p className="yt-pcard__desc">{product.description}</p>}

          <div className="yt-pcard__footer">
            <div className="yt-pcard__price-wrap">
              {has50ml && !isBundle && (
                <span className="yt-pcard__price-from">from</span>
              )}
              <span className="yt-pcard__price">
                SGD {Number(product.price).toFixed(2)}
              </span>
            </div>
            <div className="yt-pcard__sizes">
              {isBundle
                ? <span className="yt-pcard__size-chip">Bundle</span>
                : <>
                    <span className="yt-pcard__size-chip">10ml</span>
                    {has50ml && <span className="yt-pcard__size-chip">50ml</span>}
                  </>
              }
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && <ProductModal product={product} onClose={closeModal} />}
    </>
  );
};

export default ProductCard;