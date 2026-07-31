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
  'slight-up-right': { x: 2, y: -1 },
  'slight-up-left': { x: -2, y: -1 },
  'slight-down-right': { x: 2, y: 1 },
  'slight-down-left': { x: -2, y: 1 },
};

export const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
  'up-left': 'down-right',
  'up-right': 'down-left',
  'down-left': 'up-right',
  'down-right': 'up-left',
  'slight-up-right': 'slight-down-left',
  'slight-up-left': 'slight-down-right',
  'slight-down-right': 'slight-up-left',
  'slight-down-left': 'slight-up-right',
};

// Check if all cells occupied by an arrow are strictly within grid bounds
export function isArrowInBounds(arrow: Arrow, cols: number = 16, rows: number = 10): boolean {
  const cells = getArrowOccupiedCells(arrow);
  return cells.every((c) => c.x >= 0 && c.x < cols && c.y >= 0 && c.y < rows);
}

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

// Check if path is clear for an arrow moving in a specific direction (forward or backward)
export function checkPathClear(
  arrow: Arrow,
  checkDir: Direction,
  allArrows: Arrow[],
  gridCols: number = 16,
  gridRows: number = 10
): { canEscape: boolean; blocker: Arrow | null } {
  const vec = DIRECTION_VECTORS[checkDir];
  const len = arrow.length || 1;
  const isGhost = arrow.isGhost || arrow.type === 'ghost';

  const isForward = checkDir === arrow.direction;
  const startX = isForward ? arrow.gridX + DIRECTION_VECTORS[arrow.direction].x * (len - 1) : arrow.gridX;
  const startY = isForward ? arrow.gridY + DIRECTION_VECTORS[arrow.direction].y * (len - 1) : arrow.gridY;

  const maxSteps = Math.max(gridCols, gridRows) + 4;

  for (let step = 1; step <= maxSteps; step++) {
    const targetX = startX + vec.x * step;
    const targetY = startY + vec.y * step;

    // Check boundary
    if (targetX < 0 || targetX >= gridCols || targetY < 0 || targetY >= gridRows) {
      return { canEscape: true, blocker: null };
    }

    const blocker = getArrowOccupyingTile(targetX, targetY, allArrows, arrow.id);
    if (blocker) {
      const isBlockerNormal = !blocker.isBomb && !blocker.isDouble && blocker.type !== 'bomb' && blocker.type !== 'double';
      if (isGhost && isBlockerNormal) {
        // Ghost arrow phases right through normal arrows!
        continue;
      } else {
        return { canEscape: false, blocker };
      }
    }
  }
  return { canEscape: true, blocker: null };
}

