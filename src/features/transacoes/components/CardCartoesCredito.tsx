/**
 * Card de Cartões de Crédito - Sincronizado com área de Cartões
 */

import React, { memo } from 'react';
import { CreditCard, TrendingUp, AlertTriangle, ChevronRight } from 'lucide-react';
import { useCartaoCredito } from '../../../hooks/useCartaoCredito';
import { cn } from '../../../utils/cn';

interface CardCartoesCreditoProps {
    onVerMais?: () => void;
}

export const CardCartoesCredito: React.FC<CardCartoesCreditoProps> = memo(({ onVerMais }) => {
    const { cartoes, estatisticas, obterFaturaAtual } = useCartaoCredito();

    const cartoesAtivos = cartoes.filter(c => c.ativo);

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const calcularPercentualUsado = (usado: number, limite: number) => {
        if (limite === 0) return 0;
        return Math.min(100, (usado / limite) * 100);
    };

    const getStatusColor = (percentual: number) => {
        if (percentual >= 90) return 'text-red-600 dark:text-red-400';
        if (percentual >= 70) return 'text-orange-600 dark:text-orange-400';
        return 'text-green-600 dark:text-green-400';
    };

    const getBarColor = (percentual: number) => {
        if (percentual >= 90) return 'bg-red-500';
        if (percentual >= 70) return 'bg-orange-500';
        return 'bg-green-500';
    };

    if (cartoesAtivos.length === 0) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 transition-all hover:shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Cartões de Crédito
                    </h3>
                </div>
                <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <span className="text-3xl">💳</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Nenhum cartão cadastrado
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Adicione um cartão para começar
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 transition-all hover:shadow-lg group">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Cartões de Crédito
                </h3>
                {onVerMais && (
                    <button
                        onClick={onVerMais}
                        className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
                    >
                        Ver todos
                        <ChevronRight className="w-3 h-3" />
                    </button>
                )}
            </div>

            {/* Resumo */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 border border-blue-100 dark:border-blue-900">
                    <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Limite Total</p>
                    <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                        {formatarMoeda(estatisticas.totalLimite)}
                    </p>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 border border-blue-100 dark:border-blue-900">
                    <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Usado</p>
                    <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                        {formatarMoeda(estatisticas.totalUsado)}
                    </p>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 border border-blue-100 dark:border-blue-900">
                    <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Disponível</p>
                    <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                        {formatarMoeda(estatisticas.limiteDisponivel)}
                    </p>
                </div>
            </div>

            {/* Lista de Cartões */}
            <div className="space-y-3">
                {cartoesAtivos.slice(0, 3).map((cartao) => {
                    const fatura = obterFaturaAtual(cartao.id);
                    const usado = fatura?.total || 0;
                    const disponivel = cartao.limite - usado;
                    const percentual = calcularPercentualUsado(usado, cartao.limite);

                    return (
                        <div
                            key={cartao.id}
                            className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-blue-100 dark:border-blue-900 transition-all hover:scale-[1.02] hover:shadow-md"
                        >
                            {/* Mini Card Visual */}
                            <div
                                className="h-20 rounded-lg p-3 mb-3 relative overflow-hidden"
                                style={{ background: `linear-gradient(135deg, ${cartao.cor} 0%, ${cartao.cor}dd 100%)` }}
                            >
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
                                </div>
                                <div className="relative h-full flex flex-col justify-between text-white">
                                    <p className="text-xs font-semibold">{cartao.nome}</p>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-[10px] opacity-70">Disponível</p>
                                            <p className="text-sm font-bold">{formatarMoeda(disponivel)}</p>
                                        </div>
                                        <p className="text-[10px] opacity-70">{cartao.bandeira}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Barra de Uso */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-600 dark:text-gray-400">Limite utilizado</span>
                                    <span className={cn('font-semibold', getStatusColor(percentual))}>
                                        {percentual.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={cn('h-full rounded-full transition-all', getBarColor(percentual))}
                                        style={{ width: `${Math.min(100, percentual)}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
                                    <span>{formatarMoeda(usado)} usado</span>
                                    <span>{formatarMoeda(disponivel)} disponível</span>
                                </div>
                            </div>

                            {/* Alerta */}
                            {percentual >= 70 && (
                                <div className={cn(
                                    'mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs',
                                    percentual >= 90
                                        ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                                        : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                                )}>
                                    <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                                    <span>
                                        {percentual >= 90 ? 'Limite quase esgotado!' : 'Atenção ao limite'}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Ver mais */}
            {cartoesAtivos.length > 3 && (
                <div className="mt-4 text-center">
                    <button
                        onClick={onVerMais}
                        className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        + {cartoesAtivos.length - 3} cartões
                    </button>
                </div>
            )}

            {/* Total de Faturas */}
            {estatisticas.totalFaturas > 0 && (
                <div className="mt-4 p-3 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-blue-100 dark:border-blue-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Total de Faturas Abertas
                        </span>
                        <span className="text-sm font-bold text-blue-900 dark:text-blue-100">
                            {formatarMoeda(estatisticas.totalFaturas)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
});

CardCartoesCredito.displayName = 'CardCartoesCredito';
