const ProgressRing = ({
  progress = 0,
  size = 120,
  strokeWidth = 8,
  color = '#6366f1',
  label,
  value,
  unit,
}) => {
  const normalized = Math.max(0, Math.min(Number(progress) || 0, 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="block">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="progress-ring__circle"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white leading-none">{value}</span>
          {unit && <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{unit}</span>}
        </div>
      </div>
      {label && <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">{label}</p>}
    </div>
  );
};

export default ProgressRing;
