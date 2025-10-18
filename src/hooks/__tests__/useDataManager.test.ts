import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDataManager } from '../useDataManager';

// Mock do localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('useDataManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useDataManager());
    
    expect(result.current.profiles).toEqual([]);
    expect(result.current.currentProfile).toBeNull();
    expect(result.current.backups).toEqual([]);
  });

  it('should create a new profile', () => {
    const { result } = renderHook(() => useDataManager());
    
    act(() => {
      result.current.createProfile('Test Profile');
    });
    
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('should handle localStorage errors gracefully', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('Storage error');
    });

    const { result } = renderHook(() => useDataManager());
    
    expect(result.current.profiles).toEqual([]);
    expect(result.current.currentProfile).toBeNull();
  });
});