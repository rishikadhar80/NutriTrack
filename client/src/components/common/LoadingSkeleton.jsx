const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {skeletons.map(i => (
          <div key={i} className="glass-card p-5 animate-pulse">
            <div className="skeleton h-4 w-24 rounded mb-3" />
            <div className="skeleton h-8 w-16 rounded mb-2" />
            <div className="skeleton h-3 w-20 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="glass-card p-6 animate-pulse">
        <div className="skeleton h-5 w-32 rounded mb-4" />
        <div className="skeleton h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {skeletons.map(i => (
          <div key={i} className="glass-card p-4 animate-pulse flex gap-4">
            <div className="skeleton h-12 w-12 rounded-xl" />
            <div className="flex-1">
              <div className="skeleton h-4 w-3/4 rounded mb-2" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'page') {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="skeleton h-8 w-48 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-card p-5">
              <div className="skeleton h-4 w-24 rounded mb-3" />
              <div className="skeleton h-8 w-16 rounded" />
            </div>
          ))}
        </div>
        <div className="glass-card p-6">
          <div className="skeleton h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
