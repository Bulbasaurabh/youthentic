import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

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
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--black); color: var(--white); font-family: 'Jost', sans-serif; overflow-x: hidden; }

  /* ── PAGE SHELL ─────────────────────────────────────────────────── */
  .sq-page {
    min-height: 100svh;
    background: var(--black);
    display: flex;
    flex-direction: column;
  }

  /* ── HERO ───────────────────────────────────────────────────────── */
  .sq-hero {
    position: relative;
    padding: 10rem 3rem 5rem;
    overflow: hidden;
    border-bottom: 1px solid var(--border);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
  }
  .sq-hero__wordmark {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none; user-select: none; z-index: 0;
  }
  .sq-hero__wordmark span {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(8rem, 20vw, 18rem);
    color: transparent;
    -webkit-text-stroke: 1px rgba(201,168,76,0.08);
    white-space: nowrap;
    letter-spacing: 0.02em;
  }
  .sq-hero__glow {
    position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
    width: 600px; height: 400px; border-radius: 50%;
    background: radial-gradient(ellipse, rgba(180,130,40,0.14) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .sq-hero__eyebrow {
    position: relative; z-index: 1;
    font-size: 0.68rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold);
  }
  .sq-hero__title {
    position: relative; z-index: 1;
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 8vw, 7rem);
    letter-spacing: 0.04em; color: var(--white); line-height: 0.95;
  }
  .sq-hero__title span { color: var(--gold); }
  .sq-hero__sub {
    position: relative; z-index: 1;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1rem, 1.5vw, 1.15rem); font-weight: 300; font-style: italic;
    color: var(--muted); max-width: 44ch; line-height: 1.8;
  }

  /* ── PROGRESS BAR ───────────────────────────────────────────────── */
  .sq-progress {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem 3rem;
    border-bottom: 1px solid var(--border);
    background: var(--dark);
  }
  .sq-progress__track {
    flex: 1;
    height: 2px;
    background: rgba(201,168,76,0.12);
    border-radius: 1px;
    overflow: hidden;
  }
  .sq-progress__fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold), var(--gold2));
    border-radius: 1px;
    transition: width 0.5s cubic-bezier(0.22,1,0.36,1);
  }
  .sq-progress__label {
    font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--muted); white-space: nowrap; flex-shrink: 0;
  }
  .sq-progress__label span { color: var(--gold); }

  /* ── QUIZ BODY ──────────────────────────────────────────────────── */
  .sq-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5rem 3rem;
    gap: 3rem;
  }

  /* question block */
  .sq-question {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    animation: sqFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
  }
  .sq-question__step {
    font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold);
  }
  .sq-question__text {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem, 4vw, 3.2rem);
    font-weight: 300; line-height: 1.2; color: var(--white);
    max-width: 20ch;
  }
  .sq-question__text em { font-style: italic; color: var(--gold); }
  .sq-question__hint {
    font-size: 0.78rem; color: var(--muted); letter-spacing: 0.06em;
  }

  /* options grid */
  .sq-options {
    display: grid;
    gap: 1px;
    background: var(--border);
    width: 100%;
    max-width: 860px;
    animation: sqFadeUp 0.65s cubic-bezier(0.22,1,0.36,1) 0.1s both;
  }
  .sq-options--2 { grid-template-columns: 1fr 1fr; }
  .sq-options--3 { grid-template-columns: repeat(3, 1fr); }
  .sq-options--4 { grid-template-columns: repeat(2, 1fr); }

  .sq-option {
    background: var(--dark);
    border: none;
    padding: 2rem 1.5rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.6rem;
    text-align: left;
    transition: background 0.25s, transform 0.2s;
    position: relative;
    overflow: hidden;
  }
  .sq-option::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--gold), var(--gold2));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  .sq-option:hover { background: #161616; }
  .sq-option:hover::after { transform: scaleX(1); }
  .sq-option:active { transform: scale(0.98); }

  .sq-option__icon { font-size: 1.8rem; }
  .sq-option__label {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem; font-weight: 400; color: var(--white); line-height: 1.2;
  }
  .sq-option__sub {
    font-size: 0.75rem; color: var(--muted); line-height: 1.5;
  }

  /* ── RESULT ─────────────────────────────────────────────────────── */
  .sq-result {
    width: 100%; max-width: 860px;
    animation: sqFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid var(--border);
    background: var(--dark);
    overflow: hidden;
  }

  .sq-result__header {
    padding: 3rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .sq-result__eyebrow {
    font-size: 0.65rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold);
  }
  .sq-result__title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 300; line-height: 1.1; color: var(--white);
  }
  .sq-result__title em { font-style: italic; color: var(--gold); }
  .sq-result__desc {
    font-size: 0.88rem; line-height: 1.85; color: var(--muted); max-width: 52ch;
  }

  /* scent match cards */
  .sq-matches {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1px;
    background: var(--border);
  }

  .sq-match {
    background: var(--dark);
    padding: 1.75rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: background 0.25s;
    cursor: pointer;
    text-decoration: none;
  }
  .sq-match:hover { background: var(--panel); }
  .sq-match__rank {
    font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold);
  }
  .sq-match__name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem; font-weight: 400; color: var(--white); line-height: 1.2;
  }
  .sq-match__notes {
    font-size: 0.75rem; color: var(--muted); font-style: italic; line-height: 1.5;
  }
  .sq-match__arrow {
    margin-top: auto; padding-top: 0.75rem;
    font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--gold); opacity: 0;
    transition: opacity 0.2s;
  }
  .sq-match:hover .sq-match__arrow { opacity: 1; }

  /* result actions */
  .sq-result__actions {
    padding: 2rem 3rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    border-top: 1px solid var(--border);
  }

  .yt-btn-yellow {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--yellow); color: var(--black);
    font-family: 'Jost', sans-serif; font-size: 0.8rem; font-weight: 500;
    letter-spacing: 0.08em; border: none; padding: 0.8rem 2rem; border-radius: 3px;
    cursor: pointer; text-decoration: none; transition: background 0.2s, transform 0.15s;
  }
  .yt-btn-yellow:hover { background: var(--gold2); transform: translateY(-2px); }

  .sq-btn-ghost {
    background: transparent; border: 1px solid var(--border); color: var(--muted);
    font-family: 'Jost', sans-serif; font-size: 0.75rem; font-weight: 400;
    letter-spacing: 0.1em; text-transform: uppercase; padding: 0.75rem 1.5rem;
    border-radius: 3px; cursor: pointer; transition: border-color 0.2s, color 0.2s;
  }
  .sq-btn-ghost:hover { border-color: var(--gold); color: var(--white); }

  /* profile tags */
  .sq-profile {
    display: flex; flex-wrap: wrap; gap: 0.5rem;
  }
  .sq-profile__tag {
    border: 1px solid var(--border); padding: 0.3rem 0.8rem;
    font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold);
  }

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
  @keyframes sqFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── RESPONSIVE ─────────────────────────────────────────────────── */
  @media (max-width: 700px) {
    .sq-hero { padding: 8rem 1.5rem 3.5rem; }
    .sq-body { padding: 3rem 1.5rem; }
    .sq-options--2, .sq-options--3, .sq-options--4 { grid-template-columns: 1fr; }
    .sq-matches { grid-template-columns: 1fr 1fr; }
    .sq-result__header { padding: 2rem 1.5rem; }
    .sq-result__actions { padding: 1.5rem; flex-direction: column; align-items: stretch; }
    .sq-progress { padding: 1rem 1.5rem; }
    .yt-footer { flex-direction: column; align-items: center; text-align: center; }
  }
