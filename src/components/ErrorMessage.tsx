import React from 'react';
import type { ApiError } from '../types/memoryTypes';

interface ErrorMessageProps {
  error: ApiError;
  onRetry: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md">
        <h3 className="text-red-400 text-lg font-semibold mb-2">Error Loading Graph</h3>
        <p className="text-obsidian-text mb-4">{error.message}</p>
        <button
          onClick={onRetry}
          className="bg-obsidian-accent hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};