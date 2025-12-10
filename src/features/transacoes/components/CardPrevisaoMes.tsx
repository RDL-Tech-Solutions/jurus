/**
 * Card de Previsão do Mês - LAYOUT ORIGINAL
 * Lógica atualizada, visual mantido
 */

import React, { useMemo } from 'react';
import { useFluxoCaixa } from '../../../hooks/useFluxoCaixaV2';
import { useRecorrentes } from '../../../hooks/useRecorrentesV2';
import { useDividas } from '../../../hooks/useDividasV2';
import { useCartaoCredito } from '../../../hooks/useCartaoCreditoV2';

interface CardPrevisaoMesProps {
  saldoAtual: number;
  transacoes: any[];
  recorrentes: any[];
  gastosCartao: any[];
  cartoes: any[];
  faturasPagas: any[];
  dividasPendentes: any[];
}

export const CardPrevisaoMes: React.FC<Partial<CardPrevisaoMesProps>> = () => {
  // Hooks atualizados
  const { estatisticas, transacoes } = useFluxoCaixa();
  const { recorrentes } = useRecorrentes();
  const { dividasPendentes } = useDividas();
  const { cartoes, gastos: gastosCartao } = useCartaoCredito();

  // Cálculo da previsão com lógica corrigida
  const previsao = useMemo(() => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    const diaAtual = hoje.getDate();
    
    // Dias restantes no mês
    const ultimoDia = new Date(anoAtual, mesAtual + 1, 0).getDate();
    const diasRestantes = ultimoDia - diaAtual;
    
    // Saldo atual do mês (receitas - despesas até hoje)
    const saldoAtual = estatisticas.totalEntradas - estatisticas.totalSaidas;
    
    // Receitas e despesas FUTURAS (ainda não realizadas neste mês)
    let receitasPrevistas = 0;
    let despesasPrevistas = 0;
    
    // Recorrentes que ainda vão acontecer neste mês
    recorrentes.filter(r => r.ativa).forEach(rec => {
      if (rec.proximaData) {
        const proxData = new Date(rec.proximaData);
        // Apenas se for neste mês E após hoje
        if (proxData.getMonth() === mesAtual && 
            proxData.getFullYear() === anoAtual && 
            proxData.getDate() > diaAtual) {
          if (rec.tipo === 'entrada') {
            receitasPrevistas += rec.valor;
          } else {
            despesasPrevistas += rec.valor;
          }
        }
      }
    });
    
    // Dívidas a vencer (apenas futuras)
    dividasPendentes.forEach(div => {
      if (div.dataVencimento) {
        const venc = new Date(div.dataVencimento);
        // Apenas se for neste mês E após hoje
        if (venc.getMonth() === mesAtual && 
            venc.getFullYear() === anoAtual && 
            venc.getDate() > diaAtual) {
          despesasPrevistas += div.valor;
        }
      }
    });
    
    // Média diária de gastos (apenas para projeção dos dias restantes)
    // Calcula média apenas dos dias já passados
    const diasPassados = diaAtual;
    const mediaDiaria = diasPassados > 0 ? estatisticas.totalSaidas / diasPassados : 0;
    const projecaoGastos = mediaDiaria * diasRestantes;
    
    // Saldo final previsto
    const saldoFinal = saldoAtual + receitasPrevistas - despesasPrevistas - projecaoGastos;
    
    return {
      saldoAtual,
      receitasPrevistas,
      despesasPrevistas: despesasPrevistas + projecaoGastos,
      saldoFinal,
      diasRestantes
    };
  }, [estatisticas, recorrentes, dividasPendentes]);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Layout moderno e compacto
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📊</span>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
          Previsão do Mês
        </h3>
      </div>
      
      <div className="space-y-2.5">
        {/* Saldo Atual */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Saldo Atual:</span>
          <span className={`font-semibold ${
            previsao.saldoAtual >= 0 
              ? 'text-gray-900 dark:text-white' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {formatarMoeda(previsao.saldoAtual)}
          </span>
        </div>
        
        {/* Receitas Previstas */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Receitas Previstas:</span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            + {formatarMoeda(previsao.receitasPrevistas)}
          </span>
        </div>
        
        {/* Despesas Previstas */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Despesas Previstas:</span>
          <span className="font-semibold text-red-600 dark:text-red-400">
            - {formatarMoeda(previsao.despesasPrevistas)}
          </span>
        </div>
        
        {/* Divisor */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>
        
        {/* Saldo Previsto */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Saldo Previsto (fim do mês):
          </span>
          <span className={`font-bold text-base sm:text-lg ${
            previsao.saldoFinal >= 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {formatarMoeda(previsao.saldoFinal)}
          </span>
        </div>
        
        {/* Dias restantes */}
        {previsao.diasRestantes > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-right mt-2">
            {previsao.diasRestantes} dias restantes no mês
          </div>
        )}
      </div>
    </div>
  );
};
