/**
 * HOOK ATUALIZADO - USA CONTEXT GLOBAL
 * Sincronização automática sem F5
 */

import { useMemo } from 'react';
import { useFluxoCaixaContext } from '../contexts/FluxoCaixaContext';
import type { Fatura } from '../types/fluxoCaixa';

export function useCartaoCredito() {
    const {
        cartoes,
        gastosCartao,
        adicionarCartao,
        editarCartao,
        excluirCartao,
        adicionarGastoCartao,
        excluirGastoCartao,
        carregado
    } = useFluxoCaixaContext();
    
    // Cartões ativos
    const cartoesAtivos = useMemo(() => {
        return cartoes.filter(c => c.ativo);
    }, [cartoes]);
    
    // Total de limite disponível
    const limiteTotal = useMemo(() => {
        return cartoesAtivos.reduce((acc, c) => acc + c.limite, 0);
    }, [cartoesAtivos]);
    
    // Total gasto
    const totalGasto = useMemo(() => {
        return gastosCartao.reduce((acc, g) => acc + g.valorParcela, 0);
    }, [gastosCartao]);
    
    // Limite disponível
    const limiteDisponivel = limiteTotal - totalGasto;
    
    // Percentual usado
    const percentualUsado = limiteTotal > 0 ? (totalGasto / limiteTotal) * 100 : 0;
    
    // Obter gastos de um cartão
    const obterGastosCartao = (cartaoId: string) => {
        return gastosCartao.filter(g => g.cartaoId === cartaoId);
    };
    
    // Obter total gasto de um cartão
    const obterTotalGastoCartao = (cartaoId: string) => {
        return obterGastosCartao(cartaoId).reduce((acc, g) => acc + g.valorParcela, 0);
    };
    
    // Obter fatura de um cartão em um mês
    const obterFatura = (cartaoId: string, mes: number, ano: number): Fatura | null => {
        const cartao = cartoes.find(c => c.id === cartaoId);
        if (!cartao) return null;
        
        const gastosDoMes = gastosCartao.filter(g => {
            const dataGasto = new Date(g.data);
            return g.cartaoId === cartaoId && 
                   dataGasto.getMonth() === mes && 
                   dataGasto.getFullYear() === ano;
        });
        
        const total = gastosDoMes.reduce((acc, g) => acc + g.valorParcela, 0);
        
        // Calcular datas de fechamento e vencimento
        const dataFechamento = new Date(ano, mes, cartao.diaFechamento);
        const dataVencimento = new Date(ano, mes, cartao.diaVencimento);
        
        // Se vencimento é antes do fechamento, é no mês seguinte
        if (cartao.diaVencimento < cartao.diaFechamento) {
            dataVencimento.setMonth(dataVencimento.getMonth() + 1);
        }
        
        return {
            cartaoId,
            mes,
            ano,
            gastos: gastosDoMes,
            total,
            paga: false,
            dataFechamento: dataFechamento.toISOString(),
            dataVencimento: dataVencimento.toISOString()
        };
    };
    
    // Obter próxima fatura
    const obterProximaFatura = (cartaoId: string): Fatura | null => {
        const hoje = new Date();
        return obterFatura(cartaoId, hoje.getMonth(), hoje.getFullYear());
    };
    
    // Estatísticas por cartão
    const estatisticasPorCartao = useMemo(() => {
        return cartoesAtivos.map(cartao => {
            const gastos = obterGastosCartao(cartao.id);
            const totalGasto = gastos.reduce((acc, g) => acc + g.valorParcela, 0);
            const limiteDisponivel = cartao.limite - totalGasto;
            const percentualUsado = cartao.limite > 0 ? (totalGasto / cartao.limite) * 100 : 0;
            
            return {
                cartao,
                totalGasto,
                limiteDisponivel,
                percentualUsado,
                quantidadeGastos: gastos.length
            };
        });
    }, [cartoesAtivos, gastosCartao]);
    
    return {
        // Estado
        cartoes,
        cartoesAtivos,
        gastos: gastosCartao,
        carregado,
        
        // Estatísticas gerais
        limiteTotal,
        totalGasto,
        limiteDisponivel,
        percentualUsado,
        estatisticasPorCartao,
        
        // Ações de cartão
        adicionarCartao,
        editarCartao,
        excluirCartao,
        
        // Ações de gasto
        adicionarGastoCartao,
        excluirGastoCartao,
        
        // Consultas
        obterGastosCartao,
        obterTotalGastoCartao,
        obterFatura,
        obterProximaFatura
    };
}
