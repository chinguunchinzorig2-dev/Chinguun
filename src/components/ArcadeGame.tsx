import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, RotateCcw, Trophy, Target, Zap, Award, Sparkles, Coins, ShoppingBag, Flame, Star, Gamepad2 } from 'lucide-react';

interface TargetItem {
  id: number;
  x: number;
  y: number;
  size: number;
  type: 'villain' | 'gold' | 'bomb';
  createdAt: number;
  duration: number;
}

interface ClickerUpgrade {
  id: string;
  name: string;
  cost: number;
  cps: number; // clicks per second
  cpc: number; // clicks per click
  owned: number;
  icon: string;
  desc: string;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
}

interface ArcadeGameProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'menu' | 'shooter' | 'runner' | 'clicker' | 'game3d';
}

export function ArcadeGame({ isOpen, onClose, initialTab = 'menu' }: ArcadeGameProps) {
  // Game states: 'menu' | 'shooter' | 'runner' | 'clicker' | 'game3d'
  const [activeTab, setActiveTab] = useState<'menu' | 'shooter' | 'runner' | 'clicker' | 'game3d'>('menu');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Shared stats
  const [highScoreShooter, setHighScoreShooter] = useState(() => {
    const saved = localStorage.getItem('chinguun_high_shooter');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [highScoreRunner, setHighScoreRunner] = useState(() => {
    const saved = localStorage.getItem('chinguun_high_runner');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [highScoreGame3D, setHighScoreGame3D] = useState(() => {
    const saved = localStorage.getItem('chinguun_high_game3d');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Sound Synthesizer using Web Audio API
  const playSynthSound = (type: 'hit' | 'gold' | 'bomb' | 'jump' | 'click' | 'upgrade' | 'gameover' | 'start') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === 'hit') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(580, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'gold') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(750, ctx.currentTime);
        osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } else if (type === 'bomb') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'jump') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'upgrade') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.setValueAtTime(900, ctx.currentTime + 0.08);
        osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'start') {
        [220, 330, 440, 660].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.value = f;
          gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.06);
          gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + i * 0.06 + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.06);
          osc.stop(ctx.currentTime + i * 0.06 + 0.1);
        });
      } else if (type === 'gameover') {
        [500, 380, 260, 180].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.value = f;
          gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.08);
          gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.08);
          osc.stop(ctx.currentTime + i * 0.08 + 0.12);
        });
      }
    } catch (e) {
      // Audio blocked or unsupported
    }
  };

  // ==========================================
  // GAME 1: WEB REFLEX SHOOTER LOGIC
  // ==========================================
  const [shooterState, setShooterState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [shooterScore, setShooterScore] = useState(0);
  const [shooterTimeLeft, setShooterTimeLeft] = useState(30);
  const [shooterTargets, setShooterTargets] = useState<TargetItem[]>([]);
  const [shooterParticles, setShooterParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [shooterCombo, setShooterCombo] = useState(0);
  const [shooterFeedback, setShooterFeedback] = useState<string | null>(null);

  const shooterGameInterval = useRef<NodeJS.Timeout | null>(null);
  const shooterTimerInterval = useRef<NodeJS.Timeout | null>(null);
  const shooterTargetId = useRef(0);

  const startShooter = () => {
    playSynthSound('start');
    setShooterState('playing');
    setShooterScore(0);
    setShooterTimeLeft(30);
    setShooterCombo(0);
    setShooterTargets([]);
    setShooterParticles([]);
    setShooterFeedback("MISSION INITIATED!");
    setTimeout(() => setShooterFeedback(null), 1200);

    shooterTimerInterval.current = setInterval(() => {
      setShooterTimeLeft((prev) => {
        if (prev <= 1) {
          endShooter();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    shooterGameInterval.current = setInterval(() => {
      spawnShooterTarget();
    }, 600);
  };

  const spawnShooterTarget = () => {
    const r = Math.random();
    let type: 'villain' | 'gold' | 'bomb' = 'villain';
    let duration = 2000;

    if (r < 0.22) {
      type = 'gold';
      duration = 1300;
    } else if (r < 0.38) {
      type = 'bomb';
      duration = 2400;
    }

    const newTarget: TargetItem = {
      id: shooterTargetId.current++,
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 15,
      size: type === 'gold' ? 52 : type === 'bomb' ? 64 : 58,
      type,
      createdAt: Date.now(),
      duration,
    };

    setShooterTargets((prev) => [...prev, newTarget]);
    setTimeout(() => {
      setShooterTargets((prev) => prev.filter((t) => t.id !== newTarget.id));
    }, duration);
  };

  const endShooter = () => {
    if (shooterGameInterval.current) clearInterval(shooterGameInterval.current);
    if (shooterTimerInterval.current) clearInterval(shooterTimerInterval.current);
    playSynthSound('gameover');
    setShooterState('gameover');
    setShooterTargets([]);
  };

  const handleShooterTargetClick = (target: TargetItem, e: React.MouseEvent) => {
    e.stopPropagation();
    playSynthSound(target.type === 'gold' ? 'gold' : target.type === 'bomb' ? 'bomb' : 'hit');

    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (rect) {
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const newParts = Array.from({ length: 12 }).map((_, i) => ({
        id: Math.random() + i,
        x: clickX,
        y: clickY,
        color: target.type === 'gold' ? '#DEDBC8' : target.type === 'bomb' ? '#ef4444' : '#E1E0CC',
      }));
      setShooterParticles((prev) => [...prev, ...newParts]);
      setTimeout(() => {
        setShooterParticles((prev) => prev.filter((p) => !newParts.find((np) => np.id === p.id)));
      }, 500);
    }

    if (target.type === 'villain') {
      const mult = shooterCombo >= 5 ? 2 : 1;
      setShooterScore((prev) => prev + 10 * mult);
      setShooterCombo((prev) => prev + 1);
    } else if (target.type === 'gold') {
      setShooterScore((prev) => prev + 35);
      setShooterCombo((prev) => prev + 1);
      setShooterFeedback("SUPER DING! +35");
      setTimeout(() => setShooterFeedback(null), 1000);
    } else if (target.type === 'bomb') {
      setShooterScore((prev) => Math.max(0, prev - 25));
      setShooterCombo(0);
      setShooterFeedback("BOMB TRIPPED! -25");
      setTimeout(() => setShooterFeedback(null), 1200);
    }

    setShooterTargets((prev) => prev.filter((t) => t.id !== target.id));
  };

  useEffect(() => {
    if (shooterState === 'gameover') {
      if (shooterScore > highScoreShooter) {
        setHighScoreShooter(shooterScore);
        localStorage.setItem('chinguun_high_shooter', shooterScore.toString());
      }
    }
  }, [shooterState, shooterScore]);

  // ==========================================
  // GAME 2: SPIDER-SWING RUNNER LOGIC (CANVAS)
  // ==========================================
  const [runnerState, setRunnerState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [runnerScore, setRunnerScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const runnerAnimationId = useRef<number | null>(null);

  // Simple physics & entity states for Runner
  const playerY = useRef(180);
  const playerVelocity = useRef(0);
  const isSwinging = useRef(false);
  const obstaclesRef = useRef<{ x: number; y: number; size: number; passed: boolean }[]>([]);
  const coinsRef = useRef<{ x: number; y: number; size: number; collected: boolean }[]>([]);
  const runnerDistance = useRef(0);
  const lastSpawnTime = useRef(0);

  const startRunner = () => {
    playSynthSound('start');
    setRunnerState('playing');
    setRunnerScore(0);
    playerY.current = 150;
    playerVelocity.current = 0;
    isSwinging.current = false;
    obstaclesRef.current = [];
    coinsRef.current = [];
    runnerDistance.current = 0;
    lastSpawnTime.current = Date.now();
  };

  const endRunner = () => {
    if (runnerAnimationId.current) {
      cancelAnimationFrame(runnerAnimationId.current);
    }
    playSynthSound('gameover');
    setRunnerState('gameover');
  };

  useEffect(() => {
    if (runnerState === 'gameover') {
      if (runnerScore > highScoreRunner) {
        setHighScoreRunner(runnerScore);
        localStorage.setItem('chinguun_high_runner', runnerScore.toString());
      }
    }
  }, [runnerState, runnerScore]);

  // Handle touch/click on the runner canvas to Jump/Swing
  const handleRunnerCanvasAction = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (runnerState !== 'playing') return;
    isSwinging.current = true;
    playerVelocity.current = -5.5; // pull upward instantly like a web zip
    playSynthSound('jump');
  };

  const handleRunnerRelease = () => {
    isSwinging.current = false;
  };

  // Main Canvas animation render loop
  useEffect(() => {
    if (runnerState !== 'playing' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localId: number;

    const updateGameFrame = () => {
      // 1. Clear Frame
      ctx.fillStyle = '#090909';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw horizontal alignment lines (cinematic scanlines)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw visual roof anchor line
      ctx.strokeStyle = 'rgba(222, 219, 200, 0.15)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.lineTo(canvas.width, 10);
      ctx.stroke();

      // 2. Apply Gravity/Movement
      const gravity = 0.28;
      const pullUpForce = 0.55;

      if (isSwinging.current) {
        playerVelocity.current -= pullUpForce;
        if (playerVelocity.current < -7) playerVelocity.current = -7;
      } else {
        playerVelocity.current += gravity;
        if (playerVelocity.current > 7) playerVelocity.current = 7;
      }

      playerY.current += playerVelocity.current;

      // Bound player inside canvas
      if (playerY.current < 25) {
        playerY.current = 25;
        playerVelocity.current = 0;
      }
      if (playerY.current > canvas.height - 25) {
        playerY.current = canvas.height - 25;
        playerVelocity.current = 0;
      }

      // 3. Draw Spider-Man Web Rope if swinging
      if (isSwinging.current) {
        ctx.strokeStyle = '#DEDBC8';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#DEDBC8';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(100, playerY.current);
        ctx.lineTo(130, 10); // anchor slightly ahead
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      }

      // 4. Draw Player Spider-Man (Minimalist Glowing Red Core with Spider Eyes)
      const px = 100;
      const py = playerY.current;

      // Glow Aura
      const glowGrad = ctx.createRadialGradient(px, py, 2, px, py, 20);
      glowGrad.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
      glowGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(px, py, 20, 0, Math.PI * 2);
      ctx.fill();

      // Core red head
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(px, py, 12, 0, Math.PI * 2);
      ctx.fill();

      // Spider Web Mask Lines
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px - 12, py);
      ctx.lineTo(px + 12, py);
      ctx.moveTo(px, py - 12);
      ctx.lineTo(px, py + 12);
      ctx.stroke();

      // White eyes
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(px - 4, py - 3, 3, 5, -Math.PI / 6, 0, Math.PI * 2);
      ctx.ellipse(px + 4, py - 3, 3, 5, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      // 5. Spawn Entities (Coins and Bombs)
      const now = Date.now();
      const speed = 4.2 + (runnerDistance.current * 0.0005); // ramp up speed slowly

      if (now - lastSpawnTime.current > 1400) {
        lastSpawnTime.current = now;
        // Spawn Obstacle (Green Goblin pumpkin bomb)
        obstaclesRef.current.push({
          x: canvas.width + 30,
          y: Math.random() * (canvas.height - 80) + 40,
          size: 16,
          passed: false,
        });

        // Spawn gold star/coin nearby
        coinsRef.current.push({
          x: canvas.width + 120,
          y: Math.random() * (canvas.height - 80) + 40,
          size: 10,
          collected: false,
        });
      }

      // 6. Update & Draw Obstacles
      ctx.shadowBlur = 0;
      obstaclesRef.current.forEach((obs) => {
        obs.x -= speed;

        // Draw Pumpkin Bomb
        ctx.fillStyle = '#f97316'; // Orange pumpkin
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, obs.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow ring around bomb
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, obs.size + 4, 0, Math.PI * 2);
        ctx.stroke();

        // Evil green eyes on bomb
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(obs.x - 4, obs.y - 2, 2, 0, Math.PI * 2);
        ctx.arc(obs.x + 4, obs.y - 2, 2, 0, Math.PI * 2);
        ctx.fill();

        // Check Collision (Simple circular bounds)
        const dist = Math.hypot(px - obs.x, py - obs.y);
        if (dist < 12 + obs.size) {
          // HIT! GameOver
          endRunner();
        }

        // Score for passing
        if (!obs.passed && obs.x < px) {
          obs.passed = true;
          setRunnerScore((s) => s + 5);
        }
      });

      // Remove out-of-screen obstacles
      obstaclesRef.current = obstaclesRef.current.filter((o) => o.x > -50);

      // 7. Update & Draw Coins
      coinsRef.current.forEach((coin) => {
        coin.x -= speed;

        if (!coin.collected) {
          // Star core
          ctx.fillStyle = '#DEDBC8';
          ctx.shadowColor = '#DEDBC8';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(coin.x, coin.y, coin.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset

          // Ring
          ctx.strokeStyle = 'rgba(222, 219, 200, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(coin.x, coin.y, coin.size + 4, 0, Math.PI * 2);
          ctx.stroke();

          // Check Collect Collision
          const dist = Math.hypot(px - coin.x, py - coin.y);
          if (dist < 12 + coin.size + 4) {
            coin.collected = true;
            playSynthSound('gold');
            setRunnerScore((s) => s + 25);
          }
        }
      });

      // Clean up collected/out-of-bound coins
      coinsRef.current = coinsRef.current.filter((c) => c.x > -50 && !c.collected);

      // Increment progress / score over distance
      runnerDistance.current += 1;
      if (runnerDistance.current % 35 === 0) {
        setRunnerScore((s) => s + 1);
      }

      // HUD Text overlay directly on canvas
      ctx.fillStyle = 'rgba(225, 224, 204, 0.5)';
      ctx.font = '10px monospace';
      ctx.fillText(`MTRX: ${Math.floor(runnerDistance.current)}m`, 20, 30);
      ctx.fillText(`SPEED: ${speed.toFixed(1)}km/h`, 20, 45);

      localId = requestAnimationFrame(updateGameFrame);
      runnerAnimationId.current = localId;
    };

    localId = requestAnimationFrame(updateGameFrame);
    runnerAnimationId.current = localId;

    return () => {
      cancelAnimationFrame(localId);
    };
  }, [runnerState]);

  // ==========================================
  // GAME 3: SPIDER-CLICKER LOGIC
  // ==========================================
  const [clickerState, setClickerState] = useState<'playing'>('playing');
  const [webFluid, setWebFluid] = useState(() => {
    const saved = localStorage.getItem('chinguun_clicker_fluid');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [clickerUpgrades, setClickerUpgrades] = useState<ClickerUpgrade[]>([
    {
      id: 'fluid_synth',
      name: 'Web Fluid Synthesizer',
      cost: 15,
      cps: 0.8,
      cpc: 0,
      owned: 0,
      icon: '🧪',
      desc: 'Automatic chemical synthesis. Generates +0.8 fluid per second.',
    },
    {
      id: 'upgrade_shooters',
      name: 'Enhanced Web Shooters',
      cost: 100,
      cps: 0,
      cpc: 3,
      owned: 0,
      icon: '⚙️',
      desc: 'Better nozzle pressure. Generates +3 fluid per click.',
    },
    {
      id: 'spidey_portal',
      name: 'Multiverse Spideys',
      cost: 400,
      cps: 8,
      cpc: 0,
      owned: 0,
      icon: '🌌',
      desc: 'Summons spider heroes from alternative universes. +8 fluid/sec.',
    },
    {
      id: 'stark_nanotech',
      name: 'Stark Nano-Suite Tech',
      cost: 2000,
      cps: 45,
      cpc: 0,
      owned: 0,
      icon: '🛡️',
      desc: 'State-of-the-art Tony Stark AI nanofiber. +45 fluid/sec.',
    },
  ]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const floatingIdCounter = useRef(0);

  // Click calculations
  const getFluidPerClick = () => {
    const clickPowerUpgrade = clickerUpgrades.find((u) => u.id === 'upgrade_shooters');
    const addedCpc = clickPowerUpgrade ? clickPowerUpgrade.owned * clickPowerUpgrade.cpc : 0;
    return 1 + addedCpc;
  };

  const getFluidPerSecond = () => {
    return clickerUpgrades.reduce((acc, u) => acc + (u.owned * u.cps), 0);
  };

  // Perform manual click on giant Spider logo
  const handleSpiderClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = getFluidPerClick();
    setWebFluid((prev) => prev + value);
    playSynthSound('click');

    // Generate floating feedback text
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + (Math.random() - 0.5) * 30;
    const y = e.clientY - rect.top + (Math.random() - 0.5) * 20;

    const newFloat: FloatingText = {
      id: floatingIdCounter.current++,
      x,
      y,
      text: `+${value} Fluid`,
      color: '#DEDBC8',
    };

    setFloatingTexts((prev) => [...prev, newFloat]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((f) => f.id !== newFloat.id));
    }, 1000);
  };

  // Buy item
  const buyClickerUpgrade = (upgradeId: string) => {
    const upgrade = clickerUpgrades.find((u) => u.id === upgradeId);
    if (!upgrade || webFluid < upgrade.cost) return;

    setWebFluid((prev) => prev - upgrade.cost);
    playSynthSound('upgrade');

    setClickerUpgrades((prev) =>
      prev.map((u) => {
        if (u.id === upgradeId) {
          return {
            ...u,
            owned: u.owned + 1,
            cost: Math.floor(u.cost * 1.35), // increase price for scaling
          };
        }
        return u;
      })
    );
  };

  // Handle auto CPS (Clicks Per Second) interval ticking
  useEffect(() => {
    const cps = getFluidPerSecond();
    if (cps === 0) return;

    const timer = setInterval(() => {
      setWebFluid((prev) => prev + cps / 10); // tick every 100ms
    }, 100);

    return () => clearInterval(timer);
  }, [clickerUpgrades]);

  // ==========================================
  // GAME 4: CYBER SWING 3D PERSPECTIVE LOGIC
  // ==========================================
  const [game3DState, setGame3DState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [game3DScore, setGame3DScore] = useState(0);
  const [game3DHealth, setGame3DHealth] = useState(100);
  const [game3DDistance, setGame3DDistance] = useState(0);

  const game3DCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const game3DAnimationId = useRef<number | null>(null);

  interface Obstacle3D {
    id: number;
    x: number;
    y: number;
    z: number;
    w: number;
    h: number;
    d: number;
    passed: boolean;
  }

  interface Ring3D {
    id: number;
    x: number;
    y: number;
    z: number;
    radius: number;
    collected: boolean;
  }

  const obstacles3DRef = useRef<Obstacle3D[]>([]);
  const rings3DRef = useRef<Ring3D[]>([]);
  const player3DXRef = useRef(0);
  const player3DYRef = useRef(0);
  const current3DXRef = useRef(0);
  const current3DYRef = useRef(0);
  const speed3DRef = useRef(7);
  const is3DRunningRef = useRef(false);

  const play3DSound = (type: 'hit' | 'gold' | 'bomb' | 'jump' | 'click' | 'gameover' | 'start') => {
    playSynthSound(type);
  };

  const startGame3D = () => {
    play3DSound('start');
    setGame3DState('playing');
    setGame3DScore(0);
    setGame3DHealth(100);
    setGame3DDistance(0);
    obstacles3DRef.current = [];
    rings3DRef.current = [];
    player3DXRef.current = 0;
    player3DYRef.current = 0;
    current3DXRef.current = 0;
    current3DYRef.current = 0;
    speed3DRef.current = 7;
    is3DRunningRef.current = true;
  };

  const endGame3D = () => {
    if (is3DRunningRef.current) {
      is3DRunningRef.current = false;
      play3DSound('gameover');
      setGame3DState('gameover');
      if (game3DAnimationId.current) cancelAnimationFrame(game3DAnimationId.current);
    }
  };

  useEffect(() => {
    if (game3DState !== 'playing' || !isOpen) return;

    const canvas = game3DCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localId: number;
    let width = (canvas.width = canvas.offsetWidth || 700);
    let height = (canvas.height = canvas.offsetHeight || 450);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const keysPressed: { [key: string]: boolean } = {};
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed[e.key] = true;
      keysPressed[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed[e.key] = false;
      keysPressed[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      player3DXRef.current = ((mouseX / width) - 0.5) * 440;
      player3DYRef.current = ((mouseY / height) - 0.5) * 320;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    let frameCount = 0;

    const updateAndRender = () => {
      if (!is3DRunningRef.current || !ctx || !canvas) return;

      frameCount++;
      setGame3DDistance((d) => d + 0.1);

      speed3DRef.current = 7 + Math.floor(frameCount / 300) * 0.8;

      if (keysPressed['ArrowLeft'] || keysPressed['KeyA']) player3DXRef.current -= 14;
      if (keysPressed['ArrowRight'] || keysPressed['KeyD']) player3DXRef.current += 14;
      if (keysPressed['ArrowUp'] || keysPressed['KeyW']) player3DYRef.current -= 14;
      if (keysPressed['ArrowDown'] || keysPressed['KeyS']) player3DYRef.current += 14;

      player3DXRef.current = Math.max(-220, Math.min(220, player3DXRef.current));
      player3DYRef.current = Math.max(-160, Math.min(160, player3DYRef.current));

      current3DXRef.current += (player3DXRef.current - current3DXRef.current) * 0.15;
      current3DYRef.current += (player3DYRef.current - current3DYRef.current) * 0.15;

      ctx.fillStyle = '#060606';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const fov = 300;

      ctx.strokeStyle = 'rgba(222, 219, 200, 0.04)';
      ctx.lineWidth = 1;
      const step = 40;
      const gridOffset = (frameCount * speed3DRef.current * 0.4) % step;

      for (let x = -600; x <= 600; x += 60) {
        ctx.beginPath();
        for (let z = 20; z < 600; z += 30) {
          const zPos = z - gridOffset;
          const scale = fov / (fov + zPos);
          const sx = cx + (x - current3DXRef.current) * scale;
          const sy = cy + (150 - current3DYRef.current) * scale;
          if (z === 20) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }

      for (let x = -600; x <= 600; x += 60) {
        ctx.beginPath();
        for (let z = 20; z < 600; z += 30) {
          const zPos = z - gridOffset;
          const scale = fov / (fov + zPos);
          const sx = cx + (x - current3DXRef.current) * scale;
          const sy = cy + (-150 - current3DYRef.current) * scale;
          if (z === 20) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }

      if (frameCount % 32 === 0) {
        obstacles3DRef.current.push({
          id: frameCount,
          x: (Math.random() - 0.5) * 440,
          y: (Math.random() - 0.5) * 320,
          z: 600,
          w: 45 + Math.random() * 30,
          h: 45 + Math.random() * 30,
          d: 60 + Math.random() * 60,
          passed: false,
        });
      }

      if (frameCount % 48 === 0) {
        rings3DRef.current.push({
          id: frameCount + 10000,
          x: (Math.random() - 0.5) * 320,
          y: (Math.random() - 0.5) * 240,
          z: 600,
          radius: 35,
          collected: false,
        });
      }

      obstacles3DRef.current.forEach((obs) => {
        obs.z -= speed3DRef.current;

        if (obs.z <= 15 && obs.z >= -35 && !obs.passed) {
          obs.passed = true;
          const xDist = Math.abs(current3DXRef.current - obs.x);
          const yDist = Math.abs(current3DYRef.current - obs.y);
          if (xDist < (obs.w / 2 + 15) && yDist < (obs.h / 2 + 15)) {
            play3DSound('bomb');
            setGame3DHealth((h) => {
              const nextHealth = Math.max(0, h - 25);
              if (nextHealth <= 0) {
                endGame3D();
              }
              return nextHealth;
            });
          }
        }

        if (obs.z > 5) {
          const hw = obs.w / 2;
          const hh = obs.h / 2;
          const hd = obs.d / 2;

          const vertices = [
            { x: obs.x - hw, y: obs.y - hh, z: obs.z - hd },
            { x: obs.x + hw, y: obs.y - hh, z: obs.z - hd },
            { x: obs.x + hw, y: obs.y + hh, z: obs.z - hd },
            { x: obs.x - hw, y: obs.y + hh, z: obs.z - hd },
            { x: obs.x - hw, y: obs.y - hh, z: obs.z + hd },
            { x: obs.x + hw, y: obs.y - hh, z: obs.z + hd },
            { x: obs.x + hw, y: obs.y + hh, z: obs.z + hd },
            { x: obs.x - hw, y: obs.y + hh, z: obs.z + hd },
          ];

          const projected = vertices.map((v) => {
            const scale = fov / (fov + v.z);
            return {
              x: cx + (v.x - current3DXRef.current) * scale,
              y: cy + (v.y - current3DYRef.current) * scale,
            };
          });

          ctx.strokeStyle = obs.passed ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.7)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(projected[0].x, projected[0].y);
          for (let i = 1; i < 4; i++) ctx.lineTo(projected[i].x, projected[i].y);
          ctx.closePath();
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(projected[4].x, projected[4].y);
          for (let i = 5; i < 8; i++) ctx.lineTo(projected[i].x, projected[i].y);
          ctx.closePath();
          ctx.stroke();

          for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[i + 4].x, projected[i + 4].y);
            ctx.stroke();
          }
        }
      });

      rings3DRef.current.forEach((ring) => {
        ring.z -= speed3DRef.current;

        if (ring.z <= 15 && ring.z >= -35 && !ring.collected) {
          const dist = Math.hypot(current3DXRef.current - ring.x, current3DYRef.current - ring.y);
          if (dist < ring.radius + 15) {
            ring.collected = true;
            play3DSound('gold');
            setGame3DScore((s) => s + 100);
          }
        }

        if (ring.z > 5) {
          const scale = fov / (fov + ring.z);
          const rx = cx + (ring.x - current3DXRef.current) * scale;
          const ry = cy + (ring.y - current3DYRef.current) * scale;
          const rSize = ring.radius * scale;

          ctx.strokeStyle = ring.collected ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.8)';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = 'rgba(234, 179, 8, 0.4)';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(rx, ry, rSize, 0, Math.PI * 2);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      });

      obstacles3DRef.current = obstacles3DRef.current.filter((o) => o.z > -20);
      rings3DRef.current = rings3DRef.current.filter((r) => r.z > -20 && !r.collected);

      ctx.strokeStyle = 'rgba(222, 219, 200, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(222, 219, 200, 0.35)';
      ctx.beginPath();
      ctx.moveTo(cx - 30, cy); ctx.lineTo(cx - 8, cy);
      ctx.moveTo(cx + 8, cy); ctx.lineTo(cx + 30, cy);
      ctx.moveTo(cx, cy - 30); ctx.lineTo(cx, cy - 8);
      ctx.moveTo(cx, cy + 8); ctx.lineTo(cx, cy + 30);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(222, 219, 200, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(cx - 18, cy - 18);
      ctx.moveTo(width, 0); ctx.lineTo(cx + 18, cy - 18);
      ctx.moveTo(0, height); ctx.lineTo(cx - 18, cy + 18);
      ctx.moveTo(width, height); ctx.lineTo(cx + 18, cy + 18);
      ctx.stroke();

      localId = requestAnimationFrame(updateAndRender);
      game3DAnimationId.current = localId;
    };

    localId = requestAnimationFrame(updateAndRender);
    game3DAnimationId.current = localId;

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(localId);
    };
  }, [game3DState, isOpen]);

  useEffect(() => {
    if (game3DScore > highScoreGame3D) {
      setHighScoreGame3D(game3DScore);
      localStorage.setItem('chinguun_high_game3d', game3DScore.toString());
    }
  }, [game3DScore, highScoreGame3D]);

  // Persist Clicker values
  useEffect(() => {
    localStorage.setItem('chinguun_clicker_fluid', Math.floor(webFluid).toString());
  }, [webFluid]);

  // Reset all games
  const resetAllArcades = () => {
    setShooterScore(0);
    setShooterState('idle');
    setRunnerScore(0);
    setRunnerState('idle');
    setGame3DScore(0);
    setGame3DState('idle');
    setHighScoreGame3D(0);
    setWebFluid(0);
    localStorage.removeItem('chinguun_high_game3d');
    setWebFluid(0);
    setClickerUpgrades([
      {
        id: 'fluid_synth',
        name: 'Web Fluid Synthesizer',
        cost: 15,
        cps: 0.8,
        cpc: 0,
        owned: 0,
        icon: '🧪',
        desc: 'Automatic chemical synthesis. Generates +0.8 fluid per second.',
      },
      {
        id: 'upgrade_shooters',
        name: 'Enhanced Web Shooters',
        cost: 100,
        cps: 0,
        cpc: 3,
        owned: 0,
        icon: '⚙️',
        desc: 'Better nozzle pressure. Generates +3 fluid per click.',
      },
      {
        id: 'spidey_portal',
        name: 'Multiverse Spideys',
        cost: 400,
        cps: 8,
        cpc: 0,
        owned: 0,
        icon: '🌌',
        desc: 'Summons spider heroes from alternative universes. +8 fluid/sec.',
      },
      {
        id: 'stark_nanotech',
        name: 'Stark Nano-Suite Tech',
        cost: 2000,
        cps: 45,
        cpc: 0,
        owned: 0,
        icon: '🛡️',
        desc: 'State-of-the-art Tony Stark AI nanofiber. +45 fluid/sec.',
      },
    ]);
    localStorage.removeItem('chinguun_clicker_fluid');
    playSynthSound('gameover');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          {/* Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
          />

          {/* Arcade Console Window */}
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="relative bg-[#101010] border border-white/10 rounded-[2rem] w-full max-w-5xl h-[92vh] sm:h-[85vh] flex flex-col overflow-hidden shadow-2xl z-10 text-[#E1E0CC]"
          >
            {/* Ambient Background Noise & Scanlines */}
            <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none mix-blend-overlay" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            {/* Console Navigation Header */}
            <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-b border-white/5 bg-[#141414]/95 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                <div>
                  <h2 className="text-[#E1E0CC] font-mono text-xs sm:text-sm tracking-widest uppercase flex items-center gap-2">
                    <span>CHINGUUN'S SPINNING ARCADE HUB</span>
                  </h2>
                  <p className="text-[9px] font-mono text-gray-500 uppercase tracking-wider mt-0.5">
                    Interactive Multiverse Gaming Center // Сонгомол Тоглоомууд
                  </p>
                </div>
              </div>

              {/* Sub-Tabs Selector */}
              <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-full border border-white/5">
                <button
                  onClick={() => {
                    setActiveTab('menu');
                    playSynthSound('click');
                  }}
                  className={`text-[10px] sm:text-xs font-mono tracking-wider uppercase px-3.5 py-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                    activeTab === 'menu' ? 'bg-primary text-black font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Hub Menu
                </button>
                <button
                  onClick={() => {
                    setActiveTab('shooter');
                    setShooterState('idle');
                    playSynthSound('click');
                  }}
                  className={`text-[10px] sm:text-xs font-mono tracking-wider uppercase px-3.5 py-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                    activeTab === 'shooter' ? 'bg-primary text-black font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Web Shooter
                </button>
                <button
                  onClick={() => {
                    setActiveTab('runner');
                    setRunnerState('idle');
                    playSynthSound('click');
                  }}
                  className={`text-[10px] sm:text-xs font-mono tracking-wider uppercase px-3.5 py-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                    activeTab === 'runner' ? 'bg-primary text-black font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Web Swinger
                </button>
                <button
                  onClick={() => {
                    setActiveTab('clicker');
                    playSynthSound('click');
                  }}
                  className={`text-[10px] sm:text-xs font-mono tracking-wider uppercase px-3.5 py-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                    activeTab === 'clicker' ? 'bg-primary text-black font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Fluid Clicker
                </button>
                <button
                  onClick={() => {
                    setActiveTab('game3d');
                    setGame3DState('idle');
                    playSynthSound('click');
                  }}
                  className={`text-[10px] sm:text-xs font-mono tracking-wider uppercase px-3.5 py-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                    activeTab === 'game3d' ? 'bg-primary text-black font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Cyber Swing ⚡
                </button>
              </div>

              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full cursor-pointer shrink-0 absolute top-3 right-3 sm:relative sm:top-0 sm:right-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SCREEN STAGE */}
            <div className="flex-1 bg-[#090909] overflow-hidden flex flex-col relative">
              
              {/* SCREEN INTERFACE Tab 1: HUB MENU */}
              {activeTab === 'menu' && (
                <div className="flex-1 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto max-h-full">
                  <div className="text-center max-w-2xl mx-auto flex flex-col items-center mt-2">
                    <span className="text-primary text-[10px] font-mono tracking-[0.3em] uppercase bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-4 select-none">
                      CHOOSE YOUR MISSION // ТА НЭГНИЙГ СОНГОНО УУ
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-normal text-white tracking-tight mb-3">
                      Select Spidey Multiverse Mode
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed max-w-lg">
                      Утас шидэгч Chinguun-д зориулсан 3 төрлийн маш сонирхолтой тоглоомын хувилбарууд. Илүү өндөр оноо авч, дээд амжилтаа эвдээрэй!
                    </p>
                  </div>

                  {/* 4 Games Selection Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto w-full my-6">
                    {/* Game 1: Web Reflex */}
                    <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-primary/40 transition-all duration-300 group shadow-md">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 border border-primary/20">
                          <Target className="w-5 h-5" />
                        </div>
                        <h4 className="text-lg font-medium text-white mb-1 flex justify-between items-baseline">
                          <span>Web Shooter</span>
                          <span className="text-[10px] font-mono text-gray-500">REFLEX</span>
                        </h4>
                        <p className="text-xs text-gray-400 font-light leading-relaxed mb-4">
                          Хурдан хугацаанд дэлгэцэнд гарч ирэх муу талын баатруудыг онож устгана. Бөмбөгнөөс зайлсхийгээрэй.
                        </p>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-primary/80 mb-3 flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded border border-white/5 w-fit">
                          <Trophy className="w-3.5 h-3.5" /> High: {highScoreShooter} pts
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab('shooter');
                            startShooter();
                          }}
                          className="w-full bg-primary text-black font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-transform group-hover:scale-[1.02] cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-black" /> Play Mode
                        </button>
                      </div>
                    </div>

                    {/* Game 2: Web Swinger */}
                    <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-primary/40 transition-all duration-300 group shadow-md">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4 border border-orange-500/20">
                          <Flame className="w-5 h-5" />
                        </div>
                        <h4 className="text-lg font-medium text-white mb-1 flex justify-between items-baseline">
                          <span>Web Swinger</span>
                          <span className="text-[10px] font-mono text-gray-500">RUNNER</span>
                        </h4>
                        <p className="text-xs text-gray-400 font-light leading-relaxed mb-4">
                          Утсаараа дүүжлэгдэн агаарт савлаж урагшилна. Ногоон гоблины бөмбөгнүүдийг үсэрч зайлсхийн одод цуглуулна.
                        </p>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-orange-500/80 mb-3 flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded border border-white/5 w-fit">
                          <Trophy className="w-3.5 h-3.5" /> High: {highScoreRunner} pts
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab('runner');
                            startRunner();
                          }}
                          className="w-full bg-primary text-black font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-transform group-hover:scale-[1.02] cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-black" /> Play Mode
                        </button>
                      </div>
                    </div>

                    {/* Game 3: Fluid Clicker */}
                    <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-primary/40 transition-all duration-300 group shadow-md">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4 border border-purple-500/20">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <h4 className="text-lg font-medium text-white mb-1 flex justify-between items-baseline">
                          <span>Fluid Clicker</span>
                          <span className="text-[10px] font-mono text-gray-500">IDLE</span>
                        </h4>
                        <p className="text-xs text-gray-400 font-light leading-relaxed mb-4">
                          Аалзны торон шингэн генератор. Логог тасралтгүй товшиж, шинэ дэвшилтэт технологийн сайжруулалтууд худалдаж авна.
                        </p>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-purple-500/80 mb-3 flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded border border-white/5 w-fit">
                          <Coins className="w-3.5 h-3.5" /> Fluid: {Math.floor(webFluid)} ml
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab('clicker');
                          }}
                          className="w-full bg-primary text-black font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-transform group-hover:scale-[1.02] cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-black" /> Play Mode
                        </button>
                      </div>
                    </div>

                    {/* Game 4: Cyber Swing */}
                    <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-primary/40 transition-all duration-300 group shadow-md">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center mb-4 border border-yellow-500/20">
                          <Gamepad2 className="w-5 h-5" />
                        </div>
                        <h4 className="text-lg font-medium text-white mb-1 flex justify-between items-baseline">
                          <span>Cyber Swing</span>
                          <span className="text-[10px] font-mono text-gray-500">PERSPECTIVE</span>
                        </h4>
                        <p className="text-xs text-gray-400 font-light leading-relaxed mb-4">
                          Орон зайд савж, саад тотгорыг бултаж, шар цагиргуудыг цуглуулна. Хулганаар эсвэл WASD ашиглан удирдана уу.
                        </p>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-yellow-500/80 mb-3 flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded border border-white/5 w-fit">
                          <Trophy className="w-3.5 h-3.5" /> High: {highScoreGame3D} pts
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab('game3d');
                            startGame3D();
                          }}
                          className="w-full bg-primary text-black font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-transform group-hover:scale-[1.02] cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-black" /> Play Mode
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Reset Panel */}
                  <div className="text-center pt-2 border-t border-white/5">
                    <button
                      onClick={resetAllArcades}
                      className="text-gray-600 hover:text-red-400 font-mono text-[9px] tracking-widest uppercase transition-colors hover:underline cursor-pointer"
                    >
                      Reset All Arcade Highscores & Clicker Save File
                    </button>
                  </div>
                </div>
              )}

              {/* SCREEN INTERFACE Tab 2: WEB SHOOTER */}
              {activeTab === 'shooter' && (
                <div
                  onClick={() => setShooterCombo(0)}
                  className="flex-1 relative flex flex-col items-center justify-center select-none cursor-crosshair h-full"
                >
                  {/* Shooting Particles */}
                  {shooterParticles.map((p) => (
                    <motion.div
                      key={p.id}
                      initial={{ x: p.x, y: p.y, scale: 1, opacity: 1 }}
                      animate={{
                        x: p.x + (Math.random() - 0.5) * 120,
                        y: p.y + (Math.random() - 0.5) * 120,
                        scale: 0.1,
                        opacity: 0,
                      }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      style={{ backgroundColor: p.color }}
                      className="absolute w-2 h-2 rounded-full pointer-events-none z-30"
                    />
                  ))}

                  {/* Shooter HUD */}
                  {shooterState === 'playing' && (
                    <div className="absolute top-4 left-4 right-4 z-40 flex justify-between items-start pointer-events-none">
                      <div className="bg-black/85 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-xl flex items-center gap-4">
                        <div>
                          <div className="text-gray-500 text-[9px] font-mono uppercase tracking-widest leading-none">SCORE</div>
                          <div className="text-primary text-lg font-mono font-bold">{shooterScore}</div>
                        </div>
                        {shooterCombo >= 2 && (
                          <div className="border-l border-white/10 pl-4">
                            <div className="text-gray-500 text-[9px] font-mono uppercase tracking-widest leading-none">COMBO</div>
                            <div className="text-white text-base font-mono font-bold animate-bounce">{shooterCombo}x</div>
                          </div>
                        )}
                      </div>

                      <AnimatePresence>
                        {shooterFeedback && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="bg-primary text-black px-4 py-1 rounded-full text-[10px] font-mono font-bold shadow-lg"
                          >
                            {shooterFeedback}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="bg-black/85 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-xl flex items-center gap-4 text-right">
                        <div>
                          <div className="text-gray-500 text-[9px] font-mono uppercase tracking-widest leading-none">TIME</div>
                          <div className={`text-lg font-mono font-bold ${shooterTimeLeft <= 8 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                            {shooterTimeLeft}s
                          </div>
                        </div>
                        <div className="border-l border-white/10 pl-4 text-right">
                          <div className="text-gray-500 text-[9px] font-mono uppercase tracking-widest leading-none">BEST</div>
                          <div className="text-gray-400 text-base font-mono font-bold">{highScoreShooter}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Game Playing Targets */}
                  {shooterState === 'playing' && (
                    <div className="absolute inset-0 z-20">
                      {shooterTargets.map((t) => {
                        const isGold = t.type === 'gold';
                        const isBomb = t.type === 'bomb';

                        return (
                          <motion.button
                            key={t.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', damping: 11, stiffness: 160 }}
                            onClick={(e) => handleShooterTargetClick(t, e)}
                            style={{
                              left: `${t.x}%`,
                              top: `${t.y}%`,
                              width: `${t.size}px`,
                              height: `${t.size}px`,
                            }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer overflow-hidden group focus:outline-none"
                          >
                            <div className={`absolute inset-0 rounded-full animate-ping opacity-25 ${
                              isGold ? 'bg-primary' : isBomb ? 'bg-red-500' : 'bg-white'
                            }`} />

                            <div className={`w-full h-full rounded-full flex items-center justify-center border-2 transition-transform duration-200 group-hover:scale-110 shadow-lg ${
                              isGold ? 'bg-primary border-white text-black' : isBomb ? 'bg-red-950 border-red-500 text-red-500' : 'bg-zinc-900 border-white/40 text-[#E1E0CC]'
                            }`}>
                              {isGold ? <Zap className="w-5 h-5 animate-pulse" /> : isBomb ? <Target className="w-5 h-5 text-red-500 rotate-45" /> : <Target className="w-5 h-5 text-primary" />}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  {/* Shooter Idle screen */}
                  {shooterState === 'idle' && (
                    <div className="text-center max-w-sm px-6 flex flex-col items-center">
                      <Target className="w-12 h-12 text-primary mb-5 animate-spin" style={{ animationDuration: '6s' }} />
                      <h4 className="text-xl font-normal text-white mb-2">Web Shooter Mode</h4>
                      <p className="text-gray-400 text-xs font-light leading-relaxed mb-6">
                        Дэлгэц дээр байрлах аалзны торнуудыг хурдан товш. Алтан хөгжимт торууд нэмэлт оноо өгөх ба улаан бөмбөгнүүд оноо хасна!
                      </p>
                      <button
                        onClick={startShooter}
                        className="bg-primary text-black font-semibold text-xs px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                      >
                        Launch Shooter
                      </button>
                    </div>
                  )}

                  {/* Shooter Gameover screen */}
                  {shooterState === 'gameover' && (
                    <div className="text-center max-w-sm px-6 flex flex-col items-center">
                      <Award className="w-12 h-12 text-yellow-500 mb-5 animate-bounce" />
                      <h4 className="text-xl font-normal text-white mb-1">Mission Completed</h4>
                      <p className="text-xs font-mono text-gray-500 uppercase mb-5">Highscore is saved</p>
                      
                      <div className="bg-[#141414] border border-white/5 rounded-xl p-4 w-full mb-6 flex flex-col gap-2 font-mono text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Score:</span>
                          <span className="text-primary font-bold">{shooterScore} pts</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Personal Best:</span>
                          <span className="text-white font-bold">{highScoreShooter} pts</span>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full">
                        <button
                          onClick={startShooter}
                          className="flex-1 bg-primary text-black font-semibold text-xs py-2.5 rounded-full hover:scale-105 transition-transform cursor-pointer"
                        >
                          Play Again
                        </button>
                        <button
                          onClick={() => setActiveTab('menu')}
                          className="flex-1 border border-white/10 hover:bg-white/5 text-xs py-2.5 rounded-full transition-colors cursor-pointer"
                        >
                          Arcade Hub
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SCREEN INTERFACE Tab 3: WEB SWINGER RUNNER */}
              {activeTab === 'runner' && (
                <div className="flex-1 relative flex flex-col h-full bg-[#070707] justify-center items-center">
                  
                  {/* Main Action Canvas */}
                  {runnerState === 'playing' ? (
                    <div className="w-full h-full relative flex flex-col justify-end">
                      <canvas
                        ref={canvasRef}
                        width={680}
                        height={340}
                        onMouseDown={handleRunnerCanvasAction}
                        onMouseUp={handleRunnerRelease}
                        onTouchStart={handleRunnerCanvasAction}
                        onTouchEnd={handleRunnerRelease}
                        className="bg-[#090909] border-y border-white/5 w-full max-h-[360px] aspect-[2/1] cursor-pointer"
                      />

                      {/* HUD Top panel inside active canvas rendering */}
                      <div className="absolute top-3 left-4 right-4 flex justify-between items-center pointer-events-none z-10 font-mono text-[10px]">
                        <div className="bg-black/90 border border-white/10 px-3 py-1 rounded">
                          SCORE: <span className="text-primary font-bold">{runnerScore}</span>
                        </div>
                        <div className="text-gray-500 animate-pulse text-[9px]">
                          HOLD CLICK / TOUCH TO ZIP WEB & SWING UP
                        </div>
                        <div className="bg-black/90 border border-white/10 px-3 py-1 rounded">
                          BEST: <span className="text-gray-400">{highScoreRunner}</span>
                        </div>
                      </div>
                    </div>
                  ) : runnerState === 'idle' ? (
                    <div className="text-center max-w-sm px-6 flex flex-col items-center">
                      <Flame className="w-12 h-12 text-orange-500 mb-5 animate-pulse" />
                      <h4 className="text-xl font-normal text-white mb-2">Web Swinger (Endless Runner)</h4>
                      <p className="text-gray-400 text-xs font-light leading-relaxed mb-6">
                        Дэлгэц дээр дарж аалзны утсыг дээш шидэн савлана. Гараа авахад доош унана. Саад тотгоруудыг үсэрч зайлсхийн шар одуудыг цуглуулж өндөр оноо аваарай!
                      </p>
                      <button
                        onClick={startRunner}
                        className="bg-primary text-black font-semibold text-xs px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                      >
                        Launch Mission
                      </button>
                    </div>
                  ) : (
                    // Gameover
                    <div className="text-center max-w-sm px-6 flex flex-col items-center">
                      <RotateCcw className="w-12 h-12 text-red-500 mb-5 animate-spin" style={{ animationDuration: '10s' }} />
                      <h4 className="text-xl font-normal text-white mb-1">Web Line Snapped!</h4>
                      <p className="text-xs font-mono text-gray-500 uppercase mb-5">You hit a Goblin pumpkin bomb</p>

                      <div className="bg-[#141414] border border-white/5 rounded-xl p-4 w-full mb-6 flex flex-col gap-2 font-mono text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Distance Score:</span>
                          <span className="text-primary font-bold">{runnerScore} pts</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">All-time Record:</span>
                          <span className="text-white font-bold">{highScoreRunner} pts</span>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full">
                        <button
                          onClick={startRunner}
                          className="flex-1 bg-primary text-black font-semibold text-xs py-2.5 rounded-full hover:scale-105 transition-transform cursor-pointer"
                        >
                          Retry Swing
                        </button>
                        <button
                          onClick={() => setActiveTab('menu')}
                          className="flex-1 border border-white/10 hover:bg-white/5 text-xs py-2.5 rounded-full transition-colors cursor-pointer"
                        >
                          Arcade Hub
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SCREEN INTERFACE Tab 4: FLUID CLICKER */}
              {activeTab === 'clicker' && (
                <div className="flex-1 p-4 sm:p-8 flex flex-col lg:flex-row gap-6 overflow-y-auto max-h-full">
                  {/* Clicker Area (Left Column) */}
                  <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#0c0c0c] border border-white/5 rounded-2xl relative">
                    
                    {/* HUD click stats */}
                    <div className="text-center mb-8">
                      <div className="text-gray-500 font-mono text-[9px] tracking-widest uppercase mb-1">Web Fluid Stored</div>
                      <h3 className="text-3xl sm:text-4xl font-bold font-mono text-primary flex items-baseline justify-center gap-1.5">
                        <span>{Math.floor(webFluid)}</span>
                        <span className="text-xs text-gray-500 font-normal">ml</span>
                      </h3>
                      <div className="text-gray-400 font-mono text-[10px] tracking-wide mt-1 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        AUTO GENERATOR: <span className="text-primary font-bold">{getFluidPerSecond().toFixed(1)} ml/s</span>
                      </div>
                    </div>

                    {/* Giant Clicker Button Logo */}
                    <div className="relative">
                      {/* Interactive Float Numbers */}
                      <AnimatePresence>
                        {floatingTexts.map((f) => (
                          <motion.div
                            key={f.id}
                            initial={{ opacity: 1, y: f.y, scale: 1 }}
                            animate={{ opacity: 0, y: f.y - 80, scale: 0.8 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.9 }}
                            style={{ left: f.x, color: f.color }}
                            className="absolute pointer-events-none font-mono text-xs font-bold font-sans z-30"
                          >
                            {f.text}
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      <button
                        onClick={handleSpiderClick}
                        className="w-40 h-40 rounded-full bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-800 border-4 border-primary/20 hover:border-primary/60 flex items-center justify-center relative shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group/btn cursor-pointer focus:outline-none"
                      >
                        <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse group-hover/btn:bg-primary/10 transition-colors" />
                        
                        {/* Custom vector Spider logo */}
                        <div className="relative w-20 h-20 flex items-center justify-center text-primary group-hover/btn:scale-110 transition-transform duration-300">
                          <svg
                            viewBox="0 0 24 24"
                            className="w-14 h-14 fill-current stroke-current"
                          >
                            <path d="M12,2A10,10,0,0,0,2,12a9.89,9.89,0,0,0,2.18,6.22l-.12.12a1,1,0,0,0,0,1.41l1.41,1.41a1,1,0,0,0,1.41,0l.12-.12A9.89,9.89,0,0,0,12,22a10,10,0,0,0,10-10A10,10,0,0,0,12,2ZM12,4A2,2,0,1,1,10,6,2,2,0,0,1,12,4Zm5.1,13.1a1,1,0,0,1-1.2.7l-2.4-.8a6.39,6.39,0,0,1-3,.0l-2.4.8a1,1,0,0,1-1.2-.7,1,1,0,0,1,.7-1.2l2.4-.8a4.57,4.57,0,0,1,1-.4V11a4.57,4.57,0,0,1-1-.4l-2.4-.8a1,1,0,0,1-.7-1.2,1,1,0,0,1,1.2-.7l2.4.8a6.39,6.39,0,0,1,3,.0l2.4-.8a1,1,0,0,1,1.2.7,1,1,0,0,1-.7,1.2l-2.4.8a4.57,4.57,0,0,1-1,.4V14l1,.4,2.4.8A1,1,0,0,1,17.1,17.1ZM12,10a2,2,0,1,1-2,2A2,2,0,0,1,12,10Z" />
                          </svg>
                        </div>
                      </button>
                    </div>

                    <div className="text-[10px] font-mono text-gray-500 mt-6 text-center leading-relaxed">
                      CLICK SPIDER EMBLEM TO PUMP WEB FLUID<br/>
                      + {getFluidPerClick()} ML PER TAP
                    </div>
                  </div>

                  {/* Shop Upgrades (Right Column) */}
                  <div className="w-full lg:w-[320px] bg-[#141414] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-mono font-bold tracking-widest text-primary uppercase pb-3 border-b border-white/5 mb-4 flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4" /> Lab Upgrades Shop
                      </h4>

                      <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                        {clickerUpgrades.map((u) => {
                          const canBuy = webFluid >= u.cost;
                          return (
                            <button
                              key={u.id}
                              disabled={!canBuy}
                              onClick={() => buyClickerUpgrade(u.id)}
                              className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all duration-200 outline-none select-none ${
                                canBuy
                                  ? 'bg-[#1a1a1a] border-white/10 hover:border-primary/50 cursor-pointer hover:bg-[#202020]'
                                  : 'bg-black/40 border-white/5 opacity-50 cursor-not-allowed'
                              }`}
                            >
                              <span className="text-2xl mt-0.5 select-none">{u.icon}</span>
                              <div className="flex-1">
                                <div className="flex justify-between items-baseline">
                                  <span className="text-xs font-medium text-white">{u.name}</span>
                                  <span className="text-[10px] font-mono text-primary/80 font-bold">{u.owned}</span>
                                </div>
                                <p className="text-[9px] text-gray-500 font-light mt-0.5 leading-snug">
                                  {u.desc}
                                </p>
                                <div className="flex justify-between items-center mt-2 pt-1 border-t border-white/5 font-mono text-[9px]">
                                  <span className="text-primary font-bold">Cost: {u.cost} ml</span>
                                  <span className="text-gray-400">
                                    {u.cps > 0 ? `+${u.cps} ml/s` : `+${u.cpc} tap`}
                                  </span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 font-mono text-[9px] text-gray-500">
                      Upgrades automatically generate fluid while the game resides open.
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN INTERFACE Tab 5: CYBER SWING 3D */}
              {activeTab === 'game3d' && (
                <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between max-h-full overflow-hidden">
                  {/* Top stats bar */}
                  <div className="flex justify-between items-center bg-[#141414] border border-white/5 px-5 py-3 rounded-2xl mb-4 font-mono text-[11px] sm:text-xs">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400">SCORE: <span className="text-yellow-500 font-bold">{game3DScore}</span></span>
                      <span className="text-gray-600">|</span>
                      <span className="text-gray-400">DISTANCE: <span className="text-primary font-bold">{game3DDistance.toFixed(1)}m</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">HEALTH:</span>
                      <div className="w-24 sm:w-32 bg-black rounded-full h-2 border border-white/10 overflow-hidden flex">
                        <div
                          className={`h-full transition-all duration-300 ${
                            game3DHealth > 50 ? 'bg-green-500' : game3DHealth > 25 ? 'bg-orange-500' : 'bg-red-500 animate-pulse'
                          }`}
                          style={{ width: `${game3DHealth}%` }}
                        />
                      </div>
                      <span className={`font-bold ${game3DHealth <= 25 ? 'text-red-500 animate-pulse' : 'text-gray-300'}`}>{game3DHealth}%</span>
                    </div>
                  </div>

                  {/* Main Viewport */}
                  <div className="flex-1 relative bg-black rounded-[1.5rem] border border-white/5 overflow-hidden flex items-center justify-center min-h-[250px]">
                    {game3DState === 'idle' && (
                      <div className="text-center p-6 max-w-md relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 flex items-center justify-center mb-5 animate-bounce shadow-lg shadow-yellow-500/5">
                          <Gamepad2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-wider text-white uppercase mb-2">
                          Cyber Swing
                        </h3>
                        <p className="text-xs text-gray-400 font-light leading-relaxed mb-6">
                          Утсаараа дүүжлэгдэн хотоор аялаарай! Шар өнгийн цагиргуудыг цуглуулж оноо авах ба улаан өнгийн багануудыг мөргөхөөс зайлсхий.
                        </p>

                        <div className="bg-[#141414] border border-white/5 p-4 rounded-xl text-left w-full mb-6 font-mono text-[10px] text-gray-400 leading-relaxed">
                          🎮 <span className="text-primary font-bold">УДИРДЛАГА:</span><br/>
                          - Хулганаа дэлгэц дээр хөдөлгөж шууд бултаж дагана<br/>
                          - Эсвэл гарнаас <span className="text-white bg-white/10 px-1 py-0.5 rounded">A/D / ◄/►</span> - Савж бултах<br/>
                          - Гарнаас <span className="text-white bg-white/10 px-1 py-0.5 rounded">W/S / ▲/▼</span> - Өндрөө тааруулах
                        </div>

                        <button
                          onClick={startGame3D}
                          className="bg-primary text-black font-semibold text-xs px-8 py-3 rounded-full hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-lg shadow-primary/10 hover:shadow-primary/20"
                        >
                          LAUNCH MISSION
                        </button>
                      </div>
                    )}

                    {game3DState === 'playing' && (
                      <canvas
                        id="game-3d-canvas"
                        ref={game3DCanvasRef}
                        className="absolute inset-0 w-full h-full cursor-none"
                      />
                    )}

                    {game3DState === 'gameover' && (
                      <div className="text-center p-6 max-w-sm relative z-10 flex flex-col items-center">
                        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 flex items-center justify-center mb-4">
                          <Trophy className="w-7 h-7" />
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold text-white tracking-widest uppercase mb-1">
                          MISSION COMPLETED
                        </h4>
                        <p className="text-[10px] font-mono text-red-500 tracking-wider mb-4 uppercase">
                          System Frame Interrupted
                        </p>
                        
                        <div className="bg-[#141414] border border-white/5 p-4 rounded-xl w-full mb-6 font-mono text-xs text-left space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">SCORE:</span>
                            <span className="text-yellow-500 font-bold">{game3DScore} pts</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">DISTANCE:</span>
                            <span className="text-primary font-bold">{game3DDistance.toFixed(0)}m</span>
                          </div>
                          <div className="flex justify-between pt-1.5 border-t border-white/5">
                            <span className="text-gray-500">HIGH SCORE:</span>
                            <span className="text-white font-bold">{highScoreGame3D} pts</span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={startGame3D}
                            className="bg-primary text-black font-semibold text-xs px-5 py-2.5 rounded-full flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Replay Mission
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('menu');
                              playSynthSound('click');
                            }}
                            className="bg-[#1a1a1a] border border-white/10 text-white font-semibold text-xs px-5 py-2.5 rounded-full hover:bg-black transition-colors cursor-pointer"
                          >
                            Arcade Hub
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Retro Console Footer status bar */}
            <div className="px-6 py-4 bg-[#141414]/95 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  ARCADE ONLINE
                </span>
                <span className="text-gray-800">|</span>
                <span className="uppercase">Active: {activeTab === 'menu' ? 'Menu' : activeTab === 'shooter' ? 'Web Shooter' : activeTab === 'runner' ? 'Endless Swinger' : activeTab === 'clicker' ? 'Web Fluid Clicker' : 'Cyber Swing'}</span>
              </div>
              <div className="text-[10px] font-mono text-primary/70">
                DESIGNED FOR CHINGUUN // PRISMA STUDIOS 2026
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
