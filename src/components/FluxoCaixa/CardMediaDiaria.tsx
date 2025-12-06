import { Calendar, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { MediaDiaria } from '../../utils/analiseFinanceira';
import { formatarMoeda } from '../../utils/calculos';
import { cn } from '../../utils/cn';

interface CardMediaDiariaProps {
    media: MediaDiaria;
}

export function CardMediaDiaria({ media }: CardMediaDiariaProps) {
    const saldoDiario = media.entradas - media.saidas;
    const isPositivo = saldoDiario >= 0;

    return (
        <div className="card-mobile">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    💰 Média Diária
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{media.dias} dias</span>
                </div>
            </div>

            <div className="space-y-3">
                {/* Entradas */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Entradas</span>
                    </div>
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">
                        {formatarMoeda(media.entradas)}/dia
                    </p>
                </div>

                {/* Saídas */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Saídas</span>
                    </div>
                    <p className="text-sm font-bold text-red-600 dark:text-red-400">
                        {formatarMoeda(media.saidas)}/dia
                    </p>
                </div>

                {/* Resultdo Líquido */}
                <div className={cn(
                    'flex items-center justify-between p-3 rounded-lg border-2',
                    isPositivo
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                )}>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{isPositivo ? '✅' : '⚠️'}</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Resultado</span>
                    </div>
                    <div className="text-right">
                        <p className={cn(
                            'text-lg font-bold',
                            isPositivo ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        )}>
                            {saldoDiario >= 0 ? '+' : ''}{formatarMoeda(saldoDiario)}
                        </p>
                        <p className="text-xs text-gray-500">por dia</p>
                    </div>
                </div>
            </div>

            {/* Alerta */}
            {!isPositivo && (
                <div className="mt-3 p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                        <p className="text-xs text-orange-700 dark:text-orange-300">
                            Gastando mais que ganha diariamente
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
