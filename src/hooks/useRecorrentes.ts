import { useState, useEffect, useCallback } from 'react';
import { TransacaoRecorrente, NovaTransacaoRecorrente, NovaTransacao } from '../types/fluxoCaixa';

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

    const calcularProximaData = useCallback((
        dataInicio: string,
        frequencia: TransacaoRecorrente['frequencia'],
        diaDoMes?: number,
        diaDaSemana?: number
    ): string => {
        const hoje = new Date();
        const inicio = new Date(dataInicio);
        let proxima = new Date(Math.max(hoje.getTime(), inicio.getTime()));

        switch (frequencia) {
            case 'diaria':
                proxima.setDate(proxima.getDate() + 1);
                break;

            case 'semanal':
                if (diaDaSemana !== undefined) {
                    const diaAtual = proxima.getDay();
                    let diasAte = (diaDaSemana - diaAtual + 7) % 7;
                    if (diasAte === 0) diasAte = 7; // Próxima semana
                    proxima.setDate(proxima.getDate() + diasAte);
                }
                break;

            case 'mensal':
                if (diaDoMes !== undefined) {
                    proxima.setMonth(proxima.getMonth() + 1);
                    proxima.setDate(Math.min(diaDoMes, new Date(proxima.getFullYear(), proxima.getMonth() + 1, 0).getDate()));
                }
                break;

            case 'anual':
                proxima.setFullYear(proxima.getFullYear() + 1);
                break;
        }

        return proxima.toISOString().split('T')[0];
    }, []);

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
            ativa: true,
            criadoEm: new Date().toISOString()
        };

        setRecorrentes(prev => [...prev, recorrente]);
        return recorrente;
    }, [calcularProximaData]);

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
    }, [calcularProximaData]);

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
    }, [calcularProximaData]);

    const obterRecorrentesAtivas = useCallback(() => {
        return recorrentes.filter(r => r.ativa);
    }, [recorrentes]);

    return {
        recorrentes,
        carregado,
        adicionarRecorrente,
        editarRecorrente,
        excluirRecorrente,
        toggleAtiva,
        gerarTransacoesPendentes,
        atualizarProximaData,
        obterRecorrentesAtivas
    };
}
