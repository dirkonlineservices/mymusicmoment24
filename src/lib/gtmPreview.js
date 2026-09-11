/**
 * DataLayer & Google Tag Manager Helper Functions
 * Includes Consent Mode v2 and GA4 E-Commerce standard events.
 */

export function getDataLayer() {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    return window.dataLayer;
  }
  return [];
}

export function pushEvent(eventName, params = {}) {
  const dl = getDataLayer();
  const payload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...params,
  };
  dl.push(payload);
  console.log(`[DataLayer Event] ${eventName}:`, payload);
}

export function updateConsent({ analytics = false, marketing = false }) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      ad_storage: marketing ? "granted" : "denied",
      ad_user_data: marketing ? "granted" : "denied",
      ad_personalization: marketing ? "granted" : "denied",
      analytics_storage: analytics ? "granted" : "denied",
    });
  }

  const consentPayload = {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
  };

  pushEvent("consent_update", { consent_settings: consentPayload });
  pushEvent("Consent Updated", { consent_settings: consentPayload });
}

export function trackAudioEvent(action, songTitle, details = {}) {
  pushEvent("audio_interaction", {
    audio_action: action,
    song_title: songTitle,
    ...details,
  });
}

export function trackConfiguratorStep(stepNumber, stepName, selections = {}) {
  pushEvent("configurator_step", {
    step_number: stepNumber,
    step_name: stepName,
    selections: selections,
  });
}

export function trackViewItem(item = {}) {
  const numericPrice = Number(item.price) || 19.99;
  pushEvent("view_item", {
    ecommerce: {
      currency: "EUR",
      value: numericPrice,
      items: [
        {
          item_id: item.id || "song-package",
          item_name: item.name || "Personalisierter Song",
          item_category: "Personalized Music",
          price: numericPrice,
          quantity: 1,
        },
      ],
    },
  });
}

export function trackAddToCart(item = {}) {
  const numericPrice = Number(item.price) || 19.99;
  pushEvent("add_to_cart", {
    ecommerce: {
      currency: "EUR",
      value: numericPrice,
      items: [
        {
          item_id: item.id || "song-package",
          item_name: item.name || "Personalisierter Song",
          item_category: "Personalized Music",
          price: numericPrice,
          quantity: 1,
        },
      ],
    },
  });
}

export function trackBeginCheckout(item) {
  const numericPrice = Number(item.price) || 19.99;
  pushEvent("begin_checkout", {
    ecommerce: {
      currency: "EUR",
      value: numericPrice,
      items: [
        {
          item_id: item.id || "song-package",
          item_name: item.name,
          item_category: "Personalized Music",
          price: numericPrice,
          quantity: 1,
        },
      ],
    },
  });
}

export function trackPurchase(transactionId, item) {
  const numericPrice = Number(item.price) || 19.99;

  // 1. GA4 / GTM E-Commerce Purchase Event
  pushEvent("purchase", {
    ecommerce: {
      transaction_id: transactionId,
      currency: "EUR",
      value: numericPrice,
      items: [
        {
          item_id: item.id || "song-package",
          item_name: item.name || "Personalisierter Song",
          item_category: "Personalized Music",
          price: numericPrice,
          quantity: 1,
        },
      ],
    },
  });

  // 2. Google Ads Conversion Event (AW-17340697742)
  pushEvent("conversion", {
    send_to: "AW-17340697742",
    value: numericPrice,
    currency: "EUR",
    transaction_id: transactionId,
  });

  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: "AW-17340697742",
      value: numericPrice,
      currency: "EUR",
      transaction_id: transactionId,
    });
  }
}

