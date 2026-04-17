import { useState, useEffect, useCallback } from "react";
import { useCart } from "../context/CartContext";

/* ─── IMAGE LOADER ─────────────────────────────────────────────── */
const getImage = (name) => `/assets/${name}.png`

const buildBundleSignature = (scents = []) => scents.slice().sort((a, b) => a.localeCompare(b)).join("|");

/* ─── FAKE REVIEWS ──────────────────────────────────────────────
   Keyed by product name — falls back to generic pool if no match.
   Stars are out of 5.
─────────────────────────────────────────────────────────────────── */
const REVIEW_POOL = {
  default: [
    { name: "Aisha R.",    stars: 5, text: "Absolutely stunning. Got so many compliments the first day I wore it." },
    { name: "Marcus T.",   stars: 5, text: "Long lasting and the sillage is incredible. Worth every cent." },
    { name: "Priya L.",    stars: 4, text: "Elegant and unique — nothing else smells quite like this." },
    { name: "James W.",   stars: 5, text: "My go-to for date nights. Never going back." },
    { name: "Sophie K.",  stars: 4, text: "Sophisticated without being overpowering. Love it." },
    { name: "Daniel C.",  stars: 5, text: "Lasts all day on my skin. Smells even better as it dries down." },
    { name: "Mei Lin",    stars: 5, text: "Gifted this to my partner — they haven't stopped wearing it." },
    { name: "Ryan B.",    stars: 4, text: "Really premium feel. The bottle is gorgeous too." },
  ],
};

const getReviews = (productName) => {
  const pool = REVIEW_POOL[productName] ?? REVIEW_POOL.default;
  // seed picks deterministically from name so the same product always shows the same reviews
  const seed = productName.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const shuffled = [...pool].sort((a, b) => ((seed * a.name.length) % 7) - ((seed * b.name.length) % 7));
  return shuffled.slice(0, 3);
};

const avgRating = (reviews) =>
  (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1);

const Stars = ({ count, small }) => (
  <span style={{ display: "inline-flex", gap: small ? "1px" : "2px", fontSize: small ? "0.6rem" : "0.72rem" }}>
    {[1,2,3,4,5].map((i) => (
      <span key={i} style={{ color: i <= count ? "#C9A84C" : "#333" }}>★</span>
    ))}
  </span>
);

