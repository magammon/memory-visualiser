import type { GraphData } from '../types/memoryTypes';

const STORAGE_KEY = 'memory-graph-data';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  data: GraphData;
  timestamp: number;
}

export class StorageService {
  static async get(): Promise<GraphData | null> {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (!cached) return null;
      
      const entry: CacheEntry = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is still valid
      if (now - entry.timestamp > CACHE_DURATION) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      
      return entry.data;
    } catch (error) {
      console.error('Failed to read from cache:', error);
      return null;
    }
  }

  static async set(data: GraphData): Promise<void> {
    try {
      const entry: CacheEntry = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
    } catch (error) {
      console.error('Failed to write to cache:', error);
    }
  }

  static async clear(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }
}