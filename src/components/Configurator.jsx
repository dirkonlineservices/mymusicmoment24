import React, { useState } from "react";
import { 
  Heart, Gift, Sparkles, Music2, Mic, Clock, ArrowRight, ArrowLeft, 
  CheckCircle2, Flame, HelpCircle 
} from "lucide-react";
import { trackConfiguratorStep } from "../lib/gtmPreview";

const OCCASIONS = [
  { id: "hochzeit", label: "Hochzeit & Verlobung", icon: Heart, desc: "Euer emotionaler Soundtrack für Trauung & Eröffnungstanz" },
  { id: "geburtstag", label: "Runder Geburtstag", icon: Gift, desc: "Lustig, berührend oder mitreißend mit allen Meilensteinen" },
  { id: "liebe", label: "Liebeserklärung & Jahrestag", icon: Sparkles, desc: "Sag 'Ich liebe dich' mit einer unvergesslichen Ballade" },
  { id: "party", label: "Party, Verein & Abschied", icon: Flame, desc: "Uptempo-Hymne mit Ohrwurm-Refrain zum Mitsingen" },
];

const GENRES = [
  { id: "pop-ballade", label: "Pop-Ballade", desc: "Gefühlvolles Klavier, Streicher & mitreißender Refrain" },
  { id: "akustik", label: "Akustik / Singer-Songwriter", desc: "Warme Akustikgitarre, intim & authentisch" },
  { id: "schlager", label: "Moderner Schlager / Pop", desc: "Tanzbar, schwungvoll & sofort im Kopf" },
  { id: "rnb", label: "R&B / Soul", desc: "Groovige Beats, gefühlvoller Gesang & Gänsehaut-Vibes" },
  { id: "rock", label: "Rock / Power-Ballade", desc: "E-Gitarren, Energie & emotionale Dynamik" },
];

const VOICES = [
  { id: "weiblich", label: "Weibliche Stimme", desc: "Sanft, klar und voller Emotion" },
  { id: "maennlich", label: "Männliche Stimme", desc: "Warm, markant und ausdrucksstark" },
  { id: "duett", label: "Emotionales Duett", desc: "Harmonischer Dialog aus zwei Stimmen" },
];

