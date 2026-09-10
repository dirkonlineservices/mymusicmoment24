# MyMusicMoment24 – Personalisierte KI-Musik auf Abruf

> Verwandle deine Geschichte in Musik. Professionell komponiert mit fortschrittlichen KI-Modellen, persönlicher Qualitätsprüfung und kostenloser Verbesserungsschleife.

---

## 📁 Projektstruktur

```
├── content/
│   └── blog/                   # Markdown-Dateien für den SEO-Ratgeber
│       └── individueller-hochzeitssong.md
├── public/
│   ├── audio/                  # Hörproben (MP3/WAV/OGG)
│   ├── sitemap.xml             # Sitemap für Suchmaschinen
│   └── robots.txt              # Crawler-Steuerung
├── src/
│   ├── components/
│   │   ├── AudioPlayer.jsx     # Hörproben-Player mit DataLayer-Tracking
│   │   ├── Configurator.jsx    # 5-stufiger Schritt-für-Schritt Song-Konfigurator
│   │   ├── PayPalCheckout.jsx  # PayPal Checkout Drawer (Slide-Over)
│   │   ├── SchemaJsonLd.jsx    # Dynamische strukturierte Daten (schema.org)
│   │   └── ConsentBanner.jsx   # Cookie-Banner mit Google Consent Mode v2
│   ├── lib/
│   │   ├── gtmPreview.js       # DataLayer Hilfsfunktionen & E-Commerce Events
│   │   └── blog.js             # Markdown Reader & Frontmatter Parser
│   └── views/
│       ├── LandingPage.jsx     # High-Converting Landing Page
│       └── BlogPost.jsx        # Blog- & Ratgeberansicht
├── server.js                   # Node.js Express Server & 301-Redirect-Map
├── package.json
└── README.md
```

---

## 🚀 Installation & Start

### 1. Abhängigkeiten installieren
```bash
npm install
```

### 2. Entwicklungsserver starten
```bash
npm run dev
```
Öffne `http://localhost:3000` im Browser.

### 3. Produktions-Build erstellen & Server starten
```bash
npm run build
npm start
```
Der Express-Server startet auf Port 8080 (oder `$PORT`).

---

## 📊 Google Tag Manager & Consent Mode v2

In `src/lib/gtmPreview.js` sind folgende Standard-Events implementiert:
- **`consent_update`**: Aktualisiert `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`.
- **`audio_interaction`**: Tracking bei Play, Pause und Fortschritt (25%, 50%, 75%, 100%).
- **`configurator_step`**: Übergang zwischen den Schritten 1 bis 5.
- **`begin_checkout`**: GA4 E-Commerce Event beim Öffnen des Checkout Drawers.
- **`purchase`**: GA4 E-Commerce Event nach erfolgreicher PayPal-Transaktion.

---

## 🔄 301-Redirect-Map (`server.js`)

Der Express-Server leitet alte Sitemap- und Kampagnen-Pfade automatisch per HTTP 301 auf die passenden Sektionen und Blogartikel weiter:
- `/sitemapxml` → `/sitemap.xml`
- `/individuelle-hochzeitssongs-mit-ki-...` → `/blog/individueller-hochzeitssong`
- `/faq-seite` → `/#faq`
- `/beispiele-fuer-ki-musik` → `/#hoerproben`
- `/generator` → `/#konfigurator`

---

## 🛡 Lizenz & Urheberrecht

© 2026 Dirk Schmetzer • DS Online Services
