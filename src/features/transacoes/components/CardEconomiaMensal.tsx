/**
 * Card de Economia Mensal - LAYOUT ORIGINAL
 * Lógica atualizada, visual mantido
 */

import React, { useMemo } from 'react';
import { useFluxoCaixa } from '../../../hooks/useFluxoCaixaV2';
import { useMetas } from '../../../hooks/useMetas';

interface CardEconomiaMensalProps {
  receitasConsideradas: number;
  despesasConsideradas: number;
  transacoesEntrada: any[];
  transacoesSaida: any[];
  categorias: any[];
  onEditarTransacao?: (id: string, dados: any) => void;
  onExcluirTransacao?: (id: string) => void;
}

export const CardEconomiaMensal: React.FC<Partial<CardEconomiaMensalProps>> = () => {
  // Hooks atualizados
  const { estatisticas } = useFluxoCaixa();
  const { metas } = useMetas();

  // Cálculo da economia com lógica atualizada
  const economia = useMemo(() => {
    const receitas = estatisticas.totalEntradas;
    const despesas = estatisticas.totalSaidas;
    const economizado = receitas - despesas;
    
    // Buscar meta de economia
    const metaEconomia = metas.find(m => m.categoriaId === 'economia');
    const objetivo = metaEconomia?.limite || 0;
    
    // Percentual economizado
    const percentual = receitas > 0 ? (economizado / receitas) * 100 : 0;
    
    // Taxa recomendada
    const taxaRecomendada = 20;
    const economiaRecomendada = receitas * (taxaRecomendada / 100);
    
    return {
      receitas,
      despesas,
      economizado,
      objetivo,
      percentual,
      economiaRecomendada,
      atingiuObjetivo: economizado >= objetivo && objetivo > 0
    };
  }, [estatisticas, metas]);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // LAYOUT ORIGINAL - Simples e direto
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        💰 Economia Mensal
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Receitas:</span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            {formatarMoeda(economia.receitas)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Despesas:</span>
          <span className="font-semibold text-red-600 dark:text-red-400">
            {formatarMoeda(economia.despesas)}
          </span>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Economizado:
            </span>
            <span className={`font-bold text-lg ${
              economia.economizado >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {formatarMoeda(economia.economizado)}
            </span>
          </div>
          
          {economia.receitas > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
              {economia.percentual.toFixed(1)}% das receitas
            </div>
          )}
        </div>
        
        {economia.objetivo > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3 mt-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-blue-700 dark:text-blue-300">Objetivo do Mês:</span>
              <span className="font-semibold text-blue-700 dark:text-blue-300">
                {formatarMoeda(economia.objetivo)}
              </span>
            </div>
            {economia.atingiuObjetivo && (
              <div className="text-xs text-green-600 dark:text-green-400 text-center mt-1">
                ✓ Objetivo atingido!
              </div>
            )}
          </div>
        )}
        
        {economia.economizado < economia.economiaRecomendada && (
          <div className="text-xs text-amber-600 dark:text-amber-400 text-center mt-2">
            💡 Recomendação: Economize {formatarMoeda(economia.economiaRecomendada)} (20% das receitas)
          </div>
        )}
      </div>
    </div>
  );
};
