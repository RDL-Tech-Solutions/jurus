/**
 * Card de Transações Recorrentes - Completamente Refatorado
 */

import React, { memo } from 'react';
import { Repeat, Play, Pause, Calendar, DollarSign, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useRecorrentes } from '../../../hooks/useRecorrentes';
import { cn } from '../../../utils/cn';

interface CardRecorrentesProps {
    onAdicionarRecorrente?: () => void;
    onEditarRecorrente?: (recorrenteId: string) => void;
    onExcluirRecorrente?: (recorrenteId: string) => void;
    onVerMais?: () => void;
    onToggleAtiva?: (id: string) => void;
}

export const CardRecorrentes: React.FC<CardRecorrentesProps> = memo(({ 
    onAdicionarRecorrente,
    onEditarRecorrente,
    onExcluirRecorrente,
    onVerMais,
    onToggleAtiva 
}) => {
    const { recorrentes } = useRecorrentes();

    const recorrentesAtivas = recorrentes.filter(r => r.ativa);
    const recorrentesPausadas = recorrentes.filter(r => !r.ativa);

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const formatarFrequencia = (freq: string) => {
        const map: Record<string, string> = {
            'diaria': 'Diária',
            'semanal': 'Semanal',
            'mensal': 'Mensal',
            'anual': 'Anual'
        };
        return map[freq] || freq;
    };

    const formatarProximaData = (data: string) => {
        const date = new Date(data);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        
        const diff = Math.ceil((date.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diff === 0) return 'Hoje';
        if (diff === 1) return 'Amanhã';
        if (diff < 0) return 'Atrasada';
        if (diff <= 7) return `Em ${diff} dias`;
        
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    };

    const calcularTotalMensal = () => {
        return recorrentesAtivas.reduce((total, r) => {
            // Estimar quantas vezes por mês
            let vezesPorMes = 1;
            switch (r.frequencia) {
                case 'diaria':
                    vezesPorMes = 30;
                    break;
                case 'semanal':
                    vezesPorMes = 4;
                    break;
                case 'mensal':
                    vezesPorMes = 1;
                    break;
                case 'anual':
                    vezesPorMes = 1 / 12;
                    break;
            }
            return total + (r.valor * vezesPorMes);
        }, 0);
    };

    const totalEntradas = recorrentesAtivas
        .filter(r => r.tipo === 'entrada')
        .reduce((sum, r) => sum + r.valor, 0);
    
    const totalSaidas = recorrentesAtivas
        .filter(r => r.tipo === 'saida')
        .reduce((sum, r) => sum + r.valor, 0);

    if (recorrentes.length === 0) {
        return (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800 transition-all hover:shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                        <Repeat className="w-5 h-5" />
                        Transações Recorrentes
                    </h3>
                </div>
                <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-800/30 flex items-center justify-center">
                        <span className="text-3xl">🔄</span>
                    </div>
                    <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-3">
                        Nenhuma recorrência configurada
                    </p>
                    {onAdicionarRecorrente && (
                        <button
                            onClick={onAdicionarRecorrente}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                            <Repeat className="w-4 h-4" />
                            Criar Recorrente
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800 transition-all hover:shadow-lg group">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                    <Repeat className="w-5 h-5" />
                    Recorrentes
                </h3>
                {onVerMais && (
                    <button
                        onClick={onVerMais}
                        className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
                    >
                        Ver todas
                        <ChevronRight className="w-3 h-3" />
                    </button>
                )}
            </div>

            {/* Resumo */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 border border-indigo-100 dark:border-indigo-900">
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-1">Ativas</p>
                    <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
                        {recorrentesAtivas.length}
                    </p>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 border border-green-100 dark:border-green-900">
                    <p className="text-xs text-green-600 dark:text-green-400 mb-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Entradas
                    </p>
                    <p className="text-sm font-bold text-green-900 dark:text-green-100">
                        {formatarMoeda(totalEntradas)}
                    </p>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 border border-red-100 dark:border-red-900">
                    <p className="text-xs text-red-600 dark:text-red-400 mb-1 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        Saídas
                    </p>
                    <p className="text-sm font-bold text-red-900 dark:text-red-100">
                        {formatarMoeda(totalSaidas)}
                    </p>
                </div>
            </div>

            {/* Lista de Recorrentes */}
            <div className="space-y-2">
                {recorrentesAtivas.slice(0, 4).map((recorrente) => (
                    <div
                        key={recorrente.id}
                        className={cn(
                            'p-3 rounded-xl border transition-all hover:scale-[1.02]',
                            recorrente.tipo === 'entrada'
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                        )}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate flex items-center gap-2">
                                    {recorrente.tipo === 'entrada' ? (
                                        <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4 text-red-600 flex-shrink-0" />
                                    )}
                                    {recorrente.descricao}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {formatarFrequencia(recorrente.frequencia)}
                                </p>
                            </div>
                            <div className="text-right ml-2">
                                <p className={cn(
                                    'text-sm font-bold',
                                    recorrente.tipo === 'entrada'
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                )}>
                                    {formatarMoeda(recorrente.valor)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Próxima: {formatarProximaData(recorrente.proximaData)}
                            </span>
                            {onToggleAtiva && (
                                <button
                                    onClick={() => onToggleAtiva(recorrente.id)}
                                    className="p-1 rounded hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                                    title={recorrente.ativa ? 'Pausar' : 'Ativar'}
                                >
                                    {recorrente.ativa ? (
                                        <Pause className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                                    ) : (
                                        <Play className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Ver mais */}
            {recorrentesAtivas.length > 4 && (
                <div className="mt-4 text-center">
                    <button
                        onClick={onVerMais}
                        className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                    >
                        + {recorrentesAtivas.length - 4} recorrentes
                    </button>
                </div>
            )}

            {/* Pausadas */}
            {recorrentesPausadas.length > 0 && (
                <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-indigo-100 dark:border-indigo-900">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        {recorrentesPausadas.length} recorrente{recorrentesPausadas.length !== 1 ? 's' : ''} pausada{recorrentesPausadas.length !== 1 ? 's' : ''}
                    </p>
                </div>
            )}
        </div>
    );
});

CardRecorrentes.displayName = 'CardRecorrentes';
