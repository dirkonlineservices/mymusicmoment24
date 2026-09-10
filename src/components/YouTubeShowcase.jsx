import React, { useState, useEffect } from "react";
import { Youtube, Play, ExternalLink, X, Sparkles, Music } from "lucide-react";

const YOUTUBE_TRACKS = [
  {
    id: "island-sky",
    videoId: "5xZLQT0uXlY",
    title: "Island Sky",
    badge: "EDM • Vocal House • Gospel Lead",
    genreDetail: "EDM Style mit Gospel-Lead-Sängerin",
    youtubeUrl: "https://youtu.be/5xZLQT0uXlY?si=fJFBQFqhvvVHZwcD",
    thumbnail: "https://img.youtube.com/vi/5xZLQT0uXlY/hqdefault.jpg",
    description: "Kraftvoller EDM-Sommertrack mit mitreißender Gospel-Lead-Sängerin, packenden Beats und purer Festival-Energie.",
    durationBadge: "EDM Gospel",
  },
  {
    id: "schoen-dass-du-da-bist",
    videoId: "07dkXAHJ68A",
    title: "Schön, dass du da bist!",
    badge: "Deutschrap • Love • Dancemusic",
    genreDetail: "Liebe & Freundschaft mit Beat",
    youtubeUrl: "https://youtu.be/07dkXAHJ68A?si=RUaYiTPdsrM6ohzU",
    thumbnail: "https://img.youtube.com/vi/07dkXAHJ68A/hqdefault.jpg",
    description: "Gefühlvoller Deutschrap kombiniert mit tanzbaren Rhythmen und tiefgehender Liebesbotschaft – ehrlich, modern und direkt ins Herz.",
    durationBadge: "Deutschrap",
  },
  {
    id: "von-der-schule-ins-leben",
    videoId: "kG70K67jVo8",
    title: "Von der Schule ins Leben",
    badge: "Deutsch Hip-Hop",
    genreDetail: "Abschluss & Neuanfang",
    youtubeUrl: "https://youtu.be/kG70K67jVo8?si=gU7UkunT0mJcx7jz",
    thumbnail: "https://img.youtube.com/vi/kG70K67jVo8/hqdefault.jpg",
    description: "Authentischer deutscher Hip-Hop über Schulabschluss, Freundschaft, Meilensteine und den mutigen Schritt in die eigene Zukunft.",
    durationBadge: "Hip-Hop",
  },
];

export default function YouTubeShowcase() {
  const [activeVideo, setActiveVideo] = useState(null);

  // Close modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveVideo(null);
      }
    };
    if (activeVideo) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeVideo]);

  return (
    <section className="max-w-6xl mx-auto my-12 sm:my-20 px-4">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full mb-2">
              <Youtube className="w-3.5 h-3.5 text-red-500" /> Echte Songbeispiele auf YouTube
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
              Höre Dir Beispiele unserer Songs an
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Von kraftvollem EDM mit mitreißender Gospel-Stimme bis zu emotionalem Deutschrap und modernem Hip-Hop – jedes Lied ein individuelles Meisterwerk. Klicke auf ein Lied, um es direkt anzuhören.
            </p>
          </div>
          <a
            href="https://www.youtube.com/@MyMusicMoment24"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-red-600/20 w-full sm:w-auto shrink-0"
          >
            <Youtube className="w-4 h-4" />
            <span>Kanal @MyMusicMoment24</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 relative z-10">
          {YOUTUBE_TRACKS.map((video) => (
            <div
              key={video.id}
              className="group flex flex-col bg-slate-950/80 rounded-2xl border border-slate-800/80 hover:border-red-500/50 overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-red-950/20"
            >
              {/* Thumbnail Container / Play Trigger */}
              <button
                type="button"
                onClick={() => setActiveVideo(video)}
                className="w-full aspect-video relative overflow-hidden bg-slate-900 text-left focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label={`${video.title} abspielen`}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Big Red Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-10 sm:w-16 sm:h-11 bg-red-600/90 group-hover:bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300 border border-white/20">
                    <Play className="w-5 h-5 text-white fill-white translate-x-0.5" />
                  </div>
                </div>

                {/* Badges on Thumbnail */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-semibold text-amber-300 border border-amber-500/20">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>✨ KI-Creative</span>
                </div>

                <div className="absolute bottom-2.5 right-2.5 bg-black/85 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-slate-200 border border-white/10">
                  {video.durationBadge}
                </div>
              </button>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider line-clamp-1">
                      {video.badge}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      HD Audio
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-red-400 transition leading-snug">
                    {video.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => setActiveVideo(video)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Jetzt anhören</span>
                  </button>

                  <a
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition"
                    title="Auf YouTube ansehen"
                  >
                    <span>Auf YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setActiveVideo(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
        >
          <div
            className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                  <Music className="w-4 h-4 text-red-400" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm sm:text-base font-bold text-white truncate">
                    {activeVideo.title}
                  </h4>
                  <p className="text-[11px] text-amber-400 truncate">
                    {activeVideo.badge} • {activeVideo.genreDetail}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={activeVideo.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold rounded-lg transition"
                >
                  <Youtube className="w-3.5 h-3.5 text-red-500" />
                  <span>Auf YouTube öffnen</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
                  aria-label="Schließen"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Player (16:9) */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Modal Footer / Privacy info */}
            <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Datenschutzkonforme Wiedergabe via youtube-nocookie.com</span>
              <a
                href={activeVideo.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:underline inline-flex items-center gap-1 sm:hidden"
              >
                <span>YouTube öffnen</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
