import { useState, useCallback, useMemo, useEffect } from 'react';
import { TransacaoPendente, NovaTransacaoPendente } from '../types/fluxoCaixa';

const STORAGE_KEY = 'jurus_transacoes_pendentes';

// Função para gerar ID único
const gerarId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Função para obter data atual no formato ISO
const getDataAtual = () => new Date().toISOString();

// Carregar dados do localStorage
const carregarDados = (): TransacaoPendente[] => {
    try {
        const dados = localStorage.getItem(STORAGE_KEY);
        if (dados) {
            return JSON.parse(dados);
        }
    } catch (error) {
        console.error('Erro ao carregar transações pendentes:', error);
    }
    return [];
};

// Salvar dados no localStorage
const salvarDados = (pendentes: TransacaoPendente[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pendentes));
    } catch (error) {
        console.error('Erro ao salvar transações pendentes:', error);
    }
};

export function useTransacoesPendentes() {
    const [pendentes, setPendentes] = useState<TransacaoPendente[]>([]);
    const [carregado, setCarregado] = useState(false);

    // Carregar dados iniciais
    useEffect(() => {
        const dados = carregarDados();
        setPendentes(dados);
        setCarregado(true);
    }, []);

    // Salvar sempre que houver mudanças
    useEffect(() => {
        if (carregado) {
            salvarDados(pendentes);
        }
    }, [pendentes, carregado]);

    // Adicionar transação pendente
    const adicionarPendente = useCallback((nova: NovaTransacaoPendente) => {
        const pendente: TransacaoPendente = {
            id: gerarId(),
            ...nova,
            criadoEm: getDataAtual()
        };

        setPendentes(prev => [pendente, ...prev]);
        return pendente;
    }, []);

    // Editar transação pendente
    const editarPendente = useCallback((id: string, dados: Partial<NovaTransacaoPendente>) => {
        setPendentes(prev =>
            prev.map(p =>
                p.id === id ? { ...p, ...dados } : p
            )
        );
    }, []);

    // Excluir transação pendente
    const excluirPendente = useCallback((id: string) => {
        setPendentes(prev => prev.filter(p => p.id !== id));
    }, []);

    // Filtrar pendentes por data
    const pendentesPorData = useMemo(() => {
        const hoje = new Date().toISOString().split('T')[0];
        
        return {
            vencidas: pendentes.filter(p => p.dataAgendada < hoje),
            hoje: pendentes.filter(p => p.dataAgendada === hoje),
            futuras: pendentes.filter(p => p.dataAgendada > hoje),
            proximos7Dias: pendentes.filter(p => {
                const dataAgendada = new Date(p.dataAgendada);
                const em7Dias = new Date();
                em7Dias.setDate(em7Dias.getDate() + 7);
                return dataAgendada >= new Date() && dataAgendada <= em7Dias;
            })
        };
    }, [pendentes]);

    // Estatísticas
    const estatisticas = useMemo(() => {
        const entradas = pendentes.filter(p => p.tipo === 'entrada');
        const saidas = pendentes.filter(p => p.tipo === 'saida');

        return {
            total: pendentes.length,
            totalEntradas: entradas.reduce((acc, p) => acc + p.valor, 0),
            totalSaidas: saidas.reduce((acc, p) => acc + p.valor, 0),
            saldoPrevisto: entradas.reduce((acc, p) => acc + p.valor, 0) - 
                          saidas.reduce((acc, p) => acc + p.valor, 0),
            vencidas: pendentesPorData.vencidas.length,
            hoje: pendentesPorData.hoje.length,
            proximos7Dias: pendentesPorData.proximos7Dias.length
        };
    }, [pendentes, pendentesPorData]);

    return {
        pendentes,
        pendentesPorData,
        estatisticas,
        carregado,
        adicionarPendente,
        editarPendente,
        excluirPendente
    };
}
