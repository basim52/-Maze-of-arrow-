import React, { useState, useEffect } from 'react';
import { Arrow, Direction, ThemeSkin } from '../types';
import { DIRECTION_VECTORS, canArrowEscape } from '../utils/levelGenerator';
import { soundManager } from '../utils/sound';

interface ArrowMazeBoardProps {
  arrows: Arrow[];
  gridCols: number;
  gridRows: number;
  onArrowEscaped: (arrowId: string) => void;
  onArrowBlocked: (arrowId: string, blockerId: string) => void;
  selectedSkin?: ThemeSkin;
  isCompleted: boolean;
}

// Color palette matching user's screenshot exact vibrant smooth pastel jelly 3D colors
const COLOR_THEMES: Record<
  string,
  {
    gradientStart: string;
    gradientEnd: string;
    border: string;
    shadow: string;
    highlight: string;
  }
> = {
  cyan: {
    gradientStart: '#67E8F9',
    gradientEnd: '#06B6D4',
    border: '#0891B2',
    shadow: 'rgba(8, 145, 178, 0.35)',
    highlight: '#CFFAFE',
  },
  lime: {
    gradientStart: '#BEF264',
    gradientEnd: '#84CC16',
    border: '#65A30D',
    shadow: 'rgba(101, 163, 13, 0.35)',
    highlight: '#ECFDF5',
  },
  yellow: {
    gradientStart: '#FDE047',
    gradientEnd: '#EAB308',
    border: '#CA8A04',
    shadow: 'rgba(202, 138, 4, 0.35)',
    highlight: '#FEF9C3',
  },
  purple: {
    gradientStart: '#C084FC',
    gradientEnd: '#9333EA',
    border: '#7E22CE',
    shadow: 'rgba(126, 34, 206, 0.35)',
    highlight: '#F3E8FF',
  },
  pink: {
    gradientStart: '#F472B6',
    gradientEnd: '#DB2777',
    border: '#BE185D',
    shadow: 'rgba(190, 24, 93, 0.35)',
    highlight: '#FCE7F3',
  },
  orange: {
    gradientStart: '#FB923C',
    gradientEnd: '#EA580C',
    border: '#C2410C',
    shadow: 'rgba(194, 65, 12, 0.35)',
    highlight: '#FFEDD5',
  },
};

