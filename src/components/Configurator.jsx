import React, { useState, useEffect } from "react";
import { 
  Heart, Gift, Sparkles, Mic, ArrowRight, ArrowLeft, CheckCircle2, Flame, Music 
} from "lucide-react";
import { trackConfiguratorStep, trackViewItem } from "../lib/gtmPreview";

const STEPS = [
  { num: 1, title: "Anlass", icon: Heart },
  { num: 2, title: "Musikstil", icon: Music },
  { num: 3, title: "Gesang", icon: Mic },
  { num: 4, title: "Geschichte", icon: Sparkles },
  { num: 5, title: "Paket", icon: Gift },
];

const OCCASIONS = [
  { id: "hochzeit", label: "Hochzeit & Verlobung", icon: Heart, desc: "Euer emotionaler Soundtrack für Trauung & Eröffnungstanz" },
  { id: "geburtstag", label: "Runder Geburtstag", icon: Gift, desc: "Lustig, berührend oder mitreißend mit allen Meilensteinen" },
  { id: "liebe", label: "Liebeserklärung & Jahrestag", icon: Sparkles, desc: "Sag ‚Ich liebe dich‘ mit einer unvergesslichen Ballade" },
  { id: "party", label: "Party, Verein & Abschied", icon: Flame, desc: "Uptempo-Hymne mit Ohrwurm-Refrain zum Mitsingen" },
];

const GENRES = [
  { id: "pop-ballade", label: "Pop-Ballade", desc: "Gefühlvolles Klavier, Streicher & mitreißender Refrain" },
  { id: "akustik", label: "Akustik / Singer-Songwriter", desc: "Warme Akustikgitarre, intim & authentisch" },
  { id: "schlager", label: "Moderner Schlager / Pop", desc: "Tanzbar, schwungvoll & sofort im Ohr" },
  { id: "rnb", label: "R&B / Soul", desc: "Groovige Beats, gefühlvoller Gesang & Gänsehaut-Vibes" },
  { id: "rock", label: "Rock / Power-Ballade", desc: "E-Gitarren, Energie & emotionale Dynamik" },
];

const VOICES = [
  { id: "weiblich", label: "Weibliche Stimme", desc: "Sanft, klar und voller Emotion" },
  { id: "maennlich", label: "Männliche Stimme", desc: "Warm, markant und ausdrucksstark" },
  { id: "duett", label: "Emotionales Duett", desc: "Harmonischer Dialog aus zwei Stimmen" },
];

