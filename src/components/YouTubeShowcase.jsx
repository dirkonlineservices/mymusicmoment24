import React from "react";
import { Youtube, Play, ExternalLink, ArrowRight } from "lucide-react";

const YOUTUBE_TRACKS = [
  {
    id: "island-sky",
    title: "Island Sky – MyMusicMoment24",
    subtitle: "Atmosphärischer Soundtrack & Emotionen",
    category: "Soundtrack / Pop",
    youtubeUrl: "https://www.youtube.com/@MyMusicMoment24",
    thumbnailGradient: "from-amber-600 via-orange-700 to-slate-900",
    description: "Sanfte Pianoklänge und epische Streicher, die direkt das Herz berühren.",
  },
  {
    id: "schoen-dass-du-da-bist",
    title: "Schön dass du da bist! #deutsch",
    subtitle: "Geburtstags- & Freundschaftssong",
    category: "Deutschpop / Acoustic",
    youtubeUrl: "https://www.youtube.com/@MyMusicMoment24",
    thumbnailGradient: "from-rose-600 via-pink-800 to-slate-900",
    description: "Ein persönlicher Dankeschön-Song voller Herzenswärme und Lebensfreude.",
  },
  {
    id: "von-der-schule-ins-leben",
    title: "Von der Schule ins Leben #hip",
    subtitle: "Song zur Feier & Neuanfang",
    category: "Hip-Hop / Feiertrack",
    youtubeUrl: "https://www.youtube.com/@MyMusicMoment24",
    thumbnailGradient: "from-cyan-600 via-blue-800 to-slate-900",
    description: "Mit Mut und Zusammenhalt ins neue Lebenskapitel – modern, frisch & motivierend.",
  },
];

export default function YouTubeShowcase() {
  return (
    <section className="max-w-6xl mx-auto my-12 sm:my-20 px-4">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full mb-2">
              <Youtube className="w-3.5 h-3.5 text-red-500" /> Offizieller YouTube-Kanal
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
              Höre Dir ein paar Beispiele von uns an
            </h2>
          </div>
          <a
            href="https://www.youtube.com/@MyMusicMoment24"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-red-600/20 w-full sm:w-auto"
          >
            <Youtube className="w-4 h-4" />
            <span>Kanal @MyMusicMoment24</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {YOUTUBE_TRACKS.map((video) => (
            <a
              key={video.id}
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-slate-950 rounded-2xl border border-slate-800 hover:border-red-500/50 overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              <div className={`w-full aspect-video bg-gradient-to-br ${video.thumbnailGradient} relative flex items-center justify-center p-4`}>
                <div className="w-12 h-9 sm:w-14 sm:h-10 bg-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-red-500 transition-transform">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white translate-x-0.5" />
                </div>
                <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>MyMusicMoment24</span>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-300">
                  HD Audio
                </div>
              </div>

              <div className="p-3.5 sm:p-4 space-y-1">
                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">
                  {video.category}
                </span>
                <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-red-400 transition truncate">
                  {video.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {video.description}
                </p>
                <div className="pt-2 flex items-center gap-1 text-xs text-red-400 font-semibold">
                  <span>Auf YouTube ansehen</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
