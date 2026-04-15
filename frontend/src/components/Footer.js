import { Link } from "react-router-dom";

const css = `
  .yt-footer {
    background: #000000;
    border-top: 1px solid rgba(201,168,76,0.2);
    padding: 2rem 3rem 1.25rem;
    font-family: 'Jost', sans-serif;
  }
  .yt-footer__top {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 3rem;
    padding-bottom: 2.5rem;
    border-bottom: 1px solid rgba(201,168,76,0.1);
    margin-bottom: 2rem;
  }
  .yt-footer__brand-col { display: flex; flex-direction: column; gap: 1rem; }
  .yt-footer__wordmark {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.8rem; letter-spacing: 0.2em; color: #C9A84C;
    text-decoration: none; display: inline-block;
  }
  .yt-footer__tagline {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.92rem; font-style: italic; font-weight: 300;
    color: rgba(255,255,255,0.76); line-height: 1.7; max-width: 26ch;
  }
  .yt-footer__sg-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    border: 1px solid rgba(201,168,76,0.2); padding: 0.4rem 0.9rem;
    font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase; color: #888;
    align-self: flex-start;
  }
  .yt-footer__sg-badge span { font-size: 0.85rem; }

  .yt-footer__col { display: flex; flex-direction: column; gap: 0.5rem; }
  .yt-footer__col-title {
    font-size: 0.6rem; letter-spacing: 0.25em; text-transform: uppercase;
    color: #C9A84C; margin-bottom: 0.5rem;
  }
  .yt-footer__link {
    font-size: 0.78rem; letter-spacing: 0.06em; color: #666;
    text-decoration: none; transition: color 0.2s; padding: 0.15rem 0;
    display: inline-block;
  }
  .yt-footer__link:hover { color: #C9A84C; }
  .yt-footer__link--ext {
    display: inline-flex; align-items: center; gap: 0.35rem;
  }
  .yt-footer__link--ext::after { content: '↗'; font-size: 0.65rem; opacity: 0.5; }

  .yt-footer__copy {
    font-size: 0.68rem; color: rgba(136,136,136,0.4); letter-spacing: 0.06em;
  }

  @media (max-width: 900px) {
    .yt-footer { padding: 1.75rem 1.5rem 1rem; }
    .yt-footer__top { grid-template-columns: 1fr 1fr; gap: 2rem; }
    .yt-footer__brand-col { grid-column: 1 / -1; }
  }
  @media (max-width: 500px) {
    .yt-footer__top { grid-template-columns: 1fr; }
    .yt-footer__bottom { flex-direction: column; align-items: center; text-align: center; }
  }
`;

const Footer = () => (
  <>
    <style>{css}</style>
    <footer className="yt-footer">
      <div className="yt-footer__top">

        {/* BRAND */}
        <div className="yt-footer__brand-col">
          <Link to="/" className="yt-footer__wordmark">YOUTHENTIC</Link>
          <p className="yt-footer__tagline">
            Formulated in Barcelona, made in Indonesia.
            Heat-tested and humidity-stable for Singapore.
          </p>
          <div className="yt-footer__sg-badge">
            <span>🇸🇬</span> Singapore Official Store
          </div>
          <span className="yt-footer__copy">© 2025 Youthentic Fragrances · Singapore · All rights reserved</span>
        </div>

        {/* SHOP */}
        <div className="yt-footer__col">
          <p className="yt-footer__col-title">Shop</p>
          <Link to="/products" className="yt-footer__link">All Scents</Link>
          <Link to="/products" className="yt-footer__link">Web Exclusives</Link>
          <Link to="/quiz"     className="yt-footer__link">Scent Quiz</Link>
          <Link to="/cart"     className="yt-footer__link">My Cart</Link>
        </div>

        {/* ACCOUNT */}
        <div className="yt-footer__col">
          <p className="yt-footer__col-title">Account</p>
          <Link to="/login"   className="yt-footer__link">Track My Order</Link>
          <Link to="/loyalty" className="yt-footer__link">Loyalty Program</Link>
          <Link to="/brand-story#faq" className="yt-footer__link">FAQ</Link>
          <Link to="/brand-story" className="yt-footer__link">Our Story</Link>
        </div>

        {/* INFO */}
        <div className="yt-footer__col">
          <p className="yt-footer__col-title">Info</p>
          <Link to="/brand-story#faq"      className="yt-footer__link">Returns Policy</Link>
          <a
            href="https://youthentic.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="yt-footer__link yt-footer__link--ext"
          >
            Indonesia Site
          </a>
          <Link to="/admin" className="yt-footer__link">Admin</Link>
        </div>

      </div>
    </footer>
  </>
);

export default Footer;