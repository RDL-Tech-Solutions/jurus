import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  Calendar,
  TrendingUp,
  Star,
  BookOpen,
  Award,
  Zap,
  AlertCircle,
  Trophy,
  Flag
} from 'lucide-react';
import useGamification from '../../../hooks/useGamification';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'xp' | 'modules' | 'streak' | 'badges' | 'custom';
  targetValue: number;
  currentValue: number;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  createdAt: Date;
  completedAt?: Date;
  reward?: string;
}

interface GoalTemplate {
  title: string;
  description: string;
  category: Goal['category'];
  targetValue: number;
  suggestedDeadline: number; // days
  icon: React.ReactNode;
  color: string;
}

const GoalsManager: React.FC = () => {
  const { userProgress, addXP } = useGamification();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Templates de metas predefinidas
  const goalTemplates: GoalTemplate[] = [
    {
      title: 'Alcançar Nível 10',
      description: 'Chegue ao nível 10 para desbloquear conteúdos avançados',
      category: 'xp',
      targetValue: 10,
      suggestedDeadline: 30,
      icon: <Star className="w-5 h-5" />,
      color: 'purple'
    },
    {
      title: 'Completar 5 Módulos',
      description: 'Finalize 5 módulos de educação financeira',
      category: 'modules',
      targetValue: 5,
      suggestedDeadline: 14,
      icon: <BookOpen className="w-5 h-5" />,
      color: 'blue'
    },
    {
      title: 'Sequência de 7 Dias',
      description: 'Mantenha uma sequência de estudos por 7 dias consecutivos',
      category: 'streak',
      targetValue: 7,
      suggestedDeadline: 7,
      icon: <Zap className="w-5 h-5" />,
      color: 'yellow'
    },
    {
      title: 'Ganhar 1000 XP',
      description: 'Acumule 1000 pontos de experiência',
      category: 'xp',
      targetValue: 1000,
      suggestedDeadline: 21,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'green'
    },
    {
      title: 'Conquistar 3 Badges',
      description: 'Desbloqueie 3 conquistas diferentes',
      category: 'badges',
      targetValue: 3,
      suggestedDeadline: 30,
      icon: <Award className="w-5 h-5" />,
      color: 'orange'
    }
  ];

  // Carregar metas do localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('education-goals');
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals).map((goal: any) => ({
        ...goal,
        deadline: new Date(goal.deadline),
        createdAt: new Date(goal.createdAt),
        completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined
      }));
      setGoals(parsedGoals);
    }
  }, []);

  // Salvar metas no localStorage
  const saveGoals = (updatedGoals: Goal[]) => {
    localStorage.setItem('education-goals', JSON.stringify(updatedGoals));
    setGoals(updatedGoals);
  };

  // Atualizar progresso das metas baseado no userProgress
  useEffect(() => {
    const updatedGoals = goals.map(goal => {
      let currentValue = goal.currentValue;
      
      switch (goal.category) {
        case 'xp':
          currentValue = userProgress.xp;
          break;
        case 'modules':
          currentValue = userProgress.completedModules.length;
          break;
        case 'streak':
          currentValue = userProgress.streakDays;
          break;
        case 'badges':
          currentValue = userProgress.badges.length;
          break;
        default:
          break;
      }

      const isCompleted = currentValue >= goal.targetValue && !goal.isCompleted;
      
      if (isCompleted) {
        // Recompensar usuário por completar meta
        addXP(100, `goal-${goal.id}`);
        return {
          ...goal,
          currentValue,
          isCompleted: true,
          completedAt: new Date()
        };
      }

      return { ...goal, currentValue };
    });

    if (JSON.stringify(updatedGoals) !== JSON.stringify(goals)) {
      saveGoals(updatedGoals);
    }
  }, [userProgress, goals, addXP]);

  const createGoal = (template?: GoalTemplate, customData?: Partial<Goal>) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: template?.title || customData?.title || '',
      description: template?.description || customData?.description || '',
      category: template?.category || customData?.category || 'custom',
      targetValue: template?.targetValue || customData?.targetValue || 1,
      currentValue: 0,
      deadline: template 
        ? new Date(Date.now() + template.suggestedDeadline * 24 * 60 * 60 * 1000)
        : customData?.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: customData?.priority || 'medium',
      isCompleted: false,
      createdAt: new Date(),
      reward: customData?.reward
    };

    saveGoals([...goals, newGoal]);
    setShowCreateModal(false);
  };

  const updateGoal = (updatedGoal: Goal) => {
    const updatedGoals = goals.map(goal => 
      goal.id === updatedGoal.id ? updatedGoal : goal
    );
    saveGoals(updatedGoals);
    setEditingGoal(null);
  };

  const deleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    saveGoals(updatedGoals);
  };

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getGoalIcon = (category: Goal['category']) => {
    switch (category) {
      case 'learning': return <BookOpen className="w-5 h-5" />;
      case 'xp': return <TrendingUp className="w-5 h-5" />;
      case 'modules': return <BookOpen className="w-5 h-5" />;
      case 'streak': return <Zap className="w-5 h-5" />;
      case 'badges': return <Award className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getGoalColor = (category: Goal['category']) => {
    switch (category) {
      case 'learning': return 'blue';
      case 'xp': return 'green';
      case 'modules': return 'purple';
      case 'streak': return 'yellow';
      case 'badges': return 'orange';
      default: return 'gray';
    }
  };

  const filteredGoals = selectedCategory === 'all' 
    ? goals 
    : goals.filter(goal => goal.category === selectedCategory);

  const completedGoals = goals.filter(goal => goal.isCompleted).length;
  const activeGoals = goals.filter(goal => !goal.isCompleted).length;
  const overdue = goals.filter(goal => !goal.isCompleted && getDaysUntilDeadline(goal.deadline) < 0).length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Metas Ativas', value: activeGoals, color: 'blue', icon: <Target className="w-5 h-5" /> },
          { label: 'Concluídas', value: completedGoals, color: 'green', icon: <CheckCircle className="w-5 h-5" /> },
          { label: 'Em Atraso', value: overdue, color: 'red', icon: <AlertCircle className="w-5 h-5" /> },
          { label: 'Taxa de Sucesso', value: `${goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0}%`, color: 'purple', icon: <Trophy className="w-5 h-5" /> }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className={`p-4 rounded-xl bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 dark:from-${stat.color}-900/20 dark:to-${stat.color}-800/20 border border-${stat.color}-200 dark:border-${stat.color}-700`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-2xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
              <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas as Categorias</option>
            <option value="learning">Aprendizado</option>
            <option value="xp">Experiência</option>
            <option value="modules">Módulos</option>
            <option value="streak">Sequência</option>
            <option value="badges">Conquistas</option>
            <option value="custom">Personalizada</option>
          </select>
        </div>

        <motion.button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          <span>Nova Meta</span>
        </motion.button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredGoals.map((goal, index) => {
            const progress = getProgressPercentage(goal);
            const daysLeft = getDaysUntilDeadline(goal.deadline);
            const color = getGoalColor(goal.category);
            const isOverdue = daysLeft < 0 && !goal.isCompleted;

            return (
              <motion.div
                key={goal.id}
                className={`relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  goal.isCompleted 
                    ? 'border-green-200 dark:border-green-700' 
                    : isOverdue 
                    ? 'border-red-200 dark:border-red-700'
                    : `border-${color}-200 dark:border-${color}-700`
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${
                  goal.isCompleted 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : isOverdue
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    : `bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`
                }`}>
                  {goal.isCompleted ? 'Concluída' : isOverdue ? 'Atrasada' : 'Ativa'}
                </div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start space-x-3 mb-4">
                    <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`}>
                      {getGoalIcon(goal.category)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {goal.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {goal.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Progresso
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {goal.currentValue}/{goal.targetValue}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <motion.div
                        className={`h-3 rounded-full bg-gradient-to-r ${
                          goal.isCompleted 
                            ? 'from-green-400 to-green-500'
                            : `from-${color}-400 to-${color}-500`
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <div className="text-right mt-1">
                      <span className={`text-sm font-medium ${
                        goal.isCompleted 
                          ? 'text-green-600 dark:text-green-400'
                          : `text-${color}-600 dark:text-${color}-400`
                      }`}>
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {goal.deadline.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className={`flex items-center space-x-1 text-sm font-medium ${
                      isOverdue 
                        ? 'text-red-600 dark:text-red-400'
                        : daysLeft <= 3
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      <Clock className="w-4 h-4" />
                      <span>
                        {isOverdue 
                          ? `${Math.abs(daysLeft)} dias atrás`
                          : daysLeft === 0
                          ? 'Hoje'
                          : `${daysLeft} dias`
                        }
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      goal.priority === 'high' 
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        : goal.priority === 'medium'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {goal.priority === 'high' ? 'Alta' : goal.priority === 'medium' ? 'Média' : 'Baixa'}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingGoal(goal)}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Completion Badge */}
                  {goal.isCompleted && (
                    <motion.div
                      className="absolute inset-0 bg-green-500/10 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="bg-green-500 text-white p-3 rounded-full">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredGoals.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Flag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Nenhuma meta encontrada
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {selectedCategory === 'all' 
              ? 'Comece criando sua primeira meta de aprendizado!'
              : 'Não há metas nesta categoria. Que tal criar uma?'
            }
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Criar Meta
          </button>
        </motion.div>
      )}

      {/* Quick Templates */}
      {goals.length === 0 && (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-500" />
            Metas Sugeridas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goalTemplates.map((template, index) => (
              <motion.button
                key={template.title}
                onClick={() => createGoal(template)}
                className={`p-4 rounded-xl border-2 border-dashed border-${template.color}-300 hover:border-${template.color}-500 hover:bg-${template.color}-50 dark:hover:bg-${template.color}-900/20 transition-all duration-200 text-left`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-lg bg-${template.color}-100 dark:bg-${template.color}-900/30 text-${template.color}-600 dark:text-${template.color}-400`}>
                    {template.icon}
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {template.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {template.description}
                </p>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                  Meta: {template.targetValue} • {template.suggestedDeadline} dias
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GoalsManager;