# Guia de Implementação Prática - Educação Financeira

## 1. Configuração Inicial

### 1.1 Estrutura de Pastas
```
src/
├── components/
│   └── educacao/
│       ├── gamification/
│       ├── learning/
│       ├── assessment/
│       ├── calculators/
│       ├── content/
│       └── certification/
├── hooks/
│   ├── useEducationProgress.ts
│   ├── useGamification.ts
│   └── useAssessment.ts
├── stores/
│   ├── educationStore.ts
│   └── assessmentStore.ts
├── types/
│   └── education.ts
└── utils/
    ├── calculations.ts
    └── validators.ts
```

### 1.2 Dependências Adicionais
```json
{
  "dependencies": {
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^4.32.0",
    "framer-motion": "^10.16.0",
    "recharts": "^2.8.0",
    "react-confetti": "^6.1.0",
    "react-hot-toast": "^2.4.0",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "react-intersection-observer": "^9.5.0"
  }
}
```

## 2. Sistema de Gamificação

### 2.1 Badge System Component

```typescript
// components/educacao/gamification/BadgeSystem.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/types/education';

interface BadgeSystemProps {
  badges: Badge[];
  newBadge?: Badge;
  onBadgeClick?: (badge: Badge) => void;
}

export const BadgeSystem: React.FC<BadgeSystemProps> = ({
  badges,
  newBadge,
  onBadgeClick
}) => {
  const getRarityColor = (rarity: Badge['rarity']) => {
    const colors = {
      common: 'from-gray-400 to-gray-600',
      rare: 'from-blue-400 to-blue-600',
      epic: 'from-purple-400 to-purple-600',
      legendary: 'from-yellow-400 to-yellow-600'
    };
    return colors[rarity];
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Suas Conquistas</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <motion.div
            key={badge.id}
            className={`relative p-4 rounded-lg bg-gradient-to-br ${getRarityColor(badge.rarity)} cursor-pointer`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onBadgeClick?.(badge)}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">{badge.icon}</div>
              <h4 className="text-sm font-medium text-white">{badge.name}</h4>
              <p className="text-xs text-gray-200 mt-1">{badge.description}</p>
            </div>
            
            {badge.unlockedAt && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Novo!
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Badge Unlock Animation */}
      <AnimatePresence>
        {newBadge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <motion.div
              className="bg-white rounded-lg p-8 text-center max-w-sm mx-4"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 360 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <div className="text-4xl mb-4">{newBadge.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Conquista Desbloqueada!
              </h3>
              <h4 className="text-lg font-semibold text-blue-600 mb-2">
                {newBadge.name}
              </h4>
              <p className="text-gray-600">{newBadge.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

### 2.2 Progress Bar Component

```typescript
// components/educacao/gamification/ProgressBar.tsx
import React from 'react';
import { motion } from 'framer-motion';
import * as Progress from '@radix-ui/react-progress';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showXP?: boolean;
  animated?: boolean;
  color?: 'blue' | 'green' | 'purple' | 'yellow';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label,
  showXP = false,
  animated = true,
  color = 'blue'
}) => {
  const percentage = Math.min((current / total) * 100, 100);
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500'
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showXP && (
            <span className="text-sm text-gray-500">
              {current.toLocaleString()} / {total.toLocaleString()} XP
            </span>
          )}
        </div>
      )}
      
      <Progress.Root className="relative overflow-hidden bg-gray-200 rounded-full w-full h-3">
        <Progress.Indicator
          className={`h-full transition-transform duration-500 ease-out ${colorClasses[color]}`}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
        
        {animated && (
          <motion.div
            className="absolute inset-0 bg-white opacity-30"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'linear'
            }}
          />
        )}
      </Progress.Root>
      
      <div className="text-right">
        <span className="text-xs text-gray-500">{percentage.toFixed(1)}%</span>
      </div>
    </div>
  );
};
```

### 2.3 Level Indicator Component

```typescript
// components/educacao/gamification/LevelIndicator.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface LevelIndicatorProps {
  level: number;
  currentXP: number;
  xpForNextLevel: number;
  showLevelUp?: boolean;
}

