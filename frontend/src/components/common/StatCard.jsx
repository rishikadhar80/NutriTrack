const colorClasses = {
  blue: 'from-blue-500 to-cyan-500',
  accent: 'from-accent-500 to-emerald-500',
  purple: 'from-purple-500 to-fuchsia-500',
  orange: 'from-orange-500 to-amber-500',
  yellow: 'from-yellow-500 to-orange-500',
};

const StatCard = ({ title, value, unit, icon, color = 'blue' }) => (
  <div className="glass-card p-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
          {value}
          {unit && <span className="ml-1 text-sm font-semibold text-gray-500 dark:text-gray-400">{unit}</span>}
        </p>
      </div>
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClasses[color] || colorClasses.blue} flex items-center justify-center text-lg`}>
        {icon}
      </div>
    </div>
  </div>
);

export default StatCard;
