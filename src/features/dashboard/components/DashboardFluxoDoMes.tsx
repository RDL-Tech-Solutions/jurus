/**
 * Fluxo do Mês - Timeline de Transações
 */

import React, { memo } from 'react';
import { Calendar, Repeat, CreditCard } from 'lucide-react';
import { TransacoesPorDia } from '../../transacoes/types';
import { CategoriaFluxo } from '../../../types/fluxoCaixa';
import { formatarValorDashboard } from '../utils/calculos';
import { formatarDiaSemana } from '../../transacoes/utils/transacoes';
import { cn } from '../../../utils/cn';

interface DashboardFluxoDoMesProps {
  transacoesAgrupadas: TransacoesPorDia[];
  obterCategoria: (id: string) => CategoriaFluxo | undefined;
  limite?: number;
}

export const DashboardFluxoDoMes: React.FC<DashboardFluxoDoMesProps> = memo(({
  transacoesAgrupadas,
  obterCategoria,
  limite = 10
}) => {
  // Pega apenas os primeiros dias (limite)
  const diasLimitados = transacoesAgrupadas.slice(0, limite);
  
  if (diasLimitados.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <Calendar className="w-6 h-6" />
          Fluxo do Mês
        </h2>
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">Nenhuma transação neste mês</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
        <Calendar className="w-6 h-6" />
        Fluxo do Mês
      </h2>
      
      <div className="space-y-6">
        {diasLimitados.map((grupo) => (
          <div key={grupo.data} className="relative">
            {/* Linha vertical da timeline */}
            <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-transparent dark:from-blue-800" />
            
            {/* Cabeçalho do Dia */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                {new Date(grupo.data).getDate()}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatarDiaSemana(grupo.data)}
                </h3>
                <div className="flex items-center gap-3 text-xs mt-1">
                  {grupo.totalReceitas > 0 && (
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      +{formatarValorDashboard(grupo.totalReceitas)}
                    </span>
                  )}
                  {grupo.totalDespesas > 0 && (
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      -{formatarValorDashboard(grupo.totalDespesas)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Lista de Transações do Dia */}
            <div className="ml-16 space-y-2">
              {grupo.transacoes.map((transacao) => {
                const categoria = obterCategoria(transacao.categoriaId);
                
                return (
                  <div
                    key={transacao.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {/* Ícone da Categoria */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: `${categoria?.cor}20` }}
                    >
                      {categoria?.icone}
                    </div>
                    
                    {/* Informações */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {transacao.descricao}
                        </p>
                        
                        {/* Tags */}
                        {transacao.isRecorrente && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                            <Repeat className="w-3 h-3" />
                            Recorrente
                          </span>
                        )}
                        {transacao.isParcelada && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            <CreditCard className="w-3 h-3" />
                            {transacao.parcelaAtual}/{transacao.totalParcelas}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {categoria?.nome}
                      </p>
                    </div>
                    
                    {/* Valor */}
                    <span className={cn(
                      'text-base font-bold flex-shrink-0',
                      transacao.tipo === 'entrada'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    )}>
                      {transacao.tipo === 'entrada' ? '+' : '-'}
                      {formatarValorDashboard(transacao.valor)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {transacoesAgrupadas.length > limite && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando {limite} de {transacoesAgrupadas.length} dias com transações
          </p>
        </div>
      )}
    </div>
  );
});

DashboardFluxoDoMes.displayName = 'DashboardFluxoDoMes';
