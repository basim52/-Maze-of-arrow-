import React from 'react';
import { X, Sparkles, Check, Lock } from 'lucide-react';
import { ThemeSkin, ArrowSkin } from '../types';
import { soundManager } from '../utils/sound';

interface ShopModalProps {
  coins: number;
  spaceCoins: number;
  tomatoes: number;
  spaceCreams: number;
  hammers: number;
  thunders: number;
  creams: number;
  chocolates: number;
  cakes?: number;
  cakeArrowCounter?: number;
  selectedSkin: ThemeSkin;
  unlockedSkins: ThemeSkin[];
  selectedArrowSkin?: ArrowSkin;
  unlockedArrowSkins?: ArrowSkin[];
  language: 'ar' | 'en';
  onSelectSkin: (skin: ThemeSkin) => void;
  onUnlockSkin: (skin: ThemeSkin, cost: number) => void;
  onSelectArrowSkin?: (skin: ArrowSkin) => void;
  onUnlockArrowSkin?: (skin: ArrowSkin, cost: number) => void;
  onBuyHammer: (cost: number) => void;
  onBuyThunder: (cost: number) => void;
  onBuyCream: (cost: number) => void;
  onBuyChocolate: (cost: number) => void;
  onBuyTomato: (cost: number) => void;
  onBuySpaceCream: (cost: number) => void;
  onBuyBundle: (cost: number) => void;
  onBuyCakeBundle: (cost: number) => void;
  onExchangeCoins?: (coinCost: number, spaceCoinsEarned: number) => void;
  onExchangeCake?: (cakeCount: number) => void;
  initialTab?: 'all' | 'galaxy' | 'tools' | 'skins' | 'arrowSkins';
  onClose: () => void;
}

interface SkinItem {
  id: ThemeSkin;
  nameAr: string;
  nameEn: string;
  cost: number;
  gradient: string;
  icon: string;
  descAr?: string;
  descEn?: string;
}

export interface ArrowSkinItem {
  id: ArrowSkin;
  nameAr: string;
  nameEn: string;
  cost: number;
  gradient: string;
  icon: string;
  descAr: string;
  descEn: string;
}

