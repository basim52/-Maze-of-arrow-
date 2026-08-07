import React from 'react';
import { X, Calendar, Sparkles, Rocket, Zap, Heart, ShieldCheck, Gift } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface FridayUpdatesModalProps {
  language: 'ar' | 'en';
  onClose: () => void;
}

export const FridayUpdatesModal: React.FC<FridayUpdatesModalProps> = ({
  language,
  onClose,
}) => {
  const isAr = language === 'ar';

  const updatesList = [
    {
      id: 'update-friday-comprehensive',
      dateAr: 'تحديث الجمعة الأسبوعي - العاصفة والمطر ومخبز الكعك وعملة الرعد ⛈️🧁⚡',
      dateEn: 'Friday Update - Storm, Rain, Cake Bakery & Thunder Currency ⛈️🧁⚡',
      isLatest: true,
      badgeAr: 'تحديث الجمعة الشامل 🔥',
      badgeEn: 'Friday Mega Update 🔥',
      icon: '⚡',
      titleAr: 'دليل ومزايا تحديث يوم الجمعة: العاصفة المطرية، مخبز الكعك والكاب كيك، وعملة الرعد!',
      titleEn: 'Friday Update Guide: Rainstorm, Cake & Cupcake Bakery & Thunder Currency!',
      featuresAr: [
        '⛈️ حدث العاصفة المطرية والصواعق ⚡: خض تحديات المطر الغزير وحساء العاصفة مع مؤثرات المطر والصواعق الرعدية الباهرة.',
        '⚡ أسهم الرعد وحساء الصاعقة: أسهم كهربائية مشعة تمنحك عملات رعدية مجانية ⚡ شاحنة للطاقة عند إطلاقها بنجاح.',
        '🪙 عملة الرعد ومتجر الصاعقة ⚡: اجمع عملات الرعد واستبدل بها حساء العاصفة 🍲 والمساعدات الصائبة للأسهم المستعصية.',
        '🧁 خلفية مخبز الكاب كيك 🧁✨: تمنحك 1 كاب كيك مجاني 🧁 في كل مرة تزيل فيها 35 سهماً أثناء اللعب مع عداد تقدم مباشر!',
        '🎂 خلفية مملكة الكعك الملكية 🎂🏰✨: تمنحك عند إكمال أي مرحلة احتمال 25% كعكة ملكية 🎂 + 25% كاب كيك 🧁!',
        '🍗 وجبات الطاقة والدجاج المحمر: تحويل الكاب كيك والكعك إلى دجاج محمر 🍗 وحساء رعد 🍲 لتفتيت أعقد مجموعات الأسهم.',
        '💎 المراحل الماسية الجديدة 💎: إضافة المزيد من المراحل الماسية بأسهم محنكة تمنح +7 نقاط مكافأة فورية!',
        '🚀 مراحل أحداث الفضاء الكونية 🌌: تم الإبقاء على جميع مراحل أحداث الفضاء الـ 25 ومتاحة دائماً في قائمة الأحداث!',
      ],
      featuresEn: [
        '⛈️ Rainstorm & Lightning Event ⚡: Experience heavy rainfall, thunder soups, and radiant electric arrow challenges.',
        '⚡ Electric Thunder Arrows: Glowing electric arrows granting free Thunder Coins ⚡ upon successful launch.',
        '🪙 Thunder Currency & Thunder Shop ⚡: Earn Thunder Coins and trade them for storm soups 🍲 and powerful boosters.',
        '🧁 Cupcake Bakery Theme 🧁✨: Grants 1 free Cupcake 🧁 every 35 arrows cleared with a real-time progress counter!',
        '🎂 Royal Cake Kingdom Background 🎂🏰✨: 25% chance for a royal cake 🎂 + 25% chance for a free cupcake 🧁 on level completion!',
        '🍗 Roasted Chicken Energy Meals: Convert cupcakes and cakes into roasted chickens 🍗 and thunder soups to clear tough grids.',
        '💎 Expanded Diamond Levels 💎: Added more Diamond Veteran Arrow levels granting +7 bonus points per arrow!',
        '🚀 Preserved Space Event Levels 🌌: All 25 cosmic space galaxy event levels remain intact and playable in the events tab!',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-2xl border-2 border-indigo-500/50 flex flex-col max-h-[90vh] relative animate-scale-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-lg ring-2 ring-indigo-300/40">
              📅
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>{isAr ? 'تحديثات يوم الجمعة 🚀' : 'Friday Weekly Updates 🚀'}</span>
              </h2>
              <p className="text-[11px] text-indigo-200/90 font-medium mt-0.5">
                {isAr
                  ? 'كل ما هو جديد ومميز يتم إضافته وتطويره كل يوم جمعة!'
                  : 'New features and level additions released every Friday!'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all cursor-pointer shrink-0"
            title={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Updates Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 my-1">
          {/* Top Announcement Card */}
          <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 border border-indigo-500/40 rounded-2xl p-3.5 shadow-md flex items-center gap-3">
            <span className="text-2xl animate-pulse">📢</span>
            <div className="text-xs leading-relaxed">
              <span className="font-bold text-indigo-300 block text-sm">
                {isAr ? 'موعد التحديث الأسبوعي:' : 'Weekly Update Schedule:'}
              </span>
              <span className="text-slate-200">
                {isAr
                  ? 'يتم إطلاق المحتوى والمزايا الجديدة تلقائياً كل يوم جمعة! ⏰'
                  : 'New content is released automatically every Friday! ⏰'}
              </span>
            </div>
          </div>

          {/* Updates Items */}
          {updatesList.map((update) => (
            <div
              key={update.id}
              className={`rounded-2xl p-4 border transition-all ${
                update.isLatest
                  ? 'bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 border-indigo-500/60 shadow-lg ring-1 ring-indigo-500/30'
                  : 'bg-slate-950/80 border-slate-800/80 opacity-90'
              }`}
            >
              {/* Card Badge & Date */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-xs font-black text-indigo-300 flex items-center gap-1.5">
                  <span>{update.icon}</span>
                  <span>{isAr ? update.dateAr : update.dateEn}</span>
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    update.isLatest
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm'
                      : 'bg-indigo-900/60 text-indigo-200 border border-indigo-700/50'
                  }`}
                >
                  {isAr ? update.badgeAr : update.badgeEn}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-base font-extrabold text-white mb-2 flex items-center gap-1.5">
                <span>{isAr ? update.titleAr : update.titleEn}</span>
              </h3>

              {/* Features List */}
              <ul className="space-y-1.5 text-xs text-slate-300 font-medium">
                {(isAr ? update.featuresAr : update.featuresEn).map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 leading-snug">
                    <span className="text-indigo-400 font-black select-none shrink-0 mt-0.5">✦</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Action */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-semibold">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>{isAr ? 'انتظروا المزيد كل جمعة!' : 'Stay tuned every Friday!'}</span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 cursor-pointer transition-all"
          >
            {isAr ? 'رائع، فهمت!' : 'Awesome, Got It!'}
          </button>
        </div>
      </div>
    </div>
  );
};
