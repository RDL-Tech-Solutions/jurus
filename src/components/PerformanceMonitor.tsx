import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Zap, 
  Clock, 
  Eye, 
  BarChart3, 
  X, 
  ChevronDown,
  ChevronUp,
  Wifi,
  HardDrive,
  Cpu
} from 'lucide-react';
import { usePerformanceMonitoring, useBundleOptimization } from '../hooks/useImageOptimization';

interface PerformanceMonitorProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  compact?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
  compact = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [memoryInfo, setMemoryInfo] = useState<any>(null);
  
  const metrics = usePerformanceMonitoring();
  const bundleInfo = useBundleOptimization();

  // Monitorar informações de rede e memória
  useEffect(() => {
    const updateSystemInfo = () => {
      // Network Information API
      if ('connection' in navigator) {
        setNetworkInfo((navigator as any).connection);
      }

      // Memory API
      if ('memory' in performance) {
        setMemoryInfo((performance as any).memory);
      }
    };

    updateSystemInfo();
    const interval = setInterval(updateSystemInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  // Mostrar monitor apenas em desenvolvimento ou quando habilitado
  useEffect(() => {
    setIsVisible(enabled);
  }, [enabled]);

  if (!isVisible) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4';
    }
  };

  const getScoreColor = (value: number, thresholds: { good: number; needs: number }) => {
    if (value <= thresholds.good) return 'text-green-500';
    if (value <= thresholds.needs) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (time: number) => {
    return `${Math.round(time)}ms`;
  };

  return (
    <motion.div
      className={`fixed ${getPositionClasses()} z-50`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <div className="bg-black/90 backdrop-blur-sm text-white rounded-lg shadow-2xl border border-gray-700">
        {/* Header compacto */}
        <div className="flex items-center justify-between p-2 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-xs font-medium">Performance</span>
            {compact && (
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  metrics.lcp <= 2500 ? 'bg-green-400' : 
                  metrics.lcp <= 4000 ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
                <span className="text-xs text-gray-300">
                  {formatTime(metrics.lcp)}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Conteúdo expandido */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 space-y-3 max-w-xs">
                {/* Core Web Vitals */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-300 mb-2 flex items-center">
                    <Zap className="w-3 h-3 mr-1" />
                    Core Web Vitals
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-800 p-2 rounded">
                      <div className="text-gray-400">LCP</div>
                      <div className={getScoreColor(metrics.lcp, { good: 2500, needs: 4000 })}>
                        {formatTime(metrics.lcp)}
                      </div>
                    </div>
                    <div className="bg-gray-800 p-2 rounded">
                      <div className="text-gray-400">FID</div>
                      <div className={getScoreColor(metrics.fid, { good: 100, needs: 300 })}>
                        {formatTime(metrics.fid)}
                      </div>
                    </div>
                    <div className="bg-gray-800 p-2 rounded">
                      <div className="text-gray-400">CLS</div>
                      <div className={getScoreColor(metrics.cls * 1000, { good: 100, needs: 250 })}>
                        {(metrics.cls * 1000).toFixed(0)}
                      </div>
                    </div>
                    <div className="bg-gray-800 p-2 rounded">
                      <div className="text-gray-400">FCP</div>
                      <div className={getScoreColor(metrics.fcp, { good: 1800, needs: 3000 })}>
                        {formatTime(metrics.fcp)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bundle Info */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-300 mb-2 flex items-center">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Bundle
                  </h4>
                  <div className="bg-gray-800 p-2 rounded text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Load Time:</span>
                      <span>{formatTime(bundleInfo.loadTime)}</span>
                    </div>
                  </div>
                </div>

                {/* Network Info */}
                {networkInfo && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-300 mb-2 flex items-center">
                      <Wifi className="w-3 h-3 mr-1" />
                      Network
                    </h4>
                    <div className="bg-gray-800 p-2 rounded text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span>{networkInfo.effectiveType || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Downlink:</span>
                        <span>{networkInfo.downlink || 0} Mbps</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">RTT:</span>
                        <span>{networkInfo.rtt || 0}ms</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Memory Info */}
                {memoryInfo && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-300 mb-2 flex items-center">
                      <HardDrive className="w-3 h-3 mr-1" />
                      Memory
                    </h4>
                    <div className="bg-gray-800 p-2 rounded text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Used:</span>
                        <span>{formatBytes(memoryInfo.usedJSHeapSize)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total:</span>
                        <span>{formatBytes(memoryInfo.totalJSHeapSize)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Limit:</span>
                        <span>{formatBytes(memoryInfo.jsHeapSizeLimit)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Performance Tips */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-300 mb-2 flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    Tips
                  </h4>
                  <div className="bg-gray-800 p-2 rounded text-xs space-y-1">
                    {metrics.lcp > 4000 && (
                      <div className="text-red-400">• Optimize LCP elements</div>
                    )}
                    {metrics.fid > 300 && (
                      <div className="text-red-400">• Reduce JavaScript execution</div>
                    )}
                    {metrics.cls > 0.25 && (
                      <div className="text-red-400">• Fix layout shifts</div>
                    )}
                    {memoryInfo && memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.8 && (
                      <div className="text-yellow-400">• High memory usage</div>
                    )}
                    {networkInfo && networkInfo.effectiveType === 'slow-2g' && (
                      <div className="text-yellow-400">• Slow network detected</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PerformanceMonitor;