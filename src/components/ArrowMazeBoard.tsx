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
  const scale = tileSize / 52;
  const s = (val: number) => val * scale;
  const cy = tileSize / 2;

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
          d={`M ${s(8)} ${cy - s(5)} 
             L ${totalWidth - s(18)} ${cy - s(5)} 
             L ${totalWidth - s(18)} ${cy - s(10)} 
             L ${totalWidth - s(6)} ${cy} 
             L ${totalWidth - s(18)} ${cy + s(10)} 
             L ${totalWidth - s(18)} ${cy + s(5)} 
             L ${s(8)} ${cy + s(5)} Z`}
          fill="#94A3B8"
          stroke="#64748B"
          strokeWidth={Math.max(1, s(1.5))}
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

  // Proportional scale relative to standard 52px base
  const scale = tileSize / 52;
  const s = (val: number) => val * scale;

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
        className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.14)] cursor-pointer select-none overflow-visible"
      >
        <defs>
          <linearGradient id={`grad-${arrow.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={theme.highlight} stopOpacity="0.95" />
            <stop offset="30%" stopColor={theme.gradientStart} />
            <stop offset="100%" stopColor={theme.gradientEnd} />
          </linearGradient>

          <filter id={`shadow-${arrow.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy={s(3)} stdDeviation={s(2)} floodColor={theme.border} floodOpacity="0.4" />
          </filter>
        </defs>

        {/* 3D Bottom Bevel Shadow Layer */}
        <path
          d={`M ${s(10)} ${cy - s(8)} 
             L ${totalWidth - s(20)} ${cy - s(8)} 
             L ${totalWidth - s(20)} ${cy - s(14)} 
             L ${totalWidth - s(4)} ${cy} 
             L ${totalWidth - s(20)} ${cy + s(14)} 
             L ${totalWidth - s(20)} ${cy + s(8)} 
             L ${s(10)} ${cy + s(8)} Z`}
          fill={theme.border}
          opacity="0.5"
          transform={`translate(0, ${s(3.5)})`}
        />

        {/* Main Glossy Tube Body with Rounded Arrow Head */}
        <path
          d={`M ${s(10)} ${cy - s(10)} 
             C ${s(6)} ${cy - s(10)}, ${s(4)} ${cy - s(6)}, ${s(4)} ${cy} 
             C ${s(4)} ${cy + s(6)}, ${s(6)} ${cy + s(10)}, ${s(10)} ${cy + s(10)} 
             L ${totalWidth - s(22)} ${cy + s(10)} 
             L ${totalWidth - s(22)} ${cy + s(17)} 
             C ${totalWidth - s(22)} ${cy + s(20)}, ${totalWidth - s(18)} ${cy + s(21)}, ${totalWidth - s(15)} ${cy + s(19)} 
             L ${totalWidth - s(2)} ${cy + s(2)} 
             C ${totalWidth + s(1)} ${cy}, ${totalWidth + s(1)} ${cy - s(2)}, ${totalWidth - s(2)} ${cy - s(4)} 
             L ${totalWidth - s(15)} ${cy - s(21)} 
             C ${totalWidth - s(18)} ${cy - s(23)}, ${totalWidth - s(22)} ${cy - s(22)}, ${totalWidth - s(22)} ${cy - s(19)} 
             L ${totalWidth - s(22)} ${cy - s(10)} 
             Z`}
          fill={`url(#grad-${arrow.id})`}
          stroke={theme.border}
          strokeWidth={Math.max(1.2, s(2.2))}
          strokeLinejoin="round"
          strokeLinecap="round"
          filter={`url(#shadow-${arrow.id})`}
        />

        {/* Specular White Gloss Top Edge Highlight */}
        <path
          d={`M ${s(12)} ${cy - s(7)} L ${totalWidth - s(22)} ${cy - s(7)} L ${totalWidth - s(22)} ${cy - s(13)} L ${totalWidth - s(12)} ${cy - s(3)}`}
          stroke="white"
          strokeWidth={Math.max(1.2, s(2.5))}
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
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [bumpingArrowId, setBumpingArrowId] = useState<string | null>(null);
  const [flyingArrows, setFlyingArrows] = useState<Record<string, { x: number; y: number }>>({});
  const [tileSize, setTileSize] = useState<number>(52);

  // Dynamic board & tile size calculator for responsive mobile perfection
  useEffect(() => {
    const updateTileSize = () => {
      if (!containerRef.current) return;
      const availableWidth = containerRef.current.clientWidth - 16;
      const availableHeight = window.innerHeight - 210;

      const maxTileW = Math.floor(availableWidth / gridCols);
      const maxTileH = Math.floor(availableHeight / gridRows);

      const optimal = Math.min(maxTileW, maxTileH);
      // Clamp between 24 and 54 for perfect mobile scaling
      const clamped = Math.max(24, Math.min(54, optimal));
      setTileSize(clamped);
    };

    updateTileSize();
    window.addEventListener('resize', updateTileSize);
    return () => window.removeEventListener('resize', updateTileSize);
  }, [gridCols, gridRows]);

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

  return (
    <div
      ref={containerRef}
      className="w-full flex-1 flex flex-col items-center justify-center relative my-2 px-1 sm:px-2 overflow-hidden select-none"
    >
      {/* Off-White Stage matching screenshot clean ivory background */}
      <div className="relative w-full max-w-4xl flex items-center justify-center">
        <div
          className="relative bg-white/45 backdrop-blur-xs rounded-3xl p-2 sm:p-6 flex items-center justify-center transition-all duration-300 border border-slate-200/50 shadow-xs"
          style={{
            minHeight: `${gridRows * tileSize + 32}px`,
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
            {/* Background Ghost Track Arrows */}
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
                  className="absolute transition-transform ease-out cursor-pointer z-10 touch-manipulation"
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
