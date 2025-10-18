import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Smartphone, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Bell, 
  Trash2, 
  HardDrive,
  X,
  Check,
  AlertCircle,
  Info
} from 'lucide-react';
import { usePWA, usePWANotifications, usePWACache } from '../hooks/usePWA';
import { useMicroInteractions } from '../hooks/useMicroInteractions';

interface PWAManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PWAManager: React.FC<PWAManagerProps> = ({ isOpen, onClose }) => {
  const {
    isInstallable,
    isInstalled,
    isOffline,
    isUpdateAvailable,
    installApp,
    updateApp,
    dismissInstall,
    checkForUpdates
  } = usePWA();

  const {
    permission: notificationPermission,
    isSupported: notificationSupported,
    requestPermission,
    showNotification
  } = usePWANotifications();

  const {
    cacheSize,
    isClearing,
    calculateCacheSize,
    clearCache,
    cleanOldCache
  } = usePWACache();

  const { playSound, triggerHaptic } = useMicroInteractions();

  const [isInstalling, setIsInstalling] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  // Mostrar prompt de instalação
  useEffect(() => {
    if (isInstallable && !isInstalled) {
      setShowInstallPrompt(true);
    }
  }, [isInstallable, isInstalled]);

  // Mostrar prompt de atualização
  useEffect(() => {
    if (isUpdateAvailable) {
      setShowUpdatePrompt(true);
    }
  }, [isUpdateAvailable]);

  const handleInstall = async () => {
    setIsInstalling(true);
    triggerHaptic('medium');
    
    try {
      const success = await installApp();
      if (success) {
        playSound(800, 200);
        setShowInstallPrompt(false);
        await showNotification('App Instalado!', {
          body: 'Jurus foi instalado com sucesso no seu dispositivo',
          tag: 'install-success'
        });
      }
    } catch (error) {
      console.error('Erro ao instalar:', error);
      playSound(400, 300);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    triggerHaptic('medium');
    
    try {
      await updateApp();
      playSound(800, 200);
      setShowUpdatePrompt(false);
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      playSound(400, 300);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRequestNotifications = async () => {
    triggerHaptic('light');
    const granted = await requestPermission();
    
    if (granted) {
      playSound(800, 200);
      await showNotification('Notificações Ativadas!', {
        body: 'Você receberá notificações importantes sobre suas simulações',
        tag: 'notifications-enabled'
      });
    } else {
      playSound(400, 300);
    }
  };

  const handleClearCache = async () => {
    triggerHaptic('medium');
    const success = await clearCache();
    
    if (success) {
      playSound(800, 200);
      await showNotification('Cache Limpo!', {
        body: 'O cache do aplicativo foi limpo com sucesso',
        tag: 'cache-cleared'
      });
    } else {
      playSound(400, 300);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getConnectionStatus = () => {
    if (isOffline) {
      return {
        icon: WifiOff,
        text: 'Offline',
        color: 'text-red-500',
        bgColor: 'bg-red-50 dark:bg-red-900/20'
      };
    }
    return {
      icon: Wifi,
      text: 'Online',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    };
  };

  const connectionStatus = getConnectionStatus();

  return (
    <>
      {/* Prompt de Instalação */}
      <AnimatePresence>
        {showInstallPrompt && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-4 right-4 z-50 max-w-sm"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Instalar Jurus
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Instale o app para acesso rápido e uso offline
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleInstall}
                      disabled={isInstalling}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                    >
                      {isInstalling ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Download className="w-3 h-3" />
                      )}
                      Instalar
                    </button>
                    <button
                      onClick={() => {
                        dismissInstall();
                        setShowInstallPrompt(false);
                      }}
                      className="px-3 py-1.5 text-gray-600 dark:text-gray-300 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Agora não
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prompt de Atualização */}
      <AnimatePresence>
        {showUpdatePrompt && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-4 right-4 z-50 max-w-sm"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Atualização Disponível
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Uma nova versão do Jurus está disponível
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleUpdate}
                      disabled={isUpdating}
                      className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                    >
                      {isUpdating ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3 h-3" />
                      )}
                      Atualizar
                    </button>
                    <button
                      onClick={() => setShowUpdatePrompt(false)}
                      className="px-3 py-1.5 text-gray-600 dark:text-gray-300 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Depois
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowUpdatePrompt(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Principal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Gerenciador PWA
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Configure o aplicativo web progressivo
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                {/* Status de Conexão */}
                <div className={`p-4 rounded-lg ${connectionStatus.bgColor}`}>
                  <div className="flex items-center gap-3">
                    <connectionStatus.icon className={`w-5 h-5 ${connectionStatus.color}`} />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Status da Conexão
                      </h3>
                      <p className={`text-sm ${connectionStatus.color}`}>
                        {connectionStatus.text}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instalação */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Instalação
                  </h3>
                  
                  {isInstalled ? (
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Check className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-200">
                          App Instalado
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-300">
                          O Jurus está instalado no seu dispositivo
                        </p>
                      </div>
                    </div>
                  ) : isInstallable ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Info className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-800 dark:text-blue-200">
                            Instalação Disponível
                          </p>
                          <p className="text-sm text-blue-600 dark:text-blue-300">
                            Instale o app para melhor experiência
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleInstall}
                        disabled={isInstalling}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {isInstalling ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        {isInstalling ? 'Instalando...' : 'Instalar App'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          Instalação Não Disponível
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Use um navegador compatível para instalar
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Atualizações */}
                {isInstalled && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Atualizações
                    </h3>
                    
                    {isUpdateAvailable ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <RefreshCw className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium text-green-800 dark:text-green-200">
                              Atualização Disponível
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-300">
                              Uma nova versão está pronta para instalar
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleUpdate}
                          disabled={isUpdating}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          {isUpdating ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                          {isUpdating ? 'Atualizando...' : 'Atualizar Agora'}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              App Atualizado
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Você está usando a versão mais recente
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={checkForUpdates}
                          className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                        >
                          Verificar
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Notificações */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notificações
                  </h3>
                  
                  {!notificationSupported ? (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          Não Suportado
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Seu navegador não suporta notificações
                        </p>
                      </div>
                    </div>
                  ) : notificationPermission === 'granted' ? (
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Check className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-200">
                          Notificações Ativadas
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-300">
                          Você receberá notificações importantes
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <Bell className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="font-medium text-yellow-800 dark:text-yellow-200">
                            Ativar Notificações
                          </p>
                          <p className="text-sm text-yellow-600 dark:text-yellow-300">
                            Receba alertas sobre suas simulações
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRequestNotifications}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        <Bell className="w-4 h-4" />
                        Ativar Notificações
                      </button>
                    </div>
                  )}
                </div>

                {/* Cache */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Armazenamento
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <HardDrive className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">
                            Cache do App
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {formatBytes(cacheSize)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={calculateCacheSize}
                          className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                        >
                          Atualizar
                        </button>
                        <button
                          onClick={cleanOldCache}
                          className="px-3 py-1.5 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-md transition-colors"
                        >
                          Limpar Antigo
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleClearCache}
                      disabled={isClearing}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      {isClearing ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      {isClearing ? 'Limpando...' : 'Limpar Todo Cache'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PWAManager;