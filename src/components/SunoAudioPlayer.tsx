import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Music, FileText, ChevronDown, ChevronUp } from "lucide-react";

interface SunoAudioPlayerProps {
  songId?: string;
  songUrl?: string;
  songTitle?: string;
  artistName?: string;
}

const codeMonkeyLyrics = `[Шүлэг 1]
Code Monkey get up, get coffee
Code Monkey go to job
Code Monkey have boring meeting
With boring manager Rob
Rob say Code Monkey very diligent
But his output stink
Rob say weekly report is due now
Code Monkey not write report
Code Monkey write query instead

[Дахилт]
Code Monkey like Fritos
Code Monkey like Tab and Mountain Dew
Code Monkey very simple man
With simple common sense
Code Monkey like you
Code Monkey like you, a lot

[Шүлэг 2]
Code Monkey hang out at water cooler
Code Monkey make small talk
Code Monkey hear guy from marketing
Tell boring joke, but Code Monkey laugh
'Cause guy from marketing is big and strong
And he wear nice suit
Code Monkey wish he had a suit like that
Wish he was guy from marketing
Instead of simple man

[Дахилт]
Code Monkey like Fritos
Code Monkey like Tab and Mountain Dew
Code Monkey very simple man
With simple common sense
Code Monkey like you
Code Monkey like you, a lot`;

