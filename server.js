import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env if present
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...values] = trimmed.split("=");
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join("=").trim();
      }
    }
  });
}

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

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

// Helper to create email transporter
function getMailTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 465;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return null;
}

// Order Storage & Notification Endpoint
app.post("/api/orders", async (req, res) => {
  try {
    const orderData = req.body;
    console.log(`\n🎉 [NEUE BESTELLUNG EINGEGANGEN]`);
    console.log(`Transaktion: ${orderData.transactionId || 'Unbekannt'} | Betrag: ${orderData.amount} €`);
    console.log(`Kunde: ${orderData.customerName} (${orderData.customerEmail}, Tel: ${orderData.customerPhone || 'Keine'})`);
    console.log(`Song-Details:`, orderData.orderDetails);
    console.log(`Wunschtext: ${orderData.songDetailsText}`);

    // Persist order in data/orders.json
    const dataDir = path.join(__dirname, "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const ordersFile = path.join(dataDir, "orders.json");
    let orders = [];
    if (fs.existsSync(ordersFile)) {
      try {
        orders = JSON.parse(fs.readFileSync(ordersFile, "utf8"));
      } catch (err) {
        orders = [];
      }
    }
    const newOrder = {
      ...orderData,
      receivedAt: new Date().toISOString(),
      status: "paid",
    };
    orders.unshift(newOrder);
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), "utf8");

    // Attempt E-Mail Dispatch if SMTP is configured
    const transporter = getMailTransporter();
    if (transporter) {
      const smtpUser = process.env.SMTP_USER || "info@mymusicmoment24.de";
      const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || smtpUser;
      
      // 1. Email to Dirk / Admin
      const adminHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
          <h2 style="color: #d97706; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">🎉 Neuer bezahlter Song-Auftrag!</h2>
          <p><strong>Bestellnummer:</strong> ${orderData.transactionId}</p>
          <p><strong>Betrag bezahlt:</strong> ${orderData.amount} € via ${orderData.paymentProvider}</p>
          
          <h3 style="color: #0f172a; margin-top: 20px;">👤 Kundendaten:</h3>
          <ul style="line-height: 1.6;">
            <li><strong>Name:</strong> ${orderData.customerName || 'Nicht angegeben'}</li>
            <li><strong>E-Mail:</strong> <a href="mailto:${orderData.customerEmail}">${orderData.customerEmail}</a></li>
            <li><strong>WhatsApp / Tel:</strong> ${orderData.customerPhone || 'Nicht angegeben'}</li>
          </ul>

          <h3 style="color: #0f172a; margin-top: 20px;">🎵 Song-Konfiguration:</h3>
          <ul style="line-height: 1.6;">
            <li><strong>Anlass:</strong> ${orderData.orderDetails?.occasion || 'Personalisierter Song'}</li>
            <li><strong>Genre:</strong> ${orderData.orderDetails?.genre || 'Standard'}</li>
            <li><strong>Stimme:</strong> ${orderData.orderDetails?.voice || 'Duett'}</li>
            <li><strong>Sprache:</strong> ${orderData.orderDetails?.language || 'Deutsch'}</li>
            <li><strong>Express-Lieferung (<12h):</strong> ${orderData.orderDetails?.express ? '✅ JA (Express)' : '❌ Nein (Standard)'}</li>
            <li><strong>PDF Songtext-Urkunde:</strong> ${orderData.orderDetails?.pdfLyrics ? '✅ JA' : '❌ Nein'}</li>
          </ul>

          <h3 style="color: #0f172a; margin-top: 20px;">📝 Wunschtext & Details des Kunden:</h3>
          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; border-left: 4px solid #d97706; white-space: pre-wrap;">
${orderData.songDetailsText || 'Keine zusätzlichen Anmerkungen.'}
          </div>
        </div>
      `;

      // 2. Email to Customer
      const customerHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
          <h2 style="color: #d97706;">Vielen Dank für deine Bestellung bei MyMusicMoment24! 🎵</h2>
          <p>Hallo ${orderData.customerName || 'Musikfreund'},</p>
          <p>deine Zahlung über <strong>${orderData.amount} €</strong> ist erfolgreich eingegangen. Wir legen sofort mit der Produktion deines persönlichen Songs los!</p>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 8px;"><strong>Bestell-Nr:</strong> ${orderData.transactionId}</p>
            <p style="margin: 0 0 8px;"><strong>Song:</strong> ${orderData.orderName || 'Persönlicher Song'}</p>
            <p style="margin: 0;"><strong>Zustellung an:</strong> ${orderData.customerEmail} ${orderData.customerPhone ? `& WhatsApp (${orderData.customerPhone})` : ''}</p>
          </div>

          <p>Sobald dein Song fertiggestellt und menschlich klanggeprüft ist, senden wir dir deine fertige MP3-Datei zu.</p>
          <p style="color: #64748b; font-size: 13px; margin-top: 30px;">Herzliche Grüße,<br>Dirk Schmetzer & dein Team von MyMusicMoment24</p>
        </div>
      `;

      try {
        await transporter.sendMail({
          from: `"MyMusicMoment24" <${smtpUser}>`,
          to: adminEmail,
          subject: `🎉 Neuer Song-Auftrag: ${orderData.transactionId} (${orderData.amount} €)`,
          html: adminHtml,
        });
        console.log(`✉️ Benachrichtigung an Admin gesendet (${adminEmail})`);

        if (orderData.customerEmail) {
          await transporter.sendMail({
            from: `"MyMusicMoment24" <${smtpUser}>`,
            to: orderData.customerEmail,
            subject: `Deine Song-Bestellung bei MyMusicMoment24 (#${orderData.transactionId})`,
            html: customerHtml,
          });
          console.log(`✉️ Bestellbestätigung an Kunde gesendet (${orderData.customerEmail})`);
        }
      } catch (mailErr) {
        console.error("⚠️ Fehler beim E-Mail-Versand:", mailErr.message);
      }
    } else {
      console.log("ℹ️ Hinweis: SMTP noch nicht konfiguriert (Auftrag sicher in data/orders.json gespeichert).");
    }

    res.json({ success: true, message: "Order recorded successfully", transactionId: orderData.transactionId });
  } catch (error) {
    console.error("Fehler beim Speichern der Bestellung:", error);
    res.status(500).json({ success: false, error: error.message });
  }
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
