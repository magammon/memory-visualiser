import { renderHook, waitFor } from '@testing-library/react';
import { useMemoryData } from '../useMemoryData';

// Mock the sample data
jest.mock('../../data/sampleData', () => ({
  sampleGraphData: {
    nodes: [
      { id: '1', name: 'Test Node', type: 'person', observations: ['test'] }
    ],
    links: []
  }
}));

describe('useMemoryData', () => {
  test('fetches sample data on mount', async () => {
    const { result } = renderHook(() => useMemoryData());
    
    // Since we're using sample data, loading starts as true and quickly becomes false
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeDefined();
      expect(result.current.data?.nodes).toHaveLength(1);
    });
  });

  test('provides refetch function', async () => {
    const { result } = renderHook(() => useMemoryData());
    
    await waitFor(() => {
      expect(result.current.refetch).toBeDefined();
      expect(typeof result.current.refetch).toBe('function');
    });
  });
});