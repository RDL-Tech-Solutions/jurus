import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Clock, 
  CheckCircle, 
  XCircle,
  Target,
  TrendingUp,
  RotateCcw,
  Eye,
  Download,
  Share2,
  Award,
  Zap
} from 'lucide-react';
import { Quiz, QuizResult } from '../../../types/educacaoFinanceira';

interface ResultsPanelProps {
  result: QuizResult;
  quiz: Quiz;
  onRestart?: () => void;
  onReview?: () => void;
  onExit?: () => void;
  className?: string;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  result,
  quiz,
  onRestart,
  onReview,
  onExit,
  className = ''
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-green-400 to-green-600';
    if (score >= 70) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-red-600';
  };

  const getPerformanceMessage = (score: number, passed: boolean) => {
    if (score >= 95) return { title: 'Excelente!', message: 'Desempenho excepcional! Você domina completamente este assunto.' };
    if (score >= 85) return { title: 'Muito Bom!', message: 'Ótimo desempenho! Você tem um bom domínio do conteúdo.' };
    if (score >= 70) return { title: 'Bom!', message: 'Bom trabalho! Continue estudando para melhorar ainda mais.' };
    if (passed) return { title: 'Aprovado!', message: 'Você passou! Mas há espaço para melhorias.' };
    return { title: 'Não Aprovado', message: 'Continue estudando e tente novamente. Você consegue!' };
  };

  const performance = getPerformanceMessage(result.score, result.passed);

  const stats = [
    {
      icon: <Target className="w-6 h-6" />,
      label: 'Pontuação',
      value: `${Math.round(result.score)}%`,
      color: getScoreColor(result.score)
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      label: 'Corretas',
      value: `${result.correctAnswers}/${result.totalQuestions}`,
      color: 'text-green-500'
    },
    {
      icon: <Star className="w-6 h-6" />,
      label: 'Pontos',
      value: `${result.totalPoints}/${result.maxPoints}`,
      color: 'text-yellow-500'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Tempo',
      value: formatTime(result.timeSpent),
      color: 'text-blue-500'
    }
  ];

  const getQuestionResultIcon = (isCorrect: boolean) => {
    return isCorrect ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Header with score */}
      <motion.div
        className={`
          relative bg-gradient-to-br ${getScoreGradient(result.score)} 
          rounded-2xl p-8 text-white overflow-hidden
        `}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{performance.title}</h1>
              <p className="text-white/90 text-lg">{performance.message}</p>
            </div>
            
            <div className="text-right">
              <div className="text-5xl font-bold mb-2">
                {Math.round(result.score)}%
              </div>
              <div className="flex items-center gap-2 text-white/80">
                {result.passed ? (
                  <>
                    <Trophy className="w-5 h-5" />
                    <span>Aprovado</span>
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5" />
                    <span>Não Aprovado</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/20 rounded-full h-3 mb-4">
            <motion.div
              className="bg-white h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${result.score}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>

          <div className="flex items-center justify-between text-white/80">
            <span>Pontuação mínima: {quiz.passingScore}%</span>
            <span>Quiz: {quiz.title}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className={`${stat.color} mb-3 flex justify-center`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Question breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Análise Detalhada
          </h2>
        </div>

        <div className="space-y-3">
          {result.questionResults.map((questionResult, index) => {
            const question = quiz.questions.find(q => q.id === questionResult.questionId);
            if (!question) return null;

            return (
              <motion.div
                key={index}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200
                  ${questionResult.isCorrect 
                    ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800' 
                    : 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
                  }
                `}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getQuestionResultIcon(questionResult.isCorrect)}
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Pergunta {index + 1}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                        {question.text}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`
                      font-bold
                      ${questionResult.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}
                    `}>
                      {questionResult.points}/{question.points} pts
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {question.type === 'multiple_choice' ? 'Múltipla Escolha' :
                       question.type === 'multiple_select' ? 'Múltipla Seleção' :
                       question.type === 'true_false' ? 'V/F' :
                       question.type === 'numeric' ? 'Numérica' : 'Texto'}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Performance insights */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Insights de Performance
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div>
            <h3 className="font-medium text-green-600 dark:text-green-400 mb-3">
              Pontos Fortes
            </h3>
            <div className="space-y-2">
              {result.score >= 80 && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Excelente compreensão geral do conteúdo</span>
                </div>
              )}
              {result.correctAnswers / result.totalQuestions >= 0.7 && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Boa taxa de acertos nas questões</span>
                </div>
              )}
              {result.timeSpent < (quiz.timeLimit || 30) * 60 * 0.8 && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Gerenciamento eficiente do tempo</span>
                </div>
              )}
            </div>
          </div>

          {/* Areas for improvement */}
          <div>
            <h3 className="font-medium text-orange-600 dark:text-orange-400 mb-3">
              Áreas para Melhorar
            </h3>
            <div className="space-y-2">
              {result.score < 70 && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Target className="w-4 h-4 text-orange-500" />
                  <span>Revisar conceitos fundamentais</span>
                </div>
              )}
              {result.correctAnswers / result.totalQuestions < 0.6 && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Target className="w-4 h-4 text-orange-500" />
                  <span>Praticar mais exercícios similares</span>
                </div>
              )}
              {!result.passed && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Target className="w-4 h-4 text-orange-500" />
                  <span>Estudar o material novamente antes de tentar outra vez</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap gap-4 justify-center">
          {onReview && (
            <motion.button
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReview}
            >
              <Eye className="w-5 h-5" />
              Revisar Respostas
            </motion.button>
          )}

          {onRestart && (
            <motion.button
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart}
            >
              <RotateCcw className="w-5 h-5" />
              Tentar Novamente
            </motion.button>
          )}

          <motion.button
            className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Download certificate logic would go here
              console.log('Download certificate');
            }}
          >
            <Download className="w-5 h-5" />
            Baixar Certificado
          </motion.button>

          <motion.button
            className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Share results logic would go here
              console.log('Share results');
            }}
          >
            <Share2 className="w-5 h-5" />
            Compartilhar
          </motion.button>

          {onExit && (
            <motion.button
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExit}
            >
              Voltar ao Menu
            </motion.button>
          )}
        </div>
      </div>

      {/* Achievement badge */}
      {result.passed && result.score >= 90 && (
        <motion.div
          className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 text-white text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Award className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Conquista Desbloqueada!</h3>
          <p className="text-white/90">
            Você obteve uma pontuação excelente e ganhou a medalha "Expert em {quiz.title}"!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ResultsPanel;