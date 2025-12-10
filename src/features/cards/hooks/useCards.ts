/**
 * Hook principal para gerenciamento de cartões
 * Wrapper do useCartaoCredito original com funcionalidades extras
 */

import { useMemo } from 'react';
import { useCartaoCredito } from '../../../hooks/useCartaoCredito';
import { CardWithStats, CardSummaryData } from '../types';
import { enrichCardWithStats } from '../utils/cardHelpers';

export function useCards() {
  // Hook original (mantém toda lógica existente)
  const {
    cartoes,
    gastos: gastosCartao,
    carregado,
    faturasPagas,
    adicionarCartao,
    editarCartao,
    excluirCartao,
    adicionarGasto,
    editarGasto,
    excluirGasto,
    obterFaturaAtual,
    pagarFatura,
    estatisticas: estatisticasCartoes
  } = useCartaoCredito();
  
  // Enriquece cartões com estatísticas
  const cardsWithStats = useMemo((): CardWithStats[] => {
    return cartoes.map(card => {
      const faturaAtual = obterFaturaAtual(card.id);
      // TODO: Implementar obterProximaFatura se necessário
      const proximaFatura = null;
      
      return enrichCardWithStats(card, gastosCartao, faturaAtual, proximaFatura);
    });
  }, [cartoes, gastosCartao, obterFaturaAtual]);
  
  // Cartões ativos
  const activeCards = useMemo(() => {
    return cardsWithStats.filter(c => c.ativo);
  }, [cardsWithStats]);
  
  // Resumo geral
  const summary = useMemo((): CardSummaryData => {
    const active = cardsWithStats.filter(c => c.ativo);
    
    return {
      totalCards: cartoes.length,
      totalLimit: active.reduce((sum, c) => sum + c.limite, 0),
      totalAvailable: active.reduce((sum, c) => sum + c.limiteDisponivel, 0),
      totalUsed: active.reduce((sum, c) => sum + c.limiteUtilizado, 0),
      totalInvoices: active.reduce((sum, c) => sum + (c.faturaAtual?.total || 0), 0),
      activeCards: active.length
    };
  }, [cardsWithStats, cartoes]);
  
  return {
    // Dados originais (compatibilidade)
    cartoes,
    gastosCartao,
    carregado,
    faturasPagas,
    estatisticasCartoes,
    
    // Dados enriquecidos
    cardsWithStats,
    activeCards,
    summary,
    
    // Funções (mantém as originais)
    adicionarCartao,
    editarCartao,
    excluirCartao,
    adicionarGasto,
    editarGasto,
    excluirGasto,
    obterFaturaAtual,
    pagarFatura
  };
}
