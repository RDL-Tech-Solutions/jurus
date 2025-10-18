import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataManager } from '../DataManager';

// Mock do useDataManager
const mockUseDataManager = {
  profiles: [],
  currentProfile: null,
  createProfile: vi.fn(),
  switchProfile: vi.fn(),
  deleteProfile: vi.fn(),
  exportData: vi.fn(),
  importData: vi.fn(),
  createBackup: vi.fn(),
  restoreBackup: vi.fn(),
  deleteBackup: vi.fn(),
  backups: [],
};

vi.mock('../../hooks/useDataManager', () => ({
  useDataManager: () => mockUseDataManager,
}));

describe('DataManager', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render data manager modal', () => {
    render(<DataManager isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('Gerenciador de Dados')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<DataManager isOpen={false} onClose={mockOnClose} />);
    
    expect(screen.queryByText('Gerenciador de Dados')).not.toBeInTheDocument();
  });
});