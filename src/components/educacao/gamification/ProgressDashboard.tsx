import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Calendar, 
  TrendingUp, 
  Award,
  Flame,
  BookOpen,
  Star
} from 'lucide-react';
import { LevelIndicator, BadgeSystem, ProgressBar, AchievementModal } from './';
import useGamification from '../../../hooks/useGamification';

const ProgressDashboard: React.FC = () => {
  const {
    userProgress,
    badges,
    isLoading,
    getXPForNextLevel,
    checkAchievements
  } = useGamification();

  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [recentBadge, setRecentBadge] = useState<any>(null);

  // Check for new achievements on component mount
  useEffect(() => {
    const checkForNewAchievements = async () => {
      const newAchievements = await checkAchievements();
      if (newAchievements.length > 0) {
        // Show modal for first new achievement
        setRecentBadge(newAchievements[0]);
        setShowAchievementModal(true);
      }
    };

    if (!isLoading) {
      checkForNewAchievements();
    }
  }, [checkAchievements, isLoading]);

  const stats = [
    {
      id: 'level',
      title: 'Nível Atual',
      value: userProgress.level,
      icon: <Trophy className="w-6 h-6" />,
      color: 'from-yellow-400 to-orange-500',
      description: 'Seu nível de experiência'
    },
    {
      id: 'xp',
      title: 'Experiência Total',
      value: userProgress.xp.toLocaleString(),
      icon: <Star className="w-6 h-6" />,
      color: 'from-purple-400 to-purple-600',
      description: 'Pontos de experiência acumulados'
    },
    {
      id: 'modules',
      title: 'Módulos Concluídos',
      value: userProgress.completedModules.length,
      icon: <BookOpen className="w-6 h-6" />,
      color: 'from-blue-400 to-blue-600',
      description: 'Módulos de aprendizado finalizados'
    },
    {
      id: 'streak',
      title: 'Sequência de Dias',
      value: userProgress.streakDays,
      icon: <Flame className="w-6 h-6" />,
      color: 'from-red-400 to-red-600',
      description: 'Dias consecutivos de atividade'
    },
    {
      id: 'badges',
      title: 'Medalhas Conquistadas',
      value: userProgress.badges.length,
      icon: <Award className="w-6 h-6" />,
      color: 'from-green-400 to-green-600',
      description: 'Medalhas desbloqueadas'
    },
    {
      id: 'tracks',
      title: 'Trilhas Completas',
      value: userProgress.completedTracks.length,
      icon: <Target className="w-6 h-6" />,
      color: 'from-indigo-400 to-indigo-600',
      description: 'Trilhas de aprendizado finalizadas'
    }
  ];

  const recentBadges = badges
    .filter(badge => badge.unlockedAt)
    .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
    .slice(0, 6);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Painel de Progresso
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Acompanhe sua jornada de aprendizado financeiro
        </p>
      </div>

      {/* Level Progress */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Progresso do Nível
        </h2>
        <LevelIndicator
          currentLevel={userProgress.level}
          currentXP={userProgress.xp}
          xpForNextLevel={getXPForNextLevel(userProgress.level)}
          totalXP={userProgress.xp}
          size="lg"
        />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 2) }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`
                p-3 rounded-xl bg-gradient-to-br ${stat.color}
                text-white shadow-lg
              `}>
                {stat.icon}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {stat.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stat.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Recent Badges */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Medalhas Recentes
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {recentBadges.length} de {badges.length} desbloqueadas
          </span>
        </div>

        {recentBadges.length > 0 ? (
          <BadgeSystem
            badges={recentBadges}
            showUnlocked={true}
            onBadgeClick={(badge) => {
              setRecentBadge(badge);
              setShowAchievementModal(true);
            }}
          />
        ) : (
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Nenhuma medalha conquistada ainda.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Complete módulos e atividades para desbloquear medalhas!
            </p>
          </div>
        )}
      </motion.div>

      {/* Weekly Progress */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Progresso Semanal
          </h2>
        </div>

        <div className="space-y-4">
          <ProgressBar
            current={userProgress.streakDays}
            total={7}
            label="Dias ativos esta semana"
            color="blue"
            showPercentage={false}
            showNumbers={true}
          />
          
          <ProgressBar
            current={userProgress.completedModules.length}
            total={Math.max(userProgress.completedModules.length + 3, 10)}
            label="Módulos concluídos"
            color="green"
            showPercentage={false}
            showNumbers={true}
          />
        </div>
      </motion.div>

      {/* Achievement Modal */}
      <AchievementModal
        isOpen={showAchievementModal}
        onClose={() => setShowAchievementModal(false)}
        badge={recentBadge}
        type="badge"
      />
    </div>
  );
};

export default ProgressDashboard;