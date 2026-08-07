import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../utils/sound';

export interface WheelPrize {
  id: string;
  labelAr: string;
  labelEn: string;
  icon: string;
  color: string;
  type: 'coins' | 'spaceCoins' | 'hammer' | 'thunder' | 'cream' | 'chocolate';
  amount: number;
}

const PRIZES: WheelPrize[] = [
  { id: 'c50', labelAr: '50 كوينز 🪙', labelEn: '50 Coins 🪙', icon: '🪙', color: 'from-amber-400 to-yellow-500', type: 'coins', amount: 50 },
  { id: 'ham1', labelAr: 'مطرقة 🔨', labelEn: 'Hammer 🔨', icon: '🔨', color: 'from-orange-400 to-red-500', type: 'hammer', amount: 1 },
  { id: 'c100', labelAr: '100 كوينز 🪙', labelEn: '100 Coins 🪙', icon: '💰', color: 'from-yellow-400 to-amber-600', type: 'coins', amount: 100 },
  { id: 'thun1', labelAr: 'صاعقة ⚡', labelEn: 'Thunder ⚡', icon: '⚡', color: 'from-cyan-400 to-blue-600', type: 'thunder', amount: 1 },
  { id: 'crm1', labelAr: 'كريم 🍦', labelEn: 'Cream 🍦', icon: '🍦', color: 'from-pink-400 to-rose-500', type: 'cream', amount: 1 },
  { id: 'sc1', labelAr: '5 عملات رعد ⚡', labelEn: '5 Thunder Coins ⚡', icon: '⚡', color: 'from-amber-400 to-yellow-600', type: 'thunder', amount: 5 },
  { id: 'c250', labelAr: '250 كنز 🪙', labelEn: '250 Jackpot 🪙', icon: '👑', color: 'from-emerald-400 to-teal-600', type: 'coins', amount: 250 },
  { id: 'choc1', labelAr: 'شوكولاتة 🍫', labelEn: 'Chocolate 🍫', icon: '🍫', color: 'from-amber-600 to-amber-800', type: 'chocolate', amount: 1 },
];

interface DailyWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ar' | 'en';
  coins: number;
  onRewardClaimed: (prize: WheelPrize) => void;
}

const DAILY_SPIN_KEY = 'arrow_last_daily_spin';
const SPIN_COST = 100;

