/**
 * Filtros de Dívidas
 */

import React, { memo } from 'react';
import { Search, Filter } from 'lucide-react';
import { DebtFilters as DebtFiltersType, DebtStatus, DebtSortBy } from '../types';
import { cn } from '../../../utils/cn';

interface DebtFiltersProps {
  filters: DebtFiltersType;
  counts: Record<string, number>;
  onUpdateFilter: <K extends keyof DebtFiltersType>(key: K, value: DebtFiltersType[K]) => void;
  onClearFilters: () => void;
}

export const DebtFilters: React.FC<DebtFiltersProps> = memo(({
  filters,
  counts,
  onUpdateFilter,
  onClearFilters
}) => {
  const statusOptions: { value: DebtStatus; label: string }[] = [
    { value: 'all', label: `Todas (${counts.all})` },
    { value: 'overdue', label: `Atrasadas (${counts.overdue})` },
    { value: 'upcoming', label: `Vencendo (${counts.upcoming})` },
    { value: 'active', label: `Ativas (${counts.active})` },
    { value: 'paid', label: `Pagas (${counts.paid})` }
  ];
  
  const sortOptions: { value: DebtSortBy; label: string }[] = [
    { value: 'due_date', label: 'Vencimento' },
    { value: 'value_desc', label: 'Maior valor' },
    { value: 'value_asc', label: 'Menor valor' },
    { value: 'status', label: 'Status' }
  ];
  
  return (
    <div className="space-y-4">
      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onUpdateFilter('search', e.target.value)}
          placeholder="Buscar dívida..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Filtros de Status */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {statusOptions.map(option => (
          <button
            key={option.value}
            onClick={() => onUpdateFilter('status', option.value)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
              filters.status === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      
      {/* Ordenação */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-gray-500" />
        <select
          value={filters.sortBy}
          onChange={(e) => onUpdateFilter('sortBy', e.target.value as DebtSortBy)}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              Ordenar por: {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
});

DebtFilters.displayName = 'DebtFilters';
