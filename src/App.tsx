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
import { RainItem } from './components/RainStrikeOverlay';
import { Sparkles, HelpCircle, RefreshCw } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'arrow_escape_game_data_v1';

// Helper to compute highest unlocked level based on strictly completed levels with stars
const computeUnlockedLevel = (starsMap: Record<number, number>): number => {
  let lvl = 1;
  while (starsMap[lvl] && starsMap[lvl] > 0) {
    lvl++;
  }
  return lvl;
};

export default function App() {
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

  const [unlockedLevel, setUnlockedLevel] = useState<number>(() => {
    return computeUnlockedLevel(starsPerLevel);
  });

  // Keep unlockedLevel strictly aligned with starsPerLevel
  useEffect(() => {
    const computed = computeUnlockedLevel(starsPerLevel);
    setUnlockedLevel(computed);
  }, [starsPerLevel]);

  // Game persistent state - initialized directly from localStorage with fallback to current highest playable level
  const [currentLevelId, setCurrentLevelId] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.currentLevelId === 'number' && parsed.currentLevelId >= 1) {
          const maxPlayable = computeUnlockedLevel(parsed.starsPerLevel || {});
          return Math.min(parsed.currentLevelId, maxPlayable);
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 1;
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

  const [thunders, setThunders] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.thunders === 'number') {
          return parsed.thunders;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 1; // 1 free starter thunder bolt
  });

  const [creams, setCreams] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.creams === 'number') {
          return parsed.creams;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 1; // 1 free starter cream
  });

  const [isHammerActive, setIsHammerActive] = useState<boolean>(false);
  const [lastCoinsEarned, setLastCoinsEarned] = useState<number>(10);

  // Modals state
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const [showLevelSelectModal, setShowLevelSelectModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showShopModal, setShowShopModal] = useState<boolean>(false);

  // Rain Strikes overlay state & app clock
  const [rainItems, setRainItems] = useState<RainItem[]>([]);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('09:41');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setCurrentTimeStr(`${h}:${m}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 10000);
    return () => clearInterval(timer);
  }, []);

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
        thunders,
        creams,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }, [currentLevelId, unlockedLevel, starsPerLevel, coins, soundEnabled, language, selectedSkin, unlockedSkins, hammers, thunders, creams]);

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
      triggerToast(isAr ? 'لا تملك مطرقة! يمكنك شراؤها بـ 45 نقطة 🛒' : 'No hammers! Buy for 45 coins 🛒');
      setShowShopModal(true);
      return;
    }

    setIsHammerActive(true);
    triggerToast(isAr ? 'انقر على أي سهم لكسره بالمطرقة! 🔨' : 'Click any arrow to smash! 🔨');
  };

  const handleUseHammer = (arrowId: string) => {
    const isAr = language === 'ar';
    const targetArrow = arrows.find((a) => a.id === arrowId);

    if (targetArrow) {
      // Estimate tile size for rain target coordinate calculation
      const estimatedTile = Math.max(24, Math.min(54, Math.floor((Math.min(window.innerWidth, 460) - 32) / activeLevel.gridSize.cols)));
      const rainItem: RainItem = {
        id: `hammer-rain-${arrowId}-${Date.now()}`,
        type: 'hammer',
        x: targetArrow.gridX * estimatedTile + estimatedTile / 2,
        y: targetArrow.gridY * estimatedTile + estimatedTile / 2,
        delay: 0,
      };
      setRainItems([rainItem]);
    }

    soundManager.playSmash();
    setHammers((prev) => Math.max(0, prev - 1));
    setIsHammerActive(false);
    triggerToast(isAr ? 'تم تساقط المطرقة وكسر السهم! 🔨💥' : 'Hammer rained & smashed arrow! 🔨💥');

    setTimeout(() => {
      handleArrowEscaped(arrowId);
      setRainItems([]);
    }, 420);
  };

  const handleBuyHammer = (cost: number) => {
    const isAr = language === 'ar';
    if (coins >= cost) {
      setCoins((prev) => prev - cost);
      setHammers((prev) => prev + 1);
      triggerToast(isAr ? 'تم شراء مطرقة بنجاح! 🔨' : 'Hammer purchased! 🔨');
    }
  };

  const handleBuyThunder = (cost: number) => {
    const isAr = language === 'ar';
    if (coins >= cost) {
      setCoins((prev) => prev - cost);
      setThunders((prev) => prev + 1);
      triggerToast(isAr ? 'تم شراء ضربة رعد بنجاح! ⚡' : 'Thunder Strike purchased! ⚡');
    }
  };

  const handleBuyCream = (cost: number) => {
    const isAr = language === 'ar';
    if (coins >= cost) {
      setCoins((prev) => prev - cost);
      setCreams((prev) => prev + 1);
      triggerToast(isAr ? 'تم شراء كريمة سحرية بنجاح! 🍦' : 'Magic Cream purchased! 🍦');
    }
  };

  const handleBuyBundle = (cost: number) => {
    const isAr = language === 'ar';
    if (coins >= cost) {
      setCoins((prev) => prev - cost);
      setCreams((prev) => prev + 1);
      setHammers((prev) => prev + 1);
      setThunders((prev) => prev + 1);
      triggerToast(isAr ? 'تم شراء بكج الأدوات الشامل بنجاح! 🍦🔨⚡' : 'Mega Power-Up Bundle purchased! 🍦🔨⚡');
    }
  };

  const handleUseLightning = () => {
    const isAr = language === 'ar';
    soundManager.playClick();

    if (thunders <= 0) {
      triggerToast(isAr ? 'لا تملك رعد! يمكنك شراؤه بـ 95 نقطة 🛒' : 'No thunder! Buy for 95 coins 🛒');
      setShowShopModal(true);
      return;
    }

    const unescaped = arrows.filter((a) => !a.isEscaped);
    if (unescaped.length === 0) return;

    soundManager.playThunder();

    // Select up to 3 random unescaped arrows to destroy
    const shuffled = [...unescaped].sort(() => 0.5 - Math.random());
    const selectedToSmash = shuffled.slice(0, 3);
    const smashedIds = new Set(selectedToSmash.map((a) => a.id));

    const estimatedTile = Math.max(24, Math.min(54, Math.floor((Math.min(window.innerWidth, 460) - 32) / activeLevel.gridSize.cols)));
    const thunderRainItems: RainItem[] = selectedToSmash.map((arrow, idx) => ({
      id: `thunder-rain-${arrow.id}-${Date.now()}`,
      type: 'thunder',
      x: arrow.gridX * estimatedTile + estimatedTile / 2,
      y: arrow.gridY * estimatedTile + estimatedTile / 2,
      delay: idx * 80,
    }));
    setRainItems(thunderRainItems);

    setThunders((prev) => Math.max(0, prev - 1));
    triggerToast(
      isAr
        ? `⚡ تساقط مطر الصواعق على ${smashedIds.size} أسهم ودمرها!`
        : `⚡ Lightning rained on ${smashedIds.size} arrows!`
    );

    setTimeout(() => {
      setArrows((prev) => {
        const next = prev.map((a) => (smashedIds.has(a.id) ? { ...a, isEscaped: true } : a));
        const remaining = next.filter((a) => !a.isEscaped).length;
        const newEscapedCount = next.length - remaining;
        setEscapedCount(newEscapedCount);

        if (remaining === 0) {
          setTimeout(() => {
            handleLevelCompleted();
          }, 400);
        }
        return next;
      });
      setRainItems([]);
    }, 450);
  };

  const handleUseCream = () => {
    const isAr = language === 'ar';
    soundManager.playClick();

    if (creams <= 0) {
      triggerToast(isAr ? 'لا تملك كريمة! يمكنك شراؤها بـ 129 نقطة 🛒' : 'No cream! Buy for 129 coins 🛒');
      setShowShopModal(true);
      return;
    }

    const unescaped = arrows.filter((a) => !a.isEscaped);
    if (unescaped.length === 0) return;

    soundManager.playSmash();

    // Select up to 5 random unescaped arrows to clear
    const shuffled = [...unescaped].sort(() => 0.5 - Math.random());
    const selectedToSmash = shuffled.slice(0, 5);
    const smashedIds = new Set(selectedToSmash.map((a) => a.id));

    const estimatedTile = Math.max(24, Math.min(54, Math.floor((Math.min(window.innerWidth, 460) - 32) / activeLevel.gridSize.cols)));
    const creamRainItems: RainItem[] = selectedToSmash.map((arrow, idx) => ({
      id: `cream-rain-${arrow.id}-${Date.now()}`,
      type: 'cream',
      x: arrow.gridX * estimatedTile + estimatedTile / 2,
      y: arrow.gridY * estimatedTile + estimatedTile / 2,
      delay: idx * 60,
    }));
    setRainItems(creamRainItems);

    setCreams((prev) => Math.max(0, prev - 1));
    triggerToast(
      isAr
        ? `🍦 تساقط مطر الكريمة لإزالة ${smashedIds.size} أسهم!`
        : `🍦 Cream rain removed ${smashedIds.size} arrows!`
    );

    setTimeout(() => {
      setArrows((prev) => {
        const next = prev.map((a) => (smashedIds.has(a.id) ? { ...a, isEscaped: true } : a));
        const remaining = next.filter((a) => !a.isEscaped).length;
        const newEscapedCount = next.length - remaining;
        setEscapedCount(newEscapedCount);

        if (remaining === 0) {
          setTimeout(() => {
            handleLevelCompleted();
          }, 400);
        }
        return next;
      });
      setRainItems([]);
    }, 480);
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
    const escapedArrow = arrows.find((a) => a.id === arrowId);
    if (escapedArrow) {
      if (escapedArrow.isStar || escapedArrow.type === 'star') {
        const isAr = language === 'ar';
        setCoins((prev) => prev + 25);
        triggerToast(isAr ? '🌟 سهم النجمة الذهبية منحك +25 نقطة!' : '🌟 Star Arrow granted +25 coins!');
      } else if (escapedArrow.isGhost || escapedArrow.type === 'ghost') {
        const isAr = language === 'ar';
        triggerToast(isAr ? '👻 سهم الشبح اخترق العوائق وهرب ببراعة!' : '👻 Ghost Arrow phased through obstacles!');
      }
    }

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
    const starsEarned = drops === 3 ? 3 : drops === 2 ? 2 : 1;
    const pointsPerStar = 11;
    const pointsForRun = starsEarned * pointsPerStar; // 11 points per star

    const prevStars = starsPerLevel[currentLevelId] || 0;
    const newStars = Math.max(prevStars, starsEarned);
    const addedStars = newStars - prevStars;
    const coinsReward = addedStars * pointsPerStar;

    setLastCoinsEarned(pointsForRun);

    const updatedStars = {
      ...starsPerLevel,
      [currentLevelId]: newStars,
    };

    setStarsPerLevel(updatedStars);

    if (coinsReward > 0) {
      setCoins((prev) => prev + coinsReward);
    }

    const nextUnlocked = computeUnlockedLevel(updatedStars);
    setUnlockedLevel(nextUnlocked);

    setShowVictoryModal(true);
  };

  const handleNextLevel = () => {
    setShowVictoryModal(false);
    const nextId = currentLevelId + 1;
    setCurrentLevelId(nextId);
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
      className="min-h-screen w-full bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-950 via-slate-900 to-indigo-950 text-slate-800 font-sans flex items-center justify-center p-0 sm:p-3 md:p-5 overflow-x-hidden antialiased select-none"
    >
      {/* Background Decorative Ambient Spheres for Desktop View */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Mobile Phone Application Frame (واجهة تطبيق) */}
      <div className="w-full max-w-[460px] sm:max-w-[480px] h-screen sm:h-[94vh] sm:max-h-[900px] bg-gradient-to-b from-sky-50/90 via-white to-slate-100/95 sm:rounded-[46px] border-0 sm:border-[8px] sm:border-slate-800/90 shadow-[0_25px_70px_rgba(0,0,0,0.6)] flex flex-col relative overflow-hidden backdrop-blur-md">
        
        {/* Mobile Top Status Bar */}
        <div className="w-full bg-slate-900 text-white px-5 py-2 flex items-center justify-between text-xs font-semibold z-40 shrink-0 select-none shadow-sm">
          <span className="font-mono text-[11px] text-slate-200 tracking-wider font-black">{currentTimeStr}</span>
          {/* Dynamic Island Notch Pill */}
          <div className="w-20 sm:w-24 h-4 bg-black rounded-full flex items-center justify-center gap-1.5 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 text-[11px] font-bold">
            <span>📶 5G</span>
            <span>🔋 98%</span>
          </div>
        </div>

        {/* App Top Title Bar */}
        <div className="w-full bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 px-4 py-1.5 flex items-center justify-between text-white shadow-md z-30 shrink-0 select-none">
          <div className="flex items-center gap-2">
            <div className="w-6.5 h-6.5 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xs shadow-inner font-bold">
              🎯
            </div>
            <span className="font-black text-xs sm:text-sm tracking-wide">
              {isAr ? 'هروب الأسهم - تطبيق الألغاز' : 'Arrow Escape App'}
            </span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-black border border-white/30 text-amber-200">
            PRO v2.5
          </span>
        </div>

        {/* Main App Body Content Container */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto relative p-1 sm:p-2">
          {/* Top Bar Navigation */}
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
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-slate-800/90 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg backdrop-blur-md animate-fade-in flex items-center gap-2">
              <span>✨</span>
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Main Interactive 3D Arrow Board Stage */}
          <main className="flex-1 flex flex-col items-center justify-center relative w-full px-1 sm:px-2">
            {/* Steel Lock Level Banner for Hammer/Thunder required levels */}
            {activeLevel.requiresHammer && !isHammerActive && (
              <div className="mb-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xs px-3.5 py-1.5 rounded-2xl shadow-md flex items-center gap-2 animate-pulse">
                <span className="text-base">🔨⚡</span>
                <span className="text-[11px] leading-tight">
                  {isAr
                    ? 'مرحلة قفل فولاذي! استخدم المطرقة 🔨 أو الرعد ⚡ لكسر العقدة المستحيلة'
                    : 'Steel Lock Level! Use Hammer 🔨 or Thunder ⚡ to break deadlock'}
                </span>
              </div>
            )}

            {/* Active Hammer Mode Banner */}
            {isHammerActive && (
              <div className="mb-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xs px-3.5 py-1.5 rounded-2xl shadow-lg flex items-center gap-2 animate-bounce">
                <span className="text-base">🔨</span>
                <span className="text-[11px]">{isAr ? 'وضع المطرقة مفعل: انقر على أي سهم لكسره!' : 'Hammer Mode: Click arrow to smash!'}</span>
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
              rainItems={rainItems}
            />

            {/* In-Game Action Bar Dock */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 my-1 z-20">
              {/* Cream Power-Up Button (129 coins in shop) */}
              <button
                id="btn-cream-tool"
                onClick={handleUseCream}
                className="px-2.5 sm:px-3.5 py-1.5 rounded-2xl border-2 border-pink-300 bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 text-pink-900 hover:border-pink-400 font-black text-[11px] sm:text-xs flex items-center gap-1 shadow-xs hover:scale-105 active:scale-95 cursor-pointer transition-all"
                title={isAr ? 'استخدام الكريمة لإزالة 5 أسهم عشوائية (129 نقطة)' : 'Use Cream to remove 5 random arrows (129 coins)'}
              >
                <span className="text-base sm:text-lg">🍦</span>
                <span>{isAr ? 'كريمة' : 'Cream'}</span>
                <span className="bg-pink-200/90 text-pink-950 font-extrabold text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full border border-pink-300">
                  {creams}
                </span>
              </button>

              {/* Thunder Power-Up Button (95 coins in shop) */}
              <button
                id="btn-thunder-tool"
                onClick={handleUseLightning}
                className="px-2.5 sm:px-3.5 py-1.5 rounded-2xl border-2 border-sky-300 bg-gradient-to-r from-sky-50 via-cyan-50 to-blue-50 text-sky-900 hover:border-sky-400 font-black text-[11px] sm:text-xs flex items-center gap-1 shadow-xs hover:scale-105 active:scale-95 cursor-pointer transition-all"
                title={isAr ? 'استخدام ضربة الرعد لكسر 3 أسهم عشوائية (95 نقطة)' : 'Use Lightning to break 3 random arrows (95 coins)'}
              >
                <span className="text-base sm:text-lg">⚡</span>
                <span>{isAr ? 'رعد' : 'Thunder'}</span>
                <span className="bg-sky-200/90 text-sky-950 font-extrabold text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full border border-sky-300">
                  {thunders}
                </span>
              </button>

              {/* Magic Hammer Power-Up Button (45 coins in shop) */}
              <button
                id="btn-hammer-tool"
                onClick={handleToggleHammer}
                className={`px-2.5 sm:px-3.5 py-1.5 rounded-2xl border-2 font-black text-[11px] sm:text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer ${
                  isHammerActive
                    ? 'bg-amber-500 text-white border-amber-300 ring-4 ring-amber-300/40 scale-105 animate-pulse'
                    : 'bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-amber-200 text-amber-900 hover:border-amber-300 hover:scale-105 active:scale-95'
                }`}
                title={isAr ? 'استخدام المطرقة لكسر سهم' : 'Use Hammer to break an arrow'}
              >
                <span className="text-base sm:text-lg">🔨</span>
                <span>{isAr ? 'المطرقة' : 'Hammer'}</span>
                <span className="bg-amber-200/90 text-amber-950 font-extrabold text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full border border-amber-300">
                  {hammers}
                </span>
              </button>

              {/* Reset Level Button */}
              <button
                id="btn-restart-game"
                onClick={() => {
                  soundManager.playClick();
                  handleRestartLevel();
                }}
                className="px-2.5 py-1.5 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-extrabold text-[11px] sm:text-xs flex items-center gap-1 shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>{isAr ? 'إعادة' : 'Reset'}</span>
              </button>
            </div>
          </main>

          {/* Bottom Footer */}
          <footer className="w-full max-w-2xl mx-auto px-2 pb-1 text-center text-slate-400 text-[10px] sm:text-xs font-medium leading-tight select-none shrink-0">
            <p dir="rtl">
              تطبيق الألغاز - ألوان زاهية وناعمة، ومؤثرات مطرية ساحرة (🍦 ⚡ 🔨)
            </p>
          </footer>
        </div>

        {/* Bottom App Home Indicator Bar */}
        <div className="w-full bg-slate-900/90 py-1.5 flex items-center justify-center shrink-0 z-40">
          <div className="w-28 sm:w-32 h-1 bg-slate-400/80 rounded-full" />
        </div>
      </div>

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
          thunders={thunders}
          creams={creams}
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
          onBuyThunder={handleBuyThunder}
          onBuyCream={handleBuyCream}
          onBuyBundle={handleBuyBundle}
          onClose={() => setShowShopModal(false)}
        />
      )}
    </div>
  );
}