`;

/* ─── SCENT DATABASE ────────────────────────────────────────────────
   Each scent maps to profile tags so the quiz can score matches.
   Tags: fresh | bold | floral | woody | citrus | musky | evening | light
───────────────────────────────────────────────────────────────────── */
const SCENTS = [
  {
    name: "Citrus Rush",
    notes: "Grapefruit · Bergamot · Green Tea",
    tags: ["fresh", "citrus", "light", "day"],
  },
  {
    name: "Ethereal Bloom",
    notes: "Peony · White Musk · Soft Amber",
    tags: ["floral", "light", "fresh", "day"],
  },
  {
    name: "Lumira",
    notes: "Neroli · Jasmine · Cedarwood",
    tags: ["floral", "woody", "fresh", "day"],
  },
  {
    name: "Celestial Drift",
    notes: "Sea Salt · Driftwood · Soft Musk",
    tags: ["fresh", "musky", "light", "day"],
  },
  {
    name: "Velvet Essence",
    notes: "Sandalwood · Warm Amber · Vanilla",
    tags: ["woody", "musky", "bold", "evening"],
  },
  {
    name: "Noche",
    notes: "Oud · Dark Rose · Black Pepper",
    tags: ["bold", "floral", "musky", "evening"],
  },
  {
    name: "Noir",
    notes: "Tobacco · Leather · Dark Amber",
    tags: ["bold", "woody", "musky", "evening"],
  },
  {
    name: "Crimson Woods",
    notes: "Cedarwood · Oud · Spiced Vetiver",
    tags: ["bold", "woody", "citrus", "evening"],
  },
];

/* ─── QUIZ QUESTIONS ────────────────────────────────────────────────
   Each answer pushes tag weights used to score scents at the end.
───────────────────────────────────────────────────────────────────── */
const QUESTIONS = [
  {
    id: "occasion",
    step: "01",
    text: "When do you reach for a new scent?",
    hint: "Pick the one that fits you most",
    cols: 2,
    options: [
      { icon: "☀️", label: "Daily wear",       sub: "MRT, office, errands",        tags: ["fresh", "light", "day"] },
      { icon: "🌙", label: "Evenings out",      sub: "Dinner, rooftop, nightlife",  tags: ["bold", "musky", "evening"] },
      { icon: "✈️", label: "Travel & adventure",sub: "On the go, anywhere",         tags: ["fresh", "citrus", "light"] },
      { icon: "🎯", label: "Special occasions", sub: "Dates, events, impressions",  tags: ["bold", "floral", "evening"] },
    ],
  },
  {
    id: "mood",
    step: "02",
    text: "What mood do you want your scent to set?",
    hint: "Trust your gut",
    cols: 2,
    options: [
      { icon: "🌿", label: "Clean & refreshed", sub: "Like a cool breeze",         tags: ["fresh", "citrus", "light"] },
      { icon: "🔥", label: "Bold & commanding",  sub: "A presence in every room",  tags: ["bold", "musky", "woody"] },
      { icon: "🌸", label: "Soft & romantic",    sub: "Warm, inviting, tender",    tags: ["floral", "musky", "light"] },
      { icon: "🪵", label: "Deep & mysterious",  sub: "Grounded, complex, dark",   tags: ["woody", "bold", "evening"] },
    ],
  },
  {
    id: "climate",
    step: "03",
    text: "Singapore runs hot. How do you handle it?",
    hint: "This shapes how your scent performs",
    cols: 2,
    options: [
      { icon: "💧", label: "Light is better",    sub: "I want something subtle",   tags: ["fresh", "light", "citrus"] },
      { icon: "💪", label: "Go bold anyway",      sub: "I want it to last all day", tags: ["bold", "musky", "woody"] },
    ],
  },
  {
    id: "character",
    step: "04",
    text: "Pick the word that describes you most.",
    hint: "There are no wrong answers",
    cols: 3,
    options: [
      { icon: "⚡", label: "Energetic",   sub: "Always moving",          tags: ["citrus", "fresh", "light"] },
      { icon: "🤍", label: "Effortless",  sub: "Clean, considered style", tags: ["fresh", "floral", "light"] },
      { icon: "🎩", label: "Refined",     sub: "Quality over everything", tags: ["woody", "musky", "bold"] },
      { icon: "🌑", label: "Mysterious",  sub: "Layers beneath the surface",tags: ["bold", "evening", "woody"] },
      { icon: "🌺", label: "Expressive",  sub: "You make an entrance",   tags: ["floral", "bold", "evening"] },
      { icon: "🧊", label: "Understated", sub: "Quiet confidence",       tags: ["fresh", "light", "musky"] },
    ],
  },
];

/* ─── SCORING ───────────────────────────────────────────────────── */
const scoreScents = (answers) => {
  const weights = {};
  answers.forEach((tags) =>
    tags.forEach((tag) => { weights[tag] = (weights[tag] || 0) + 1; })
  );

  return SCENTS
    .map((scent) => ({
      ...scent,
      score: scent.tags.reduce((sum, tag) => sum + (weights[tag] || 0), 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
};

const buildProfile = (answers) => {
  const all = answers.flat();
  const counts = {};
  all.forEach((t) => { counts[t] = (counts[t] || 0) + 1; });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([tag]) => tag.charAt(0).toUpperCase() + tag.slice(1));
};

/* ─── COMPONENT ─────────────────────────────────────────────────── */
const ScentQuiz = () => {
  const [step,    setStep]    = useState(0);       // 0 = intro, 1..N = questions, N+1 = result
  const [answers, setAnswers] = useState([]);       // array of tag arrays
  const [animKey, setAnimKey] = useState(0);        // forces re-animation on step change

  const totalSteps = QUESTIONS.length;
  const isIntro    = step === 0;
  const isResult   = step > totalSteps;
  const question   = !isIntro && !isResult ? QUESTIONS[step - 1] : null;
  const progress   = isResult ? 100 : ((step / totalSteps) * 100);

  const handleAnswer = (tags) => {
    const newAnswers = [...answers, tags];
    setAnswers(newAnswers);
    setAnimKey((k) => k + 1);
    setStep((s) => s + 1);
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers([]);
    setAnimKey((k) => k + 1);
  };

  const matches = isResult ? scoreScents(answers) : [];
  const profile = isResult ? buildProfile(answers) : [];

  return (
    <>
      <style>{css}</style>
      <div className="sq-page">

        {/* ── HERO ──────────────────────────────────────────────── */}
        <section className="sq-hero">
          <div className="sq-hero__wordmark" aria-hidden="true"><span>SCENT QUIZ</span></div>
          <div className="sq-hero__glow" aria-hidden="true" />
          <p className="sq-hero__eyebrow">Youthentic Singapore · Personalised</p>
          <h1 className="sq-hero__title">SCENT<br /><span>FINDER.</span></h1>
          <p className="sq-hero__sub">
            Four questions. Your perfect match — from our full Singapore collection.
          </p>
        </section>

        {/* ── PROGRESS ──────────────────────────────────────────── */}
        {!isIntro && (
          <div className="sq-progress">
            <div className="sq-progress__track">
              <div className="sq-progress__fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="sq-progress__label">
              {isResult ? "Complete" : <><span>{step}</span> of {totalSteps}</>}
            </span>
          </div>
        )}

        {/* ── BODY ──────────────────────────────────────────────── */}
        <div className="sq-body">

          {/* INTRO */}
          {isIntro && (
            <div className="sq-question" key="intro">
              <p className="sq-question__step">Ready?</p>
              <h2 className="sq-question__text">
                Discover your <em>signature</em> scent in four steps.
              </h2>
              <p className="sq-question__hint">
                Tailored to the Singapore climate and your lifestyle.
              </p>
              <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
                <button
                  className="yt-btn-yellow"
                  onClick={() => { setStep(1); setAnimKey((k) => k + 1); }}
                >
                  Start the Quiz →
                </button>
              </div>
            </div>
          )}

          {/* QUESTION */}
          {question && (
            <div key={animKey} style={{ width: "100%", maxWidth: "860px", display: "flex", flexDirection: "column", gap: "2.5rem", alignItems: "center" }}>
              <div className="sq-question">
                <p className="sq-question__step">Question {question.step} of {totalSteps}</p>
                <h2 className="sq-question__text">{question.text}</h2>
                <p className="sq-question__hint">{question.hint}</p>
              </div>

              <div className={`sq-options sq-options--${question.cols === 3 ? "3" : question.options.length === 2 ? "2" : "4"}`}>
                {question.options.map((opt) => (
                  <button
                    key={opt.label}
                    className="sq-option"
                    onClick={() => handleAnswer(opt.tags)}
                  >
                    <span className="sq-option__icon">{opt.icon}</span>
                    <span className="sq-option__label">{opt.label}</span>
                    <span className="sq-option__sub">{opt.sub}</span>
                  </button>
                ))}
              </div>

              {/* back button */}
              {step > 1 && (
                <button
                  className="sq-btn-ghost"
                  onClick={() => {
                    setAnswers((a) => a.slice(0, -1));
                    setStep((s) => s - 1);
                    setAnimKey((k) => k + 1);
                  }}
                >
                  ← Back
                </button>
              )}
            </div>
          )}

          {/* RESULT */}
          {isResult && (
            <div className="sq-result" key="result">
              <div className="sq-result__header">
                <p className="sq-result__eyebrow">Your Scent Profile</p>
                <h2 className="sq-result__title">
                  We found your <em>perfect match.</em>
                </h2>
                <p className="sq-result__desc">
                  Based on your answers, here are the Youthentic scents built for your
                  personality, lifestyle, and Singapore's climate.
                </p>
                <div className="sq-profile">
                  {profile.map((tag) => (
                    <span key={tag} className="sq-profile__tag">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="sq-matches">
                {matches.map((scent, i) => (
                  <Link
                    key={scent.name}
                    to="/products"
                    className="sq-match"
                  >
                    <span className="sq-match__rank">
                      {i === 0 ? "✦ Best Match" : `Match #${i + 1}`}
                    </span>
                    <span className="sq-match__name">{scent.name}</span>
                    <span className="sq-match__notes">{scent.notes}</span>
                    <span className="sq-match__arrow">View product →</span>
                  </Link>
                ))}
              </div>

              <div className="sq-result__actions">
                <Link to="/products" className="yt-btn-yellow">
                  Shop These Scents →
                </Link>
                <button className="sq-btn-ghost" onClick={handleRestart}>
                  Retake Quiz
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ── FOOTER ────────────────────────────────────────────── */}
        {/* FOOTER */}
      <Footer />
      </div>
    </>
  );
};

export default ScentQuiz;