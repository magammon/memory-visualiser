import { PerformanceMonitor, debounce } from '../performance';

describe('PerformanceMonitor', () => {
  test('measures execution time', () => {
    PerformanceMonitor.start('test');
    const duration = PerformanceMonitor.end('test');
    
    expect(duration).toBeGreaterThan(0);
  });

  test('warns on slow operations', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    PerformanceMonitor.start('slow');
    // Simulate slow operation
    setTimeout(() => {
      PerformanceMonitor.end('slow');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Slow operation detected')
      );
    }, 150);
  });
});

describe('debounce', () => {
  test('debounces function calls', (done) => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);
    
    debouncedFn();
    debouncedFn();
    debouncedFn();
    
    setTimeout(() => {
      expect(mockFn).toHaveBeenCalledTimes(1);
      done();
    }, 150);
  });
});