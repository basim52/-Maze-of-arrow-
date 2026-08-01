import React, { useState, useEffect } from 'react';
import { Arrow, Direction, ThemeSkin } from '../types';
import { DIRECTION_VECTORS, canArrowEscape } from '../utils/levelGenerator';
import { soundManager } from '../utils/sound';
import { RainStrikeOverlay, RainItem } from './RainStrikeOverlay';

interface ArrowMazeBoardProps {
  arrows: Arrow[];
  gridCols: number;
  gridRows: number;
  onArrowEscaped: (arrowId: string) => void;
  onArrowBlocked: (arrowId: string, blockerId: string) => void;
  selectedSkin?: ThemeSkin;
  isCompleted: boolean;
  isHammerActive?: boolean;
  onUseHammer?: (arrowId: string) => void;
  rainItems?: RainItem[];
  gameMode?: 'main' | 'galaxy';
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
const RenderGhostTrackSVG: React.FC<{ direction: Direction; length: number; tileSize: number; isDouble?: boolean }> = ({
  direction,
  length,
  tileSize,
  isDouble,
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
    'slight-up-right': -22.5,
    'slight-up-left': -157.5,
    'slight-down-right': 22.5,
    'slight-down-left': 157.5,
  };

  const angle = rotationDegrees[direction];
  const totalWidth = tileSize * length;
  const scale = tileSize / 52;
  const s = (val: number) => val * scale;
  const cy = tileSize / 2;

  const pathD = isDouble
    ? `M ${s(18)} ${cy - s(10)} 
       L ${s(6)} ${cy} 
       L ${s(18)} ${cy + s(10)} 
       L ${s(18)} ${cy + s(5)} 
       L ${totalWidth - s(18)} ${cy + s(5)} 
       L ${totalWidth - s(18)} ${cy + s(10)} 
       L ${totalWidth - s(6)} ${cy} 
       L ${totalWidth - s(18)} ${cy - s(10)} 
       L ${totalWidth - s(18)} ${cy - s(5)} 
       L ${s(18)} ${cy - s(5)} Z`
    : `M ${s(8)} ${cy - s(5)} 
       L ${totalWidth - s(18)} ${cy - s(5)} 
       L ${totalWidth - s(18)} ${cy - s(10)} 
       L ${totalWidth - s(6)} ${cy} 
       L ${totalWidth - s(18)} ${cy + s(10)} 
       L ${totalWidth - s(18)} ${cy + s(5)} 
       L ${s(8)} ${cy + s(5)} Z`;

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
          d={pathD}
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
  gameMode?: 'main' | 'galaxy';
}> = ({ arrow, isBumping, isFlying, tileSize, gameMode }) => {
  const isGalaxy = gameMode === 'galaxy';
  const theme = COLOR_THEMES[arrow.color] || COLOR_THEMES.cyan;
  const isDouble = arrow.isDouble || arrow.type === 'double';
  const isBomb = arrow.isBomb || arrow.type === 'bomb';
  const isGhost = arrow.isGhost || arrow.type === 'ghost';
  const isStar = arrow.isStar || arrow.type === 'star';
  const isDiamond = arrow.isDiamond || arrow.type === 'diamond';

  // Galaxy Space Color Palettes based on arrow color index
  const galaxyTheme = {
    highlight: arrow.color === 'pink' ? '#FCE7F3' : arrow.color === 'yellow' ? '#FEF9C3' : arrow.color === 'purple' ? '#F5D0FE' : '#E0F2FE',
    gradientStart: arrow.color === 'pink' ? '#EC4899' : arrow.color === 'yellow' ? '#EAB308' : arrow.color === 'purple' ? '#A855F7' : '#06B6D4',
    gradientEnd: arrow.color === 'pink' ? '#831843' : arrow.color === 'yellow' ? '#713F12' : arrow.color === 'purple' ? '#4C1D95' : '#0F172A',
    border: arrow.color === 'pink' ? '#BE185D' : arrow.color === 'yellow' ? '#CA8A04' : arrow.color === 'purple' ? '#7E22CE' : '#0284C7',
  };

  const activeTheme = isGalaxy ? galaxyTheme : theme;

  const rotationDegrees: Record<Direction, number> = {
    up: -90,
    down: 90,
    left: 180,
    right: 0,
    'up-left': -135,
    'up-right': -45,
    'down-left': 135,
    'down-right': 45,
    'slight-up-right': -22.5,
    'slight-up-left': -157.5,
    'slight-down-right': 22.5,
    'slight-down-left': 157.5,
  };

  const angle = rotationDegrees[arrow.direction];
  const len = arrow.length || 1;
  const totalWidth = tileSize * len;
  const h = tileSize;
  const cy = h / 2;

  // Proportional scale relative to standard 52px base
  const scale = tileSize / 52;
  const s = (val: number) => val * scale;

  const shadowPath = isDouble
    ? `M ${s(18)} ${cy - s(14)} 
       L ${s(4)} ${cy} 
       L ${s(18)} ${cy + s(14)} 
       L ${s(18)} ${cy + s(8)} 
       L ${totalWidth - s(18)} ${cy + s(8)} 
       L ${totalWidth - s(18)} ${cy + s(14)} 
       L ${totalWidth - s(4)} ${cy} 
       L ${totalWidth - s(18)} ${cy - s(14)} 
       L ${totalWidth - s(18)} ${cy - s(8)} 
       L ${s(18)} ${cy - s(8)} Z`
    : `M ${s(10)} ${cy - s(8)} 
       L ${totalWidth - s(20)} ${cy - s(8)} 
       L ${totalWidth - s(20)} ${cy - s(14)} 
       L ${totalWidth - s(4)} ${cy} 
       L ${totalWidth - s(20)} ${cy + s(14)} 
       L ${totalWidth - s(20)} ${cy + s(8)} 
       L ${s(10)} ${cy + s(8)} Z`;

  const bodyPath = isDouble
    ? `M ${s(15)} ${cy - s(19)} 
       C ${s(18)} ${cy - s(22)}, ${s(22)} ${cy - s(20)}, ${s(22)} ${cy - s(17)} 
       L ${s(22)} ${cy - s(10)} 
       L ${totalWidth - s(22)} ${cy - s(10)} 
       L ${totalWidth - s(22)} ${cy - s(17)} 
       C ${totalWidth - s(22)} ${cy - s(20)}, ${totalWidth - s(18)} ${cy - s(22)}, ${totalWidth - s(15)} ${cy - s(19)} 
       L ${totalWidth - s(2)} ${cy - s(2)} 
       C ${totalWidth + s(1)} ${cy}, ${totalWidth + s(1)} ${cy + s(2)}, ${totalWidth - s(2)} ${cy + s(4)} 
       L ${totalWidth - s(15)} ${cy + s(19)} 
       C ${totalWidth - s(18)} ${cy + s(22)}, ${totalWidth - s(22)} ${cy + s(20)}, ${totalWidth - s(22)} ${cy + s(17)} 
       L ${totalWidth - s(22)} ${cy + s(10)} 
       L ${s(22)} ${cy + s(10)} 
       L ${s(22)} ${cy + s(17)} 
       C ${s(22)} ${cy + s(20)}, ${s(18)} ${cy + s(22)}, ${s(15)} ${cy + s(19)} 
       L ${s(2)} ${cy + s(4)} 
       C ${-s(1)} ${cy + s(2)}, ${-s(1)} ${cy - s(2)}, ${s(2)} ${cy - s(4)} Z`
    : `M ${s(10)} ${cy - s(10)} 
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
       Z`;

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
            <stop
              offset="0%"
              stopColor={
                isDiamond
                  ? '#E0F2FE'
                  : isBomb
                  ? '#FDE047'
                  : isGhost
                  ? '#E9D5FF'
                  : isStar
                  ? '#FEF08A'
                  : activeTheme.highlight
              }
              stopOpacity="0.95"
            />
            <stop
              offset="30%"
              stopColor={
                isDiamond
                  ? '#38BDF8'
                  : isBomb
                  ? '#F97316'
                  : isGhost
                  ? '#A855F7'
                  : isStar
                  ? '#F59E0B'
                  : activeTheme.gradientStart
              }
            />
            <stop
              offset="100%"
              stopColor={
                isDiamond
                  ? '#0284C7'
                  : isBomb
                  ? '#DC2626'
                  : isGhost
                  ? '#581C87'
                  : isStar
                  ? '#E11D48'
                  : activeTheme.gradientEnd
              }
            />
          </linearGradient>

          <filter id={`shadow-${arrow.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy={s(3)}
              stdDeviation={s(2)}
              floodColor={
                isDiamond
                  ? '#0369A1'
                  : isBomb
                  ? '#991B1B'
                  : isGhost
                  ? '#3B0764'
                  : isStar
                  ? '#78350F'
                  : activeTheme.border
              }
              floodOpacity="0.4"
            />
          </filter>
        </defs>

        {/* 3D Bottom Bevel Shadow Layer */}
        <path
          d={shadowPath}
          fill={
            isDiamond
              ? '#0369A1'
              : isBomb
              ? '#991B1B'
              : isGhost
              ? '#3B0764'
              : isStar
              ? '#78350F'
              : activeTheme.border
          }
          opacity="0.5"
          transform={`translate(0, ${s(3.5)})`}
        />

        {/* Main Glossy Tube Body */}
        <path
          d={bodyPath}
          fill={`url(#grad-${arrow.id})`}
          stroke={
            isDiamond
              ? '#0284C7'
              : isBomb
              ? '#7F1D1D'
              : isGhost
              ? '#6B21A8'
              : isStar
              ? '#B45309'
              : activeTheme.border
          }
          strokeWidth={Math.max(1.2, s(2.2))}
          strokeLinejoin="round"
          strokeLinecap="round"
          filter={`url(#shadow-${arrow.id})`}
          opacity={isGhost ? 0.9 : 1}
        />

        {/* Specular White Gloss Top Edge Highlight */}
        <path
          d={
            isDouble
              ? `M ${s(18)} ${cy - s(7)} L ${totalWidth - s(18)} ${cy - s(7)}`
              : `M ${s(12)} ${cy - s(7)} L ${totalWidth - s(22)} ${cy - s(7)} L ${totalWidth - s(22)} ${cy - s(13)} L ${totalWidth - s(12)} ${cy - s(3)}`
          }
          stroke="white"
          strokeWidth={Math.max(1.2, s(2.5))}
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Double Arrow Badge Icon in the center */}
        {isDouble && (
          <text
            x={totalWidth / 2}
            y={cy + s(4)}
            textAnchor="middle"
            fill="white"
            fontSize={s(16)}
            fontWeight="900"
            className="select-none pointer-events-none drop-shadow-md"
          >
            ↔
          </text>
        )}

        {/* Bomb Arrow Badge Icon in the center */}
        {isBomb && (
          <text
            x={totalWidth / 2}
            y={cy + s(5)}
            textAnchor="middle"
            fill="white"
            fontSize={s(15)}
            fontWeight="900"
            className="select-none pointer-events-none drop-shadow-md animate-pulse"
          >
            💣
          </text>
        )}

        {/* Ghost Arrow Badge Icon in the center */}
        {isGhost && (
          <text
            x={totalWidth / 2}
            y={cy + s(5)}
            textAnchor="middle"
            fill="white"
            fontSize={s(15)}
            fontWeight="900"
            className="select-none pointer-events-none drop-shadow-md animate-pulse"
          >
            👻
          </text>
        )}

        {/* Bonus Star Arrow Badge Icon in the center */}
        {isStar && (
          <text
            x={totalWidth / 2}
            y={cy + s(5)}
            textAnchor="middle"
            fill="white"
            fontSize={s(15)}
            fontWeight="900"
            className="select-none pointer-events-none drop-shadow-md animate-bounce"
          >
            🌟
          </text>
        )}

        {/* Diamond Veteran Arrow Badge Icon in the center */}
        {isDiamond && (
          <text
            x={totalWidth / 2}
            y={cy + s(5)}
            textAnchor="middle"
            fill="white"
            fontSize={s(15)}
            fontWeight="900"
            className="select-none pointer-events-none drop-shadow-md animate-pulse"
          >
            💎
          </text>
        )}

        {/* Cosmic Galaxy Sparkle Badge on standard space arrows */}
        {isGalaxy && !isDouble && !isBomb && !isGhost && !isStar && (
          <text
            x={totalWidth / 2}
            y={cy + s(4)}
            textAnchor="middle"
            fill="white"
            fontSize={s(13)}
            fontWeight="900"
            className="select-none pointer-events-none drop-shadow-md animate-pulse"
          >
            ✨
          </text>
        )}
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
  isHammerActive,
  onUseHammer,
  rainItems = [],
  gameMode = 'main',
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [bumpingArrowId, setBumpingArrowId] = useState<string | null>(null);
  const [smashingArrowId, setSmashingArrowId] = useState<string | null>(null);
  const [flyingArrows, setFlyingArrows] = useState<Record<string, { x: number; y: number }>>({});
  const [tileSize, setTileSize] = useState<number>(52);
  const isGalaxy = gameMode === 'galaxy';

  // Dynamic board & tile size calculator for responsive mobile perfection and enlarged board
  useEffect(() => {
    const updateTileSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const availW = Math.max(260, rect.width - 24);
      // Use available container height or calculate based on viewport
      const availH = Math.max(280, (window.innerHeight - 180));

      const maxTileW = Math.floor(availW / gridCols);
      const maxTileH = Math.floor(availH / gridRows);

      // Strict rule: tile size must NEVER cause grid width to exceed container width
      const optimal = Math.min(maxTileW, maxTileH);
      const clamped = Math.max(16, Math.min(95, optimal));
      setTileSize(clamped);
    };

    updateTileSize();
    const observer = new ResizeObserver(() => updateTileSize());
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener('resize', updateTileSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateTileSize);
    };
  }, [gridCols, gridRows]);

