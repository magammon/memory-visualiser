import { useState, useEffect } from 'react';
import type { GraphData } from '../types/memoryTypes';
import { ApiError } from '../types/memoryTypes';
// import { memoryClient } from '../services/memoryClient';
// import { DataTransformer } from '../services/dataTransformer';
// import { StorageService } from '../utils/storage';
import { sampleGraphData } from '../data/sampleData';

export const useMemoryData = () => {
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, just use sample data since MCP client doesn't work in browser
      // TODO: Implement proper MCP client or server endpoint
      console.log('Using sample data for demo');
      setData(sampleGraphData);
      setError(null);
    } catch (err) {
      const apiError = new ApiError(
        err instanceof Error ? err.message : 'Unknown error'
      );
      setError(apiError);
      
      // Always fallback to sample data if everything fails
      setData(sampleGraphData);
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