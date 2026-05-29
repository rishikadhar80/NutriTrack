import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

const ErrorState = ({ message = 'Something went wrong', onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-4">
      <FiAlertCircle className="w-8 h-8 text-red-500" />
    </div>
    <p className="text-gray-600 dark:text-gray-400 text-center mb-4">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-primary flex items-center gap-2">
        <FiRefreshCw className="w-4 h-4" /> Try Again
      </button>
    )}
  </div>
);

export default ErrorState;
