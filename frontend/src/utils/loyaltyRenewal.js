// src/utils/loyaltyRenewal.js
// ─────────────────────────────────────────────────────────────────────
// All renewal logic lives here so both Loyalty.js and Orders.js
// can import the same calculations without duplication.
// ─────────────────────────────────────────────────────────────────────

export const RENEWAL_RULES = {
  Silver: {
    requiredPoints: 120,
    failTier:      "Bronze",
    failPoints:    0,                // reset to 0 on failure
    label:         "120 points every 2 years",
  },
  Gold: {
    requiredPoints: 500,
    failTier:      "Gold",
    failPoints:    0,              // reset to 0 on failure
    label:         "500 points every 2 years",
  },
};

export const normalizeRenewalTier = (tier) => {
  const raw = String(tier ?? "").trim().toLowerCase();
  if (raw === "silver") return "Silver";
  if (raw === "gold") return "Gold";
  if (raw === "bronze") return "Bronze";
  return String(tier ?? "").trim();
};

/**
 * Given a signup date, return the start and end of the current 2-year window.
 */
export const getCurrentWindow = (createdAt) => {
  const signup = new Date(createdAt);
  const now    = new Date();

  // find how many complete 2-year periods have passed
  const msIn2Years = 2 * 365.25 * 24 * 60 * 60 * 1000;
  const elapsed    = now - signup;
  const periods    = Math.floor(elapsed / msIn2Years);

  const windowStart = new Date(signup.getTime() + periods * msIn2Years);
  const windowEnd   = new Date(signup.getTime() + (periods + 1) * msIn2Years);

  return { windowStart, windowEnd };
};

/**
 * Given a list of paid orders and a window, return total points earned.
 * Uses the points column on orders. Falls back to 0 if missing.
 */
export const getPointsInWindow = (orders, windowStart, windowEnd) => {
  const paid = ["paid", "complete", "succeeded"];
  return orders
    .filter((o) => {
      if (!paid.includes((o.payment_status ?? "").toLowerCase())) return false;
      const d = new Date(o.created_at);
      return d >= windowStart && d < windowEnd;
    })
    .reduce((sum, o) => sum + Number(o.points ?? 0), 0);
};

/**
 * Returns the full renewal status object for display.
 * Returns null if tier is Bronze (no renewal required).
 */
export const getRenewalStatus = (tier, createdAt, orders) => {
  const normalizedTier = normalizeRenewalTier(tier);
  const rule = RENEWAL_RULES[normalizedTier];
  if (!rule || !createdAt) return null;

  const { windowStart, windowEnd } = getCurrentWindow(createdAt);
  const pointsEarned = getPointsInWindow(orders, windowStart, windowEnd);
  const remaining = Math.max(0, rule.requiredPoints - pointsEarned);
  const pct       = Math.min(100, Math.round((pointsEarned / rule.requiredPoints) * 100));
  const isAt_risk = remaining > 0;

  // days until window closes
  const now      = new Date();
  const msLeft   = windowEnd - now;
  const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));

  return {
    tier: normalizedTier,
    rule,
    windowStart,
    windowEnd,
    pointsEarned,
    remaining,
    pct,
    isAtRisk: isAt_risk,
    daysLeft,
    expiryDateStr: windowEnd.toLocaleDateString("en-SG", {
      day: "2-digit", month: "long", year: "numeric",
    }),
  };
};
