import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  :root {
    --black: #000; --dark: #0a0a0a; --panel: #111;
    --gold: #C9A84C; --gold2: #E2B84A; --yellow: #D4C028;
    --white: #fff; --muted: #888; --border: rgba(201,168,76,0.2);
    --green: #6dbf82;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--black); color: var(--white); font-family: 'Jost', sans-serif; }

  .sc-page {
    min-height: 100svh; background: var(--black);
    display: flex; flex-direction: column;
    position: relative;
  }
  .sc-main {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 4rem 2rem; position: relative; overflow: hidden;
  }

  /* radial glow */
  .sc-page::before {
    content: ''; position: absolute;
    top: 50%; left: 50%; transform: translate(-50%, -60%);
    width: 700px; height: 700px; border-radius: 50%;
    background: radial-gradient(ellipse, rgba(109,191,130,0.1) 0%, transparent 65%);
    pointer-events: none;
  }

  /* ghosted wordmark */
  .sc-wordmark {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none; user-select: none;
  }
  .sc-wordmark span {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(8rem, 22vw, 20rem);
    color: transparent; -webkit-text-stroke: 1px rgba(109,191,130,0.07);
    white-space: nowrap; letter-spacing: 0.02em;
  }

  .sc-content {
    position: relative; z-index: 1;
    display: flex; flex-direction: column;
    align-items: center; gap: 2rem; text-align: center;
    max-width: 600px; width: 100%;
  }

  /* animated check */
  .sc-check {
    width: 5rem; height: 5rem; border-radius: 50%;
    border: 1px solid rgba(109,191,130,0.4);
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem;
    animation: checkPop 0.6s cubic-bezier(0.22,1,0.36,1) forwards;
    opacity: 0;
    box-shadow: 0 0 40px rgba(109,191,130,0.15);
  }

  .sc-eyebrow {
    font-size: 0.68rem; letter-spacing: 0.28em; text-transform: uppercase;
    color: var(--green); animation: fadeUp 0.7s ease forwards 0.3s; opacity: 0;
  }

  .sc-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 8vw, 6.5rem); letter-spacing: 0.04em; color: var(--white); line-height: 0.95;
    animation: fadeUp 0.8s ease forwards 0.4s; opacity: 0;
  }
  .sc-title span { color: var(--green); }

  .sc-sub {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1rem, 1.8vw, 1.2rem); font-weight: 300; font-style: italic;
    color: var(--muted); line-height: 1.8; max-width: 40ch;
    animation: fadeUp 0.8s ease forwards 0.5s; opacity: 0;
  }

  /* info cards */
  .sc-cards {
    display: grid; grid-template-columns: repeat(3,1fr); gap: 1px;
    background: var(--border); width: 100%;
    animation: fadeUp 0.8s ease forwards 0.6s; opacity: 0;
  }
  .sc-card {
    background: var(--dark); padding: 1.5rem 1.25rem;
    display: flex; flex-direction: column; gap: 0.5rem; align-items: center; text-align: center;
  }
  .sc-card__icon { font-size: 1.4rem; }
  .sc-card__label {
    font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted);
  }
  .sc-card__val { font-size: 0.82rem; color: var(--white); line-height: 1.4; }

  .sc-divider {
    width: 100%; height: 1px; background: var(--border);
    animation: fadeUp 0.6s ease forwards 0.65s; opacity: 0;
  }

  /* actions */
  .sc-actions {
    display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;
    animation: fadeUp 0.8s ease forwards 0.7s; opacity: 0;
  }
  .sc-btn-primary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--yellow); color: var(--black);
    font-family: 'Jost', sans-serif; font-size: 0.82rem; font-weight: 500;
    letter-spacing: 0.08em; border: none; padding: 0.85rem 2.2rem;
    cursor: pointer; text-decoration: none; transition: background 0.2s, transform 0.15s;
  }
  .sc-btn-primary:hover { background: var(--gold2); transform: translateY(-2px); }
  .sc-btn-ghost {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: transparent; border: 1px solid var(--border); color: var(--muted);
    font-family: 'Jost', sans-serif; font-size: 0.78rem; font-weight: 400;
    letter-spacing: 0.1em; text-transform: uppercase; padding: 0.8rem 1.8rem;
    cursor: pointer; text-decoration: none; transition: border-color 0.2s, color 0.2s;
  }
  .sc-btn-ghost:hover { border-color: var(--gold); color: var(--white); }

  /* loyalty earn notice */
  .sc-loyalty {
    display: flex; align-items: center; gap: 0.75rem;
    border: 1px solid var(--border); padding: 1rem 1.5rem; width: 100%;
    background: var(--dark);
    animation: fadeUp 0.8s ease forwards 0.8s; opacity: 0;
  }
  .sc-loyalty__icon { font-size: 1.1rem; flex-shrink: 0; }
  .sc-loyalty__text { font-size: 0.78rem; color: var(--muted); line-height: 1.5; text-align: left; }
  .sc-loyalty__text strong { color: var(--gold); display: block; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes checkPop { 0% { opacity:0; transform:scale(0.5); } 70% { transform:scale(1.1); } 100% { opacity:1; transform:scale(1); } }

  @media (max-width: 600px) {
    .sc-cards { grid-template-columns: 1fr; }
    .sc-actions { flex-direction: column; width: 100%; }
    .sc-btn-primary, .sc-btn-ghost { justify-content: center; }
  }
`;

const Success = () => {
  const { cart, clearCart } = useCart();

  useEffect(() => {
    // Clear cart after successful payment
    if (clearCart) clearCart();
  }, []);

  return (
    <>
      <style>{css}</style>
      <div className="sc-page">
        <div className="sc-main">
        <div className="sc-wordmark" aria-hidden="true"><span>SUCCESS</span></div>

        <div className="sc-content">
          <div className="sc-check">✓</div>

          <p className="sc-eyebrow">Payment Confirmed · Youthentic Singapore</p>

          <h1 className="sc-title">
            ORDER<br /><span>CONFIRMED.</span>
          </h1>

          <p className="sc-sub">
            Your scents are on their way. We'll send a confirmation
            to your email with your order details.
          </p>

          <div className="sc-cards">
            {[
              { icon: "📧", label: "Confirmation",  val: "Email sent to your inbox" },
              { icon: "📦", label: "Processing",    val: "Ready within 1–2 business days" },
              { icon: "🇸🇬", label: "Delivery",     val: "Islandwide Singapore shipping" },
            ].map((c) => (
              <div key={c.label} className="sc-card">
                <span className="sc-card__icon">{c.icon}</span>
                <span className="sc-card__label">{c.label}</span>
                <span className="sc-card__val">{c.val}</span>
              </div>
            ))}
          </div>

          <div className="sc-loyalty">
            <span className="sc-loyalty__icon">✦</span>
            <div className="sc-loyalty__text">
              <strong>Points added to your account</strong>
              Keep shopping to climb toward Silver and Gold — more points,
              better multipliers, exclusive discounts.
            </div>
          </div>

          <div className="sc-divider" />

          <div className="sc-actions">
            <Link to="/products" className="sc-btn-primary">Continue Shopping →</Link>
            <Link to="/loyalty"  className="sc-btn-ghost">View My Points</Link>
          </div>
        </div>
        </div>{/* end sc-main */}
        <Footer />
      </div>
    </>
  );
};

export default Success;