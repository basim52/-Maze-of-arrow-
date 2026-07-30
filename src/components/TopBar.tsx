import React from 'react';
import { Settings, Palette, Sparkles, RotateCcw, Grid } from 'lucide-react';
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
  onOpenSettings: () => void;
  onOpenLevelSelect: () => void;
  onOpenShop: () => void;
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
  onOpenSettings,
  onOpenLevelSelect,
  onOpenShop,
  onToggleSound,
  onRestartLevel,
  coins,
}) => {
  const isAr = language === 'ar';
  const levelText = isAr ? `المستوى ${toArabicDigits(levelNumber)}` : `Level ${levelNumber}`;
  const percentText = isAr ? `${toArabicDigits(Math.round(progressPercent))}%` : `${Math.round(progressPercent)}%`;

  return (
    <header className="w-full max-w-2xl mx-auto px-4 pt-5 pb-2 flex flex-col items-center select-none">
      {/* Top Header Row: Centered Level Title & Top Right Icons */}
      <div className="w-full grid grid-cols-3 items-center mb-4">
        {/* Left Side: Level Select / Restart (Or empty to preserve balance) */}
        <div className="flex items-center gap-2 justify-start">
          <button
            id="btn-level-select"
            onClick={() => {
              soundManager.playClick();
              onOpenLevelSelect();
            }}
            className="w-10 h-10 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs flex items-center justify-center text-sky-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isAr ? 'قائمة المستويات' : 'Levels List'}
          >
            <Grid className="w-5 h-5" />
          </button>
        </div>

        {/* Center: Title & Subtitle exact match to screenshot */}
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-black text-sky-400 drop-shadow-[0_2px_4px_rgba(56,189,248,0.25)] tracking-wide">
            {levelText}
          </h1>
          <span className="text-lg font-black text-rose-500 tracking-wider -mt-0.5">
            {isAr ? difficultyAr : difficultyEn}
          </span>
        </div>

        {/* Right Side: Palette + 'A' icon & Settings gear (matching screenshot!) */}
        <div className="flex items-center justify-end gap-2.5">
          {/* Palette Button with 'A' badge */}
          <button
            id="btn-shop"
            onClick={() => {
              soundManager.playClick();
              onOpenShop();
            }}
            className="relative w-11 h-11 rounded-2xl bg-amber-50 border-2 border-amber-200 shadow-xs flex items-center justify-center text-amber-700 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isAr ? 'متجر الألوان' : 'Color Shop'}
          >
            <Palette className="w-6 h-6 text-amber-500 fill-amber-300" />
            <span className="absolute -bottom-1 -right-1 bg-sky-500 text-white text-[10px] font-black px-1 rounded-full border border-white">
              A
            </span>
          </button>

          {/* Settings Button */}
          <button
            id="btn-settings"
            onClick={() => {
              soundManager.playClick();
              onOpenSettings();
            }}
            className="w-11 h-11 rounded-2xl bg-purple-50 border-2 border-purple-200 shadow-xs flex items-center justify-center text-purple-600 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isAr ? 'الإعدادات' : 'Settings'}
          >
            <Settings className="w-6 h-6 text-purple-400" />
          </button>
        </div>
      </div>

      {/* Second Row: Drops (Water drops) & Rainbow Star Progress Bar */}
      <div className="w-full flex items-center justify-between gap-4 max-w-lg px-2">
        {/* Water Drop Icons (2 Filled Cyan drops + 1 Translucent Gray drop matching screenshot) */}
        <div className="flex items-center gap-2">
          {Array.from({ length: maxDrops }).map((_, idx) => {
            const isActive = idx < drops;
            return (
              <div
                key={idx}
                className={`transition-all duration-300 transform ${
                  isActive
                    ? 'scale-100 drop-shadow-[0_4px_10px_rgba(56,189,248,0.45)]'
                    : 'scale-95 opacity-40 grayscale'
                }`}
              >
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 3C16 3 6 15 6 21C6 26.5228 10.4772 31 16 31C21.5228 31 26 26.5228 26 21C26 15 16 3 16 3Z"
                    fill={isActive ? 'url(#waterDropGrad)' : '#CBD5E1'}
                    stroke={isActive ? '#0284C7' : '#94A3B8'}
                    strokeWidth="1.5"
                  />
                  {/* Highlight sheen on drop */}
                  <path
                    d="M12 16C10.5 18 10 20.5 10.5 23"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity={isActive ? '0.85' : '0.4'}
                  />
                  <defs>
                    <linearGradient
                      id="waterDropGrad"
                      x1="6"
                      y1="3"
                      x2="26"
                      y2="31"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#38BDF8" />
                      <stop offset="1" stopColor="#0284C7" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            );
          })}
        </div>

        {/* Rainbow Progress Bar Container with Star Handle */}
        <div className="flex-1 flex items-center gap-3">
          <div className="relative flex-1 h-7 bg-slate-200/70 rounded-full p-1 shadow-inner overflow-hidden border border-slate-300/40">
            {/* Rainbow Diagonal Stripe Fill */}
            <div
              className="h-full rounded-full transition-all duration-500 ease-out relative"
              style={{
                width: `${Math.max(progressPercent, 12)}%`,
                background: `linear-gradient(90deg, #F43F5E 0%, #FB923C 25%, #FBBF24 50%, #4ADE80 75%, #38BDF8 100%)`,
              }}
            >
              {/* Star Badge on progress tip */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-md border-2 border-amber-300 flex items-center justify-center text-sm transform hover:scale-110 transition-transform">
                ⭐
              </div>
            </div>
          </div>

          <span className="text-base font-black text-slate-600 min-w-[44px] text-end">
            {percentText}
          </span>
        </div>
      </div>
    </header>
  );
};