export function SunoAudioPlayer({
  songId,
  songUrl = "https://www.jonathancoulton.com/static/music/Code%20Monkey.mp3",
  songTitle = "Code Monkey (Anthem)",
  artistName = "Jonathan Coulton"
}: SunoAudioPlayerProps) {
  // Use Code Monkey details since we are playing the vocal track
  const finalTitle = (songUrl.toLowerCase().includes("code-monkey") || songUrl.toLowerCase().includes("code%20monkey")) ? "Code Monkey (Anthem)" : songTitle;
  const finalArtistName = (songUrl.toLowerCase().includes("code-monkey") || songUrl.toLowerCase().includes("code%20monkey")) ? "Jonathan Coulton" : artistName;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sources = [
    songUrl, // 1st try (Default secure official URL)
    "https://upload.wikimedia.org/wikipedia/commons/4/40/Tchaikovsky_-_Twelve_Pieces_for_Piano%2C_Op._40_-_No._2_Chanson_triste.mp3", // 2nd try (Ultra-reliable secure global Wikimedia CDN with CORS support)
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" // 3rd try (Ultra-reliable global CORS backup)
  ];

  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showFallbackNotice, setShowFallbackNotice] = useState(false);

  useEffect(() => {
    // Reset playback and index on songUrl changes
    stopPlayback();
    setCurrentTime(0);
    setDuration(0);
    setCurrentSourceIndex(0);
    setShowFallbackNotice(false);
  }, [songUrl]);

  useEffect(() => {
    // Reload and play when source index changes due to fallback
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn(`Playback failed on source index ${currentSourceIndex}:`, err);
          handleAudioError();
        });
      }
    }
  }, [currentSourceIndex]);

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsPlaying(true); // Set active playing state immediately so cascading effects run automatically
      audioRef.current.play()
        .catch((err) => {
          console.warn("Direct play failed, triggering waterfall fallback:", err);
          handleAudioError();
        });
    }
  };

  const handleAudioError = () => {
    if (currentSourceIndex < sources.length - 1) {
      const nextIndex = currentSourceIndex + 1;
      console.warn(`Audio stream failed. Auto-switching to backup source: ${sources[nextIndex]}`);
      setCurrentSourceIndex(nextIndex);
      setShowFallbackNotice(true);
    } else {
      console.error("All audio streaming channels failed.");
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCurrentTime(value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
      audioRef.current.muted = value === 0;
    }
    setIsMuted(value === 0);
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (audioRef.current) {
      audioRef.current.muted = newMuted;
    }
  };

  const resetPlayback = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full bg-[#161616] border border-white/5 rounded-2xl p-5 flex flex-col gap-4 shadow-2xl relative overflow-hidden group">
      {/* Background Decorative Accent Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none transition-opacity group-hover:bg-primary/10 duration-500" />
      
      {/* Invisible HTML Audio Element with waterfall sources */}
      <audio
        ref={audioRef}
        src={sources[currentSourceIndex]}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        preload="metadata"
      />

      {/* Fallback Notice */}
      {showFallbackNotice && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex flex-col gap-1 text-xs text-primary/80 animate-fadeIn font-light">
          <p className="font-semibold text-primary">⚠️ Дууны урсгал шилжлээ</p>
          <p className="text-[11px] leading-relaxed text-gray-400">
            Хөтөч/хамгаалалтын хязгаарлалтын улмаас үндсэн суваг ажиллахгүй байсан тул тоглуулагч автоматаар илүү найдвартай <b>нөөц суваг</b> руу шилжлээ.
          </p>
        </div>
      )}

      {/* Title & Status Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${isPlaying ? "bg-primary text-black animate-pulse" : "bg-white/5 text-gray-400"} transition-all duration-300`}>
            <Music className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest leading-none mb-1">
              {isPlaying ? "Тоглож байна" : "Сонсоход бэлэн"}
            </span>
            <span className="text-[#E1E0CC] text-sm font-semibold tracking-wide">
              {finalTitle}
            </span>
            <span className="text-gray-400 text-xs font-light">
              {finalArtistName}
            </span>
          </div>
        </div>

        {/* Visualizer bars that animate only when playing */}
        <div className="flex items-end gap-[3px] h-5 px-1">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-[3px] bg-primary rounded-t-sm transition-all duration-300"
              style={{
                height: isPlaying ? `${Math.floor(Math.random() * 16) + 4}px` : "4px",
                animation: isPlaying ? `bounce 0.8s ease-in-out infinite alternate` : "none",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress Timeline Tracker */}
      <div className="flex flex-col gap-1.5 mt-1">
        <div className="relative flex items-center group/slider">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-white/10 accent-primary focus:outline-none transition-all duration-150 group-hover/slider:bg-white/20"
            style={{
              background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${
                duration ? (currentTime / duration) * 100 : 0
              }%, rgba(255, 255, 255, 0.1) ${
                duration ? (currentTime / duration) * 100 : 0
              }%, rgba(255, 255, 255, 0.1) 100%)`
            }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] font-mono text-gray-500 leading-none">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls: Playback, Volume & Lyrics toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-1">
        
        {/* Playback actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={resetPlayback}
            title="Эхнээс нь эхлүүлэх"
            className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-primary hover:bg-[#F3F2DD] text-black flex items-center justify-center shadow-lg transform transition-all duration-200 active:scale-95 cursor-pointer hover:scale-105"
            title={isPlaying ? "Түр зогсоох" : "Тоглуулах"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-black stroke-black" />
            ) : (
              <Play className="w-5 h-5 fill-black stroke-black ml-0.5" />
            )}
          </button>
        </div>

        {/* Dynamic Volume Control */}
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 flex-1 max-w-[200px]">
          <button
            onClick={toggleMute}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? "Дууг нээх" : "Дууг хаах"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-full h-1 appearance-none bg-white/10 rounded-lg cursor-pointer accent-primary"
            style={{
              background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${
                isMuted ? 0 : volume * 100
              }%, rgba(255, 255, 255, 0.1) ${
                isMuted ? 0 : volume * 100
              }%, rgba(255, 255, 255, 0.1) 100%)`
            }}
          />
        </div>

        {/* Toggle Lyrics Button */}
        <button
          onClick={() => setShowLyrics(!showLyrics)}
          className="flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-xs text-gray-300 px-3.5 py-1.5 rounded-full border border-white/5 transition-all duration-200 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Үг харах</span>
          {showLyrics ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

      </div>

      {/* Toggleable Lyrics Panel */}
      {showLyrics && (
        <div className="mt-2 bg-black/40 border border-white/5 rounded-xl p-4 max-h-48 overflow-y-auto custom-scrollbar text-xs leading-relaxed text-gray-400 text-center font-light font-sans whitespace-pre-line animate-fadeIn">
          {codeMonkeyLyrics}
        </div>
      )}

      {/* CSS Animation Keyframes Injector */}
      <style>{`
        @keyframes bounce {
          0% { height: 4px; }
          100% { height: 18px; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
