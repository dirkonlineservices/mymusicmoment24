import React, { useState } from "react";
import { Star, Sparkles, ArrowRight, Play, X, Youtube, Gift, CheckCircle2, Eye } from "lucide-react";
import { PRODUCTS } from "../data/products";
import { useLanguage } from "../context/LanguageContext";

const CATEGORIES = [
  { id: "all", label: "Alle Produkte" },
  { id: "hochzeit", label: "Hochzeitsmusik KI" },
  { id: "geburtstag", label: "Geburtstagsmusik KI" },
  { id: "jubilaeum", label: "Jubiläum & Hochzeitstag" },
  { id: "liebe", label: "Liebeslieder KI" },
  { id: "party", label: "Partytracks KI" },
  { id: "urkunde", label: "Song-Urkunde" },
];

export default function ProductCatalog({ onSelectProduct }) {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [videoModal, setVideoModal] = useState(null);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);

  const categoryLabels = {
    all: t("catalog.allCategories", "Alle Produkte"),
    hochzeit: language === "en" ? "Wedding Music AI" : "Hochzeitsmusik KI",
    geburtstag: language === "en" ? "Birthday Music AI" : "Geburtstagsmusik KI",
    jubilaeum: language === "en" ? "Anniversary & Milestone" : "Jubiläum & Hochzeitstag",
    liebe: language === "en" ? "Love Songs AI" : "Liebeslieder KI",
    party: language === "en" ? "Party Tracks AI" : "Partytracks KI",
    urkunde: language === "en" ? "Keepsake Certificate" : "Song-Urkunde",
  };

  const getLocalizedProduct = (prod) => {
    const itemKey = `catalog.items.${prod.id}`;
    return {
      ...prod,
      title: t(`${itemKey}.title`, prod.title),
      badge: prod.badge ? t(`${itemKey}.badge`, prod.badge) : null,
      categoryLabel: t(`${itemKey}.categoryLabel`, prod.categoryLabel),
      description: t(`${itemKey}.desc`, prod.description),
    };
  };

  const filteredProducts = selectedCategory === "all"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <section id="shop" className="max-w-7xl mx-auto mt-2 sm:mt-6 mb-12 sm:mb-20 px-4">
      {/* Section Header */}
      <div className="text-center mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5" /> {t("catalog.badge")}
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
          {t("catalog.title")}
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
          {t("catalog.subtitle")}
        </p>
      </div>

      {/* Categories Filter Bar (Horizontal scrollable on mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 sm:mb-10 no-scrollbar sm:justify-center -mx-4 px-4 sm:mx-0">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              selectedCategory === cat.id
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold"
                : "bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            {categoryLabels[cat.id] || cat.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredProducts.map((rawProd) => {
          const prod = getLocalizedProduct(rawProd);
          return (
          <div
            key={prod.id}
            className="group bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10"
          >
            <div>
              {/* Product Photo */}
              <div className="w-full h-48 sm:h-56 rounded-2xl relative overflow-hidden bg-slate-950 border border-slate-800/80 mb-4">
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                
                {prod.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-slate-950 text-[11px] sm:text-xs font-black uppercase rounded-lg shadow-md">
                    {prod.badge}
                  </span>
                )}

                {/* KI-Transparenz Label or Preview Button */}
                {prod.id === "urkunde" ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCertificateModalOpen(true);
                    }}
                    className="absolute top-3 right-3 px-2 py-0.5 bg-slate-950/80 hover:bg-amber-500 hover:text-slate-950 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[10px] font-bold rounded-md shadow-sm flex items-center gap-1 transition"
                  >
                    <Eye className="w-3 h-3" />
                    <span>{t("catalog.urkundePreviewBtn", "Vorschau")}</span>
                  </button>
                ) : (
                  <span className="absolute top-3 right-3 px-2 py-0.5 bg-slate-950/80 backdrop-blur-md border border-white/15 text-slate-300 text-[10px] font-medium rounded-md shadow-sm flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    <span>{t("catalog.aiCreativeBadge", "KI-Creative")}</span>
                  </span>
                )}

                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end gap-2">
                  <span className="text-[11px] sm:text-xs font-bold text-amber-300 bg-slate-950/90 px-2.5 py-1 rounded-md backdrop-blur-sm border border-slate-800 truncate">
                    {prod.categoryLabel}
                  </span>
                  <span className="text-base sm:text-lg font-black text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-md shadow whitespace-nowrap shrink-0">
                    {prod.id === "urkunde" ? t("catalog.urkundeTag", "+ 9,99 €") : `${prod.price.toFixed(2).replace(".", ",")} €`}
                  </span>
                </div>
              </div>

              {/* Title & Reviews */}
              <div>
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold mb-1.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          prod.reviewsCount > 0
                            ? "fill-amber-400 text-amber-400"
                            : "fill-amber-400/40 text-amber-400/40"
                        }`}
                      />
                    ))}
                  </div>
                  {prod.reviewsCount === 0 ? (
                    <span className="text-amber-400 text-[11px] font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {t("catalog.newBadge")}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs">
                      ({prod.reviewsCount} {prod.reviewsCount === 1 ? t("catalog.reviewSuffix", "Bewertung") : t("catalog.reviewsSuffix", "Bewertungen")})
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition mb-1.5 line-clamp-1">
                  {prod.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">
                  {prod.description}
                </p>

                {prod.youtubeVideoId && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoModal({
                        videoId: prod.youtubeVideoId,
                        title: prod.youtubeTitle || prod.title,
                      });
                    }}
                    className="mb-2 w-full py-2 px-3 rounded-xl bg-red-600/15 hover:bg-red-600/25 border border-red-500/30 text-red-400 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                    <span>{t("catalog.videoPreviewBtn")} „{prod.youtubeTitle || t("showcase.watchVideo", "Video ansehen")}“</span>
                  </button>
                )}
              </div>
            </div>

            {/* Price & CTA Button */}
            <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[11px] text-slate-400 block truncate">
                  {prod.id === "urkunde" ? t("catalog.addonPriceLabel", "Song-Zusatz") : t("catalog.fixedPrice", "Festpreis")}
                </span>
                <span className="text-xl sm:text-2xl font-black text-white whitespace-nowrap block">
                  {prod.id === "urkunde" ? "+ 9,99 €" : `${prod.price.toFixed(2).replace(".", ",")} €`}
                </span>
              </div>
              {prod.id === "urkunde" ? (
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("konfigurator");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                    window.dispatchEvent(new CustomEvent("preselect-urkunde"));
                  }}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition active:scale-95 whitespace-nowrap shrink-0"
                >
                  <span>{t("catalog.urkundeActionBtn", "Mit Song wählen")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => onSelectProduct(prod)}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition active:scale-95 whitespace-nowrap shrink-0"
                >
                  <span>{t("catalog.orderBtn")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          );
        })}
      </div>

      {/* Geschenkgutschein Feature Banner */}
      <div className="mt-12 sm:mt-16 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-amber-500/30 hover:border-amber-500/50 rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden transition-all">
        {/* Glow background accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex-1 min-w-0 z-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full mb-3">
            <Gift className="w-3.5 h-3.5" />
            <span>{t("catalog.voucherBanner.badge", "Das flexible Geschenk")}</span>
          </div>

          <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            {t("catalog.voucherBanner.title", "Überlasse dem Beschenkten die Wahl: Der Geschenkgutschein")}
          </h3>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5 max-w-2xl">
            {t("catalog.voucherBanner.desc", "Du möchtest einen Song verschenken, bist dir bei Musikstil oder Anekdoten aber noch unsicher? Mit unserem Gutschein verschenkst du pure Vorfreude und die volle kreative Freiheit.")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t("catalog.voucherBanner.feature1", "Flexibel einlösbar für jeden Anlass & jedes Genre")}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t("catalog.voucherBanner.feature2", "Sofort druckfertig per E-Mail für eilige Geschenke")}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t("catalog.voucherBanner.feature3", "Inklusive 1 Gratis-Korrekturschleife & privater Nutzungsrechte")}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() =>
                onSelectProduct({
                  id: "gutschein",
                  title: language === "en" ? "Gift Voucher for a Custom Song" : "Geschenkgutschein für ein Wunschlied",
                  price: 19.99,
                  category: "gutschein",
                })
              }
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition active:scale-95"
            >
              <Gift className="w-4 h-4" />
              <span>{t("catalog.voucherBanner.btn", "Gutschein verschenken (19,99 €)")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-400 font-medium">
              {language === "en" ? "Fixed price €19.99 • Instant PDF by Email" : "19,99 € Festpreis • Sofort per E-Mail"}
            </span>
          </div>
        </div>

        {/* Voucher Photo Mockup */}
        <div className="w-full lg:w-80 shrink-0 z-10">
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl shadow-black/80 group">
            <img
              src="/images/gutschein.jpg"
              alt="Geschenkgutschein MyMusicMoment24"
              className="w-full h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            <span className="absolute bottom-3 left-3 right-3 text-center text-xs font-bold text-amber-300 bg-slate-950/80 backdrop-blur-md py-1 px-3 rounded-lg border border-slate-800">
              {language === "en" ? "Gift Voucher (€19.99)" : "Geschenkgutschein (19,99 €)"}
            </span>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {videoModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setVideoModal(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-2.5">
                <Youtube className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-white text-sm sm:text-base">
                  {videoModal.title}
                </h3>
              </div>
              <button
                onClick={() => setVideoModal(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                aria-label="Schließen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${videoModal.videoId}?autoplay=1&rel=0`}
                title={videoModal.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Certificate Preview Modal */}
      {certificateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setCertificateModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-7 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setCertificateModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition"
              aria-label="Schließen"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                {language === "en" ? "Official Keepsake Add-on" : "Offizielles Song-Zusatzprodukt"}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {language === "en" ? "Official Song Certificate with QR Code" : "Offizielle Song-Urkunde mit Liedtext & QR-Code"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg mx-auto">
                {language === "en"
                  ? "The tangible gift to frame: High-resolution DIN A4 document with golden seal and scannable audio QR code to play the song anytime on your smartphone."
                  : "Das greifbare Geschenk zum Einrahmen: Hochauflösendes DIN A4 Dokument mit goldenem Siegel und scannbarem QR-Code zum direkten Abspielen auf dem Smartphone."}
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl mb-5 bg-slate-950">
              <img
                src="/images/urkunde-beispiel.jpg"
                alt="Offizielle Song-Urkunde mit QR-Code"
                className="w-full h-auto object-contain max-h-[48vh] mx-auto"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-300 mb-6 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{language === "en" ? "Print-ready DIN A4 PDF" : "Druckfertiges DIN A4 PDF"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{language === "en" ? "QR Code: Play & Download" : "Audio-QR-Code: Anhören & Download"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{language === "en" ? "Custom Lyrics & Seal" : "Songtext & goldenes Siegel"}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <div>
                <span className="text-[11px] text-amber-400 font-semibold block">{language === "en" ? "Only available with a custom song" : "Nur in Kombination mit Song bestellbar"}</span>
                <span className="text-lg font-black text-white">+ 9,99 € Aufpreis</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCertificateModalOpen(false);
                  const el = document.getElementById("konfigurator");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                  window.dispatchEvent(new CustomEvent("preselect-urkunde"));
                }}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
              >
                <span>{language === "en" ? "Configure Song & Add Certificate" : "Song konfigurieren & Urkunde wählen"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
