import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-obsidian-accent"></div>
      <span className="ml-4 text-obsidian-text">Loading graph data...</span>
    </div>
  );
};