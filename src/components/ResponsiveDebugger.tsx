import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Smartphone, Tablet, Laptop, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { getCurrentBreakpoint, generateResponsiveReport, BREAKPOINTS } from '../utils/responsiveTest';

interface ResponsiveDebuggerProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const ResponsiveDebugger: React.FC<ResponsiveDebuggerProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  position = 'bottom-right'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [report, setReport] = useState(generateResponsiveReport());

  // Atualizar relatório quando a tela redimensionar
  useEffect(() => {
    const updateReport = () => {
      setReport(generateResponsiveReport());
    };

    const debouncedUpdate = debounce(updateReport, 250);
    window.addEventListener('resize', debouncedUpdate);
    
    // Atualizar a cada 5 segundos para detectar mudanças dinâmicas
    const interval = setInterval(updateReport, 5000);

    return () => {
      window.removeEventListener('resize', debouncedUpdate);
      clearInterval(interval);
    };
  }, []);

  // Função debounce simples
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    };
  };

  // Ícone do breakpoint atual
  const getBreakpointIcon = () => {
    switch (report.breakpoint) {
      case 'mobile':
      case 'mobileLarge':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      case 'laptop':
      case 'laptopLarge':
        return <Laptop className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  // Cor baseada na integridade do layout
  const getStatusColor = () => {
    const { issues } = report.layoutIntegrity;
    if (issues.length === 0) return 'text-green-500';
    if (issues.length <= 2) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Posicionamento do debugger
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  if (!enabled) return null;

  return (
    <div className={`fixed ${getPositionClasses()} z-[9999] pointer-events-none`}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="pointer-events-auto"
          >
            {/* Botão principal */}
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg backdrop-blur-md
                bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700
                hover:bg-white dark:hover:bg-gray-800 transition-colors
                ${getStatusColor()}
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {getBreakpointIcon()}
              <span className="text-xs font-medium">
                {report.viewport.width}×{report.viewport.height}
              </span>
              {report.layoutIntegrity.issues.length > 0 && (
                <AlertTriangle className="w-3 h-3 text-red-500" />
              )}
            </motion.button>

            {/* Painel expandido */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="mt-2 p-4 rounded-lg shadow-xl backdrop-blur-md bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 min-w-80"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Responsive Debugger
                      </h3>
                      <button
                        onClick={() => setIsExpanded(false)}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <EyeOff className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Informações do viewport */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Breakpoint:</span>
                        <div className="flex items-center gap-1 font-medium">
                          {getBreakpointIcon()}
                          {report.breakpoint}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Viewport:</span>
                        <div className="font-medium">
                          {report.viewport.width}×{report.viewport.height}
                        </div>
                      </div>
                    </div>

                    {/* Status do layout */}
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">Layout Status:</span>
                      <div className="flex items-center gap-2 mt-1">
                        {report.layoutIntegrity.issues.length === 0 ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                              Sem problemas detectados
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="text-red-600 dark:text-red-400 text-sm font-medium">
                              {report.layoutIntegrity.issues.length} problema(s)
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Lista de problemas */}
                    {report.layoutIntegrity.issues.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Problemas:</span>
                        <ul className="space-y-1">
                          {report.layoutIntegrity.issues.map((issue, index) => (
                            <li key={index} className="text-xs text-red-600 dark:text-red-400 flex items-start gap-1">
                              <span className="w-1 h-1 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Breakpoints de referência */}
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">Breakpoints:</span>
                      <div className="grid grid-cols-2 gap-1 mt-1 text-xs">
                        {Object.entries(BREAKPOINTS).map(([name, width]) => (
                          <div
                            key={name}
                            className={`
                              px-2 py-1 rounded text-center
                              ${report.breakpoint === name
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                              }
                            `}
                          >
                            {name}: {width}px
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                      Última atualização: {new Date(report.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        className={`
          ${isVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          fixed ${getPositionClasses()} w-10 h-10 rounded-full shadow-lg backdrop-blur-md
          bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200
          flex items-center justify-center pointer-events-auto
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Eye className="w-4 h-4" />
      </motion.button>
    </div>
  );
};

export default ResponsiveDebugger;