/* ─── STYLES ───────────────────────────────────────────────────── */
const css = `
  /* ── CARD ─────────────────────────────────────────────────────── */
  .yt-pcard {
    position: relative; background: #0a0a0a;
    border: 1px solid rgba(201,168,76,0.15);
    display: flex; flex-direction: column;
    overflow: hidden; transition: border-color 0.35s, transform 0.35s, box-shadow 0.35s;
    cursor: pointer;
  }
  .yt-pcard:hover {
    border-color: rgba(201,168,76,0.5); transform: translateY(-5px);
    box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.08);
  }
  .yt-pcard::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, #C9A84C, #E2B84A);
    transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease;
  }
  .yt-pcard:hover::after { transform: scaleX(1); }

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
  .yt-pcard__variant-badge--bundle { color: #C9A84C; border-color: rgba(201,168,76,0.5); }
  .yt-pcard__stock {
    position: absolute; bottom: 1rem; right: 1rem;
    background: rgba(180,60,40,0.85); padding: 0.25rem 0.65rem;
    font-family: 'Jost', sans-serif; font-size: 0.6rem;
    letter-spacing: 0.12em; text-transform: uppercase; color: #fff;
  }
  /* rating badge on image */
  .yt-pcard__rating-badge {
    position: absolute; bottom: 1rem; left: 1rem;
    background: rgba(0,0,0,0.8); border: 1px solid rgba(201,168,76,0.25);
    backdrop-filter: blur(6px); padding: 0.25rem 0.65rem;
    display: flex; align-items: center; gap: 0.35rem;
    font-family: 'Jost', sans-serif; font-size: 0.65rem; color: #C9A84C;
  }

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

  .yt-pcard__content {
    padding: 1.5rem; display: flex; flex-direction: column;
    gap: 0.5rem; flex: 1; border-top: 1px solid rgba(201,168,76,0.1);
  }
  .yt-pcard__collection { font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: #C9A84C; }
  .yt-pcard__name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 400; color: #fff; line-height: 1.2; margin: 0;
  }
  .yt-pcard__desc {
    font-size: 0.76rem; line-height: 1.6; color: #888; font-style: italic;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }

  /* occasion tag */
  .yt-pcard__occasion {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: #666; border: 1px solid rgba(201,168,76,0.12);
    padding: 0.2rem 0.6rem; align-self: flex-start;
  }
  .yt-pcard__occasion-dot { width: 4px; height: 4px; border-radius: 50%; background: #C9A84C; flex-shrink: 0; }

  /* card review strip */
  .yt-pcard__review-strip {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.6rem 0; border-top: 1px solid rgba(201,168,76,0.08);
  }
  .yt-pcard__review-avg {
    font-family: 'Bebas Neue', sans-serif; font-size: 1rem;
    letter-spacing: 0.06em; color: #C9A84C;
  }
  .yt-pcard__review-count { font-size: 0.65rem; color: #555; margin-left: 0.25rem; }

  .yt-pcard__footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 1rem; border-top: 1px solid rgba(201,168,76,0.1); margin-top: auto; gap: 0.5rem;
  }
  .yt-pcard__price-wrap { display: flex; flex-direction: column; gap: 0.1rem; }
  .yt-pcard__price {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem;
    letter-spacing: 0.06em; color: #C9A84C; line-height: 1;
  }
  .yt-pcard__price-from { font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; color: #666; }
  .yt-pcard__sizes { display: flex; gap: 0.35rem; }
  .yt-pcard__size-chip {
    border: 1px solid rgba(201,168,76,0.3); padding: 0.2rem 0.5rem;
    font-family: 'Jost', sans-serif; font-size: 0.6rem; letter-spacing: 0.1em;
    text-transform: uppercase; color: #888; border-radius: 2px;
  }
  .yt-pcard__gift {
    margin-top: 0.5rem;
    font-size: 0.66rem; line-height: 1.5; color: #999;
  }
  .yt-pcard__gift strong { color: #C9A84C; font-weight: 500; }

  /* ── MODAL OVERLAY ────────────────────────────────────────────── */
  .yt-modal-overlay {
    position: fixed; inset: 0; z-index: 500;
    background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
    display: flex; align-items: flex-start; justify-content: center;
    padding: 6rem 1.5rem 1.5rem; animation: modalOverlayIn 0.3s ease;
  }
  .yt-modal {
    background: #0a0a0a; border: 1px solid rgba(201,168,76,0.25);
    width: 100%; max-width: 900px; max-height: calc(100svh - 7.5rem);
    overflow-y: auto; position: relative;
    display: grid; grid-template-columns: 1fr 1fr;
    animation: modalIn 0.35s cubic-bezier(0.22,1,0.36,1);
  }
  .yt-modal::-webkit-scrollbar { width: 4px; }
  .yt-modal::-webkit-scrollbar-track { background: #0a0a0a; }
  .yt-modal::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); }

  .yt-modal__close {
    position: absolute; top: 1rem; right: 1rem; z-index: 10;
    width: 2rem; height: 2rem; background: rgba(0,0,0,0.8);
    border: 1px solid rgba(201,168,76,0.25); color: #888;
    font-size: 1.1rem; cursor: pointer; display: flex;
    align-items: center; justify-content: center;
    transition: border-color 0.2s, color 0.2s;
  }
  .yt-modal__close:hover { border-color: #C9A84C; color: #fff; }

  .yt-modal__img-panel { position: relative; aspect-ratio: 3/4; overflow: hidden; background: #111; }
  .yt-modal__img { width: 100%; height: 100%; object-fit: cover; object-position: center; filter: brightness(0.9); }
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

  .yt-modal__panel {
    padding: 2.5rem 2rem; display: flex; flex-direction: column;
    gap: 1.25rem; overflow-y: auto;
  }
  .yt-modal__collection { font-size: 0.62rem; letter-spacing: 0.25em; text-transform: uppercase; color: #C9A84C; }
  .yt-modal__name {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 300; line-height: 1.1; color: #fff;
  }
  .yt-modal__desc {
    font-size: 0.84rem; line-height: 1.85; color: #888;
    border-top: 1px solid rgba(201,168,76,0.1); padding-top: 1.25rem;
  }

  /* occasion section in modal */
  .yt-modal__occasion {
    display: flex; align-items: flex-start; gap: 0.75rem;
    background: rgba(201,168,76,0.04); border: 1px solid rgba(201,168,76,0.12);
    padding: 1rem 1.25rem;
  }
  .yt-modal__occasion-icon { font-size: 1rem; flex-shrink: 0; margin-top: 0.1rem; }
  .yt-modal__occasion-body { display: flex; flex-direction: column; gap: 0.3rem; }
  .yt-modal__occasion-label {
    font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase; color: #C9A84C;
  }
  .yt-modal__occasion-text { font-size: 0.82rem; color: #aaa; line-height: 1.65; font-style: italic; }

  /* notes */
  .yt-modal__notes { display: flex; flex-direction: column; gap: 0.6rem; }
  .yt-modal__notes-title { font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: #C9A84C; margin-bottom: 0.25rem; }
  .yt-modal__note-row { display: flex; align-items: baseline; gap: 0.75rem; }
  .yt-modal__note-label { font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: #555; width: 3.5rem; flex-shrink: 0; }
  .yt-modal__note-pills { display: flex; flex-wrap: wrap; gap: 0.35rem; }
  .yt-modal__note-pill {
    border: 1px solid rgba(201,168,76,0.2); padding: 0.2rem 0.6rem;
    font-family: 'Jost', sans-serif; font-size: 0.68rem; letter-spacing: 0.06em;
    color: #aaa; border-radius: 2px; transition: border-color 0.2s, color 0.2s;
  }
  .yt-modal__note-pill:hover { border-color: #C9A84C; color: #C9A84C; }

  /* meta chips */
  .yt-modal__meta { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .yt-modal__meta-chip {
    display: flex; align-items: center; gap: 0.4rem;
    border: 1px solid rgba(201,168,76,0.12); padding: 0.3rem 0.75rem;
    font-size: 0.68rem; color: #777; letter-spacing: 0.06em;
  }
  .yt-modal__meta-chip span:first-child { font-size: 0.8rem; }

  /* bundle */
  .yt-modal__bundle {
    display: flex; flex-direction: column; gap: 0.75rem;
    border-top: 1px solid rgba(201,168,76,0.1); padding-top: 1.1rem;
  }
  .yt-modal__bundle-title { font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: #C9A84C; margin-bottom: 0.15rem; }
  .yt-modal__bundle-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(201,168,76,0.08); }
  .yt-modal__bundle-item:last-child { border-bottom: none; }
  .yt-modal__bundle-dot { width: 6px; height: 6px; border-radius: 50%; background: #C9A84C; flex-shrink: 0; }
  .yt-modal__bundle-name { font-size: 0.84rem; color: #fff; flex: 1; }
  .yt-modal__bundle-vol { font-size: 0.7rem; letter-spacing: 0.1em; color: #666; text-transform: uppercase; }
  .yt-modal__bundle-helper {
    font-size: 0.72rem; color: #999; line-height: 1.6;
    background: rgba(201,168,76,0.05); border: 1px solid rgba(201,168,76,0.15);
    padding: 0.55rem 0.7rem;
  }
  .yt-modal__bundle-grid {
    display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.55rem;
  }
  .yt-modal__bundle-choice {
    border: 1px solid rgba(201,168,76,0.18); background: rgba(255,255,255,0.01);
    padding: 0.72rem 0.78rem; text-align: left; cursor: pointer;
    display: flex; flex-direction: column; gap: 0.2rem;
    min-height: 4.15rem;
    transition: border-color 0.2s, background 0.2s, transform 0.15s, box-shadow 0.2s;
  }
  .yt-modal__bundle-choice:hover {
    border-color: rgba(201,168,76,0.55); transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(0,0,0,0.25);
  }
  .yt-modal__bundle-choice.selected {
    border-color: #C9A84C; background: rgba(201,168,76,0.12);
    box-shadow: inset 0 0 0 1px rgba(201,168,76,0.25);
  }
  .yt-modal__bundle-choice:disabled {
    opacity: 0.45; cursor: not-allowed; transform: none;
  }
  .yt-modal__bundle-choice-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.92rem; color: #fff; line-height: 1.35;
  }
  .yt-modal__bundle-choice-vol {
    font-size: 0.6rem; letter-spacing: 0.16em; color: #8f8f8f; text-transform: uppercase;
  }
  .yt-modal__bundle-choice-state {
    margin-top: auto;
    font-size: 0.58rem; letter-spacing: 0.13em; text-transform: uppercase;
    color: #6f6f6f;
  }
  .yt-modal__bundle-choice.selected .yt-modal__bundle-choice-state { color: #C9A84C; }

  /* variant toggle */
  .yt-modal__variant-section { display: flex; flex-direction: column; gap: 0.75rem; }
  .yt-modal__variant-label { font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: #C9A84C; }
  .yt-modal__variant-toggle { display: flex; gap: 0; border: 1px solid rgba(201,168,76,0.2); align-self: flex-start; }
  .yt-modal__variant-btn {
    padding: 0.65rem 1.5rem; background: transparent; border: none; cursor: pointer;
    font-family: 'Jost', sans-serif; font-size: 0.78rem; font-weight: 400;
    letter-spacing: 0.08em; color: #666; transition: background 0.2s, color 0.2s;
    display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
  }
  .yt-modal__variant-btn + .yt-modal__variant-btn { border-left: 1px solid rgba(201,168,76,0.2); }
  .yt-modal__variant-btn.active { background: rgba(201,168,76,0.12); color: #C9A84C; }
  .yt-modal__variant-btn.active .yt-modal__vbtn-price { color: #E2B84A; }
  .yt-modal__vbtn-size { font-size: 0.82rem; font-weight: 500; }
  .yt-modal__vbtn-price { font-family: 'Bebas Neue', sans-serif; font-size: 1rem; letter-spacing: 0.06em; color: #555; transition: color 0.2s; }
  .yt-modal__vbtn-sub { font-size: 0.6rem; letter-spacing: 0.08em; color: #555; }
  .yt-modal__gift-note {
    font-size: 0.72rem; color: #999; line-height: 1.6;
    border: 1px solid rgba(201,168,76,0.14); background: rgba(201,168,76,0.05);
    padding: 0.55rem 0.75rem;
  }
  .yt-modal__gift-note strong { color: #C9A84C; font-weight: 500; }

  /* price */
  .yt-modal__price-display { display: flex; align-items: baseline; gap: 0.75rem; }
  .yt-modal__price { font-family: 'Bebas Neue', sans-serif; font-size: 2.5rem; letter-spacing: 0.05em; color: #C9A84C; line-height: 1; }
  .yt-modal__price-note { font-size: 0.72rem; color: #666; letter-spacing: 0.06em; }

  /* add to cart */
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
  .yt-modal__stock-warn { font-size: 0.72rem; color: #e05a4a; letter-spacing: 0.08em; text-align: center; }

  /* quantity selector */
  .yt-modal__qty-wrap { display: flex; align-items: center; gap: 1rem; }
  .yt-modal__qty-label { font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: #888; }
  .yt-modal__qty-ctrl {
    display: flex; align-items: center; border: 1px solid rgba(201,168,76,0.25); border-radius: 3px;
  }
  .yt-modal__qty-btn {
    background: transparent; border: none; color: #C9A84C; cursor: pointer;
    padding: 0.4rem 0.6rem; font-size: 1rem; transition: color 0.2s, background 0.2s;
  }
  .yt-modal__qty-btn:hover { background: rgba(201,168,76,0.1); }
  .yt-modal__qty-input {
    background: transparent; border: none; border-left: 1px solid rgba(201,168,76,0.25); border-right: 1px solid rgba(201,168,76,0.25);
    color: #fff; text-align: center; width: 3rem; padding: 0.4rem 0.5rem;
    font-family: 'Jost', sans-serif; font-size: 0.9rem;
  }
  .yt-modal__qty-input::-webkit-outer-spin-button,
  .yt-modal__qty-input::-webkit-inner-spin-button {
    -webkit-appearance: none; margin: 0;
  }
  .yt-modal__qty-input[type=number] { -moz-appearance: textfield; }
  .yt-modal__qty-input:focus { outline: none; }


  /* ── REVIEWS ───────────────────────────────────────────────────── */
  .yt-modal__reviews { display: flex; flex-direction: column; gap: 0; }
  .yt-modal__reviews-header {
    display: flex; align-items: center; justify-content: space-between;
    padding-bottom: 1rem; border-bottom: 1px solid rgba(201,168,76,0.1);
    margin-bottom: 0.25rem;
  }
  .yt-modal__reviews-title { font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: #C9A84C; }
  .yt-modal__reviews-avg {
    display: flex; align-items: center; gap: 0.5rem;
  }
  .yt-modal__reviews-avg-num {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem;
    letter-spacing: 0.06em; color: #C9A84C; line-height: 1;
  }
  .yt-modal__reviews-avg-sub { font-size: 0.62rem; color: #555; }
  .yt-modal__review {
    padding: 1rem 0; border-bottom: 1px solid rgba(201,168,76,0.07);
    display: flex; flex-direction: column; gap: 0.4rem;
  }
  .yt-modal__review:last-child { border-bottom: none; }
  .yt-modal__review-top { display: flex; align-items: center; justify-content: space-between; }
  .yt-modal__review-name { font-size: 0.75rem; font-weight: 500; color: #fff; letter-spacing: 0.04em; }
  .yt-modal__review-text { font-size: 0.78rem; color: #888; line-height: 1.65; font-style: italic; }
  .yt-modal__review-verified {
    font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: #6dbf82; display: flex; align-items: center; gap: 0.3rem;
  }

  /* ── KEYFRAMES ─────────────────────────────────────────────────── */
  @keyframes modalOverlayIn { from { opacity:0; } to { opacity:1; } }
  @keyframes modalIn {
    from { opacity:0; transform: scale(0.96) translateY(16px); }
    to   { opacity:1; transform: scale(1) translateY(0); }
  }

  /* ── RESPONSIVE ────────────────────────────────────────────────── */
  @media (max-width: 700px) {
    .yt-modal-overlay { padding-top: 4.75rem; }
    .yt-modal { grid-template-columns: 1fr; max-height: calc(100svh - 5.75rem); }
    .yt-modal__img-panel { aspect-ratio: 4/3; }
    .yt-modal__panel { padding: 1.5rem; }
    .yt-modal__variant-toggle { align-self: stretch; }
    .yt-modal__variant-btn { flex: 1; }
    .yt-modal__bundle-grid { grid-template-columns: 1fr; }
  }
`;

