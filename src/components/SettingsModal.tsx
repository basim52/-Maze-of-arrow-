import React, { useState } from 'react';
import { X, Volume2, VolumeX, Globe, RefreshCw, HelpCircle, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface SettingsModalProps {
  soundEnabled: boolean;
  language: 'ar' | 'en';
  onToggleSound: () => void;
  onChangeLanguage: (lang: 'ar' | 'en') => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  soundEnabled,
  language,
  onToggleSound,
  onChangeLanguage,
  onResetProgress,
  onClose,
}) => {
  const isAr = language === 'ar';
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-2 border-slate-100 flex flex-col relative animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <h2 className="text-xl font-black text-slate-800">
            {showHelp
              ? isAr
                ? 'طريقة اللعب'
                : 'How to Play'
              : isAr
              ? 'الإعدادات'
              : 'Settings'}
          </h2>
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

        {showHelp ? (
          /* How to play screen */
          <div className="flex flex-col gap-4 text-slate-600 text-sm">
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 font-bold text-sky-800">
                <span className="w-6 h-6 rounded-full bg-sky-400 text-white flex items-center justify-center text-xs">
                  1
                </span>
                <span>{isAr ? 'اضغط على السهم' : 'Tap an Arrow'}</span>
              </div>
              <p className="text-xs text-sky-900/80 leading-relaxed">
                {isAr
                  ? 'اضغط على أي سهم ليرتفع وينطلق في اتجاه رأس السهم خارج المتاهة.'
                  : 'Tap any arrow to send it flying in the direction its head points.'}
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <span className="w-6 h-6 rounded-full bg-amber-400 text-white flex items-center justify-center text-xs">
                  2
                </span>
                <span>{isAr ? 'تجنب العوائق' : 'Avoid Blockers'}</span>
              </div>
              <p className="text-xs text-amber-900/80 leading-relaxed">
                {isAr
                  ? 'إذا كان هناك سهم آخر يمنع طريق السهم، سيهتز السهم وتخسر قطرة ماء!'
                  : 'If another arrow blocks its line of sight, it will bump and cost a water drop!'}
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <span className="w-6 h-6 rounded-full bg-emerald-400 text-white flex items-center justify-center text-xs">
                  3
                </span>
                <span>{isAr ? 'أفرغ المتاهة بالفوز' : 'Clear the Board'}</span>
              </div>
              <p className="text-xs text-emerald-900/80 leading-relaxed">
                {isAr
                  ? 'اختر الترتيب الصحيح لتحرير جميع الأسهم والفوز بالنجوم والمكافآت!'
                  : 'Find the right sequence to free all arrows and earn stars & coins!'}
              </p>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                setShowHelp(false);
              }}
              className="mt-2 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm cursor-pointer"
            >
              {isAr ? 'فهمت، عودة للإعدادات' : 'Got it, Back to Settings'}
            </button>
          </div>
        ) : (
          /* Main Settings screen */
          <div className="flex flex-col gap-4">
            {/* Sound Toggle Row */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-400" />
                )}
                <span className="font-bold text-slate-700 text-sm">
                  {isAr ? 'المؤثرات الصوتية' : 'Sound FX'}
                </span>
              </div>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onToggleSound();
                }}
                className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                  soundEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-1 transition-transform ${
                    soundEnabled ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Language Toggle Row */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-sky-500" />
                <span className="font-bold text-slate-700 text-sm">
                  {isAr ? 'اللغة' : 'Language'}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onChangeLanguage('ar');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    isAr
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  العربية
                </button>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onChangeLanguage('en');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    !isAr
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* How to Play Help Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                setShowHelp(true);
              }}
              className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-200/70 text-amber-800 hover:bg-amber-100/70 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-amber-600" />
                <span className="font-bold text-sm">
                  {isAr ? 'كيف تلعب؟' : 'How to Play'}
                </span>
              </div>
              <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
            </button>

            {/* Reset Progress Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                if (
                  confirm(
                    isAr
                      ? 'هل أنت تأكد من إعادة تعيين جميع المستويات والنجوم؟'
                      : 'Are you sure you want to reset all game progress?'
                  )
                ) {
                  onResetProgress();
                }
              }}
              className="flex items-center justify-center gap-2 mt-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 font-bold text-xs transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{isAr ? 'إعادة تعيين التقدم' : 'Reset Progress'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
