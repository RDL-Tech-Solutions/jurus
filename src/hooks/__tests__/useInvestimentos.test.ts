import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInvestimentos } from '../useInvestimentos';

// Mock do useDataManager
const mockGetCurrentProfileData = vi.fn();
const mockSaveCurrentProfileData = vi.fn();

vi.mock('../useDataManager', () => ({
  useDataManager: () => ({
    getCurrentProfileData: mockGetCurrentProfileData,
    saveCurrentProfileData: mockSaveCurrentProfileData,
  }),
}));

describe('useInvestimentos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCurrentProfileData.mockReturnValue({
      portfolios: [],
      transactions: [],
    });
    mockSaveCurrentProfileData.mockImplementation(() => {});
  });

  it('should initialize with empty portfolios and transactions', () => {
    const { result } = renderHook(() => useInvestimentos());
    
    expect(result.current.portfolios).toEqual([]);
    expect(result.current.transacoes).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should create a new portfolio', async () => {
    const { result } = renderHook(() => useInvestimentos());
    
    await act(async () => {
      const portfolio = await result.current.criarPortfolio('Meu Portfolio', 'Descrição teste');
      expect(portfolio.nome).toBe('Meu Portfolio');
      expect(portfolio.descricao).toBe('Descrição teste');
      expect(portfolio.id).toBeDefined();
    });
    
    expect(mockSaveCurrentProfileData).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    mockSaveCurrentProfileData.mockImplementation(() => {
      throw new Error('Storage error');
    });

    const { result } = renderHook(() => useInvestimentos());
    
    await act(async () => {
      try {
        await result.current.criarPortfolio('Test Portfolio');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
    
    expect(result.current.error).toBe('Erro ao criar portfólio');
  });
});