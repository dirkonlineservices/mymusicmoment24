import React from "react";
import { ArrowLeft, ShieldCheck, Scale, FileText, Mail, MapPin, ExternalLink, Music, Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

const LEGAL_PLACEHOLDER = "[RECHTSTEXT HIER EINFÜGEN – aus eRecht24 / IT-Recht Kanzlei / Händlerbund]";

const PAGES = {
  impressum: {
    badge: "Rechtliche Anbieterkennzeichnung",
    title: "Impressum",
    intro: "Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG) und § 18 Abs. 2 MStV.",
    tab: "Impressum (§ 5 DDG)",
  },
  datenschutz: {
    badge: "Datenschutz & Privatsphäre",
    title: "Datenschutzerklärung",
    intro: "Informationen über die Verarbeitung Ihrer personenbezogenen Daten gemäß DSGVO.",
    tab: "Datenschutzerklärung (DSGVO)",
  },
  agb: {
    badge: "Vertragsbedingungen",
    title: "Allgemeine Geschäftsbedingungen (AGB)",
    intro: "Allgemeine Geschäftsbedingungen für Bestellungen bei MyMusicMoment24.",
    tab: "AGB",
  },
  widerruf: {
    badge: "Verbraucherrechte",
    title: "Widerrufsbelehrung",
    intro: "Informationen zum Widerrufsrecht für Verbraucher.",
    tab: "Widerrufsbelehrung",
  },
};

const LEGAL_PLACEHOLDER_EN = "[ENGLISCHEN RECHTSTEXT HIER EINFÜGEN – oder Hinweis, dass nur die deutsche Fassung gilt]";

const PAGES_EN = {
  impressum: {
    badge: "Provider identification",
    title: "Legal Notice",
    intro: "Information pursuant to § 5 of the German Digital Services Act (DDG) and § 18 (2) MStV.",
    tab: "Legal Notice",
  },
  datenschutz: {
    badge: "Data protection & privacy",
    title: "Privacy Policy",
    intro: "Information on the processing of your personal data under the GDPR.",
    tab: "Privacy Policy (GDPR)",
  },
  agb: {
    badge: "Contract terms",
    title: "Terms and Conditions",
    intro: "General terms and conditions for orders from MyMusicMoment24.",
    tab: "Terms (AGB)",
  },
  widerruf: {
    badge: "Consumer rights",
    title: "Right of Withdrawal",
    intro: "Information on the right of withdrawal for consumers.",
    tab: "Right of Withdrawal",
  },
};

const card = "bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-md shadow-stone-200/50";

function TranslationNote() {
  return (
    <p className="text-xs text-stone-500 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3">
      This English version is a translation for your information. The German version is legally binding.
    </p>
  );
}

function ImprintEn() {
  return (
    <>
      <TranslationNote />
      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-600" /> Information pursuant to § 5 DDG (service provider)
        </h2>
        <div className="text-stone-700 space-y-1">
          <p className="font-bold text-stone-900 text-base">DS Online Services &amp; Digitalagentur SichtbarmitKI</p>
          <p className="font-medium text-stone-800">Owner: Dirk Schmetzer</p>
          <p>Riedgrasweg 30</p>
          <p>70599 Stuttgart, Germany</p>
          <p className="text-xs text-stone-500 pt-1">
            MyMusicMoment24 is a music and audio service of DS Online Services in connection with the digital agency SichtbarmitKI.
          </p>
        </div>
        <div className="pt-2 border-t border-stone-200 space-y-2">
          <h3 className="font-semibold text-stone-900 mb-1">Contact &amp; support:</h3>
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Email (support &amp; service): </span>
            <a href="mailto:info@mymusicmoment24.de" className="text-amber-700 hover:underline font-medium">info@mymusicmoment24.de</a>
          </p>
          <p className="text-xs text-stone-500">For existing orders, support is also available via WhatsApp.</p>
        </div>
        <div className="pt-2 border-t border-stone-200">
          <h3 className="font-semibold text-stone-900 mb-1">VAT:</h3>
          <p>Small business owner under § 19 of the German VAT Act (UStG). No VAT is charged or shown.</p>
          <p>VAT ID: [falls vorhanden eintragen]</p>
        </div>
        <div className="pt-3 border-t border-stone-200 space-y-2">
          <h3 className="font-semibold text-stone-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" /> Digitalagentur SichtbarmitKI
          </h3>
          <p className="text-stone-700 text-xs sm:text-sm">
            Website &amp; portfolio:{" "}
            <a href="https://www.sichtbarmitki.agency" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:underline font-bold inline-flex items-center gap-1">
              <span>www.sichtbarmitki.agency</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </p>
        </div>
        <div className="pt-3 border-t border-stone-200">
          <h3 className="font-semibold text-stone-900 mb-1">Responsible for editorial content pursuant to § 18 (2) MStV:</h3>
          <p>Dirk Schmetzer, Riedgrasweg 30, 70599 Stuttgart, Germany</p>
        </div>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-600" /> Consumer dispute resolution
        </h2>
        <p className="text-xs text-stone-500">
          We are neither obliged nor generally willing to take part in dispute resolution proceedings before a consumer arbitration board. We always try to resolve any disagreements directly and simply with our customers.
        </p>
      </section>

      <section className={`${card} text-xs text-stone-600`}>
        <h3 className="text-base font-bold text-stone-900">Liability for content</h3>
        <p>
          As a service provider, we are responsible for our own content on these pages under general law in accordance with § 7 (1) DDG. Under §§ 8 to 10 DDG, however, we are not obliged to monitor third-party information that is transmitted or stored, or to investigate circumstances that indicate illegal activity.
        </p>
        <h3 className="text-base font-bold text-stone-900 pt-2">Liability for links</h3>
        <p>
          Our website contains links to external third-party websites whose content we have no influence on. We therefore cannot accept any liability for this external content. The respective provider or operator of the linked pages is always responsible for their content.
        </p>
        <h3 className="text-base font-bold text-stone-900 pt-2">Copyright</h3>
        <p>
          The content, compositions and works created by the site operators on these pages are subject to German copyright law. Copying, editing, distributing and any kind of use beyond the limits of copyright law require the written consent of the respective author or creator.
        </p>
      </section>

      <section className={`${card} text-xs text-stone-600`}>
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-600" /> Technical indexes
        </h3>
        <div className="flex flex-wrap gap-3 pt-1">
          <a href="/sitemap.xml" target="_blank" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 hover:text-stone-900 transition">
            <span className="font-mono text-amber-700 text-[11px] font-bold">[XML]</span>
            <span>Sitemap (XML)</span>
          </a>
          <a href="/llms.txt" target="_blank" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 hover:text-stone-900 transition">
            <span className="font-mono text-blue-700 text-[11px] font-bold">[TXT]</span>
            <span>AI context document (llms.txt)</span>
          </a>
        </div>
      </section>
    </>
  );
}

function PrivacyEn() {
  const link = "text-emerald-700 underline font-medium";
  return (
    <>
      <TranslationNote />
      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" /> 1. Data protection at a glance
        </h2>
        <p>
          Protecting your personal data matters to us. Below we explain which data is collected, for what purpose, and which rights you have under the EU General Data Protection Regulation (GDPR).
        </p>
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
          <p className="font-semibold text-stone-900 mb-1">Controller:</p>
          <p>DS Online Services, Dirk Schmetzer</p>
          <p>Riedgrasweg 30</p>
          <p>70599 Stuttgart, Germany</p>
          <p className="mt-1">Email: <a href="mailto:info@mymusicmoment24.de" className={link}>info@mymusicmoment24.de</a></p>
        </div>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">2. Data collected when you order a song &amp; use the configurator</h2>
        <p>When you order a personalized song through our configurator, we collect the following data:</p>
        <ul className="list-disc list-inside space-y-1 text-stone-700">
          <li>Names of the recipient and of the person placing the order</li>
          <li>Occasion (e.g. wedding, birthday, anniversary)</li>
          <li>Personal stories, anecdotes, character traits and music style preferences</li>
          <li>Email address and, if provided, phone / WhatsApp number for the digital delivery of the finished audio files (MP3/WAV)</li>
        </ul>
        <p className="text-xs text-stone-500">
          <strong>Legal basis:</strong> Art. 6 (1) (b) GDPR (performance of a contract or pre-contractual measures).
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">3. Payment service providers</h2>
        <p>To process payments, we use external payment service providers through whose platforms you can make payments:</p>
        <div className="space-y-3 text-xs text-stone-700">
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            <p className="font-semibold text-stone-900 mb-1">PayPal</p>
            <p className="text-stone-600">
              PayPal (Europe) S.à r.l. et Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxembourg.
              Privacy policy: <a href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full" target="_blank" rel="noopener noreferrer" className={link}>https://www.paypal.com/privacy</a>.
            </p>
          </div>
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            <p className="font-semibold text-stone-900 mb-1">Credit cards, Apple Pay &amp; Google Pay (e.g. Stripe / Checkout)</p>
            <p className="text-stone-600">
              Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Ireland.
              Privacy policy: <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className={link}>https://stripe.com/privacy</a>.
            </p>
          </div>
        </div>
        <p className="text-xs text-stone-500">
          <strong>Legal basis:</strong> Your payment data is passed on to the respective payment provider solely to process the contract and the payment, based on Art. 6 (1) (b) GDPR.
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">4. Google Consent Mode v2 &amp; analytics</h2>
        <p>
          Our website uses <strong>Google Consent Mode v2</strong>. This means that all analytics and marketing cookies ("analytics_storage", "ad_storage") are disabled ("denied") by default.
        </p>
        <p>
          Measurement services are only activated once you explicitly agree in our cookie banner. You can change or withdraw your choice at any time via <em>"Cookie Preferences"</em> in the footer.
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">5. Your rights as a data subject</h2>
        <p>Under the GDPR, you have the following rights at any time:</p>
        <ul className="list-disc list-inside space-y-1 text-stone-700">
          <li><strong>Right of access (Art. 15 GDPR):</strong> to the personal data we store about you.</li>
          <li><strong>Right to rectification (Art. 16 GDPR):</strong> if data is incorrect.</li>
          <li><strong>Right to erasure (Art. 17 GDPR):</strong> deletion of your data, unless legal retention obligations apply.</li>
          <li><strong>Restriction of processing (Art. 18 GDPR)</strong> and <strong>data portability (Art. 20 GDPR)</strong>.</li>
          <li><strong>Right to object (Art. 21 GDPR):</strong> to the processing of your data.</li>
        </ul>
        <p className="text-xs text-stone-500 mt-2">
          To exercise your rights, an informal email to <a href="mailto:info@mymusicmoment24.de" className={link}>info@mymusicmoment24.de</a> is enough.
        </p>
      </section>
    </>
  );
}

export default function LegalPage({ type = "impressum", onBackToHome, onSwitchTab }) {
  const { language, lp } = useLanguage();
  const isEn = language === "en";
  const pages = isEn ? PAGES_EN : PAGES;
  const page = pages[type] || pages.impressum;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition font-medium"
          >
            <ArrowLeft className="w-4 h-4 text-amber-600" />
            <span>{language === "en" ? "Back to Homepage" : "Zurück zur Startseite"}</span>
          </button>
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-sm font-bold text-stone-900 hover:opacity-90 transition"
          >
            <img
              src="/images/logo-icon.png"
              alt="MyMusicMoment24 Logo"
              className="w-7 h-7 object-contain"
            />
            <span>MyMusicMoment<span className="text-amber-500">24</span></span>
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-amber-50/50 via-white to-[#faf8f5] border-b border-stone-200 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-300 text-stone-700 text-xs font-semibold uppercase tracking-wider mb-4">
            {type === "datenschutz" ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Scale className="w-3.5 h-3.5 text-amber-600" />}
            {page.badge}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight mb-4">
            {page.title}
          </h1>
          <p className="text-stone-600 text-sm md:text-base max-w-xl mx-auto">
            {page.intro}
          </p>

          {/* Quick Switch Tabs (echte Links, damit Google sie findet) */}
          <nav aria-label={isEn ? "Legal pages" : "Rechtliche Seiten"} className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6">
            {Object.entries(pages).map(([key, item]) => (
              <a
                key={key}
                href={lp(`/${key}`)}
                aria-current={type === key ? "page" : undefined}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                  e.preventDefault();
                  onSwitchTab(key);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  type === key
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-white text-stone-600 hover:text-stone-900 border border-stone-200"
                }`}
              >
                {item.tab}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Legal Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 text-stone-700 text-sm leading-relaxed space-y-8">
        {(type === "agb" || type === "widerruf") && (
          <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-md shadow-stone-200/50">
            <p className="font-semibold text-stone-900">{isEn ? LEGAL_PLACEHOLDER_EN : LEGAL_PLACEHOLDER}</p>
          </section>
        )}

        {isEn && type === "impressum" && <ImprintEn />}
        {isEn && type === "datenschutz" && <PrivacyEn />}

        {!isEn && type === "impressum" && (
          <>
            {/* Anbieterkennzeichnung */}
            <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-md shadow-stone-200/50">
              <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600" /> Angaben gemäß § 5 DDG (Diensteanbieter)
              </h2>
              <div className="text-stone-700 space-y-1">
                <p className="font-bold text-stone-900 text-base">DS Online Services &amp; Digitalagentur SichtbarmitKI</p>
                <p className="font-medium text-stone-800">Inhaber: Dirk Schmetzer</p>
                <p>Riedgrasweg 30</p>
                <p>70599 Stuttgart, Deutschland</p>
                <p className="text-xs text-stone-500 pt-1">
                  MyMusicMoment24 ist ein spezialisierter Musik- &amp; Audio-Service von DS Online Services in Verbindung mit der Digitalagentur SichtbarmitKI.
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200 space-y-2">
                <h3 className="font-semibold text-stone-900 mb-1">Kontakt &amp; Support:</h3>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>E-Mail (Support &amp; Service): </span>
                  <a href="mailto:info@mymusicmoment24.de" className="text-amber-700 hover:underline font-medium">
                    info@mymusicmoment24.de
                  </a>
                </p>
                <p className="text-xs text-stone-500">
                  Support auch direkt über WhatsApp für bestehende Bestellungen erreichbar.
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200">
                <h3 className="font-semibold text-stone-900 mb-1">Umsatzsteuer:</h3>
                <p>Kleinunternehmer gemäß § 19 UStG, daher wird keine Umsatzsteuer berechnet und ausgewiesen.</p>
                <p>USt-IdNr.: [falls vorhanden eintragen]</p>
              </div>

              {/* Digitalagentur SichtbarmitKI */}
              <div className="pt-3 border-t border-stone-200 space-y-2">
                <h3 className="font-semibold text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Digitalagentur SichtbarmitKI
                </h3>
                <p className="text-stone-700 text-xs sm:text-sm">
                  Webseite &amp; Portfolio:{" "}
                  <a
                    href="https://www.sichtbarmitki.agency"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-700 hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <span>www.sichtbarmitki.agency</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </p>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Die <strong>Digitalagentur SichtbarmitKI</strong> (DS Online Services) ist spezialisiert auf modernste KI-Workflows, automatisierte Content-Erstellung, Webentwicklung und Audio-Branding im Großraum Stuttgart und im gesamten DACH-Raum.
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200">
                <h3 className="font-semibold text-stone-900 mb-1">Verantwortlich für redaktionelle Inhalte gemäß § 18 Abs. 2 MStV:</h3>
                <p>Dirk Schmetzer, Riedgrasweg 30, 70599 Stuttgart, Deutschland</p>
              </div>
            </section>

            {/* Verbraucherstreitbeilegung (EU-OS-Plattform am 20.07.2025 eingestellt) */}
            <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-md shadow-stone-200/50">
              <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-600" /> Verbraucherstreitbeilegung
              </h2>
              <p className="text-xs text-stone-500">
                Wir sind nicht verpflichtet und grundsätzlich nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. Wir bemühen uns stets, eventuelle Unstimmigkeiten direkt und unbürokratisch mit unseren Kunden zu lösen.
              </p>
            </section>

            {/* Haftung & Urheberrecht */}
            <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 text-xs text-stone-600 shadow-md shadow-stone-200/50">
              <h3 className="text-base font-bold text-stone-900">Haftung für Inhalte</h3>
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>

              <h3 className="text-base font-bold text-stone-900 pt-2">Haftung für Links</h3>
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>

              <h3 className="text-base font-bold text-stone-900 pt-2">Urheberrecht</h3>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte, Kompositionen und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </section>

            {/* Technische Indizes & Transparenzangaben */}
            <section className="bg-white border border-stone-200 rounded-2xl p-6 space-y-3 text-xs text-stone-600 shadow-md shadow-stone-200/50">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" /> Technische Indizes &amp; Transparenzangaben
              </h3>
              <p>
                Zur Gewährleistung von Transparenz nach modernen Webstandards und zur Unterstützung automatisierter Indexierungen stellen wir folgende maschinenlesbare Index- und Kontextdaten bereit:
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 hover:text-stone-900 transition"
                >
                  <span className="font-mono text-amber-700 text-[11px] font-bold">[XML]</span>
                  <span>Sitemap (XML)</span>
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </a>
                <a
                  href="/llms.txt"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 hover:text-stone-900 transition"
                >
                  <span className="font-mono text-blue-700 text-[11px] font-bold">[TXT]</span>
                  <span>KI-Kontextdokument (llms.txt)</span>
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </a>
              </div>
            </section>
          </>
        )}

        {!isEn && type === "datenschutz" && (
          <>
            {/* Datenschutzerklärung */}
            <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-md shadow-stone-200/50">
              <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> 1. Datenschutz auf einen Blick
              </h2>
              <p>
                Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. Nachfolgend informieren wir Sie darüber, welche Daten erhoben werden, zu welchem Zweck dies geschieht und welche Rechte Sie nach der europäischen Datenschutz-Grundverordnung (DSGVO) haben.
              </p>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
                <p className="font-semibold text-stone-900 mb-1">Verantwortliche Stelle:</p>
                <p>DS Online Services – Dirk Schmetzer</p>
                <p>Riedgrasweg 30</p>
                <p>70599 Stuttgart, Deutschland</p>
                <p className="mt-1">E-Mail: <a href="mailto:info@mymusicmoment24.de" className="text-emerald-700 underline font-medium">info@mymusicmoment24.de</a></p>
              </div>
            </section>

            <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-md shadow-stone-200/50">
              <h2 className="text-xl font-bold text-stone-900">2. Datenerfassung bei Song-Bestellung &amp; Konfigurator</h2>
              <p>
                Wenn Sie über unseren Konfigurator einen personalisierten Song beauftragen, erheben wir folgende Daten:
              </p>
              <ul className="list-disc list-inside space-y-1 text-stone-700">
                <li>Namen der beschenkten Person und des Auftraggebers</li>
                <li>Anlass (z. B. Hochzeit, Geburtstag, Jubiläum)</li>
                <li>Persönliche Geschichten, Anekdoten, Charaktereigenschaften und Musikstil-Präferenzen</li>
                <li>E-Mail-Adresse und ggf. Telefonnummer / WhatsApp-Nummer für die digitale Zustellung der fertigen Audio-Dateien (MP3/WAV)</li>
              </ul>
              <p className="text-xs text-stone-500">
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Erfüllung eines Vertrages bzw. Durchführung vorvertraglicher Maßnahmen).
              </p>
            </section>

            <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-md shadow-stone-200/50">
              <h2 className="text-xl font-bold text-stone-900">3. Zahlungsdienstleister &amp; Zahlungsabwicklung</h2>
              <p>
                Zur Abwicklung von Zahlungen setzen wir externe Zahlungsdienstleister ein, über deren Plattformen Sie Zahlungen vornehmen können:
              </p>
              <div className="space-y-3 text-xs text-stone-700">
                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                  <p className="font-semibold text-stone-900 mb-1">PayPal</p>
                  <p className="text-stone-600">
                    PayPal (Europe) S.à r.l. et Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxembourg.
                    Datenschutzerklärung: <a href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-medium">https://www.paypal.com/privacy</a>.
                  </p>
                </div>
                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                  <p className="font-semibold text-stone-900 mb-1">Kreditkarten, Apple Pay &amp; Google Pay (z. B. Stripe / Checkout)</p>
                  <p className="text-stone-600">
                    Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Irland.
                    Datenschutzerklärung: <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-medium">https://stripe.com/privacy</a>.
                  </p>
                </div>
              </div>
              <p className="text-xs text-stone-500">
                <strong>Rechtsgrundlage:</strong> Die Weitergabe Ihrer Zahlungsdaten an den jeweiligen Zahlungsanbieter erfolgt ausschließlich zur Vertragsabwicklung und Zahlungsdurchführung auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.
              </p>
            </section>

            <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-md shadow-stone-200/50">
              <h2 className="text-xl font-bold text-stone-900">4. Google Consent Mode v2 &amp; Analyse</h2>
              <p>
                Unsere Website nutzt den offiziellen <strong>Google Consent Mode v2</strong>. Das bedeutet: Standardmäßig sind alle Analyse- und Marketing-Cookies ("analytics_storage", "ad_storage") deaktiviert ("denied").
              </p>
              <p>
                Erst wenn Sie über unseren Cookie-Banner explizit zustimmen, werden entsprechende Messdienste aktiviert. Sie können Ihre Auswahl jederzeit im Footer über den Link <em>"Cookie-Einstellungen"</em> anpassen oder widerrufen.
              </p>
            </section>

            <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-md shadow-stone-200/50">
              <h2 className="text-xl font-bold text-stone-900">5. Ihre Rechte als betroffene Person</h2>
              <p>
                Sie haben nach der DSGVO jederzeit folgende Rechte:
              </p>
              <ul className="list-disc list-inside space-y-1 text-stone-700">
                <li><strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Über Ihre bei uns gespeicherten personenbezogenen Daten.</li>
                <li><strong>Berichtigungsrecht (Art. 16 DSGVO):</strong> Bei unrichtigen Daten.</li>
                <li><strong>Löschungsrecht (Art. 17 DSGVO):</strong> Löschung Ihrer Daten, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</li>
                <li><strong>Einschränkung der Verarbeitung (Art. 18 DSGVO)</strong> sowie <strong>Datenübertragbarkeit (Art. 20 DSGVO)</strong>.</li>
                <li><strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Gegen die Verarbeitung Ihrer Daten.</li>
              </ul>
              <p className="text-xs text-stone-500 mt-2">
                Zur Wahrnehmung Ihrer Rechte genügt eine formlose E-Mail an <a href="mailto:info@mymusicmoment24.de" className="text-emerald-700 underline font-medium">info@mymusicmoment24.de</a>.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
