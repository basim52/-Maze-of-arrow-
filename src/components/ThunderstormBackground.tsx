import React from 'react';

interface ThunderstormBackgroundProps {
  isThunderMode?: boolean;
}

export const ThunderstormBackground: React.FC<ThunderstormBackgroundProps> = ({ isThunderMode }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dark Stormy Atmosphere Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-sky-950/90 to-slate-950 opacity-95" />

      {/* Lightning Flash Overlay Effect */}
      <div className="absolute inset-0 bg-sky-400/10 animate-pulse pointer-events-none mix-blend-screen" style={{ animationDuration: '3.5s' }} />

      {/* Top Storm Clouds (سحب رعدية ممطرة) */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-900/90 via-sky-950/60 to-transparent flex items-start justify-around opacity-90 blur-sm">
        <div className="w-48 h-24 rounded-full bg-slate-800/80 -mt-10 -ml-10 filter blur-md animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="w-64 h-28 rounded-full bg-sky-950/90 -mt-12 filter blur-lg animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="w-52 h-24 rounded-full bg-slate-800/80 -mt-8 -mr-10 filter blur-md animate-pulse" style={{ animationDuration: '5s' }} />
      </div>

      {/* Ambient Electric Blue Glowing Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 left-10 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl" />

      {/* Continuous Falling Rain Drops (قطرات المطر المتساقطة) */}
      <div className="absolute inset-0 opacity-70">
        {Array.from({ length: 28 }).map((_, i) => {
          const leftPercent = (i * 3.7) % 100;
          const duration = 0.8 + (i % 5) * 0.25;
          const delay = (i % 7) * 0.2;
          const opacity = 0.3 + (i % 4) * 0.2;
          const height = 24 + (i % 4) * 16;
          return (
            <div
              key={i}
              className="absolute bg-gradient-to-b from-transparent via-sky-300 to-cyan-100 rounded-full pointer-events-none"
              style={{
                left: `${leftPercent}%`,
                top: '-50px',
                width: '2px',
                height: `${height}px`,
                opacity: opacity,
                animation: `rainDrop ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
                transform: 'rotate(-12deg)',
              }}
            />
          );
        })}
      </div>

      {/* Ground Rain Ripple Effects at Bottom */}
      <div className="absolute bottom-6 inset-x-0 h-16 pointer-events-none flex justify-around opacity-40">
        <div className="w-16 h-4 rounded-full border border-sky-300/40 animate-ping" style={{ animationDuration: '2.2s' }} />
        <div className="w-24 h-6 rounded-full border border-cyan-300/40 animate-ping" style={{ animationDuration: '3.1s' }} />
        <div className="w-20 h-5 rounded-full border border-sky-300/40 animate-ping" style={{ animationDuration: '2.7s' }} />
      </div>

      {/* CSS Animation Keyframes for Rain Drops */}
      <style>{`
        @keyframes rainDrop {
          0% {
            transform: translateY(0px) rotate(-12deg);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          85% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(900px) rotate(-12deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
