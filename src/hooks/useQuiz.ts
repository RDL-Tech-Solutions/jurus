import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Quiz, 
  Question, 
  QuestionAnswer, 
  QuizResult,
  QuestionResult
} from '../types/educacaoFinanceira';

interface QuizState {
  quiz: Quiz | null;
  currentQuestionIndex: number;
  answers: Map<string, QuestionAnswer>;
  flaggedQuestions: Set<string>;
  timeRemaining: number;
  isActive: boolean;
  isReviewMode: boolean;
  isCompleted: boolean;
  result: QuizResult | null;
  startTime: Date | null;
}

interface QuizOptions {
  autoSubmit?: boolean;
  allowReview?: boolean;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  showProgress?: boolean;
  enableTimer?: boolean;
}

export const useQuiz = (initialQuiz?: Quiz, options: QuizOptions = {}) => {
  const {
    autoSubmit = true,
    allowReview = true,
    shuffleQuestions = false,
    shuffleOptions = false,
    showProgress = true,
    enableTimer = true
  } = options;

  const [state, setState] = useState<QuizState>({
    quiz: null,
    currentQuestionIndex: 0,
    answers: new Map(),
    flaggedQuestions: new Set(),
    timeRemaining: 0,
    isActive: false,
    isReviewMode: false,
    isCompleted: false,
    result: null,
    startTime: null
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTimeRef = useRef<Date | null>(null);

  // Initialize quiz
  const initializeQuiz = useCallback((quiz: Quiz) => {
    let processedQuiz = { ...quiz };

    // Shuffle questions if enabled
    if (shuffleQuestions) {
      processedQuiz.questions = [...quiz.questions].sort(() => Math.random() - 0.5);
    }

    // Shuffle options if enabled
    if (shuffleOptions) {
      processedQuiz.questions = processedQuiz.questions.map(question => {
        if (question.options && (question.type === 'multiple_choice' || question.type === 'multiple_select')) {
          return {
            ...question,
            options: [...question.options].sort(() => Math.random() - 0.5)
          };
        }
        return question;
      });
    }

    setState({
      quiz: processedQuiz,
      currentQuestionIndex: 0,
      answers: new Map(),
      flaggedQuestions: new Set(),
      timeRemaining: enableTimer ? (quiz.timeLimit || 30) * 60 : 0,
      isActive: false,
      isReviewMode: false,
      isCompleted: false,
      result: null,
      startTime: null
    });
  }, [shuffleQuestions, shuffleOptions, enableTimer]);

  // Start quiz
  const startQuiz = useCallback(() => {
    if (!state.quiz) return;

    setState(prev => ({
      ...prev,
      isActive: true,
      startTime: new Date()
    }));

    questionStartTimeRef.current = new Date();

    // Start timer if enabled
    if (enableTimer && state.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setState(prev => {
          if (prev.timeRemaining <= 1) {
            // Time's up - auto submit if enabled
            if (autoSubmit) {
              setTimeout(() => submitQuiz(), 100);
            }
            return { ...prev, timeRemaining: 0, isActive: false };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }
  }, [state.quiz, state.timeRemaining, enableTimer, autoSubmit]);

  // Submit answer for current question
  const submitAnswer = useCallback((answer: any) => {
    if (!state.quiz || !state.isActive || state.isCompleted) return;

    const currentQuestion = state.quiz.questions[state.currentQuestionIndex];
    if (!currentQuestion) return;

    const timeSpent = questionStartTimeRef.current 
      ? Math.floor((new Date().getTime() - questionStartTimeRef.current.getTime()) / 1000)
      : 0;

    const questionAnswer: QuestionAnswer = {
      value: answer,
      type: currentQuestion.type
    };

    setState(prev => {
      const newAnswers = new Map(prev.answers);
      newAnswers.set(currentQuestion.id, questionAnswer);
      return { ...prev, answers: newAnswers };
    });

    // Reset question timer
    questionStartTimeRef.current = new Date();
  }, [state.quiz, state.currentQuestionIndex, state.isActive, state.isCompleted]);

  // Navigate to specific question
  const goToQuestion = useCallback((index: number) => {
    if (!state.quiz || index < 0 || index >= state.quiz.questions.length) return;

    setState(prev => ({ ...prev, currentQuestionIndex: index }));
    questionStartTimeRef.current = new Date();
  }, [state.quiz]);

  // Navigate to next question
  const nextQuestion = useCallback(() => {
    if (!state.quiz) return;
    
    const nextIndex = state.currentQuestionIndex + 1;
    if (nextIndex < state.quiz.questions.length) {
      goToQuestion(nextIndex);
    }
  }, [state.quiz, state.currentQuestionIndex, goToQuestion]);

  // Navigate to previous question
  const previousQuestion = useCallback(() => {
    const prevIndex = state.currentQuestionIndex - 1;
    if (prevIndex >= 0) {
      goToQuestion(prevIndex);
    }
  }, [state.currentQuestionIndex, goToQuestion]);

  // Toggle question flag
  const toggleFlag = useCallback((questionId?: string) => {
    if (!state.quiz) return;

    const targetQuestionId = questionId || state.quiz.questions[state.currentQuestionIndex]?.id;
    if (!targetQuestionId) return;

    setState(prev => {
      const newFlagged = new Set(prev.flaggedQuestions);
      if (newFlagged.has(targetQuestionId)) {
        newFlagged.delete(targetQuestionId);
      } else {
        newFlagged.add(targetQuestionId);
      }
      return { ...prev, flaggedQuestions: newFlagged };
    });
  }, [state.quiz, state.currentQuestionIndex]);

  // Check if answer is correct
  const checkAnswer = useCallback((question: Question, userAnswer?: QuestionAnswer): boolean => {
    if (!userAnswer || userAnswer.value === null || userAnswer.value === undefined) {
      return false;
    }

    switch (question.type) {
      case 'multiple_choice':
        return userAnswer.value === question.correctAnswer.value;
      
      case 'multiple_select':
        if (!Array.isArray(userAnswer.value) || !Array.isArray(question.correctAnswer.value)) {
          return false;
        }
        const userAnswers = [...(userAnswer.value as string[])].sort();
        const correctAnswers = [...(question.correctAnswer.value as string[])].sort();
        return userAnswers.length === correctAnswers.length && 
               userAnswers.every((answer, index) => answer === correctAnswers[index]);
      
      case 'true_false':
        return userAnswer.value === question.correctAnswer.value;
      
      case 'numeric':
        const userNum = parseFloat(userAnswer.value.toString());
        const correctNum = parseFloat(question.correctAnswer.value?.toString() || '0');
        const tolerance = question.tolerance || 0.01;
        return Math.abs(userNum - correctNum) <= tolerance;
      
      case 'text':
        const userText = userAnswer.value.toString().toLowerCase().trim();
        const correctText = question.correctAnswer.value?.toString().toLowerCase().trim() || '';
        return userText === correctText;
      
      default:
        return false;
    }
  }, []);

  // Calculate quiz result
  const calculateResult = useCallback((): QuizResult | null => {
    if (!state.quiz || !state.startTime) return null;

    const endTime = new Date();
    const timeSpent = Math.floor((endTime.getTime() - state.startTime.getTime()) / 1000);

    const questionResults: QuestionResult[] = state.quiz.questions.map(question => {
      const userAnswer = state.answers.get(question.id);
      const isCorrect = checkAnswer(question, userAnswer);
      const points = isCorrect ? question.points : 0;

      return {
        questionId: question.id,
        answer: userAnswer?.value || null,
        value: userAnswer?.value || '',
        type: userAnswer?.type,
        isCorrect,
        timeSpent: 0 // We'll need to track this separately if needed
      };
    });

    const totalPoints = questionResults.reduce((sum, result) => {
      const question = state.quiz.questions.find(q => q.id === result.questionId);
      return sum + (result.isCorrect ? (question?.points || 0) : 0);
    }, 0);
    const maxPoints = state.quiz.questions.reduce((sum, question) => sum + question.points, 0);
    const correctAnswers = questionResults.filter(result => result.isCorrect).length;
    const score = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;
    const passed = score >= state.quiz.passingScore;

    // Create question result summaries for the QuizResult
    const questionResultSummaries = state.quiz.questions.map((question) => {
      const userAnswer = state.answers.get(question.id);
      const isCorrect = userAnswer ? checkAnswer(question, userAnswer) : false;
      const points = isCorrect ? question.points : 0;
      
      return {
        questionId: question.id,
        isCorrect,
        userAnswer: userAnswer || { value: '', type: question.type },
        correctAnswer: question.correctAnswer,
        points
      };
    });

    return {
      id: `result_${Date.now()}`,
      quizId: state.quiz.id,
      userId: 'default',
      score,
      totalPoints,
      maxPoints,
      correctAnswers,
      totalQuestions: state.quiz.questions.length,
      timeSpent,
      passed,
      completedAt: endTime,
      answers: questionResults,
      questionResults: questionResultSummaries
    };
  }, [state.quiz, state.startTime, state.answers, checkAnswer]);

  // Submit quiz
  const submitQuiz = useCallback(() => {
    if (!state.quiz || state.isCompleted) return null;

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const result = calculateResult();
    
    setState(prev => ({
      ...prev,
      isActive: false,
      isCompleted: true,
      result
    }));

    return result;
  }, [state.quiz, state.isCompleted, calculateResult]);

  // Enter review mode
  const enterReviewMode = useCallback(() => {
    if (!allowReview || !state.isCompleted) return;

    setState(prev => ({
      ...prev,
      isReviewMode: true,
      currentQuestionIndex: 0
    }));
  }, [allowReview, state.isCompleted]);

  // Exit review mode
  const exitReviewMode = useCallback(() => {
    setState(prev => ({ ...prev, isReviewMode: false }));
  }, []);

  // Reset quiz
  const resetQuiz = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (state.quiz) {
      initializeQuiz(state.quiz);
    }
  }, [state.quiz, initializeQuiz]);

  // Utility functions
  const getCurrentQuestion = useCallback((): Question | null => {
    if (!state.quiz || state.currentQuestionIndex >= state.quiz.questions.length) {
      return null;
    }
    return state.quiz.questions[state.currentQuestionIndex];
  }, [state.quiz, state.currentQuestionIndex]);

  const getProgress = useCallback((): number => {
    if (!state.quiz) return 0;
    return ((state.currentQuestionIndex + 1) / state.quiz.questions.length) * 100;
  }, [state.quiz, state.currentQuestionIndex]);

  const getAnsweredCount = useCallback((): number => {
    return state.answers.size;
  }, [state.answers]);

  const isQuestionAnswered = useCallback((questionId?: string): boolean => {
    const targetQuestionId = questionId || getCurrentQuestion()?.id;
    return targetQuestionId ? state.answers.has(targetQuestionId) : false;
  }, [state.answers, getCurrentQuestion]);

  const getQuestionAnswer = useCallback((questionId?: string): QuestionAnswer | undefined => {
    const targetQuestionId = questionId || getCurrentQuestion()?.id;
    return targetQuestionId ? state.answers.get(targetQuestionId) : undefined;
  }, [state.answers, getCurrentQuestion]);

  const isQuestionFlagged = useCallback((questionId?: string): boolean => {
    const targetQuestionId = questionId || getCurrentQuestion()?.id;
    return targetQuestionId ? state.flaggedQuestions.has(targetQuestionId) : false;
  }, [state.flaggedQuestions, getCurrentQuestion]);

  const canSubmit = useCallback((): boolean => {
    if (!state.quiz || !state.isActive) return false;
    
    // Check if all questions are answered (optional requirement)
    return state.answers.size >= state.quiz.questions.length;
  }, [state.quiz, state.isActive, state.answers]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Initialize with initial quiz if provided
  useEffect(() => {
    if (initialQuiz) {
      initializeQuiz(initialQuiz);
    }
  }, [initialQuiz, initializeQuiz]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    // State
    quiz: state.quiz,
    currentQuestionIndex: state.currentQuestionIndex,
    timeRemaining: state.timeRemaining,
    isActive: state.isActive,
    isReviewMode: state.isReviewMode,
    isCompleted: state.isCompleted,
    result: state.result,

    // Actions
    initializeQuiz,
    startQuiz,
    submitAnswer,
    submitQuiz,
    resetQuiz,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    toggleFlag,
    enterReviewMode,
    exitReviewMode,

    // Utilities
    getCurrentQuestion,
    getProgress,
    getAnsweredCount,
    isQuestionAnswered,
    getQuestionAnswer,
    isQuestionFlagged,
    canSubmit,
    formatTime,
    checkAnswer,

    // Computed values
    totalQuestions: state.quiz?.questions.length || 0,
    hasNext: state.quiz ? state.currentQuestionIndex < state.quiz.questions.length - 1 : false,
    hasPrevious: state.currentQuestionIndex > 0,
    flaggedCount: state.flaggedQuestions.size,
    answeredCount: state.answers.size
  };
};