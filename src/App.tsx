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
  // Game persistent state
  const [currentLevelId, setCurrentLevelId] = useState<number>(5); // Start on Level 5 as in user request & screenshot!
  const [unlockedLevel, setUnlockedLevel] = useState<number>(5);
  const [starsPerLevel, setStarsPerLevel] = useState<Record<number, number>>({ 1: 3, 2: 3, 3: 3, 4: 2 });
  const [coins, setCoins] = useState<number>(45);
  const [drops, setDrops] = useState<number>(3);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [selectedSkin, setSelectedSkin] = useState<ThemeSkin>('jelly');
  const [unlockedSkins, setUnlockedSkins] = useState<ThemeSkin[]>(['jelly']);

  // Modals state
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const [showLevelSelectModal, setShowLevelSelectModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showShopModal, setShowShopModal] = useState<boolean>(false);

  // Active Level State
  const [activeLevel, setActiveLevel] = useState<Level>(() => getLevel(5));
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [escapedCount, setEscapedCount] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentLevelId) setCurrentLevelId(parsed.currentLevelId);
        if (parsed.unlockedLevel) setUnlockedLevel(parsed.unlockedLevel);
        if (parsed.starsPerLevel) setStarsPerLevel(parsed.starsPerLevel);
        if (typeof parsed.coins === 'number') setCoins(parsed.coins);
        if (typeof parsed.soundEnabled === 'boolean') {
          setSoundEnabled(parsed.soundEnabled);
          soundManager.setEnabled(parsed.soundEnabled);
        }
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.selectedSkin) setSelectedSkin(parsed.selectedSkin);
        if (parsed.unlockedSkins) setUnlockedSkins(parsed.unlockedSkins);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

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
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }, [currentLevelId, unlockedLevel, starsPerLevel, coins, soundEnabled, language, selectedSkin, unlockedSkins]);

  // Load level data whenever currentLevelId changes
  useEffect(() => {
    const lvl = getLevel(currentLevelId);
    setActiveLevel(lvl);
    setArrows(lvl.arrows.map((a) => ({ ...a, isEscaped: false })));
    setDrops(lvl.maxDrops || 3);
    setEscapedCount(0);
    setShowVictoryModal(false);
  }, [currentLevelId]);

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
    const total = activeLevel.arrows.length;
    // Calculate 1 to 3 stars based on drops remaining
    const starsEarned = drops === 3 ? 3 : drops === 2 ? 2 : 1;
    const coinsReward = starsEarned * 10;

    setStarsPerLevel((prev) => ({
      ...prev,
      [currentLevelId]: Math.max(prev[currentLevelId] || 0, starsEarned),
    }));

    setCoins((prev) => prev + coinsReward);

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
      className="min-h-screen bg-[#FBFBFB] text-slate-800 font-sans flex flex-col justify-between selection:bg-sky-200 overflow-x-hidden antialiased"
    >
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
        <ArrowMazeBoard
          arrows={arrows}
          gridCols={activeLevel.gridSize.cols}
          gridRows={activeLevel.gridSize.rows}
          onArrowEscaped={handleArrowEscaped}
          onArrowBlocked={handleArrowBlocked}
          selectedSkin={selectedSkin}
          isCompleted={escapedCount === totalArrowsCount}
        />
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
          coinsEarned={(starsPerLevel[currentLevelId] || 3) * 10}
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
          selectedSkin={selectedSkin}
          unlockedSkins={unlockedSkins}
          language={language}
          onSelectSkin={(skin) => setSelectedSkin(skin)}
          onUnlockSkin={(skin, cost) => {
            setCoins((prev) => prev - cost);
            setUnlockedSkins((prev) => [...prev, skin]);
            setSelectedSkin(skin);
          }}
          onClose={() => setShowShopModal(false)}
        />
      )}
    </div>
  );
}
