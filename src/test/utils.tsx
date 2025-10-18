import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
      <div ref={ref} {...props}>{children}</div>
    )),
    button: React.forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => (
      <button ref={ref} {...props}>{children}</button>
    )),
    span: React.forwardRef<HTMLSpanElement, any>(({ children, ...props }, ref) => (
      <span ref={ref} {...props}>{children}</span>
    )),
    p: React.forwardRef<HTMLParagraphElement, any>(({ children, ...props }, ref) => (
      <p ref={ref} {...props}>{children}</p>
    )),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  }),
  useInView: () => [React.createRef(), true],
}));

// Provider wrapper for tests
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

// Custom render function
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock localStorage
export const createMockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    length: 0,
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
};

// Mock user profile
export const createMockProfile = () => ({
  id: 'test-profile-1',
  name: 'Usuário Teste',
  email: 'teste@email.com',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Mock investment data
export const createMockInvestmentData = () => ({
  portfolios: [],
  transactions: [],
  goals: [],
  settings: {},
});

// Mock financial simulation
export const createMockFinancialSimulation = () => ({
  id: 'sim-1',
  nome: 'Simulação Teste',
  valorInicial: 1000,
  valorMensal: 100,
  prazoMeses: 12,
  taxaJuros: 0.01,
  tipo: 'juros_compostos' as const,
  dataCriacao: new Date().toISOString(),
});

// Mock simulation result
export const createMockSimulationResult = () => ({
  valorFinal: 2200,
  totalInvestido: 2200,
  totalJuros: 0,
  evolucaoMensal: Array.from({ length: 12 }, (_, i) => ({
    mes: i + 1,
    valorInvestido: 1000 + (i + 1) * 100,
    valorJuros: 0,
    valorTotal: 1000 + (i + 1) * 100,
  })),
});

// Re-export everything from testing library
export * from '@testing-library/react';
export { customRender as render };