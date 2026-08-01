import React from 'react';
import { Sparkles, Play, ShieldAlert, Award, Zap, HelpCircle, Palette, Grid, X, CheckCircle2, ChevronRight } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { ThemeSkin, ArrowSkin } from '../types';

interface LandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPlay: () => void;
  onOpenShop: () => void;
  onOpenLevelSelect: () => void;
  language: 'ar' | 'en';
  coins: number;
}

export const LandingModal: React.FC<LandingModalProps> = ({
  isOpen,
  onClose,
  onStartPlay,
  onOpenShop,
  onOpenLevelSelect,
  language,
  coins,
}) => {
  if (!isOpen) return null;

  const isAr = language === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl my-auto bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-sky-500/40 rounded-3xl shadow-2xl text-white overflow-hidden flex flex-col max-h-[90vh]"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-400 via-indigo-500 via-purple-500 to-amber-400" />
        
        {/* Background glow effects */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-xl shadow-md border border-sky-300/40">
              🎯
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-sky-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                {isAr ? 'هروب الأسهم الذهبية' : 'Arrow Escape Golden'}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {isAr ? 'صفحة الهبوط الرسمية والدليل الشامل' : 'Official Landing & Complete Feature Guide'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all border border-slate-700 cursor-pointer hover:scale-105 active:scale-95"
            title={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 custom-scrollbar text-slate-200 text-sm">
          
          {/* Hero Section */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-950/90 via-purple-950/80 to-slate-900 border border-indigo-500/30 shadow-xl overflow-hidden text-center sm:text-start flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-lg z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                {isAr ? 'لعبة الألغاز الذهبية رقم 1 🏆' : 'No. 1 Golden Puzzle Game 🏆'}
              </span>

              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {isAr ? 'تحدَّ ذكاءك وافتح طريق الأسهم نحو الحرية! 🏹' : 'Challenge Your Mind & Clear the Arrow Maze! 🏹'}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isAr
                  ? 'متاهات ذكية ومراحل متدرجة الصعوبة مع مواجهات وحوش المتاهة، أدوات مساعدة أسطورية، ومظاهر نيون وفضاء ساحرة!'
                  : 'Smart mazes, progressive challenges, boss monster battles, legendary powerups, and glowing cosmic themes!'}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onStartPlay();
                  }}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 font-black text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-emerald-950/50 hover:scale-105 active:scale-95 cursor-pointer transition-all border border-emerald-300"
                >
                  <Play className="w-5 h-5 fill-slate-950" />
                  <span>{isAr ? 'ابدأ اللعب الآن 🚀' : 'Start Playing Now 🚀'}</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    onOpenLevelSelect();
                  }}
                  className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 cursor-pointer transition-all border border-slate-700"
                >
                  <Grid className="w-4 h-4 text-sky-400" />
                  <span>{isAr ? 'اختر المستوى 🎯' : 'Select Level 🎯'}</span>
                </button>
              </div>
            </div>

            {/* Visual Hero Badge */}
            <div className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-3xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-500 p-1 shadow-2xl animate-bounce-slow">
              <div className="w-full h-full bg-slate-950/80 backdrop-blur-md rounded-[22px] flex flex-col items-center justify-center text-center p-3 border border-white/20">
                <span className="text-4xl sm:text-5xl mb-1">🏹</span>
                <span className="text-xs font-black text-amber-300">
                  {isAr ? 'مستويات غير محدودة' : 'Unlimited Levels'}
                </span>
              </div>
            </div>
          </div>

          {/* Special Feature Highlight: Rainstorm Background (خلفية المطر والعواصف) */}
          <div className="relative rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-slate-950 via-sky-950 to-blue-950 border-2 border-sky-400/60 shadow-xl overflow-hidden">
            {/* Animated raindrops effect in background card */}
            <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/40 text-xs font-black flex items-center gap-1">
                    <span>⛈️</span>
                    <span>{isAr ? 'خلفية المطر والعواصف المميزة' : 'Featured Rainstorm Theme'}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black animate-pulse">
                    {isAr ? 'ميزة حصرية! ⚡' : 'Exclusive Feature! ⚡'}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <span>{isAr ? 'خلفية المطر العاصفة 🌧️⚡' : 'Rainstorm Theme 🌧️⚡'}</span>
                </h3>

                <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed font-medium">
                  {isAr
                    ? 'عند اختيار خلفية المطر والعواصف، ستحصل على احتمال 27% للحصول على من 3 إلى 6 عملات ذهبية إضافية مجاناً مع كل سهم يهرب بنجاح من المتاهة!'
                    : 'When activating the Rainstorm Theme, you get a 27% chance to drop 3 to 6 bonus gold coins for every arrow that successfully escapes the maze!'}
                </p>

                <div className="pt-1 flex items-center gap-3 text-xs font-bold text-amber-300">
                  <div className="flex items-center gap-1 bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-400/40">
                    <span>🪙</span>
                    <span>{isAr ? 'احتمالية الجائزة: 27%' : 'Bonus Chance: 27%'}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-sky-950/60 px-3 py-1.5 rounded-xl border border-sky-400/40 text-sky-200">
                    <span>⚡</span>
                    <span>{isAr ? 'المكافأة: +3 إلى +6 عملات' : 'Reward: +3 to +6 Coins'}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 w-full sm:w-auto flex justify-center">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onOpenShop();
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-950 hover:scale-105 active:scale-95 cursor-pointer transition-all border border-sky-300/40"
                >
                  <Palette className="w-4 h-4" />
                  <span>{isAr ? 'احصل عليها من المتجر 🛍️' : 'Get from Shop 🛍️'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Game Features Grid */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-300" />
              <span>{isAr ? 'أبرز المميزات والأدوات في اللعبة' : 'Game Features & Powerups'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Feature 1: Arrow Skins */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-start gap-3 hover:border-sky-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center justify-center text-xl shrink-0">
                  🦅
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {isAr ? 'أسهم أسطورية متنوعة' : 'Legendary Arrow Skins'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {isAr
                      ? 'مثل سهم العنقاء الذهبية 🦅، مجرة الفضاء 🌌، التنين 🐉، والقصص الأسطورية!'
                      : 'Like Golden Phoenix 🦅, Cosmic Galaxy 🌌, Dragon 🐉, and more!'}
                  </p>
                </div>
              </div>

              {/* Feature 2: Exchange Space Coins */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-start gap-3 hover:border-amber-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center text-xl shrink-0">
                  🚀
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {isAr ? 'استبدال عملات الفضاء' : 'Space Coins Exchange'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {isAr
                      ? 'استبدل 23 نقطة عادية مقابل 1 عملة فضاء 🚀 لفتح مراحل الأحداث الفضائية والقدرات الفائقة!'
                      : 'Exchange 23 regular coins for 1 Space Coin 🚀 to unlock cosmic events & powerups!'}
                  </p>
                </div>
              </div>

              {/* Feature 3: Powerup Boosters */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-start gap-3 hover:border-emerald-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center text-xl shrink-0">
                  🔨
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {isAr ? 'أدوات مساعدة ذكية' : 'Smart Powerup Tools'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {isAr
                      ? 'استخدم المطرقة 🔨 للتكسير، الصاعقة ⚡ للتفجير، الكريمة 🍦 للشل، والشوكولاتة 🍫 للمساعدة.'
                      : 'Use Hammer 🔨 to break, Lightning ⚡ to clear, Cream 🍦 to freeze, and Chocolate 🍫 for aid.'}
                  </p>
                </div>
              </div>

              {/* Feature 4: Boss Monster Levels */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-start gap-3 hover:border-rose-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center justify-center text-xl shrink-0">
                  👾
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {isAr ? 'مواجهات وحوش المتاهة' : 'Maze Boss Battles'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {isAr
                      ? 'مراحل خاصة تحتوي على وحوش المتاهة العنيفة تحدى مهارتك وسرعتك!'
                      : 'Special boss stages containing ferocious maze monsters to test your skill!'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick How-to-play instructions */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 space-y-2">
            <h4 className="font-black text-indigo-200 text-xs sm:text-sm flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <span>{isAr ? 'طريقة اللعب البسيطة:' : 'How to Play:'}</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{isAr ? 'انقر على أي سهم لتحريكه في اتجاه رأس السهم.' : 'Click any arrow to move it in the direction it points.'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{isAr ? 'تأكد من عدم وجود أسهم أو حواجز تعترض طريق السهم قبل النقر عليه.' : 'Make sure no other arrows or walls block its exit path.'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{isAr ? 'افتح جميع المظاهر والأدوات المساعدة من المتجر لتستمتع بالتحديات!' : 'Unlock all skins and powerup tools in the shop to enjoy every challenge!'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom CTA Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>🪙 {isAr ? 'عملاتك الحالية:' : 'Current Coins:'}</span>
            <span className="text-amber-300 font-black">{coins}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenShop();
              }}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-400/30 cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <Palette className="w-4 h-4" />
              <span>{isAr ? 'المتجر' : 'Shop'}</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onStartPlay();
              }}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-white font-black text-xs sm:text-sm shadow-md shadow-sky-950 hover:scale-105 active:scale-95 cursor-pointer transition-all border border-sky-300/40 flex items-center justify-center gap-2"
            >
              <span>{isAr ? 'ابدأ اللعب 🚀' : 'Start Game 🚀'}</span>
              <ChevronRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
