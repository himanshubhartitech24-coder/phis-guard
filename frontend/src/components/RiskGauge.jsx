import React from 'react';

export default function RiskGauge({ score = 0, size = 180, classification = 'Safe' }) {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Arc calculation (270 degrees arc)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * Math.min(100, Math.max(0, score))) / 100;

  let color = '#10b981'; // Green
  let glowColor = 'rgba(16, 185, 129, 0.4)';
  let label = 'Low Threat';

  if (score >= 68 || classification === 'Phishing') {
    color = '#ef4444'; // Red
    glowColor = 'rgba(239, 68, 68, 0.5)';
    label = 'Critical Malicious';
  } else if (score >= 35 || classification === 'Suspicious') {
    color = '#f59e0b'; // Amber
    glowColor = 'rgba(245, 158, 11, 0.4)';
    label = 'Elevated Risk';
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative" style={{ width: size, height: size }}>
        <svg 
          className="transform -rotate-135" 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Foreground colored arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s ease-out, stroke 0.4s ease',
              filter: `drop-shadow(0 0 10px ${glowColor})`
            }}
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
            {score}<span className="text-lg text-slate-400">%</span>
          </span>
          <span 
            className="text-[11px] font-bold uppercase tracking-wider mt-0.5 px-2 py-0.5 rounded-full"
            style={{ color, backgroundColor: `${color}15` }}
          >
            {label}
          </span>
        </div>
      </div>
      <p className="text-xs text-slate-400 font-mono mt-1">Aggregated Threat Index</p>
    </div>
  );
}
