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
  "/sitemapxml": "/sitemap.xml",
  "/llmstxt": "/llms.txt",
  "/individuelle-hochzeitssongs-mit-ki-so-entsteht-euer-einzigartiger-liebessong": "/blog/individueller-hochzeitssong",
  "/echt-oder-ki-die-revolution-der-personalisierten-musik-or-mymusicmoment24de": "/blog/individueller-hochzeitssong",
  "/blog-post": "/blog/individueller-hochzeitssong",
  "/ki-musik-blog": "/blog/individueller-hochzeitssong",
  "/faq-seite": "/#faq",
  "/beispiele-fuer-ki-musik": "/#hoerproben",
  "/beispiele-ki-musikvideos": "/#hoerproben",
  "/generator": "/#konfigurator",
  "/ki-musik-bestellen": "/#konfigurator",
  "/individuelle-hochzeitssongs": "/#konfigurator",
  "/individuelles-hochzeitslied": "/#konfigurator",
  "/personalisierte-lieder": "/#konfigurator",
  "/personalisierte-geburtstagslieder": "/#konfigurator",
  "/eigene-lieder-erstellen": "/#konfigurator",
  "/musik-selber-erstellen": "/#konfigurator",
  "/individuelle-hochzeitsgeschenke": "/#konfigurator",
  "/express-zuschlag-lieferung-innerhalb-von-12-std-an-werktagen": "/#konfigurator",
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
