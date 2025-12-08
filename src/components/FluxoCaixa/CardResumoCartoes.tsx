import { CreditCard, Calendar, AlertTriangle, ChevronRight, DollarSign, Check } from 'lucide-react';
import { formatarMoeda } from '../../utils/calculos';
import { cn } from '../../utils/cn';
import { CartaoCredito, Fatura } from '../../types/fluxoCaixa';

interface CardResumoCartoesProps {
    cartoes: CartaoCredito[];
    estatisticas: {
        totalFaturas: number;
        totalLimite: number;
        totalUsado: number;
        limiteDisponivel: number;
        quantidadeCartoes: number;
    };
    obterFaturaAtual: (cartaoId: string) => Fatura | null;
    onPagarFatura: (cartaoId: string, mes: number, ano: number) => number;
    onRegistrarPagamento: (valor: number, descricao: string) => void;
    onVerDetalhes: () => void;
}

export function CardResumoCartoes({
    cartoes,
    estatisticas,
    obterFaturaAtual,
    onPagarFatura,
    onRegistrarPagamento,
    onVerDetalhes
}: CardResumoCartoesProps) {
    const { totalFaturas, totalLimite, totalUsado, limiteDisponivel, quantidadeCartoes } = estatisticas;

    const percentualUsado = totalLimite > 0 ? (totalUsado / totalLimite) * 100 : 0;

    const handlePagarFatura = (cartao: CartaoCredito) => {
        const hoje = new Date();
        const valor = onPagarFatura(cartao.id, hoje.getMonth(), hoje.getFullYear());
        if (valor > 0) {
            onRegistrarPagamento(valor, `Fatura ${cartao.nome} - ${hoje.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                        <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Cartões de Crédito
                        </h3>
                        <p className="text-xs text-gray-500">
                            {quantidadeCartoes} {quantidadeCartoes === 1 ? 'cartão' : 'cartões'}
                        </p>
                    </div>
                </div>
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {formatarMoeda(totalFaturas)}
                </p>
            </div>

            {/* Barra de Limite */}
            <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">Limite utilizado</span>
                    <span className={cn(
                        "font-medium",
                        percentualUsado > 80 ? "text-red-600" : "text-gray-600"
                    )}>
                        {percentualUsado.toFixed(0)}%
                    </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-500",
                            percentualUsado > 80 ? "bg-red-500" :
                                percentualUsado > 50 ? "bg-amber-500" : "bg-purple-500"
                        )}
                        style={{ width: `${Math.min(100, percentualUsado)}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs mt-1 text-gray-500">
                    <span>Usado: {formatarMoeda(totalUsado)}</span>
                    <span>Disponível: {formatarMoeda(limiteDisponivel)}</span>
                </div>
            </div>

            {/* Alerta de limite alto */}
            {percentualUsado > 80 && (
                <div className="p-2 mb-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-medium text-red-700 dark:text-red-400">
                            Limite acima de 80%! Considere reduzir gastos.
                        </span>
                    </div>
                </div>
            )}

            {/* Lista de cartões */}
            {cartoes.length > 0 ? (
                <div className="space-y-2 mb-3">
                    {cartoes.slice(0, 3).map(cartao => {
                        const fatura = obterFaturaAtual(cartao.id);
                        const faturaAberta = fatura && !fatura.paga && fatura.total > 0;

                        return (
                            <div
                                key={cartao.id}
                                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {cartao.nome}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Calendar className="w-3 h-3" />
                                        Fecha dia {cartao.diaFechamento}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {fatura && fatura.total > 0 && (
                                        <span className={cn(
                                            "text-sm font-semibold",
                                            fatura.paga ? "text-green-600" : "text-purple-600"
                                        )}>
                                            {fatura.paga ? (
                                                <span className="flex items-center gap-1">
                                                    <Check className="w-3 h-3" /> Paga
                                                </span>
                                            ) : formatarMoeda(fatura.total)}
                                        </span>
                                    )}
                                    {faturaAberta && (
                                        <button
                                            onClick={() => handlePagarFatura(cartao)}
                                            className="px-2 py-1 text-xs font-medium bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                                        >
                                            Pagar
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex items-center justify-center gap-2 p-4 text-gray-500">
                    <CreditCard className="w-5 h-5" />
                    <span className="text-sm">Nenhum cartão cadastrado</span>
                </div>
            )}

            {/* Botão Ver Detalhes */}
            {cartoes.length > 0 && (
                <button
                    onClick={onVerDetalhes}
                    className="w-full flex items-center justify-center gap-1 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                    Ver detalhes
                    <ChevronRight className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
