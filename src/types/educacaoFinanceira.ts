// Tipos para a página de Educação Financeira

// Configuração do Simulador 50-30-20
export interface SimuladorConfig {
  necessidades: number; // Percentual para necessidades
  desejos: number; // Percentual para desejos  
  poupanca: number; // Percentual para poupança
  isCustom?: boolean; // Se está usando configuração personalizada
  customCategories?: Array<{
    name: string;
    percentage: number;
    color: string;
  }>;
  lastSalary?: number; // Último salário informado
  updatedAt?: string;
}

// Histórico de simulações do Cofrinho
export interface CofrinhoHistory {
  simulations: Array<{
    id: string;
    valorInicial: number;
    meses: number;
    tempoMeses: number;
    aporteMensal: number;
    valorFinal: number;
    ganhoTotal: number;
    cdiConfig: CDIConfig;
    resultado: CofrinhoResult;
    createdAt: string;
  }>;
}

// Progresso de quitação de dívidas
export interface DebtProgress {
  id: string;
  valorInicial: number;
  valorAtual: number;
  dataInicio: string;
  dataQuitacao?: string;
  tempoEstimado: number;
  valorMensal: number;
  ultimoPagamento?: string;
  estrategia: DebtStrategy;
  createdAt: string;
}

// Progresso educacional do usuário
export interface EducationProgress {
  userId?: string;
  completedSections: string[];
  totalTimeSpent: number;
  lastAccessed: string;
}

// Configurações de tema e preferências
export interface EducationPreferences {
  theme: 'light' | 'dark';
  animations: boolean;
  notifications: boolean;
  autoSave: boolean;
}

// === NOVOS TIPOS PARA EXPANSÃO ===

// Tipos básicos
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'basic' | 'intermediate' | 'advanced' | 'beginner';
export type ContentType = 'article' | 'video' | 'interactive' | 'calculator' | 'quiz' | 'podcast';
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type QuestionType = 'multiple_choice' | 'multiple_select' | 'true_false' | 'text' | 'numeric' | 'drag_drop';

// Sistema de Gamificação
export interface UserProgress {
  id: string;
  xp: number;
  level: number;
  completedModules: string[];
  completedTracks: string[];
  completedQuizzes: string[];
  badges: Badge[];
  certificates: Certificate[];
  streakDays: number;
  currentTrack?: string;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  condition?: AchievementCondition;
  unlockedAt?: Date;
  category: 'progress' | 'activity' | 'special' | 'seasonal';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  condition: AchievementCondition;
  xpReward: number;
  badge?: Badge;
  isSecret?: boolean;
}

export interface AchievementCondition {
  type: 'modules_completed' | 'xp_earned' | 'streak_days' | 'quiz_score' | 'time_spent';
  target: number;
  operator: 'gte' | 'lte' | 'eq';
}

// Sistema de Aprendizado
export interface LearningTrack {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedTime: number; // em minutos
  modules: Module[];
  prerequisites: string[];
  xpReward: number;
  badge?: Badge;
  category: 'basics' | 'investments' | 'planning' | 'entrepreneurship' | 'retirement' | 'credit' | 'business';
  isLocked?: boolean;
  isCompleted?: boolean;
  isUnlocked?: boolean;
  progress?: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  content: Content[] | string;
  quiz?: Quiz;
  estimatedTime: number;
  xpReward: number;
  order: number;
  isCompleted?: boolean;
  progress?: number;
}

export interface Content {
  id: string;
  type: ContentType;
  title: string;
  description?: string;
  content?: string;
  url?: string;
  duration?: number;
  xpReward?: number;
  data: any; // Específico para cada tipo de conteúdo
  estimatedTime: number;
  isCompleted?: boolean;
}

// Sistema de Avaliação
export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number; // em minutos
  passingScore: number; // porcentagem
  xpReward: number;
  attempts?: number;
  maxAttempts?: number;
}

export interface Question {
  id: string;
  text?: string; // Made optional for backward compatibility
  title: string;
  description?: string;
  image?: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  options?: QuestionOption[];
  correctAnswer: QuestionAnswer;
  explanation?: string;
  hint?: string;
  tolerance?: number;
  unit?: string;
  points: number;
  timeLimit?: number;
  tags?: string[];
}

export interface QuestionOption {
  id?: string;
  value: string;
  text: string;
  explanation?: string;
  isCorrect?: boolean;
}