export default function Configurator({ onOpenCheckout }) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    occasion: "hochzeit",
    genre: "pop-ballade",
    voice: "duett",
    language: "Deutsch",
    names: "",
    story: "",
    mood: "Romantisch & Tränenreich",
    express: false,
    pdfLyrics: true,
  });

  const basePrice = 49;
  const expressPrice = config.express ? 19 : 0;
  const pdfPrice = config.pdfLyrics ? 9 : 0;
  const totalPrice = basePrice + expressPrice + pdfPrice;

  const goToStep = (nextStep) => {
    setStep(nextStep);
    trackConfiguratorStep(nextStep, `Step_${nextStep}`, config);
    const elem = document.getElementById("konfigurator");
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
  };

  const handleFinish = () => {
    const finalOrder = {
      id: `song-${Date.now()}`,
      name: `Personalisierter Song (${config.occasion})`,
      price: totalPrice,
      details: config,
    };
    if (onOpenCheckout) {
      onOpenCheckout(finalOrder);
    }
  };

  return (
    <section id="konfigurator" className="w-full max-w-4xl mx-auto my-16 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow background accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Progress header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>Schritt {step} von 5</span>
            <span className="text-orange-400 font-bold">
              {step === 1 && "Anlass wählen"}
              {step === 2 && "Musikstil & Genre"}
              {step === 3 && "Gesang & Stimme"}
              {step === 4 && "Eure Geschichte"}
              {step === 5 && "Paket & Zusammenfassung"}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Occasion */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-white">Für welchen Anlass ist dein Song?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {OCCASIONS.map((occ) => {
                const Icon = occ.icon;
                const isSelected = config.occasion === occ.id;
                return (
                  <div
                    key={occ.id}
                    onClick={() => setConfig({ ...config, occasion: occ.id })}
                    className={`cursor-pointer p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                      isSelected
                        ? "bg-orange-500/15 border-orange-500 text-white shadow-lg shadow-orange-500/10"
                        : "bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <div className={`p-3 rounded-xl shrink-0 ${isSelected ? "bg-orange-500 text-white" : "bg-slate-700 text-slate-400"}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base mb-1">{occ.label}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{occ.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => goToStep(2)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl flex items-center gap-2 transition shadow-lg shadow-orange-500/20"
              >
                Weiter zu Musikstil <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Genre */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-white">Welcher Musikstil passt am besten?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {GENRES.map((g) => {
                const isSelected = config.genre === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => setConfig({ ...config, genre: g.id })}
                    className={`cursor-pointer p-5 rounded-2xl border transition-all ${
                      isSelected
                        ? "bg-orange-500/15 border-orange-500 text-white shadow-lg shadow-orange-500/10"
                        : "bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-base">{g.label}</h4>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-orange-400" />}
                    </div>
                    <p className="text-xs text-slate-400">{g.desc}</p>
                  </div>
                );
              })}
            </div>
            <div className="pt-4 flex justify-between">
              <button
                onClick={() => goToStep(1)}
                className="px-5 py-2.5 text-slate-400 hover:text-white flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Zurück
              </button>
              <button
                onClick={() => goToStep(3)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl flex items-center gap-2 transition shadow-lg shadow-orange-500/20"
              >
                Weiter zu Gesang <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Voice & Language */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-white">Gesangsstimme & Sprache festlegen</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {VOICES.map((v) => {
                const isSelected = config.voice === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => setConfig({ ...config, voice: v.id })}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all text-center ${
                      isSelected
                        ? "bg-orange-500/15 border-orange-500 text-white shadow-lg shadow-orange-500/10"
                        : "bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <Mic className={`w-8 h-8 mx-auto mb-2 ${isSelected ? "text-orange-400" : "text-slate-500"}`} />
                    <h4 className="font-bold text-sm mb-1">{v.label}</h4>
                    <p className="text-xs text-slate-400">{v.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800">
              <label className="block text-sm font-semibold text-white mb-2">Sprache des Songs:</label>
              <div className="flex gap-3">
                {["Deutsch", "Englisch", "Zweisprachig (DE/EN)"].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setConfig({ ...config, language: lang })}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                      config.language === lang
                        ? "bg-orange-500 text-white border-orange-500 shadow-md"
                        : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => goToStep(2)}
                className="px-5 py-2.5 text-slate-400 hover:text-white flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Zurück
              </button>
              <button
                onClick={() => goToStep(4)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl flex items-center gap-2 transition shadow-lg shadow-orange-500/20"
              >
                Weiter zu Details <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Story & Names */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-white">Eure persönliche Geschichte</h3>
            <p className="text-sm text-slate-400">
              Je mehr persönliche Details du nennst, desto einzigartiger wird der Text.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-1">
                  Namen der besungenen Personen / Kosenamen:
                </label>
                <input
                  type="text"
                  placeholder="z.B. Sarah & Florian, oder Opa Hans"
                  value={config.names}
                  onChange={(e) => setConfig({ ...config, names: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-1">
                  Wichtige Anekdoten, Daten, Meilensteine & Kernbotschaft:
                </label>
                <textarea
                  rows={4}
                  placeholder="z.B. Kennengelernt im Sommerurlaub 2018 in Italien, Liebe zu Spaziergängen am Meer, Heiratsantrag in Paris, 'Danke, dass du immer mein Anker bist'..."
                  value={config.story}
                  onChange={(e) => setConfig({ ...config, story: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => goToStep(3)}
                className="px-5 py-2.5 text-slate-400 hover:text-white flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Zurück
              </button>
              <button
                onClick={() => goToStep(5)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl flex items-center gap-2 transition shadow-lg shadow-orange-500/20"
              >
                Weiter zur Übersicht <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Summary & Packages */}
        {step === 5 && (
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-white">Konfiguration prüfen & Extras wählen</h3>

            <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Anlass:</span>
                <span className="font-semibold text-white capitalize">{config.occasion}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Musikstil:</span>
                <span className="font-semibold text-white capitalize">{config.genre}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Gesang & Sprache:</span>
                <span className="font-semibold text-white capitalize">{config.voice} ({config.language})</span>
              </div>
              {config.names && (
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Namen:</span>
                  <span className="font-semibold text-white">{config.names}</span>
                </div>
              )}
            </div>

            {/* Extras toggles */}
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700 cursor-pointer transition">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={config.express}
                    onChange={(e) => setConfig({ ...config, express: e.target.checked })}
                    className="rounded bg-slate-700 border-slate-600 text-orange-500 w-5 h-5"
                  />
                  <div>
                    <span className="font-bold text-white block">Express-Lieferung (12 Stunden)</span>
                    <span className="text-xs text-slate-400">Garantierte Lieferung innerhalb 12h statt 24-48h</span>
                  </div>
                </div>
                <span className="font-bold text-orange-400">+19 €</span>
              </label>

              <label className="flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700 cursor-pointer transition">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={config.pdfLyrics}
                    onChange={(e) => setConfig({ ...config, pdfLyrics: e.target.checked })}
                    className="rounded bg-slate-700 border-slate-600 text-orange-500 w-5 h-5"
                  />
                  <div>
                    <span className="font-bold text-white block">Songtext als Urkunde / PDF</span>
                    <span className="text-xs text-slate-400">Hochauflösendes PDF zum Ausdrucken und Einrahmen</span>
                  </div>
                </div>
                <span className="font-bold text-orange-400">+9 €</span>
              </label>
            </div>

            {/* Total price */}
            <div className="p-5 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-sm text-slate-300 block">Gesamtpreis (inkl. MwSt.)</span>
                <span className="text-3xl font-extrabold text-white">{totalPrice} €</span>
              </div>
              <button
                onClick={handleFinish}
                className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-lg rounded-xl flex items-center gap-2 transition shadow-xl shadow-orange-500/30"
              >
                Jetzt bestellen <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="pt-2 flex justify-start">
              <button
                onClick={() => goToStep(4)}
                className="px-5 py-2.5 text-slate-400 hover:text-white flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Zurück zum Bearbeiten
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
