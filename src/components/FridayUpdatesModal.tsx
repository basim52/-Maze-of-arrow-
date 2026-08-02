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
      id: 'update-space-galaxy',
      dateAr: 'تحديث الجمعة الأسبوعي - تحديث الفضاء والمجرة الشامل 🌌✨',
      dateEn: 'Friday Update - Full Space & Galaxy Expansion 🌌✨',
      isLatest: true,
      badgeAr: 'تحديث الفضاء الأكبر 🚀',
      badgeEn: 'Major Space Update 🚀',
      icon: '🛸',
      titleAr: 'دليل ومزايا تحديث الفضاء والمجرة الكونية الشامل',
      titleEn: 'Comprehensive Space & Galaxy Update Guide',
      featuresAr: [
        '🚀 25 مرحلة مجرة فضائية جديدة: مراحل مصممة بعناية فائقة بتحديات فضائية متدرجة من السهل إلى أصعب مرحلة وحش فضائي!',
        '⭐ أسهم النجوم الكونية 🌟: أسهم فضائية براقة تمنحك 5x نقاط فضائية وعملات ذهبية ضخمة عند تحريرها بنجاح.',
        '🌌 خلفية السدم الكونية والنجوم: مظهر فضائي أرجواني ساحر مع كواكب وشهب متلألئة تحوم في أرجاء الرقعة.',
        '✨ نقاط العاصفة النقطية المشعة: تصميم خلفية العاصفة النقطية المتلألئة بنقاط كهربائية ونجمية تفاعلية.',
        '🪙 نظام العملات والجوائز الفضائية: كسب عملات ذهبية مجانية وتأثيرات بصرية ممتازة عند فتح وإكمال مراحل المجرة.',
        '🎵 المؤثرات الصوتية الفضائية: أصوات سينمائية كوزمية ممتازة وتأثيرات انطلاق الأسهم في الفضاء العميق.',
        '🎡 عجلة الحظ اليومية 🎁: أدر العجلة كل يوم مجاناً واحصل على مكافآت وعملات ومساعدات قيّمة.',
        '🔨 أداة المطرقة الفولاذية ⚡: تكسير الأسهم المعقدة بسهولة وتخطي العقد المستحيلة بنقرة واحدة.',
      ],
      featuresEn: [
        '🚀 25 New Galaxy Event Levels: Unique space levels ranging from easy orbits to the ultimate boss level!',
        '⭐ Cosmic Star Arrows 🌟: Sparkling star arrows giving 5x bonus points and bonus coins when escaped.',
        '🌌 Purple Cosmic Nebula Environment: Radiant space atmosphere with glowing stars, shooting meteors, and planets.',
        '✨ Point Storm Background: Enhanced thunder background with glowing interactive radiant dot particles.',
        '🪙 Space Coin Rewards: Earn bonus coins and stellar visual effects with every completed space puzzle.',
        '🎵 Deep Space SFX: Cinematic cosmic audio effects and high-speed arrow launch sounds.',
        '🎡 Daily Lucky Wheel 🎁: Spin every day for free coins, boosts, and special rewards.',
        '🔨 Steel Hammer Tool ⚡: Smash complex arrows and bypass impossible deadlocks instantly.',
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
