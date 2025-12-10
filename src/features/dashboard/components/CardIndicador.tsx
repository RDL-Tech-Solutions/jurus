/**
 * Card de Indicador Financeiro
 */

import React, { memo } from 'react';
import { LucideIcon } from 'lucide-react';
import { formatarValorDashboard, formatarPercentual } from '../utils/calculos';
import { cn } from '../../../utils/cn';

interface CardIndicadorProps {
  titulo: string;
  valor: number;
  icone: LucideIcon;
  tipo: 'receita' | 'despesa' | 'saldo' | 'info';
  variacao?: number;
  subtitulo?: string;
}

export const CardIndicador: React.FC<CardIndicadorProps> = memo(({
  titulo,
  valor,
  icone: Icone,
  tipo,
  variacao,
  subtitulo
}) => {
  const cores = {
    receita: {
      bg: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      border: 'border-green-200 dark:border-green-800',
      icone: 'bg-green-500/20 text-green-600 dark:text-green-400',
      texto: 'text-green-700 dark:text-green-300'
    },
    despesa: {
      bg: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
      border: 'border-red-200 dark:border-red-800',
      icone: 'bg-red-500/20 text-red-600 dark:text-red-400',
      texto: 'text-red-700 dark:text-red-300'
    },
    saldo: {
      bg: valor >= 0
        ? 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
        : 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
      border: valor >= 0
        ? 'border-blue-200 dark:border-blue-800'
        : 'border-orange-200 dark:border-orange-800',
      icone: valor >= 0
        ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
        : 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
      texto: valor >= 0
        ? 'text-blue-700 dark:text-blue-300'
        : 'text-orange-700 dark:text-orange-300'
    },
    info: {
      bg: 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      icone: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
      texto: 'text-purple-700 dark:text-purple-300'
    }
  };
  
  const estilo = cores[tipo];
  
  return (
    <div className={cn(
      'bg-gradient-to-br rounded-2xl p-5 border transition-all hover:shadow-lg',
      estilo.bg,
      estilo.border
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            {titulo}
          </p>
          {subtitulo && (
            <p className="text-[10px] text-gray-500 dark:text-gray-500">
              {subtitulo}
            </p>
          )}
        </div>
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center',
          estilo.icone
        )}>
          <Icone className="w-5 h-5" />
        </div>
      </div>
      
      <div>
        <p className={cn('text-2xl font-bold', estilo.texto)}>
          {formatarValorDashboard(valor)}
        </p>
        
        {variacao !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            <span className={cn(
              'text-xs font-medium',
              variacao >= 0 ? 'text-green-600' : 'text-red-600'
            )}>
              {formatarPercentual(variacao)}
            </span>
            <span className="text-xs text-gray-500">vs mês anterior</span>
          </div>
        )}
      </div>
    </div>
  );
});

CardIndicador.displayName = 'CardIndicador';
