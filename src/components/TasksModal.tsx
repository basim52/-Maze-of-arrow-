import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Sparkles, Clock } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { getActiveDailyTasks, TaskTemplate } from '../utils/dailyTasks';

export interface TaskItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  target: number;
  current: number;
  rewardType: 'coins' | 'hammer' | 'chocolate' | 'cream' | 'thunder';
  rewardAmount: number;
  icon: string;
}

interface TasksModalProps {
  language: 'ar' | 'en';
  coins?: number;
  lastTasksResetTimestamp?: number;
  taskStats?: {
    levelsCompleted: number;
    arrowsEscaped: number;
    hammersUsed: number;
    chocolatesUsed: number;
    creamsUsed: number;
    rainLevelsPlayed: number;
    diamondEscaped: number;
    goldenThroneCompleted: number;
    longCompleted: number;
    galaxyCompleted: number;
    claimedTaskIds: string[];
  };
  onClaimTask: (taskId: string, rewardType: 'coins' | 'hammer' | 'chocolate' | 'cream' | 'thunder', rewardAmount: number) => void;
  onClose: () => void;
}

const DEFAULT_STATS = {
  levelsCompleted: 0,
  arrowsEscaped: 0,
  hammersUsed: 0,
  chocolatesUsed: 0,
  creamsUsed: 0,
  rainLevelsPlayed: 0,
  diamondEscaped: 0,
  goldenThroneCompleted: 0,
  longCompleted: 0,
  galaxyCompleted: 0,
  claimedTaskIds: [],
};