// Background Ghost Guide Arrow (Translucent grey track beneath active arrows as in user screenshot)
const RenderGhostTrackSVG: React.FC<{ direction: Direction; length: number; tileSize: number }> = ({
  direction,
  length,
  tileSize,
}) => {
  const rotationDegrees: Record<Direction, number> = {
    up: -90,
    down: 90,
    left: 180,
    right: 0,
    'up-left': -135,
    'up-right': -45,
    'down-left': 135,
    'down-right': 45,
  };

  const angle = rotationDegrees[direction];
  const totalWidth = tileSize * length;

  return (
    <div
      className="absolute top-0 left-0 flex items-center justify-center opacity-30 pointer-events-none"
      style={{
        width: `${totalWidth}px`,
        height: `${tileSize}px`,
        transformOrigin: `${tileSize / 2}px ${tileSize / 2}px`,
        transform: `rotate(${angle}deg)`,
      }}
    >
      <svg width={totalWidth} height={tileSize} viewBox={`0 0 ${totalWidth} ${tileSize}`} fill="none">
        <path
          d={`M 8 ${tileSize / 2 - 5} 
             L ${totalWidth - 18} ${tileSize / 2 - 5} 
             L ${totalWidth - 18} ${tileSize / 2 - 10} 
             L ${totalWidth - 6} ${tileSize / 2} 
             L ${totalWidth - 18} ${tileSize / 2 + 10} 
             L ${totalWidth - 18} ${tileSize / 2 + 5} 
             L 8 ${tileSize / 2 + 5} Z`}
          fill="#94A3B8"
          stroke="#64748B"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

// SVG Arrow Component for 3D Isometric Jelly Tube Arrow
const Render3DArrowSVG: React.FC<{
  arrow: Arrow;
  isBumping: boolean;
  isFlying: boolean;
  tileSize: number;
}> = ({ arrow, isBumping, isFlying, tileSize }) => {
  const theme = COLOR_THEMES[arrow.color] || COLOR_THEMES.cyan;

  const rotationDegrees: Record<Direction, number> = {
    up: -90,
    down: 90,
    left: 180,
    right: 0,
    'up-left': -135,
    'up-right': -45,
    'down-left': 135,
    'down-right': 45,
  };

  const angle = rotationDegrees[arrow.direction];
  const len = arrow.length || 1;
  const totalWidth = tileSize * len;
  const h = tileSize;
  const cy = h / 2;

  return (
    <div
      className={`absolute top-0 left-0 flex items-center justify-center transition-all duration-200 ${
        isBumping ? 'animate-wiggle' : ''
      } ${isFlying ? 'scale-110 opacity-80' : 'hover:scale-105'}`}
      style={{
        width: `${totalWidth}px`,
        height: `${h}px`,
        transformOrigin: `${tileSize / 2}px ${tileSize / 2}px`,
        transform: `rotate(${angle}deg)`,
      }}
    >
      <svg
        width={totalWidth}
        height={h}
        viewBox={`0 0 ${totalWidth} ${h}`}
        fill="none"
        className="filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.14)] cursor-pointer select-none overflow-visible"
      >
        <defs>
          <linearGradient id={`grad-${arrow.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={theme.highlight} stopOpacity="0.95" />
            <stop offset="30%" stopColor={theme.gradientStart} />
            <stop offset="100%" stopColor={theme.gradientEnd} />
          </linearGradient>

          <filter id={`shadow-${arrow.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor={theme.border} floodOpacity="0.4" />
          </filter>
        </defs>

        {/* 3D Bottom Bevel Shadow Layer */}
        <path
          d={`M 10 ${cy - 8} 
             L ${totalWidth - 20} ${cy - 8} 
             L ${totalWidth - 20} ${cy - 14} 
             L ${totalWidth - 4} ${cy} 
             L ${totalWidth - 20} ${cy + 14} 
             L ${totalWidth - 20} ${cy + 8} 
             L 10 ${cy + 8} Z`}
          fill={theme.border}
          opacity="0.5"
          transform="translate(0, 3.5)"
        />

        {/* Main Glossy Tube Body with Rounded Arrow Head */}
        <path
          d={`M 10 ${cy - 10} 
             C 6 ${cy - 10}, 4 ${cy - 6}, 4 ${cy} 
             C 4 ${cy + 6}, 6 ${cy + 10}, 10 ${cy + 10} 
             L ${totalWidth - 22} ${cy + 10} 
             L ${totalWidth - 22} ${cy + 17} 
             C ${totalWidth - 22} ${cy + 20}, ${totalWidth - 18} ${cy + 21}, ${totalWidth - 15} ${cy + 19} 
             L ${totalWidth - 2} ${cy + 2} 
             C ${totalWidth + 1} ${cy}, ${totalWidth + 1} ${cy - 2}, ${totalWidth - 2} ${cy - 4} 
             L ${totalWidth - 15} ${cy - 21} 
             C ${totalWidth - 18} ${cy - 23}, ${totalWidth - 22} ${cy - 22}, ${totalWidth - 22} ${cy - 19} 
             L ${totalWidth - 22} ${cy - 10} 
             Z`}
          fill={`url(#grad-${arrow.id})`}
          stroke={theme.border}
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter={`url(#shadow-${arrow.id})`}
        />

        {/* Specular White Gloss Top Edge Highlight */}
        <path
          d={`M 12 ${cy - 7} L ${totalWidth - 22} ${cy - 7} L ${totalWidth - 22} ${cy - 13} L ${totalWidth - 12} ${cy - 3}`}
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
    </div>
  );
};

export const ArrowMazeBoard: React.FC<ArrowMazeBoardProps> = ({
  arrows,
  gridCols,
  gridRows,
  onArrowEscaped,
  onArrowBlocked,
  isCompleted,
}) => {
  const [bumpingArrowId, setBumpingArrowId] = useState<string | null>(null);
  const [flyingArrows, setFlyingArrows] = useState<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    setBumpingArrowId(null);
    setFlyingArrows({});
  }, [arrows.length, gridCols, gridRows]);

  const handleArrowClick = (arrow: Arrow) => {
    if (arrow.isEscaped || flyingArrows[arrow.id] || isCompleted) return;

    soundManager.playClick();

    const { canEscape, blocker } = canArrowEscape(arrow, arrows, gridCols, gridRows);

    if (canEscape) {
      soundManager.playPop();
      soundManager.playSwoosh();

      const vec = DIRECTION_VECTORS[arrow.direction];
      const flyDist = 1200;
      setFlyingArrows((prev) => ({
        ...prev,
        [arrow.id]: { x: vec.x * flyDist, y: vec.y * flyDist },
      }));

      setTimeout(() => {
        onArrowEscaped(arrow.id);
        setFlyingArrows((prev) => {
          const next = { ...prev };
          delete next[arrow.id];
          return next;
        });
      }, 350);
    } else {
      soundManager.playBump();
      setBumpingArrowId(arrow.id);

      if (blocker) {
        onArrowBlocked(arrow.id, blocker.id);
      }

      setTimeout(() => {
        setBumpingArrowId(null);
      }, 400);
    }
  };

  const tileSize = 52; // Cell width for compact clean layout matching user's image

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center relative my-4 px-2 overflow-hidden select-none">
      {/* Off-White Stage matching screenshot clean ivory background */}
      <div className="relative w-full max-w-4xl flex items-center justify-center">
        <div
          className="relative bg-white/40 backdrop-blur-xs rounded-3xl p-4 sm:p-8 flex items-center justify-center transition-all duration-300"
          style={{
            minHeight: `${gridRows * tileSize + 60}px`,
            width: '100%',
          }}
        >
          {/* Grid Container */}
          <div
            className="relative"
            style={{
              width: `${gridCols * tileSize}px`,
              height: `${gridRows * tileSize}px`,
            }}
          >
            {/* Background Ghost Track Arrows (Matching screenshot guide tracks) */}
            {arrows.map((arrow) => {
              const left = arrow.gridX * tileSize;
              const top = arrow.gridY * tileSize;
              return (
                <div
                  key={`ghost-${arrow.id}`}
                  className="absolute"
                  style={{
                    left: `${left}px`,
                    top: `${top}px`,
                    width: `${tileSize}px`,
                    height: `${tileSize}px`,
                  }}
                >
                  <RenderGhostTrackSVG
                    direction={arrow.direction}
                    length={arrow.length || 1}
                    tileSize={tileSize}
                  />
                </div>
              );
            })}

            {/* Active 3D Jelly Arrows */}
            {arrows.map((arrow) => {
              if (arrow.isEscaped) return null;

              const isBumping = bumpingArrowId === arrow.id;
              const flyOffset = flyingArrows[arrow.id];

              const left = arrow.gridX * tileSize;
              const top = arrow.gridY * tileSize;

              return (
                <div
                  key={arrow.id}
                  onClick={() => handleArrowClick(arrow)}
                  className="absolute transition-transform ease-out cursor-pointer z-10"
                  style={{
                    left: `${left}px`,
                    top: `${top}px`,
                    width: `${tileSize}px`,
                    height: `${tileSize}px`,
                    transform: flyOffset
                      ? `translate(${flyOffset.x}px, ${flyOffset.y}px) scale(1.1)`
                      : isBumping
                      ? `scale(1.08)`
                      : 'translate(0, 0)',
                    transitionDuration: flyOffset ? '350ms' : isBumping ? '150ms' : '200ms',
                    zIndex: flyOffset ? 50 : 10,
                  }}
                >
                  <Render3DArrowSVG
                    arrow={arrow}
                    isBumping={isBumping}
                    isFlying={!!flyOffset}
                    tileSize={tileSize}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
