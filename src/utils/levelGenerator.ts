import { Arrow, Direction, Level, ArrowColor } from '../types';

export const DIRECTION_VECTORS: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  'up-left': { x: -1, y: -1 },
  'up-right': { x: 1, y: -1 },
  'down-left': { x: -1, y: 1 },
  'down-right': { x: 1, y: 1 },
};

// Get all grid cells occupied by an arrow
export function getArrowOccupiedCells(arrow: Arrow): { x: number; y: number }[] {
  if (arrow.cells && arrow.cells.length > 0) {
    return arrow.cells;
  }
  const occupied: { x: number; y: number }[] = [];
  const dir = DIRECTION_VECTORS[arrow.direction];
  for (let i = 0; i < (arrow.length || 1); i++) {
    occupied.push({
      x: arrow.gridX + dir.x * i,
      y: arrow.gridY + dir.y * i,
    });
  }
  return occupied;
}

// Check if a point is occupied by any active arrow
export function getArrowOccupyingTile(
  gridX: number,
  gridY: number,
  arrows: Arrow[],
  excludeArrowId?: string
): Arrow | null {
  for (const arrow of arrows) {
    if (arrow.isEscaped || arrow.id === excludeArrowId) continue;
    const cells = getArrowOccupiedCells(arrow);
    if (cells.some((c) => c.x === gridX && c.y === gridY)) {
      return arrow;
    }
  }
  return null;
}

// Find if an arrow can escape freely without hitting any other arrow in its forward path
export function canArrowEscape(
  arrow: Arrow,
  allArrows: Arrow[],
  gridCols: number = 16,
  gridRows: number = 10
): { canEscape: boolean; blocker: Arrow | null } {
  const vec = DIRECTION_VECTORS[arrow.direction];
  const len = arrow.length || 1;

  const maxSteps = Math.max(gridCols, gridRows) + 4;
  for (let step = 1; step <= maxSteps; step++) {
    const headX = arrow.gridX + vec.x * (len - 1 + step);
    const headY = arrow.gridY + vec.y * (len - 1 + step);

    // If head leaves grid boundaries, the arrow has escaped!
    if (headX < 0 || headX >= gridCols || headY < 0 || headY >= gridRows) {
      return { canEscape: true, blocker: null };
    }

    const blocker = getArrowOccupyingTile(headX, headY, allArrows, arrow.id);
    if (blocker) {
      return { canEscape: false, blocker };
    }
  }

  return { canEscape: true, blocker: null };
}

// Check if any arrows overlap on the board
export function hasOverlappingCells(arrows: Arrow[]): boolean {
  const occupied = new Set<string>();
  for (const arrow of arrows) {
    if (arrow.isEscaped) continue;
    const cells = getArrowOccupiedCells(arrow);
    for (const c of cells) {
      const key = `${c.x},${c.y}`;
      if (occupied.has(key)) {
        return true;
      }
      occupied.add(key);
    }
  }
  return false;
}

// Automated Solver to verify that a level has NO deadlocks and is 100% solvable
export function isLevelSolvable(level: Level): boolean {
  if (hasOverlappingCells(level.arrows)) return false;

  const currentArrows = level.arrows.map((a) => ({ ...a, isEscaped: false }));
  const total = currentArrows.length;
  let escapedCount = 0;

  let progress = true;
  while (progress && escapedCount < total) {
    progress = false;
    for (let i = 0; i < currentArrows.length; i++) {
      const arrow = currentArrows[i];
      if (arrow.isEscaped) continue;

      const { canEscape } = canArrowEscape(
        arrow,
        currentArrows,
        level.gridSize.cols,
        level.gridSize.rows
      );

      if (canEscape) {
        arrow.isEscaped = true;
        escapedCount++;
        progress = true;
        break; // Re-evaluate board state after freeing an arrow
      }
    }
  }

  return escapedCount === total;
}

const COLORS: ArrowColor[] = ['cyan', 'lime', 'yellow', 'purple', 'pink', 'orange'];

