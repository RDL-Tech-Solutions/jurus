import { Scale, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BreakEven } from '../../utils/analiseFinanceira';
import { formatarMoeda } from '../../utils/calculos';
import { cn } from '../../utils/cn';

interface CardBreakEvenProps {
    breakEven: BreakEven;
}

export function CardBreakEven({ breakEven }: CardBreakEvenProps) {
    const getIconeStatus = () => {
        if (breakEven.status === 'positivo') return <TrendingUp className="w-5 h-5 text-green-500" />;
        if (breakEven.status === 'negativo') return <TrendingDown className="w-5 h-5 text-red-500" />;
        return <Minus className="w-5 h-5 text-gray-400" />;
    };

    const getCorStatus = () => {
        if (breakEven.status === 'positivo') return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
        if (breakEven.status === 'negativo') return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
        return 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700';
    };

    return (
        <div className="card-mobile">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    ⚖️ Break-Even
                </h3>
                <Scale className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-3">
                {/* Gastos Fixos */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Gastos Fixos (70%)</span>
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">
                        {formatarMoeda(breakEven.gastosFix)}
                    </span>
                </div>

                {/* Gastos Variáveis */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Gastos Variáveis (30%)</span>
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                        {formatarMoeda(breakEven.gastosVariaveis)}
                    </span>
                </div>

                {/* Total Necessário */}
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-center text-blue-600 dark:text-blue-400 mb-1">
                        💡 Precisa ganhar
                    </p>
                    <p className="text-xl font-bold text-center text-blue-700 dark:text-blue-300">
                        {formatarMoeda(breakEven.totalGastos)}
                    </p>
                    <p className="text-[10px] text-center text-blue-500 mt-1">
                        para empatar
                    </p>
                </div>

                {/* Status Atual */}
                <div className={cn('p-3 rounded-lg border-2', getCorStatus())}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {getIconeStatus()}
                            <div>
                                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Receita Atual</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                    {formatarMoeda(breakEven.receitaAtual)}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Diferença</p>
                            <p className={cn(
                                'text-sm font-bold',
                                breakEven.status === 'positivo' ? 'text-green-600 dark:text-green-400' :
                                    breakEven.status === 'negativo' ? 'text-red-600 dark:text-red-400' :
                                        'text-gray-500'
                            )}>
                                {breakEven.diferenca >= 0 ? '+' : ''}{formatarMoeda(breakEven.diferenca)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mensagem */}
            <div className="mt-3 p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                    {breakEven.status === 'positivo' && '✅ Acima do ponto de equilíbrio'}
                    {breakEven.status === 'negativo' && '⚠️ Abaixo do ponto de equilíbrio'}
                    {breakEven.status === 'equilibrado' && '➖ Exatamente no ponto de equilíbrio'}
                </p>
            </div>
        </div>
    );
}
