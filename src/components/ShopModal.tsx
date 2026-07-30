import React from 'react';
import { X, Sparkles, Check, Lock } from 'lucide-react';
import { ThemeSkin } from '../types';
import { soundManager } from '../utils/sound';

interface ShopModalProps {
  coins: number;
  hammers: number;
  thunders: number;
  creams: number;
  selectedSkin: ThemeSkin;
  unlockedSkins: ThemeSkin[];
  language: 'ar' | 'en';
  onSelectSkin: (skin: ThemeSkin) => void;
  onUnlockSkin: (skin: ThemeSkin, cost: number) => void;
  onBuyHammer: (cost: number) => void;
  onBuyThunder: (cost: number) => void;
  onBuyCream: (cost: number) => void;
  onClose: () => void;
}

interface SkinItem {
  id: ThemeSkin;
  nameAr: string;
  nameEn: string;
  cost: number;
  gradient: string;
  icon: string;
}

const SKINS: SkinItem[] = [
  {
    id: 'jelly',
    nameAr: 'جل جيلي مبهج',
    nameEn: 'Cheerful Jelly',
    cost: 0,
    gradient: 'from-cyan-400 to-sky-500',
    icon: '🍬',
  },
  {
    id: 'candy',
    nameAr: 'حلوى قوس قزح',
    nameEn: 'Rainbow Candy',
    cost: 30,
    gradient: 'from-pink-400 via-purple-400 to-indigo-500',
    icon: '🍭',
  },
  {
    id: 'neon',
    nameAr: 'نيون سايبر',
    nameEn: 'Cyber Neon',
    cost: 60,
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    icon: '⚡',
  },
  {
    id: 'cyber',
    nameAr: 'ذهبي ملكي',
    nameEn: 'Royal Gold',
    cost: 100,
    gradient: 'from-amber-300 via-yellow-400 to-amber-600',
    icon: '👑',
  },
];

