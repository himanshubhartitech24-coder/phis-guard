import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'blue' }) {
  const colorMap = {
    blue: {
      border: 'hover:border-blue-500/40',
      bgGlow: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
      badge: 'bg-blue-500/15 text-blue-300'
    },
    red: {
      border: 'hover:border-red-500/40',
      bgGlow: 'bg-red-500/10',
      iconColor: 'text-red-400',
      badge: 'bg-red-500/15 text-red-400'
    },
    green: {
      border: 'hover:border-emerald-500/40',
      bgGlow: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
      badge: 'bg-emerald-500/15 text-emerald-400'
    },
    amber: {
      border: 'hover:border-amber-500/40',
      bgGlow: 'bg-amber-500/10',
      iconColor: 'text-amber-400',
      badge: 'bg-amber-500/15 text-amber-300'
    },
    cyan: {
      border: 'hover:border-cyan-500/40',
      bgGlow: 'bg-cyan-500/10',
      iconColor: 'text-cyan-400',
      badge: 'bg-cyan-500/15 text-cyan-300'
    }
  };

  const currentTheme = colorMap[color] || colorMap.blue;

  return (
    <div className={`glass-panel rounded-2xl p-5 relative overflow-hidden transition-all duration-300 ${currentTheme.border}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-xl ${currentTheme.bgGlow} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${currentTheme.iconColor}`} />
        </div>
      </div>

      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
          {value}
        </span>
        {trend && (
          <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-full ${currentTheme.badge}`}>
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-400 mt-2 font-mono">
          {subtitle}
        </p>
      )}

      {/* Decorative cyber corner line */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-blue-500/10 to-transparent pointer-events-none" />
    </div>
  );
}