export const HANDCRAFTED_LEVELS: Level[] = [
  // Level 1: Simple introduction
  {
    id: 1,
    nameAr: 'مرحباً بالأسهم',
    nameEn: 'Welcome Arrows',
    difficulty: 'سهل',
    difficultyEn: 'Easy',
    gridSize: { cols: 6, rows: 6 },
    maxDrops: 3,
    arrows: [
      { id: '1-1', gridX: 1, gridY: 2, direction: 'up', color: 'cyan', length: 1 },
      { id: '1-2', gridX: 4, gridY: 2, direction: 'right', color: 'lime', length: 1 },
      { id: '1-3', gridX: 4, gridY: 4, direction: 'down', color: 'yellow', length: 1 },
      { id: '1-4', gridX: 1, gridY: 4, direction: 'left', color: 'purple', length: 1 },
    ],
  },
  // Level 2: Gentle chain
  {
    id: 2,
    nameAr: 'مسار المتاهة الأول',
    nameEn: 'First Maze Path',
    difficulty: 'سهل',
    difficultyEn: 'Easy',
    gridSize: { cols: 7, rows: 6 },
    maxDrops: 3,
    arrows: [
      { id: '2-1', gridX: 2, gridY: 2, direction: 'right', color: 'cyan', length: 2 },
      { id: '2-2', gridX: 4, gridY: 2, direction: 'up', color: 'lime', length: 1 },
      { id: '2-3', gridX: 5, gridY: 4, direction: 'right', color: 'purple', length: 1 },
      { id: '2-4', gridX: 3, gridY: 4, direction: 'down', color: 'yellow', length: 2 },
      { id: '2-5', gridX: 1, gridY: 4, direction: 'left', color: 'pink', length: 1 },
      { id: '2-6', gridX: 2, gridY: 1, direction: 'up', color: 'orange', length: 1 },
    ],
  },
  // Level 3: Unblocking chain
  {
    id: 3,
    nameAr: 'تشابك الألوان',
    nameEn: 'Color Entanglement',
    difficulty: 'متوسط',
    difficultyEn: 'Medium',
    gridSize: { cols: 8, rows: 6 },
    maxDrops: 3,
    arrows: [
      { id: '3-1', gridX: 2, gridY: 2, direction: 'down', color: 'cyan', length: 1 },
      { id: '3-2', gridX: 2, gridY: 4, direction: 'left', color: 'purple', length: 1 },
      { id: '3-3', gridX: 4, gridY: 2, direction: 'up', color: 'lime', length: 2 },
      { id: '3-4', gridX: 5, gridY: 4, direction: 'right', color: 'yellow', length: 1 },
      { id: '3-5', gridX: 6, gridY: 2, direction: 'right', color: 'pink', length: 1 },
      { id: '3-6', gridX: 3, gridY: 1, direction: 'left', color: 'orange', length: 1 },
      { id: '3-7', gridX: 5, gridY: 1, direction: 'up', color: 'cyan', length: 1 },
    ],
  },
  // Level 4: Clean loop without deadlocks
  {
    id: 4,
    nameAr: 'الحلقة الناعمة',
    nameEn: 'Smooth Loop',
    difficulty: 'متوسط',
    difficultyEn: 'Medium',
    gridSize: { cols: 9, rows: 7 },
    maxDrops: 3,
    arrows: [
      { id: '4-1', gridX: 2, gridY: 2, direction: 'right', color: 'lime', length: 2 },
      { id: '4-2', gridX: 5, gridY: 2, direction: 'down', color: 'cyan', length: 2 },
      { id: '4-3', gridX: 5, gridY: 5, direction: 'left', color: 'yellow', length: 2 },
      { id: '4-4', gridX: 2, gridY: 5, direction: 'down', color: 'purple', length: 2 },
      { id: '4-5', gridX: 3, gridY: 3, direction: 'up', color: 'pink', length: 1 },
      { id: '4-6', gridX: 4, gridY: 4, direction: 'down', color: 'orange', length: 1 },
      { id: '4-7', gridX: 1, gridY: 3, direction: 'left', color: 'lime', length: 1 },
      { id: '4-8', gridX: 6, gridY: 3, direction: 'right', color: 'cyan', length: 1 },
    ],
  },
  // Level 5: Intricate Glasses / Butterfly Wing Maze (Perfectly Spaced & 100% Solvable!)
  {
    id: 5,
    nameAr: 'متاهة النظارة الأنيقة',
    nameEn: 'Glasses Butterfly Maze',
    difficulty: 'صعب جداً',
    difficultyEn: 'Very Hard',
    gridSize: { cols: 14, rows: 7 },
    maxDrops: 3,
    arrows: [
      // Left Wing Cluster (Cyan, Lime, Yellow)
      { id: '5-1', gridX: 1, gridY: 1, direction: 'up', color: 'cyan', length: 1 },
      { id: '5-2', gridX: 4, gridY: 1, direction: 'left', color: 'lime', length: 2 },
      { id: '5-3', gridX: 1, gridY: 3, direction: 'right', color: 'cyan', length: 2 },
      { id: '5-4', gridX: 2, gridY: 5, direction: 'down', color: 'lime', length: 1 },
      { id: '5-5', gridX: 4, gridY: 5, direction: 'down', color: 'yellow', length: 2 },
      { id: '5-6', gridX: 4, gridY: 3, direction: 'up', color: 'lime', length: 1 },
      { id: '5-7', gridX: 3, gridY: 2, direction: 'up', color: 'cyan', length: 1 },
      { id: '5-8', gridX: 2, gridY: 4, direction: 'left', color: 'cyan', length: 1 },

      // Middle Bridge (Yellow)
      { id: '5-9', gridX: 6, gridY: 2, direction: 'down', color: 'yellow', length: 2 },
      { id: '5-10', gridX: 7, gridY: 4, direction: 'up', color: 'yellow', length: 2 },

      // Right Wing Cluster (Purple, Pink, Orange)
      { id: '5-11', gridX: 12, gridY: 1, direction: 'up', color: 'purple', length: 1 },
      { id: '5-12', gridX: 9, gridY: 1, direction: 'right', color: 'pink', length: 2 },
      { id: '5-13', gridX: 12, gridY: 3, direction: 'right', color: 'purple', length: 2 },
      { id: '5-14', gridX: 11, gridY: 5, direction: 'down', color: 'pink', length: 1 },
      { id: '5-15', gridX: 9, gridY: 5, direction: 'down', color: 'orange', length: 2 },
      { id: '5-16', gridX: 9, gridY: 3, direction: 'up', color: 'purple', length: 1 },
      { id: '5-17', gridX: 10, gridY: 2, direction: 'up', color: 'pink', length: 1 },
      { id: '5-18', gridX: 11, gridY: 4, direction: 'right', color: 'purple', length: 1 },
    ],
  },
  // Level 6: Crossroads Grid
  {
    id: 6,
    nameAr: 'شبكة التقاطعات',
    nameEn: 'Crossroads Grid',
    difficulty: 'صعب',
    difficultyEn: 'Hard',
    gridSize: { cols: 8, rows: 7 },
    maxDrops: 3,
    arrows: [
      { id: '6-1', gridX: 1, gridY: 1, direction: 'right', color: 'cyan', length: 2 },
      { id: '6-2', gridX: 4, gridY: 1, direction: 'down', color: 'lime', length: 2 },
      { id: '6-3', gridX: 4, gridY: 4, direction: 'right', color: 'yellow', length: 2 },
      { id: '6-4', gridX: 6, gridY: 2, direction: 'up', color: 'purple', length: 1 },
      { id: '6-5', gridX: 1, gridY: 3, direction: 'left', color: 'pink', length: 1 },
      { id: '6-6', gridX: 2, gridY: 5, direction: 'down', color: 'orange', length: 1 },
      { id: '6-7', gridX: 5, gridY: 5, direction: 'right', color: 'cyan', length: 1 },
      { id: '6-8', gridX: 2, gridY: 3, direction: 'right', color: 'lime', length: 1 },
      { id: '6-9', gridX: 6, gridY: 5, direction: 'up', color: 'yellow', length: 1 },
    ],
  },
  // Level 7: Color Weave
  {
    id: 7,
    nameAr: 'نسيج الألوان',
    nameEn: 'Color Weave',
    difficulty: 'صعب',
    difficultyEn: 'Hard',
    gridSize: { cols: 10, rows: 7 },
    maxDrops: 3,
    arrows: [
      { id: '7-1', gridX: 1, gridY: 1, direction: 'left', color: 'cyan', length: 1 },
      { id: '7-2', gridX: 4, gridY: 1, direction: 'up', color: 'lime', length: 2 },
      { id: '7-3', gridX: 1, gridY: 3, direction: 'up', color: 'purple', length: 1 },
      { id: '7-4', gridX: 3, gridY: 3, direction: 'left', color: 'yellow', length: 2 },
      { id: '7-5', gridX: 4, gridY: 4, direction: 'down', color: 'pink', length: 2 },
      { id: '7-6', gridX: 6, gridY: 1, direction: 'right', color: 'orange', length: 2 },
      { id: '7-7', gridX: 9, gridY: 1, direction: 'down', color: 'cyan', length: 2 },
      { id: '7-8', gridX: 8, gridY: 4, direction: 'up', color: 'lime', length: 2 },
      { id: '7-9', gridX: 6, gridY: 4, direction: 'left', color: 'yellow', length: 1 },
      { id: '7-10', gridX: 2, gridY: 5, direction: 'down', color: 'purple', length: 1 },
      { id: '7-11', gridX: 5, gridY: 5, direction: 'right', color: 'pink', length: 1 },
    ],
  },
  // Level 8: Spiral Maze
  {
    id: 8,
    nameAr: 'المتاهة الحلزونية',
    nameEn: 'Spiral Maze',
    difficulty: 'خبير',
    difficultyEn: 'Expert',
    gridSize: { cols: 11, rows: 8 },
    maxDrops: 3,
    arrows: [
      { id: '8-1', gridX: 2, gridY: 1, direction: 'up', color: 'lime', length: 1 },
      { id: '8-2', gridX: 3, gridY: 2, direction: 'left', color: 'cyan', length: 2 },
      { id: '8-3', gridX: 6, gridY: 2, direction: 'up', color: 'yellow', length: 2 },
      { id: '8-4', gridX: 6, gridY: 5, direction: 'down', color: 'purple', length: 2 },
      { id: '8-5', gridX: 3, gridY: 5, direction: 'left', color: 'pink', length: 2 },
      { id: '8-6', gridX: 4, gridY: 3, direction: 'up', color: 'orange', length: 1 },
      { id: '8-7', gridX: 1, gridY: 3, direction: 'left', color: 'cyan', length: 1 },
      { id: '8-8', gridX: 8, gridY: 2, direction: 'up', color: 'lime', length: 1 },
      { id: '8-9', gridX: 9, gridY: 4, direction: 'right', color: 'yellow', length: 2 },
      { id: '8-10', gridX: 8, gridY: 6, direction: 'down', color: 'purple', length: 1 },
      { id: '8-11', gridX: 5, gridY: 6, direction: 'down', color: 'pink', length: 2 },
      { id: '8-12', gridX: 2, gridY: 6, direction: 'down', color: 'orange', length: 1 },
    ],
  },
  // Level 9: Twin Wings Challenge
  {
    id: 9,
    nameAr: 'تحدي الأجنحة المزدوجة',
    nameEn: 'Twin Wings Challenge',
    difficulty: 'خبير',
    difficultyEn: 'Expert',
    gridSize: { cols: 12, rows: 7 },
    maxDrops: 3,
    arrows: [
      { id: '9-1', gridX: 1, gridY: 1, direction: 'up', color: 'cyan', length: 1 },
      { id: '9-2', gridX: 3, gridY: 1, direction: 'right', color: 'lime', length: 2 },
      { id: '9-3', gridX: 2, gridY: 3, direction: 'right', color: 'yellow', length: 2 },
      { id: '9-4', gridX: 1, gridY: 5, direction: 'down', color: 'purple', length: 1 },
      { id: '9-5', gridX: 3, gridY: 5, direction: 'left', color: 'pink', length: 1 },
      { id: '9-6', gridX: 5, gridY: 3, direction: 'down', color: 'orange', length: 2 },
      { id: '9-7', gridX: 6, gridY: 1, direction: 'up', color: 'cyan', length: 1 },
      { id: '9-8', gridX: 7, gridY: 4, direction: 'down', color: 'lime', length: 2 },
      { id: '9-9', gridX: 8, gridY: 2, direction: 'left', color: 'purple', length: 2 },
      { id: '9-10', gridX: 10, gridY: 1, direction: 'left', color: 'pink', length: 2 },
      { id: '9-11', gridX: 10, gridY: 3, direction: 'right', color: 'orange', length: 2 },
      { id: '9-12', gridX: 11, gridY: 5, direction: 'down', color: 'cyan', length: 1 },
      { id: '9-13', gridX: 9, gridY: 5, direction: 'right', color: 'yellow', length: 1 },
    ],
  },
  // Level 10: Master Linked Maze
  {
    id: 10,
    nameAr: 'متاهة الخبراء المترابطة',
    nameEn: 'Master Linked Maze',
    difficulty: 'خبير',
    difficultyEn: 'Expert',
    gridSize: { cols: 14, rows: 8 },
    maxDrops: 3,
    arrows: [
      { id: '10-1', gridX: 1, gridY: 1, direction: 'up', color: 'cyan', length: 1 },
      { id: '10-2', gridX: 3, gridY: 1, direction: 'right', color: 'lime', length: 2 },
      { id: '10-3', gridX: 2, gridY: 3, direction: 'right', color: 'yellow', length: 2 },
      { id: '10-4', gridX: 1, gridY: 5, direction: 'down', color: 'purple', length: 1 },
      { id: '10-5', gridX: 3, gridY: 6, direction: 'left', color: 'pink', length: 1 },
      { id: '10-6', gridX: 5, gridY: 3, direction: 'down', color: 'orange', length: 2 },
      { id: '10-7', gridX: 6, gridY: 1, direction: 'up', color: 'cyan', length: 1 },
      { id: '10-8', gridX: 7, gridY: 4, direction: 'down', color: 'lime', length: 2 },
      { id: '10-9', gridX: 8, gridY: 2, direction: 'left', color: 'purple', length: 2 },
      { id: '10-10', gridX: 10, gridY: 1, direction: 'left', color: 'pink', length: 2 },
      { id: '10-11', gridX: 12, gridY: 1, direction: 'up', color: 'orange', length: 1 },
      { id: '10-12', gridX: 10, gridY: 3, direction: 'right', color: 'yellow', length: 2 },
      { id: '10-13', gridX: 12, gridY: 4, direction: 'down', color: 'purple', length: 2 },
      { id: '10-14', gridX: 13, gridY: 6, direction: 'right', color: 'pink', length: 1 },
      { id: '10-15', gridX: 10, gridY: 6, direction: 'left', color: 'cyan', length: 1 },
    ],
  },
];

