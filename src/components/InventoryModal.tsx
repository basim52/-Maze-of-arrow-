import React from 'react';
import { X, Package, Sparkles, ShoppingBag, Check } from 'lucide-react';
import { ThemeSkin } from '../types';
import { soundManager } from '../utils/sound';

interface InventoryModalProps {
  coins: number;
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
];

export const InventoryModal: React.FC<InventoryModalProps> = ({
  coins,
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
  onToggleHammer,
  onSelectSkin,
  onOpenShop,
  onClose,
}) => {
  const isAr = language === 'ar';
  const totalToolsCount = creams + chocolates + thunders + hammers;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-slate-100 flex flex-col relative animate-scale-up max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
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
        <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100 border border-amber-200/80 rounded-2xl p-3 mb-4 flex items-center justify-between px-4">
          <div className="flex items-center gap-2 text-amber-900 font-black text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>{isAr ? 'رصيد النقود:' : 'Coins Balance:'}</span>
          </div>
          <div className="text-base font-black text-amber-600 flex items-center gap-1">
            <span>{coins}</span>
            <span className="text-xs">🪙</span>
          </div>
        </div>

        {/* Section 1: Power-up Tools */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-amber-500" />
              <span>{isAr ? 'الأدوات المتاحة' : 'Available Power-ups'}</span>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {totalToolsCount}
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
                    {isAr ? 'تكسر أي سهم تكتد نِقره' : 'Smash any clicked arrow'}
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
                        {isAr ? 'تجهيز' : 'Equip'}
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
