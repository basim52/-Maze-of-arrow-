import React from 'react';
import { X, Sparkles, Check, Lock } from 'lucide-react';
import { ThemeSkin, ArrowSkin } from '../types';
import { soundManager } from '../utils/sound';

interface ShopModalProps {
  coins: number;
  spaceCoins: number;
  tomatoes: number;
  spaceCreams?: number;
  liquidChocolates?: number;
  hammers: number;
  thunders: number;
  lightnings?: number;
  creams: number;
  creamHammers?: number;
  chocolates: number;
  cakes?: number;
  chickens?: number;
  oracleEyes?: number;
  cakeArrowCounter?: number;
  smartCakeMultiplierLevelsRemaining?: number;
  hasUnlockedTimedLevels?: boolean;
  hasUnlockedMonsterMode?: boolean;
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
  onBuyCreamHammer?: (cost: number) => void;
  onBuyChocolate: (cost: number) => void;
  onBuyTomato: (cost: number) => void;
  onBuySpaceCream?: (cost: number) => void;
  onBuyLiquidChocolate?: (cost: number) => void;
  onBuyBundle: (cost: number) => void;
  onBuyCakeBundle: (cost: number) => void;
  onBuySpaceBundle?: (cost: number) => void;
  onBuyMonsterPack?: () => void;
  onExchangeCoins?: (coinCost: number, spaceCoinsEarned: number) => void;
  onExchangeCake?: (cakeCount: number) => void;
  onBuyWithCake?: (itemType: string, cakeCost: number) => void;
  onBuyWithThunder?: (itemType: string, thunderCost: number) => void;
  initialTab?: 'all' | 'thunder' | 'cake' | 'galaxy' | 'tools' | 'skins' | 'arrowSkins';
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
  {
    id: 'cake_star',
    nameAr: 'أسهم نجوم الكعك 🎂⭐',
    nameEn: 'Cake Star Arrows 🎂⭐',
    cost: 3,
    gradient: 'from-pink-500 via-rose-400 to-amber-300',
    icon: '🎂⭐',
    descAr: 'تضاعف مكافأة نجوم البقاء (نجوم المرحلة) في مراحل الأحداث فقط! (الفضائية، الطويلة، الرعدية) 🌟⚡',
    descEn: 'Doubles survival star rewards in Event Stages only! (Galaxy, Long & Thunder modes) 🌟⚡',
  },
  {
    id: 'thunder_storm',
    nameAr: 'العاصفة والرعد الكهربائي ⛈️⚡',
    nameEn: 'Thunderstorm & Electric Rain ⛈️⚡',
    cost: 160,
    gradient: 'from-sky-400 via-cyan-500 to-indigo-600',
    icon: '⚡⛈️',
    descAr: 'أسهم عاصفة المطر والرعد ذات الهالة الكهربائية المتوهجة وزرقة البرق',
    descEn: 'Electrifying rainstorm arrows with lightning aura & cyan-blue glow',
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
    descAr: 'تغطي الشاشة بالكامل بطابع العرش الذهبي الملوكي 👑 وتمنحك مضاعف عملات ×2 (ضعف الفلوس) عند إكمال أي مرحلة وللأسهم المحنكة! 🪙✨',
    descEn: 'Full-screen royal golden throne theme 👑 & grants 2x coins multiplier on level completion & veteran arrows! 🪙✨',
  },
  {
    id: 'cake',
    nameAr: 'خلفية مخبز الكاب كيك 🧁✨',
    nameEn: 'Cupcake Bakery Background 🧁✨',
    cost: 5,
    gradient: 'from-pink-500 via-rose-400 to-amber-300',
    icon: '🧁',
    descAr: 'خلفية الكاب كيك الشهية 🧁✨: تمنحك كاب كيك مجاني 🧁 في كل مرة تزيل فيها 35 سهماً أثناء اللعب! (عداد 35)',
    descEn: 'Delicious Cupcake theme 🧁✨: Grants 1 free Cupcake 🧁 for every 35 arrows cleared in gameplay! (35 Counter)',
  },
  {
    id: 'cake_kingdom',
    nameAr: 'خلفية مملكة الكعك الملكية 🎂🏰✨',
    nameEn: 'Royal Cake Kingdom Background 🎂🏰✨',
    cost: 5,
    gradient: 'from-amber-400 via-pink-500 to-rose-600',
    icon: '🎂',
    descAr: 'خلفية مملكة الكعك الملكية 🎂🏰✨: عند إكمال 100 سهم: فرصة 49% للحصول على كعكة 🎂 و 51% للحصول على كاب كيك 🧁! ✨ (عداد 100)',
    descEn: 'Royal Cake Kingdom theme 🎂🏰✨: Clear 100 arrows for a 49% chance to get a Cake 🎂 & 51% chance for a Cupcake 🧁! ✨ (100 Counter)',
  },
  {
    id: 'emerald_palace',
    nameAr: 'خلفية القصر الزمردي الأسطوري 🏰💎✨',
    nameEn: 'Royal Emerald Palace Background 🏰💎✨',
    cost: 320,
    gradient: 'from-emerald-600 via-teal-800 to-slate-950',
    icon: '💎',
    descAr: 'خلفية زمردية ملكية ساحرة 🏰💎: تمنحك +25% عملات إضافية 🪙 وفرصة 51% للحصول على مطرقة سحرية 🔨 + 30 عملة رعد ⚡ عند إكمال كل 100 سهم! ✨',
    descEn: 'Royal Emerald Palace theme 🏰💎: Grants +25% bonus coins 🪙 and a 51% chance for a free magic hammer 🔨 + 30 thunder coins ⚡ for every 100 arrows cleared! ✨',
  },
];