export const ARROW_SKINS: ArrowSkinItem[] = [
  {
    id: 'classic',
    nameAr: 'كلاسيكي جيلي 🍬',
    nameEn: 'Classic Jelly 🍬',
    cost: 0,
    gradient: 'from-cyan-400 to-sky-500',
    icon: '🍬',
    descAr: 'الأسهم اللامعة الكلاسيكية',
    descEn: 'Classic glossy arrows',
  },
  {
    id: 'neon',
    nameAr: 'نيون متوهج ⚡',
    nameEn: 'Neon Glow ⚡',
    cost: 30,
    gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    icon: '⚡',
    descAr: 'أسهم نيون ليزر براقة ومتوهجة',
    descEn: 'Ultra-bright glowing neon laser arrows',
  },
  {
    id: 'gold',
    nameAr: 'الملكي الذهبي 👑',
    nameEn: 'Royal Gold 👑',
    cost: 60,
    gradient: 'from-amber-300 via-yellow-400 to-amber-600',
    icon: '👑',
    descAr: 'أسهم ذهبية براقة ببريق الملوك والنجوم',
    descEn: 'Shining royal gold arrows with sparkles',
  },
  {
    id: 'crystal',
    nameAr: 'البلور الجليدي ❄️',
    nameEn: 'Ice Crystal ❄️',
    cost: 90,
    gradient: 'from-sky-300 via-cyan-400 to-blue-600',
    icon: '❄️',
    descAr: 'أسهم بلورية ثلجية ببريق الألماس',
    descEn: 'Frosted ice crystal arrows with diamond shine',
  },
  {
    id: 'dragon',
    nameAr: 'تنين النار 🐲🔥',
    nameEn: 'Fire Dragon 🐲🔥',
    cost: 120,
    gradient: 'from-rose-500 via-orange-500 to-amber-600',
    icon: '🔥',
    descAr: 'أسهم نارية مستعرة بهالة حمم التنين',
    descEn: 'Fiery dragon arrows with molten lava aura',
  },
  {
    id: 'cyber',
    nameAr: 'ليزر السايبر 🤖',
    nameEn: 'Cyber Laser 🤖',
    cost: 150,
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    icon: '🤖',
    descAr: 'أسهم سايبر دقيقة بشعاع ليزري مستقبلي',
    descEn: 'Futuristic cyberpunk laser grid arrows',
  },
  {
    id: 'rainbow',
    nameAr: 'قوس قزح السحري 🌈',
    nameEn: 'Magic Rainbow 🌈',
    cost: 187,
    gradient: 'from-pink-500 via-yellow-400 via-emerald-400 via-sky-400 to-purple-600',
    icon: '🌈',
    descAr: 'أسهم طيف ألوان قوس قزح المتغير مع النجوم',
    descEn: 'Multicolor shifting rainbow spectrum with star magic',
  },
  {
    id: 'phoenix',
    nameAr: 'العنقاء الذهبية 🦅🔥',
    nameEn: 'Golden Phoenix 🦅🔥',
    cost: 215,
    gradient: 'from-amber-400 via-rose-500 to-red-600',
    icon: '🦅',
    descAr: 'أسهم العنقاء الأسطورية المتوهجة بشرارات اللهب',
    descEn: 'Legendary Phoenix wings arrows blazing with embers',
  },
  {
    id: 'galaxy',
    nameAr: 'مجرة الفضاء 🌌✨',
    nameEn: 'Cosmic Galaxy 🌌✨',
    cost: 250,
    gradient: 'from-purple-600 via-indigo-600 to-pink-500',
    icon: '🌌',
    descAr: 'أسهم مجرة الفضاء بعمق الكواكب والنجوم البرّاقة',
    descEn: 'Deep space cosmic galaxy arrows with starlight',
  },
];

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
    cost: 22,
    gradient: 'from-pink-400 via-purple-400 to-indigo-500',
    icon: '🍭',
  },
  {
    id: 'neon',
    nameAr: 'نيون سايبر',
    nameEn: 'Cyber Neon',
    cost: 45,
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    icon: '⚡',
  },
  {
    id: 'cyber',
    nameAr: 'ذهبي ملكي',
    nameEn: 'Royal Gold',
    cost: 75,
    gradient: 'from-amber-300 via-yellow-400 to-amber-600',
    icon: '👑',
  },
  {
    id: 'hammer',
    nameAr: 'خلفية المطرقة الفولاذية 🔨',
    nameEn: 'Steel Hammer Background 🔨',
    cost: 278,
    gradient: 'from-amber-800 via-stone-900 to-amber-950',
    icon: '🔨',
    descAr: 'تمنحك مطرقة سحرية مضمونة 100% عند خروج 200 سهم! 🔨✨ (مع وجود عداد للتقدم)',
    descEn: '100% Guaranteed bonus magic hammer at 200 escaped arrows! 🔨✨ (with progress counter)',
  },
  {
    id: 'rainstorm',
    nameAr: 'عاصفة المطر والرعد ⛈️⚡',
    nameEn: 'Rain & Thunderstorm ⛈️⚡',
    cost: 187,
    gradient: 'from-slate-900 via-sky-900 to-blue-950',
    icon: '⛈️',
    descAr: 'عند خروج كل سهم مفرد: احتمال 27% لإسقاط من 2 إلى 6 عملات رعد ⚡! ⛈️⚡',
    descEn: 'On each single arrow escape: 27% chance to drop 2 to 6 Thunder bolt currency ⚡! ⛈️⚡',
  },
  {
    id: 'nebula',
    nameAr: 'سديم الفضاء الكوني 🌌',
    nameEn: 'Cosmic Space Nebula 🌌',
    cost: 37,
    gradient: 'from-purple-600 via-indigo-600 to-pink-500',
    icon: '🌌',
  },
  {
    id: 'supernova',
    nameAr: 'السوبرنوفا الفضائي 💥🌌',
    nameEn: 'Supernova Black Hole 💥🌌',
    cost: 48,
    gradient: 'from-amber-500 via-rose-600 to-purple-900',
    icon: '💥',
  },
  {
    id: 'crystal_neon',
    nameAr: 'خلفية النيون الكرستالية 💎✨',
    nameEn: 'Crystal Neon Background 💎✨',
    cost: 124,
    gradient: 'from-cyan-500 via-indigo-600 to-fuchsia-600',
    icon: '💎',
    descAr: 'تمنحك كعكة مجانية 🎂 + 30 نقطة عند إزالة كل 50 سهم! 💎✨ (يفتح العداد حصرياً عند استخدام هذه الخلفية)',
    descEn: 'Grants 1 free cake 🎂 + 30 coins every 50 arrows! 💎✨ (Counter unlocks exclusively when using this background)',
  },
  {
    id: 'golden_throne',
    nameAr: 'خلفية العرش الذهبي 👑🏛️',
    nameEn: 'Golden Throne Background 👑🏛️',
    cost: 400,
    gradient: 'from-amber-500 via-yellow-500 to-amber-700',
    icon: '👑',
    descAr: 'تغطي الشاشة بالكامل بطابع العرش الذهبي الملوكي 👑 وتمنحك مضاعف عملات ×2 (ضعف الفلوس) عند إكمال أي مرحلة! 🪙✨',
    descEn: 'Full-screen royal golden throne theme 👑 & grants 2x coins multiplier on level completion! 🪙✨',
  },
];

