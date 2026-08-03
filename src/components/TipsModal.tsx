import React from 'react';
import { X, Lightbulb, Sparkles, ShoppingBag, ArrowRight, ShieldCheck, Zap, Star } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface TipsModalProps {
  language: 'ar' | 'en';
  onOpenShopBackgrounds: () => void;
  onClose: () => void;
}

export const TipsModal: React.FC<TipsModalProps> = ({
  language,
  onOpenShopBackgrounds,
  onClose,
}) => {
  const isAr = language === 'ar';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-2xl border-2 border-amber-400/50 flex flex-col relative animate-scale-up max-h-[92vh] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500/50">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center text-xl shadow-md border border-amber-300/40 shrink-0">
              💡
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-amber-300 leading-tight flex items-center gap-1.5">
                <span>{isAr ? 'نصائح وإرشادات اللعبة' : 'Game Tips & Strategies'}</span>
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-300 animate-pulse" />
              </h2>
              <p className="text-[11px] text-amber-200/80 font-medium">
                {isAr ? 'دليلك الشامل للفوز وتجميع النقاط والمزايا السحرية' : 'Your complete guide to winning & mastering bonus perks'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FEATURED BANNER: Buy Backgrounds (اشتر الخلفيات) */}
        <div className="p-4 rounded-2xl border-2 border-amber-400/90 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900/90 flex flex-col gap-3 shadow-xl relative overflow-hidden mb-4">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-amber-500/30 text-amber-200 text-xs font-black px-3 py-1 rounded-full border border-amber-400/50 shadow-xs">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAr ? 'ميزة هامة: اشترِ الخلفيات! 🎨' : 'Featured: Buy Backgrounds! 🎨'}</span>
            </div>
            <span className="text-[10px] font-black text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full shadow-xs">
              {isAr ? 'مزايا سحرية ⚡' : 'Special Perks ⚡'}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-bold text-amber-100 leading-relaxed">
            {isAr
              ? 'اشترِ الخلفيات! لأن بعضها يمتلك ميزات وسحريات جبارة تُكافئك بقطع ومكافآت مجانية أثناء خروج الأسهم!'
              : 'Buy backgrounds! Many of them feature powerful magical perks that award bonus items & coins as arrows escape!'}
          </p>

          {/* Background Perks List */}
          <div className="flex flex-col gap-2 bg-slate-950/60 p-3 rounded-xl border border-amber-500/30 text-xs">
            {/* Golden Throne Background */}
            <div className="flex items-start gap-2 text-amber-200">
              <span className="text-base shrink-0">👑</span>
              <div className="flex flex-col">
                <span className="font-black text-amber-300">
                  {isAr ? 'خلفية العرش الذهبي 👑🏛️ (٤٠٠ نقطة - ميزة ضرب ٢ فلوس):' : 'Golden Throne Theme 👑🏛️ (400 Coins - 2x Coins Perk):'}
                </span>
                <span className="text-[11px] text-amber-100/90">
                  {isAr
                    ? 'تغطي الشاشة بالكامل بطابع ملكي فاخر، وتضاعف عملات الفوز ×٢ في جميع المراحل وللأسهم المحنكة! 👑🪙'
                    : 'Full screen royal golden throne background that doubles all level victory coins (2x) and veteran arrow coins! 👑🪙'}
                </span>
              </div>
            </div>

            {/* Crystal Neon Background */}
            <div className="flex items-start gap-2 text-cyan-200 border-t border-slate-800 pt-2">
              <span className="text-base shrink-0">💎</span>
              <div className="flex flex-col">
                <span className="font-black text-cyan-300">
                  {isAr ? 'خلفية النيون الكرستالية 💎✨ (١٢٤ نقطة - ميزة النيون):' : 'Crystal Neon Theme 💎✨ (124 Coins - Neon Perk):'}
                </span>
                <span className="text-[11px] text-cyan-100/90">
                  {isAr
                    ? 'تمنحك كعكة مجانية 🎂 + ٣٠ نقطة عند إزالة كل ٥٠ سهم مع عداد يفتح عند استخدام هذه الخلفية! 💎🎂'
                    : 'Grants 1 free cake 🎂 + 30 coins every 50 arrows removed with a live counter unlocked when using this background! 💎🎂'}
                </span>
              </div>
            </div>

            {/* Hammer Background */}
            <div className="flex items-start gap-2 text-amber-200">
              <span className="text-base shrink-0">🔨</span>
              <div className="flex flex-col">
                <span className="font-black text-amber-300">
                  {isAr ? 'خلفية المطرقة الفولاذية 🔨 (٢٧٨ نقطة - ميزة المطرقة):' : 'Steel Hammer Theme 🔨 (278 Coins - Hammer Perk):'}
                </span>
                <span className="text-[11px] text-amber-100/90">
                  {isAr
                    ? 'تمنحك مطرقة سحرية مضمونة ١٠٠٪ عند خروج ٢٠٠ سهم مع عداد تفاعلي يظهر أثناء اللعب! 🔨✨'
                    : 'Grants a 100% guaranteed magic hammer at 200 escaped arrows with a live progress counter! 🔨✨'}
                </span>
              </div>
            </div>

            {/* Rainstorm Background */}
            <div className="flex items-start gap-2 text-sky-200 border-t border-slate-800 pt-2">
              <span className="text-base shrink-0">⛈️</span>
              <div className="flex flex-col">
                <span className="font-black text-sky-300">
                  {isAr ? 'خلفية عاصفة المطر والرعد ⛈️ (١٨٧ نقطة):' : 'Rainstorm Theme ⛈️ (187 Coins):'}
                </span>
                <span className="text-[11px] text-sky-100/90">
                  {isAr
                    ? 'احتمال ٢٧٪ لإسقاط من ٢ إلى ٦ عملات رعد ⚡ عند خروج الأسهم! ⛈️⚡'
                    : '27% chance to drop 2 to 6 Thunder bolt currency ⚡ when arrows escape! ⛈️⚡'}
                </span>
              </div>
            </div>

            {/* Space Nebula */}
            <div className="flex items-start gap-2 text-purple-200 border-t border-slate-800 pt-2">
              <span className="text-base shrink-0">🌌</span>
              <div className="flex flex-col">
                <span className="font-black text-purple-300">
                  {isAr ? 'خلفيات سديم الفضاء والسوبرنوفا 🌌:' : 'Cosmic Nebula & Supernova 🌌:'}
                </span>
                <span className="text-[11px] text-purple-100/90">
                  {isAr
                    ? 'أجواء فضائية ساحرة تضفي إثارة وراحة بصرية فائقة أثناء حل اللغز.'
                    : 'Breathtaking space atmosphere for an immersive puzzle experience.'}
                </span>
              </div>
            </div>
          </div>

          {/* Direct CTA Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenShopBackgrounds();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-200"
          >
            <ShoppingBag className="w-4 h-4 text-slate-950" />
            <span>{isAr ? 'اشترِ الخلفيات الآن من المتجر 🎨🛒' : 'Buy Backgrounds Now in Shop 🎨🛒'}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>

        {/* GAMEPLAY TIPS SECTION */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'إرشادات ونصائح ذكية للفوز' : 'Smart Winning Strategies'}</span>
          </h3>

          <div className="grid grid-cols-1 gap-2.5 text-xs">
            {/* Tip 1 */}
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shrink-0 text-base">
                🎯
              </div>
              <div className="flex flex-col">
                <span className="font-black text-white text-xs">
                  {isAr ? 'ابدأ بالأسهم الحرة الخارجية' : 'Clear Free Outer Arrows First'}
                </span>
                <span className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  {isAr
                    ? 'افحص اتجاهات الأسهم بعناية، وحرر الأسهم الشاغرة التي يتجه سهمها إلى خارج اللوحة دون عوائق.'
                    : 'Check arrow directions carefully and escape unblocked arrows pointing outward.'}
                </span>
              </div>
            </div>

            {/* Tip 2 */}
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black shrink-0 text-base">
                ⭐
              </div>
              <div className="flex flex-col">
                <span className="font-black text-amber-300 text-xs">
                  {isAr ? 'حافظ على نجوم البقاء لزيادة النقاط!' : 'Preserve Survival Stars for Bonus Coins!'}
                </span>
                <span className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  {isAr
                    ? 'كل نجمة بقاء تحافظ عليها عند نهاية المرحلة تمنحك نقاطاً إضافية (٨ نقاط في المراحل الطويلة و٤ نقاط في المراحل العادية!).'
                    : 'Each remaining Survival Star awards bonus coins on completion (8 pts in Long levels, 4 pts in Main levels!).'}
                </span>
              </div>
            </div>

            {/* Tip 3 */}
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black shrink-0 text-base">
                🔨
              </div>
              <div className="flex flex-col">
                <span className="font-black text-purple-300 text-xs">
                  {isAr ? 'استخدم المطرقة والأدوات عند العثور على انسداد' : 'Use Hammer & Power-ups When Stuck'}
                </span>
                <span className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  {isAr
                    ? 'المطرقة 🔨 تكسر سهماً واحداً، الشوكولاتة 🍫 تزيل سهمين، مطرقة الكريمة 🍦🔨 تزيل ٣ أسهم، والكريمة 🍦 تزيل ٥ أسهم!'
                    : 'Hammer 🔨 smashes 1 arrow, Chocolate 🍫 removes 2 arrows, Cream Hammer 🍦🔨 removes 3 arrows, and Cream 🍦 clears 5 arrows!'}
                </span>
              </div>
            </div>

            {/* Tip 4 */}
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black shrink-0 text-base">
                💎
              </div>
              <div className="flex flex-col">
                <span className="font-black text-cyan-300 text-xs">
                  {isAr ? 'اقتنص الأسهم الماسية والنجمية' : 'Target Diamond & Star Bonus Arrows'}
                </span>
                <span className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  {isAr
                    ? 'الأسهم الماسية 💎 تمنحك +٧ نقاط فور تحريرها، والأسهم النجمية 🌟 تمنحك +٥ نقاط!'
                    : 'Diamond arrows 💎 grant +7 coins instantly, while Star arrows 🌟 give +5 bonus coins!'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs transition-colors cursor-pointer text-center"
          >
            {isAr ? 'فهمت ذلك، ابدأ اللعب! 🚀' : 'Got it, let\'s play! 🚀'}
          </button>
        </div>

      </div>
    </div>
  );
};
