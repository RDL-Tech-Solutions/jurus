/**
 * HOOK ATUALIZADO - USA CONTEXT GLOBAL
 * Sincronização automática sem F5
 */

import { useMemo } from 'react';
import { useFluxoCaixaContext } from '../contexts/FluxoCaixaContext';
import { formatarData } from '../utils/calculos';
import type { EstatisticasFluxo, CATEGORIAS_PADRAO } from '../types/fluxoCaixa';

// Função para filtrar por período
const filtrarPorPeriodo = (data: string, periodo: string, dataInicio?: string, dataFim?: string): boolean => {
    const dataTransacao = new Date(data);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    switch (periodo) {
        case 'hoje':
            const inicioHoje = new Date(hoje);
            const fimHoje = new Date(hoje);
            fimHoje.setHours(23, 59, 59, 999);
            return dataTransacao >= inicioHoje && dataTransacao <= fimHoje;

        case 'semana':
            const inicioSemana = new Date(hoje);
            inicioSemana.setDate(hoje.getDate() - hoje.getDay());
            const fimSemana = new Date(inicioSemana);
            fimSemana.setDate(inicioSemana.getDate() + 6);
            fimSemana.setHours(23, 59, 59, 999);
            return dataTransacao >= inicioSemana && dataTransacao <= fimSemana;

        case 'mes':
            const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
            fimMes.setHours(23, 59, 59, 999);
            return dataTransacao >= inicioMes && dataTransacao <= fimMes;

        case 'ano':
            const inicioAno = new Date(hoje.getFullYear(), 0, 1);
            const fimAno = new Date(hoje.getFullYear(), 11, 31);
            fimAno.setHours(23, 59, 59, 999);
            return dataTransacao >= inicioAno && dataTransacao <= fimAno;

        case 'personalizado':
            if (dataInicio && dataFim) {
                const inicio = new Date(dataInicio);
                const fim = new Date(dataFim);
                fim.setHours(23, 59, 59, 999);
                return dataTransacao >= inicio && dataTransacao <= fim;
            }
            return true;

        default:
            return true;
    }
};

