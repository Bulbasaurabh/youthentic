import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Jost:wght@300;400;500&display=swap');

  :root {
    --black:  #000000;
    --dark:   #0a0a0a;
    --gold:   #C9A84C;
    --gold2:  #E2B84A;
    --yellow: #D4C028;
    --white:  #FFFFFF;
    --muted:  #888888;
    --border: rgba(201,168,76,0.2);
  }

  /* ─── NAV BASE ─────────────────────────────────────────────────── */
  .yt-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.4rem 3rem;
    background: linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%);
    transition: background 0.4s, padding 0.3s, border-color 0.4s;
    border-bottom: 1px solid transparent;
    font-family: 'Jost', sans-serif;
  }

  /* scrolled state */
  .yt-nav.scrolled {
    background: rgba(0,0,0,0.96);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border);
    padding: 0.95rem 3rem;
  }

  /* ─── LOGO ─────────────────────────────────────────────────────── */
  .yt-nav__logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.45rem;
    letter-spacing: 0.18em;
    color: var(--white);
    text-decoration: none;
    transition: color 0.2s;
    flex-shrink: 0;
  }
  .yt-nav__logo:hover { color: var(--gold); }

  /* ─── LINKS ────────────────────────────────────────────────────── */
  .yt-nav__links {
    display: flex;
    gap: 2.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .yt-nav__links a {
    font-size: 0.78rem;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.65);
    text-decoration: none;
    transition: color 0.2s;
    position: relative;
  }
  .yt-nav__links a::after {
    content: '';
    position: absolute;
    bottom: -3px; left: 0; right: 0;
    height: 1px;
    background: var(--gold);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s ease;
  }
  .yt-nav__links a:hover { color: var(--white); }
  .yt-nav__links a:hover::after { transform: scaleX(1); }

  /* ─── RIGHT CLUSTER ────────────────────────────────────────────── */
  .yt-nav__right {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;
  }

  /* cart icon button */
  .yt-nav__cart {
    position: relative;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--white);
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1rem;
    text-decoration: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .yt-nav__cart:hover { border-color: var(--gold); background: rgba(201,168,76,0.08); }

  /* badge */
  .yt-nav__badge {
    position: absolute;
    top: -6px;
    right: -6px;
    background: var(--yellow);
    color: var(--black);
    font-family: 'Jost', sans-serif;
    font-size: 0.6rem;
    font-weight: 600;
    min-width: 16px;
    height: 16px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    line-height: 1;
    pointer-events: none;
    animation: badgePop 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }

  /* shop now cta */
  .yt-nav__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    background: var(--yellow);
    color: var(--black);
    font-family: 'Jost', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.07em;
    border: none;
    padding: 0.6rem 1.35rem;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.2s, transform 0.15s;
    white-space: nowrap;
  }
  .yt-nav__cta:hover { background: var(--gold2); transform: translateY(-1px); }

  /* ─── MOBILE HAMBURGER ─────────────────────────────────────────── */
  .yt-nav__hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    z-index: 1001;
  }
  .yt-nav__hamburger span {
    display: block;
    width: 22px;
    height: 1.5px;
    background: var(--white);
    transition: transform 0.3s, opacity 0.3s, width 0.3s;
    transform-origin: center;
  }
  /* open state */
  .yt-nav__hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .yt-nav__hamburger.open span:nth-child(2) { opacity: 0; width: 0; }
  .yt-nav__hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  /* ─── MOBILE DRAWER ────────────────────────────────────────────── */
  .yt-nav__drawer {
    position: fixed;
    top: 0; right: 0;
    width: min(320px, 85vw);
    height: 100svh;
    background: #050505;
    border-left: 1px solid var(--border);
    z-index: 999;
    display: flex;
    flex-direction: column;
    padding: 6rem 2.5rem 3rem;
    gap: 0;
    transform: translateX(100%);
    transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
    pointer-events: none;
  }
  .yt-nav__drawer.open {
    transform: translateX(0);
    pointer-events: all;
  }

  .yt-nav__drawer-links {
    list-style: none;
    margin: 0; padding: 0;
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--border);
  }
  .yt-nav__drawer-links li {
    border-bottom: 1px solid var(--border);
  }
  .yt-nav__drawer-links a {
    display: block;
    padding: 1.2rem 0;
    font-family: 'Jost', sans-serif;
    font-size: 0.88rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
    text-decoration: none;
    transition: color 0.2s, padding-left 0.2s;
  }
  .yt-nav__drawer-links a:hover { color: var(--gold); padding-left: 0.5rem; }

  .yt-nav__drawer-cta {
    margin-top: 2.5rem;
  }

  /* ── OVERLAY ── */
  .yt-nav__overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 998;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
  }
  .yt-nav__overlay.open {
    opacity: 1;
    pointer-events: all;
  }

  /* ─── KEYFRAMES ────────────────────────────────────────────────── */
  @keyframes badgePop {
    from { transform: scale(0); }
    to   { transform: scale(1); }
  }

  /* ─── RESPONSIVE ───────────────────────────────────────────────── */
  @media (max-width: 768px) {
    .yt-nav { padding: 1.1rem 1.5rem; }
    .yt-nav.scrolled { padding: 0.85rem 1.5rem; }
    .yt-nav__links { display: none; }
    .yt-nav__cta { display: none; }
    .yt-nav__hamburger { display: flex; }
  }
`;

const NAV_LINKS = [
  { label: "Home",     href: "/" },
  { label: "About",    href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Scent Quiz",     href: "/quiz" },
];

const Navbar = () => {
  const { cart } = useCart();
  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);

  // total item count across all cart entries
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity ?? 1), 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <style>{css}</style>

      {/* ── MAIN NAV ─────────────────────────────────────────────── */}
      <nav className={`yt-nav${scrolled ? " scrolled" : ""}`}>

        {/* Logo */}
        <Link to="/" className="yt-nav__logo">YOUTHENTIC</Link>

        {/* Desktop links */}
        <ul className="yt-nav__links">
          {NAV_LINKS.map((l) => (
            <li key={l.href}><Link to={l.href}>{l.label}</Link></li>
          ))}
        </ul>

        {/* Right cluster */}
        <div className="yt-nav__right">
          {/* Cart icon */}
          <Link to="/cart" className="yt-nav__cart" aria-label={`Cart · ${cartCount} items`}>
            🛒
            {cartCount > 0 && (
              <span key={cartCount} className="yt-nav__badge">{cartCount}</span>
            )}
          </Link>

          {/* Desktop CTA */}
          <Link to="/products" className="yt-nav__cta">
            Shop Now
          </Link>

          {/* Mobile hamburger */}
          <button
            className={`yt-nav__hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ────────────────────────────────────────── */}
      <div
        className={`yt-nav__overlay${menuOpen ? " open" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <div
        className={`yt-nav__drawer${menuOpen ? " open" : ""}`}
        role="dialog"
        aria-label="Navigation menu"
      >
        <ul className="yt-nav__drawer-links">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link to={l.href} onClick={closeMenu}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <div className="yt-nav__drawer-cta">
          <Link to="/products" className="yt-nav__cta" onClick={closeMenu}
            style={{ display: "inline-flex", width: "100%", justifyContent: "center" }}>
            Shop Now →
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;