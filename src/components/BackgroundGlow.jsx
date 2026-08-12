import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const BackgroundGlow = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      
      {/* Base canvas — deep dark or crisp light */}
      <div
        className="absolute inset-0"
        style={{
          background: theme === 'dark'
            ? '#09090b' /* Neutral dark (zinc-950) instead of deep blue */
            : '#f0f4ff',
        }}
      />

      {/* === MESH GRADIENT BLOBS === */}
      {/* Blob 1 — Bright Cyan top-left */}
      <div
        className="absolute"
        style={{
          top: '-15%',
          left: '-10%',
          width: '65%',
          height: '65%',
          borderRadius: '50%',
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(100,116,139,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(6,182,212,0.35) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'meshFloat1 12s ease-in-out infinite alternate',
        }}
      />

      {/* Blob 2 — Blue center-right */}
      <div
        className="absolute"
        style={{
          top: '20%',
          right: '-15%',
          width: '60%',
          height: '60%',
          borderRadius: '50%',
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(71,85,105,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59,130,246,0.30) 0%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'meshFloat2 15s ease-in-out infinite alternate',
        }}
      />

      {/* Blob 3 — Indigo bottom-left */}
      <div
        className="absolute"
        style={{
          bottom: '-20%',
          left: '10%',
          width: '55%',
          height: '55%',
          borderRadius: '50%',
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(51,65,85,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'meshFloat3 18s ease-in-out infinite alternate',
        }}
      />

      {/* Blob 4 — Sky blue center accent */}
      <div
        className="absolute"
        style={{
          top: '40%',
          left: '30%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(148,163,184,0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(14,165,233,0.20) 0%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'meshFloat4 10s ease-in-out infinite alternate',
        }}
      />

      {/* Subtle grid overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: theme === 'dark'
            ? 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <style>{`
        @keyframes meshFloat1 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(30px, -20px) scale(1.08); }
          100% { transform: translate(-10px, 30px) scale(0.95); }
        }
        @keyframes meshFloat2 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(-40px, 20px) scale(1.1); }
          100% { transform: translate(20px, -30px) scale(0.92); }
        }
        @keyframes meshFloat3 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(20px, -40px) scale(1.05); }
          100% { transform: translate(-30px, 10px) scale(1.1); }
        }
        @keyframes meshFloat4 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(-20px, 30px) scale(0.9); }
          100% { transform: translate(30px, -10px) scale(1.12); }
        }
      `}</style>
    </div>
  );
};

export default BackgroundGlow;
