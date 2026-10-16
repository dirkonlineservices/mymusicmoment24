/**
 * PayPal-Zahlung über den Server (Betrag wird dort berechnet und geprüft).
 * Ist auf dem Server noch kein PAYPAL_CLIENT_SECRET hinterlegt, antwortet er mit
 * { fallback: true } – dann läuft die bisherige Zahlung im Browser weiter und die
 * Bestellung wird in der Admin-Mail als ungeprüft markiert.
 */

const fallbackOrders = new Set();

/** createOrder-Handler für <PayPalButtons> */
export async function createPayPalOrder(actions, payload, { description, fallbackAmount }) {
  const res = await fetch("/api/paypal/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.status === 503) {
    const id = await actions.order.create({
      purchase_units: [
        {
          description: String(description || "Personalisierter Song").substring(0, 120),
          amount: { currency_code: "EUR", value: Number(fallbackAmount).toFixed(2) },
        },
      ],
    });
    fallbackOrders.add(id);
    return id;
  }

  const data = await res.json();
  if (!res.ok || !data.id) throw new Error(data.error || "PayPal-Zahlung konnte nicht angelegt werden.");
  return data.id;
}

/**
 * onApprove-Handler: schließt die Zahlung ab und verbucht die Bestellung.
 * Gibt die Transaktions-ID zurück.
 */
export async function capturePayPalOrder(data, actions, payload) {
  if (fallbackOrders.has(data.orderID)) {
    fallbackOrders.delete(data.orderID);
    const details = await actions.order.capture();
    const txId = details.id || `PAYPAL-${Date.now()}`;
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, transactionId: txId, paymentProvider: "paypal", payer: details.payer }),
    });
    return txId;
  }

  const res = await fetch("/api/paypal/capture-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, orderID: data.orderID }),
  });
  const result = await res.json();
  if (!res.ok || !result.success) throw new Error(result.error || "Zahlung konnte nicht bestätigt werden.");
  return result.transactionId;
}
