import { useState, useCallback, useMemo, useEffect } from 'react';
import { CartaoCredito, NovoCartao, GastoCartao, NovoGastoCartao, Fatura } from '../types/fluxoCaixa';

const STORAGE_KEY_CARTOES = 'jurus_cartoes';
const STORAGE_KEY_GASTOS = 'jurus_gastos_cartao';

// Função para gerar ID único
const gerarId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Função para obter data atual no formato ISO
const getDataAtual = () => new Date().toISOString();

// Carregar dados do localStorage
const carregarCartoes = (): CartaoCredito[] => {
    try {
        const dados = localStorage.getItem(STORAGE_KEY_CARTOES);
        if (dados) return JSON.parse(dados);
    } catch (error) {
        console.error('Erro ao carregar cartões:', error);
    }
    return [];
};

const carregarGastos = (): GastoCartao[] => {
    try {
        const dados = localStorage.getItem(STORAGE_KEY_GASTOS);
        if (dados) return JSON.parse(dados);
    } catch (error) {
        console.error('Erro ao carregar gastos:', error);
    }
    return [];
};

// Salvar dados no localStorage
const salvarCartoes = (cartoes: CartaoCredito[]) => {
    try {
        localStorage.setItem(STORAGE_KEY_CARTOES, JSON.stringify(cartoes));
    } catch (error) {
        console.error('Erro ao salvar cartões:', error);
    }
};

const salvarGastos = (gastos: GastoCartao[]) => {
    try {
        localStorage.setItem(STORAGE_KEY_GASTOS, JSON.stringify(gastos));
    } catch (error) {
        console.error('Erro ao salvar gastos:', error);
    }
};

// Calcular data de fechamento e vencimento
const calcularDataFechamento = (diaFechamento: number, mes: number, ano: number): Date => {
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
    const dia = Math.min(diaFechamento, ultimoDia);
    return new Date(ano, mes, dia);
};

const calcularDataVencimento = (diaVencimento: number, diaFechamento: number, mes: number, ano: number): Date => {
    let mesVenc = mes;
    let anoVenc = ano;

    // Se o vencimento é no mês seguinte ao fechamento
    if (diaVencimento <= diaFechamento) {
        mesVenc = mes + 1;
        if (mesVenc > 11) {
            mesVenc = 0;
            anoVenc = ano + 1;
        }
    }

    const ultimoDia = new Date(anoVenc, mesVenc + 1, 0).getDate();
    const dia = Math.min(diaVencimento, ultimoDia);
    return new Date(anoVenc, mesVenc, dia);
};

