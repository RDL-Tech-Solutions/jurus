import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Check, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle,
  Clock,
  Star,
  TrendingUp,
  DollarSign,
  Settings,
  Filter,
  MoreHorizontal,
  Archive,
  Trash2,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { useMicroInteractions } from '../hooks/useMicroInteractions';
import { Z_INDEX } from '../constants/zIndex';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'investment' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: Date;
  read: boolean;
  archived: boolean;
  category: string;
  actionUrl?: string;
  actionLabel?: string;
  data?: Record<string, any>;
  persistent?: boolean;
  sound?: boolean;
  vibration?: boolean;
  channels?: Array<'push' | 'email' | 'sms' | 'in-app'>;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  desktop: boolean;
  email: boolean;
  sms: boolean;
  categories: Record<string, boolean>;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

interface NotificationSystemProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onAction: (notification: Notification) => void;
  settings: NotificationSettings;
  onUpdateSettings: (settings: NotificationSettings) => void;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onArchive,
  onDelete,
  onAction,
  settings,
  onUpdateSettings
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());

  const { useButtonInteraction, playSound, triggerHaptic } = useMicroInteractions();
  const buttonInteraction = useButtonInteraction({ animation: 'scale', haptic: true });

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread' && notification.read) return false;
    if (filter === 'archived' && !notification.archived) return false;
    if (filter !== 'archived' && notification.archived) return false;
    if (selectedCategory !== 'all' && notification.category !== selectedCategory) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;
  const categories = [...new Set(notifications.map(n => n.category))];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'investment': return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'system': return <Settings className="w-5 h-5 text-gray-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50 dark:bg-red-900/10';
      case 'high': return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/10';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
      default: return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return timestamp.toLocaleDateString('pt-BR');
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      onAction(notification);
    }
  };

  const handleBulkAction = (action: 'read' | 'archive' | 'delete') => {
    selectedNotifications.forEach(id => {
      switch (action) {
        case 'read':
          onMarkAsRead(id);
          break;
        case 'archive':
          onArchive(id);
          break;
        case 'delete':
          onDelete(id);
          break;
      }
    });
    setSelectedNotifications(new Set());
  };

  const toggleNotificationSelection = (id: string) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 flex items-start justify-end p-4"
        style={{ zIndex: Z_INDEX.NOTIFICATION_PANEL }}
      >
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Panel */}
        <motion.div
          className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md h-[80vh] flex flex-col"
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notificações
                  </h2>
                  <p className="text-sm text-gray-500">
                    {unreadCount} não lidas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Configurações"
                >
                  <Settings className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Fechar"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas</option>
                <option value="unread">Não lidas</option>
                <option value="archived">Arquivadas</option>
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedNotifications.size > 0 && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  {selectedNotifications.size} selecionadas
                </span>
                <div className="flex items-center gap-1 ml-auto">
                  <motion.button
                    onClick={() => handleBulkAction('read')}
                    className="p-1.5 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Marcar como lidas"
                  >
                    <Check className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleBulkAction('archive')}
                    className="p-1.5 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Arquivar"
                  >
                    <Archive className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleBulkAction('delete')}
                    className="p-1.5 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors text-red-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {unreadCount > 0 && (
              <motion.button
                onClick={onMarkAllAsRead}
                className="w-full mt-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Marcar todas como lidas
              </motion.button>
            )}
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  Configurações de Notificação
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Som</span>
                    <motion.button
                      onClick={() => onUpdateSettings({ ...settings, sound: !settings.sound })}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        settings.sound ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="w-4 h-4 bg-white rounded-full shadow-sm"
                        animate={{ x: settings.sound ? 20 : 2 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Vibração</span>
                    <motion.button
                      onClick={() => onUpdateSettings({ ...settings, vibration: !settings.vibration })}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        settings.vibration ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="w-4 h-4 bg-white rounded-full shadow-sm"
                        animate={{ x: settings.vibration ? 20 : 2 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Desktop</span>
                    <motion.button
                      onClick={() => onUpdateSettings({ ...settings, desktop: !settings.desktop })}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        settings.desktop ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="w-4 h-4 bg-white rounded-full shadow-sm"
                        animate={{ x: settings.desktop ? 20 : 2 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Bell className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhuma notificação
                </h3>
                <p className="text-gray-500 text-sm">
                  {filter === 'unread' 
                    ? 'Você está em dia! Não há notificações não lidas.'
                    : filter === 'archived'
                    ? 'Nenhuma notificação arquivada.'
                    : 'Você não tem notificações no momento.'
                  }
                </p>
              </div>
            ) : (
              <div className="p-2">
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    className={`p-4 mb-2 rounded-xl border-l-4 cursor-pointer transition-all ${
                      getPriorityColor(notification.priority)
                    } ${
                      !notification.read 
                        ? 'border border-blue-200 dark:border-blue-800' 
                        : 'border border-transparent'
                    } ${
                      selectedNotifications.has(notification.id)
                        ? 'ring-2 ring-blue-500'
                        : ''
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNotificationClick(notification)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.has(notification.id)}
                        onChange={() => toggleNotificationSelection(notification.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className={`text-sm font-medium ${
                            !notification.read 
                              ? 'text-gray-900 dark:text-white' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2 ml-2">
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            <div className="relative">
                              <motion.button
                                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Show context menu
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                        </div>

                        <p className={`text-sm mt-1 ${
                          !notification.read 
                            ? 'text-gray-700 dark:text-gray-300' 
                            : 'text-gray-500 dark:text-gray-500'
                        }`}>
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                              {notification.category}
                            </span>
                            {notification.priority === 'urgent' && (
                              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full text-xs font-medium">
                                Urgente
                              </span>
                            )}
                          </div>

                          {notification.actionLabel && (
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAction(notification);
                              }}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {notification.actionLabel}
                            </motion.button>
                          )}
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2 mt-2">
                          {!notification.read && (
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkAsRead(notification.id);
                              }}
                              className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Marcar como lida"
                            >
                              <Check className="w-3 h-3" />
                            </motion.button>
                          )}
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              onArchive(notification.id);
                            }}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Arquivar"
                          >
                            <Archive className="w-3 h-3" />
                          </motion.button>
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(notification.id);
                            }}
                            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Excluir"
                          >
                            <Trash2 className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Hook para gerenciar notificações
export const useNotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    if (typeof window === 'undefined') {
      return {
        enabled: true,
        sound: true,
        vibration: true,
        desktop: true,
        email: false,
        sms: false,
        categories: {},
        quietHours: { enabled: false, start: '22:00', end: '08:00' },
        frequency: 'immediate'
      };
    }
    
    const saved = localStorage.getItem('notification-settings');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      sound: true,
      vibration: true,
      desktop: true,
      email: false,
      sms: false,
      categories: {},
      quietHours: { enabled: false, start: '22:00', end: '08:00' },
      frequency: 'immediate'
    };
  });

  useEffect(() => {
    localStorage.setItem('notification-settings', JSON.stringify(settings));
  }, [settings]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'archived'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
      archived: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Play sound if enabled
    if (settings.sound && notification.sound !== false) {
      const audio = new Audio('/notification-sound.mp3');
      audio.play().catch(() => {});
    }

    // Trigger vibration if enabled
    if (settings.vibration && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    // Show desktop notification if enabled
    if (settings.desktop && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: newNotification.id
      });
    }

    return newNotification.id;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const archiveNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, archived: true } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const updateSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
  };

  const requestPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  };

  return {
    notifications,
    settings,
    addNotification,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    updateSettings,
    requestPermission
  };
};