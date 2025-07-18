import type { GraphData } from '../types/memoryTypes';

export const sampleGraphData: GraphData = {
  nodes: [
    {
      id: '1',
      name: 'Alice Johnson',
      type: 'person',
      observations: ['Works at TechCorp', 'Lives in San Francisco', 'Loves coffee'],
      val: 8,
      color: '#58a6ff'
    },
    {
      id: '2',
      name: 'TechCorp',
      type: 'place',
      observations: ['Technology company', 'Located in SOMA district'],
      val: 6,
      color: '#7c3aed'
    },
    {
      id: '3',
      name: 'Machine Learning',
      type: 'concept',
      observations: ['AI technology', 'Used in TechCorp projects'],
      val: 7,
      color: '#f59e0b'
    },
    {
      id: '4',
      name: 'Project Alpha',
      type: 'event',
      observations: ['Started in 2024', 'Led by Alice'],
      val: 5,
      color: '#10b981'
    }
  ],
  links: [
    { source: '1', target: '2', type: 'works_at' },
    { source: '1', target: '4', type: 'leads' },
    { source: '2', target: '3', type: 'uses' },
    { source: '3', target: '4', type: 'applied_in' }
  ]
};