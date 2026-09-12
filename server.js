import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import Stripe from "stripe";

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
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || smtpUser;
    
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

    try {
      await transporter.sendMail({
        from: `"MyMusicMoment24" <${smtpUser}>`,
        to: adminEmail,
        subject: adminSubject,
        html: adminHtml,
      });
      console.log(`✉️ Benachrichtigung an Admin gesendet (${adminEmail})`);

      if (orderData.customerEmail) {
        await transporter.sendMail({
          from: `"MyMusicMoment24" <${smtpUser}>`,
          to: orderData.customerEmail,
          subject: customerSubject,
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
}

// 1. Standard / PayPal Order Endpoint
app.post("/api/orders", async (req, res) => {
  try {
    const orderData = req.body;
    await processOrderAndSendEmails(orderData);
    res.json({ success: true, message: "Order recorded successfully", transactionId: orderData.transactionId });
  } catch (error) {
    console.error("Fehler beim Speichern der Bestellung:", error);
    res.status(500).json({ success: false, error: error.message });
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
            unit_amount: Math.round(Number(amount) * 100),
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
        category: isStreamingOrder ? "streaming" : "song",
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
