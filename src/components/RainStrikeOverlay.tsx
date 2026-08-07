import React from 'react';

export interface RainItem {
  id: string;
  type: 'cream' | 'thunder' | 'hammer' | 'chocolate' | 'tomato' | 'spaceCream' | 'creamHammer' | 'liquidChocolate' | 'chicken';
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
        const isCreamHammer = item.type === 'creamHammer';
        const isChocolate = item.type === 'chocolate';
        const isTomato = item.type === 'tomato';
        const isSpaceCream = item.type === 'spaceCream';
        const isLiquidChocolate = item.type === 'liquidChocolate';
        const isChicken = item.type === 'chicken';

        return (
          <React.Fragment key={item.id}>
            {/* Falling Droplet / Bolt / Hammer / Chocolate / Tomato / Space Cream / Chicken */}
            <div
              className={`absolute flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 ${
                isThunder
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
              {isChicken && (
                <div className="relative flex flex-col items-center">
                  <span className="text-4xl sm:text-5xl filter drop-shadow-[0_0_15px_rgba(245,158,11,0.9)] transform -rotate-12 animate-bounce">
                    🐔🍗
                  </span>
                  <div className="w-3 h-20 bg-gradient-to-t from-amber-500 via-orange-400 to-transparent rounded-full -mt-2 opacity-90 blur-[1px]" />
                </div>
              )}
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

              {isSpaceCream && (
                <div className="relative flex flex-col items-center">
                  {/* Space Cream Rain drop icon */}
                  <span className="text-4xl sm:text-5xl filter drop-shadow-[0_0_15px_rgba(168,85,247,0.9)] transform rotate-12 animate-pulse">
                    🌌🍦
                  </span>
                  {/* Trailing cosmic tail */}
                  <div className="w-3 h-20 bg-gradient-to-t from-purple-500 via-indigo-400 to-transparent rounded-full -mt-2 opacity-90 blur-[1px]" />
                </div>
              )}

              {isLiquidChocolate && (
                <div className="relative flex flex-col items-center">
                  {/* Liquid Chocolate Rain drop icon */}
                  <span className="text-4xl sm:text-5xl filter drop-shadow-[0_0_15px_rgba(180,83,9,0.9)] transform -rotate-12 animate-pulse">
                    🍫💧
                  </span>
                  {/* Trailing liquid chocolate stream */}
                  <div className="w-3 h-20 bg-gradient-to-t from-amber-950 via-amber-800 to-transparent rounded-full -mt-2 opacity-90 blur-[1px]" />
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

              {isTomato && (
                <div className="relative flex flex-col items-center">
                  {/* Tomato drop icon */}
                  <span className="text-4xl sm:text-5xl filter drop-shadow-[0_6px_10px_rgba(225,29,72,0.8)] transform rotate-12">
                    🍅
                  </span>
                  {/* Trailing tomato tail */}
                  <div className="w-2.5 h-16 bg-gradient-to-t from-rose-600 via-red-500 to-transparent rounded-full -mt-2 opacity-85 blur-[1px]" />
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

              {isCreamHammer && (
                <div className="relative flex flex-col items-center">
                  {/* Cream Hammer Icon */}
                  <span className="text-5xl sm:text-6xl filter drop-shadow-[0_8px_16px_rgba(236,72,153,0.8)] transform rotate-6">
                    🍦🔨
                  </span>
                  <div className="w-3 h-20 bg-gradient-to-t from-pink-500 via-amber-400 to-transparent rounded-full -mt-3 opacity-90 blur-[1px]" />
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
                  isChicken
                    ? 'border-amber-500 bg-amber-200/50'
                    : isCream
                    ? 'border-pink-400 bg-pink-200/40'
                    : isSpaceCream
                    ? 'border-purple-400 bg-purple-900/50'
                    : isChocolate
                    ? 'border-amber-700 bg-amber-900/40'
                    : isTomato
                    ? 'border-rose-500 bg-rose-200/50'
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
                {isChicken && '💥🐔'}
                {isCream && '💥🍦'}
                {isSpaceCream && '💥🌌🍦'}
                {isChocolate && '💥🍫'}
                {isTomato && '💥🍅'}
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