export const DailyWheelModal: React.FC<DailyWheelModalProps> = ({
  isOpen,
  onClose,
  language,
  coins,
  onRewardClaimed,
}) => {
  const isAr = language === 'ar';
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wonPrize, setWonPrize] = useState<WheelPrize | null>(null);
  const [showPrizePopup, setShowPrizePopup] = useState<boolean>(false);
  const [lastSpinTime, setLastSpinTime] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(DAILY_SPIN_KEY);
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      return 0;
    }
  });
  const [now, setNow] = useState<number>(Date.now());

  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 24 hour cooldown check
  const isFreeSpinAvailable = now - lastSpinTime >= 24 * 60 * 60 * 1000;
  const timeRemainingMs = Math.max(0, 24 * 60 * 60 * 1000 - (now - lastSpinTime));

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const formatCountdown = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSpin = () => {
    if (isSpinning) return;

    if (!isFreeSpinAvailable && coins < SPIN_COST) {
      soundManager.playBump();
      return;
    }

    soundManager.playClick();
    setIsSpinning(true);
    setWonPrize(null);
    setShowPrizePopup(false);

    // Weighted random selection: 100 coins (c100) and 250 coins (c250) are rare prizes
    const prizeWeights: Record<string, number> = {
      c50: 25,
      ham1: 20,
      c100: 5,   // Rare (~4.5%)
      thun1: 15,
      crm1: 15,
      sc1: 15,
      c250: 2,   // Very Rare / Jackpot (~1.8%)
      choc1: 15,
    };

    const totalWeight = PRIZES.reduce((sum, p) => sum + (prizeWeights[p.id] || 10), 0);
    let rand = Math.random() * totalWeight;
    let prizeIndex = 0;
    for (let i = 0; i < PRIZES.length; i++) {
      const w = prizeWeights[PRIZES[i].id] || 10;
      if (rand < w) {
        prizeIndex = i;
        break;
      }
      rand -= w;
    }
    const prize = PRIZES[prizeIndex];

    // Calculate rotation: 5 full turns (1800 deg) + offset for segment
    // Segment angle = 360 / 8 = 45 deg
    // Pointer is at TOP (270 deg or 0 deg). Segment 0 is at [0..45]
    const sliceAngle = 360 / PRIZES.length;
    // Align target so prize center sits under top pointer
    const targetSegmentOffset = 360 - (prizeIndex * sliceAngle + sliceAngle / 2);
    const extraRounds = 360 * (5 + Math.floor(Math.random() * 3));
    const nextRotation = rotation + extraRounds + (targetSegmentOffset - (rotation % 360));

    setRotation(nextRotation);

    // Play tick sounds while wheel spins
    let ticks = 0;
    const maxTicks = 25;
    tickIntervalRef.current = setInterval(() => {
      ticks++;
      soundManager.playWheelSpinTick();
      if (ticks >= maxTicks) {
        if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
      }
    }, 150);

    // Finish spin after animation (4000ms)
    setTimeout(() => {
      setIsSpinning(false);
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
      soundManager.playVictory();

      if (isFreeSpinAvailable) {
        const currentTime = Date.now();
        setLastSpinTime(currentTime);
        try {
          localStorage.setItem(DAILY_SPIN_KEY, currentTime.toString());
        } catch (e) {}
      }

      setWonPrize(prize);
      setShowPrizePopup(true);
      onRewardClaimed(prize);
    }, 4100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-sm sm:max-w-md bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 rounded-3xl border-2 border-amber-400/70 p-5 shadow-[0_0_50px_rgba(245,158,11,0.3)] flex flex-col items-center overflow-hidden">
        
        {/* Header Title & Close button */}
        <div className="w-full flex items-center justify-between border-b border-purple-800/60 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-spin-slow">🎡</span>
            <div>
              <h2 className="text-lg font-black text-amber-300 drop-shadow-md">
                {isAr ? 'عجلة الحظ اليومية 🎡' : 'Daily Fortune Wheel 🎡'}
              </h2>
              <p className="text-[11px] text-purple-200/80 font-medium">
                {isAr ? 'أدر العجلة واكسب مكافآت وجوائز قيمة!' : 'Spin the wheel to win exciting daily prizes!'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-purple-900/60 border border-purple-500/50 text-purple-200 hover:text-white font-bold text-sm flex items-center justify-center transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Pointer Pin at top of wheel */}
        <div className="relative z-20 flex flex-col items-center -mb-4 pointer-events-none">
          <div className="w-7 h-8 bg-gradient-to-b from-amber-300 to-amber-500 clip-triangle shadow-lg border-x-2 border-t-2 border-amber-200 transform rotate-180 animate-bounce" />
          <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white -mt-2 shadow-md" />
        </div>

        {/* Rotating Wheel Container */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2 flex items-center justify-center">
          {/* Outer Glowing Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-amber-400/80 shadow-[0_0_30px_rgba(251,191,36,0.4)] bg-purple-900/40" />

          {/* SVG Wheel Graphics */}
          <div
            className="w-full h-full rounded-full transition-transform duration-[4000ms] cubic-bezier(0.15, 0.9, 0.2, 1) shadow-2xl overflow-hidden"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
              {PRIZES.map((prize, idx) => {
                const total = PRIZES.length;
                const angle = 360 / total;
                const startAngle = idx * angle;
                const endAngle = (idx + 1) * angle;

                const x1 = 100 + 96 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 100 + 96 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 100 + 96 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 100 + 96 * Math.sin((Math.PI * endAngle) / 180);

                const pathData = `M 100 100 L ${x1} ${y1} A 96 96 0 0 1 ${x2} ${y2} Z`;
                const textAngle = startAngle + angle / 2;
                const textRad = (Math.PI * textAngle) / 180;
                const textX = 100 + 64 * Math.cos(textRad);
                const textY = 100 + 64 * Math.sin(textRad);

                const bgColors = [
                  '#F59E0B', '#8B5CF6', '#EC4899', '#3B82F6',
                  '#10B981', '#6366F1', '#EF4444', '#D97706'
                ];
                const sliceBg = bgColors[idx % bgColors.length];

                return (
                  <g key={prize.id}>
                    <path
                      d={pathData}
                      fill={sliceBg}
                      stroke="#4C1D95"
                      strokeWidth="1.5"
                    />
                    <g transform={`translate(${textX}, ${textY}) rotate(${textAngle + 90})`}>
                      <text
                        x="0"
                        y="0"
                        fill="#FFFFFF"
                        fontSize="11"
                        fontWeight="900"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="drop-shadow-sm select-none"
                      >
                        {prize.icon}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Hub */}
          <div className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border-4 border-amber-200 shadow-xl flex items-center justify-center z-10">
            <span className="text-xl sm:text-2xl drop-shadow-md">🎡</span>
          </div>
        </div>

        {/* Spin Button / Cooldown Banner */}
        <div className="w-full mt-3 flex flex-col items-center gap-2">
          {isFreeSpinAvailable ? (
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={`w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-base shadow-[0_0_25px_rgba(251,191,36,0.6)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isSpinning ? 'opacity-75 cursor-not-allowed' : 'animate-pulse'
              }`}
            >
              <span>🎡</span>
              <span>{isSpinning ? (isAr ? 'جاري التدوير...' : 'Spinning...') : (isAr ? 'تدوير مجاني! 🚀' : 'Free Daily Spin! 🚀')}</span>
            </button>
          ) : (
            <div className="w-full flex flex-col gap-2">
              <div className="w-full bg-purple-950/80 border border-purple-700/60 rounded-xl p-2 text-center flex items-center justify-between px-3">
                <span className="text-xs text-purple-200 font-bold">
                  {isAr ? 'التدوير المجاني القادم:' : 'Next free spin:'}
                </span>
                <span className="text-xs font-mono font-black text-amber-300 bg-purple-900/80 px-2.5 py-1 rounded-lg border border-purple-500/40">
                  {formatCountdown(timeRemainingMs)}
                </span>
              </div>

              <button
                onClick={handleSpin}
                disabled={isSpinning || coins < SPIN_COST}
                className={`w-full py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  coins >= SPIN_COST && !isSpinning
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-pink-400 text-white shadow-lg hover:brightness-110 active:scale-95'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>🎡</span>
                <span>{isAr ? `تدوير إضافي بـ ${SPIN_COST} كوينز` : `Extra spin for ${SPIN_COST} coins`}</span>
                <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full text-[10px]">🪙 {SPIN_COST}</span>
              </button>
            </div>
          )}
        </div>

        {/* Won Prize Celebration Modal overlay */}
        {showPrizePopup && wonPrize && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-1 shadow-[0_0_30px_rgba(251,191,36,0.8)] animate-bounce mb-3">
              <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-4xl">
                {wonPrize.icon}
              </div>
            </div>
            <h3 className="text-xl font-black text-amber-300 mb-1">
              {isAr ? 'مبارك! لقد فزت بـ 🎉' : 'Congratulations! You won 🎉'}
            </h3>
            <p className="text-lg font-black text-white mb-4 bg-purple-900/60 px-4 py-1.5 rounded-xl border border-purple-500/50">
              {isAr ? wonPrize.labelAr : wonPrize.labelEn}
            </p>
            <button
              onClick={() => {
                soundManager.playClick();
                setShowPrizePopup(false);
              }}
              className="py-2.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-xl text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              {isAr ? 'استلام المكافأة 🎁' : 'Claim Reward 🎁'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
