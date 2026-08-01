import React, { useState, useEffect } from 'react';
import { Arrow, Level, ThemeSkin } from './types';
import { getLevel, getGalaxyLevel, MONSTER_BOSS_LEVEL_IDS } from './utils/levelGenerator';
import { soundManager } from './utils/sound';
import { TopBar } from './components/TopBar';
import { ArrowMazeBoard } from './components/ArrowMazeBoard';
import { VictoryModal } from './components/VictoryModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { SettingsModal } from './components/SettingsModal';
import { ShopModal } from './components/ShopModal';
import { InventoryModal } from './components/InventoryModal';
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

  const [gameMode, setGameMode] = useState<'main' | 'galaxy'>('main');

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

  const [levelSelectTab, setLevelSelectTab] = useState<'main' | 'galaxy'>('main');

  const [isHammerActive, setIsHammerActive] = useState<boolean>(false);
  const [lastCoinsEarned, setLastCoinsEarned] = useState<number>(10);
  const [spaceCoinsEarned, setSpaceCoinsEarned] = useState<number>(0);

  // Modals state
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const [showLevelSelectModal, setShowLevelSelectModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showShopModal, setShowShopModal] = useState<boolean>(false);
  const [showInventoryModal, setShowInventoryModal] = useState<boolean>(false);

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
    gameMode === 'galaxy' ? getGalaxyLevel(currentGalaxyLevelId) : getLevel(currentLevelId)
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
        hammers,
        thunders,
        creams,
        chocolates,
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
    hammers,
    thunders,
    creams,
    chocolates,
  ]);

  // Load level data whenever level or mode changes
  useEffect(() => {
    const lvl = gameMode === 'galaxy' ? getGalaxyLevel(currentGalaxyLevelId) : getLevel(currentLevelId);
    setActiveLevel(lvl);
    setArrows(lvl.arrows.map((a) => ({ ...a, isEscaped: false })));
    setDrops(lvl.maxDrops || 3);
    setEscapedCount(0);
    setShowVictoryModal(false);
    setIsHammerActive(false);
    setSpaceCoinsEarned(0);
  }, [currentLevelId, currentGalaxyLevelId, gameMode]);

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
      triggerToast(isAr ? 'تم شراء بكج الكيك بنجاح! 🎂 (🍫+🍦)' : 'Cake Bundle purchased! 🎂 (🍫+🍦)');
    }
  };

  const handleExchangeCoinsForSpaceCoins = (coinCost = 15, spaceCoinsEarned = 1) => {
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
    const escapedArrow = arrows.find((a) => a.id === arrowId);
    if (escapedArrow) {
      const isAlreadyCompleted = gameMode === 'galaxy'
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

  // Victory Handler
  const handleLevelCompleted = () => {
    const isAr = language === 'ar';
    const starsEarned = drops === 3 ? 3 : drops === 2 ? 2 : 1;
    let pointsEarned = 0;

    const isAlreadyCompleted = gameMode === 'galaxy'
      ? (starsPerGalaxyLevel[currentGalaxyLevelId] || 0) > 0
      : (starsPerLevel[currentLevelId] || 0) > 0;

    if (gameMode === 'galaxy') {
      const prevGalaxyStars = starsPerGalaxyLevel[currentGalaxyLevelId] || 0;
      pointsEarned = isAlreadyCompleted ? 0 : starsEarned * 4;

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
    } else {
      const prevStars = starsPerLevel[currentLevelId] || 0;
      pointsEarned = isAlreadyCompleted ? 0 : starsEarned * 4;

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
      className="min-h-screen w-full bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-950 via-slate-900 to-indigo-950 text-slate-800 font-sans flex items-center justify-center p-0 sm:p-3 md:p-5 overflow-x-hidden antialiased select-none"
    >
      {/* Background Decorative Ambient Spheres for Desktop View */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Mobile Phone Application Frame (واجهة تطبيق) */}
      <div className={`w-full max-w-[460px] sm:max-w-[480px] h-screen sm:h-[94vh] sm:max-h-[900px] sm:rounded-[46px] border-0 sm:border-[8px] sm:border-slate-800/90 shadow-[0_25px_70px_rgba(0,0,0,0.6)] flex flex-col relative overflow-hidden backdrop-blur-md transition-colors duration-500 ${
        gameMode === 'galaxy' || selectedSkin === 'nebula' || selectedSkin === 'supernova'
          ? 'bg-gradient-to-b from-slate-950 via-purple-950/95 to-indigo-950 text-white'
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
            : 'bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-6.5 h-6.5 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xs shadow-inner font-bold">
              {gameMode === 'galaxy' ? '🌌' : '🎯'}
            </div>
            <span className="font-black text-xs sm:text-sm tracking-wide">
              {gameMode === 'galaxy'
                ? isAr ? `مراحل الأحداث - المجرة ${activeLevel.id}` : `Galaxy Level ${activeLevel.id}`
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
            coins={coins}
            onOpenSettings={() => setShowSettingsModal(true)}
            onOpenLevelSelect={() => {
              setLevelSelectTab(gameMode);
              setShowLevelSelectModal(true);
            }}
            onOpenEventLevels={handleOpenEventLevels}
            isEventUnlocked={isEventUnlocked}
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
              gameMode={gameMode}
            />

            {/* In-Game Action Bar Dock */}
            <div className="flex items-center justify-center gap-2 my-1 z-20 flex-wrap">
              {/* Open Shop Button */}
              <button
                id="btn-open-shop"
                onClick={() => {
                  soundManager.playClick();
                  setShowShopModal(true);
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
                  {creams + chocolates + thunders + hammers + tomatoes + spaceCreams}
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
          levelNumber={gameMode === 'galaxy' ? currentGalaxyLevelId : currentLevelId}
          stars={
            gameMode === 'galaxy'
              ? starsPerGalaxyLevel[currentGalaxyLevelId] || 3
              : starsPerLevel[currentLevelId] || 3
          }
          coinsEarned={lastCoinsEarned}
          spaceCoinsEarned={spaceCoinsEarned}
          dropsCount={drops}
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
          isEventUnlocked={isEventUnlocked}
          gameMode={gameMode}
          initialTab={levelSelectTab}
          coins={coins}
          language={language}
          onSelectMainLevel={handleSelectMainLevel}
          onSelectGalaxyLevel={handleSelectGalaxyLevel}
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
          onBuyChocolate={handleBuyChocolate}
          onBuyTomato={handleBuyTomato}
          onBuySpaceCream={handleBuySpaceCream}
          onBuyBundle={handleBuyBundle}
          onBuyCakeBundle={handleBuyCakeBundle}
          onExchangeCoins={handleExchangeCoinsForSpaceCoins}
          onClose={() => setShowShopModal(false)}
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
          selectedSkin={selectedSkin}
          unlockedSkins={unlockedSkins}
          language={language}
          onUseCream={handleUseCream}
          onUseChocolate={handleUseChocolate}
          onUseThunder={handleUseLightning}
          onUseTomato={handleUseTomato}
          onUseSpaceCream={handleUseSpaceCream}
          onToggleHammer={handleToggleHammer}
          onSelectSkin={(skin) => setSelectedSkin(skin)}
          onOpenShop={() => {
            setShowInventoryModal(false);
            setShowShopModal(true);
          }}
          onClose={() => setShowInventoryModal(false)}
        />
      )}
    </div>
  );
}
