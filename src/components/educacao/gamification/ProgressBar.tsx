import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  showNumbers?: boolean;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label,
  showPercentage = true,
  showNumbers = false,
  color = 'blue',
  size = 'md',
  animated = true,
  className = ''
}) => {
  const percentage = Math.min((current / total) * 100, 100);
  
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-500',
          gradient: 'from-blue-400 to-blue-600'
        };
      case 'green':
        return {
          bg: 'bg-green-500',
          gradient: 'from-green-400 to-green-600'
        };
      case 'purple':
        return {
          bg: 'bg-purple-500',
          gradient: 'from-purple-400 to-purple-600'
        };
      case 'orange':
        return {
          bg: 'bg-orange-500',
          gradient: 'from-orange-400 to-orange-600'
        };
      case 'red':
        return {
          bg: 'bg-red-500',
          gradient: 'from-red-400 to-red-600'
        };
      default:
        return {
          bg: 'bg-blue-500',
          gradient: 'from-blue-400 to-blue-600'
        };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'h-2';
      case 'md':
        return 'h-3';
      case 'lg':
        return 'h-4';
      default:
        return 'h-3';
    }
  };

  const colorClasses = getColorClasses(color);
  const sizeClasses = getSizeClasses(size);

  return (
    <div className={`w-full ${className}`}>
      {/* Label and Stats */}
      {(label || showPercentage || showNumbers) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            {showNumbers && (
              <span>
                {current.toLocaleString()} / {total.toLocaleString()}
              </span>
            )}
            {showPercentage && (
              <span className="font-medium">
                {percentage.toFixed(0)}%
              </span>
            )}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className={`
        w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden
        ${sizeClasses}
      `}>
        <motion.div
          className={`
            h-full bg-gradient-to-r ${colorClasses.gradient} rounded-full
            relative overflow-hidden
          `}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: animated ? 1 : 0,
            ease: "easeOut"
          }}
        >
          {/* Animated shine effect */}
          {animated && percentage > 0 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>
      </div>

      {/* Milestone markers (optional) */}
      {total > 0 && (
        <div className="relative mt-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>0</span>
            {total >= 4 && (
              <>
                <span>{Math.round(total * 0.25)}</span>
                <span>{Math.round(total * 0.5)}</span>
                <span>{Math.round(total * 0.75)}</span>
              </>
            )}
            <span>{total}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;