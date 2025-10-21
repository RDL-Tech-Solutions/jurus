import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Target, 
  Trophy, 
  Clock, 
  Star,
  BookOpen,
  CheckCircle,
  Play,
  BarChart3,
  Award
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { QuizInterface } from './QuizInterface';
import { useAssessment } from '../../../hooks/useAssessment';

export const Assessment: React.FC = () => {
  const [showQuizInterface, setShowQuizInterface] = useState(false);
  const { availableQuizzes, isQuizCompleted, getBestResult, getStats } = useAssessment();

  if (showQuizInterface) {
    return <QuizInterface onClose={() => setShowQuizInterface(false)} />;
  }

  const stats = getStats();

  const assessmentCategories = [
    {
      id: 'basics',
      title: 'Fundamentos Financeiros',
      description: 'Avalie seus conhecimentos básicos sobre finanças pessoais',
      icon: BookOpen,
      color: 'blue',
      quizzes: availableQuizzes.filter(q => q.category === 'basics')
    },
    {
      id: 'investments',
      title: 'Investimentos',
      description: 'Teste seus conhecimentos sobre investimentos e mercado financeiro',
      icon: BarChart3,
      color: 'green',
      quizzes: availableQuizzes.filter(q => q.category === 'investments')
    },
    {
      id: 'credit',
      title: 'Crédito e Financiamentos',
      description: 'Avalie seu entendimento sobre crédito e financiamentos',
      icon: Award,
      color: 'purple',
      quizzes: availableQuizzes.filter(q => q.category === 'credit')
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-600',
        border: 'border-green-200',
        button: 'bg-green-600 hover:bg-green-700'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-200',
        button: 'bg-purple-600 hover:bg-purple-700'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Brain className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Avaliações e Quizzes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Teste seus conhecimentos em educação financeira e acompanhe seu progresso 
            através de quizzes interativos e avaliações personalizadas.
          </p>
        </motion.div>
      </div>

      {/* Statistics Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Seu Progresso</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalQuizzes}</p>
              <p className="text-sm text-gray-600">Quizzes Disponíveis</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.completedQuizzes}</p>
              <p className="text-sm text-gray-600">Completados</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalXP}</p>
              <p className="text-sm text-gray-600">XP Total</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.averageScore}%</p>
              <p className="text-sm text-gray-600">Média Geral</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progresso Geral</span>
              <span className="text-sm font-medium text-gray-800">
                {Math.round(stats.completionRate)}%
              </span>
            </div>
            <Progress value={stats.completionRate} className="h-2" />
          </div>
        </Card>
      </motion.div>

      {/* Quick Start */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <Button
          onClick={() => setShowQuizInterface(true)}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Play className="w-5 h-5 mr-2" />
          Iniciar Avaliação
        </Button>
      </motion.div>

      {/* Assessment Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {assessmentCategories.map((category, index) => {
          const colors = getColorClasses(category.color);
          const completedQuizzes = category.quizzes.filter(q => isQuizCompleted(q.id)).length;
          const totalQuizzes = category.quizzes.length;
          const progress = totalQuizzes > 0 ? (completedQuizzes / totalQuizzes) * 100 : 0;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className={`p-6 h-full ${colors.bg} ${colors.border} border-2`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <category.icon className={`w-8 h-8 ${colors.text} mb-3`} />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Category Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progresso</span>
                    <span className="text-sm font-medium text-gray-800">
                      {completedQuizzes}/{totalQuizzes}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Quizzes List */}
                <div className="space-y-2 mb-4">
                  {category.quizzes.slice(0, 3).map((quiz) => {
                    const isCompleted = isQuizCompleted(quiz.id);
                    const bestResult = getBestResult(quiz.id);

                    return (
                      <div
                        key={quiz.id}
                        className="flex items-center justify-between p-2 bg-white rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-700">{quiz.title}</span>
                        </div>
                        {bestResult && (
                          <span className="text-xs font-medium text-green-600">
                            {bestResult.score}%
                          </span>
                        )}
                      </div>
                    );
                  })}
                  
                  {category.quizzes.length > 3 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{category.quizzes.length - 3} mais quizzes
                    </p>
                  )}
                </div>

                <Button
                  onClick={() => setShowQuizInterface(true)}
                  className={`w-full text-white ${colors.button}`}
                  variant="default"
                >
                  Ver Quizzes
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Atividade Recente</h3>
          
          <div className="space-y-3">
            {availableQuizzes.slice(0, 3).map((quiz) => {
              const bestResult = getBestResult(quiz.id);
              const isCompleted = isQuizCompleted(quiz.id);

              return (
                <div
                  key={quiz.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-100' : 'bg-gray-200'
                    }`}>
                      {isCompleted ? (
                        <Trophy className="w-5 h-5 text-green-600" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{quiz.title}</p>
                      <p className="text-sm text-gray-600">
                        {quiz.questions.length} questões • {quiz.xpReward} XP
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {bestResult ? (
                      <div>
                        <p className="font-bold text-green-600">{bestResult.score}%</p>
                        <p className="text-xs text-gray-500">Melhor resultado</p>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setShowQuizInterface(true)}
                      >
                        Iniciar
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};