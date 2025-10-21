import { useState, useEffect, useCallback } from 'react';

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'numeric' | 'text';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  timeLimit?: number; // em minutos
  passingScore: number; // porcentagem
  xpReward: number;
  isUnlocked: boolean;
  prerequisites: string[];
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  answers: Record<string, string | number>;
  passed: boolean;
  xpEarned: number;
  completedAt: Date;
}

export interface AssessmentState {
  currentQuiz: Quiz | null;
  availableQuizzes: Quiz[];
  completedQuizzes: QuizResult[];
  currentQuestion: number;
  answers: Record<string, string | number>;
  timeRemaining: number;
  isLoading: boolean;
  showResults: boolean;
  lastResult: QuizResult | null;
}

// Mock data para quizzes brasileiros de educação financeira
const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-orcamento-basico',
    title: 'Orçamento Pessoal - Básico',
    description: 'Teste seus conhecimentos sobre orçamento pessoal',
    category: 'basics',
    difficulty: 'easy',
    timeLimit: 10,
    passingScore: 70,
    xpReward: 150,
    isUnlocked: true,
    prerequisites: [],
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Qual é a regra básica para um orçamento equilibrado?',
        options: [
          'Gastar mais do que se ganha',
          'Gastar exatamente o que se ganha',
          'Gastar menos do que se ganha',
          'Não controlar os gastos'
        ],
        correctAnswer: 'Gastar menos do que se ganha',
        explanation: 'Para ter um orçamento equilibrado, é fundamental gastar menos do que se ganha, permitindo formar uma reserva de emergência.',
        difficulty: 'easy',
        category: 'basics',
        points: 10
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'Qual porcentagem da renda é recomendada para a reserva de emergência mensal?',
        options: ['5%', '10%', '15%', '20%'],
        correctAnswer: '10%',
        explanation: 'É recomendado reservar pelo menos 10% da renda mensal para formar a reserva de emergência.',
        difficulty: 'easy',
        category: 'basics',
        points: 10
      },
      {
        id: 'q3',
        type: 'true-false',
        question: 'É importante anotar todos os gastos, mesmo os pequenos.',
        options: ['Verdadeiro', 'Falso'],
        correctAnswer: 'Verdadeiro',
        explanation: 'Anotar todos os gastos, incluindo os pequenos, ajuda a ter uma visão completa de onde o dinheiro está sendo gasto.',
        difficulty: 'easy',
        category: 'basics',
        points: 10
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        question: 'Qual é o primeiro passo para criar um orçamento?',
        options: [
          'Definir metas de gastos',
          'Listar todas as receitas',
          'Cortar gastos desnecessários',
          'Investir o dinheiro'
        ],
        correctAnswer: 'Listar todas as receitas',
        explanation: 'O primeiro passo é conhecer exatamente quanto dinheiro entra mensalmente.',
        difficulty: 'easy',
        category: 'basics',
        points: 10
      },
      {
        id: 'q5',
        type: 'numeric',
        question: 'Se sua renda mensal é R$ 3.000 e você quer poupar 20%, quanto deve reservar?',
        correctAnswer: 600,
        explanation: '20% de R$ 3.000 = R$ 600. É importante calcular corretamente as porcentagens para planejar adequadamente.',
        difficulty: 'medium',
        category: 'basics',
        points: 15
      }
    ]
  },
  {
    id: 'quiz-investimentos-iniciantes',
    title: 'Investimentos para Iniciantes',
    description: 'Avalie seus conhecimentos sobre investimentos básicos',
    category: 'investments',
    difficulty: 'medium',
    timeLimit: 15,
    passingScore: 75,
    xpReward: 200,
    isUnlocked: true,
    prerequisites: ['quiz-orcamento-basico'],
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'O que é liquidez em investimentos?',
        options: [
          'A rentabilidade do investimento',
          'O risco do investimento',
          'A facilidade de converter o investimento em dinheiro',
          'O valor mínimo para investir'
        ],
        correctAnswer: 'A facilidade de converter o investimento em dinheiro',
        explanation: 'Liquidez refere-se à facilidade e rapidez com que um investimento pode ser convertido em dinheiro.',
        difficulty: 'medium',
        category: 'investments',
        points: 15
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'Qual é considerado o investimento mais seguro no Brasil?',
        options: ['Ações', 'Tesouro Direto', 'Criptomoedas', 'Fundos de ações'],
        correctAnswer: 'Tesouro Direto',
        explanation: 'O Tesouro Direto é considerado o investimento mais seguro pois é garantido pelo governo federal.',
        difficulty: 'easy',
        category: 'investments',
        points: 10
      },
      {
        id: 'q3',
        type: 'true-false',
        question: 'Diversificar investimentos ajuda a reduzir riscos.',
        options: ['Verdadeiro', 'Falso'],
        correctAnswer: 'Verdadeiro',
        explanation: 'A diversificação é uma estratégia fundamental para reduzir riscos, distribuindo investimentos em diferentes ativos.',
        difficulty: 'easy',
        category: 'investments',
        points: 10
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        question: 'O que significa CDI?',
        options: [
          'Certificado de Depósito Interbancário',
          'Conta de Depósito Individual',
          'Certificado de Dívida Interna',
          'Conta de Depósito Imediato'
        ],
        correctAnswer: 'Certificado de Depósito Interbancário',
        explanation: 'CDI é o Certificado de Depósito Interbancário, uma taxa de referência muito importante no mercado financeiro brasileiro.',
        difficulty: 'medium',
        category: 'investments',
        points: 15
      },
      {
        id: 'q5',
        type: 'numeric',
        question: 'Se um investimento rende 100% do CDI e o CDI está em 10% ao ano, qual é o rendimento anual?',
        correctAnswer: 10,
        explanation: '100% do CDI significa que o investimento rende exatamente a taxa CDI, ou seja, 10% ao ano.',
        difficulty: 'medium',
        category: 'investments',
        points: 20
      }
    ]
  },
  {
    id: 'quiz-credito-financiamento',
    title: 'Crédito e Financiamentos',
    description: 'Teste seus conhecimentos sobre crédito e financiamentos',
    category: 'credit',
    difficulty: 'medium',
    timeLimit: 12,
    passingScore: 70,
    xpReward: 180,
    isUnlocked: true,
    prerequisites: ['quiz-orcamento-basico'],
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'O que é score de crédito?',
        options: [
          'O valor máximo que posso emprestar',
          'Uma pontuação que indica meu risco de crédito',
          'O número da minha conta bancária',
          'A taxa de juros que vou pagar'
        ],
        correctAnswer: 'Uma pontuação que indica meu risco de crédito',
        explanation: 'O score de crédito é uma pontuação que indica a probabilidade de você pagar suas contas em dia.',
        difficulty: 'easy',
        category: 'credit',
        points: 10
      },
      {
        id: 'q2',
        type: 'true-false',
        question: 'Pagar contas em atraso prejudica o score de crédito.',
        options: ['Verdadeiro', 'Falso'],
        correctAnswer: 'Verdadeiro',
        explanation: 'Atrasos no pagamento de contas são registrados nos órgãos de proteção ao crédito e prejudicam o score.',
        difficulty: 'easy',
        category: 'credit',
        points: 10
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'Qual é a melhor estratégia para usar o cartão de crédito?',
        options: [
          'Usar sempre o limite máximo',
          'Pagar apenas o valor mínimo',
          'Pagar a fatura integral até o vencimento',
          'Usar apenas para emergências'
        ],
        correctAnswer: 'Pagar a fatura integral até o vencimento',
        explanation: 'Pagar a fatura integral evita juros altos e mantém um bom histórico de crédito.',
        difficulty: 'easy',
        category: 'credit',
        points: 10
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        question: 'No financiamento imobiliário, o que é entrada?',
        options: [
          'O valor total do imóvel',
          'O valor pago à vista no momento da compra',
          'A primeira parcela do financiamento',
          'A taxa de juros do financiamento'
        ],
        correctAnswer: 'O valor pago à vista no momento da compra',
        explanation: 'A entrada é o valor pago à vista no momento da compra, reduzindo o valor a ser financiado.',
        difficulty: 'medium',
        category: 'credit',
        points: 15
      },
      {
        id: 'q5',
        type: 'numeric',
        question: 'Se um imóvel custa R$ 300.000 e você dá 30% de entrada, quanto será financiado?',
        correctAnswer: 210000,
        explanation: '30% de R$ 300.000 = R$ 90.000 (entrada). Valor financiado = R$ 300.000 - R$ 90.000 = R$ 210.000.',
        difficulty: 'medium',
        category: 'credit',
        points: 20
      }
    ]
  }
];

