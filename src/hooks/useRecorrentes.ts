import { useState, useEffect, useCallback } from 'react';
import { TransacaoRecorrente, NovaTransacaoRecorrente, NovaTransacao } from '../types/fluxoCaixa';
import { calcularProximaData } from '../utils/calculos';

const STORAGE_KEY = 'jurus_recorrentes';

export function useRecorrentes() {
    const [recorrentes, setRecorrentes] = useState<TransacaoRecorrente[]>([]);
    const [carregado, setCarregado] = useState(false);

    // Carregar do localStorage
    useEffect(() => {
        const salvas = localStorage.getItem(STORAGE_KEY);
        if (salvas) {
            setRecorrentes(JSON.parse(salvas));
        }
        setCarregado(true);
    }, []);

    // Salvar sempre que mudar
    useEffect(() => {
        if (carregado) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(recorrentes));
        }
    }, [recorrentes, carregado]);

    // calcularProximaData removida (usando importada)

    const adicionarRecorrente = useCallback((nova: NovaTransacaoRecorrente) => {
        const proximaData = calcularProximaData(
            nova.dataInicio,
            nova.frequencia,
            nova.diaDoMes,
            nova.diaDaSemana
        );

        const recorrente: TransacaoRecorrente = {
            ...nova,
            id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            proximaData,
            ativa: nova.ativa ?? true,
            criadoEm: new Date().toISOString()
        };

        setRecorrentes(prev => [...prev, recorrente]);
        return recorrente;
    }, []);

    const editarRecorrente = useCallback((id: string, dados: Partial<TransacaoRecorrente>) => {
        setRecorrentes(prev => prev.map(rec => {
            if (rec.id !== id) return rec;

            const atualizado = { ...rec, ...dados };

            // Recalcular próxima data se mudou frequência ou datas
            if (dados.frequencia || dados.diaDoMes !== undefined || dados.diaDaSemana !== undefined) {
                atualizado.proximaData = calcularProximaData(
                    atualizado.dataInicio,
                    atualizado.frequencia,
                    atualizado.diaDoMes,
                    atualizado.diaDaSemana
                );
            }

            return atualizado;
        }));
    }, []);

    const excluirRecorrente = useCallback((id: string) => {
        setRecorrentes(prev => prev.filter(rec => rec.id !== id));
    }, []);

    const toggleAtiva = useCallback((id: string) => {
        setRecorrentes(prev => prev.map(rec =>
            rec.id === id ? { ...rec, ativa: !rec.ativa } : rec
        ));
    }, []);

    const gerarTransacoesPendentes = useCallback((): NovaTransacao[] => {
        const hoje = new Date().toISOString().split('T')[0];
        const transacoes: NovaTransacao[] = [];

        recorrentes.forEach(rec => {
            if (!rec.ativa) return;
            if (rec.dataFim && rec.proximaData > rec.dataFim) return;
            if (rec.proximaData <= hoje) {
                transacoes.push({
                    descricao: rec.descricao,
                    valor: rec.valor,
                    tipo: rec.tipo,
                    categoriaId: rec.categoriaId,
                    data: rec.proximaData,
                    observacoes: rec.observacoes ? `${rec.observacoes} (Recorrente)` : 'Transação Recorrente',
                    recorrente: true,
                    recorrencia: rec.frequencia
                });
            }
        });

        return transacoes;
    }, [recorrentes]);

    const atualizarProximaData = useCallback((id: string) => {
        setRecorrentes(prev => prev.map(rec => {
            if (rec.id !== id) return rec;

            const proximaData = calcularProximaData(
                rec.proximaData, // Usa última data como base
                rec.frequencia,
                rec.diaDoMes,
                rec.diaDaSemana
            );

            return { ...rec, proximaData };
        }));
    }, []);

    const obterRecorrentesAtivas = useCallback(() => {
        return recorrentes.filter(r => r.ativa);
    }, [recorrentes]);

    const preverOcorrencias = useCallback((recorrente: Partial<TransacaoRecorrente>, meses: number = 12): string[] => {
        if (!recorrente.dataInicio || !recorrente.frequencia) return [];

        const ocorrencias: string[] = [];
        let dataAtual = recorrente.dataInicio;
        const hoje = new Date();
        const limite = new Date(hoje.getFullYear(), hoje.getMonth() + meses, 0);

        // Se a data de início já passou, começamos dela
        // Se for futura, começamos dela também

        // Simular ocorrências
        let i = 0;
        while (i < 100) { // Safety break
            const dataObj = new Date(dataAtual);
            if (dataObj > limite) break;

            if (recorrente.dataFim && dataObj > new Date(recorrente.dataFim)) break;

            ocorrencias.push(dataAtual);

            // Calcular próxima
            dataAtual = calcularProximaData(
                dataAtual,
                recorrente.frequencia,
                recorrente.diaDoMes,
                recorrente.diaDaSemana
            );
            i++;
        }

        return ocorrencias;
    }, []);

    return {
        recorrentes,
        carregado,
        adicionarRecorrente,
        editarRecorrente,
        excluirRecorrente,
        toggleAtiva,
        gerarTransacoesPendentes,
        atualizarProximaData,
        obterRecorrentesAtivas,
        calcularProximaData,
        preverOcorrencias
    };
}