// Find if an arrow can escape freely (supports single-headed and double-headed bidirectional arrows)
export function canArrowEscape(
  arrow: Arrow,
  allArrows: Arrow[],
  gridCols: number = 16,
  gridRows: number = 10
): { canEscape: boolean; blocker: Arrow | null; escapeDirection: Direction } {
  // Test primary direction
  const forwardResult = checkPathClear(arrow, arrow.direction, allArrows, gridCols, gridRows);
  if (forwardResult.canEscape) {
    return { canEscape: true, blocker: null, escapeDirection: arrow.direction };
  }

  // If double arrow (bidirectional), test opposite direction if primary direction is blocked
  if (arrow.isDouble || arrow.type === 'double') {
    const oppDir = OPPOSITE_DIRECTIONS[arrow.direction];
    const backwardResult = checkPathClear(arrow, oppDir, allArrows, gridCols, gridRows);
    if (backwardResult.canEscape) {
      return { canEscape: true, blocker: null, escapeDirection: oppDir };
    }
  }

  return { canEscape: false, blocker: forwardResult.blocker, escapeDirection: arrow.direction };
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
  {
    "id": 1,
    "nameAr": "مرحباً بالأسهم",
    "nameEn": "Welcome Arrows",
    "difficulty": "سهل",
    "difficultyEn": "Easy",
    "gridSize": {
      "cols": 6,
      "rows": 6
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "1-1",
        "gridX": 1,
        "gridY": 2,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "1-2",
        "gridX": 4,
        "gridY": 2,
        "direction": "right",
        "color": "lime",
        "length": 1
      },
      {
        "id": "1-3",
        "gridX": 4,
        "gridY": 4,
        "direction": "down",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "1-4",
        "gridX": 1,
        "gridY": 4,
        "direction": "left",
        "color": "purple",
        "length": 1
      }
    ]
  },
  {
    "id": 2,
    "nameAr": "مسار المتاهة الأول",
    "nameEn": "First Maze Path",
    "difficulty": "سهل",
    "difficultyEn": "Easy",
    "gridSize": {
      "cols": 7,
      "rows": 6
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "2-1",
        "gridX": 2,
        "gridY": 2,
        "direction": "right",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "2-2",
        "gridX": 4,
        "gridY": 2,
        "direction": "up",
        "color": "lime",
        "length": 1
      },
      {
        "id": "2-3",
        "gridX": 5,
        "gridY": 4,
        "direction": "right",
        "color": "purple",
        "length": 1
      },
      {
        "id": "2-4",
        "gridX": 3,
        "gridY": 4,
        "direction": "down",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "2-5",
        "gridX": 1,
        "gridY": 4,
        "direction": "left",
        "color": "pink",
        "length": 1
      },
      {
        "id": "2-6",
        "gridX": 2,
        "gridY": 1,
        "direction": "up",
        "color": "orange",
        "length": 1
      }
    ]
  },
  {
    "id": 3,
    "nameAr": "تشابك الألوان",
    "nameEn": "Color Entanglement",
    "difficulty": "متوسط",
    "difficultyEn": "Medium",
    "gridSize": {
      "cols": 8,
      "rows": 6
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "3-1",
        "gridX": 2,
        "gridY": 2,
        "direction": "down",
        "color": "cyan",
        "length": 1,
        "type": "double"
      },
      {
        "id": "3-2",
        "gridX": 2,
        "gridY": 4,
        "direction": "left",
        "color": "purple",
        "length": 1
      },
      {
        "id": "3-3",
        "gridX": 4,
        "gridY": 2,
        "direction": "up",
        "color": "lime",
        "length": 2
      },
      {
        "id": "3-4",
        "gridX": 5,
        "gridY": 4,
        "direction": "right",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "3-5",
        "gridX": 6,
        "gridY": 2,
        "direction": "right",
        "color": "pink",
        "length": 1
      },
      {
        "id": "3-6",
        "gridX": 3,
        "gridY": 1,
        "direction": "left",
        "color": "orange",
        "length": 1
      },
      {
        "id": "3-7",
        "gridX": 5,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      }
    ]
  },
  {
    "id": 4,
    "nameAr": "الحلقة الناعمة",
    "nameEn": "Smooth Loop",
    "difficulty": "متوسط",
    "difficultyEn": "Medium",
    "gridSize": {
      "cols": 9,
      "rows": 7
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "4-1",
        "gridX": 2,
        "gridY": 2,
        "direction": "right",
        "color": "lime",
        "length": 2
      },
      {
        "id": "4-2",
        "gridX": 5,
        "gridY": 2,
        "direction": "down",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "4-3",
        "gridX": 5,
        "gridY": 5,
        "direction": "left",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "4-4",
        "gridX": 2,
        "gridY": 5,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "4-5",
        "gridX": 3,
        "gridY": 3,
        "direction": "up",
        "color": "pink",
        "length": 1
      },
      {
        "id": "4-6",
        "gridX": 4,
        "gridY": 4,
        "direction": "down",
        "color": "orange",
        "length": 1
      },
      {
        "id": "4-7",
        "gridX": 1,
        "gridY": 3,
        "direction": "left",
        "color": "lime",
        "length": 1
      },
      {
        "id": "4-8",
        "gridX": 6,
        "gridY": 3,
        "direction": "right",
        "color": "cyan",
        "length": 1
      }
    ]
  },
  {
    "id": 5,
    "nameAr": "🔥 متاهة النظارة الخماسية",
    "nameEn": "🔥 Glasses Butterfly Boss",
    "difficulty": "صعب جداً",
    "difficultyEn": "Very Hard",
    "gridSize": {
      "cols": 14,
      "rows": 7
    },
    "maxDrops": 1,
    "arrows": [
      {
        "id": "5-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "5-2",
        "gridX": 4,
        "gridY": 1,
        "direction": "left",
        "color": "lime",
        "length": 2
      },
      {
        "id": "5-3",
        "gridX": 1,
        "gridY": 3,
        "direction": "right",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "5-4",
        "gridX": 2,
        "gridY": 5,
        "direction": "down",
        "color": "lime",
        "length": 1
      },
      {
        "id": "5-5",
        "gridX": 4,
        "gridY": 5,
        "direction": "down",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "5-6",
        "gridX": 4,
        "gridY": 3,
        "direction": "up",
        "color": "lime",
        "length": 1
      },
      {
        "id": "5-7",
        "gridX": 3,
        "gridY": 2,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "5-8",
        "gridX": 2,
        "gridY": 4,
        "direction": "left",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "5-9",
        "gridX": 6,
        "gridY": 2,
        "direction": "down",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "5-10",
        "gridX": 7,
        "gridY": 4,
        "direction": "up",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "5-11",
        "gridX": 12,
        "gridY": 1,
        "direction": "up",
        "color": "purple",
        "length": 1
      },
      {
        "id": "5-12",
        "gridX": 9,
        "gridY": 1,
        "direction": "right",
        "color": "pink",
        "length": 2
      },
      {
        "id": "5-13",
        "gridX": 12,
        "gridY": 3,
        "direction": "right",
        "color": "purple",
        "length": 2
      },
      {
        "id": "5-14",
        "gridX": 11,
        "gridY": 5,
        "direction": "down",
        "color": "pink",
        "length": 1
      },
      {
        "id": "5-15",
        "gridX": 9,
        "gridY": 5,
        "direction": "down",
        "color": "orange",
        "length": 2
      },
      {
        "id": "5-16",
        "gridX": 9,
        "gridY": 3,
        "direction": "up",
        "color": "purple",
        "length": 1
      },
      {
        "id": "5-17",
        "gridX": 10,
        "gridY": 2,
        "direction": "up",
        "color": "pink",
        "length": 1
      },
      {
        "id": "5-18",
        "gridX": 11,
        "gridY": 4,
        "direction": "right",
        "color": "purple",
        "length": 1
      }
    ]
  },
  {
    "id": 6,
    "nameAr": "شبكة التقاطعات",
    "nameEn": "Crossroads Grid",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 8,
      "rows": 7
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "6-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "right",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "6-2",
        "gridX": 4,
        "gridY": 1,
        "direction": "down",
        "color": "lime",
        "length": 2
      },
      {
        "id": "6-3",
        "gridX": 4,
        "gridY": 4,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "6-4",
        "gridX": 6,
        "gridY": 2,
        "direction": "up",
        "color": "purple",
        "length": 1
      },
      {
        "id": "6-5",
        "gridX": 1,
        "gridY": 3,
        "direction": "left",
        "color": "pink",
        "length": 1
      },
      {
        "id": "6-6",
        "gridX": 2,
        "gridY": 5,
        "direction": "down",
        "color": "orange",
        "length": 1
      },
      {
        "id": "6-7",
        "gridX": 5,
        "gridY": 5,
        "direction": "right",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "6-8",
        "gridX": 2,
        "gridY": 3,
        "direction": "right",
        "color": "lime",
        "length": 1,
        "type": "double"
      },
      {
        "id": "6-9",
        "gridX": 6,
        "gridY": 5,
        "direction": "up",
        "color": "yellow",
        "length": 1
      }
    ]
  },
  {
    "id": 7,
    "nameAr": "نسيج الألوان",
    "nameEn": "Color Weave",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 10,
      "rows": 7
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "7-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "left",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "7-2",
        "gridX": 4,
        "gridY": 1,
        "direction": "up",
        "color": "lime",
        "length": 2
      },
      {
        "id": "7-3",
        "gridX": 1,
        "gridY": 3,
        "direction": "up",
        "color": "purple",
        "length": 1
      },
      {
        "id": "7-4",
        "gridX": 3,
        "gridY": 3,
        "direction": "left",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "7-5",
        "gridX": 4,
        "gridY": 4,
        "direction": "down",
        "color": "pink",
        "length": 2
      },
      {
        "id": "7-6",
        "gridX": 6,
        "gridY": 1,
        "direction": "right",
        "color": "orange",
        "length": 2
      },
      {
        "id": "7-7",
        "gridX": 9,
        "gridY": 1,
        "direction": "down",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "7-8",
        "gridX": 8,
        "gridY": 4,
        "direction": "up",
        "color": "lime",
        "length": 2
      },
      {
        "id": "7-9",
        "gridX": 6,
        "gridY": 4,
        "direction": "left",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "7-10",
        "gridX": 2,
        "gridY": 5,
        "direction": "down",
        "color": "purple",
        "length": 1
      },
      {
        "id": "7-11",
        "gridX": 5,
        "gridY": 5,
        "direction": "right",
        "color": "pink",
        "length": 1
      }
    ]
  },
  {
    "id": 8,
    "nameAr": "المتاهة الحلزونية",
    "nameEn": "Spiral Maze",
    "difficulty": "خبير",
    "difficultyEn": "Expert",
    "gridSize": {
      "cols": 11,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "8-1",
        "gridX": 2,
        "gridY": 1,
        "direction": "up",
        "color": "lime",
        "length": 1
      },
      {
        "id": "8-2",
        "gridX": 3,
        "gridY": 2,
        "direction": "left",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "8-3",
        "gridX": 6,
        "gridY": 2,
        "direction": "up",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "8-4",
        "gridX": 6,
        "gridY": 5,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "8-5",
        "gridX": 3,
        "gridY": 5,
        "direction": "left",
        "color": "pink",
        "length": 2
      },
      {
        "id": "8-6",
        "gridX": 4,
        "gridY": 3,
        "direction": "up",
        "color": "orange",
        "length": 1
      },
      {
        "id": "8-7",
        "gridX": 1,
        "gridY": 3,
        "direction": "left",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "8-8",
        "gridX": 8,
        "gridY": 2,
        "direction": "up",
        "color": "lime",
        "length": 1
      },
      {
        "id": "8-9",
        "gridX": 9,
        "gridY": 4,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "8-10",
        "gridX": 8,
        "gridY": 6,
        "direction": "down",
        "color": "purple",
        "length": 1
      },
      {
        "id": "8-11",
        "gridX": 5,
        "gridY": 6,
        "direction": "down",
        "color": "pink",
        "length": 2
      },
      {
        "id": "8-12",
        "gridX": 2,
        "gridY": 6,
        "direction": "down",
        "color": "orange",
        "length": 1
      }
    ]
  },
  {
    "id": 9,
    "nameAr": "تحدي الأجنحة المزدوجة",
    "nameEn": "Twin Wings Challenge",
    "difficulty": "خبير",
    "difficultyEn": "Expert",
    "gridSize": {
      "cols": 12,
      "rows": 7
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "9-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "9-2",
        "gridX": 3,
        "gridY": 1,
        "direction": "right",
        "color": "lime",
        "length": 2
      },
      {
        "id": "9-3",
        "gridX": 2,
        "gridY": 3,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "9-4",
        "gridX": 1,
        "gridY": 5,
        "direction": "down",
        "color": "purple",
        "length": 1
      },
      {
        "id": "9-5",
        "gridX": 3,
        "gridY": 5,
        "direction": "left",
        "color": "pink",
        "length": 1
      },
      {
        "id": "9-6",
        "gridX": 5,
        "gridY": 3,
        "direction": "down",
        "color": "orange",
        "length": 2
      },
      {
        "id": "9-7",
        "gridX": 6,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "9-8",
        "gridX": 7,
        "gridY": 4,
        "direction": "down",
        "color": "lime",
        "length": 2
      },
      {
        "id": "9-9",
        "gridX": 8,
        "gridY": 2,
        "direction": "left",
        "color": "purple",
        "length": 2
      },
      {
        "id": "9-10",
        "gridX": 10,
        "gridY": 1,
        "direction": "right",
        "color": "pink",
        "length": 2
      },
      {
        "id": "9-11",
        "gridX": 10,
        "gridY": 3,
        "direction": "right",
        "color": "orange",
        "length": 2
      },
      {
        "id": "9-12",
        "gridX": 11,
        "gridY": 5,
        "direction": "down",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "9-13",
        "gridX": 9,
        "gridY": 5,
        "direction": "right",
        "color": "yellow",
        "length": 1
      }
    ]
  },
  {
    "id": 10,
    "nameAr": "🔥 تحدي الخبراء الخماسي",
    "nameEn": "🔥 Master Linked Boss",
    "difficulty": "صعب جداً",
    "difficultyEn": "Very Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 1,
    "arrows": [
      {
        "id": "10-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "10-2",
        "gridX": 3,
        "gridY": 1,
        "direction": "right",
        "color": "lime",
        "length": 2
      },
      {
        "id": "10-3",
        "gridX": 2,
        "gridY": 3,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "10-4",
        "gridX": 1,
        "gridY": 5,
        "direction": "down",
        "color": "purple",
        "length": 1
      },
      {
        "id": "10-5",
        "gridX": 3,
        "gridY": 6,
        "direction": "left",
        "color": "pink",
        "length": 1
      },
      {
        "id": "10-6",
        "gridX": 5,
        "gridY": 3,
        "direction": "down",
        "color": "orange",
        "length": 2
      },
      {
        "id": "10-7",
        "gridX": 6,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "10-8",
        "gridX": 7,
        "gridY": 4,
        "direction": "down",
        "color": "lime",
        "length": 2
      },
      {
        "id": "10-9",
        "gridX": 8,
        "gridY": 2,
        "direction": "left",
        "color": "purple",
        "length": 2
      },
      {
        "id": "10-10",
        "gridX": 10,
        "gridY": 1,
        "direction": "right",
        "color": "pink",
        "length": 2
      },
      {
        "id": "10-11",
        "gridX": 12,
        "gridY": 1,
        "direction": "up",
        "color": "orange",
        "length": 1
      },
      {
        "id": "10-12",
        "gridX": 10,
        "gridY": 3,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "10-13",
        "gridX": 12,
        "gridY": 4,
        "direction": "up",
        "color": "purple",
        "length": 2
      },
      {
        "id": "10-14",
        "gridX": 13,
        "gridY": 6,
        "direction": "right",
        "color": "pink",
        "length": 1
      },
      {
        "id": "10-15",
        "gridX": 10,
        "gridY": 6,
        "direction": "left",
        "color": "cyan",
        "length": 1
      }
    ]
  },
  {
    "id": 11,
    "nameAr": "شبكة التشابك الخماسي",
    "nameEn": "Spiders Web Grid",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 12,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "11-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "11-2",
        "gridX": 3,
        "gridY": 1,
        "direction": "left",
        "color": "lime",
        "length": 2
      },
      {
        "id": "11-3",
        "gridX": 5,
        "gridY": 1,
        "direction": "left",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "11-4",
        "gridX": 3,
        "gridY": 3,
        "direction": "up",
        "color": "purple",
        "length": 2
      },
      {
        "id": "11-5",
        "gridX": 1,
        "gridY": 4,
        "direction": "right",
        "color": "pink",
        "length": 2
      },
      {
        "id": "11-6",
        "gridX": 4,
        "gridY": 4,
        "direction": "down",
        "color": "orange",
        "length": 2
      },
      {
        "id": "11-7",
        "gridX": 7,
        "gridY": 1,
        "direction": "right",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "11-8",
        "gridX": 10,
        "gridY": 1,
        "direction": "down",
        "color": "lime",
        "length": 2
      },
      {
        "id": "11-9",
        "gridX": 7,
        "gridY": 4,
        "direction": "right",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "11-10",
        "gridX": 10,
        "gridY": 5,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "11-11",
        "gridX": 6,
        "gridY": 6,
        "direction": "down",
        "color": "pink",
        "length": 2
      },
      {
        "id": "11-12",
        "gridX": 2,
        "gridY": 6,
        "direction": "left",
        "color": "orange",
        "length": 1
      }
    ]
  },
  {
    "id": 12,
    "nameAr": "الفخ المتقاطع الكبير",
    "nameEn": "Grand Intersecting Trap",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 13,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "12-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "12-2",
        "gridX": 2,
        "gridY": 2,
        "direction": "right",
        "color": "lime",
        "length": 2
      },
      {
        "id": "12-3",
        "gridX": 5,
        "gridY": 1,
        "direction": "down",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "12-4",
        "gridX": 5,
        "gridY": 4,
        "direction": "left",
        "color": "purple",
        "length": 2
      },
      {
        "id": "12-5",
        "gridX": 2,
        "gridY": 4,
        "direction": "down",
        "color": "pink",
        "length": 1
      },
      {
        "id": "12-6",
        "gridX": 1,
        "gridY": 6,
        "direction": "down",
        "color": "orange",
        "length": 1
      },
      {
        "id": "12-7",
        "gridX": 4,
        "gridY": 6,
        "direction": "right",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "12-8",
        "gridX": 7,
        "gridY": 2,
        "direction": "right",
        "color": "lime",
        "length": 2
      },
      {
        "id": "12-9",
        "gridX": 10,
        "gridY": 1,
        "direction": "down",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "12-10",
        "gridX": 10,
        "gridY": 4,
        "direction": "right",
        "color": "purple",
        "length": 2
      },
      {
        "id": "12-11",
        "gridX": 8,
        "gridY": 5,
        "direction": "up",
        "color": "pink",
        "length": 2
      },
      {
        "id": "12-12",
        "gridX": 7,
        "gridY": 6,
        "direction": "down",
        "color": "orange",
        "length": 2
      },
      {
        "id": "12-13",
        "gridX": 12,
        "gridY": 6,
        "direction": "down",
        "color": "cyan",
        "length": 1
      }
    ]
  },
  {
    "id": 13,
    "nameAr": "القلعة المزدوجة",
    "nameEn": "Dual Fortress",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 13,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "13-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "down",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "13-2",
        "gridX": 4,
        "gridY": 1,
        "direction": "up",
        "color": "lime",
        "length": 2
      },
      {
        "id": "13-3",
        "gridX": 2,
        "gridY": 3,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "13-4",
        "gridX": 5,
        "gridY": 3,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "13-5",
        "gridX": 1,
        "gridY": 5,
        "direction": "down",
        "color": "pink",
        "length": 1
      },
      {
        "id": "13-6",
        "gridX": 3,
        "gridY": 5,
        "direction": "down",
        "color": "orange",
        "length": 1
      },
      {
        "id": "13-7",
        "gridX": 5,
        "gridY": 6,
        "direction": "right",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "13-8",
        "gridX": 7,
        "gridY": 1,
        "direction": "up",
        "color": "lime",
        "length": 1
      },
      {
        "id": "13-9",
        "gridX": 9,
        "gridY": 1,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "13-10",
        "gridX": 12,
        "gridY": 1,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "13-11",
        "gridX": 9,
        "gridY": 4,
        "direction": "left",
        "color": "pink",
        "length": 2
      },
      {
        "id": "13-12",
        "gridX": 12,
        "gridY": 4,
        "direction": "right",
        "color": "orange",
        "length": 2
      },
      {
        "id": "13-13",
        "gridX": 7,
        "gridY": 5,
        "direction": "down",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "13-14",
        "gridX": 10,
        "gridY": 6,
        "direction": "right",
        "color": "lime",
        "length": 2
      }
    ]
  },
  {
    "id": 14,
    "nameAr": "متاهة العقد الثلاثية",
    "nameEn": "Triple Knot Maze",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "14-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "14-2",
        "gridX": 3,
        "gridY": 1,
        "direction": "left",
        "color": "lime",
        "length": 2
      },
      {
        "id": "14-3",
        "gridX": 1,
        "gridY": 3,
        "direction": "down",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "14-4",
        "gridX": 3,
        "gridY": 3,
        "direction": "right",
        "color": "purple",
        "length": 2
      },
      {
        "id": "14-5",
        "gridX": 6,
        "gridY": 2,
        "direction": "down",
        "color": "pink",
        "length": 2
      },
      {
        "id": "14-6",
        "gridX": 6,
        "gridY": 5,
        "direction": "left",
        "color": "orange",
        "length": 2
      },
      {
        "id": "14-7",
        "gridX": 2,
        "gridY": 5,
        "direction": "down",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "14-8",
        "gridX": 4,
        "gridY": 6,
        "direction": "down",
        "color": "lime",
        "length": 1
      },
      {
        "id": "14-9",
        "gridX": 8,
        "gridY": 1,
        "direction": "up",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "14-10",
        "gridX": 10,
        "gridY": 1,
        "direction": "right",
        "color": "purple",
        "length": 2
      },
      {
        "id": "14-11",
        "gridX": 13,
        "gridY": 1,
        "direction": "up",
        "color": "pink",
        "length": 2
      },
      {
        "id": "14-12",
        "gridX": 10,
        "gridY": 4,
        "direction": "left",
        "color": "orange",
        "length": 2
      },
      {
        "id": "14-13",
        "gridX": 13,
        "gridY": 4,
        "direction": "up",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "14-14",
        "gridX": 9,
        "gridY": 6,
        "direction": "down",
        "color": "lime",
        "length": 1
      },
      {
        "id": "14-15",
        "gridX": 11,
        "gridY": 6,
        "direction": "right",
        "color": "yellow",
        "length": 2
      }
    ]
  },
  {
    "id": 15,
    "nameAr": "🔥 تحدي العباقرة الخماسي",
    "nameEn": "🔥 Genius Quintet Boss",
    "difficulty": "صعب جداً",
    "difficultyEn": "Very Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 1,
    "arrows": [
      {
        "id": "15-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "15-2",
        "gridX": 4,
        "gridY": 1,
        "direction": "left",
        "color": "lime",
        "length": 2
      },
      {
        "id": "15-3",
        "gridX": 1,
        "gridY": 3,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "15-4",
        "gridX": 4,
        "gridY": 3,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "15-5",
        "gridX": 2,
        "gridY": 6,
        "direction": "left",
        "color": "pink",
        "length": 1
      },
      {
        "id": "15-6",
        "gridX": 4,
        "gridY": 6,
        "direction": "down",
        "color": "orange",
        "length": 1
      },
      {
        "id": "15-7",
        "gridX": 6,
        "gridY": 2,
        "direction": "up",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "15-8",
        "gridX": 7,
        "gridY": 5,
        "direction": "down",
        "color": "lime",
        "length": 2
      },
      {
        "id": "15-9",
        "gridX": 6,
        "gridY": 6,
        "direction": "left",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "15-10",
        "gridX": 9,
        "gridY": 1,
        "direction": "right",
        "color": "purple",
        "length": 2
      },
      {
        "id": "15-11",
        "gridX": 12,
        "gridY": 1,
        "direction": "up",
        "color": "pink",
        "length": 1
      },
      {
        "id": "15-12",
        "gridX": 9,
        "gridY": 3,
        "direction": "down",
        "color": "orange",
        "length": 2
      },
      {
        "id": "15-13",
        "gridX": 12,
        "gridY": 3,
        "direction": "right",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "15-14",
        "gridX": 10,
        "gridY": 6,
        "direction": "up",
        "color": "lime",
        "length": 2
      },
      {
        "id": "15-15",
        "gridX": 13,
        "gridY": 6,
        "direction": "down",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "15-16",
        "gridX": 8,
        "gridY": 4,
        "direction": "left",
        "color": "purple",
        "length": 1
      }
    ]
  },
  {
    "id": 16,
    "nameAr": "المتاهة الماسية النظيفة",
    "nameEn": "Clean Diamond Maze",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 13,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "16-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "left",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "16-2",
        "gridX": 11,
        "gridY": 1,
        "direction": "right",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "16-3",
        "gridX": 1,
        "gridY": 6,
        "direction": "down",
        "color": "lime",
        "length": 1
      },
      {
        "id": "16-4",
        "gridX": 11,
        "gridY": 6,
        "direction": "down",
        "color": "lime",
        "length": 1
      },
      {
        "id": "16-5",
        "gridX": 3,
        "gridY": 2,
        "direction": "up",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "16-6",
        "gridX": 9,
        "gridY": 2,
        "direction": "up",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "16-7",
        "gridX": 3,
        "gridY": 5,
        "direction": "left",
        "color": "purple",
        "length": 2
      },
      {
        "id": "16-8",
        "gridX": 9,
        "gridY": 5,
        "direction": "right",
        "color": "purple",
        "length": 2
      },
      {
        "id": "16-9",
        "gridX": 6,
        "gridY": 1,
        "direction": "up",
        "color": "pink",
        "length": 1
      },
      {
        "id": "16-10",
        "gridX": 5,
        "gridY": 3,
        "direction": "left",
        "color": "orange",
        "length": 1
      },
      {
        "id": "16-11",
        "gridX": 7,
        "gridY": 3,
        "direction": "right",
        "color": "orange",
        "length": 1
      },
      {
        "id": "16-12",
        "gridX": 6,
        "gridY": 5,
        "direction": "down",
        "color": "cyan",
        "length": 2
      }
    ]
  },
  {
    "id": 17,
    "nameAr": "شبكة الثعبان الحلزوني",
    "nameEn": "Serpent Spiral",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "17-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "left",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "17-2",
        "gridX": 4,
        "gridY": 1,
        "direction": "up",
        "color": "lime",
        "length": 2
      },
      {
        "id": "17-3",
        "gridX": 2,
        "gridY": 3,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "17-4",
        "gridX": 5,
        "gridY": 3,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "17-5",
        "gridX": 1,
        "gridY": 5,
        "direction": "down",
        "color": "pink",
        "length": 1
      },
      {
        "id": "17-6",
        "gridX": 3,
        "gridY": 5,
        "direction": "left",
        "color": "orange",
        "length": 2
      },
      {
        "id": "17-7",
        "gridX": 6,
        "gridY": 2,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "17-8",
        "gridX": 7,
        "gridY": 4,
        "direction": "left",
        "color": "lime",
        "length": 1
      },
      {
        "id": "17-9",
        "gridX": 10,
        "gridY": 1,
        "direction": "down",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "17-10",
        "gridX": 10,
        "gridY": 4,
        "direction": "left",
        "color": "purple",
        "length": 2
      },
      {
        "id": "17-11",
        "gridX": 13,
        "gridY": 1,
        "direction": "right",
        "color": "pink",
        "length": 1
      },
      {
        "id": "17-12",
        "gridX": 13,
        "gridY": 3,
        "direction": "down",
        "color": "orange",
        "length": 2
      },
      {
        "id": "17-13",
        "gridX": 8,
        "gridY": 6,
        "direction": "left",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "17-14",
        "gridX": 11,
        "gridY": 6,
        "direction": "down",
        "color": "lime",
        "length": 1
      }
    ]
  },
  {
    "id": 18,
    "nameAr": "متاهة العجلات المتقاطعة",
    "nameEn": "Cross Wheels",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "18-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "18-2",
        "gridX": 3,
        "gridY": 1,
        "direction": "left",
        "color": "lime",
        "length": 2
      },
      {
        "id": "18-3",
        "gridX": 1,
        "gridY": 3,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "18-4",
        "gridX": 4,
        "gridY": 3,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "18-5",
        "gridX": 2,
        "gridY": 5,
        "direction": "down",
        "color": "pink",
        "length": 1
      },
      {
        "id": "18-6",
        "gridX": 5,
        "gridY": 5,
        "direction": "down",
        "color": "orange",
        "length": 2
      },
      {
        "id": "18-7",
        "gridX": 7,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "18-8",
        "gridX": 9,
        "gridY": 1,
        "direction": "right",
        "color": "lime",
        "length": 2
      },
      {
        "id": "18-9",
        "gridX": 12,
        "gridY": 1,
        "direction": "down",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "18-10",
        "gridX": 9,
        "gridY": 4,
        "direction": "left",
        "color": "purple",
        "length": 2
      },
      {
        "id": "18-11",
        "gridX": 12,
        "gridY": 4,
        "direction": "down",
        "color": "pink",
        "length": 2
      },
      {
        "id": "18-12",
        "gridX": 8,
        "gridY": 6,
        "direction": "left",
        "color": "orange",
        "length": 2
      },
      {
        "id": "18-13",
        "gridX": 11,
        "gridY": 6,
        "direction": "down",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "18-14",
        "gridX": 13,
        "gridY": 6,
        "direction": "right",
        "color": "lime",
        "length": 1
      }
    ]
  },
  {
    "id": 19,
    "nameAr": "نسيج العواصف الملونة",
    "nameEn": "Tempest Weave",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "19-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "left",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "19-2",
        "gridX": 4,
        "gridY": 1,
        "direction": "up",
        "color": "lime",
        "length": 2
      },
      {
        "id": "19-3",
        "gridX": 2,
        "gridY": 3,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "19-4",
        "gridX": 5,
        "gridY": 3,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "19-5",
        "gridX": 1,
        "gridY": 5,
        "direction": "up",
        "color": "pink",
        "length": 1
      },
      {
        "id": "19-6",
        "gridX": 4,
        "gridY": 5,
        "direction": "left",
        "color": "orange",
        "length": 2
      },
      {
        "id": "19-7",
        "gridX": 6,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "19-8",
        "gridX": 7,
        "gridY": 3,
        "direction": "right",
        "color": "lime",
        "length": 2
      },
      {
        "id": "19-9",
        "gridX": 10,
        "gridY": 1,
        "direction": "down",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "19-10",
        "gridX": 10,
        "gridY": 4,
        "direction": "left",
        "color": "purple",
        "length": 2
      },
      {
        "id": "19-11",
        "gridX": 13,
        "gridY": 1,
        "direction": "right",
        "color": "pink",
        "length": 1
      },
      {
        "id": "19-12",
        "gridX": 13,
        "gridY": 3,
        "direction": "down",
        "color": "orange",
        "length": 2
      },
      {
        "id": "19-13",
        "gridX": 7,
        "gridY": 6,
        "direction": "down",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "19-14",
        "gridX": 10,
        "gridY": 6,
        "direction": "left",
        "color": "lime",
        "length": 2
      },
      {
        "id": "19-15",
        "gridX": 13,
        "gridY": 6,
        "direction": "right",
        "color": "yellow",
        "length": 1
      }
    ]
  },
  {
    "id": 20,
    "nameAr": "🔥 المتاهة الأسطورية العشرين",
    "nameEn": "🔥 Legendary Pinnacle Boss",
    "difficulty": "صعب جداً",
    "difficultyEn": "Very Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 1,
    "arrows": [
      {
        "id": "20-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "20-2",
        "gridX": 4,
        "gridY": 1,
        "direction": "left",
        "color": "lime",
        "length": 2
      },
      {
        "id": "20-3",
        "gridX": 1,
        "gridY": 3,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "20-4",
        "gridX": 4,
        "gridY": 3,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "20-5",
        "gridX": 2,
        "gridY": 5,
        "direction": "left",
        "color": "pink",
        "length": 1
      },
      {
        "id": "20-6",
        "gridX": 4,
        "gridY": 5,
        "direction": "down",
        "color": "orange",
        "length": 1
      },
      {
        "id": "20-7",
        "gridX": 6,
        "gridY": 2,
        "direction": "up",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "20-8",
        "gridX": 7,
        "gridY": 5,
        "direction": "down",
        "color": "lime",
        "length": 2
      },
      {
        "id": "20-9",
        "gridX": 6,
        "gridY": 6,
        "direction": "left",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "20-10",
        "gridX": 9,
        "gridY": 1,
        "direction": "right",
        "color": "purple",
        "length": 2
      },
      {
        "id": "20-11",
        "gridX": 12,
        "gridY": 1,
        "direction": "up",
        "color": "pink",
        "length": 1
      },
      {
        "id": "20-12",
        "gridX": 9,
        "gridY": 3,
        "direction": "down",
        "color": "orange",
        "length": 2
      },
      {
        "id": "20-13",
        "gridX": 12,
        "gridY": 3,
        "direction": "right",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "20-14",
        "gridX": 10,
        "gridY": 6,
        "direction": "up",
        "color": "lime",
        "length": 2
      },
      {
        "id": "20-15",
        "gridX": 13,
        "gridY": 6,
        "direction": "down",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "20-16",
        "gridX": 8,
        "gridY": 4,
        "direction": "left",
        "color": "purple",
        "length": 1
      }
    ]
  },
  {
    "id": 21,
    "nameAr": "متاهة اللانهاية الحلزونية",
    "nameEn": "Infinity Spiral",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "21-1",
        "gridX": 2,
        "gridY": 1,
        "direction": "right",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "21-2",
        "gridX": 5,
        "gridY": 1,
        "direction": "down",
        "color": "lime",
        "length": 2
      },
      {
        "id": "21-3",
        "gridX": 5,
        "gridY": 4,
        "direction": "left",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "21-4",
        "gridX": 2,
        "gridY": 4,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "21-5",
        "gridX": 1,
        "gridY": 6,
        "direction": "right",
        "color": "pink",
        "length": 2
      },
      {
        "id": "21-6",
        "gridX": 4,
        "gridY": 6,
        "direction": "down",
        "color": "orange",
        "length": 1
      },
      {
        "id": "21-7",
        "gridX": 7,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "21-8",
        "gridX": 9,
        "gridY": 2,
        "direction": "right",
        "color": "lime",
        "length": 2
      },
      {
        "id": "21-9",
        "gridX": 12,
        "gridY": 1,
        "direction": "down",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "21-10",
        "gridX": 12,
        "gridY": 4,
        "direction": "left",
        "color": "purple",
        "length": 2
      },
      {
        "id": "21-11",
        "gridX": 9,
        "gridY": 4,
        "direction": "left",
        "color": "pink",
        "length": 2
      },
      {
        "id": "21-12",
        "gridX": 8,
        "gridY": 6,
        "direction": "down",
        "color": "orange",
        "length": 2
      },
      {
        "id": "21-13",
        "gridX": 11,
        "gridY": 6,
        "direction": "down",
        "color": "cyan",
        "length": 1
      }
    ]
  },
  {
    "id": 22,
    "nameAr": "قفل الشبكة الكمومية",
    "nameEn": "Quantum Gridlock",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "22-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "down",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "22-2",
        "gridX": 3,
        "gridY": 1,
        "direction": "left",
        "color": "lime",
        "length": 2
      },
      {
        "id": "22-3",
        "gridX": 1,
        "gridY": 3,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "22-4",
        "gridX": 4,
        "gridY": 3,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "22-5",
        "gridX": 2,
        "gridY": 5,
        "direction": "left",
        "color": "pink",
        "length": 1
      },
      {
        "id": "22-6",
        "gridX": 5,
        "gridY": 5,
        "direction": "down",
        "color": "orange",
        "length": 2
      },
      {
        "id": "22-7",
        "gridX": 7,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "22-8",
        "gridX": 9,
        "gridY": 1,
        "direction": "right",
        "color": "lime",
        "length": 2
      },
      {
        "id": "22-9",
        "gridX": 12,
        "gridY": 1,
        "direction": "right",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "22-10",
        "gridX": 9,
        "gridY": 4,
        "direction": "left",
        "color": "purple",
        "length": 2
      },
      {
        "id": "22-11",
        "gridX": 12,
        "gridY": 4,
        "direction": "up",
        "color": "pink",
        "length": 2
      },
      {
        "id": "22-12",
        "gridX": 8,
        "gridY": 6,
        "direction": "down",
        "color": "orange",
        "length": 1
      },
      {
        "id": "22-13",
        "gridX": 10,
        "gridY": 6,
        "direction": "left",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "22-14",
        "gridX": 13,
        "gridY": 6,
        "direction": "right",
        "color": "lime",
        "length": 1
      }
    ]
  },
  {
    "id": 23,
    "nameAr": "العناقيد المجرة المشتركة",
    "nameEn": "Galactic Cluster",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "23-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "23-2",
        "gridX": 4,
        "gridY": 1,
        "direction": "left",
        "color": "lime",
        "length": 2
      },
      {
        "id": "23-3",
        "gridX": 2,
        "gridY": 3,
        "direction": "left",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "23-4",
        "gridX": 5,
        "gridY": 3,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "23-5",
        "gridX": 1,
        "gridY": 5,
        "direction": "up",
        "color": "pink",
        "length": 1
      },
      {
        "id": "23-6",
        "gridX": 4,
        "gridY": 5,
        "direction": "left",
        "color": "orange",
        "length": 2
      },
      {
        "id": "23-7",
        "gridX": 6,
        "gridY": 2,
        "direction": "up",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "23-8",
        "gridX": 7,
        "gridY": 4,
        "direction": "down",
        "color": "lime",
        "length": 2
      },
      {
        "id": "23-9",
        "gridX": 9,
        "gridY": 1,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "23-10",
        "gridX": 12,
        "gridY": 1,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "23-11",
        "gridX": 9,
        "gridY": 4,
        "direction": "left",
        "color": "pink",
        "length": 2
      },
      {
        "id": "23-12",
        "gridX": 12,
        "gridY": 4,
        "direction": "left",
        "color": "orange",
        "length": 1
      },
      {
        "id": "23-13",
        "gridX": 9,
        "gridY": 6,
        "direction": "right",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "23-14",
        "gridX": 12,
        "gridY": 6,
        "direction": "right",
        "color": "lime",
        "length": 1
      }
    ]
  },
  {
    "id": 24,
    "nameAr": "متاهة الإعصار الدوار",
    "nameEn": "Cyclone Labyrinth",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "24-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "left",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "24-2",
        "gridX": 3,
        "gridY": 1,
        "direction": "up",
        "color": "lime",
        "length": 2
      },
      {
        "id": "24-3",
        "gridX": 1,
        "gridY": 3,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "24-4",
        "gridX": 4,
        "gridY": 3,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "24-5",
        "gridX": 2,
        "gridY": 5,
        "direction": "left",
        "color": "pink",
        "length": 1
      },
      {
        "id": "24-6",
        "gridX": 5,
        "gridY": 5,
        "direction": "down",
        "color": "orange",
        "length": 2
      },
      {
        "id": "24-7",
        "gridX": 7,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "24-8",
        "gridX": 8,
        "gridY": 3,
        "direction": "right",
        "color": "lime",
        "length": 2
      },
      {
        "id": "24-9",
        "gridX": 11,
        "gridY": 1,
        "direction": "down",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "24-10",
        "gridX": 11,
        "gridY": 4,
        "direction": "left",
        "color": "purple",
        "length": 2
      },
      {
        "id": "24-11",
        "gridX": 13,
        "gridY": 1,
        "direction": "up",
        "color": "pink",
        "length": 1
      },
      {
        "id": "24-12",
        "gridX": 13,
        "gridY": 3,
        "direction": "down",
        "color": "orange",
        "length": 2
      },
      {
        "id": "24-13",
        "gridX": 8,
        "gridY": 6,
        "direction": "left",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "24-14",
        "gridX": 11,
        "gridY": 6,
        "direction": "down",
        "color": "lime",
        "length": 1
      },
      {
        "id": "24-15",
        "gridX": 13,
        "gridY": 6,
        "direction": "right",
        "color": "yellow",
        "length": 1
      }
    ]
  },
  {
    "id": 25,
    "nameAr": "🔥 تحدي السكون المطلق ٢٥",
    "nameEn": "🔥 Master Overlord Boss",
    "difficulty": "صعب جداً",
    "difficultyEn": "Very Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 1,
    "arrows": [
      {
        "id": "25-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "25-2",
        "gridX": 4,
        "gridY": 1,
        "direction": "left",
        "color": "lime",
        "length": 2
      },
      {
        "id": "25-3",
        "gridX": 1,
        "gridY": 3,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "25-4",
        "gridX": 4,
        "gridY": 3,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "25-5",
        "gridX": 2,
        "gridY": 5,
        "direction": "left",
        "color": "pink",
        "length": 1
      },
      {
        "id": "25-6",
        "gridX": 4,
        "gridY": 5,
        "direction": "down",
        "color": "orange",
        "length": 1
      },
      {
        "id": "25-7",
        "gridX": 6,
        "gridY": 2,
        "direction": "up",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "25-8",
        "gridX": 7,
        "gridY": 5,
        "direction": "down",
        "color": "lime",
        "length": 2
      },
      {
        "id": "25-9",
        "gridX": 6,
        "gridY": 6,
        "direction": "left",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "25-10",
        "gridX": 9,
        "gridY": 1,
        "direction": "right",
        "color": "purple",
        "length": 2
      },
      {
        "id": "25-11",
        "gridX": 12,
        "gridY": 1,
        "direction": "up",
        "color": "pink",
        "length": 1
      },
      {
        "id": "25-12",
        "gridX": 9,
        "gridY": 3,
        "direction": "down",
        "color": "orange",
        "length": 2
      },
      {
        "id": "25-13",
        "gridX": 12,
        "gridY": 3,
        "direction": "right",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "25-14",
        "gridX": 10,
        "gridY": 6,
        "direction": "up",
        "color": "lime",
        "length": 2
      },
      {
        "id": "25-15",
        "gridX": 13,
        "gridY": 6,
        "direction": "down",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "25-16",
        "gridX": 8,
        "gridY": 4,
        "direction": "left",
        "color": "purple",
        "length": 1
      },
      {
        "id": "25-17",
        "gridX": 11,
        "gridY": 5,
        "direction": "right",
        "color": "orange",
        "length": 1
      }
    ]
  },
  {
    "id": 26,
    "nameAr": "قلعة المكعب الفائق",
    "nameEn": "Hypercube Fortress",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "26-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "left",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "26-2",
        "gridX": 4,
        "gridY": 1,
        "direction": "up",
        "color": "lime",
        "length": 2
      },
      {
        "id": "26-3",
        "gridX": 2,
        "gridY": 3,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "26-4",
        "gridX": 5,
        "gridY": 3,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "26-5",
        "gridX": 1,
        "gridY": 5,
        "direction": "down",
        "color": "pink",
        "length": 1
      },
      {
        "id": "26-6",
        "gridX": 3,
        "gridY": 5,
        "direction": "left",
        "color": "orange",
        "length": 2
      },
      {
        "id": "26-7",
        "gridX": 6,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "26-8",
        "gridX": 7,
        "gridY": 3,
        "direction": "right",
        "color": "lime",
        "length": 2
      },
      {
        "id": "26-9",
        "gridX": 10,
        "gridY": 1,
        "direction": "down",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "26-10",
        "gridX": 10,
        "gridY": 4,
        "direction": "left",
        "color": "purple",
        "length": 2
      },
      {
        "id": "26-11",
        "gridX": 13,
        "gridY": 1,
        "direction": "right",
        "color": "pink",
        "length": 1
      },
      {
        "id": "26-12",
        "gridX": 13,
        "gridY": 3,
        "direction": "down",
        "color": "orange",
        "length": 2
      },
      {
        "id": "26-13",
        "gridX": 8,
        "gridY": 6,
        "direction": "left",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "26-14",
        "gridX": 11,
        "gridY": 6,
        "direction": "down",
        "color": "lime",
        "length": 1
      }
    ]
  },
  {
    "id": 27,
    "nameAr": "نواة ضوء النجوم",
    "nameEn": "Starlight Nexus",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "27-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "27-2",
        "gridX": 3,
        "gridY": 1,
        "direction": "left",
        "color": "lime",
        "length": 2
      },
      {
        "id": "27-3",
        "gridX": 1,
        "gridY": 3,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "27-4",
        "gridX": 4,
        "gridY": 3,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "27-5",
        "gridX": 2,
        "gridY": 5,
        "direction": "down",
        "color": "pink",
        "length": 1
      },
      {
        "id": "27-6",
        "gridX": 5,
        "gridY": 5,
        "direction": "right",
        "color": "orange",
        "length": 2
      },
      {
        "id": "27-7",
        "gridX": 7,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "27-8",
        "gridX": 9,
        "gridY": 1,
        "direction": "right",
        "color": "lime",
        "length": 2
      },
      {
        "id": "27-9",
        "gridX": 12,
        "gridY": 1,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "27-10",
        "gridX": 9,
        "gridY": 4,
        "direction": "up",
        "color": "purple",
        "length": 2
      },
      {
        "id": "27-11",
        "gridX": 12,
        "gridY": 4,
        "direction": "up",
        "color": "pink",
        "length": 2
      },
      {
        "id": "27-12",
        "gridX": 8,
        "gridY": 6,
        "direction": "left",
        "color": "orange",
        "length": 2
      },
      {
        "id": "27-13",
        "gridX": 11,
        "gridY": 6,
        "direction": "down",
        "color": "cyan",
        "length": 1
      }
    ]
  },
  {
    "id": 28,
    "nameAr": "دوامة منشور الألوان",
    "nameEn": "Prismatic Vortex",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "28-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "left",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "28-2",
        "gridX": 4,
        "gridY": 1,
        "direction": "up",
        "color": "lime",
        "length": 2
      },
      {
        "id": "28-3",
        "gridX": 2,
        "gridY": 3,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "28-4",
        "gridX": 5,
        "gridY": 3,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "28-5",
        "gridX": 1,
        "gridY": 5,
        "direction": "up",
        "color": "pink",
        "length": 1
      },
      {
        "id": "28-6",
        "gridX": 4,
        "gridY": 5,
        "direction": "left",
        "color": "orange",
        "length": 2
      },
      {
        "id": "28-7",
        "gridX": 6,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "28-8",
        "gridX": 7,
        "gridY": 3,
        "direction": "right",
        "color": "lime",
        "length": 2
      },
      {
        "id": "28-9",
        "gridX": 10,
        "gridY": 1,
        "direction": "down",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "28-10",
        "gridX": 10,
        "gridY": 4,
        "direction": "left",
        "color": "purple",
        "length": 2
      },
      {
        "id": "28-11",
        "gridX": 13,
        "gridY": 1,
        "direction": "right",
        "color": "pink",
        "length": 1
      },
      {
        "id": "28-12",
        "gridX": 13,
        "gridY": 3,
        "direction": "down",
        "color": "orange",
        "length": 2
      },
      {
        "id": "28-13",
        "gridX": 7,
        "gridY": 6,
        "direction": "down",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "28-14",
        "gridX": 10,
        "gridY": 6,
        "direction": "left",
        "color": "lime",
        "length": 2
      }
    ]
  },
  {
    "id": 29,
    "nameAr": "تقاطع التيتان العظيم",
    "nameEn": "Titan Crossway",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "29-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "29-2",
        "gridX": 3,
        "gridY": 1,
        "direction": "left",
        "color": "lime",
        "length": 2
      },
      {
        "id": "29-3",
        "gridX": 1,
        "gridY": 3,
        "direction": "down",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "29-4",
        "gridX": 3,
        "gridY": 3,
        "direction": "right",
        "color": "purple",
        "length": 2
      },
      {
        "id": "29-5",
        "gridX": 6,
        "gridY": 2,
        "direction": "down",
        "color": "pink",
        "length": 2
      },
      {
        "id": "29-6",
        "gridX": 6,
        "gridY": 5,
        "direction": "left",
        "color": "orange",
        "length": 2
      },
      {
        "id": "29-7",
        "gridX": 2,
        "gridY": 5,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "29-8",
        "gridX": 4,
        "gridY": 6,
        "direction": "down",
        "color": "lime",
        "length": 1
      },
      {
        "id": "29-9",
        "gridX": 8,
        "gridY": 1,
        "direction": "up",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "29-10",
        "gridX": 10,
        "gridY": 1,
        "direction": "right",
        "color": "purple",
        "length": 1
      },
      {
        "id": "29-11",
        "gridX": 13,
        "gridY": 1,
        "direction": "down",
        "color": "pink",
        "length": 2
      },
      {
        "id": "29-12",
        "gridX": 10,
        "gridY": 4,
        "direction": "left",
        "color": "orange",
        "length": 2
      },
      {
        "id": "29-13",
        "gridX": 13,
        "gridY": 4,
        "direction": "down",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "29-14",
        "gridX": 9,
        "gridY": 6,
        "direction": "right",
        "color": "lime",
        "length": 1
      },
      {
        "id": "29-15",
        "gridX": 11,
        "gridY": 6,
        "direction": "right",
        "color": "yellow",
        "length": 2
      }
    ]
  },
  {
    "id": 30,
    "nameAr": "🔥 تحدي الإمبراطور الأخير ٣٠",
    "nameEn": "🔥 Grand Emperor Boss",
    "difficulty": "صعب جداً",
    "difficultyEn": "Very Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 1,
    "arrows": [
      {
        "id": "30-1",
        "gridX": 1,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "30-2",
        "gridX": 4,
        "gridY": 1,
        "direction": "left",
        "color": "lime",
        "length": 2
      },
      {
        "id": "30-3",
        "gridX": 1,
        "gridY": 3,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "30-4",
        "gridX": 4,
        "gridY": 3,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "30-5",
        "gridX": 2,
        "gridY": 5,
        "direction": "left",
        "color": "pink",
        "length": 1
      },
      {
        "id": "30-6",
        "gridX": 4,
        "gridY": 5,
        "direction": "down",
        "color": "orange",
        "length": 1
      },
      {
        "id": "30-7",
        "gridX": 6,
        "gridY": 2,
        "direction": "up",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "30-8",
        "gridX": 7,
        "gridY": 5,
        "direction": "down",
        "color": "lime",
        "length": 2
      },
      {
        "id": "30-9",
        "gridX": 6,
        "gridY": 6,
        "direction": "left",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "30-10",
        "gridX": 9,
        "gridY": 1,
        "direction": "right",
        "color": "purple",
        "length": 2
      },
      {
        "id": "30-11",
        "gridX": 12,
        "gridY": 1,
        "direction": "up",
        "color": "pink",
        "length": 1
      },
      {
        "id": "30-12",
        "gridX": 9,
        "gridY": 3,
        "direction": "down",
        "color": "orange",
        "length": 2
      },
      {
        "id": "30-13",
        "gridX": 12,
        "gridY": 3,
        "direction": "right",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "30-14",
        "gridX": 10,
        "gridY": 6,
        "direction": "up",
        "color": "lime",
        "length": 2
      },
      {
        "id": "30-15",
        "gridX": 13,
        "gridY": 6,
        "direction": "down",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "30-16",
        "gridX": 8,
        "gridY": 4,
        "direction": "left",
        "color": "purple",
        "length": 1
      },
      {
        "id": "30-17",
        "gridX": 11,
        "gridY": 5,
        "direction": "right",
        "color": "orange",
        "length": 1
      }
    ]
  },
  {
    "id": 31,
    "nameAr": "متاهة درب التبانة",
    "nameEn": "Milky Way Labyrinth",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "31-1",
        "gridX": 11,
        "gridY": 4,
        "direction": "right",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "31-2",
        "gridX": 9,
        "gridY": 1,
        "direction": "left",
        "color": "lime",
        "length": 2
      },
      {
        "id": "31-3",
        "gridX": 2,
        "gridY": 5,
        "direction": "left",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "31-4",
        "gridX": 5,
        "gridY": 3,
        "direction": "up",
        "color": "purple",
        "length": 2
      },
      {
        "id": "31-5",
        "gridX": 4,
        "gridY": 3,
        "direction": "right",
        "color": "pink",
        "length": 1
      },
      {
        "id": "31-6",
        "gridX": 2,
        "gridY": 6,
        "direction": "left",
        "color": "orange",
        "length": 1
      },
      {
        "id": "31-7",
        "gridX": 11,
        "gridY": 5,
        "direction": "right",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "31-8",
        "gridX": 6,
        "gridY": 1,
        "direction": "up",
        "color": "lime",
        "length": 2
      },
      {
        "id": "31-9",
        "gridX": 8,
        "gridY": 4,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "31-10",
        "gridX": 8,
        "gridY": 6,
        "direction": "down",
        "color": "purple",
        "length": 1
      },
      {
        "id": "31-11",
        "gridX": 11,
        "gridY": 2,
        "direction": "right",
        "color": "pink",
        "length": 2
      },
      {
        "id": "31-12",
        "gridX": 5,
        "gridY": 5,
        "direction": "up",
        "color": "orange",
        "length": 2
      },
      {
        "id": "31-13",
        "gridX": 7,
        "gridY": 5,
        "direction": "up",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "31-14",
        "gridX": 5,
        "gridY": 6,
        "direction": "right",
        "color": "lime",
        "length": 2
      }
    ]
  },
  {
    "id": 32,
    "nameAr": "نسيج الكريستال المتألق",
    "nameEn": "Shining Crystal Weave",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "32-1",
        "gridX": 3,
        "gridY": 3,
        "direction": "left",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "32-2",
        "gridX": 3,
        "gridY": 2,
        "direction": "left",
        "color": "lime",
        "length": 1
      },
      {
        "id": "32-3",
        "gridX": 8,
        "gridY": 2,
        "direction": "right",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "32-4",
        "gridX": 4,
        "gridY": 6,
        "direction": "left",
        "color": "purple",
        "length": 2
      },
      {
        "id": "32-5",
        "gridX": 8,
        "gridY": 5,
        "direction": "up",
        "color": "pink",
        "length": 1
      },
      {
        "id": "32-6",
        "gridX": 7,
        "gridY": 2,
        "direction": "down",
        "color": "orange",
        "length": 1
      },
      {
        "id": "32-7",
        "gridX": 10,
        "gridY": 2,
        "direction": "up",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "32-8",
        "gridX": 11,
        "gridY": 3,
        "direction": "up",
        "color": "lime",
        "length": 2
      },
      {
        "id": "32-9",
        "gridX": 5,
        "gridY": 6,
        "direction": "down",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "32-10",
        "gridX": 3,
        "gridY": 4,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "32-11",
        "gridX": 5,
        "gridY": 3,
        "direction": "left",
        "color": "pink",
        "length": 1
      },
      {
        "id": "32-12",
        "gridX": 6,
        "gridY": 6,
        "direction": "up",
        "color": "orange",
        "length": 2
      },
      {
        "id": "32-13",
        "gridX": 11,
        "gridY": 5,
        "direction": "right",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "32-14",
        "gridX": 5,
        "gridY": 1,
        "direction": "left",
        "color": "lime",
        "length": 1
      },
      {
        "id": "32-15",
        "gridX": 8,
        "gridY": 1,
        "direction": "left",
        "color": "yellow",
        "length": 2
      }
    ]
  },
  {
    "id": 33,
    "nameAr": "شبكة الليزر الكمية",
    "nameEn": "Quantum Laser Net",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "33-1",
        "gridX": 8,
        "gridY": 5,
        "direction": "right",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "33-2",
        "gridX": 10,
        "gridY": 3,
        "direction": "down",
        "color": "lime",
        "length": 1
      },
      {
        "id": "33-3",
        "gridX": 5,
        "gridY": 4,
        "direction": "right",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "33-4",
        "gridX": 7,
        "gridY": 1,
        "direction": "right",
        "color": "purple",
        "length": 2
      },
      {
        "id": "33-5",
        "gridX": 7,
        "gridY": 3,
        "direction": "right",
        "color": "pink",
        "length": 2
      },
      {
        "id": "33-6",
        "gridX": 7,
        "gridY": 4,
        "direction": "down",
        "color": "orange",
        "length": 1
      },
      {
        "id": "33-7",
        "gridX": 1,
        "gridY": 2,
        "direction": "down",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "33-8",
        "gridX": 8,
        "gridY": 2,
        "direction": "down",
        "color": "lime",
        "length": 1
      },
      {
        "id": "33-9",
        "gridX": 6,
        "gridY": 6,
        "direction": "up",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "33-10",
        "gridX": 1,
        "gridY": 6,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "33-11",
        "gridX": 6,
        "gridY": 2,
        "direction": "left",
        "color": "pink",
        "length": 2
      },
      {
        "id": "33-12",
        "gridX": 4,
        "gridY": 3,
        "direction": "down",
        "color": "orange",
        "length": 2
      },
      {
        "id": "33-13",
        "gridX": 2,
        "gridY": 1,
        "direction": "right",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "33-14",
        "gridX": 9,
        "gridY": 3,
        "direction": "right",
        "color": "lime",
        "length": 1
      },
      {
        "id": "33-15",
        "gridX": 12,
        "gridY": 6,
        "direction": "down",
        "color": "yellow",
        "length": 2
      }
    ]
  },
  {
    "id": 34,
    "nameAr": "حلقة الأفق البعيد",
    "nameEn": "Far Horizon Loop",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "34-1",
        "gridX": 9,
        "gridY": 6,
        "direction": "up",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "34-2",
        "gridX": 8,
        "gridY": 4,
        "direction": "up",
        "color": "lime",
        "length": 2
      },
      {
        "id": "34-3",
        "gridX": 4,
        "gridY": 5,
        "direction": "up",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "34-4",
        "gridX": 12,
        "gridY": 6,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "34-5",
        "gridX": 6,
        "gridY": 5,
        "direction": "left",
        "color": "pink",
        "length": 2
      },
      {
        "id": "34-6",
        "gridX": 12,
        "gridY": 3,
        "direction": "up",
        "color": "orange",
        "length": 2
      },
      {
        "id": "34-7",
        "gridX": 1,
        "gridY": 1,
        "direction": "left",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "34-8",
        "gridX": 7,
        "gridY": 6,
        "direction": "left",
        "color": "lime",
        "length": 1
      },
      {
        "id": "34-9",
        "gridX": 7,
        "gridY": 3,
        "direction": "left",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "34-10",
        "gridX": 11,
        "gridY": 5,
        "direction": "up",
        "color": "purple",
        "length": 1
      },
      {
        "id": "34-11",
        "gridX": 10,
        "gridY": 5,
        "direction": "down",
        "color": "pink",
        "length": 2
      },
      {
        "id": "34-12",
        "gridX": 11,
        "gridY": 2,
        "direction": "up",
        "color": "orange",
        "length": 2
      },
      {
        "id": "34-13",
        "gridX": 4,
        "gridY": 1,
        "direction": "left",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "34-14",
        "gridX": 6,
        "gridY": 2,
        "direction": "left",
        "color": "lime",
        "length": 1
      },
      {
        "id": "34-15",
        "gridX": 4,
        "gridY": 6,
        "direction": "down",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "34-16",
        "gridX": 8,
        "gridY": 6,
        "direction": "down",
        "color": "purple",
        "length": 2
      }
    ]
  },
  {
    "id": 35,
    "nameAr": "🔥 تحدي البركان الخماسي ٣٥",
    "nameEn": "🔥 Volcano Master Boss",
    "difficulty": "صعب جداً",
    "difficultyEn": "Very Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 1,
    "arrows": [
      {
        "id": "35-1",
        "gridX": 11,
        "gridY": 4,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "35-2",
        "gridX": 2,
        "gridY": 1,
        "direction": "up",
        "color": "lime",
        "length": 2
      },
      {
        "id": "35-3",
        "gridX": 12,
        "gridY": 6,
        "direction": "left",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "35-4",
        "gridX": 4,
        "gridY": 1,
        "direction": "down",
        "color": "purple",
        "length": 2
      },
      {
        "id": "35-5",
        "gridX": 3,
        "gridY": 4,
        "direction": "up",
        "color": "pink",
        "length": 2
      },
      {
        "id": "35-6",
        "gridX": 3,
        "gridY": 5,
        "direction": "left",
        "color": "orange",
        "length": 1
      },
      {
        "id": "35-7",
        "gridX": 7,
        "gridY": 5,
        "direction": "down",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "35-8",
        "gridX": 1,
        "gridY": 5,
        "direction": "left",
        "color": "lime",
        "length": 2
      },
      {
        "id": "35-9",
        "gridX": 6,
        "gridY": 5,
        "direction": "left",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "35-10",
        "gridX": 8,
        "gridY": 5,
        "direction": "right",
        "color": "purple",
        "length": 1
      },
      {
        "id": "35-11",
        "gridX": 4,
        "gridY": 4,
        "direction": "left",
        "color": "pink",
        "length": 1
      },
      {
        "id": "35-12",
        "gridX": 6,
        "gridY": 2,
        "direction": "up",
        "color": "orange",
        "length": 2
      },
      {
        "id": "35-13",
        "gridX": 8,
        "gridY": 3,
        "direction": "left",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "35-14",
        "gridX": 11,
        "gridY": 1,
        "direction": "right",
        "color": "lime",
        "length": 1
      },
      {
        "id": "35-15",
        "gridX": 9,
        "gridY": 6,
        "direction": "down",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "35-16",
        "gridX": 12,
        "gridY": 5,
        "direction": "right",
        "color": "purple",
        "length": 1
      },
      {
        "id": "35-17",
        "gridX": 6,
        "gridY": 3,
        "direction": "up",
        "color": "pink",
        "length": 1
      }
    ]
  },
  {
    "id": 36,
    "nameAr": "سديم العواصف المضيئة",
    "nameEn": "Luminous Nebula",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "36-1",
        "gridX": 5,
        "gridY": 1,
        "direction": "right",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "36-2",
        "gridX": 4,
        "gridY": 5,
        "direction": "right",
        "color": "lime",
        "length": 2
      },
      {
        "id": "36-3",
        "gridX": 11,
        "gridY": 1,
        "direction": "right",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "36-4",
        "gridX": 6,
        "gridY": 5,
        "direction": "right",
        "color": "purple",
        "length": 1
      },
      {
        "id": "36-5",
        "gridX": 7,
        "gridY": 5,
        "direction": "down",
        "color": "pink",
        "length": 2
      },
      {
        "id": "36-6",
        "gridX": 4,
        "gridY": 6,
        "direction": "left",
        "color": "orange",
        "length": 1
      },
      {
        "id": "36-7",
        "gridX": 1,
        "gridY": 4,
        "direction": "left",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "36-8",
        "gridX": 3,
        "gridY": 3,
        "direction": "up",
        "color": "lime",
        "length": 2
      },
      {
        "id": "36-9",
        "gridX": 9,
        "gridY": 3,
        "direction": "left",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "36-10",
        "gridX": 11,
        "gridY": 5,
        "direction": "right",
        "color": "purple",
        "length": 2
      },
      {
        "id": "36-11",
        "gridX": 8,
        "gridY": 1,
        "direction": "up",
        "color": "pink",
        "length": 2
      },
      {
        "id": "36-12",
        "gridX": 3,
        "gridY": 1,
        "direction": "up",
        "color": "orange",
        "length": 1
      },
      {
        "id": "36-13",
        "gridX": 6,
        "gridY": 4,
        "direction": "right",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "36-14",
        "gridX": 6,
        "gridY": 3,
        "direction": "up",
        "color": "lime",
        "length": 1
      },
      {
        "id": "36-15",
        "gridX": 9,
        "gridY": 6,
        "direction": "down",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "36-16",
        "gridX": 2,
        "gridY": 6,
        "direction": "left",
        "color": "purple",
        "length": 2
      },
      {
        "id": "36-17",
        "gridX": 8,
        "gridY": 6,
        "direction": "left",
        "color": "pink",
        "length": 1
      }
    ]
  },
  {
    "id": 37,
    "nameAr": "قلعة التاج الملكي",
    "nameEn": "Royal Crown Citadel",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "37-1",
        "gridX": 1,
        "gridY": 6,
        "direction": "right",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "37-2",
        "gridX": 6,
        "gridY": 2,
        "direction": "right",
        "color": "lime",
        "length": 1
      },
      {
        "id": "37-3",
        "gridX": 3,
        "gridY": 4,
        "direction": "down",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "37-4",
        "gridX": 5,
        "gridY": 5,
        "direction": "left",
        "color": "purple",
        "length": 1
      },
      {
        "id": "37-5",
        "gridX": 1,
        "gridY": 3,
        "direction": "up",
        "color": "pink",
        "length": 2
      },
      {
        "id": "37-6",
        "gridX": 12,
        "gridY": 5,
        "direction": "down",
        "color": "orange",
        "length": 2
      },
      {
        "id": "37-7",
        "gridX": 12,
        "gridY": 2,
        "direction": "down",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "37-8",
        "gridX": 8,
        "gridY": 1,
        "direction": "down",
        "color": "lime",
        "length": 2
      },
      {
        "id": "37-9",
        "gridX": 1,
        "gridY": 1,
        "direction": "right",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "37-10",
        "gridX": 6,
        "gridY": 4,
        "direction": "left",
        "color": "purple",
        "length": 2
      },
      {
        "id": "37-11",
        "gridX": 4,
        "gridY": 6,
        "direction": "up",
        "color": "pink",
        "length": 1
      },
      {
        "id": "37-12",
        "gridX": 2,
        "gridY": 1,
        "direction": "down",
        "color": "orange",
        "length": 2
      },
      {
        "id": "37-13",
        "gridX": 9,
        "gridY": 1,
        "direction": "down",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "37-14",
        "gridX": 7,
        "gridY": 1,
        "direction": "up",
        "color": "lime",
        "length": 2
      },
      {
        "id": "37-15",
        "gridX": 2,
        "gridY": 6,
        "direction": "down",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "37-16",
        "gridX": 7,
        "gridY": 3,
        "direction": "down",
        "color": "purple",
        "length": 1
      },
      {
        "id": "37-17",
        "gridX": 11,
        "gridY": 5,
        "direction": "up",
        "color": "pink",
        "length": 1
      }
    ]
  },
  {
    "id": 38,
    "nameAr": "متاهة المدار الحلزوني",
    "nameEn": "Orbital Spiral Maze",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "38-1",
        "gridX": 7,
        "gridY": 6,
        "direction": "right",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "38-2",
        "gridX": 7,
        "gridY": 2,
        "direction": "up",
        "color": "lime",
        "length": 1
      },
      {
        "id": "38-3",
        "gridX": 3,
        "gridY": 3,
        "direction": "up",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "38-4",
        "gridX": 8,
        "gridY": 2,
        "direction": "right",
        "color": "purple",
        "length": 1
      },
      {
        "id": "38-5",
        "gridX": 2,
        "gridY": 2,
        "direction": "up",
        "color": "pink",
        "length": 1
      },
      {
        "id": "38-6",
        "gridX": 9,
        "gridY": 3,
        "direction": "right",
        "color": "orange",
        "length": 2
      },
      {
        "id": "38-7",
        "gridX": 3,
        "gridY": 4,
        "direction": "left",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "38-8",
        "gridX": 4,
        "gridY": 1,
        "direction": "right",
        "color": "lime",
        "length": 2
      },
      {
        "id": "38-9",
        "gridX": 11,
        "gridY": 1,
        "direction": "up",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "38-10",
        "gridX": 7,
        "gridY": 3,
        "direction": "up",
        "color": "purple",
        "length": 1
      },
      {
        "id": "38-11",
        "gridX": 2,
        "gridY": 3,
        "direction": "left",
        "color": "pink",
        "length": 1
      },
      {
        "id": "38-12",
        "gridX": 12,
        "gridY": 2,
        "direction": "up",
        "color": "orange",
        "length": 1
      },
      {
        "id": "38-13",
        "gridX": 6,
        "gridY": 6,
        "direction": "left",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "38-14",
        "gridX": 6,
        "gridY": 1,
        "direction": "up",
        "color": "lime",
        "length": 2
      },
      {
        "id": "38-15",
        "gridX": 8,
        "gridY": 5,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "38-16",
        "gridX": 3,
        "gridY": 2,
        "direction": "right",
        "color": "purple",
        "length": 1
      },
      {
        "id": "38-17",
        "gridX": 6,
        "gridY": 4,
        "direction": "left",
        "color": "pink",
        "length": 1
      },
      {
        "id": "38-18",
        "gridX": 9,
        "gridY": 4,
        "direction": "right",
        "color": "orange",
        "length": 1
      }
    ]
  },
  {
    "id": 39,
    "nameAr": "تقاطع المجرات العملاقة",
    "nameEn": "Giant Galaxy Junction",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 3,
    "arrows": [
      {
        "id": "39-1",
        "gridX": 4,
        "gridY": 3,
        "direction": "right",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "39-2",
        "gridX": 3,
        "gridY": 2,
        "direction": "up",
        "color": "lime",
        "length": 1
      },
      {
        "id": "39-3",
        "gridX": 4,
        "gridY": 2,
        "direction": "up",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "39-4",
        "gridX": 10,
        "gridY": 5,
        "direction": "up",
        "color": "purple",
        "length": 2
      },
      {
        "id": "39-5",
        "gridX": 12,
        "gridY": 1,
        "direction": "right",
        "color": "pink",
        "length": 1
      },
      {
        "id": "39-6",
        "gridX": 5,
        "gridY": 5,
        "direction": "left",
        "color": "orange",
        "length": 1
      },
      {
        "id": "39-7",
        "gridX": 6,
        "gridY": 6,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "39-8",
        "gridX": 5,
        "gridY": 6,
        "direction": "left",
        "color": "lime",
        "length": 1
      },
      {
        "id": "39-9",
        "gridX": 7,
        "gridY": 6,
        "direction": "left",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "39-10",
        "gridX": 3,
        "gridY": 3,
        "direction": "down",
        "color": "purple",
        "length": 1
      },
      {
        "id": "39-11",
        "gridX": 12,
        "gridY": 6,
        "direction": "up",
        "color": "pink",
        "length": 1
      },
      {
        "id": "39-12",
        "gridX": 1,
        "gridY": 2,
        "direction": "down",
        "color": "orange",
        "length": 1
      },
      {
        "id": "39-13",
        "gridX": 1,
        "gridY": 1,
        "direction": "up",
        "color": "cyan",
        "length": 2
      },
      {
        "id": "39-14",
        "gridX": 7,
        "gridY": 1,
        "direction": "down",
        "color": "lime",
        "length": 2
      },
      {
        "id": "39-15",
        "gridX": 3,
        "gridY": 1,
        "direction": "right",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "39-16",
        "gridX": 1,
        "gridY": 6,
        "direction": "left",
        "color": "purple",
        "length": 1
      },
      {
        "id": "39-17",
        "gridX": 6,
        "gridY": 4,
        "direction": "up",
        "color": "pink",
        "length": 1
      },
      {
        "id": "39-18",
        "gridX": 8,
        "gridY": 1,
        "direction": "right",
        "color": "orange",
        "length": 1
      }
    ]
  },
  {
    "id": 40,
    "nameAr": "🔥 تحدي السحابة الخارقة ٤٠",
    "nameEn": "🔥 Supercloud Emperor Boss",
    "difficulty": "صعب جداً",
    "difficultyEn": "Very Hard",
    "gridSize": {
      "cols": 14,
      "rows": 8
    },
    "maxDrops": 1,
    "arrows": [
      {
        "id": "40-1",
        "gridX": 3,
        "gridY": 6,
        "direction": "up",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "40-2",
        "gridX": 8,
        "gridY": 5,
        "direction": "right",
        "color": "lime",
        "length": 2
      },
      {
        "id": "40-3",
        "gridX": 4,
        "gridY": 1,
        "direction": "down",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "40-4",
        "gridX": 7,
        "gridY": 2,
        "direction": "left",
        "color": "purple",
        "length": 2
      },
      {
        "id": "40-5",
        "gridX": 2,
        "gridY": 6,
        "direction": "down",
        "color": "pink",
        "length": 2
      },
      {
        "id": "40-6",
        "gridX": 9,
        "gridY": 4,
        "direction": "right",
        "color": "orange",
        "length": 1
      },
      {
        "id": "40-7",
        "gridX": 1,
        "gridY": 4,
        "direction": "left",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "40-8",
        "gridX": 12,
        "gridY": 2,
        "direction": "right",
        "color": "lime",
        "length": 1
      },
      {
        "id": "40-9",
        "gridX": 10,
        "gridY": 6,
        "direction": "right",
        "color": "yellow",
        "length": 2
      },
      {
        "id": "40-10",
        "gridX": 5,
        "gridY": 6,
        "direction": "down",
        "color": "purple",
        "length": 1
      },
      {
        "id": "40-11",
        "gridX": 6,
        "gridY": 6,
        "direction": "left",
        "color": "pink",
        "length": 1
      },
      {
        "id": "40-12",
        "gridX": 5,
        "gridY": 5,
        "direction": "up",
        "color": "orange",
        "length": 2
      },
      {
        "id": "40-13",
        "gridX": 1,
        "gridY": 3,
        "direction": "right",
        "color": "cyan",
        "length": 1
      },
      {
        "id": "40-14",
        "gridX": 9,
        "gridY": 2,
        "direction": "up",
        "color": "lime",
        "length": 1
      },
      {
        "id": "40-15",
        "gridX": 2,
        "gridY": 3,
        "direction": "up",
        "color": "yellow",
        "length": 1
      },
      {
        "id": "40-16",
        "gridX": 6,
        "gridY": 4,
        "direction": "down",
        "color": "purple",
        "length": 1
      },
      {
        "id": "40-17",
        "gridX": 5,
        "gridY": 3,
        "direction": "right",
        "color": "pink",
        "length": 1
      }
    ]
  },
  {
    "id": 41,
    "nameAr": "المستوى ٤١ - ممر المزدوج",
    "nameEn": "Level 41 - Double Corridor",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": { "cols": 12, "rows": 7 },
    "maxDrops": 3,
    "arrows": [
      { "id": "41-1", "gridX": 2, "gridY": 2, "direction": "right", "color": "cyan", "length": 2, "type": "double" },
      { "id": "41-2", "gridX": 5, "gridY": 1, "direction": "down", "color": "lime", "length": 2 },
      { "id": "41-3", "gridX": 6, "gridY": 4, "direction": "up", "color": "yellow", "length": 1 },
      { "id": "41-4", "gridX": 8, "gridY": 2, "direction": "left", "color": "purple", "length": 2 },
      { "id": "41-5", "gridX": 1, "gridY": 5, "direction": "right", "color": "pink", "length": 1 },
      { "id": "41-6", "gridX": 3, "gridY": 4, "direction": "up-right", "color": "orange", "length": 1 },
      { "id": "41-7", "gridX": 9, "gridY": 5, "direction": "up", "color": "cyan", "length": 1 },
      { "id": "41-8", "gridX": 10, "gridY": 1, "direction": "down", "color": "lime", "length": 2 }
    ]
  },
  {
    "id": 42,
    "nameAr": "المستوى ٤٢ - متاهة النجمة",
    "nameEn": "Level 42 - Star Maze",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": { "cols": 12, "rows": 7 },
    "maxDrops": 3,
    "arrows": [
      { "id": "42-1", "gridX": 4, "gridY": 3, "direction": "up-left", "color": "cyan", "length": 1 },
      { "id": "42-2", "gridX": 7, "gridY": 3, "direction": "up-right", "color": "purple", "length": 1 },
      { "id": "42-3", "gridX": 4, "gridY": 4, "direction": "down-left", "color": "yellow", "length": 1 },
      { "id": "42-4", "gridX": 7, "gridY": 4, "direction": "down-right", "color": "lime", "length": 1 },
      { "id": "42-5", "gridX": 5, "gridY": 1, "direction": "down", "color": "pink", "length": 1, "type": "double" },
      { "id": "42-6", "gridX": 6, "gridY": 6, "direction": "up", "color": "orange", "length": 1 },
      { "id": "42-7", "gridX": 1, "gridY": 3, "direction": "left", "color": "cyan", "length": 2 },
      { "id": "42-8", "gridX": 10, "gridY": 3, "direction": "right", "color": "lime", "length": 2 }
    ]
  },
  {
    "id": 43,
    "nameAr": "المستوى ٤٣ - شبكة البلورات",
    "nameEn": "Level 43 - Crystal Lattice",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": { "cols": 12, "rows": 8 },
    "maxDrops": 3,
    "arrows": [
      { "id": "43-1", "gridX": 2, "gridY": 2, "direction": "down", "color": "cyan", "length": 2 },
      { "id": "43-2", "gridX": 3, "gridY": 5, "direction": "right", "color": "lime", "length": 2, "type": "double" },
      { "id": "43-3", "gridX": 6, "gridY": 2, "direction": "up-right", "color": "yellow", "length": 1 },
      { "id": "43-4", "gridX": 8, "gridY": 3, "direction": "down-left", "color": "purple", "length": 1 },
      { "id": "43-5", "gridX": 9, "gridY": 6, "direction": "up", "color": "pink", "length": 2 },
      { "id": "43-6", "gridX": 5, "gridY": 1, "direction": "right", "color": "orange", "length": 2 },
      { "id": "43-7", "gridX": 1, "gridY": 6, "direction": "up", "color": "cyan", "length": 1 },
      { "id": "43-8", "gridX": 10, "gridY": 1, "direction": "down", "color": "lime", "length": 1 }
    ]
  },
  {
    "id": 44,
    "nameAr": "المستوى ٤٤ - الأفق المائل",
    "nameEn": "Level 44 - Oblique Horizon",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": { "cols": 14, "rows": 8 },
    "maxDrops": 3,
    "arrows": [
      { "id": "44-1", "gridX": 3, "gridY": 2, "direction": "up-right", "color": "cyan", "length": 1 },
      { "id": "44-2", "gridX": 5, "gridY": 4, "direction": "down-right", "color": "lime", "length": 1 },
      { "id": "44-3", "gridX": 7, "gridY": 2, "direction": "up-left", "color": "yellow", "length": 1 },
      { "id": "44-4", "gridX": 9, "gridY": 5, "direction": "down-left", "color": "purple", "length": 1 },
      { "id": "44-5", "gridX": 2, "gridY": 6, "direction": "right", "color": "pink", "length": 2, "type": "double" },
      { "id": "44-6", "gridX": 11, "gridY": 2, "direction": "left", "color": "orange", "length": 2 },
      { "id": "44-7", "gridX": 6, "gridY": 6, "direction": "up", "color": "cyan", "length": 2 },
      { "id": "44-8", "gridX": 1, "gridY": 2, "direction": "down", "color": "lime", "length": 1 },
      { "id": "44-9", "gridX": 12, "gridY": 6, "direction": "up", "color": "purple", "length": 1 }
    ]
  },
  {
    "id": 45,
    "nameAr": "🔨 قفل المطرقة والرعد ٤٥",
    "nameEn": "🔨 Hammer & Thunder Lock 45",
    "difficulty": "صعب جداً",
    "difficultyEn": "Very Hard",
    "gridSize": { "cols": 14, "rows": 8 },
    "maxDrops": 1,
    "requiresHammer": true,
    "arrows": [
      { "id": "45-1", "gridX": 4, "gridY": 2, "direction": "right", "color": "cyan", "length": 2 },
      { "id": "45-2", "gridX": 6, "gridY": 2, "direction": "down", "color": "lime", "length": 2 },
      { "id": "45-3", "gridX": 6, "gridY": 4, "direction": "left", "color": "yellow", "length": 2 },
      { "id": "45-4", "gridX": 4, "gridY": 4, "direction": "up", "color": "purple", "length": 2 },
      { "id": "45-5", "gridX": 2, "gridY": 1, "direction": "right", "color": "pink", "length": 2, "type": "double" },
      { "id": "45-6", "gridX": 9, "gridY": 1, "direction": "left", "color": "orange", "length": 2 },
      { "id": "45-7", "gridX": 9, "gridY": 5, "direction": "down", "color": "cyan", "length": 2 },
      { "id": "45-8", "gridX": 2, "gridY": 6, "direction": "up-right", "color": "lime", "length": 1 },
      { "id": "45-9", "gridX": 11, "gridY": 6, "direction": "left", "color": "purple", "length": 2 },
      { "id": "45-10", "gridX": 1, "gridY": 3, "direction": "down", "color": "yellow", "length": 2 }
    ]
  },
  {
    "id": 46,
    "nameAr": "المستوى ٤٦ - عقدة التنين",
    "nameEn": "Level 46 - Dragon Knot",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": { "cols": 14, "rows": 8 },
    "maxDrops": 3,
    "arrows": [
      { "id": "46-1", "gridX": 2, "gridY": 2, "direction": "right", "color": "cyan", "length": 2 },
      { "id": "46-2", "gridX": 5, "gridY": 2, "direction": "down", "color": "lime", "length": 1, "type": "double" },
      { "id": "46-3", "gridX": 5, "gridY": 4, "direction": "right", "color": "yellow", "length": 2 },
      { "id": "46-4", "gridX": 8, "gridY": 4, "direction": "up", "color": "purple", "length": 2 },
      { "id": "46-5", "gridX": 8, "gridY": 1, "direction": "right", "color": "pink", "length": 1 },
      { "id": "46-6", "gridX": 10, "gridY": 1, "direction": "down", "color": "orange", "length": 2 },
      { "id": "46-7", "gridX": 10, "gridY": 4, "direction": "right", "color": "cyan", "length": 2 },
      { "id": "46-8", "gridX": 12, "gridY": 6, "direction": "up", "color": "lime", "length": 1 },
      { "id": "46-9", "gridX": 1, "gridY": 6, "direction": "up-right", "color": "purple", "length": 1 },
      { "id": "46-10", "gridX": 3, "gridY": 5, "direction": "up", "color": "yellow", "length": 1 }
    ]
  },
  {
    "id": 47,
    "nameAr": "المستوى ٤٧ - مروحة الرياح",
    "nameEn": "Level 47 - Windmill Spiral",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": { "cols": 14, "rows": 8 },
    "maxDrops": 3,
    "arrows": [
      { "id": "47-1", "gridX": 6, "gridY": 2, "direction": "up", "color": "cyan", "length": 2 },
      { "id": "47-2", "gridX": 8, "gridY": 3, "direction": "right", "color": "lime", "length": 2 },
      { "id": "47-3", "gridX": 7, "gridY": 5, "direction": "down", "color": "yellow", "length": 2 },
      { "id": "47-4", "gridX": 5, "gridY": 4, "direction": "left", "color": "purple", "length": 2 },
      { "id": "47-5", "gridX": 6, "gridY": 3, "direction": "up-right", "color": "pink", "length": 1, "type": "double" },
      { "id": "47-6", "gridX": 2, "gridY": 1, "direction": "right", "color": "orange", "length": 2 },
      { "id": "47-7", "gridX": 11, "gridY": 6, "direction": "left", "color": "cyan", "length": 2 },
      { "id": "47-8", "gridX": 1, "gridY": 6, "direction": "up", "color": "lime", "length": 2 },
      { "id": "47-9", "gridX": 12, "gridY": 1, "direction": "down", "color": "purple", "length": 2 }
    ]
  },
  {
    "id": 48,
    "nameAr": "المستوى ٤٨ - الممر المزدوج المعقد",
    "nameEn": "Level 48 - Complex Dual Path",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": { "cols": 14, "rows": 8 },
    "maxDrops": 3,
    "arrows": [
      { "id": "48-1", "gridX": 2, "gridY": 3, "direction": "right", "color": "cyan", "length": 2, "type": "double" },
      { "id": "48-2", "gridX": 5, "gridY": 1, "direction": "down", "color": "lime", "length": 2 },
      { "id": "48-3", "gridX": 6, "gridY": 5, "direction": "up", "color": "yellow", "length": 2, "type": "double" },
      { "id": "48-4", "gridX": 8, "gridY": 2, "direction": "right", "color": "purple", "length": 2 },
      { "id": "48-5", "gridX": 11, "gridY": 1, "direction": "down", "color": "pink", "length": 2 },
      { "id": "48-6", "gridX": 9, "gridY": 5, "direction": "left", "color": "orange", "length": 2 },
      { "id": "48-7", "gridX": 1, "gridY": 6, "direction": "up-right", "color": "cyan", "length": 1 },
      { "id": "48-8", "gridX": 12, "gridY": 6, "direction": "up-left", "color": "lime", "length": 1 },
      { "id": "48-9", "gridX": 4, "gridY": 6, "direction": "right", "color": "purple", "length": 1 }
    ]
  },
  {
    "id": 49,
    "nameAr": "المستوى ٤٩ - بوابة المتاهة",
    "nameEn": "Level 49 - Gatekeeper Maze",
    "difficulty": "صعب",
    "difficultyEn": "Hard",
    "gridSize": { "cols": 14, "rows": 8 },
    "maxDrops": 3,
    "arrows": [
      { "id": "49-1", "gridX": 3, "gridY": 2, "direction": "down", "color": "cyan", "length": 2 },
      { "id": "49-2", "gridX": 4, "gridY": 5, "direction": "right", "color": "lime", "length": 2 },
      { "id": "49-3", "gridX": 7, "gridY": 3, "direction": "up", "color": "yellow", "length": 2, "type": "double" },
      { "id": "49-4", "gridX": 8, "gridY": 1, "direction": "right", "color": "purple", "length": 2 },
      { "id": "49-5", "gridX": 11, "gridY": 2, "direction": "down", "color": "pink", "length": 2 },
      { "id": "49-6", "gridX": 10, "gridY": 6, "direction": "left", "color": "orange", "length": 2 },
      { "id": "49-7", "gridX": 2, "gridY": 1, "direction": "right", "color": "cyan", "length": 1 },
      { "id": "49-8", "gridX": 1, "gridY": 5, "direction": "up-right", "color": "lime", "length": 1 },
      { "id": "49-9", "gridX": 12, "gridY": 5, "direction": "up-left", "color": "purple", "length": 1 },
      { "id": "49-10", "gridX": 6, "gridY": 6, "direction": "up", "color": "yellow", "length": 1 }
    ]
  },
  {
    "id": 50,
    "nameAr": "🔥 التحدي الأسطوري ٥٠",
    "nameEn": "🔥 Legendary Ultimate Boss 50",
    "difficulty": "صعب جداً",
    "difficultyEn": "Very Hard",
    "gridSize": { "cols": 14, "rows": 8 },
    "maxDrops": 1,
    "arrows": [
      { "id": "50-1", "gridX": 2, "gridY": 2, "direction": "right", "color": "cyan", "length": 2 },
      { "id": "50-2", "gridX": 5, "gridY": 1, "direction": "down", "color": "lime", "length": 2 },
      { "id": "50-3", "gridX": 5, "gridY": 4, "direction": "right", "color": "yellow", "length": 2, "type": "double" },
      { "id": "50-4", "gridX": 8, "gridY": 2, "direction": "down", "color": "purple", "length": 2 },
      { "id": "50-5", "gridX": 9, "gridY": 5, "direction": "right", "color": "pink", "length": 2 },
      { "id": "50-6", "gridX": 12, "gridY": 3, "direction": "up", "color": "orange", "length": 2 },
      { "id": "50-7", "gridX": 11, "gridY": 1, "direction": "left", "color": "cyan", "length": 2 },
      { "id": "50-8", "gridX": 1, "gridY": 6, "direction": "up-right", "color": "lime", "length": 1 },
      { "id": "50-9", "gridX": 3, "gridY": 6, "direction": "up", "color": "purple", "length": 1 },
      { "id": "50-10", "gridX": 7, "gridY": 6, "direction": "up-left", "color": "yellow", "length": 1 },
      { "id": "50-11", "gridX": 10, "gridY": 6, "direction": "up", "color": "pink", "length": 1 }
    ]
  }
];