// Procedurally generate a level that is 100% guaranteed solvable with zero overlaps
export function generateRandomSolvableLevel(levelNumber: number): Level {
  const isEvery5th = levelNumber % 5 === 0;
  const isHard = levelNumber > 15 || isEvery5th;
  const isMedium = levelNumber > 8;

  const cols = isEvery5th ? 14 : isHard ? 14 : isMedium ? 10 : 8;
  const rows = isEvery5th ? 8 : isHard ? 8 : isMedium ? 7 : 6;

  const targetCount = isEvery5th
    ? Math.min(12 + Math.floor(levelNumber * 0.5), 22)
    : Math.min(6 + Math.floor(levelNumber * 1.2), 20);

  const diffAr = isEvery5th ? 'صعب جداً' : levelNumber <= 3 ? 'سهل' : levelNumber <= 8 ? 'متوسط' : 'صعب';
  const diffEn = isEvery5th ? 'Very Hard' : levelNumber <= 3 ? 'Easy' : levelNumber <= 8 ? 'Medium' : 'Hard';

  const directions: Direction[] = ['up', 'down', 'left', 'right'];

  let bestCandidate: Level | null = null;

  for (let attempt = 0; attempt < 30; attempt++) {
    const arrows: Arrow[] = [];
    let innerAttempts = 0;

    while (arrows.length < targetCount && innerAttempts < 300) {
      innerAttempts++;
      const gx = Math.floor(Math.random() * (cols - 2)) + 1;
      const gy = Math.floor(Math.random() * (rows - 2)) + 1;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const len = Math.random() > 0.6 ? 2 : 1;

      const candidate: Arrow = {
        id: `gen-${levelNumber}-${arrows.length}-${Math.random().toString(36).substring(2, 7)}`,
        gridX: gx,
        gridY: gy,
        direction: dir,
        color: color,
        length: len,
      };

      const testLevel: Level = {
        id: levelNumber,
        nameAr: isEvery5th ? `المستوى ${levelNumber} 🔥 (تحدي)'` : `المستوى ${levelNumber}`,
        nameEn: isEvery5th ? `Level ${levelNumber} 🔥 (Boss)` : `Level ${levelNumber}`,
        difficulty: diffAr,
        difficultyEn: diffEn,
        gridSize: { cols, rows },
        maxDrops: 3,
        arrows: [...arrows, candidate],
      };

      if (!hasOverlappingCells(testLevel.arrows) && isLevelSolvable(testLevel)) {
        arrows.push(candidate);
      }
    }

    const candidateLevel: Level = {
      id: levelNumber,
      nameAr: isEvery5th ? `المستوى ${levelNumber} 🔥` : `المستوى ${levelNumber}`,
      nameEn: isEvery5th ? `Level ${levelNumber} 🔥` : `Level ${levelNumber}`,
      difficulty: diffAr,
      difficultyEn: diffEn,
      gridSize: { cols, rows },
      maxDrops: 3,
      arrows,
    };

    if (arrows.length >= 4 && isLevelSolvable(candidateLevel)) {
      return candidateLevel;
    }

    if (!bestCandidate || (candidateLevel.arrows.length > bestCandidate.arrows.length && isLevelSolvable(candidateLevel))) {
      bestCandidate = candidateLevel;
    }
  }

  if (bestCandidate && bestCandidate.arrows.length >= 3) {
    return bestCandidate;
  }

  // Guaranteed fallback template with ID = levelNumber
  const templateIdx = (levelNumber - 1) % HANDCRAFTED_LEVELS.length;
  const baseLevel = HANDCRAFTED_LEVELS[templateIdx];
  return {
    ...baseLevel,
    id: levelNumber,
    nameAr: isEvery5th ? `المستوى ${levelNumber} 🔥` : `المستوى ${levelNumber}`,
    nameEn: isEvery5th ? `Level ${levelNumber} 🔥` : `Level ${levelNumber}`,
    difficulty: diffAr,
    difficultyEn: diffEn,
    arrows: baseLevel.arrows.map((a, idx) => ({
      ...a,
      id: `gen-fb-${levelNumber}-${idx}`,
    })),
  };
}

export function getLevel(id: number): Level {
  const handcrafted = HANDCRAFTED_LEVELS.find((l) => l.id === id);
  if (handcrafted) {
    return {
      ...handcrafted,
      arrows: handcrafted.arrows.map((a) => ({ ...a })),
    };
  }
  return generateRandomSolvableLevel(id);
}

