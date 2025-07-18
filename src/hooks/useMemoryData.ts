import { useState, useEffect } from 'react';
import type { GraphData } from '../types/memoryTypes';
import { ApiError } from '../types/memoryTypes';
import { DataTransformer } from '../services/dataTransformer';
import { StorageService } from '../utils/storage';
import { sampleGraphData } from '../data/sampleData';

// Set to true to use sample data instead of API
const USE_SAMPLE_DATA = false;

export const useMemoryData = () => {
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_SAMPLE_DATA) {
        console.log('Using sample data for demo');
        setData(sampleGraphData);
        setError(null);
        return;
      }

      // Try to get cached data first
      const cachedData = await StorageService.get();
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }

      // Fetch from backend API that connects to MCP server
      const response = await fetch('/api/memory/graph');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const memoryGraph = await response.json();
      const graphData = DataTransformer.transformToGraphData(memoryGraph);
      const optimizedData = DataTransformer.optimizeForVisualization(graphData);

      // Cache the result
      await StorageService.set(optimizedData);
      setData(optimizedData);
    } catch (err) {
      const apiError = new ApiError(
        err instanceof Error ? err.message : 'Unknown error'
      );
      setError(apiError);
      
      // Try to use cached data as fallback
      const cachedData = await StorageService.get();
      if (cachedData) {
        setData(cachedData);
      } else {
        // Final fallback to sample data
        setData(sampleGraphData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};