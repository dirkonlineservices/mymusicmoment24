import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles, Disc } from "lucide-react";
import { trackAudioEvent } from "../lib/gtmPreview";

const PLAYLIST = [
  {
    id: "hochzeit",
    title: "Unser Versprechen (Hochzeitssong)",
    genre: "Pop-Ballade & Piano",
    vocal: "Duett (M/W)",
    duration: 38,
    file: "/audio/hochzeit-probe.mp3",
    noteFreqs: [261.63, 329.63, 392.0, 523.25, 440.0, 349.23, 392.0],
  },
  {
    id: "geburtstag",
    title: "Das Beste Alter (Geburtstagstrack)",
    genre: "Akustik-Pop / Feelgood",
    vocal: "Männlich",
    duration: 34,
    file: "/audio/geburtstag-probe.mp3",
    noteFreqs: [293.66, 369.99, 440.0, 587.33, 493.88],
  },
  {
    id: "liebeslied",
    title: "Für Immer Du (Jubiläum & Liebe)",
    genre: "R&B / Slow Jam",
    vocal: "Weiblich",
    duration: 42,
    file: "/audio/ballade-probe.mp3",
    noteFreqs: [220.0, 261.63, 329.63, 392.0, 440.0],
  },
  {
    id: "party",
    title: "Feierabend Helden (Partytrack)",
    genre: "Dance / Pop Uptempo",
    vocal: "Männlich / Duo",
    duration: 30,
    file: "/audio/party-probe.mp3",
    noteFreqs: [329.63, 392.0, 493.88, 587.33],
  },
];

export default function AudioPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [milestonesFired, setMilestonesFired] = useState({ 25: false, 50: false, 75: false, 100: false });

  const currentTrack = PLAYLIST[currentTrackIndex];
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const timerRef = useRef(null);

  const startSynth = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }

      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      const freqs = currentTrack.noteFreqs;
      osc.frequency.setValueAtTime(freqs[0], ctx.currentTime);

      freqs.forEach((freq, idx) => {
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.4);
      });

      gain.gain.setValueAtTime(isMuted ? 0 : 0.08, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscillatorRef.current = { osc, gain };
    } catch (e) {}
  };

  const stopSynth = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.osc.stop();
        oscillatorRef.current.osc.disconnect();
      } catch (e) {}
      oscillatorRef.current = null;
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopSynth();
      clearInterval(timerRef.current);
      setIsPlaying(false);
      trackAudioEvent("pause", currentTrack.title, { current_time: currentTime });
    } else {
      setIsPlaying(true);
      startSynth();
      trackAudioEvent("play", currentTrack.title, { genre: currentTrack.genre });

      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.5;
          const pct = Math.floor((next / currentTrack.duration) * 100);

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

          if (next >= currentTrack.duration) {
            clearInterval(timerRef.current);
            stopSynth();
            setIsPlaying(false);
            trackAudioEvent("complete", currentTrack.title, { duration: currentTrack.duration });
            setMilestonesFired({ 25: false, 50: false, 75: false, 100: false });
            return 0;
          }
          return next;
        });
      }, 500);
    }
  };

  const selectTrack = (index) => {
    stopSynth();
    clearInterval(timerRef.current);
    setIsPlaying(false);
    setCurrentTime(0);
    setMilestonesFired({ 25: false, 50: false, 75: false, 100: false });
    setCurrentTrackIndex(index);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  useEffect(() => {
    return () => {
      stopSynth();
      clearInterval(timerRef.current);
    };
  }, []);

  const progressPercent = Math.min((currentTime / currentTrack.duration) * 100, 100);

  return (
    <section id="hoerproben" className="w-full max-w-4xl mx-auto my-12 sm:my-20 px-4">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-sm">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 sm:pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Echte KI-Hörproben
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-white">
              Höre den Unterschied: Dein Song mit Gänsehaut-Faktor
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Disc className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: isPlaying ? '3s' : '0s' }} />
            <span>Persönlich geprüft • Gratis-Korrekturschleife</span>
          </div>
        </div>

        {/* Playlist Selector Buttons (Responsive Grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 mb-6 sm:mb-8">
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
              <span className="text-[11px] font-semibold block text-amber-400 mb-0.5 truncate">{track.genre}</span>
              <p className="text-xs sm:text-sm font-bold truncate text-slate-200">{track.title}</p>
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
                className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:scale-105 active:scale-95 transition flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30"
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
              </div>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-white p-2 rounded-lg transition shrink-0"
              aria-label={isMuted ? "Ton an" : "Stummschalten"}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Progress Bar (Touch-friendly height) */}
          <div className="space-y-1.5">
            <div
              className="relative w-full h-3 sm:h-3.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                setCurrentTime(pos * currentTrack.duration);
              }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
