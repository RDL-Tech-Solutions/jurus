import { Transacao, EstatisticasFluxo } from '../types/fluxoCaixa';

export interface Tendencia {
    saldo: { valor: number; percentual: number; direcao: 'up' | 'down' | 'stable' };
    entradas: { valor: number; percentual: number; direcao: 'up' | 'down' | 'stable' };
    saidas: { valor: number; percentual: number; direcao: 'up' | 'down' | 'stable' };
    status: 'melhorando' | 'piorando' | 'estavel';
}

export function calcularTendencia(atual: EstatisticasFluxo, anterior: EstatisticasFluxo): Tendencia {
    const calcDif = (a: number, b: number) => {
        if (b === 0) return { valor: 0, percentual: 0, direcao: 'stable' as const };
        const dif = a - b;
        const pct = (dif / Math.abs(b)) * 100;
        return { valor: dif, percentual: pct, direcao: dif > 0 ? 'up' as const : dif < 0 ? 'down' as const : 'stable' as const };
    };

    const saldo = calcDif(atual.saldo, anterior.saldo);
    const entradas = calcDif(atual.totalEntradas, anterior.totalEntradas);
    const saidas = calcDif(atual.totalSaidas, anterior.totalSaidas);

    let pts = 0;
    if (saldo.direcao === 'up') pts += 2;
    if (saldo.direcao === 'down') pts -= 2;
    if (entradas.direcao === 'up') pts += 1;
    if (saidas.direcao === 'down') pts += 1;
    if (saidas.direcao === 'up') pts -= 1;

    return { saldo, entradas, saidas, status: pts > 0 ? 'melhorando' : pts < 0 ? 'piorando' : 'estavel' };
}

export interface MediaDiaria {
    entradas: number;
    saidas: number;
    saldo: number;
    dias: number;
}

export function calcularMediaDiaria(estatisticas: EstatisticasFluxo, transacoes: Transacao[]): MediaDiaria {
    if (transacoes.length === 0) return { entradas: 0, saidas: 0, saldo: 0, dias: 0 };

    const datas = transacoes.map(t => new Date(t.data).getTime());
    const dias = Math.max(1, Math.ceil((Math.max(...datas) - Math.min(...datas)) / (1000 * 60 * 60 * 24)) + 1);

    return {
        entradas: estatisticas.totalEntradas / dias,
        saidas: estatisticas.totalSaidas / dias,
        saldo: estatisticas.saldo / dias,
        dias
    };
}

export interface Runway {
    meses: number;
    alerta: 'critico' | 'atencao' | 'ok';
    mensagem: string;
}

export function calcularRunway(
    saldoAtual: number,
    gastoMedioMensal: number,
    receitaMediaMensal: number
): Runway {
    const fluxoMensal = receitaMediaMensal - gastoMedioMensal;

    if (fluxoMensal >= 0) {
        return { meses: Infinity, alerta: 'ok', mensagem: 'Receitas cobrem gastos' };
    }

    const meses = saldoAtual / Math.abs(fluxoMensal);

    if (meses < 3) {
        return { meses, alerta: 'critico', mensagem: 'CRÍTICO: Menos de 3 meses!' };
    } else if (meses < 6) {
        return { meses, alerta: 'atencao', mensagem: 'ATENÇÃO: Menos de 6 meses!' };
    }

    return { meses, alerta: 'ok', mensagem: 'Situação estável' };
}

export interface BreakEven {
    gastosFix: number;
    gastosVariaveis: number;
    totalGastos: number;
    receitaAtual: number;
    diferenca: number;
    status: 'positivo' | 'negativo' | 'equilibrado';
}

export function calcularBreakEven(estatisticas: EstatisticasFluxo): BreakEven {
    const totalGastos = estatisticas.totalSaidas;
    const receitaAtual = estatisticas.totalEntradas;
    const diferenca = receitaAtual - totalGastos;

    // Simplificação: 70% fixos, 30% variáveis
    const gastosFix = totalGastos * 0.7;
    const gastosVariaveis = totalGastos * 0.3;

    const status = diferenca > 0 ? 'positivo' : diferenca < 0 ? 'negativo' : 'equilibrado';

    return { gastosFix, gastosVariaveis, totalGastos, receitaAtual, diferenca, status };
}

export interface MaiorGasto {
    transacao: Transacao;
    percentualDoTotal: number;
}

export function encontrarMaiorGasto(transacoes: Transacao[], totalSaidas: number): MaiorGasto | null {
    const saidas = transacoes.filter(t => t.tipo === 'saida');
    if (saidas.length === 0) return null;

    const maiorTransacao = saidas.reduce((max, t) => t.valor > max.valor ? t : max);

    return {
        transacao: maiorTransacao,
        percentualDoTotal: (maiorTransacao.valor / totalSaidas) * 100
    };
}

export interface Alerta {
    tipo: 'critico' | 'atencao' | 'info';
    icone: string;
    titulo: string;
    mensagem: string;
}

export function gerarAlertas(
    estatisticas: EstatisticasFluxo,
    transacoes: Transacao[],
    runway?: Runway,
    breakEven?: BreakEven
): Alerta[] {
    const alertas: Alerta[] = [];

    // Saldo baixo
    if (estatisticas.saldo < 500 && estatisticas.saldo > 0) {
        alertas.push({
            tipo: 'atencao',
            icone: '⚠️',
            titulo: 'Saldo Baixo',
            mensagem: 'Seu saldo está abaixo de R$ 500'
        });
    }

    // Saldo negativo
    if (estatisticas.saldo < 0) {
        alertas.push({
            tipo: 'critico',
            icone: '🔴',
            titulo: 'Saldo Negativo',
            mensagem: 'Você está no vermelho!'
        });
    }

    // Runway crítico
    if (runway && runway.alerta === 'critico') {
        alertas.push({
            tipo: 'critico',
            icone: '✈️',
            titulo: 'Runway Crítico',
            mensagem: `Apenas ${runway.meses.toFixed(1)} meses de reserva`
        });
    }

    // Gastos acima da média
    const mediaDiaria = calcularMediaDiaria(estatisticas, transacoes);
    if (estatisticas.totalSaidas > mediaDiaria.saidas * 30 * 1.2) {
        alertas.push({
            tipo: 'atencao',
            icone: '📊',
            titulo: 'Gastos Elevados',
            mensagem: 'Gastos 20% acima da média'
        });
    }

    // Break-even negativo
    if (breakEven && breakEven.status === 'negativo') {
        alertas.push({
            tipo: 'atencao',
            icone: '⚖️',
            titulo: 'Abaixo do Break-Even',
            mensagem: `Faltam R$ ${Math.abs(breakEven.diferenca).toFixed(2)}`
        });
    }

    // Oportunidade
    if (estatisticas.saldo > 2000 && estatisticas.totalEntradas > estatisticas.totalSaidas * 1.5) {
        alertas.push({
            tipo: 'info',
            icone: '💡',
            titulo: 'Oportunidade',
            mensagem: 'Bom momento para investir ou poupar'
        });
    }

    return alertas;
}
