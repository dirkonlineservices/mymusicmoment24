/**
 * Titel, Beschreibung und Canonical pro Seite.
 * Wird vom Server (server.js, für Google & Co.) und von der App (Seitenwechsel im Browser) genutzt.
 * Blogartikel kommen aus content/blog (Frontmatter: title, excerpt, coverImage).
 */

export const SITE_URL = "https://www.mymusicmoment24.de";
export const SITE_NAME = "MyMusicMoment24";
export const DEFAULT_IMAGE = "/images/hochzeit.jpg";

const HOME = {
  title: "Personalisierter Song als Geschenk mit Namen & eurer Geschichte | MyMusicMoment24",
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
  title: "Über uns: Dirk Schmetzer & das Team | MyMusicMoment24",
  description: "Wer hinter MyMusicMoment24 steckt: Seit 2024 entstehen bei uns personalisierte Songs mit KI und persönlichem Feinschliff.",
  canonicalPath: "/autor-dirk-schmetzer",
};

export const STATIC_PAGE_META = {
  "/": HOME,
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
};

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
    title: `${post.title} | ${SITE_NAME}`,
    description: shorten(post.metaDescription || post.excerpt || ""),
    image: post.coverImage || DEFAULT_IMAGE,
    canonicalPath: `/${post.slug}`,
    type: "article",
  };
}

/** Meta für eine statische Route oder null, wenn unbekannt */
export function staticPageMeta(requestPath) {
  const meta = STATIC_PAGE_META[requestPath];
  if (!meta) return null;
  return { image: DEFAULT_IMAGE, canonicalPath: requestPath, type: "website", ...meta };
}
