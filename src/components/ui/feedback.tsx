import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Loader2, AlertCircle, Info, Zap, Star, Trophy } from 'lucide-react';

interface FeedbackProps {
  type: 'loading' | 'success' | 'error' | 'info' | 'achievement';
  message: string;
  isVisible: boolean;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const Feedback: React.FC<FeedbackProps> = ({
  type,
  message,
  isVisible,
  onClose,
  autoClose = true,
  duration = 3000
}) => {
  useEffect(() => {
    if (isVisible && autoClose && type !== 'loading') {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose, type]);

  const getIcon = () => {
    switch (type) {
      case 'loading':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'achievement':
        return <Trophy className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'loading':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200';
      case 'achievement':
        return 'bg-gradient-to-r from-purple-50 to-yellow-50 border-purple-200 text-purple-800 dark:from-purple-900/20 dark:to-yellow-900/20 dark:border-purple-800 dark:text-purple-200';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-200';
    }
  };

  const getIconColors = () => {
    switch (type) {
      case 'loading':
        return 'text-blue-600 dark:text-blue-400';
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'info':
        return 'text-blue-600 dark:text-blue-400';
      case 'achievement':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`
            fixed top-4 left-1/2 transform -translate-x-1/2 z-50
            p-4 rounded-lg border shadow-lg backdrop-blur-sm
            flex items-center gap-3 min-w-80 max-w-md
            ${getColors()}
            ${type === 'achievement' ? 'ring-2 ring-purple-300 dark:ring-purple-700' : ''}
          `}
        >
          {type === 'achievement' && (
            <div className="absolute -top-1 -right-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current animate-pulse" />
            </div>
          )}
          
          <div className={`flex-shrink-0 ${getIconColors()}`}>
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">
              {message}
            </p>
          </div>
          
          {onClose && type !== 'loading' && (
            <button
              onClick={onClose}
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook para gerenciar feedback
export const useFeedback = () => {
  const [feedback, setFeedback] = useState<{
    type: FeedbackProps['type'];
    message: string;
    isVisible: boolean;
  } | null>(null);

  const showFeedback = (type: FeedbackProps['type'], message: string) => {
    setFeedback({ type, message, isVisible: true });
  };

  const hideFeedback = () => {
    setFeedback(prev => prev ? { ...prev, isVisible: false } : null);
  };

  const loading = (message: string = 'Carregando...') => {
    showFeedback('loading', message);
  };

  const success = (message: string) => {
    showFeedback('success', message);
  };

  const error = (message: string) => {
    showFeedback('error', message);
  };

  const info = (message: string) => {
    showFeedback('info', message);
  };

  const achievement = (message: string) => {
    showFeedback('achievement', message);
  };

  return {
    feedback,
    showFeedback,
    hideFeedback,
    loading,
    success,
    error,
    info,
    achievement
  };
};

// Componente de botão com feedback integrado
interface ButtonWithFeedbackProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  onAsyncClick?: () => Promise<void>;
}

export const ButtonWithFeedback: React.FC<ButtonWithFeedbackProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText = 'Carregando...',
  successText = 'Sucesso!',
  errorText = 'Erro!',
  onAsyncClick,
  onClick,
  disabled,
  className = '',
  ...props
}) => {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { feedback, loading, success, error, hideFeedback } = useFeedback();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onAsyncClick) {
      setState('loading');
      loading(loadingText);
      
      try {
        await onAsyncClick();
        setState('success');
        success(successText);
        setTimeout(() => {
          setState('idle');
          hideFeedback();
        }, 2000);
      } catch (err) {
        setState('error');
        error(errorText);
        setTimeout(() => {
          setState('idle');
          hideFeedback();
        }, 3000);
      }
    } else if (onClick) {
      onClick(e);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white border-transparent';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white border-transparent';
      case 'outline':
        return 'bg-transparent hover:bg-gray-50 text-gray-700 border-gray-300 dark:hover:bg-gray-800 dark:text-gray-300 dark:border-gray-600';
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent dark:hover:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white border-transparent';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const isDisabled = disabled || isLoading || state === 'loading';

  return (
    <>
      <motion.button
        whileHover={{ scale: isDisabled ? 1 : 1.02 }}
        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
        onClick={handleClick}
        disabled={isDisabled}
        className={`
          relative inline-flex items-center justify-center gap-2
          font-medium rounded-lg border transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${getVariantClasses()}
          ${getSizeClasses()}
          ${className}
        `}
      >
        {(isLoading || state === 'loading') && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        {state === 'success' && (
          <CheckCircle className="w-4 h-4" />
        )}
        {state === 'error' && (
          <AlertCircle className="w-4 h-4" />
        )}
        {children}
      </motion.button>

      {feedback && (
        <Feedback
          type={feedback.type}
          message={feedback.message}
          isVisible={feedback.isVisible}
          onClose={hideFeedback}
        />
      )}
    </>
  );
};

// Componente de progresso com feedback visual
interface ProgressWithFeedbackProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const ProgressWithFeedback: React.FC<ProgressWithFeedbackProps> = ({
  value,
  max,
  label,
  showPercentage = true,
  color = 'blue',
  size = 'md',
  animated = true
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const [prevPercentage, setPrevPercentage] = useState(percentage);

  useEffect(() => {
    setPrevPercentage(percentage);
  }, [percentage]);

  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      case 'purple':
        return 'bg-purple-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'red':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getSizeClasses = () => {
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

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${getSizeClasses()}`}>
        <motion.div
          initial={{ width: `${prevPercentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: animated ? 0.5 : 0, 
            ease: "easeOut" 
          }}
          className={`${getSizeClasses()} ${getColorClasses()} rounded-full relative`}
        >
          {animated && percentage > prevPercentage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-white/30 rounded-full"
            />
          )}
        </motion.div>
      </div>
      
      {value !== undefined && max !== undefined && (
        <div className="flex justify-between items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
};