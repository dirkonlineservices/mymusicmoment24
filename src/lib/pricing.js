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

export const DISCOUNT_RATE = 0.1;

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
export function calculatePrice({ kind = "song", express = false, certificate = false, discount = false }) {
  const base = PRICES[kind] ?? PRICES.song;
  const expressExtra = kind === "song" && express ? PRICES.express : 0;
  const certificateExtra = kind !== "streaming" && certificate ? PRICES.certificate : 0;
  const subtotal = Number((base + expressExtra + certificateExtra).toFixed(2));
  return discount ? Number((subtotal * (1 - DISCOUNT_RATE)).toFixed(2)) : subtotal;
}
