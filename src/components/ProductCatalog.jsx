import React, { useState } from "react";
import { Star, Gift, Sparkles, Heart, Flame, Disc, ArrowRight } from "lucide-react";

export const PRODUCTS = [
  {
    id: "gutschein",
    title: "Gutschein f?r dein Wunschlied",
    category: "merchandise",
    categoryLabel: "Gutschein",
    price: 19.99,
    badge: "Jetzt Verschenken",
    rating: 5.0,
    reviewsCount: 12,
    image: "/images/gutschein.jpg",
    gradient: "from-amber-600/40 via-orange-900/30 to-slate-900",
    description: "Der perfekte Gutschein f?r ein personalisiertes Wunschlied. Flexibel einl?sbar f?r jeden beliebigen Anlass.",
  },
  {
    id: "hochzeit",
    title: "Individuelles Hochzeitslied als Geschenk",
    category: "hochzeit",
    categoryLabel: "Hochzeitsmusik KI",
    price: 19.99,
    badge: "Bestseller",
    rating: 5.0,
    reviewsCount: 48,
    image: "/images/hochzeit.jpg",
    gradient: "from-pink-900/40 via-purple-900/30 to-slate-900",
    description: "Individuelle personalisierte Lieder f?r Hochzeiten & Hochzeitstage. Das emotionale Herzst?ck f?r Trauung und Er?ffnungstanz.",
  },
  {
    id: "duett",
    title: "Liebeslied im Duett (2 Sprachig oder 2 Stimmen)",
    category: "liebe",
    categoryLabel: "Liebeslieder KI",
    price: 19.99,
    badge: "Top-Empfehlung",
    rating: 5.0,
    reviewsCount: 29,
    image: "/images/duett.jpg",
    gradient: "from-rose-900/40 via-orange-950/30 to-slate-900",
    description: "Harmonischer Dialog aus zwei Stimmen oder zweisprachig (z.B. Deutsch & Englisch). Perfekt f?r interkulturelle Paare.",
  },
  {
    id: "geburtstag",
    title: "Personalisiertes Geburtstagslied",
    category: "geburtstag",
    categoryLabel: "Geburtstagsmusik KI",
    price: 19.99,
    badge: "Jedes Lied ist einzigartig!",
    rating: 5.0,
    reviewsCount: 3,
    image: "/images/geburtstag.jpg",
    gradient: "from-amber-700/40 via-yellow-950/30 to-slate-900",
    description: "Das unvergessliche Geburtstagsgeschenk: Alle Meilensteine, Insider und lustigen Anekdoten in einem packenden Song.",
  },
  {
    id: "jubilaeum",
    title: "Jubil?um Song",
    category: "jubilaeum",
    categoryLabel: "Jubil?umsfeier KI",
    price: 19.99,
    badge: "Emotional",
    rating: 5.0,
    reviewsCount: 16,
    image: "/images/jubilaeum.jpg",
    gradient: "from-emerald-900/40 via-slate-900 to-slate-900",
    description: "F?r Firmenjubil?en, goldene oder silberne Hochzeiten und besondere Vereins-Meilensteine mit bleibendem Wert.",
  },
  {
    id: "party",
    title: "Dein Partytrack ? Die ultimative musikalische ?berraschung! ????",
    category: "party",
    categoryLabel: "Personalisierte KI Partytracks",
    price: 19.99,
    badge: "Ohrwurm-Garantie",
    rating: 5.0,
    reviewsCount: 22,
    image: "/images/party.jpg",
    gradient: "from-purple-900/40 via-indigo-950/30 to-slate-900",
    description: "Uptempo-Feiertrack mit mitrei?endem Beat und Mitsing-Refrain f?r Feiern, Junggesellenabschiede und Vereinsfeste.",
  },
];

const CATEGORIES = [
  { id: "all", label: "Alle Produkte" },
  { id: "geburtstag", label: "Geburtstagsmusik KI" },
  { id: "hochzeit", label: "Hochzeitsmusik KI" },
  { id: "liebe", label: "Liebeslieder KI" },
  { id: "jubilaeum", label: "Jubil?umsfeier KI" },
  { id: "party", label: "Personalisierte KI Partytracks" },
];

export default function ProductCatalog({ onSelectProduct }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts = selectedCategory === "all"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <section id="shop" className="max-w-7xl mx-auto my-20 px-4">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Echte Studioqualit?t ? Nur 19,99 ? je Lied
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
          Alle Musikst?cke & Geschenke
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm">
          W?hle deinen Wunsch-Song ? professionell komponiert, individuell getextet und in 24h geliefert.
        </p>
      </div>

      {/* Categories Filter Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              selectedCategory === cat.id
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                : "bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="group bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10"
          >
            <div>
              {/* Product Visual Banner */}
              <div className={`w-full h-48 rounded-2xl bg-gradient-to-br ${prod.gradient} border border-slate-700/50 relative overflow-hidden flex items-center justify-center p-6 text-center`}>
                {prod.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-slate-950 text-xs font-black uppercase rounded-lg shadow-md">
                    {prod.badge}
                  </span>
                )}
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
                    <Disc className="w-6 h-6 animate-pulse" />
                  </div>
                  <span className="text-xs font-medium text-amber-300 block">{prod.categoryLabel}</span>
                  <div className="text-2xl font-black text-white">19,99 ?</div>
                </div>
              </div>

              {/* Title & Reviews */}
              <div className="mt-4">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold mb-1.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-slate-400">({prod.reviewsCount})</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition mb-2">
                  {prod.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {prod.description}
                </p>
              </div>
            </div>

            {/* Price & CTA Button */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Festpreis</span>
                <span className="text-2xl font-black text-white">19,99 ?</span>
              </div>
              <button
                onClick={() => onSelectProduct(prod)}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-extrabold text-sm rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition active:scale-95"
              >
                <span>Jetzt bestellen!</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