export interface QuestionAnswer {
  value: string | number | string[];
  type?: QuestionType;
}

export interface QuestionResult {
  questionId: string;
  answer: any;
  value: string | number | string[];
  type?: QuestionType;
  isCorrect: boolean;
  timeSpent: number;
}

export interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  totalPoints: number;
  maxPoints: number;
  timeSpent: number;
  answers: QuestionResult[];
  questionResults: QuestionResultSummary[];
  completedAt: Date;
  passed: boolean;
}

export interface QuestionResultSummary {
  questionId: string;
  isCorrect: boolean;
  userAnswer: QuestionAnswer;
  correctAnswer: QuestionAnswer;
  points: number;
}

// Sistema de Certificação
export interface Certificate {
  id: string;
  title: string;
  description: string;
  trackId?: string;
  moduleId?: string;
  userId: string;
  issuedAt: Date;
  verificationCode: string;
  template: CertificateTemplate;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  background: string;
  layout: 'modern' | 'classic' | 'minimal';
  colors: {
    primary: string;
    secondary: string;
    text: string;
  };
}

// Calculadoras Avançadas
export interface CalculatorConfig {
  id: string;
  type: 'retirement' | 'loan' | 'investment' | 'comparison';
  title: string;
  description: string;
  inputs: CalculatorInput[];
  outputs: CalculatorOutput[];
}

export interface CalculatorInput {
  id: string;
  label: string;
  type: 'number' | 'percentage' | 'currency' | 'date' | 'select';
  required: boolean;
  defaultValue?: any;
  validation?: ValidationRule[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface CalculatorOutput {
  id: string;
  label: string;
  type: 'currency' | 'percentage' | 'number' | 'text' | 'chart';
  format?: string;
}

export interface ValidationRule {
  type: 'min' | 'max' | 'required' | 'pattern';
  value: any;
  message: string;
}

// Biblioteca de Conteúdo
export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: Date;
  readTime: number;
  category: string;
  tags: string[];
  difficulty: DifficultyLevel;
  isFavorite?: boolean;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number;
  category: string;
  difficulty: DifficultyLevel;
  transcript?: string;
  watchProgress?: number;
}

export interface Podcast {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  publishedAt: Date;
  category: string;
  transcript?: string;
  playProgress?: number;
}

// Comparador de Produtos
export interface FinancialProduct {
  id: string;
  name: string;
  type: 'investment' | 'credit_card' | 'bank_account' | 'insurance' | 'loan';
  provider: string;
  features: Record<string, any>;
  rates: {
    annual?: number;
    monthly?: number;
    fees?: number[];
  };
  pros: string[];
  cons: string[];
  rating: number;
  updatedAt: Date;
}

export interface ProductComparison {
  id: string;
  products: FinancialProduct[];
  criteria: ComparisonCriteria[];
  createdAt: Date;
}

export interface ComparisonCriteria {
  id: string;
  name: string;
  weight: number;
  type: 'higher_better' | 'lower_better' | 'boolean';
}

// === TIPOS EXISTENTES ===

// Resultado do cálculo do cofrinho
export interface CofrinhoResult {
  valorFinal: number;
  ganhoTotal: number;
  rendimentoMensal: number;
  totalInvestido: number;
  taxaEfetiva: number;
  meses: number;
  crescimentoMensal: Array<{
    mes: number;
    valor: number;
    ganho?: number;
    totalInvestido?: number;
  }>;
}

// Resultado do cálculo de dívidas
export interface DebtResult {
  mesesParaQuitar: number;
  valorMensalRecomendado: number;
  estrategiaRecomendada: string;
  totalJuros: number;
  percentualRenda: number;
  progressoMensal: Array<{
    mes: number;
    saldoRestante: number;
    valorPago: number;
  }>;
}

// Dados para o gráfico de pizza do simulador 50-30-20
export interface PieChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

// Configuração padrão do CDI para cálculos
export interface CDIConfig {
  cdiAnual: number; // 10.65% ao ano
  multiplicador: number; // 120% do CDI
  taxaMensal: number; // ~1.01% ao mês
}

// Estratégias de pagamento de dívidas
export interface DebtStrategy {
  id: 'bola-de-neve' | 'avalanche' | 'minimo';
  name: string;
  description: string;
  recommendedPercentage: number;
  icon: string;
  color: string;
}

// Card de educação financeira
export interface EducationCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  tips: string[];
  animation?: string;
}

