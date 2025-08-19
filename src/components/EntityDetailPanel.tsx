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
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
        backdropFilter: 'blur(4px)',
        backgroundColor: '#161b22'
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-obsidian-border flex items-center justify-between" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
        <h2 className="text-lg font-semibold truncate" style={{ color: '#e6edf3' }}>{node.name}</h2>
        <button
          onClick={handleClose}
          className="p-2 hover:text-white transition-colors"
          style={{ borderRadius: '4px', color: '#e6edf3' }}
          onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = 'rgba(88, 166, 255, 0.2)'}
          onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Node Info */}
        <div className="p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '6px' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#e6edf3' }}>Details</h3>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-gray-400">Type:</span>
              <span className="ml-2 text-sm capitalize" style={{ color: '#e6edf3' }}>{node.type}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400">ID:</span>
              <span className="ml-2 text-sm font-mono" style={{ color: '#e6edf3' }}>{node.id}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400">Observations:</span>
              <span className="ml-2 text-sm" style={{ color: '#e6edf3' }}>{node.observations?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Observations */}
        {node.observations && node.observations.length > 0 && (
          <div className="p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '6px' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#e6edf3' }}>Observations</h3>
            <div className="space-y-3">
              {node.observations.map((observation, index) => (
                <div
                  key={index}
                  className="p-3 border text-sm"
                  style={{ 
                    backgroundColor: 'rgba(13, 17, 23, 0.8)', 
                    borderColor: '#404040',
                    borderRadius: '6px',
                    color: '#e6edf3'
                  }}
                >
                  {observation}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Type-specific styling */}
        <div className="p-4 border-t" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '6px', borderTopColor: '#404040' }}>
          <div className="flex items-center space-x-3">
            <div
              className="w-4 h-4 rounded-full border-2"
              style={{ 
                backgroundColor: node.color || '#58a6ff',
                borderColor: 'rgba(255, 255, 255, 0.2)'
              }}
            />
            <span className="text-sm font-medium" style={{ color: '#e6edf3' }}>
              {node.type.charAt(0).toUpperCase() + node.type.slice(1)} Entity
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};