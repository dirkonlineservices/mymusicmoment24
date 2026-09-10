import React from "react";
import { Mail, Cpu, Headphones, Smartphone, Star, CheckCircle } from "lucide-react";

const STEPS = [
  {
    num: "1",
    title: "Bestellung & Input Anfrage",
    desc: "Bestellung eingegangen, E-Mail an Kunden mit Fragen zum Songtext & Meilensteinen.",
    icon: Mail,
    color: "from-amber-500 to-yellow-500",
  },
  {
    num: "2",
    title: "Kreation & Produktion",
    desc: "Wir erstellen dein pers?nliches Unikat mit Mensch, KI & einf?hlsamem Storytelling.",
    icon: Cpu,
    color: "from-orange-500 to-amber-600",
  },
  {
    num: "3",
    title: "Review & Feedback",
    desc: "H?r ganz entspannt in deinen Song rein und gib uns dein ehrliches Feedback.",
    icon: Headphones,
    color: "from-purple-500 to-indigo-600",
  },
  {
    num: "4",
    title: "Delivery & Final",
    desc: "Erhalt deines gemasterten Tracks unkompliziert per Download & direkt via WhatsApp.",
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
    <section className="max-w-7xl mx-auto my-20 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
          Wie sehen die n?chsten Schritte aus?
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm">
          Vom ersten Gedanken bis zum fertigen G?nsehaut-Song auf deinem Smartphone.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between relative hover:border-amber-500/40 transition-all duration-300"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} text-slate-950 flex items-center justify-center font-black text-xl mb-4 shadow-lg`}>
                  {step.num}
                </div>
                <h3 className="font-bold text-base text-white mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-amber-400 font-semibold">
                <Icon className="w-4 h-4" />
                <span>Schritt {step.num}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
