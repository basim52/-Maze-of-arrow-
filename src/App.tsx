import React, { useState, useEffect } from 'react';
import { Arrow, Level, ThemeSkin, ArrowSkin, Friend, TradeItem } from './types';
import { getLevel, getGalaxyLevel, getLongLevel, getThunderLevel, getTimedLevel, getMonsterLevel, MONSTER_BOSS_LEVEL_IDS, canArrowEscape } from './utils/levelGenerator';
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
import { TasksModal } from './components/TasksModal';
import { FriendsModal } from './components/FriendsModal';
import { TradeModal } from './components/TradeModal';
import { getActiveDailyTasks } from './utils/dailyTasks';
import { ThunderstormBackground } from './components/ThunderstormBackground';
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
    return 0; // 0 starter thunder currency
  });

  const [lightnings, setLightnings] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.lightnings === 'number') {
          return parsed.lightnings;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 0; // 0 starter lightning strikes
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

  const [creamHammers, setCreamHammers] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.creamHammers === 'number') {
          return parsed.creamHammers;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 1; // 1 free starter cream hammer
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

  const [smartCakeMultiplierLevelsRemaining, setSmartCakeMultiplierLevelsRemaining] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.smartCakeMultiplierLevelsRemaining === 'number') {
          return parsed.smartCakeMultiplierLevelsRemaining;
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

  const [emeraldPalaceEscapedCount, setEmeraldPalaceEscapedCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.emeraldPalaceEscapedCount === 'number') {
          return parsed.emeraldPalaceEscapedCount;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 0;
  });

  const [cakeKingdomEscapedCount, setCakeKingdomEscapedCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.cakeKingdomEscapedCount === 'number') {
          return parsed.cakeKingdomEscapedCount;
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

  const [liquidChocolates, setLiquidChocolates] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.liquidChocolates === 'number') {
          return parsed.liquidChocolates;
        }
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

  const [chickens, setChickens] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.chickens === 'number') {
          return parsed.chickens;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 0;
  });

  const [oracleEyes, setOracleEyes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.oracleEyes === 'number') {
          return parsed.oracleEyes;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 0; // Start with 0 free Oracle Eyes (must be purchased from Shop)
  });

  const [highlightedArrowIds, setHighlightedArrowIds] = useState<Set<string>>(new Set());

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

  const [gameMode, setGameMode] = useState<'main' | 'galaxy' | 'long' | 'thunder' | 'timed' | 'monster'>('main');

  // Monster Battle Mode states (5 Stage Boss levels, unlocked for 154 coins)
  const [hasUnlockedMonsterMode, setHasUnlockedMonsterMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.hasUnlockedMonsterMode === 'boolean') {
          return parsed.hasUnlockedMonsterMode;
        }
      }
    } catch (e) {}
    return false;
  });

  const [currentMonsterLevelId, setCurrentMonsterLevelId] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.currentMonsterLevelId === 'number' && parsed.currentMonsterLevelId >= 1) {
          return parsed.currentMonsterLevelId;
        }
      }
    } catch (e) {}
    return 1;
  });

  const [unlockedMonsterLevel, setUnlockedMonsterLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.unlockedMonsterLevel === 'number' && parsed.unlockedMonsterLevel >= 1) {
          return parsed.unlockedMonsterLevel;
        }
      }
    } catch (e) {}
    return 1;
  });

  const [starsPerMonsterLevel, setStarsPerMonsterLevel] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.starsPerMonsterLevel && typeof parsed.starsPerMonsterLevel === 'object') {
          return parsed.starsPerMonsterLevel;
        }
      }
    } catch (e) {}
    return {};
  });

  // 2-Second Monster Obstacle states
  const [monsterObstacleActive, setMonsterObstacleActive] = useState<boolean>(false);
  const [monsterObstacleTimer, setMonsterObstacleTimer] = useState<number>(2);
  const [monsterCooldownTimer, setMonsterCooldownTimer] = useState<number>(5);

  // Temporary Timed Levels states (10 Timed levels with countdown timer)
  const [hasUnlockedTimedLevels, setHasUnlockedTimedLevels] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.hasUnlockedTimedLevels === 'boolean') {
          return parsed.hasUnlockedTimedLevels;
        }
      }
    } catch (e) {}
    return false;
  });

  const [currentTimedLevelId, setCurrentTimedLevelId] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.currentTimedLevelId === 'number' && parsed.currentTimedLevelId >= 1) {
          return parsed.currentTimedLevelId;
        }
      }
    } catch (e) {}
    return 1;
  });

  const [unlockedTimedLevel, setUnlockedTimedLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.unlockedTimedLevel === 'number' && parsed.unlockedTimedLevel >= 1) {
          return parsed.unlockedTimedLevel;
        }
      }
    } catch (e) {}
    return 1;
  });

  const [starsPerTimedLevel, setStarsPerTimedLevel] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.starsPerTimedLevel && typeof parsed.starsPerTimedLevel === 'object') {
          return parsed.starsPerTimedLevel;
        }
      }
    } catch (e) {}
    return {};
  });

  const [levelTimeLeft, setLevelTimeLeft] = useState<number | null>(null);

  // Thunder Event Level states (5 Event levels with rain and thunder background)
  const [currentThunderLevelId, setCurrentThunderLevelId] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.currentThunderLevelId === 'number' && parsed.currentThunderLevelId >= 1) {
          return parsed.currentThunderLevelId;
        }
      }
    } catch (e) {}
    return 1;
  });

  const [unlockedThunderLevel, setUnlockedThunderLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.unlockedThunderLevel === 'number' && parsed.unlockedThunderLevel >= 1) {
          return parsed.unlockedThunderLevel;
        }
      }
    } catch (e) {}
    return 1;
  });

  const [starsPerThunderLevel, setStarsPerThunderLevel] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.starsPerThunderLevel && typeof parsed.starsPerThunderLevel === 'object') {
          return parsed.starsPerThunderLevel;
        }
      }
    } catch (e) {}
    return {};
  });

  // Task Stats Tracking
  const [taskStats, setTaskStats] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.taskStats && typeof parsed.taskStats === 'object') {
          return {
            levelsCompleted: parsed.taskStats.levelsCompleted || 0,
            arrowsEscaped: parsed.taskStats.arrowsEscaped || 0,
            hammersUsed: parsed.taskStats.hammersUsed || 0,
            chocolatesUsed: parsed.taskStats.chocolatesUsed || 0,
            creamsUsed: parsed.taskStats.creamsUsed || 0,
            rainLevelsPlayed: parsed.taskStats.rainLevelsPlayed || 0,
            diamondEscaped: parsed.taskStats.diamondEscaped || 0,
            goldenThroneCompleted: parsed.taskStats.goldenThroneCompleted || 0,
            longCompleted: parsed.taskStats.longCompleted || 0,
            galaxyCompleted: parsed.taskStats.galaxyCompleted || 0,
            claimedTaskIds: Array.isArray(parsed.taskStats.claimedTaskIds) ? parsed.taskStats.claimedTaskIds : [],
          };
        }
      }
    } catch (e) {}
    return {
      levelsCompleted: 0,
      arrowsEscaped: 0,
      hammersUsed: 0,
      chocolatesUsed: 0,
      creamsUsed: 0,
      rainLevelsPlayed: 0,
      diamondEscaped: 0,
      goldenThroneCompleted: 0,
      longCompleted: 0,
      galaxyCompleted: 0,
      claimedTaskIds: [],
    };
  });

  const [lastTasksResetTimestamp, setLastTasksResetTimestamp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.lastTasksResetTimestamp === 'number' && parsed.lastTasksResetTimestamp > 0) {
          return parsed.lastTasksResetTimestamp;
        }
      }
    } catch (e) {}
    return Date.now();
  });

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

  const [levelSelectTab, setLevelSelectTab] = useState<'main' | 'galaxy' | 'long' | 'thunder' | 'timed' | 'monster'>('main');

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
  const [showTasksModal, setShowTasksModal] = useState<boolean>(false);
  const [shopModalTab, setShopModalTab] = useState<'all' | 'thunder' | 'cake' | 'galaxy' | 'tools' | 'skins' | 'arrowSkins'>('all');

  // Friends & Social System State
  const [playerName, setPlayerName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('player_custom_name');
      if (saved) return saved;
    } catch (e) {}
    return language === 'ar' ? 'البطل الملكي 👑' : 'Royal Hero 👑';
  });

  const handleUpdatePlayerName = (newName: string) => {
    const isAr = language === 'ar';
    setPlayerName(newName);
    try {
      localStorage.setItem('player_custom_name', newName);
    } catch (e) {}
    triggerToast(isAr ? `تم تحديث اسمك إلى: ${newName} ✨` : `Updated name to: ${newName} ✨`);
  };

  const [playerId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('player_id_code');
      if (saved) return saved;
      const code = `PLAYER-${Math.floor(1000 + Math.random() * 9000)}-${['SA', 'AE', 'KW', 'QA', 'EG', 'JO'][Math.floor(Math.random() * 6)]}`;
      localStorage.setItem('player_id_code', code);
      return code;
    } catch (e) {
      return 'PLAYER-7788-SA';
    }
  });

  const [friends, setFriends] = useState<Friend[]>(() => {
    try {
      const saved = localStorage.getItem('player_friends_list');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('player_friends_list', JSON.stringify(friends));
    } catch (e) {}
  }, [friends]);

  // Player Incoming Friend Requests
  const [friendRequests, setFriendRequests] = useState<Friend[]>(() => {
    try {
      const saved = localStorage.getItem('player_friend_requests');
      if (saved) {
        const parsed: Friend[] = JSON.parse(saved);
        // Filter out any leftover bot requests
        return parsed.filter((r) => !r.id.startsWith('BOT-'));
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('player_friend_requests', JSON.stringify(friendRequests));
    } catch (e) {}
  }, [friendRequests]);

  const handleAcceptFriendRequest = (request: Friend) => {
    const isAr = language === 'ar';
    setFriends((prev) => {
      if (prev.some((f) => f.id === request.id)) return prev;
      return [request, ...prev];
    });
    setFriendRequests((prev) => prev.filter((r) => r.id !== request.id));
    soundManager.playVictory();
    triggerToast(
      isAr
        ? `🎉 تم قبول طلب الصداقة! ${request.name} أصبح صديقك الآن ويمكنك التبادل معه.`
        : `🎉 Accepted friend request! ${request.name} is now your friend.`
    );
  };

  const handleDeclineFriendRequest = (requestId: string) => {
    const isAr = language === 'ar';
    setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));
    triggerToast(isAr ? 'تم رفض طلب الصداقة.' : 'Declined friend request.');
  };

  const [giftSentFriendIds, setGiftSentFriendIds] = useState<string[]>([]);
  const [showFriendsModal, setShowFriendsModal] = useState<boolean>(false);
  const [showTradeModal, setShowTradeModal] = useState<boolean>(false);
  const [selectedTradeFriend, setSelectedTradeFriend] = useState<Friend | null>(null);

  const handleAddFriend = (friendIdOrName: string) => {
    const isAr = language === 'ar';
    const exists = friends.some(
      (f) => f.name.toLowerCase() === friendIdOrName.toLowerCase() || f.id.toLowerCase() === friendIdOrName.toLowerCase()
    );
    if (exists) {
      triggerToast(isAr ? 'اللاعب موجود بالفعل في قائمة أصدقائك! 👥' : 'Player is already in your friends list! 👥');
      return;
    }

    const newFriend: Friend = {
      id: friendIdOrName.toUpperCase().startsWith('PLAYER-') ? friendIdOrName.toUpperCase() : `PLAYER-${Math.floor(1000 + Math.random() * 9000)}-KW`,
      name: friendIdOrName,
      avatar: ['🧙‍♂️', '👸', '🛡️', '⚡', '🎂', '🚀', '👑', '💎'][Math.floor(Math.random() * 8)],
      level: Math.floor(100 + Math.random() * 150),
      status: 'online',
    };

    setFriends((prev) => [newFriend, ...prev]);
    triggerToast(isAr ? `تمت إضافة ${friendIdOrName} إلى قائمة الأصدقاء بنجاح! 🎉` : `Added ${friendIdOrName} to friends! 🎉`);
  };

  const handleRemoveFriend = (friendId: string) => {
    const isAr = language === 'ar';
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
    triggerToast(isAr ? 'تم إزالة اللاعب من قائمة الأصدقاء.' : 'Removed friend from list.');
  };

  const handleSendGift = (friend: Friend) => {
    const isAr = language === 'ar';
    if (giftSentFriendIds.includes(friend.id)) return;
    setGiftSentFriendIds((prev) => [...prev, friend.id]);
    setCoins((c) => c + 10);
    soundManager.playVictory();
    triggerToast(
      isAr
        ? `🎁 أرسلت هدية يومية لـ ${friend.name}! وحصلت على +10 نقاط مكافأة الصداقة! 🪙`
        : `🎁 Sent daily gift to ${friend.name}! Received +10 bonus coins! 🪙`
    );
  };

  const handleOpenTradeWithFriend = (friend: Friend) => {
    setSelectedTradeFriend(friend);
    setShowFriendsModal(false);
    setShowTradeModal(true);
  };

  const handleExecuteTrade = (
    givenItems: TradeItem[],
    receivedItems: TradeItem[],
    offerTitle: string
  ): boolean => {
    const isAr = language === 'ar';
    // Deduct given items
    for (const item of givenItems) {
      if (item.type === 'coins') setCoins((c) => Math.max(0, c - item.amount));
      else if (item.type === 'thunders') setThunders((t) => Math.max(0, t - item.amount));
      else if (item.type === 'hammers') setHammers((h) => Math.max(0, h - item.amount));
      else if (item.type === 'cakes') setCakes((ck) => Math.max(0, ck - item.amount));
      else if (item.type === 'creams') setCreams((cr) => Math.max(0, cr - item.amount));
      else if (item.type === 'chocolates') setChocolates((ch) => Math.max(0, ch - item.amount));
      else if (item.type === 'spaceCreams') setSpaceCreams((sc) => Math.max(0, sc - item.amount));
    }

    // Add received items
    for (const item of receivedItems) {
      if (item.type === 'coins') setCoins((c) => c + item.amount);
      else if (item.type === 'thunders') setThunders((t) => t + item.amount);
      else if (item.type === 'hammers') setHammers((h) => h + item.amount);
      else if (item.type === 'cakes') setCakes((ck) => ck + item.amount);
      else if (item.type === 'creams') setCreams((cr) => cr + item.amount);
      else if (item.type === 'chocolates') setChocolates((ch) => ch + item.amount);
      else if (item.type === 'spaceCreams') setSpaceCreams((sc) => sc + item.amount);
    }

    soundManager.playVictory();
    triggerToast(
      isAr
        ? `🔄 تم إتمام التبادل بنجاح مع ${offerTitle}! تم استلام الموارد في مخزونك! 🎉`
        : `🔄 Trade completed with ${offerTitle}! Items updated in inventory! 🎉`
    );
    return true;
  };

  const handleOpenTips = () => {
    soundManager.playClick();
    setShowTipsModal(true);
  };

  const handleOpenShopWithTab = (tab: 'all' | 'thunder' | 'cake' | 'galaxy' | 'tools' | 'skins' | 'arrowSkins' = 'all') => {
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
      : gameMode === 'thunder'
      ? getThunderLevel(currentThunderLevelId)
      : gameMode === 'timed'
      ? getTimedLevel(currentTimedLevelId)
      : gameMode === 'monster'
      ? getMonsterLevel(currentMonsterLevelId)
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
    if (soundEnabled && musicEnabled) {
      if (MONSTER_BOSS_LEVEL_IDS.includes(activeLevel.id)) {
        soundManager.startBossBGM();
      } else {
        soundManager.startBGM();
      }
    }
  }, [activeLevel.id, soundEnabled, musicEnabled]);

  useEffect(() => {
    const handleFirstGesture = () => {
      if (soundEnabled && musicEnabled) {
        if (MONSTER_BOSS_LEVEL_IDS.includes(activeLevel.id)) {
          soundManager.startBossBGM();
        } else {
          soundManager.startBGM();
        }
      }
    };
    window.addEventListener('click', handleFirstGesture);
    window.addEventListener('touchstart', handleFirstGesture);
    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, [activeLevel.id, soundEnabled, musicEnabled]);

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
        hasUnlockedTimedLevels,
        currentTimedLevelId,
        unlockedTimedLevel,
        starsPerTimedLevel,
        hasUnlockedMonsterMode,
        currentMonsterLevelId,
        unlockedMonsterLevel,
        starsPerMonsterLevel,
        gameMode,
        isEventUnlocked,
        coins,
        spaceCoins,
        tomatoes,
        spaceCreams,
        liquidChocolates,
        soundEnabled,
        musicEnabled,
        language,
        selectedSkin,
        unlockedSkins,
        selectedArrowSkin,
        unlockedArrowSkins,
        hammers,
        thunders,
        lightnings,
        creams,
        creamHammers,
        chocolates,
        cakes,
        chickens,
        oracleEyes,
        cakeArrowCounter,
        smartCakeMultiplierLevelsRemaining,
        hammerSkinEscapedCount,
        crystalNeonEscapedCount,
        emeraldPalaceEscapedCount,
        cakeKingdomEscapedCount,
        taskStats,
        lastTasksResetTimestamp,
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
    liquidChocolates,
    soundEnabled,
    musicEnabled,
    language,
    selectedSkin,
    unlockedSkins,
    selectedArrowSkin,
    unlockedArrowSkins,
    hammers,
    thunders,
    lightnings,
    creams,
    creamHammers,
    chocolates,
    cakes,
    chickens,
    oracleEyes,
    cakeArrowCounter,
    smartCakeMultiplierLevelsRemaining,
    hammerSkinEscapedCount,
    crystalNeonEscapedCount,
    emeraldPalaceEscapedCount,
    cakeKingdomEscapedCount,
    taskStats,
    lastTasksResetTimestamp,
  ]);

  // Check 24-hour daily task reset
  useEffect(() => {
    const checkTasksReset = () => {
      const now = Date.now();
      if (now - lastTasksResetTimestamp >= 24 * 60 * 60 * 1000) {
        setLastTasksResetTimestamp(now);
        setTaskStats({
          levelsCompleted: 0,
          arrowsEscaped: 0,
          hammersUsed: 0,
          chocolatesUsed: 0,
          creamsUsed: 0,
          rainLevelsPlayed: 0,
          diamondEscaped: 0,
          goldenThroneCompleted: 0,
          longCompleted: 0,
          galaxyCompleted: 0,
          claimedTaskIds: [],
        });
        const isAr = language === 'ar';
        triggerToast(
          isAr
            ? '🎉 تم تجديد المهام اليومية! تتوفر الآن 3 مهام جديدة لليوم ⚡'
            : '🎉 Daily tasks reset! 3 new tasks available now ⚡'
        );
      }
    };

    checkTasksReset();
    const interval = setInterval(checkTasksReset, 10000);
    return () => clearInterval(interval);
  }, [lastTasksResetTimestamp, language]);

  // Auto-claim tasks immediately upon completion without requiring manual button click
  useEffect(() => {
    const activeTemplates = getActiveDailyTasks(lastTasksResetTimestamp);

    const unclaimedCompleted = activeTemplates.filter((t) => {
      const currentVal = Number(taskStats[t.statKey] || 0);
      return currentVal >= t.target && !(taskStats.claimedTaskIds || []).includes(t.id);
    });

    if (unclaimedCompleted.length > 0) {
      const isAr = language === 'ar';
      let addedCoins = 0;
      let addedHammers = 0;
      let addedChocolates = 0;
      let addedCreams = 0;
      let addedThunders = 0;
      const newlyClaimedIds: string[] = [];

      unclaimedCompleted.forEach((t) => {
        newlyClaimedIds.push(t.id);
        if (t.rewardType === 'coins') addedCoins += t.rewardAmount;
        else if (t.rewardType === 'hammer') addedHammers += t.rewardAmount;
        else if (t.rewardType === 'chocolate') addedChocolates += t.rewardAmount;
        else if (t.rewardType === 'cream') addedCreams += t.rewardAmount;
        else if (t.rewardType === 'thunder') addedThunders += t.rewardAmount;
      });

      setTaskStats((prev) => ({
        ...prev,
        claimedTaskIds: [...(prev.claimedTaskIds || []), ...newlyClaimedIds],
      }));

      if (addedCoins > 0) setCoins((c) => c + addedCoins);
      if (addedHammers > 0) setHammers((h) => h + addedHammers);
      if (addedChocolates > 0) setChocolates((c) => c + addedChocolates);
      if (addedCreams > 0) setCreams((c) => c + addedCreams);
      if (addedThunders > 0) setThunders((t) => t + addedThunders);

      soundManager.playVictory();

      const taskTitles = unclaimedCompleted.map((t) => (isAr ? t.titleAr : t.titleEn)).join('، ');
      triggerToast(
        isAr
          ? `🎉 تم إكمال مهمة [${taskTitles}] واستلام الجائزة تلقائياً!`
          : `🎉 Task [${taskTitles}] completed & reward claimed automatically!`
      );
    }
  }, [taskStats, lastTasksResetTimestamp, language]);

  // Load level data whenever level or mode changes
  useEffect(() => {
    const lvl =
      gameMode === 'galaxy'
        ? getGalaxyLevel(currentGalaxyLevelId)
        : gameMode === 'long'
        ? getLongLevel(currentLongLevelId)
        : gameMode === 'thunder'
        ? getThunderLevel(currentThunderLevelId)
        : gameMode === 'timed'
        ? getTimedLevel(currentTimedLevelId)
        : gameMode === 'monster'
        ? getMonsterLevel(currentMonsterLevelId)
        : getLevel(currentLevelId);
    setActiveLevel(lvl);
    setArrows(lvl.arrows.map((a) => ({ ...a, isEscaped: false })));
    setDrops(lvl.maxDrops || 3);
    setEscapedCount(0);
    setShowVictoryModal(false);
    setIsHammerActive(false);
    setSpaceCoinsEarned(0);
    setHighlightedArrowIds(new Set());

    if (gameMode === 'timed' || gameMode === 'monster') {
      setLevelTimeLeft(lvl.timeLimitSeconds || (gameMode === 'monster' ? 60 : 45));
    } else {
      setLevelTimeLeft(null);
    }

    if (selectedSkin === 'rainstorm' || selectedSkin === 'midnight_thunder' || gameMode === 'thunder') {
      setTaskStats((prev) => ({ ...prev, rainLevelsPlayed: prev.rainLevelsPlayed + 1 }));
    }
  }, [currentLevelId, currentGalaxyLevelId, currentLongLevelId, currentThunderLevelId, currentTimedLevelId, currentMonsterLevelId, gameMode]);

  // Timed & Monster Level countdown interval
  useEffect(() => {
    if ((gameMode !== 'timed' && gameMode !== 'monster') || levelTimeLeft === null || showVictoryModal) return;

    if (levelTimeLeft <= 0) {
      soundManager.playSmash();
      const isAr = language === 'ar';
      if (gameMode === 'monster') {
        triggerToast(
          isAr
            ? '👹💥 هجم الوحش وانتهى الوقت! تمت إعادة مرحلة الوحش!'
            : '👹💥 Monster attacked! Time is up! Level restarted!'
        );
      } else {
        triggerToast(
          isAr
            ? '⏱️❌ انتهى الوقت! لقد خسرت في هذه المرحلة المؤقتة وتمت إعادتها تلقائياً!'
            : '⏱️❌ Time is up! You lost this timed level and it restarted!'
        );
      }
      setArrows(activeLevel.arrows.map((a) => ({ ...a, isEscaped: false })));
      setDrops(activeLevel.maxDrops || 3);
      setEscapedCount(0);
      setLevelTimeLeft(activeLevel.timeLimitSeconds || (gameMode === 'monster' ? 60 : 45));
      return;
    }

    const timer = setInterval(() => {
      setLevelTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameMode, levelTimeLeft, showVictoryModal, language, activeLevel]);

  // Monster Battle Mode: 2-second dynamic obstacle loop (عائق لمدة ٢ ثانية)
  useEffect(() => {
    if (gameMode !== 'monster' || showVictoryModal) {
      setMonsterObstacleActive(false);
      return;
    }

    const interval = setInterval(() => {
      setMonsterObstacleActive((isActive) => {
        if (isActive) {
          setMonsterObstacleTimer((sec) => {
            if (sec <= 1) {
              setMonsterObstacleActive(false);
              setMonsterCooldownTimer(5);
              return 2;
            }
            return sec - 1;
          });
          return true;
        } else {
          setMonsterCooldownTimer((sec) => {
            if (sec <= 1) {
              setMonsterObstacleActive(true);
              setMonsterObstacleTimer(2);
              soundManager.playSmash();
              return 5;
            }
            return sec - 1;
          });
          return false;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameMode, showVictoryModal]);

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
    setTaskStats((prev) => ({ ...prev, hammersUsed: prev.hammersUsed + 1 }));
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

  const handleBuyThunder = (cost = 85) => {
    const isAr = language === 'ar';
    if (coins >= cost) {
      setCoins((prev) => prev - cost);
      setLightnings((prev) => prev + 1);
      triggerToast(isAr ? 'تم شراء ضربة رعد بنجاح بـ 85 نقطة! ⚡' : 'Bought Thunder Strike for 85 coins! ⚡');
    } else {
      triggerToast(isAr ? 'نقاطك غير كافية لشراء ضربة الرعد (85 نقطة) ⚡' : 'Not enough coins (85 required)! ⚡');
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

  const handleBuyCreamHammer = (cost: number) => {
    const isAr = language === 'ar';
    if (coins >= cost) {
      setCoins((prev) => prev - cost);
      setCreamHammers((prev) => prev + 1);
      triggerToast(isAr ? 'تم شراء مطرقة الكريمة بنجاح! 🍦🔨' : 'Cream Hammer purchased! 🍦🔨');
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
    } else if (coins >= cost) {
      setCoins((prev) => prev - cost);
      setTomatoes((prev) => prev + 1);
      triggerToast(isAr ? 'تم شراء طماطة الفضاء بنجاح! 🍅🚀' : 'Space Tomato purchased! 🍅🚀');
    }
  };

  const handleBuyLiquidChocolate = (cost: number) => {
    const isAr = language === 'ar';
    if (spaceCoins >= cost) {
      setSpaceCoins((prev) => prev - cost);
      setLiquidChocolates((prev) => prev + 1);
      triggerToast(isAr ? 'تم شراء الشوكولاته السائلة بنجاح! 🍫💧' : 'Liquid Chocolate purchased! 🍫💧');
    } else if (coins >= cost) {
      setCoins((prev) => prev - cost);
      setLiquidChocolates((prev) => prev + 1);
      triggerToast(isAr ? 'تم شراء الشوكولاته السائلة بنجاح! 🍫💧' : 'Liquid Chocolate purchased! 🍫💧');
    }
  };

  const handleBuySpaceCream = (cost: number) => {
    const isAr = language === 'ar';
    if (spaceCoins >= cost) {
      setSpaceCoins((prev) => prev - cost);
      setSpaceCreams((prev) => prev + 1);
      triggerToast(isAr ? 'تم شراء الكريمة الفضائية بنجاح! 🌌🍦' : 'Cosmic Space Cream purchased! 🌌🍦');
    } else if (coins >= cost) {
      setCoins((prev) => prev - cost);
      setSpaceCreams((prev) => prev + 1);
      triggerToast(isAr ? 'تم شراء الكريمة الفضائية بنجاح! 🌌🍦' : 'Cosmic Space Cream purchased! 🌌🍦');
    }
  };

  const handleBuySpaceBundle = (cost: number) => {
    const isAr = language === 'ar';
    if (coins >= cost) {
      setCoins((prev) => prev - cost);
      setTomatoes((prev) => prev + 2);
      setSpaceCreams((prev) => prev + 1);
      triggerToast(isAr ? 'تم شراء بكج الفضاء (٢ طماطة فضائية + كريمة فضائية) بنجاح! 🚀🍅🍦' : 'Space Bundle (2x Tomatoes + 1x Space Cream) purchased! 🚀🍅🍦');
    }
  };

  const handleBuyBundle = (cost: number) => {
    const isAr = language === 'ar';
    if (coins >= cost) {
      setCoins((prev) => prev - cost);
      setCreams((prev) => prev + 1);
      setHammers((prev) => prev + 1);
      triggerToast(isAr ? 'تم شراء بكج الكريمة والمطرقة بنجاح! 🍦🔨' : 'Cream & Hammer Bundle purchased! 🍦🔨');
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
      const coinsEarned = cakeAmount * 32;
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

  const handleBuyWithCake = (itemType: string, cakeCost: number) => {
    const isAr = language === 'ar';
    if (cakes < cakeCost) {
      triggerToast(isAr ? 'عذراً! لا تملك كعك كافي للشراء 🎂' : 'Not enough cakes! 🎂');
      return;
    }

    setCakes((prev) => prev - cakeCost);
    soundManager.playVictory();

    if (itemType === 'coins') {
      const coinsEarned = cakeCost * 32;
      setCoins((prev) => prev + coinsEarned);
      triggerToast(
        isAr
          ? `🎂 تم شراء ${coinsEarned} نقطة بالكعك بنجاح! 🪙`
          : `🎂 Bought ${coinsEarned} coins with cakes!`
      );
    } else if (itemType === 'hammer') {
      setHammers((prev) => prev + 1);
      triggerToast(isAr ? '🔨 تم شراء مطرقة سحرية بالكعك!' : '🔨 Magic Hammer bought with cakes!');
    } else if (itemType === 'chocolate') {
      setChocolates((prev) => prev + 1);
      triggerToast(isAr ? '🍫 تم شراء شوكولاتة سحرية بالكعك!' : '🍫 Magic Chocolate bought with cakes!');
    } else if (itemType === 'creamHammer') {
      setCreamHammers((prev) => prev + 1);
      triggerToast(isAr ? '🍦🔨 تم شراء مطرقة كريمة بالكعك!' : '🍦🔨 Cream Hammer bought with cakes!');
    } else if (itemType === 'cream') {
      setCreams((prev) => prev + 1);
      triggerToast(isAr ? '🍦 تم شراء كريمة سحرية بالكعك!' : '🍦 Magic Cream bought with cakes!');
    } else if (itemType === 'liquidChocolate') {
      setLiquidChocolates((prev) => prev + 1);
      triggerToast(isAr ? '🍫💧 تم شراء الشوكولاته السائلة بالكعك!' : '🍫💧 Liquid Chocolate bought with cakes!');
    } else if (itemType === 'thunderCoins100') {
      setThunders((prev) => prev + 100);
      triggerToast(
        isAr
          ? '⚡ تم شراء +100 عملة رعد بنجاح باستخدام 2 كعكة! 🎉'
          : '⚡ Bought +100 Thunder Coins using 2 cakes! 🎉'
      );
    } else if (itemType === 'smartMultiplier') {
      setSmartCakeMultiplierLevelsRemaining((prev) => prev + 4);
      triggerToast(
        isAr
          ? '🎂⚡ تم تفعيل مضاعف الكعك الذكي لمدة 4 مراحل! مضاعفة كافة النقاط والمكافآت! 🪙'
          : '🎂⚡ Smart Cake Multiplier activated for 4 levels! All rewards doubled! 🪙'
      );
    } else if (itemType === 'cakeStarArrowSkin') {
      if (!unlockedArrowSkins.includes('cake_star')) {
        setUnlockedArrowSkins((prev) => [...prev, 'cake_star']);
      }
      setSelectedArrowSkin('cake_star');
      triggerToast(
        isAr
          ? '🎂⭐ تم فتح وتفعيل أسهم نجوم الكعك! (مضاعفة نجوم البقاء في مراحل الأحداث فقط) 🌟'
          : '🎂⭐ Cake Star Arrows unlocked & equipped! (2x Survival Stars in Event Stages) 🌟'
      );
    } else if (itemType === 'spaceCoins') {
      const gained = 2 * cakeCost;
      setSpaceCoins((prev) => prev + gained);
      triggerToast(
        isAr
          ? `🚀 تم شراء ${gained} عملات فضاء بالكعك!`
          : `🚀 Bought ${gained} Space Coins with cakes!`
      );
    } else if (itemType === 'cakeSkin') {
      if (!unlockedSkins.includes('cake')) {
        setUnlockedSkins((prev) => [...prev, 'cake']);
      }
      setSelectedSkin('cake');
      triggerToast(
        isAr
          ? '🧁✨ تم فتح وتفعيل خلفية مخبز الكاب كيك! (تمنح كاب كيك مجاني عند إزالة كل 35 سهماً)'
          : '🧁✨ Cupcake Bakery background unlocked & equipped! (Grants 1 free cupcake for every 35 arrows cleared)'
      );
    } else if (itemType === 'cakeKingdomSkin') {
      if (!unlockedSkins.includes('cake_kingdom')) {
        setUnlockedSkins((prev) => [...prev, 'cake_kingdom']);
      }
      setSelectedSkin('cake_kingdom');
      triggerToast(
        isAr
          ? '🏰🎂 تم فتح وتفعيل خلفية مملكة الكعك الملكية! (احتمال 25% كعكة + 25% كاب كيك عند إكمال أي مرحلة)'
          : '🏰🎂 Royal Cake Kingdom background unlocked & equipped! (25% cake & 25% cupcake bonus on level completion)'
      );
    } else if (itemType === 'chicken') {
      setChickens((prev) => prev + 1);
      triggerToast(
        isAr
          ? '🐔🔥 تم شراء دجاج محمر بالكعك! (حذف ٤ أسهم)'
          : '🐔🔥 Bought Roasted Chicken with cakes! (Removes 4 arrows)'
      );
    } else if (itemType === 'oracleEye') {
      setOracleEyes((prev) => prev + 1);
      triggerToast(
        isAr
          ? '👁️🔮 تم شراء عين العرافة الكونية بالكعك بنجاح!'
          : '👁️🔮 Oracle Eye purchased with cakes!'
      );
    } else if (itemType === 'deluxeCupcakePack') {
      setOracleEyes((prev) => prev + 1);
      setHammers((prev) => prev + 1);
      setLiquidChocolates((prev) => prev + 1);
      triggerToast(
        isAr
          ? '🧁💎 تم شراء صندوق الكاب كيك الفاخر (عين العراف + مطرقة + شوكولاته سائلة)!'
          : '🧁💎 Deluxe Cupcake Box purchased!'
      );
    } else if (itemType === 'cakeChest') {
      setHammers((prev) => prev + 1);
      setCreams((prev) => prev + 1);
      setLiquidChocolates((prev) => prev + 1);
      triggerToast(
        isAr
          ? '🎁🎂 تم شراء صندوق الكعك الملوكي (مطرقة + كريمة + شوكولاته سائلة)!'
          : '🎁🎂 Royal Cake Chest purchased!'
      );
    }
  };

  const handleBuyWithThunder = (itemType: string, thunderCost: number) => {
    const isAr = language === 'ar';
    if (thunders < thunderCost) {
      triggerToast(isAr ? 'عذراً! لا تملك عملات رعد كافية للشراء ⚡' : 'Not enough thunder coins! ⚡');
      return;
    }

    setThunders((prev) => prev - thunderCost);
    soundManager.playThunder();

    if (itemType === 'coins') {
      const coinsEarned = 25;
      setCoins((prev) => prev + coinsEarned);
      triggerToast(
        isAr
          ? `⚡ تم شراء ${coinsEarned} نقطة بـ ${thunderCost} عملة رعد بنجاح! 🪙`
          : `⚡ Bought ${coinsEarned} coins with ${thunderCost} thunder!`
      );
    } else if (itemType === 'hammer') {
      setHammers((prev) => prev + 1);
      triggerToast(isAr ? '🔨⚡ تم شراء مطرقة سحرية بمتجر الرعد!' : '🔨⚡ Bought Magic Hammer in Thunder Shop!');
    } else if (itemType === 'chocolate') {
      setChocolates((prev) => prev + 1);
      triggerToast(isAr ? '🍫⚡ تم شراء شوكولاتة بمتجر الرعد!' : '🍫⚡ Bought Magic Chocolate in Thunder Shop!');
    } else if (itemType === 'liquidChocolate') {
      setLiquidChocolates((prev) => prev + 1);
      triggerToast(isAr ? '🍫💧⚡ تم شراء شوكولاتة سائلة بمتجر الرعد!' : '🍫💧⚡ Bought Liquid Chocolate in Thunder Shop!');
    } else if (itemType === 'chicken') {
      setChickens((prev) => prev + 1);
      triggerToast(isAr ? '🐔🔥⚡ تم شراء دجاج محمر بمتجر الرعد!' : '🐔🔥⚡ Bought Roasted Chicken in Thunder Shop!');
    } else if (itemType === 'cream') {
      setCreams((prev) => prev + 1);
      triggerToast(isAr ? '🍦⚡ تم شراء كريمة سحرية بمتجر الرعد!' : '🍦⚡ Bought Magic Cream in Thunder Shop!');
    } else if (itemType === 'cake') {
      setCakes((prev) => prev + 1);
      triggerToast(isAr ? '🎂⚡ تم شراء كعكة واحدة بمتجر الرعد!' : '🎂⚡ Bought 1 Cake in Thunder Shop!');
    } else if (itemType === 'stormBundle') {
      setHammers((prev) => prev + 2);
      setChocolates((prev) => prev + 2);
      setLiquidChocolates((prev) => prev + 1);
      setChickens((prev) => prev + 1);
      triggerToast(
        isAr
          ? '⚡📦 تم شراء حزمة العاصفة الرعدية الفائقة (مطرقتين + شوكولاتتين + شوكولاته سائلة + دجاج محمر)!'
          : '⚡📦 Bought Super Storm Energy Bundle!'
      );
    } else if (itemType === 'midnightThunderSkin') {
      if (!unlockedSkins.includes('midnight_thunder')) {
        setUnlockedSkins((prev) => [...prev, 'midnight_thunder']);
      }
      setSelectedSkin('midnight_thunder');
      triggerToast(
        isAr
          ? '🌩️⚡ تم فتح وتفعيل خلفية عاصفة منتصف الليل الرعدية! (+3 عملات رعد إضافية عن كل مرحلة)'
          : '🌩️⚡ Midnight Thunderstorm unlocked & equipped! (+3 bonus thunder on level completion)'
      );
    } else if (itemType === 'neonArrowSkin') {
      if (!unlockedArrowSkins.includes('neon')) {
        setUnlockedArrowSkins((prev) => [...prev, 'neon']);
      }
      setSelectedArrowSkin('neon');
      triggerToast(
        isAr
          ? '⚡🏹 تم فتح وتفعيل أسهم النيون المتوهجة!'
          : '⚡🏹 Neon Glow arrows unlocked & equipped!'
      );
    } else if (itemType === 'timedLevelsPack') {
      setHasUnlockedTimedLevels(true);
      triggerToast(
        isAr
          ? '⏱️⚡ تم شراء حزمة المراحل المؤقتة الـ ١٠ بـ ٥٠ عملة رعد بنجاح! يمكنك العثور عليها في قائمة اختيار المستويات!'
          : '⏱️⚡ Timed Levels Pack (10 Levels) unlocked! Access them in Level Select!'
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

  const handleUseOracleEye = () => {
    const isAr = language === 'ar';
    soundManager.playClick();

    if (oracleEyes <= 0) {
      triggerToast(isAr ? 'لا تملك عين العرافة! يمكنك شراؤها من متجر الكعك 🎂👁️' : 'No Oracle Eye left! Buy in Cake Shop 🎂👁️');
      handleOpenShopWithTab('cake');
      return;
    }

    const unescaped = arrows.filter((a) => !a.isEscaped);
    if (unescaped.length === 0) return;

    soundManager.playVictory();

    // Find free (unblocked) arrows using canArrowEscape with exact grid dimensions
    const freeArrows = unescaped.filter((arrow) => {
      const res = canArrowEscape(arrow, unescaped, activeLevel.gridSize.cols, activeLevel.gridSize.rows);
      return res.canEscape;
    });

    let selectedToHighlight: Arrow[] = [];
    if (freeArrows.length > 0) {
      selectedToHighlight = freeArrows.slice(0, 3);
    } else {
      selectedToHighlight = unescaped.slice(0, 3);
    }

    const highlightIds = new Set(selectedToHighlight.map((a) => a.id));
    setHighlightedArrowIds(highlightIds);

    setOracleEyes((prev) => Math.max(0, prev - 1));
    triggerToast(
      isAr
        ? `👁️🔮 أضاءت عين العرافة البراقة أول ${highlightIds.size} أسهم حرة! ✨`
        : `👁️🔮 Oracle Eye illuminated the first ${highlightIds.size} free arrows! ✨`
    );
  };

  const handleUseLightning = () => {
    const isAr = language === 'ar';
    soundManager.playClick();

    if (lightnings <= 0) {
      triggerToast(isAr ? 'لا تملك ضربة رعد! يمكنك شراؤها بـ 85 نقطة ⚡' : 'No thunder strikes! Buy for 85 coins ⚡');
      handleOpenShopWithTab('tools');
      return;
    }

    const unescaped = arrows.filter((a) => !a.isEscaped);
    if (unescaped.length === 0) return;

    soundManager.playThunder();
    setLightnings((prev) => Math.max(0, prev - 1));

    // Select up to 3 random unescaped arrows to delete (Thunder Strike deletes 3 arrows)
    const shuffled = [...unescaped].sort(() => Math.random() - 0.5);
    const toRemove = shuffled.slice(0, 3);
    const removedIds = new Set(toRemove.map((a) => a.id));

    setArrows((prev) =>
      prev.map((a) => {
        if (removedIds.has(a.id)) {
          return {
            ...a,
            isEscaped: true,
            isFlying: true,
            flyDirection: { x: 0, y: -1 },
          };
        }
        return a;
      })
    );

    triggerToast(
      isAr
        ? `⚡⚡⚡ ضربة الرعد! تم حذف 3 أسهم عشوائية بنجاح!`
        : `⚡⚡⚡ Thunder Strike! Removed 3 random arrows!`
    );

    setTimeout(() => {
      registerEscapedArrowsForCake(removedIds.size);
    }, 450);
  };

  const handleUseCreamHammer = () => {
    const isAr = language === 'ar';
    soundManager.playClick();

    if (creamHammers <= 0) {
      triggerToast(isAr ? 'لا تملك مطرقة كريمة! يمكنك شراؤها بـ 85 نقطة 🛒' : 'No cream hammer! Buy for 85 coins 🛒');
      setShowShopModal(true);
      return;
    }

    const unescaped = arrows.filter((a) => !a.isEscaped);
    if (unescaped.length === 0) return;

    soundManager.playSmash();

    // Select up to 3 random unescaped arrows to remove (Cream Hammer deletes 3 arrows)
    const shuffled = [...unescaped].sort(() => 0.5 - Math.random());
    const selectedToSmash = shuffled.slice(0, 3);
    const smashedIds = new Set(selectedToSmash.map((a) => a.id));

    const estimatedTile = Math.max(24, Math.min(54, Math.floor((Math.min(window.innerWidth, 460) - 32) / activeLevel.gridSize.cols)));
    const creamHammerItems: RainItem[] = selectedToSmash.map((arrow, idx) => ({
      id: `cream-hammer-rain-${arrow.id}-${Date.now()}`,
      type: 'creamHammer',
      x: arrow.gridX * estimatedTile + estimatedTile / 2,
      y: arrow.gridY * estimatedTile + estimatedTile / 2,
      delay: idx * 60,
    }));
    setRainItems(creamHammerItems);

    setCreamHammers((prev) => Math.max(0, prev - 1));
    triggerToast(
      isAr
        ? `🍦🔨 هبطت مطرقة الكريمة ودمرت ${smashedIds.size} أسهم!`
        : `🍦🔨 Cream hammer smashed ${smashedIds.size} arrows!`
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

  const handleUseLiquidChocolate = () => {
    const isAr = language === 'ar';
    soundManager.playClick();

    if (liquidChocolates <= 0) {
      triggerToast(isAr ? 'لا تملك شوكولاته سائلة! يمكنك شراؤها من قسم الكعك 🍫💧' : 'No liquid chocolate! Buy from cake shop 🍫💧');
      handleOpenShopWithTab('cake');
      return;
    }

    const unescaped = arrows.filter((a) => !a.isEscaped);
    if (unescaped.length === 0) return;

    soundManager.playSmash();

    // Select up to 3 random unescaped arrows to remove (Liquid Chocolate deletes 3 arrows)
    const shuffled = [...unescaped].sort(() => 0.5 - Math.random());
    const selectedToSmash = shuffled.slice(0, 3);
    const smashedIds = new Set(selectedToSmash.map((a) => a.id));

    const estimatedTile = Math.max(24, Math.min(54, Math.floor((Math.min(window.innerWidth, 460) - 32) / activeLevel.gridSize.cols)));
    const liquidChocolateRainItems: RainItem[] = selectedToSmash.map((arrow, idx) => ({
      id: `liquidchocolate-rain-${arrow.id}-${Date.now()}`,
      type: 'liquidChocolate',
      x: arrow.gridX * estimatedTile + estimatedTile / 2,
      y: arrow.gridY * estimatedTile + estimatedTile / 2,
      delay: idx * 50,
    }));
    setRainItems(liquidChocolateRainItems);

    setLiquidChocolates((prev) => Math.max(0, prev - 1));

    triggerToast(
      isAr
        ? `🍫💧 تساقط مطر الشوكولاته السائلة لإزالة ${smashedIds.size} أسهم!`
        : `🍫💧 Liquid Chocolate rain deleted ${smashedIds.size} arrows!`
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

  const handleUseChicken = () => {
    const isAr = language === 'ar';
    soundManager.playClick();

    if (chickens <= 0) {
      triggerToast(isAr ? 'لا تملك دجاج محمر! يمكنك شراؤه من قسم الكعك 🐔🔥' : 'No roasted chicken! Buy from cake shop 🐔🔥');
      handleOpenShopWithTab('cake');
      return;
    }

    const unescaped = arrows.filter((a) => !a.isEscaped);
    if (unescaped.length === 0) return;

    soundManager.playSmash();

    // Select up to 4 random unescaped arrows to remove (Roasted Chicken deletes 4 arrows)
    const shuffled = [...unescaped].sort(() => 0.5 - Math.random());
    const selectedToSmash = shuffled.slice(0, 4);
    const smashedIds = new Set(selectedToSmash.map((a) => a.id));

    const estimatedTile = Math.max(24, Math.min(54, Math.floor((Math.min(window.innerWidth, 460) - 32) / activeLevel.gridSize.cols)));
    const chickenRainItems: RainItem[] = selectedToSmash.map((arrow, idx) => ({
      id: `chicken-rain-${arrow.id}-${Date.now()}`,
      type: 'chicken',
      x: arrow.gridX * estimatedTile + estimatedTile / 2,
      y: arrow.gridY * estimatedTile + estimatedTile / 2,
      delay: idx * 50,
    }));
    setRainItems(chickenRainItems);

    setChickens((prev) => Math.max(0, prev - 1));

    triggerToast(
      isAr
        ? `🐔🔥 تساقط الدجاج المحمر وإزالة ${smashedIds.size} أسهم!`
        : `🐔🔥 Roasted Chicken rain deleted ${smashedIds.size} arrows!`
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
      triggerToast(isAr ? 'لا تملك كريمة فضائية! يمكنك شراؤها من متجر الفضاء 🌌🍦' : 'No space cream! Buy from galaxy shop 🌌🍦');
      handleOpenShopWithTab('galaxy');
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
    // 0. Remove from highlighted set if present
    setHighlightedArrowIds((prev) => {
      if (prev.has(arrowId)) {
        const next = new Set(prev);
        next.delete(arrowId);
        return next;
      }
      return prev;
    });

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

    // 4. Cake / Cupcake Theme bonus counter (خلفية الكاب كيك - عند إزالة 35 سهم تمنح كاب كيك)
    if (selectedSkin === 'cake') {
      setCakeArrowCounter((prev) => {
        const next = prev + 1;
        if (next >= 35) {
          setCakes((c) => c + 1);
          const isAr = language === 'ar';
          soundManager.playVictory();
          triggerToast(
            isAr
              ? '🧁✨ مكافأة خلفية الكاب كيك: أزلت 35 سهماً بنجاح وحصلت على كاب كيك مجاني! (+1 🧁) 🎉'
              : '🧁✨ Cupcake Theme Bonus: Cleared 35 arrows! Received 1 free Cupcake! (+1 🧁) 🎉'
          );
          return 0;
        }
        return next;
      });
    }

    // 5. Royal Emerald Palace Theme bonus counter (خلفية القصر الزمردي - عند إزالة 100 سهم فرصة 51% لمطرقة سحرية + 30 عملة رعد ⚡)
    if (selectedSkin === 'emerald_palace') {
      setEmeraldPalaceEscapedCount((prev) => {
        const next = prev + 1;
        if (next >= 100) {
          const isAr = language === 'ar';
          const wonHammer = Math.random() < 0.51;
          if (wonHammer) {
            setHammers((h) => h + 1);
            setThunders((t) => t + 30);
            soundManager.playVictory();
            triggerToast(
              isAr
                ? '🏰💎 (فرصة 51%) نجاح! حصلت على مطرقة سحرية 🔨 + 30 عملة رعد ⚡ مجاناً! 🎉'
                : '🏰💎 (51% Chance) Success! Received 1 Magic Hammer 🔨 + 30 Thunder Coins ⚡! 🎉'
            );
          } else {
            setThunders((t) => t + 10);
            triggerToast(
              isAr
                ? '🏰💎 اكتمل عداد 100 سهم! لم تصب فرصة الـ 51% للمطرقة هذه المرة، وحصلت على 10 عملات رعد! ⚡'
                : '🏰💎 100-arrow counter complete! Missed 51% Hammer chance this time, received 10 Thunder Coins! ⚡'
            );
          }
          return 0;
        }
        return next;
      });
    }

    // 6. Royal Cake Kingdom Theme bonus counter (خلفية مملكة الكعك - عند إزالة 100 سهم: فرصة 49% لكعكة 🎂 و 51% لكاب كيك 🧁)
    if (selectedSkin === 'cake_kingdom') {
      setCakeKingdomEscapedCount((prev) => {
        const next = prev + 1;
        if (next >= 100) {
          const isAr = language === 'ar';
          const wonCake = Math.random() < 0.49;
          soundManager.playVictory();
          if (wonCake) {
            setCakes((c) => c + 1);
            triggerToast(
              isAr
                ? '🏰🎂 (فرصة 49%) نجاح! اكتمل عداد 100 سهم وحصلت على 1 كعكة ملكية مجانية! 🎂🎉'
                : '🏰🎂 (49% Chance) Success! Cleared 100 arrows and won 1 free Royal Cake! 🎂🎉'
            );
          } else {
            setCakes((c) => c + 1);
            triggerToast(
              isAr
                ? '🏰🧁 (فرصة 51%) نجاح! اكتمل عداد 100 سهم وحصلت على 1 كاب كيك ملكي مجاني! 🧁🎉'
                : '🏰🧁 (51% Chance) Success! Cleared 100 arrows and won 1 free Royal Cupcake! 🧁🎉'
            );
          }
          return 0;
        }
        return next;
      });
    }

    const escapedArrow = arrows.find((a) => a.id === arrowId);
    if (escapedArrow) {
      setTaskStats((prev) => ({
        ...prev,
        arrowsEscaped: prev.arrowsEscaped + 1,
        diamondEscaped: escapedArrow.isDiamond || escapedArrow.type === 'diamond' ? prev.diamondEscaped + 1 : prev.diamondEscaped,
      }));

      const isAlreadyCompleted =
        gameMode === 'galaxy'
          ? (starsPerGalaxyLevel[currentGalaxyLevelId] || 0) > 0
          : (starsPerLevel[currentLevelId] || 0) > 0;

      if (escapedArrow.isDiamond || escapedArrow.type === 'diamond') {
        const isAr = language === 'ar';
        if (!isAlreadyCompleted) {
          const baseCoins = 7;
          const gainedCoins = selectedSkin === 'golden_throne' ? baseCoins * 2 : baseCoins;
          setCoins((prev) => prev + gainedCoins);
          triggerToast(
            selectedSkin === 'golden_throne'
              ? (isAr ? '👑 💎 مضاعف العرش الذهبي: سهم محنك الماسي منحك +14 نقطة (×2)!' : '👑 💎 Golden Throne 2x: Diamond Veteran Arrow granted +14 coins (2x)!')
              : (isAr ? '💎 سهم محنك الماسي منحك +7 نقاط!' : '💎 Diamond Veteran Arrow granted +7 coins!')
          );
        } else {
          triggerToast(isAr ? '💎 هذه المرحلة مكتملة سابقاً (لا نقاط سهم الماسي)' : '💎 Previously completed level (No extra diamond coins)');
        }
      } else if (escapedArrow.isStar || escapedArrow.type === 'star') {
        const isAr = language === 'ar';
        if (!isAlreadyCompleted) {
          const baseCoins = 5;
          const gainedCoins = selectedSkin === 'golden_throne' ? baseCoins * 2 : baseCoins;
          setCoins((prev) => prev + gainedCoins);
          triggerToast(
            selectedSkin === 'golden_throne'
              ? (isAr ? '👑 🌟 مضاعف العرش الذهبي: سهم النجمة الذهبية منحك +10 نقاط (×2)!' : '👑 🌟 Golden Throne 2x: Star Arrow granted +10 coins (2x)!')
              : (isAr ? '🌟 سهم النجمة الذهبية منحك +5 نقاط!' : '🌟 Star Arrow granted +5 coins!')
          );
        } else {
          triggerToast(isAr ? '🌟 هذه المرحلة مكتملة سابقاً (لا نقاط نجمة إضافية)' : '🌟 Previously completed level (No extra star coins)');
        }
      } else if (escapedArrow.isGhost || escapedArrow.type === 'ghost') {
        const isAr = language === 'ar';
        triggerToast(isAr ? '👻 سهم الشبح اخترق العوائق وهرب ببراعة!' : '👻 Ghost Arrow phased through obstacles!');
      } else if (escapedArrow.isThunder || escapedArrow.type === 'thunder') {
        const isAr = language === 'ar';
        setThunders((prev) => prev + 5);
        soundManager.playThunder();
        triggerToast(
          isAr
            ? '⚡🏹 سهم الصاعقة الرعدية هرب! تم منحك +5 عملات رعد إضافية! ⚡'
            : '⚡🏹 Electric Thunder Arrow escaped! Granted +5 Thunder coins! ⚡'
        );
      } else if (escapedArrow.isSilver || escapedArrow.type === 'silver') {
        const isAr = language === 'ar';
        const isThunderSkin = selectedSkin === 'midnight_thunder' || selectedSkin === 'rainstorm' || gameMode === 'thunder';
        const baseSilverCoins = 20;
        const silverCoins = isThunderSkin ? baseSilverCoins * 2 : baseSilverCoins;
        setCoins((prev) => prev + silverCoins);
        soundManager.playPop();
        triggerToast(
          isThunderSkin
            ? (isAr
                ? '🥈⚡ مضاعف العاصفة الرعدية: سهم الفضة النادر منحك +40 نقطة ذهبية (×2)! 🪙'
                : '🥈⚡ Midnight Thunder 2x: Silver Arrow granted +40 Gold Coins (2x)! 🪙')
            : (isAr
                ? '🥈⚡ سهم الفضة النادر هرب! حصلت على +20 نقطة ذهبية بنجاح! 🪙'
                : '🥈⚡ Rare Silver Arrow escaped! +20 Gold Coins granted! 🪙')
        );
      } else if (escapedArrow.isTimedBomb || escapedArrow.type === 'timed_bomb') {
        const isAr = language === 'ar';
        soundManager.playPop();
        triggerToast(
          isAr
            ? '💣⚡ تم إطلاق سهم القنبلة المؤقتة بنجاح! (0 نقاط)'
            : '💣⚡ Timed Bomb Arrow launched! (0 pts)'
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

  const handleSelectThunderLevel = (thunderId: number) => {
    setGameMode('thunder');
    setCurrentThunderLevelId(thunderId);
    setShowLevelSelectModal(false);
  };

  const handleBuyMonsterPack = () => {
    const isAr = language === 'ar';
    if (coins < 154) {
      triggerToast(
        isAr
          ? '❌ تحتاج إلى ١٥٤ نقطة لفتح طور معركة الوحش!'
          : '❌ Need 154 coins to unlock Monster Battle Mode!'
      );
      return;
    }
    setCoins((c) => c - 154);
    setHasUnlockedMonsterMode(true);
    setGameMode('monster');
    soundManager.playVictory();
    triggerToast(
      isAr
        ? '🎉⚔️ تم فتح طور معركة الوحش (٥ مراحل) بـ ١٥٤ نقطة بنجاح! بالتوفيق في معركتك ضد الوحوش!'
        : '🎉⚔️ Successfully unlocked Monster Battle Mode (5 Stages) for 154 coins! Good luck!'
    );
  };

  const handleSelectMonsterLevel = (monsterId: number) => {
    if (!hasUnlockedMonsterMode) {
      handleBuyMonsterPack();
      return;
    }
    setGameMode('monster');
    setCurrentMonsterLevelId(monsterId);
    setShowLevelSelectModal(false);
  };

  const handleClaimTask = (taskId: string, rewardType: string, rewardAmount: number) => {
    const isAr = language === 'ar';
    soundManager.playVictory();

    setTaskStats((prev) => ({
      ...prev,
      claimedTaskIds: [...prev.claimedTaskIds, taskId],
    }));

    if (rewardType === 'coins') {
      setCoins((c) => c + rewardAmount);
      triggerToast(isAr ? `🎁 تم استلام +${rewardAmount} نقطة مكافأة!` : `🎁 Claimed +${rewardAmount} coins reward!`);
    } else if (rewardType === 'hammer') {
      setHammers((h) => h + rewardAmount);
      triggerToast(isAr ? `🎁 تم استلام +${rewardAmount} مطرقة مكافأة!` : `🎁 Claimed +${rewardAmount} hammer!`);
    } else if (rewardType === 'chocolate') {
      setChocolates((c) => c + rewardAmount);
      triggerToast(isAr ? `🎁 تم استلام +${rewardAmount} شوكولاتة مكافأة!` : `🎁 Claimed +${rewardAmount} chocolate!`);
    } else if (rewardType === 'cream') {
      setCreams((c) => c + rewardAmount);
      triggerToast(isAr ? `🎁 تم استلام +${rewardAmount} كريمة مكافأة!` : `🎁 Claimed +${rewardAmount} cream!`);
    } else if (rewardType === 'thunder') {
      setThunders((t) => t + rewardAmount);
      triggerToast(isAr ? `🎁 تم استلام +${rewardAmount} عملة رعد مكافأة!` : `🎁 Claimed +${rewardAmount} thunder!`);
    }
  };

  const handleLevelCompleted = () => {
    const isAr = language === 'ar';
    const starsEarned = drops === 3 ? 3 : drops === 2 ? 2 : 1;
    let pointsEarned = 0;

    // Track completed levels stat
    setTaskStats((prev) => ({
      ...prev,
      levelsCompleted: prev.levelsCompleted + 1,
      longCompleted: gameMode === 'long' ? prev.longCompleted + 1 : prev.longCompleted,
      galaxyCompleted: gameMode === 'galaxy' ? prev.galaxyCompleted + 1 : prev.galaxyCompleted,
      goldenThroneCompleted: selectedSkin === 'golden_throne' ? prev.goldenThroneCompleted + 1 : prev.goldenThroneCompleted,
    }));

    const isAlreadyCompleted =
      gameMode === 'galaxy'
        ? (starsPerGalaxyLevel[currentGalaxyLevelId] || 0) > 0
        : gameMode === 'long'
        ? (starsPerLongLevel[currentLongLevelId] || 0) > 0
        : gameMode === 'thunder'
        ? (starsPerThunderLevel[currentThunderLevelId] || 0) > 0
        : gameMode === 'timed'
        ? (starsPerTimedLevel[currentTimedLevelId] || 0) > 0
        : gameMode === 'monster'
        ? (starsPerMonsterLevel[currentMonsterLevelId] || 0) > 0
        : (starsPerLevel[currentLevelId] || 0) > 0;

    // Survival star bonus multiplier (Cake Star Arrow perk doubles survival stars reward in event levels only)
    const isEventMode = gameMode === 'galaxy' || gameMode === 'long' || gameMode === 'thunder';
    const isCakeStarActive = selectedArrowSkin === 'cake_star' && isEventMode;
    const survivalStarMultiplier = isCakeStarActive ? 2 : 1;

    if (gameMode === 'galaxy') {
      const prevGalaxyStars = starsPerGalaxyLevel[currentGalaxyLevelId] || 0;
      pointsEarned = isAlreadyCompleted ? 0 : starsEarned * 4 * survivalStarMultiplier;
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
    } else if (gameMode === 'long') {
      const prevLongStars = starsPerLongLevel[currentLongLevelId] || 0;
      pointsEarned = isAlreadyCompleted ? 0 : starsEarned * 8 * survivalStarMultiplier;
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
    } else if (gameMode === 'thunder') {
      const prevThunderStars = starsPerThunderLevel[currentThunderLevelId] || 0;
      pointsEarned = isAlreadyCompleted ? 0 : starsEarned * 6 * survivalStarMultiplier;
      if (selectedSkin === 'golden_throne' && pointsEarned > 0) {
        pointsEarned *= 2;
      }

      const newThunderStars = Math.max(prevThunderStars, starsEarned);
      const updatedThunderStars = {
        ...starsPerThunderLevel,
        [currentThunderLevelId]: newThunderStars,
      };
      setStarsPerThunderLevel(updatedThunderStars);
      setUnlockedThunderLevel((prev) => Math.max(prev, currentThunderLevelId + 1));
    } else if (gameMode === 'timed') {
      const prevTimedStars = starsPerTimedLevel[currentTimedLevelId] || 0;
      pointsEarned = isAlreadyCompleted ? 0 : starsEarned * 10 * survivalStarMultiplier;
      if (selectedSkin === 'golden_throne' && pointsEarned > 0) {
        pointsEarned *= 2;
      }

      const newTimedStars = Math.max(prevTimedStars, starsEarned);
      const updatedTimedStars = {
        ...starsPerTimedLevel,
        [currentTimedLevelId]: newTimedStars,
      };
      setStarsPerTimedLevel(updatedTimedStars);
      setUnlockedTimedLevel((prev) => Math.max(prev, currentTimedLevelId + 1));
    } else if (gameMode === 'monster') {
      const prevMonsterStars = starsPerMonsterLevel[currentMonsterLevelId] || 0;
      pointsEarned = isAlreadyCompleted ? 0 : starsEarned * 12 * survivalStarMultiplier;
      if (selectedSkin === 'golden_throne' && pointsEarned > 0) {
        pointsEarned *= 2;
      }

      const newMonsterStars = Math.max(prevMonsterStars, starsEarned);
      const updatedMonsterStars = {
        ...starsPerMonsterLevel,
        [currentMonsterLevelId]: newMonsterStars,
      };
      setStarsPerMonsterLevel(updatedMonsterStars);
      setUnlockedMonsterLevel((prev) => Math.max(prev, currentMonsterLevelId + 1));
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

      const nextUnlocked = computeUnlockedLevel(updatedStars);
      setUnlockedLevel(nextUnlocked);
    }

    const hasTimedBomb = activeLevel.arrows.some((a) => a.isTimedBomb || a.type === 'timed_bomb');
    if (hasTimedBomb) {
      pointsEarned = 0;
    }

    if (isCakeStarActive && pointsEarned > 0) {
      triggerToast(
        isAr
          ? '🎂⭐ ميزة أسهم نجوم الكعك: مضاعفة مكافأة نجوم البقاء (×2) في مراحل الأحداث! 🌟⚡'
          : '🎂⭐ Cake Star Arrows Perk: 2x Survival Star Reward in Event Stage! 🌟⚡'
      );
    }

    if (selectedSkin === 'golden_throne' && pointsEarned > 0) {
      triggerToast(
        isAr
          ? '👑 مضاعف العرش الذهبي: حصلت على ضعف الفلوس (×2)! 🪙✨'
          : '👑 Golden Throne Multiplier: 2x Double Coins Earned! 🪙✨'
      );
    }

    if (selectedSkin === 'emerald_palace' && pointsEarned > 0) {
      pointsEarned = Math.round(pointsEarned * 1.25);
      triggerToast(
        isAr
          ? '🏰💎 مكافأة القصر الزمردي: +25% نقاط إضافية على هذا الفوز! 🪙✨'
          : '🏰💎 Emerald Palace Perk: +25% bonus coins on victory! 🪙✨'
      );
    }

    // Thunder Coins Bonus: 15% chance to earn 2 to 5 thunder coins ⚡ on level completion
    let thunderBonusEarned = 0;
    if (!isAlreadyCompleted && Math.random() < 0.15) {
      thunderBonusEarned = Math.floor(Math.random() * 4) + 2; // 2 to 5 coins
    }

    // Smart Cake Multiplier logic (doubles all level completion points & thunder drops)
    if (smartCakeMultiplierLevelsRemaining > 0) {
      if (pointsEarned > 0) {
        pointsEarned *= 2;
      }
      if (thunderBonusEarned > 0) {
        thunderBonusEarned *= 2;
      }
      triggerToast(
        isAr
          ? `🎂⚡ مضاعف الكعك الذكي: تم مضاعفة كافة جوائز المرحلة (متبقي ${smartCakeMultiplierLevelsRemaining - 1} مراحل)! 🪙`
          : `🎂⚡ Smart Cake Multiplier: All level rewards doubled! (${smartCakeMultiplierLevelsRemaining - 1} levels left) 🪙`
      );
      setSmartCakeMultiplierLevelsRemaining((prev) => Math.max(0, prev - 1));
    }

    if (pointsEarned > 0) {
      setCoins((prev) => prev + pointsEarned);
    }

    setLastCoinsEarned(pointsEarned);

    if (thunderBonusEarned > 0) {
      setThunders((prev) => prev + thunderBonusEarned);
      triggerToast(
        isAr
          ? `⚡ مكافأة العاصفة! ربحت +${thunderBonusEarned} عملات رعد مجانية! 🪙⚡`
          : `⚡ Storm bonus! +${thunderBonusEarned} Thunder Coins won! 🪙⚡`
      );
    }

    // Cake Kingdom Theme Perk (25% chance for 1 bonus cake + 25% chance for 1 bonus cupcake 🎂)
    if (selectedSkin === 'cake_kingdom') {
      if (Math.random() < 0.25) {
        setCakes((prev) => prev + 1);
        triggerToast(
          isAr
            ? '🏰🎂 ميزة مملكة الكعك الملكية! حصلت على 1 كعكة ملكية مجانية (احتمال 25%)! 🎉'
            : '🏰🎂 Cake Kingdom Perk! Won 1 bonus royal cake (25% chance)! 🎉'
        );
      }
      if (Math.random() < 0.25) {
        setCakes((prev) => prev + 1);
        triggerToast(
          isAr
            ? '🧁✨ ميزة مملكة الكعك الملكية! حصلت على 1 كاب كيك ملكي مجاني (احتمال 25%)! 🎉'
            : '🧁✨ Cake Kingdom Perk! Won 1 bonus royal cupcake (25% chance)! 🎉'
        );
      }
    }

    // Midnight Thunderstorm Perk (+3 bonus thunder coins on every level completion ⚡)
    if (selectedSkin === 'midnight_thunder') {
      setThunders((prev) => prev + 3);
      triggerToast(
        isAr
          ? '🌩️⚡ ميزة عاصفة منتصف الليل! تم منحك +3 عملات رعد إضافية! ⚡'
          : '🌩️⚡ Midnight Thunder Perk! Granted +3 bonus thunder coins! ⚡'
      );
    }

    setShowVictoryModal(true);
  };

  const handleNextLevel = () => {
    setShowVictoryModal(false);
    if (gameMode === 'galaxy') {
      const nextId = Math.min(25, currentGalaxyLevelId + 1);
      setCurrentGalaxyLevelId(nextId);
    } else if (gameMode === 'long') {
      const nextId = Math.min(30, currentLongLevelId + 1);
      setCurrentLongLevelId(nextId);
    } else if (gameMode === 'thunder') {
      const nextId = Math.min(26, currentThunderLevelId + 1);
      setCurrentThunderLevelId(nextId);
    } else if (gameMode === 'timed') {
      const nextId = Math.min(10, currentTimedLevelId + 1);
      setCurrentTimedLevelId(nextId);
    } else if (gameMode === 'monster') {
      const nextId = Math.min(5, currentMonsterLevelId + 1);
      setCurrentMonsterLevelId(nextId);
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
    setHighlightedArrowIds(new Set());
    if (gameMode === 'timed') {
      setLevelTimeLeft(activeLevel.timeLimitSeconds || 45);
    }
  };

  const handleTimedBombExploded = (arrowId?: string) => {
    soundManager.playSmash();
    setDrops((prev) => {
      const nextDrops = Math.max(0, prev - 1);
      if (nextDrops === 0) {
        triggerToast(
          language === 'ar'
            ? '💥💣 انفجر السهم المتفجر ونفذت نجوم البقاء! تمت إعادة المرحلة تلقائياً! 🔄'
            : '💥💣 Timed bomb exploded & out of Survival Stars! Level restarted! 🔄'
        );
        setTimeout(() => {
          handleRestartLevel();
        }, 1000);
      } else {
        triggerToast(
          language === 'ar'
            ? '💥💣 انفجر السهم المتفجر! فقدت نجمة بقاء ⭐'
            : '💥💣 Timed bomb exploded! Lost 1 Survival Star ⭐'
        );
        if (arrowId) {
          handleArrowEscaped(arrowId);
        }
      }
      return nextDrops;
    });
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
          : selectedSkin === 'emerald_palace'
          ? 'bg-emerald-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-700 via-teal-950 to-slate-950 text-emerald-100'
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
        ) : selectedSkin === 'emerald_palace' ? (
          <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-emerald-400/20 via-teal-500/10 to-transparent blur-3xl animate-pulse" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-20 right-10 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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
          : selectedSkin === 'emerald_palace'
          ? 'bg-gradient-to-b from-emerald-950 via-teal-950/95 to-slate-950 text-emerald-100 sm:border-emerald-500/80 shadow-[0_0_50px_rgba(16,185,129,0.4)]'
          : selectedSkin === 'cake'
          ? 'bg-gradient-to-b from-pink-950 via-rose-950 to-amber-950 text-pink-100 sm:border-pink-500/80 shadow-[0_0_50px_rgba(244,114,182,0.4)]'
          : gameMode === 'thunder' || selectedSkin === 'rainstorm' || selectedSkin === 'midnight_thunder'
          ? 'bg-slate-950 text-white border-sky-500/80 shadow-[0_0_50px_rgba(14,165,233,0.4)]'
          : gameMode === 'monster'
          ? 'bg-gradient-to-b from-rose-950 via-slate-950 to-red-950 text-white sm:border-rose-500/80 shadow-[0_0_60px_rgba(225,29,72,0.5)]'
          : gameMode === 'galaxy' || selectedSkin === 'nebula' || selectedSkin === 'supernova'
          ? 'bg-gradient-to-b from-slate-950 via-purple-950/95 to-indigo-950 text-white'
          : 'bg-gradient-to-b from-sky-50/90 via-white to-slate-100/95 text-slate-800'
      }`}>
        
        {/* Render Thunderstorm & Rain Background Overlay for Storm Event Levels */}
        {(gameMode === 'thunder' || selectedSkin === 'rainstorm' || selectedSkin === 'midnight_thunder') && (
          <ThunderstormBackground isThunderMode={gameMode === 'thunder'} />
        )}

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
          gameMode === 'thunder' || selectedSkin === 'rainstorm' || selectedSkin === 'midnight_thunder'
            ? 'bg-gradient-to-r from-slate-950 via-sky-900 to-indigo-950 border-b border-sky-400/30'
            : gameMode === 'monster'
            ? 'bg-gradient-to-r from-rose-900 via-red-800 to-purple-950 border-b border-rose-500/50'
            : gameMode === 'galaxy'
            ? 'bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600'
            : gameMode === 'long'
            ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700'
            : 'bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-6.5 h-6.5 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xs shadow-inner font-bold">
              {gameMode === 'thunder' ? '⚡' : gameMode === 'monster' ? '👹' : gameMode === 'galaxy' ? '🌌' : gameMode === 'long' ? '📜' : '🎯'}
            </div>
            <span className="font-black text-xs sm:text-sm tracking-wide">
              {gameMode === 'thunder'
                ? isAr ? `أحداث المطر والعواصف - مرحلة ${activeLevel.id}` : `Rain & Thunder Event Level ${activeLevel.id}`
                : gameMode === 'monster'
                ? isAr ? `معركة الوحش 👹⚔️ - المرحلة ${activeLevel.id}` : `Monster Battle 👹⚔️ - Stage ${activeLevel.id}`
                : gameMode === 'galaxy'
                ? isAr ? `مراحل الأحداث - المجرة ${activeLevel.id}` : `Galaxy Level ${activeLevel.id}`
                : gameMode === 'long'
                ? isAr ? `المراحل الطويلة - مرحلة ${activeLevel.id}` : `Long Maze Level ${activeLevel.id}`
                : isAr ? 'هروب الأسهم - تطبيق الألغاز' : 'Arrow Escape App'}
            </span>
          </div>
          <span className="text-[10px] bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 text-slate-950 px-2.5 py-0.5 rounded-full font-black border border-white/50 shadow-xs animate-pulse flex items-center gap-1">
            <span>⚡</span>
            <span>{gameMode === 'thunder' ? (isAr ? 'حدث المطر والعواصف ⛈️' : 'Thunderstorm Event ⛈️') : (isAr ? 'تحديث الجمعة الكوني' : 'Cosmic Friday Update')}</span>
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
            onOpenTasks={() => setShowTasksModal(true)}
            onOpenFriends={() => setShowFriendsModal(true)}
            onOpenTrade={() => {
              setSelectedTradeFriend(null);
              setShowTradeModal(true);
            }}
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

            {/* Cake Kingdom 17% Cake Chance Active Banner */}
            {selectedSkin === 'cake' && (
              <div className="mb-1.5 bg-gradient-to-r from-pink-950 via-rose-950 to-amber-950 border-2 border-pink-400/90 text-pink-100 font-black text-xs px-3.5 py-1.5 rounded-2xl shadow-xl flex items-center justify-between gap-2.5 w-full max-w-md animate-fade-in">
                <div className="flex items-center gap-1.5">
                  <span className="text-base animate-pulse">🎂✨</span>
                  <div className="flex flex-col">
                    <span className="text-[11px] leading-none text-pink-200">
                      {isAr ? 'خلفية مملكة الكعك (احتمال 17% كعكة):' : 'Cake Kingdom Theme (17% Cake Chance):'}
                    </span>
                    <span className="text-[9px] text-pink-300/90 font-semibold mt-0.5">
                      {isAr ? 'احتمال 17% للحصول على كعكة مجانية عند إكمال أي مرحلة! 🎂' : '17% chance to earn 1 free cake upon level clear! 🎂'}
                    </span>
                  </div>
                </div>
                <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-xl shadow-md border border-pink-200 shrink-0">
                  17% 🎂
                </span>
              </div>
            )}

            {/* Smart Cake Multiplier Active Banner */}
            {smartCakeMultiplierLevelsRemaining > 0 && (
              <div className="mb-1.5 bg-gradient-to-r from-amber-950 via-pink-950 to-slate-900 border-2 border-amber-400/90 text-amber-100 font-black text-xs px-3.5 py-1.5 rounded-2xl shadow-xl flex items-center justify-between gap-2.5 w-full max-w-md animate-fade-in">
                <div className="flex items-center gap-1.5">
                  <span className="text-base animate-pulse">🎂⚡</span>
                  <div className="flex flex-col">
                    <span className="text-[11px] leading-none text-amber-200">
                      {isAr ? `مضاعف الكعك الذكي نشط (متبقي ${smartCakeMultiplierLevelsRemaining} مراحل):` : `Smart Cake Multiplier Active (${smartCakeMultiplierLevelsRemaining} levels left):`}
                    </span>
                    <span className="text-[9px] text-pink-300 font-semibold mt-0.5">
                      {isAr ? 'مضاعفة جميع المكافآت والنقاط وعملات الفضاء والرعد! 🪙⚡' : 'Doubles all level rewards, coins, space & thunder coins! 🪙⚡'}
                    </span>
                  </div>
                </div>
                <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-pink-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-xl shadow-md border border-amber-200 shrink-0">
                  ⚡×2 ({smartCakeMultiplierLevelsRemaining})
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

            {/* Cake / Cupcake Theme 35-Arrow Progress Counter Banner */}
            {selectedSkin === 'cake' && (
              <div className="mb-1.5 bg-gradient-to-r from-slate-950 via-rose-950 to-pink-950 border-2 border-pink-400/80 text-pink-100 font-black text-xs px-3.5 py-1.5 rounded-2xl shadow-xl flex items-center justify-between gap-2.5 w-full max-w-md animate-fade-in">
                <div className="flex items-center gap-1.5">
                  <span className="text-base animate-bounce">🧁</span>
                  <div className="flex flex-col">
                    <span className="text-[11px] leading-none text-pink-200">
                      {isAr ? 'عداد مخبز الكاب كيك (+1 كاب كيك 🧁):' : 'Cupcake Bakery Counter (+1 Cupcake 🧁):'}
                    </span>
                    <span className="text-[9px] text-pink-300/90 font-semibold mt-0.5">
                      {isAr ? 'كاب كيك مجاني 🧁 عند إزالة كل 35 سهماً!' : '1 Free Cupcake 🧁 for every 35 cleared arrows!'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 sm:w-24 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-pink-400/40 p-0.5">
                    <div
                      className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (cakeArrowCounter / 35) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-black text-pink-200 bg-pink-950/90 px-2 py-0.5 rounded-lg border border-pink-400/40 shrink-0">
                    {cakeArrowCounter} / 35
                  </span>
                </div>
              </div>
            )}

            {/* Royal Emerald Palace Theme 100-Arrow Progress Counter Banner */}
            {selectedSkin === 'emerald_palace' && (
              <div className="mb-1.5 bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-950 border-2 border-emerald-400/80 text-emerald-100 font-black text-xs px-3.5 py-1.5 rounded-2xl shadow-xl flex items-center justify-between gap-2.5 w-full max-w-md animate-fade-in">
                <div className="flex items-center gap-1.5">
                  <span className="text-base animate-bounce">🏰💎</span>
                  <div className="flex flex-col">
                    <span className="text-[11px] leading-none text-emerald-200">
                      {isAr ? 'عداد القصر الزمردي (فرصة ٥١٪ لمطرقة 🔨 + عملات رعد ⚡):' : 'Emerald Palace Counter (51% Hammer 🔨 + Thunder ⚡ Chance):'}
                    </span>
                    <span className="text-[9px] text-emerald-300/90 font-semibold mt-0.5">
                      {isAr ? 'عند إزالة 100 سهم: فرصة 51% لمطرقة 🔨 + 30 عملة رعد ⚡!' : 'Clear 100 arrows: 51% chance for Hammer 🔨 + 30 Thunder Coins ⚡!'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 sm:w-24 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-emerald-400/40 p-0.5">
                    <div
                      className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (emeraldPalaceEscapedCount / 100) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-black text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded-lg border border-emerald-400/40 shrink-0">
                    {emeraldPalaceEscapedCount} / 100
                  </span>
                </div>
              </div>
            )}

            {/* Royal Cake Kingdom Theme 100-Arrow Progress Counter Banner */}
            {selectedSkin === 'cake_kingdom' && (
              <div className="mb-1.5 bg-gradient-to-r from-pink-950 via-rose-950 to-amber-950 border-2 border-pink-400/80 text-pink-100 font-black text-xs px-3.5 py-1.5 rounded-2xl shadow-xl flex items-center justify-between gap-2.5 w-full max-w-md animate-fade-in">
                <div className="flex items-center gap-1.5">
                  <span className="text-base animate-bounce">🏰🎂</span>
                  <div className="flex flex-col">
                    <span className="text-[11px] leading-none text-pink-200">
                      {isAr ? 'عداد مملكة الكعك (كعكة 🎂 أو كاب كيك 🧁):' : 'Cake Kingdom Counter (Cake 🎂 or Cupcake 🧁):'}
                    </span>
                    <span className="text-[9px] text-pink-300/90 font-semibold mt-0.5">
                      {isAr ? 'عند إزالة 100 سهم: فرصة 49% لكعكة 🎂 أو 51% لكاب كيك 🧁!' : 'Clear 100 arrows: 49% for Cake 🎂 or 51% for Cupcake 🧁!'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 sm:w-24 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-pink-400/40 p-0.5">
                    <div
                      className="bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (cakeKingdomEscapedCount / 100) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-black text-pink-200 bg-pink-950/90 px-2 py-0.5 rounded-lg border border-pink-400/40 shrink-0">
                    {cakeKingdomEscapedCount} / 100
                  </span>
                </div>
              </div>
            )}

            {/* Timed Level Countdown Timer Banner */}
            {gameMode === 'timed' && levelTimeLeft !== null && (
              <div className={`mb-2 px-4 py-2 rounded-2xl border-2 font-black text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xl w-full max-w-sm transition-all animate-bounce ${
                levelTimeLeft <= 10
                  ? 'bg-gradient-to-r from-red-950 via-rose-900 to-red-950 border-red-500 text-red-200 animate-pulse'
                  : 'bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-amber-400 text-amber-200'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">⏱️⚡</span>
                  <div className="flex flex-col">
                    <span className="text-xs leading-none">
                      {isAr ? 'مرحلة مؤقتة سريعة!' : 'Timed Challenge Level!'}
                    </span>
                    <span className="text-[10px] text-slate-300 font-medium mt-0.5">
                      {isAr ? 'أخرج جميع الأسهم قبل انتهاء المؤقت' : 'Escape all arrows before time runs out'}
                    </span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-xl text-sm font-black border flex items-center gap-1 ${
                  levelTimeLeft <= 10
                    ? 'bg-red-600 text-white border-red-300 animate-ping'
                    : 'bg-amber-500 text-slate-950 border-amber-300'
                }`}>
                  <span>⏱️</span>
                  <span>{levelTimeLeft}s</span>
                </div>
              </div>
            )}

            {/* Monster Battle Countdown Timer & 2-Second Obstacle Status Banner */}
            {gameMode === 'monster' && (
              <div className="w-full max-w-sm mb-2 flex flex-col gap-1.5 animate-fade-in">
                {/* Timer & Monster Battle Status */}
                <div className={`px-4 py-2 rounded-2xl border-2 font-black text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xl transition-all ${
                  (levelTimeLeft || 0) <= 10
                    ? 'bg-gradient-to-r from-red-950 via-rose-900 to-red-950 border-red-500 text-red-200 animate-pulse shadow-[0_0_25px_rgba(225,29,72,0.7)]'
                    : 'bg-gradient-to-r from-rose-950 via-slate-950 to-red-950 border-rose-500/80 text-rose-100 shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl animate-bounce">👹⚔️</span>
                    <div className="flex flex-col">
                      <span className="text-xs leading-none text-rose-200 font-bold">
                        {isAr ? 'مؤقت معركة الوحش ⏱️' : 'Monster Battle Timer ⏱️'}
                      </span>
                      <span className="text-[10px] text-rose-300/80 font-medium mt-0.5">
                        {isAr ? 'احذر من هجوم الوحش عند الصفر!' : 'Watch out for monster attack at 0s!'}
                      </span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-xl text-sm font-black border flex items-center gap-1 ${
                    (levelTimeLeft || 0) <= 10
                      ? 'bg-red-600 text-white border-red-300 animate-bounce'
                      : 'bg-gradient-to-r from-rose-600 to-red-600 text-white border-rose-400'
                  }`}>
                    <span>⏱️</span>
                    <span>{levelTimeLeft !== null ? levelTimeLeft : 60}s</span>
                  </div>
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
              onTimedBombExploded={handleTimedBombExploded}
              highlightedArrowIds={highlightedArrowIds}
              isMonsterObstacleActive={monsterObstacleActive}
              monsterObstacleTimer={monsterObstacleTimer}
              levelTimeLeft={levelTimeLeft}
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

              {/* Oracle Eye Power-up Button */}
              <button
                id="btn-oracle-eye"
                onClick={handleUseOracleEye}
                className="px-3.5 py-2 rounded-2xl border-2 border-indigo-400 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 cursor-pointer transition-all"
                title={isAr ? 'عين العرافة الكونية - كشف وإطلاق الأسهم الحرة فوراً!' : 'Oracle Eye - Reveal and escape free arrows!'}
              >
                <span className="text-lg animate-pulse">👁️🔮</span>
                <span>{isAr ? 'عين العرافة' : 'Oracle Eye'}</span>
                <span className="bg-indigo-950 text-indigo-200 font-extrabold text-[11px] px-1.5 py-0.2 rounded-full shadow-inner">
                  {oracleEyes}
                </span>
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
                  {creams + creamHammers + chocolates + hammers + tomatoes + liquidChocolates + cakes}
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
              : gameMode === 'thunder'
              ? currentThunderLevelId
              : gameMode === 'timed'
              ? currentTimedLevelId
              : gameMode === 'monster'
              ? currentMonsterLevelId
              : currentLevelId
          }
          stars={
            gameMode === 'galaxy'
              ? starsPerGalaxyLevel[currentGalaxyLevelId] || 3
              : gameMode === 'long'
              ? starsPerLongLevel[currentLongLevelId] || 3
              : gameMode === 'thunder'
              ? starsPerThunderLevel[currentThunderLevelId] || 3
              : gameMode === 'timed'
              ? starsPerTimedLevel[currentTimedLevelId] || 3
              : gameMode === 'monster'
              ? starsPerMonsterLevel[currentMonsterLevelId] || 3
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
          unlockedThunderLevel={unlockedThunderLevel}
          currentThunderLevel={currentThunderLevelId}
          starsPerThunderLevel={starsPerThunderLevel}
          unlockedTimedLevel={unlockedTimedLevel}
          currentTimedLevel={currentTimedLevelId}
          starsPerTimedLevel={starsPerTimedLevel}
          hasUnlockedTimedLevels={hasUnlockedTimedLevels}
          unlockedMonsterLevel={unlockedMonsterLevel}
          currentMonsterLevel={currentMonsterLevelId}
          starsPerMonsterLevel={starsPerMonsterLevel}
          hasUnlockedMonsterMode={hasUnlockedMonsterMode}
          isEventUnlocked={isEventUnlocked}
          gameMode={gameMode}
          initialTab={levelSelectTab}
          coins={coins}
          thunders={thunders}
          language={language}
          onSelectMainLevel={handleSelectMainLevel}
          onSelectGalaxyLevel={handleSelectGalaxyLevel}
          onSelectLongLevel={handleSelectLongLevel}
          onSelectThunderLevel={handleSelectThunderLevel}
          onSelectTimedLevel={(timedId) => {
            setGameMode('timed');
            setCurrentTimedLevelId(timedId);
            setShowLevelSelectModal(false);
          }}
          onSelectMonsterLevel={handleSelectMonsterLevel}
          onBuyMonsterPack={handleBuyMonsterPack}
          onBuyTimedPack={() => {
            if (thunders >= 50) {
              handleBuyWithThunder('timedLevelsPack', 50);
            } else {
              triggerToast(language === 'ar' ? 'عملات الرعد غير كافية! تحتاج 50⚡' : 'Not enough thunder coins! Needs 50⚡');
            }
          }}
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
          liquidChocolates={liquidChocolates}
          hammers={hammers}
          thunders={thunders}
          lightnings={lightnings}
          creams={creams}
          creamHammers={creamHammers}
          chocolates={chocolates}
          cakes={cakes}
          chickens={chickens}
          oracleEyes={oracleEyes}
          cakeArrowCounter={cakeArrowCounter}
          smartCakeMultiplierLevelsRemaining={smartCakeMultiplierLevelsRemaining}
          hasUnlockedTimedLevels={hasUnlockedTimedLevels}
          hasUnlockedMonsterMode={hasUnlockedMonsterMode}
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
          onBuyCreamHammer={handleBuyCreamHammer}
          onBuyChocolate={handleBuyChocolate}
          onBuyTomato={handleBuyTomato}
          onBuySpaceCream={handleBuySpaceCream}
          onBuyLiquidChocolate={handleBuyLiquidChocolate}
          onBuyBundle={handleBuyBundle}
          onBuyCakeBundle={handleBuyCakeBundle}
          onBuySpaceBundle={handleBuySpaceBundle}
          onBuyMonsterPack={handleBuyMonsterPack}
          onExchangeCoins={handleExchangeCoinsForSpaceCoins}
          onExchangeCake={handleExchangeCake}
          onBuyWithCake={handleBuyWithCake}
          onBuyWithThunder={handleBuyWithThunder}
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
          liquidChocolates={liquidChocolates}
          hammers={hammers}
          thunders={thunders}
          lightnings={lightnings}
          creams={creams}
          creamHammers={creamHammers}
          chocolates={chocolates}
          cakes={cakes}
          chickens={chickens}
          oracleEyes={oracleEyes}
          selectedSkin={selectedSkin}
          unlockedSkins={unlockedSkins}
          selectedArrowSkin={selectedArrowSkin}
          unlockedArrowSkins={unlockedArrowSkins}
          language={language}
          onUseCream={handleUseCream}
          onUseCreamHammer={handleUseCreamHammer}
          onUseChocolate={handleUseChocolate}
          onUseThunder={handleUseLightning}
          onUseTomato={handleUseTomato}
          onUseSpaceCream={handleUseSpaceCream}
          onUseLiquidChocolate={handleUseLiquidChocolate}
          onUseChicken={handleUseChicken}
          onUseOracleEye={handleUseOracleEye}
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

      {showTasksModal && (
        <TasksModal
          language={language}
          coins={coins}
          lastTasksResetTimestamp={lastTasksResetTimestamp}
          taskStats={taskStats}
          onClaimTask={handleClaimTask}
          onClose={() => setShowTasksModal(false)}
        />
      )}

      {showFriendsModal && (
        <FriendsModal
          isOpen={showFriendsModal}
          onClose={() => setShowFriendsModal(false)}
          language={language}
          playerId={playerId}
          playerName={playerName}
          onUpdatePlayerName={handleUpdatePlayerName}
          friends={friends}
          requests={friendRequests}
          onAcceptRequest={handleAcceptFriendRequest}
          onDeclineRequest={handleDeclineFriendRequest}
          onAddFriend={handleAddFriend}
          onRemoveFriend={handleRemoveFriend}
          onOpenTradeWithFriend={handleOpenTradeWithFriend}
          onSendGift={handleSendGift}
          giftSentFriendIds={giftSentFriendIds}
        />
      )}

      {showTradeModal && (
        <TradeModal
          isOpen={showTradeModal}
          onClose={() => setShowTradeModal(false)}
          language={language}
          friends={friends}
          selectedFriendForTrade={selectedTradeFriend}
          coins={coins}
          thunders={thunders}
          hammers={hammers}
          cakes={cakes}
          creams={creams}
          chocolates={chocolates}
          spaceCreams={spaceCreams}
          onExecuteTrade={handleExecuteTrade}
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