export const useAssessment = () => {
  const [state, setState] = useState<AssessmentState>({
    currentQuiz: null,
    availableQuizzes: mockQuizzes,
    completedQuizzes: [],
    currentQuestion: 0,
    answers: {},
    timeRemaining: 0,
    isLoading: false,
    showResults: false,
    lastResult: null
  });

  // Carregar dados salvos
  useEffect(() => {
    const savedResults = localStorage.getItem('quiz-results');
    if (savedResults) {
      try {
        const completedQuizzes = JSON.parse(savedResults);
        setState(prev => ({ ...prev, completedQuizzes }));
      } catch (error) {
        console.error('Erro ao carregar resultados dos quizzes:', error);
      }
    }
  }, []);

  // Timer para quiz com tempo limite
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (state.currentQuiz && state.timeRemaining > 0) {
      timer = setInterval(() => {
        setState(prev => {
          if (prev.timeRemaining <= 1) {
            // Tempo esgotado, finalizar quiz
            finishQuiz();
            return { ...prev, timeRemaining: 0 };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state.currentQuiz, state.timeRemaining]);

  // Iniciar quiz
  const startQuiz = useCallback((quizId: string) => {
    const quiz = state.availableQuizzes.find(q => q.id === quizId);
    if (!quiz || !quiz.isUnlocked) return;

    setState(prev => ({
      ...prev,
      currentQuiz: quiz,
      currentQuestion: 0,
      answers: {},
      timeRemaining: quiz.timeLimit ? quiz.timeLimit * 60 : 0,
      showResults: false,
      lastResult: null
    }));
  }, [state.availableQuizzes]);

  // Responder pergunta
  const answerQuestion = useCallback((questionId: string, answer: string | number) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
      }
    }));
  }, []);

  // Próxima pergunta
  const nextQuestion = useCallback(() => {
    setState(prev => {
      if (!prev.currentQuiz) return prev;
      
      const nextIndex = prev.currentQuestion + 1;
      if (nextIndex >= prev.currentQuiz.questions.length) {
        // Última pergunta, finalizar quiz
        finishQuiz();
        return prev;
      }
      
      return {
        ...prev,
        currentQuestion: nextIndex
      };
    });
  }, []);

  // Pergunta anterior
  const previousQuestion = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentQuestion: Math.max(0, prev.currentQuestion - 1)
    }));
  }, []);

  // Finalizar quiz
  const finishQuiz = useCallback(() => {
    if (!state.currentQuiz) return;

    const quiz = state.currentQuiz;
    const answers = state.answers;
    
    // Calcular resultado
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    quiz.questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      
      if (userAnswer !== undefined) {
        const isCorrect = userAnswer.toString().toLowerCase() === 
                         question.correctAnswer.toString().toLowerCase();
        if (isCorrect) {
          correctAnswers++;
          earnedPoints += question.points;
        }
      }
    });

    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const passed = score >= quiz.passingScore;
    const xpEarned = passed ? quiz.xpReward : Math.floor(quiz.xpReward * 0.5);

    const result: QuizResult = {
      quizId: quiz.id,
      score: Math.round(score),
      totalQuestions: quiz.questions.length,
      correctAnswers,
      timeSpent: quiz.timeLimit ? (quiz.timeLimit * 60 - state.timeRemaining) : 0,
      answers,
      passed,
      xpEarned,
      completedAt: new Date()
    };

    // Salvar resultado
    const updatedResults = [...state.completedQuizzes, result];
    localStorage.setItem('quiz-results', JSON.stringify(updatedResults));

    setState(prev => ({
      ...prev,
      completedQuizzes: updatedResults,
      showResults: true,
      lastResult: result,
      currentQuiz: null,
      timeRemaining: 0
    }));

    return result;
  }, [state.currentQuiz, state.answers, state.timeRemaining, state.completedQuizzes]);

  // Sair do quiz
  const exitQuiz = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentQuiz: null,
      currentQuestion: 0,
      answers: {},
      timeRemaining: 0,
      showResults: false
    }));
  }, []);

  // Fechar resultados
  const closeResults = useCallback(() => {
    setState(prev => ({
      ...prev,
      showResults: false,
      lastResult: null
    }));
  }, []);

  // Verificar se quiz foi completado
  const isQuizCompleted = useCallback((quizId: string): boolean => {
    return state.completedQuizzes.some(result => 
      result.quizId === quizId && result.passed
    );
  }, [state.completedQuizzes]);

  // Obter melhor resultado de um quiz
  const getBestResult = useCallback((quizId: string): QuizResult | null => {
    const results = state.completedQuizzes.filter(r => r.quizId === quizId);
    if (results.length === 0) return null;
    
    return results.reduce((best, current) => 
      current.score > best.score ? current : best
    );
  }, [state.completedQuizzes]);

  // Estatísticas gerais
  const getStats = useCallback(() => {
    const totalQuizzes = state.availableQuizzes.length;
    const completedQuizzes = new Set(
      state.completedQuizzes
        .filter(r => r.passed)
        .map(r => r.quizId)
    ).size;
    
    const totalXP = state.completedQuizzes
      .filter(r => r.passed)
      .reduce((sum, r) => sum + r.xpEarned, 0);
    
    const averageScore = state.completedQuizzes.length > 0
      ? state.completedQuizzes.reduce((sum, r) => sum + r.score, 0) / state.completedQuizzes.length
      : 0;

    return {
      totalQuizzes,
      completedQuizzes,
      completionRate: totalQuizzes > 0 ? (completedQuizzes / totalQuizzes) * 100 : 0,
      totalXP,
      averageScore: Math.round(averageScore)
    };
  }, [state.availableQuizzes, state.completedQuizzes]);

  // Resetar progresso (para desenvolvimento)
  const resetProgress = useCallback(() => {
    localStorage.removeItem('quiz-results');
    setState(prev => ({
      ...prev,
      completedQuizzes: [],
      currentQuiz: null,
      showResults: false,
      lastResult: null
    }));
  }, []);

  return {
    ...state,
    startQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    finishQuiz,
    exitQuiz,
    closeResults,
    isQuizCompleted,
    getBestResult,
    getStats,
    resetProgress
  };
};