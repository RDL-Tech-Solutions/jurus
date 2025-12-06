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

    // Adicionar dívida
    const adicionarDivida = useCallback((nova: NovaDivida) => {
        const divida: Divida = {
            id: gerarId(),
            ...nova,
            pago: false,
            criadoEm: getDataAtual(),
            atualizadoEm: getDataAtual()
        };
        setDividas(prev => [divida, ...prev]);
        return divida;
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
        let valorPago = 0;
        setDividas(prev =>
            prev.map(d => {
                if (d.id === id && !d.pago) {
                    valorPago = d.valor;
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
    }, []);

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
