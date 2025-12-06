import { Calendar, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { EstatisticasFluxo } from '../../types/fluxoCaixa';
import { formatarMoeda } from '../../utils/calculos';
import { cn } from '../../utils/cn';

interface CardComparativoProps {
    atual: EstatisticasFluxo;
    anterior: EstatisticasFluxo;
    periodoAtual: string;
    periodoAnterior: string;
}

export function CardComparativo({ atual, anterior, periodoAtual, periodoAnterior }: CardComparativoProps) {
    const calcDiff = (valorAtual: number, valorAnterior: number) => {
        if (valorAnterior === 0) return { valor: 0, percentual: 0, positivo: true };
        const diff = valorAtual - valorAnterior;
        const pct = (diff / Math.abs(valorAnterior)) * 100;
        return { valor: diff, percentual: pct, positivo: diff >= 0 };
    };

    const diffSaldo = calcDiff(atual.saldo, anterior.saldo);
    const diffEntradas = calcDiff(atual.totalEntradas, anterior.totalEntradas);
    const diffSaidas = calcDiff(atual.totalSaidas, anterior.totalSaidas);

    const Indicador = ({ positivo, invertido = false }: { positivo: boolean; invertido?: boolean }) => {
        const isGood = invertido ? !positivo : positivo;
        if (Math.abs(diffSaldo.valor) < 1) return <Minus className="w-4 h-4 text-gray-400" />;

        return isGood ? (
            <ArrowUpRight className="w-4 h-4 text-green-500" />
        ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500" />
        );
    };

    return (
        <div className="card-mobile">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    📊 Comparativo
                </h3>
            </div>

            {/* Períodos */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                <div className="text-gray-500 dark:text-gray-400"></div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span className="font-medium">Atual</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">{periodoAtual}</p>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span className="font-medium">Anterior</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">{periodoAnterior}</p>
                </div>
            </div>

            <div className="space-y-2">
                {/* Entradas */}
                <div className="grid grid-cols-3 gap-2 items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-1.5">
                        <Indicador positivo={diffEntradas.positivo} />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Entradas</span>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-green-600 dark:text-green-400">
                            {formatarMoeda(atual.totalEntradas)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-500">
                            {formatarMoeda(anterior.totalEntradas)}
                        </p>
                    </div>
                </div>

                {/* Saídas */}
                <div className="grid grid-cols-3 gap-2 items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-1.5">
                        <Indicador positivo={!diffSaidas.positivo} invertido />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Saídas</span>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-red-600 dark:text-red-400">
                            {formatarMoeda(atual.totalSaidas)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-500">
                            {formatarMoeda(anterior.totalSaidas)}
                        </p>
                    </div>
                </div>

                {/* Saldo */}
                <div className={cn(
                    'grid grid-cols-3 gap-2 items-center p-2 rounded-lg border-2',
                    diffSaldo.positivo
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                )}>
                    <div className="flex items-center gap-1.5">
                        <Indicador positivo={diffSaldo.positivo} />
                        <span className="text-xs font-bold text-gray-900 dark:text-white">Saldo</span>
                    </div>
                    <div className="text-center">
                        <p className={cn(
                            'text-sm font-bold',
                            diffSaldo.positivo ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        )}>
                            {formatarMoeda(atual.saldo)}
                        </p>
                        <p className="text-[10px] text-gray-500">
                            {diffSaldo.valor >= 0 ? '+' : ''}{diffSaldo.percentual.toFixed(0)}%
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-500">
                            {formatarMoeda(anterior.saldo)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Resumo */}
            <div className="mt-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-center text-blue-700 dark:text-blue-300">
                    {diffSaldo.positivo
                        ? `✅ Resultado ${Math.abs(diffSaldo.percentual).toFixed(0)}% melhor`
                        : `⚠️ Resultado ${Math.abs(diffSaldo.percentual).toFixed(0)}% pior`}
                </p>
            </div>
        </div>
    );
}
