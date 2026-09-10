import React from "react";
import { ArrowLeft, ShieldCheck, Scale, FileText, Mail, MapPin, ExternalLink, Music } from "lucide-react";

export default function LegalPage({ type = "impressum", onBackToHome, onSwitchTab }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition font-medium"
          >
            <ArrowLeft className="w-4 h-4 text-orange-400" />
            <span>Zurück zur Startseite</span>
          </button>
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Music className="w-4 h-4 text-orange-500" />
            <span>MyMusicMoment24</span>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800/80 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-4">
            {type === "impressum" ? <Scale className="w-3.5 h-3.5 text-orange-400" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
            {type === "impressum" ? "Rechtliche Anbieterkennzeichnung" : "Datenschutz & Privatsphäre"}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            {type === "impressum" ? "Impressum" : "Datenschutzerklärung"}
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            {type === "impressum"
              ? "Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG) und § 18 Abs. 2 MStV."
              : "Informationen über die Verarbeitung Ihrer personenbezogenen Daten gemäß DSGVO."}
          </p>

          {/* Quick Switch Tab */}
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => onSwitchTab("impressum")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                type === "impressum"
                  ? "bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              Impressum (§ 5 DDG)
            </button>
            <button
              onClick={() => onSwitchTab("datenschutz")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                type === "datenschutz"
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              Datenschutzerklärung (DSGVO)
            </button>
          </div>
        </div>
      </div>

      {/* Main Legal Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 text-slate-300 text-sm leading-relaxed space-y-8">
        {type === "impressum" ? (
          <>
            {/* Anbieterkennzeichnung */}
            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-400" /> Diensteanbieter
              </h2>
              <div className="text-slate-200">
                <p className="font-semibold text-white">DS Online Services</p>
                <p>Inhaber: Dirk Schmetzer</p>
                <p>Riedgrasweg 30</p>
                <p>70599 Stuttgart, Deutschland</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <h3 className="font-semibold text-white mb-1">Kontakt:</h3>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-400" />
                  <span>E-Mail: </span>
                  <a href="mailto:info@mymusicmoment24.de" className="text-orange-400 hover:underline">
                    info@mymusicmoment24.de
                  </a>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Support auch direkt über WhatsApp für bestehende Bestellungen erreichbar.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <h3 className="font-semibold text-white mb-1">Verantwortlich für redaktionelle Inhalte gemäß § 18 Abs. 2 MStV:</h3>
                <p>Dirk Schmetzer, Riedgrasweg 30, 70599 Stuttgart</p>
              </div>
            </section>

            {/* EU-Streitschlichtung */}
            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-orange-400" /> Verbraucherstreitbeilegung &amp; Online-Streitbeilegung
              </h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter folgendem Link finden:
              </p>
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-orange-400 hover:underline"
              >
                <span>https://ec.europa.eu/consumers/odr</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <p className="text-xs text-slate-400">
                Wir sind nicht verpflichtet und grundsätzlich nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. Wir bemühen uns stets, eventuelle Unstimmigkeiten direkt und unbürokratisch mit unseren Kunden zu lösen.
              </p>
            </section>

            {/* Haftung & Urheberrecht */}
            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 text-xs text-slate-400">
              <h3 className="text-base font-bold text-white">Haftung für Inhalte</h3>
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>

              <h3 className="text-base font-bold text-white pt-2">Haftung für Links</h3>
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>

              <h3 className="text-base font-bold text-white pt-2">Urheberrecht</h3>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte, Kompositionen und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </section>
          </>
        ) : (
          <>
            {/* Datenschutzerklärung */}
            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> 1. Datenschutz auf einen Blick
              </h2>
              <p>
                Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. Nachfolgend informieren wir Sie darüber, welche Daten erhoben werden, zu welchem Zweck dies geschieht und welche Rechte Sie nach der europäischen Datenschutz-Grundverordnung (DSGVO) haben.
              </p>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <p className="font-semibold text-white mb-1">Verantwortliche Stelle:</p>
                <p>DS Online Services – Dirk Schmetzer</p>
                <p>Riedgrasweg 30</p>
                <p>70599 Stuttgart, Deutschland</p>
                <p className="mt-1">E-Mail: <a href="mailto:info@mymusicmoment24.de" className="text-emerald-400 underline">info@mymusicmoment24.de</a></p>
              </div>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">2. Datenerfassung bei Song-Bestellung &amp; Konfigurator</h2>
              <p>
                Wenn Sie über unseren Konfigurator einen personalisierten Song beauftragen, erheben wir folgende Daten:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Namen der beschenkten Person und des Auftraggebers</li>
                <li>Anlass (z. B. Hochzeit, Geburtstag, Jubiläum)</li>
                <li>Persönliche Geschichten, Anekdoten, Charaktereigenschaften und Musikstil-Präferenzen</li>
                <li>E-Mail-Adresse und ggf. Telefonnummer / WhatsApp-Nummer für die digitale Zustellung der fertigen Audio-Dateien (MP3/WAV)</li>
              </ul>
              <p className="text-xs text-slate-400">
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Erfüllung eines Vertrages bzw. Durchführung vorvertraglicher Maßnahmen).
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">3. Zahlungsabwicklung über PayPal</h2>
              <p>
                Für die sichere Zahlungsabwicklung nutzen wir den Zahlungsdienstleister PayPal (PayPal (Europe) S.à r.l. et Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxembourg).
              </p>
              <p className="text-xs text-slate-400">
                Bei der Zahlung per PayPal werden Ihre Bestelldaten an PayPal übermittelt. Die Übermittlung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung). Nähere Informationen finden Sie in der Datenschutzerklärung von PayPal: <a href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">https://www.paypal.com/privacy</a>.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">4. Google Consent Mode v2 &amp; Analyse</h2>
              <p>
                Unsere Website nutzt den offiziellen <strong>Google Consent Mode v2</strong>. Das bedeutet: Standardmäßig sind alle Analyse- und Marketing-Cookies ("analytics_storage", "ad_storage") deaktiviert ("denied").
              </p>
              <p>
                Erst wenn Sie über unseren Cookie-Banner explizit zustimmen, werden entsprechende Messdienste aktiviert. Sie können Ihre Auswahl jederzeit im Footer über den Link <em>"Cookie-Einstellungen"</em> anpassen oder widerrufen.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white">5. Ihre Rechte als betroffene Person</h2>
              <p>
                Sie haben nach der DSGVO jederzeit folgende Rechte:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li><strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Über Ihre bei uns gespeicherten personenbezogenen Daten.</li>
                <li><strong>Berichtigungsrecht (Art. 16 DSGVO):</strong> Bei unrichtigen Daten.</li>
                <li><strong>Löschungsrecht (Art. 17 DSGVO):</strong> Löschung Ihrer Daten, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</li>
                <li><strong>Einschränkung der Verarbeitung (Art. 18 DSGVO)</strong> sowie <strong>Datenübertragbarkeit (Art. 20 DSGVO)</strong>.</li>
                <li><strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Gegen die Verarbeitung Ihrer Daten.</li>
              </ul>
              <p className="text-xs text-slate-400 mt-2">
                Zur Wahrnehmung Ihrer Rechte genügt eine formlose E-Mail an <a href="mailto:info@mymusicmoment24.de" className="text-emerald-400 underline">info@mymusicmoment24.de</a>.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