/* ─── PRODUCT MODAL ─────────────────────────────────────────────── */
const ProductModal = ({ product, onClose, availableScents = [], isMember = false }) => {
  const { addToCart } = useCart();
  const [variant, setVariant] = useState("10ml");
  const [quantity, setQuantity] = useState(1);
  const [added,   setAdded]   = useState(false);
  const [imgErr,  setImgErr]  = useState(false);
  const [bundleSelections, setBundleSelections] = useState([]);
  const [bundleError, setBundleError] = useState("");

  const isBundle     = product.variant_type === "bundle";
  const has50ml      = product.price_50ml != null;
  const isOutOfStock = product.stock === 0;
  const currentPrice = variant === "50ml" && has50ml ? product.price_50ml : product.price;
  const requiredBundleCount = isBundle
    ? Math.max(
        1,
        Array.isArray(product.bundle_items) && product.bundle_items.length > 0
          ? product.bundle_items.reduce((sum, item) => sum + (Number(item?.quantity) || 1), 0)
          : 3
      )
    : 0;

  const reviews    = getReviews(product.name);
  const ratingAvg  = avgRating(reviews);

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

    if (isBundle) {
      if (bundleSelections.length !== requiredBundleCount) {
        setBundleError(`Select ${requiredBundleCount} scents to build this bundle.`);
        return;
      }

      const signature = buildBundleSignature(bundleSelections);
      for (let i = 0; i < quantity; i++) {
        addToCart(product, "bundle", {
          bundleSelections,
          customKeySuffix: signature,
        });
      }
      setBundleError("");
    } else {
      for (let i = 0; i < quantity; i++) {
        addToCart(product, variant);
      }
    }

    setAdded(true);
    setQuantity(1);
    setTimeout(() => setAdded(false), 2000);
  };

  const toggleBundleSelection = (scentName) => {
    setBundleError("");
    setBundleSelections((prev) => {
      if (prev.includes(scentName)) {
        return prev.filter((name) => name !== scentName);
      }
      if (prev.length >= requiredBundleCount) {
        return prev;
      }
      return [...prev, scentName];
    });
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
      role="dialog" aria-modal="true" aria-label={product.name}
    >
      <div className="yt-modal">
        <button className="yt-modal__close" onClick={onClose} aria-label="Close">✕</button>

        {/* IMAGE PANEL */}
        <div className="yt-modal__img-panel">
          {imgSrc && !imgErr
            ? <img className="yt-modal__img" src={imgSrc} alt={product.name} onError={() => setImgErr(true)} />
            : <div className="yt-modal__img-fallback">🫧</div>
          }
          <span className="yt-modal__img-badge">{variantLabel}</span>
        </div>

        {/* CONTENT PANEL */}
        <div className="yt-modal__panel">
          {product.collection && <p className="yt-modal__collection">{product.collection}</p>}
          <h2 className="yt-modal__name">{product.name}</h2>

          {product.description && <p className="yt-modal__desc">{product.description}</p>}

          {/* OCCASION */}
          {product.occasion && (
            <div className="yt-modal__occasion">
              <span className="yt-modal__occasion-icon">✦</span>
              <div className="yt-modal__occasion-body">
                <span className="yt-modal__occasion-label">Perfect For</span>
                <p className="yt-modal__occasion-text">{product.occasion.join(', ')}</p>
              </div>
            </div>
          )}

          {/* FRAGRANCE NOTES */}
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

          {/* BUNDLE BUILDER */}
          {isBundle && (
            <div className="yt-modal__bundle">
              <p className="yt-modal__bundle-title">Build Your Bundle</p>
              <p className="yt-modal__bundle-helper">
                Choose {requiredBundleCount} scents ({bundleSelections.length}/{requiredBundleCount} selected)
              </p>
              <div className="yt-modal__bundle-grid">
                {availableScents.map((scent) => {
                  const selected = bundleSelections.includes(scent.name);
                  const locked = !selected && bundleSelections.length >= requiredBundleCount;
                  return (
                    <button
                      key={scent.id ?? scent.name}
                      type="button"
                      className={`yt-modal__bundle-choice${selected ? " selected" : ""}`}
                      onClick={() => toggleBundleSelection(scent.name)}
                      disabled={locked}
                    >
                      <span className="yt-modal__bundle-choice-name">{scent.name}</span>
                      <span className="yt-modal__bundle-choice-vol">10ml</span>
                      
                    </button>
                  );
                })}
              </div>
              {bundleError && <p className="yt-modal__stock-warn">{bundleError}</p>}
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

          {/* SIZE TOGGLE */}
          {!isBundle && has50ml && (
            <div className="yt-modal__variant-section">
              <p className="yt-modal__variant-label">Select Size</p>
              <div className="yt-modal__variant-toggle">
                <button
                  className={`yt-modal__variant-btn${variant === "10ml" ? " active" : ""}`}
                  onClick={() => setVariant("10ml")}
                >
                  <span className="yt-modal__vbtn-size">10ml</span>
                  <span className="yt-modal__vbtn-price">SGD {Number(product.price).toFixed(2)}</span>
                  <span className="yt-modal__vbtn-sub">Travel size</span>
                </button>
                <button
                  className={`yt-modal__variant-btn${variant === "50ml" ? " active" : ""}`}
                  onClick={() => setVariant("50ml")}
                >
                  <span className="yt-modal__vbtn-size">50ml</span>
                  <span className="yt-modal__vbtn-price">SGD {Number(product.price_50ml).toFixed(2)}</span>
                  <span className="yt-modal__vbtn-sub">Full size</span>
                </button>
              </div>
              <p className="yt-modal__gift-note">
                {variant === "50ml"
                  ? isMember
                    ? <><strong>Free Gift:</strong> 1.5ml tester included with every 50ml purchase.</>
                    : <><strong>Free Gift:</strong> 1.5ml tester for members only on 50ml purchases.</>
                  : <><strong>Free Gift:</strong> random plain sleeve included with every 10ml purchase.</>
                }
              </p>
            </div>
          )}

          {!isBundle && !has50ml && (
            <p className="yt-modal__gift-note">
              <strong>Free Gift:</strong> random plain sleeve included with every 10ml purchase.
            </p>
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

          {/* QUANTITY SELECTOR */}
          <div className="yt-modal__qty-wrap">
            <label className="yt-modal__qty-label">Quantity</label>
            <div className="yt-modal__qty-ctrl">
              <button
                className="yt-modal__qty-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                −
              </button>
              <input
                type="number"
                className="yt-modal__qty-input"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
              />
              <button
                className="yt-modal__qty-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* ADD TO CART */}
          <button
            className={`yt-modal__add${added ? " added" : ""}`}
            onClick={handleAdd}
            disabled={isOutOfStock}
          >
            {added          ? "✓ Added to Cart"
             : isOutOfStock ? "Out of Stock"
             : isBundle     ? "Add Bundle to Cart"
             : `Add ${variant} to Cart`}
          </button>

          {/* REVIEWS */}
          <div className="yt-modal__reviews">
            <div className="yt-modal__reviews-header">
              <span className="yt-modal__reviews-title">Customer Reviews</span>
              <div className="yt-modal__reviews-avg">
                <span className="yt-modal__reviews-avg-num">{ratingAvg}</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <Stars count={Math.round(parseFloat(ratingAvg))} />
                  <span className="yt-modal__reviews-avg-sub">{reviews.length} reviews</span>
                </div>
              </div>
            </div>
            {reviews.map((r, i) => (
              <div key={i} className="yt-modal__review">
                <div className="yt-modal__review-top">
                  <span className="yt-modal__review-name">{r.name}</span>
                  <Stars count={r.stars} small />
                </div>
                <p className="yt-modal__review-text">"{r.text}"</p>
                <span className="yt-modal__review-verified">✓ Verified purchase</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

/* ─── PRODUCT CARD ──────────────────────────────────────────────── */
const ProductCard = ({ product, allProducts = [] }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [imgError,  setImgError]  = useState(false);
  const openModal  = useCallback(() => setModalOpen(true),  []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  if (!product) return null;

  const isBundle     = product.variant_type === "bundle";
  const has50ml      = product.price_50ml != null;
  const isLowStock   = product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0;
  const imgSrc       = getImage(product.name);
  const reviews      = getReviews(product.name);
  const ratingAvg    = avgRating(reviews);
  const availableScents = allProducts.filter((p) =>
    p?.id !== product.id &&
    p?.variant_type !== "bundle" &&
    (p?.top_notes?.length || p?.middle_notes?.length || p?.base_notes?.length)
  );

  let memberProfile = null;
  try {
    memberProfile = JSON.parse(localStorage.getItem("yt_member_profile") || "null");
  } catch {
    memberProfile = null;
  }
  const isMember = Boolean(memberProfile?.isMember);

  return (
    <>
      <style>{css}</style>

      <div
        className="yt-pcard" onClick={openModal} role="button" tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && openModal()}
        aria-label={`View ${product.name}`}
      >
        {/* IMAGE */}
        <div className="yt-pcard__img-wrap">
          {imgSrc && !imgError
            ? <img className="yt-pcard__img" src={imgSrc} alt={product.name} onError={() => setImgError(true)} />
            : <div className="yt-pcard__img-fallback">🫧</div>
          }
          {product.collection && <span className="yt-pcard__badge">{product.collection}</span>}
          <span className={`yt-pcard__variant-badge${isBundle ? " yt-pcard__variant-badge--bundle" : ""}`}>
            {isBundle ? "Bundle" : has50ml ? "10ml · 50ml" : "10ml"}
          </span>
          {isLowStock   && <span className="yt-pcard__stock">Only {product.stock} left</span>}
          {isOutOfStock && <span className="yt-pcard__stock">Sold Out</span>}

          {/* rating badge bottom-left */}
          <div className="yt-pcard__rating-badge">
            <Stars count={Math.round(parseFloat(ratingAvg))} small />
            <span>{ratingAvg}</span>
          </div>

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

          {/* OCCASION TAG */}
          {product.occasion && (
            <div className="yt-pcard__occasion">
              <div className="yt-pcard__occasion-dot" />
              {product.occasion.join(", ").length > 42
                ? product.occasion.join(", ").slice(0, 42) + "…"
                : product.occasion.join(", ")}
            </div>
          )}

          {/* REVIEW STRIP */}
          <div className="yt-pcard__review-strip">
            <Stars count={Math.round(parseFloat(ratingAvg))} small />
            <span className="yt-pcard__review-avg">{ratingAvg}</span>
            <span className="yt-pcard__review-count">({reviews.length})</span>
          </div>

          <div className="yt-pcard__footer">
            <div className="yt-pcard__price-wrap">
              {has50ml && !isBundle && <span className="yt-pcard__price-from">from</span>}
              <span className="yt-pcard__price">SGD {Number(product.price).toFixed(2)}</span>
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

          {!isBundle && (
            <p className="yt-pcard__gift">
              {has50ml
                ? isMember
                  ? <><strong>10ml:</strong> random free sleeve · <strong>50ml:</strong> free 1.5ml tester</>
                  : <><strong>10ml:</strong> random free sleeve · <strong>50ml:</strong> free 1.5ml tester (members only)</>
                : <><strong>10ml:</strong> random free sleeve</>
              }
            </p>
          )}
        </div>
      </div>

      {modalOpen && <ProductModal product={product} onClose={closeModal} availableScents={availableScents} isMember={isMember} />}
    </>
  );
};

export default ProductCard;