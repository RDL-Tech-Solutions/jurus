import React, { useState } from 'react';
import { 
  Download, 
  RefreshCw, 
  Trash2, 
  Wifi, 
  WifiOff, 
  Smartphone, 
  X,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { usePWA, usePWACache } from '../hooks/usePWA';

interface PWAControlsProps {
  className?: string;
}

const PWAControls: React.FC<PWAControlsProps> = ({ className = '' }) => {
  const {
    isInstallable,
    isInstalled,
    isOffline,
    isUpdateAvailable,
    installApp,
    updateApp,
    dismissInstall
  } = usePWA();

  const {
    cacheSize,
    clearCache,
    calculateCacheSize
  } = usePWACache();

  const isOnline = !isOffline;

  const [isLoading, setIsLoading] = useState(false);
  const [showCacheDetails, setShowCacheDetails] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleInstall = async () => {
    setIsLoading(true);
    try {
      await installApp();
      showNotification('success', 'App instalado com sucesso!');
    } catch (error) {
      showNotification('error', 'Erro ao instalar o app');
      console.error('Erro na instalação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateApp();
      showNotification('success', 'App atualizado com sucesso!');
    } catch (error) {
      showNotification('error', 'Erro ao atualizar o app');
      console.error('Erro na atualização:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = async () => {
    if (!confirm('Tem certeza que deseja limpar todo o cache? Isso pode afetar a performance offline.')) {
      return;
    }

    setIsLoading(true);
    try {
      await clearCache();
      showNotification('success', 'Cache limpo com sucesso!');
    } catch (error) {
      showNotification('error', 'Erro ao limpar cache');
      console.error('Erro ao limpar cache:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshCache = async () => {
    setIsLoading(true);
    try {
      await calculateCacheSize();
      // showNotification('success', 'Status do cache atualizado');
    } catch (error) {
      console.error('Erro ao atualizar cache:', error);
      // showNotification('error', 'Erro ao atualizar status do cache');
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalCacheEntries = (): string => {
    return typeof cacheSize === 'string' ? cacheSize : '0 KB';
  };

  const getConnectionIcon = () => {
    return isOnline ? (
      <Wifi className="w-4 h-4 text-green-600" />
    ) : (
      <WifiOff className="w-4 h-4 text-red-600" />
    );
  };

  const getNotificationIcon = () => {
    switch (notification?.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Notificação */}
      {notification && (
        <div className={`flex items-center space-x-3 p-4 rounded-lg border ${
          notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
          notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
          'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          {getNotificationIcon()}
          <span className="flex-1 text-sm font-medium">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Prompt de Instalação */}
      {isInstallable && !isInstalled && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Smartphone className="w-6 h-6 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900">
                Instalar Jurus
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Instale o Jurus no seu dispositivo para acesso rápido e funcionalidades offline.
              </p>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={handleInstall}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Instalar</span>
                </button>
                <button
                  onClick={dismissInstall}
                  className="px-3 py-2 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-100"
                >
                  Agora não
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notificação de Atualização */}
      {isUpdateAvailable && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <RefreshCw className="w-6 h-6 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-orange-900">
                Atualização Disponível
              </h3>
              <p className="text-sm text-orange-700 mt-1">
                Uma nova versão do Jurus está disponível com melhorias e correções.
              </p>
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="flex items-center space-x-2 px-3 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 disabled:opacity-50 mt-3"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Atualizar Agora</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status da Conexão e Cache */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Status PWA
          </h3>
          <div className="flex items-center space-x-2">
            {getConnectionIcon()}
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Status de Instalação */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Status da Instalação
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isInstalled 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {isInstalled ? 'Instalado' : 'Não Instalado'}
            </span>
          </div>

          {/* Cache Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Itens em Cache
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {getTotalCacheEntries()}
              </span>
              <button
                onClick={() => setShowCacheDetails(!showCacheDetails)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {showCacheDetails ? 'Ocultar' : 'Detalhes'}
              </button>
            </div>
          </div>

          {/* Detalhes do Cache */}
          {showCacheDetails && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">
                  Tamanho Total do Cache
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {cacheSize || '0 KB'}
                </span>
              </div>
            </div>
          )}

          {/* Controles */}
          <div className="flex space-x-2 pt-2 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={handleRefreshCache}
              disabled={isLoading}
              className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Atualizar</span>
            </button>
            <button
              onClick={handleClearCache}
              disabled={isLoading}
              className="flex items-center space-x-1 px-2 py-1 text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              <Trash2 className="w-3 h-3" />
              <span>Limpar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-900 dark:text-white">Processando...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PWAControls;