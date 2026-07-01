import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Timer, Heart, ArrowRight, RotateCcw, Sparkles, User, Play, Keyboard, HelpCircle, Eye, AlertCircle, Volume2, ShieldAlert } from 'lucide-react';

// Interfaces for Types
export interface AnimeQuestion {
  id: number;
  emojis: string;
  answer: string;
  options: string[];
  answers: string[]; // For typing or flexible matching
  image: string;

  hint: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
  mode: 'multiple_choice' | 'typing';
}

// Beautiful list of 8 curated anime questions as specified
const ANIME_QUESTIONS: AnimeQuestion[] = [
  {
    id: 1,
    emojis: "🏴‍☠️🍖👒",
    answer: "One Piece",
    options: ["One Piece", "Naruto", "Bleach", "Dragon Ball"],
    answers: ["One Piece", "onepiece", "op", "luffy", "straw hat", "strawhat", "mugiwara"],
    image: "https://upload.wikimedia.org/wikipedia/en/9/90/One_Piece%2C_Volume_61_Cover_%28Japanese%29.jpg",
    hint: "Ирээдүйн далайн дээрэмчдийн хаан болох хүсэлтэй хүүгийн түүх."
  },
  {
    id: 2,
    emojis: "🦊🌀🍜⚡",
    answer: "Naruto",
    options: ["Naruto", "Hunter x Hunter", "My Hero Academia", "Boruto"],
    answers: ["Naruto", "shippuden", "narutoshippuden", "uzumaki", "naruto uzumaki"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsiwrUbi6di7-BvECztemEJoUTojyY8BEy8RpiMlV9-Q&s",
   
    hint: "Навчит тосгоны хоёр дахь урсгал ба баатар болохыг мөрөөдөгч хүү."
  },
  {
    id: 3,
    emojis: "🧱⚔️🦕🩸",
    answer: "Attack on Titan",
    options: ["Attack on Titan", "Demon Slayer", "Tokyo Ghoul", "Sword Art Online"],
    answers: ["Attack on Titan", "shingeki no kyojin", "aot", "shingeki", "eren", "titan"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQigobSp1b1DRmp6xeC4hcycUCRnUXcP3XQTxdkHxd14w&s=10",
    hint: "Хүмүүсийг хорьсон аварга том хана болон титануудын эсрэг тэмцэл."
  },
  {
    id: 4,
    emojis: "👹⚔️🌊🐗",
    answer: "Demon Slayer",
    options: ["Jujutsu Kaisen", "Demon Slayer", "Bleach", "Inuyasha"],
    answers: ["Demon Slayer", "kimetsu no yaiba", "kny", "tanjiro", "nezuko", "demon slayer: kimetsu no yaiba"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0fMxjRck-hY6tdV_nW-SnIWjFEvO3SGjYc77oCHjPUg&s=10",
    hint: "Чөтгөр болсон дүүгээ аврахаар аялах ахын түүх."
  },
  {
    id: 5,
    emojis: "🍎📓💀✍️",
    answer: "Death Note",
    options: ["Death Note", "Code Geass", "Monster", "Psycho-Pass"],
    answers: ["Death Note", "deathnote", "kira", "ryuk", "l"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpOLVy0U6crYHcVgslALqMlGgGe5t9ycdVLj0jtfERjQ&s=10",
    hint: "Нэрээ бичсэн хүнээ үхүүлдэг нууцлаг дэвтэр ба суут ухаантнуудын тэмцэл."
  },
  {
    id: 6,
    emojis: "🥦🦸💥🏫",
    answer: "My Hero Academia",
    options: ["My Hero Academia", "One Punch Man", "Black Clover", "Mob Psycho 100"],
    answers: ["My Hero Academia", "mha", "bnha", "boku no hero academia", "deku", "all might"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ5m7Cz3MqjUYlYZAH2r2pw1M0wLlZAIZaSw_XsUDAjQ&s=10",
    hint: "Хүн бүр онцгой хүчтэй төрдөг ертөнц дэх хүчгүй хүүгийн баатарлаг аялал."
  },
  {
    id: 7,
    emojis: "🐉🟠☄️🥋",
    answer: "Dragon Ball",
    options: ["Dragon Ball", "Naruto", "One Piece", "Bleach"],
    answers: ["Dragon Ball", "dbz", "dragon ball z", "goku", "dragonball", "super saiyan"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPOw2RvQ2PL8hInBAMTx3eK3imEGUefhgkxOJjfvHRCw&s=10",
    hint: "Долоон шидэт бөмбөгийг цуглуулан лууг дуудаж хүслээ биелүүлэх аялал."
  },
  {
    id: 8,
    emojis: "🤞👁️👅🏫",
    answer: "Jujutsu Kaisen",
    options: ["Jujutsu Kaisen", "Chainsaw Man", "Bleach", "Hunter x Hunter"],
    answers: ["Jujutsu Kaisen", "jjk", "gojo", "sukuna", "itadori", "cursed energy"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh3hSw1X2eKkBBNgd3rEtwENN-wnk38NLfJMpUoPiNlw&s=10",
    hint: "Хараалтай хурууг залгиж, хараалын эсрэг сургуульд элссэн хүүгийн түүх."
  }
];

export function AnimeGuesser() {
  // Game states: 'setup' | 'playing' | 'revealed' | 'gameover'
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'revealed' | 'gameover'>('setup');
  const [playerName, setPlayerName] = useState('');
  const [gameMode, setGameMode] = useState<'multiple_choice' | 'typing'>('multiple_choice');
  
  // Gameplay stats
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Timers and interactive control states
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [shakeTrigger, setShakeTrigger] = useState(false);
  const [streakBonusAwarded, setStreakBonusAwarded] = useState(false);

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('anime_guesser_leaderboard');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentQuestion = ANIME_QUESTIONS[currentQuestionIndex];

  // Synthesized audio system using Web Audio API
  const playSynthesizedSound = (type: 'ding' | 'buzz' | 'bonus' | 'click' | 'gameover') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === 'ding') {
        const now = ctx.currentTime;
        const freqs = [523.25, 659.25, 880]; // C5, E5, A5 chime
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.12, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.4);
        });
      } else if (type === 'buzz') {
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(130, now);
        osc1.frequency.linearRampToValueAtTime(85, now + 0.28);
        
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(127, now); // slightly detuned
        osc2.frequency.linearRampToValueAtTime(82, now + 0.28);
        
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.28);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.29);
        osc2.stop(now + 0.29);
      } else if (type === 'bonus') {
        const now = ctx.currentTime;
        // Rising synth flourish
        [330, 440, 554, 659, 880, 1109].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);
          gain.gain.setValueAtTime(0.08, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.3);
        });
      } else if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      } else if (type === 'gameover') {
        const now = ctx.currentTime;
        [440, 349, 293, 220].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0.12, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.45);
        });
      }
    } catch (e) {
      // Audio context error or blocked
    }
  };

  // Start the Game
  const startGame = () => {
    if (!playerName.trim()) {
      alert('Тоглоомыг эхлэхийн тулд нэрээ оруулна уу!');
      return;
    }
    playSynthesizedSound('click');
    setGameState('playing');
    setScore(0);
    setLives(3);
    setStreak(0);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setTypedAnswer('');
    setIsAnswerCorrect(null);
    setTimeLeft(15);
    setStreakBonusAwarded(false);
  };

  // Standard normalize logic (removing whitespace, lowercase)
  const normalizeText = (text: string): string => {
    return text.trim().toLowerCase().replace(/\s+/g, '');
  };

  // Process selected or typed answer
  const checkAnswer = (answerText: string) => {
    if (gameState !== 'playing') return;

    if (timerRef.current) clearInterval(timerRef.current);

    const userAnsNormalized = normalizeText(answerText);
    
    // Check if user's input matches any item in the answers list
    const isCorrect = currentQuestion.answers.some(
      (validAns) => normalizeText(validAns) === userAnsNormalized
    );

    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      // Correct! +5 points
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      playSynthesizedSound('ding');
      
      let scoreGain = 5;
      // Streak of 3 bonus (+20 points)
      if (nextStreak > 0 && nextStreak % 3 === 0) {
        scoreGain += 20;
        setStreakBonusAwarded(true);
        playSynthesizedSound('bonus');
      } else {
        setStreakBonusAwarded(false);
      }
      setScore((prev) => prev + scoreGain);
    } else {
      // Incorrect!
      setStreak(0);
      setStreakBonusAwarded(false);
      setLives((l) => l - 1);
      setShakeTrigger(true);
      playSynthesizedSound('buzz');
      setTimeout(() => setShakeTrigger(false), 500);
    }

    setGameState('revealed');
  };

  // Triggered when options clicked (Multiple Choice)
  const handleOptionClick = (option: string) => {
    if (selectedOption || gameState !== 'playing') return;
    setSelectedOption(option);
    checkAnswer(option);
  };

  // Triggered when text submitted (Typing Guess Mode)
  const handleTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedAnswer.trim() || gameState !== 'playing') return;
    checkAnswer(typedAnswer);
  };

  // Next Question trigger
  const handleNextQuestion = () => {
    playSynthesizedSound('click');
    setStreakBonusAwarded(false);

    // If lives are depleted, end game
    if (lives <= 0) {
      endGame();
      return;
    }

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= ANIME_QUESTIONS.length) {
      // No more questions! Save score and end game
      endGame();
    } else {
      setCurrentQuestionIndex(nextIndex);
      setSelectedOption(null);
      setTypedAnswer('');
      setIsAnswerCorrect(null);
      setTimeLeft(15);
      setGameState('playing');
    }
  };

  // End Game and Save to Leaderboard
  const endGame = () => {
    setGameState('gameover');
    playSynthesizedSound('gameover');

    // Save score
    const newEntry: LeaderboardEntry = {
      name: playerName.trim() || 'Тоглогч',
      score: score,
      date: new Date().toISOString().split('T')[0],
      mode: gameMode
    };

    setLeaderboard((prev) => {
      const updated = [...prev, newEntry];
      // Sort descendingly by score (DEEREES DOOSHOO JAGSAADAG)
      const sorted = updated.sort((a, b) => b.score - a.score);
      localStorage.setItem('anime_guesser_leaderboard', JSON.stringify(sorted));
      return sorted;
    });
  };

  // Countdown timer effect
  useEffect(() => {
    if (gameState !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          
          // Timeout = Incorrect, lose life
          setIsAnswerCorrect(false);
          setStreak(0);
          setStreakBonusAwarded(false);
          setLives((l) => l - 1);
          setShakeTrigger(true);
          playSynthesizedSound('buzz');
          setTimeout(() => setShakeTrigger(false), 500);
          setGameState('revealed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentQuestionIndex]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 md:p-8 overflow-y-auto max-h-full font-sans bg-[#0c0c0c] text-[#E1E0CC]">
      <AnimatePresence mode="wait">
        
        {/* STAGE 1: SETUP NAME / CHOOSE MODE */}
        {gameState === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-lg mx-auto bg-[#121212] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-2xl relative my-auto"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 border border-primary/20 shadow-lg shadow-primary/5">
              <Trophy className="w-8 h-8 animate-pulse text-primary" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 text-center">
              Anime Guesser 🧠✨
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm font-light text-center mb-8 max-w-sm">
              Эможинуудыг хараад аниме-ийн нэрийг таана уу. Сонгох болон бичих сонирхолтой горимууд!
            </p>

            <div className="w-full space-y-5 mb-8">
              {/* Name Input */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
                  Тоглогчийн Нэр:
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value.slice(0, 16))}
                    placeholder="Нэрээ энд бичнэ үү..."
                    className="w-full bg-black/60 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium text-white focus:outline-none focus:border-primary/50 placeholder:text-gray-600 transition-colors"
                  />
                </div>
              </div>

              {/* Game Mode Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
                  Тоглоомын Горим:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => { playSynthesizedSound('click'); setGameMode('multiple_choice'); }}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all cursor-pointer ${
                      gameMode === 'multiple_choice'
                        ? 'bg-primary/10 border-primary text-white shadow-lg shadow-primary/5'
                        : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/10'
                    }`}
                  >
                    <Play className="w-5 h-5 text-primary" />
                    <span className="text-xs font-bold">4 Сонголттой</span>
                    <span className="text-[9px] text-gray-500 text-center font-light">Асуулт бүр 4 сонголтоос сонгох</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { playSynthesizedSound('click'); setGameMode('typing'); }}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all cursor-pointer ${
                      gameMode === 'typing'
                        ? 'bg-primary/10 border-primary text-white shadow-lg shadow-primary/5'
                        : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/10'
                    }`}
                  >
                    <Keyboard className="w-5 h-5 text-primary" />
                    <span className="text-xs font-bold">Гарнаас Бичих</span>
                    <span className="text-[9px] text-gray-500 text-center font-light">Шууд нэрийг бичиж таах (Хэцүү)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startGame}
              className="w-full bg-primary text-black font-semibold text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer shadow-lg shadow-primary/10"
            >
              <span>ТОГЛООМЫГ ЭХЛЭХ</span>
              <ArrowRight className="w-4 h-4 fill-black" />
            </button>
          </motion.div>
        )}

        {/* STAGE 2: GAMEPLAY (PLAYING OR REVEALED) */}
        {(gameState === 'playing' || gameState === 'revealed') && (
          <motion.div
            key="gameplay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-3xl mx-auto flex flex-col gap-6"
          >
            {/* GAMEPLAY HUD HEADER */}
            <div className="flex justify-between items-center bg-[#121212] border border-white/5 p-4 rounded-2xl shadow-xl">
              {/* Player & Lives */}
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 text-[10px] font-mono leading-none uppercase">ТОГЛОГЧ: {playerName}</span>
                <div className="flex items-center gap-1.5 mt-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-4 h-4 ${
                        i < lives ? 'text-red-500 fill-red-500 animate-pulse' : 'text-zinc-700'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-mono ml-1 text-gray-400">({lives}/3)</span>
                </div>
              </div>

              {/* Score & Streak */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-gray-500 text-[10px] font-mono leading-none uppercase block">ОНОО</span>
                  <span className="text-primary text-lg font-mono font-bold">{score}</span>
                </div>

                <div className="border-l border-white/10 pl-4 text-right flex flex-col items-end">
                  <span className="text-gray-500 text-[10px] font-mono leading-none uppercase block">ДАРААЛСАН</span>
                  <span className="text-white text-sm font-mono font-semibold flex items-center gap-1">
                    {streak > 0 ? (
                      <span className="text-orange-500 font-bold animate-bounce flex items-center">
                        🔥 {streak}
                      </span>
                    ) : (
                      '0'
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* QUESTION CONTAINER */}
            <div className="bg-[#121212] border border-white/5 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col items-center min-h-[300px] justify-center transition-all duration-300">
              
              {/* Timer bar */}
              {gameState === 'playing' && (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/40">
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: `${(timeLeft / 15) * 100}%` }}
                    transition={{ duration: 1, ease: 'linear' }}
                    className={`h-full ${
                      timeLeft <= 4 ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-primary'
                    }`}
                  />
                </div>
              )}

              {/* Question Index Badge */}
              {gameState === 'playing' && (
                <span className="text-primary text-[10px] font-mono tracking-[0.25em] uppercase bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-4 select-none">
                  АСУУЛТ {currentQuestionIndex + 1} / {ANIME_QUESTIONS.length}
                </span>
              )}

              {/* Timer Countdown Numeric */}
              {gameState === 'playing' && (
                <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400 mb-2">
                  <Timer className={`w-3.5 h-3.5 ${timeLeft <= 4 ? 'text-red-500 animate-spin' : 'text-primary'}`} />
                  <span className={timeLeft <= 4 ? 'text-red-500 font-bold animate-pulse' : 'text-white'}>
                    Үлдсэн хугацаа: {timeLeft}с
                  </span>
                </div>
              )}

              {/* Emojis Display - STIMULATING GIANT SHAKE EFFECT IF INCORRECT */}
              {gameState === 'playing' && (
                <motion.div
                  animate={shakeTrigger ? { x: [0, -12, 12, -12, 12, -8, 8, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="text-5xl sm:text-6xl md:text-7xl py-6 tracking-widest filter drop-shadow-[0_4px_12px_rgba(255,255,255,0.05)] select-none text-center"
                >
                  {currentQuestion.emojis}
                </motion.div>
              )}

              {/* Hint */}
              {gameState === 'playing' && (
                <p className="text-gray-400 text-[11px] sm:text-xs text-center italic font-light max-w-md px-4 mt-1 border-t border-white/5 pt-3">
                  Хинт: "{currentQuestion.hint}"
                </p>
              )}

              {/* Streak Bonus Inline Indicator in a corner */}
              <AnimatePresence>
                {streakBonusAwarded && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                    className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-amber-500 text-black text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-orange-500/20 z-30"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-black" style={{ animationDuration: '4s' }} />
                    <span>СТРИК БОНУС +20! 🔥</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* TRANSITIONING ANSWER REVEAL SCREEN: Just the glorious Anime Image */}
              <AnimatePresence mode="wait">
                {gameState === 'revealed' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full mt-6 border-t border-white/5 pt-6 flex flex-col items-center"
                  >
                    {/* Anime Image Card - NOW AT THE TOP, LARGE & UNCROPPED (object-contain) */}
                    <div className="w-full max-w-xl mx-auto mb-6">
                      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/90 flex items-center justify-center shadow-2xl p-2 min-h-[220px] max-h-[400px]">
                        <img
                          src={currentQuestion.image}
                          alt={currentQuestion.answer}
                          referrerPolicy="no-referrer"
                          className="max-w-full max-h-[380px] object-contain rounded-xl animate-fade-in transition-all duration-500 hover:scale-[1.02]"
                        />
                        <div className="absolute top-4 left-4 text-[9px] font-mono uppercase bg-black/80 px-2.5 py-1 rounded-full text-primary/80 border border-white/10 tracking-widest">
                          Anime Illustration
                        </div>
                      </div>
                    </div>

                    {/* ANSWER DISPLAY - NOW VERY LARGE & BOLD BELOW THE IMAGE */}
                    <div className="mb-4 flex flex-col items-center text-center">
                      {isAnswerCorrect ? (
                        <div className="bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-6 py-2 text-sm sm:text-base font-black tracking-widest uppercase mb-3 animate-bounce">
                          🎉 ЗӨВ ХАРИУЛЛАА! (+5 ОНОО)
                        </div>
                      ) : (
                        <div className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-6 py-2 text-sm sm:text-base font-black tracking-widest uppercase mb-3">
                          ❌ БУРУУ ЭСВЭЛ ХУГАЦАА ДУУССАН!
                        </div>
                      )}
                      
                      <div className="text-gray-400 text-xs font-mono uppercase tracking-widest mb-1">ЗӨВ ХАРИУЛТ:</div>
                      <h3 className="text-3xl sm:text-4xl font-black text-primary tracking-tight uppercase filter drop-shadow-[0_2px_8px_rgba(255,255,0,0.15)]">
                        {currentQuestion.answer}
                      </h3>
                      
                      <p className="text-gray-500 text-[11px] font-mono mt-2.5 text-center max-w-md">
                        Зөвшөөрөгдөх хувилбарууд: <span className="text-gray-300 font-semibold">{currentQuestion.answers.join(', ')}</span>
                      </p>
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={handleNextQuestion}
                      className="mt-6 bg-primary text-black font-semibold text-xs px-6 py-3 rounded-full flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-primary/20"
                    >
                      <span>Дараагийн асуулт</span>
                      <ArrowRight className="w-3.5 h-3.5 fill-black" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* INTERACTIVE INTERFACES: OPTIONS OR TYPING */}
            {gameState === 'playing' && (
              <div className="w-full">
                
                {/* CHOICE INTERFACE A: MULTIPLE CHOICE */}
                {gameMode === 'multiple_choice' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = selectedOption === option;
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={selectedOption !== null}
                          onClick={() => handleOptionClick(option)}
                          className={`w-full text-left p-4 sm:p-5 rounded-2xl border font-medium text-xs sm:text-sm tracking-wide transition-all duration-300 cursor-pointer flex justify-between items-center relative overflow-hidden group ${
                            selectedOption === null
                              ? 'bg-[#121212] border-white/5 text-gray-300 hover:scale-[1.03] hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:text-white'
                              : isSelected
                              ? isAnswerCorrect
                                ? 'bg-green-600 border-green-400 text-white shadow-lg shadow-green-500/20'
                                : 'bg-red-600 border-red-400 text-white shadow-lg shadow-red-500/20'
                              : 'bg-zinc-950 border-white/5 text-zinc-600 opacity-50'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-[10px] text-gray-400 group-hover:border-primary/40 group-hover:text-primary">
                              {idx + 1}
                            </span>
                            <span>{option}</span>
                          </span>

                          <span className="text-[10px] font-mono text-gray-600 uppercase group-hover:text-primary/70">
                            SELECT
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  
                  /* CHOICE INTERFACE B: TEXT TYPING MODE */
                  <form onSubmit={handleTypeSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={typedAnswer}
                      onChange={(e) => setTypedAnswer(e.target.value)}
                      placeholder="Анимэ-ийн нэрийг бичээд Энтер дарна уу..."
                      className="flex-1 bg-[#121212] border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium text-white focus:outline-none focus:border-primary/50 placeholder:text-gray-600 transition-colors"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={!typedAnswer.trim()}
                      className="bg-primary text-black font-semibold text-xs px-6 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                    >
                      Хариулах
                    </button>
                  </form>
                )}

              </div>
            )}
          </motion.div>
        )}

        {/* STAGE 3: GAME OVER STATS & SCORE BOARD */}
        {gameState === 'gameover' && (
          <motion.div
            key="gameover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl mx-auto flex flex-col gap-6 my-auto"
          >
            {/* STATS OVERVIEW CARD */}
            <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
              
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4 border border-red-500/20">
                <ShieldAlert className="w-6 h-6 animate-bounce" />
              </div>

              <h4 className="text-xl sm:text-2xl font-bold text-white mb-1">Тоглоом дууслаа!</h4>
              <p className="text-xs text-gray-500 font-mono uppercase mb-6">Хувийн дүн хадгалагдлаа</p>

              {/* Score Display */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm bg-black/40 border border-white/5 rounded-2xl p-4 mb-6 text-xs font-mono">
                <div className="text-left flex flex-col gap-1.5 border-r border-white/5 pr-4">
                  <span className="text-gray-500 uppercase leading-none">Тоглогч:</span>
                  <span className="text-white font-bold truncate">{playerName}</span>
                  <span className="text-gray-500 uppercase leading-none mt-1">Горим:</span>
                  <span className="text-primary font-semibold uppercase text-[10px]">
                    {gameMode === 'typing' ? 'Гарнаас Бичих' : 'Сонгох'}
                  </span>
                </div>

                <div className="text-right flex flex-col justify-center items-end pl-4">
                  <span className="text-gray-500 uppercase leading-none mb-1">Нийт Оноо:</span>
                  <span className="text-3xl text-primary font-bold font-mono leading-none">
                    {score}
                  </span>
                  <span className="text-gray-600 text-[10px] uppercase font-mono mt-1 leading-none">PTS</span>
                </div>
              </div>

              {/* Play again options */}
              <div className="flex gap-3 w-full max-w-sm">
                <button
                  onClick={startGame}
                  className="flex-1 bg-primary text-black font-semibold text-xs py-3 rounded-full hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-lg shadow-primary/15"
                >
                  Дахин Тоглох
                </button>
                <button
                  onClick={() => setGameState('setup')}
                  className="flex-1 border border-white/10 bg-white/5 text-gray-300 font-semibold text-xs py-3 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Тохиргоо руу
                </button>
              </div>
            </div>

            {/* LEADERBOARD VIEW - SORTED DECREASINGLY */}
            <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl relative">
              <h4 className="text-sm font-mono uppercase tracking-widest text-primary font-bold flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <Trophy className="w-4 h-4 text-primary animate-pulse" />
                <span>Тэргүүлэгчдийн Самбар (Leaderboard)</span>
              </h4>

              {leaderboard.length === 0 ? (
                <p className="text-xs text-gray-500 text-center font-mono py-6">
                  Одоогоор оноо бүртгэгдээгүй байна.
                </p>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {leaderboard.slice(0, 10).map((entry, idx) => {
                    const isCurrentUser = entry.name === playerName && entry.score === score;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                          isCurrentUser
                            ? 'bg-primary/10 border-primary text-white'
                            : 'bg-black/30 border-white/5 text-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Rank Icon or number */}
                          <div className="w-6 h-6 rounded-full bg-black/60 flex items-center justify-center font-mono text-[10px] font-bold text-white shrink-0">
                            {idx === 0 ? '🏆' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                          </div>

                          <div className="flex flex-col">
                            <span className={`text-xs font-bold leading-none ${isCurrentUser ? 'text-white' : 'text-gray-300'}`}>
                              {entry.name}
                            </span>
                            <span className="text-[9px] text-gray-600 font-mono mt-0.5">
                              {entry.date} • {entry.mode === 'typing' ? 'Бичих' : 'Сонгох'}
                            </span>
                          </div>
                        </div>

                        <span className="text-sm font-mono font-bold text-primary">
                          {entry.score} оноо
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {leaderboard.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Та тэргүүлэгчдийн самбарын түүхийг устгахдаа итгэлтэй байна уу?')) {
                      localStorage.removeItem('anime_guesser_leaderboard');
                      setLeaderboard([]);
                    }
                  }}
                  className="text-gray-600 hover:text-red-400 font-mono text-[9px] tracking-widest uppercase transition-colors hover:underline cursor-pointer self-center mt-4"
                >
                  Clear Leaderboard Records
                </button>
              )}
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
