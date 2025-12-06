import { Plane, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';
import { Runway } from '../../utils/analiseFinanceira';
import { formatarMoeda } from '../../utils/calculos';
import { cn } from '../../utils/cn';

interface CardRunwayProps {
    runway: Runway;
    saldoAtual: number;
    gastoMensal: number;
}

export function CardRunway({ runway, saldoAtual, gastoMensal }: CardRunwayProps) {
    const getCorAlerta = () => {
        if (runway.alerta === 'critico') return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
        if (runway.alerta === 'atencao') return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    };

    const getIcone = () => {
        if (runway.alerta === 'critico') return <AlertTriangle className="w-6 h-6 text-red-600" />;
        if (runway.alerta === 'atencao') return <TrendingDown className="w-6 h-6 text-orange-600" />;
        return <CheckCircle className="w-6 h-6 text-green-600" />;
    };

    const mesesTexto = runway.meses === Infinity ? '∞' : runway.meses.toFixed(1);

    return (
        <div className={cn('card-mobile border-2', getCorAlerta())}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    ✈️ Runway Financeiro
                </h3>
                {getIcone()}
            </div>

            <div className="space-y-3">
                {/* Saldo Atual */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-gray-900/30">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Saldo Atual</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatarMoeda(saldoAtual)}
                    </span>
                </div>

                {/* Gasto Médio */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-gray-900/30">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Gasto Médio/Mês</span>
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">
                        {formatarMoeda(gastoMensal)}
                    </span>
                </div>

                {/* Runway */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Plane className="w-5 h-5 text-blue-600" />
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">RUNWAY</span>
                    </div>
                    <p className="text-3xl font-bold text-center text-blue-700 dark:text-blue-300">
                        {mesesTexto}
                    </p>
                    <p className="text-xs text-center text-blue-600 dark:text-blue-400 mt-1">
                        {runway.meses === Infinity ? 'Sustentável' : 'meses'}
                    </p>
                </div>
            </div>

            {/* Mensagem de Alerta */}
            <div className={cn(
                'mt-3 p-2 rounded-lg border',
                runway.alerta === 'critico' ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700' :
                    runway.alerta === 'atencao' ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700' :
                        'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700'
            )}>
                <p className={cn(
                    'text-xs text-center font-semibold',
                    runway.alerta === 'critico' ? 'text-red-700 dark:text-red-300' :
                        runway.alerta === 'atencao' ? 'text-orange-700 dark:text-orange-300' :
                            'text-green-700 dark:text-green-300'
                )}>
                    {runway.mensagem}
                </p>
            </div>
        </div>
    );
}
