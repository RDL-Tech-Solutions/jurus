import { useMemo } from 'react';
import { AlertTriangle, Clock, CheckCircle2, ChevronRight, Banknote, AlertCircle } from 'lucide-react';
import { formatarMoeda } from '../../utils/calculos';
import { cn } from '../../utils/cn';
import { Divida } from '../../types/fluxoCaixa';

interface CardResumoDividasProps {
    estatisticas: {
        totalPendente: number;
        quantidadePendente: number;
        vencimentoProximo: Divida[];
        vencidas: Divida[];
    };
    dividasPendentes: Divida[];
    onPagarDivida: (valor: number, descricao: string) => void;
    onMarcarComoPago: (id: string) => number;
    onVerTodas: () => void;
}

export function CardResumoDividas({
    estatisticas,
    dividasPendentes,
    onPagarDivida,
    onMarcarComoPago,
    onVerTodas
}: CardResumoDividasProps) {
    const { totalPendente, quantidadePendente, vencimentoProximo, vencidas } = estatisticas;

    // Top 3 próximas a vencer
    const proximasAVencer = useMemo(() => {
        return dividasPendentes.slice(0, 3);
    }, [dividasPendentes]);

    const handlePagar = (divida: Divida) => {
        const valor = onMarcarComoPago(divida.id);
        if (valor > 0) {
            onPagarDivida(valor, `Pagamento: ${divida.descricao}`);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                        <Banknote className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Dívidas Pendentes
                        </h3>
                        <p className="text-xs text-gray-500">
                            {quantidadePendente} {quantidadePendente === 1 ? 'dívida' : 'dívidas'}
                        </p>
                    </div>
                </div>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                    {formatarMoeda(totalPendente)}
                </p>
            </div>

            {/* Alertas */}
            {vencidas.length > 0 && (
                <div className="p-2 mb-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-medium text-red-700 dark:text-red-400">
                            {vencidas.length} dívida{vencidas.length > 1 ? 's' : ''} vencida{vencidas.length > 1 ? 's' : ''}!
                        </span>
                    </div>
                </div>
            )}

            {vencimentoProximo.length > 0 && vencidas.length === 0 && (
                <div className="p-2 mb-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                            {vencimentoProximo.length} vencendo em 7 dias
                        </span>
                    </div>
                </div>
            )}

            {/* Lista de próximas */}
            {proximasAVencer.length > 0 ? (
                <div className="space-y-2 mb-3">
                    {proximasAVencer.map(divida => {
                        const isVencida = divida.dataVencimento && new Date(divida.dataVencimento) < new Date();
                        return (
                            <div
                                key={divida.id}
                                className={cn(
                                    "flex items-center justify-between p-2 rounded-lg",
                                    isVencida
                                        ? "bg-red-50 dark:bg-red-900/20"
                                        : "bg-gray-50 dark:bg-gray-700/50"
                                )}
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {divida.descricao}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Clock className="w-3 h-3" />
                                        {divida.dataVencimento
                                            ? new Date(divida.dataVencimento).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                                            : 'Sem vencimento'
                                        }
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-red-600">
                                        {formatarMoeda(divida.valor)}
                                    </span>
                                    <button
                                        onClick={() => handlePagar(divida)}
                                        className="px-2 py-1 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                    >
                                        Pagar
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex items-center justify-center gap-2 p-4 text-gray-500">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Nenhuma dívida pendente!</span>
                </div>
            )}

            {/* Botão Ver Todas */}
            {quantidadePendente > 3 && (
                <button
                    onClick={onVerTodas}
                    className="w-full flex items-center justify-center gap-1 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                    Ver todas ({quantidadePendente})
                    <ChevronRight className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
