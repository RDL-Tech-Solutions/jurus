import { useState, useCallback, useMemo, useEffect } from 'react';
import { Divida, NovaDivida } from '../types/fluxoCaixa';

const STORAGE_KEY = 'jurus_dividas';

// Função para gerar ID único
const gerarId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Função para obter data atual no formato ISO
const getDataAtual = () => new Date().toISOString();

// Carregar dados do localStorage
const carregarDados = (): Divida[] => {
    try {
        const dados = localStorage.getItem(STORAGE_KEY);
        if (dados) {
            return JSON.parse(dados);
        }
    } catch (error) {
        console.error('Erro ao carregar dívidas:', error);
    }
    return [];
};

// Salvar dados no localStorage
const salvarDados = (dividas: Divida[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dividas));
    } catch (error) {
        console.error('Erro ao salvar dívidas:', error);
    }
};

export function useDividas() {
    const [dividas, setDividas] = useState<Divida[]>([]);
    const [carregado, setCarregado] = useState(false);

    // Carregar dados iniciais
    useEffect(() => {
        const dados = carregarDados();
        setDividas(dados);
        setCarregado(true);
    }, []);

    // Salvar sempre que houver mudanças
    useEffect(() => {
        if (carregado) {
            salvarDados(dividas);
        }
    }, [dividas, carregado]);

    // Adicionar dívida (com suporte a parcelamento)
    const adicionarDivida = useCallback((nova: NovaDivida) => {
        const numeroParcelas = nova.numeroParcelas || 1;
        const valorParcela = nova.valor / numeroParcelas;
        const dividaPaiId = gerarId();
        const novasDividas: Divida[] = [];

        for (let i = 0; i < numeroParcelas; i++) {
            // Calcular data de vencimento para cada parcela (adiciona meses)
            let dataVencimento = nova.dataVencimento;
            if (dataVencimento && i > 0) {
                const data = new Date(dataVencimento);
                data.setMonth(data.getMonth() + i);
                dataVencimento = data.toISOString().split('T')[0];
            }

            const divida: Divida = {
                id: i === 0 ? dividaPaiId : gerarId(),
                descricao: numeroParcelas > 1
                    ? `${nova.descricao} (${i + 1}/${numeroParcelas})`
                    : nova.descricao,
                valor: Math.round(valorParcela * 100) / 100, // Arredondar para 2 casas
                credor: nova.credor,
                categoriaId: nova.categoriaId,
                dataVencimento,
                observacoes: nova.observacoes,
                pago: false,
                numeroParcelas: numeroParcelas > 1 ? numeroParcelas : undefined,
                parcelaAtual: numeroParcelas > 1 ? i + 1 : undefined,
                dividaPaiId: numeroParcelas > 1 && i > 0 ? dividaPaiId : undefined,
                criadoEm: getDataAtual(),
                atualizadoEm: getDataAtual()
            };
            novasDividas.push(divida);
        }

        setDividas(prev => [...novasDividas, ...prev]);
        return novasDividas[0];
    }, []);

    // Editar dívida
    const editarDivida = useCallback((id: string, dados: Partial<NovaDivida>) => {
        setDividas(prev =>
            prev.map(d =>
                d.id === id
                    ? { ...d, ...dados, atualizadoEm: getDataAtual() }
                    : d
            )
        );
    }, []);

    // Excluir dívida
    const excluirDivida = useCallback((id: string) => {
        setDividas(prev => prev.filter(d => d.id !== id));
    }, []);

    // Marcar como pago (retorna o valor para debitar do caixa)
    const marcarComoPago = useCallback((id: string): number => {
        // Buscar a dívida primeiro para obter o valor ANTES de atualizar
        const divida = dividas.find(d => d.id === id && !d.pago);
        if (!divida) return 0;

        const valorPago = divida.valor;

        setDividas(prev =>
            prev.map(d => {
                if (d.id === id && !d.pago) {
                    return {
                        ...d,
                        pago: true,
                        dataPagamento: getDataAtual(),
                        atualizadoEm: getDataAtual()
                    };
                }
                return d;
            })
        );

        return valorPago;
    }, [dividas]);

    // Desmarcar pagamento
    const desmarcarPagamento = useCallback((id: string) => {
        setDividas(prev =>
            prev.map(d =>
                d.id === id
                    ? {
                        ...d,
                        pago: false,
                        dataPagamento: undefined,
                        atualizadoEm: getDataAtual()
                    }
                    : d
            )
        );
    }, []);

    // Dívidas separadas por status
    const dividasPendentes = useMemo(() =>
        dividas.filter(d => !d.pago).sort((a, b) => {
            // Ordenar por vencimento (mais próximo primeiro)
            if (a.dataVencimento && b.dataVencimento) {
                return new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime();
            }
            if (a.dataVencimento) return -1;
            if (b.dataVencimento) return 1;
            return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime();
        }),
        [dividas]
    );

    const dividasPagas = useMemo(() =>
        dividas.filter(d => d.pago).sort((a, b) =>
            new Date(b.dataPagamento || b.atualizadoEm).getTime() -
            new Date(a.dataPagamento || a.atualizadoEm).getTime()
        ),
        [dividas]
    );

    // Estatísticas
    const estatisticas = useMemo(() => {
        const totalPendente = dividasPendentes.reduce((acc, d) => acc + d.valor, 0);
        const totalPago = dividasPagas.reduce((acc, d) => acc + d.valor, 0);

        // Dívidas com vencimento próximo (7 dias)
        const hoje = new Date();
        const em7Dias = new Date(hoje);
        em7Dias.setDate(em7Dias.getDate() + 7);

        const vencimentoProximo = dividasPendentes.filter(d => {
            if (!d.dataVencimento) return false;
            const venc = new Date(d.dataVencimento);
            return venc >= hoje && venc <= em7Dias;
        });

        // Dívidas vencidas
        const vencidas = dividasPendentes.filter(d => {
            if (!d.dataVencimento) return false;
            return new Date(d.dataVencimento) < hoje;
        });

        return {
            totalPendente,
            totalPago,
            quantidadePendente: dividasPendentes.length,
            quantidadePaga: dividasPagas.length,
            vencimentoProximo,
            vencidas
        };
    }, [dividasPendentes, dividasPagas]);

    return {
        dividas,
        dividasPendentes,
        dividasPagas,
        estatisticas,
        carregado,
        adicionarDivida,
        editarDivida,
        excluirDivida,
        marcarComoPago,
        desmarcarPagamento
    };
}
