import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Star, Crown, Gem, Sparkles } from 'lucide-react';
import { Badge, Achievement } from '../../../types/educacaoFinanceira';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement?: Achievement;
  badge?: Badge;
  type: 'achievement' | 'badge' | 'level-up';
  newLevel?: number;
  xpEarned?: number;
}

const AchievementModal: React.FC<AchievementModalProps> = ({
  isOpen,
  onClose,
  achievement,
  badge,
  type,
  newLevel,
  xpEarned
}) => {
  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-400 to-gray-600';
      case 'rare':
        return 'from-blue-400 to-blue-600';
      case 'epic':
        return 'from-purple-400 to-purple-600';
      case 'legendary':
        return 'from-yellow-400 to-orange-500';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  const getRarityIcon = (rarity?: string) => {
    switch (rarity) {
      case 'common':
        return <Award className="w-8 h-8" />;
      case 'rare':
        return <Star className="w-8 h-8" />;
      case 'epic':
        return <Crown className="w-8 h-8" />;
      case 'legendary':
        return <Gem className="w-8 h-8" />;
      default:
        return <Award className="w-8 h-8" />;
    }
  };

  const getTypeContent = () => {
    switch (type) {
      case 'achievement':
        return {
          title: 'Conquista Desbloqueada!',
          subtitle: achievement?.name || '',
          description: achievement?.description || '',
          icon: '🏆',
          color: 'from-yellow-400 to-orange-500'
        };
      case 'badge':
        return {
          title: 'Nova Medalha!',
          subtitle: badge?.name || '',
          description: badge?.description || '',
          icon: badge?.icon || '🏅',
          color: getRarityColor(badge?.rarity)
        };
      case 'level-up':
        return {
          title: 'Nível Aumentado!',
          subtitle: `Nível ${newLevel}`,
          description: `Parabéns! Você alcançou o nível ${newLevel}!`,
          icon: '⭐',
          color: 'from-purple-400 to-purple-600'
        };
      default:
        return {
          title: 'Parabéns!',
          subtitle: '',
          description: '',
          icon: '🎉',
          color: 'from-blue-400 to-blue-600'
        };
    }
  };

  const content = getTypeContent();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md mx-auto"
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className={`
              bg-gradient-to-br ${content.color}
              rounded-2xl shadow-2xl overflow-hidden
              border-4 border-white/20
            `}>
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Animated Background */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/20 rounded-full"
                    initial={{
                      x: Math.random() * 400,
                      y: Math.random() * 600,
                      scale: 0
                    }}
                    animate={{
                      y: -100,
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative p-8 text-center text-white">
                {/* Main Icon */}
                <motion.div
                  className="mb-6"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                >
                  <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center text-4xl backdrop-blur-sm">
                    {content.icon}
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  className="text-2xl font-bold mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {content.title}
                </motion.h2>

                {/* Subtitle */}
                <motion.h3
                  className="text-xl font-semibold mb-3 text-white/90"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {content.subtitle}
                </motion.h3>

                {/* Description */}
                <motion.p
                  className="text-white/80 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {content.description}
                </motion.p>

                {/* XP Reward */}
                {(xpEarned || achievement?.xpReward) && (
                  <motion.div
                    className="flex items-center justify-center gap-2 mb-6 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span className="font-semibold">
                      +{xpEarned || achievement?.xpReward} XP
                    </span>
                  </motion.div>
                )}

                {/* Badge Rarity */}
                {badge && (
                  <motion.div
                    className="flex items-center justify-center gap-2 mb-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    {getRarityIcon(badge.rarity)}
                    <span className="font-semibold capitalize">
                      {badge.rarity === 'common' && 'Comum'}
                      {badge.rarity === 'rare' && 'Raro'}
                      {badge.rarity === 'epic' && 'Épico'}
                      {badge.rarity === 'legendary' && 'Lendário'}
                    </span>
                  </motion.div>
                )}

                {/* Action Button */}
                <motion.button
                  onClick={onClose}
                  className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-colors backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continuar
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementModal;