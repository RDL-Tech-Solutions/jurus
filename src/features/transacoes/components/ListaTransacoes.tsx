/**
 * Componente de lista de transações otimizado
 * Agrupamento por dia, tags, ícones e layout moderno
 */

import React, { memo, useCallback } from 'react';
import { Calendar, Pencil, Trash2, Repeat, CreditCard } from 'lucide-react';
import { TransacoesPorDia, TransacaoExpandida } from '../types';
import { CategoriaFluxo } from '../../../types/fluxoCaixa';
import { formatarValor, formatarDiaSemana } from '../utils/transacoes';
import { cn } from '../../../utils/cn';

interface ListaTransacoesProps {
  transacoesAgrupadas: TransacoesPorDia[];
  obterCategoria: (id: string) => CategoriaFluxo | undefined;
  onEditar?: (transacao: TransacaoExpandida) => void;
  onExcluir?: (transacao: TransacaoExpandida) => void;
}

// Componente de Tag
const Tag: React.FC<{ 
  icone: React.ReactNode; 
  texto: string; 
  cor: string;
}> = memo(({ icone, texto, cor }) => (
  <div className={cn(
    "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
    cor
  )}>
    {icone}
    <span>{texto}</span>
  </div>
));
Tag.displayName = 'Tag';

// Componente de Item de Transação
const ItemTransacao: React.FC<{
  transacao: TransacaoExpandida;
  categoria?: CategoriaFluxo;
  onEditar?: (transacao: TransacaoExpandida) => void;
  onExcluir?: (transacao: TransacaoExpandida) => void;
}> = memo(({ transacao, categoria, onEditar, onExcluir }) => {
  const handleEditar = useCallback(() => {
    onEditar?.(transacao);
  }, [onEditar, transacao]);
  
  const handleExcluir = useCallback(() => {
    onExcluir?.(transacao);
  }, [onExcluir, transacao]);
  
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Ícone da Categoria */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 shadow-sm"
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
            <div className="flex items-center gap-1 flex-shrink-0">
              {transacao.isRecorrente && (
                <Tag
                  icone={<Repeat className="w-3 h-3" />}
                  texto="Recorrente"
                  cor="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                />
              )}
              {transacao.isParcelada && (
                <Tag
                  icone={<CreditCard className="w-3 h-3" />}
                  texto={`${transacao.parcelaAtual}/${transacao.totalParcelas}`}
                  cor="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                />
              )}
            </div>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {categoria?.nome}
          </p>
          
          {transacao.observacoes && (
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
              {transacao.observacoes}
            </p>
          )}
        </div>
      </div>
      
      {/* Valor e Ações */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
        <span className={cn(
          'text-base font-bold',
          transacao.tipo === 'entrada' 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
        )}>
          {transacao.tipo === 'entrada' ? '+' : '-'}{formatarValor(transacao.valor)}
        </span>
        
        {/* Botões de Ação - Apenas para transações normais */}
        {!transacao.isRecorrente && !transacao.isParcelada && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEditar && (
              <button
                onClick={handleEditar}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Editar transação"
              >
                <Pencil className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            )}
            {onExcluir && (
              <button
                onClick={handleExcluir}
                className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                aria-label="Excluir transação"
              >
                <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
ItemTransacao.displayName = 'ItemTransacao';

// Componente de Grupo por Dia
const GrupoDia: React.FC<{
  grupo: TransacoesPorDia;
  obterCategoria: (id: string) => CategoriaFluxo | undefined;
  onEditar?: (transacao: TransacaoExpandida) => void;
  onExcluir?: (transacao: TransacaoExpandida) => void;
}> = memo(({ grupo, obterCategoria, onEditar, onExcluir }) => {
  return (
    <div className="space-y-2">
      {/* Cabeçalho do Dia */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {formatarDiaSemana(grupo.data)}
          </span>
        </div>
        
        {/* Resumo do Dia */}
        <div className="flex items-center gap-3 text-xs">
          {grupo.totalReceitas > 0 && (
            <span className="text-green-600 dark:text-green-400 font-medium">
              +{formatarValor(grupo.totalReceitas)}
            </span>
          )}
          {grupo.totalDespesas > 0 && (
            <span className="text-red-600 dark:text-red-400 font-medium">
              -{formatarValor(grupo.totalDespesas)}
            </span>
          )}
        </div>
      </div>
      
      {/* Lista de Transações do Dia */}
      <div className="space-y-2">
        {grupo.transacoes.map(transacao => (
          <ItemTransacao
            key={transacao.id}
            transacao={transacao}
            categoria={obterCategoria(transacao.categoriaId)}
            onEditar={onEditar}
            onExcluir={onExcluir}
          />
        ))}
      </div>
    </div>
  );
});
GrupoDia.displayName = 'GrupoDia';

// Componente Principal
export const ListaTransacoes: React.FC<ListaTransacoesProps> = memo(({
  transacoesAgrupadas,
  obterCategoria,
  onEditar,
  onExcluir
}) => {
  if (transacoesAgrupadas.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          Nenhuma transação neste mês
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Clique em "Nova" para adicionar uma transação
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {transacoesAgrupadas.map(grupo => (
        <GrupoDia
          key={grupo.data}
          grupo={grupo}
          obterCategoria={obterCategoria}
          onEditar={onEditar}
          onExcluir={onExcluir}
        />
      ))}
    </div>
  );
});

ListaTransacoes.displayName = 'ListaTransacoes';
