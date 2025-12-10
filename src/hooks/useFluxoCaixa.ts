import { useState, useCallback, useMemo, useEffect } from 'react';
import {
    Transacao,
    NovaTransacao,
    FiltrosFluxo,
    EstatisticasFluxo,
    CategoriaFluxo,
    CATEGORIAS_PADRAO,
    FILTROS_PADRAO
} from '../types/fluxoCaixa';
import { formatarData } from '../utils/calculos';

const STORAGE_KEY = 'jurus_fluxo_caixa';

// Função para gerar ID único
const gerarId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Função para obter data atual no formato ISO
const getDataAtual = () => new Date().toISOString();

// Carregar dados do localStorage
const carregarDados = (): { transacoes: Transacao[]; categorias: CategoriaFluxo[] } => {
    try {
        const dados = localStorage.getItem(STORAGE_KEY);
        if (dados) {
            const parsed = JSON.parse(dados);
            return {
                transacoes: parsed.transacoes || [],
                categorias: parsed.categorias || CATEGORIAS_PADRAO
            };
        }
    } catch (error) {
        console.error('Erro ao carregar dados do fluxo de caixa:', error);
    }
    return { transacoes: [], categorias: CATEGORIAS_PADRAO };
};

// Salvar dados no localStorage
const salvarDados = (transacoes: Transacao[], categorias: CategoriaFluxo[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ transacoes, categorias }));
    } catch (error) {
        console.error('Erro ao salvar dados do fluxo de caixa:', error);
    }
};

// Função para filtrar por período
const filtrarPorPeriodo = (data: string, periodo: FiltrosFluxo['periodo'], dataInicio?: string, dataFim?: string): boolean => {
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
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    const [categorias, setCategorias] = useState<CategoriaFluxo[]>(CATEGORIAS_PADRAO);
    const [filtros, setFiltros] = useState<FiltrosFluxo>(FILTROS_PADRAO);
    const [carregado, setCarregado] = useState(false);

    // Carregar dados iniciais
    useEffect(() => {
        const dados = carregarDados();
        setTransacoes(dados.transacoes);
        setCategorias(dados.categorias);
        setCarregado(true);
    }, []);

    // NOTA: A lógica de recorrências foi movida para useRecorrentes e é gerenciada
    // no componente FluxoCaixa para evitar duplicação e melhor controle

    // Salvar sempre que houver mudanças
    useEffect(() => {
        if (carregado) {
            salvarDados(transacoes, categorias);
        }
    }, [transacoes, categorias, carregado]);

    // Adicionar transação
    const adicionarTransacao = useCallback((nova: NovaTransacao) => {
        const transacao: Transacao = {
            id: gerarId(),
            ...nova,
            criadoEm: getDataAtual(),
            atualizadoEm: getDataAtual()
        };
        setTransacoes(prev => [transacao, ...prev]);
        return transacao;
    }, []);

    // Editar transação
    const editarTransacao = useCallback((id: string, dados: Partial<NovaTransacao>) => {
        setTransacoes(prev =>
            prev.map(t =>
                t.id === id
                    ? { ...t, ...dados, atualizadoEm: getDataAtual() }
                    : t
            )
        );
    }, []);

    // Excluir transação
    const excluirTransacao = useCallback((id: string) => {
        setTransacoes(prev => prev.filter(t => t.id !== id));
    }, []);

    // Obter categoria por ID
    const obterCategoria = useCallback((categoriaId: string): CategoriaFluxo | undefined => {
        return categorias.find(c => c.id === categoriaId);
    }, [categorias]);

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
        const grupos: Record<string, Transacao[]> = {};

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
            const categoria = obterCategoria(categoriaId) || CATEGORIAS_PADRAO.find(c => c.id === categoriaId) || {
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
        const rendaEstimada = totalEntradas; // Assumindo que a renda já foi recebida
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
            variacaoEntradas: 0, // TODO: Calcular variação com período anterior
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

    // Atualizar filtros
    const atualizarFiltros = useCallback((novosFiltros: Partial<FiltrosFluxo>) => {
        setFiltros(prev => ({ ...prev, ...novosFiltros }));
    }, []);

    // Limpar filtros
    const limparFiltros = useCallback(() => {
        setFiltros(FILTROS_PADRAO);
    }, []);

    // Adicionar categoria personalizada
    const adicionarCategoria = useCallback((categoria: Omit<CategoriaFluxo, 'id'>) => {
        const novaCategoria: CategoriaFluxo = {
            id: gerarId(),
            ...categoria
        };
        setCategorias(prev => [...prev, novaCategoria]);
        return novaCategoria;
    }, []);

    // Excluir categoria
    const excluirCategoria = useCallback((id: string) => {
        // Não permite excluir categorias padrão
        if (CATEGORIAS_PADRAO.some(c => c.id === id)) return;
        setCategorias(prev => prev.filter(c => c.id !== id));
    }, []);

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
