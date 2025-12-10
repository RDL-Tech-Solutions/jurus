/**
 * Lista de Dívidas - Otimizada com memo
 */

import React, { memo } from 'react';
import { DebtWithStatus } from '../types';
import { DebtCard } from './DebtCard';

interface DebtListProps {
  debts: DebtWithStatus[];
  onDebtClick: (debt: DebtWithStatus) => void;
  onMarkAsPaid: (debtId: string) => void;
}

export const DebtList: React.FC<DebtListProps> = memo(({
  debts,
  onDebtClick,
  onMarkAsPaid
}) => {
  if (debts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <span className="text-3xl">💳</span>
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          Nenhuma dívida encontrada
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Adicione uma nova dívida para começar
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {debts.map(debt => (
        <DebtCard
          key={debt.id}
          debt={debt}
          onClick={() => onDebtClick(debt)}
          onMarkAsPaid={!debt.pago ? () => onMarkAsPaid(debt.id) : undefined}
        />
      ))}
    </div>
  );
});

DebtList.displayName = 'DebtList';
