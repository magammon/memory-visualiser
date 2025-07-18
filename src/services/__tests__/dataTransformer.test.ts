import { DataTransformer } from '../dataTransformer';
import { MemoryGraph } from '../../types/memoryTypes';

describe('DataTransformer', () => {
  const mockMemoryGraph: MemoryGraph = {
    entities: [
      { id: '1', name: 'Alice', type: 'person', observations: ['test'] },
      { id: '2', name: 'Company', type: 'place', observations: ['office'] }
    ],
    relations: [
      { from: '1', to: '2', relationType: 'works_at' }
    ]
  };

  test('transforms memory graph to graph data', () => {
    const result = DataTransformer.transformToGraphData(mockMemoryGraph);
    
    expect(result.nodes).toHaveLength(2);
    expect(result.links).toHaveLength(1);
    expect(result.nodes[0]).toMatchObject({
      id: '1',
      name: 'Alice',
      type: 'person'
    });
  });

  test('optimizes graph for visualization', () => {
    const largeGraph = {
      nodes: Array.from({ length: 150 }, (_, i) => ({
        id: `${i}`,
        name: `Node ${i}`,
        type: 'person',
        observations: []
      })),
      links: []
    };

    const result = DataTransformer.optimizeForVisualization(largeGraph, 100);
    expect(result.nodes).toHaveLength(100);
  });
});