  useEffect(() => {
    setBumpingArrowId(null);
    setFlyingArrows({});
    setSmashingArrowId(null);
  }, [arrows.length, gridCols, gridRows]);

  const handleArrowClick = (arrow: Arrow) => {
    if (arrow.isEscaped || flyingArrows[arrow.id] || isCompleted || smashingArrowId) return;

    if (isHammerActive && onUseHammer) {
      soundManager.playSmash();
      setSmashingArrowId(arrow.id);
      setTimeout(() => {
        onUseHammer(arrow.id);
        setSmashingArrowId(null);
      }, 300);
      return;
    }

    soundManager.playClick();

    const { canEscape, blocker, escapeDirection } = canArrowEscape(arrow, arrows, gridCols, gridRows);
    const isBomb = arrow.isBomb || arrow.type === 'bomb';

    if (canEscape) {
      soundManager.playPop();
      soundManager.playSwoosh();

      const vec = DIRECTION_VECTORS[escapeDirection || arrow.direction];
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
        if (isBomb) {
          soundManager.playSmash();
          setSmashingArrowId(blocker.id);
          setTimeout(() => {
            onArrowEscaped(blocker.id);
            setSmashingArrowId(null);
          }, 300);
        } else {
          onArrowBlocked(arrow.id, blocker.id);
        }
      }

      setTimeout(() => {
        setBumpingArrowId(null);
      }, 400);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full flex-1 flex flex-col items-center justify-center relative my-0.5 px-0.5 sm:px-1 overflow-hidden select-none min-h-[280px]"
    >
      {/* Stage Container */}
      <div className="relative w-full flex-1 flex items-center justify-center">
        <div
          className={`relative backdrop-blur-md rounded-3xl p-2.5 sm:p-4 flex items-center justify-center transition-all duration-300 border-2 overflow-hidden shadow-lg ${
            isGalaxy
              ? 'bg-gradient-to-b from-slate-950 via-purple-950/90 to-indigo-950 border-purple-500/80 shadow-[0_0_30px_rgba(168,85,247,0.35)]'
              : isHammerActive
              ? 'bg-gradient-to-b from-slate-50/90 via-white/85 to-slate-100/90 border-amber-400 ring-4 ring-amber-300/30 shadow-amber-100'
              : 'bg-gradient-to-b from-slate-50/90 via-white/85 to-slate-100/90 border-slate-200/80'
          }`}
          style={{
            width: `${gridCols * tileSize + 20}px`,
            height: `${gridRows * tileSize + 20}px`,
            maxWidth: '100%',
          }}
        >
          {/* Subtle Grid Dot Pattern Canvas Background */}
          <div
            className={`absolute inset-0 rounded-3xl pointer-events-none ${isGalaxy ? 'opacity-20' : 'opacity-40'}`}
            style={{
              backgroundImage: `radial-gradient(${isGalaxy ? '#c084fc' : '#94a3b8'} 1px, transparent 1px)`,
              backgroundSize: `${tileSize}px ${tileSize}px`,
              backgroundPosition: `${tileSize / 2}px ${tileSize / 2}px`,
            }}
          />

          {/* Twinkling Galaxy Stars Background for Event Levels */}
          {isGalaxy && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              {/* Cosmic Nebulae Glow Blobs */}
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-600/30 rounded-full blur-2xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-36 h-36 bg-pink-600/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 right-10 w-28 h-28 bg-indigo-600/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />

              {/* Twinkling Star Field Dots */}
              {[
                { top: '8%', left: '12%', size: 'w-1 h-1', delay: '0s', color: 'bg-white' },
                { top: '15%', left: '78%', size: 'w-1.5 h-1.5', delay: '0.4s', color: 'bg-purple-200' },
                { top: '22%', left: '38%', size: 'w-2 h-2', delay: '0.8s', color: 'bg-amber-200' },
                { top: '35%', left: '88%', size: 'w-1 h-1', delay: '1.2s', color: 'bg-cyan-200' },
                { top: '48%', left: '18%', size: 'w-2.5 h-2.5', delay: '0.2s', color: 'bg-white' },
                { top: '58%', left: '72%', size: 'w-1.5 h-1.5', delay: '1.6s', color: 'bg-pink-300' },
                { top: '68%', left: '28%', size: 'w-1 h-1', delay: '0.9s', color: 'bg-sky-200' },
                { top: '82%', left: '82%', size: 'w-2 h-2', delay: '1.4s', color: 'bg-amber-300' },
                { top: '88%', left: '42%', size: 'w-1.5 h-1.5', delay: '0.6s', color: 'bg-white' },
                { top: '12%', left: '60%', size: 'w-2 h-2', delay: '1.8s', color: 'bg-cyan-300' },
                { top: '75%', left: '10%', size: 'w-1 h-1', delay: '1.1s', color: 'bg-purple-300' },
                { top: '42%', left: '52%', size: 'w-1.5 h-1.5', delay: '0.3s', color: 'bg-white' },
              ].map((star, idx) => (
                <div
                  key={`star-${idx}`}
                  className={`absolute rounded-full shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse ${star.size} ${star.color}`}
                  style={{
                    top: star.top,
                    left: star.left,
                    animationDelay: star.delay,
                  }}
                />
              ))}
            </div>
          )}

