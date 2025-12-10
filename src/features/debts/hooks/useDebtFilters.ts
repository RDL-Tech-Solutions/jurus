/**
 * Hook para gerenciar filtros de dívidas
 */

import { useState, useMemo, useCallback } from 'react';
import { DebtFilters, DebtWithStatus } from '../types';

const DEFAULT_FILTERS: DebtFilters = {
  status: 'all',
  type: 'all',
  search: '',
  sortBy: 'due_date'
};

export function useDebtFilters(debts: DebtWithStatus[]) {
  const [filters, setFilters] = useState<DebtFilters>(DEFAULT_FILTERS);
  
  // Atualizar filtro específico
  const updateFilter = useCallback(<K extends keyof DebtFilters>(
    key: K,
    value: DebtFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);
  
  // Limpar filtros
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);
  
  // Aplicar filtros
  const filteredDebts = useMemo(() => {
    let result = [...debts];
    
    // Filtro por status
    if (filters.status !== 'all') {
      result = result.filter(debt => debt.status === filters.status);
    }
    
    // Filtro por tipo (baseado em categorias ou descrição)
    if (filters.type !== 'all') {
      // TODO: Implementar lógica de tipo quando houver campo específico
      // Por enquanto, pode usar categoriaId ou descrição
    }
    
    // Filtro por mês de vencimento
    if (filters.month) {
      result = result.filter(debt => {
        if (!debt.dataVencimento) return false;
        const debtMonth = debt.dataVencimento.substring(0, 7); // YYYY-MM
        return debtMonth === filters.month;
      });
    }
    
    // Filtro por busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(debt =>
        debt.descricao.toLowerCase().includes(searchLower) ||
        debt.credor.toLowerCase().includes(searchLower) ||
        debt.observacoes?.toLowerCase().includes(searchLower)
      );
    }
    
    // Ordenação
    switch (filters.sortBy) {
      case 'due_date':
        result.sort((a, b) => {
          if (!a.dataVencimento) return 1;
          if (!b.dataVencimento) return -1;
          return new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime();
        });
        break;
      case 'value_desc':
        result.sort((a, b) => b.valor - a.valor);
        break;
      case 'value_asc':
        result.sort((a, b) => a.valor - b.valor);
        break;
      case 'status':
        const statusOrder = { overdue: 0, upcoming: 1, active: 2, paid: 3 };
        result.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        break;
    }
    
    return result;
  }, [debts, filters]);
  
  // Contadores por filtro
  const counts = useMemo(() => {
    return {
      all: debts.length,
      paid: debts.filter(d => d.status === 'paid').length,
      overdue: debts.filter(d => d.status === 'overdue').length,
      active: debts.filter(d => d.status === 'active').length,
      upcoming: debts.filter(d => d.status === 'upcoming').length
    };
  }, [debts]);
  
  return {
    filters,
    updateFilter,
    clearFilters,
    filteredDebts,
    counts
  };
}
