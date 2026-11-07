/**
 * Zweisprachige Adressen: Deutsch ohne Präfix, Englisch unter /en mit englischen Slugs.
 * Intern arbeitet die App immer mit den deutschen Pfaden; dieses Modul übersetzt hin und zurück.
 * Wird von App (Browser), server.js und entry-server.jsx genutzt.
 */

export const LANGS = ["de", "en"];

// Feste Seiten: deutscher Pfad → englischer Pfad
export const STATIC_PATHS = {
  "/": "/en",
  "/black-week": "/en/black-week",
  "/support": "/en/support",
  "/b2b": "/en/b2b",
  "/streaming": "/en/streaming",
  "/autor-dirk-schmetzer": "/en/about-dirk-schmetzer",
  "/impressum": "/en/legal-notice",
  "/datenschutz": "/en/privacy",
  "/agb": "/en/terms",
  "/widerruf": "/en/withdrawal",
};

// Ratgeber: deutscher Slug → englischer Slug (englische Texte in content/blog/en)
export const BLOG_SLUGS = {
  "personalisierte-geburtstagslieder": "personalized-birthday-song",
  "personalisierte-lieder": "personalized-song",
  "individuelle-hochzeitsgeschenke": "wedding-gift-song",
  "personalisierter-song-weihnachtsgeschenk": "christmas-gift-song",
  "lied-fuer-mama": "song-for-mom",
  "lied-fuer-papa": "song-for-dad",
  "song-zum-18-geburtstag": "18th-birthday-song",
  "song-zum-50-geburtstag": "50th-birthday-song",
  "song-zum-ruhestand": "retirement-song",
  "jubilaum-song": "anniversary-song",
  "individueller-hochzeitssong": "custom-wedding-song",
  "10-tipps-fuer-personalisierte-geschenke": "personalized-gift-ideas",
  "ki-musik-revolution": "real-or-ai-personalized-music",
  "was-ist-ki-musik": "what-is-ai-music",
  "ki-musik-studien-trends": "ai-music-trends",
};

const EN_TO_DE = Object.fromEntries([
  ...Object.entries(STATIC_PATHS).map(([de, en]) => [en, de]),
  ...Object.entries(BLOG_SLUGS).map(([de, en]) => [`/en/${en}`, `/${de}`]),
]);

function clean(path = "/") {
  const p = String(path).split(/[?#]/)[0] || "/";
  return p.length > 1 ? p.replace(/\/+$/, "") : p;
}

/** Sprache einer Adresse */
export function langFromPath(path) {
  const p = clean(path);
  return p === "/en" || p.startsWith("/en/") ? "en" : "de";
}

/**
 * Interner (deutscher) Pfad zu einer Adresse, oder null, wenn eine /en-Adresse unbekannt ist.
 * Deutsche Adressen werden unverändert zurückgegeben.
 */
export function toInternalPath(path) {
  const p = clean(path);
  if (langFromPath(p) === "de") return p;
  return EN_TO_DE[p] || null;
}

/** Öffentliche Adresse eines internen (deutschen) Pfads in der gewünschten Sprache */
export function localizePath(internalPath, lang = "de") {
  const [base, hash = ""] = String(internalPath).split("#");
  const p = clean(base || "/");
  const suffix = hash ? `#${hash}` : "";
  if (lang !== "en") return `${p}${suffix}`;
  if (STATIC_PATHS[p]) return `${STATIC_PATHS[p]}${suffix}`;
  const slug = p.slice(1);
  if (BLOG_SLUGS[slug]) return `/en/${BLOG_SLUGS[slug]}${suffix}`;
  return `/en${suffix}`;
}

/** Gegenstück einer Adresse in der anderen Sprache (null, wenn es keins gibt) */
export function alternatePath(path, targetLang) {
  const internal = toInternalPath(path);
  if (!internal) return null;
  const slug = internal.slice(1);
  const known = STATIC_PATHS[internal] || BLOG_SLUGS[slug];
  if (!known) return null;
  return localizePath(internal, targetLang);
}
