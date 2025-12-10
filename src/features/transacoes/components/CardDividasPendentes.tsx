/**
 * Card de Dívidas Pendentes - Sincronizado com área de Dívidas
 */

import React, { memo, useState, useCallback } from 'react';
import { AlertCircle, TrendingUp, Calendar, DollarSign, ChevronRight } from 'lucide-react';
import { useDividas } from '../../../hooks/useDividasV2';
import { cn } from '../../../utils/cn';
import { ExportButton, ExportModal } from '../../export/components';
import { useExport } from '../../export/hooks/useExport';

interface CardDividasPendentesProps {
    onVerMais?: () => void;
}

export const CardDividasPendentes: React.FC<CardDividasPendentesProps> = memo(({ onVerMais }) => {
    const { dividasPendentes, totalPendente } = useDividas();
    const { exportData, isExporting } = useExport();
    const [showExportModal, setShowExportModal] = useState(false);

    const handleExportDividas = useCallback(async (config: any) => {
        // Formatar dados para exportação
        const dividasData = {
            summary: {
                title: 'Relatório de Dívidas Pendentes',
                description: `Total: ${dividasPendentes.length} dívidas | Valor: ${formatarMoeda(totalPendente)}`
            },
            tables: [
                {
                    title: 'Dívidas Pendentes',
                    headers: ['Descrição', 'Valor', 'Vencimento', 'Parcelas', 'Status'],
                    rows: dividasPendentes.map(d => [
                        d.descricao,
                        formatarMoeda(d.valor),
                        d.dataVencimento ? new Date(d.dataVencimento).toLocaleDateString('pt-BR') : 'N/A',
                        d.numeroParcelas ? `${d.parcelaAtual}/${d.numeroParcelas}` : 'Única',
                        d.dataVencimento && new Date(d.dataVencimento) < new Date() ? 'Vencida' : 'Pendente'
                    ])
                }
            ],
            sheets: [
                {
                    name: 'Dívidas',
                    json: dividasPendentes.map(d => ({
                        Descrição: d.descricao,
                        Valor: d.valor,
                        Vencimento: d.dataVencimento || 'N/A',
                        Parcelas: d.numeroParcelas ? `${d.parcelaAtual}/${d.numeroParcelas}` : 'Única',
                        Observações: d.observacoes || ''
                    }))
                }
            ],
            headers: ['Descrição', 'Valor', 'Vencimento', 'Parcelas'],
            rows: dividasPendentes.map(d => [
                d.descricao,
                d.valor,
                d.dataVencimento || 'N/A',
                d.numeroParcelas ? `${d.parcelaAtual}/${d.numeroParcelas}` : 'Única'
            ])
        };
        await exportData('dividas', dividasData, config.format, config);
    }, [exportData, dividasPendentes, totalPendente]);

    // Pegar as 3 próximas dívidas a vencer
    const proximasDividas = dividasPendentes
        .sort((a, b) => {
            if (!a.dataVencimento || !b.dataVencimento) return 0;
            return new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime();
        })
        .slice(0, 3);

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const calcularDiasAteVencimento = (dataVencimento: string) => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const vencimento = new Date(dataVencimento);
        vencimento.setHours(0, 0, 0, 0);
        const diff = vencimento.getTime() - hoje.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const getStatusColor = (dias: number) => {
        if (dias < 0) return 'text-red-600 dark:text-red-400';
        if (dias <= 7) return 'text-orange-600 dark:text-orange-400';
        return 'text-blue-600 dark:text-blue-400';
    };

    const getStatusBg = (dias: number) => {
        if (dias < 0) return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
        if (dias <= 7) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    };

    const formatarDias = (dias: number) => {
        if (dias < 0) return `${Math.abs(dias)} dias atrás`;
        if (dias === 0) return 'Hoje';
        if (dias === 1) return 'Amanhã';
        return `Em ${dias} dias`;
    };

    if (dividasPendentes.length === 0) {
        return (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800 transition-all hover:shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-green-900 dark:text-green-100 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Dívidas Pendentes
                    </h3>
                </div>
                <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-800/30 flex items-center justify-center">
                        <span className="text-3xl">✅</span>
                    </div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">
                        Nenhuma dívida pendente
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Parabéns! Você está em dia
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800 transition-all hover:shadow-lg group">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-red-900 dark:text-red-100 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Dívidas Pendentes
                </h3>
                <div className="flex items-center gap-2">
                    <ExportButton
                        onClick={() => setShowExportModal(true)}
                        label="Exportar"
                        variant="outline"
                        size="sm"
                        loading={isExporting}
                    />
                    {onVerMais && (
                        <button
                            onClick={onVerMais}
                            className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1 transition-colors"
                        >
                            Ver todas
                            <ChevronRight className="w-3 h-3" />
                        </button>
                    )}
                </div>
            </div>

            {/* Resumo */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 border border-red-100 dark:border-red-900">
                    <p className="text-xs text-red-600 dark:text-red-400 mb-1">Total Pendente</p>
                    <p className="text-lg font-bold text-red-900 dark:text-red-100">
                        {formatarMoeda(totalPendente)}
                    </p>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 border border-red-100 dark:border-red-900">
                    <p className="text-xs text-red-600 dark:text-red-400 mb-1">Quantidade</p>
                    <p className="text-lg font-bold text-red-900 dark:text-red-100">
                        {dividasPendentes.length}
                    </p>
                </div>
            </div>

            {/* Lista de Próximas Dívidas */}
            <div className="space-y-2">
                {proximasDividas.map((divida) => {
                    const dias = divida.dataVencimento ? calcularDiasAteVencimento(divida.dataVencimento) : 0;
                    
                    return (
                        <div
                            key={divida.id}
                            className={cn(
                                'p-3 rounded-xl border transition-all hover:scale-[1.02]',
                                getStatusBg(dias)
                            )}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                        {divida.descricao}
                                    </p>
                                    {divida.numeroParcelas && divida.numeroParcelas > 1 && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Parcela {divida.parcelaAtual}/{divida.numeroParcelas}
                                        </p>
                                    )}
                                </div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white ml-2">
                                    {formatarMoeda(divida.valor)}
                                </p>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className={cn('font-medium flex items-center gap-1', getStatusColor(dias))}>
                                    <Calendar className="w-3 h-3" />
                                    {formatarDias(dias)}
                                </span>
                                {divida.dataVencimento && (
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {new Date(divida.dataVencimento).toLocaleDateString('pt-BR')}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Ver mais */}
            {dividasPendentes.length > 3 && (
                <div className="mt-4 text-center">
                    <button
                        onClick={onVerMais}
                        className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                    >
                        + {dividasPendentes.length - 3} dívidas pendentes
                    </button>
                </div>
            )}

            {/* Modal de Exportação */}
            <ExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                onExport={handleExportDividas}
                reportType="dividas"
                title="Exportar Dívidas Pendentes"
            />
        </div>
    );
});

CardDividasPendentes.displayName = 'CardDividasPendentes';
