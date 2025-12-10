/**
 * Gerenciador de Dívidas - Componente Principal
 * Integra todos os subcomponentes
 */

import React, { memo, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useDebts } from '../hooks/useDebts';
import { useDebtFilters } from '../hooks/useDebtFilters';
import { DebtSummary } from './DebtSummary';
import { DebtFilters } from './DebtFilters';
import { DebtList } from './DebtList';
import { DebtDetailsModal } from './DebtDetailsModal';
import { DebtWithStatus } from '../types';

interface DebtsManagerProps {
  onAddDebt?: () => void;
  onEditDebt?: (debtId: string) => void;
  onDeleteDebt?: (debtId: string) => void;
  onMarkAsPaid?: (debtId: string) => void;
}

export const DebtsManager: React.FC<DebtsManagerProps> = memo(({
  onAddDebt,
  onEditDebt,
  onDeleteDebt,
  onMarkAsPaid
}) => {
  const {
    debtsWithStatus,
    summary,
    marcarComoPago,
    excluirDivida
  } = useDebts();
  
  const {
    filters,
    updateFilter,
    clearFilters,
    filteredDebts,
    counts
  } = useDebtFilters(debtsWithStatus);
  
  const [selectedDebt, setSelectedDebt] = useState<DebtWithStatus | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleMarkAsPaid = useCallback((debtId: string) => {
    marcarComoPago(debtId);
    onMarkAsPaid?.(debtId);
  }, [marcarComoPago, onMarkAsPaid]);
  
  const handleDebtClick = useCallback((debt: DebtWithStatus) => {
    setSelectedDebt(debt);
    setIsModalOpen(true);
  }, []);
  
  const handleEdit = useCallback((debtId: string) => {
    onEditDebt?.(debtId);
  }, [onEditDebt]);
  
  const handleDelete = useCallback((debtId: string) => {
    excluirDivida(debtId);
    onDeleteDebt?.(debtId);
  }, [excluirDivida, onDeleteDebt]);
  
  return (
    <div className="space-y-6">
      {/* Header com Botão */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dívidas
        </h1>
        {onAddDebt && (
          <button
            onClick={onAddDebt}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Dívida</span>
          </button>
        )}
      </div>
      
      {/* Resumo */}
      <DebtSummary summary={summary} />
      
      {/* Filtros */}
      <DebtFilters
        filters={filters}
        counts={counts}
        onUpdateFilter={updateFilter}
        onClearFilters={clearFilters}
      />
      
      {/* Lista */}
      <DebtList
        debts={filteredDebts}
        onDebtClick={handleDebtClick}
        onMarkAsPaid={handleMarkAsPaid}
      />
      
      {/* Modal de Detalhes */}
      <DebtDetailsModal
        debt={selectedDebt}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDebt(null);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onMarkAsPaid={handleMarkAsPaid}
      />
    </div>
  );
});

DebtsManager.displayName = 'DebtsManager';
