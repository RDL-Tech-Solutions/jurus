import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatarMoeda } from '../../utils/calculos';

interface DadosGrafico {
    mes: string;
    entradas: number;
    saidas: number;
}

interface GraficoBarrasComparativoProps {
    dados: DadosGrafico[];
}

export function GraficoBarrasComparativo({ dados }: GraficoBarrasComparativoProps) {
    const formatarValor = (valor: number) => {
        if (valor >= 1000) {
            return `R$ ${(valor / 1000).toFixed(1)}k`;
        }
        return formatarMoeda(valor);
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        {payload[0].payload.mes}
                    </p>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">Entradas:</span>
                            <span className="text-xs font-bold text-green-600 dark:text-green-400">
                                {formatarMoeda(payload[0].value)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">Saídas:</span>
                            <span className="text-xs font-bold text-red-600 dark:text-red-400">
                                {formatarMoeda(payload[1].value)}
                            </span>
                        </div>
                        <div className="pt-1 border-t border-gray-200 dark:border-gray-700">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Saldo:</span>
                            <span className={`text-xs font-bold ml-2 ${payload[0].value - payload[1].value >= 0
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`}>
                                {formatarMoeda(payload[0].value - payload[1].value)}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="card-mobile">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    📊 Entradas vs Saídas
                </h3>
            </div>

            <div className="h-[280px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dados} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                        <XAxis
                            dataKey="mes"
                            tick={{ fontSize: 11 }}
                            className="fill-gray-600 dark:fill-gray-400"
                        />
                        <YAxis
                            tick={{ fontSize: 11 }}
                            className="fill-gray-600 dark:fill-gray-400"
                            tickFormatter={formatarValor}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{ fontSize: '12px' }}
                            iconType="circle"
                        />
                        <Bar
                            dataKey="entradas"
                            fill="#10b981"
                            name="Entradas"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="saidas"
                            fill="#ef4444"
                            name="Saídas"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Legenda adicional mobile */}
            <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Entradas</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Saídas</span>
                </div>
            </div>
        </div>
    );
}
