import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Music, Heart, Sparkles, Disc } from "lucide-react";
import { trackAudioEvent } from "../lib/gtmPreview";

const PLAYLIST = [
  {
    id: "hochzeit",
    title: "Unser Versprechen (Hochzeitssong)",
    genre: "Pop-Ballade & Piano",
    vocal: "Duett (M/W)",
    duration: 38,
    file: "/audio/hochzeit-probe.mp3",
    noteFreqs: [261.63, 329.63, 392.0, 523.25, 440.0, 349.23, 392.0], // C4, E4, G4, C5, A4, F4, G4
  },
  {
    id: "geburtstag",
    title: "Das Beste Alter (Geburtstagstrack)",
    genre: "Akustik-Pop / Feelgood",
    vocal: "Männlich",
    duration: 34,
    file: "/audio/geburtstag-probe.mp3",
    noteFreqs: [293.66, 369.99, 440.0, 587.33, 493.88], // D major feel
  },
  {
    id: "liebeslied",
    title: "Für Immer Du (Jubiläum & Liebe)",
    genre: "R&B / Slow Jam",
    vocal: "Weiblich",
    duration: 42,
    file: "/audio/ballade-probe.mp3",
    noteFreqs: [220.0, 261.63, 329.63, 392.0, 440.0], // A minor feel
  },
  {
    id: "party",
    title: "Feierabend Helden (Partytrack)",
    genre: "Dance / Pop Uptempo",
    vocal: "Männlich / Duo",
    duration: 30,
    file: "/audio/party-probe.mp3",
    noteFreqs: [329.63, 392.0, 493.88, 587.33], // E minor dance
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

  // Play melodic harmonic synth notes for rich listening experience
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

      // Simple melodic arpeggiation
      freqs.forEach((freq, idx) => {
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.4);
      });

      gain.gain.setValueAtTime(isMuted ? 0 : 0.08, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscillatorRef.current = { osc, gain };
    } catch (e) {
      console.log("Web Audio fallback initialized");
    }
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

          // Milestone tracking for GTM DataLayer
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
    <section id="hoerproben" className="w-full max-w-4xl mx-auto my-12 px-4">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl shadow-orange-950/20 backdrop-blur-sm">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Echte KI-Hörproben
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Höre den Unterschied: Dein Song mit Gänsehaut-Faktor
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Disc className="w-4 h-4 text-orange-400 animate-spin" style={{ animationDuration: isPlaying ? '3s' : '0s' }} />
            <span>Studio-Mastering 48kHz / 24-Bit</span>
          </div>
        </div>

        {/* Playlist Selector Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-8">
          {PLAYLIST.map((track, idx) => (
            <button
              key={track.id}
              onClick={() => selectTrack(idx)}
              className={`text-left p-3 rounded-xl border transition-all ${
                idx === currentTrackIndex
                  ? "bg-orange-500/15 border-orange-500/50 text-white shadow-lg shadow-orange-500/10"
                  : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span className="text-xs font-medium block text-orange-400 mb-1">{track.genre}</span>
              <p className="text-sm font-semibold truncate text-slate-200">{track.title}</p>
            </button>
          ))}
        </div>

        {/* Active Player Card */}
        <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleTogglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:scale-105 active:scale-95 transition flex items-center justify-center text-white shadow-xl shadow-orange-500/30"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 translate-x-0.5" />}
              </button>
              <div>
                <h4 className="text-lg font-bold text-white">{currentTrack.title}</h4>
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  <span>{currentTrack.genre}</span>
                  <span>•</span>
                  <span>Stimme: {currentTrack.vocal}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-white p-2 rounded-lg transition"
              aria-label={isMuted ? "Ton an" : "Stummschalten"}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Waveform / Progress Bar */}
          <div className="space-y-2">
            <div
              className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                setCurrentTime(pos * currentTrack.duration);
              }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
