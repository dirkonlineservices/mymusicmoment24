/**
 * Zentrale Preisliste. Die Kasse zeigt damit den Preis an, maßgeblich ist aber
 * immer die Berechnung auf dem Server (server.js) – Beträge aus dem Browser
 * werden dort ignoriert.
 */

export const PRICES = {
  song: 19.99,
  gutschein: 19.99,
  streaming: 4.99,
  express: 9.99,
  certificate: 9.99,
};

// Öffentliche Aktionscodes (werden auf der Website beworben, dürfen daher im Code stehen)
export const PROMO_CODES = {
  MOMENT25: { rate: 0.25, validUntil: "2026-12-23T23:59:59+01:00" },
};

/** Aktuell beworbene Aktion oder null, wenn abgelaufen */
export function activePromo(now = new Date()) {
  for (const [code, promo] of Object.entries(PROMO_CODES)) {
    if (now <= new Date(promo.validUntil)) return { code, ...promo };
  }
  return null;
}

/** Rabattsatz für einen Code (0, wenn ungültig oder abgelaufen) */
export function promoRate(code, now = new Date()) {
  const promo = PROMO_CODES[String(code || "").trim().toUpperCase()];
  if (!promo || now > new Date(promo.validUntil)) return 0;
  return promo.rate;
}

/** Art der Bestellung aus den Bestelldaten ableiten */
export function orderKind({ category, orderDetails, isStreaming, id } = {}) {
  if (isStreaming || category === "streaming" || orderDetails?.occasion === "streaming-release" || id?.includes("streaming")) {
    return "streaming";
  }
  if (category === "gutschein" || orderDetails?.occasion === "gutschein" || id?.includes("gutschein")) {
    return "gutschein";
  }
  return "song";
}

/** Endpreis in Euro (zwei Nachkommastellen) */
export function calculatePrice({ kind = "song", express = false, certificate = false, discountRate = 0 }) {
  const base = PRICES[kind] ?? PRICES.song;
  const expressExtra = kind === "song" && express ? PRICES.express : 0;
  const certificateExtra = kind !== "streaming" && certificate ? PRICES.certificate : 0;
  const subtotal = Number((base + expressExtra + certificateExtra).toFixed(2));
  return discountRate > 0 ? Number((subtotal * (1 - discountRate)).toFixed(2)) : subtotal;
}
