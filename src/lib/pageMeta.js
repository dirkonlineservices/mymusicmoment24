/**
 * Titel, Beschreibung und Canonical pro Seite.
 * Wird vom Server (server.js, für Google & Co.) und von der App (Seitenwechsel im Browser) genutzt.
 * Blogartikel kommen aus content/blog (Frontmatter: title, excerpt, coverImage).
 */

import { localizePath } from "./i18nRoutes.js";

export const SITE_URL = "https://www.mymusicmoment24.de";
export const SITE_NAME = "MyMusicMoment24";
export const DEFAULT_IMAGE = "/images/hochzeit.jpg";

const HOME = {
  title: "Personalisierter Song als Geschenk | MyMusicMoment24",
  description:
    "Personalisierter Song für Hochzeit, Geburtstag oder Jahrestag: mit euren Namen und eurer Geschichte, in Studioqualität, meist in 24h fertig. Festpreis 19,99 €.",
};

const SUPPORT = {
  title: "Kontakt & WhatsApp-Support | MyMusicMoment24",
  description: "Fragen zu deinem persönlichen Song? Schreib uns per WhatsApp oder E-Mail. Wir helfen dir schnell und persönlich weiter.",
  canonicalPath: "/support",
};

const B2B = {
  title: "Songs für Agenturen, Firmen & Vereine (B2B) | MyMusicMoment24",
  description: "Individuelle Songs für Firmenjubiläen, Kampagnen, Vereine und Agenturen. Persönliche Beratung, faire Konditionen und schnelle Lieferung.",
  canonicalPath: "/b2b",
};

const STREAMING = {
  title: "Deinen Song auf Spotify & Apple Music veröffentlichen | MyMusicMoment24",
  description: "Lass deinen persönlichen Song auf Spotify, Apple Music, YouTube Music und Amazon Music veröffentlichen. Einmalig 4,99 €, ohne Abo.",
  canonicalPath: "/streaming",
};

const AUTHOR = {
  title: "Über mich: Dirk Schmetzer, der Mensch hinter MyMusicMoment24",
  description: "MyMusicMoment24 mache ich allein, ohne Firma, Gruppe oder Investoren dahinter. Seit 2024 entstehen hier persönliche Songs, mit direktem Kontakt zu mir.",
  canonicalPath: "/autor-dirk-schmetzer",
};

const BLACK_WEEK = {
  title: "Black Deal Monat: 25 % auf deinen persönlichen Song (14,99 €) | MyMusicMoment24",
  description: "Black Deal Monat bei MyMusicMoment24: 25 % Rabatt mit Code BLACK25! Dein persönlicher Song mit euren Namen & eurer Geschichte für 14,99 € statt 19,99 €.",
  canonicalPath: "/black-week",
};

export const STATIC_PAGE_META = {
  "/": HOME,
  "/black-week": BLACK_WEEK,
  "/blackweek": BLACK_WEEK,
  "/black-deal": BLACK_WEEK,
  "/black-friday": BLACK_WEEK,
  "/support": SUPPORT,
  "/kontakt": SUPPORT,
  "/b2b": B2B,
  "/kooperation": B2B,
  "/b2b-dienstleistungen": B2B,
  "/agenturen": B2B,
  "/streaming": STREAMING,
  "/spotify-release": STREAMING,
  "/streaming-release": STREAMING,
  "/autor-dirk-schmetzer": AUTHOR,
  "/ueber-uns-musikservice": AUTHOR,
  "/impressum": {
    title: "Impressum | MyMusicMoment24",
    description: "Impressum und Anbieterkennzeichnung von MyMusicMoment24.",
  },
  "/datenschutz": {
    title: "Datenschutzerklärung | MyMusicMoment24",
    description: "Datenschutzerklärung von MyMusicMoment24: welche Daten wir erheben und wie wir sie schützen.",
  },
  "/agb": {
    title: "AGB | MyMusicMoment24",
    description: "Allgemeine Geschäftsbedingungen von MyMusicMoment24 für personalisierte Songs, Gutscheine und Streaming-Veröffentlichungen.",
  },
  "/widerruf": {
    title: "Widerrufsbelehrung | MyMusicMoment24",
    description: "Widerrufsbelehrung von MyMusicMoment24: Informationen zum Widerrufsrecht bei Bestellungen personalisierter Songs.",
  },
};