export function useFluxoCaixa() {
    const context = useFluxoCaixaContext();
    
    const {
        transacoes,
        categorias,
        filtros,
        carregado,
        adicionarTransacao,
        editarTransacao,
        excluirTransacao,
        adicionarCategoria,
        excluirCategoria,
        obterCategoria,
        atualizarFiltros,
        limparFiltros
    } = context;
    
    // Transações filtradas
    const transacoesFiltradas = useMemo(() => {
        return transacoes.filter(t => {
            // Filtro por período
            if (!filtrarPorPeriodo(t.data, filtros.periodo, filtros.dataInicio, filtros.dataFim)) {
                return false;
            }

            // Filtro por tipo
            if (filtros.tipo !== 'todos' && t.tipo !== filtros.tipo) {
                return false;
            }

            // Filtro por categoria
            if (filtros.categoriaId && t.categoriaId !== filtros.categoriaId) {
                return false;
            }

            // Filtro por busca
            if (filtros.busca) {
                const termoBusca = filtros.busca.toLowerCase();
                const categoria = obterCategoria(t.categoriaId);
                const matchDescricao = t.descricao.toLowerCase().includes(termoBusca);
                const matchCategoria = categoria?.nome.toLowerCase().includes(termoBusca);
                const matchObservacoes = t.observacoes?.toLowerCase().includes(termoBusca);

                if (!matchDescricao && !matchCategoria && !matchObservacoes) {
                    return false;
                }
            }

            return true;
        }).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    }, [transacoes, filtros, obterCategoria]);
    
    // Transações agrupadas por data
    const transacoesAgrupadas = useMemo(() => {
        const grupos: Record<string, typeof transacoesFiltradas> = {};

        transacoesFiltradas.forEach(t => {
            const dataFormatada = formatarData(t.data.split('T')[0]);
            if (!grupos[dataFormatada]) {
                grupos[dataFormatada] = [];
            }
            grupos[dataFormatada].push(t);
        });

        return Object.entries(grupos).map(([data, transacoes]) => ({
            data,
            transacoes
        }));
    }, [transacoesFiltradas]);
    
    // Estatísticas
    const estatisticas = useMemo((): EstatisticasFluxo => {
        const entradas = transacoesFiltradas.filter(t => t.tipo === 'entrada');
        const saidas = transacoesFiltradas.filter(t => t.tipo === 'saida');

        const totalEntradas = entradas.reduce((acc, t) => acc + t.valor, 0);
        const totalSaidas = saidas.reduce((acc, t) => acc + t.valor, 0);
        const saldo = totalEntradas - totalSaidas;

        // Maior entrada e saída
        const maiorEntrada = entradas.length > 0
            ? entradas.reduce((prev, curr) => curr.valor > prev.valor ? curr : prev)
            : undefined;

        const maiorSaida = saidas.length > 0
            ? saidas.reduce((prev, curr) => curr.valor > prev.valor ? curr : prev)
            : undefined;

        // Transações por categoria
        const porCategoria: Record<string, { total: number; tipo: 'entrada' | 'saida' }> = {};
        transacoesFiltradas.forEach(t => {
            if (!porCategoria[t.categoriaId]) {
                porCategoria[t.categoriaId] = { total: 0, tipo: t.tipo };
            }
            porCategoria[t.categoriaId].total += t.valor;
        });

        const transacoesPorCategoria = Object.entries(porCategoria).map(([categoriaId, dados]) => {
            const categoria = obterCategoria(categoriaId) || {
                id: 'desconhecida',
                nome: 'Categoria Desconhecida',
                icone: '❓',
                cor: '#9CA3AF',
                tipo: dados.tipo
            };
            const totalTipo = dados.tipo === 'entrada' ? totalEntradas : totalSaidas;
            return {
                categoria,
                total: dados.total,
                percentual: totalTipo > 0 ? (dados.total / totalTipo) * 100 : 0,
                tipo: dados.tipo
            };
        }).sort((a, b) => b.total - a.total);

        // Categoria que mais gasta
        const categoriaMaisGastos = transacoesPorCategoria.find(c => c.tipo === 'saida');

        // Média diária de gastos
        const datasUnicas = [...new Set(saidas.map(t => new Date(t.data).toDateString()))];
        const mediaDiariaGastos = datasUnicas.length > 0 ? totalSaidas / datasUnicas.length : 0;

        // Projeção para fim do mês
        const hoje = new Date();
        const diasNoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
        const diasRestantes = diasNoMes - hoje.getDate();
        const projecaoGastos = totalSaidas + (mediaDiariaGastos * diasRestantes);
        const rendaEstimada = totalEntradas;
        const projecaoFimMes = rendaEstimada - projecaoGastos;

        // Evolução do saldo
        const evolucaoSaldo: EstatisticasFluxo['evolucaoSaldo'] = [];
        const datasOrdenadas = [...new Set(transacoesFiltradas.map(t =>
            formatarData(t.data.split('T')[0])
        ))].sort((a, b) => {
            const [diaA, mesA, anoA] = a.split('/').map(Number);
            const [diaB, mesB, anoB] = b.split('/').map(Number);
            return new Date(anoA, mesA - 1, diaA).getTime() - new Date(anoB, mesB - 1, diaB).getTime();
        });

        let saldoAcumulado = 0;
        datasOrdenadas.forEach(data => {
            const transacoesDia = transacoesFiltradas.filter(t =>
                formatarData(t.data.split('T')[0]) === data
            );
            const entradasDia = transacoesDia.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0);
            const saidasDia = transacoesDia.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + t.valor, 0);
            saldoAcumulado += entradasDia - saidasDia;

            evolucaoSaldo.push({
                data,
                saldo: saldoAcumulado,
                entradas: entradasDia,
                saidas: saidasDia
            });
        });

        return {
            totalEntradas,
            totalSaidas,
            saldo,
            variacaoEntradas: 0,
            variacaoSaidas: 0,
            variacaoSaldo: 0,
            maiorEntrada,
            maiorSaida,
            categoriaMaisGastos,
            mediaDiariaGastos,
            projecaoFimMes,
            transacoesPorCategoria,
            evolucaoSaldo
        };
    }, [transacoesFiltradas, obterCategoria]);
    
    return {
        // Estado
        transacoes,
        transacoesFiltradas,
        transacoesAgrupadas,
        categorias,
        filtros,
        estatisticas,
        carregado,

        // Ações de transação
        adicionarTransacao,
        editarTransacao,
        excluirTransacao,

        // Ações de categoria
        adicionarCategoria,
        excluirCategoria,
        obterCategoria,

        // Ações de filtro
        atualizarFiltros,
        limparFiltros
    };
}
