import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Clock, 
  BookOpen, 
  Zap,
  Calendar,
  BarChart3,
  Trophy,
  Star,
  ChevronRight,
  Activity,
  Users,
  Brain,
  Lightbulb
} from 'lucide-react';
import useGamification from '../../../hooks/useGamification';
import { useEducationProgress } from '../../../hooks/useEducationProgress';
import ProgressCharts from './ProgressCharts';
import GoalsManager from './GoalsManager';
import PerformanceAnalytics from './PerformanceAnalytics';
import ActivityTimeline from './ActivityTimeline';
import ProgressComparison from './ProgressComparison';

interface DashboardTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

const ProgressDashboardAdvanced: React.FC = React.memo(() => {
  const { userProgress, badges, addXP } = useGamification();
  const { learningTracks, userProgress: educationProgress } = useEducationProgress();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('week');

  // Calcular estatísticas avançadas
  const calculateStats = (): StatCard[] => {
    const completedModules = userProgress.completedModules.length;
    const totalModules = learningTracks.reduce((acc, track) => acc + track.modules.length, 0);
    const completionRate = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
    
    const earnedBadges = badges.filter(badge => badge.unlockedAt).length;
    const totalBadges = badges.length;
    
    const currentLevel = userProgress.level;
    const xpProgress = userProgress.xp;
    
    const streakDays = userProgress.streakDays;

    return [
      {
        title: 'Progresso Geral',
        value: `${completionRate.toFixed(1)}%`,
        change: '+12% esta semana',
        trend: 'up',
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'from-blue-500 to-blue-600'
      },
      {
        title: 'Nível Atual',
        value: currentLevel,
        change: `${xpProgress} XP total`,
        trend: 'up',
        icon: <Star className="w-6 h-6" />,
        color: 'from-purple-500 to-purple-600'
      },
      {
        title: 'Conquistas',
        value: `${earnedBadges}/${totalBadges}`,
        change: '+3 esta semana',
        trend: 'up',
        icon: <Award className="w-6 h-6" />,
        color: 'from-yellow-500 to-yellow-600'
      },
      {
        title: 'Sequência',
        value: `${streakDays} dias`,
        change: streakDays > 7 ? 'Excelente!' : 'Continue assim!',
        trend: streakDays > 0 ? 'up' : 'neutral',
        icon: <Zap className="w-6 h-6" />,
        color: 'from-green-500 to-green-600'
      },
      {
        title: 'Módulos Concluídos',
        value: completedModules,
        change: `de ${totalModules} total`,
        trend: 'up',
        icon: <BookOpen className="w-6 h-6" />,
        color: 'from-indigo-500 to-indigo-600'
      },
      {
        title: 'Tempo de Estudo',
        value: '24h',
        change: '+4h esta semana',
        trend: 'up',
        icon: <Clock className="w-6 h-6" />,
        color: 'from-pink-500 to-pink-600'
      }
    ];
  };

  const stats = calculateStats();

  const tabs: DashboardTab[] = [
    {
      id: 'overview',
      label: 'Visão Geral',
      icon: <BarChart3 className="w-5 h-5" />,
      component: <ProgressCharts timeRange={timeRange} />
    },
    {
      id: 'goals',
      label: 'Metas',
      icon: <Target className="w-5 h-5" />,
      component: <GoalsManager />
    },
    {
      id: 'analytics',
      label: 'Análise',
      icon: <Brain className="w-5 h-5" />,
      component: <PerformanceAnalytics />
    },
    {
      id: 'activity',
      label: 'Atividades',
      icon: <Activity className="w-5 h-5" />,
      component: <ActivityTimeline />
    },
    {
      id: 'comparison',
      label: 'Comparação',
      icon: <Users className="w-5 h-5" />,
      component: <ProgressComparison />
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto p-6 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Painel de Progresso
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Acompanhe sua jornada de aprendizado financeiro
        </p>
      </motion.div>

      {/* Time Range Selector */}
      <motion.div variants={itemVariants} className="flex justify-center">
        <div 
          role="tablist" 
          aria-label="Seletor de período de tempo"
          className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          {['week', 'month', 'quarter', 'year'].map((range) => (
            <button
              key={range}
              role="tab"
              aria-selected={timeRange === range}
              aria-controls={`timerange-panel-${range}`}
              tabIndex={timeRange === range ? 0 : -1}
              onClick={() => setTimeRange(range)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setTimeRange(range);
                }
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                timeRange === range
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {range === 'week' && 'Semana'}
              {range === 'month' && 'Mês'}
              {range === 'quarter' && 'Trimestre'}
              {range === 'year' && 'Ano'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            role="article"
            aria-label={`${stat.title}: ${stat.value}, ${stat.change}`}
            className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02, y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                  {stat.icon}
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 
                  stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {stat.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2 text-yellow-500" />
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Continuar Aprendendo', icon: <BookOpen className="w-5 h-5" />, color: 'blue' },
            { label: 'Definir Nova Meta', icon: <Target className="w-5 h-5" />, color: 'green' },
            { label: 'Ver Conquistas', icon: <Trophy className="w-5 h-5" />, color: 'yellow' },
            { label: 'Fazer Quiz', icon: <Brain className="w-5 h-5" />, color: 'purple' }
          ].map((action, index) => (
            <motion.button
              key={action.label}
              aria-label={action.label}
              className={`p-4 rounded-xl border-2 border-dashed border-${action.color}-300 hover:border-${action.color}-500 hover:bg-${action.color}-50 dark:hover:bg-${action.color}-900/20 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-${action.color}-500 focus:ring-offset-2`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/30 text-${action.color}-600 dark:text-${action.color}-400`}>
                    {action.icon}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {action.label}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav 
            role="tablist" 
            aria-label="Navegação do painel de progresso"
            className="flex space-x-8 px-6"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveTab(tab.id);
                  }
                }}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
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
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              role="tabpanel"
              id={`tabpanel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {tabs.find(tab => tab.id === activeTab)?.component}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
});

export default ProgressDashboardAdvanced;