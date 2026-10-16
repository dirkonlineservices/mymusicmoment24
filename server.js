import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import Stripe from "stripe";
import matter from "gray-matter";
import { marked } from "marked";
import { translations } from "./src/i18n/translations.js";
import {
  SITE_URL, DEFAULT_IMAGE, NOT_FOUND_META, blogPostMeta, staticPageMeta,
} from "./src/lib/pageMeta.js";
import { orderKind, calculatePrice } from "./src/lib/pricing.js";

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
  "/kontakt-fur-personalisierte-songs": "/support",
  "/partner-fuer-songprojekt": "/#kontakt",
  "/b2b-dienstleistungen": "/#kontakt",
  "/faq-seite": "/#faq",
  "/ueber-uns-musikservice": "/autor-dirk-schmetzer",
  "/ueber-uns": "/autor-dirk-schmetzer",

  // Informational Blog Articles
  "/ki-musik-studien-trends-und-was-sie-fur-mymusicmoment24-bedeuten": "/ki-musik-studien-trends",
  "/echt-oder-ki-die-revolution-der-personalisierten-musik-or-mymusicmoment24de": "/ki-musik-revolution",
  "/10-tipps-fur-personalisierte-geschenkideen": "/10-tipps-fuer-personalisierte-geschenke",
  "/was-ist-ki-musik-chancen-und-risiken-fur-content-creator": "/was-ist-ki-musik",
  "/individuelle-hochzeitssongs-mit-ki-so-entsteht-euer-einzigartiger-liebessong": "/individueller-hochzeitssong",
  "/blog-post": "/individueller-hochzeitssong",
  "/ki-musik-blog": "/individueller-hochzeitssong",
  "/blog-geburtstagsgeschenke": "/10-tipps-fuer-personalisierte-geschenke",

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

  // Legacy Product & Occasion Redirects to real Landingpages
  "/geburtstagslieder": "/personalisierte-geburtstagslieder",
  "/personalisiertes-geburtstagslied": "/personalisierte-geburtstagslieder",
  "/geburtstagslied": "/personalisierte-geburtstagslieder",
  "/hochzeitslied": "/individuelle-hochzeitsgeschenke",
  "/hochzeitslieder": "/individuelle-hochzeitsgeschenke",
  "/geburtstagssong-bestellen": "/personalisierte-geburtstagslieder",
  "/individuelles-hochzeitslied": "/individuelle-hochzeitsgeschenke",
  "/individuelle-hochzeitssongs": "/individuelle-hochzeitsgeschenke",
  "/b2b-dienstleistungen": "/b2b",
  "/geschenk-gutschein": "/#shop",
  "/individueller-song-kaufen": "/personalisierte-lieder",
  "/musik-services": "/#shop",
  "/personalisiertes-geschenk": "/personalisierte-lieder",
  "/liebeslied-im-duett-2-sprachig-oder-2-stimmen": "/#shop",
  "/dein-partytrack-musikalische-uberraschung": "/#shop",
  "/individuelle-musik-zum-valentinstag-on-demand-kompositionen": "/#shop",
  "/emotionen-verschenken": "/#warum",
  "/kraft-der-musik": "/#warum",
  "/in-gedenken-an-sinnlose-opfer": "/#shop",
  "/niemals-knast-lieder": "/#shop"
};

// Middleware: 301 Redirect Handler
app.use((req, res, next) => {
  const reqPath = req.path;

  // Nur eine Domain-Variante: mymusicmoment24.de -> www.mymusicmoment24.de
  if (req.hostname === "mymusicmoment24.de") {
    return res.redirect(301, `https://www.mymusicmoment24.de${req.originalUrl}`);
  }

  // Blogartikel liegen direkt unter /slug (so kennt Google sie), /blog/slug leitet dorthin
  if (reqPath.startsWith("/blog/")) {
    const slug = reqPath.slice("/blog/".length).replace(/\/$/, "");
    if (BLOG_BY_SLUG.has(slug)) return res.redirect(301, `/${slug}`);
  }

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

// ---------------------------------------------------------------------------
// Preise & Zahlungsprüfung: Beträge werden nur hier berechnet, nie aus dem Browser übernommen
// ---------------------------------------------------------------------------

// Rabattcodes kommen aus der Umgebung (Hostinger), z. B. DISCOUNT_CODES=winter10,freunde10
function discountCodes() {
  const fromEnv = (process.env.DISCOUNT_CODES || "")
    .split(",")
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean);
  // Übergangsweise die bisherigen Codes, bis DISCOUNT_CODES gesetzt ist
  return fromEnv.length ? fromEnv : ["gutschein", "music10"];
}

function isValidDiscount(code) {
  return Boolean(code) && discountCodes().includes(String(code).trim().toLowerCase());
}

/** Erwarteter Preis für eine Bestellung, nur aus den Bestellmerkmalen berechnet */
function priceForOrder(body = {}) {
  const kind = orderKind({
    category: body.category,
    orderDetails: body.orderDetails,
    isStreaming: body.isStreaming,
  });
  const amount = calculatePrice({
    kind,
    express: Boolean(body.orderDetails?.express),
    certificate: Boolean(body.orderDetails?.pdfLyrics),
    discount: isValidDiscount(body.discountCode),
  });
  return { kind, amount };
}

function paypalConfig() {
  const clientId = process.env.PAYPAL_CLIENT_ID || process.env.VITE_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) return null;
  const base = process.env.PAYPAL_ENV === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
  return { clientId, secret, base };
}

