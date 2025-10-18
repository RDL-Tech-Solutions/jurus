import { useState, useEffect, useCallback } from 'react';

interface PWAInstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  isUpdateAvailable: boolean;
  installPrompt: PWAInstallPrompt | null;
}

interface PWAActions {
  installApp: () => Promise<boolean>;
  updateApp: () => Promise<void>;
  dismissInstall: () => void;
  checkForUpdates: () => Promise<void>;
}

export function usePWA(): PWAState & PWAActions {
  const [state, setState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOffline: !navigator.onLine,
    isUpdateAvailable: false,
    installPrompt: null
  });

  // Verificar se o app já está instalado
  const checkIfInstalled = useCallback(() => {
    const isInstalled = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');
    
    setState(prev => ({ ...prev, isInstalled }));
  }, []);

  // Registrar service worker
  const registerServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        console.log('[PWA] Service Worker registered:', registration);

        // Verificar atualizações
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState(prev => ({ ...prev, isUpdateAvailable: true }));
              }
            });
          }
        });

        // Verificar atualizações periodicamente
        setInterval(() => {
          registration.update();
        }, 60000); // A cada minuto

        return registration;
      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
        return null;
      }
    }
    return null;
  }, []);

  // Instalar o app
  const installApp = useCallback(async (): Promise<boolean> => {
    if (!state.installPrompt) {
      return false;
    }

    try {
      await state.installPrompt.prompt();
      const choiceResult = await state.installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setState(prev => ({ 
          ...prev, 
          isInstallable: false, 
          installPrompt: null,
          isInstalled: true 
        }));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[PWA] Install failed:', error);
      return false;
    }
  }, [state.installPrompt]);

  // Atualizar o app
  const updateApp = useCallback(async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration?.waiting) {
        // Enviar mensagem para o service worker ativar a atualização
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Recarregar a página após a ativação
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });
      }
    }
  }, []);

  // Dispensar prompt de instalação
  const dismissInstall = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isInstallable: false, 
      installPrompt: null 
    }));
  }, []);

  // Verificar atualizações manualmente
  const checkForUpdates = useCallback(async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
      }
    }
  }, []);

  // Efeitos
  useEffect(() => {
    checkIfInstalled();
    registerServiceWorker();

    // Listener para prompt de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setState(prev => ({ 
        ...prev, 
        isInstallable: true, 
        installPrompt: e as PWAInstallPrompt 
      }));
    };

    // Listener para mudanças de conectividade
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOffline: false }));
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOffline: true }));
    };

    // Listener para mudanças no display mode
    const handleDisplayModeChange = () => {
      checkIfInstalled();
    };

    // Adicionar listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addListener(handleDisplayModeChange);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      mediaQuery.removeListener(handleDisplayModeChange);
    };
  }, [checkIfInstalled, registerServiceWorker]);

  return {
    ...state,
    installApp,
    updateApp,
    dismissInstall,
    checkForUpdates
  };
}

// Hook para notificações PWA
export function usePWANotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('Notification' in window);
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('[PWA] Notification permission request failed:', error);
      return false;
    }
  }, [isSupported]);

  const showNotification = useCallback(async (
    title: string, 
    options?: NotificationOptions
  ): Promise<boolean> => {
    if (permission !== 'granted') {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration) {
        await registration.showNotification(title, {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          ...options
        });
      } else {
        new Notification(title, {
          icon: '/icons/icon-192x192.png',
          ...options
        });
      }
      
      return true;
    } catch (error) {
      console.error('[PWA] Show notification failed:', error);
      return false;
    }
  }, [permission]);

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification
  };
}

// Hook para cache management
export function usePWACache() {
  const [cacheSize, setCacheSize] = useState<number>(0);
  const [isClearing, setIsClearing] = useState(false);

  const calculateCacheSize = useCallback(async (): Promise<number> => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        let totalSize = 0;

        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const requests = await cache.keys();
          
          for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
              const blob = await response.blob();
              totalSize += blob.size;
            }
          }
        }

        setCacheSize(totalSize);
        return totalSize;
      } catch (error) {
        console.error('[PWA] Cache size calculation failed:', error);
        return 0;
      }
    }
    return 0;
  }, []);

  const clearCache = useCallback(async (): Promise<boolean> => {
    if ('caches' in window) {
      setIsClearing(true);
      
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        
        setCacheSize(0);
        setIsClearing(false);
        return true;
      } catch (error) {
        console.error('[PWA] Cache clearing failed:', error);
        setIsClearing(false);
        return false;
      }
    }
    return false;
  }, []);

  const cleanOldCache = useCallback(async (): Promise<boolean> => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration?.active) {
          registration.active.postMessage({ type: 'CLEAN_CACHE' });
          await calculateCacheSize();
          return true;
        }
      } catch (error) {
        console.error('[PWA] Old cache cleaning failed:', error);
      }
    }
    return false;
  }, [calculateCacheSize]);

  useEffect(() => {
    calculateCacheSize();
  }, [calculateCacheSize]);

  return {
    cacheSize,
    isClearing,
    calculateCacheSize,
    clearCache,
    cleanOldCache
  };
}