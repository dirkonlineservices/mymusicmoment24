import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// 301 Permanent Redirect Map (SEO Preservation from Sitemap / Legacy URLs)
const REDIRECT_MAP = {
  // Direct technical redirects
  "/sitemapxml": "/sitemap.xml",
  "/llmstxt": "/llms.txt",

  // Core Trust & Author routes
  "/kontakt-fur-personalisierte-songs": "/#kontakt",
  "/partner-fuer-songprojekt": "/#kontakt",
  "/b2b-dienstleistungen": "/#kontakt",
  "/faq-seite": "/#faq",
  "/ueber-uns-musikservice": "/autor-dirk-schmetzer",

  // Informational Blog Articles
  "/ki-musik-studien-trends-und-was-sie-fur-mymusicmoment24-bedeuten": "/blog/ki-musik-studien-trends",
  "/echt-oder-ki-die-revolution-der-personalisierten-musik-or-mymusicmoment24de": "/blog/ki-musik-revolution",
  "/10-tipps-fur-personalisierte-geschenkideen": "/blog/10-tipps-fuer-personalisierte-geschenke",
  "/was-ist-ki-musik-chancen-und-risiken-fur-content-creator": "/blog/was-ist-ki-musik",
  "/individuelle-hochzeitssongs-mit-ki-so-entsteht-euer-einzigartiger-liebessong": "/blog/individueller-hochzeitssong",
  "/blog-post": "/blog/individueller-hochzeitssong",
  "/ki-musik-blog": "/blog/individueller-hochzeitssong",
  "/blog-geburtstagsgeschenke": "/blog/10-tipps-fuer-personalisierte-geschenke",

  // Showcase & Audio Examples
  "/beispiele-ki-musikvideos": "/#hoerproben",
  "/beispiele-fuer-ki-musik": "/#hoerproben",
  "/ki-musikstile": "/#hoerproben",
  "/musikvergleich-der-jahrzehnte": "/#hoerproben",

  // Transactional & Configurator
  "/generator": "/#konfigurator",
  "/ki-musik-bestellen": "/#konfigurator",
  "/eigene-lieder-erstellen": "/#konfigurator",
  "/musik-selber-erstellen": "/#konfigurator",
  "/musik-ki": "/#konfigurator",
  "/express-zuschlag-lieferung-innerhalb-von-12-std-an-werktagen": "/#konfigurator",

  // Shop & Occasion Landing Pages
  "/geschenk-gutschein": "/#shop",
  "/individueller-song-kaufen": "/#shop",
  "/musik-services": "/#shop",
  "/personalisiertes-geschenk": "/#shop",
  "/personalisierte-lieder": "/#shop",
  "/personalisierte-geburtstagslieder": "/#shop",
  "/individuelle-hochzeitsgeschenke": "/#shop",
  "/individuelle-hochzeitssongs": "/#shop",
  "/individuelles-hochzeitslied": "/#shop",
  "/liebeslied-im-duett-2-sprachig-oder-2-stimmen": "/#shop",
  "/dein-partytrack-musikalische-uberraschung": "/#shop",
  "/jubilaum-song": "/#shop",
  "/individuelle-musik-zum-valentinstag-on-demand-kompositionen": "/#shop",
  "/emotionen-verschenken": "/#warum",
  "/kraft-der-musik": "/#warum",
  "/in-gedenken-an-sinnlose-opfer": "/#shop",
  "/niemals-knast-lieder": "/#shop"
};

// Middleware: 301 Redirect Handler
app.use((req, res, next) => {
  const reqPath = req.path;

  // Check 301 map
  if (REDIRECT_MAP[reqPath]) {
    console.log(`[301 Redirect] ${reqPath} -> ${REDIRECT_MAP[reqPath]}`);
    return res.redirect(301, REDIRECT_MAP[reqPath]);
  }

  // Trailing slash normalization (e.g. /faq/ -> /faq)
  if (reqPath.length > 1 && reqPath.endsWith("/")) {
    const cleanPath = reqPath.slice(0, -1);
    console.log(`[301 Slash Removal] ${reqPath} -> ${cleanPath}`);
    return res.redirect(301, cleanPath);
  }

  next();
});

// Serve public directory (sitemap.xml, robots.txt, audio files)
app.use(express.static(path.join(__dirname, "public")));

// Check if dist folder exists (production build)
const distDir = path.join(__dirname, "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
} else {
  // In development / preview without dist build
  app.get("*", (req, res) => {
    const indexPath = path.join(__dirname, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Build or index.html not found. Please run 'npm run build' first.");
    }
  });
}

app.listen(PORT, () => {
  console.log(`\n🎵 MyMusicMoment24 Server läuft auf http://localhost:${PORT}`);
  console.log(`📑 301-Redirect-Map aktiv (${Object.keys(REDIRECT_MAP).length} Routen konfiguriert)`);
});