export const ShopModal: React.FC<ShopModalProps> = ({
  coins,
  spaceCoins,
  tomatoes,
  spaceCreams = 0,
  liquidChocolates = 0,
  hammers,
  thunders,
  lightnings = 0,
  creams,
  creamHammers = 0,
  chocolates,
  cakes = 0,
  chickens = 0,
  oracleEyes = 0,
  cakeArrowCounter = 0,
  smartCakeMultiplierLevelsRemaining = 0,
  hasUnlockedTimedLevels = false,
  hasUnlockedMonsterMode = false,
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
  onBuyCreamHammer,
  onBuyChocolate,
  onBuyTomato,
  onBuySpaceCream,
  onBuyLiquidChocolate,
  onBuyBundle,
  onBuyCakeBundle,
  onBuySpaceBundle,
  onBuyMonsterPack,
  onExchangeCoins,
  onExchangeCake,
  onBuyWithCake,
  onBuyWithThunder,
  initialTab,
  onClose,
}) => {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = React.useState<'all' | 'thunder' | 'cake' | 'tools' | 'skins' | 'arrowSkins'>(
    initialTab === 'galaxy' ? 'all' : initialTab || 'all'
  );

  const canAffordBundle = coins >= 160;
  const canAffordCakeBundle = coins >= 170;
  const canAffordSpaceBundle = coins >= 950;
  const canAffordHammer = coins >= 45;
  const canAffordChocolate = coins >= 55;
  const canAffordCreamHammer = coins >= 85;
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
            <div className="flex flex-wrap gap-1 items-end justify-end max-w-[130px]">
              <div className="flex items-center gap-1 text-xs font-black bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40 shadow-xs">
                <Sparkles className="w-3 h-3 text-amber-400 fill-amber-300" />
                <span>{coins}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-black bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full border border-yellow-400/40 shadow-xs">
                <span>⚡</span>
                <span>{thunders}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-black bg-pink-500/20 text-pink-200 px-2 py-0.5 rounded-full border border-pink-400/40 shadow-xs">
                <span>🎂</span>
                <span>{cakes}</span>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Tabs Bar */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 mb-4 shrink-0 overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('all');
            }}
            className={`py-1.5 px-2.5 rounded-xl text-[10px] sm:text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0 ${
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
              setActiveTab('thunder');
            }}
            className={`py-1.5 px-2.5 rounded-xl text-[10px] sm:text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0 ${
              activeTab === 'thunder'
                ? 'bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-slate-950 shadow-md font-black ring-1 ring-yellow-300'
                : 'text-yellow-300 hover:text-yellow-100'
            }`}
          >
            <span>⚡</span>
            <span>{isAr ? 'متجر الرعد' : 'Thunder Shop'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('cake');
            }}
            className={`py-1.5 px-2.5 rounded-xl text-[10px] sm:text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0 ${
              activeTab === 'cake'
                ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-md font-black ring-1 ring-pink-300'
                : 'text-pink-300 hover:text-pink-100'
            }`}
          >
            <span>🎂</span>
            <span>{isAr ? 'قسم الكعك' : 'Cake Shop'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('tools');
            }}
            className={`py-1.5 px-2.5 rounded-xl text-[10px] sm:text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0 ${
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
            className={`py-1.5 px-2.5 rounded-xl text-[10px] sm:text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0 ${
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
            className={`py-1.5 px-2.5 rounded-xl text-[10px] sm:text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0 ${
              activeTab === 'skins'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🎨</span>
            <span>{isAr ? 'اللوحة' : 'Themes'}</span>
          </button>
        </div>

        {/* Products Display Container */}
        <div className="flex flex-col gap-3">
          {/* Thunder Section (قسم متجر الرعد ⚡) */}
          {(activeTab === 'all' || activeTab === 'thunder') && (
            <div className="p-3.5 rounded-2xl border-2 border-yellow-500/80 bg-gradient-to-br from-slate-950 via-amber-950/90 to-yellow-950 text-white shadow-lg relative overflow-hidden">
              {/* Thunder Shop Header Banner */}
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-yellow-800/60">
                <div className="flex items-center gap-2">
                  <span className="text-2xl animate-bounce">⚡</span>
                  <div>
                    <h3 className="font-black text-xs sm:text-sm text-amber-200">
                      {isAr ? 'متجر الرعد الصاعق ⚡' : 'Thunder Tempest Shop ⚡'}
                    </h3>
                    <p className="text-[10px] text-amber-300/80 font-medium">
                      {isAr
                        ? 'استبدل عملات الرعد بأقوى الأدوات والمكافآت الحصرية!'
                        : 'Exchange thunder coins for powerful tools & rewards!'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-black bg-amber-900/90 text-yellow-300 px-2.5 py-1 rounded-full border border-yellow-500/60 shadow-inner shrink-0">
                  <span>⚡</span>
                  <span>{thunders}</span>
                </div>
              </div>

              {/* List of Products Bought with Thunder */}
              <div className="flex flex-col gap-2.5">
                {/* 0. Timed Levels Pack (حزمة المراحل المؤقتة 10 مراحل - 34 عملة رعد ⏱️⚡) */}
                <div className="p-3 rounded-2xl border border-yellow-400/70 bg-slate-900/90 flex items-center justify-between gap-2 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-400 via-amber-500 to-red-600 flex items-center justify-center text-xl shadow-md border border-yellow-300 shrink-0 text-white font-black animate-pulse">
                      ⏱️⚡
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-amber-200 text-xs sm:text-sm">
                        {isAr ? 'حزمة المراحل المؤقتة (١٠ مراحل) ⏱️⚡' : 'Timed Levels Pack (10 Levels) ⏱️⚡'}
                      </span>
                      <span className="text-[10px] text-slate-300 font-medium mt-0.5">
                        {isAr ? 'تفتح ١٠ مراحل مؤقتة جديدة مع مؤقت تنازلي سريع!' : 'Unlocks 10 new timed levels with countdown timer!'}
                      </span>
                      <span className="text-xs font-black text-amber-300 mt-1 flex items-center gap-1">
                        <span>⚡ 34 عملة رعد</span>
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={hasUnlockedTimedLevels || thunders < 34}
                    onClick={() => {
                      soundManager.playClick();
                      if (!hasUnlockedTimedLevels && thunders >= 34 && onBuyWithThunder) {
                        onBuyWithThunder('timedLevelsPack', 34);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                      hasUnlockedTimedLevels
                        ? 'bg-emerald-600 text-white border border-emerald-400 cursor-default'
                        : thunders >= 34
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 hover:scale-105 active:scale-95 font-black'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    {hasUnlockedTimedLevels ? (isAr ? 'مفتوحة ⏱️' : 'Unlocked ⏱️') : (isAr ? 'شراء' : 'Buy')}
                  </button>
                </div>
                {/* 1. Exchange Thunder Coins for Gold Coins (استبدال الرعد بنقاط ذهبية ⚡➔🪙) */}
                <div className="p-3 rounded-2xl border border-amber-400/50 bg-slate-900/90 flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-xl shadow-md border border-amber-300 shrink-0 text-slate-950 font-black">
                      ⚡➔🪙
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-amber-300 text-xs sm:text-sm flex items-center gap-1">
                        {isAr ? 'تحويل الرعد إلى نقاط (25+ 🪙)' : 'Convert Thunder to 25 Coins'}
                      </span>
                      <span className="text-[10px] text-slate-300 font-medium mt-0.5">
                        {isAr ? 'استبدل 34 عملة رعد بـ 25 نقطة ذهبية' : 'Exchange 34 Thunder for 25 Gold Coins'}
                      </span>
                      <span className="text-xs font-black text-amber-300 mt-1 flex items-center gap-1">
                        <span>⚡ 34 عملة</span>
                        <span className="text-amber-400">➔</span>
                        <span>🪙 25 نقطة</span>
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={thunders < 34}
                    onClick={() => {
                      soundManager.playClick();
                      if (thunders >= 34 && onBuyWithThunder) {
                        onBuyWithThunder('coins', 34);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                      thunders >= 34
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 hover:scale-105 active:scale-95 font-black'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    {isAr ? 'استبدال' : 'Exchange'}
                  </button>
                </div>

                {/* 1b. Delicious Cake (شراء كعكة بـ 34 عملة رعد 🎂⚡) */}
                <div className="p-3 rounded-2xl border border-pink-400/60 bg-gradient-to-r from-slate-900 via-pink-950/40 to-slate-900 flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-xl shadow-md border border-pink-300 shrink-0 text-white font-black">
                      🎂⚡
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-pink-300 text-xs sm:text-sm flex items-center gap-1">
                        {isAr ? 'الكعكة اللذيذة 🎂' : 'Delicious Cake 🎂'}
                      </span>
                      <span className="text-[10px] text-slate-300 font-medium mt-0.5">
                        {isAr ? 'شراء كعكة واحدة باستخدام عملات الرعد' : 'Buy 1 Cake using Thunder Coins'}
                      </span>
                      <span className="text-xs font-black text-amber-300 mt-1 flex items-center gap-1">
                        <span>⚡ 34 عملة رعد</span>
                        <span className="text-slate-400 mx-1">•</span>
                        <span className="text-slate-300 font-extrabold">
                          {isAr ? `تملك: ${cakes}` : `Owned: ${cakes}`}
                        </span>
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={thunders < 34}
                    onClick={() => {
                      soundManager.playClick();
                      if (thunders >= 34 && onBuyWithThunder) {
                        onBuyWithThunder('cake', 34);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                      thunders >= 34
                        ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white hover:scale-105 active:scale-95 font-black'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    {isAr ? 'شراء' : 'Buy'}
                  </button>
                </div>

                {/* 2. Magic Hammer (المطرقة السحرية 🔨) */}
                <div className="p-3 rounded-2xl border border-amber-500/40 bg-slate-900/90 flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-700 to-yellow-800 flex items-center justify-center text-xl shadow-md border border-amber-400 shrink-0 text-white font-black">
                      🔨
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-amber-200 text-xs sm:text-sm">
                        {isAr ? 'المطرقة السحرية 🔨' : 'Magic Hammer 🔨'}
                      </span>
                      <span className="text-[10px] text-slate-300 font-medium mt-0.5">
                        {isAr ? 'تكسر العقد الفولاذية والأسهم الصعبة' : 'Breaks steel locks & stubborn arrows'}
                      </span>
                      <span className="text-xs font-black text-amber-300 mt-1 flex items-center gap-1">
                        <span>⚡ 27 عملة رعد</span>
                        <span className="text-slate-400 mx-1">•</span>
                        <span className="text-slate-300 font-extrabold">
                          {isAr ? `تملك: ${hammers}` : `Owned: ${hammers}`}
                        </span>
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={thunders < 27}
                    onClick={() => {
                      soundManager.playClick();
                      if (thunders >= 27 && onBuyWithThunder) {
                        onBuyWithThunder('hammer', 27);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                      thunders >= 27
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-slate-950 hover:scale-105 active:scale-95 font-black'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    {isAr ? 'شراء' : 'Buy'}
                  </button>
                </div>

                {/* 3. Magic Chocolate (الشوكولاته السحرية 🍫) */}
                <div className="p-3 rounded-2xl border border-amber-500/40 bg-slate-900/90 flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-800 via-amber-900 to-yellow-900 flex items-center justify-center text-xl shadow-md border border-amber-500 shrink-0 text-white font-black">
                      🍫
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-amber-200 text-xs sm:text-sm">
                        {isAr ? 'الشوكولاته السحرية 🍫' : 'Magic Chocolate 🍫'}
                      </span>
                      <span className="text-[10px] text-slate-300 font-medium mt-0.5">
                        {isAr ? 'تسقط شوكولاتة تزيل سهمين عشوائيين' : 'Removes 2 random arrows'}
                      </span>
                      <span className="text-xs font-black text-amber-300 mt-1 flex items-center gap-1">
                        <span>⚡ 34 عملة رعد</span>
                        <span className="text-slate-400 mx-1">•</span>
                        <span className="text-slate-300 font-extrabold">
                          {isAr ? `تملك: ${chocolates}` : `Owned: ${chocolates}`}
                        </span>
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={thunders < 34}
                    onClick={() => {
                      soundManager.playClick();
                      if (thunders >= 34 && onBuyWithThunder) {
                        onBuyWithThunder('chocolate', 34);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                      thunders >= 34
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-slate-950 hover:scale-105 active:scale-95 font-black'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    {isAr ? 'شراء' : 'Buy'}
                  </button>
                </div>

                {/* 4. Liquid Chocolate (الشوكولاته السائلة 🍫💧) */}
                <div className="p-3 rounded-2xl border border-amber-500/40 bg-slate-900/90 flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-700 via-yellow-800 to-amber-900 flex items-center justify-center text-xl shadow-md border border-amber-400 shrink-0 text-white font-black">
                      🍫💧
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-amber-200 text-xs sm:text-sm">
                        {isAr ? 'الشوكولاته السائلة 🍫💧' : 'Liquid Chocolate 🍫💧'}
                      </span>
                      <span className="text-[10px] text-slate-300 font-medium mt-0.5">
                        {isAr ? 'تذيب وتلغي 3 أسهم متتالية' : 'Melts 3 consecutive arrows'}
                      </span>
                      <span className="text-xs font-black text-amber-300 mt-1 flex items-center gap-1">
                        <span>⚡ 48 عملة رعد</span>
                        <span className="text-slate-400 mx-1">•</span>
                        <span className="text-slate-300 font-extrabold">
                          {isAr ? `تملك: ${liquidChocolates}` : `Owned: ${liquidChocolates}`}
                        </span>
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={thunders < 48}
                    onClick={() => {
                      soundManager.playClick();
                      if (thunders >= 48 && onBuyWithThunder) {
                        onBuyWithThunder('liquidChocolate', 48);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                      thunders >= 48
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-slate-950 hover:scale-105 active:scale-95 font-black'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    {isAr ? 'شراء' : 'Buy'}
                  </button>
                </div>

                {/* 5. Roasted Chicken (الدجاج المحمر 🐔🔥) */}
                <div className="p-3 rounded-2xl border border-amber-500/40 bg-slate-900/90 flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-500 flex items-center justify-center text-xl shadow-md border border-amber-300 shrink-0 text-white font-black">
                      🐔
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-amber-200 text-xs sm:text-sm">
                        {isAr ? 'الدجاج المحمر 🐔🔥' : 'Roasted Chicken 🐔🔥'}
                      </span>
                      <span className="text-[10px] text-slate-300 font-medium mt-0.5">
                        {isAr ? 'تزيل 4 أسهم دفعة واحدة من اللوحة' : 'Removes 4 arrows at once'}
                      </span>
                      <span className="text-xs font-black text-amber-300 mt-1 flex items-center gap-1">
                        <span>⚡ 97 {isAr ? 'عملة رعد' : 'Thunder Coins'}</span>
                        <span className="text-slate-400 mx-1">•</span>
                        <span className="text-slate-300 font-extrabold">
                          {isAr ? `تملك: ${chickens}` : `Owned: ${chickens}`}
                        </span>
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={thunders < 97}
                    onClick={() => {
                      soundManager.playClick();
                      if (thunders >= 97 && onBuyWithThunder) {
                        onBuyWithThunder('chicken', 97);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                      thunders >= 97
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-slate-950 hover:scale-105 active:scale-95 font-black'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    {isAr ? 'شراء' : 'Buy'}
                  </button>
                </div>

                {/* 6. Magic Cream (الكريمة السحرية 🍦) */}
                <div className="p-3 rounded-2xl border border-amber-500/40 bg-slate-900/90 flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-md border border-pink-400 shrink-0 text-white font-black">
                      🍦
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-amber-200 text-xs sm:text-sm">
                        {isAr ? 'الكريمة السحرية 🍦' : 'Magic Cream 🍦'}
                      </span>
                      <span className="text-[10px] text-slate-300 font-medium mt-0.5">
                        {isAr ? 'تزيل 5 أسهم متتالية من اللوحة' : 'Removes 5 consecutive arrows'}
                      </span>
                      <span className="text-xs font-black text-amber-300 mt-1 flex items-center gap-1">
                        <span>⚡ 75 عملة رعد</span>
                        <span className="text-slate-400 mx-1">•</span>
                        <span className="text-slate-300 font-extrabold">
                          {isAr ? `تملك: ${creams}` : `Owned: ${creams}`}
                        </span>
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={thunders < 75}
                    onClick={() => {
                      soundManager.playClick();
                      if (thunders >= 75 && onBuyWithThunder) {
                        onBuyWithThunder('cream', 75);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                      thunders >= 75
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-slate-950 hover:scale-105 active:scale-95 font-black'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    {isAr ? 'شراء' : 'Buy'}
                  </button>
                </div>

                {/* 7. Super Storm Energy Bundle (حزمة العاصفة الرعدية الفائقة ⚡📦) */}
                <div className="p-3.5 rounded-2xl border-2 border-yellow-400/80 bg-gradient-to-r from-amber-950/90 via-slate-900 to-yellow-950/90 flex items-center justify-between gap-2 shadow-md">
                  <div className="flex items-center gap-2.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-600 flex items-center justify-center text-2xl shadow-md border border-amber-300 shrink-0 text-slate-950 font-black animate-pulse">
                      ⚡📦
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-amber-300 text-xs sm:text-sm">
                        {isAr ? 'حزمة العاصفة الرعدية الفائقة ⚡📦' : 'Super Storm Energy Bundle ⚡📦'}
                      </span>
                      <span className="text-[10px] text-amber-100/90 font-medium mt-0.5">
                        {isAr ? '2 مطرقة 🔨 + 2 شوكولاتة 🍫 + 1 شوكولاته سائلة 🍫💧 + 1 دجاج محمر 🐔' : '2 Hammers + 2 Chocos + 1 Liquid Choco + 1 Chicken'}
                      </span>
                      <span className="text-xs font-black text-amber-300 mt-1">
                        ⚡ 241 عملة رعد
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={thunders < 241}
                    onClick={() => {
                      soundManager.playClick();
                      if (thunders >= 241 && onBuyWithThunder) {
                        onBuyWithThunder('stormBundle', 241);
                      }
                    }}
                    className={`px-3.5 py-2.5 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                      thunders >= 241
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 hover:scale-105 active:scale-95 font-black'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    {isAr ? 'شراء الحزمة' : 'Buy Bundle'}
                  </button>
                </div>

                {/* 8. Midnight Thunder Theme (خلفية عاصفة منتصف الليل 🌩️✨) */}
                <div className="p-3.5 rounded-2xl border-2 border-cyan-400/80 bg-gradient-to-r from-slate-950 via-cyan-950/90 to-blue-950 flex items-center justify-between gap-2 shadow-md">
                  <div className="flex items-center gap-2.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-600 flex items-center justify-center text-2xl shadow-md border border-cyan-300 shrink-0 text-white font-black">
                      🌩️✨
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-cyan-200 text-xs sm:text-sm">
                          {isAr ? 'خلفية عاصفة منتصف الليل' : 'Midnight Thunder Theme'}
                        </span>
                      </div>
                      <span className="text-[10px] text-cyan-100/90 font-medium mt-0.5">
                        {isAr ? 'برق منتصف الليل ⚡ +3 عملات رعد وتضاعف نقاط الأسهم الفضية إلى +40 نقطة! 🌩️' : 'Midnight lightning +3 bonus thunder & 2x coins for Silver Arrows (+40)! 🌩️'}
                      </span>
                      <span className="text-xs font-black text-amber-300 mt-1">
                        ⚡ 238 عملة رعد
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={thunders < 238}
                    onClick={() => {
                      soundManager.playClick();
                      if (thunders >= 238 && onBuyWithThunder) {
                        onBuyWithThunder('midnightThunderSkin', 238);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                      unlockedSkins.includes('midnight_thunder')
                        ? 'bg-emerald-600 text-white cursor-default'
                        : thunders >= 238
                        ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 hover:scale-105 active:scale-95 font-black'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    {unlockedSkins.includes('midnight_thunder')
                      ? isAr ? 'مفتوحة ✓' : 'Unlocked ✓'
                      : isAr ? 'فتح المظهر' : 'Unlock'}
                  </button>
                </div>

                {/* 9. Glowing Neon Arrow Skin (أسهم النيون المتوهجة ⚡🏹) */}
                <div className="p-3.5 rounded-2xl border-2 border-emerald-400/80 bg-gradient-to-r from-slate-950 via-teal-950/90 to-emerald-950 flex items-center justify-between gap-2 shadow-md">
                  <div className="flex items-center gap-2.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-500 flex items-center justify-center text-2xl shadow-md border border-emerald-300 shrink-0 text-slate-950 font-black">
                      ⚡🏹
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-emerald-200 text-xs sm:text-sm">
                        {isAr ? 'أسهم النيون المتوهجة ⚡🏹' : 'Glowing Neon Arrows ⚡🏹'}
                      </span>
                      <span className="text-[10px] text-emerald-100/90 font-medium mt-0.5">
                        {isAr ? 'أسهم نيون براقة ومتوهجة بلون الصاعقة الليزرية' : 'Ultra-bright glowing neon laser arrows'}
                      </span>
                      <span className="text-xs font-black text-amber-300 mt-1">
                        ⚡ 190 عملة رعد
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={thunders < 190}
                    onClick={() => {
                      soundManager.playClick();
                      if (thunders >= 190 && onBuyWithThunder) {
                        onBuyWithThunder('neonArrowSkin', 190);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                      unlockedArrowSkins.includes('neon')
                        ? 'bg-emerald-600 text-white cursor-default'
                        : thunders >= 190
                        ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 hover:scale-105 active:scale-95 font-black'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    {unlockedArrowSkins.includes('neon')
                      ? isAr ? 'مفتوحة ✓' : 'Unlocked ✓'
                      : isAr ? 'فتح الأسهم' : 'Unlock'}
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Cake Section (قسم الكعك) */}



          {/* Cake Section (قسم الكعك) */}
          {(activeTab === 'all' || activeTab === 'cake') && (
            <div className="p-3.5 rounded-2xl border-2 border-pink-500/80 bg-gradient-to-br from-slate-950 via-pink-950/90 to-rose-950 text-white shadow-lg relative overflow-hidden">
              {/* Cake Shop Header Banner */}
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-pink-800/60">
                <div className="flex items-center gap-2">
                  <span className="text-2xl animate-bounce">🎂</span>
                  <div>
                    <h3 className="font-black text-xs sm:text-sm text-pink-200">
                      {isAr ? 'قسم الكعك والمكافآت 🎂' : 'Cake & Rewards Section 🎂'}
                    </h3>
                    <p className="text-[10px] text-pink-300/80 font-medium">
                      {isAr
                        ? 'اشترِ الأدوات والمساعدات بأسعار مميزة باستخدام الكعك!'
                        : 'Purchase tools & power-ups with cakes!'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-black bg-pink-900/90 text-pink-200 px-2.5 py-1 rounded-full border border-pink-500/60 shadow-inner shrink-0">
                  <span>🎂</span>
                  <span>{cakes}</span>
                </div>
              </div>

              {/* List of Products Bought with Cake */}
              <div className="flex flex-col gap-2.5">
                {/* 0. Buy 1 Cake with 34 Thunder Coins (شراء كعكة واحدة بـ 34 عملة رعد ⚡➔🎂) */}
                <div className="p-3 rounded-2xl border border-sky-400/80 bg-gradient-to-r from-slate-900 via-pink-950/80 to-indigo-950/90 flex items-center justify-between gap-2 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 via-pink-500 to-amber-400 flex items-center justify-center text-xl shadow-md border border-sky-300/60 shrink-0 text-white font-black">
                      ⚡➔🎂
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-pink-200 text-xs sm:text-sm flex items-center gap-1">
                        {isAr ? 'شراء كعكة بعملات الرعد 🎂⚡' : 'Buy Cake with Thunder Coins 🎂⚡'}
                      </span>
                      <span className="text-[10px] text-pink-300/80 font-medium mt-0.5">
                        {isAr ? 'شراء كعكة واحدة مقابل 34 عملة رعد' : 'Get 1 Cake for 34 Thunder Coins'}
                      </span>
                      <span className="text-xs font-black text-amber-300 mt-1 flex items-center gap-1">
                        <span>⚡ 34 عملة رعد</span>
                        <span className="text-sky-400">➔</span>
                        <span>🎂 1 كعكة</span>
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={thunders < 34}
                    onClick={() => {
                      soundManager.playClick();
                      if (thunders >= 34 && onBuyWithThunder) {
                        onBuyWithThunder('cake', 34);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                      thunders >= 34
                        ? 'bg-gradient-to-r from-sky-400 via-pink-500 to-amber-400 text-slate-950 hover:scale-105 active:scale-95 font-black'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    <span>{isAr ? 'شراء (+1🎂)' : 'Buy (+1🎂)'}</span>
                  </button>
                </div>

                {/* 1. Exchange Cake for Regular Coins (استبدال الكعك بنقاط 🪙 - 32 نقطة للكعكة) */}
                <div className="p-3 rounded-2xl border border-amber-400/70 bg-gradient-to-r from-amber-950/80 via-slate-900 to-pink-950/80 flex items-center justify-between gap-2 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-600 flex items-center justify-center text-xl shadow-md border border-amber-300 shrink-0 text-slate-950 font-black">
                      🎂➔🪙
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-amber-300 text-xs sm:text-sm flex items-center gap-1">
                        {isAr ? 'استبدال الكعك بنقاط (32+ 🪙)' : 'Exchange Cake for 32 Coins'}
                      </span>
                      <span className="text-[10px] text-amber-100/80 font-medium mt-0.5">
                        {isAr ? 'حوّل كعكة واحدة إلى 32 نقطة ذهبية' : 'Convert 1 cake into 32 golden coins'}
                      </span>
                      <span className="text-xs font-black text-pink-300 mt-1 flex items-center gap-1">
                        <span>🎂 1 كعكة</span>
                        <span className="text-amber-400">➔</span>
                        <span>🪙 32 نقطة</span>
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={cakes < 1}
                    onClick={() => {
                      soundManager.playClick();
                      if (cakes >= 1) {
                        if (onBuyWithCake) {
                          onBuyWithCake('coins', 1);
                        } else if (onExchangeCake) {
                          onExchangeCake(1);
                        }
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                      cakes >= 1
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 hover:scale-105 active:scale-95 font-black'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    <span>{isAr ? 'استبدال' : 'Exchange'}</span>
                  </button>
                </div>

                {/* 2. Buy Magic Hammer with 1 Cake (شراء مطرقة سحرية بـ 1 كعكة) */}
                <div className="p-3 rounded-2xl border border-amber-500/60 bg-gradient-to-r from-slate-900 via-amber-950/70 to-pink-950/80 flex items-center justify-between gap-2 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-xl shadow-md shrink-0 border border-amber-300/50">
                      🔨
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                        {isAr ? 'المطرقة السحرية 🔨' : 'Magic Hammer 🔨'}
                        <span className="bg-amber-500/20 text-amber-300 text-[9px] px-1.5 py-0.2 rounded-full font-extrabold border border-amber-400/30">
                          {isAr ? 'تكسر سهم 1' : 'Breaks 1 Arrow'}
                        </span>
                      </span>
                      <span className="text-[10px] text-slate-300 font-medium mt-0.5">
                        {isAr ? 'تكسر سهم واحد بكسر مباشر' : 'Breaks 1 arrow directly'}
                      </span>
                      <span className="text-xs font-black text-pink-300 mt-1 flex items-center gap-1">
                        <span>🎂 1 كعكة</span>
                        <span className="text-slate-400 mx-1">•</span>
                        <span className="text-slate-300 font-extrabold">
                          {isAr ? `تملك: ${hammers}` : `Owned: ${hammers}`}
                        </span>
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={cakes < 1}
                    onClick={() => {
                      soundManager.playClick();
                      if (cakes >= 1 && onBuyWithCake) {
                        onBuyWithCake('hammer', 1);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                      cakes >= 1
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:scale-105 active:scale-95 font-black'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    <span>{isAr ? 'شراء (+1)' : 'Buy (+1)'}</span>
                  </button>
                </div>

                {/* 3. Buy Magic Chocolate with 2 Cakes (شراء شوكولاتة سحرية) */}
                <div className="p-3 rounded-2xl border border-amber-700/60 bg-gradient-to-r from-slate-900 via-amber-900/60 to-rose-950/80 flex items-center justify-between gap-2 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-700 via-amber-800 to-yellow-900 flex items-center justify-center text-xl shadow-md shrink-0 border border-amber-600/40">
                      🍫
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                        {isAr ? 'الشوكولاتة السحرية 🍫' : 'Magic Chocolate 🍫'}
                        <span className="bg-amber-800/30 text-amber-200 text-[9px] px-1.5 py-0.2 rounded-full font-extrabold border border-amber-700/30">
                          {isAr ? 'تزيل 2 أسهم' : 'Removes 2 Arrows'}
                        </span>
                      </span>
                      <span className="text-[10px] text-slate-300 font-medium mt-0.5">
                        {isAr ? 'تسقط شوكولاتة تزيل سهمين عشوائيين' : 'Removes 2 random arrows from board'}
                      </span>
                      <span className="text-xs font-black text-pink-300 mt-1 flex items-center gap-1">
                        <span>🎂 1 كعكة</span>
                        <span className="text-slate-400 mx-1">•</span>
                        <span className="text-slate-300 font-extrabold">
                          {isAr ? `تملك: ${chocolates}` : `Owned: ${chocolates}`}
                        </span>
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={cakes < 1}
                    onClick={() => {
                      soundManager.playClick();
                      if (cakes >= 1 && onBuyWithCake) {
                        onBuyWithCake('chocolate', 1);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                      cakes >= 1
                        ? 'bg-gradient-to-r from-amber-700 via-amber-800 to-yellow-900 text-white hover:scale-105 active:scale-95 font-black'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    <span>{isAr ? 'شراء (+1)' : 'Buy (+1)'}</span>
                  </button>
                </div>

                {/* 4. Buy Cream Hammer with 2 Cakes (شراء مطرقة الكريمة بـ 2 كعك) */}
                <div className="p-3 rounded-2xl border border-pink-400/60 bg-gradient-to-r from-slate-900 via-pink-950/70 to-rose-950/80 flex items-center justify-between gap-2 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-amber-400 to-amber-600 flex items-center justify-center text-xl shadow-md shrink-0 border border-pink-400/40">
                      🍦🔨
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                        {isAr ? 'مطرقة الكريمة 🍦🔨' : 'Cream Hammer 🍦🔨'}
                        <span className="bg-pink-500/20 text-pink-300 text-[9px] px-1.5 py-0.2 rounded-full font-extrabold border border-pink-400/30">
                          {isAr ? 'تزيل 3 أسهم' : 'Removes 3 Arrows'}
                        </span>
                      </span>
                      <span className="text-[10px] text-slate-300 font-medium mt-0.5">
                        {isAr ? 'تزيل 3 أسهم دفعة واحدة' : 'Removes 3 arrows at once'}
                      </span>
                      <span className="text-xs font-black text-pink-300 mt-1 flex items-center gap-1">
                        <span>🎂 1 كعكة</span>
                        <span className="text-slate-400 mx-1">•</span>
                        <span className="text-slate-300 font-extrabold">
                          {isAr ? `تملك: ${creamHammers}` : `Owned: ${creamHammers}`}
                        </span>
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={cakes < 1}
                    onClick={() => {
                      soundManager.playClick();
                      if (cakes >= 1 && onBuyWithCake) {
                        onBuyWithCake('creamHammer', 1);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                      cakes >= 1
                        ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-600 text-white hover:scale-105 active:scale-95 font-black'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    <span>{isAr ? 'شراء (+1)' : 'Buy (+1)'}</span>
                  </button>
                </div>

                {/* 5. Buy Magic Cream with Cakes (شراء الكريمة السحرية) */}
                <div className="p-3 rounded-2xl border border-pink-400/60 bg-gradient-to-r from-slate-900 via-pink-900/60 to-purple-950/80 flex items-center justify-between gap-2 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 via-rose-500 to-amber-400 flex items-center justify-center text-xl shadow-md shrink-0 border border-pink-400/40">
                      🍦
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                        {isAr ? 'الكريمة السحرية 🍦' : 'Magic Cream 🍦'}
                        <span className="bg-pink-500/20 text-pink-300 text-[9px] px-1.5 py-0.2 rounded-full font-extrabold border border-pink-400/30">
                          {isAr ? 'تزيل 5 أسهم' : 'Removes 5 Arrows'}
                        </span>
                      </span>
                      <span className="text-[10px] text-slate-300 font-medium mt-0.5">
                        {isAr ? 'تزيل 5 أسهم متتالية من اللوحة' : 'Removes 5 consecutive arrows from board'}
                      </span>
                      <span className="text-xs font-black text-pink-300 mt-1 flex items-center gap-1">
                        <span>🎂 2 كعكة</span>
                        <span className="text-slate-400 mx-1">•</span>
                        <span className="text-slate-300 font-extrabold">
                          {isAr ? `تملك: ${creams}` : `Owned: ${creams}`}
                        </span>
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={cakes < 2}
                    onClick={() => {
                      soundManager.playClick();
                      if (cakes >= 2 && onBuyWithCake) {
                        onBuyWithCake('cream', 2);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                      cakes >= 2
                        ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:scale-105 active:scale-95 font-black'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    <span>{isAr ? 'شراء (+1)' : 'Buy (+1)'}</span>
                  </button>
                </div>

                {/* 6. Buy Liquid Chocolate with Cakes (شراء شوكولاته سائلة بالكعك تزيل 3 أسهم) */}
                <div className="p-3 rounded-2xl border border-amber-500/60 bg-gradient-to-r from-slate-900 via-amber-950/80 to-stone-950/80 flex items-center justify-between gap-2 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-600 to-amber-800 flex items-center justify-center text-xl shadow-md shrink-0 border border-amber-400/40">
                      🍫💧
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                        {isAr ? 'الشوكولاته السائلة 🍫💧' : 'Liquid Chocolate 🍫💧'}
                        <span className="bg-amber-600/30 text-amber-200 text-[9px] px-1.5 py-0.2 rounded-full font-extrabold border border-amber-500/30">
                          {isAr ? 'تزيل 3 أسهم' : 'Removes 3 Arrows'}
                        </span>
                      </span>
                      <span className="text-[10px] text-slate-300 font-medium mt-0.5">
                        {isAr ? 'تسكب شوكولاته سائلة تزيل ٣ أسهم من اللوحة' : 'Pours liquid chocolate removing 3 arrows'}
                      </span>
                      <span className="text-xs font-black text-pink-300 mt-1 flex items-center gap-1">
                        <span>🎂 2 كعكة</span>
                        <span className="text-slate-400 mx-1">•</span>
                        <span className="text-slate-300 font-extrabold">
                          {isAr ? `تملك: ${liquidChocolates}` : `Owned: ${liquidChocolates}`}
                        </span>
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={cakes < 2}
                    onClick={() => {
                      soundManager.playClick();
                      if (cakes >= 2 && onBuyWithCake) {
                        onBuyWithCake('liquidChocolate', 2);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                      cakes >= 2
                        ? 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white hover:scale-105 active:scale-95 font-black'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    <span>{isAr ? 'شراء (+1)' : 'Buy (+1)'}</span>
                  </button>
                </div>

                {/* 6b. Oracle Eye - عين العرافة الكونية 👁️🔮✨ (1 كعكة) */}
                <div className="p-3.5 rounded-2xl border-2 border-indigo-400/80 bg-gradient-to-r from-indigo-950/90 via-purple-950 to-slate-900 flex flex-col gap-2 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                      <span>👁️🔮</span>
                      <span>{isAr ? 'عين العرافة الكونية' : 'Oracle Eye Cosmic Power'}</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-indigo-200 bg-indigo-900/80 px-2 py-0.5 rounded-full border border-indigo-400/50">
                      {isAr ? 'تطلق الأسهم الحرة الكونية ✨' : 'Escapes Free Arrows ✨'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-2xl shadow-md shrink-0 border border-indigo-300/50 text-white font-black animate-pulse">
                        👁️🔮
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                          {isAr ? 'عين العرافة (Oracle Eye) 👁️🔮' : 'Oracle Eye 👁️🔮'}
                        </span>
                        <span className="text-[10px] font-bold text-indigo-200/90 mt-0.5">
                          {isAr ? 'تكشف الرؤية الكونية وتطلق الأسهم غير المحجوبة من اللوحة فوراً برؤية أوراكل الكونية الساحرة! ✨' : 'Reveals cosmic vision and instantly escapes unblocked arrows from the maze! ✨'}
                        </span>
                        <span className="text-xs font-black text-pink-300 mt-1 flex items-center gap-1">
                          <span>🎂 1 كعكة</span>
                          <span className="text-slate-400 mx-1">•</span>
                          <span className="text-indigo-300 font-extrabold">
                            {isAr ? `تملك: ${oracleEyes}` : `Owned: ${oracleEyes}`}
                          </span>
                        </span>
                      </div>
                    </div>

                    <button
                      disabled={cakes < 1}
                      onClick={() => {
                        soundManager.playClick();
                        if (cakes >= 1 && onBuyWithCake) {
                          onBuyWithCake('oracleEye', 1);
                        }
                      }}
                      className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                        cakes >= 1
                          ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:scale-105 active:scale-95 font-black'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                      }`}
                    >
                      <span>{isAr ? 'شراء (+1👁️)' : 'Buy (+1👁️)'}</span>
                    </button>
                  </div>
                </div>

                {/* 6c. Deluxe Cupcake Box - صندوق الكاب كيك الفاخر 🧁💎✨ (3 كعكات) */}
                <div className="p-3.5 rounded-2xl border-2 border-pink-400/80 bg-gradient-to-r from-pink-950/90 via-rose-950 to-amber-950/90 flex flex-col gap-2 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 via-amber-400 to-rose-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                      <span>🧁💎</span>
                      <span>{isAr ? 'صندوق الكاب كيك الفاخر' : 'Deluxe Cupcake Box'}</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-pink-200 bg-pink-900/80 px-2 py-0.5 rounded-full border border-pink-400/50">
                      {isAr ? 'حزمة كب كيك ملونة 🎁' : 'Value Pack 🎁'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-amber-400 to-rose-500 flex items-center justify-center text-2xl shadow-md shrink-0 border border-pink-300/50">
                        🧁💎
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                          {isAr ? 'صندوق الكاب كيك الفاخر 🧁💎' : 'Deluxe Cupcake Box 🧁💎'}
                        </span>
                        <span className="text-[10px] font-bold text-pink-200/90 mt-0.5">
                          {isAr ? 'تحصل على +1 عين العرافة 👁️🔮 + 1 مطرقة سحرية 🔨 + 1 شوكولاتة سائلة 🍫💧!' : 'Get +1 Oracle Eye 👁️🔮 + 1 Magic Hammer 🔨 + 1 Liquid Chocolate 🍫💧!'}
                        </span>
                        <span className="text-xs font-black text-pink-300 mt-1 flex items-center gap-1">
                          <span>🎂 3 كعكات</span>
                        </span>
                      </div>
                    </div>

                    <button
                      disabled={cakes < 3}
                      onClick={() => {
                        soundManager.playClick();
                        if (cakes >= 3 && onBuyWithCake) {
                          onBuyWithCake('deluxeCupcakePack', 3);
                        }
                      }}
                      className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                        cakes >= 3
                          ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-slate-950 hover:scale-105 active:scale-95 font-black'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                      }`}
                    >
                      <span>{isAr ? 'شراء (3🎂)' : 'Buy (3🎂)'}</span>
                    </button>
                  </div>
                </div>


                {/* 8. Smart Cake Multiplier with 3 Cakes (مضاعف الكعك الذكي بـ 3 كعكات) */}
                <div className="p-3.5 rounded-2xl border-2 border-amber-400/80 bg-gradient-to-r from-amber-950/90 via-slate-900 to-pink-950/90 flex flex-col gap-2 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                      <span>🎂⚡</span>
                      <span>{isAr ? 'مضاعف الكعك الذكي' : 'Smart Cake Multiplier'}</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-amber-200 bg-amber-900/80 px-2 py-0.5 rounded-full border border-amber-400/50">
                      {isAr ? 'مدتها ٤ مراحل' : 'Lasts 4 Levels'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-pink-500 flex items-center justify-center text-2xl shadow-md shrink-0 border border-amber-300/50 text-slate-950 font-black">
                        🎂⚡
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                          {isAr ? 'مضاعف الكعك الذكي 🎂⚡' : 'Smart Cake Multiplier 🎂⚡'}
                        </span>
                        <span className="text-[10px] font-bold text-amber-100/90 mt-0.5">
                          {isAr ? 'يضاعف جميع المكافآت والنقاط وعملات الفضاء والرعد عند إكمال المرحلة (لمدة ٤ مراحل) ما عدا السهم الألماسي المحنك!' : 'Doubles all level coins, space & thunder coins for 4 levels! (Excludes veteran diamond arrow)'}
                        </span>
                        <span className="text-xs font-black text-pink-300 mt-1 flex items-center gap-1">
                          <span>🎂 3 كعكات</span>
                          <span className="text-slate-400 mx-1">•</span>
                          <span className="text-amber-300 font-extrabold">
                            {isAr ? `المراحل النشطة المتبقية: ${smartCakeMultiplierLevelsRemaining || 0}` : `Active levels left: ${smartCakeMultiplierLevelsRemaining || 0}`}
                          </span>
                        </span>
                      </div>
                    </div>

                    <button
                      disabled={cakes < 3}
                      onClick={() => {
                        soundManager.playClick();
                        if (cakes >= 3 && onBuyWithCake) {
                          onBuyWithCake('smartMultiplier', 3);
                        }
                      }}
                      className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                        cakes >= 3
                          ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-pink-500 text-slate-950 hover:scale-105 active:scale-95 font-black'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                      }`}
                    >
                      <span>{isAr ? 'شراء (+4 مراحل)' : 'Buy (+4 Lvls)'}</span>
                    </button>
                  </div>
                </div>

                {/* 9. Cake Star Arrow Skin (أسهم نجوم الكعك 🎂⭐ - 3 كعكات) */}
                <div className="p-3.5 rounded-2xl border-2 border-pink-400/80 bg-gradient-to-r from-pink-950/90 via-rose-950 to-amber-950/90 flex flex-col gap-2 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                      <span>🎂⭐</span>
                      <span>{isAr ? 'مظهر أسهم نجوم الكعك' : 'Cake Star Arrows Skin'}</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-amber-200 bg-amber-900/80 px-2 py-0.5 rounded-full border border-amber-400/50">
                      {isAr ? 'ميزة مضاعفة نجوم الأحداث 🌟' : '2x Event Stars Perk 🌟'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-400 to-amber-300 flex items-center justify-center text-2xl shadow-md shrink-0 border border-pink-300/50">
                        🎂⭐
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                          {isAr ? 'أسهم نجوم الكعك 🎂⭐' : 'Cake Star Arrows 🎂⭐'}
                        </span>
                        <span className="text-[10px] font-bold text-pink-200/90 mt-0.5">
                          {isAr ? 'تضاعف مكافأة نجوم البقاء (نجوم المرحلة) في مراحل الأحداث فقط! (الفضائية، الطويلة، الرعدية) 🌟' : 'Doubles survival star rewards in Event Stages only! (Galaxy, Long & Thunder modes)'}
                        </span>
                        <span className="text-xs font-black text-pink-300 mt-1 flex items-center gap-1">
                          <span>🎂 3 كعكات</span>
                        </span>
                      </div>
                    </div>

                    {unlockedArrowSkins?.includes('cake_star') ? (
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          if (onSelectArrowSkin) onSelectArrowSkin('cake_star');
                        }}
                        className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shrink-0 ${
                          selectedArrowSkin === 'cake_star'
                            ? 'bg-pink-500 text-white font-black shadow-xs'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {selectedArrowSkin === 'cake_star' && <Check className="w-3.5 h-3.5" />}
                        <span>
                          {selectedArrowSkin === 'cake_star'
                            ? isAr ? 'مُفعل' : 'Active'
                            : isAr ? 'تفعيل' : 'Select'}
                        </span>
                      </button>
                    ) : (
                      <button
                        disabled={cakes < 3}
                        onClick={() => {
                          soundManager.playClick();
                          if (cakes >= 3 && onBuyWithCake) {
                            onBuyWithCake('cakeStarArrowSkin', 3);
                          }
                        }}
                        className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs shrink-0 ${
                          cakes >= 3
                            ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-slate-950 hover:scale-105 active:scale-95 font-black'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{isAr ? 'فتح (3🎂)' : 'Unlock (3🎂)'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 10. Cake Theme Background Skin (خلفية مخبز الكاب كيك 🧁✨) */}
                <div className="p-3.5 rounded-2xl border-2 border-pink-400/80 bg-gradient-to-r from-pink-950/90 via-rose-950 to-amber-950/90 flex flex-col gap-2 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-amber-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                      <span>🧁✨</span>
                      <span>{isAr ? 'خلفية مخبز الكاب كيك' : 'Cupcake Bakery Theme'}</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-amber-200 bg-amber-900/80 px-2 py-0.5 rounded-full border border-amber-400/50">
                      {isAr ? 'ميزة 1 كاب كيك عند إزالة كل 35 سهماً 🧁' : '1 Free Cupcake per 35 Arrows Cleared 🧁'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-400 to-amber-300 flex items-center justify-center text-2xl shadow-md shrink-0 border border-pink-300/50">
                        🧁
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                          {isAr ? 'خلفية مخبز الكاب كيك 🧁✨' : 'Cupcake Bakery Background 🧁✨'}
                        </span>
                        <span className="text-[10px] font-bold text-pink-200/90 mt-0.5">
                          {isAr ? 'تمنحك كاب كيك مجاني 🧁 في كل مرة تزيل فيها 35 سهماً أثناء اللعب! (عداد 35)' : 'Grants 1 free Cupcake 🧁 for every 35 arrows cleared in gameplay!'}
                        </span>
                        <span className="text-xs font-black text-pink-300 mt-1 flex items-center gap-1">
                          <span>🎂 5 كعكات</span>
                        </span>
                      </div>
                    </div>

                    {unlockedSkins.includes('cake') ? (
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onSelectSkin('cake');
                        }}
                        className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shrink-0 ${
                          selectedSkin === 'cake'
                            ? 'bg-pink-500 text-white font-black shadow-xs'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {selectedSkin === 'cake' && <Check className="w-3.5 h-3.5" />}
                        <span>
                          {selectedSkin === 'cake'
                            ? isAr ? 'مُفعل' : 'Active'
                            : isAr ? 'تفعيل' : 'Select'}
                        </span>
                      </button>
                    ) : (
                      <button
                        disabled={cakes < 5}
                        onClick={() => {
                          soundManager.playClick();
                          if (cakes >= 5 && onBuyWithCake) {
                            onBuyWithCake('cakeSkin', 5);
                          }
                        }}
                        className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs shrink-0 ${
                          cakes >= 5
                            ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-slate-950 hover:scale-105 active:scale-95 font-black'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{isAr ? 'فتح (5🎂)' : 'Unlock (5🎂)'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 10.5. Royal Cake Kingdom Background (خلفية مملكة الكعك الملكية 🎂🏰✨) */}
                <div className="p-3.5 rounded-2xl border-2 border-amber-400/80 bg-gradient-to-r from-amber-950/90 via-rose-950 to-pink-950 flex flex-col gap-2 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                      <span>🎂🏰✨</span>
                      <span>{isAr ? 'خلفية مملكة الكعك الملكية' : 'Royal Cake Kingdom Theme'}</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-amber-200 bg-amber-900/80 px-2 py-0.5 rounded-full border border-amber-400/50">
                      {isAr ? 'ميزة 25% كعكة + 25% كاب كيك عند الفوز 🎂' : '25% Cake + 25% Cupcake Bonus 🎂'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-rose-600 flex items-center justify-center text-2xl shadow-md shrink-0 border border-amber-300/50">
                        🎂
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                          {isAr ? 'خلفية مملكة الكعك الملكية 🎂🏰✨' : 'Royal Cake Kingdom Background 🎂🏰✨'}
                        </span>
                        <span className="text-[10px] font-bold text-pink-200/90 mt-0.5">
                          {isAr ? 'تغطي اللوح بطابع الكعك الملكي المبهج وتمنحك عند إكمال أي مرحلة احتمال 25% كعكة (+1 🎂) واحتمال 25% كاب كيك (+1 🧁)!' : '25% chance for a royal cake (+1 🎂) + 25% chance for a free cupcake (+1 🧁) on level completion!'}
                        </span>
                        <span className="text-xs font-black text-pink-300 mt-1 flex items-center gap-1">
                          <span>🎂 5 كعكات</span>
                        </span>
                      </div>
                    </div>

                    {unlockedSkins.includes('cake_kingdom') ? (
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onSelectSkin('cake_kingdom');
                        }}
                        className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shrink-0 ${
                          selectedSkin === 'cake_kingdom'
                            ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {selectedSkin === 'cake_kingdom' && <Check className="w-3.5 h-3.5" />}
                        <span>
                          {selectedSkin === 'cake_kingdom'
                            ? isAr ? 'مُفعل' : 'Active'
                            : isAr ? 'تفعيل' : 'Select'}
                        </span>
                      </button>
                    ) : (
                      <button
                        disabled={cakes < 5}
                        onClick={() => {
                          soundManager.playClick();
                          if (cakes >= 5 && onBuyWithCake) {
                            onBuyWithCake('cakeKingdomSkin', 5);
                          }
                        }}
                        className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs shrink-0 ${
                          cakes >= 5
                            ? 'bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 text-slate-950 hover:scale-105 active:scale-95 font-black'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{isAr ? 'فتح (5🎂)' : 'Unlock (5🎂)'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 11. Roasted Chicken item with Cakes (دجاج محمر بالكعك) */}
                <div className="p-3.5 rounded-2xl border-2 border-amber-500/80 bg-gradient-to-r from-amber-950/90 via-orange-950 to-slate-900 flex flex-col gap-2 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                      <span>🐔⚡</span>
                      <span>{isAr ? 'أداة الدجاج المحمر' : 'Roasted Chicken Tool'}</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-amber-200 bg-amber-900/80 px-2 py-0.5 rounded-full border border-amber-400/50">
                      {isAr ? 'حذف ٤ أسهم 🐔' : 'Removes 4 Arrows 🐔'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-400 flex items-center justify-center text-2xl shadow-md shrink-0 border border-amber-300/50 text-slate-950">
                        🐔
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                          {isAr ? 'دجاج محمر 🐔' : 'Roasted Chicken 🐔'}
                        </span>
                        <span className="text-[10px] font-bold text-amber-200/90 mt-0.5">
                          {isAr ? 'يمحي ٤ أسهم عشوائية فوراً من اللوحة عند استخدامه في أي مرحلة! 🐔⚡' : 'Removes 4 random arrows instantly from the board when used! 🐔⚡'}
                        </span>
                        <span className="text-xs font-black text-pink-300 mt-1 flex items-center gap-1">
                          <span>🎂 2 كعك</span>
                          <span className="text-slate-400 mx-1">•</span>
                          <span className="text-amber-300 font-extrabold">
                            {isAr ? `تملك: ${chickens}` : `Owned: ${chickens}`}
                          </span>
                        </span>
                      </div>
                    </div>

                    <button
                      disabled={cakes < 2}
                      onClick={() => {
                        soundManager.playClick();
                        if (cakes >= 2 && onBuyWithCake) {
                          onBuyWithCake('chicken', 2);
                        }
                      }}
                      className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shrink-0 ${
                        cakes >= 2
                          ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 text-slate-950 hover:scale-105 active:scale-95 font-black'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                      }`}
                    >
                      <span>{isAr ? 'شراء (+1)' : 'Buy (+1)'}</span>
                    </button>
                  </div>
                </div>

                {/* 9. Royal Cake Chest (صندوق الكعك الملوكي) */}
                <div className="p-3.5 rounded-2xl border-2 border-pink-400/80 bg-gradient-to-r from-pink-950 via-rose-950 to-purple-950 flex flex-col gap-2 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                      <span>🎁🎂</span>
                      <span>{isAr ? 'صندوق الكعك الملوكي' : 'Royal Cake Chest'}</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-pink-200 bg-pink-900/80 px-2 py-0.5 rounded-full border border-pink-400/50">
                      {isAr ? 'عرض فخم 🌟' : 'Grand Bundle 🌟'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-500 flex items-center justify-center text-lg shadow-md gap-0.5 shrink-0 border border-pink-300/50">
                        <span>🔨</span>
                        <span>🍦</span>
                        <span>🍫</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                          {isAr ? 'باقة المساعدات الملكية 🎁' : 'Royal Power-ups Chest 🎁'}
                        </span>
                        <span className="text-[10px] font-bold text-pink-200/90 mt-0.5">
                          {isAr ? '1x مطرقة 🔨 + 1x كريمة 🍦 + 1x شوكولاته سائلة 🍫💧' : '1x Hammer 🔨 + 1x Cream 🍦 + 1x Liquid Chocolate 🍫💧'}
                        </span>
                        <span className="text-xs font-black text-pink-300 mt-1 flex items-center gap-1">
                          <span>🎂 3 كعكات</span>
                        </span>
                      </div>
                    </div>

                    <button
                      disabled={cakes < 3}
                      onClick={() => {
                        soundManager.playClick();
                        if (cakes >= 3 && onBuyWithCake) {
                          onBuyWithCake('cakeChest', 3);
                        }
                      }}
                      className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs shrink-0 ${
                        cakes >= 3
                          ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 text-white hover:scale-105 active:scale-95 shadow-pink-950 font-black'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                      }`}
                    >
                      <span>{isAr ? 'شراء الصندوق' : 'Buy Chest'}</span>
                    </button>
                  </div>
                </div>
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

              {/* Mega Value Bundle (160 coins) */}
              <div className="p-3.5 rounded-2xl border-2 border-amber-400/80 bg-gradient-to-r from-amber-950/90 via-slate-900 to-purple-950/90 flex flex-col gap-2 shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                    <span>🎁</span>
                    <span>{isAr ? 'عرض البكج المميز' : 'Value Bundle'}</span>
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
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-white text-xs sm:text-sm">
                        {isAr ? 'بكج الكريمة والمطرقة' : 'Cream + Hammer Bundle'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300 mt-0.5">
                        {isAr ? '1x كريمة 🍦 + 1x مطرقة 🔨' : '1x Cream 🍦 + 1x Hammer 🔨'}
                      </span>
                      <span className="text-xs font-black text-amber-300 mt-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400 fill-amber-300" />
                        160 {isAr ? 'نقطة' : 'Coins'}
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={!canAffordBundle}
                    onClick={() => {
                      soundManager.playClick();
                      if (canAffordBundle) {
                        onBuyBundle(160);
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

              {/* Monster Battle Mode Pack (154 coins) */}
              <div className="p-3.5 rounded-2xl border-2 border-rose-500/80 bg-gradient-to-r from-rose-950/90 via-red-950/90 to-purple-950/90 flex flex-col gap-2 shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                    <span>👹⚔️</span>
                    <span>{isAr ? 'طور معركة الوحش' : 'Monster Battle Mode'}</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-rose-300 bg-rose-900/80 px-2 py-0.5 rounded-full border border-rose-500/50">
                    {isAr ? '٥ مراحل حماسية' : '5 Epic Stages'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center text-xl shadow-md shrink-0 border border-rose-400/50">
                      👹⚔️
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                        {isAr ? 'طور معركة الوحش 👹⚔️' : 'Monster Battle Mode 👹⚔️'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300 mt-0.5">
                        {isAr ? 'فتح ٥ مراحل ملحمية ضد الوحوش والتنانين مع مكافآت نقاط مضاعفة!' : '5 epic boss monster stages!'}
                      </span>
                      <span className="text-xs font-black text-amber-300 mt-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400 fill-amber-300" />
                        154 {isAr ? 'نقطة' : 'Coins'}
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={hasUnlockedMonsterMode || coins < 154}
                    onClick={() => {
                      soundManager.playClick();
                      if (!hasUnlockedMonsterMode && coins >= 154 && onBuyMonsterPack) {
                        onBuyMonsterPack();
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs shrink-0 ${
                      hasUnlockedMonsterMode
                        ? 'bg-emerald-600 text-white border border-emerald-400 cursor-default'
                        : coins >= 154
                        ? 'bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 text-white hover:scale-105 active:scale-95 shadow-rose-950 font-black'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    <span>{hasUnlockedMonsterMode ? (isAr ? 'مفتوح ✅' : 'Unlocked ✅') : (isAr ? 'شراء' : 'Buy')}</span>
                  </button>
                </div>
              </div>

              {/* Space Bundle (950 coins) */}
              <div className="p-3.5 rounded-2xl border-2 border-purple-400/80 bg-gradient-to-r from-purple-950/90 via-indigo-950/90 to-pink-950/90 flex flex-col gap-2 shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                    <span>🚀</span>
                    <span>{isAr ? 'بكج الفضاء الخيالي' : 'Super Space Bundle'}</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-pink-300 bg-purple-900/80 px-2 py-0.5 rounded-full border border-purple-400/50">
                    {isAr ? 'عرض الفضاء المميز' : 'Cosmic Offer!'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-rose-400 flex items-center justify-center text-lg shadow-md gap-0.5 shrink-0 border border-purple-300/50">
                      <span>🍅</span>
                      <span>🍅</span>
                      <span>🍦</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                        {isAr ? 'بكج الفضاء 🌌' : 'Space Bundle 🌌'}
                        <span className="bg-purple-500/30 text-purple-200 text-[9px] px-1.5 py-0.2 rounded-full font-black border border-purple-400/40">
                          {isAr ? 'إزالة 19 سهماً!' : 'Removes 19 Arrows!'}
                        </span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-300 mt-0.5">
                        {isAr ? '2x طماطة فضائية 🍅 + 1x كريمة فضائية 🍦' : '2x Space Tomatoes 🍅 + 1x Space Cream 🍦'}
                      </span>
                      <span className="text-xs font-black text-amber-300 mt-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400 fill-amber-300" />
                        950 {isAr ? 'نقطة' : 'Coins'}
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={!canAffordSpaceBundle}
                    onClick={() => {
                      soundManager.playClick();
                      if (canAffordSpaceBundle && onBuySpaceBundle) {
                        onBuySpaceBundle(950);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs shrink-0 ${
                      canAffordSpaceBundle
                        ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 text-white hover:scale-105 active:scale-95 shadow-purple-950'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                    }`}
                  >
                    <span>{isAr ? 'شراء' : 'Buy'}</span>
                  </button>
                </div>
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

              {/* Cream Hammer Item (85 coins) */}
              <div className="p-3 rounded-2xl border border-pink-400/60 bg-slate-900 flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-amber-400 to-amber-600 flex items-center justify-center text-xl shadow-md shrink-0 border border-pink-400/40">
                    🍦🔨
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                      {isAr ? 'مطرقة الكريمة 🍦🔨' : 'Cream Hammer 🍦🔨'}
                      <span className="bg-pink-500/20 text-pink-300 text-[9px] px-1.5 py-0.2 rounded-full font-extrabold border border-pink-400/30">
                        {isAr ? `تزيل 3 أسهم` : `Removes 3 Arrows`}
                      </span>
                    </span>
                    <span className="text-xs font-black text-pink-300 mt-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400 fill-amber-300" />
                      85 {isAr ? 'نقطة' : 'Coins'}
                      <span className="text-slate-500 mx-1">•</span>
                      <span className="text-slate-300 font-extrabold">
                        {isAr ? `تملك: ${creamHammers}` : `Owned: ${creamHammers}`}
                      </span>
                    </span>
                  </div>
                </div>

                <button
                  disabled={!canAffordCreamHammer}
                  onClick={() => {
                    soundManager.playClick();
                    if (canAffordCreamHammer && onBuyCreamHammer) {
                      onBuyCreamHammer(85);
                    }
                  }}
                  className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs shrink-0 ${
                    canAffordCreamHammer
                      ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-600 text-white hover:scale-105 active:scale-95 shadow-pink-950'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                  }`}
                >
                  <span>{isAr ? 'شراء (+1)' : 'Buy (+1)'}</span>
                </button>
              </div>

              {/* Lightning Strike Item (85 coins) */}
              <div className="p-3 rounded-2xl border border-yellow-400/60 bg-slate-900 flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-400 via-amber-400 to-yellow-500 flex items-center justify-center text-xl shadow-md shrink-0 border border-yellow-300 text-slate-950 font-black">
                    ⚡
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-white text-xs sm:text-sm flex items-center gap-1">
                      {isAr ? 'ضربة البرق ⚡' : 'Lightning Strike ⚡'}
                      <span className="bg-yellow-500/20 text-yellow-300 text-[9px] px-1.5 py-0.2 rounded-full font-extrabold border border-yellow-400/30">
                        {isAr ? `تحذف 3 أسهم` : `Removes 3 Arrows`}
                      </span>
                    </span>
                    <span className="text-xs font-black text-amber-300 mt-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400 fill-amber-300" />
                      85 {isAr ? 'نقطة' : 'Coins'}
                      <span className="text-slate-500 mx-1">•</span>
                      <span className="text-slate-300 font-extrabold">
                        {isAr ? `تملك: ${lightnings}` : `Owned: ${lightnings}`}
                      </span>
                    </span>
                  </div>
                </div>

                <button
                  disabled={coins < 85}
                  onClick={() => {
                    soundManager.playClick();
                    if (coins >= 85) {
                      onBuyThunder(85);
                    }
                  }}
                  className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs shrink-0 ${
                    coins >= 85
                      ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 hover:scale-105 active:scale-95 shadow-yellow-950 font-black'
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
                  const isCakeStar = askin.id === 'cake_star';
                  const canAfford = isCakeStar ? (cakes || 0) >= 3 : coins >= askin.cost;

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
                              {isCakeStar ? (
                                <span className="text-pink-300 font-black">🎂 3 {isAr ? 'كعكات' : 'Cakes'}</span>
                              ) : (
                                <>
                                  <Sparkles className="w-3 h-3 text-amber-400 fill-amber-300" />
                                  {askin.cost} {isAr ? 'نقطة' : 'Coins'}
                                </>
                              )}
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
                            if (canAfford) {
                              if (isCakeStar && onBuyWithCake) {
                                onBuyWithCake('cakeStarArrowSkin', 3);
                              } else if (onUnlockArrowSkin) {
                                onUnlockArrowSkin(askin.id, askin.cost);
                              }
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shrink-0 ${
                            canAfford
                              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black shadow-xs hover:scale-105'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                          }`}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>{isAr ? (isCakeStar ? 'فتح (3🎂)' : 'فتح') : 'Unlock'}</span>
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
                  const isCakeSkin = skin.id === 'cake' || skin.id === 'cake_kingdom';
                  const canAfford = isCakeSkin ? (cakes || 0) >= 5 : coins >= skin.cost;

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
                              {isCakeSkin ? (
                                <span>🎂 5 {isAr ? 'كعكات' : 'Cakes'}</span>
                              ) : (
                                <>
                                  <Sparkles className="w-3 h-3 text-amber-400 fill-amber-300" />
                                  {skin.cost} {isAr ? 'نقطة' : 'Coins'}
                                </>
                              )}
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
                              if (isCakeSkin && onBuyWithCake) {
                                onBuyWithCake(skin.id === 'cake_kingdom' ? 'cakeKingdomSkin' : 'cakeSkin', 5);
                              } else {
                                onUnlockSkin(skin.id, skin.cost);
                              }
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shrink-0 ${
                            canAfford
                              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black shadow-xs hover:scale-105'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
                          }`}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>{isAr ? (isCakeSkin ? 'فتح (5🎂)' : 'فتح') : 'Unlock'}</span>
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
