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
        "length": 1
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
        "length": 1
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

export function getLevel(id: number): Level {
  const isEvery5th = id % 5 === 0;
  const handcrafted = HANDCRAFTED_LEVELS.find((l) => l.id === id);
  let level: Level;

  if (handcrafted) {
    level = {
      ...handcrafted,
      arrows: handcrafted.arrows.map((a) => ({ ...a })),
    };
  } else {
    level = generateRandomSolvableLevel(id);
  }

  // Enforce 1 life (maxDrops: 1) on every 5th level or Very Hard levels
  if (isEvery5th || level.difficulty === 'صعب جداً') {
    level.maxDrops = 1;
    level.difficulty = 'صعب جداً';
    level.difficultyEn = 'Very Hard';
    if (!level.nameAr.includes('🔥')) {
      level.nameAr = `${level.nameAr} 🔥`;
    }
  }

  return level;
}


