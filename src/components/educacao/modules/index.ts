// Módulos de Educação Financeira
export { default as FundamentosEducacaoFinanceira } from './FundamentosEducacaoFinanceira';
export { default as OrcamentoPessoalFamiliar } from './OrcamentoPessoalFamiliar';
export { default as PoupancaReservaEmergencia } from './PoupancaReservaEmergencia';
export { default as InvestimentosBasicos } from './InvestimentosBasicos';
export { default as ControleDividas } from './ControleDividas';
export { default as PlanejamentoAposentadoria } from './PlanejamentoAposentadoria';

// Tipos e interfaces dos módulos
export interface ModuleContent {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  topics: string[];
  objectives: string[];
  prerequisites?: string[];
}

export interface ModuleSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'exercise' | 'quiz' | 'calculator' | 'checklist';
  interactive?: boolean;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

export interface QuizSet {
  id: string;
  title: string;
  questions: Quiz[];
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  steps: string[];
  solution?: string;
  tips: string[];
}

export interface Calculator {
  id: string;
  title: string;
  description: string;
  inputs: CalculatorInput[];
  formula: string;
}

export interface CalculatorInput {
  id: string;
  label: string;
  type: 'number' | 'percentage' | 'currency';
  placeholder: string;
  required: boolean;
}