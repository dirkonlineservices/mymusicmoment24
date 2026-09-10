import React, { useState } from "react";
import { Star, Sparkles, ArrowRight } from "lucide-react";
import { PRODUCTS } from "../data/products";

const CATEGORIES = [
  { id: "all", label: "Alle Produkte" },
  { id: "geburtstag", label: "Geburtstagsmusik KI" },
  { id: "hochzeit", label: "Hochzeitsmusik KI" },
  { id: "liebe", label: "Liebeslieder KI" },
  { id: "jubilaeum", label: "Jubiläumsfeier KI" },
  { id: "party", label: "Personalisierte KI Partytracks" },
];

export default function ProductCatalog({ onSelectProduct }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts = selectedCategory === "all"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <section id="shop" className="max-w-7xl mx-auto mt-2 sm:mt-6 mb-12 sm:mb-20 px-4">
      {/* Section Header */}
      <div className="text-center mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Echte Studioqualität • Nur 19,99 € je Lied
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
          Alle Musikstücke & Geschenke
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
          Wähle deinen Wunsch-Song – professionell komponiert, individuell getextet und in 24 Stunden geliefert.
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
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredProducts.map((prod) => (
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

                {/* KI-Transparenz Label */}
                <span className="absolute top-3 right-3 px-2 py-0.5 bg-slate-950/80 backdrop-blur-md border border-white/15 text-slate-300 text-[10px] font-medium rounded-md shadow-sm flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  <span>KI-Creative</span>
                </span>

                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <span className="text-[11px] sm:text-xs font-bold text-amber-300 bg-slate-950/90 px-2.5 py-1 rounded-md backdrop-blur-sm border border-slate-800">
                    {prod.categoryLabel}
                  </span>
                  <span className="text-base sm:text-lg font-black text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-md shadow">
                    19,99 €
                  </span>
                </div>
              </div>

              {/* Title & Reviews */}
              <div>
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold mb-1.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-slate-400 text-xs">({prod.reviewsCount} Bewertungen)</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition mb-1.5 line-clamp-1">
                  {prod.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                  {prod.description}
                </p>
              </div>
            </div>

            {/* Price & CTA Button */}
            <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-slate-400 block">Festpreis</span>
                <span className="text-xl sm:text-2xl font-black text-white">19,99 €</span>
              </div>
              <button
                onClick={() => onSelectProduct(prod)}
                className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition active:scale-95"
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
