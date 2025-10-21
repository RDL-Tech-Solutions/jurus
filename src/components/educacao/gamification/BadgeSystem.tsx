import React from 'react';
import { motion } from 'framer-motion';
import { Badge, BadgeRarity } from '../../../types/educacaoFinanceira';
import { Award, Star, Crown, Gem } from 'lucide-react';

interface BadgeSystemProps {
  badges: Badge[];
  className?: string;
  showUnlocked?: boolean;
  onBadgeClick?: (badge: Badge) => void;
}

const BadgeSystem: React.FC<BadgeSystemProps> = ({
  badges,
  className = '',
  showUnlocked = true,
  onBadgeClick
}) => {
  const getRarityColor = (rarity: BadgeRarity): string => {
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
        return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityIcon = (rarity: BadgeRarity) => {
    switch (rarity) {
      case 'common':
        return <Award className="w-4 h-4" />;
      case 'rare':
        return <Star className="w-4 h-4" />;
      case 'epic':
        return <Crown className="w-4 h-4" />;
      case 'legendary':
        return <Gem className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  const getRarityName = (rarity: BadgeRarity): string => {
    switch (rarity) {
      case 'common':
        return 'Comum';
      case 'rare':
        return 'Raro';
      case 'epic':
        return 'Épico';
      case 'legendary':
        return 'Lendário';
      default:
        return 'Comum';
    }
  };

  const filteredBadges = showUnlocked 
    ? badges.filter(badge => badge.unlockedAt)
    : badges;

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {filteredBadges.map((badge, index) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            relative p-4 rounded-xl cursor-pointer transition-all duration-300
            ${badge.unlockedAt 
              ? `bg-gradient-to-br ${getRarityColor(badge.rarity)} shadow-lg hover:shadow-xl` 
              : 'bg-gray-200 dark:bg-gray-700 opacity-50'
            }
          `}
          onClick={() => onBadgeClick?.(badge)}
        >
          {/* Badge Icon */}
          <div className="flex justify-center mb-3">
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center text-2xl
              ${badge.unlockedAt 
                ? 'bg-white/20 backdrop-blur-sm' 
                : 'bg-gray-300 dark:bg-gray-600'
              }
            `}>
              {badge.icon}
            </div>
          </div>

          {/* Badge Info */}
          <div className="text-center">
            <h3 className={`
              font-semibold text-sm mb-1
              ${badge.unlockedAt ? 'text-white' : 'text-gray-500 dark:text-gray-400'}
            `}>
              {badge.name}
            </h3>
            
            <p className={`
              text-xs mb-2
              ${badge.unlockedAt ? 'text-white/80' : 'text-gray-400 dark:text-gray-500'}
            `}>
              {badge.description}
            </p>

            {/* Rarity Indicator */}
            <div className={`
              flex items-center justify-center gap-1 text-xs
              ${badge.unlockedAt ? 'text-white/90' : 'text-gray-400'}
            `}>
              {getRarityIcon(badge.rarity)}
              <span>{getRarityName(badge.rarity)}</span>
            </div>
          </div>

          {/* Unlock Date */}
          {badge.unlockedAt && (
            <div className="absolute top-2 right-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
          )}

          {/* Locked Overlay */}
          {!badge.unlockedAt && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
              <div className="text-gray-500 dark:text-gray-400">
                🔒
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default BadgeSystem;