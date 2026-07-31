import React from 'react';
import { X, Lock, Star } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { HANDCRAFTED_LEVELS, HAMMER_REQUIRED_LEVEL_IDS, MONSTER_BOSS_LEVEL_IDS } from '../utils/levelGenerator';

interface LevelSelectModalProps {
  unlockedLevel: number;
  currentLevel: number;
  starsPerLevel: Record<number, number>;
  language: 'ar' | 'en';
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  unlockedLevel,
  currentLevel,
  starsPerLevel,
  language,
  onSelectLevel,
  onClose,
}) => {
  const isAr = language === 'ar';

  // Display all levels dynamically (200 levels total with new arrow mechanics)
  const TOTAL_LEVELS = Math.max(200, unlockedLevel, currentLevel + 5);
  const levelIds = Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border-2 border-slate-100 flex flex-col max-h-[85vh] relative animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 className="text-xl font-black text-slate-800">
              {isAr ? `اختيار المستوى (١ - ${TOTAL_LEVELS})` : `Select Level (1 - ${TOTAL_LEVELS})`}
            </h2>
            <p className="text-xs text-slate-500 font-bold mt-0.5">
              {isAr ? 'افتح المراحل بالتتابع عند الفوز' : 'Unlock levels sequentially by winning'}
            </p>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Levels Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-5 gap-3 p-1">
          {levelIds.map((id) => {
            const isUnlocked = id <= unlockedLevel;
            const isCurrent = id === currentLevel;
            const isHammerLevel = HAMMER_REQUIRED_LEVEL_IDS.includes(id);
            const isMonsterBossLevel = MONSTER_BOSS_LEVEL_IDS.includes(id);
            const isBossLevel = (id % 5 === 0 || isMonsterBossLevel) && !isHammerLevel;
            const isStarLevel = id % 4 === 0 && !isHammerLevel && !isBossLevel && !isMonsterBossLevel;
            const stars = starsPerLevel[id] || 0;
            const handcrafted = HANDCRAFTED_LEVELS.find((l) => l.id === id);

            return (
              <button
                key={id}
                disabled={!isUnlocked}
                onClick={() => {
                  soundManager.playClick();
                  onSelectLevel(id);
                }}
                className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all duration-200 aspect-square ${
                  isCurrent
                    ? 'bg-gradient-to-tr from-sky-400 to-blue-500 text-white border-sky-300 shadow-md scale-105'
                    : isUnlocked
                    ? isMonsterBossLevel
                      ? 'bg-gradient-to-tr from-purple-200 via-rose-100 to-red-100 text-purple-950 border-purple-500 hover:border-purple-700 hover:scale-105 shadow-md cursor-pointer'
                      : isHammerLevel
                      ? 'bg-gradient-to-tr from-amber-100 via-orange-50 to-amber-50 text-slate-900 border-amber-300 hover:border-amber-400 hover:scale-105 shadow-sm cursor-pointer'
                      : isBossLevel
                      ? 'bg-gradient-to-tr from-rose-50 to-amber-50 text-slate-800 border-rose-300 hover:border-rose-400 hover:scale-105 shadow-sm cursor-pointer'
                      : 'bg-gradient-to-tr from-sky-50 to-white text-slate-700 border-sky-100 hover:border-sky-300 hover:scale-105 shadow-sm cursor-pointer'
                    : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed'
                }`}
              >
                {isMonsterBossLevel && (
                  <span className="absolute -top-1.5 -right-1.5 text-xs bg-purple-700 text-white font-black px-1.5 py-0.5 rounded-full shadow-xs border border-white" title={isAr ? 'مرحلة الوحش المرعبة' : 'Monster Boss Level'}>
                    👹
                  </span>
                )}
                {isHammerLevel && !isMonsterBossLevel && (
                  <span className="absolute -top-1.5 -right-1.5 text-xs bg-amber-500 text-white font-black px-1.5 py-0.5 rounded-full shadow-xs border border-white" title={isAr ? 'مرحلة تتطلب مطرقة أو رعد' : 'Hammer / Lightning required'}>
                    🔨
                  </span>
                )}
                {isBossLevel && !isMonsterBossLevel && (
                  <span className="absolute -top-1.5 -right-1.5 text-xs bg-rose-500 text-white font-black px-1.5 py-0.5 rounded-full shadow-xs border border-white">
                    🔥
                  </span>
                )}
                {isStarLevel && (
                  <span className="absolute -top-1.5 -right-1.5 text-xs bg-amber-400 text-slate-900 font-black px-1.5 py-0.5 rounded-full shadow-xs border border-white" title={isAr ? 'مرحلة السهم الذهبي المحنك' : 'Golden Star Arrow Level'}>
                    🌟
                  </span>
                )}

                {isUnlocked ? (
                  <>
                    <span className={`text-base font-black ${isBossLevel && !isCurrent ? 'text-rose-600' : ''}`}>
                      {id}
                    </span>

                    {/* Stars indicator */}
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-3 h-3 ${
                            starIdx <= stars
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300 fill-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-0.5">
                    <span className="text-xs font-bold text-slate-400">{id}</span>
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                )}

                {/* Handcrafted difficulty badge */}
                {handcrafted && isUnlocked && (
                  <span className="absolute -top-1.5 -left-1 text-[8px] px-1 py-0.5 rounded-full bg-amber-400 text-white font-black shadow-xs">
                    {handcrafted.difficulty}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
