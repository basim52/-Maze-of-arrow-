export type Direction = 'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right';

export type ArrowColor = 'cyan' | 'lime' | 'yellow' | 'purple' | 'pink' | 'orange';

export interface Arrow {
  id: string;
  gridX: number; // Head column on grid
  gridY: number; // Head row on grid
  layer?: number; // For overlapping height levels (3D layers)
  direction: Direction;
  color: ArrowColor;
  length: number; // Standard length in grid units
  type?: 'standard' | 'double' | 'bomb'; // Type of arrow: standard, double-headed bidirectional, or explosive bomb
  isDouble?: boolean;
  isBomb?: boolean;
  cells?: { x: number; y: number }[]; // Ordered list of grid coordinates relative to (gridX, gridY) or absolute grid positions
  isEscaped?: boolean;
  isFlying?: boolean;
  isBumping?: boolean;
  flyDirection?: { x: number; y: number };
}

export interface Level {
  id: number;
  nameAr: string;
  nameEn: string;
  difficulty: 'سهل' | 'متوسط' | 'صعب' | 'خبير' | 'صعب جداً';
  difficultyEn: 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Very Hard';
  gridSize: { cols: number; rows: number };
  arrows: Arrow[];
  maxDrops: number;
  requiresHammer?: boolean;
}

export type ThemeSkin = 'candy' | 'jelly' | 'neon' | 'cyber';

export interface PlayerStats {
  currentLevel: number;
  unlockedLevel: number;
  starsPerLevel: Record<number, number>; // levelId -> 1..3 stars
  coins: number;
  drops: number;
  selectedSkin: ThemeSkin;
  unlockedSkins: ThemeSkin[];
  soundEnabled: boolean;
  language: 'ar' | 'en';
  hammers: number;
  thunders: number;
}
