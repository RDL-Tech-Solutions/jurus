import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Trophy,
  Target,
  Star,
  Award,
  BarChart3,
  PieChart,
  Zap,
  Crown,
  Medal,
  Flame,
  Clock,
  BookOpen,
  Brain,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronRight,
  Filter,
  RefreshCw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import useGamification from '../../../hooks/useGamification';
import { useEducationProgress } from '../../../hooks/useEducationProgress';

interface UserComparison {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  completedModules: number;
  streakDays: number;
  badges: number;
  rank: number;
  isCurrentUser?: boolean;
}

interface CategoryComparison {
  category: string;
  userScore: number;
  averageScore: number;
  topScore: number;
  userRank: number;
  totalUsers: number;
}

interface Benchmark {
  metric: string;
  userValue: number;
  average: number;
  top10: number;
  percentile: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

const ProgressComparison: React.FC = () => {
  const { userProgress, badges } = useGamification();
  const { learningTracks } = useEducationProgress();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('ranking');

  // Dados mockados para comparação
  const mockUsers: UserComparison[] = useMemo(() => {
    const users = [
      { id: 'user1', name: 'Ana Silva', avatar: '👩‍💼', level: 8, xp: 2450, completedModules: 15, streakDays: 12, badges: 8, rank: 1 },
      { id: 'user2', name: 'Carlos Santos', avatar: '👨‍💻', level: 7, xp: 2200, completedModules: 13, streakDays: 8, badges: 6, rank: 2 },
      { id: 'current', name: 'Você', avatar: '🎯', level: userProgress.level, xp: userProgress.xp, completedModules: userProgress.completedModules.length, streakDays: userProgress.streakDays, badges: badges.length, rank: 3, isCurrentUser: true },
      { id: 'user3', name: 'Maria Oliveira', avatar: '👩‍🎓', level: 6, xp: 1950, completedModules: 11, streakDays: 15, badges: 7, rank: 4 },
      { id: 'user4', name: 'João Costa', avatar: '👨‍🏫', level: 6, xp: 1800, completedModules: 10, streakDays: 5, badges: 5, rank: 5 },
      { id: 'user5', name: 'Lucia Ferreira', avatar: '👩‍🔬', level: 5, xp: 1650, completedModules: 9, streakDays: 7, badges: 4, rank: 6 },
      { id: 'user6', name: 'Pedro Lima', avatar: '👨‍⚕️', level: 5, xp: 1500, completedModules: 8, streakDays: 3, badges: 3, rank: 7 },
      { id: 'user7', name: 'Sofia Rocha', avatar: '👩‍🎨', level: 4, xp: 1350, completedModules: 7, streakDays: 6, badges: 4, rank: 8 },
      { id: 'user8', name: 'Rafael Alves', avatar: '👨‍🚀', level: 4, xp: 1200, completedModules: 6, streakDays: 4, badges: 2, rank: 9 },
      { id: 'user9', name: 'Camila Dias', avatar: '👩‍⚖️', level: 3, xp: 1050, completedModules: 5, streakDays: 2, badges: 3, rank: 10 }
    ];

    return users.sort((a, b) => b.xp - a.xp).map((user, index) => ({
      ...user,
      rank: index + 1
    }));
  }, [userProgress, badges]);

  // Comparações por categoria
  const categoryComparisons: CategoryComparison[] = useMemo(() => {
    return [
      {
        category: 'Planejamento Financeiro',
        userScore: 85,
        averageScore: 72,
        topScore: 95,
        userRank: 15,
        totalUsers: 150
      },
      {
        category: 'Investimentos',
        userScore: 78,
        averageScore: 68,
        topScore: 92,
        userRank: 25,
        totalUsers: 150
      },
      {
        category: 'Controle de Gastos',
        userScore: 92,
        averageScore: 75,
        topScore: 98,
        userRank: 8,
        totalUsers: 150
      },
      {
        category: 'Educação Financeira',
        userScore: 88,
        averageScore: 70,
        topScore: 96,
        userRank: 12,
        totalUsers: 150
      },
      {
        category: 'Empreendedorismo',
        userScore: 65,
        averageScore: 62,
        topScore: 89,
        userRank: 45,
        totalUsers: 150
      }
    ];
  }, []);

  // Benchmarks
  const benchmarks: Benchmark[] = useMemo(() => {
    return [
      {
        metric: 'XP Total',
        userValue: userProgress.xp,
        average: 1500,
        top10: 2800,
        percentile: 75,
        trend: 'up',
        change: 12
      },
      {
        metric: 'Módulos Concluídos',
        userValue: userProgress.completedModules.length,
        average: 8,
        top10: 18,
        percentile: 68,
        trend: 'up',
        change: 8
      },
      {
        metric: 'Sequência de Dias',
        userValue: userProgress.streakDays,
        average: 5,
        top10: 25,
        percentile: 82,
        trend: 'stable',
        change: 0
      },
      {
        metric: 'Badges Conquistadas',
        userValue: badges.length,
        average: 4,
        top10: 12,
        percentile: 70,
        trend: 'up',
        change: 15
      },
      {
        metric: 'Tempo de Estudo (h)',
        userValue: 45,
        average: 25,
        top10: 80,
        percentile: 85,
        trend: 'up',
        change: 20
      }
    ];
  }, [userProgress, badges]);

  // Dados para gráfico radar de comparação
  const radarData = categoryComparisons.map(cat => ({
    category: cat.category.split(' ')[0], // Primeira palavra para economizar espaço
    user: cat.userScore,
    average: cat.averageScore,
    top: cat.topScore
  }));

  // Dados de evolução temporal (mockados)
  const evolutionData = [
    { month: 'Jan', user: 800, average: 600, top10: 1200 },
    { month: 'Fev', user: 1200, average: 750, top10: 1500 },
    { month: 'Mar', user: 1600, average: 900, top10: 1800 },
    { month: 'Abr', user: 1950, average: 1050, top10: 2100 },
    { month: 'Mai', user: 2100, average: 1200, top10: 2400 },
    { month: 'Jun', user: userProgress.xp, average: 1350, top10: 2700 }
  ];

  const currentUser = mockUsers.find(user => user.isCurrentUser);
  const userRank = currentUser?.rank || 0;
  const totalUsers = mockUsers.length * 15; // Simular mais usuários

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-500" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (percentile >= 75) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
    if (percentile >= 50) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30';
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-orange-500" />;
      default: return <span className="text-sm font-bold text-gray-600 dark:text-gray-400">#{rank}</span>;
    }
  };

  const tabs = [
    { id: 'ranking', label: 'Ranking', icon: <Trophy className="w-4 h-4" /> },
    { id: 'categories', label: 'Categorias', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'benchmarks', label: 'Benchmarks', icon: <Target className="w-4 h-4" /> },
    { id: 'evolution', label: 'Evolução', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Users className="w-6 h-6 mr-2 text-purple-500" />
            Comparação de Progresso
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Compare seu desempenho com outros usuários
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
            <option value="quarter">Último Trimestre</option>
            <option value="year">Último Ano</option>
          </select>
          
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* User Position Summary */}
      <motion.div
        className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              {getRankIcon(userRank)}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              #{userRank}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              de {totalUsers} usuários
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {Math.round(((totalUsers - userRank) / totalUsers) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Melhor que
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {userProgress.xp}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              XP Total
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              Nível {userProgress.level}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Atual
            </div>
          </div>
        </div>
      </motion.div>

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
      {activeTab === 'ranking' && (
        <div className="space-y-6">
          {/* Top Users */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Ranking Geral
            </h3>

            <div className="space-y-4">
              {mockUsers.slice(0, 10).map((user, index) => (
                <motion.div
                  key={user.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
                    user.isCurrentUser
                      ? 'bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-700'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIcon(user.rank)}
                    </div>
                    
                    <div className="text-2xl">{user.avatar}</div>
                    
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                        <span>{user.name}</span>
                        {user.isCurrentUser && (
                          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full">
                            Você
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Nível {user.level} • {user.completedModules} módulos
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-gray-900 dark:text-white">
                      {user.xp.toLocaleString()} XP
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                      <Flame className="w-3 h-3 text-orange-500" />
                      <span>{user.streakDays} dias</span>
                      <Award className="w-3 h-3 text-yellow-500" />
                      <span>{user.badges}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-6">
          {/* Radar Chart */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-blue-500" />
              Comparação por Categoria
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Você"
                  dataKey="user"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Média"
                  dataKey="average"
                  stroke="#6B7280"
                  fill="#6B7280"
                  fillOpacity={0.1}
                  strokeWidth={1}
                  strokeDasharray="5 5"
                />
                <Radar
                  name="Top"
                  dataKey="top"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.1}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryComparisons.map((category, index) => (
              <motion.div
                key={category.category}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  {category.category}
                </h4>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sua pontuação</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      {category.userScore}%
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Média: {category.averageScore}%</span>
                      <span>Top: {category.topScore}%</span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full relative"
                          style={{ width: `${category.userScore}%` }}
                        >
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                        </div>
                      </div>
                      <div
                        className="absolute top-0 w-px h-2 bg-gray-400"
                        style={{ left: `${category.averageScore}%` }}
                      ></div>
                      <div
                        className="absolute top-0 w-px h-2 bg-green-500"
                        style={{ left: `${category.topScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Posição #{category.userRank}
                    </span>
                    <span className="text-xs text-gray-500">
                      de {category.totalUsers} usuários
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'benchmarks' && (
        <div className="space-y-6">
          {/* Benchmarks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benchmarks.map((benchmark, index) => (
              <motion.div
                key={benchmark.metric}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {benchmark.metric}
                  </h4>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(benchmark.trend)}
                    <span className={`text-sm font-medium ${
                      benchmark.trend === 'up' ? 'text-green-600' :
                      benchmark.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {benchmark.change > 0 ? '+' : ''}{benchmark.change}%
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {benchmark.userValue.toLocaleString()}
                    </div>
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPercentileColor(benchmark.percentile)}`}>
                      Top {100 - benchmark.percentile}%
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Você</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {benchmark.userValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Média</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {benchmark.average.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Top 10%</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {benchmark.top10.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="relative pt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${Math.min((benchmark.userValue / benchmark.top10) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'evolution' && (
        <div className="space-y-6">
          {/* Evolution Chart */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Evolução do Progresso
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="top10"
                  stackId="1"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.1}
                  name="Top 10%"
                />
                <Area
                  type="monotone"
                  dataKey="average"
                  stackId="2"
                  stroke="#6B7280"
                  fill="#6B7280"
                  fillOpacity={0.1}
                  name="Média"
                />
                <Line
                  type="monotone"
                  dataKey="user"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  name="Você"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Progress Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                Insights de Progresso
              </h4>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800 dark:text-green-300">
                      Crescimento Acelerado
                    </span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Seu progresso está 25% acima da média nos últimos 30 dias.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800 dark:text-blue-300">
                      Meta Alcançável
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Você pode alcançar o Top 10% em 2 meses mantendo este ritmo.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-purple-500" />
                Próximos Marcos
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Próximo Nível
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Faltam 150 XP
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                      93%
                    </div>
                    <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1 mt-1">
                      <div className="w-14 bg-purple-500 h-1 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Top 10%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Faltam 700 XP
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                      75%
                    </div>
                    <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1 mt-1">
                      <div className="w-12 bg-green-500 h-1 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressComparison;