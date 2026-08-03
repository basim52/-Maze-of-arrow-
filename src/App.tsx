import React, { useState, useEffect } from 'react';
import { Arrow, Level, ThemeSkin, ArrowSkin } from './types';
import { getLevel, getGalaxyLevel, getLongLevel, MONSTER_BOSS_LEVEL_IDS } from './utils/levelGenerator';
import { soundManager } from './utils/sound';
import { TopBar } from './components/TopBar';
import { ArrowMazeBoard } from './components/ArrowMazeBoard';
import { VictoryModal } from './components/VictoryModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { SettingsModal } from './components/SettingsModal';
import { ShopModal } from './components/ShopModal';
import { InventoryModal } from './components/InventoryModal';
import { DailyWheelModal } from './components/DailyWheelModal';
import { FridayUpdatesModal } from './components/FridayUpdatesModal';
import { LandingModal } from './components/LandingModal';
import { TipsModal } from './components/TipsModal';
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

  const [musicEnabled, setMusicEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.musicEnabled === 'boolean') {
          return parsed.musicEnabled;
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

  const [selectedArrowSkin, setSelectedArrowSkin] = useState<ArrowSkin>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedArrowSkin) return parsed.selectedArrowSkin;
      }
    } catch (e) {}
    return 'classic';
  });

  const [unlockedArrowSkins, setUnlockedArrowSkins] = useState<ArrowSkin[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.unlockedArrowSkins)) return parsed.unlockedArrowSkins;
      }
    } catch (e) {}
    return ['classic'];
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

  const [chocolates, setChocolates] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.chocolates === 'number') {
          return parsed.chocolates;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 1; // 1 free starter chocolate bar
  });

  const [spaceCoins, setSpaceCoins] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.spaceCoins === 'number') {
          return parsed.spaceCoins;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 0;
  });

  const [tomatoes, setTomatoes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.tomatoes === 'number') {
          return parsed.tomatoes;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 0;
  });

  const [hammerSkinEscapedCount, setHammerSkinEscapedCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.hammerSkinEscapedCount === 'number') {
          return parsed.hammerSkinEscapedCount;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 0;
  });

  const [spaceCreams, setSpaceCreams] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.spaceCreams === 'number') {
          return parsed.spaceCreams;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 0;
  });

  const [cakes, setCakes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.cakes === 'number') {
          return parsed.cakes;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 0;
  });

  const [cakeArrowCounter, setCakeArrowCounter] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.cakeArrowCounter === 'number') {
          return parsed.cakeArrowCounter;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 0;
  });

  const [crystalNeonEscapedCount, setCrystalNeonEscapedCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.crystalNeonEscapedCount === 'number') {
          return parsed.crystalNeonEscapedCount;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 0;
  });

  const [gameMode, setGameMode] = useState<'main' | 'galaxy' | 'long'>('main');

  const [currentGalaxyLevelId, setCurrentGalaxyLevelId] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.currentGalaxyLevelId === 'number' && parsed.currentGalaxyLevelId >= 1) {
          return parsed.currentGalaxyLevelId;
        }
      }
    } catch (e) {}
    return 1;
  });

  const [unlockedGalaxyLevel, setUnlockedGalaxyLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.unlockedGalaxyLevel === 'number' && parsed.unlockedGalaxyLevel >= 1) {
          return parsed.unlockedGalaxyLevel;
        }
      }
    } catch (e) {}
    return 1;
  });

  const [starsPerGalaxyLevel, setStarsPerGalaxyLevel] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.starsPerGalaxyLevel && typeof parsed.starsPerGalaxyLevel === 'object') {
          return parsed.starsPerGalaxyLevel;
        }
      }
    } catch (e) {}
    return {};
  });

  // Long panoramic maze level states
  const [currentLongLevelId, setCurrentLongLevelId] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.currentLongLevelId === 'number' && parsed.currentLongLevelId >= 1) {
          return parsed.currentLongLevelId;
        }
      }
    } catch (e) {}
    return 1;
  });

  const [unlockedLongLevel, setUnlockedLongLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.unlockedLongLevel === 'number' && parsed.unlockedLongLevel >= 1) {
          return parsed.unlockedLongLevel;
        }
      }
    } catch (e) {}
    return 1;
  });

  const [starsPerLongLevel, setStarsPerLongLevel] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.starsPerLongLevel && typeof parsed.starsPerLongLevel === 'object') {
          return parsed.starsPerLongLevel;
        }
      }
    } catch (e) {}
    return {};
  });

  const [isEventUnlocked, setIsEventUnlocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('arrow_event_unlocked');
      if (saved === 'true') return true;
      const gameSaved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (gameSaved) {
        const parsed = JSON.parse(gameSaved);
        if (parsed.isEventUnlocked) return true;
      }
    } catch (e) {}
    return false;
  });

  const [levelSelectTab, setLevelSelectTab] = useState<'main' | 'galaxy' | 'long'>('main');

  const [isHammerActive, setIsHammerActive] = useState<boolean>(false);
  const [lastCoinsEarned, setLastCoinsEarned] = useState<number>(10);
  const [spaceCoinsEarned, setSpaceCoinsEarned] = useState<number>(0);

  // Modals state
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const [showLevelSelectModal, setShowLevelSelectModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showShopModal, setShowShopModal] = useState<boolean>(false);
  const [showInventoryModal, setShowInventoryModal] = useState<boolean>(false);
  const [showDailyWheelModal, setShowDailyWheelModal] = useState<boolean>(false);
  const [showFridayUpdatesModal, setShowFridayUpdatesModal] = useState<boolean>(false);
  const [showLandingModal, setShowLandingModal] = useState<boolean>(true);
  const [showTipsModal, setShowTipsModal] = useState<boolean>(false);
  const [shopModalTab, setShopModalTab] = useState<'all' | 'galaxy' | 'tools' | 'skins' | 'arrowSkins'>('all');

  const handleOpenTips = () => {
    soundManager.playClick();
    setShowTipsModal(true);
  };

  const handleOpenShopWithTab = (tab: 'all' | 'galaxy' | 'tools' | 'skins' | 'arrowSkins' = 'all') => {
    setShopModalTab(tab);
    setShowTipsModal(false);
    setShowShopModal(true);
  };

  const handleCloseLanding = () => {
    setShowLandingModal(false);
  };

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

  // Active Level State initialized lazily
  const [activeLevel, setActiveLevel] = useState<Level>(() =>
    gameMode === 'galaxy'
      ? getGalaxyLevel(currentGalaxyLevelId)
      : gameMode === 'long'
      ? getLongLevel(currentLongLevelId)
      : getLevel(currentLevelId)
  );
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [escapedCount, setEscapedCount] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Configure sound manager on mount & handle user gesture for BGM
  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
    soundManager.setMusicEnabled(musicEnabled);
  }, [soundEnabled, musicEnabled]);

  useEffect(() => {
    const handleFirstGesture = () => {
      if (soundEnabled && musicEnabled) {
        soundManager.startBGM();
      }
    };
    window.addEventListener('click', handleFirstGesture);
    window.addEventListener('touchstart', handleFirstGesture);
    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, [soundEnabled, musicEnabled]);

  // Save state to localStorage
  useEffect(() => {
    try {
      const data = {
        currentLevelId,
        unlockedLevel,
        starsPerLevel,
        currentGalaxyLevelId,
        unlockedGalaxyLevel,
        starsPerGalaxyLevel,
        currentLongLevelId,
        unlockedLongLevel,
        starsPerLongLevel,
        gameMode,
        isEventUnlocked,
        coins,
        spaceCoins,
        tomatoes,
        spaceCreams,
        soundEnabled,
        musicEnabled,
        language,
        selectedSkin,
        unlockedSkins,
        selectedArrowSkin,
        unlockedArrowSkins,
        hammers,
        thunders,
        creams,
        chocolates,
        cakes,
        cakeArrowCounter,
        hammerSkinEscapedCount,
        crystalNeonEscapedCount,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      if (isEventUnlocked) {
        localStorage.setItem('arrow_event_unlocked', 'true');
      }
    } catch (e) {
      console.error(e);
    }
  }, [
    currentLevelId,
    unlockedLevel,
    starsPerLevel,
    currentGalaxyLevelId,
    unlockedGalaxyLevel,
    starsPerGalaxyLevel,
    currentLongLevelId,
    unlockedLongLevel,
    starsPerLongLevel,
    gameMode,
    isEventUnlocked,
    coins,
    spaceCoins,
    tomatoes,
    spaceCreams,
    soundEnabled,
    musicEnabled,
    language,
    selectedSkin,
    unlockedSkins,
    selectedArrowSkin,
    unlockedArrowSkins,
    hammers,
    thunders,
    creams,
    chocolates,
    cakes,
    cakeArrowCounter,
    hammerSkinEscapedCount,
    crystalNeonEscapedCount,
  ]);

  // Load level data whenever level or mode changes
  useEffect(() => {
    const lvl =
      gameMode === 'galaxy'
        ? getGalaxyLevel(currentGalaxyLevelId)
        : gameMode === 'long'
        ? getLongLevel(currentLongLevelId)
        : getLevel(currentLevelId);
    setActiveLevel(lvl);
    setArrows(lvl.arrows.map((a) => ({ ...a, isEscaped: false })));
    setDrops(lvl.maxDrops || 3);
    setEscapedCount(0);
    setShowVictoryModal(false);
    setIsHammerActive(false);
    setSpaceCoinsEarned(0);
  }, [currentLevelId, currentGalaxyLevelId, currentLongLevelId, gameMode]);

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

  const handleBuyChocolate = (cost: number) => {
    const isAr = language === 'ar';
    if (coins >= cost) {
      setCoins((prev) => prev - cost);
      setChocolates((prev) => prev + 1);
      triggerToast(isAr ? 'تم شراء الشوكولاتة السحرية بنجاح! 🍫' : 'Magic Chocolate purchased! 🍫');
    }
  };

  const handleBuyTomato = (cost: number) => {
    const isAr = language === 'ar';
    if (spaceCoins >= cost) {
      setSpaceCoins((prev) => prev - cost);
      setTomatoes((prev) => prev + 1);
      triggerToast(isAr ? 'تم شراء طماطة الفضاء بنجاح! 🍅🚀' : 'Space Tomato purchased! 🍅🚀');
    }
  };

  const handleBuySpaceCream = (cost: number) => {
    const isAr = language === 'ar';
    if (spaceCoins >= cost) {
      setSpaceCoins((prev) => prev - cost);
      setSpaceCreams((prev) => prev + 1);
      triggerToast(isAr ? 'تم شراء الكريمة الفضائية بنجاح! 🌌🍦' : 'Cosmic Space Cream purchased! 🌌🍦');
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

  const handleBuyCakeBundle = (cost: number) => {
    const isAr = language === 'ar';
    if (coins >= cost) {
      setCoins((prev) => prev - cost);
      setChocolates((prev) => prev + 1);
      setCreams((prev) => prev + 1);
      setCakes((prev) => prev + 1);
      triggerToast(isAr ? 'تم شراء بكج الكيك بنجاح! 🎂 (🍫+🍦+🎂)' : 'Cake Bundle purchased! 🎂 (🍫+🍦+🎂)');
    }
  };

  const registerEscapedArrowsForCake = (count: number) => {
    const isAr = language === 'ar';
    setCakeArrowCounter((prev) => {
      const next = prev + count;
      if (next >= 70) {
        const cakesEarned = Math.floor(next / 70);
        const remainder = next % 70;
        setCakes((c) => c + cakesEarned);
        soundManager.playVictory();
        triggerToast(
          isAr
            ? `🎂 تم إزالة ٧٠ سهم! حصلت على +${cakesEarned} كعكة مجانية! 🎉`
            : `🎂 70 arrows removed! Granted +${cakesEarned} free cake! 🎉`
        );
        return remainder;
      }
      return next;
    });
  };

  const handleExchangeCake = (cakeAmount = 1) => {
    const isAr = language === 'ar';
    if (cakes >= cakeAmount) {
      const coinsEarned = cakeAmount * 45;
      setCakes((prev) => prev - cakeAmount);
      setCoins((prev) => prev + coinsEarned);
      soundManager.playVictory();
      triggerToast(
        isAr
          ? `🎂 تم استبدال ${cakeAmount} كعكة بـ ${coinsEarned} نقطة بنجاح! 🪙`
          : `🎂 Exchanged ${cakeAmount} cake for ${coinsEarned} coins! 🪙`
      );
    } else {
      triggerToast(
        isAr
          ? 'عذراً، لا تملك كعكاً للاستبدال! يربح الكعك عند إزالة 70 سهم 🎂'
          : 'No cakes available to exchange! Earn cakes by removing 70 arrows 🎂'
      );
    }
  };

  const handleExchangeCoinsForSpaceCoins = (coinCost = 23, spaceCoinsEarned = 1) => {
    const isAr = language === 'ar';
    if (coins >= coinCost) {
      setCoins((prev) => prev - coinCost);
      setSpaceCoins((prev) => prev + spaceCoinsEarned);
      soundManager.playVictory();
      triggerToast(
        isAr
          ? `تم استبدال ${coinCost} نقطة بـ ${spaceCoinsEarned} عملة فضاء بنجاح! 🚀`
          : `Exchanged ${coinCost} coins for ${spaceCoinsEarned} Space Coin! 🚀`
      );
    } else {
      triggerToast(
        isAr
          ? `عذراً، تحتاج إلى ${coinCost} نقطة على الأقل للاستبدال!`
          : `You need at least ${coinCost} coins to exchange!`
      );
    }
  };

  const handleUseChocolate = () => {
    const isAr = language === 'ar';
    soundManager.playClick();

    if (chocolates <= 0) {
      triggerToast(isAr ? 'لا تملك شوكولاتة! يمكنك شراؤها بـ 55 نقطة 🛒' : 'No chocolate! Buy for 55 coins 🛒');
      setShowShopModal(true);
      return;
    }

    const unescaped = arrows.filter((a) => !a.isEscaped);
    if (unescaped.length === 0) return;

    soundManager.playSmash();

    // Select up to 2 random unescaped arrows to remove
    const shuffled = [...unescaped].sort(() => 0.5 - Math.random());
    const selectedToSmash = shuffled.slice(0, 2);
    const smashedIds = new Set(selectedToSmash.map((a) => a.id));

    const estimatedTile = Math.max(24, Math.min(54, Math.floor((Math.min(window.innerWidth, 460) - 32) / activeLevel.gridSize.cols)));
    const chocoRainItems: RainItem[] = selectedToSmash.map((arrow, idx) => ({
      id: `choco-rain-${arrow.id}-${Date.now()}`,
      type: 'chocolate',
      x: arrow.gridX * estimatedTile + estimatedTile / 2,
      y: arrow.gridY * estimatedTile + estimatedTile / 2,
      delay: idx * 70,
    }));
    setRainItems(chocoRainItems);

    setChocolates((prev) => Math.max(0, prev - 1));
    triggerToast(
      isAr
        ? `🍫 تساقط مطر الشوكولاتة لإزالة ${smashedIds.size} أسهم!`
        : `🍫 Chocolate rain removed ${smashedIds.size} arrows!`
    );

    setTimeout(() => {
      registerEscapedArrowsForCake(smashedIds.size);
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
      registerEscapedArrowsForCake(smashedIds.size);
      setRainItems([]);
    }, 450);
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
      registerEscapedArrowsForCake(smashedIds.size);
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
      registerEscapedArrowsForCake(smashedIds.size);
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
      registerEscapedArrowsForCake(smashedIds.size);
      setRainItems([]);
    }, 480);
  };

  const handleUseTomato = () => {
    const isAr = language === 'ar';
    soundManager.playClick();

    if (tomatoes <= 0) {
      triggerToast(isAr ? 'لا تملك طماطة! يمكنك شراؤها بـ 10 عملات فضاء 🌌' : 'No tomatoes! Buy for 10 space coins 🌌');
      setShowShopModal(true);
      return;
    }

    const unescaped = arrows.filter((a) => !a.isEscaped);
    if (unescaped.length === 0) return;

    soundManager.playSmash();

    // Select up to 6 random unescaped arrows to remove (Tomato deletes 6 arrows)
    const shuffled = [...unescaped].sort(() => 0.5 - Math.random());
    const selectedToSmash = shuffled.slice(0, 6);
    const smashedIds = new Set(selectedToSmash.map((a) => a.id));

    const estimatedTile = Math.max(24, Math.min(54, Math.floor((Math.min(window.innerWidth, 460) - 32) / activeLevel.gridSize.cols)));
    const tomatoRainItems: RainItem[] = selectedToSmash.map((arrow, idx) => ({
      id: `tomato-rain-${arrow.id}-${Date.now()}`,
      type: 'tomato',
      x: arrow.gridX * estimatedTile + estimatedTile / 2,
      y: arrow.gridY * estimatedTile + estimatedTile / 2,
      delay: idx * 50,
    }));
    setRainItems(tomatoRainItems);

    setTomatoes((prev) => Math.max(0, prev - 1));
    triggerToast(
      isAr
        ? `🍅 تساقط مطر الطماطة لإزالة ${smashedIds.size} أسهم!`
        : `🍅 Tomato rain deleted ${smashedIds.size} arrows!`
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
      registerEscapedArrowsForCake(smashedIds.size);
      setRainItems([]);
    }, 500);
  };

  const handleUseSpaceCream = () => {
    const isAr = language === 'ar';
    soundManager.playClick();

    if (spaceCreams <= 0) {
      triggerToast(isAr ? 'لا تملك كريمة فضائية! يمكنك شراؤها بـ 20 عملة فضاء 🌌' : 'No space cream! Buy for 20 space coins 🌌');
      setShowShopModal(true);
      return;
    }

    const unescaped = arrows.filter((a) => !a.isEscaped);
    if (unescaped.length === 0) return;

    soundManager.playSmash();

    // Select up to 7 random unescaped arrows to remove (Space Cream deletes 7 arrows)
    const shuffled = [...unescaped].sort(() => 0.5 - Math.random());
    const selectedToSmash = shuffled.slice(0, 7);
    const smashedIds = new Set(selectedToSmash.map((a) => a.id));

    const estimatedTile = Math.max(24, Math.min(54, Math.floor((Math.min(window.innerWidth, 460) - 32) / activeLevel.gridSize.cols)));
    const spaceCreamRainItems: RainItem[] = selectedToSmash.map((arrow, idx) => ({
      id: `spacecream-rain-${arrow.id}-${Date.now()}`,
      type: 'spaceCream',
      x: arrow.gridX * estimatedTile + estimatedTile / 2,
      y: arrow.gridY * estimatedTile + estimatedTile / 2,
      delay: idx * 50,
    }));
    setRainItems(spaceCreamRainItems);

    setSpaceCreams((prev) => Math.max(0, prev - 1));
    triggerToast(
      isAr
        ? `🌌🍦 تساقط مطر الكريمة الفضائية لإزالة ${smashedIds.size} أسهم!`
        : `🌌🍦 Space Cream rain deleted ${smashedIds.size} arrows!`
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
      registerEscapedArrowsForCake(smashedIds.size);
      setRainItems([]);
    }, 500);
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
    // 1. ALWAYS count towards Cake 70-Arrow progress
    registerEscapedArrowsForCake(1);

    // 2. Hammer Theme bonus counter
    if (selectedSkin === 'hammer') {
      setHammerSkinEscapedCount((prev) => {
        const next = prev + 1;
        if (next >= 200) {
          setHammers((h) => h + 1);
          const isAr = language === 'ar';
          soundManager.playVictory();
          triggerToast(
            isAr
              ? `🔨 اكتمل العداد (٢٠٠ سهم)! حصلت على مطرقة سحرية بنسبة ١٠٠٪! (+1 🔨)`
              : `🔨 200 arrows escaped! 100% Guaranteed Magic Hammer Granted! (+1 🔨)`
          );
          return 0;
        }
        return next;
      });
    }

    // 3. Crystal Neon Theme bonus counter
    if (selectedSkin === 'crystal_neon') {
      setCrystalNeonEscapedCount((prev) => {
        const next = prev + 1;
        if (next >= 50) {
          setCakes((c) => c + 1);
          setCoins((c) => c + 30);
          const isAr = language === 'ar';
          soundManager.playVictory();
          triggerToast(
            isAr
              ? '💎 اكتمل عداد النيون الكرستالي (50 سهم)! حصلت على كعكة مجانية 🎂 + 30 نقطة! 🎉'
              : '💎 Crystal Neon Counter complete (50 arrows)! Granted 1 free cake 🎂 + 30 coins! 🎉'
          );
          return 0;
        }
        return next;
      });
    }

    const escapedArrow = arrows.find((a) => a.id === arrowId);
    if (escapedArrow) {
      const isAlreadyCompleted =
        gameMode === 'galaxy'
          ? (starsPerGalaxyLevel[currentGalaxyLevelId] || 0) > 0
          : (starsPerLevel[currentLevelId] || 0) > 0;

      if (escapedArrow.isDiamond || escapedArrow.type === 'diamond') {
        const isAr = language === 'ar';
        if (!isAlreadyCompleted) {
          setCoins((prev) => prev + 7);
          triggerToast(isAr ? '💎 سهم محنك الماسي منحك +7 نقاط!' : '💎 Diamond Veteran Arrow granted +7 coins!');
        } else {
          triggerToast(isAr ? '💎 هذه المرحلة مكتملة سابقاً (لا نقاط سهم الماسي)' : '💎 Previously completed level (No extra diamond coins)');
        }
      } else if (escapedArrow.isStar || escapedArrow.type === 'star') {
        const isAr = language === 'ar';
        if (!isAlreadyCompleted) {
          setCoins((prev) => prev + 5);
          triggerToast(isAr ? '🌟 سهم النجمة الذهبية منحك +5 نقاط!' : '🌟 Star Arrow granted +5 coins!');
        } else {
          triggerToast(isAr ? '🌟 هذه المرحلة مكتملة سابقاً (لا نقاط نجمة إضافية)' : '🌟 Previously completed level (No extra star coins)');
        }
      } else if (escapedArrow.isGhost || escapedArrow.type === 'ghost') {
        const isAr = language === 'ar';
        triggerToast(isAr ? '👻 سهم الشبح اخترق العوائق وهرب ببراعة!' : '👻 Ghost Arrow phased through obstacles!');
      }

      // Rain & Thunderstorm Theme bonus (27% chance on each single arrow escape to drop 2 to 6 thunder bolts ⚡)
      if (selectedSkin === 'rainstorm' && Math.random() < 0.27) {
        const rewardThunders = Math.floor(Math.random() * 5) + 2; // 2 to 6 inclusive
        setThunders((prev) => prev + rewardThunders);
        const isAr = language === 'ar';
        soundManager.playThunder();
        triggerToast(
          isAr
            ? `⛈️⚡ خروج سهم! تساقطت صواعق العاصفة ومنحتك +${rewardThunders} عملة رعد ⚡!`
            : `⛈️⚡ Single arrow escape! Rainstorm dropped +${rewardThunders} Thunder ⚡ currency!`
        );
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

  // Handle Arrow Blocked move (takes 1 survival star life if penalty)
  const handleArrowBlocked = (arrowId: string, blockerId: string) => {
    const isAr = language === 'ar';

    setDrops((prev) => {
      const nextDrops = Math.max(0, prev - 1);
      if (nextDrops === 0) {
        triggerToast(isAr ? 'نفذت نجوم البقاء! أعِد المحاولة ⭐' : 'Out of Survival Stars! Restarting level ⭐');
        setTimeout(() => {
          handleRestartLevel();
        }, 1200);
      } else {
        triggerToast(isAr ? 'احترس! فقدت نجمة بقاء ⭐' : 'Watch out! Lost 1 Survival Star ⭐');
      }
      return nextDrops;
    });
  };

  // Event Levels Handlers
  const handleOpenEventLevels = () => {
    const isAr = language === 'ar';
    soundManager.playClick();
    if (!isEventUnlocked) {
      if (coins >= 200) {
        setCoins((prev) => prev - 200);
        setIsEventUnlocked(true);
        localStorage.setItem('arrow_event_unlocked', 'true');
        triggerToast(isAr ? 'تم فتح مراحل الأحداث الفضائية بنجاح! 🌌🚀 (خصم 200 نقطة)' : 'Event Levels unlocked! 🌌🚀 (200 pts)');
        setLevelSelectTab('galaxy');
        setShowLevelSelectModal(true);
      } else {
        triggerToast(isAr ? `عفواً، فتح مراحل الأحداث يتطلب 200 نقطة! 🪙 (رصيدك الحالي: ${coins})` : `Requires 200 points! (Current: ${coins})`);
        setLevelSelectTab('galaxy');
        setShowLevelSelectModal(true);
      }
    } else {
      setLevelSelectTab('galaxy');
      setShowLevelSelectModal(true);
    }
  };

  const handleUnlockEventInModal = () => {
    const isAr = language === 'ar';
    if (coins >= 200) {
      setCoins((prev) => prev - 200);
      setIsEventUnlocked(true);
      localStorage.setItem('arrow_event_unlocked', 'true');
      triggerToast(isAr ? 'تم فتح مراحل الأحداث الفضائية بنجاح! 🌌🚀 (خصم 200 نقطة)' : 'Event Levels unlocked! 🌌🚀 (200 pts)');
    } else {
      triggerToast(isAr ? `نقاطك لا تكفي! تحتاج 200 نقطة 🪙 (رصيدك الحالي: ${coins})` : `Not enough points! Requires 200 pts (Current: ${coins})`);
    }
  };

  const handleSelectMainLevel = (levelId: number) => {
    setGameMode('main');
    setCurrentLevelId(levelId);
    setShowLevelSelectModal(false);
  };

  const handleSelectGalaxyLevel = (galaxyId: number) => {
    setGameMode('galaxy');
    setCurrentGalaxyLevelId(galaxyId);
    setShowLevelSelectModal(false);
  };

  const handleSelectLongLevel = (longId: number) => {
    setGameMode('long');
    setCurrentLongLevelId(longId);
    setShowLevelSelectModal(false);
  };

  const handleLevelCompleted = () => {
    const isAr = language === 'ar';
    const starsEarned = drops === 3 ? 3 : drops === 2 ? 2 : 1;
    let pointsEarned = 0;

    const isAlreadyCompleted =
      gameMode === 'galaxy'
        ? (starsPerGalaxyLevel[currentGalaxyLevelId] || 0) > 0
        : gameMode === 'long'
        ? (starsPerLongLevel[currentLongLevelId] || 0) > 0
        : (starsPerLevel[currentLevelId] || 0) > 0;

    if (gameMode === 'galaxy') {
      const prevGalaxyStars = starsPerGalaxyLevel[currentGalaxyLevelId] || 0;
      pointsEarned = isAlreadyCompleted ? 0 : starsEarned * 4;
      if (selectedSkin === 'golden_throne' && pointsEarned > 0) {
        pointsEarned *= 2;
      }

      const newGalaxyStars = Math.max(prevGalaxyStars, starsEarned);
      const updatedGalaxyStars = {
        ...starsPerGalaxyLevel,
        [currentGalaxyLevelId]: newGalaxyStars,
      };
      setStarsPerGalaxyLevel(updatedGalaxyStars);
      setUnlockedGalaxyLevel((prev) => Math.max(prev, currentGalaxyLevelId + 1));
      if (pointsEarned > 0) {
        setCoins((prev) => prev + pointsEarned);
      }
    } else if (gameMode === 'long') {
      const prevLongStars = starsPerLongLevel[currentLongLevelId] || 0;
      pointsEarned = isAlreadyCompleted ? 0 : starsEarned * 8;
      if (selectedSkin === 'golden_throne' && pointsEarned > 0) {
        pointsEarned *= 2;
      }

      const newLongStars = Math.max(prevLongStars, starsEarned);
      const updatedLongStars = {
        ...starsPerLongLevel,
        [currentLongLevelId]: newLongStars,
      };
      setStarsPerLongLevel(updatedLongStars);
      setUnlockedLongLevel((prev) => Math.max(prev, currentLongLevelId + 1));
      if (pointsEarned > 0) {
        setCoins((prev) => prev + pointsEarned);
      }
    } else {
      const prevStars = starsPerLevel[currentLevelId] || 0;
      pointsEarned = isAlreadyCompleted ? 0 : starsEarned * 4;
      if (selectedSkin === 'golden_throne' && pointsEarned > 0) {
        pointsEarned *= 2;
      }

      const newStars = Math.max(prevStars, starsEarned);
      const updatedStars = {
        ...starsPerLevel,
        [currentLevelId]: newStars,
      };
      setStarsPerLevel(updatedStars);

      if (pointsEarned > 0) {
        setCoins((prev) => prev + pointsEarned);
      }

      const nextUnlocked = computeUnlockedLevel(updatedStars);
      setUnlockedLevel(nextUnlocked);
    }

    if (selectedSkin === 'golden_throne' && pointsEarned > 0) {
      triggerToast(
        isAr
          ? '👑 مضاعف العرش الذهبي: حصلت على ضعف الفلوس (×2)! 🪙✨'
          : '👑 Golden Throne Multiplier: 2x Double Coins Earned! 🪙✨'
      );
    }

    setLastCoinsEarned(pointsEarned);

    // Space Coins Reward: 10% chance to earn 2 to 5 space coins on level completion (only for first-time completions)
    let spaceEarned = 0;
    if (!isAlreadyCompleted && Math.random() < 0.10) {
      spaceEarned = Math.floor(Math.random() * 4) + 2; // 2 to 5 coins
      setSpaceCoins((prev) => prev + spaceEarned);
      triggerToast(
        isAr
          ? `🌌 حظ فلكي! ربحت +${spaceEarned} عملات فضاء! 🚀`
          : `🌌 Space reward! +${spaceEarned} Space Coins won! 🚀`
      );
    }
    setSpaceCoinsEarned(spaceEarned);

    setShowVictoryModal(true);
  };

  const handleNextLevel = () => {
    setShowVictoryModal(false);
    if (gameMode === 'galaxy') {
      const nextId = Math.min(25, currentGalaxyLevelId + 1);
      setCurrentGalaxyLevelId(nextId);
    } else if (gameMode === 'long') {
      const nextId = Math.min(20, currentLongLevelId + 1);
      setCurrentLongLevelId(nextId);
    } else {
      const nextId = currentLevelId + 1;
      setCurrentLevelId(nextId);
    }
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
      className={`min-h-screen w-full transition-colors duration-500 font-sans flex items-center justify-center p-0 sm:p-3 md:p-5 overflow-x-hidden antialiased select-none ${
        selectedSkin === 'golden_throne'
          ? 'bg-amber-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600 via-yellow-950 to-amber-950 text-amber-100'
          : 'bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-950 via-slate-900 to-indigo-950 text-slate-800'
      }`}
    >
      {/* Background Decorative Ambient Spheres for Desktop View */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {selectedSkin === 'golden_throne' ? (
          <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-amber-400/20 via-yellow-500/10 to-transparent blur-3xl animate-pulse" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-20 right-10 w-96 h-96 bg-yellow-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </>
        ) : (
          <>
            <div className="absolute top-10 left-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </>
        )}
      </div>

      {/* Mobile Phone Application Frame (واجهة تطبيق) */}
      <div className={`w-full max-w-[460px] sm:max-w-[480px] h-screen sm:h-[94vh] sm:max-h-[900px] sm:rounded-[46px] border-0 sm:border-[8px] sm:border-slate-800/90 shadow-[0_25px_70px_rgba(0,0,0,0.6)] flex flex-col relative overflow-hidden backdrop-blur-md transition-colors duration-500 ${
        selectedSkin === 'golden_throne'
          ? 'bg-gradient-to-b from-amber-950 via-yellow-950/95 to-amber-950 text-amber-100 sm:border-amber-500/80 shadow-[0_0_50px_rgba(245,158,11,0.4)]'
          : gameMode === 'galaxy' || selectedSkin === 'nebula' || selectedSkin === 'supernova'
          ? 'bg-gradient-to-b from-slate-950 via-purple-950/95 to-indigo-950 text-white'
          : selectedSkin === 'rainstorm'
          ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-sky-950 text-white'
          : 'bg-gradient-to-b from-sky-50/90 via-white to-slate-100/95 text-slate-800'
      }`}>
        
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
        <div className={`w-full px-4 py-1.5 flex items-center justify-between text-white shadow-md z-30 shrink-0 select-none ${
          gameMode === 'galaxy'
            ? 'bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600'
            : gameMode === 'long'
            ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700'
            : 'bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-6.5 h-6.5 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xs shadow-inner font-bold">
              {gameMode === 'galaxy' ? '🌌' : gameMode === 'long' ? '📜' : '🎯'}
            </div>
            <span className="font-black text-xs sm:text-sm tracking-wide">
              {gameMode === 'galaxy'
                ? isAr ? `مراحل الأحداث - المجرة ${activeLevel.id}` : `Galaxy Level ${activeLevel.id}`
                : gameMode === 'long'
                ? isAr ? `المراحل الطويلة - مرحلة ${activeLevel.id}` : `Long Maze Level ${activeLevel.id}`
                : isAr ? 'هروب الأسهم - تطبيق الألغاز' : 'Arrow Escape App'}
            </span>
          </div>
          <span className="text-[10px] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full font-black border border-white/50 shadow-xs animate-pulse flex items-center gap-1">
            <span>🌌</span>
            <span>{isAr ? 'تحديث الجمعة الكوني' : 'Cosmic Friday Update'}</span>
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
            gameMode={gameMode}
            coins={coins}
            thunders={thunders}
            onOpenSettings={() => setShowSettingsModal(true)}
            onOpenLevelSelect={() => {
              setLevelSelectTab(gameMode);
              setShowLevelSelectModal(true);
            }}
            onOpenEventLevels={handleOpenEventLevels}
            isEventUnlocked={isEventUnlocked}
            onOpenShop={() => handleOpenShopWithTab('all')}
            onOpenLanding={() => setShowLandingModal(true)}
            onOpenTips={handleOpenTips}
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
            {/* Monster Boss Level Banner */}
            {(MONSTER_BOSS_LEVEL_IDS.includes(activeLevel.id) || activeLevel.difficulty === 'صعب جداً جداً') && (
              <div className="mb-1.5 bg-gradient-to-r from-purple-900 via-rose-900 to-red-900 text-white font-black text-xs px-3.5 py-1.5 rounded-2xl shadow-xl flex items-center justify-between gap-2 border-2 border-rose-500/80 animate-pulse w-full max-w-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">👹🔥</span>
                  <span className="text-[11px] leading-tight text-rose-100">
                    {isAr
                      ? 'مرحلة الوحش الشرسة! صعوبة قصوى للغاية - فرصة واحدة فقط للفوز 💀'
                      : 'Monster Boss Challenge! Extreme difficulty - Only 1 attempt 💀'}
                  </span>
                </div>
                <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-inner uppercase tracking-wider shrink-0">
                  {isAr ? 'صعب جداً جداً' : 'EXTREME'}
                </span>
              </div>
            )}

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

            {/* Golden Throne 2x Coins Multiplier Active Banner */}
            {selectedSkin === 'golden_throne' && (
              <div className="mb-1.5 bg-gradient-to-r from-amber-950 via-yellow-950 to-amber-900 border-2 border-amber-400/90 text-amber-100 font-black text-xs px-3.5 py-1.5 rounded-2xl shadow-xl flex items-center justify-between gap-2.5 w-full max-w-md animate-fade-in">
                <div className="flex items-center gap-1.5">
                  <span className="text-base animate-pulse">👑</span>
                  <div className="flex flex-col">
                    <span className="text-[11px] leading-none text-amber-200">
                      {isAr ? 'خلفية العرش الذهبي (مضاعف نقاط ×2):' : 'Golden Throne Theme (2x Coins Multiplier):'}
                    </span>
                    <span className="text-[9px] text-amber-300/90 font-semibold mt-0.5">
                      {isAr ? 'تحصل على ضعف الفلوس عند إكمال أي مرحلة! 👑🪙' : 'Earn 2x double coins on every level completion! 👑🪙'}
                    </span>
                  </div>
                </div>
                <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-amber-950 font-black text-xs px-2.5 py-1 rounded-xl shadow-md border border-amber-200 shrink-0">
                  ×2 🪙
                </span>
              </div>
            )}

            {/* Rainstorm Thunder Currency Active Banner */}
            {selectedSkin === 'rainstorm' && (
              <div className="mb-1.5 bg-gradient-to-r from-slate-950 via-sky-950 to-blue-950 border-2 border-sky-400/90 text-sky-100 font-black text-xs px-3.5 py-1.5 rounded-2xl shadow-xl flex items-center justify-between gap-2.5 w-full max-w-md animate-fade-in">
                <div className="flex items-center gap-1.5">
                  <span className="text-base animate-pulse">⛈️⚡</span>
                  <div className="flex flex-col">
                    <span className="text-[11px] leading-none text-sky-200">
                      {isAr ? 'خلفية عاصفة الرعد (عملة الصاعقة ⚡):' : 'Thunderstorm Theme (Thunder ⚡ Currency):'}
                    </span>
                    <span className="text-[9px] text-sky-300/90 font-semibold mt-0.5">
                      {isAr ? 'عند خروج كل سهم مفرد: احتمال 27% لإسقاط من 2 إلى 6 عملات رعد ⚡! ⛈️' : 'On each single arrow escape: 27% chance to drop 2 to 6 Thunder ⚡ currency! ⛈️'}
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow-md border border-sky-300 shrink-0 flex items-center gap-1">
                  <span>⚡</span>
                  <span>{thunders}</span>
                </div>
              </div>
            )}

            {/* Hammer Skin 200-Arrow Progress Counter Banner */}
            {selectedSkin === 'hammer' && (
              <div className="mb-1.5 bg-gradient-to-r from-stone-950 via-amber-950 to-stone-900 border-2 border-amber-500/80 text-amber-100 font-black text-xs px-3.5 py-1.5 rounded-2xl shadow-xl flex items-center justify-between gap-2.5 w-full max-w-md">
                <div className="flex items-center gap-1.5">
                  <span className="text-base animate-pulse">🔨</span>
                  <div className="flex flex-col">
                    <span className="text-[11px] leading-none text-amber-200">
                      {isAr ? 'عداد المطرقة السحرية (مضمونة 100%):' : 'Magic Hammer Counter (100% Guaranteed):'}
                    </span>
                    <span className="text-[9px] text-amber-300/80 font-semibold mt-0.5">
                      {isAr ? 'مطرقة مجانية عند خروج 200 سهم' : 'Free hammer at 200 escaped arrows'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 sm:w-24 bg-stone-950 h-2.5 rounded-full overflow-hidden border border-amber-500/40 p-0.5">
                    <div
                      className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (hammerSkinEscapedCount / 200) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-black text-amber-300 bg-amber-950/90 px-2 py-0.5 rounded-lg border border-amber-500/40 shrink-0">
                    {hammerSkinEscapedCount} / 200
                  </span>
                </div>
              </div>
            )}

            {/* Crystal Neon Skin 50-Arrow Progress Counter Banner (Unlocks when Crystal Neon background is used) */}
            {selectedSkin === 'crystal_neon' && (
              <div className="mb-1.5 bg-gradient-to-r from-slate-950 via-indigo-950 to-fuchsia-950 border-2 border-cyan-400/80 text-cyan-100 font-black text-xs px-3.5 py-1.5 rounded-2xl shadow-xl flex items-center justify-between gap-2.5 w-full max-w-md animate-fade-in">
                <div className="flex items-center gap-1.5">
                  <span className="text-base animate-pulse">💎</span>
                  <div className="flex flex-col">
                    <span className="text-[11px] leading-none text-cyan-200">
                      {isAr ? 'عداد النيون الكرستالي (+كعكة 🎂 + 30 نقطة):' : 'Crystal Neon Counter (+1 Cake 🎂 + 30 coins):'}
                    </span>
                    <span className="text-[9px] text-cyan-300/90 font-semibold mt-0.5">
                      {isAr ? 'كعكة مجانية 🎂 عند خروج 50 سهم!' : '1 Free cake 🎂 at 50 escaped arrows!'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 sm:w-24 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-cyan-400/40 p-0.5">
                    <div
                      className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-indigo-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (crystalNeonEscapedCount / 50) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-black text-cyan-300 bg-cyan-950/90 px-2 py-0.5 rounded-lg border border-cyan-400/40 shrink-0">
                    {crystalNeonEscapedCount} / 50
                  </span>
                </div>
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
              selectedArrowSkin={selectedArrowSkin}
              isCompleted={escapedCount === totalArrowsCount}
              isHammerActive={isHammerActive}
              onUseHammer={handleUseHammer}
              rainItems={rainItems}
              gameMode={gameMode}
            />

            {/* In-Game Action Bar Dock */}
            <div className="flex items-center justify-center gap-2 my-1 z-20 flex-wrap">
              {/* Daily Lucky Wheel Button */}
              <button
                id="btn-daily-wheel"
                onClick={() => {
                  soundManager.playClick();
                  setShowDailyWheelModal(true);
                }}
                className="px-3.5 py-2 rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 cursor-pointer transition-all animate-bounce"
                title={isAr ? 'عجلة الحظ اليومية - در عجلتك واكسب الجوائز!' : 'Daily Lucky Wheel - Spin to win!'}
              >
                <span className="text-lg">🎡</span>
                <span>{isAr ? 'عجلة الحظ' : 'Daily Wheel'}</span>
              </button>

              {/* Open Shop Button */}
              <button
                id="btn-open-shop"
                onClick={() => {
                  soundManager.playClick();
                  handleOpenShopWithTab('all');
                }}
                className="px-3.5 py-2 rounded-2xl border-2 border-purple-400 bg-gradient-to-r from-purple-600 via-indigo-600 to-slate-900 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 cursor-pointer transition-all"
                title={isAr ? 'فتح متجر الألعاب والجلكسي' : 'Open Game & Galaxy Shop'}
              >
                <span className="text-lg">🛒</span>
                <span>{isAr ? 'المتجر' : 'Shop'}</span>
              </button>

              {/* My Inventory / Bag Button */}
              <button
                id="btn-inventory"
                onClick={() => {
                  soundManager.playClick();
                  setShowInventoryModal(true);
                }}
                className="px-3.5 py-2 rounded-2xl border-2 border-amber-400 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 cursor-pointer transition-all"
                title={isAr ? 'عرض ممتلكاتك وأدواتك واستخدامها' : 'View and use your inventory & tools'}
              >
                <span className="text-lg">🎒</span>
                <span>{isAr ? 'الحقيبة' : 'Bag'}</span>
                <span className="bg-amber-950 text-amber-200 font-extrabold text-[11px] px-1.5 py-0.2 rounded-full shadow-inner">
                  {creams + chocolates + thunders + hammers + tomatoes + spaceCreams + cakes}
                </span>
              </button>

              {/* Friday Weekly Update Button */}
              <button
                id="btn-friday-updates"
                onClick={() => {
                  soundManager.playClick();
                  setShowFridayUpdatesModal(true);
                }}
                className="px-3.5 py-2 rounded-2xl border-2 border-indigo-400 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 cursor-pointer transition-all"
                title={isAr ? 'تحديثات يوم الجمعة الجديدة - اطلع على كل جديد!' : 'Friday Weekly Updates - Check out what is new!'}
              >
                <span className="text-lg">📅</span>
                <span>{isAr ? 'تحديث الجمعة' : 'Friday Update'}</span>
                <span className="bg-emerald-500 text-white font-black text-[10px] px-1.5 py-0.2 rounded-full shadow-xs animate-pulse">
                  {isAr ? 'جديد' : 'NEW'}
                </span>
              </button>

              {/* Active Hammer Indicator Badge (if hammer active) */}
              {isHammerActive && (
                <button
                  onClick={handleToggleHammer}
                  className="px-3 py-2 rounded-2xl border-2 border-amber-400 bg-amber-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md animate-pulse cursor-pointer hover:bg-amber-600 transition-all"
                  title={isAr ? 'المطرقة مفعلة! انقر على أي سهم لكسره (انقر هنا للإلغاء)' : 'Hammer active! Click any arrow to smash (click to cancel)'}
                >
                  <span className="text-base">🔨</span>
                  <span>{isAr ? 'المطرقة مفعلة (انقر لإلغاء)' : 'Hammer Active (Cancel)'}</span>
                </button>
              )}

              {/* Reset Level Button */}
              <button
                id="btn-restart-game"
                onClick={() => {
                  soundManager.playClick();
                  handleRestartLevel();
                }}
                className="px-3 py-2 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs hover:scale-105 active:scale-95 cursor-pointer transition-all"
              >
                <RefreshCw className="w-4 h-4 text-slate-500" />
                <span>{isAr ? 'إعادة' : 'Reset'}</span>
              </button>
            </div>
          </main>

          {/* Bottom Footer */}
          <footer className="w-full max-w-2xl mx-auto px-2 pb-1 text-center text-slate-400 text-[10px] sm:text-xs font-medium leading-tight select-none shrink-0">
            <p dir="rtl">
              تطبيق الألغاز - ألوان زاهية وناعمة، ومؤثرات مطرية ساحرة (🍦 ⚡ 🔨 🍅 🌌)
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
          levelNumber={
            gameMode === 'galaxy'
              ? currentGalaxyLevelId
              : gameMode === 'long'
              ? currentLongLevelId
              : currentLevelId
          }
          stars={
            gameMode === 'galaxy'
              ? starsPerGalaxyLevel[currentGalaxyLevelId] || 3
              : gameMode === 'long'
              ? starsPerLongLevel[currentLongLevelId] || 3
              : starsPerLevel[currentLevelId] || 3
          }
          coinsEarned={lastCoinsEarned}
          spaceCoinsEarned={spaceCoinsEarned}
          dropsCount={drops}
          gameMode={gameMode}
          language={language}
          onNextLevel={handleNextLevel}
          onReplay={handleRestartLevel}
          onLevelSelect={() => {
            setShowVictoryModal(false);
            setLevelSelectTab(gameMode);
            setShowLevelSelectModal(true);
          }}
        />
      )}

      {showLevelSelectModal && (
        <LevelSelectModal
          unlockedLevel={unlockedLevel}
          currentLevel={currentLevelId}
          starsPerLevel={starsPerLevel}
          unlockedGalaxyLevel={unlockedGalaxyLevel}
          currentGalaxyLevel={currentGalaxyLevelId}
          starsPerGalaxyLevel={starsPerGalaxyLevel}
          unlockedLongLevel={unlockedLongLevel}
          currentLongLevel={currentLongLevelId}
          starsPerLongLevel={starsPerLongLevel}
          isEventUnlocked={isEventUnlocked}
          gameMode={gameMode}
          initialTab={levelSelectTab}
          coins={coins}
          language={language}
          onSelectMainLevel={handleSelectMainLevel}
          onSelectGalaxyLevel={handleSelectGalaxyLevel}
          onSelectLongLevel={handleSelectLongLevel}
          onUnlockEvent={handleUnlockEventInModal}
          onClose={() => setShowLevelSelectModal(false)}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          soundEnabled={soundEnabled}
          musicEnabled={musicEnabled}
          language={language}
          onToggleSound={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            soundManager.setEnabled(next);
          }}
          onToggleMusic={() => {
            const next = !musicEnabled;
            setMusicEnabled(next);
            soundManager.setMusicEnabled(next);
          }}
          onChangeLanguage={(lang) => setLanguage(lang)}
          onResetProgress={() => {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            setCurrentLevelId(1);
            setUnlockedLevel(1);
            setStarsPerLevel({});
            setCoins(0);
            setSpaceCoins(0);
            setTomatoes(0);
            setSpaceCreams(0);
            setShowSettingsModal(false);
          }}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {showShopModal && (
        <ShopModal
          coins={coins}
          spaceCoins={spaceCoins}
          tomatoes={tomatoes}
          spaceCreams={spaceCreams}
          hammers={hammers}
          thunders={thunders}
          creams={creams}
          chocolates={chocolates}
          cakes={cakes}
          cakeArrowCounter={cakeArrowCounter}
          selectedSkin={selectedSkin}
          unlockedSkins={unlockedSkins}
          selectedArrowSkin={selectedArrowSkin}
          unlockedArrowSkins={unlockedArrowSkins}
          language={language}
          onSelectSkin={(skin) => setSelectedSkin(skin)}
          onUnlockSkin={(skin, cost) => {
            setCoins((prev) => prev - cost);
            setUnlockedSkins((prev) => [...prev, skin]);
            setSelectedSkin(skin);
          }}
          onSelectArrowSkin={(askin) => setSelectedArrowSkin(askin)}
          onUnlockArrowSkin={(askin, cost) => {
            setCoins((prev) => prev - cost);
            setUnlockedArrowSkins((prev) => [...prev, askin]);
            setSelectedArrowSkin(askin);
          }}
          onBuyHammer={handleBuyHammer}
          onBuyThunder={handleBuyThunder}
          onBuyCream={handleBuyCream}
          onBuyChocolate={handleBuyChocolate}
          onBuyTomato={handleBuyTomato}
          onBuySpaceCream={handleBuySpaceCream}
          onBuyBundle={handleBuyBundle}
          onBuyCakeBundle={handleBuyCakeBundle}
          onExchangeCoins={handleExchangeCoinsForSpaceCoins}
          onExchangeCake={handleExchangeCake}
          initialTab={shopModalTab}
          onClose={() => setShowShopModal(false)}
        />
      )}

      {showTipsModal && (
        <TipsModal
          language={language}
          onOpenShopBackgrounds={() => handleOpenShopWithTab('skins')}
          onClose={() => setShowTipsModal(false)}
        />
      )}

      {showInventoryModal && (
        <InventoryModal
          coins={coins}
          spaceCoins={spaceCoins}
          tomatoes={tomatoes}
          spaceCreams={spaceCreams}
          hammers={hammers}
          thunders={thunders}
          creams={creams}
          chocolates={chocolates}
          cakes={cakes}
          selectedSkin={selectedSkin}
          unlockedSkins={unlockedSkins}
          selectedArrowSkin={selectedArrowSkin}
          unlockedArrowSkins={unlockedArrowSkins}
          language={language}
          onUseCream={handleUseCream}
          onUseChocolate={handleUseChocolate}
          onUseThunder={handleUseLightning}
          onUseTomato={handleUseTomato}
          onUseSpaceCream={handleUseSpaceCream}
          onToggleHammer={handleToggleHammer}
          onExchangeCake={handleExchangeCake}
          onSelectSkin={(skin) => setSelectedSkin(skin)}
          onSelectArrowSkin={(askin) => setSelectedArrowSkin(askin)}
          onOpenShop={() => {
            setShowInventoryModal(false);
            setShowShopModal(true);
          }}
          onClose={() => setShowInventoryModal(false)}
        />
      )}

      {showDailyWheelModal && (
        <DailyWheelModal
          isOpen={showDailyWheelModal}
          onClose={() => setShowDailyWheelModal(false)}
          language={language}
          onReward={({ type, amount }) => {
            if (type === 'coins') setCoins((prev) => prev + amount);
            if (type === 'spaceCoins') setSpaceCoins((prev) => prev + amount);
            if (type === 'hammer') setHammers((prev) => prev + amount);
            if (type === 'thunder') setThunders((prev) => prev + amount);
            if (type === 'cream') setCreams((prev) => prev + amount);
            if (type === 'chocolate') setChocolates((prev) => prev + amount);
          }}
        />
      )}

      {showFridayUpdatesModal && (
        <FridayUpdatesModal
          language={language}
          onClose={() => setShowFridayUpdatesModal(false)}
        />
      )}

      {showLandingModal && (
        <LandingModal
          isOpen={showLandingModal}
          onClose={handleCloseLanding}
          onStartPlay={handleCloseLanding}
          onOpenShop={() => {
            handleCloseLanding();
            setShowShopModal(true);
          }}
          onOpenLevelSelect={() => {
            handleCloseLanding();
            setLevelSelectTab(gameMode);
            setShowLevelSelectModal(true);
          }}
          language={language}
          coins={coins}
        />
      )}
    </div>
  );
}