export const TasksModal: React.FC<TasksModalProps> = ({
  language,
  coins = 0,
  lastTasksResetTimestamp = Date.now(),
  taskStats = DEFAULT_STATS,
  onClaimTask,
  onClose,
}) => {
  const isAr = language === 'ar';
  const safeStats = { ...DEFAULT_STATS, ...taskStats };

  // Countdown clock state for 24h timer
  const [timeLeftStr, setTimeLeftStr] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      const nextReset = lastTasksResetTimestamp + 24 * 60 * 60 * 1000;
      const now = Date.now();
      const diffMs = Math.max(0, nextReset - now);

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

      const hStr = String(hours).padStart(2, '0');
      const mStr = String(mins).padStart(2, '0');
      const sStr = String(secs).padStart(2, '0');

      if (isAr) {
        setTimeLeftStr(`${hStr}س ${mStr}د ${sStr}ث`);
      } else {
        setTimeLeftStr(`${hStr}h ${mStr}m ${sStr}s`);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [lastTasksResetTimestamp, isAr]);

  const activeTemplates: TaskTemplate[] = getActiveDailyTasks(lastTasksResetTimestamp);

  const ALL_TASKS: TaskItem[] = activeTemplates.map((template) => ({
    id: template.id,
    titleAr: template.titleAr,
    titleEn: template.titleEn,
    descAr: template.descAr,
    descEn: template.descEn,
    target: template.target,
    current: Number(safeStats[template.statKey] || 0),
    rewardType: template.rewardType,
    rewardAmount: template.rewardAmount,
    icon: template.icon,
  }));

  const claimableTasks = ALL_TASKS.filter(
    (task) => task.current >= task.target && !(safeStats.claimedTaskIds || []).includes(task.id)
  );

  const handleClaimAll = () => {
    claimableTasks.forEach((task) => {
      onClaimTask(task.id, task.rewardType, task.rewardAmount);
    });
  };

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in"
    >
      <div className="w-full max-w-lg bg-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-2xl border-2 border-sky-500/40 flex flex-col max-h-[90vh] relative animate-scale-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 shrink-0 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-2xl shadow-md border border-sky-300/40 shrink-0">
              📋
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2 flex-wrap">
                <span>{isAr ? 'المهام اليومية المتجددة' : 'Daily 24h Tasks'}</span>
                <span className="text-[10px] sm:text-xs bg-sky-500/30 text-sky-300 font-bold px-2.5 py-0.5 rounded-full border border-sky-400/40 shrink-0">
                  {isAr ? 'مهام جديدة كل 24س' : 'New every 24h'}
                </span>
              </h2>
              <p className="text-xs text-sky-200/80 font-medium truncate mt-0.5 flex items-center gap-1">
                <span>{isAr ? 'تتغير المهام وتستلم المكافآت تلقائياً!' : 'Tasks refresh & rewards auto-claim!'}</span>
              </p>
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

        {/* 24-Hour Countdown Timer Bar */}
        <div className="mb-3 px-3 py-2 rounded-2xl bg-slate-950/90 border border-sky-500/30 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
            <Clock className="w-4 h-4 text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{isAr ? 'تتجدد المهام بعد:' : 'Tasks Reset In:'}</span>
          </div>
          <div className="text-xs sm:text-sm font-black text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-xl border border-amber-500/40 font-mono tracking-wider shadow-inner">
            {timeLeftStr}
          </div>
        </div>

        {/* Claim All Header Banner Button (If any task is completed & unclaimed) */}
        {claimableTasks.length > 0 && (
          <div className="mb-3 shrink-0">
            <button
              onClick={() => {
                soundManager.playVictory();
                handleClaimAll();
              }}
              className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 border border-emerald-300 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer animate-pulse"
            >
              <Sparkles className="w-5 h-5 text-amber-900 fill-amber-300" />
              <span>
                {isAr
                  ? `استلام جميع الجوائز المتاحة (${claimableTasks.length}) 🎁`
                  : `Claim All Available Rewards (${claimableTasks.length}) 🎁`}
              </span>
            </button>
          </div>
        )}

        {/* Tasks List Container */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
          {ALL_TASKS.map((task) => {
            const isClaimed = (safeStats.claimedTaskIds || []).includes(task.id);
            const isCompleted = task.current >= task.target;
            const progressPercent = Math.min(100, Math.round((task.current / task.target) * 100));

            const getRewardBadge = () => {
              if (task.rewardType === 'coins') {
                return (
                  <span className="flex items-center gap-1.5 text-amber-300 font-black text-xs sm:text-sm bg-amber-950/90 px-3 py-1 rounded-full border border-amber-500/50 shadow-xs shrink-0 whitespace-nowrap">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-300 shrink-0" />
                    +{task.rewardAmount} {isAr ? 'نقطة' : 'Pts'}
                  </span>
                );
              }
              if (task.rewardType === 'thunder') {
                return (
                  <span className="flex items-center gap-1.5 text-sky-300 font-black text-xs sm:text-sm bg-sky-950/90 px-3 py-1 rounded-full border border-sky-500/50 shadow-xs shrink-0 whitespace-nowrap">
                    <span>⚡</span>
                    +{task.rewardAmount} {isAr ? 'رعد' : 'Thunder'}
                  </span>
                );
              }
              if (task.rewardType === 'hammer') {
                return (
                  <span className="flex items-center gap-1.5 text-amber-200 font-black text-xs sm:text-sm bg-stone-900 px-3 py-1 rounded-full border border-amber-500/50 shadow-xs shrink-0 whitespace-nowrap">
                    <span>🔨</span>
                    +{task.rewardAmount} {isAr ? 'مطرقة' : 'Hammer'}
                  </span>
                );
              }
              if (task.rewardType === 'chocolate') {
                return (
                  <span className="flex items-center gap-1.5 text-amber-100 font-black text-xs sm:text-sm bg-amber-950/90 px-3 py-1 rounded-full border border-amber-600/50 shadow-xs shrink-0 whitespace-nowrap">
                    <span>🍫</span>
                    +{task.rewardAmount} {isAr ? 'شوكولاتة' : 'Choco'}
                  </span>
                );
              }
              if (task.rewardType === 'cream') {
                return (
                  <span className="flex items-center gap-1.5 text-rose-200 font-black text-xs sm:text-sm bg-rose-950/90 px-3 py-1 rounded-full border border-rose-400/50 shadow-xs shrink-0 whitespace-nowrap">
                    <span>🍦</span>
                    +{task.rewardAmount} {isAr ? 'كريمة' : 'Cream'}
                  </span>
                );
              }
              return null;
            };

            return (
              <div
                key={task.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col gap-3 relative overflow-hidden ${
                  isClaimed
                    ? 'bg-slate-950/70 border-slate-800/80 opacity-70'
                    : isCompleted
                    ? 'bg-gradient-to-r from-sky-950/95 via-slate-900 to-indigo-950/95 border-sky-400 shadow-md ring-1 ring-sky-300/30'
                    : 'bg-slate-950/90 border-slate-800'
                }`}
              >
                {/* Top Section: Icon + Text + Reward */}
                <div className="flex items-start justify-between gap-3 min-w-0">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-2xl shrink-0 border border-slate-700/80 shadow-xs mt-0.5">
                      {task.icon}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <h3 className="font-black text-white text-sm sm:text-base leading-snug break-words">
                        {isAr ? task.titleAr : task.titleEn}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-normal font-medium break-words">
                        {isAr ? task.descAr : task.descEn}
                      </p>
                    </div>
                  </div>

                  {getRewardBadge()}
                </div>

                {/* Bottom Section: Progress bar & Claim Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4 pt-2 border-t border-slate-800/80">
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>{isAr ? 'التقدم' : 'Progress'}</span>
                      <span className="font-black text-sky-300">
                        {task.current} / {task.target}
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCompleted
                            ? 'bg-gradient-to-r from-sky-400 to-emerald-400'
                            : 'bg-gradient-to-r from-sky-500 to-blue-600'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="shrink-0 flex justify-end">
                    {isClaimed ? (
                      <span className="flex items-center gap-1.5 text-xs font-black text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/40 shrink-0 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{isAr ? 'مستلمة تلقائياً 🎁' : 'Auto-Claimed 🎁'}</span>
                      </span>
                    ) : isCompleted ? (
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onClaimTask(task.id, task.rewardType, task.rewardAmount);
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-slate-950 font-black text-xs sm:text-sm hover:scale-105 active:scale-95 cursor-pointer shadow-md shadow-emerald-950 shrink-0 animate-bounce"
                      >
                        <span>{isAr ? 'استلام الجائزة 🎁' : 'Claim Reward 🎁'}</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-slate-800/90 text-slate-400 font-bold text-xs shrink-0 border border-slate-700">
                        {isAr ? 'قيد التقدم' : 'In Progress'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
