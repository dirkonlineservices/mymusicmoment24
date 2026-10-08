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
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full mb-3 shadow-sm">
          <span>{t("process.badge")}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight mb-3">
          {t("process.title")}
        </h2>
        <p className="text-stone-600 max-w-xl mx-auto text-xs sm:text-sm">
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
              className="group bg-white border border-stone-200 rounded-2xl sm:rounded-3xl p-5 flex flex-col justify-between hover:border-amber-400 hover:bg-stone-50/50 transition-all duration-300 shadow-lg shadow-stone-200/50 hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                {/* 3D Illustration Container */}
                <div className="h-36 sm:h-40 mb-4 rounded-2xl bg-stone-100 border border-stone-200 relative overflow-hidden group-hover:border-amber-400 transition-all duration-300 shadow-sm">
                  {/* Step Number Badge */}
                  <span className="absolute top-2.5 left-2.5 w-6 h-6 rounded-md bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md z-10">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>

                <h3 className="font-bold text-sm sm:text-base text-stone-900 mb-1.5 leading-snug group-hover:text-amber-700 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-3.5 mt-3.5 border-t border-stone-100 flex items-center justify-between text-[11px] sm:text-xs text-stone-500 font-medium">
                <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
                  <Icon className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t("configurator.stepLabel", "Schritt")} {stepNum} {t("configurator.of", "von")} 5</span>
                </div>
                <ArrowRight className="w-3 h-3 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
