import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles, Disc, Music } from "lucide-react";
import { trackAudioEvent } from "../lib/gtmPreview";
import { useLanguage } from "../context/LanguageContext";

const PLAYLIST = [
  {
    id: "snoopy-groove",
    title: "Snoopy's Groove",
    genre: "House / Electronic Dance",
    categoryLabel: "House",
    vocal: "Club & Party-Beat",
    file: "/audio/snoopy-s-groove.mp3",
    description: "Treibender House-Track mit pulsierendem Groove und Club-Vibes.",
  },
  {
    id: "squad-warzone",
    title: "Squad in der Zone (Warzone)",
    genre: "Gamer & Gaming-Song",
    categoryLabel: "Gaming",
    vocal: "Deutschrap & Action",
    file: "/audio/squad-in-der-zone-warzone.mp3",
    description: "Speziell für Gamer: Packender Beat über Warzone-Battles, Squads und Siege.",
  },
  {
    id: "game-over",
    title: "Game Over (Gorillaz Mode)",
    genre: "Gaming / Hip-Hop & Style",
    categoryLabel: "Gamer Part 4",
    vocal: "Gorillaz-Vibes",
    file: "/audio/game-over-gorillaz-mode.mp3",
    description: "Einzigartiger Gaming-Sound im unverwechselbaren Gorillaz-Style.",
  },
  {
    id: "brustring-herza",
    title: "Brustring und Herza",
    genre: "Vereinssong & Fan-Hymne",
    categoryLabel: "Vereine",
    vocal: "Stadion & Leidenschaft",
    file: "/audio/brustring-und-herza.mp3",
    description: "Für Vereine, Teams und Fans: Ein Song voller Herzblut, Zusammenhalt und Stolz.",
  },
  {
    id: "tanzt-der-floh",
    title: "Auf der Wiese tanzt der Floh",
    genre: "Kinderlied & Familie",
    categoryLabel: "Kinder",
    vocal: "Fröhlich & Spielerisch",
    file: "/audio/auf-der-wiese-tanzt-der-floh.mp3",
    description: "Liebevolles, fröhliches Kinderlied zum Mitsingen und Tanzen für die Kleinen.",
  },
];

export default function AudioPlayer() {
  const { t } = useLanguage();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [milestonesFired, setMilestonesFired] = useState({ 25: false, 50: false, 75: false, 100: false });

  const currentTrack = PLAYLIST[currentTrackIndex];
  const audioRef = useRef(null);

  // Sync track change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.file;
      audioRef.current.load();
      setCurrentTime(0);
      setMilestonesFired({ 25: false, 50: false, 75: false, 100: false });
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrackIndex]);

  // Sync mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleTogglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      trackAudioEvent("pause", currentTrack.title, { current_time: currentTime });
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        trackAudioEvent("play", currentTrack.title, { genre: currentTrack.genre });
      }).catch((err) => {
        console.warn("Audio playback error:", err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const curr = audioRef.current.currentTime;
    const dur = audioRef.current.duration || duration || 1;
    setCurrentTime(curr);

    const pct = Math.floor((curr / dur) * 100);
    if (pct >= 25 && !milestonesFired[25]) {
      trackAudioEvent("progress_25", currentTrack.title, { percentage: 25 });
      setMilestonesFired((m) => ({ ...m, 25: true }));
    }
    if (pct >= 50 && !milestonesFired[50]) {
      trackAudioEvent("progress_50", currentTrack.title, { percentage: 50 });
      setMilestonesFired((m) => ({ ...m, 50: true }));
    }
    if (pct >= 75 && !milestonesFired[75]) {
      trackAudioEvent("progress_75", currentTrack.title, { percentage: 75 });
      setMilestonesFired((m) => ({ ...m, 75: true }));
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setMilestonesFired({ 25: false, 50: false, 75: false, 100: false });
    trackAudioEvent("complete", currentTrack.title, { duration });
  };

  const selectTrack = (index) => {
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = pos * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progressPercent = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  return (
    <section id="hoerproben" className="w-full max-w-4xl mx-auto my-12 sm:my-20 px-4">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-sm">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 sm:pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" /> {t("audioPlayer.badge")}
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-white">
              {t("audioPlayer.title")}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Disc className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: isPlaying ? '3s' : '0s' }} />
            <span>{t("audioPlayer.testedBadge")}</span>
          </div>
        </div>

        {/* Hidden HTML5 Audio Element */}
        <audio
          ref={audioRef}
          src={currentTrack.file}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          preload="metadata"
        />

        {/* Playlist Selector Buttons (Responsive 5-track Grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 mb-6 sm:mb-8">
          {PLAYLIST.map((track, idx) => (
            <button
              key={track.id}
              onClick={() => selectTrack(idx)}
              className={`text-left p-3 rounded-xl sm:rounded-2xl border transition-all ${
                idx === currentTrackIndex
                  ? "bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10"
                  : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="text-[11px] font-semibold text-amber-400 truncate">{track.categoryLabel}</span>
                {idx === currentTrackIndex && isPlaying && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                )}
              </div>
              <p className="text-xs sm:text-sm font-bold truncate text-slate-200">{track.title}</p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{track.genre}</p>
            </button>
          ))}
        </div>

        {/* Active Player Card */}
        <div className="bg-slate-950/90 rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <button
                onClick={handleTogglePlay}
                aria-label={isPlaying ? "Pause" : "Abspielen"}
                className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:scale-105 active:scale-95 transition flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-slate-950" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-slate-950 translate-x-0.5" />}
              </button>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base font-bold text-white truncate">{currentTrack.title}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                  <span>{currentTrack.genre}</span>
                  <span>•</span>
                  <span>Stimme: {currentTrack.vocal}</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{currentTrack.description}</p>
              </div>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-white p-2 rounded-lg transition shrink-0 cursor-pointer"
              aria-label={isMuted ? "Ton an" : "Stummschalten"}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Progress Bar (Touch-friendly height) */}
          <div className="space-y-1.5">
            <div
              className="relative w-full h-3 sm:h-3.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer"
              onClick={handleSeek}
              role="slider"
              aria-valuemin={0}
              aria-valuemax={duration || 100}
              aria-valuenow={currentTime}
            >
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
