/**
 * HOOK ATUALIZADO - USA CONTEXT GLOBAL
 * Sincronização automática sem F5
 */

import { useCallback } from 'react';
import { useFluxoCaixaContext } from '../contexts/FluxoCaixaContext';
import { calcularProximaData } from '../utils/calculos';
import type { NovaTransacao } from '../types/fluxoCaixa';

export function useRecorrentes() {
    const {
        recorrentes,
        adicionarRecorrente: addRecorrente,
        editarRecorrente: editRecorrente,
        excluirRecorrente: delRecorrente,
        toggleRecorrente: toggleRec,
        carregado
    } = useFluxoCaixaContext();
    
    // Adicionar recorrente com cálculo de próxima data
    const adicionarRecorrente = useCallback((nova: any) => {
        const proximaData = calcularProximaData(
            nova.dataInicio,
            nova.frequencia,
            nova.diaDoMes,
            nova.diaDaSemana
        );
        
        return addRecorrente({
            ...nova,
            proximaData
        });
    }, [addRecorrente]);
    
    // Editar recorrente com recálculo de próxima data
    const editarRecorrente = useCallback((id: string, dados: any) => {
        // Recalcular próxima data se mudou frequência ou datas
        if (dados.frequencia || dados.diaDoMes !== undefined || dados.diaDaSemana !== undefined) {
            const recorrente = recorrentes.find(r => r.id === id);
            if (recorrente) {
                const atualizado = { ...recorrente, ...dados };
                dados.proximaData = calcularProximaData(
                    atualizado.dataInicio,
                    atualizado.frequencia,
                    atualizado.diaDoMes,
                    atualizado.diaDaSemana
                );
            }
        }
        
        editRecorrente(id, dados);
    }, [recorrentes, editRecorrente]);
    
    // Gerar transações pendentes
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
    
    // Efetivar próxima ocorrência
    const efetivarProximaOcorrencia = useCallback((id: string) => {
        const recorrente = recorrentes.find(r => r.id === id);
        if (!recorrente) return;
        
        const proximaData = calcularProximaData(
            recorrente.proximaData,
            recorrente.frequencia,
            recorrente.diaDoMes,
            recorrente.diaDaSemana
        );
        
        editRecorrente(id, { proximaData });
    }, [recorrentes, editRecorrente]);
    
    return {
        recorrentes,
        carregado,
        adicionarRecorrente,
        editarRecorrente,
        excluirRecorrente: delRecorrente,
        toggleAtiva: toggleRec,
        gerarTransacoesPendentes,
        efetivarProximaOcorrencia
    };
}
