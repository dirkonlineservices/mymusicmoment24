import React from "react";
import { Mail, Cpu, Headphones, Smartphone, Star } from "lucide-react";

const STEPS = [
  {
    num: "1",
    title: "Bestellung & Input-Anfrage",
    desc: "Bestellung eingegangen: E-Mail an Kunden mit gezielten Fragen zu Songtext, Anlass & Meilensteinen.",
    icon: Mail,
    color: "from-amber-500 to-yellow-500",
  },
  {
    num: "2",
    title: "Kreation & Produktion",
    desc: "Wir erstellen dein pers\u00f6nliches Unikat mit Mensch, KI-Komposition & feinf\u00fchligem Storytelling.",
    icon: Cpu,
    color: "from-orange-500 to-amber-600",
  },
  {
    num: "3",
    title: "Review & Feedback",
    desc: "H\u00f6r ganz entspannt in deinen Song rein und gib uns bei Bedarf dein Feedback.",
    icon: Headphones,
    color: "from-purple-500 to-indigo-600",
  },
  {
    num: "4",
    title: "Delivery & Final",
    desc: "Erhalt deines gemasterten Tracks unkompliziert per Download-Link & direkt via WhatsApp.",
    icon: Smartphone,
    color: "from-emerald-500 to-green-600",
  },
  {
    num: "5",
    title: "Bewertung abgeben",
    desc: "Teile deine emotionale Erfahrung mit uns und hilf unserer Community zu wachsen.",
    icon: Star,
    color: "from-yellow-400 to-amber-500",
  },
];

export default function StepProcess() {
  return (
    <section className="max-w-7xl mx-auto my-12 sm:my-20 px-4">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
          Wie sehen die n\u00e4chsten Schritte aus?
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm">
          Vom ersten Gedanken bis zum fertigen G\u00e4nsehaut-Song auf deinem Smartphone.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 shadow-lg"
            >
              <div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${step.color} text-slate-950 flex items-center justify-center font-black text-lg sm:text-xl mb-3 sm:mb-4 shadow-md`}>
                  {step.num}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-white mb-1.5 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-3.5 mt-3.5 border-t border-slate-800 flex items-center gap-1.5 text-[11px] sm:text-xs text-amber-400 font-semibold">
                <Icon className="w-3.5 h-3.5" />
                <span>Schritt {step.num} von 5</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
