/**
 * Hook principal para gerenciamento de dívidas
 * Wrapper do useDividas original com funcionalidades extras
 */

import { useMemo } from 'react';
import { useDividas } from '../../../hooks/useDividas';
import { DebtWithStatus, DebtSummary, DebtAlert } from '../types';
import { enrichDebtWithStatus, generateDebtAlerts } from '../utils/debtHelpers';

export function useDebts() {
  // Hook original (mantém toda lógica existente)
  const {
    dividas,
    dividasPendentes,
    dividasPagas,
    estatisticas,
    carregado,
    adicionarDivida,
    editarDivida,
    excluirDivida,
    marcarComoPago,
    desmarcarPagamento
  } = useDividas();
  
  // Enriquece dívidas com informações de status
  const debtsWithStatus = useMemo((): DebtWithStatus[] => {
    return dividas.map(enrichDebtWithStatus);
  }, [dividas]);
  
  const pendingDebtsWithStatus = useMemo((): DebtWithStatus[] => {
    return dividasPendentes.map(enrichDebtWithStatus);
  }, [dividasPendentes]);
  
  const paidDebtsWithStatus = useMemo((): DebtWithStatus[] => {
    return dividasPagas.map(enrichDebtWithStatus);
  }, [dividasPagas]);
  
  // Resumo melhorado
  const summary = useMemo((): DebtSummary => {
    const overdue = pendingDebtsWithStatus.filter(d => d.status === 'overdue');
    const upcoming = pendingDebtsWithStatus.filter(d => d.status === 'upcoming');
    
    return {
      totalDebts: estatisticas.totalPendente,
      totalOverdue: overdue.reduce((sum, d) => sum + d.valor, 0),
      totalUpcoming: upcoming.reduce((sum, d) => sum + d.valor, 0),
      totalPaid: estatisticas.totalPago,
      quantityPending: estatisticas.quantidadePendente,
      quantityPaid: estatisticas.quantidadePaga,
      quantityOverdue: overdue.length,
      quantityUpcoming: upcoming.length
    };
  }, [pendingDebtsWithStatus, estatisticas]);
  
  // Gera alertas
  const alerts = useMemo((): DebtAlert[] => {
    return generateDebtAlerts(pendingDebtsWithStatus);
  }, [pendingDebtsWithStatus]);
  
  return {
    // Dados originais (para compatibilidade)
    dividas,
    dividasPendentes,
    dividasPagas,
    estatisticas,
    carregado,
    
    // Dados enriquecidos
    debtsWithStatus,
    pendingDebtsWithStatus,
    paidDebtsWithStatus,
    summary,
    alerts,
    
    // Funções (mantém as originais)
    adicionarDivida,
    editarDivida,
    excluirDivida,
    marcarComoPago,
    desmarcarPagamento
  };
}
