import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  BookOpen,
  Award,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Star,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Calendar,
  Users,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line
} from 'recharts';
import useGamification from '../../../hooks/useGamification';
import { useEducationProgress } from '../../../hooks/useEducationProgress';

interface PerformanceMetric {
  category: string;
  score: number;
  maxScore: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface Recommendation {
  id: string;
  type: 'strength' | 'improvement' | 'warning' | 'suggestion';
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
}

interface LearningPattern {
  day: string;
  studyTime: number;
  modules: number;
  quizScore: number;
  engagement: number;
}

const PerformanceAnalytics: React.FC = () => {
  const { userProgress, badges } = useGamification();
  const { learningTracks } = useEducationProgress();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  // Calcular métricas de performance
  const performanceMetrics: PerformanceMetric[] = useMemo(() => {
    const completedModules = userProgress.completedModules.length;
    const totalModules = learningTracks.reduce((acc, track) => acc + track.modules.length, 0);
    const completionRate = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
    
    return [
      {
        category: 'Conclusão',
        score: completionRate,
        maxScore: 100,
        trend: 'up',
        change: 12
      },
      {
        category: 'Consistência',
        score: Math.min(userProgress.streakDays * 10, 100),
        maxScore: 100,
        trend: userProgress.streakDays > 5 ? 'up' : 'stable',
        change: 8
      },
      {
        category: 'Engajamento',
        score: 85,
        maxScore: 100,
        trend: 'up',
        change: 15
      },
      {
        category: 'Velocidade',
        score: 78,
        maxScore: 100,
        trend: 'stable',
        change: 0
      },
      {
        category: 'Retenção',
        score: 92,
        maxScore: 100,
        trend: 'up',
        change: 5
      },
      {
        category: 'Aplicação',
        score: 68,
        maxScore: 100,
        trend: 'down',
        change: -3
      }
    ];
  }, [userProgress, learningTracks]);

  // Gerar recomendações baseadas na performance
  const recommendations: Recommendation[] = useMemo(() => {
    const recs: Recommendation[] = [];
    
    // Análise de pontos fortes
    const strongMetrics = performanceMetrics.filter(m => m.score >= 80);
    if (strongMetrics.length > 0) {
      recs.push({
        id: 'strength-1',
        type: 'strength',
        title: 'Excelente Retenção de Conhecimento',
        description: 'Você demonstra alta capacidade de reter informações aprendidas.',
        action: 'Continue aplicando técnicas de revisão espaçada',
        priority: 'low',
        icon: <CheckCircle className="w-5 h-5" />
      });
    }

    // Análise de áreas de melhoria
    const weakMetrics = performanceMetrics.filter(m => m.score < 70);
    if (weakMetrics.length > 0) {
      recs.push({
        id: 'improvement-1',
        type: 'improvement',
        title: 'Oportunidade de Melhoria na Aplicação',
        description: 'Considere praticar mais exercícios práticos para melhorar a aplicação do conhecimento.',
        action: 'Faça mais simulações e casos práticos',
        priority: 'high',
        icon: <Target className="w-5 h-5" />
      });
    }

    // Análise de consistência
    if (userProgress.streakDays < 3) {
      recs.push({
        id: 'warning-1',
        type: 'warning',
        title: 'Melhore sua Consistência',
        description: 'Estudos regulares são fundamentais para o aprendizado efetivo.',
        action: 'Defina um horário fixo para estudar diariamente',
        priority: 'high',
        icon: <AlertTriangle className="w-5 h-5" />
      });
    }

    // Sugestões gerais
    recs.push({
      id: 'suggestion-1',
      type: 'suggestion',
      title: 'Explore Novos Tópicos',
      description: 'Diversificar seus estudos pode acelerar seu progresso.',
      action: 'Experimente trilhas de aprendizado diferentes',
      priority: 'medium',
      icon: <Lightbulb className="w-5 h-5" />
    });

    return recs;
  }, [performanceMetrics, userProgress.streakDays]);

  // Dados para gráfico radar
  const radarData = performanceMetrics.map(metric => ({
    category: metric.category,
    score: metric.score,
    fullMark: 100
  }));

  // Padrões de aprendizado (dados mockados)
  const learningPatterns: LearningPattern[] = [
    { day: 'Seg', studyTime: 45, modules: 2, quizScore: 85, engagement: 90 },
    { day: 'Ter', studyTime: 30, modules: 1, quizScore: 78, engagement: 75 },
    { day: 'Qua', studyTime: 60, modules: 3, quizScore: 92, engagement: 95 },
    { day: 'Qui', studyTime: 25, modules: 1, quizScore: 88, engagement: 80 },
    { day: 'Sex', studyTime: 50, modules: 2, quizScore: 90, engagement: 85 },
    { day: 'Sáb', studyTime: 70, modules: 4, quizScore: 95, engagement: 100 },
    { day: 'Dom', studyTime: 40, modules: 2, quizScore: 82, engagement: 70 }
  ];

  const getRecommendationColor = (type: Recommendation['type']) => {
    switch (type) {
      case 'strength': return 'green';
      case 'improvement': return 'blue';
      case 'warning': return 'red';
      case 'suggestion': return 'yellow';
      default: return 'gray';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-500" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'patterns', label: 'Padrões', icon: <Activity className="w-4 h-4" /> },
    { id: 'recommendations', label: 'Recomendações', icon: <Lightbulb className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-500" />
            Análise de Performance
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Insights detalhados sobre seu progresso de aprendizado
          </p>
        </div>

        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
        >
          <option value="week">Última Semana</option>
          <option value="month">Último Mês</option>
          <option value="quarter">Último Trimestre</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Performance Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceMetrics.map((metric, index) => (
              <motion.div
                key={metric.category}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {metric.category}
                  </h3>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(metric.trend)}
                    <span className={`text-sm font-medium ${
                      metric.trend === 'up' ? 'text-green-600' :
                      metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.score.toFixed(0)}%
                    </span>
                    <span className="text-sm text-gray-500">
                      de {metric.maxScore}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${
                        metric.score >= 80 ? 'bg-green-500' :
                        metric.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.score}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Radar Chart */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-purple-500" />
              Perfil de Competências
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Performance"
                  dataKey="score"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {activeTab === 'patterns' && (
        <div className="space-y-6">
          {/* Learning Patterns Chart */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-500" />
              Padrões de Estudo Semanal
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={learningPatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="studyTime" fill="#3B82F6" name="Tempo (min)" />
                <Bar dataKey="modules" fill="#10B981" name="Módulos" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Engagement Trend */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Tendência de Engajamento
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={learningPatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pattern Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-yellow-500" />
                Melhor Horário de Estudo
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Manhã (6h-12h)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="w-4/5 bg-green-500 h-2 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-green-600">80%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Tarde (12h-18h)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="w-3/5 bg-yellow-500 h-2 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-yellow-600">60%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Noite (18h-24h)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="w-2/5 bg-red-500 h-2 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-red-600">40%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                Dias Mais Produtivos
              </h4>
              <div className="space-y-3">
                {['Sábado', 'Quarta', 'Sexta', 'Segunda'].map((day, index) => (
                  <div key={day} className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">{day}</span>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {95 - index * 5}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec, index) => {
              const color = getRecommendationColor(rec.type);
              return (
                <motion.div
                  key={rec.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-${color}-500`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`}>
                      {rec.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {rec.title}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rec.priority === 'high' 
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : rec.priority === 'medium'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {rec.description}
                      </p>
                      <div className={`p-3 rounded-lg bg-${color}-50 dark:bg-${color}-900/20 border border-${color}-200 dark:border-${color}-700`}>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          💡 Ação recomendada:
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {rec.action}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Performance Summary */}
          <motion.div
            className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-500" />
              Resumo da Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {performanceMetrics.filter(m => m.score >= 80).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Pontos Fortes
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                  {performanceMetrics.filter(m => m.score >= 60 && m.score < 80).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Em Progresso
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                  {performanceMetrics.filter(m => m.score < 60).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Precisa Atenção
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PerformanceAnalytics;