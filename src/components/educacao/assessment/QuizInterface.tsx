import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  ArrowRight, 
  Flag,
  Trophy,
  Star,
  Target,
  BookOpen,
  Award
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { useAssessment, Quiz, Question, QuizResult } from '../../../hooks/useAssessment';

interface QuizInterfaceProps {
  onClose: () => void;
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({ onClose }) => {
  const {
    currentQuiz,
    availableQuizzes,
    currentQuestion,
    answers,
    timeRemaining,
    showResults,
    lastResult,
    startQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    finishQuiz,
    exitQuiz,
    closeResults,
    isQuizCompleted,
    getBestResult,
    getStats
  } = useAssessment();

  const [selectedAnswer, setSelectedAnswer] = useState<string | number>('');
  const [showExplanation, setShowExplanation] = useState(false);

  // Reset selected answer when question changes
  useEffect(() => {
    if (currentQuiz) {
      const questionId = currentQuiz.questions[currentQuestion]?.id;
      const existingAnswer = answers[questionId];
      setSelectedAnswer(existingAnswer || '');
      setShowExplanation(false);
    }
  }, [currentQuestion, currentQuiz, answers]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string | number) => {
    setSelectedAnswer(answer);
    if (currentQuiz) {
      const questionId = currentQuiz.questions[currentQuestion].id;
      answerQuestion(questionId, answer);
    }
  };

  const handleNext = () => {
    if (currentQuiz && currentQuestion < currentQuiz.questions.length - 1) {
      nextQuestion();
    } else {
      finishQuiz();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return difficulty;
    }
  };

  const renderQuestionContent = (question: Question) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedAnswer === option
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === option && (
                      <div className="w-full h-full rounded-full bg-white scale-50" />
                    )}
                  </div>
                  <span className="text-gray-800">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        );

      case 'true-false':
        return (
          <div className="space-y-3">
            {['Verdadeiro', 'Falso'].map((option) => (
              <motion.button
                key={option}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedAnswer === option
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === option && (
                      <div className="w-full h-full rounded-full bg-white scale-50" />
                    )}
                  </div>
                  <span className="text-gray-800">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        );

      case 'numeric':
        return (
          <div className="space-y-3">
            <input
              type="number"
              value={selectedAnswer}
              onChange={(e) => handleAnswerSelect(parseFloat(e.target.value) || 0)}
              placeholder="Digite sua resposta..."
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <p className="text-sm text-gray-600">
              Digite apenas números. Use ponto para decimais.
            </p>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-3">
            <textarea
              value={selectedAnswer}
              onChange={(e) => handleAnswerSelect(e.target.value)}
              placeholder="Digite sua resposta..."
              rows={4}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Quiz Selection Screen
  if (!currentQuiz && !showResults) {
    const stats = getStats();
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Avaliações e Quizzes</h2>
          <Button variant="outline" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Quizzes</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalQuizzes}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-gray-800">{stats.completedQuizzes}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Star className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">XP Total</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalXP}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Média</p>
                <p className="text-2xl font-bold text-gray-800">{stats.averageScore}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Available Quizzes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableQuizzes.map((quiz) => {
            const isCompleted = isQuizCompleted(quiz.id);
            const bestResult = getBestResult(quiz.id);
            
            return (
              <motion.div
                key={quiz.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {quiz.description}
                      </p>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Dificuldade:</span>
                      <span className={`font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                        {getDifficultyLabel(quiz.difficulty)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Questões:</span>
                      <span className="font-medium text-gray-800">
                        {quiz.questions.length}
                      </span>
                    </div>
                    
                    {quiz.timeLimit && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Tempo:</span>
                        <span className="font-medium text-gray-800">
                          {quiz.timeLimit} min
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">XP:</span>
                      <span className="font-medium text-yellow-600">
                        +{quiz.xpReward}
                      </span>
                    </div>
                  </div>

                  {bestResult && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-700">Melhor resultado:</span>
                        <span className="font-bold text-green-800">
                          {bestResult.score}%
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-auto">
                    <Button
                      onClick={() => startQuiz(quiz.id)}
                      disabled={!quiz.isUnlocked}
                      className="w-full"
                      variant={isCompleted ? "outline" : "default"}
                    >
                      {isCompleted ? 'Refazer Quiz' : 'Iniciar Quiz'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // Quiz Results Screen
  if (showResults && lastResult) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-6">
            {lastResult.passed ? (
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            ) : (
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            )}
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {lastResult.passed ? 'Parabéns!' : 'Continue tentando!'}
            </h2>
            
            <p className="text-gray-600">
              {lastResult.passed 
                ? 'Você passou no quiz com sucesso!'
                : 'Você pode tentar novamente para melhorar sua pontuação.'
              }
            </p>
          </div>

          <Card className="p-6 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-3xl font-bold text-blue-600 mb-1">
                  {lastResult.score}%
                </p>
                <p className="text-sm text-gray-600">Pontuação</p>
              </div>
              
              <div>
                <p className="text-3xl font-bold text-green-600 mb-1">
                  {lastResult.correctAnswers}/{lastResult.totalQuestions}
                </p>
                <p className="text-sm text-gray-600">Acertos</p>
              </div>
              
              <div>
                <p className="text-3xl font-bold text-purple-600 mb-1">
                  {formatTime(lastResult.timeSpent)}
                </p>
                <p className="text-sm text-gray-600">Tempo gasto</p>
              </div>
              
              <div>
                <p className="text-3xl font-bold text-yellow-600 mb-1">
                  +{lastResult.xpEarned}
                </p>
                <p className="text-sm text-gray-600">XP ganho</p>
              </div>
            </div>
          </Card>

          <div className="flex space-x-4">
            <Button onClick={closeResults} variant="outline" className="flex-1">
              Ver Quizzes
            </Button>
            <Button 
              onClick={() => {
                closeResults();
                if (currentQuiz) startQuiz(currentQuiz.id);
              }}
              className="flex-1"
            >
              Tentar Novamente
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Quiz Interface
  if (currentQuiz) {
    const question = currentQuiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / currentQuiz.questions.length) * 100;
    const isLastQuestion = currentQuestion === currentQuiz.questions.length - 1;
    const hasAnswer = selectedAnswer !== '';

    return (
      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{currentQuiz.title}</h2>
            <p className="text-sm text-gray-600">
              Questão {currentQuestion + 1} de {currentQuiz.questions.length}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentQuiz.timeLimit && (
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4" />
                <span className={timeRemaining < 60 ? 'text-red-600' : 'text-gray-600'}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
            
            <Button variant="outline" size="sm" onClick={exitQuiz}>
              Sair
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <Card className="p-6 mb-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
                {getDifficultyLabel(question.difficulty)}
              </span>
              <span className="text-sm text-gray-600">
                {question.points} pontos
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {question.question}
            </h3>
          </div>

          {renderQuestionContent(question)}

          {showExplanation && hasAnswer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-blue-50 rounded-lg"
            >
              <h4 className="font-medium text-blue-800 mb-2">Explicação:</h4>
              <p className="text-blue-700 text-sm">{question.explanation}</p>
            </motion.div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <div className="flex space-x-2">
            {hasAnswer && !showExplanation && (
              <Button
                variant="outline"
                onClick={() => setShowExplanation(true)}
              >
                Ver Explicação
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              disabled={!hasAnswer}
            >
              {isLastQuestion ? 'Finalizar' : 'Próxima'}
              {!isLastQuestion && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};