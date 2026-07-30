import React from 'react';

export interface RainItem {
  id: string;
  type: 'cream' | 'thunder' | 'hammer' | 'chocolate';
  x: number; // Center X coordinate in pixels
  y: number; // Center Y coordinate in pixels
  delay: number; // Delay in ms before starting drop
}

interface RainStrikeOverlayProps {
  rainItems: RainItem[];
  tileSize: number;
}

export const RainStrikeOverlay: React.FC<RainStrikeOverlayProps> = ({ rainItems, tileSize }) => {
  if (!rainItems || rainItems.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {rainItems.map((item) => {
        const isCream = item.type === 'cream';
        const isThunder = item.type === 'thunder';
        const isHammer = item.type === 'hammer';
        const isChocolate = item.type === 'chocolate';

        return (
          <React.Fragment key={item.id}>
            {/* Falling Droplet / Bolt / Hammer / Chocolate */}
            <div
              className={`absolute flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 ${
                isCream
                  ? 'animate-rain-fall'
                  : isThunder
                  ? 'animate-thunder-strike'
                  : isHammer
                  ? 'animate-hammer-rain'
                  : 'animate-rain-fall'
              }`}
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                animationDelay: `${item.delay}ms`,
                width: `${tileSize * 1.5}px`,
                height: `${tileSize * 1.5}px`,
              }}
            >
              {isCream && (
                <div className="relative flex flex-col items-center">
                  {/* Cream Rain drop icon */}
                  <span className="text-4xl sm:text-5xl filter drop-shadow-[0_6px_10px_rgba(236,72,153,0.6)] transform rotate-12">
                    🍦
                  </span>
                  {/* Trailing sparkle tail */}
                  <div className="w-2 h-16 bg-gradient-to-t from-pink-400 via-rose-300 to-transparent rounded-full -mt-2 opacity-80 blur-[1px]" />
                </div>
              )}

              {isChocolate && (
                <div className="relative flex flex-col items-center">
                  {/* Chocolate drop icon */}
                  <span className="text-4xl sm:text-5xl filter drop-shadow-[0_6px_10px_rgba(120,53,15,0.7)] transform -rotate-12">
                    🍫
                  </span>
                  {/* Trailing chocolate tail */}
                  <div className="w-2.5 h-16 bg-gradient-to-t from-amber-800 via-amber-700 to-transparent rounded-full -mt-2 opacity-85 blur-[1px]" />
                </div>
              )}

              {isThunder && (
                <div className="relative flex flex-col items-center">
                  {/* Lightning Rain Bolt */}
                  <span className="text-5xl sm:text-6xl filter drop-shadow-[0_0_20px_#06b6d4] text-cyan-400 font-black animate-pulse">
                    ⚡
                  </span>
                  <div className="w-3 h-24 bg-gradient-to-t from-cyan-400 via-sky-300 to-transparent rounded-full -mt-4 opacity-90 filter drop-shadow-[0_0_12px_#38bdf8]" />
                </div>
              )}

              {isHammer && (
                <div className="relative flex flex-col items-center">
                  {/* Hammer Rain Anvil */}
                  <span className="text-5xl sm:text-6xl filter drop-shadow-[0_8px_16px_rgba(217,119,6,0.7)] transform -rotate-12">
                    🔨
                  </span>
                  <div className="w-2.5 h-20 bg-gradient-to-t from-amber-500 via-yellow-400 to-transparent rounded-full -mt-3 opacity-85" />
                </div>
              )}
            </div>

            {/* Impact Splat Wave at Target Position */}
            <div
              className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: `${tileSize * 2.2}px`,
                height: `${tileSize * 2.2}px`,
              }}
            >
              {/* Expanding Shockwave Ring */}
              <div
                className={`w-full h-full rounded-full border-4 animate-splat-ring ${
                  isCream
                    ? 'border-pink-400 bg-pink-200/40'
                    : isChocolate
                    ? 'border-amber-700 bg-amber-900/40'
                    : isThunder
                    ? 'border-cyan-400 bg-cyan-200/40'
                    : 'border-amber-400 bg-amber-200/40'
                }`}
                style={{
                  animationDelay: `${item.delay + 300}ms`,
                }}
              />

              {/* Impact Center Icon Splat */}
              <div
                className="absolute text-2xl animate-scale-up opacity-0"
                style={{
                  animationDelay: `${item.delay + 320}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                {isCream && '💥🍦'}
                {isChocolate && '💥🍫'}
                {isThunder && '⚡💥'}
                {isHammer && '🔨💥'}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
