import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  :root {
    --black: #000; --dark: #0a0a0a; --panel: #111;
    --gold: #C9A84C; --gold2: #E2B84A; --yellow: #D4C028;
    --white: #fff; --muted: #888; --border: rgba(201,168,76,0.2);
    --red: #e05a4a;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--black); color: var(--white); font-family: 'Jost', sans-serif; }

  .cn-page {
    min-height: 100svh; background: var(--black);
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 4rem 2rem;
    position: relative; overflow: hidden;
  }

  .cn-page::before {
    content: ''; position: absolute;
    top: 50%; left: 50%; transform: translate(-50%, -60%);
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(ellipse, rgba(224,90,74,0.08) 0%, transparent 65%);
    pointer-events: none;
  }

  .cn-wordmark {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none; user-select: none;
  }
  .cn-wordmark span {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(8rem, 22vw, 20rem);
    color: transparent; -webkit-text-stroke: 1px rgba(224,90,74,0.06);
    white-space: nowrap; letter-spacing: 0.02em;
  }

  .cn-content {
    position: relative; z-index: 1;
    display: flex; flex-direction: column;
    align-items: center; gap: 2rem; text-align: center;
    max-width: 560px; width: 100%;
  }

  .cn-icon {
    width: 5rem; height: 5rem; border-radius: 50%;
    border: 1px solid rgba(224,90,74,0.35);
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem;
    animation: iconPop 0.6s cubic-bezier(0.22,1,0.36,1) forwards; opacity: 0;
    box-shadow: 0 0 40px rgba(224,90,74,0.1);
  }

  .cn-eyebrow {
    font-size: 0.68rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--red);
    animation: fadeUp 0.7s ease forwards 0.3s; opacity: 0;
  }

  .cn-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 8vw, 6.5rem); letter-spacing: 0.04em; color: var(--white); line-height: 0.95;
    animation: fadeUp 0.8s ease forwards 0.4s; opacity: 0;
  }
  .cn-title span { color: var(--muted); }

  .cn-sub {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1rem, 1.8vw, 1.15rem); font-weight: 300; font-style: italic;
    color: var(--muted); line-height: 1.8; max-width: 38ch;
    animation: fadeUp 0.8s ease forwards 0.5s; opacity: 0;
  }

  /* reassurance strip */
  .cn-reassure {
    background: var(--dark); border: 1px solid var(--border);
    padding: 1.25rem 1.5rem; width: 100%;
    display: flex; align-items: flex-start; gap: 1rem;
    animation: fadeUp 0.8s ease forwards 0.6s; opacity: 0;
  }
  .cn-reassure__icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 0.1rem; }
  .cn-reassure__text { font-size: 0.8rem; color: var(--muted); line-height: 1.7; text-align: left; }
  .cn-reassure__text strong { color: var(--white); display: block; margin-bottom: 0.2rem; }

  .cn-divider {
    width: 100%; height: 1px; background: var(--border);
    animation: fadeUp 0.6s ease forwards 0.65s; opacity: 0;
  }

  .cn-actions {
    display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;
    animation: fadeUp 0.8s ease forwards 0.7s; opacity: 0;
  }
  .cn-btn-primary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--yellow); color: var(--black);
    font-family: 'Jost', sans-serif; font-size: 0.82rem; font-weight: 500;
    letter-spacing: 0.08em; border: none; padding: 0.85rem 2.2rem;
    cursor: pointer; text-decoration: none; transition: background 0.2s, transform 0.15s;
  }
  .cn-btn-primary:hover { background: var(--gold2); transform: translateY(-2px); }
  .cn-btn-ghost {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: transparent; border: 1px solid var(--border); color: var(--muted);
    font-family: 'Jost', sans-serif; font-size: 0.78rem; font-weight: 400;
    letter-spacing: 0.1em; text-transform: uppercase; padding: 0.8rem 1.8rem;
    cursor: pointer; text-decoration: none; transition: border-color 0.2s, color 0.2s;
  }
  .cn-btn-ghost:hover { border-color: var(--gold); color: var(--white); }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes iconPop  { 0% { opacity:0; transform:scale(0.5); } 70% { transform:scale(1.1); } 100% { opacity:1; transform:scale(1); } }

  @media (max-width: 500px) {
    .cn-actions { flex-direction: column; width: 100%; }
    .cn-btn-primary, .cn-btn-ghost { justify-content: center; }
  }
`;

const Cancel = () => (
  <>
    <style>{css}</style>
    <div className="cn-page">
      <div className="cn-wordmark" aria-hidden="true"><span>CANCELLED</span></div>

      <div className="cn-content">
        <div className="cn-icon">✕</div>

        <p className="cn-eyebrow">Payment Cancelled · Youthentic Singapore</p>

        <h1 className="cn-title">
          PAYMENT<br /><span>CANCELLED.</span>
        </h1>

        <p className="cn-sub">
          No charge was made. Your cart is still saved —
          head back whenever you're ready.
        </p>

        <div className="cn-reassure">
          <span className="cn-reassure__icon">🔒</span>
          <div className="cn-reassure__text">
            <strong>You have not been charged</strong>
            Your payment was cancelled before completion.
            All items remain in your cart and no money has left your account.
          </div>
        </div>

        <div className="cn-divider" />

        <div className="cn-actions">
          <Link to="/cart"     className="cn-btn-primary">Return to Cart →</Link>
          <Link to="/products" className="cn-btn-ghost">Browse Products</Link>
        </div>
      </div>

      <Footer />
    </div>
  </>
);

export default Cancel;