async function paypalRequest(config, method, apiPath, body) {
  const tokenRes = await fetch(`${config.base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!tokenRes.ok) throw new Error(`PayPal-Anmeldung fehlgeschlagen (${tokenRes.status})`);
  const { access_token: token } = await tokenRes.json();

  const res = await fetch(`${config.base}${apiPath}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`PayPal-Fehler ${res.status}: ${data?.message || data?.name || "unbekannt"}`);
  return data;
}

// Shared Order Processor & Mail Dispatcher
async function processOrderAndSendEmails(orderData) {
  console.log(`\n🎉 [NEUE BESTELLUNG EINGEGANGEN]`);
  console.log(`Transaktion: ${orderData.transactionId || 'Unbekannt'} | Betrag: ${orderData.amount} € via ${orderData.paymentProvider}`);
  console.log(`Kunde: ${orderData.customerName} (${orderData.customerEmail}, Tel: ${orderData.customerPhone || 'Keine'})`);
  console.log(`Song-Details:`, orderData.orderDetails);
  console.log(`Wunschtext: ${orderData.songDetailsText}`);

  const isStreaming = 
    orderData.orderDetails?.occasion === "streaming-release" ||
    orderData.category === "streaming" ||
    (orderData.orderName && orderData.orderName.toLowerCase().includes("streaming"));

  const distroKidArtist = "MyMusicMoment24";
  const songTitle = orderData.orderDetails?.songTitle || orderData.songTitle || (orderData.orderName ? orderData.orderName.replace(/^.*?[:„"]\s*/, "").replace(/[“"]$/, "") : "Persönlicher Song");
  const genre = orderData.orderDetails?.genre || "Pop";
  const songLanguage = orderData.orderDetails?.language || "Deutsch";
  const isExplicit = orderData.orderDetails?.explicitLyrics ? "Ja (Explicit)" : "Nein (Clean)";
  const originalOrder = orderData.orderDetails?.originalOrderNumber || "Keine Angabe";
  const notes = orderData.orderDetails?.notes || orderData.songDetailsText || "Keine besonderen Wünsche";

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

  // Prevent duplicate storage
  if (!orders.some(o => o.transactionId === orderData.transactionId)) {
    const newOrder = {
      ...orderData,
      isStreaming: Boolean(isStreaming),
      receivedAt: new Date().toISOString(),
      status: "paid",
      distroKid: isStreaming ? {
        artist: distroKidArtist,
        songTitle,
        genre,
        language: songLanguage,
        explicit: isExplicit,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone || "",
        originalOrderNumber: originalOrder,
        notes,
        copySnippet: `=== DISTROKID UPLOAD-DATEN ===\nArtist: ${distroKidArtist}\nTitle: ${songTitle}\nGenre: ${genre}\nLanguage: ${songLanguage}\nExplicit: ${isExplicit}\nCustomer: ${orderData.customerName} (${orderData.customerEmail})\nOrder Ref: ${originalOrder}\nNotes: ${notes}\nTxID: ${orderData.transactionId}\n==============================`
      } : null,
    };
    orders.unshift(newOrder);
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), "utf8");
  }

  // Attempt E-Mail Dispatch if SMTP is configured
  const transporter = getMailTransporter();
  if (transporter) {
    const smtpUser = process.env.SMTP_USER || "info@mymusicmoment24.de";
    
    // Recipients for order notifications: both domain email and direct gmail
    const adminRecipients = ["info@mymusicmoment24.de", "dirk.online.services@gmail.com"];
    if (process.env.ADMIN_NOTIFICATION_EMAIL) {
      const customAdmins = process.env.ADMIN_NOTIFICATION_EMAIL.split(",").map(e => e.trim()).filter(Boolean);
      customAdmins.forEach(email => {
        if (!adminRecipients.includes(email)) adminRecipients.push(email);
      });
    }
    
    const isBankTransfer = orderData.paymentProvider === "bank_transfer";

    // 1. Email to Dirk / Admin
    let adminHtml = "";
    let adminSubject = "";

    if (isStreaming) {
      adminSubject = `🎧 Neuer DistroKid-Upload: „${songTitle}“ (${orderData.amount} €) - ${orderData.customerName}`;
      adminHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 650px; margin: 0 auto; color: #1e293b; background: #ffffff; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; padding: 18px 20px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 20px; color: #ffffff;">🎧 Neuer DistroKid Streaming-Auftrag!</h2>
            <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.95;">Spotify, Apple Music, YouTube Music, Amazon & Co. • 4,99 € Festpreis</p>
          </div>

          <p style="font-size: 15px;"><strong>Bestellnummer / TxID:</strong> <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${orderData.transactionId}</code></p>
          <p style="font-size: 15px;"><strong>Bezahlter Betrag:</strong> <span style="font-size: 18px; font-weight: bold; color: #059669;">${orderData.amount} €</span> via ${orderData.paymentProvider === 'paypal' ? 'PayPal Express' : 'Kreditkarte / Online-Zahlung (Stripe)'}</p>

          <!-- Prominente DistroKid-Upload-Box -->
          <div style="background: #f0fdf4; border: 2px solid #10b981; border-radius: 10px; padding: 18px; margin: 24px 0;">
            <h3 style="color: #065f46; margin: 0 0 14px; font-size: 16px;">
              🎵 DISTROKID UPLOAD-DATEN (Zum Übertragen in DistroKid):
            </h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.6;">
              <tr>
                <td style="padding: 6px 0; color: #047857; font-weight: bold; width: 170px;">Artist / Künstlername:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #0f172a; font-size: 15px;">${distroKidArtist}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #047857; font-weight: bold;">Songtitel:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #059669; font-size: 16px;">${songTitle}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #047857; font-weight: bold;">Primary Genre:</td>
                <td style="padding: 6px 0; color: #0f172a;">${genre}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #047857; font-weight: bold;">Track-Sprache:</td>
                <td style="padding: 6px 0; color: #0f172a;">${songLanguage}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #047857; font-weight: bold;">Explizite Lyrics?</td>
                <td style="padding: 6px 0; color: #0f172a;">${isExplicit}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #047857; font-weight: bold;">Kunde (Besteller):</td>
                <td style="padding: 6px 0; color: #0f172a;"><strong>${orderData.customerName || 'Unbekannt'}</strong> (<a href="mailto:${orderData.customerEmail}">${orderData.customerEmail}</a>${orderData.customerPhone ? `, Tel/WhatsApp: ${orderData.customerPhone}` : ''})</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #047857; font-weight: bold;">Ursprungs-Auftrag:</td>
                <td style="padding: 6px 0; color: #0f172a;">${originalOrder}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #047857; font-weight: bold;">Anmerkungen / Cover:</td>
                <td style="padding: 6px 0; color: #0f172a;">${notes}</td>
              </tr>
            </table>

            <div style="margin-top: 16px; background: #ffffff; border: 1px dashed #10b981; border-radius: 8px; padding: 12px;">
              <p style="margin: 0 0 6px; font-size: 12px; font-weight: bold; color: #047857; text-transform: uppercase;">
                📋 Direkt zum Rauskopieren für DistroKid:
              </p>
              <pre style="margin: 0; font-family: monospace; font-size: 13px; color: #0f172a; white-space: pre-wrap; background: #f8fafc; padding: 10px; border-radius: 6px;">Artist: ${distroKidArtist}
Song Title: ${songTitle}
Genre: ${genre}
Language: ${songLanguage}
Explicit: ${isExplicit}
Customer: ${orderData.customerName} (${orderData.customerEmail})
Ref: ${originalOrder}
Notes: ${notes}</pre>
            </div>
          </div>

          <p style="color: #64748b; font-size: 13px;">Dieser Auftrag wurde über die Streaming-Sonderseite gebucht und bezahlt.</p>
        </div>
      `;
    } else if (isBankTransfer) {
      adminSubject = `🏦 Neue Überweisungs-Bestellung (Vorkasse): ${orderData.transactionId} (${orderData.amount} €) - ${orderData.customerName || 'Kunde'}`;
      adminHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
          <h2 style="color: #059669; border-bottom: 2px solid #10b981; padding-bottom: 8px;">🏦 Neue Bestellung per Banküberweisung (Vorkasse)!</h2>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 14px; border-radius: 8px; margin: 15px 0; color: #92400e;">
            <strong>⏳ STATUS: WARTEN AUF GELDEINGANG</strong><br>
            Der Kunde hat per Überweisung bestellt. Die Song-Produktion beginnt erst nach Zahlungseingang auf dem ING DiBa Konto!
          </div>

          <p><strong>Bestellnummer / Verwendungszweck:</strong> <code style="background: #f1f5f9; padding: 3px 8px; border-radius: 4px; font-size: 15px; font-weight: bold;">${orderData.transactionId}</code></p>
          <p><strong>Zu überweisender Betrag:</strong> <span style="font-size: 16px; font-weight: bold; color: #059669;">${orderData.amount} €</span></p>
          <p><strong>Bank:</strong> ING DiBa • IBAN: DE92 5001 0517 5431 9731 25</p>
          
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
          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; border-left: 4px solid #059669; white-space: pre-wrap;">
  ${orderData.songDetailsText || 'Keine zusätzlichen Anmerkungen.'}
          </div>
        </div>
      `;
    } else {
      adminSubject = `🎉 Neuer Song-Auftrag: ${orderData.transactionId} (${orderData.amount} €)`;
      adminHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
          <h2 style="color: #d97706; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">🎉 Neuer bezahlter Song-Auftrag!</h2>
          <p><strong>Bestellnummer:</strong> ${orderData.transactionId}</p>
          <p><strong>Betrag bezahlt:</strong> ${orderData.amount} € via ${orderData.paymentProvider === 'paypal' ? 'PayPal' : orderData.paymentProvider === 'stripe' ? 'Kreditkarte / Online-Zahlung' : (orderData.paymentProvider || 'Online-Zahlung')}</p>
          
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
    }

    // 2. Email to Customer
    let customerHtml = "";
    let customerSubject = "";

    if (isStreaming) {
      customerSubject = `Bestätigung: Dein Song „${songTitle}“ wird auf Spotify & Co. veröffentlicht! 🎧`;
      customerHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
          <h2 style="color: #059669;">Dein Song kommt auf Spotify & Streaming-Dienste! 🎧</h2>
          <p>Hallo ${orderData.customerName || 'Musikfreund'},</p>
          <p>vielen Dank für deinen Auftrag! Deine Zahlung über <strong>${orderData.amount} €</strong> ist erfolgreich bei uns eingegangen.</p>
          
          <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 16px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 0 0 8px;"><strong>Songtitel auf Streaming:</strong> ${songTitle}</p>
            <p style="margin: 0 0 8px;"><strong>Künstlerprofil:</strong> MyMusicMoment24</p>
            <p style="margin: 0 0 8px;"><strong>Plattformen:</strong> Spotify, Apple Music, YouTube Music, Amazon Music, Deezer, TikTok & Instagram</p>
            <p style="margin: 0;"><strong>Bestellnummer:</strong> ${orderData.transactionId}</p>
          </div>

          <h3 style="color: #0f172a; margin-top: 24px;">Wie geht es jetzt weiter?</h3>
          <ol style="line-height: 1.7; color: #334155;">
            <li><strong>Cover-Artwork:</strong> Wir erstellen das hochauflösende 3000x3000px Cover für deinen Song.</li>
            <li><strong>DistroKid-Übermittlung:</strong> Dein Song wird mit ISRC-Codes an alle weltweiten Streaming-Plattformen übergeben.</li>
            <li><strong>Freischaltung (ca. 2–5 Werktage):</strong> Die Streaming-Dienste (Spotify, Apple etc.) prüfen und aktivieren deinen Titel.</li>
            <li><strong>Dein Link:</strong> Sobald der Song live ist, senden wir dir deinen offiziellen Spotify-Link per E-Mail an <strong>${orderData.customerEmail}</strong>!</li>
          </ol>

          <p style="color: #64748b; font-size: 13px; margin-top: 30px;">Herzliche Grüße,<br>Dirk Schmetzer & dein Team von MyMusicMoment24</p>
        </div>
      `;
    } else if (isBankTransfer) {
      customerSubject = `Deine Song-Bestellung (#${orderData.transactionId}) – Überweisungsdaten (Vorkasse)`;
      customerHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
          <h2 style="color: #059669;">Vielen Dank für deine Song-Bestellung! 🎵</h2>
          <p>Hallo ${orderData.customerName || 'Musikfreund'},</p>
          <p>wir haben deine Bestellung dankend erhalten. Bitte überweise den Betrag von <strong>${orderData.amount} €</strong> per Banküberweisung an folgende Bankverbindung:</p>
          
          <div style="background: #f0fdf4; border: 2px solid #10b981; padding: 18px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 0 0 10px; font-weight: bold; color: #065f46; font-size: 15px;">🏦 Bankverbindung für deine Überweisung:</p>
            <p style="margin: 0 0 6px;"><strong>Verwendungszweck (WICHTIG):</strong> <code style="background: #fff; padding: 3px 8px; border-radius: 4px; font-size: 14px; font-weight: bold; color: #047857;">${orderData.transactionId}</code></p>
            <p style="margin: 0 0 6px;"><strong>Zu überweisender Betrag:</strong> <span style="font-size: 15px; font-weight: bold; color: #059669;">${orderData.amount} €</span></p>
            <p style="margin: 0 0 6px;"><strong>Empfänger:</strong> Dirk Schmetzer</p>
            <p style="margin: 0 0 6px;"><strong>Bank:</strong> ING DiBa</p>
            <p style="margin: 0 0 6px;"><strong>IBAN:</strong> <code style="background: #fff; padding: 3px 8px; border-radius: 4px; font-size: 14px; font-weight: bold;">DE92 5001 0517 5431 9731 25</code></p>
            <p style="margin: 0;"><strong>BIC:</strong> INGDDEFFXXX</p>
          </div>

          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 14px; border-radius: 8px; margin: 20px 0; font-size: 13px; color: #92400e;">
            ⏳ <strong>Wichtiger Hinweis zum Produktionsstart:</strong><br>
            Die Erstellung deines individuellen Songs beginnt unmittelbar nach Geldeingang auf unserem Bankkonto (in der Regel 1 Werktag).
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 8px;"><strong>Bestell-Nr:</strong> ${orderData.transactionId}</p>
            <p style="margin: 0 0 8px;"><strong>Bestelltes Produkt:</strong> ${orderData.orderName || 'Persönlicher Song'}</p>
            <p style="margin: 0;"><strong>Zustellung nach Fertigstellung an:</strong> ${orderData.customerEmail} ${orderData.customerPhone ? `& WhatsApp (${orderData.customerPhone})` : ''}</p>
          </div>

          <p>Sobald deine Zahlung eingegangen ist, erhältst du eine kurze Bestätigung und wir legen mit der Komposition deines Wunschliedes los.</p>
          <p style="color: #64748b; font-size: 13px; margin-top: 30px;">Herzliche Grüße,<br>Dirk Schmetzer & dein Team von MyMusicMoment24</p>
        </div>
      `;
    } else {
      customerSubject = `Deine Song-Bestellung bei MyMusicMoment24 (#${orderData.transactionId})`;
      customerHtml = `
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
    }

    if (orderData.paymentCheck) {
      adminSubject = `${orderData.paymentCheck.subjectPrefix} ${adminSubject}`;
      adminHtml = `<div style="font-family: sans-serif; max-width: 650px; margin: 0 auto 12px; padding: 14px 18px; border-radius: 10px; background: ${orderData.paymentCheck.color}; color: #1e293b; font-size: 14px;"><strong>${orderData.paymentCheck.title}</strong><br>${orderData.paymentCheck.text}</div>` + adminHtml;
    }

    try {
      await transporter.sendMail({
        from: `"MyMusicMoment24" <${smtpUser}>`,
        to: adminRecipients,
        subject: adminSubject,
        html: adminHtml,
      });
      console.log(`✉️ Benachrichtigung an Admin gesendet (${adminRecipients.join(", ")})`);

      if (orderData.customerEmail) {
        await transporter.sendMail({
          from: `"MyMusicMoment24" <${smtpUser}>`,
          to: orderData.customerEmail,
          bcc: "dirk.online.services@gmail.com",
          subject: customerSubject,
          html: customerHtml,
        });
        console.log(`✉️ Bestellbestätigung an Kunde gesendet (${orderData.customerEmail}, BCC: dirk.online.services@gmail.com)`);
      }
    } catch (mailErr) {
      console.error("⚠️ Fehler beim E-Mail-Versand:", mailErr.message);
    }
  } else {
    console.log("ℹ️ Hinweis: SMTP noch nicht konfiguriert (Auftrag sicher in data/orders.json gespeichert).");
  }
}

// 0. B2B & Cooperation Inquiry Endpoint
app.post("/api/b2b-inquiry", async (req, res) => {
  try {
    const { contactName, companyName, email, phone, inquiryType, message } = req.body;

    if (!contactName || !companyName || !email || !message) {
      return res.status(400).json({ success: false, error: "Pflichtfelder fehlen (Name, Firma, E-Mail, Nachricht)." });
    }

    const inquiryData = {
      id: `b2b-${Date.now()}`,
      createdAt: new Date().toISOString(),
      contactName,
      companyName,
      email,
      phone: phone || "Keine Angabe",
      inquiryType: inquiryType || "B2B Kooperation",
      message,
    };

    console.log(`\n💼 [NEUE B2B-KOOPERATIONSANFRAGE EINGEGANGEN]`);
    console.log(`Firma: ${companyName} | Ansprechpartner: ${contactName} | Typ: ${inquiryType}`);
    console.log(`Kontakt: ${email}, Tel: ${phone || 'Keine'}`);

    // Persist in data/b2b_inquiries.json
    const dataDir = path.join(__dirname, "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const inquiriesFile = path.join(dataDir, "b2b_inquiries.json");
    let inquiries = [];
    if (fs.existsSync(inquiriesFile)) {
      try {
        inquiries = JSON.parse(fs.readFileSync(inquiriesFile, "utf8"));
      } catch (err) {
        inquiries = [];
      }
    }
    inquiries.push(inquiryData);
    fs.writeFileSync(inquiriesFile, JSON.stringify(inquiries, null, 2), "utf8");

    // Email dispatch
    const transporter = getMailTransporter();
    if (transporter) {
      const smtpUser = process.env.SMTP_USER || "info@mymusicmoment24.de";
      const adminRecipients = ["info@mymusicmoment24.de", "dirk.online.services@gmail.com"];

      const adminHtml = `
        <div style="font-family: sans-serif; max-width: 650px; margin: 0 auto; color: #1e293b;">
          <div style="background: #1e1b4b; padding: 20px; border-radius: 10px; color: #fff; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #f59e0b;">💼 Neue B2B-Kooperationsanfrage eingegangen!</h2>
            <p style="margin: 5px 0 0; font-size: 14px; color: #cbd5e1;">MyMusicMoment24 • DS Online Services</p>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 12px; color: #334155; font-size: 16px;">Kontaktdaten:</h3>
            <p style="margin: 0 0 6px;"><strong>Ansprechpartner:</strong> ${contactName}</p>
            <p style="margin: 0 0 6px;"><strong>Unternehmen / Agentur:</strong> <span style="color: #4f46e5; font-weight: bold;">${companyName}</span></p>
            <p style="margin: 0 0 6px;"><strong>E-Mail:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 0;"><strong>Telefon / WhatsApp:</strong> ${phone || "Nicht angegeben"}</p>
          </div>

          <div style="background: #fefce8; border: 1px solid #fef08a; padding: 18px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px; color: #854d0e; font-size: 15px;">Gewünschte Kooperationsart:</h3>
            <p style="margin: 0; font-size: 15px; font-weight: bold; color: #a16207;">${inquiryType}</p>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 10px; color: #334155; font-size: 15px;">Projektbeschreibung & Nachricht:</h3>
            <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #1e293b;">${message}</div>
          </div>

          <div style="font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; pt: 15px;">
            Eingegangen am ${new Date().toLocaleString("de-DE")} • Referenz: ${inquiryData.id}
          </div>
        </div>
      `;

      const customerHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
          <h2 style="color: #f59e0b;">Vielen Dank für Ihre Kooperationsanfrage! 🎵</h2>
          <p>Hallo ${contactName},</p>
          <p>wir haben Ihre Anfrage für <strong>${companyName}</strong> bezüglich <em>„${inquiryType}“</em> erfolgreich erhalten.</p>
          <p>Dirk Schmetzer wird Ihre Projektdetails persönlich prüfen und sich innerhalb von <strong>24 Stunden</strong> mit einem passenden Vorschlag bei Ihnen melden.</p>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 13px;">
            <p style="margin: 0 0 6px;"><strong>Ihre Anfrage-Referenz:</strong> ${inquiryData.id}</p>
            <p style="margin: 0 0 6px;"><strong>Kooperationsbereich:</strong> ${inquiryType}</p>
            <p style="margin: 0;"><strong>Direktkontakt bei dringenden Fragen:</strong> WhatsApp 01590 6122744 oder <a href="mailto:info@mymusicmoment24.de">info@mymusicmoment24.de</a></p>
          </div>

          <p style="color: #64748b; font-size: 13px; margin-top: 30px;">
            Herzliche Grüße,<br>
            <strong>Dirk Schmetzer</strong><br>
            MyMusicMoment24 • DS Online Services (SichtbarmitKI.agency)<br>
            Stuttgart, Deutschland
          </p>
        </div>
      `;

      try {
        await transporter.sendMail({
          from: `"MyMusicMoment24 B2B" <${smtpUser}>`,
          to: adminRecipients,
          subject: `💼 Neue B2B-Kooperationsanfrage: ${companyName} (${contactName})`,
          html: adminHtml,
        });
        console.log(`✉️ B2B-Admin-Benachrichtigung gesendet (${adminRecipients.join(", ")})`);

        await transporter.sendMail({
          from: `"Dirk Schmetzer | MyMusicMoment24" <${smtpUser}>`,
          to: email,
          bcc: "dirk.online.services@gmail.com",
          subject: `Ihre Kooperationsanfrage bei MyMusicMoment24 (${companyName})`,
          html: customerHtml,
        });
        console.log(`✉️ B2B-Bestätigung an Interessent gesendet (${email})`);
      } catch (mailErr) {
        console.error("⚠️ Fehler beim B2B-Mailversand:", mailErr.message);
      }
    }

    res.json({ success: true, message: "Kooperationsanfrage erfolgreich übermittelt." });
  } catch (error) {
    console.error("Fehler bei B2B-Anfrage:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 1. Standard / PayPal Order Endpoint
app.post("/api/orders", async (req, res) => {
  try {
    const body = req.body || {};
    const provider = body.paymentProvider;

    // Mit hinterlegtem PayPal-Secret laufen PayPal-Zahlungen nur über /api/paypal/capture-order
    if (provider === "paypal" && paypalConfig()) {
      return res.status(400).json({ success: false, error: "PayPal-Zahlungen werden serverseitig bestätigt." });
    }
    if (provider !== "paypal" && provider !== "bank_transfer") {
      return res.status(400).json({ success: false, error: "Unbekannte Zahlungsart." });
    }

    const { kind, amount } = priceForOrder(body);
    const orderData = {
      ...body,
      category: kind === "song" ? body.category || "song" : kind,
      amount: amount.toFixed(2),
      paymentCheck: provider === "bank_transfer"
        ? {
            subjectPrefix: "[VORKASSE OFFEN]",
            color: "#fef3c7",
            title: "Banküberweisung – Zahlung noch nicht eingegangen",
            text: `Erwarteter Betrag: ${amount.toFixed(2)} €. Erst nach Geldeingang produzieren.`,
          }
        : {
            subjectPrefix: "[⚠️ UNGEPRÜFT]",
            color: "#fee2e2",
            title: "PayPal-Zahlung nicht serverseitig geprüft",
            text: `Bitte im PayPal-Konto kontrollieren, ob ${amount.toFixed(2)} € unter Transaktion ${body.transactionId || "?"} eingegangen sind. Abhilfe: PAYPAL_CLIENT_SECRET bei Hostinger hinterlegen.`,
          },
    };
    await processOrderAndSendEmails(orderData);
    res.json({ success: true, message: "Order recorded successfully", transactionId: orderData.transactionId });
  } catch (error) {
    console.error("Fehler beim Speichern der Bestellung:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Rabattcode prüfen, ohne die gültigen Codes an den Browser zu geben
app.post("/api/validate-discount", (req, res) => {
  res.json({ valid: isValidDiscount(req.body?.code) });
});

// PayPal: Zahlung mit serverseitig berechnetem Betrag anlegen
app.post("/api/paypal/create-order", async (req, res) => {
  const config = paypalConfig();
  if (!config) return res.status(503).json({ fallback: true });
  try {
    const { amount } = priceForOrder(req.body);
    const order = await paypalRequest(config, "POST", "/v2/checkout/orders", {
      intent: "CAPTURE",
      purchase_units: [
        {
          description: String(req.body?.orderName || "Personalisierter Song").substring(0, 120),
          amount: { currency_code: "EUR", value: amount.toFixed(2) },
        },
      ],
    });
    res.json({ id: order.id });
  } catch (error) {
    console.error("PayPal create-order:", error.message);
    res.status(500).json({ error: "PayPal-Zahlung konnte nicht angelegt werden." });
  }
});

// PayPal: Zahlung bei PayPal abschließen, Betrag prüfen, erst dann Bestellung verbuchen
app.post("/api/paypal/capture-order", async (req, res) => {
  const config = paypalConfig();
  if (!config) return res.status(503).json({ fallback: true });
  try {
    const { orderID, ...body } = req.body || {};
    if (!orderID) return res.status(400).json({ error: "Fehlende PayPal-Order-ID." });

    const capture = await paypalRequest(config, "POST", `/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`);
    const captured = capture?.purchase_units?.[0]?.payments?.captures?.[0];
    const { kind, amount } = priceForOrder(body);

    if (capture.status !== "COMPLETED" || !captured
        || captured.amount?.currency_code !== "EUR"
        || Number(captured.amount?.value) !== amount) {
      console.error(`⚠️ PayPal-Prüfung fehlgeschlagen: Order ${orderID}, Status ${capture.status}, erhalten ${captured?.amount?.value}, erwartet ${amount}`);
      return res.status(400).json({ error: "Zahlung konnte nicht bestätigt werden." });
    }

    const orderData = {
      ...body,
      transactionId: captured.id || orderID,
      paymentProvider: "paypal",
      category: kind === "song" ? body.category || "song" : kind,
      amount: amount.toFixed(2),
      payer: capture.payer,
    };
    await processOrderAndSendEmails(orderData);
    res.json({ success: true, transactionId: orderData.transactionId, amount: orderData.amount });
  } catch (error) {
    console.error("PayPal capture-order:", error.message);
    res.status(500).json({ error: "Zahlung konnte nicht abgeschlossen werden." });
  }
});

// 2. Stripe: Create Checkout Session Endpoint
app.post("/api/create-stripe-checkout", async (req, res) => {
  try {
    const { 
      amount, 
      customerEmail, 
      customerName, 
      customerPhone, 
      songDetailsText, 
      orderDetails, 
      orderName,
      successUrl,
      cancelUrl,
      isStreaming
    } = req.body;

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return res.status(400).json({ error: "Stripe Secret Key ist noch nicht in .env hinterlegt." });
    }

    const stripe = new Stripe(stripeKey);
    const origin = req.headers.origin || "http://localhost:3000";

    const defaultSuccess = `${origin}/?session_id={CHECKOUT_SESSION_ID}&stripe_success=true`;
    const defaultCancel = `${origin}/?stripe_cancel=true`;

    const isStreamingOrder = isStreaming || orderDetails?.occasion === "streaming-release";
    // Betrag nur serverseitig berechnen; "amount" aus dem Browser wird ignoriert
    const { kind, amount: serverAmount } = priceForOrder(req.body);

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: orderName || (isStreamingOrder ? "Spotify & Streaming-Release (MyMusicMoment24)" : "Personalisierter Song"),
              description: isStreamingOrder 
                ? `Release auf Spotify, Apple Music, YouTube Music & Co. unter MyMusicMoment24 (${orderDetails?.songTitle || 'Individueller Titel'})`
                : (orderDetails?.genre ? `${orderDetails.genre} • ${orderDetails.voice || 'Gesang'}` : "Dein individueller Song"),
            },
            unit_amount: Math.round(serverAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: customerEmail,
      metadata: {
        customerName: customerName || "",
        customerPhone: customerPhone || "",
        songDetailsText: (songDetailsText || "").substring(0, 450),
        occasion: orderDetails?.occasion || "",
        genre: orderDetails?.genre || "",
        voice: orderDetails?.voice || "",
        express: orderDetails?.express ? "true" : "false",
        pdfLyrics: orderDetails?.pdfLyrics ? "true" : "false",
        isStreaming: isStreamingOrder ? "true" : "false",
        kind,
        songTitle: (orderDetails?.songTitle || "").substring(0, 200),
        language: orderDetails?.language || "Deutsch",
        explicitLyrics: orderDetails?.explicitLyrics ? "true" : "false",
        originalOrderNumber: (orderDetails?.originalOrderNumber || "").substring(0, 100),
        notes: (orderDetails?.notes || "").substring(0, 300),
        orderName: (orderName || "").substring(0, 200),
      },
      success_url: successUrl || defaultSuccess,
      cancel_url: cancelUrl || defaultCancel,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Fehler bei Stripe Checkout Session:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Stripe: Verify Completed Session on Return
app.post("/api/verify-stripe-session", async (req, res) => {
  try {
    const { sessionId } = req.body;
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || !sessionId) {
      return res.status(400).json({ error: "Fehlende Session-ID oder Stripe Key." });
    }

    const stripe = new Stripe(stripeKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const metadata = session.metadata || {};
      const isStreamingOrder = metadata.isStreaming === "true" || metadata.occasion === "streaming-release";

      const orderData = {
        transactionId: session.id,
        paymentProvider: "stripe",
        amount: (session.amount_total / 100).toFixed(2),
        customerName: metadata.customerName || session.customer_details?.name || "",
        customerEmail: session.customer_details?.email || session.customer_email || "",
        customerPhone: metadata.customerPhone || "",
        songDetailsText: metadata.songDetailsText || metadata.notes || "",
        category: isStreamingOrder ? "streaming" : metadata.kind === "gutschein" ? "gutschein" : "song",
        orderDetails: {
          occasion: metadata.occasion,
          genre: metadata.genre,
          voice: metadata.voice,
          express: metadata.express === "true",
          pdfLyrics: metadata.pdfLyrics === "true",
          songTitle: metadata.songTitle || "",
          language: metadata.language || "Deutsch",
          explicitLyrics: metadata.explicitLyrics === "true",
          originalOrderNumber: metadata.originalOrderNumber || "",
          notes: metadata.notes || "",
        },
        orderName: metadata.orderName || (isStreamingOrder ? `Spotify & Streaming-Release: „${metadata.songTitle || 'Song'}“` : "Personalisierter Song"),
      };

      await processOrderAndSendEmails(orderData);
      return res.json({ success: true, order: orderData });
    } else {
      return res.json({ success: false, status: session.payment_status });
    }
  } catch (error) {
    console.error("Fehler beim Verifizieren der Stripe-Session:", error);
    res.status(500).json({ error: error.message });
  }
});

// Serve public directory with 30-day cache for media
app.use(express.static(path.join(__dirname, "public"), {
  maxAge: "30d",
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".html") || filePath.endsWith(".xml")) {
      res.setHeader("Cache-Control", "public, max-age=3600");
    }
  }
}));

// ---------------------------------------------------------------------------
// SEO: pro Adresse eigener Titel, Beschreibung, Canonical und lesbarer Inhalt
// im HTML, damit Google & KI-Suchen die Seite auch ohne JavaScript verstehen.
// Die App ersetzt den Inhalt von #root beim Laden komplett.
// ---------------------------------------------------------------------------

const BLOG_DIR = path.join(__dirname, "content", "blog");

function loadBlogPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(BLOG_DIR, file), "utf8"));
      const slug = data.slug || file.replace(/\.md$/, "");
      // Doppelte H1 am Anfang entfernen (wird separat ausgegeben)
      const body = content.replace(/^\s*#\s+[^\r\n]+\r?\n+/, "");
      return { ...data, slug, html: marked.parse(body) };
    });
}

const BLOG_POSTS = loadBlogPosts();
const BLOG_BY_SLUG = new Map(BLOG_POSTS.map((p) => [p.slug, p]));

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function findBlogPost(cleanPath) {
  return BLOG_BY_SLUG.get(cleanPath.slice(1)) || null;
}

function blogLinksHtml() {
  return BLOG_POSTS
    .map((p) => `<li><a href="/${escapeHtml(p.slug)}">${escapeHtml(p.title)}</a></li>`)
    .join("");
}

function renderHomeShell(html) {
  const de = translations.de;
  const faq = (de.faq.items || [])
    .map((item) => `<h3>${escapeHtml(item.q)}</h3><p>${escapeHtml(item.a)}</p>`)
    .join("");
  const occasions = Object.values(de.home.occasions)
    .map((o) => `<li><strong>${escapeHtml(o.label)}</strong> – ${escapeHtml(o.desc)}</li>`)
    .join("");
  const steps = de.home.steps
    .map((s) => `<li><strong>${escapeHtml(s.title)}:</strong> ${escapeHtml(s.desc)}</li>`)
    .join("");
  const included = de.home.priceIncluded.map((i) => `<li>${escapeHtml(i)}</li>`).join("");
  const seoContent = `
        <section class="max-w-3xl mx-auto px-4 pb-16 text-stone-700 space-y-4">
          <h2>${escapeHtml(de.home.occasionsTitle)}</h2><ul>${occasions}</ul>
          <h2>${escapeHtml(de.home.stepsTitle)}</h2><ol>${steps}</ol>
          <h2>${escapeHtml(de.home.priceTitle)}</h2><ul>${included}</ul>
          <h2>${escapeHtml(de.faq.title)}</h2>${faq}
          <h2>Ratgeber</h2><ul>${blogLinksHtml()}</ul>
        </section>`;
  return html.replace("<!--seo-content-->", seoContent);
}

function renderBlogShell(html, post) {
  const article = `
      <div class="min-h-screen bg-[#faf8f5] text-stone-900">
        <article class="max-w-3xl mx-auto px-4 py-10 blog-content">
          <p><a href="/">MyMusicMoment24</a> › Ratgeber</p>
          <h1>${escapeHtml(post.title)}</h1>
          ${post.author ? `<p>Von ${escapeHtml(post.author)}${post.dateModified || post.date ? ` · Aktualisiert am ${escapeHtml(post.dateModified || post.date)}` : ""}</p>` : ""}
          ${post.html}
          <p><a href="/#konfigurator">Jetzt persönlichen Song gestalten – 19,99 €</a></p>
          <h2>Weitere Ratgeber</h2><ul>${blogLinksHtml()}</ul>
        </article>
      </div>`;
  return html.replace(/<!--app-shell-start-->[\s\S]*<!--app-shell-end-->/, article);
}

function renderPageShell(html, meta) {
  const shell = `
      <div class="min-h-screen bg-[#faf8f5] text-stone-900">
        <main class="max-w-3xl mx-auto px-4 py-10">
          <h1>${escapeHtml(meta.title.replace(/\s*\|\s*MyMusicMoment24$/, ""))}</h1>
          <p>${escapeHtml(meta.description)}</p>
          <p><a href="/">Zur Startseite</a></p>
        </main>
      </div>`;
  return html.replace(/<!--app-shell-start-->[\s\S]*<!--app-shell-end-->/, shell);
}

function setMeta(html, meta) {
  const url = `${SITE_URL}${meta.canonicalPath === "/" ? "/" : meta.canonicalPath}`;
  const image = meta.image.startsWith("http") ? meta.image : `${SITE_URL}${meta.image}`;
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const swaps = [
    [/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`],
    [/<meta name="description" content="[^"]*"\s*\/?>/i, `<meta name="description" content="${description}" />`],
    [/<link rel="canonical" href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${url}" />`],
    [/<meta property="og:url" content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${url}" />`],
    [/<meta property="og:type" content="[^"]*"\s*\/?>/i, `<meta property="og:type" content="${meta.type}" />`],
    [/<meta property="og:title" content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${title}" />`],
    [/<meta property="og:description" content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${description}" />`],
    [/<meta property="og:image" content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${image}" />`],
    [/<meta name="twitter:title" content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${title}" />`],
    [/<meta name="twitter:description" content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${description}" />`],
    [/<meta name="twitter:image" content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${image}" />`],
  ];
  for (const [pattern, replacement] of swaps) html = html.replace(pattern, replacement);
  if (meta.noindex) {
    html = html.replace(/<meta name="robots" content="[^"]*"\s*\/?>/i, `<meta name="robots" content="noindex, follow" />`);
  }
  return html;
}

function serveHtmlWithCanonical(req, res, htmlPath) {
  if (!fs.existsSync(htmlPath)) {
    return res.status(404).send("Build or index.html not found. Please run 'npm run build' first.");
  }
  let html = fs.readFileSync(htmlPath, "utf8");
  const cleanPath = req.path === "/" ? "/" : req.path.replace(/\/$/, "");

  const post = findBlogPost(cleanPath);
  let meta;
  let status = 200;

  if (post) {
    meta = blogPostMeta(post);
    html = renderBlogShell(html, post);
  } else if ((meta = staticPageMeta(cleanPath))) {
    html = cleanPath === "/" ? renderHomeShell(html) : renderPageShell(html, meta);
  } else {
    // Unbekannte Adresse: echte 404 statt Startseite mit Status 200
    status = 404;
    meta = { ...NOT_FOUND_META, image: DEFAULT_IMAGE, canonicalPath: cleanPath, type: "website", noindex: true };
    html = renderHomeShell(html);
  }

  html = setMeta(html, meta);
  res.setHeader("Cache-Control", "no-cache, must-revalidate");
  res.status(status).send(html);
}

// Check if dist folder exists (production build)
const distDir = path.join(__dirname, "dist");
if (fs.existsSync(distDir)) {
  // Static hashed assets (/assets/...) cached for 1 year immutable
  app.use("/assets", express.static(path.join(distDir, "assets"), {
    maxAge: "1y",
    immutable: true
  }));
  app.use(express.static(distDir, {
    index: false,
    maxAge: "30d"
  }));
  app.get("*", (req, res) => {
    serveHtmlWithCanonical(req, res, path.join(distDir, "index.html"));
  });
} else {
  // In development / preview without dist build
  app.get("*", (req, res) => {
    serveHtmlWithCanonical(req, res, path.join(__dirname, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`\n🎵 MyMusicMoment24 Server läuft auf http://localhost:${PORT}`);
  console.log(`📑 301-Redirect-Map aktiv (${Object.keys(REDIRECT_MAP).length} Routen konfiguriert)`);
});