export const ShopModal: React.FC<ShopModalProps> = ({
  coins,
  hammers,
  thunders,
  creams,
  selectedSkin,
  unlockedSkins,
  language,
  onSelectSkin,
  onUnlockSkin,
  onBuyHammer,
  onBuyThunder,
  onBuyCream,
  onClose,
}) => {
  const isAr = language === 'ar';
  const canAffordHammer = coins >= 45;
  const canAffordThunder = coins >= 95;
  const canAffordCream = coins >= 129;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-slate-100 flex flex-col relative animate-scale-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-800">
              {isAr ? 'متجر الألعاب' : 'Game Shop'}
            </h2>
            <div className="flex items-center gap-1 text-xs font-black bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              {coins}
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tools & Power-Ups Section */}
        <div className="mb-5 flex flex-col gap-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
            {isAr ? 'الأدوات والمساعدات' : 'Tools & Power-ups'}
          </h3>

          {/* Lightning / Thunder Item (95 coins) */}
          <div className="p-3.5 rounded-2xl border-2 border-sky-300 bg-gradient-to-br from-sky-50/90 via-cyan-50/60 to-blue-50/40 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center text-2xl shadow-md transform rotate-6">
                ⚡
              </div>
              <div className="flex flex-col">
                <span className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                  {isAr ? 'ضربة الرعد ⚡' : 'Thunder Strike ⚡'}
                  <span className="bg-sky-200 text-sky-900 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                    {isAr ? `تكسر 3 أسهم` : `Breaks 3 Arrows`}
                  </span>
                </span>
                <span className="text-[11px] font-bold text-slate-500 mt-0.5">
                  {isAr ? `تكسر 3 أسهم عشوائية فوراً` : `Breaks 3 random arrows at once`}
                </span>
                <span className="text-xs font-black text-sky-700 mt-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
                  95 {isAr ? 'نقطة' : 'Coins'}
                  <span className="text-slate-400 mx-1">•</span>
                  <span className="text-slate-600 font-extrabold">
                    {isAr ? `تملك: ${thunders}` : `Owned: ${thunders}`}
                  </span>
                </span>
              </div>
            </div>

            <button
              disabled={!canAffordThunder}
              onClick={() => {
                soundManager.playClick();
                if (canAffordThunder) {
                  onBuyThunder(95);
                }
              }}
              className={`px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs ${
                canAffordThunder
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:scale-105 active:scale-95 shadow-sky-200'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70'
              }`}
              title={isAr ? 'شراء رعد بـ 95 نقطة' : 'Buy Lightning Bolt for 95 coins'}
            >
              <span>{isAr ? 'شراء (+1)' : 'Buy (+1)'}</span>
            </button>
          </div>

          {/* Hammer Item (45 coins) */}
          <div className="p-3.5 rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50/80 via-yellow-50/50 to-orange-50/30 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-md transform -rotate-6">
                🔨
              </div>
              <div className="flex flex-col">
                <span className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                  {isAr ? 'المطرقة السحرية' : 'Magic Hammer'}
                  <span className="bg-amber-200 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                    {isAr ? `تكسر سهم 1` : `Breaks 1 Arrow`}
                  </span>
                </span>
                <span className="text-[11px] font-bold text-slate-500 mt-0.5">
                  {isAr ? `تكسر أي سهم تحدده` : `Breaks any arrow on board`}
                </span>
                <span className="text-xs font-black text-amber-700 mt-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
                  45 {isAr ? 'نقطة' : 'Coins'}
                  <span className="text-slate-400 mx-1">•</span>
                  <span className="text-slate-600 font-extrabold">
                    {isAr ? `تملك: ${hammers}` : `Owned: ${hammers}`}
                  </span>
                </span>
              </div>
            </div>

            <button
              disabled={!canAffordHammer}
              onClick={() => {
                soundManager.playClick();
                if (canAffordHammer) {
                  onBuyHammer(45);
                }
              }}
              className={`px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs ${
                canAffordHammer
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-105 active:scale-95 shadow-amber-200'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70'
              }`}
              title={isAr ? 'شراء مطرقة بـ 45 نقطة' : 'Buy Magic Hammer for 45 coins'}
            >
              <span>{isAr ? 'شراء (+1)' : 'Buy (+1)'}</span>
            </button>
          </div>

          {/* Cream Item (129 coins) */}
          <div className="p-3.5 rounded-2xl border-2 border-pink-300 bg-gradient-to-br from-pink-50/90 via-rose-50/60 to-amber-50/40 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-400 via-rose-500 to-amber-400 flex items-center justify-center text-2xl shadow-md transform rotate-3">
                🍦
              </div>
              <div className="flex flex-col">
                <span className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                  {isAr ? 'الكريمة السحرية 🍦' : 'Magic Cream 🍦'}
                  <span className="bg-pink-200 text-pink-900 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                    {isAr ? `تزيل 5 أسهم` : `Removes 5 Arrows`}
                  </span>
                </span>
                <span className="text-[11px] font-bold text-slate-500 mt-0.5">
                  {isAr ? `تزيل 5 أسهم عشوائية فوراً` : `Removes 5 random arrows at once`}
                </span>
                <span className="text-xs font-black text-pink-700 mt-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
                  129 {isAr ? 'نقطة' : 'Coins'}
                  <span className="text-slate-400 mx-1">•</span>
                  <span className="text-slate-600 font-extrabold">
                    {isAr ? `تملك: ${creams}` : `Owned: ${creams}`}
                  </span>
                </span>
              </div>
            </div>

            <button
              disabled={!canAffordCream}
              onClick={() => {
                soundManager.playClick();
                if (canAffordCream) {
                  onBuyCream(129);
                }
              }}
              className={`px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs ${
                canAffordCream
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:scale-105 active:scale-95 shadow-pink-200'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70'
              }`}
              title={isAr ? 'شراء كريمة بـ 129 نقطة' : 'Buy Magic Cream for 129 coins'}
            >
              <span>{isAr ? 'شراء (+1)' : 'Buy (+1)'}</span>
            </button>
          </div>
        </div>

        {/* Skins List Section */}
        <div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2.5">
            {isAr ? 'مظاهر الأسهم' : 'Arrow Skins'}
          </h3>
          <div className="flex flex-col gap-2.5">
          {SKINS.map((skin) => {
            const isUnlocked = unlockedSkins.includes(skin.id);
            const isSelected = selectedSkin === skin.id;
            const canAfford = coins >= skin.cost;

            return (
              <div
                key={skin.id}
                className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-sky-400 bg-sky-50/70 shadow-sm'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${skin.gradient} flex items-center justify-center text-xl shadow-xs`}
                  >
                    {skin.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-slate-800 text-sm">
                      {isAr ? skin.nameAr : skin.nameEn}
                    </span>
                    {!isUnlocked && (
                      <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
                        {skin.cost} {isAr ? 'نقطة' : 'Coins'}
                      </span>
                    )}
                  </div>
                </div>

                {isUnlocked ? (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onSelectSkin(skin.id);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>
                      {isSelected
                        ? isAr
                          ? 'مُفعل'
                          : 'Active'
                        : isAr
                        ? 'اختيار'
                        : 'Select'}
                    </span>
                  </button>
                ) : (
                  <button
                    disabled={!canAfford}
                    onClick={() => {
                      soundManager.playClick();
                      if (canAfford) {
                        onUnlockSkin(skin.id, skin.cost);
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-all ${
                      canAfford
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black shadow-xs hover:scale-105'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isAr ? 'فتح' : 'Unlock'}</span>
                  </button>
                )}
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
};
