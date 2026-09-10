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

  pushEvent("consent_update", {
    consent_settings: {
      analytics_storage: analytics ? "granted" : "denied",
      ad_storage: marketing ? "granted" : "denied",
      ad_user_data: marketing ? "granted" : "denied",
      ad_personalization: marketing ? "granted" : "denied",
    },
  });
}

export function trackAudioEvent(action, songTitle, details = {}) {
  pushEvent("audio_interaction", {
    audio_action: action, // 'play', 'pause', 'progress_25', 'progress_50', 'progress_75', 'complete'
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

export function trackBeginCheckout(item) {
  pushEvent("begin_checkout", {
    ecommerce: {
      currency: "EUR",
      value: item.price,
      items: [
        {
          item_id: item.id || "song-package",
          item_name: item.name,
          item_category: "Personalized Music",
          price: item.price,
          quantity: 1,
        },
      ],
    },
  });
}

export function trackPurchase(transactionId, item) {
  pushEvent("purchase", {
    ecommerce: {
      transaction_id: transactionId,
      currency: "EUR",
      value: item.price,
      items: [
        {
          item_id: item.id || "song-package",
          item_name: item.name,
          item_category: "Personalized Music",
          price: item.price,
          quantity: 1,
        },
      ],
    },
  });
}
