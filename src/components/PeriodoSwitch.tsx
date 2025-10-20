import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

export type PeriodoVisualizacao = 'mensal' | 'anual';

interface PeriodoSwitchProps {
  valor: PeriodoVisualizacao;
  onChange: (valor: PeriodoVisualizacao) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PeriodoSwitch: React.FC<PeriodoSwitchProps> = ({
  valor,
  onChange,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const paddingClasses = {
    sm: 'px-3',
    md: 'px-4',
    lg: 'px-5'
  };

  return (
    <div className={`inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 ${className}`}>
      <motion.button
        onClick={() => onChange('mensal')}
        className={`
          flex items-center justify-center ${sizeClasses[size]} ${paddingClasses[size]}
          rounded-md font-medium transition-all duration-200 relative
          ${valor === 'mensal'
            ? 'text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {valor === 'mensal' && (
          <motion.div
            layoutId="periodo-switch-bg"
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-md"
            initial={false}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30
            }}
          />
        )}
        <div className="relative flex items-center space-x-1.5">
          <Clock className={iconSizes[size]} />
          <span>Mensal</span>
        </div>
      </motion.button>

      <motion.button
        onClick={() => onChange('anual')}
        className={`
          flex items-center justify-center ${sizeClasses[size]} ${paddingClasses[size]}
          rounded-md font-medium transition-all duration-200 relative
          ${valor === 'anual'
            ? 'text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {valor === 'anual' && (
          <motion.div
            layoutId="periodo-switch-bg"
            className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-md"
            initial={false}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30
            }}
          />
        )}
        <div className="relative flex items-center space-x-1.5">
          <Calendar className={iconSizes[size]} />
          <span>Anual</span>
        </div>
      </motion.button>
    </div>
  );
};

// Hook para gerenciar o estado do período
export const usePeriodoVisualizacao = (inicial: PeriodoVisualizacao = 'anual') => {
  const [periodo, setPeriodo] = React.useState<PeriodoVisualizacao>(inicial);

  // Função para converter valores baseado no período
  const converterValor = React.useCallback((valor: number, de: PeriodoVisualizacao = 'anual'): number => {
    if (de === periodo) return valor;
    
    if (de === 'anual' && periodo === 'mensal') {
      return valor / 12;
    }
    
    if (de === 'mensal' && periodo === 'anual') {
      return valor * 12;
    }
    
    return valor;
  }, [periodo]);

  // Função para obter o sufixo correto
  const obterSufixo = React.useCallback((): string => {
    return periodo === 'mensal' ? '/mês' : '/ano';
  }, [periodo]);

  // Função para obter o label do período
  const obterLabel = React.useCallback((): string => {
    return periodo === 'mensal' ? 'Mensal' : 'Anual';
  }, [periodo]);

  return {
    periodo,
    setPeriodo,
    converterValor,
    obterSufixo,
    obterLabel
  };
};