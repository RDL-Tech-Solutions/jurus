import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  cpuUsage: number;
  networkLatency: number;
  cacheHitRate: number;
  errorRate: number;
  userInteractionDelay: number;
  bundleSize: number;
  loadTime: number;
  fps: number;
}

export interface OptimizationConfig {
  enableLazyLoading: boolean;
  enableVirtualization: boolean;
  enableMemoization: boolean;
  enableServiceWorker: boolean;
  enableCompression: boolean;
  enableCaching: boolean;
  maxCacheSize: number;
  debounceDelay: number;
  throttleDelay: number;
  enablePreloading: boolean;
  enableCodeSplitting: boolean;
  enableImageOptimization: boolean;
  enableAnalytics: boolean;
  performanceTarget: 'low' | 'medium' | 'high' | 'ultra';
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccess: number;
}

export interface WorkerTask {
  id: string;
  type: 'calculation' | 'simulation' | 'analysis' | 'processing';
  data: any;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'running' | 'completed' | 'error';
  result?: any;
  error?: string;
  startTime?: number;
  endTime?: number;
}

export const usePerformanceOptimization = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    networkLatency: 0,
    cacheHitRate: 0,
    errorRate: 0,
    userInteractionDelay: 0,
    bundleSize: 0,
    loadTime: 0,
    fps: 0
  });

  const [config, setConfig] = useLocalStorage<OptimizationConfig>('performance-config', {
    enableLazyLoading: true,
    enableVirtualization: true,
    enableMemoization: true,
    enableServiceWorker: true,
    enableCompression: true,
    enableCaching: true,
    maxCacheSize: 100,
    debounceDelay: 300,
    throttleDelay: 100,
    enablePreloading: true,
    enableCodeSplitting: true,
    enableImageOptimization: true,
    enableAnalytics: true,
    performanceTarget: 'high'
  });

  const [cache, setCache] = useState<Map<string, CacheEntry>>(new Map());
  const [workerTasks, setWorkerTasks] = useState<WorkerTask[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const performanceObserver = useRef<PerformanceObserver | null>(null);
  const webWorker = useRef<Worker | null>(null);
  const frameId = useRef<number>(0);
  const lastFrameTime = useRef<number>(0);
  const fpsCounter = useRef<number>(0);

  // Cache inteligente com TTL e LRU
  const smartCache = useMemo(() => ({
    get: <T>(key: string): T | null => {
      const entry = cache.get(key);
      if (!entry) return null;
      
      const now = Date.now();
      if (now - entry.timestamp > entry.ttl) {
        cache.delete(key);
        return null;
      }
      
      // Atualizar estatísticas de acesso
      entry.accessCount++;
      entry.lastAccess = now;
      
      return entry.data as T;
    },
    
    set: <T>(key: string, data: T, ttl: number = 300000): void => {
      const now = Date.now();
      
      // Verificar limite de cache
      if (cache.size >= config.maxCacheSize) {
        // Remover entrada menos recentemente usada
        let oldestKey = '';
        let oldestTime = now;
        
        cache.forEach((entry, k) => {
          if (entry.lastAccess < oldestTime) {
            oldestTime = entry.lastAccess;
            oldestKey = k;
          }
        });
        
        if (oldestKey) {
          cache.delete(oldestKey);
        }
      }
      
      const newCache = new Map(cache);
      newCache.set(key, {
        data,
        timestamp: now,
        ttl,
        accessCount: 1,
        lastAccess: now
      });
      
      setCache(newCache);
    },
    
    clear: (): void => {
      setCache(new Map());
    },
    
    size: (): number => cache.size,
    
    getStats: () => {
      const totalAccess = Array.from(cache.values()).reduce((sum, entry) => sum + entry.accessCount, 0);
      const hitRate = totalAccess > 0 ? (cache.size / totalAccess) * 100 : 0;
      
      return {
        size: cache.size,
        hitRate,
        totalAccess
      };
    }
  }), [cache, config.maxCacheSize]);

  // Debounce function
  const debounce = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    delay: number = config.debounceDelay
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, [config.debounceDelay]);

  // Throttle function
  const throttle = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    delay: number = config.throttleDelay
  ): ((...args: Parameters<T>) => void) => {
    let lastCall = 0;
    
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  }, [config.throttleDelay]);

  // Memoização avançada
  const memoize = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    keyGenerator?: (...args: Parameters<T>) => string
  ): T => {
    if (!config.enableMemoization) return func;
    
    const memoCache = new Map<string, any>();
    
    return ((...args: Parameters<T>) => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
      
      if (memoCache.has(key)) {
        return memoCache.get(key);
      }
      
      const result = func(...args);
      memoCache.set(key, result);
      
      return result;
    }) as T;
  }, [config.enableMemoization]);

  // Web Worker para cálculos pesados
  const initializeWebWorker = useCallback(() => {
    if (!config.enableCodeSplitting || webWorker.current) return;
    
    const workerCode = `
      self.onmessage = function(e) {
        const { id, type, data } = e.data;
        
        try {
          let result;
          
          switch (type) {
            case 'calculation':
              result = performCalculation(data);
              break;
            case 'simulation':
              result = performSimulation(data);
              break;
            case 'analysis':
              result = performAnalysis(data);
              break;
            default:
              throw new Error('Tipo de tarefa não suportado');
          }
          
          self.postMessage({
            id,
            status: 'completed',
            result,
            endTime: Date.now()
          });
        } catch (error) {
          self.postMessage({
            id,
            status: 'error',
            error: error.message,
            endTime: Date.now()
          });
        }
      };
      
      function performCalculation(data) {
        // Implementar cálculos financeiros complexos
        const { valorInicial, valorMensal, periodo, taxa } = data;
        let valor = valorInicial;
        
        for (let i = 0; i < periodo; i++) {
          valor = (valor + valorMensal) * (1 + taxa / 100 / 12);
        }
        
        return { valorFinal: valor };
      }
      
      function performSimulation(data) {
        // Implementar simulações Monte Carlo
        const { numeroSimulacoes, parametros } = data;
        const resultados = [];
        
        for (let i = 0; i < numeroSimulacoes; i++) {
          const resultado = Math.random() * parametros.volatilidade + parametros.retornoEsperado;
          resultados.push(resultado);
        }
        
        return { resultados };
      }
      
      function performAnalysis(data) {
        // Implementar análises estatísticas
        const { dados } = data;
        const media = dados.reduce((a, b) => a + b, 0) / dados.length;
        const variancia = dados.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / dados.length;
        const desvio = Math.sqrt(variancia);
        
        return { media, variancia, desvio };
      }
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    webWorker.current = new Worker(URL.createObjectURL(blob));
    
    webWorker.current.onmessage = (e) => {
      const { id, status, result, error, endTime } = e.data;
      
      setWorkerTasks(prev => prev.map(task => 
        task.id === id 
          ? { ...task, status, result, error, endTime }
          : task
      ));
    };
  }, [config.enableCodeSplitting]);

  // Executar tarefa no Web Worker
  const executeWorkerTask = useCallback((
    type: WorkerTask['type'],
    data: any,
    priority: WorkerTask['priority'] = 'medium'
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!webWorker.current) {
        initializeWebWorker();
      }
      
      const taskId = `task-${Date.now()}-${Math.random()}`;
      const task: WorkerTask = {
        id: taskId,
        type,
        data,
        priority,
        status: 'pending',
        startTime: Date.now()
      };
      
      setWorkerTasks(prev => [...prev, task]);
      
      // Listener para resultado
      const handleMessage = (e: MessageEvent) => {
        if (e.data.id === taskId) {
          webWorker.current?.removeEventListener('message', handleMessage);
          
          if (e.data.status === 'completed') {
            resolve(e.data.result);
          } else {
            reject(new Error(e.data.error));
          }
        }
      };
      
      webWorker.current?.addEventListener('message', handleMessage);
      webWorker.current?.postMessage({ id: taskId, type, data });
      
      // Atualizar status
      setWorkerTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: 'running' } : t
      ));
    });
  }, [initializeWebWorker]);

  // Monitoramento de performance
  const startPerformanceMonitoring = useCallback(() => {
    if (!config.enableAnalytics) return;
    
    // Performance Observer para métricas de navegação
    if ('PerformanceObserver' in window) {
      performanceObserver.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            setMetrics(prev => ({
              ...prev,
              loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
              networkLatency: navEntry.responseStart - navEntry.requestStart
            }));
          }
          
          if (entry.entryType === 'measure') {
            setMetrics(prev => ({
              ...prev,
              renderTime: entry.duration
            }));
          }
        });
      });
      
      performanceObserver.current.observe({ 
        entryTypes: ['navigation', 'measure', 'paint'] 
      });
    }
    
    // Monitoramento de FPS
    const measureFPS = () => {
      const now = performance.now();
      fpsCounter.current++;
      
      if (now - lastFrameTime.current >= 1000) {
        setMetrics(prev => ({
          ...prev,
          fps: fpsCounter.current
        }));
        
        fpsCounter.current = 0;
        lastFrameTime.current = now;
      }
      
      frameId.current = requestAnimationFrame(measureFPS);
    };
    
    measureFPS();
    
    // Monitoramento de memória
    if ('memory' in performance) {
      const updateMemoryUsage = () => {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100
        }));
      };
      
      const memoryInterval = setInterval(updateMemoryUsage, 5000);
      
      return () => {
        clearInterval(memoryInterval);
        cancelAnimationFrame(frameId.current);
        performanceObserver.current?.disconnect();
      };
    }
  }, [config.enableAnalytics]);

  // Otimização automática baseada em métricas
  const autoOptimize = useCallback(() => {
    setIsOptimizing(true);
    
    const optimizations: Partial<OptimizationConfig> = {};
    
    // Otimizar baseado na performance atual
    if (metrics.renderTime > 100) {
      optimizations.enableVirtualization = true;
      optimizations.enableLazyLoading = true;
    }
    
    if (metrics.memoryUsage > 80) {
      optimizations.maxCacheSize = Math.max(50, config.maxCacheSize - 20);
      smartCache.clear();
    }
    
    if (metrics.fps < 30) {
      optimizations.debounceDelay = Math.max(100, config.debounceDelay + 100);
      optimizations.throttleDelay = Math.max(50, config.throttleDelay + 50);
    }
    
    if (metrics.networkLatency > 1000) {
      optimizations.enableCaching = true;
      optimizations.enableCompression = true;
    }
    
    // Aplicar otimizações
    if (Object.keys(optimizations).length > 0) {
      setConfig(prev => ({ ...prev, ...optimizations }));
    }
    
    setTimeout(() => setIsOptimizing(false), 2000);
  }, [metrics, config, smartCache, setConfig]);

  // Preload de recursos críticos
  const preloadResources = useCallback((resources: string[]) => {
    if (!config.enablePreloading) return;
    
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      
      if (resource.endsWith('.js')) {
        link.as = 'script';
      } else if (resource.endsWith('.css')) {
        link.as = 'style';
      } else if (resource.match(/\.(jpg|jpeg|png|webp|svg)$/)) {
        link.as = 'image';
      }
      
      document.head.appendChild(link);
    });
  }, [config.enablePreloading]);

  // Lazy loading de componentes
  const lazyLoad = useCallback(<T extends React.ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
    fallback?: React.ComponentType
  ) => {
    if (!config.enableLazyLoading) {
      // Retornar componente carregado imediatamente se lazy loading estiver desabilitado
      return React.lazy(importFunc);
    }
    
    return React.lazy(() => {
      return new Promise<{ default: T }>(resolve => {
        // Simular delay para demonstração
        setTimeout(() => {
          importFunc().then(resolve);
        }, 100);
      });
    });
  }, [config.enableLazyLoading]);

  // Compressão de dados
  const compressData = useCallback((data: any): string => {
    if (!config.enableCompression) {
      return JSON.stringify(data);
    }
    
    // Implementação simples de compressão (usar biblioteca real em produção)
    const jsonString = JSON.stringify(data);
    return btoa(jsonString);
  }, [config.enableCompression]);

  // Descompressão de dados
  const decompressData = useCallback((compressedData: string): any => {
    if (!config.enableCompression) {
      return JSON.parse(compressedData);
    }
    
    try {
      const jsonString = atob(compressedData);
      return JSON.parse(jsonString);
    } catch {
      // Fallback para dados não comprimidos
      return JSON.parse(compressedData);
    }
  }, [config.enableCompression]);

  // Relatório de performance
  const generatePerformanceReport = useCallback(() => {
    const cacheStats = smartCache.getStats();
    
    return {
      metrics,
      config,
      cache: cacheStats,
      workerTasks: workerTasks.length,
      recommendations: [
        metrics.renderTime > 100 && 'Considere habilitar virtualização',
        metrics.memoryUsage > 80 && 'Reduza o tamanho do cache',
        metrics.fps < 30 && 'Aumente os delays de debounce/throttle',
        metrics.networkLatency > 1000 && 'Habilite compressão e cache',
        cacheStats.hitRate < 50 && 'Otimize a estratégia de cache'
      ].filter(Boolean),
      score: Math.round(
        (100 - metrics.renderTime / 10) * 0.2 +
        (100 - metrics.memoryUsage) * 0.2 +
        (metrics.fps / 60 * 100) * 0.2 +
        (100 - metrics.networkLatency / 50) * 0.2 +
        (cacheStats.hitRate) * 0.2
      )
    };
  }, [metrics, config, smartCache, workerTasks]);

  // Inicialização
  useEffect(() => {
    const cleanup = startPerformanceMonitoring();
    initializeWebWorker();
    
    // Preload de recursos críticos
    preloadResources([
      '/assets/critical.css',
      '/assets/main.js'
    ]);
    
    return () => {
      cleanup?.();
      webWorker.current?.terminate();
    };
  }, [startPerformanceMonitoring, initializeWebWorker, preloadResources]);

  // Auto-otimização periódica
  useEffect(() => {
    if (config.performanceTarget === 'ultra') {
      const interval = setInterval(autoOptimize, 30000); // A cada 30 segundos
      return () => clearInterval(interval);
    }
  }, [config.performanceTarget, autoOptimize]);

  return {
    // Estados
    metrics,
    config,
    cache: smartCache,
    workerTasks,
    isOptimizing,
    
    // Ações
    setConfig,
    autoOptimize,
    executeWorkerTask,
    preloadResources,
    generatePerformanceReport,
    
    // Utilitários
    debounce,
    throttle,
    memoize,
    lazyLoad,
    compressData,
    decompressData,
    
    // Cache
    smartCache
  };
};