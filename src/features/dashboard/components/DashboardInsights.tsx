/**
 * Insights Financeiros Automáticos
 */

import React, { memo } from 'react';
import { Lightbulb, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { InsightFinanceiro } from '../types';
import { cn } from '../../../utils/cn';

interface DashboardInsightsProps {
  insights: InsightFinanceiro[];
}

export const DashboardInsights: React.FC<DashboardInsightsProps> = memo(({ insights }) => {
  if (insights.length === 0) {
    return null;
  }
  
  const getIcone = (tipo: InsightFinanceiro['tipo']) => {
    switch (tipo) {
      case 'alerta':
        return AlertCircle;
      case 'sucesso':
        return CheckCircle;
      case 'info':
        return Info;
      case 'atencao':
        return AlertTriangle;
      default:
        return Lightbulb;
    }
  };
  
  const getCores = (tipo: InsightFinanceiro['tipo']) => {
    switch (tipo) {
      case 'alerta':
        return {
          bg: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
          border: 'border-red-200 dark:border-red-800',
          icone: 'bg-red-500/20 text-red-600 dark:text-red-400',
          titulo: 'text-red-700 dark:text-red-300',
          descricao: 'text-red-600 dark:text-red-400'
        };
      case 'sucesso':
        return {
          bg: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
          border: 'border-green-200 dark:border-green-800',
          icone: 'bg-green-500/20 text-green-600 dark:text-green-400',
          titulo: 'text-green-700 dark:text-green-300',
          descricao: 'text-green-600 dark:text-green-400'
        };
      case 'atencao':
        return {
          bg: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
          border: 'border-orange-200 dark:border-orange-800',
          icone: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
          titulo: 'text-orange-700 dark:text-orange-300',
          descricao: 'text-orange-600 dark:text-orange-400'
        };
      default:
        return {
          bg: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          icone: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
          titulo: 'text-blue-700 dark:text-blue-300',
          descricao: 'text-blue-600 dark:text-blue-400'
        };
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <Lightbulb className="w-6 h-6" />
        Insights Financeiros
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => {
          const Icone = getIcone(insight.tipo);
          const cores = getCores(insight.tipo);
          
          return (
            <div
              key={insight.id}
              className={cn(
                'bg-gradient-to-br rounded-2xl p-5 border transition-all hover:shadow-lg',
                cores.bg,
                cores.border
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                  cores.icone
                )}>
                  <Icone className="w-6 h-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className={cn('text-base font-bold mb-1', cores.titulo)}>
                    {insight.icone} {insight.titulo}
                  </h3>
                  <p className={cn('text-sm', cores.descricao)}>
                    {insight.descricao}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

DashboardInsights.displayName = 'DashboardInsights';
