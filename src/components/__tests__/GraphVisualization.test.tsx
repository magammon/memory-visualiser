import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GraphVisualization } from '../GraphVisualization';
import * as useMemoryDataModule from '../../hooks/useMemoryData';

// Mock the react-force-graph-2d component
interface MockGraphData {
  nodes: Array<{ id: string; name: string; type: string; observations: string[] }>;
  links: unknown[];
}

interface MockForceGraphProps {
  onNodeClick: (node: unknown) => void;
  graphData: MockGraphData;
}

jest.mock('react-force-graph-2d', () => {
  return function MockForceGraph2D({ onNodeClick, graphData }: MockForceGraphProps) {
    return (
      <div data-testid="force-graph">
        {graphData.nodes.map((node) => (
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
    const useMemoryDataSpy = jest.spyOn(useMemoryDataModule, 'useMemoryData');
    useMemoryDataSpy.mockReturnValue({
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
    const useMemoryDataSpy = jest.spyOn(useMemoryDataModule, 'useMemoryData');
    useMemoryDataSpy.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: jest.fn()
    });

    render(<GraphVisualization />);
    expect(screen.getByText('Loading graph data...')).toBeInTheDocument();
  });
});