export default function Configurator({ initialOccasion = "hochzeit", onOpenCheckout }) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    occasion: initialOccasion,
    genre: "pop-ballade",
    voice: "duett",
    language: "Deutsch",
    names: "",
    story: "",
    mood: "Romantisch & Emotionen",
    express: false,
    pdfLyrics: false,
  });

  const basePrice = 19.99;
  const expressPrice = config.express ? 9.99 : 0;
  const pdfPrice = config.pdfLyrics ? 4.99 : 0;
  const totalPrice = Number((basePrice + expressPrice + pdfPrice).toFixed(2));

  useEffect(() => {
    trackViewItem({ price: basePrice, name: `Personalisierter Song (${config.occasion})` });
  }, []);

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
    <section id="konfigurator" className="w-full max-w-5xl mx-auto my-12 sm:my-20 px-4 scroll-mt-20">
      {/* Outer Section Header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full mb-3 shadow-lg shadow-amber-500/10">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Interaktiver Song-Generator • In 2 Minuten fertig</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
          Konfiguriere deinen persönlichen Song
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-xs sm:text-base leading-relaxed">
          Wähle Anlass, Musikstil & deine persönliche Geschichte – wir komponieren daraus dein Unikat in Studioqualität für nur <span className="font-bold text-amber-400">19,99 €</span>.
        </p>
      </div>

      <div className="bg-gradient-to-b from-slate-900 via-slate-900/98 to-slate-950 border-2 border-amber-500/35 hover:border-amber-500/60 rounded-3xl p-5 sm:p-10 shadow-2xl shadow-amber-500/10 relative overflow-hidden ring-1 ring-amber-500/20 transition-all duration-300">
        {/* Glow Ambient Accents */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Interactive Step Navigator */}
        <div className="mb-8 relative z-10">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-3 mb-3.5">
            {STEPS.map((s) => {
              const isActive = step === s.num;
              const isPast = step > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => goToStep(s.num)}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 p-2 sm:py-3 sm:px-4 rounded-xl border transition-all ${
                    isActive
                      ? "bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-lg shadow-amber-500/20 scale-[1.02]"
                      : isPast
                      ? "bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-800"
                      : "bg-slate-900/60 border-slate-800/80 text-slate-500 hover:text-slate-400"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0 ${
                    isActive ? "bg-slate-950 text-amber-400" : isPast ? "bg-amber-400/20 text-amber-400" : "bg-slate-800 text-slate-500"
                  }`}>
                    {isPast ? "✓" : s.num}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold truncate hidden sm:inline">
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Occasion */}
        {step === 1 && (
          <div className="space-y-5 sm:space-y-6">
            <h3 className="text-xl sm:text-3xl font-bold text-white">Für welchen Anlass ist dein Song?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {OCCASIONS.map((occ) => {
                const Icon = occ.icon;
                const isSelected = config.occasion === occ.id;
                return (
                  <div
                    key={occ.id}
                    onClick={() => setConfig({ ...config, occasion: occ.id })}
                    className={`cursor-pointer p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? "bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10"
                        : "bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <div className={`p-2.5 sm:p-3 rounded-xl shrink-0 ${isSelected ? "bg-amber-500 text-slate-950" : "bg-slate-700 text-slate-400"}`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base mb-1">{occ.label}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{occ.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pt-3 sm:pt-4 flex justify-end">
              <button
                onClick={() => goToStep(2)}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20"
              >
                <span>Weiter zu Musikstil</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Genre */}
        {step === 2 && (
          <div className="space-y-5 sm:space-y-6">
            <h3 className="text-xl sm:text-3xl font-bold text-white">Welcher Musikstil passt am besten?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {GENRES.map((g) => {
                const isSelected = config.genre === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => setConfig({ ...config, genre: g.id })}
                    className={`cursor-pointer p-4 sm:p-5 rounded-2xl border transition-all ${
                      isSelected
                        ? "bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10"
                        : "bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm sm:text-base">{g.label}</h4>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
                    </div>
                    <p className="text-xs text-slate-400">{g.desc}</p>
                  </div>
                );
              })}
            </div>
            <div className="pt-3 sm:pt-4 flex items-center justify-between gap-3">
              <button
                onClick={() => goToStep(1)}
                className="px-4 py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Zurück
              </button>
              <button
                onClick={() => goToStep(3)}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black rounded-xl flex items-center gap-2 transition shadow-lg shadow-amber-500/20"
              >
                <span>Weiter zu Gesang</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Voice & Language */}
        {step === 3 && (
          <div className="space-y-5 sm:space-y-6">
            <h3 className="text-xl sm:text-3xl font-bold text-white">Gesangsstimme & Sprache festlegen</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {VOICES.map((v) => {
                const isSelected = config.voice === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => setConfig({ ...config, voice: v.id })}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all text-center ${
                      isSelected
                        ? "bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10"
                        : "bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <Mic className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${isSelected ? "text-amber-400" : "text-slate-500"}`} />
                    <h4 className="font-bold text-sm mb-1">{v.label}</h4>
                    <p className="text-xs text-slate-400">{v.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800">
              <label className="block text-xs sm:text-sm font-semibold text-white mb-2">Sprache des Songs:</label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {["Deutsch", "Englisch", "Zweisprachig (DE/EN)"].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setConfig({ ...config, language: lang })}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition ${
                      config.language === lang
                        ? "bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-md"
                        : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 sm:pt-4 flex items-center justify-between gap-3">
              <button
                onClick={() => goToStep(2)}
                className="px-4 py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Zurück
              </button>
              <button
                onClick={() => goToStep(4)}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black rounded-xl flex items-center gap-2 transition shadow-lg shadow-amber-500/20"
              >
                <span>Weiter zu Details</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Story & Names */}
        {step === 4 && (
          <div className="space-y-5 sm:space-y-6">
            <h3 className="text-xl sm:text-3xl font-bold text-white">Eure persönliche Geschichte</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Je mehr persönliche Details du nennst, desto einzigartiger wird der Text.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-white mb-1">
                  Namen der besungenen Personen / Kosenamen:
                </label>
                <input
                  type="text"
                  placeholder="z.B. Sarah & Florian, oder Oma Brigitte"
                  value={config.names}
                  onChange={(e) => setConfig({ ...config, names: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-base placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-white mb-1">
                  Wichtige Anekdoten, Meilensteine & Kernbotschaft:
                </label>
                <textarea
                  rows={4}
                  placeholder="z.B. Kennengelernt 2019 in Italien, gemeinsame Reise ans Meer, 'Danke, dass du immer mein Fels in der Brandung bist'..."
                  value={config.story}
                  onChange={(e) => setConfig({ ...config, story: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-base placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-3 sm:pt-4 flex items-center justify-between gap-3">
              <button
                onClick={() => goToStep(3)}
                className="px-4 py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Zurück
              </button>
              <button
                onClick={() => goToStep(5)}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black rounded-xl flex items-center gap-2 transition shadow-lg shadow-amber-500/20"
              >
                <span>Zur Übersicht</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Summary */}
        {step === 5 && (
          <div className="space-y-5 sm:space-y-6">
            <h3 className="text-xl sm:text-3xl font-bold text-white">Konfiguration prüfen & Extras wählen</h3>

            <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Anlass:</span>
                <span className="font-semibold text-white capitalize">{config.occasion}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Musikstil:</span>
                <span className="font-semibold text-white capitalize">{config.genre}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Gesang:</span>
                <span className="font-semibold text-white capitalize">{config.voice} ({config.language})</span>
              </div>
              {config.names && (
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Namen:</span>
                  <span className="font-semibold text-white truncate max-w-[200px]">{config.names}</span>
                </div>
              )}
            </div>

            {/* Extras toggles */}
            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-3.5 sm:p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700 cursor-pointer transition">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={config.express}
                    onChange={(e) => setConfig({ ...config, express: e.target.checked })}
                    className="rounded bg-slate-700 border-slate-600 text-amber-500 w-5 h-5 shrink-0"
                  />
                  <div>
                    <span className="font-bold text-white text-xs sm:text-sm block">Express-Lieferung (unter 12 Stunden)</span>
                    <span className="text-[11px] sm:text-xs text-slate-400">Garantierte Fertigstellung innerhalb 12h statt 24h</span>
                  </div>
                </div>
                <span className="font-bold text-amber-400 text-sm sm:text-base shrink-0 ml-2">+9,99 €</span>
              </label>

              <label className="flex items-center justify-between p-3.5 sm:p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700 cursor-pointer transition">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={config.pdfLyrics}
                    onChange={(e) => setConfig({ ...config, pdfLyrics: e.target.checked })}
                    className="rounded bg-slate-700 border-slate-600 text-amber-500 w-5 h-5 shrink-0"
                  />
                  <div>
                    <span className="font-bold text-white text-xs sm:text-sm block">Songtext-Urkunde als PDF</span>
                    <span className="text-[11px] sm:text-xs text-slate-400">Druckreifes PDF zum Einrahmen und Verschenken</span>
                  </div>
                </div>
                <span className="font-bold text-amber-400 text-sm sm:text-base shrink-0 ml-2">+4,99 €</span>
              </label>
            </div>

            {/* Total price & Checkout Button */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs sm:text-sm text-slate-300 block">Gesamtpreis (inkl. MwSt.)</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-white">{totalPrice.toFixed(2).replace(".", ",")} €</span>
              </div>
              <button
                onClick={handleFinish}
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-base rounded-xl flex items-center justify-center gap-2 transition shadow-xl shadow-amber-500/30"
              >
                <span>Jetzt bestellen</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="pt-2 flex justify-start">
              <button
                onClick={() => goToStep(4)}
                className="px-4 py-2 text-xs sm:text-sm text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Zurück zum Bearbeiten
              </button>
            </div>
          </div>
        )}

        {/* Trust & Benefits Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] sm:text-xs text-slate-400 text-center relative z-10">
          <div className="flex items-center justify-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Nur 19,99 € Festpreis</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Lieferung in unter 24h</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>1 Gratis-Korrekturschleife</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>100% Private Nutzungsrechte</span>
          </div>
        </div>
      </div>
    </section>
  );
}
