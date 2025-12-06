import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatarMoeda } from '../../utils/calculos';

interface DadosCategoria {
    nome: string;
    valor: number;
    cor: string;
    icone: string;
}

interface GraficoTopCategoriasProps {
    dados: DadosCategoria[];
    limite?: number;
}

export function GraficoTopCategorias({ dados, limite = 5 }: GraficoTopCategoriasProps) {
    const topDados = dados.slice(0, limite);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        {payload[0].payload.icone} {payload[0].payload.nome}
                    </p>
                    <p className="text-sm font-bold" style={{ color: payload[0].payload.cor }}>
                        {formatarMoeda(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="card-mobile">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    🏆 Top {limite} Categorias
                </h3>
            </div>

            <div className="h-[280px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={topDados}
                        layout="vertical"
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" horizontal={false} />
                        <XAxis
                            type="number"
                            tick={{ fontSize: 11 }}
                            className="fill-gray-600 dark:fill-gray-400"
                            tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toString()}
                        />
                        <YAxis
                            type="category"
                            dataKey="nome"
                            tick={{ fontSize: 11 }}
                            className="fill-gray-600 dark:fill-gray-400"
                            width={80}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="valor" radius={[0, 4, 4, 0]}>
                            {topDados.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.cor} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Legenda Mobile */}
            <div className="mt-3 grid grid-cols-1 gap-2 sm:hidden">
                {topDados.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{item.icone}</span>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.nome}</span>
                        </div>
                        <span className="text-xs font-bold" style={{ color: item.cor }}>
                            {formatarMoeda(item.valor)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
