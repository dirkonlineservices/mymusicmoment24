import React, { useState } from "react";
import { Youtube, Play, ExternalLink, Sparkles } from "lucide-react";

const YOUTUBE_TRACKS = [
  {
    id: "island-sky",
    title: "Island Sky ? MyMusicMoment24",
    subtitle: "Atmosph?rischer Soundtrack & Emotionen",
    category: "Soundtrack / Pop",
    youtubeUrl: "https://www.youtube.com/@MyMusicMoment24",
    thumbnailGradient: "from-amber-600 via-orange-700 to-slate-900",
    description: "Sanfte Pianokl?nge und epische Streicher, die die Seele ber?hren.",
  },
  {
    id: "schoen-dass-du-da-bist",
    title: "Sch?n dass du da bist! #deutsch",
    subtitle: "Geburtstags- & Freundschaftssong",
    category: "Deutschpop / Acoustic",
    youtubeUrl: "https://www.youtube.com/@MyMusicMoment24",
    thumbnailGradient: "from-rose-600 via-pink-800 to-slate-900",
    description: "Ein pers?nlicher Dankesch?n-Song voller Herzensw?rme und Freude.",
  },
  {
    id: "von-der-schule-ins-leben",
    title: "Von der Schule ins Leben #hip",
    subtitle: "Song zur Feier & Neuanfang",
    category: "Hip-Hop / Beat / Feier",
    youtubeUrl: "https://www.youtube.com/@MyMusicMoment24",
    thumbnailGradient: "from-cyan-600 via-blue-800 to-slate-900",
    description: "Mit Mut und Zusammenhalt ins neue Lebenskapitel ? modern & motivierend.",
  },
];

export default function YouTubeShowcase() {
  return (
    <section className="max-w-6xl mx-auto my-20 px-4">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 px-3.5 py-1.5 rounded-full mb-2">
              <Youtube className="w-4 h-4 text-red-500" /> Offizieller YouTube-Kanal
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white">
              H?re Dir ein paar Beispiele von uns an
            </h2>
          </div>
          <a
            href="https://www.youtube.com/@MyMusicMoment24"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-red-600/20"
          >
            <Youtube className="w-4 h-4" />
            <span>Kanal @MyMusicMoment24</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {YOUTUBE_TRACKS.map((video) => (
            <a
              key={video.id}
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-slate-950 rounded-2xl border border-slate-800 hover:border-red-500/50 overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              {/* Fake Video Player Preview with YouTube Play Button */}
              <div className={`w-full aspect-video bg-gradient-to-br ${video.thumbnailGradient} relative flex items-center justify-center p-4`}>
                <div className="w-14 h-10 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-red-500 transition-transform">
                  <Play className="w-5 h-5 text-white fill-white translate-x-0.5" />
                </div>
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-medium text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>MyMusicMoment24</span>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">
                  HD Audio
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4 space-y-1">
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
                  {video.category}
                </span>
                <h3 className="font-bold text-sm text-white group-hover:text-red-400 transition truncate">
                  {video.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {video.description}
                </p>
                <div className="pt-2 flex items-center gap-1 text-xs text-red-400 font-semibold">
                  <span>Auf YouTube ansehen</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}

function ArrowRight(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
}
