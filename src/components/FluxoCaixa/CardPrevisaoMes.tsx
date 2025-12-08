import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { formatarMoeda } from '../../utils/calculos';

interface CardPrevisaoMesProps {
    saldoAtual: number;
    transacoes: Array<{
        data: string;
        tipo: 'entrada' | 'saida';
        valor: number;
    }>;
    recorrentes: Array<{
        tipo: 'entrada' | 'saida';
        valor: number;
        ativa: boolean;
    }>;
}

export function CardPrevisaoMes({ saldoAtual, transacoes, recorrentes }: CardPrevisaoMesProps) {
    const [mesOffset, setMesOffset] = useState(0);

    const dadosMes = useMemo(() => {
        const hoje = new Date();
        const mesAtual = new Date(hoje.getFullYear(), hoje.getMonth() + mesOffset, 1);
        const ultimoDia = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0).getDate();

        const nomeMes = mesAtual.toLocaleDateString('pt-BR', { month: 'long' });
        const ano = mesAtual.getFullYear();
        const mesAno = mesAtual.getFullYear() * 100 + mesAtual.getMonth();

        // Filtrar transações do mês
        const transacoesMes = transacoes.filter(t => {
            const d = new Date(t.data);
            return d.getFullYear() * 100 + d.getMonth() === mesAno;
        });

        // Calcular saldo inicial (saldoAtual - transações do mês atual)
        const totalEntradasMes = transacoesMes.filter(t => t.tipo === 'entrada').reduce((a, t) => a + t.valor, 0);
        const totalSaidasMes = transacoesMes.filter(t => t.tipo === 'saida').reduce((a, t) => a + t.valor, 0);
        const saldoInicial = mesOffset === 0 ? saldoAtual - totalEntradasMes + totalSaidasMes : 0;

        // Saldo final real
        const saldoFinal = saldoInicial + totalEntradasMes - totalSaidasMes;

        // Previsão (incluindo recorrências ativas)
        const recorrentesAtivas = recorrentes.filter(r => r.ativa);
        const entradasPrevistas = recorrentesAtivas.filter(r => r.tipo === 'entrada').reduce((a, r) => a + r.valor, 0);
        const saidasPrevistas = recorrentesAtivas.filter(r => r.tipo === 'saida').reduce((a, r) => a + r.valor, 0);
        const previsto = saldoFinal + entradasPrevistas - saidasPrevistas;

        // Dados para o gráfico (evolução diária)
        const dadosGrafico: Array<{ dia: string; saldo: number }> = [];
        let saldoAcumulado = saldoInicial;

        for (let dia = 1; dia <= ultimoDia; dia++) {
            const dataStr = `${mesAtual.getFullYear()}-${String(mesAtual.getMonth() + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
            const transacoesDia = transacoesMes.filter(t => t.data.startsWith(dataStr));

            const entradasDia = transacoesDia.filter(t => t.tipo === 'entrada').reduce((a, t) => a + t.valor, 0);
            const saidasDia = transacoesDia.filter(t => t.tipo === 'saida').reduce((a, t) => a + t.valor, 0);

            saldoAcumulado = saldoAcumulado + entradasDia - saidasDia;

            dadosGrafico.push({
                dia: `${String(dia).padStart(2, '0')}/${String(mesAtual.getMonth() + 1).padStart(2, '0')}`,
                saldo: saldoAcumulado
            });
        }

        return {
            nomeMes: nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1),
            ano,
            saldoInicial,
            saldoFinal,
            previsto,
            dadosGrafico: dadosGrafico.filter((_, i) => i % 3 === 0 || i === dadosGrafico.length - 1) // Reduzir pontos
        };
    }, [mesOffset, saldoAtual, transacoes, recorrentes]);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
            {/* Header com navegação de mês */}
            <div className="flex items-center justify-center gap-4 mb-4">
                <button
                    onClick={() => setMesOffset(prev => prev - 1)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-medium underline decoration-2 underline-offset-4">
                    {dadosMes.nomeMes}
                </h3>
                <button
                    onClick={() => setMesOffset(prev => prev + 1)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Valores principais */}
            <div className="flex items-center justify-center gap-6 mb-4">
                {/* Inicial */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 text-xs mb-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Inicial</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {formatarMoeda(dadosMes.saldoInicial)}
                    </p>
                </div>

                {/* Saldo Final - Destaque */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400 text-xs mb-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Saldo final</span>
                    </div>
                    <p className={`text-2xl font-bold ${dadosMes.saldoFinal >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatarMoeda(dadosMes.saldoFinal)}
                    </p>
                </div>

                {/* Previsto */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 text-xs mb-1">
                        <Clock className="w-3 h-3" />
                        <span>Previsto</span>
                    </div>
                    <p className={`text-sm font-medium ${dadosMes.previsto >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatarMoeda(dadosMes.previsto)}
                    </p>
                </div>
            </div>

            {/* Gráfico de linha */}
            <div className="h-24 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dadosMes.dadosGrafico}>
                        <XAxis
                            dataKey="dia"
                            tick={{ fill: '#9ca3af', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis hide />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1f2937',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                            formatter={(value: number) => [formatarMoeda(value), 'Saldo']}
                        />
                        <Line
                            type="monotone"
                            dataKey="saldo"
                            stroke="#f87171"
                            strokeWidth={2}
                            dot={{ fill: '#f87171', strokeWidth: 0, r: 4 }}
                            activeDot={{ r: 6, fill: '#f87171' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
