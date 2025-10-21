import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, BookOpen, Calculator, Trophy, Library } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${className}`} 
    />
  );
};

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  type?: 'default' | 'education' | 'calculator' | 'progress' | 'content';
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = 'Carregando...', 
  type = 'default' 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'education':
        return <BookOpen className="w-8 h-8 text-blue-500" />;
      case 'calculator':
        return <Calculator className="w-8 h-8 text-green-500" />;
      case 'progress':
        return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 'content':
        return <Library className="w-8 h-8 text-purple-500" />;
      default:
        return <LoadingSpinner size="lg" className="text-blue-500" />;
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl max-w-sm mx-4"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="flex justify-center mb-4"
          >
            {getIcon()}
          </motion.div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {message}
          </h3>
          
          <div className="flex justify-center">
            <motion.div
              className="flex space-x-1"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'rectangular' 
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';
  
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full'
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`} 
    />
  );
};

interface CardSkeletonProps {
  showAvatar?: boolean;
  lines?: number;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ 
  showAvatar = false, 
  lines = 3 
}) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
      <div className="flex items-start space-x-4">
        {showAvatar && (
          <Skeleton variant="circular" className="w-12 h-12 flex-shrink-0" />
        )}
        
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton 
              key={i} 
              className={`h-4 ${i === lines - 1 ? 'w-1/2' : 'w-full'}`} 
            />
          ))}
          
          <div className="flex space-x-2 pt-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface PageLoadingProps {
  title?: string;
  description?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({ 
  title = 'Carregando página...', 
  description = 'Preparando o conteúdo para você' 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-4"
      >
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity }
          }}
          className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
        >
          <BookOpen className="w-8 h-8 text-white" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {description}
        </p>
        
        <div className="flex justify-center space-x-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};