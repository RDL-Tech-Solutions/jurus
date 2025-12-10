/**
 * Dashboard de Cartões - Resumo geral
 */

import React, { memo } from 'react';
import { CreditCard, DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { CardSummaryData } from '../types';
import { formatCurrency } from '../utils/cardHelpers';
import { cn } from '../../../utils/cn';

interface CardSummaryProps {
  summary: CardSummaryData;
}

export const CardSummary: React.FC<CardSummaryProps> = memo(({ summary }) => {
  const cards = [
    {
      title: 'Total de Cartões',
      value: summary.totalCards,
      subtitle: `${summary.activeCards} ativo${summary.activeCards !== 1 ? 's' : ''}`,
      icon: CreditCard,
      color: 'blue',
      format: 'number'
    },
    {
      title: 'Limite Total',
      value: summary.totalLimit,
      subtitle: 'Soma dos limites',
      icon: DollarSign,
      color: 'purple',
      format: 'currency'
    },
    {
      title: 'Limite Disponível',
      value: summary.totalAvailable,
      subtitle: 'Disponível para uso',
      icon: Wallet,
      color: 'green',
      format: 'currency'
    },
    {
      title: 'Total Gasto',
      value: summary.totalUsed,
      subtitle: 'Limite utilizado',
      icon: TrendingDown,
      color: 'orange',
      format: 'currency'
    },
    {
      title: 'Faturas Abertas',
      value: summary.totalInvoices,
      subtitle: 'Total a pagar',
      icon: TrendingUp,
      color: 'red',
      format: 'currency'
    }
  ];
  
  const colorClasses = {
    blue: {
      bg: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
      text: 'text-blue-700 dark:text-blue-300'
    },
    purple: {
      bg: 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      icon: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
      text: 'text-purple-700 dark:text-purple-300'
    },
    green: {
      bg: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      border: 'border-green-200 dark:border-green-800',
      icon: 'bg-green-500/20 text-green-600 dark:text-green-400',
      text: 'text-green-700 dark:text-green-300'
    },
    orange: {
      bg: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      icon: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
      text: 'text-orange-700 dark:text-orange-300'
    },
    red: {
      bg: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: 'bg-red-500/20 text-red-600 dark:text-red-400',
      text: 'text-red-700 dark:text-red-300'
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <CreditCard className="w-6 h-6" />
        Resumo de Cartões
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                {card.format === 'currency' 
                  ? formatCurrency(card.value as number)
                  : card.value
                }
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
});

CardSummary.displayName = 'CardSummary';
