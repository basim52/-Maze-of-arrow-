import React from 'react';
import { X, Sparkles, Check, Lock } from 'lucide-react';
import { ThemeSkin } from '../types';
import { soundManager } from '../utils/sound';

interface ShopModalProps {
  coins: number;
  selectedSkin: ThemeSkin;
  unlockedSkins: ThemeSkin[];
  language: 'ar' | 'en';
  onSelectSkin: (skin: ThemeSkin) => void;
  onUnlockSkin: (skin: ThemeSkin, cost: number) => void;
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
  selectedSkin,
  unlockedSkins,
  language,
  onSelectSkin,
  onUnlockSkin,
  onClose,
}) => {
  const isAr = language === 'ar';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-2 border-slate-100 flex flex-col relative animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-800">
              {isAr ? 'متجر الأسهم' : 'Arrow Shop'}
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

        {/* Skins List */}
        <div className="flex flex-col gap-3">
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
  );
};
