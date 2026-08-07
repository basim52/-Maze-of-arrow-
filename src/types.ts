export type Direction =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'up-left'
  | 'up-right'
  | 'down-left'
  | 'down-right'
  | 'slight-up-right'
  | 'slight-up-left'
  | 'slight-down-right'
  | 'slight-down-left';

export type ArrowColor = 'cyan' | 'lime' | 'yellow' | 'purple' | 'pink' | 'orange';

export interface Arrow {
  id: string;
  gridX: number; // Head column on grid
  gridY: number; // Head row on grid
  layer?: number; // For overlapping height levels (3D layers)
  direction: Direction;
  color: ArrowColor;
  length: number; // Standard length in grid units
  type?: 'standard' | 'double' | 'bomb' | 'ghost' | 'star' | 'diamond' | 'ice' | 'thunder' | 'silver' | 'timed_bomb'; // Type of arrow
  isDouble?: boolean;
  isBomb?: boolean;
  isTimedBomb?: boolean;
  timer?: number;
  isGhost?: boolean;
  isStar?: boolean;
  isDiamond?: boolean;
  isIce?: boolean;
  isThunder?: boolean;
  isSilver?: boolean;
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
  difficulty: 'سهل' | 'متوسط' | 'صعب' | 'خبير' | 'صعب جداً' | 'صعب جداً جداً';
  difficultyEn: 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Very Hard' | 'Extremely Hard';
  gridSize: { cols: number; rows: number };
  arrows: Arrow[];
  maxDrops: number;
  requiresHammer?: boolean;
  timeLimitSeconds?: number;
}

export type ThemeSkin = 'candy' | 'jelly' | 'neon' | 'cyber' | 'nebula' | 'supernova' | 'rainstorm' | 'hammer' | 'crystal_neon' | 'golden_throne' | 'midnight_thunder' | 'cake' | 'cake_kingdom' | 'emerald_palace';

export type ArrowSkin = 'classic' | 'neon' | 'gold' | 'crystal' | 'dragon' | 'cyber' | 'rainbow' | 'phoenix' | 'galaxy' | 'cake_star' | 'thunder_storm';

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  level: number;
  status: 'online' | 'offline' | 'ingame';
  isFavorite?: boolean;
  lastSeenAr?: string;
  lastSeenEn?: string;
}

export type ItemType = 'coins' | 'thunders' | 'hammers' | 'cakes' | 'creams' | 'chocolates' | 'tomatoes' | 'spaceCreams';

export interface TradeItem {
  type: ItemType;
  amount: number;
}

export interface TradeOffer {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  offeredItems: TradeItem[];
  requestedItems: TradeItem[];
  status: 'pending' | 'accepted' | 'declined';
  timestamp: string;
}

export interface PlayerStats {
  currentLevel: number;
  unlockedLevel: number;
  starsPerLevel: Record<number, number>; // levelId -> 1..3 stars
  coins: number;
  drops: number;
  selectedSkin: ThemeSkin;
  unlockedSkins: ThemeSkin[];
  selectedArrowSkin?: ArrowSkin;
  unlockedArrowSkins?: ArrowSkin[];
  soundEnabled: boolean;
  language: 'ar' | 'en';
  hammers: number;
  thunders: number;
  lightnings?: number;
  creams: number;
  creamHammers?: number;
}
