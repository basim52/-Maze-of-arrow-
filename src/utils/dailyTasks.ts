export interface TaskTemplate {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  target: number;
  statKey: 'levelsCompleted' | 'arrowsEscaped' | 'hammersUsed' | 'chocolatesUsed' | 'creamsUsed' | 'rainLevelsPlayed' | 'diamondEscaped' | 'galaxyCompleted' | 'longCompleted';
  rewardType: 'coins' | 'hammer' | 'chocolate' | 'cream' | 'thunder';
  rewardAmount: number;
  icon: string;
}

export const TASK_POOLS: TaskTemplate[][] = [
  // Set 0
  [
    {
      id: 'task-set0-1',
      titleAr: 'مبتدئ الأسهم',
      titleEn: 'Arrow Rookie',
      descAr: 'إكمال 3 مراحل بنجاح في أي نمط لعب',
      descEn: 'Complete 3 levels in any game mode',
      target: 3,
      statKey: 'levelsCompleted',
      rewardType: 'coins',
      rewardAmount: 20,
      icon: '🎯',
    },
    {
      id: 'task-set0-2',
      titleAr: 'صياد الأسهم',
      titleEn: 'Arrow Hunter',
      descAr: 'إرجاع 15 سهماً بنجاح خارج اللوحة',
      descEn: 'Successfully escape 15 arrows off board',
      target: 15,
      statKey: 'arrowsEscaped',
      rewardType: 'coins',
      rewardAmount: 25,
      icon: '🏹',
    },
    {
      id: 'task-set0-3',
      titleAr: 'قوة المطرقة',
      titleEn: 'Hammer Power',
      descAr: 'استخدام المطرقة 1 مرة لتدمير سهم عائق',
      descEn: 'Use Hammer 1 time to destroy a blocking arrow',
      target: 1,
      statKey: 'hammersUsed',
      rewardType: 'hammer',
      rewardAmount: 1,
      icon: '🔨',
    },
  ],
  // Set 1
  [
    {
      id: 'task-set1-1',
      titleAr: 'تحدي العواصف والرعد',
      titleEn: 'Thunder & Storm Challenge',
      descAr: 'لعب 1 مرحلة في نمط أحداث المطر والرعد',
      descEn: 'Play 1 level in Thunder & Rain Storm mode',
      target: 1,
      statKey: 'rainLevelsPlayed',
      rewardType: 'thunder',
      rewardAmount: 1,
      icon: '⚡',
    },
    {
      id: 'task-set1-2',
      titleAr: 'سيد الإفلات',
      titleEn: 'Escape Master',
      descAr: 'إرجاع 20 سهماً بنجاح خارج اللوحة',
      descEn: 'Successfully escape 20 arrows off board',
      target: 20,
      statKey: 'arrowsEscaped',
      rewardType: 'coins',
      rewardAmount: 30,
      icon: '🏹',
    },
    {
      id: 'task-set1-3',
      titleAr: 'استراحة الشوكولاتة',
      titleEn: 'Chocolate Break',
      descAr: 'استخدام قطعة شوكولاتة 1 مرة لإرجاع الأسهم',
      descEn: 'Use Chocolate bar 1 time to escape arrows',
      target: 1,
      statKey: 'chocolatesUsed',
      rewardType: 'chocolate',
      rewardAmount: 1,
      icon: '🍫',
    },
  ],
  // Set 2
  [
    {
      id: 'task-set2-1',
      titleAr: 'صياد الماس',
      titleEn: 'Diamond Hunter',
      descAr: 'إرجاع سهم محنك الماسي 1 مرة',
      descEn: 'Escape 1 Diamond Veteran arrow',
      target: 1,
      statKey: 'diamondEscaped',
      rewardType: 'coins',
      rewardAmount: 30,
      icon: '💎',
    },
    {
      id: 'task-set2-2',
      titleAr: 'خبير المراحل',
      titleEn: 'Level Veteran',
      descAr: 'إكمال 4 مراحل بنجاح في أي نمط لعب',
      descEn: 'Complete 4 levels in any game mode',
      target: 4,
      statKey: 'levelsCompleted',
      rewardType: 'coins',
      rewardAmount: 35,
      icon: '🌟',
    },
    {
      id: 'task-set2-3',
      titleAr: 'لمسة الكريمة',
      titleEn: 'Cream Touch',
      descAr: 'استخدام الكريمة 1 مرة لتذويب الأسهم',
      descEn: 'Use Cream 1 time to melt arrows',
      target: 1,
      statKey: 'creamsUsed',
      rewardType: 'cream',
      rewardAmount: 1,
      icon: '🍦',
    },
  ],
  // Set 3
  [
    {
      id: 'task-set3-1',
      titleAr: 'مستكشف المجرة',
      titleEn: 'Galaxy Explorer',
      descAr: 'إكمال مرحلة واحدة في أحداث المجرة الكونية',
      descEn: 'Complete 1 level in Cosmic Galaxy events',
      target: 1,
      statKey: 'galaxyCompleted',
      rewardType: 'coins',
      rewardAmount: 30,
      icon: '🚀',
    },
    {
      id: 'task-set3-2',
      titleAr: 'بطل الأسهم',
      titleEn: 'Arrow Champion',
      descAr: 'إرجاع 25 سهماً بنجاح خارج اللوحة',
      descEn: 'Successfully escape 25 arrows off board',
      target: 25,
      statKey: 'arrowsEscaped',
      rewardType: 'coins',
      rewardAmount: 40,
      icon: '🏆',
    },
    {
      id: 'task-set3-3',
      titleAr: 'محترف المطرقة',
      titleEn: 'Hammer Master',
      descAr: 'استخدام المطرقة 1 مرة لتسحيق الأسهم',
      descEn: 'Use Hammer 1 time to crush arrows',
      target: 1,
      statKey: 'hammersUsed',
      rewardType: 'hammer',
      rewardAmount: 1,
      icon: '🔨',
    },
  ],
];

export function getActiveDailyTasks(lastResetTime: number) {
  const dayIndex = Math.floor(lastResetTime / (24 * 60 * 60 * 1000));
  const poolIndex = Math.abs(dayIndex) % TASK_POOLS.length;
  return TASK_POOLS[poolIndex];
}
