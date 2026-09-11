import React from "react";
import { Mail, Cpu, Headphones, Smartphone, Star, ArrowRight } from "lucide-react";

const STEPS = [
  {
    num: "1",
    title: "Bestellung & Input-Anfrage",
    desc: "Bestellung eingegangen: E-Mail an Kunden mit gezielten Fragen zu Songtext, Anlass & Meilensteinen.",
    icon: Mail,
    image: "/images/step-1-tablet.png",
    color: "from-amber-500 to-yellow-500",
  },
  {
    num: "2",
    title: "Kreation & Produktion",
    desc: "Wir erstellen dein persönliches Unikat mit Mensch, KI-Komposition & feinfühligem Storytelling.",
    icon: Cpu,
    image: "/images/step-2-kreation.png",
    color: "from-orange-500 to-amber-600",
  },
  {
    num: "3",
    title: "Review & Feedback",
    desc: "Hör ganz entspannt in deinen Song rein. 1 kostenfreie Verbesserungsschleife ist bei jeder Bestellung inklusive!",
    icon: Headphones,
    image: "/images/step-3-review.png",
    color: "from-purple-500 to-indigo-600",
  },
  {
    num: "4",
    title: "Delivery & Final",
    desc: "Erhalt deines persönlich geprüften Tracks unkompliziert per Download-Link & direkt via WhatsApp.",
    icon: Smartphone,
    image: "/images/step-4-delivery.png",
    color: "from-emerald-500 to-green-600",
  },
  {
    num: "5",
    title: "Bewertung abgeben",
    desc: "Teile deine emotionale Erfahrung mit uns und hilf unserer Community zu wachsen.",
    icon: Star,
    image: "/images/step-5-bewertung.png",
    color: "from-yellow-400 to-amber-500",
  },
];

export default function StepProcess() {
  return (
    <section className="max-w-7xl mx-auto my-12 sm:my-20 px-4">
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full mb-3">
          <span>In 5 einfachen Schritten zum Wunsch-Song</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
          Wie sehen die nächsten Schritte aus?
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm">
          Vom ersten Gedanken bis zum fertigen Gänsehaut-Song auf deinem Smartphone.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="group bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 flex flex-col justify-between hover:border-amber-500/50 hover:bg-slate-900 transition-all duration-300 shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1"
            >
              <div>
                {/* 3D Illustration Container */}
                <div className="h-32 sm:h-36 mb-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-center relative p-3.5 group-hover:border-amber-500/40 transition-colors overflow-hidden">
                  {/* Subtle warm glow behind icon */}
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Step Number Badge */}
                  <span className="absolute top-2.5 left-2.5 w-6 h-6 rounded-md bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md z-10">
                    {step.num}
                  </span>

                  {/* 3D Illustration Image */}
                  <img
                    src={step.image}
                    alt={step.title}
                    className="max-h-[82%] max-w-[88%] w-auto h-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <h3 className="font-bold text-sm sm:text-base text-white mb-1.5 leading-snug group-hover:text-amber-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-3.5 mt-3.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] sm:text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <Icon className="w-3.5 h-3.5" />
                  <span>Schritt {step.num} von 5</span>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