// Englische Fassungen, Schlüssel = interner (deutscher) Pfad; Adresse kommt aus i18nRoutes
const EN = {
  home: {
    title: "Personalized Song as a Gift | MyMusicMoment24",
    description: "A personalized song for a wedding, birthday or anniversary: with your names and your story, in studio quality, usually ready in 24 hours. Fixed price €19.99.",
  },
  support: {
    title: "Contact & WhatsApp Support | MyMusicMoment24",
    description: "Questions about your personal song? Message me on WhatsApp or by email. I'll get back to you quickly and personally.",
  },
  b2b: {
    title: "Songs for Agencies, Companies & Clubs | MyMusicMoment24",
    description: "Custom songs for company anniversaries, campaigns, clubs and agencies. Personal advice, fair terms and fast delivery.",
  },
  streaming: {
    title: "Release Your Song on Spotify | MyMusicMoment24",
    description: "Have your personal song released on Spotify, Apple Music, YouTube Music and Amazon Music. One-time fee of €4.99, no subscription.",
  },
  author: {
    title: "About Me: Dirk Schmetzer | MyMusicMoment24",
    description: "I run MyMusicMoment24 on my own, with no company, group or investors behind it. Since 2024 I have been making personal songs, with direct contact to me.",
  },
  blackWeek: {
    title: "Black Deal Month: 25% OFF Your Personalized Song (€14.99) | MyMusicMoment24",
    description: "Black Deal Month at MyMusicMoment24: Save 25% with code BLACK25! Your custom song with your names & story for €14.99 instead of €19.99.",
  },
};

export const STATIC_PAGE_META_EN = {
  "/": EN.home,
  "/black-week": EN.blackWeek,
  "/blackweek": EN.blackWeek,
  "/black-deal": EN.blackWeek,
  "/black-friday": EN.blackWeek,
  "/support": EN.support,
  "/kontakt": EN.support,
  "/b2b": EN.b2b,
  "/kooperation": EN.b2b,
  "/b2b-dienstleistungen": EN.b2b,
  "/agenturen": EN.b2b,
  "/streaming": EN.streaming,
  "/spotify-release": EN.streaming,
  "/streaming-release": EN.streaming,
  "/autor-dirk-schmetzer": EN.author,
  "/ueber-uns-musikservice": EN.author,
  "/impressum": {
    title: "Legal Notice | MyMusicMoment24",
    description: "Legal notice (Impressum) and provider information for MyMusicMoment24.",
  },
  "/datenschutz": {
    title: "Privacy Policy | MyMusicMoment24",
    description: "Privacy policy of MyMusicMoment24: which data I collect and how I protect it.",
  },
  "/agb": {
    title: "Terms and Conditions | MyMusicMoment24",
    description: "Terms and conditions of MyMusicMoment24 for personalized songs, gift vouchers and streaming releases.",
  },
  "/widerruf": {
    title: "Right of Withdrawal | MyMusicMoment24",
    description: "Information on the right of withdrawal for orders of personalized songs.",
  },
};

export function notFoundMeta(lang = "de") {
  return lang === "en"
    ? { title: "Page not found | MyMusicMoment24", description: EN.home.description }
    : NOT_FOUND_META;
}

export const NOT_FOUND_META = {
  title: "Seite nicht gefunden | MyMusicMoment24",
  description: HOME.description,
};

function shorten(text = "", max = 160) {
  const clean = String(text).replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

/** Meta für einen Blogartikel (post = Frontmatter-Daten mit slug) */
export function blogPostMeta(post) {
  return {
    // metaTitle (Frontmatter) ist der kurze <title>, title bleibt die H1
    title: post.metaTitle || `${post.title} | ${SITE_NAME}`,
    description: shorten(post.metaDescription || post.excerpt || ""),
    image: post.coverImage || DEFAULT_IMAGE,
    canonicalPath: post.lang === "en" ? `/en/${post.slug}` : `/${post.slug}`,
    type: "article",
  };
}

/** Meta für eine statische Route (interner, deutscher Pfad) oder null, wenn unbekannt */
export function staticPageMeta(internalPath, lang = "de") {
  const de = STATIC_PAGE_META[internalPath];
  if (!de) return null;
  const canonicalInternal = de.canonicalPath || internalPath;
  if (lang === "en") {
    return {
      image: DEFAULT_IMAGE,
      type: "website",
      ...STATIC_PAGE_META_EN[internalPath],
      canonicalPath: localizePath(canonicalInternal, "en"),
    };
  }
  return { image: DEFAULT_IMAGE, canonicalPath: internalPath, type: "website", ...de };
}
