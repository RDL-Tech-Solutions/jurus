import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { formatarMoeda, calcularProximaData } from '../../utils/calculos';
import { CartaoCredito, Divida } from '../../types/fluxoCaixa';
import { cn } from '../../utils/cn';

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
        dataInicio: string;
        frequencia: 'diaria' | 'semanal' | 'mensal' | 'anual';
        diaDoMes?: number;
        diaDaSemana?: number;
        dataFim?: string;
    }>;
    gastosCartao: Array<{
        data: string;
        valorParcela: number;
        cartaoId: string;
    }>;
    cartoes: CartaoCredito[];
    faturasPagas: Record<string, boolean>;
    dividasPendentes: Divida[];
}

export function CardPrevisaoMes({ saldoAtual, transacoes, recorrentes, gastosCartao, cartoes, faturasPagas, dividasPendentes }: CardPrevisaoMesProps) {
    const [mesOffset, setMesOffset] = useState(0);

    const dadosMes = useMemo(() => {
        const hoje = new Date();
        const mesAlvo = new Date(hoje.getFullYear(), hoje.getMonth() + mesOffset, 1);
        const ultimoDia = new Date(mesAlvo.getFullYear(), mesAlvo.getMonth() + 1, 0).getDate();

        const nomeMes = mesAlvo.toLocaleDateString('pt-BR', { month: 'long' });
        const ano = mesAlvo.getFullYear();
        const mesAnoAlvo = mesAlvo.getFullYear() * 100 + mesAlvo.getMonth();

        // Função para calcular o fluxo de um mês específico (offset)
        const calcularFluxoMes = (offset: number) => {
            const dataMes = new Date(hoje.getFullYear(), hoje.getMonth() + offset, 1);
            const mesAno = dataMes.getFullYear() * 100 + dataMes.getMonth();
            const ultimoDiaMes = new Date(dataMes.getFullYear(), dataMes.getMonth() + 1, 0).getDate();

            let entradas = 0;
            let saidas = 0;

            // 1. Transações Reais (apenas se for mês passado ou atual, ou agendadas)
            const transacoesMes = transacoes.filter(t => {
                const d = new Date(t.data);
                return d.getFullYear() * 100 + d.getMonth() === mesAno;
            });
            entradas += transacoesMes.filter(t => t.tipo === 'entrada').reduce((a, t) => a + t.valor, 0);
            saidas += transacoesMes.filter(t => t.tipo === 'saida').reduce((a, t) => a + t.valor, 0);

            // 2. Gastos de Cartão (Faturas)
            // Precisamos somar as faturas que vencem neste mês
            const faturasMes = gastosCartao.reduce((total, gasto) => {
                const cartao = cartoes.find(c => c.id === gasto.cartaoId);
                if (!cartao) return total;

                const dataGasto = new Date(gasto.data);
                const diaGasto = dataGasto.getDate();
                const mesGasto = dataGasto.getMonth();
                const anoGasto = dataGasto.getFullYear();

                // Calcular fechamento para este gasto
                const ultimoDiaMesGasto = new Date(anoGasto, mesGasto + 1, 0).getDate();
                const diaFechamento = Math.min(cartao.diaFechamento, ultimoDiaMesGasto);
                const dataFechamento = new Date(anoGasto, mesGasto, diaFechamento);

                // Determinar mês/ano da fatura
                let mesFatura = mesGasto;
                let anoFatura = anoGasto;

                if (dataGasto > dataFechamento) {
                    mesFatura++;
                    if (mesFatura > 11) {
                        mesFatura = 0;
                        anoFatura++;
                    }
                }

                // Calcular vencimento da fatura
                let mesVenc = mesFatura;
                let anoVenc = anoFatura;

                if (cartao.diaVencimento <= cartao.diaFechamento) {
                    mesVenc++;
                    if (mesVenc > 11) {
                        mesVenc = 0;
                        anoVenc++;
                    }
                }

                // Verificar se o vencimento cai no mês atual do loop (mesAno)
                if (anoVenc * 100 + mesVenc === mesAno) {
                    return total + gasto.valorParcela;
                }

                return total;
            }, 0);

            saidas += faturasMes;

            // 3. Recorrências (Simulação)
            // Apenas se não houver transação real correspondente? 
            // Simplificação: Assumimos que recorrentes são extras ou o usuário deve gerenciar duplicação
            // Para previsão futura (offset > 0), usamos recorrentes.
            // Para mês atual, se já passou a data, talvez já tenha transação real.

            if (offset >= 0) {
                recorrentes.filter(r => r.ativa).forEach(rec => {
                    // Verificar se ocorre neste mês
                    let dataRec = rec.dataInicio;
                    // Avançar até o mês alvo
                    // Isso é custoso, mas necessário para precisão
                    // Simplificação: Verificar se a data base cai no mês

                    // Melhor abordagem: Simular ocorrências até o fim do mês alvo
                    let d = rec.dataInicio;
                    let safety = 0;
                    // Aumentar limite de segurança para suportar recorrências antigas (ex: diárias de anos atrás)
                    while (safety < 5000) {
                        const dataObj = new Date(d);
                        // Se passou do fim do mês alvo, para
                        if (dataObj > new Date(dataMes.getFullYear(), dataMes.getMonth() + 1, 0)) break;

                        if (rec.dataFim && dataObj > new Date(rec.dataFim)) break;

                        // Se cair dentro do mês alvo
                        if (dataObj.getFullYear() === dataMes.getFullYear() && dataObj.getMonth() === dataMes.getMonth()) {
                            if (rec.tipo === 'entrada') entradas += rec.valor;
                            else saidas += rec.valor;
                        }

                        d = calcularProximaData(d, rec.frequencia, rec.diaDoMes, rec.diaDaSemana);
                        safety++;
                    }
                });
            }

            return { entradas, saidas };
        };

        // Calcular saldo inicial acumulando meses anteriores (do atual até o alvo - 1)
        let saldoSimulado = saldoAtual;

        // Se estamos no futuro, projetamos o saldo
        if (mesOffset > 0) {
            // Começa do mês atual até o anterior ao alvo
            for (let i = 0; i < mesOffset; i++) {
                const { entradas, saidas } = calcularFluxoMes(i);
                saldoSimulado = saldoSimulado + entradas - saidas;
            }
        } else if (mesOffset < 0) {
            saldoSimulado = 0; // Placeholder para passado
        }

        // --- CÁLCULO DIÁRIO PRECISO PARA O MÊS ALVO ---

        // Mapa de variações por dia (dia -> valor)
        const variacaoDiariaReal = new Array(ultimoDia + 1).fill(0);
        const variacaoDiariaPrevista = new Array(ultimoDia + 1).fill(0);

        // 1. Transações Reais (Entram em Realizado e Previsto)
        transacoes.forEach(t => {
            const d = new Date(t.data);
            // Verificar se é do mês alvo
            if (d.getFullYear() === ano && d.getMonth() === mesAlvo.getMonth()) {
                const dia = d.getDate();
                if (t.tipo === 'entrada') {
                    variacaoDiariaReal[dia] += t.valor;
                    variacaoDiariaPrevista[dia] += t.valor;
                } else {
                    variacaoDiariaReal[dia] -= t.valor;
                    variacaoDiariaPrevista[dia] -= t.valor;
                }
            }
        });

        // 2. Gastos de Cartão (Faturas) - (Entram apenas em Previsto, assumindo pendentes)
        gastosCartao.forEach(gasto => {
            const cartao = cartoes.find(c => c.id === gasto.cartaoId);
            if (!cartao) return;

            const dataGasto = new Date(gasto.data);
            const mesGasto = dataGasto.getMonth();
            const anoGasto = dataGasto.getFullYear();

            // Calcular fechamento
            const ultimoDiaMesGasto = new Date(anoGasto, mesGasto + 1, 0).getDate();
            const diaFechamento = Math.min(cartao.diaFechamento, ultimoDiaMesGasto);
            const dataFechamento = new Date(anoGasto, mesGasto, diaFechamento);

            // Determinar mês/ano da fatura
            let mesFatura = mesGasto;
            let anoFatura = anoGasto;

            if (dataGasto > dataFechamento) {
                mesFatura++;
                if (mesFatura > 11) {
                    mesFatura = 0;
                    anoFatura++;
                }
            }

            // Calcular vencimento
            let mesVenc = mesFatura;
            let anoVenc = anoFatura;

            if (cartao.diaVencimento <= cartao.diaFechamento) {
                mesVenc++;
                if (mesVenc > 11) {
                    mesVenc = 0;
                    anoVenc++;
                }
            }

            // Se o vencimento for neste mês alvo
            if (anoVenc === ano && mesVenc === mesAlvo.getMonth()) {
                // Verificar se a fatura já foi paga
                const faturaKey = `${cartao.id}-${mesVenc}-${anoVenc}`;
                const estaPaga = faturasPagas && faturasPagas[faturaKey];

                if (!estaPaga) {
                    const diaVenc = Math.min(cartao.diaVencimento, ultimoDia);
                    variacaoDiariaPrevista[diaVenc] -= gasto.valorParcela;
                }
            }
        });

        // 3. Recorrências (Entram apenas em Previsto)
        if (mesOffset >= 0) {
            recorrentes.filter(r => r.ativa).forEach(rec => {
                let d = rec.dataInicio;
                let safety = 0;
                while (safety < 5000) {
                    const dataObj = new Date(d);
                    if (dataObj > new Date(ano, mesAlvo.getMonth() + 1, 0)) break;
                    if (rec.dataFim && dataObj > new Date(rec.dataFim)) break;

                    // Se cair neste mês
                    if (dataObj.getFullYear() === ano && dataObj.getMonth() === mesAlvo.getMonth()) {
                        const dia = dataObj.getDate();
                        if (rec.tipo === 'entrada') variacaoDiariaPrevista[dia] += rec.valor;
                        else variacaoDiariaPrevista[dia] -= rec.valor;
                    }

                    d = calcularProximaData(d, rec.frequencia, rec.diaDoMes, rec.diaDaSemana);
                    safety++;
                }
            });
        }

        // 4. Dívidas Pendentes (Entram apenas em Previsto)
        dividasPendentes.forEach(divida => {
            if (!divida.dataVencimento) return;
            const dataVenc = new Date(divida.dataVencimento);

            // Se cair neste mês e ano
            if (dataVenc.getFullYear() === ano && dataVenc.getMonth() === mesAlvo.getMonth()) {
                const dia = dataVenc.getDate();
                // Dívida é sempre saída
                variacaoDiariaPrevista[dia] -= divida.valor;
            }
        });

        // Gerar dados do gráfico acumulando dia a dia (Usando Previsto)
        const dadosGrafico = [];
        let saldoAtualPrevisto = saldoSimulado;
        let saldoAtualReal = saldoSimulado;

        // Adicionar ponto inicial (dia 0 ou 1)
        dadosGrafico.push({
            dia: `01/${String(mesAlvo.getMonth() + 1).padStart(2, '0')}`,
            saldo: saldoAtualPrevisto
        });

        for (let dia = 1; dia <= ultimoDia; dia++) {
            saldoAtualPrevisto += variacaoDiariaPrevista[dia];
            saldoAtualReal += variacaoDiariaReal[dia];

            // Adicionar ponto para este dia
            dadosGrafico.push({
                dia: `${String(dia).padStart(2, '0')}/${String(mesAlvo.getMonth() + 1).padStart(2, '0')}`,
                saldo: saldoAtualPrevisto
            });
        }

        return {
            nomeMes: nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1),
            ano,
            saldoInicial: saldoSimulado,
            saldoFinal: saldoAtualReal, // Apenas realizados
            previsto: saldoAtualPrevisto, // Realizados + Pendentes
            dadosGrafico
        };
    }, [mesOffset, saldoAtual, transacoes, recorrentes, gastosCartao, cartoes, faturasPagas, dividasPendentes]);

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
            <div className="flex items-center justify-center gap-4 sm:gap-8 mb-4">
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

                {/* Saldo Final (Realizado) */}
                <div className="text-center">
                    <div className={cn(
                        "flex items-center justify-center gap-1 text-xs mb-1",
                        dadosMes.saldoFinal >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"
                    )}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Saldo final</span>
                    </div>
                    <p className={cn(
                        "text-lg font-bold",
                        dadosMes.saldoFinal >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"
                    )}>
                        {formatarMoeda(dadosMes.saldoFinal)}
                    </p>
                </div>

                {/* Previsto */}
                <div className="text-center">
                    <div className={cn(
                        "flex items-center justify-center gap-1 text-xs mb-1",
                        dadosMes.previsto >= 0 ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
                    )}>
                        <Clock className="w-3 h-3" />
                        <span>Previsto</span>
                    </div>
                    <p className={cn(
                        "text-lg font-bold",
                        dadosMes.previsto >= 0 ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
                    )}>
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
