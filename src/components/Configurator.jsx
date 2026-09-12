import React, { useState, useEffect } from "react";
import { 
  Heart, Gift, Sparkles, Mic, ArrowRight, ArrowLeft, CheckCircle2, Flame, Music,
  Radio, Guitar, PartyPopper, Music2, Disc, Zap, Eye, X 
} from "lucide-react";
import { trackConfiguratorStep, trackViewItem } from "../lib/gtmPreview";
import { useLanguage } from "../context/LanguageContext";

const OCCASIONS_DATA = [
  { id: "hochzeit", label: "Hochzeit & Verlobung", icon: Heart, desc: "Euer emotionaler Soundtrack für Trauung & Eröffnungstanz" },
  { id: "geburtstag", label: "Runder Geburtstag", icon: Gift, desc: "Lustig, berührend oder mitreißend mit allen Meilensteinen" },
  { id: "liebe", label: "Liebeserklärung & Jahrestag", icon: Sparkles, desc: "Sag ‚Ich liebe dich‘ mit einer unvergesslichen Ballade" },
  { id: "party", label: "Party, Verein & Abschied", icon: Flame, desc: "Uptempo-Hymne mit Ohrwurm-Refrain zum Mitsingen" },
];

const GENRES_DATA = [
  { 
    id: "pop-radio", 
    label: "Modern Pop / Radio-Hit", 
    icon: Radio,
    desc: "Eingängige Melodien, moderner Beat & mitreißender Refrain für jeden Tag" 
  },
  { 
    id: "pop-ballade", 
    label: "Gefühlvolle Pop-Ballade", 
    icon: Heart,
    desc: "Emotionales Klavier, Streicher & berührender Gänsehaut-Moment" 
  },
  { 
    id: "akustik", 
    label: "Akustik / Singer-Songwriter", 
    icon: Guitar,
    desc: "Warme Akustikgitarre, intim, handgemacht & 100% authentisch" 
  },
  { 
    id: "schlager", 
    label: "Moderner Schlager / Party-Pop", 
    icon: PartyPopper,
    desc: "Tanzbar, schwungvoll, beste Feierlaune & garantiert sofort im Ohr" 
  },
  { 
    id: "rock", 
    label: "Rock / Deutschrock & Power-Ballade", 
    icon: Flame,
    desc: "E-Gitarren, mitreißende Drums, Energie & emotionale Dynamik" 
  },
  { 
    id: "rnb", 
    label: "R&B / Soul / Urban", 
    icon: Music2,
    desc: "Groovige Beats, samtiger Gesang & tiefgehende Wohlfühl-Vibes" 
  },
  { 
    id: "edm-dance", 
    label: "EDM / Dance & Club-Groove", 
    icon: Disc,
    desc: "Treibende elektronische Beats, Festival-Stimmung & pure Tanzenergie" 
  },
  { 
    id: "country-folk", 
    label: "Country / Folk & Storytelling", 
    icon: Zap,
    desc: "Leichtfüßige Klänge, lebensfroh & perfekt für persönliche Geschichten" 
  },
];

const VOICES_DATA = [
  { id: "weiblich", label: "Weibliche Stimme", desc: "Sanft, klar und voller Emotion" },
  { id: "maennlich", label: "Männliche Stimme", desc: "Warm, markant und ausdrucksstark" },
  { id: "duett", label: "Emotionales Duett", desc: "Harmonischer Dialog aus zwei Stimmen" },
];

