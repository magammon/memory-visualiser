import React, { useState, useEffect } from 'react';
import type { GraphNode } from '../types/memoryTypes';

interface EntityDetailPanelProps {
  node: GraphNode;
  onClose: () => void;
}

export const EntityDetailPanel: React.FC<EntityDetailPanelProps> = ({ node, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div 
      className={`
        fixed right-0 top-0 w-[20vw] h-screen z-50
        bg-obsidian-surface border-l border-obsidian-border flex flex-col
        transform transition-transform duration-300 ease-out
        ${isVisible ? 'translate-x-0' : 'translate-x-[20vw]'}
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-obsidian-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-obsidian-text truncate">{node.name}</h2>
        <button
          onClick={handleClose}
          className="text-obsidian-text hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Node Info */}
        <div>
          <h3 className="text-sm font-semibold text-obsidian-text mb-2">Details</h3>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-gray-400">Type:</span>
              <span className="ml-2 text-sm text-obsidian-text capitalize">{node.type}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400">ID:</span>
              <span className="ml-2 text-sm text-obsidian-text font-mono">{node.id}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400">Observations:</span>
              <span className="ml-2 text-sm text-obsidian-text">{node.observations?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Observations */}
        {node.observations && node.observations.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-obsidian-text mb-2">Observations</h3>
            <div className="space-y-2">
              {node.observations.map((observation, index) => (
                <div
                  key={index}
                  className="p-3 bg-obsidian-bg rounded-md text-sm text-obsidian-text"
                >
                  {observation}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Type-specific styling */}
        <div className="pt-2 border-t border-obsidian-border">
          <div className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: node.color || '#58a6ff' }}
            />
            <span className="text-xs text-gray-400">
              {node.type.charAt(0).toUpperCase() + node.type.slice(1)} Entity
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};