export const ShopModal: React.FC<ShopModalProps> = ({
  coins,
  spaceCoins,
  tomatoes,
  spaceCreams,
  hammers,
  thunders,
  creams,
  chocolates,
  cakes = 0,
  cakeArrowCounter = 0,
  selectedSkin,
  unlockedSkins,
  selectedArrowSkin = 'classic',
  unlockedArrowSkins = ['classic'],
  language,
  onSelectSkin,
  onUnlockSkin,
  onSelectArrowSkin,
  onUnlockArrowSkin,
  onBuyHammer,
  onBuyThunder,
  onBuyCream,
  onBuyChocolate,
  onBuyTomato,
  onBuySpaceCream,
  onBuyBundle,
  onBuyCakeBundle,
  onExchangeCoins,
  onExchangeCake,
  initialTab,
  onClose,
}) => {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = React.useState<'all' | 'galaxy' | 'tools' | 'skins' | 'arrowSkins'>(initialTab || 'all');

  const canAffordBundle = coins >= 255;
  const canAffordCakeBundle = coins >= 170;
  const canAffordHammer = coins >= 45;
  const canAffordChocolate = coins >= 55;
  const canAffordThunder = coins >= 95;
  const canAffordCream = coins >= 129;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-2xl border-2 border-purple-500/40 flex flex-col relative animate-scale-up max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-xl shadow-md border border-purple-400/40">
              🛒
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                {isAr ? 'متجر المنتجات والأدوات' : 'Products & Tools Shop'}
              </h2>
              <p className="text-[10px] text-purple-200/80 font-medium">
                {isAr ? 'اختر واشترِ المساعدات والمظاهر الكونية' : 'Browse & purchase power-ups & cosmic skins'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Balance Badges */}
            <div className="flex flex-col gap-1 items-end">
              <div className="flex items-center gap-1 text-xs font-black bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40 shadow-xs">
                <Sparkles className="w-3 h-3 text-amber-400 fill-amber-300" />
                <span>{coins}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-black bg-purple-500/20 text-purple-200 px-2.5 py-0.5 rounded-full border border-purple-400/40 shadow-xs">
                <span>🚀</span>
                <span>{spaceCoins}</span>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Tabs Bar */}
        <div className="grid grid-cols-5 gap-1 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 mb-4 shrink-0">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('all');
            }}
            className={`py-1.5 px-1 rounded-xl text-[10px] sm:text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>✨</span>
            <span>{isAr ? 'الكل' : 'All'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('tools');
            }}
            className={`py-1.5 px-1 rounded-xl text-[10px] sm:text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'tools'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>⚡</span>
            <span>{isAr ? 'الأدوات' : 'Tools'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('arrowSkins');
            }}
            className={`py-1.5 px-1 rounded-xl text-[10px] sm:text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'arrowSkins'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🏹</span>
            <span>{isAr ? 'الأسهم' : 'Arrows'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('skins');
            }}
            className={`py-1.5 px-1 rounded-xl text-[10px] sm:text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'skins'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🎨</span>
            <span>{isAr ? 'اللوحة' : 'Themes'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('galaxy');
            }}
            className={`py-1.5 px-1 rounded-xl text-[10px] sm:text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'galaxy'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🌌</span>
            <span>{isAr ? 'الفضاء' : 'Space'}</span>
          </button>
        </div>

        {/* Products Display Container */}
        <div className="flex flex-col gap-3">
          {/* Galaxy Event Section */}
          {(activeTab === 'all' || activeTab === 'galaxy') && (
            <div className="p-3.5 rounded-2xl border-2 border-purple-500/70 bg-gradient-to-br from-slate-950 via-purple-950/90 to-indigo-950 text-white shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-purple-800/60">
                <div className="flex items-center gap-2">
                  <span className="text-2xl animate-pulse">🌌</span>
                  <div>
                    <h3 className="font-black text-xs sm:text-sm text-purple-200">
                      {isAr ? 'متجر حدث الجلكسي والفضائيات' : 'Galaxy Event Products'}
                    </h3>
                    <p className="text-[10px] text-purple-300/80 font-medium">
                      {isAr ? 'احتمال 15% للحصول على عملات الفضاء من المراحل!' : '15% chance to win space coins on levels!'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-black bg-purple-900/90 text-amber-300 px-2.5 py-1 rounded-full border border-purple-500/60 shadow-inner shrink-0">
                  <span>🚀</span>
                  <span>{spaceCoins}</span>
                </div>
              </div>

              {/* Space Coins Exchange Card (استبدال ٢٣ نقطة لعملة فضاء واحدة) */}
              <div className="p-3 mb-2.5 rounded-2xl border border-amber-400/80 bg-gradient-to-r from-amber-950/90 via-purple-950/90 to-indigo-950/90 flex items-center justify-between gap-2 shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 flex items-center justify-center text-xl shadow-md border border-amber-300 shrink-0 text-slate-950 font-black">
                    🪙➔🚀
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-amber-300 text-xs sm:text-sm flex items-center gap-1">
                      {isAr ? 'استبدال النقاط بعملة فضاء 🚀' : 'Exchange Coins for Space Coins 🚀'}
                    </span>
                    <span className="text-[10px] text-amber-100/90 font-semibold mt-0.5">
                      {isAr ? 'استبدل 23 نقطة مقابل 1 عملة فضاء واحدة فقط' : 'Exchange 23 regular coins for 1 Space Coin'}
                    </span>
                    <span className="text-xs font-black text-amber-300 mt-1 flex items-center gap-1">
                      <span>🪙 23</span>
                      <span className="text-purple-300">➔</span>
                      <span>🚀 1</span>
                    </span>
                  </div>
                </div>

                <button
                  disabled={coins < 23}
                  onClick={() => {
                    soundManager.playClick();
                    if (coins >= 23 && onExchangeCoins) {
                      onExchangeCoins(23, 1);
                    }
                  }}
                  className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                    coins >= 23
                      ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 hover:scale-105 active:scale-95 shadow-amber-950 font-black'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                  }`}
                  title={isAr ? 'استبدال 23 نقطة بـ 1 عملة فضاء' : 'Exchange 23 coins for 1 Space Coin'}
                >
                  <span>{isAr ? 'استبدال (+1🚀)' : 'Exchange (+1🚀)'}</span>
                </button>
              </div>

              {/* Tomato Item (طماطة 🍅) */}
              <div className="p-3 rounded-2xl border border-rose-500/60 bg-gradient-to-r from-rose-950/90 via-purple-900/80 to-slate-900/90 flex items-center justify-between gap-2 shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center text-2xl shadow-md border border-rose-400/50 shrink-0">
                    🍅
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                      {isAr ? 'طماطة الفضاء 🍅' : 'Space Tomato 🍅'}
                      <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black border border-rose-400/60">
                        {isAr ? 'تحذف 6 أسهم!' : 'Deletes 6 Arrows!'}
                      </span>
                    </span>
                    <span className="text-[10px] text-rose-200/90 font-medium mt-0.5">
                      {isAr ? 'تحذف ٦ أسهم دفعة واحدة من اللوحة' : 'Deletes 6 arrows at once from board'}
                    </span>
                    <span className="text-xs font-black text-amber-300 mt-1 flex items-center gap-1">
                      <span>🚀</span>
                      42 {isAr ? 'عملة فضاء' : 'Space Coins'}
                      <span className="text-purple-400 mx-1">•</span>
                      <span className="text-purple-200 font-extrabold">
                        {isAr ? `تملك: ${tomatoes}` : `Owned: ${tomatoes}`}
                      </span>
                    </span>
                  </div>
                </div>

                <button
                  disabled={spaceCoins < 42 && coins < 42}
                  onClick={() => {
                    soundManager.playClick();
                    if (spaceCoins >= 42 || coins >= 42) {
                      onBuyTomato(42);
                    }
                  }}
                  className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                    spaceCoins >= 42 || coins >= 42
                      ? 'bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 text-white hover:scale-105 active:scale-95 shadow-rose-950/60'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                  }`}
                  title={isAr ? 'شراء طماطة بـ 42 عملة' : 'Buy Tomato for 42 coins'}
                >
                  <span>{isAr ? 'شراء (+1)' : 'Buy (+1)'}</span>
                </button>
              </div>

              {/* Cosmic Space Cream Item (كريمة فضائية 🌌🍦) */}
              <div className="p-3 mt-2.5 rounded-2xl border border-purple-400/70 bg-gradient-to-r from-purple-950/90 via-indigo-900/90 to-slate-900/90 flex items-center justify-between gap-2 shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 flex items-center justify-center text-2xl shadow-md border border-purple-300/50 shrink-0">
                    🍦
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                      {isAr ? 'الكريمة الفضائية 🌌🍦' : 'Cosmic Space Cream 🌌🍦'}
                      <span className="bg-purple-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black border border-purple-300/60 shadow-xs">
                        {isAr ? 'تزيل 7 أسهم!' : 'Removes 7 Arrows!'}
                      </span>
                    </span>
                    <span className="text-[10px] text-purple-200/90 font-medium mt-0.5">
                      {isAr ? 'تزيل ٧ أسهم دفعة واحدة من اللوحة!' : 'Removes 7 arrows at once from board!'}
                    </span>
                    <span className="text-xs font-black text-amber-300 mt-1 flex items-center gap-1">
                      <span>🚀</span>
                      47 {isAr ? 'عملة فضاء' : 'Space Coins'}
                      <span className="text-purple-400 mx-1">•</span>
                      <span className="text-purple-200 font-extrabold">
                        {isAr ? `تملك: ${spaceCreams}` : `Owned: ${spaceCreams}`}
                      </span>
                    </span>
                  </div>
                </div>

                <button
                  disabled={spaceCoins < 47 && coins < 47}
                  onClick={() => {
                    soundManager.playClick();
                    if (spaceCoins >= 47 || coins >= 47) {
                      onBuySpaceCream(47);
                    }
                  }}
                  className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                    spaceCoins >= 47 || coins >= 47
                      ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white hover:scale-105 active:scale-95 shadow-purple-950/60'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                  }`}
                  title={isAr ? 'شراء كريمة فضائية بـ 47 عملة' : 'Buy Cosmic Space Cream for 47 coins'}
                >
                  <span>{isAr ? 'شراء (+1)' : 'Buy (+1)'}</span>
                </button>
              </div>

              {/* Space Background Skins Highlight Card (خلفية فضاء جديدة) */}
              <div className="p-3 mt-2.5 rounded-2xl border border-pink-400/80 bg-gradient-to-r from-slate-950 via-purple-950 to-pink-950 flex flex-col gap-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="font-black text-pink-300 text-xs sm:text-sm flex items-center gap-1.5">
                    <span>🌌</span>
                    <span>{isAr ? 'خلفيات الفضاء الكونية الجديدة!' : 'New Cosmic Space Backgrounds!'}</span>
                  </span>
                  <span className="bg-pink-500/30 text-pink-200 text-[9px] px-2 py-0.5 rounded-full font-black border border-pink-400/40">
                    {isAr ? 'جديد 🚀' : 'NEW 🚀'}
                  </span>
                </div>
                <p className="text-[10px] text-purple-200/90 font-medium leading-relaxed">
                  {isAr
                    ? 'غيّر مظهر اللعبة إلى خلفية سديم الفضاء الساحرة أو السوبرنوفا الفضائية من قسم المظاهر!'
                    : 'Transform your game stage with the new Cosmic Nebula or Supernova space background!'}
                </p>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setActiveTab('skins');
                  }}
                  className="w-full py-1.5 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white font-black text-xs shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>🌌</span>
                  <span>{isAr ? 'عرض خلفيات الفضاء وتفعيلها' : 'View & Unlock Space Backgrounds'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Tools & Power-Ups Section */}
          {(activeTab === 'all' || activeTab === 'tools') && (
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <span>⚡</span>
                <span>{isAr ? 'منتجات المساعدات والأدوات' : 'Tools & Power-ups'}</span>
              </h3>

              {/* Mega Triple Power-Up Bundle (255 coins) */}
              <div className="p-3.5 rounded-2xl border-2 border-amber-400/80 bg-gradient-to-r from-amber-950/90 via-slate-900 to-purple-950/90 flex flex-col gap-2 shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                    <span>🎁</span>
                    <span>{isAr ? 'عرض البكج الشامل' : 'Mega Value Bundle'}</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-amber-300 bg-amber-900/80 px-2 py-0.5 rounded-full border border-amber-500/50">
                    {isAr ? 'توفير 14 نقطة!' : 'Save 14 coins!'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-purple-500 flex items-center justify-center text-lg shadow-md gap-0.5 shrink-0">
                      <span>🍦</span>
                      <span>🔨</span>
                      <span>⚡</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-white text-xs sm:text-sm">
                        {isAr ? 'بكج الكريمة والمطرقة والرعد' : 'Cream + Hammer + Thunder'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300 mt-0.5">
                        {isAr ? '1x كريمة 🍦 + 1x مطرقة 🔨 + 1x رعد ⚡' : '1x Cream 🍦 + 1x Hammer 🔨 + 1x Thunder ⚡'}
                      </span>
                      <span className="text-xs font-black text-amber-300 mt-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400 fill-amber-300" />
                        255 {isAr ? 'نقطة' : 'Coins'}
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={!canAffordBundle}
                    onClick={() => {
                      soundManager.playClick();
                      if (canAffordBundle) {
                        onBuyBundle(255);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs shrink-0 ${
                      canAffordBundle
                        ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 text-white hover:scale-105 active:scale-95 shadow-amber-950'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    <span>{isAr ? 'شراء' : 'Buy'}</span>
                  </button>
                </div>
              </div>

              {/* Cake Bundle (170 coins) */}
              <div className="p-3.5 rounded-2xl border-2 border-pink-500/80 bg-gradient-to-r from-pink-950/90 via-slate-900 to-amber-950/80 flex flex-col gap-2 shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-pink-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                    <span>🎂</span>
                    <span>{isAr ? 'بكج الكيك الحلو' : 'Delicious Cake Bundle'}</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-pink-300 bg-pink-900/80 px-2 py-0.5 rounded-full border border-pink-500/50">
                    {isAr ? 'توفير 14 نقطة!' : 'Save 14 coins!'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-800 via-pink-500 to-rose-400 flex items-center justify-center text-lg shadow-md gap-0.5 shrink-0 border border-pink-400/50">
                      <span>🍫</span>
                      <span>🍦</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                        {isAr ? 'بكج الكيك 🎂' : 'Cake Bundle 🎂'}
                        <span className="bg-pink-500/30 text-pink-200 text-[9px] px-1.5 py-0.2 rounded-full font-black border border-pink-400/40">
                          {isAr ? 'إزالة 7 أسهم!' : 'Removes 7 Arrows!'}
                        </span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-300 mt-0.5">
                        {isAr ? '1x شوكولاتة 🍫 + 1x كريمة 🍦' : '1x Chocolate 🍫 + 1x Cream 🍦'}
                      </span>
                      <span className="text-xs font-black text-pink-300 mt-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400 fill-amber-300" />
                        170 {isAr ? 'نقطة' : 'Coins'}
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={!canAffordCakeBundle}
                    onClick={() => {
                      soundManager.playClick();
                      if (canAffordCakeBundle) {
                        onBuyCakeBundle(170);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs shrink-0 ${
                      canAffordCakeBundle
                        ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-600 text-white hover:scale-105 active:scale-95 shadow-pink-950'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    <span>{isAr ? 'شراء' : 'Buy'}</span>
                  </button>
                </div>
              </div>

              {/* Lightning / Thunder Item (95 coins) */}
              <div className="p-3 rounded-2xl border border-sky-500/60 bg-slate-900 flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center text-xl shadow-md shrink-0">
                    ⚡
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                      {isAr ? 'ضربة الرعد ⚡' : 'Thunder Strike ⚡'}
                      <span className="bg-sky-500/20 text-sky-300 text-[9px] px-1.5 py-0.2 rounded-full font-extrabold border border-sky-400/30">
                        {isAr ? `تكسر 3 أسهم` : `Breaks 3 Arrows`}
                      </span>
                    </span>
                    <span className="text-xs font-black text-sky-300 mt-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400 fill-amber-300" />
                      95 {isAr ? 'نقطة' : 'Coins'}
                      <span className="text-slate-500 mx-1">•</span>
                      <span className="text-slate-300 font-extrabold">
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
                  className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs shrink-0 ${
                    canAffordThunder
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:scale-105 active:scale-95 shadow-sky-950'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                  }`}
                >
                  <span>{isAr ? 'شراء (+1)' : 'Buy (+1)'}</span>
                </button>
              </div>

              {/* Chocolate Item (55 coins) */}
              <div className="p-3 rounded-2xl border border-amber-700/60 bg-slate-900 flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-700 via-amber-800 to-yellow-900 flex items-center justify-center text-xl shadow-md shrink-0 border border-amber-600/40">
                    🍫
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                      {isAr ? 'الشوكولاتة السحرية 🍫' : 'Magic Chocolate 🍫'}
                      <span className="bg-amber-800/30 text-amber-200 text-[9px] px-1.5 py-0.2 rounded-full font-extrabold border border-amber-700/30">
                        {isAr ? `تزيل 2 أسهم` : `Removes 2 Arrows`}
                      </span>
                    </span>
                    <span className="text-xs font-black text-amber-300 mt-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400 fill-amber-300" />
                      55 {isAr ? 'نقطة' : 'Coins'}
                      <span className="text-slate-500 mx-1">•</span>
                      <span className="text-slate-300 font-extrabold">
                        {isAr ? `تملك: ${chocolates}` : `Owned: ${chocolates}`}
                      </span>
                    </span>
                  </div>
                </div>

                <button
                  disabled={!canAffordChocolate}
                  onClick={() => {
                    soundManager.playClick();
                    if (canAffordChocolate) {
                      onBuyChocolate(55);
                    }
                  }}
                  className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs shrink-0 ${
                    canAffordChocolate
                      ? 'bg-gradient-to-r from-amber-700 via-amber-800 to-yellow-900 text-white hover:scale-105 active:scale-95 shadow-amber-950'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                  }`}
                >
                  <span>{isAr ? 'شراء (+1)' : 'Buy (+1)'}</span>
                </button>
              </div>

              {/* Hammer Item (45 coins) */}
              <div className="p-3 rounded-2xl border border-amber-400/60 bg-slate-900 flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-xl shadow-md shrink-0">
                    🔨
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                      {isAr ? 'المطرقة السحرية 🔨' : 'Magic Hammer 🔨'}
                      <span className="bg-amber-500/20 text-amber-300 text-[9px] px-1.5 py-0.2 rounded-full font-extrabold border border-amber-400/30">
                        {isAr ? `تكسر سهم 1` : `Breaks 1 Arrow`}
                      </span>
                    </span>
                    <span className="text-xs font-black text-amber-300 mt-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400 fill-amber-300" />
                      45 {isAr ? 'نقطة' : 'Coins'}
                      <span className="text-slate-500 mx-1">•</span>
                      <span className="text-slate-300 font-extrabold">
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
                  className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs shrink-0 ${
                    canAffordHammer
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:scale-105 active:scale-95 shadow-amber-950'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                  }`}
                >
                  <span>{isAr ? 'شراء (+1)' : 'Buy (+1)'}</span>
                </button>
              </div>

              {/* Cream Item (129 coins) */}
              <div className="p-3 rounded-2xl border border-pink-400/60 bg-slate-900 flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 via-rose-500 to-amber-400 flex items-center justify-center text-xl shadow-md shrink-0">
                    🍦
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                      {isAr ? 'الكريمة السحرية 🍦' : 'Magic Cream 🍦'}
                      <span className="bg-pink-500/20 text-pink-300 text-[9px] px-1.5 py-0.2 rounded-full font-extrabold border border-pink-400/30">
                        {isAr ? `تزيل 5 أسهم` : `Removes 5 Arrows`}
                      </span>
                    </span>
                    <span className="text-xs font-black text-pink-300 mt-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400 fill-amber-300" />
                      129 {isAr ? 'نقطة' : 'Coins'}
                      <span className="text-slate-500 mx-1">•</span>
                      <span className="text-slate-300 font-extrabold">
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
                  className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs shrink-0 ${
                    canAffordCream
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:scale-105 active:scale-95 shadow-pink-950'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                  }`}
                >
                  <span>{isAr ? 'شراء (+1)' : 'Buy (+1)'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Arrow Skins Section */}
          {(activeTab === 'all' || activeTab === 'arrowSkins') && (
            <div className="flex flex-col gap-2.5">
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <span>🏹</span>
                <span>{isAr ? 'سكنات وألوان الأسهم' : 'Arrow Skins & Colors'}</span>
              </h3>
              <div className="flex flex-col gap-2">
                {ARROW_SKINS.map((askin) => {
                  const isUnlocked = unlockedArrowSkins?.includes(askin.id);
                  const isSelected = selectedArrowSkin === askin.id;
                  const canAfford = coins >= askin.cost;

                  return (
                    <div
                      key={askin.id}
                      className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-950/40 shadow-sm'
                          : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${askin.gradient} flex items-center justify-center text-xl shadow-xs shrink-0`}
                        >
                          {askin.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-white text-xs sm:text-sm">
                            {isAr ? askin.nameAr : askin.nameEn}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {isAr ? askin.descAr : askin.descEn}
                          </span>
                          {!isUnlocked && askin.cost > 0 && (
                            <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1 mt-0.5">
                              <Sparkles className="w-3 h-3 text-amber-400 fill-amber-300" />
                              {askin.cost} {isAr ? 'نقطة' : 'Coins'}
                            </span>
                          )}
                        </div>
                      </div>

                      {isUnlocked ? (
                        <button
                          onClick={() => {
                            soundManager.playClick();
                            if (onSelectArrowSkin) onSelectArrowSkin(askin.id);
                          }}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shrink-0 ${
                            isSelected
                              ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
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
                            if (canAfford && onUnlockArrowSkin) {
                              onUnlockArrowSkin(askin.id, askin.cost);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shrink-0 ${
                            canAfford
                              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black shadow-xs hover:scale-105'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
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
          )}

          {/* Skins List Section */}
          {(activeTab === 'all' || activeTab === 'skins') && (
            <div className="flex flex-col gap-2.5">
              <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <span>🎨</span>
                <span>{isAr ? 'مظاهر وألواح الخلفيات' : 'Board Themes'}</span>
              </h3>
              <div className="flex flex-col gap-2">
                {SKINS.map((skin) => {
                  const isUnlocked = unlockedSkins.includes(skin.id);
                  const isSelected = selectedSkin === skin.id;
                  const canAfford = coins >= skin.cost;

                  return (
                    <div
                      key={skin.id}
                      className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/40 shadow-sm'
                          : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${skin.gradient} flex items-center justify-center text-xl shadow-xs shrink-0`}
                        >
                          {skin.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-white text-xs sm:text-sm">
                            {isAr ? skin.nameAr : skin.nameEn}
                          </span>
                          {(skin.descAr || skin.descEn) && (
                            <span className="text-[10px] text-cyan-200/90 font-medium">
                              {isAr ? skin.descAr : skin.descEn}
                            </span>
                          )}
                          {!isUnlocked && (
                            <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1 mt-0.5">
                              <Sparkles className="w-3 h-3 text-amber-400 fill-amber-300" />
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
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shrink-0 ${
                            isSelected
                              ? 'bg-cyan-500 text-slate-950 font-black shadow-xs'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
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
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shrink-0 ${
                            canAfford
                              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black shadow-xs hover:scale-105'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
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
          )}
        </div>
      </div>
    </div>
  );
};