export function useCartaoCredito() {
    const [cartoes, setCartoes] = useState<CartaoCredito[]>([]);
    const [gastos, setGastos] = useState<GastoCartao[]>([]);
    const [carregado, setCarregado] = useState(false);
    const [faturasPagas, setFaturasPagas] = useState<Record<string, boolean>>({});

    // Carregar dados iniciais
    useEffect(() => {
        const cartoesData = carregarCartoes();
        const gastosData = carregarGastos();
        setCartoes(cartoesData);
        setGastos(gastosData);

        // Carregar faturas pagas
        try {
            const faturas = localStorage.getItem('jurus_faturas_pagas');
            if (faturas) setFaturasPagas(JSON.parse(faturas));
        } catch (e) { }

        setCarregado(true);
    }, []);

    // Salvar sempre que houver mudanças
    useEffect(() => {
        if (carregado) {
            salvarCartoes(cartoes);
            salvarGastos(gastos);
            localStorage.setItem('jurus_faturas_pagas', JSON.stringify(faturasPagas));
        }
    }, [cartoes, gastos, faturasPagas, carregado]);

    // CRUD Cartões
    const adicionarCartao = useCallback((novo: NovoCartao) => {
        const cartao: CartaoCredito = {
            id: gerarId(),
            ...novo,
            ativo: true,
            criadoEm: getDataAtual()
        };
        setCartoes(prev => [...prev, cartao]);
        return cartao;
    }, []);

    const editarCartao = useCallback((id: string, dados: Partial<NovoCartao>) => {
        setCartoes(prev =>
            prev.map(c => c.id === id ? { ...c, ...dados } : c)
        );
    }, []);

    const excluirCartao = useCallback((id: string) => {
        setCartoes(prev => prev.filter(c => c.id !== id));
        setGastos(prev => prev.filter(g => g.cartaoId !== id));
    }, []);

    // CRUD Gastos
    const adicionarGasto = useCallback((novo: NovoGastoCartao) => {
        const valorParcela = novo.parcelas > 1 ? novo.valor / novo.parcelas : novo.valor;

        // Criar um gasto para cada parcela
        const novosGastos: GastoCartao[] = [];
        const dataBase = new Date(novo.data);

        for (let i = 0; i < novo.parcelas; i++) {
            const dataParcela = new Date(dataBase);
            dataParcela.setMonth(dataParcela.getMonth() + i);

            novosGastos.push({
                id: gerarId(),
                cartaoId: novo.cartaoId,
                descricao: novo.descricao,
                valor: novo.valor,
                valorParcela,
                parcelas: novo.parcelas,
                parcelaAtual: i + 1,
                data: dataParcela.toISOString(),
                categoriaId: novo.categoriaId,
                observacoes: novo.observacoes,
                criadoEm: getDataAtual()
            });
        }

        setGastos(prev => [...prev, ...novosGastos]);
        return novosGastos;
    }, []);

    const excluirGasto = useCallback((id: string) => {
        // Encontrar o gasto para pegar a descrição e excluir todas as parcelas
        const gasto = gastos.find(g => g.id === id);
        if (gasto) {
            // Excluir todas as parcelas do mesmo gasto
            setGastos(prev => prev.filter(g =>
                !(g.cartaoId === gasto.cartaoId &&
                    g.descricao === gasto.descricao &&
                    g.valor === gasto.valor)
            ));
        }
    }, [gastos]);

    // Obter cartão por ID
    const obterCartao = useCallback((id: string) => {
        return cartoes.find(c => c.id === id);
    }, [cartoes]);

    // Calcular fatura de um cartão
    const calcularFatura = useCallback((cartaoId: string, mes: number, ano: number): Fatura | null => {
        const cartao = cartoes.find(c => c.id === cartaoId);
        if (!cartao) return null;

        const dataFechamento = calcularDataFechamento(cartao.diaFechamento, mes, ano);
        const dataVencimento = calcularDataVencimento(cartao.diaVencimento, cartao.diaFechamento, mes, ano);

        // Período da fatura: do fechamento anterior até o fechamento atual
        const mesAnterior = mes === 0 ? 11 : mes - 1;
        const anoAnterior = mes === 0 ? ano - 1 : ano;
        const fechamentoAnterior = calcularDataFechamento(cartao.diaFechamento, mesAnterior, anoAnterior);

        // Filtrar gastos do período
        const gastosFatura = gastos.filter(g => {
            if (g.cartaoId !== cartaoId) return false;
            const dataGasto = new Date(g.data);
            return dataGasto > fechamentoAnterior && dataGasto <= dataFechamento;
        });

        const total = gastosFatura.reduce((acc, g) => acc + g.valorParcela, 0);
        const faturaKey = `${cartaoId}-${mes}-${ano}`;

        return {
            cartaoId,
            mes,
            ano,
            gastos: gastosFatura,
            total,
            paga: faturasPagas[faturaKey] || false,
            dataFechamento: dataFechamento.toISOString(),
            dataVencimento: dataVencimento.toISOString()
        };
    }, [cartoes, gastos, faturasPagas]);

    // Obter fatura atual de um cartão
    const obterFaturaAtual = useCallback((cartaoId: string): Fatura | null => {
        const hoje = new Date();
        return calcularFatura(cartaoId, hoje.getMonth(), hoje.getFullYear());
    }, [calcularFatura]);

    // Marcar fatura como paga (retorna valor para debitar)
    const pagarFatura = useCallback((cartaoId: string, mes: number, ano: number): number => {
        const fatura = calcularFatura(cartaoId, mes, ano);
        if (!fatura || fatura.paga) return 0;

        const faturaKey = `${cartaoId}-${mes}-${ano}`;
        setFaturasPagas(prev => ({ ...prev, [faturaKey]: true }));

        return fatura.total;
    }, [calcularFatura]);

    // Calcular limite usado de um cartão
    const calcularLimiteUsado = useCallback((cartaoId: string): number => {
        const fatura = obterFaturaAtual(cartaoId);
        return fatura?.total || 0;
    }, [obterFaturaAtual]);

    // Estatísticas gerais
    const estatisticas = useMemo(() => {
        const hoje = new Date();
        const mes = hoje.getMonth();
        const ano = hoje.getFullYear();

        let totalFaturas = 0;
        let totalLimite = 0;
        let totalUsado = 0;

        cartoes.filter(c => c.ativo).forEach(cartao => {
            const fatura = calcularFatura(cartao.id, mes, ano);
            if (fatura && !fatura.paga) {
                totalFaturas += fatura.total;
            }
            totalLimite += cartao.limite;
            totalUsado += calcularLimiteUsado(cartao.id);
        });

        return {
            totalFaturas,
            totalLimite,
            totalUsado,
            limiteDisponivel: totalLimite - totalUsado,
            quantidadeCartoes: cartoes.filter(c => c.ativo).length
        };
    }, [cartoes, calcularFatura, calcularLimiteUsado]);

    return {
        cartoes: cartoes.filter(c => c.ativo),
        gastos,
        estatisticas,
        carregado,
        // CRUD Cartões
        adicionarCartao,
        editarCartao,
        excluirCartao,
        obterCartao,
        // CRUD Gastos
        adicionarGasto,
        excluirGasto,
        // Faturas
        calcularFatura,
        obterFaturaAtual,
        pagarFatura,
        calcularLimiteUsado
    };
}
