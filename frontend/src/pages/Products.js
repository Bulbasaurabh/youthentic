import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";
import API from "../api/api";
import ProductCard from "../components/ProductCard";

/* ── WEBSITE EXCLUSIVE PRODUCTS ─────────────────────────────────────
   Must match product names in DB exactly (case-sensitive).
─────────────────────────────────────────────────────────────────────── */
const EXCLUSIVE_PRODUCTS = [
  "Evening",
  "Citrus Rush",
  "Starter Kit",
];

/* ── WEEKEND DROP PRODUCTS ───────────────────────────────────────────
   Same pattern — add/remove names to control the drop badge.
─────────────────────────────────────────────────────────────────────── */
const WEEKEND_DROP_PRODUCTS = [
  "Noir",
  "Lumira",
];

/* ── ACCESSORIES MOCKUP DATA ─────────────────────────────────────────
   Replace image placeholders with real assets later.
─────────────────────────────────────────────────────────────────────── */
const ACCESSORIES = [
  {
    id: "acc-1",
    name: "Plain Sleeve (Midnight Black)",
    desc: "Minimalist matte black sleeve. Fits all 10ml bottles.",
    price: "SGD 4.90",
    tag: "Bestseller",
    emoji: "🖤",
    collab: null,
  },
  {
    id: "acc-2",
    name: "Plain Sleeve (Pearl White)",
    desc: "Clean white sleeve with subtle texture. Fits all 10ml bottles.",
    price: "SGD 4.90",
    tag: null,
    emoji: "🤍",
    collab: null,
  },
  {
    id: "acc-3",
    name: "Plain Sleeve (Wine Red)",
    desc: "Premium wine red sleeve for a luxurious finish.",
    price: "SGD 5.90",
    tag: null,
    emoji: "✨",
    collab: null,
  },
  {
    id: "acc-11",
    name: "Plain Sleeve (Navy Blue)",
    desc: "Premium navy blue sleeve for a luxurious finish.",
    price: "SGD 5.90",
    tag: null,
    emoji: "✨",
    collab: null,
  },
  {
    id: "acc-4",
    name: "Floral Sleeve (Sky Blue)",
    desc: "A refreshing sky blue sleeve with a floral design.",
    price: "SGD 5.90",
    tag: "Premium",
    emoji: "✨",
    collab: null,
  },
  {
    id: "acc-5",
    name: "Floral Sleeve (White)",
    desc: "A clean white sleeve with a floral design.",
    price: "SGD 5.90",
    tag: "Premium",
    emoji: "✨",
    collab: null,
  },
  {
    id: "acc-6",
    name: "Bow Sleeve (Navy Blue)",
    desc: "A sophisticated navy blue sleeve with a bow detail.",
    price: "SGD 5.90",
    tag: "Premium",
    emoji: "✨",
    collab: null,
  },
  {
    id: "acc-7",
    name: "Sanrio My Melody x Youthentic Sleeve",
    desc: "Limited edition sleeve in collaboration with Sanrio. Collectible design.",
    price: "SGD 9.90",
    tag: "Coming Soon",
    emoji: "🎨",
    collab: "Figurine",
  },
  {
    id: "acc-8",
    name: "Ninemall Teddy Gummy x Youthentic Sleeve",
    desc: "Limited edition sleeve in collaboration with Ninemall. Collectible design.",
    price: "SGD 9.90",
    tag: "Coming Soon",
    emoji: "🎨",
    collab: "Figurine",
  },
  {
    id: "acc-9",
    name: "PopMart Twinkle Twinkle x Youthentic Sleeve",
    desc: "Limited edition sleeve in collaboration with PopMart. Collectible design.",
    price: "SGD 9.90",
    tag: "Coming Soon",
    emoji: "🎨",
    collab: "Figurine",
  },

  {
    id: "acc-10",
    name: "Custom Bottle Engraving",
    desc: "Add a personal message or name to any 10 ml bottle. Perfect for gifting.",
    price: "SGD 8.90",
    tag: "Personalised",
    emoji: "✍️",
    collab: null,
  },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@300;400;500&display=swap');
 
  :root {
    --black: #000000; --dark: #0a0a0a; --panel: #111111;
    --gold: #C9A84C; --gold2: #E2B84A; --yellow: #D4C028;
    --white: #FFFFFF; --muted: #888888; --border: rgba(201,168,76,0.2);
    --green: #6dbf82; --red: #e05a4a; --blue: #4a9de0;
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
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    pointer-events: none; user-select: none; z-index: 0;
  }
  .pr-hero__wordmark span {
    font-family: 'Bebas Neue', sans-serif; font-size: clamp(8rem, 18vw, 16rem);
    letter-spacing: 0.02em; color: transparent;
    -webkit-text-stroke: 1px rgba(201,168,76,0.08); white-space: nowrap; animation: fadeIn 1.2s ease forwards;
  }
  .pr-hero__glow {
    position: absolute; top: -80px; right: -80px; width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(180,130,40,0.12) 0%, transparent 70%); pointer-events: none; z-index: 0;
  }
  .pr-hero__eyebrow {
    position: relative; z-index: 1; font-size: 0.68rem; letter-spacing: 0.28em;
    text-transform: uppercase; color: var(--gold); animation: fadeUp 0.8s ease forwards 0.2s; opacity: 0;
  }
  .pr-hero__title {
    position: relative; z-index: 1; font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3.5rem, 8vw, 8rem); letter-spacing: 0.03em; color: var(--white); line-height: 0.95;
    animation: fadeUp 0.9s ease forwards 0.35s; opacity: 0;
  }
  .pr-hero__title span { color: var(--gold); }
  .pr-hero__sub {
    position: relative; z-index: 1; font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1rem, 1.5vw, 1.2rem); font-weight: 400; font-style: italic;
    color: rgba(255,255,255,0.9); max-width: 52ch; line-height: 1.85;
    padding: 0.8rem 1.1rem;
    background: rgba(0,0,0,0.42);
    border: 1px solid rgba(201,168,76,0.2);
    text-shadow: 0 1px 1px rgba(0,0,0,0.55);
    animation: fadeUp 0.9s ease forwards 0.5s; opacity: 0;
  }
  .pr-hero__badges {
    position: relative; z-index: 1; display: flex; gap: 0.75rem; flex-wrap: wrap;
    animation: fadeUp 0.9s ease forwards 0.65s; opacity: 0;
  }
  .pr-hero__badge {
    display: inline-flex; align-items: center; gap: 0.6rem;
    border: 1px solid rgba(201,168,76,0.3); padding: 0.55rem 1.1rem;
    background: rgba(201,168,76,0.04); font-size: 0.62rem;
    letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold);
  }
  .pr-hero__badge-dot {
    width: 5px; height: 5px; border-radius: 50%; background: var(--gold);
    animation: pulse 2s ease-in-out infinite;
  }
  .pr-hero__badge--drop { border-color: rgba(74,157,224,0.4); color: var(--blue); background: rgba(74,157,224,0.04); }
  .pr-hero__badge--drop .pr-hero__badge-dot { background: var(--blue); }
 
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
  .pr-filter--exclusive { border-color: rgba(201,168,76,0.5); color: var(--gold); display: flex; align-items: center; gap: 0.4rem; }
  .pr-filter--exclusive.active { background: var(--gold); color: var(--black); }
  .pr-filter--drop { border-color: rgba(74,157,224,0.4); color: var(--blue); display: flex; align-items: center; gap: 0.4rem; }
  .pr-filter--drop.active { background: var(--blue); color: var(--white); border-color: var(--blue); }
  .pr-filter-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
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
  .pr-body { background: var(--black); padding: 4rem 3rem 2rem; }
  .pr-section-label {
    display: flex; align-items: center; gap: 1rem; margin-bottom: 1px; padding: 1.25rem 0 1rem;
  }
  .pr-section-label__line { flex: 1; height: 1px; background: var(--border); }
  .pr-section-label__text {
    font-size: 0.62rem; letter-spacing: 0.28em; text-transform: uppercase;
    color: var(--gold); white-space: nowrap; display: flex; align-items: center; gap: 0.5rem;
  }
  .pr-section-label__dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); }
  .pr-section-label__text--drop { color: var(--blue); }
  .pr-section-label__dot--drop { background: var(--blue); }
  .pr-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1px; background: var(--border);
  }
  .pr-exclusive-wrap { position: relative; }
  .pr-exclusive-tag {
    position: absolute; top: 0; left: 0; z-index: 10;
    background: var(--gold); color: var(--black);
    font-family: 'Jost', sans-serif; font-size: 0.55rem; font-weight: 600;
    letter-spacing: 0.2em; text-transform: uppercase; padding: 0.3rem 0.75rem;
    clip-path: polygon(0 0, 100% 0, 90% 100%, 0 100%); pointer-events: none;
  }
  .pr-drop-tag {
    position: absolute; top: 0; left: 0; z-index: 10;
    background: var(--blue); color: var(--white);
    font-family: 'Jost', sans-serif; font-size: 0.55rem; font-weight: 600;
    letter-spacing: 0.2em; text-transform: uppercase; padding: 0.3rem 0.75rem;
    clip-path: polygon(0 0, 100% 0, 90% 100%, 0 100%); pointer-events: none;
  }
  /* when both exclusive + drop, stack the tags */
  .pr-drop-tag--offset { top: 1.5rem; }
 
  /* ── SHIPPING INFO STRIP ────────────────────────────────────────── */
  .pr-shipping {
    margin: 3rem 3rem 0;
    border: 1px solid var(--border); background: var(--dark);
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border);
  }
  .pr-shipping__item {
    background: var(--dark); padding: 1.5rem;
    display: flex; flex-direction: column; gap: 0.5rem;
    transition: background 0.2s;
  }
  .pr-shipping__item:hover { background: var(--panel); }
  .pr-shipping__icon { font-size: 1.3rem; }
  .pr-shipping__label { font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); }
  .pr-shipping__val { font-size: 0.88rem; color: var(--white); font-weight: 500; line-height: 1.3; }
  .pr-shipping__sub { font-size: 0.72rem; color: var(--muted); line-height: 1.5; }
 
  /* ── ACCESSORIES SECTION ────────────────────────────────────────── */
  .pr-acc {
    padding: 5rem 3rem 6rem; border-top: 1px solid var(--border);
  }
  .pr-acc__header { margin-bottom: 2.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
  .pr-acc__eyebrow { font-size: 0.65rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); }
  .pr-acc__title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 5vw, 5rem); letter-spacing: 0.04em; color: var(--white); line-height: 0.95;
  }
  .pr-acc__title span { color: var(--gold); }
  .pr-acc__sub {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem; font-weight: 300; font-style: italic;
    color: var(--muted); max-width: 52ch; line-height: 1.8;
  }
 
  /* horizontal scroll row */
  .pr-acc__scroll-wrap { position: relative; }
  .pr-acc__scroll {
    display: flex; gap: 1px; overflow-x: auto; background: var(--border);
    scrollbar-width: thin; scrollbar-color: rgba(201,168,76,0.3) transparent;
    padding-bottom: 2px;
  }
  .pr-acc__scroll::-webkit-scrollbar { height: 3px; }
  .pr-acc__scroll::-webkit-scrollbar-track { background: transparent; }
  .pr-acc__scroll::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); }
 
  .pr-acc-card {
    background: var(--dark); min-width: 300px; max-width: 300px;
    display: flex; flex-direction: column;
    transition: background 0.25s; flex-shrink: 0;
  }
  .pr-acc-card:hover { background: var(--panel); }
 
  .pr-acc-card__img {
    width: 100%; aspect-ratio: 3/4; background: #0d0d0d;
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden; flex-shrink: 0;
    border-bottom: 1px solid rgba(201,168,76,0.08);
  }
  .pr-acc-card__actual-img {
    width: 100%; height: 100%; object-fit: cover; object-position: center;
    transition: transform 0.5s ease, filter 0.3s ease;
    filter: brightness(0.88);
  }
  .pr-acc-card:hover .pr-acc-card__actual-img { transform: scale(1.04); filter: brightness(1); }
 
  .pr-acc-card__placeholder {
    display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
    opacity: 0.2;
  }
  .pr-acc-card__placeholder-icon { font-size: 3rem; }
  .pr-acc-card__placeholder-text {
    font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted);
  }
 
  /* collab badge */
  .pr-acc-card__collab {
    position: absolute; bottom: 0.75rem; left: 0.75rem;
    background: rgba(0,0,0,0.85); border: 1px solid rgba(201,168,76,0.35);
    padding: 0.2rem 0.6rem; font-size: 0.58rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: var(--gold); backdrop-filter: blur(4px);
  }
  .pr-acc-card__tag {
    position: absolute; top: 0; left: 0;
    background: var(--gold); color: var(--black);
    font-family: 'Jost', sans-serif; font-size: 0.55rem; font-weight: 600;
    letter-spacing: 0.18em; text-transform: uppercase; padding: 0.25rem 0.65rem;
    clip-path: polygon(0 0, 100% 0, 90% 100%, 0 100%);
  }
  .pr-acc-card__tag--collab { background: var(--blue); color: var(--white); }
 
  .pr-acc-card__body {
    padding: 1.25rem; display: flex; flex-direction: column; gap: 0.4rem; flex: 1;
  }
  .pr-acc-card__name {
    font-family: 'Cormorant Garamond', serif; font-size: 1.05rem;
    font-weight: 400; color: var(--white); line-height: 1.2;
  }
  .pr-acc-card__desc { font-size: 0.72rem; color: var(--muted); line-height: 1.6; }
  .pr-acc-card__footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 0.75rem; border-top: 1px solid rgba(201,168,76,0.08); margin-top: auto;
    gap: 0.55rem;
  }
  .pr-acc-card__price {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem;
    letter-spacing: 0.05em; color: var(--gold);
    white-space: nowrap;
  }
  .pr-acc-card__controls {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    margin-left: auto;
  }
  .pr-acc-card__qty {
    display: inline-flex;
    align-items: center;
    border: 1px solid rgba(201,168,76,0.24);
    background: rgba(255,255,255,0.01);
    height: 1.95rem;
  }
  .pr-acc-card__qty-btn {
    width: 1.75rem;
    height: 100%;
    border: none;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    font-size: 0.9rem;
    transition: color 0.2s, background 0.2s;
  }
  .pr-acc-card__qty-btn:hover { color: var(--gold); background: rgba(201,168,76,0.06); }
  .pr-acc-card__qty-btn:disabled { color: #444; cursor: not-allowed; background: transparent; }
  .pr-acc-card__qty-num {
    min-width: 1.75rem;
    text-align: center;
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    color: var(--white);
    border-left: 1px solid rgba(201,168,76,0.2);
    border-right: 1px solid rgba(201,168,76,0.2);
  }
  .pr-acc-card__cta {
    font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); border: 1px solid rgba(201,168,76,0.2); padding: 0.3rem 0.7rem;
    cursor: pointer; background: transparent; transition: color 0.2s, border-color 0.2s, background 0.2s;
    font-family: 'Jost', sans-serif; white-space: nowrap;
  }
  .pr-acc-card__cta:hover:not(.added) { color: var(--gold); border-color: var(--gold); }
  .pr-acc-card__cta.added {
    background: rgba(109,191,130,0.1); color: var(--green);
    border-color: rgba(109,191,130,0.4); cursor: default; pointer-events: none;
  }
 
  .pr-acc__note {
    margin-top: 1.5rem; font-size: 0.72rem; color: var(--muted);
    display: flex; align-items: center; gap: 0.5rem;
  }
  .pr-acc__note::before { content: '✦'; color: var(--gold); font-size: 0.55rem; }
 
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
 
  /* ── KEYFRAMES ──────────────────────────────────────────────────── */
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
  @keyframes pulse   { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
 
  /* ── RESPONSIVE ─────────────────────────────────────────────────── */
  @media (max-width: 900px) {
    .pr-shipping { grid-template-columns: repeat(2, 1fr); margin: 2rem 1.5rem 0; }
  }
  @media (max-width: 768px) {
    .pr-hero { padding: 8rem 1.5rem 3.5rem; }
    .pr-toolbar { padding: 0.75rem 1.5rem; }
    .pr-body { padding: 2.5rem 1.5rem 1.5rem; }
    .pr-search { max-width: 100%; }
    .pr-count { display: none; }
    .pr-acc { padding: 3.5rem 1.5rem 4rem; }
    .pr-shipping { grid-template-columns: 1fr 1fr; margin: 1.5rem 1.5rem 0; }
  }
  @media (max-width: 500px) {
    .pr-shipping { grid-template-columns: 1fr; }
  }
`;
 
/* ─── ACCESSORY IMAGE LOADER ────────────────────────────────────────
   Uses the same require() pattern as ProductCard.
   Falls back to emoji placeholder if image not found.
─────────────────────────────────────────────────────────────────────── */
const getAccImage = (name) => `/assets/${name}.png`

const AccImage = ({ name, emoji }) => {
  const [err, setErr] = React.useState(false);
  const src = getAccImage(name);
  if (src && !err) {
    return (
      <img
        src={src}
        alt={name}
        className="pr-acc-card__actual-img"
        onError={() => setErr(true)}
      />
    );
  }
  return (
    <div className="pr-acc-card__placeholder">
      <span className="pr-acc-card__placeholder-icon">{emoji}</span>
      <span className="pr-acc-card__placeholder-text">Image Coming Soon</span>
    </div>
  );
};
 
 
/* ─── ACCESSORY CARD ─────────────────────────────────────────────────
   Wraps each accessory card with its own "added" feedback state.
   Calls addToCart from CartContext directly.
─────────────────────────────────────────────────────────────────────── */
const AccCard = ({ acc, addToCart }) => {
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  const decQty = useCallback(() => setQty((q) => Math.max(1, q - 1)), []);
  const incQty = useCallback(() => setQty((q) => Math.min(20, q + 1)), []);
 
  const handleAdd = useCallback(() => {
    if (added) return;
    // Build a cart-compatible item from the accessory data
    // Using a negative/string id so it never collides with product ids
    addToCart(
      {
        id:          acc.id,
        name:        acc.name,
        price:       parseFloat(acc.price.replace("SGD ", "").replace("From SGD ", "")),
        description: acc.desc,
        collection:  acc.collab ?? "Accessories",
        stock:       99,
        variant_type: "accessory",
      },
      "accessory",
      { quantity: qty }
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [acc, added, addToCart, qty]);
 
  return (
    <div className="pr-acc-card">
      <div className="pr-acc-card__img">
        <AccImage name={acc.name} emoji={acc.emoji} />
        {acc.tag && (
          <span className={`pr-acc-card__tag${acc.collab ? " pr-acc-card__tag--collab" : ""}`}>
            {acc.tag}
          </span>
        )}
        {acc.collab && (
          <span className="pr-acc-card__collab">× {acc.collab}</span>
        )}
      </div>
      <div className="pr-acc-card__body">
        <p className="pr-acc-card__name">{acc.name}</p>
        <p className="pr-acc-card__desc">{acc.desc}</p>
        <div className="pr-acc-card__footer">
          <span className="pr-acc-card__price">{acc.price}</span>
          <div className="pr-acc-card__controls">
            <div className="pr-acc-card__qty">
              <button type="button" className="pr-acc-card__qty-btn" onClick={decQty} disabled={qty <= 1}>−</button>
              <span className="pr-acc-card__qty-num">{qty}</span>
              <button type="button" className="pr-acc-card__qty-btn" onClick={incQty} disabled={qty >= 20}>+</button>
            </div>
            <button
              className={`pr-acc-card__cta${added ? " added" : ""}`}
              onClick={handleAdd}
            >
              {added ? `✓ Added ${qty}` : `Add ${qty} →`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
 
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
  const { addToCart } = useCart();
  const location = useLocation();
  const [products,      setProducts]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [search,        setSearch]        = useState("");
  const [sort,          setSort]          = useState("default");
  const [showExclusive, setShowExclusive] = useState(false);
  const [showDrop,      setShowDrop]      = useState(false);
 
  useEffect(() => {
    setLoading(true);
    API.get("/products")
      .then((res) => { setProducts(res.data); setLoading(false); })
      .catch((err) => { console.error(err); setError("Couldn't load products. Please try again."); setLoading(false); });
  }, []);

  useEffect(() => {
    if (location.hash === "#accessories") {
      setTimeout(() => {
        const accessoriesElement = document.getElementById("accessories");
        if (accessoriesElement) {
          accessoriesElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.hash]);
 
  const displayed = useMemo(() => {
    let list = [...products];
    if (showExclusive) list = list.filter((p) => EXCLUSIVE_PRODUCTS.includes(p.name));
    if (showDrop)      list = list.filter((p) => WEEKEND_DROP_PRODUCTS.includes(p.name));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }
    if (sort === "price-asc")  list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name-asc")   list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "default") {
      list.sort((a, b) => {
        const aScore = (WEEKEND_DROP_PRODUCTS.includes(a.name) ? 0 : 1) + (EXCLUSIVE_PRODUCTS.includes(a.name) ? 0 : 1);
        const bScore = (WEEKEND_DROP_PRODUCTS.includes(b.name) ? 0 : 1) + (EXCLUSIVE_PRODUCTS.includes(b.name) ? 0 : 1);
        return aScore - bScore;
      });
    }
    return list;
  }, [products, search, sort, showExclusive, showDrop]);
 
  const exclusiveCount = products.filter((p) => EXCLUSIVE_PRODUCTS.includes(p.name)).length;
  const dropCount      = products.filter((p) => WEEKEND_DROP_PRODUCTS.includes(p.name)).length;
 
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
          Formulated in Barcelona, made in Indonesia.
          Every product heat-tested and humidity-stable for Singapore.
        </p>
        <div className="pr-hero__badges">
          <div className="pr-hero__badge">
            <div className="pr-hero__badge-dot" />
            {exclusiveCount} Website Exclusive scents
          </div>
          <div className="pr-hero__badge pr-hero__badge--drop">
            <div className="pr-hero__badge-dot" />
            {dropCount} Weekend Drops — This Weekend Only
          </div>
        </div>
      </section>
 
      {/* TOOLBAR */}
      <div className="pr-toolbar">
        <div className="pr-search">
          <span className="pr-search__icon">🔍</span>
          <input
            className="pr-search__input" type="text" placeholder="Search scents..."
            value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search products"
          />
        </div>
        <div className="pr-filters" role="group" aria-label="Filters">
          <button
            className={`pr-filter pr-filter--exclusive${showExclusive ? " active" : ""}`}
            onClick={() => { setShowExclusive((v) => !v); setShowDrop(false); }}
          >
            <span className="pr-filter-dot" /> Web Exclusive
          </button>
          <button
            className={`pr-filter pr-filter--drop${showDrop ? " active" : ""}`}
            onClick={() => { setShowDrop((v) => !v); setShowExclusive(false); }}
          >
            <span className="pr-filter-dot" /> Weekend Drop
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
              <p className="pr-state__sub">Try a different search term or filter.</p>
            </div>
          </div>
        )}
        {!loading && !error && displayed.length > 0 && (
          <>
            {/* section labels */}
            {showDrop && (
              <div className="pr-section-label">
                <div className="pr-section-label__line" />
                <span className="pr-section-label__text pr-section-label__text--drop">
                  <span className="pr-section-label__dot pr-section-label__dot--drop" />
                  Weekend Drop · This Weekend Only
                </span>
                <div className="pr-section-label__line" />
              </div>
            )}
            {showExclusive && (
              <div className="pr-section-label">
                <div className="pr-section-label__line" />
                <span className="pr-section-label__text">
                  <span className="pr-section-label__dot" /> Website Exclusives
                </span>
                <div className="pr-section-label__line" />
              </div>
            )}
            <div className="pr-grid">
              {displayed.map((product) => {
                const isExclusive = EXCLUSIVE_PRODUCTS.includes(product.name);
                const isDrop      = WEEKEND_DROP_PRODUCTS.includes(product.name);
                return (
                  <div key={product.id} className={(isExclusive || isDrop) ? "pr-exclusive-wrap" : ""}>
                    {isDrop && <div className="pr-drop-tag">⚡ Weekend Drop</div>}
                    {isExclusive && <div className={`pr-exclusive-tag${isDrop ? " pr-drop-tag--offset" : ""}`}>✦ Web Exclusive</div>}
                    <ProductCard product={product} allProducts={products} />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
 
      {/* SHIPPING INFO STRIP */}
      <div className="pr-shipping">
        {[
          { icon: "🚚", label: "Home Delivery",   val: "3–5 Business Days", sub: "Islandwide Singapore · SGD 5.00 flat fee" },
          { icon: "📍", label: "Self Collection", val: "1–2 Business Days", sub: "Collection point confirmed via email" },
          { icon: "💰", label: "No Hidden Duties", val: "SGD Prices · GST Incl.", sub: "What you see at checkout is what you pay" },
          { icon: "🔒", label: "Secure Checkout",  val: "Stripe Payments",   sub: "256-bit SSL · All major cards accepted" },
        ].map((s) => (
          <div key={s.label} className="pr-shipping__item">
            <span className="pr-shipping__icon">{s.icon}</span>
            <span className="pr-shipping__label">{s.label}</span>
            <span className="pr-shipping__val">{s.val}</span>
            <span className="pr-shipping__sub">{s.sub}</span>
          </div>
        ))}
      </div>
 
      {/* ACCESSORIES SECTION */}
      <section  className="pr-acc">
        <div className="pr-acc__header">
          <p className="pr-acc__eyebrow">Personalise Your Purchase</p>
          <h2 className="pr-acc__title">MAKE IT<br /><span>YOURS.</span></h2>
          <p className="pr-acc__sub">
            Every 10ml bottle is yours to style. Choose from our range of sleeves —
            from minimal matte to limited-edition collaborations.
          </p>
        </div>
 
        <div id="accessories" className="pr-acc__scroll-wrap">
          <div className="pr-acc__scroll">
            {ACCESSORIES.map((acc) => (
              <AccCard key={acc.id} acc={acc} addToCart={addToCart} />
            ))}
          </div>
        </div>
 
        <p className="pr-acc__note">
          Accessories ship with your fragrance order at no extra delivery cost.
        </p>
      </section>
 
      <Footer />
    </>
  );
};
 
export default Products;