export default function Configurator({ initialOccasion = "hochzeit", onOpenCheckout }) {
  const { t, language } = useLanguage();
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

  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const stepsList = [
    { num: 1, title: t("configurator.steps.1", "Anlass"), icon: Heart },
    { num: 2, title: t("configurator.steps.2", "Musikstil"), icon: Music },
    { num: 3, title: t("configurator.steps.3", "Gesang"), icon: Mic },
    { num: 4, title: t("configurator.steps.4", "Geschichte"), icon: Sparkles },
    { num: 5, title: t("configurator.steps.5", "Paket"), icon: Gift },
  ];

  const occasionsList = OCCASIONS_DATA.map((occ) => ({
    ...occ,
    label: t(`configurator.occasions.${occ.id}.label`, occ.label),
    desc: t(`configurator.occasions.${occ.id}.desc`, occ.desc),
  }));

  const genresList = GENRES_DATA.map((g) => ({
    ...g,
    label: t(`configurator.genres.${g.id}.label`, g.label),
    desc: t(`configurator.genres.${g.id}.desc`, g.desc),
  }));

  const voicesList = VOICES_DATA.map((v) => ({
    ...v,
    label: t(`configurator.voices.${v.id}.label`, v.label),
    desc: t(`configurator.voices.${v.id}.desc`, v.desc),
  }));

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
          <span>{t("configurator.badge")}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
          {t("configurator.title")}
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-xs sm:text-base leading-relaxed">
          {t("configurator.subtitle")}
        </p>
      </div>

      <div className="bg-gradient-to-b from-slate-900 via-slate-900/98 to-slate-950 border-2 border-amber-500/35 hover:border-amber-500/60 rounded-3xl p-5 sm:p-10 shadow-2xl shadow-amber-500/10 relative overflow-hidden ring-1 ring-amber-500/20 transition-all duration-300">
        {/* Glow Ambient Accents */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Interactive Step Navigator */}
        <div className="mb-8 relative z-10">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-3 mb-3.5">
            {stepsList.map((s) => {
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
            <h3 className="text-xl sm:text-3xl font-bold text-white">{t("configurator.stepTitles.1")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {occasionsList.map((occ) => {
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
                <span>{t("configurator.next")} ({t("configurator.steps.2")})</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Genre */}
        {step === 2 && (
          <div className="space-y-5 sm:space-y-6">
            <h3 className="text-xl sm:text-3xl font-bold text-white">{t("configurator.stepTitles.2")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {genresList.map((g) => {
                const Icon = g.icon;
                const isSelected = config.genre === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => setConfig({ ...config, genre: g.id })}
                    className={`cursor-pointer p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? "bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10"
                        : "bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <div className={`p-2.5 sm:p-3 rounded-xl shrink-0 ${isSelected ? "bg-amber-500 text-slate-950" : "bg-slate-700 text-slate-400"}`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <h4 className="font-bold text-sm sm:text-base truncate">{g.label}</h4>
                        {isSelected && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{g.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pt-3 sm:pt-4 flex items-center justify-between gap-3">
              <button
                onClick={() => goToStep(1)}
                className="px-4 py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> {t("configurator.back")}
              </button>
              <button
                onClick={() => goToStep(3)}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black rounded-xl flex items-center gap-2 transition shadow-lg shadow-amber-500/20"
              >
                <span>{t("configurator.next")} ({t("configurator.steps.3")})</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Voice & Language */}
        {step === 3 && (
          <div className="space-y-5 sm:space-y-6">
            <h3 className="text-xl sm:text-3xl font-bold text-white">{t("configurator.stepTitles.3")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {voicesList.map((v) => {
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
              <label className="block text-xs sm:text-sm font-semibold text-white mb-2">
                {t("configurator.languageLabel")}
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[
                  { id: "Deutsch", label: language === "en" ? "German" : "Deutsch" },
                  { id: "Englisch", label: language === "en" ? "English" : "Englisch" },
                  { id: "Zweisprachig (DE/EN)", label: language === "en" ? "Bilingual (DE/EN)" : "Zweisprachig (DE/EN)" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setConfig({ ...config, language: item.id })}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition ${
                      config.language === item.id
                        ? "bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-md"
                        : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 sm:pt-4 flex items-center justify-between gap-3">
              <button
                onClick={() => goToStep(2)}
                className="px-4 py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> {t("configurator.back")}
              </button>
              <button
                onClick={() => goToStep(4)}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black rounded-xl flex items-center gap-2 transition shadow-lg shadow-amber-500/20"
              >
                <span>{t("configurator.next")} ({t("configurator.steps.4")})</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Story & Names */}
        {step === 4 && (
          <div className="space-y-5 sm:space-y-6">
            <h3 className="text-xl sm:text-3xl font-bold text-white">{t("configurator.stepTitles.4")}</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {language === "en"
                ? "The more personal details and anecdotes you share, the more emotional and unique the lyrics will be."
                : "Je mehr persönliche Details du nennst, desto einzigartiger wird der Text."}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-white mb-1">
                  {t("configurator.storyLabels.namesLabel")}:
                </label>
                <input
                  type="text"
                  placeholder={t("configurator.storyLabels.namesPlaceholder")}
                  value={config.names}
                  onChange={(e) => setConfig({ ...config, names: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-base placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-white mb-1">
                  {t("configurator.storyLabels.storyLabel")}:
                </label>
                <textarea
                  rows={4}
                  placeholder={t("configurator.storyLabels.storyPlaceholder")}
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
                <ArrowLeft className="w-4 h-4" /> {t("configurator.back")}
              </button>
              <button
                onClick={() => goToStep(5)}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black rounded-xl flex items-center gap-2 transition shadow-lg shadow-amber-500/20"
              >
                <span>{t("configurator.summary.cardTitle", "Zur Übersicht")}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Summary */}
        {step === 5 && (
          <div className="space-y-5 sm:space-y-6">
            <h3 className="text-xl sm:text-3xl font-bold text-white">{t("configurator.stepTitles.5")}</h3>

            <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">{t("configurator.summary.occasion")}:</span>
                <span className="font-semibold text-white capitalize">{config.occasion}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">{t("configurator.summary.genre")}:</span>
                <span className="font-semibold text-white capitalize">{config.genre}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">{t("configurator.summary.voice")}:</span>
                <span className="font-semibold text-white capitalize">{config.voice} ({config.language})</span>
              </div>
              {config.names && (
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">{t("configurator.summary.storyDetails")}:</span>
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
                    <span className="font-bold text-white text-xs sm:text-sm block">{t("configurator.summary.expressTitle")}</span>
                    <span className="text-[11px] sm:text-xs text-slate-400">{t("configurator.summary.expressDesc")}</span>
                  </div>
                </div>
                <span className="font-bold text-amber-400 text-sm sm:text-base shrink-0 ml-2">+9,99 €</span>
              </label>

              <div className="flex items-center justify-between p-3.5 sm:p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700 transition">
                <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 mr-2">
                  <input
                    type="checkbox"
                    checked={config.pdfLyrics}
                    onChange={(e) => setConfig({ ...config, pdfLyrics: e.target.checked })}
                    className="rounded bg-slate-700 border-slate-600 text-amber-500 w-5 h-5 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-white text-xs sm:text-sm block">{t("configurator.summary.pdfTitle")}</span>
                    <span className="text-[11px] sm:text-xs text-slate-400 block">{t("configurator.summary.pdfDesc")}</span>
                  </div>
                </label>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowCertificateModal(true);
                    }}
                    className="text-[11px] sm:text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1.5 rounded-lg transition"
                    title={t("configurator.summary.previewBtn", "Vorschau ansehen")}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t("configurator.summary.previewBtn", "Vorschau")}</span>
                  </button>
                  <span className="font-bold text-amber-400 text-sm sm:text-base">+4,99 €</span>
                </div>
              </div>
            </div>

            {/* Total price & Checkout Button */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs sm:text-sm text-slate-300 block">{t("configurator.summary.totalPrice")}</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-white">{totalPrice.toFixed(2).replace(".", ",")} €</span>
              </div>
              <button
                onClick={handleFinish}
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-base rounded-xl flex items-center justify-center gap-2 transition shadow-xl shadow-amber-500/30"
              >
                <span>{t("configurator.orderNow")}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="pt-2 flex justify-start">
              <button
                onClick={() => goToStep(4)}
                className="px-4 py-2 text-xs sm:text-sm text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> {t("configurator.editStep")}
              </button>
            </div>
          </div>
        )}

        {/* Trust & Benefits Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] sm:text-xs text-slate-400 text-center relative z-10">
          <div className="flex items-center justify-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{t("configurator.trustBar.fixedPrice")}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{t("configurator.trustBar.fastDelivery")}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{t("configurator.trustBar.freeRevision")}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{t("configurator.trustBar.privateRights")}</span>
          </div>
        </div>
      </div>

      {/* Certificate Preview Modal */}
      {showCertificateModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("configurator.summary.certificateModal.title", "Offizielle Song-Urkunde")}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowCertificateModal(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/10 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/90">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base">
                    {t("configurator.summary.certificateModal.title", "Offizielle Song-Urkunde zum Einrahmen")}
                  </h3>
                  <span className="text-[11px] text-amber-400/90 font-medium">
                    {t("configurator.summary.certificateModal.badge", "Druckreifes Premium-PDF (DIN A4)")}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                aria-label={t("configurator.summary.certificateModal.closeBtn", "Schließen")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with Image and Highlights */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {/* Certificate Image Frame */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl group">
                <img
                  src="/images/urkunde-beispiel.jpg"
                  alt="Beispiel: Offizielle Song-Urkunde im edlen Rahmen"
                  className="w-full h-auto max-h-[420px] object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>

              {/* Feature Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-slate-300">
                <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{t("configurator.summary.certificateModal.feature1")}</span>
                </div>
                <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{t("configurator.summary.certificateModal.feature2")}</span>
                </div>
                <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{t("configurator.summary.certificateModal.feature3")}</span>
                </div>
                <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{t("configurator.summary.certificateModal.feature4")}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="px-5 py-4 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                {t("configurator.summary.certificateModal.desc")}
              </span>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setConfig({ ...config, pdfLyrics: true });
                    setShowCertificateModal(false);
                  }}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t("configurator.summary.certificateModal.addBtn", "Jetzt für 4,99 € hinzufügen")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCertificateModal(false)}
                  className="px-4 py-2.5 text-xs text-slate-400 hover:text-white transition"
                >
                  {t("configurator.summary.certificateModal.closeBtn", "Schließen")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
