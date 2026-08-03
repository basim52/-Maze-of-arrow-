import React, { useState } from 'react';
import { X, Lock, Star, Sparkles, Rocket } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { HANDCRAFTED_LEVELS, HAMMER_REQUIRED_LEVEL_IDS, MONSTER_BOSS_LEVEL_IDS, DIAMOND_VETERAN_LEVEL_IDS } from '../utils/levelGenerator';

interface LevelSelectModalProps {
  unlockedLevel: number;
  currentLevel: number;
  starsPerLevel: Record<number, number>;
  unlockedGalaxyLevel: number;
  currentGalaxyLevel: number;
  starsPerGalaxyLevel: Record<number, number>;
  unlockedLongLevel: number;
  currentLongLevel: number;
  starsPerLongLevel: Record<number, number>;
  unlockedThunderLevel?: number;
  currentThunderLevel?: number;
  starsPerThunderLevel?: Record<number, number>;
  isEventUnlocked: boolean;
  gameMode: 'main' | 'galaxy' | 'long' | 'thunder';
  initialTab?: 'main' | 'galaxy' | 'long';
  coins: number;
  language: 'ar' | 'en';
  onSelectMainLevel: (levelId: number) => void;
  onSelectGalaxyLevel: (galaxyId: number) => void;
  onSelectLongLevel: (longId: number) => void;
  onSelectThunderLevel?: (thunderId: number) => void;
  onUnlockEvent: () => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  unlockedLevel,
  currentLevel,
  starsPerLevel,
  unlockedGalaxyLevel,
  currentGalaxyLevel,
  starsPerGalaxyLevel,
  unlockedLongLevel,
  currentLongLevel,
  starsPerLongLevel,
  unlockedThunderLevel = 1,
  currentThunderLevel = 1,
  starsPerThunderLevel = {},
  isEventUnlocked,
  gameMode,
  initialTab = 'main',
  coins,
  language,
  onSelectMainLevel,
  onSelectGalaxyLevel,
  onSelectLongLevel,
  onSelectThunderLevel,
  onUnlockEvent,
  onClose,
}) => {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'main' | 'galaxy' | 'long'>(initialTab);

  // Main levels 1 to 250
  const TOTAL_MAIN_LEVELS = Math.max(250, unlockedLevel, currentLevel + 5);
  const mainLevelIds = Array.from({ length: TOTAL_MAIN_LEVELS }, (_, i) => i + 1);

  // Galaxy event levels 1 to 25
  const galaxyLevelIds = Array.from({ length: 25 }, (_, i) => i + 1);

  // Long maze levels 1 to 25
  const longLevelIds = Array.from({ length: 25 }, (_, i) => i + 1);

  // Thunder event levels 1 to 5
  const thunderLevelIds = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-2xl border-2 border-purple-500/40 flex flex-col max-h-[88vh] relative animate-scale-up overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>{activeTab === 'galaxy' ? '🌌' : activeTab === 'long' ? '📜' : '🎯'}</span>
              <span>
                {activeTab === 'main'
                  ? isAr
                    ? `اختيار المستوى الرئيسي (١ - ${TOTAL_MAIN_LEVELS})`
                    : `Main Levels (1 - ${TOTAL_MAIN_LEVELS})`
                  : activeTab === 'galaxy'
                  ? isAr
                    ? 'مراحل الأحداث الفضائية (١ - ٢٥ 🚀)'
                    : 'Galaxy Event Levels (1 - 25 🚀)'
                  : isAr
                  ? 'المراحل الطويلة البانورامية (١ - ٢٠ 🗺️)'
                  : 'Long Panoramic Levels (1 - 20 🗺️)'}
              </span>
            </h2>
            <p className="text-[11px] text-purple-200/80 font-medium mt-0.5">
              {activeTab === 'main'
                ? isAr
                  ? 'اختر مرحلتك الرئيسية للتحدي والتقدم'
                  : 'Select your main puzzle level'
                : activeTab === 'galaxy'
                ? isAr
                  ? '🌌 أسهم فضائية، نجوم متلألئة، وخلفيات كوكبية مبهرة!'
                  : '🌌 Space arrows, sparkling stars & planetary backgrounds!'
                : isAr
                ? '📜 متاهات عريضة ممتدة ومراحل طويلة بانورامية مليئة بالتحديات!'
                : '📜 Wide panoramic mazes with winding long paths!'}
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Switcher (3 Tabs) */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-3 shrink-0">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('main');
            }}
            className={`py-2 px-1 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'main'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🎯</span>
            <span className="truncate">{isAr ? 'الرئيسية' : 'Main'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('galaxy');
            }}
            className={`py-2 px-1 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 relative ${
              activeTab === 'galaxy'
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white shadow-md'
                : 'text-purple-300 hover:text-white bg-purple-950/40 border border-purple-800/50'
            }`}
          >
            <span>🚀</span>
            <span className="truncate">{isAr ? 'الأحداث' : 'Galaxy'}</span>
            {!isEventUnlocked && (
              <span className="bg-amber-400 text-slate-950 text-[8px] px-1 py-0.2 rounded-full font-black shrink-0">
                200🪙
              </span>
            )}
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('long');
            }}
            className={`py-2 px-1 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'long'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                : 'text-amber-200 hover:text-white bg-amber-950/30 border border-amber-800/40'
            }`}
          >
            <span>📜</span>
            <span className="truncate">{isAr ? 'طويلة' : 'Long'}</span>
          </button>
        </div>

        {/* Tab Content Container */}
        {activeTab === 'main' ? (
          /* Main Levels Scrollable Grid */
          <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-5 gap-2.5 p-1">
            {mainLevelIds.map((id) => {
              const isUnlocked = id <= unlockedLevel;
              const isCurrent = id === currentLevel && gameMode === 'main';
              const isDiamondLevel = DIAMOND_VETERAN_LEVEL_IDS.includes(id);
              const isHammerLevel = HAMMER_REQUIRED_LEVEL_IDS.includes(id);
              const isMonsterBossLevel = MONSTER_BOSS_LEVEL_IDS.includes(id);
              const isBossLevel = (id % 5 === 0 || isMonsterBossLevel) && !isHammerLevel && !isDiamondLevel;
              const isStarLevel = id % 4 === 0 && !isHammerLevel && !isBossLevel && !isMonsterBossLevel && !isDiamondLevel;
              const stars = starsPerLevel[id] || 0;
              const handcrafted = HANDCRAFTED_LEVELS.find((l) => l.id === id);

              return (
                <button
                  key={`main-${id}`}
                  disabled={!isUnlocked}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectMainLevel(id);
                  }}
                  className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all duration-200 aspect-square ${
                    isCurrent
                      ? 'bg-gradient-to-tr from-sky-400 to-blue-500 text-white border-sky-300 shadow-md scale-105'
                      : isUnlocked
                      ? isDiamondLevel
                        ? 'bg-gradient-to-tr from-cyan-950 via-slate-900 to-sky-900 text-cyan-200 border-cyan-400 hover:border-cyan-200 hover:scale-105 shadow-md cursor-pointer'
                        : isMonsterBossLevel
                        ? 'bg-gradient-to-tr from-purple-900 via-rose-900 to-slate-900 text-white border-purple-500 hover:border-purple-300 hover:scale-105 shadow-md cursor-pointer'
                        : isHammerLevel
                        ? 'bg-gradient-to-tr from-amber-950 via-slate-900 to-amber-900 text-amber-200 border-amber-500 hover:border-amber-300 hover:scale-105 shadow-sm cursor-pointer'
                        : isBossLevel
                        ? 'bg-gradient-to-tr from-rose-950 via-slate-900 to-slate-800 text-rose-200 border-rose-500 hover:border-rose-300 hover:scale-105 shadow-sm cursor-pointer'
                        : 'bg-slate-800/90 text-slate-100 border-slate-700 hover:border-sky-400 hover:scale-105 shadow-sm cursor-pointer'
                      : 'bg-slate-950 text-slate-600 border-slate-800 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {isDiamondLevel && (
                    <span
                      className="absolute -top-1.5 -right-1.5 text-xs bg-cyan-500 text-white font-black px-1.5 py-0.5 rounded-full shadow-xs border border-cyan-300 animate-pulse"
                      title={isAr ? 'مرحلة سهم محنك الماسي (7 نقاط)' : 'Diamond Veteran Arrow Level (7 pts)'}
                    >
                      💎
                    </span>
                  )}
                  {isMonsterBossLevel && !isDiamondLevel && (
                    <span
                      className="absolute -top-1.5 -right-1.5 text-xs bg-purple-600 text-white font-black px-1.5 py-0.5 rounded-full shadow-xs border border-purple-300"
                      title={isAr ? 'مرحلة الوحش المرعبة' : 'Monster Boss Level'}
                    >
                      👹
                    </span>
                  )}
                  {isHammerLevel && !isMonsterBossLevel && !isDiamondLevel && (
                    <span
                      className="absolute -top-1.5 -right-1.5 text-xs bg-amber-500 text-white font-black px-1.5 py-0.5 rounded-full shadow-xs border border-amber-300"
                      title={isAr ? 'مرحلة تتطلب مطرقة أو رعد' : 'Hammer / Lightning required'}
                    >
                      🔨
                    </span>
                  )}
                  {isBossLevel && !isMonsterBossLevel && !isDiamondLevel && (
                    <span className="absolute -top-1.5 -right-1.5 text-xs bg-rose-500 text-white font-black px-1.5 py-0.5 rounded-full shadow-xs border border-rose-300">
                      🔥
                    </span>
                  )}
                  {isStarLevel && !isDiamondLevel && (
                    <span
                      className="absolute -top-1.5 -right-1.5 text-xs bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-full shadow-xs border border-amber-200"
                      title={isAr ? 'مرحلة السهم الذهبي المحنك' : 'Golden Star Arrow Level'}
                    >
                      🌟
                    </span>
                  )}

                  {isUnlocked ? (
                    <>
                      <span className={`text-base font-black ${isBossLevel && !isCurrent ? 'text-rose-400' : ''}`}>
                        {id}
                      </span>

                      {/* Stars indicator */}
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[1, 2, 3].map((starIdx) => (
                          <Star
                            key={starIdx}
                            className={`w-3 h-3 ${
                              starIdx <= stars
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-600 fill-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-0.5">
                      <span className="text-xs font-bold text-slate-500">{id}</span>
                      <Lock className="w-4 h-4 text-slate-500" />
                    </div>
                  )}

                  {/* Handcrafted difficulty badge */}
                  {handcrafted && isUnlocked && (
                    <span className="absolute -top-1.5 -left-1 text-[8px] px-1 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black shadow-xs border border-amber-300">
                      {handcrafted.difficulty}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : activeTab === 'galaxy' ? (
          /* Galaxy Event Levels Tab Content */
          <div className="flex-1 overflow-y-auto flex flex-col gap-3">
            {!isEventUnlocked ? (
              /* Locked Event Levels Banner */
              <div className="p-5 rounded-3xl border-2 border-purple-500/80 bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white flex flex-col items-center text-center gap-3 shadow-xl my-auto">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 flex items-center justify-center text-3xl shadow-lg animate-bounce border border-purple-300/60">
                  🌌🚀
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-black text-amber-300">
                    {isAr ? 'مراحل الأحداث الفضائية مغلقة! 🌌' : 'Galaxy Event Levels Locked! 🌌'}
                  </h3>
                  <p className="text-xs text-purple-200/90 max-w-xs leading-relaxed font-medium">
                    {isAr
                      ? 'افتح 25 مرحلة فضاء كوكبية خاصة بخلفيات فلكية ساحرة! بدون مراحل وحش أو مطرقة، باستثناء مرحلة 25 الوحش الأخير الصعب جداً!'
                      : 'Unlock 25 cosmic space levels with stunning galaxy backgrounds! 24 peaceful space levels + 1 final Boss Level 25!'}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-950/80 px-4 py-1.5 rounded-full border border-purple-500/40 text-amber-300 font-black text-xs my-1">
                  <Sparkles className="w-4 h-4 text-amber-400 fill-amber-300" />
                  <span>{isAr ? `سعره: 200 نقطة (رصيدك: ${coins})` : `Price: 200 points (Balance: ${coins})`}</span>
                </div>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    onUnlockEvent();
                  }}
                  className={`w-full max-w-xs py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                    coins >= 200
                      ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 hover:scale-105 active:scale-95 shadow-amber-950/60'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed opacity-80'
                  }`}
                >
                  <Rocket className="w-5 h-5 text-purple-950" />
                  <span>
                    {coins >= 200
                      ? isAr
                        ? 'فتح مراحل الأحداث الآن (200 نقطة) 🚀'
                        : 'Unlock Event Levels Now (200 pts) 🚀'
                      : isAr
                      ? 'نقاطك لا تكفي (مطلوب 200 نقطة) 🔒'
                      : 'Insufficient points (Requires 200 pts) 🔒'}
                  </span>
                </button>
              </div>
            ) : (
              /* Unlocked Event Levels Container (Galaxy + Thunder Event) */
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 p-1">
                {/* 1. Galaxy Event Levels Section */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-black text-purple-300 flex items-center gap-1">
                      <span>🌌</span>
                      <span>{isAr ? 'مراحل المجرة الفضائية (1 - 25)' : 'Galaxy Event Levels (1 - 25)'}</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2.5">
                    {galaxyLevelIds.map((id) => {
                      const isUnlocked = id <= unlockedGalaxyLevel;
                      const isCurrent = id === currentGalaxyLevel && gameMode === 'galaxy';
                      const isGalaxyBossLevel = id === 25;
                      const stars = starsPerGalaxyLevel[id] || 0;

                      return (
                        <button
                          key={`galaxy-${id}`}
                          disabled={!isUnlocked}
                          onClick={() => {
                            soundManager.playClick();
                            onSelectGalaxyLevel(id);
                          }}
                          className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all duration-200 aspect-square ${
                            isCurrent
                              ? 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white border-purple-300 shadow-lg scale-105'
                              : isUnlocked
                              ? isGalaxyBossLevel
                                ? 'bg-gradient-to-tr from-purple-950 via-rose-900 to-slate-950 text-amber-300 border-purple-400 hover:border-purple-200 hover:scale-105 shadow-md cursor-pointer animate-pulse'
                                : 'bg-gradient-to-tr from-slate-900 via-purple-950/90 to-indigo-950 text-white border-purple-500/60 hover:border-purple-300 hover:scale-105 shadow-sm cursor-pointer'
                              : 'bg-slate-950 text-slate-600 border-slate-800 opacity-60 cursor-not-allowed'
                          }`}
                        >
                          {isGalaxyBossLevel ? (
                            <span
                              className="absolute -top-1.5 -right-1.5 text-xs bg-purple-700 text-white font-black px-1.5 py-0.5 rounded-full shadow-xs border border-purple-300"
                              title={isAr ? 'مرحلة وحش المجرة الفضائي الكبرى (صعب جداً)' : 'Galaxy Boss Monster (Very Hard)'}
                            >
                              👹🔥
                            </span>
                          ) : (
                            <span className="absolute -top-1.5 -right-1.5 text-[10px] bg-purple-900 text-purple-200 font-extrabold px-1.5 py-0.2 rounded-full border border-purple-500/50">
                              🌌
                            </span>
                          )}

                          {isUnlocked ? (
                            <>
                              <span className={`text-base font-black ${isGalaxyBossLevel ? 'text-amber-300' : 'text-purple-100'}`}>
                                {id}
                              </span>

                              {/* Stars indicator */}
                              <div className="flex items-center gap-0.5 mt-0.5">
                                {[1, 2, 3].map((starIdx) => (
                                  <Star
                                    key={starIdx}
                                    className={`w-3 h-3 ${
                                      starIdx <= stars
                                        ? 'text-amber-400 fill-amber-400'
                                        : 'text-purple-950 fill-purple-900'
                                    }`}
                                  />
                                ))}
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-0.5">
                              <span className="text-xs font-bold text-slate-500">{id}</span>
                              <Lock className="w-4 h-4 text-slate-500" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Thunder Tempest Event Levels Section */}
                <div className="flex flex-col gap-2 pt-2 border-t border-purple-900/50">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-black text-cyan-300 flex items-center gap-1">
                      <span>⛈️⚡</span>
                      <span>{isAr ? 'مراحل أحداث العاصفة والرعد (1 - 5)' : 'Thunder Tempest Events (1 - 5)'}</span>
                    </span>
                    <span className="text-[10px] bg-indigo-950 text-cyan-300 px-2 py-0.5 rounded-full border border-indigo-500/50 font-bold">
                      {isAr ? 'خلفية مطر ورعد مميزة' : 'Midnight Thunder'}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2.5">
                    {thunderLevelIds.map((id) => {
                      const isUnlocked = id <= unlockedThunderLevel;
                      const isCurrent = id === currentThunderLevel && gameMode === 'thunder';
                      const stars = starsPerThunderLevel[id] || 0;

                      return (
                        <button
                          key={`thunder-${id}`}
                          disabled={!isUnlocked}
                          onClick={() => {
                            soundManager.playClick();
                            if (onSelectThunderLevel) {
                              onSelectThunderLevel(id);
                            }
                          }}
                          className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all duration-200 aspect-square ${
                            isCurrent
                              ? 'bg-gradient-to-tr from-indigo-600 via-cyan-600 to-slate-900 text-white border-cyan-300 shadow-lg scale-105 ring-2 ring-cyan-400/50'
                              : isUnlocked
                              ? 'bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 text-cyan-200 border-indigo-500/70 hover:border-cyan-300 hover:scale-105 shadow-md cursor-pointer'
                              : 'bg-slate-950 text-slate-600 border-slate-800 opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <span className="absolute -top-1.5 -right-1.5 text-[10px] bg-cyan-950 text-cyan-200 font-extrabold px-1.5 py-0.2 rounded-full border border-cyan-500/50">
                            ⛈️
                          </span>

                          {isUnlocked ? (
                            <>
                              <span className="text-base font-black text-cyan-200">{id}</span>

                              {/* Stars indicator */}
                              <div className="flex items-center gap-0.5 mt-0.5">
                                {[1, 2, 3].map((starIdx) => (
                                  <Star
                                    key={starIdx}
                                    className={`w-3 h-3 ${
                                      starIdx <= stars
                                        ? 'text-cyan-300 fill-cyan-300'
                                        : 'text-indigo-950 fill-slate-900'
                                    }`}
                                  />
                                ))}
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-0.5">
                              <span className="text-xs font-bold text-slate-500">{id}</span>
                              <Lock className="w-4 h-4 text-slate-500" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Long Panoramic Levels Tab Content (1 to 50 Grid) */
          <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-5 gap-2.5 p-1">
            {longLevelIds.map((id) => {
              const isUnlocked = id <= unlockedLongLevel;
              const isCurrent = id === currentLongLevel && gameMode === 'long';
              const stars = starsPerLongLevel[id] || 0;

              return (
                <button
                  key={`long-${id}`}
                  disabled={!isUnlocked}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectLongLevel(id);
                  }}
                  className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all duration-200 aspect-square ${
                    isCurrent
                      ? 'bg-gradient-to-tr from-amber-500 via-orange-600 to-amber-700 text-white border-amber-300 shadow-lg scale-105 ring-2 ring-amber-400/50'
                      : isUnlocked
                      ? 'bg-gradient-to-tr from-slate-900 via-amber-950/80 to-slate-900 text-amber-100 border-amber-600/60 hover:border-amber-400 hover:scale-105 shadow-sm cursor-pointer'
                      : 'bg-slate-950 text-slate-600 border-slate-800 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <span className="absolute -top-1.5 -right-1.5 text-[10px] bg-amber-900/90 text-amber-200 font-black px-1.5 py-0.2 rounded-full border border-amber-600/50">
                    📜
                  </span>

                  {isUnlocked ? (
                    <>
                      <span className="text-base font-black text-amber-200">{id}</span>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[1, 2, 3].map((starIdx) => (
                          <Star
                            key={starIdx}
                            className={`w-3 h-3 ${
                              starIdx <= stars ? 'text-amber-400 fill-amber-400' : 'text-amber-950 fill-amber-900'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-0.5">
                      <span className="text-xs font-bold text-slate-500">{id}</span>
                      <Lock className="w-4 h-4 text-slate-500" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