          {/* Grid Container */}
          <div
            className="relative"
            style={{
              width: `${gridCols * tileSize}px`,
              height: `${gridRows * tileSize}px`,
            }}
          >
            {/* Rain Powerup Strike Overlay */}
            <RainStrikeOverlay rainItems={rainItems} tileSize={tileSize} />

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
                    isDouble={arrow.isDouble || arrow.type === 'double'}
                  />
                </div>
              );
            })}

            {/* Active 3D Jelly Arrows */}
            {arrows.map((arrow) => {
              if (arrow.isEscaped) return null;

              const isBumping = bumpingArrowId === arrow.id;
              const isSmashing = smashingArrowId === arrow.id;
              const flyOffset = flyingArrows[arrow.id];

              const left = arrow.gridX * tileSize;
              const top = arrow.gridY * tileSize;

              return (
                <div
                  key={arrow.id}
                  onClick={() => handleArrowClick(arrow)}
                  className={`absolute transition-all ease-out cursor-pointer z-10 touch-manipulation group ${
                    isHammerActive ? 'hover:scale-110 active:scale-95' : ''
                  }`}
                  style={{
                    left: `${left}px`,
                    top: `${top}px`,
                    width: `${tileSize}px`,
                    height: `${tileSize}px`,
                    transform: isSmashing
                      ? 'scale(0) rotate(180deg)'
                      : flyOffset
                      ? `translate(${flyOffset.x}px, ${flyOffset.y}px) scale(1.15)`
                      : isBumping
                      ? `scale(1.08)`
                      : 'translate(0, 0)',
                    opacity: isSmashing ? 0 : 1,
                    transitionDuration: isSmashing ? '300ms' : flyOffset ? '350ms' : isBumping ? '150ms' : '200ms',
                    zIndex: isSmashing ? 60 : flyOffset ? 50 : 10,
                  }}
                >
                  {/* Smash Particle Explosion Overlay */}
                  {isSmashing && (
                    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                      <span className="text-4xl animate-ping">💥</span>
                      <span className="absolute text-2xl animate-bounce text-amber-500 font-black">🔨</span>
                    </div>
                  )}

                  {/* Hammer Reticle target glow in hammer mode */}
                  {isHammerActive && (
                    <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-amber-500 bg-amber-400/20 group-hover:bg-amber-400/40 group-hover:border-solid transition-all flex items-center justify-center z-30 pointer-events-none shadow-xs animate-pulse">
                      <span className="text-sm font-black text-amber-900 bg-amber-300/90 px-1.5 py-0.5 rounded-md shadow-2xs">
                        🔨
                      </span>
                    </div>
                  )}

                  <Render3DArrowSVG
                    arrow={arrow}
                    isBumping={isBumping}
                    isFlying={!!flyOffset}
                    tileSize={tileSize}
                    gameMode={gameMode}
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
