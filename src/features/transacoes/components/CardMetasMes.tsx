/**
 * Card de Metas do Mês - Limites de Gastos por Categoria
 */

import React, { memo } from 'react';
import { Target, AlertTriangle, Plus, ChevronRight } from 'lucide-react';
import { useMetas } from '../../../hooks/useMetas';
import { useFluxoCaixa } from '../../../hooks/useFluxoCaixa';
import { cn } from '../../../utils/cn';

interface CardMetasMesProps {
    onAdicionarMeta?: () => void;
    onEditarMeta?: (metaId: string) => void;
    onExcluirMeta?: (metaId: string) => void;
    onVerMais?: () => void;
}

export const CardMetasMes: React.FC<CardMetasMesProps> = memo(({ onAdicionarMeta, onEditarMeta, onExcluirMeta, onVerMais }) => {
    const { metas } = useMetas();
    const { estatisticas, obterCategoria } = useFluxoCaixa();

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const calcularProgresso = (meta: any) => {
        const gastosCategoria = estatisticas.transacoesPorCategoria.find(
            t => t.categoria.id === meta.categoriaId && t.tipo === 'saida'
        );
        
        const atual = gastosCategoria?.total || 0;
        const percentual = meta.limite > 0 ? (atual / meta.limite) * 100 : 0;
        
        return {
            atual,
            percentual: Math.min(100, percentual),
            ultrapassou: atual > meta.limite,
            alerta80: percentual >= 80 && percentual < 100,
            alerta100: percentual >= 100
        };
    };

    if (metas.length === 0) {
        return (
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 transition-all hover:shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Metas de Gastos
                    </h3>
                </div>
                <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-800/30 flex items-center justify-center">
                        <span className="text-3xl">🎯</span>
                    </div>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-3">
                        Nenhuma meta definida
                    </p>
                    {onAdicionarMeta && (
                        <button
                            onClick={onAdicionarMeta}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Criar Meta
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const metasExibir = metas.slice(0, 3);

    return (
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 transition-all hover:shadow-lg group">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Metas de Gastos
                </h3>
                <div className="flex items-center gap-2">
                    {onAdicionarMeta && (
                        <button
                            onClick={onAdicionarMeta}
                            className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                            title="Adicionar Meta"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Lista de Metas */}
            <div className="space-y-3">
                {metasExibir.map((meta) => {
                    const progresso = calcularProgresso(meta);
                    const categoria = obterCategoria(meta.categoriaId);

                    return (
                        <div
                            key={meta.id}
                            className={cn(
                                'bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border transition-all hover:scale-[1.02]',
                                progresso.alerta100
                                    ? 'border-red-300 dark:border-red-700'
                                    : progresso.alerta80
                                    ? 'border-orange-300 dark:border-orange-700'
                                    : 'border-purple-200 dark:border-purple-800'
                            )}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <span className="text-xl flex-shrink-0">{categoria?.icone || '📊'}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                            {categoria?.nome || 'Categoria'}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Limite de gastos
                                        </p>
                                    </div>
                                </div>
                                {(progresso.alerta80 || progresso.alerta100) && (
                                    <AlertTriangle className={cn(
                                        'w-5 h-5 flex-shrink-0',
                                        progresso.alerta100 ? 'text-red-600' : 'text-orange-600'
                                    )} />
                                )}
                            </div>

                            {/* Valores */}
                            <div className="flex items-center justify-between mb-2 text-xs">
                                <span className="text-gray-600 dark:text-gray-400">
                                    {formatarMoeda(progresso.atual)} de {formatarMoeda(meta.limite)}
                                </span>
                                <span className={cn(
                                    'font-semibold',
                                    progresso.alerta100
                                        ? 'text-red-600 dark:text-red-400'
                                        : progresso.alerta80
                                        ? 'text-orange-600 dark:text-orange-400'
                                        : 'text-purple-600 dark:text-purple-400'
                                )}>
                                    {progresso.percentual.toFixed(0)}%
                                </span>
                            </div>

                            {/* Barra de Progresso */}
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                <div
                                    className={cn(
                                        'h-full rounded-full transition-all',
                                        progresso.alerta100
                                            ? 'bg-red-500'
                                            : progresso.alerta80
                                            ? 'bg-orange-500'
                                            : 'bg-purple-500'
                                    )}
                                    style={{ width: `${progresso.percentual}%` }}
                                />
                            </div>

                            {/* Status */}
                            {progresso.ultrapassou ? (
                                <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">
                                    ⚠️ Limite ultrapassado em {formatarMoeda(progresso.atual - meta.limite)}
                                </p>
                            ) : progresso.alerta80 ? (
                                <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                                    Faltam {formatarMoeda(meta.limite - progresso.atual)}
                                </p>
                            ) : (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                                    Faltam {formatarMoeda(meta.limite - progresso.atual)}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Ver mais */}
            {metas.length > 3 && (
                <div className="mt-4 text-center">
                    <button
                        onClick={onVerMais}
                        className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                    >
                        + {metas.length - 3} metas
                    </button>
                </div>
            )}
        </div>
    );
});

CardMetasMes.displayName = 'CardMetasMes';
