import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GraphVisualization } from '../GraphVisualization';

// Mock the react-force-graph-2d component
jest.mock('react-force-graph-2d', () => {
  return function MockForceGraph2D({ onNodeClick, graphData }: any) {
    return (
      <div data-testid="force-graph">
        {graphData.nodes.map((node: any) => (
          <button
            key={node.id}
            data-testid={`node-${node.id}`}
            onClick={() => onNodeClick(node)}
          >
            {node.name}
          </button>
        ))}
      </div>
    );
  };
});

// Mock the useMemoryData hook
jest.mock('../../hooks/useMemoryData');

describe('GraphVisualization', () => {
  beforeEach(() => {
    const mockUseMemoryData = require('../../hooks/useMemoryData').useMemoryData;
    mockUseMemoryData.mockReturnValue({
      data: {
        nodes: [
          { id: '1', name: 'Test Node', type: 'person', observations: ['test'] }
        ],
        links: []
      },
      loading: false,
      error: null,
      refetch: jest.fn()
    });
  });

  test('renders graph with nodes', () => {
    render(<GraphVisualization />);
    expect(screen.getByTestId('force-graph')).toBeInTheDocument();
    expect(screen.getByText('Test Node')).toBeInTheDocument();
  });

  test('opens detail panel on node click', () => {
    render(<GraphVisualization />);
    fireEvent.click(screen.getByTestId('node-1'));
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  test('shows loading state', () => {
    const mockUseMemoryData = require('../../hooks/useMemoryData').useMemoryData;
    mockUseMemoryData.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: jest.fn()
    });

    render(<GraphVisualization />);
    expect(screen.getByText('Loading graph data...')).toBeInTheDocument();
  });
});