// Procedurally generate a level that is 100% guaranteed solvable with zero overlaps
export function generateRandomSolvableLevel(levelNumber: number): Level {
  const isEvery5th = levelNumber % 5 === 0;
  const isHard = levelNumber > 10 || isEvery5th;
  const isMedium = levelNumber > 5;

  const cols = isEvery5th ? 14 : isHard ? 14 : isMedium ? 10 : 8;
  const rows = isEvery5th ? 8 : isHard ? 8 : isMedium ? 7 : 6;

  const targetCount = isEvery5th
    ? Math.min(14 + Math.floor(levelNumber * 0.4), 24)
    : Math.min(6 + Math.floor(levelNumber * 1.1), 22);

  const diffAr = isEvery5th ? 'صعب جداً' : levelNumber <= 3 ? 'سهل' : levelNumber <= 8 ? 'متوسط' : 'صعب';
  const diffEn = isEvery5th ? 'Very Hard' : levelNumber <= 3 ? 'Easy' : levelNumber <= 8 ? 'Medium' : 'Hard';
  const maxDrops = isEvery5th ? 1 : 3;

  const directions: Direction[] = [
    'up',
    'down',
    'left',
    'right',
    'up-left',
    'up-right',
    'down-left',
    'down-right',
    'slight-up-right',
    'slight-up-left',
    'slight-down-right',
    'slight-down-left',
  ];

  let bestCandidate: Level | null = null;

  for (let attempt = 0; attempt < 40; attempt++) {
    const arrows: Arrow[] = [];
    let innerAttempts = 0;

    while (arrows.length < targetCount && innerAttempts < 300) {
      innerAttempts++;
      const gx = Math.floor(Math.random() * (cols - 2)) + 1;
      const gy = Math.floor(Math.random() * (rows - 2)) + 1;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const len = Math.random() > 0.6 ? 2 : 1;
      const isBomb = levelNumber >= 8 && Math.random() < 0.12;
      const isGhost = !isBomb && levelNumber >= 4 && Math.random() < 0.16;
      const isStarForce = levelNumber % 4 === 0 && !arrows.some((a) => a.isStar || a.type === 'star');
      const isStar = !isBomb && !isGhost && (isStarForce || Math.random() < 0.18);
      const isDouble = !isBomb && !isGhost && !isStar && levelNumber >= 6 && Math.random() < 0.20;

      const candidate: Arrow = {
        id: `gen-${levelNumber}-${arrows.length}-${Math.random().toString(36).substring(2, 7)}`,
        gridX: gx,
        gridY: gy,
        direction: dir,
        color: color,
        length: len,
        ...(isBomb
          ? { type: 'bomb', isBomb: true }
          : isGhost
          ? { type: 'ghost', isGhost: true }
          : isStar
          ? { type: 'star', isStar: true }
          : isDouble
          ? { type: 'double', isDouble: true }
          : {}),
      };

      if (!isArrowInBounds(candidate, cols, rows)) {
        continue;
      }

      const testLevel: Level = {
        id: levelNumber,
        nameAr: isEvery5th ? `المستوى ${levelNumber} 🔥` : `المستوى ${levelNumber}`,
        nameEn: isEvery5th ? `Level ${levelNumber} 🔥` : `Level ${levelNumber}`,
        difficulty: diffAr,
        difficultyEn: diffEn,
        gridSize: { cols, rows },
        maxDrops,
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
      maxDrops,
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
    maxDrops,
    arrows: baseLevel.arrows.map((a, idx) => ({
      ...a,
      id: `gen-fb-${levelNumber}-${idx}`,
    })),
  };
}

export const HAMMER_REQUIRED_LEVEL_IDS = [45, 52, 60, 68, 77, 93, 100, 108, 115, 122, 125, 140, 160, 180, 200];
export const MONSTER_BOSS_LEVEL_IDS = [55, 69, 85, 105, 120, 138, 150, 158, 173, 188, 200];

export function createMonsterBossLevel(levelNumber: number): Level {
  let nameAr = `👹🔥 ${levelNumber} - مرحلة الوحش الخارقة`;
  let nameEn = `👹🔥 ${levelNumber} - Monster Boss Level`;

  if (levelNumber === 55) {
    nameAr = `👹🔥 55 - مرحلة الوحش: غابة الوحوش الكاسرة`;
    nameEn = `👹🔥 55 - Monster Boss: Fierce Beast Forest`;
  } else if (levelNumber === 69) {
    nameAr = `👹🔥 69 - مرحلة الوحش: عرش التنين الشرس`;
    nameEn = `👹🔥 69 - Monster Boss: Fierce Dragon Throne`;
  } else if (levelNumber === 85) {
    nameAr = `👹🔥 85 - مرحلة الوحش: ممر النار المجهول`;
    nameEn = `👹🔥 85 - Monster Boss: Unknown Fire Pass`;
  } else if (levelNumber === 105) {
    nameAr = `👹🔥 105 - مرحلة الوحش: مقبرة الأسهم المظلمة`;
    nameEn = `👹🔥 105 - Monster Boss: Dark Arrow Graveyard`;
  } else if (levelNumber === 120) {
    nameAr = `👹🔥 120 - مرحلة الوحش: متاهة الشياطين`;
    nameEn = `👹🔥 120 - Monster Boss: Demon Labyrinth`;
  } else if (levelNumber === 138) {
    nameAr = `👹🔥 138 - مرحلة الوحش: كوكب الجحيم الأسطوري`;
    nameEn = `👹🔥 138 - Monster Boss: Mythic Hell Planet`;
  } else if (levelNumber === 150) {
    nameAr = `👹🔥 150 - مرحلة الوحش: قلعة ملك الأشباح`;
    nameEn = `👹🔥 150 - Monster Boss: Ghost King Citadel`;
  } else if (levelNumber === 158) {
    nameAr = `👹🔥 158 - مرحلة الوحش: حصن العاصفة السوداء`;
    nameEn = `👹🔥 158 - Monster Boss: Black Storm Fortress`;
  } else if (levelNumber === 173) {
    nameAr = `👹🔥 173 - مرحلة الوحش: التحدي الخارق المستحيل`;
    nameEn = `👹🔥 173 - Monster Boss: Ultimate Impossible Pinnacle`;
  } else if (levelNumber === 188) {
    nameAr = `👹🔥 188 - مرحلة الوحش: عرش الأسطورة المظلمة`;
    nameEn = `👹🔥 188 - Monster Boss: Dark Legend Throne`;
  } else if (levelNumber === 200) {
    nameAr = `👹🔥 200 - مرحلة الوحش النهائية: سيد الأسهم الأخير`;
    nameEn = `👹🔥 200 - Monster Boss Final: Ultimate Arrow Master`;
  }

  const cols = 12;
  const rows = 8;
  const targetCount = 18;

  const directions: Direction[] = [
    'up',
    'down',
    'left',
    'right',
    'up-left',
    'up-right',
    'down-left',
    'down-right',
    'slight-up-right',
    'slight-up-left',
    'slight-down-right',
    'slight-down-left',
  ];

  for (let attempt = 0; attempt < 200; attempt++) {
    const arrows: Arrow[] = [];
    let innerAttempts = 0;

    while (arrows.length < targetCount && innerAttempts < 600) {
      innerAttempts++;
      const gx = Math.floor(Math.random() * cols);
      const gy = Math.floor(Math.random() * rows);
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const len = Math.random() > 0.6 ? 2 : 1;

      const isBomb = Math.random() < 0.16;
      const isGhost = !isBomb && Math.random() < 0.22;
      const isStar = !isBomb && !isGhost && Math.random() < 0.20;
      const isDouble = !isBomb && !isGhost && !isStar && Math.random() < 0.25;

      const candidate: Arrow = {
        id: `monster-${levelNumber}-${arrows.length}-${Math.random().toString(36).substring(2, 7)}`,
        gridX: gx,
        gridY: gy,
        direction: dir,
        color: color,
        length: len,
        ...(isBomb
          ? { type: 'bomb', isBomb: true }
          : isGhost
          ? { type: 'ghost', isGhost: true }
          : isStar
          ? { type: 'star', isStar: true }
          : isDouble
          ? { type: 'double', isDouble: true }
          : {}),
      };

      if (!isArrowInBounds(candidate, cols, rows)) {
        continue;
      }

      const testLevel: Level = {
        id: levelNumber,
        nameAr,
        nameEn,
        difficulty: 'صعب جداً جداً',
        difficultyEn: 'Extremely Hard',
        gridSize: { cols, rows },
        maxDrops: 1,
        arrows: [...arrows, candidate],
      };

      if (!hasOverlappingCells(testLevel.arrows) && isLevelSolvable(testLevel)) {
        arrows.push(candidate);
      }
    }

    const candidateLevel: Level = {
      id: levelNumber,
      nameAr,
      nameEn,
      difficulty: 'صعب جداً جداً',
      difficultyEn: 'Extremely Hard',
      gridSize: { cols, rows },
      maxDrops: 1,
      arrows,
    };

    if (arrows.length >= 14 && isLevelSolvable(candidateLevel)) {
      return candidateLevel;
    }
  }

  // Fallback
  const fallback = generateRandomSolvableLevel(levelNumber);
  const boundedArrows = fallback.arrows.filter((a) => isArrowInBounds(a, cols, rows));
  return {
    ...fallback,
    id: levelNumber,
    nameAr,
    nameEn,
    difficulty: 'صعب جداً جداً',
    difficultyEn: 'Extremely Hard',
    maxDrops: 1,
    gridSize: { cols, rows },
    arrows: boundedArrows,
  };
}

export function createHammerRequiredLevel(levelNumber: number): Level {
  const isEvery5th = levelNumber % 5 === 0;
  const maxDrops = isEvery5th ? 1 : 3;

  let cols = 14;
  let rows = 8;
  let nameAr = `🔨 قفل المطرقة والرعد ${levelNumber}`;
  let nameEn = `🔨 Hammer & Thunder Lock ${levelNumber}`;
  let deadlockArrows: Arrow[] = [];

  switch (levelNumber) {
    case 45:
      cols = 10;
      rows = 7;
      nameAr = `🔨 45 - الحلقة الفولاذية`;
      nameEn = `🔨 45 - Steel Ring Lock`;
      deadlockArrows = [
        { id: '45-h1', gridX: 4, gridY: 2, direction: 'right', color: 'cyan', length: 2 },
        { id: '45-h2', gridX: 6, gridY: 2, direction: 'down', color: 'lime', length: 2 },
        { id: '45-h3', gridX: 6, gridY: 4, direction: 'left', color: 'yellow', length: 2 },
        { id: '45-h4', gridX: 4, gridY: 4, direction: 'up', color: 'purple', length: 2 },
        { id: '45-h5', gridX: 2, gridY: 1, direction: 'right', color: 'pink', length: 2, type: 'double', isDouble: true },
        { id: '45-h6', gridX: 7, gridY: 1, direction: 'left', color: 'orange', length: 2 },
        { id: '45-h7', gridX: 7, gridY: 5, direction: 'down', color: 'cyan', length: 2 },
        { id: '45-h8', gridX: 1, gridY: 5, direction: 'right', color: 'lime', length: 2 },
        { id: '45-h9', gridX: 4, gridY: 5, direction: 'up', color: 'purple', length: 1 },
      ];
      break;

    case 52:
      cols = 12;
      rows = 8;
      nameAr = `🔨 52 - الأقفال المزدوجة`;
      nameEn = `🔨 52 - Twin Steel Deadlocks`;
      deadlockArrows = [
        // Ring 1 left
        { id: '52-1', gridX: 2, gridY: 2, direction: 'right', color: 'pink', length: 2 },
        { id: '52-2', gridX: 4, gridY: 2, direction: 'down', color: 'orange', length: 2 },
        { id: '52-3', gridX: 4, gridY: 4, direction: 'left', color: 'cyan', length: 2 },
        { id: '52-4', gridX: 2, gridY: 4, direction: 'up', color: 'lime', length: 2 },
        // Ring 2 right
        { id: '52-5', gridX: 7, gridY: 3, direction: 'right', color: 'yellow', length: 2 },
        { id: '52-6', gridX: 9, gridY: 3, direction: 'down', color: 'purple', length: 2 },
        { id: '52-7', gridX: 9, gridY: 5, direction: 'left', color: 'pink', length: 2 },
        { id: '52-8', gridX: 7, gridY: 5, direction: 'up', color: 'orange', length: 2 },
        // Connecting outer blockades
        { id: '52-9', gridX: 5, gridY: 1, direction: 'down', color: 'cyan', length: 2, type: 'bomb', isBomb: true },
        { id: '52-10', gridX: 1, gridY: 6, direction: 'right', color: 'lime', length: 3 },
        { id: '52-11', gridX: 10, gridY: 1, direction: 'left', color: 'yellow', length: 2 },
      ];
      break;

    case 60:
      cols = 12;
      rows = 8;
      nameAr = `🔨 60 - حصن الألغام الفولاذي`;
      nameEn = `🔨 60 - Steel Bomb Citadel`;
      deadlockArrows = [
        // Bomb deadlock center
        { id: '60-b1', gridX: 5, gridY: 3, direction: 'right', color: 'orange', length: 2, type: 'bomb', isBomb: true },
        { id: '60-b2', gridX: 7, gridY: 3, direction: 'left', color: 'pink', length: 2, type: 'bomb', isBomb: true },
        { id: '60-1', gridX: 4, gridY: 1, direction: 'down', color: 'purple', length: 3 },
        { id: '60-2', gridX: 8, gridY: 1, direction: 'down', color: 'lime', length: 3 },
        { id: '60-3', gridX: 3, gridY: 5, direction: 'right', color: 'cyan', length: 2 },
        { id: '60-4', gridX: 7, gridY: 5, direction: 'left', color: 'yellow', length: 2 },
        { id: '60-5', gridX: 1, gridY: 3, direction: 'right', color: 'pink', length: 3, type: 'double', isDouble: true },
        { id: '60-6', gridX: 10, gridY: 3, direction: 'left', color: 'orange', length: 2 },
        { id: '60-7', gridX: 6, gridY: 6, direction: 'up', color: 'purple', length: 2 },
      ];
      break;

    case 68:
      cols = 13;
      rows = 9;
      nameAr = `🔨 68 - الميدان الفولاذي المتقاطع`;
      nameEn = `🔨 68 - Crossed Steel Arena`;
      deadlockArrows = [
        // Center cross deadlock
        { id: '68-1', gridX: 5, gridY: 3, direction: 'right', color: 'lime', length: 2 },
        { id: '68-2', gridX: 7, gridY: 3, direction: 'down', color: 'cyan', length: 2 },
        { id: '68-3', gridX: 7, gridY: 5, direction: 'left', color: 'purple', length: 2 },
        { id: '68-4', gridX: 5, gridY: 5, direction: 'up', color: 'pink', length: 2 },
        // Corner traps
        { id: '68-5', gridX: 2, gridY: 1, direction: 'down-right', color: 'yellow', length: 1 },
        { id: '68-6', gridX: 10, gridY: 1, direction: 'down-left', color: 'orange', length: 1 },
        { id: '68-7', gridX: 2, gridY: 7, direction: 'up-right', color: 'cyan', length: 1 },
        { id: '68-8', gridX: 10, gridY: 7, direction: 'up-left', color: 'lime', length: 1 },
        { id: '68-9', gridX: 1, gridY: 4, direction: 'right', color: 'purple', length: 3, type: 'double', isDouble: true },
        { id: '68-10', gridX: 11, gridY: 4, direction: 'left', color: 'pink', length: 2 },
      ];
      break;

    case 77:
      cols = 11;
      rows = 10;
      nameAr = `🔨 77 - برج الفولاذ الشاهق`;
      nameEn = `🔨 77 - Tall Steel Tower`;
      deadlockArrows = [
        // Top loop
        { id: '77-1', gridX: 4, gridY: 1, direction: 'right', color: 'cyan', length: 2 },
        { id: '77-2', gridX: 6, gridY: 1, direction: 'down', color: 'lime', length: 2 },
        { id: '77-3', gridX: 6, gridY: 3, direction: 'left', color: 'yellow', length: 2 },
        { id: '77-4', gridX: 4, gridY: 3, direction: 'up', color: 'purple', length: 2 },
        // Bottom loop
        { id: '77-5', gridX: 4, gridY: 6, direction: 'right', color: 'pink', length: 2 },
        { id: '77-6', gridX: 6, gridY: 6, direction: 'down', color: 'orange', length: 2 },
        { id: '77-7', gridX: 6, gridY: 8, direction: 'left', color: 'cyan', length: 2 },
        { id: '77-8', gridX: 4, gridY: 8, direction: 'up', color: 'lime', length: 2 },
        // Connecting pillar
        { id: '77-9', gridX: 2, gridY: 4, direction: 'down', color: 'yellow', length: 3, type: 'bomb', isBomb: true },
        { id: '77-10', gridX: 8, gridY: 4, direction: 'up', color: 'purple', length: 3 },
        { id: '77-11', gridX: 1, gridY: 2, direction: 'right', color: 'pink', length: 2 },
        { id: '77-12', gridX: 9, gridY: 7, direction: 'left', color: 'orange', length: 2 },
      ];
      break;

    case 85:
      cols = 14;
      rows = 9;
      nameAr = `🔨 85 - الحلزون الفولاذي`;
      nameEn = `🔨 85 - Steel Spiral Labyrinth`;
      deadlockArrows = [
        // Spiral outer to inner
        { id: '85-1', gridX: 3, gridY: 2, direction: 'right', color: 'purple', length: 3 },
        { id: '85-2', gridX: 8, gridY: 2, direction: 'down', color: 'cyan', length: 3 },
        { id: '85-3', gridX: 8, gridY: 6, direction: 'left', color: 'lime', length: 3 },
        { id: '85-4', gridX: 3, gridY: 6, direction: 'up', color: 'yellow', length: 3 },
        // Central deadlock core
        { id: '85-5', gridX: 5, gridY: 4, direction: 'right', color: 'pink', length: 2, type: 'double', isDouble: true },
        { id: '85-6', gridX: 7, gridY: 4, direction: 'left', color: 'orange', length: 2, type: 'bomb', isBomb: true },
        { id: '85-7', gridX: 1, gridY: 4, direction: 'right', color: 'purple', length: 2 },
        { id: '85-8', gridX: 11, gridY: 4, direction: 'left', color: 'cyan', length: 2 },
        { id: '85-9', gridX: 6, gridY: 1, direction: 'down', color: 'lime', length: 2 },
        { id: '85-10', gridX: 6, gridY: 7, direction: 'up', color: 'yellow', length: 2 },
      ];
      break;

    case 93:
      cols = 15;
      rows = 9;
      nameAr = `🔨 93 - الروابط الفولاذية المزدوجة`;
      nameEn = `🔨 93 - Double-Headed Steel Links`;
      deadlockArrows = [
        { id: '93-1', gridX: 3, gridY: 3, direction: 'right', color: 'cyan', length: 2, type: 'double', isDouble: true },
        { id: '93-2', gridX: 6, gridY: 3, direction: 'down', color: 'lime', length: 2, type: 'double', isDouble: true },
        { id: '93-3', gridX: 6, gridY: 6, direction: 'left', color: 'yellow', length: 2 },
        { id: '93-4', gridX: 3, gridY: 6, direction: 'up', color: 'purple', length: 2 },
        { id: '93-5', gridX: 9, gridY: 2, direction: 'right', color: 'pink', length: 2 },
        { id: '93-6', gridX: 11, gridY: 2, direction: 'down', color: 'orange', length: 2, type: 'bomb', isBomb: true },
        { id: '93-7', gridX: 11, gridY: 5, direction: 'left', color: 'cyan', length: 2 },
        { id: '93-8', gridX: 9, gridY: 5, direction: 'up', color: 'lime', length: 2 },
        { id: '93-9', gridX: 1, gridY: 4, direction: 'right', color: 'purple', length: 3 },
        { id: '93-10', gridX: 13, gridY: 4, direction: 'left', color: 'yellow', length: 2 },
        { id: '93-11', gridX: 7, gridY: 1, direction: 'down', color: 'pink', length: 2 },
        { id: '93-12', gridX: 7, gridY: 7, direction: 'up', color: 'orange', length: 2 },
      ];
      break;

    case 100:
      cols = 16;
      rows = 10;
      nameAr = `🔨 100 - العملاق الفولاذي المئوي`;
      nameEn = `🔨 100 - Century Steel Titan`;
      deadlockArrows = [
        { id: '100-1', gridX: 4, gridY: 3, direction: 'right', color: 'orange', length: 3, type: 'bomb', isBomb: true },
        { id: '100-2', gridX: 8, gridY: 3, direction: 'down', color: 'purple', length: 2 },
        { id: '100-3', gridX: 8, gridY: 6, direction: 'left', color: 'cyan', length: 3, type: 'double', isDouble: true },
        { id: '100-4', gridX: 4, gridY: 6, direction: 'up', color: 'lime', length: 2 },
        { id: '100-5', gridX: 11, gridY: 3, direction: 'down', color: 'pink', length: 3 },
        { id: '100-6', gridX: 11, gridY: 7, direction: 'left', color: 'yellow', length: 3 },
        { id: '100-7', gridX: 2, gridY: 1, direction: 'right', color: 'cyan', length: 3 },
        { id: '100-8', gridX: 13, gridY: 1, direction: 'left', color: 'lime', length: 2 },
        { id: '100-9', gridX: 2, gridY: 8, direction: 'up', color: 'purple', length: 2 },
        { id: '100-10', gridX: 14, gridY: 8, direction: 'left', color: 'orange', length: 2 },
        { id: '100-11', gridX: 6, gridY: 1, direction: 'down', color: 'yellow', length: 2 },
        { id: '100-12', gridX: 9, gridY: 8, direction: 'up', color: 'pink', length: 2 },
      ];
      break;

    case 108:
      cols = 13;
      rows = 8;
      nameAr = `🔨 108 - بركان الفولاذ الملتهب`;
      nameEn = `🔨 108 - Volcanic Steel Cavern`;
      deadlockArrows = [
        { id: '108-1', gridX: 3, gridY: 2, direction: 'right', color: 'orange', length: 2, type: 'bomb', isBomb: true },
        { id: '108-2', gridX: 6, gridY: 2, direction: 'down', color: 'pink', length: 2 },
        { id: '108-3', gridX: 6, gridY: 5, direction: 'left', color: 'yellow', length: 2, type: 'bomb', isBomb: true },
        { id: '108-4', gridX: 3, gridY: 5, direction: 'up', color: 'purple', length: 2 },
        { id: '108-5', gridX: 8, gridY: 2, direction: 'right', color: 'lime', length: 2 },
        { id: '108-6', gridX: 10, gridY: 2, direction: 'down', color: 'cyan', length: 2 },
        { id: '108-7', gridX: 10, gridY: 5, direction: 'left', color: 'orange', length: 2 },
        { id: '108-8', gridX: 8, gridY: 5, direction: 'up', color: 'pink', length: 2 },
        { id: '108-9', gridX: 1, gridY: 3, direction: 'right', color: 'yellow', length: 2 },
        { id: '108-10', gridX: 11, gridY: 3, direction: 'left', color: 'purple', length: 2 },
      ];
      break;

    case 115:
      cols = 14;
      rows = 9;
      nameAr = `🔨 115 - الشبكة الفولاذية الكونية`;
      nameEn = `🔨 115 - Cosmic Steel Web`;
      deadlockArrows = [
        { id: '115-1', gridX: 4, gridY: 2, direction: 'down-right', color: 'cyan', length: 1 },
        { id: '115-2', gridX: 7, gridY: 2, direction: 'down-left', color: 'lime', length: 1 },
        { id: '115-3', gridX: 7, gridY: 5, direction: 'up-left', color: 'purple', length: 1 },
        { id: '115-4', gridX: 4, gridY: 5, direction: 'up-right', color: 'pink', length: 1 },
        { id: '115-5', gridX: 2, gridY: 3, direction: 'right', color: 'yellow', length: 3, type: 'double', isDouble: true },
        { id: '115-6', gridX: 9, gridY: 3, direction: 'left', color: 'orange', length: 3 },
        { id: '115-7', gridX: 5, gridY: 1, direction: 'down', color: 'cyan', length: 2 },
        { id: '115-8', gridX: 6, gridY: 7, direction: 'up', color: 'lime', length: 2 },
        { id: '115-9', gridX: 11, gridY: 1, direction: 'down', color: 'purple', length: 3, type: 'bomb', isBomb: true },
        { id: '115-10', gridX: 1, gridY: 6, direction: 'right', color: 'pink', length: 2 },
      ];
      break;

    case 122:
      cols = 15;
      rows = 10;
      nameAr = `🔨 122 - متاهة الصاعقة الفولاذية`;
      nameEn = `🔨 122 - Lightning Steel Maze`;
      deadlockArrows = [
        { id: '122-1', gridX: 3, gridY: 2, direction: 'right', color: 'lime', length: 2 },
        { id: '122-2', gridX: 6, gridY: 2, direction: 'down', color: 'cyan', length: 2 },
        { id: '122-3', gridX: 6, gridY: 5, direction: 'left', color: 'pink', length: 2, type: 'double', isDouble: true },
        { id: '122-4', gridX: 3, gridY: 5, direction: 'up', color: 'purple', length: 2 },
        { id: '122-5', gridX: 9, gridY: 3, direction: 'right', color: 'yellow', length: 2 },
        { id: '122-6', gridX: 12, gridY: 3, direction: 'down', color: 'orange', length: 2, type: 'bomb', isBomb: true },
        { id: '122-7', gridX: 12, gridY: 6, direction: 'left', color: 'cyan', length: 2 },
        { id: '122-8', gridX: 9, gridY: 6, direction: 'up', color: 'lime', length: 2 },
        { id: '122-9', gridX: 1, gridY: 4, direction: 'right', color: 'purple', length: 2 },
        { id: '122-10', gridX: 13, gridY: 4, direction: 'left', color: 'pink', length: 2 },
        { id: '122-11', gridX: 7, gridY: 1, direction: 'down', color: 'yellow', length: 2 },
        { id: '122-12', gridX: 8, gridY: 8, direction: 'up', color: 'orange', length: 2 },
      ];
      break;

    case 125:
      cols = 16;
      rows = 10;
      nameAr = `🔨 125 - عرش الفولاذ الأخير 🔥`;
      nameEn = `🔨 125 - Final Steel Throne 🔥`;
      deadlockArrows = [
        { id: '125-1', gridX: 5, gridY: 2, direction: 'right', color: 'cyan', length: 2, type: 'bomb', isBomb: true },
        { id: '125-2', gridX: 8, gridY: 2, direction: 'down', color: 'lime', length: 2, type: 'double', isDouble: true },
        { id: '125-3', gridX: 8, gridY: 5, direction: 'left', color: 'purple', length: 2, type: 'bomb', isBomb: true },
        { id: '125-4', gridX: 5, gridY: 5, direction: 'up', color: 'pink', length: 2, type: 'double', isDouble: true },
        { id: '125-5', gridX: 11, gridY: 2, direction: 'right', color: 'yellow', length: 2 },
        { id: '125-6', gridX: 14, gridY: 2, direction: 'down', color: 'orange', length: 3 },
        { id: '125-7', gridX: 14, gridY: 6, direction: 'left', color: 'cyan', length: 2 },
        { id: '125-8', gridX: 11, gridY: 6, direction: 'up', color: 'lime', length: 3 },
        { id: '125-9', gridX: 2, gridY: 4, direction: 'right', color: 'purple', length: 3 },
        { id: '125-10', gridX: 1, gridY: 1, direction: 'down', color: 'pink', length: 3 },
        { id: '125-11', gridX: 1, gridY: 8, direction: 'right', color: 'orange', length: 3 },
        { id: '125-12', gridX: 9, gridY: 8, direction: 'up', color: 'yellow', length: 2 },
      ];
      break;

    case 140:
      cols = 16;
      rows = 9;
      nameAr = `🔨 👻 140 - متاهة الأشباح الفولاذية 🔥`;
      nameEn = `🔨 👻 140 - Ghost Steel Labyrinth 🔥`;
      deadlockArrows = [
        { id: '140-1', gridX: 4, gridY: 2, direction: 'right', color: 'purple', length: 2, type: 'ghost', isGhost: true },
        { id: '140-2', gridX: 7, gridY: 2, direction: 'down', color: 'cyan', length: 2, type: 'ghost', isGhost: true },
        { id: '140-3', gridX: 7, gridY: 5, direction: 'left', color: 'pink', length: 2, type: 'star', isStar: true },
        { id: '140-4', gridX: 4, gridY: 5, direction: 'up', color: 'lime', length: 2 },
        { id: '140-5', gridX: 10, gridY: 2, direction: 'right', color: 'yellow', length: 3, type: 'double', isDouble: true },
        { id: '140-6', gridX: 14, gridY: 2, direction: 'down', color: 'orange', length: 3, type: 'bomb', isBomb: true },
        { id: '140-7', gridX: 14, gridY: 6, direction: 'left', color: 'cyan', length: 3 },
        { id: '140-8', gridX: 10, gridY: 6, direction: 'up', color: 'purple', length: 3 },
        { id: '140-9', gridX: 1, gridY: 4, direction: 'right', color: 'lime', length: 2 },
        { id: '140-10', gridX: 2, gridY: 7, direction: 'right', color: 'yellow', length: 2, type: 'star', isStar: true },
      ];
      break;

    case 160:
      cols = 16;
      rows = 10;
      nameAr = `🔨 🌟 160 - حصن النجوم الفولاذي 🔥`;
      nameEn = `🔨 🌟 160 - Star Steel Fortress 🔥`;
      deadlockArrows = [
        { id: '160-1', gridX: 5, gridY: 3, direction: 'right', color: 'yellow', length: 2, type: 'star', isStar: true },
        { id: '160-2', gridX: 8, gridY: 3, direction: 'down', color: 'orange', length: 2, type: 'ghost', isGhost: true },
        { id: '160-3', gridX: 8, gridY: 6, direction: 'left', color: 'purple', length: 2, type: 'star', isStar: true },
        { id: '160-4', gridX: 5, gridY: 6, direction: 'up', color: 'cyan', length: 2, type: 'ghost', isGhost: true },
        { id: '160-5', gridX: 2, gridY: 1, direction: 'right', color: 'pink', length: 3, type: 'double', isDouble: true },
        { id: '160-6', gridX: 13, gridY: 1, direction: 'left', color: 'lime', length: 3 },
        { id: '160-7', gridX: 13, gridY: 8, direction: 'up', color: 'orange', length: 3, type: 'bomb', isBomb: true },
        { id: '160-8', gridX: 2, gridY: 8, direction: 'right', color: 'cyan', length: 3 },
      ];
      break;

    case 180:
      cols = 16;
      rows = 10;
      nameAr = `🔨 👻 180 - قمة الأشباح والنجوم 🔥`;
      nameEn = `🔨 👻 180 - Ghost Star Citadel 🔥`;
      deadlockArrows = [
        { id: '180-1', gridX: 4, gridY: 3, direction: 'right', color: 'purple', length: 2, type: 'ghost', isGhost: true },
        { id: '180-2', gridX: 7, gridY: 3, direction: 'down', color: 'lime', length: 2, type: 'ghost', isGhost: true },
        { id: '180-3', gridX: 7, gridY: 6, direction: 'left', color: 'yellow', length: 2, type: 'star', isStar: true },
        { id: '180-4', gridX: 4, gridY: 6, direction: 'up', color: 'pink', length: 2, type: 'star', isStar: true },
        { id: '180-5', gridX: 10, gridY: 2, direction: 'right', color: 'cyan', length: 3, type: 'double', isDouble: true },
        { id: '180-6', gridX: 14, gridY: 2, direction: 'down', color: 'orange', length: 3, type: 'bomb', isBomb: true },
        { id: '180-7', gridX: 14, gridY: 7, direction: 'left', color: 'purple', length: 3 },
        { id: '180-8', gridX: 10, gridY: 7, direction: 'up', color: 'lime', length: 3, type: 'ghost', isGhost: true },
        { id: '180-9', gridX: 1, gridY: 4, direction: 'right', color: 'yellow', length: 3 },
      ];
      break;

    case 200:
      cols = 16;
      rows = 10;
      nameAr = `🔨 👑 200 - قمة الفولاذ الكونية الخارقة 🔥`;
      nameEn = `🔨 👑 200 - Ultimate Cosmic Steel Pinnacle 🔥`;
      deadlockArrows = [
        { id: '200-1', gridX: 4, gridY: 3, direction: 'right', color: 'cyan', length: 2, type: 'ghost', isGhost: true },
        { id: '200-2', gridX: 7, gridY: 3, direction: 'down', color: 'purple', length: 2, type: 'star', isStar: true },
        { id: '200-3', gridX: 7, gridY: 6, direction: 'left', color: 'orange', length: 2, type: 'bomb', isBomb: true },
        { id: '200-4', gridX: 4, gridY: 6, direction: 'up', color: 'lime', length: 2, type: 'double', isDouble: true },
        { id: '200-5', gridX: 10, gridY: 2, direction: 'right', color: 'yellow', length: 3, type: 'star', isStar: true },
        { id: '200-6', gridX: 14, gridY: 2, direction: 'down', color: 'pink', length: 3, type: 'ghost', isGhost: true },
        { id: '200-7', gridX: 14, gridY: 7, direction: 'left', color: 'purple', length: 3, type: 'bomb', isBomb: true },
        { id: '200-8', gridX: 10, gridY: 7, direction: 'up', color: 'cyan', length: 3, type: 'double', isDouble: true },
        { id: '200-9', gridX: 1, gridY: 1, direction: 'down', color: 'lime', length: 3 },
        { id: '200-10', gridX: 1, gridY: 8, direction: 'right', color: 'yellow', length: 3 },
      ];
      break;

    default:
      cols = 12 + (levelNumber % 5);
      rows = 8 + (levelNumber % 3);
      nameAr = `🔨 🏰 قفل الفولاذ الخارق ${levelNumber}`;
      nameEn = `🔨 🏰 Steel Fortress Lock ${levelNumber}`;
      deadlockArrows = [
        { id: `${levelNumber}-d1`, gridX: 3, gridY: 2, direction: 'right', color: 'cyan', length: 2 },
        { id: `${levelNumber}-d2`, gridX: 5, gridY: 2, direction: 'down', color: 'lime', length: 2 },
        { id: `${levelNumber}-d3`, gridX: 5, gridY: 4, direction: 'left', color: 'yellow', length: 2 },
        { id: `${levelNumber}-d4`, gridX: 3, gridY: 4, direction: 'up', color: 'purple', length: 2 },
        { id: `${levelNumber}-d5`, gridX: 8, gridY: 3, direction: 'left', color: 'pink', length: 2, type: 'double', isDouble: true },
        { id: `${levelNumber}-d6`, gridX: 1, gridY: 3, direction: 'right', color: 'orange', length: 2, type: 'bomb', isBomb: true },
      ];
      break;
  }

  return {
    id: levelNumber,
    nameAr,
    nameEn,
    difficulty: 'صعب جداً',
    difficultyEn: 'Very Hard',
    gridSize: { cols, rows },
    maxDrops,
    requiresHammer: true,
    arrows: deadlockArrows,
  };
}

export function getLevel(id: number): Level {
  let level: Level;
  if (MONSTER_BOSS_LEVEL_IDS.includes(id)) {
    level = createMonsterBossLevel(id);
  } else if (HAMMER_REQUIRED_LEVEL_IDS.includes(id)) {
    level = createHammerRequiredLevel(id);
  } else {
    const handcrafted = HANDCRAFTED_LEVELS.find((l) => l.id === id);
    if (handcrafted) {
      level = {
        ...handcrafted,
        arrows: handcrafted.arrows.map((a) => ({ ...a })),
      };
    } else {
      level = generateRandomSolvableLevel(id);
    }
  }

  const isEvery5th = id % 5 === 0;

  // Enforce 1 life (maxDrops: 1) on every 5th level or Very Hard levels
  if (isEvery5th || level.difficulty === 'صعب جداً') {
    level.maxDrops = 1;
    level.difficulty = 'صعب جداً';
    level.difficultyEn = 'Very Hard';
    if (!level.nameAr.includes('🔥') && !level.nameAr.includes('🔨')) {
      level.nameAr = `${level.nameAr} 🔥`;
    }
  }

  // Every 4th level (id % 4 === 0) has a guaranteed Golden Star Arrow 🌟 (سهم ذهبي محنك)
  if (id % 4 === 0) {
    const hasStar = level.arrows.some((a) => a.isStar || a.type === 'star');
    if (!hasStar && level.arrows.length > 0) {
      // Find an arrow that isn't bomb or ghost, or default to the first arrow
      const normalIdx = level.arrows.findIndex((a) => !a.isBomb && !a.isGhost);
      const targetIdx = normalIdx >= 0 ? normalIdx : 0;
      level.arrows[targetIdx] = {
        ...level.arrows[targetIdx],
        type: 'star',
        isStar: true,
        isBomb: false,
        isGhost: false,
      };
    }
    if (!level.nameAr.includes('🌟')) {
      level.nameAr = `🌟 ${level.nameAr}`;
    }
    if (!level.nameEn.includes('🌟')) {
      level.nameEn = `🌟 ${level.nameEn}`;
    }
  }

  // Strictly sanitize all arrows to guarantee none ever bleed out of bounds
  level.arrows = level.arrows.filter((arrow) => isArrowInBounds(arrow, level.gridSize.cols, level.gridSize.rows));

  return level;
}


