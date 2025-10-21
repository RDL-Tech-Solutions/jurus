import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Trophy, Star, Target } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'achievement';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const NotificationItem: React.FC<NotificationProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(notification.id), 300);
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.duration, notification.id, onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'achievement':
        return <Trophy className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200';
      case 'achievement':
        return 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-800 dark:from-purple-900/20 dark:to-pink-900/20 dark:border-purple-800 dark:text-purple-200';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-200';
    }
  };

  const getIconColors = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'info':
        return 'text-blue-600 dark:text-blue-400';
      case 'achievement':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        x: isVisible ? 0 : 300, 
        scale: isVisible ? 1 : 0.3 
      }}
      exit={{ opacity: 0, x: 300, scale: 0.3 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        relative p-4 rounded-lg border shadow-lg backdrop-blur-sm max-w-sm w-full
        ${getColors()}
        ${notification.type === 'achievement' ? 'ring-2 ring-purple-300 dark:ring-purple-700' : ''}
      `}
    >
      {notification.type === 'achievement' && (
        <div className="absolute -top-1 -right-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current animate-pulse" />
        </div>
      )}
      
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${getIconColors()}`}>
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm mb-1">
            {notification.title}
          </h4>
          <p className="text-sm opacity-90">
            {notification.message}
          </p>
          
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="mt-2 text-xs font-medium underline hover:no-underline transition-all"
            >
              {notification.action.label}
            </button>
          )}
        </div>
        
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(notification.id), 300);
          }}
          className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {notification.duration && notification.duration > 0 && (
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: notification.duration / 1000, ease: "linear" }}
          className="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-b-lg"
        />
      )}
    </motion.div>
  );
};

interface NotificationContainerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onClose,
  position = 'top-right'
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div className={`fixed z-50 ${getPositionClasses()}`}>
      <div className="space-y-3">
        <AnimatePresence>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={onClose}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Hook para gerenciar notificações
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Funções de conveniência
  const success = (title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'success', title, message, ...options });
  };

  const error = (title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'error', title, message, duration: 0, ...options });
  };

  const warning = (title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'warning', title, message, ...options });
  };

  const info = (title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'info', title, message, ...options });
  };

  const achievement = (title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ 
      type: 'achievement', 
      title, 
      message, 
      duration: 8000,
      ...options 
    });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
    achievement
  };
};