import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  BookOpen,
  Award,
  Target,
  CheckCircle,
  Star,
  TrendingUp,
  Calendar,
  Filter,
  Search,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Brain,
  Trophy,
  Users,
  MessageCircle,
  FileText,
  Video,
  Headphones,
  Download,
  Share2,
  Heart,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import useGamification from '../../../hooks/useGamification';
import { useEducationProgress } from '../../../hooks/useEducationProgress';

interface Activity {
  id: string;
  type: 'module' | 'quiz' | 'badge' | 'goal' | 'streak' | 'level' | 'track' | 'achievement';
  title: string;
  description: string;
  timestamp: Date;
  points?: number;
  category: string;
  icon: React.ReactNode;
  color: string;
  details?: {
    score?: number;
    duration?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    resources?: string[];
  };
}

interface ActivityGroup {
  date: string;
  activities: Activity[];
}

const ActivityTimeline: React.FC = () => {
  const { userProgress, badges } = useGamification();
  const { learningTracks } = useEducationProgress();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(true);

  // Gerar atividades mockadas baseadas no progresso real
  const activities: Activity[] = useMemo(() => {
    const now = new Date();
    const activities: Activity[] = [];

    // Atividades de módulos completados
    userProgress.completedModules.forEach((moduleId, index) => {
      const date = new Date(now.getTime() - (index + 1) * 24 * 60 * 60 * 1000);
      activities.push({
        id: `module-${moduleId}`,
        type: 'module',
        title: `Módulo Concluído: ${moduleId}`,
        description: 'Você completou com sucesso este módulo de educação financeira',
        timestamp: date,
        points: 50,
        category: 'Aprendizado',
        icon: <BookOpen className="w-4 h-4" />,
        color: 'blue',
        details: {
          score: 85 + Math.random() * 15,
          duration: 15 + Math.random() * 30,
          difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as any,
          resources: ['Vídeo explicativo', 'Material de apoio', 'Exercícios práticos']
        }
      });
    });

    // Atividades de quizzes
    userProgress.completedQuizzes.forEach((quizId, index) => {
      const date = new Date(now.getTime() - (index + 2) * 24 * 60 * 60 * 1000);
      activities.push({
        id: `quiz-${quizId}`,
        type: 'quiz',
        title: `Quiz Finalizado: ${quizId}`,
        description: 'Você testou seus conhecimentos e obteve uma boa pontuação',
        timestamp: date,
        points: 25,
        category: 'Avaliação',
        icon: <Brain className="w-4 h-4" />,
        color: 'green',
        details: {
          score: 70 + Math.random() * 30,
          duration: 5 + Math.random() * 10,
          difficulty: 'medium'
        }
      });
    });

    // Atividades de badges
    badges.forEach((badge, index) => {
      const date = new Date(now.getTime() - (index + 3) * 24 * 60 * 60 * 1000);
      activities.push({
        id: `badge-${badge.id}`,
        type: 'badge',
        title: `Conquista Desbloqueada: ${badge.name}`,
        description: badge.description,
        timestamp: date,
        points: 100,
        category: 'Conquista',
        icon: <Award className="w-4 h-4" />,
        color: 'yellow'
      });
    });

    // Atividades de trilhas completadas
    userProgress.completedTracks.forEach((trackId, index) => {
      const date = new Date(now.getTime() - (index + 4) * 24 * 60 * 60 * 1000);
      activities.push({
        id: `track-${trackId}`,
        type: 'track',
        title: `Trilha Concluída: ${trackId}`,
        description: 'Parabéns! Você completou uma trilha completa de aprendizado',
        timestamp: date,
        points: 200,
        category: 'Trilha',
        icon: <Trophy className="w-4 h-4" />,
        color: 'purple'
      });
    });

    // Atividades adicionais mockadas
    const additionalActivities: Activity[] = [
      {
        id: 'streak-7',
        type: 'streak',
        title: 'Sequência de 7 Dias!',
        description: 'Você manteve uma sequência de estudos por 7 dias consecutivos',
        timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        points: 150,
        category: 'Consistência',
        icon: <Zap className="w-4 h-4" />,
        color: 'orange'
      },
      {
        id: 'level-up',
        type: 'level',
        title: 'Subiu de Nível!',
        description: `Parabéns! Você alcançou o nível ${userProgress.level}`,
        timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        points: 300,
        category: 'Progresso',
        icon: <Star className="w-4 h-4" />,
        color: 'indigo'
      },
      {
        id: 'goal-achieved',
        type: 'goal',
        title: 'Meta Alcançada!',
        description: 'Você atingiu sua meta mensal de estudos',
        timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        points: 250,
        category: 'Meta',
        icon: <Target className="w-4 h-4" />,
        color: 'red'
      }
    ];

    activities.push(...additionalActivities);

    // Ordenar por data (mais recente primeiro)
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [userProgress, badges]);

  // Filtrar atividades
  const filteredActivities = useMemo(() => {
    let filtered = activities;

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(activity => activity.type === selectedFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [activities, selectedFilter, searchTerm]);

  // Agrupar atividades por data
  const groupedActivities: ActivityGroup[] = useMemo(() => {
    const groups: { [key: string]: Activity[] } = {};

    filteredActivities.forEach(activity => {
      const dateKey = activity.timestamp.toLocaleDateString('pt-BR');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(activity);
    });

    return Object.entries(groups).map(([date, activities]) => ({
      date,
      activities: activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    }));
  }, [filteredActivities]);

  // Estatísticas da timeline
  const stats = useMemo(() => {
    const totalPoints = activities.reduce((sum, activity) => sum + (activity.points || 0), 0);
    const activitiesThisWeek = activities.filter(
      activity => activity.timestamp.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length;
    const mostActiveDay = activities.reduce((acc, activity) => {
      const day = activity.timestamp.toLocaleDateString('pt-BR');
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const topDay = Object.entries(mostActiveDay).sort(([,a], [,b]) => b - a)[0];

    return {
      totalActivities: activities.length,
      totalPoints,
      activitiesThisWeek,
      mostActiveDay: topDay ? topDay[0] : 'N/A',
      averagePerDay: activities.length > 0 ? (activities.length / 30).toFixed(1) : '0'
    };
  }, [activities]);

  const filterOptions = [
    { value: 'all', label: 'Todas', icon: <Calendar className="w-4 h-4" /> },
    { value: 'module', label: 'Módulos', icon: <BookOpen className="w-4 h-4" /> },
    { value: 'quiz', label: 'Quizzes', icon: <Brain className="w-4 h-4" /> },
    { value: 'badge', label: 'Conquistas', icon: <Award className="w-4 h-4" /> },
    { value: 'goal', label: 'Metas', icon: <Target className="w-4 h-4" /> },
    { value: 'streak', label: 'Sequências', icon: <Zap className="w-4 h-4" /> }
  ];

  const getActivityColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      indigo: 'bg-indigo-500',
      red: 'bg-red-500'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500';
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Clock className="w-6 h-6 mr-2 text-blue-500" />
            Timeline de Atividades
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Acompanhe seu histórico de aprendizado e conquistas
          </p>
        </div>

        <button
          onClick={() => setShowStats(!showStats)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <TrendingUp className="w-4 h-4" />
          <span>{showStats ? 'Ocultar' : 'Mostrar'} Estatísticas</span>
        </button>
      </div>

      {/* Statistics */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.totalActivities}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Star className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pontos</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.totalPoints}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Esta Semana</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.activitiesThisWeek}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Média/Dia</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.averagePerDay}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Trophy className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Dia + Ativo</p>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">
                    {stats.mostActiveDay}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedFilter(option.value)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedFilter === option.value
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar atividades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {groupedActivities.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma atividade encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Tente ajustar os filtros ou comece a estudar para ver suas atividades aqui.
            </p>
          </div>
        ) : (
          groupedActivities.map((group, groupIndex) => (
            <motion.div
              key={group.date}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
            >
              {/* Date Header */}
              <div className="flex items-center mb-6">
                <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium">
                  {group.date}
                </div>
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600 ml-4"></div>
              </div>

              {/* Activities */}
              <div className="space-y-4 ml-8">
                {group.activities.map((activity, activityIndex) => (
                  <motion.div
                    key={activity.id}
                    className="relative"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (groupIndex * 0.1) + (activityIndex * 0.05) }}
                  >
                    {/* Timeline Line */}
                    <div className="absolute -left-8 top-6 w-4 h-4 rounded-full bg-white dark:bg-gray-800 border-4 border-blue-500 z-10"></div>
                    {activityIndex < group.activities.length - 1 && (
                      <div className="absolute -left-6 top-10 w-px h-16 bg-gray-300 dark:bg-gray-600"></div>
                    )}

                    {/* Activity Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`p-3 rounded-lg ${getActivityColor(activity.color)} text-white`}>
                            {activity.icon}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {activity.title}
                              </h3>
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                {activity.category}
                              </span>
                              {activity.points && (
                                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs rounded-full font-medium">
                                  +{activity.points} XP
                                </span>
                              )}
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                              {activity.description}
                            </p>

                            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatTime(activity.timestamp)}</span>
                              </span>
                              {activity.details?.duration && (
                                <span className="flex items-center space-x-1">
                                  <Play className="w-3 h-3" />
                                  <span>{activity.details.duration} min</span>
                                </span>
                              )}
                              {activity.details?.score && (
                                <span className="flex items-center space-x-1">
                                  <Star className="w-3 h-3" />
                                  <span>{activity.details.score.toFixed(0)}%</span>
                                </span>
                              )}
                            </div>

                            {/* Expanded Details */}
                            <AnimatePresence>
                              {expandedActivity === activity.id && activity.details && (
                                <motion.div
                                  className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="space-y-3">
                                    {activity.details.difficulty && (
                                      <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                          Dificuldade:
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity.details.difficulty)}`}>
                                          {activity.details.difficulty === 'easy' ? 'Fácil' :
                                           activity.details.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                                        </span>
                                      </div>
                                    )}
                                    
                                    {activity.details.resources && (
                                      <div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                                          Recursos utilizados:
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                          {activity.details.resources.map((resource, index) => (
                                            <span
                                              key={index}
                                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full"
                                            >
                                              {resource}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Expand Button */}
                        {activity.details && (
                          <button
                            onClick={() => setExpandedActivity(
                              expandedActivity === activity.id ? null : activity.id
                            )}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          >
                            {expandedActivity === activity.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;