import React, { useState, useEffect } from 'react';
import { Arrow, Level, ThemeSkin } from './types';
import { getLevel } from './utils/levelGenerator';
import { soundManager } from './utils/sound';
import { TopBar } from './components/TopBar';
import { ArrowMazeBoard } from './components/ArrowMazeBoard';
import { VictoryModal } from './components/VictoryModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { SettingsModal } from './components/SettingsModal';
import { ShopModal } from './components/ShopModal';
import { Sparkles, HelpCircle, RefreshCw } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'arrow_escape_game_data_v1';

export default function App() {
  // Game persistent state - initialized directly from localStorage with fallback to level 1
  const [currentLevelId, setCurrentLevelId] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.currentLevelId === 'number' && parsed.currentLevelId >= 1) {
          return parsed.currentLevelId;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 1;
  });

  const [unlockedLevel, setUnlockedLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.unlockedLevel === 'number' && parsed.unlockedLevel >= 1) {
          return parsed.unlockedLevel;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 1;
  });

  const [starsPerLevel, setStarsPerLevel] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.starsPerLevel && typeof parsed.starsPerLevel === 'object') {
          return parsed.starsPerLevel;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  const [coins, setCoins] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.coins === 'number') {
          return parsed.coins;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 0;
  });

  const [drops, setDrops] = useState<number>(3);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.soundEnabled === 'boolean') {
          return parsed.soundEnabled;
        }
      }
    } catch (e) {}
    return true;
  });

  const [language, setLanguage] = useState<'ar' | 'en'>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.language === 'ar' || parsed.language === 'en') {
          return parsed.language;
        }
      }
    } catch (e) {}
    return 'ar';
  });

  const [selectedSkin, setSelectedSkin] = useState<ThemeSkin>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedSkin) return parsed.selectedSkin;
      }
    } catch (e) {}
    return 'jelly';
  });

  const [unlockedSkins, setUnlockedSkins] = useState<ThemeSkin[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.unlockedSkins)) return parsed.unlockedSkins;
      }
    } catch (e) {}
    return ['jelly'];
  });

  const [hammers, setHammers] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.hammers === 'number') {
          return parsed.hammers;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 1; // 1 free starter hammer
  });

  const [isHammerActive, setIsHammerActive] = useState<boolean>(false);
  const [lastCoinsEarned, setLastCoinsEarned] = useState<number>(10);

  // Modals state
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const [showLevelSelectModal, setShowLevelSelectModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showShopModal, setShowShopModal] = useState<boolean>(false);

  // Active Level State initialized lazily from currentLevelId
  const [activeLevel, setActiveLevel] = useState<Level>(() => getLevel(currentLevelId));
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [escapedCount, setEscapedCount] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Configure sound manager on mount
  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Save state to localStorage
  useEffect(() => {
    try {
      const data = {
        currentLevelId,
        unlockedLevel,
        starsPerLevel,
        coins,
        soundEnabled,
        language,
        selectedSkin,
        unlockedSkins,
        hammers,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }, [currentLevelId, unlockedLevel, starsPerLevel, coins, soundEnabled, language, selectedSkin, unlockedSkins, hammers]);

  // Load level data whenever currentLevelId changes
  useEffect(() => {
    const lvl = getLevel(currentLevelId);
    setActiveLevel(lvl);
    setArrows(lvl.arrows.map((a) => ({ ...a, isEscaped: false })));
    setDrops(lvl.maxDrops || 3);
    setEscapedCount(0);
    setShowVictoryModal(false);
    setIsHammerActive(false);
  }, [currentLevelId]);

  // Hammer tool actions
  const handleToggleHammer = () => {
    const isAr = language === 'ar';
    soundManager.playClick();
    if (isHammerActive) {
      setIsHammerActive(false);
      triggerToast(isAr ? 'تم إلغاء وضع المطرقة' : 'Hammer mode canceled');
      return;
    }

    if (hammers <= 0) {
      triggerToast(isAr ? 'لا تملك مطرقة! يمكنك شراؤها بـ 300 نقطة 🛒' : 'No hammers! Buy for 300 coins 🛒');
      setShowShopModal(true);
      return;
    }

    setIsHammerActive(true);
    triggerToast(isAr ? 'انقر على أي سهم لكسره بالمطرقة! 🔨' : 'Click any arrow to smash! 🔨');
  };

  const handleUseHammer = (arrowId: string) => {
    const isAr = language === 'ar';
    setHammers((prev) => Math.max(0, prev - 1));
    setIsHammerActive(false);
    triggerToast(isAr ? 'تم كسر السهم بالمطرقة بنجاح! 🔨💥' : 'Arrow smashed with hammer! 🔨💥');
    handleArrowEscaped(arrowId);
  };

  const handleBuyHammer = (cost: number) => {
    const isAr = language === 'ar';
    if (coins >= cost) {
      setCoins((prev) => prev - cost);
      setHammers((prev) => prev + 1);
      triggerToast(isAr ? 'تم شراء مطرقة بنجاح! 🔨' : 'Hammer purchased! 🔨');
    }
  };

  // Toast notification timer
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 1800);
  };

  // Handle Arrow Escaped successfully
  const handleArrowEscaped = (arrowId: string) => {
    setArrows((prev) => {
      const next = prev.map((a) => (a.id === arrowId ? { ...a, isEscaped: true } : a));
      const remaining = next.filter((a) => !a.isEscaped).length;
      const newEscapedCount = next.length - remaining;
      setEscapedCount(newEscapedCount);

      // Check level victory condition
      if (remaining === 0) {
        setTimeout(() => {
          handleLevelCompleted();
        }, 400);
      }
      return next;
    });
  };

  // Handle Arrow Blocked move (takes 1 drop life if penalty)
  const handleArrowBlocked = (arrowId: string, blockerId: string) => {
    const isAr = language === 'ar';
    triggerToast(isAr ? 'احترس! السهم مسدود من اتجاهه' : 'Blocked! Another arrow is in front');

    setDrops((prev) => {
      const nextDrops = Math.max(0, prev - 1);
      if (nextDrops === 0) {
        // Option to reset level or refill drops
        triggerToast(isAr ? 'نفذت المحاولات! جرب ثانية' : 'Out of drops! Restarting level');
        setTimeout(() => {
          handleRestartLevel();
        }, 1200);
      }
      return nextDrops;
    });
  };

  // Victory Handler
  const handleLevelCompleted = () => {
    // Check if level was already completed previously
    const isAlreadyCleared = (starsPerLevel[currentLevelId] || 0) > 0;
    const coinsReward = isAlreadyCleared ? 0 : 10;
    setLastCoinsEarned(coinsReward);

    const starsEarned = drops === 3 ? 3 : drops === 2 ? 2 : 1;

    setStarsPerLevel((prev) => ({
      ...prev,
      [currentLevelId]: Math.max(prev[currentLevelId] || 0, starsEarned),
    }));

    if (coinsReward > 0) {
      setCoins((prev) => prev + coinsReward);
    }

    setUnlockedLevel((prev) => Math.max(prev, currentLevelId + 1));

    setShowVictoryModal(true);
  };

  const handleNextLevel = () => {
    setShowVictoryModal(false);
    setCurrentLevelId((prev) => prev + 1);
  };

  const handleRestartLevel = () => {
    setArrows(activeLevel.arrows.map((a) => ({ ...a, isEscaped: false })));
    setDrops(activeLevel.maxDrops || 3);
    setEscapedCount(0);
    setShowVictoryModal(false);
  };

  const totalArrowsCount = activeLevel.arrows.length;
  const progressPercent = totalArrowsCount > 0 ? (escapedCount / totalArrowsCount) * 100 : 0;
  const isAr = language === 'ar';

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen bg-gradient-to-b from-sky-50/70 via-slate-50 to-amber-50/40 text-slate-800 font-sans flex flex-col justify-between selection:bg-sky-200 overflow-x-hidden antialiased relative"
    >
      {/* Background Decorative Ambient Spheres */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Header */}
      <TopBar
        levelNumber={activeLevel.id}
        difficultyAr={activeLevel.difficulty}
        difficultyEn={activeLevel.difficultyEn}
        progressPercent={progressPercent}
        drops={drops}
        maxDrops={activeLevel.maxDrops || 3}
        language={language}
        soundEnabled={soundEnabled}
        coins={coins}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenLevelSelect={() => setShowLevelSelectModal(true)}
        onOpenShop={() => setShowShopModal(true)}
        onToggleSound={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          soundManager.setEnabled(next);
        }}
        onRestartLevel={handleRestartLevel}
      />

      {/* Floating Toast Notice */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 bg-slate-800/90 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg backdrop-blur-md animate-fade-in flex items-center gap-2">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Interactive 3D Arrow Board Stage */}
      <main className="flex-1 flex flex-col items-center justify-center relative w-full px-2">
        {/* Active Hammer Mode Banner */}
        {isHammerActive && (
          <div className="mb-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xs px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 animate-bounce">
            <span className="text-base">🔨</span>
            <span>{isAr ? 'وضع المطرقة مفعل: انقر على أي سهم لكسره!' : 'Hammer Mode Active: Click any arrow to smash!'}</span>
            <button
              onClick={() => setIsHammerActive(false)}
              className="mr-2 bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        )}

        {/* Board */}
        <ArrowMazeBoard
          arrows={arrows}
          gridCols={activeLevel.gridSize.cols}
          gridRows={activeLevel.gridSize.rows}
          onArrowEscaped={handleArrowEscaped}
          onArrowBlocked={handleArrowBlocked}
          selectedSkin={selectedSkin}
          isCompleted={escapedCount === totalArrowsCount}
          isHammerActive={isHammerActive}
          onUseHammer={handleUseHammer}
        />

        {/* In-Game Action Bar Dock */}
        <div className="flex items-center justify-center gap-3 mt-2 mb-1 z-20">
          <button
            id="btn-hammer-tool"
            onClick={handleToggleHammer}
            className={`px-4 py-2 rounded-2xl border-2 font-black text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
              isHammerActive
                ? 'bg-amber-500 text-white border-amber-300 ring-4 ring-amber-300/40 scale-105 animate-pulse'
                : 'bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-amber-200 text-amber-900 hover:border-amber-300 hover:scale-105 active:scale-95'
            }`}
            title={isAr ? 'استخدام المطرقة لكسر سهم' : 'Use Hammer to break an arrow'}
          >
            <span className="text-lg">🔨</span>
            <span>{isAr ? 'المطرقة' : 'Hammer'}</span>
            <span className="bg-amber-200/90 text-amber-950 font-extrabold text-[11px] px-2 py-0.5 rounded-full border border-amber-300">
              {hammers}
            </span>
          </button>

          <button
            id="btn-restart-game"
            onClick={() => {
              soundManager.playClick();
              handleRestartLevel();
            }}
            className="px-3.5 py-2 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-extrabold text-xs flex items-center gap-1.5 shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>{isAr ? 'إعادة' : 'Reset'}</span>
          </button>
        </div>
      </main>

      {/* Bottom Footer Description matching user prompt & screenshot details */}
      <footer className="w-full max-w-2xl mx-auto px-4 pb-6 pt-2 text-center text-slate-400 text-xs font-medium leading-relaxed select-none">
        <p dir="rtl">
          المطالبة الإضافية لاستوديو غوغل: استخدام ألوان زاهية وناعمة، ومؤثرات حركية سلسة (Swoosh و Pop)، ونظام مكافآت لتحفيز اللاعبين.
        </p>
      </footer>

      {/* Modals & Overlays */}
      {showVictoryModal && (
        <VictoryModal
          levelNumber={currentLevelId}
          stars={starsPerLevel[currentLevelId] || 3}
          coinsEarned={lastCoinsEarned}
          language={language}
          onNextLevel={handleNextLevel}
          onReplay={handleRestartLevel}
          onLevelSelect={() => {
            setShowVictoryModal(false);
            setShowLevelSelectModal(true);
          }}
        />
      )}

      {showLevelSelectModal && (
        <LevelSelectModal
          unlockedLevel={unlockedLevel}
          currentLevel={currentLevelId}
          starsPerLevel={starsPerLevel}
          language={language}
          onSelectLevel={(id) => {
            setCurrentLevelId(id);
            setShowLevelSelectModal(false);
          }}
          onClose={() => setShowLevelSelectModal(false)}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          soundEnabled={soundEnabled}
          language={language}
          onToggleSound={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            soundManager.setEnabled(next);
          }}
          onChangeLanguage={(lang) => setLanguage(lang)}
          onResetProgress={() => {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            setCurrentLevelId(1);
            setUnlockedLevel(1);
            setStarsPerLevel({});
            setCoins(0);
            setShowSettingsModal(false);
          }}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {showShopModal && (
        <ShopModal
          coins={coins}
          hammers={hammers}
          selectedSkin={selectedSkin}
          unlockedSkins={unlockedSkins}
          language={language}
          onSelectSkin={(skin) => setSelectedSkin(skin)}
          onUnlockSkin={(skin, cost) => {
            setCoins((prev) => prev - cost);
            setUnlockedSkins((prev) => [...prev, skin]);
            setSelectedSkin(skin);
          }}
          onBuyHammer={handleBuyHammer}
          onClose={() => setShowShopModal(false)}
        />
      )}
    </div>
  );
}
