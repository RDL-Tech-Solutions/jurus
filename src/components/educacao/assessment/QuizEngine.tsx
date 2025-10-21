import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Flag,
  RotateCcw,
  Trophy,
  Star
} from 'lucide-react';
import { Quiz, Question, QuestionAnswer, QuizResult, QuestionType } from '../../../types/educacaoFinanceira';
import QuestionCard from './QuestionCard';
import ResultsPanel from './ResultsPanel';

interface QuizEngineProps {
  quiz: Quiz;
  onComplete?: (result: QuizResult) => void;
  onExit?: () => void;
  timeLimit?: number; // in minutes
  allowReview?: boolean;
  showProgress?: boolean;
  className?: string;
}

const QuizEngine: React.FC<QuizEngineProps> = ({
  quiz,
  onComplete,
  onExit,
  timeLimit,
  allowReview = true,
  showProgress = true,
  className = ''
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuestionAnswer>>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit ? timeLimit * 60 : null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [isReviewing, setIsReviewing] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const answeredQuestions = Object.keys(answers).length;

  // Timer effect
  useEffect(() => {
    if (timeRemaining === null || isCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isCompleted]);

  const handleTimeUp = () => {
    if (!isCompleted) {
      handleSubmitQuiz();
    }
  };

  const handleAnswerChange = (questionId: string, answer: QuestionAnswer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionNavigation = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const toggleFlag = (index: number) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const calculateScore = (): QuizResult => {
    let correctAnswers = 0;
    const questionResults: Array<{
      questionId: string;
      isCorrect: boolean;
      userAnswer: QuestionAnswer;
      correctAnswer: QuestionAnswer;
      points: number;
    }> = [];

    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = checkAnswer(question, userAnswer);
      
      if (isCorrect) {
        correctAnswers++;
      }

      questionResults.push({
        questionId: question.id,
        isCorrect,
        userAnswer: userAnswer || { type: question.type, value: '' },
        correctAnswer: question.correctAnswer,
        points: isCorrect ? question.points : 0
      });
    });

    const totalPoints = questionResults.reduce((sum, result) => sum + result.points, 0);
    const maxPoints = quiz.questions.reduce((sum, question) => sum + question.points, 0);
    const percentage = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;

    return {
      id: `result-${Date.now()}`,
      quizId: quiz.id,
      userId: 'current-user', // This should come from auth context
      score: percentage,
      correctAnswers,
      totalQuestions,
      totalPoints,
      maxPoints,
      timeSpent: timeLimit ? (timeLimit * 60) - (timeRemaining || 0) : 0,
      answers: questionResults.map(result => ({
        questionId: result.questionId,
        answer: result.userAnswer.value,
        value: result.userAnswer.value,
        type: result.userAnswer.type,
        isCorrect: result.isCorrect,
        timeSpent: 0
      })),
      completedAt: new Date(),
      questionResults,
      passed: percentage >= quiz.passingScore
    };
  };

  const checkAnswer = (question: Question, userAnswer?: QuestionAnswer): boolean => {
    if (!userAnswer) return false;

    switch (question.type) {
      case 'multiple_choice':
      case 'true_false':
        return userAnswer.value === question.correctAnswer.value;
      
      case 'multiple_select':
        const userValues = Array.isArray(userAnswer.value) ? userAnswer.value : [userAnswer.value];
        const correctValues = Array.isArray(question.correctAnswer.value) 
          ? question.correctAnswer.value 
          : [question.correctAnswer.value];
        
        return userValues.length === correctValues.length &&
               userValues.every(val => correctValues.includes(val));
      
      case 'numeric':
        const userNum = parseFloat(userAnswer.value as string);
        const correctNum = parseFloat(question.correctAnswer.value as string);
        const tolerance = question.tolerance || 0.01;
        return Math.abs(userNum - correctNum) <= tolerance;
      
      case 'text':
        const userText = (userAnswer.value as string).toLowerCase().trim();
        const correctText = (question.correctAnswer.value as string).toLowerCase().trim();
        return userText === correctText;
      
      default:
        return false;
    }
  };

  const handleSubmitQuiz = () => {
    const result = calculateScore();
    setQuizResult(result);
    setIsCompleted(true);
    setShowResults(true);
    onComplete?.(result);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(timeLimit ? timeLimit * 60 : null);
    setIsCompleted(false);
    setShowResults(false);
    setQuizResult(null);
    setFlaggedQuestions(new Set());
    setIsReviewing(false);
  };

  const handleReview = () => {
    setIsReviewing(true);
    setShowResults(false);
    setCurrentQuestionIndex(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (index: number) => {
    const question = quiz.questions[index];
    const hasAnswer = answers[question.id];
    const isFlagged = flaggedQuestions.has(index);
    const isCurrent = index === currentQuestionIndex;

    if (isReviewing && quizResult) {
      const result = quizResult.questionResults.find(r => r.questionId === question.id);
      if (result?.isCorrect) return 'correct';
      if (hasAnswer) return 'incorrect';
      return 'unanswered';
    }

    if (isCurrent) return 'current';
    if (isFlagged) return 'flagged';
    if (hasAnswer) return 'answered';
    return 'unanswered';
  };

  if (showResults && quizResult) {
    return (
      <ResultsPanel
        result={quizResult}
        quiz={quiz}
        onRestart={handleRestart}
        onReview={allowReview ? handleReview : undefined}
        onExit={onExit}
        className={className}
      />
    );
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {quiz.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {quiz.description}
            </p>
          </div>
          
          <div className="text-right">
            {timeRemaining !== null && (
              <div className={`
                text-lg font-mono font-bold
                ${timeRemaining < 300 ? 'text-red-500' : 'text-gray-900 dark:text-white'}
              `}>
                <Clock className="w-5 h-5 inline mr-2" />
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {showProgress && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Pergunta {currentQuestionIndex + 1} de {totalQuestions}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {answeredQuestions}/{totalQuestions} respondidas
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Question navigation */}
        <div className="flex flex-wrap gap-2">
          {quiz.questions.map((_, index) => {
            const status = getQuestionStatus(index);
            
            return (
              <motion.button
                key={index}
                className={`
                  w-10 h-10 rounded-lg font-medium text-sm transition-all duration-200
                  ${status === 'current' 
                    ? 'bg-blue-500 text-white ring-2 ring-blue-300' 
                    : status === 'correct'
                      ? 'bg-green-500 text-white'
                      : status === 'incorrect'
                        ? 'bg-red-500 text-white'
                        : status === 'answered'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : status === 'flagged'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }
                  hover:scale-110
                `}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuestionNavigation(index)}
              >
                {index + 1}
                {flaggedQuestions.has(index) && (
                  <Flag className="w-3 h-3 absolute -top-1 -right-1" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <QuestionCard
            question={currentQuestion}
            answer={answers[currentQuestion.id]}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
            isReviewing={isReviewing}
            showCorrectAnswer={isReviewing}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            isFlagged={flaggedQuestions.has(currentQuestionIndex)}
            onToggleFlag={() => toggleFlag(currentQuestionIndex)}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-6">
        <div className="flex items-center justify-between">
          <motion.button
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              ${currentQuestionIndex > 0 
                ? 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20' 
                : 'text-gray-400 cursor-not-allowed'
              }
            `}
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            whileHover={currentQuestionIndex > 0 ? { scale: 1.05 } : {}}
            whileTap={currentQuestionIndex > 0 ? { scale: 0.95 } : {}}
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </motion.button>

          <div className="flex items-center gap-4">
            {!isReviewing && (
              <motion.button
                className="flex items-center gap-2 px-4 py-2 text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                onClick={() => toggleFlag(currentQuestionIndex)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Flag className={`w-4 h-4 ${flaggedQuestions.has(currentQuestionIndex) ? 'fill-current' : ''}`} />
                {flaggedQuestions.has(currentQuestionIndex) ? 'Remover Marcação' : 'Marcar'}
              </motion.button>
            )}

            {currentQuestionIndex === totalQuestions - 1 && !isReviewing ? (
              <motion.button
                className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                onClick={handleSubmitQuiz}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trophy className="w-4 h-4" />
                Finalizar Quiz
              </motion.button>
            ) : (
              <motion.button
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                  ${currentQuestionIndex < totalQuestions - 1 
                    ? 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20' 
                    : 'text-gray-400 cursor-not-allowed'
                  }
                `}
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === totalQuestions - 1}
                whileHover={currentQuestionIndex < totalQuestions - 1 ? { scale: 1.05 } : {}}
                whileTap={currentQuestionIndex < totalQuestions - 1 ? { scale: 0.95 } : {}}
              >
                Próxima
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          {isReviewing && (
            <motion.button
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
              onClick={() => setShowResults(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Star className="w-4 h-4" />
              Ver Resultados
            </motion.button>
          )}
        </div>

        {/* Quiz info */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span>Pontuação mínima: {quiz.passingScore}%</span>
              <span>Total de pontos: {quiz.questions.reduce((sum, q) => sum + q.points, 0)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {flaggedQuestions.size > 0 && (
                <span className="flex items-center gap-1">
                  <Flag className="w-4 h-4 text-yellow-500" />
                  {flaggedQuestions.size} marcada{flaggedQuestions.size > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizEngine;