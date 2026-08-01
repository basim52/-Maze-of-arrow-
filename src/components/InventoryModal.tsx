import React, { useState } from 'react';
import { X, Package, Sparkles, ShoppingBag, Check, Rocket, ArrowRight, ArrowLeft } from 'lucide-react';
import { ThemeSkin } from '../types';
import { soundManager } from '../utils/sound';

interface InventoryModalProps {
  coins: number;
  spaceCoins: number;
  tomatoes: number;
  spaceCreams: number;
  hammers: number;
  thunders: number;
  creams: number;
  chocolates: number;
  selectedSkin: ThemeSkin;
  unlockedSkins: ThemeSkin[];
  language: 'ar' | 'en';
  onUseCream: () => void;
  onUseChocolate: () => void;
  onUseThunder: () => void;
  onUseTomato: () => void;
  onUseSpaceCream: () => void;
  onToggleHammer: () => void;
  onSelectSkin: (skin: ThemeSkin) => void;
  onOpenShop: () => void;
  onClose: () => void;
}

interface SkinInfo {
  id: ThemeSkin;
  nameAr: string;
  nameEn: string;
  icon: string;
  gradient: string;
}

const SKINS_INFO: SkinInfo[] = [
  {
    id: 'jelly',
    nameAr: 'جل جيلي مبهج',
    nameEn: 'Cheerful Jelly',
    icon: '🍬',
    gradient: 'from-cyan-400 to-sky-500',
  },
  {
    id: 'candy',
    nameAr: 'حلوى قوس قزح',
    nameEn: 'Rainbow Candy',
    icon: '🍭',
    gradient: 'from-pink-400 via-purple-400 to-indigo-500',
  },
  {
    id: 'neon',
    nameAr: 'نيون سايبر',
    nameEn: 'Cyber Neon',
    icon: '⚡',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
  },
  {
    id: 'cyber',
    nameAr: 'ذهبي ملكي',
    nameEn: 'Royal Gold',
    icon: '👑',
    gradient: 'from-amber-300 via-yellow-400 to-amber-600',
  },
  {
    id: 'nebula',
    nameAr: 'سديم الفضاء الكوني 🌌',
    nameEn: 'Cosmic Space Nebula 🌌',
    icon: '🌌',
    gradient: 'from-purple-600 via-indigo-600 to-pink-500',
  },
  {
    id: 'supernova',
    nameAr: 'السوبرنوفا الفضائي 💥🌌',
    nameEn: 'Supernova Black Hole 💥🌌',
    icon: '💥',
    gradient: 'from-amber-500 via-rose-600 to-purple-900',
  },
];

