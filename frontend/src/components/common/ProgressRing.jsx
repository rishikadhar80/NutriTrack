const ProgressRing = ({ progress, size = 120, strokeWidth = 8, color = '#6366f1', label, value, unit }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedProgress = Math.min(Math.max(progress || 0, 0), 100);
  const offset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth={strokeWidth} />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            className="progress-ring__circle" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{value ?? `${Math.round(clampedProgress)}%`}</span>
          {unit && <span className="text-xs text-gray-500 dark:text-gray-400">{unit}</span>}
        </div>
      </div>
      {label && <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>}
    </div>
  );
};

export default ProgressRing;
