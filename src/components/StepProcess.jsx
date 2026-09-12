import React from "react";
import { Mail, Cpu, Headphones, Smartphone, Star, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const STEP_ICONS = [Mail, Cpu, Headphones, Smartphone, Star];
const STEP_IMAGES = [
  "/images/step-1-input.jpg",
  "/images/step-2-kreation.jpg",
  "/images/step-3-review.jpg",
  "/images/step-4-delivery.jpg",
  "/images/step-5-bewertung.jpg",
];

export default function StepProcess() {
  const { t } = useLanguage();
  const rawSteps = t("process.steps", []);

  return (
    <section className="max-w-7xl mx-auto my-12 sm:my-20 px-4">
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full mb-3">
          <span>{t("process.badge")}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
          {t("process.title")}
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm">
          {t("process.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {rawSteps.map((step, idx) => {
          const Icon = STEP_ICONS[idx] || Star;
          const image = STEP_IMAGES[idx] || STEP_IMAGES[0];
          const stepNum = step.num || String(idx + 1);
          return (
            <div
              key={stepNum}
              className="group bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 flex flex-col justify-between hover:border-amber-500/50 hover:bg-slate-900 transition-all duration-300 shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1"
            >
              <div>
                {/* 3D Illustration Container */}
                <div className="h-36 sm:h-40 mb-4 rounded-2xl bg-slate-950 border border-slate-800/80 relative overflow-hidden group-hover:border-amber-500/50 transition-all duration-300 shadow-lg">
                  {/* Step Number Badge */}
                  <span className="absolute top-2.5 left-2.5 w-6 h-6 rounded-md bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg shadow-black/80 z-10">
                    {stepNum}
                  </span>

                  {/* 3D Sharp Luxury Image */}
                  <img
                    src={image}
                    alt={step.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  {/* Subtle vignette blend */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 pointer-events-none" />
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
                  <span>{t("configurator.stepLabel", "Schritt")} {stepNum} {t("configurator.of", "von")} 5</span>
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