export const InventoryModal: React.FC<InventoryModalProps> = ({
  coins,
  spaceCoins,
  tomatoes,
  spaceCreams,
  hammers,
  thunders,
  creams,
  chocolates,
  selectedSkin,
  unlockedSkins,
  language,
  onUseCream,
  onUseChocolate,
  onUseThunder,
  onUseTomato,
  onUseSpaceCream,
  onToggleHammer,
  onSelectSkin,
  onOpenShop,
  onClose,
}) => {
  const isAr = language === 'ar';
  const [viewMode, setViewMode] = useState<'main' | 'event'>('main');
  const totalStandardTools = creams + chocolates + thunders + hammers;
  const totalEventTools = tomatoes + spaceCreams;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-slate-100 flex flex-col relative animate-scale-up max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-200 text-xl">
              🎒
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-800">
                {isAr ? 'حقيبة الممتلكات والأدوات' : 'My Inventory & Tools'}
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                {isAr ? 'عرض أدواتك واستخدامها مباشرة في اللعبة' : 'View and use your owned items'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Coins Status Bar */}
        <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-purple-50 border border-amber-200/80 rounded-2xl p-3 mb-3 flex items-center justify-between px-4 gap-2">
          <div className="flex items-center gap-1.5 text-amber-900 font-black text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>{isAr ? 'النقود:' : 'Coins:'}</span>
            <span className="text-amber-600 font-black text-sm">{coins} 🪙</span>
          </div>
          <div className="flex items-center gap-1 text-purple-900 font-black text-xs sm:text-sm bg-purple-100/80 px-2.5 py-1 rounded-full border border-purple-200">
            <span>🚀</span>
            <span>{spaceCoins}</span>
            <span className="text-[10px] text-purple-700">{isAr ? 'فضاء' : 'Space'}</span>
          </div>
        </div>

        {/* Tab Navigation Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl mb-4">
          <button
            onClick={() => {
              soundManager.playClick();
              setViewMode('main');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              viewMode === 'main'
                ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>🎒</span>
            <span>{isAr ? 'الحقيبة الرئيسية' : 'Main Bag'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setViewMode('event');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              viewMode === 'event'
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white shadow-md'
                : 'text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <span>🚀</span>
            <span>{isAr ? 'حقيبة منتجات الأحداث' : 'Event Products Bag'}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                viewMode === 'event' ? 'bg-white/20 text-white' : 'bg-purple-200 text-purple-900'
              }`}
            >
              {totalEventTools}
            </span>
          </button>
        </div>

        {/* Content View Modes */}
        {viewMode === 'event' ? (
          /* EVENT PRODUCTS BAG VIEW (حقيبة منتجات الأحداث) */
          <div className="flex flex-col gap-3 animate-fade-in mb-3">
            {/* Event Bag Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-900 border-2 border-purple-500/60 text-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-2xl shadow-inner border border-purple-300/50 shrink-0">
                  🚀
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-amber-300">
                    {isAr ? 'حقيبة منتجات الأحداث الفضائية 🌌' : 'Cosmic Event Products Bag 🌌'}
                  </h3>
                  <p className="text-[11px] text-purple-200/80 font-medium leading-tight">
                    {isAr
                      ? 'الأدوات والقوى الكونية الخاصة بالفعاليات الفضائية والمجرة'
                      : 'Special event power-ups & tools acquired from galaxy events'}
                  </p>
                </div>
              </div>
            </div>

            {/* Cosmic Space Cream Item */}
            <div className="p-3.5 rounded-2xl border-2 border-purple-300 bg-gradient-to-r from-purple-50 via-indigo-50/70 to-pink-50/60 flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="text-3xl bg-white p-2 rounded-2xl shadow-xs border border-purple-200">
                  🍦
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-purple-950 flex items-center gap-1">
                      {isAr ? 'الكريمة الفضائية' : 'Cosmic Space Cream'}
                      <span className="bg-purple-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black">
                        🌌
                      </span>
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-800 font-medium mt-0.5">
                    {isAr ? 'تزيل 7 أسهم دفعة واحدة من اللوحة' : 'Removes 7 arrows at once'}
                  </p>
                  <span className="inline-block mt-1 bg-purple-200 text-purple-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-purple-300">
                    {isAr ? `الممتلكات: ${spaceCreams}` : `Owned: ${spaceCreams}`}
                  </span>
                </div>
              </div>

              {spaceCreams > 0 ? (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onUseSpaceCream();
                    onClose();
                  }}
                  className="px-3.5 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-black text-xs rounded-xl shadow-md shadow-purple-200 hover:scale-105 active:scale-95 cursor-pointer transition-all shrink-0"
                >
                  {isAr ? 'استخدم الآن' : 'Use Now'}
                </button>
              ) : (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onOpenShop();
                  }}
                  className="px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs rounded-xl border border-purple-300 cursor-pointer shrink-0"
                >
                  {isAr ? 'متجر الفضاء' : 'Galaxy Shop'}
                </button>
              )}
            </div>

            {/* Space Tomato Item */}
            <div className="p-3.5 rounded-2xl border-2 border-rose-300 bg-gradient-to-r from-rose-50 via-purple-50/60 to-amber-50/50 flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="text-3xl bg-white p-2 rounded-2xl shadow-xs border border-rose-200">
                  🍅
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-rose-950 flex items-center gap-1">
                      {isAr ? 'الطماطة الفضائية' : 'Space Tomato'}
                      <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black">
                        🌌
                      </span>
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-800 font-medium mt-0.5">
                    {isAr ? 'تحذف 6 أسهم دفعة واحدة من اللوحة' : 'Deletes 6 arrows at once'}
                  </p>
                  <span className="inline-block mt-1 bg-rose-200 text-rose-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-rose-300">
                    {isAr ? `الممتلكات: ${tomatoes}` : `Owned: ${tomatoes}`}
                  </span>
                </div>
              </div>

              {tomatoes > 0 ? (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onUseTomato();
                    onClose();
                  }}
                  className="px-3.5 py-2.5 bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-xs rounded-xl shadow-md shadow-rose-200 hover:scale-105 active:scale-95 cursor-pointer transition-all shrink-0"
                >
                  {isAr ? 'استخدم الآن' : 'Use Now'}
                </button>
              ) : (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onOpenShop();
                  }}
                  className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-xs rounded-xl border border-rose-300 cursor-pointer shrink-0"
                >
                  {isAr ? 'متجر الفضاء' : 'Galaxy Shop'}
                </button>
              )}
            </div>

            {/* Back to Main Bag Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                setViewMode('main');
              }}
              className="w-full mt-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-200"
            >
              {isAr ? (
                <>
                  <ArrowRight className="w-4 h-4" />
                  <span>العودة للحقيبة الرئيسية</span>
                </>
              ) : (
                <>
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Main Bag</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* MAIN BAG VIEW */
          <>
            {/* Featured Event Products Bag Button inside Main Bag */}
            <button
              onClick={() => {
                soundManager.playClick();
                setViewMode('event');
              }}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white border-2 border-purple-400/80 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-between mb-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl bg-purple-800/80 p-2 rounded-xl border border-purple-300/40 shrink-0">
                  🚀
                </span>
                <div className="text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm text-amber-300">
                      {isAr ? 'حقيبة منتجات الأحداث' : 'Event Products Bag'}
                    </span>
                    <span className="bg-purple-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black">
                      {isAr ? 'خاصة' : 'Special'}
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-200/80 font-medium">
                    {isAr
                      ? 'الكريمة الفضائية والطماطة الفضائية'
                      : 'Space Cream & Space Tomato'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1.5 rounded-xl border border-purple-300/40 text-xs font-black text-white shrink-0">
                <span>{isAr ? 'فتح' : 'Open'}</span>
                <span>({totalEventTools})</span>
              </div>
            </button>

            {/* Section 1: Standard Power-up Tools */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-amber-500" />
                  <span>{isAr ? 'الأدوات الأساسية' : 'Standard Power-ups'}</span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {totalStandardTools}
                  </span>
                </h3>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onOpenShop();
                  }}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer underline"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{isAr ? 'شراء المزيد' : 'Get More'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {/* Cream Item */}
                <div className="p-3 rounded-2xl border-2 border-pink-200 bg-gradient-to-r from-pink-50/70 to-rose-50/50 flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl bg-white p-2 rounded-2xl shadow-xs border border-pink-100">
                      🍦
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-pink-950">
                          {isAr ? 'الكريمة القاضية' : 'Cream Power-up'}
                        </span>
                        <span className="bg-pink-200 text-pink-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-pink-300">
                          {creams} {isAr ? 'متوفر' : 'owned'}
                        </span>
                      </div>
                      <p className="text-[11px] text-pink-800/80 font-medium">
                        {isAr ? 'تزيل 5 أسهم عشوائية فوراً' : 'Removes 5 random arrows'}
                      </p>
                    </div>
                  </div>

                  {creams > 0 ? (
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onUseCream();
                        onClose();
                      }}
                      className="px-3.5 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-xs rounded-xl shadow-md shadow-pink-200 hover:scale-105 active:scale-95 cursor-pointer transition-all shrink-0"
                    >
                      {isAr ? 'استخدم الآن' : 'Use Now'}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onOpenShop();
                      }}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-pink-100 text-slate-500 hover:text-pink-700 font-bold text-[11px] rounded-xl border border-slate-200 cursor-pointer shrink-0"
                    >
                      {isAr ? 'شراء' : 'Buy'}
                    </button>
                  )}
                </div>

                {/* Thunder Item */}
                <div className="p-3 rounded-2xl border-2 border-sky-200 bg-gradient-to-r from-sky-50/70 to-cyan-50/50 flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl bg-white p-2 rounded-2xl shadow-xs border border-sky-100">
                      ⚡
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-sky-950">
                          {isAr ? 'ضربة الرعد' : 'Thunder Strike'}
                        </span>
                        <span className="bg-sky-200 text-sky-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-sky-300">
                          {thunders} {isAr ? 'متوفر' : 'owned'}
                        </span>
                      </div>
                      <p className="text-[11px] text-sky-800/80 font-medium">
                        {isAr ? 'تضرب 3 أسهم عشوائية' : 'Strikes 3 random arrows'}
                      </p>
                    </div>
                  </div>

                  {thunders > 0 ? (
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onUseThunder();
                        onClose();
                      }}
                      className="px-3.5 py-2 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-black text-xs rounded-xl shadow-md shadow-sky-200 hover:scale-105 active:scale-95 cursor-pointer transition-all shrink-0"
                    >
                      {isAr ? 'استخدم الآن' : 'Use Now'}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onOpenShop();
                      }}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-sky-100 text-slate-500 hover:text-sky-700 font-bold text-[11px] rounded-xl border border-slate-200 cursor-pointer shrink-0"
                    >
                      {isAr ? 'شراء' : 'Buy'}
                    </button>
                  )}
                </div>

                {/* Chocolate Item */}
                <div className="p-3 rounded-2xl border-2 border-amber-800/20 bg-gradient-to-r from-amber-100/50 to-yellow-50/50 flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl bg-white p-2 rounded-2xl shadow-xs border border-amber-200">
                      🍫
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-amber-950">
                          {isAr ? 'قطع الشوكولاتة' : 'Chocolate Block'}
                        </span>
                        <span className="bg-amber-200 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                          {chocolates} {isAr ? 'متوفر' : 'owned'}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800/80 font-medium">
                        {isAr ? 'تزيل سهمين عشوائيين' : 'Removes 2 random arrows'}
                      </p>
                    </div>
                  </div>

                  {chocolates > 0 ? (
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onUseChocolate();
                        onClose();
                      }}
                      className="px-3.5 py-2 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-black text-xs rounded-xl shadow-md shadow-amber-200 hover:scale-105 active:scale-95 cursor-pointer transition-all shrink-0"
                    >
                      {isAr ? 'استخدم الآن' : 'Use Now'}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onOpenShop();
                      }}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-500 hover:text-amber-800 font-bold text-[11px] rounded-xl border border-slate-200 cursor-pointer shrink-0"
                    >
                      {isAr ? 'شراء' : 'Buy'}
                    </button>
                  )}
                </div>

                {/* Hammer Item */}
                <div className="p-3 rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl bg-white p-2 rounded-2xl shadow-xs border border-amber-200">
                      🔨
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-amber-950">
                          {isAr ? 'المطرقة السحرية' : 'Magic Hammer'}
                        </span>
                        <span className="bg-amber-200 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                          {hammers} {isAr ? 'متوفر' : 'owned'}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800/80 font-medium">
                        {isAr ? 'تكسر أي سهم تختار نقره' : 'Smash any clicked arrow'}
                      </p>
                    </div>
                  </div>

                  {hammers > 0 ? (
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onToggleHammer();
                        onClose();
                      }}
                      className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs rounded-xl shadow-md shadow-amber-200 hover:scale-105 active:scale-95 cursor-pointer transition-all shrink-0"
                    >
                      {isAr ? 'تفعيل المطرقة' : 'Activate'}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onOpenShop();
                      }}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-500 hover:text-amber-800 font-bold text-[11px] rounded-xl border border-slate-200 cursor-pointer shrink-0"
                    >
                      {isAr ? 'شراء' : 'Buy'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Skins & Themes Owned */}
            <div>
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5 mb-2.5">
                <span>🎨</span>
                <span>{isAr ? 'المظاهر والأشكال المملوكة' : 'Owned Skins'}</span>
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {SKINS_INFO.map((skin) => {
                  const isUnlocked = unlockedSkins.includes(skin.id);
                  const isSelected = selectedSkin === skin.id;

                  return (
                    <div
                      key={skin.id}
                      className={`p-2.5 rounded-2xl border-2 flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-50/80 shadow-md ring-2 ring-amber-300/50'
                          : isUnlocked
                          ? 'border-slate-200 bg-slate-50/80'
                          : 'border-slate-100 bg-slate-50/40 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${skin.gradient} flex items-center justify-center text-white text-sm shadow-xs`}
                        >
                          {skin.icon}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block leading-tight">
                            {isAr ? skin.nameAr : skin.nameEn}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-extrabold text-amber-600 flex items-center gap-0.5">
                              <Check className="w-3 h-3" />
                              {isAr ? 'مُجهّز' : 'Active'}
                            </span>
                          )}
                        </div>
                      </div>

                      {isUnlocked ? (
                        !isSelected && (
                          <button
                            onClick={() => {
                              soundManager.playClick();
                              onSelectSkin(skin.id);
                            }}
                            className="w-full py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] rounded-xl border border-slate-200 cursor-pointer transition-all"
                          >
                            {isAr ? 'تجهز' : 'Equip'}
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => {
                            soundManager.playClick();
                            onOpenShop();
                          }}
                          className="w-full py-1 bg-amber-100 text-amber-800 font-bold text-[11px] rounded-xl border border-amber-200 cursor-pointer"
                        >
                          {isAr ? 'فتح بالمتجر' : 'Unlock in Shop'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Footer Close */}
        <div className="mt-5 pt-3 border-t border-slate-100 text-center">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-black text-xs rounded-2xl shadow-md cursor-pointer transition-all"
          >
            {isAr ? 'إغلاق الحقيبة' : 'Close Bag'}
          </button>
        </div>
      </div>
    </div>
  );
};
