import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Tendencia } from '../../utils/analiseFinanceira';
import { cn } from '../../utils/cn';
import { formatarMoeda } from '../../utils/calculos';

interface CardTendenciaProps {
    tendencia: Tendencia;
}

export function CardTendencia({ tendencia }: CardTendenciaProps) {
    const getIcone = (direcao: 'up' | 'down' | 'stable') => {
        if (direcao === 'up') return <TrendingUp className="w-5 h-5 text-green-500" />;
        if (direcao === 'down') return <TrendingDown className="w-5 h-5 text-red-500" />;
        return <Minus className="w-5 h-5 text-gray-400" />;
    };

    const getCorStatus = () => {
        if (tendencia.status === 'melhorando') return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
        if (tendencia.status === 'piorando') return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
        return 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700';
    };

    const getTextoStatus = () => {
        if (tendencia.status === 'melhorando') return '✅ Situação Melhorando';
        if (tendencia.status === 'piorando') return '⚠️ Situação Piorando';
        return '➖ Situação Estável';
    };

    return (
        <div className={cn('card-mobile border-2', getCorStatus())}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    📈 Tendência do Período
                </h3>
            </div>

            <div className="space-y-3">
                {/* Saldo */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-gray-900/30">
                    <div className="flex items-center gap-2">
                        {getIcone(tendencia.saldo.direcao)}
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Saldo</span>
                    </div>
                    <div className="text-right">
                        <p className={cn(
                            'text-sm font-bold',
                            tendencia.saldo.direcao === 'up' ? 'text-green-600 dark:text-green-400' :
                                tendencia.saldo.direcao === 'down' ? 'text-red-600 dark:text-red-400' :
                                    'text-gray-500'
                        )}>
                            {tendencia.saldo.direcao === 'up' ? '+' : ''}
                            {tendencia.saldo.percentual.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-500">
                            {tendencia.saldo.valor >= 0 ? '+' : ''}{formatarMoeda(tendencia.saldo.valor)}
                        </p>
                    </div>
                </div>

                {/* Entradas */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-gray-900/30">
                    <div className="flex items-center gap-2">
                        {getIcone(tendencia.entradas.direcao)}
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Entradas</span>
                    </div>
                    <div className="text-right">
                        <p className={cn(
                            'text-sm font-bold',
                            tendencia.entradas.direcao === 'up' ? 'text-green-600 dark:text-green-400' :
                                tendencia.entradas.direcao === 'down' ? 'text-red-600 dark:text-red-400' :
                                    'text-gray-500'
                        )}>
                            {tendencia.entradas.direcao === 'up' ? '+' : ''}
                            {tendencia.entradas.percentual.toFixed(1)}%
                        </p>
                    </div>
                </div>

                {/* Saídas */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-gray-900/30">
                    <div className="flex items-center gap-2">
                        {getIcone(tendencia.saidas.direcao)}
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Saídas</span>
                    </div>
                    <div className="text-right">
                        <p className={cn(
                            'text-sm font-bold',
                            tendencia.saidas.direcao === 'down' ? 'text-green-600 dark:text-green-400' :
                                tendencia.saidas.direcao === 'up' ? 'text-red-600 dark:text-red-400' :
                                    'text-gray-500'
                        )}>
                            {tendencia.saidas.direcao === 'up' ? '+' : ''}
                            {tendencia.saidas.percentual.toFixed(1)}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Status */}
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-center text-sm font-semibold">{getTextoStatus()}</p>
            </div>
        </div>
    );
}
