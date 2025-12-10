/**
 * Resumo de Dívidas - Cards com indicadores principais
 */

import React, { memo } from 'react';
import { 
  DollarSign, 
  AlertCircle, 
  Clock, 
  CheckCircle,
  TrendingDown
} from 'lucide-react';
import { DebtSummary as DebtSummaryType } from '../types';
import { formatCurrency } from '../utils/debtHelpers';
import { cn } from '../../../utils/cn';

interface DebtSummaryProps {
  summary: DebtSummaryType;
}

export const DebtSummary: React.FC<DebtSummaryProps> = memo(({ summary }) => {
  const cards = [
    {
      title: 'Total em Dívidas',
      value: summary.totalDebts,
      icon: DollarSign,
      color: 'blue',
      subtitle: `${summary.quantityPending} dívida${summary.quantityPending !== 1 ? 's' : ''} ativa${summary.quantityPending !== 1 ? 's' : ''}`
    },
    {
      title: 'Em Atraso',
      value: summary.totalOverdue,
      icon: AlertCircle,
      color: 'red',
      subtitle: `${summary.quantityOverdue} dívida${summary.quantityOverdue !== 1 ? 's' : ''}`
    },
    {
      title: 'Próximas Parcelas',
      value: summary.totalUpcoming,
      icon: Clock,
      color: 'orange',
      subtitle: `${summary.quantityUpcoming} vencendo em breve`
    },
    {
      title: 'Total Pago',
      value: summary.totalPaid,
      icon: CheckCircle,
      color: 'green',
      subtitle: `${summary.quantityPaid} dívida${summary.quantityPaid !== 1 ? 's' : ''} quitada${summary.quantityPaid !== 1 ? 's' : ''}`
    }
  ];
  
  const colorClasses = {
    blue: {
      bg: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
      text: 'text-blue-700 dark:text-blue-300'
    },
    red: {
      bg: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: 'bg-red-500/20 text-red-600 dark:text-red-400',
      text: 'text-red-700 dark:text-red-300'
    },
    orange: {
      bg: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      icon: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
      text: 'text-orange-700 dark:text-orange-300'
    },
    green: {
      bg: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      border: 'border-green-200 dark:border-green-800',
      icon: 'bg-green-500/20 text-green-600 dark:text-green-400',
      text: 'text-green-700 dark:text-green-300'
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <TrendingDown className="w-6 h-6" />
        Resumo de Dívidas
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const colors = colorClasses[card.color as keyof typeof colorClasses];
          const Icon = card.icon;
          
          return (
            <div
              key={card.title}
              className={cn(
                'bg-gradient-to-br rounded-2xl p-5 border transition-all hover:shadow-lg',
                colors.bg,
                colors.border
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {card.title}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-500">
                    {card.subtitle}
                  </p>
                </div>
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  colors.icon
                )}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              
              <p className={cn('text-2xl font-bold', colors.text)}>
                {formatCurrency(card.value)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
});

DebtSummary.displayName = 'DebtSummary';
