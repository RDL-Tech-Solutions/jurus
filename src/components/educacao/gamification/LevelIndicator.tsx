import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface LevelIndicatorProps {
  currentLevel: number;
  currentXP: number;
  xpForNextLevel: number;
  totalXP?: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LevelIndicator: React.FC<LevelIndicatorProps> = ({
  currentLevel,
  currentXP,
  xpForNextLevel,
  totalXP,
  showDetails = true,
  size = 'md',
  className = ''
}) => {
  const xpProgress = currentXP % xpForNextLevel;
  const progressPercentage = (xpProgress / xpForNextLevel) * 100;

  const getLevelIcon = (level: number) => {
    if (level >= 50) return <Trophy className="w-full h-full text-yellow-400" />;
    if (level >= 25) return <Star className="w-full h-full text-purple-400" />;
    return <Zap className="w-full h-full text-blue-400" />;
  };

  const getLevelColor = (level: number) => {
    if (level >= 50) return 'from-yellow-400 to-orange-500';
    if (level >= 25) return 'from-purple-400 to-purple-600';
    if (level >= 10) return 'from-blue-400 to-blue-600';
    return 'from-green-400 to-green-600';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'w-12 h-12',
          text: 'text-xs',
          level: 'text-lg'
        };
      case 'md':
        return {
          container: 'w-16 h-16',
          text: 'text-sm',
          level: 'text-xl'
        };
      case 'lg':
        return {
          container: 'w-20 h-20',
          text: 'text-base',
          level: 'text-2xl'
        };
      default:
        return {
          container: 'w-16 h-16',
          text: 'text-sm',
          level: 'text-xl'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Level Circle */}
      <div className="relative">
        <motion.div
          className={`
            ${sizeClasses.container} rounded-full
            bg-gradient-to-br ${getLevelColor(currentLevel)}
            flex items-center justify-center
            shadow-lg border-4 border-white dark:border-gray-800
            relative overflow-hidden
          `}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Background Icon */}
          <div className="absolute inset-2 opacity-20">
            {getLevelIcon(currentLevel)}
          </div>

          {/* Level Number */}
          <span className={`
            ${sizeClasses.level} font-bold text-white z-10
            drop-shadow-lg
          `}>
            {currentLevel}
          </span>

          {/* Animated ring for level up */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/50"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        </motion.div>

        {/* XP Progress Ring */}
        <svg
          className={`absolute inset-0 ${sizeClasses.container} -rotate-90`}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="3"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
            animate={{ 
              strokeDashoffset: 2 * Math.PI * 45 * (1 - progressPercentage / 100)
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
      </div>

      {/* Level Details */}
      {showDetails && (
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`${sizeClasses.text} font-semibold text-gray-800 dark:text-gray-200`}>
              Nível {currentLevel}
            </h3>
            <span className={`${sizeClasses.text} text-gray-600 dark:text-gray-400`}>
              {xpProgress.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
            </span>
          </div>

          <ProgressBar
            current={xpProgress}
            total={xpForNextLevel}
            color={currentLevel >= 25 ? 'purple' : currentLevel >= 10 ? 'blue' : 'green'}
            size={size === 'lg' ? 'md' : 'sm'}
            showPercentage={false}
            showNumbers={false}
          />

          {totalXP && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Total: {totalXP.toLocaleString()} XP
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default LevelIndicator;