// Seção da página de educação
export interface EducationSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  component: string;
  anchor: string;
}

// === CONSTANTES E CONFIGURAÇÕES ===

// LocalStorage Keys para Educação Financeira
export const EDUCATION_STORAGE_KEYS = {
  SIMULADOR_CONFIG: 'jurus:educacao:simulador-config',
  COFRINHO_HISTORY: 'jurus:educacao:cofrinho-history',
  DEBT_PROGRESS: 'jurus:educacao:debt-progress',
  EDUCATION_PROGRESS: 'jurus:educacao:progress',
  EDUCATION_PREFERENCES: 'jurus:educacao:preferences',
  // Novas chaves
  USER_PROGRESS: 'jurus:educacao:user-progress',
  BADGES: 'jurus:educacao:badges',
  QUIZ_RESULTS: 'jurus:educacao:quiz-results',
  CERTIFICATES: 'jurus:educacao:certificates',
  FAVORITES: 'jurus:educacao:favorites',
  LEARNING_TRACKS: 'jurus:educacao:learning-tracks'
} as const;

// Configuração padrão do simulador 50-30-20
export const DEFAULT_SIMULADOR_CONFIG: SimuladorConfig = {
  necessidades: 50,
  desejos: 30,
  poupanca: 20,
  customCategories: [],
  lastSalary: 0
};

// Configuração padrão do CDI
export const CDI_CONFIG: CDIConfig = {
  cdiAnual: 10.65, // 10.65% ao ano
  multiplicador: 1.20, // 120% do CDI
  taxaMensal: 0.0101 // ~1.01% ao mês
};

// Estratégias de pagamento de dívidas
export const DEBT_STRATEGIES: Record<string, DebtStrategy> = {
  'bola-de-neve': {
    id: 'bola-de-neve',
    name: 'Método Bola de Neve',
    description: 'Quite primeiro as menores dívidas',
    recommendedPercentage: 20,
    icon: 'Snowflake',
    color: '#3B82F6'
  },
  'avalanche': {
    id: 'avalanche',
    name: 'Método Avalanche', 
    description: 'Quite primeiro as dívidas com maiores juros',
    recommendedPercentage: 25,
    icon: 'Mountain',
    color: '#EF4444'
  },
  'minimo': {
    id: 'minimo',
    name: 'Pagamento Mínimo',
    description: 'Pague o mínimo e negocie condições',
    recommendedPercentage: 15,
    icon: 'DollarSign',
    color: '#10B981'
  }
};

// Sistema de XP e Níveis
export const XP_SYSTEM = {
  LEVEL_BASE: 1000, // XP base por nível
  LEVEL_MULTIPLIER: 1.2, // Multiplicador por nível
  ACTIVITIES: {
    MODULE_COMPLETION: {
      basic: 100,
      intermediate: 200,
      advanced: 300
    },
    QUIZ_COMPLETION: 50,
    QUIZ_PERFECT_SCORE: 100,
    DAILY_STREAK: 25,
    FIRST_CERTIFICATE: 500,
    TRACK_COMPLETION: 1000
  }
};

// Badges padrão do sistema
export const DEFAULT_BADGES: Badge[] = [
  {
    id: 'first-steps',
    name: 'Primeiros Passos',
    description: 'Complete seu primeiro módulo',
    icon: '👶',
    rarity: 'common',
    category: 'progress',
    condition: {
      type: 'modules_completed',
      target: 1,
      operator: 'gte'
    }
  },
  {
    id: 'quiz-master',
    name: 'Mestre dos Quizzes',
    description: 'Complete 10 quizzes com nota máxima',
    icon: '🧠',
    rarity: 'rare',
    category: 'activity',
    condition: {
      type: 'quiz_score',
      target: 10,
      operator: 'gte'
    }
  },
  {
    id: 'streak-warrior',
    name: 'Guerreiro da Consistência',
    description: 'Mantenha uma sequência de 30 dias',
    icon: '🔥',
    rarity: 'epic',
    category: 'activity',
    condition: {
      type: 'streak_days',
      target: 30,
      operator: 'gte'
    }
  },
  {
    id: 'financial-expert',
    name: 'Expert Financeiro',
    description: 'Complete todas as trilhas de aprendizado',
    icon: '🏆',
    rarity: 'legendary',
    category: 'special',
    condition: {
      type: 'modules_completed',
      target: 50,
      operator: 'gte'
    }
  }
];

