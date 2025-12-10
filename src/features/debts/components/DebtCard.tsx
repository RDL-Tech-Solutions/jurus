/**
 * Card de Dívida - Design moderno estilo "Minhas Finanças"
 */

import React, { memo } from 'react';
import { 
  Calendar, 
  User, 
  Check, 
  AlertCircle, 
  Clock,
  ChevronRight,
  CreditCard
} from 'lucide-react';
import { DebtWithStatus } from '../types';
import { formatCurrency, formatRelativeDate } from '../utils/debtHelpers';
import { cn } from '../../../utils/cn';

interface DebtCardProps {
  debt: DebtWithStatus;
  onClick?: () => void;
  onMarkAsPaid?: () => void;
}

export const DebtCard: React.FC<DebtCardProps> = memo(({ debt, onClick, onMarkAsPaid }) => {
  // Cores por status
  const statusColors = {
    paid: {
      bg: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      border: 'border-green-200 dark:border-green-800',
      badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      icon: 'text-green-600 dark:text-green-400'
    },
    overdue: {
      bg: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
      border: 'border-red-200 dark:border-red-800',
      badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      icon: 'text-red-600 dark:text-red-400'
    },
    upcoming: {
      bg: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      icon: 'text-orange-600 dark:text-orange-400'
    },
    active: {
      bg: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      icon: 'text-blue-600 dark:text-blue-400'
    }
  };
  
  const colors = statusColors[debt.status];
  
  // Ícone por status
  const StatusIcon = debt.status === 'paid' ? Check :
                     debt.status === 'overdue' ? AlertCircle :
                     debt.status === 'upcoming' ? Clock :
                     Calendar;
  
  // Label do status
  const statusLabel = {
    paid: 'Pago',
    overdue: 'Atrasado',
    upcoming: 'Vence em breve',
    active: 'Ativo'
  }[debt.status];
  
  return (
    <div
      className={cn(
        'bg-gradient-to-br rounded-2xl p-5 border transition-all cursor-pointer hover:shadow-lg',
        colors.bg,
        colors.border
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 truncate">
            {debt.descricao}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <User className="w-3 h-3" />
            <span className="truncate">{debt.credor}</span>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className={cn(
          'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2',
          colors.badge
        )}>
          <StatusIcon className="w-3 h-3" />
          <span>{statusLabel}</span>
        </div>
      </div>
      
      {/* Valor */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(debt.valor)}
        </p>
      </div>
      
      {/* Informações Adicionais */}
      <div className="space-y-2">
        {/* Data de Vencimento */}
        {debt.dataVencimento && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Vencimento</span>
            </div>
            <span className={cn(
              'font-semibold',
              colors.icon
            )}>
              {formatRelativeDate(debt.dataVencimento)}
            </span>
          </div>
        )}
        
        {/* Parcelas */}
        {debt.numeroParcelas && debt.parcelaAtual && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <CreditCard className="w-4 h-4" />
                <span>Parcelas</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {debt.parcelaAtual}/{debt.numeroParcelas}
              </span>
            </div>
            
            {/* Barra de Progresso */}
            {debt.progressPercentage !== undefined && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    debt.status === 'paid' ? 'bg-green-500' :
                    debt.status === 'overdue' ? 'bg-red-500' :
                    debt.status === 'upcoming' ? 'bg-orange-500' :
                    'bg-blue-500'
                  )}
                  style={{ width: `${debt.progressPercentage}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {!debt.pago && onMarkAsPaid && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsPaid();
            }}
            className={cn(
              'text-sm font-medium hover:underline',
              colors.icon
            )}
          >
            Marcar como pago
          </button>
        )}
        
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 ml-auto">
          <span>Ver detalhes</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
});

DebtCard.displayName = 'DebtCard';
