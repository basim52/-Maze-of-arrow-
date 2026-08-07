import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface VictoryModalProps {
  levelNumber: number;
  stars: number; // 1 to 3 stars
  coinsEarned: number;
  spaceCoinsEarned?: number;
  dropsCount?: number;
  gameMode?: 'main' | 'galaxy' | 'long' | 'thunder' | 'timed' | 'monster';
  language: 'ar' | 'en';
  onNextLevel: () => void;
  onReplay: () => void;
  onLevelSelect: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  levelNumber,
  stars,
  coinsEarned,
  spaceCoinsEarned = 0,
  dropsCount = 0,
  gameMode = 'main',
  language,
  onNextLevel,
  onReplay,
  onLevelSelect,
}) => {
  const isAr = language === 'ar';
  const pointsPerStar =
    gameMode === 'monster'
      ? 12
      : gameMode === 'timed'
      ? 10
      : gameMode === 'thunder'
      ? 6
      : gameMode === 'long'
      ? 8
      : 4;

  useEffect(() => {
    soundManager.playVictory();

    // Trigger colorful celebratory confetti
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#38BDF8', '#A3E635', '#FBBF24', '#C084FC', '#FB7185'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#38BDF8', '#A3E635', '#FBBF24', '#C084FC', '#FB7185'],
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-200 flex flex-col items-center text-center relative overflow-hidden animate-scale-up">
        {/* Glow backdrop */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-200/40 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-sky-200/40 rounded-full blur-2xl" />

        {/* Trophy / Star Header Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-white shadow-lg flex items-center justify-center -mt-12 mb-3 transform hover:rotate-6 transition-transform">
          <Trophy className="w-10 h-10 text-white fill-amber-100" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent mb-1">
          {isAr ? 'أحسنت! اكتمل المستوى' : 'Level Complete!'}
        </h2>
        <p className="text-sm font-semibold text-slate-500 mb-4">
          {isAr ? `اجتزت المستوى ${levelNumber} بنجاح` : `You cleared Level ${levelNumber}!`}
        </p>

        {/* Animated 3 Stars */}
        <div className="flex items-center justify-center gap-3 mb-5">
          {[1, 2, 3].map((starIdx) => {
            const hasStar = starIdx <= stars;
            return (
              <div
                key={starIdx}
                className={`transition-all duration-500 transform ${
                  hasStar ? 'scale-110 rotate-3 opacity-100' : 'scale-90 opacity-30 grayscale'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-amber-200 to-yellow-400 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-md">
                  ⭐
                </div>
              </div>
            );
          })}
        </div>

        {/* Reward Coins */}
        <div className="w-full bg-amber-50 border border-amber-200/80 rounded-2xl p-3 mb-4 flex flex-col gap-1 px-4">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-bold text-amber-800">
              {isAr ? 'المكافأة المكتسبة:' : 'Coins Earned:'}
            </span>
            <div className="flex items-center gap-1.5 text-base font-black text-amber-600">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>+{coinsEarned}</span>
              {coinsEarned === 0 && (
                <span className="text-[11px] font-bold text-slate-400 mr-1">
                  ({isAr ? 'مكتملة سابقاً' : 'Replay'})
                </span>
              )}
            </div>
          </div>
          {dropsCount > 0 && (
            <div className="text-[11px] font-bold text-amber-700 flex items-center justify-end gap-1 pt-0.5 border-t border-amber-200/50">
              <span>⭐</span>
              <span>
                {isAr
                  ? `${dropsCount} نجوم بقاء × ${pointsPerStar === 8 ? '٨' : '٤'} نقاط = +${dropsCount * pointsPerStar}`
                  : `${dropsCount} Survival Stars × ${pointsPerStar} = +${dropsCount * pointsPerStar}`}
              </span>
            </div>
          )}
        </div>

        {/* Galaxy Event Bonus (15% Chance Trigger) */}
        {spaceCoinsEarned > 0 && (
          <div className="w-full bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 border-2 border-purple-400/80 rounded-2xl p-3 mb-5 flex items-center justify-between px-3.5 shadow-lg text-white animate-bounce">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌌</span>
              <div className="text-right">
                <span className="text-xs font-black text-amber-300 block">
                  {isAr ? 'حدث الجلكسي والفضائيات! 🚀' : 'Galaxy Event Reward! 🚀'}
                </span>
                <span className="text-[10px] text-purple-200 font-semibold">
                  {isAr ? 'مكافأة حظ استثنائية (15%)' : 'Lucky 15% Bonus Chance'}
                </span>
              </div>
            </div>
            <span className="bg-purple-600 text-amber-300 font-black text-xs px-2.5 py-1 rounded-full border border-purple-400 flex items-center gap-1">
              🚀 +{spaceCoinsEarned} {isAr ? 'عملة فضاء' : 'Space Coins'}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            id="btn-next-level"
            onClick={() => {
              soundManager.playClick();
              onNextLevel();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-lg shadow-[0_6px_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
          >
            <span>
              {isAr ? `المستوى التالي (${levelNumber + 1})` : `Next Level (${levelNumber + 1})`}
            </span>
            <ArrowRight className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
          </button>

          <div className="flex items-center justify-center gap-2 w-full">
            <button
              id="btn-replay-modal"
              onClick={() => {
                soundManager.playClick();
                onReplay();
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>{isAr ? 'إعادة' : 'Replay'}</span>
            </button>

            <button
              id="btn-level-select-modal"
              onClick={() => {
                soundManager.playClick();
                onLevelSelect();
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{isAr ? 'المستويات' : 'Levels'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
