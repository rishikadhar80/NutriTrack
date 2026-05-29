const LoadingSkeleton = ({ type = 'card' }) => {
  if (type === 'page') {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 skeleton rounded-xl w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 skeleton rounded-2xl" />
          <div className="h-32 skeleton rounded-2xl" />
          <div className="h-32 skeleton rounded-2xl" />
        </div>
        <div className="h-80 skeleton rounded-2xl" />
      </div>
    );
  }

  return <div className="h-24 skeleton rounded-2xl animate-pulse" />;
};

export default LoadingSkeleton;