export const LevelIndicator: React.FC<LevelIndicatorProps> = ({
  level,
  currentXP,
  xpForNextLevel,
  showLevelUp = false
}) => {
  const xpInCurrentLevel = currentXP % 1000;
  const progressToNextLevel = (xpInCurrentLevel / 1000) * 100;

  return (
    <div className="relative">
      <motion.div
        className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white"
        animate={showLevelUp ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold">{level}</span>
          </div>
          
          {showLevelUp && (
            <motion.div
              className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              UP!
            </motion.div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Nível {level}</h3>
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span>{xpInCurrentLevel} XP</span>
              <span>{1000} XP</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <motion.div
                className="bg-white h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressToNextLevel}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
```

## 3. Sistema de Avaliação

### 3.1 Quiz Engine Component

```typescript
// components/educacao/assessment/QuizEngine.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quiz, Question, QuestionAnswer } from '@/types/education';
import { QuestionCard } from './QuestionCard';
import { ResultsPanel } from './ResultsPanel';

interface QuizEngineProps {
  quiz: Quiz;
  onComplete: (result: QuizResult) => void;
  onExit: () => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  quiz,
  onComplete,
  onExit
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    quiz.timeLimit ? quiz.timeLimit * 60 : null
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  // Timer effect
  useEffect(() => {
    if (timeRemaining && timeRemaining > 0 && !isCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleQuizComplete();
    }
  }, [timeRemaining, isCompleted]);

  const handleAnswerSubmit = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    if (isLastQuestion) {
      handleQuizComplete();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleQuizComplete = () => {
    setIsCompleted(true);
    
    // Calculate results
    const questionAnswers: QuestionAnswer[] = quiz.questions.map(question => ({
      questionId: question.id,
      answer: answers[question.id],
      isCorrect: validateAnswer(question, answers[question.id]),
      timeSpent: 0 // You might want to track this per question
    }));

    const correctAnswers = questionAnswers.filter(qa => qa.isCorrect).length;
    const score = (correctAnswers / quiz.questions.length) * 100;

    const result: QuizResult = {
      id: `quiz-result-${Date.now()}`,
      quizId: quiz.id,
      userId: 'current-user', // Get from auth context
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      timeSpent: quiz.timeLimit ? (quiz.timeLimit * 60) - (timeRemaining || 0) : 0,
      answers: questionAnswers,
      completedAt: new Date()
    };

    setTimeout(() => {
      setShowResults(true);
      onComplete(result);
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    return (
      <ResultsPanel
        quiz={quiz}
        answers={answers}
        onRetry={() => {
          setCurrentQuestionIndex(0);
          setAnswers({});
          setIsCompleted(false);
          setShowResults(false);
          setTimeRemaining(quiz.timeLimit ? quiz.timeLimit * 60 : null);
        }}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{quiz.title}</h2>
          <p className="text-gray-600">
            Questão {currentQuestionIndex + 1} de {quiz.questions.length}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {timeRemaining && (
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              timeRemaining < 60 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
            }`}>
              ⏱️ {formatTime(timeRemaining)}
            </div>
          )}
          
          <button
            onClick={onExit}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <QuestionCard
            question={currentQuestion}
            onAnswer={(answer) => handleAnswerSubmit(currentQuestion.id, answer)}
            isLastQuestion={isLastQuestion}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
```

### 3.2 Question Card Component

```typescript
// components/educacao/assessment/QuestionCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Question } from '@/types/education';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: any) => void;
  isLastQuestion: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  isLastQuestion
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowFeedback(true);
      setTimeout(() => {
        onAnswer(selectedAnswer);
        setShowFeedback(false);
        setSelectedAnswer(null);
      }, 2000);
    }
  };

  const renderQuestionInput = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <motion.button
                key={index}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedAnswer(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
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
          <div className="flex space-x-4">
            {[true, false].map((value) => (
              <motion.button
                key={value.toString()}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  selectedAnswer === value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedAnswer(value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg font-medium">
                  {value ? '✅ Verdadeiro' : '❌ Falso'}
                </span>
              </motion.button>
            ))}
          </div>
        );

      case 'numeric':
        return (
          <div className="space-y-4">
            <input
              type="number"
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Digite sua resposta..."
              value={selectedAnswer || ''}
              onChange={(e) => setSelectedAnswer(parseFloat(e.target.value))}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {question.question}
        </h3>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>💎 {question.points} pontos</span>
        </div>
      </div>

      {renderQuestionInput()}

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <p className="text-blue-800">{question.explanation}</p>
        </motion.div>
      )}

      <div className="mt-8 flex justify-end">
        <motion.button
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            selectedAnswer !== null
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          onClick={handleSubmit}
          disabled={selectedAnswer === null || showFeedback}
          whileHover={selectedAnswer !== null ? { scale: 1.05 } : {}}
          whileTap={selectedAnswer !== null ? { scale: 0.95 } : {}}
        >
          {isLastQuestion ? 'Finalizar Quiz' : 'Próxima Questão'}
        </motion.button>
      </div>
    </div>
  );
};
```

## 4. Calculadoras Avançadas

### 4.1 Retirement Calculator Component

```typescript
// components/educacao/calculators/RetirementCalculator.tsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RetirementData {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
  inflationRate: number;
  desiredMonthlyIncome: number;
}

export const RetirementCalculator: React.FC = () => {
  const [data, setData] = useState<RetirementData>({
    currentAge: 30,
    retirementAge: 65,
    currentSavings: 50000,
    monthlyContribution: 1000,
    expectedReturn: 8,
    inflationRate: 3,
    desiredMonthlyIncome: 5000
  });

  const calculations = useMemo(() => {
    const yearsToRetirement = data.retirementAge - data.currentAge;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyReturn = data.expectedReturn / 100 / 12;
    
    // Future value calculation
    const futureValueCurrentSavings = data.currentSavings * Math.pow(1 + data.expectedReturn / 100, yearsToRetirement);
    
    // Future value of annuity (monthly contributions)
    const futureValueContributions = data.monthlyContribution * 
      ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn);
    
    const totalSavings = futureValueCurrentSavings + futureValueContributions;
    
    // Required savings for desired income
    const realReturnRate = (data.expectedReturn - data.inflationRate) / 100;
    const requiredSavings = (data.desiredMonthlyIncome * 12) / realReturnRate;
    
    // Monthly contribution needed
    const currentValueRequired = requiredSavings / Math.pow(1 + data.expectedReturn / 100, yearsToRetirement);
    const additionalNeeded = Math.max(0, currentValueRequired - data.currentSavings);
    const requiredMonthlyContribution = additionalNeeded * monthlyReturn / 
      (Math.pow(1 + monthlyReturn, monthsToRetirement) - 1);

    // Generate chart data
    const chartData = [];
    let currentValue = data.currentSavings;
    
    for (let year = 0; year <= yearsToRetirement; year++) {
      chartData.push({
        year: data.currentAge + year,
        savings: Math.round(currentValue),
        contributions: Math.round(data.monthlyContribution * 12 * year)
      });
      
      if (year < yearsToRetirement) {
        currentValue = currentValue * (1 + data.expectedReturn / 100) + (data.monthlyContribution * 12);
      }
    }

    return {
      totalSavings: Math.round(totalSavings),
      requiredSavings: Math.round(requiredSavings),
      shortfall: Math.round(Math.max(0, requiredSavings - totalSavings)),
      requiredMonthlyContribution: Math.round(requiredMonthlyContribution),
      chartData
    };
  }, [data]);

  const updateField = (field: keyof RetirementData, value: number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Calculadora de Aposentadoria
        </h2>
        <p className="text-gray-600">
          Planeje sua aposentadoria com precisão e alcance seus objetivos financeiros
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-xl font-semibold mb-6">Seus Dados</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idade Atual
              </label>
              <input
                type="number"
                value={data.currentAge}
                onChange={(e) => updateField('currentAge', parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idade de Aposentadoria
              </label>
              <input
                type="number"
                value={data.retirementAge}
                onChange={(e) => updateField('retirementAge', parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poupança Atual (R$)
              </label>
              <input
                type="number"
                value={data.currentSavings}
                onChange={(e) => updateField('currentSavings', parseFloat(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contribuição Mensal (R$)
              </label>
              <input
                type="number"
                value={data.monthlyContribution}
                onChange={(e) => updateField('monthlyContribution', parseFloat(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retorno Esperado (% ao ano)
              </label>
              <input
                type="number"
                step="0.1"
                value={data.expectedReturn}
                onChange={(e) => updateField('expectedReturn', parseFloat(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taxa de Inflação (% ao ano)
              </label>
              <input
                type="number"
                step="0.1"
                value={data.inflationRate}
                onChange={(e) => updateField('inflationRate', parseFloat(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Renda Mensal Desejada (R$)
              </label>
              <input
                type="number"
                value={data.desiredMonthlyIncome}
                onChange={(e) => updateField('desiredMonthlyIncome', parseFloat(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-1">
                Total Acumulado
              </h4>
              <p className="text-2xl font-bold text-blue-900">
                R$ {calculations.totalSavings.toLocaleString()}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-800 mb-1">
                Necessário para Meta
              </h4>
              <p className="text-2xl font-bold text-green-900">
                R$ {calculations.requiredSavings.toLocaleString()}
              </p>
            </div>

            {calculations.shortfall > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-red-800 mb-1">
                  Déficit
                </h4>
                <p className="text-2xl font-bold text-red-900">
                  R$ {calculations.shortfall.toLocaleString()}
                </p>
              </div>
            )}

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-purple-800 mb-1">
                Contribuição Necessária
              </h4>
              <p className="text-2xl font-bold text-purple-900">
                R$ {calculations.requiredMonthlyContribution.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-lg font-semibold mb-4">Projeção de Crescimento</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={calculations.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toLocaleString()}`, '']}
                  labelFormatter={(label) => `Idade: ${label} anos`}
                />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="Total Acumulado"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
```

## 5. Sistema de Trilhas de Aprendizado

### 5.1 Learning Track Component

```typescript
// components/educacao/learning/LearningTrack.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { LearningTrack, Module } from '@/types/education';
import { ModuleCard } from './ModuleCard';
import { ProgressBar } from '../gamification/ProgressBar';

interface LearningTrackProps {
  track: LearningTrack;
  completedModules: string[];
  onModuleStart: (module: Module) => void;
}

export const LearningTrackComponent: React.FC<LearningTrackProps> = ({
  track,
  completedModules,
  onModuleStart
}) => {
  const completedCount = track.modules.filter(module => 
    completedModules.includes(module.id)
  ).length;
  
  const progressPercentage = (completedCount / track.modules.length) * 100;

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      basic: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || colors.basic;
  };

  const isModuleUnlocked = (moduleIndex: number) => {
    if (moduleIndex === 0) return true;
    return completedModules.includes(track.modules[moduleIndex - 1].id);
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Track Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {track.title}
            </h1>
            <p className="text-gray-600 text-lg mb-4">
              {track.description}
            </p>
            
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(track.difficulty)}`}>
                {track.difficulty === 'basic' ? 'Básico' : 
                 track.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
              </span>
              
              <span className="text-sm text-gray-500">
                ⏱️ {track.estimatedTime} minutos
              </span>
              
              <span className="text-sm text-gray-500">
                💎 {track.xpReward} XP
              </span>
            </div>
          </div>
          
          {track.badge && (
            <div className="text-center">
              <div className="text-4xl mb-2">{track.badge.icon}</div>
              <p className="text-sm text-gray-600">Conquista</p>
            </div>
          )}
        </div>

        {/* Progress */}
        <ProgressBar
          current={completedCount}
          total={track.modules.length}
          label={`Progresso da Trilha (${completedCount}/${track.modules.length} módulos)`}
          color="blue"
        />
      </div>

      {/* Modules */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Módulos</h2>
        
        <div className="grid gap-6">
          {track.modules.map((module, index) => {
            const isCompleted = completedModules.includes(module.id);
            const isUnlocked = isModuleUnlocked(index);
            
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ModuleCard
                  module={module}
                  isCompleted={isCompleted}
                  isUnlocked={isUnlocked}
                  moduleNumber={index + 1}
                  onStart={() => onModuleStart(module)}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
```

### 5.2 Module Card Component

```typescript
// components/educacao/learning/ModuleCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Module } from '@/types/education';

interface ModuleCardProps {
  module: Module;
  isCompleted: boolean;
  isUnlocked: boolean;
  moduleNumber: number;
  onStart: () => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  isCompleted,
  isUnlocked,
  moduleNumber,
  onStart
}) => {
  const getStatusIcon = () => {
    if (isCompleted) return '✅';
    if (isUnlocked) return '🔓';
    return '🔒';
  };

  const getStatusText = () => {
    if (isCompleted) return 'Concluído';
    if (isUnlocked) return 'Disponível';
    return 'Bloqueado';
  };

  const getStatusColor = () => {
    if (isCompleted) return 'text-green-600 bg-green-50 border-green-200';
    if (isUnlocked) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-gray-400 bg-gray-50 border-gray-200';
  };

  return (
    <motion.div
      className={`relative bg-white rounded-lg shadow-lg border-2 transition-all ${
        isUnlocked ? 'hover:shadow-xl cursor-pointer' : 'opacity-60'
      } ${getStatusColor()}`}
      onClick={isUnlocked ? onStart : undefined}
      whileHover={isUnlocked ? { scale: 1.02 } : {}}
      whileTap={isUnlocked ? { scale: 0.98 } : {}}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">{moduleNumber}</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {module.title}
              </h3>
              <p className="text-gray-600">{module.description}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl mb-1">{getStatusIcon()}</div>
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>⏱️ {module.estimatedTime} min</span>
            <span>💎 {module.xpReward} XP</span>
            <span>📚 {module.content.length} lições</span>
            {module.quiz && <span>❓ Quiz incluído</span>}
          </div>
          
          {isUnlocked && (
            <motion.button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onStart();
              }}
            >
              {isCompleted ? 'Revisar' : 'Iniciar'}
            </motion.button>
          )}
        </div>
      </div>

      {/* Progress indicator for completed modules */}
      {isCompleted && (
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-green-500">
          <div className="absolute -top-4 -left-3 text-white text-xs">✓</div>
        </div>
      )}
    </motion.div>
  );
};
```

## 6. Hooks de Estado

### 6.1 useEducationProgress Hook

```typescript
// hooks/useEducationProgress.ts
import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface UserProgress {
  xp: number;
  level: number;
  completedModules: string[];
  completedTracks: string[];
  badges: string[];
  certificates: string[];
  streakDays: number;
  lastActivityDate: string;
}

export const useEducationProgress = () => {
  const [progress, setProgress] = useLocalStorage<UserProgress>('education-progress', {
    xp: 0,
    level: 1,
    completedModules: [],
    completedTracks: [],
    badges: [],
    certificates: [],
    streakDays: 0,
    lastActivityDate: ''
  });

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newBadges, setNewBadges] = useState<string[]>([]);

  const calculateLevel = useCallback((xp: number) => {
    return Math.floor(xp / 1000) + 1;
  }, []);

  const getXPForNextLevel = useCallback((currentLevel: number) => {
    return currentLevel * 1000;
  }, []);

  const addXP = useCallback((amount: number, source?: string) => {
    setProgress(prev => {
      const newXP = prev.xp + amount;
      const newLevel = calculateLevel(newXP);
      const leveledUp = newLevel > prev.level;

      if (leveledUp) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }

      // Update streak
      const today = new Date().toDateString();
      const lastActivity = new Date(prev.lastActivityDate).toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      let newStreakDays = prev.streakDays;
      if (lastActivity === yesterday) {
        newStreakDays += 1;
      } else if (lastActivity !== today) {
        newStreakDays = 1;
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        streakDays: newStreakDays,
        lastActivityDate: today
      };
    });
  }, [calculateLevel, setProgress]);

  const completeModule = useCallback((moduleId: string, xpReward: number) => {
    setProgress(prev => {
      if (prev.completedModules.includes(moduleId)) {
        return prev; // Already completed
      }

      const newCompletedModules = [...prev.completedModules, moduleId];
      addXP(xpReward, 'module-completion');

      return {
        ...prev,
        completedModules: newCompletedModules
      };
    });
  }, [addXP, setProgress]);

  const completeTrack = useCallback((trackId: string, xpReward: number) => {
    setProgress(prev => {
      if (prev.completedTracks.includes(trackId)) {
        return prev;
      }

      const newCompletedTracks = [...prev.completedTracks, trackId];
      addXP(xpReward, 'track-completion');

      return {
        ...prev,
        completedTracks: newCompletedTracks
      };
    });
  }, [addXP, setProgress]);

  const unlockBadge = useCallback((badgeId: string) => {
    setProgress(prev => {
      if (prev.badges.includes(badgeId)) {
        return prev;
      }

      setNewBadges(current => [...current, badgeId]);
      setTimeout(() => {
        setNewBadges(current => current.filter(id => id !== badgeId));
      }, 5000);

      return {
        ...prev,
        badges: [...prev.badges, badgeId]
      };
    });
  }, [setProgress]);

  const addCertificate = useCallback((certificateId: string) => {
    setProgress(prev => ({
      ...prev,
      certificates: [...prev.certificates, certificateId]
    }));
  }, [setProgress]);

  return {
    progress,
    showLevelUp,
    newBadges,
    addXP,
    completeModule,
    completeTrack,
    unlockBadge,
    addCertificate,
    calculateLevel,
    getXPForNextLevel
  };
};
```

### 6.2 useGamification Hook

```typescript
// hooks/useGamification.ts
import { useCallback } from 'react';
import { useEducationProgress } from './useEducationProgress';

interface Achievement {
  id: string;
  name: string;
  description: string;
  condition: (progress: any) => boolean;
  xpReward: number;
  badgeId?: string;
}

const achievements: Achievement[] = [
  {
    id: 'first-module',
    name: 'Primeiros Passos',
    description: 'Complete seu primeiro módulo',
    condition: (progress) => progress.completedModules.length >= 1,
    xpReward: 100,
    badgeId: 'first-steps'
  },
  {
    id: 'quiz-master',
    name: 'Mestre dos Quizzes',
    description: 'Complete 5 quizzes com nota máxima',
    condition: (progress) => progress.perfectQuizzes >= 5,
    xpReward: 500,
    badgeId: 'quiz-master'
  },
  {
    id: 'streak-week',
    name: 'Semana Dedicada',
    description: 'Mantenha uma sequência de 7 dias',
    condition: (progress) => progress.streakDays >= 7,
    xpReward: 300,
    badgeId: 'week-streak'
  },
  {
    id: 'track-complete',
    name: 'Trilha Completa',
    description: 'Complete uma trilha inteira',
    condition: (progress) => progress.completedTracks.length >= 1,
    xpReward: 1000,
    badgeId: 'track-master'
  }
];

export const useGamification = () => {
  const { progress, addXP, unlockBadge } = useEducationProgress();

  const checkAchievements = useCallback(() => {
    achievements.forEach(achievement => {
      if (!progress.badges.includes(achievement.badgeId || achievement.id)) {
        if (achievement.condition(progress)) {
          addXP(achievement.xpReward, `achievement-${achievement.id}`);
          if (achievement.badgeId) {
            unlockBadge(achievement.badgeId);
          }
        }
      }
    });
  }, [progress, addXP, unlockBadge]);

  const getAvailableAchievements = useCallback(() => {
    return achievements.filter(achievement => 
      !progress.badges.includes(achievement.badgeId || achievement.id)
    );
  }, [progress.badges]);

  const getCompletedAchievements = useCallback(() => {
    return achievements.filter(achievement => 
      progress.badges.includes(achievement.badgeId || achievement.id)
    );
  }, [progress.badges]);

  return {
    checkAchievements,
    getAvailableAchievements,
    getCompletedAchievements,
    achievements
  };
};
```

Este guia de implementação prática fornece exemplos concretos de código para implementar as principais funcionalidades da expansão da área de educação financeira, incluindo gamificação, avaliações, calculadoras avançadas e trilhas de aprendizado.