import React from 'react';
import { Settings, Palette, Sparkles, RotateCcw, Grid, Lightbulb } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface TopBarProps {
  levelNumber: number;
  difficultyAr: string;
  difficultyEn: string;
  progressPercent: number; // 0 to 100
  drops: number; // 0 to 3
  maxDrops: number;
  language: 'ar' | 'en';
  soundEnabled: boolean;
  gameMode?: 'main' | 'galaxy' | 'long';
  onOpenSettings: () => void;
  onOpenLevelSelect: () => void;
  onOpenEventLevels: () => void;
  isEventUnlocked?: boolean;
  onOpenShop: () => void;
  onOpenLanding?: () => void;
  onOpenTips?: () => void;
  onToggleSound: () => void;
  onRestartLevel: () => void;
  coins: number;
}

// Convert numbers to Arabic numerals if Arabic mode is on
export function toArabicDigits(num: number | string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/\d/g, (digit) => arabicDigits[parseInt(digit, 10)]);
}

export const TopBar: React.FC<TopBarProps> = ({
  levelNumber,
  difficultyAr,
  difficultyEn,
  progressPercent,
  drops,
  maxDrops,
  language,
  gameMode = 'main',
  onOpenSettings,
  onOpenLevelSelect,
  onOpenEventLevels,
  isEventUnlocked = false,
  onOpenShop,
  onOpenLanding,
  onOpenTips,
  onToggleSound,
  onRestartLevel,
  coins,
}) => {
  const isAr = language === 'ar';
  const modePrefix =
    gameMode === 'galaxy'
      ? isAr
        ? 'المجرة '
        : 'Galaxy '
      : gameMode === 'long'
      ? isAr
        ? 'مرحلة طويلة '
        : 'Long Level '
      : isAr
      ? 'المستوى '
      : 'Level ';
  const levelText = `${modePrefix}${toArabicDigits(levelNumber)}`;
  const percentText = isAr ? `${toArabicDigits(Math.round(progressPercent))}%` : `${Math.round(progressPercent)}%`;

  return (
    <header className="w-full max-w-2xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4 pb-1.5 flex flex-col items-center select-none">
      {/* Top Header Row: Coins/Hammers Stat Pill + Centered Level Title + Quick Action Icons */}
      <div className="w-full grid grid-cols-3 items-center mb-2.5 sm:mb-3">
        {/* Left Side: Level Select Grid button & Event Levels button & Floating Stat Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2 justify-start">
          <button
            id="btn-level-select"
            onClick={() => {
              soundManager.playClick();
              onOpenLevelSelect();
            }}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-white/90 border border-slate-200/80 shadow-sm flex items-center justify-center text-sky-500 hover:scale-105 active:scale-95 transition-all cursor-pointer hover:shadow-sky-100 shrink-0"
            title={isAr ? 'قائمة المستويات الرئيسية' : 'Main Levels List'}
          >
            <Grid className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          <button
            id="btn-event-levels"
            onClick={() => {
              soundManager.playClick();
              onOpenEventLevels();
            }}
            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl border flex items-center justify-center relative shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 ${
              isEventUnlocked
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white border-purple-300/80 shadow-purple-900/30'
                : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 border-amber-300 shadow-amber-900/40 animate-pulse'
            }`}
            title={
              isAr
                ? isEventUnlocked
                  ? 'مراحل الأحداث الفضائية (🚀)'
                  : 'مراحل الأحداث الفضائية (فتح بـ 200 نقطة 🪙)'
                : 'Event Levels (200 pts)'
            }
          >
            <span className="text-base sm:text-lg">🚀</span>
            {!isEventUnlocked && (
              <span className="absolute -top-1 -right-1 text-[8px] sm:text-[9px] bg-slate-950 text-amber-300 font-black px-1 py-0.2 rounded-full border border-amber-400/80 shadow-xs">
                200
              </span>
            )}
          </button>

          {/* Coins Pill Badge */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenShop();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white font-black text-xs shadow-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer border border-amber-300/40"
            title={isAr ? 'متجر النقاط والمساعدات' : 'Coins & Tools Shop'}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200 fill-amber-100 animate-pulse" />
            <span>{isAr ? toArabicDigits(coins) : coins}</span>
          </button>
        </div>

        {/* Center: Level Title & Subtitle Badge */}
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-sky-500 drop-shadow-[0_2px_8px_rgba(56,189,248,0.3)] tracking-tight">
            {levelText}
          </h1>
          <span className={`text-xs sm:text-sm font-black tracking-wider px-2.5 py-0.5 rounded-full border -mt-0.5 shadow-2xs ${
            difficultyAr === 'صعب جداً جداً'
              ? 'bg-gradient-to-r from-purple-900 via-rose-900 to-red-900 text-amber-300 border-purple-500 animate-pulse'
              : 'text-rose-500 bg-rose-50 border-rose-100'
          }`}>
            {isAr ? difficultyAr : difficultyEn}
          </span>
        </div>

        {/* Right Side: Palette + Settings gear */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
          {/* Mobile Coins Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenShop();
            }}
            className="sm:hidden flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-500 text-white font-black text-[11px] shadow-xs cursor-pointer border border-amber-300/40"
          >
            <Sparkles className="w-3 h-3 text-amber-200 fill-amber-100" />
            <span>{isAr ? toArabicDigits(coins) : coins}</span>
          </button>

          {/* Palette Button with Shop badge */}
          <button
            id="btn-shop"
            onClick={() => {
              soundManager.playClick();
              onOpenShop();
            }}
            className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-50 to-orange-50 border-2 border-amber-200 shadow-sm flex items-center justify-center text-amber-700 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isAr ? 'المتجر' : 'Shop'}
          >
            <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-300" />
            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white shadow-2xs">
              ★
            </span>
          </button>

          {/* Tips Button (زر نصائح) */}
          {onOpenTips && (
            <button
              id="btn-tips"
              onClick={() => {
                soundManager.playClick();
                onOpenTips();
              }}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 border-2 border-amber-300 shadow-sm flex items-center justify-center text-slate-950 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 relative"
              title={isAr ? 'نصائح اللعبة وشراء الخلفيات 💡' : 'Game Tips & Background Perks 💡'}
            >
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 fill-amber-100" />
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full border border-white shadow-2xs animate-pulse">
                {isAr ? 'نصائح' : 'Tips'}
              </span>
            </button>
          )}

          {/* Settings Button */}
          <button
            id="btn-settings"
            onClick={() => {
              soundManager.playClick();
              onOpenSettings();
            }}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-purple-50 border-2 border-purple-200 shadow-sm flex items-center justify-center text-purple-600 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isAr ? 'الإعدادات' : 'Settings'}
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
          </button>

          {/* Landing / Info Page Button (زر صفحة الهبوط والتعريف) */}
          {onOpenLanding && (
            <button
              id="btn-landing"
              onClick={() => {
                soundManager.playClick();
                onOpenLanding();
              }}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 border-2 border-sky-300 shadow-sm flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
              title={isAr ? 'صفحة الهبوط والدليل الشامل 🚀' : 'Landing & Feature Guide 🚀'}
            >
              <span className="text-base sm:text-lg">🎯</span>
            </button>
          )}
        </div>
      </div>

      {/* Second Row: Drops (Water drops) & Rainbow Star Progress Bar */}
      <div className="w-full flex items-center justify-between gap-2.5 sm:gap-4 max-w-lg px-1 sm:px-2">
        {/* Survival Star Icons (نجوم البقاء) */}
        <div className="flex items-center gap-1 sm:gap-2" title={isAr ? 'نجوم البقاء (الفرص المتبقية)' : 'Survival Stars (Lives remaining)'}>
          {maxDrops === 1 && (
            <span className="text-[10px] sm:text-xs font-black bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white px-2.5 py-0.5 rounded-full shadow-xs animate-pulse tracking-wide flex items-center gap-1">
              <span>⭐</span>
              <span>{isAr ? 'نجمة بقاء واحدة ⚡' : '1 Survival Star ⚡'}</span>
            </span>
          )}
          {Array.from({ length: maxDrops }).map((_, idx) => {
            const isActive = idx < drops;
            return (
              <div
                key={idx}
                className={`transition-all duration-300 transform ${
                  isActive
                    ? 'scale-100 drop-shadow-[0_4px_12px_rgba(251,191,36,0.6)]'
                    : 'scale-95 opacity-35 grayscale'
                }`}
              >
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 2L19.8 10.2L28.8 11.2L22.1 17.2L23.9 26.1L16 21.6L8.1 26.1L9.9 17.2L3.2 11.2L12.2 10.2L16 2Z"
                    fill={isActive ? 'url(#survivalStarGrad)' : '#CBD5E1'}
                    stroke={isActive ? '#D97706' : '#94A3B8'}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  {/* Highlight sheen on star */}
                  <path
                    d="M16 5.5L18.5 11L24 11.7L19.8 15.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity={isActive ? '0.9' : '0.4'}
                  />
                  <defs>
                    <linearGradient
                      id="survivalStarGrad"
                      x1="3"
                      y1="2"
                      x2="28"
                      y2="26"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#FDE047" />
                      <stop offset="0.5" stopColor="#F59E0B" />
                      <stop offset="1" stopColor="#D97706" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            );
          })}
        </div>

        {/* Rainbow Progress Bar Container with Star Handle */}
        <div className="flex-1 flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1 h-6 sm:h-7 bg-slate-200/70 rounded-full p-1 shadow-inner overflow-hidden border border-slate-300/40">
            {/* Rainbow Diagonal Stripe Fill */}
            <div
              className="h-full rounded-full transition-all duration-500 ease-out relative"
              style={{
                width: `${Math.max(progressPercent, 12)}%`,
                background: `linear-gradient(90deg, #F43F5E 0%, #FB923C 25%, #FBBF24 50%, #4ADE80 75%, #38BDF8 100%)`,
              }}
            >
              {/* Star Badge on progress tip */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border-2 border-amber-300 flex items-center justify-center text-xs sm:text-sm transform hover:scale-110 transition-transform">
                ⭐
              </div>
            </div>
          </div>

          <span className="text-sm sm:text-base font-black text-slate-600 min-w-[36px] sm:min-w-[44px] text-end">
            {percentText}
          </span>
        </div>
      </div>
    </header>
  );
};