// Cards de educação financeira
export const EDUCATION_CARDS: EducationCard[] = [
  {
    id: 'controle-gastos',
    title: 'Controle seus Gastos',
    description: 'Aprenda a monitorar e controlar seus gastos mensais para ter uma vida financeira mais saudável.',
    icon: 'TrendingDown',
    color: '#3B82F6',
    gradient: 'from-blue-400 to-blue-600',
    tips: [
      'Anote todos os gastos diários',
      'Use aplicativos de controle financeiro',
      'Revise seus gastos semanalmente',
      'Identifique gastos desnecessários'
    ]
  },
  {
    id: 'poupar-investir',
    title: 'Poupar vs Investir',
    description: 'Entenda a diferença entre poupar e investir, e como cada um pode ajudar seus objetivos financeiros.',
    icon: 'PiggyBank',
    color: '#10B981',
    gradient: 'from-green-400 to-green-600',
    tips: [
      'Poupança é para emergências',
      'Investimentos fazem o dinheiro crescer',
      'Diversifique seus investimentos',
      'Comece com pequenos valores'
    ]
  },
  {
    id: 'metas-financeiras',
    title: 'Defina suas Metas',
    description: 'Estabeleça objetivos financeiros claros e alcançáveis para manter o foco e a motivação.',
    icon: 'Target',
    color: '#F59E0B',
    gradient: 'from-yellow-400 to-orange-500',
    tips: [
      'Defina metas específicas e mensuráveis',
      'Estabeleça prazos realistas',
      'Divida metas grandes em pequenas',
      'Celebre cada conquista'
    ]
  }
];

// Seções da página de educação (expandidas)
export const EDUCATION_SECTIONS: EducationSection[] = [
  {
    id: 'educacao',
    title: 'Educação Financeira',
    description: 'Aprenda conceitos básicos de educação financeira',
    icon: 'GraduationCap',
    component: 'EducacaoAnimada',
    anchor: 'educacao'
  },
  {
    id: 'simulador',
    title: 'Simulador 50-30-20',
    description: 'Planeje seu orçamento com a regra 50-30-20',
    icon: 'ChartPie',
    component: 'Simulador5030',
    anchor: 'simulador'
  },
  {
    id: 'dividas',
    title: 'Soluções para Dívidas',
    description: 'Estratégias para quitar suas dívidas',
    icon: 'CreditCard',
    component: 'SolucoesDividas',
    anchor: 'dividas'
  },
  {
    id: 'cofrinho',
    title: 'Cofrinho Inteligente',
    description: 'Simule investimentos com rendimento CDI',
    icon: 'Coins',
    component: 'CofrinhoInteligente',
    anchor: 'cofrinho'
  }
];

// Trilhas de aprendizado padrão
export const DEFAULT_LEARNING_TRACKS: LearningTrack[] = [
  {
    id: 'basics',
    title: 'Fundamentos Financeiros',
    description: 'Aprenda os conceitos básicos de educação financeira',
    difficulty: 'basic',
    estimatedTime: 120,
    modules: [],
    prerequisites: [],
    xpReward: 500,
    category: 'basics'
  },
  {
    id: 'investments',
    title: 'Mundo dos Investimentos',
    description: 'Descubra como fazer seu dinheiro trabalhar para você',
    difficulty: 'intermediate',
    estimatedTime: 180,
    modules: [],
    prerequisites: ['basics'],
    xpReward: 750,
    category: 'investments'
  },
  {
    id: 'planning',
    title: 'Planejamento Financeiro',
    description: 'Organize suas finanças e planeje seu futuro',
    difficulty: 'intermediate',
    estimatedTime: 150,
    modules: [],
    prerequisites: ['basics'],
    xpReward: 650,
    category: 'planning'
  },
  {
    id: 'retirement',
    title: 'Aposentadoria Inteligente',
    description: 'Planeje sua aposentadoria com estratégias eficazes',
    difficulty: 'advanced',
    estimatedTime: 200,
    modules: [],
    prerequisites: ['basics', 'investments'],
    xpReward: 1000,
    category: 'retirement'
  }
];