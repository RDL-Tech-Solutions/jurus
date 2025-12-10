/**
 * HOOK ATUALIZADO - USA CONTEXT GLOBAL
 * Sincronização automática sem F5
 */

import { useMemo } from 'react';
import { useFluxoCaixaContext } from '../contexts/FluxoCaixaContext';

export function useDividas() {
    const {
        dividas,
        adicionarDivida,
        editarDivida,
        excluirDivida,
        carregado
    } = useFluxoCaixaContext();
    
    // Dívidas pendentes (não pagas)
    const dividasPendentes = useMemo(() => {
        return dividas.filter(d => !d.pago);
    }, [dividas]);
    
    // Dívidas pagas
    const dividasPagas = useMemo(() => {
        return dividas.filter(d => d.pago);
    }, [dividas]);
    
    // Total de dívidas pendentes
    const totalPendente = useMemo(() => {
        return dividasPendentes.reduce((acc, d) => acc + d.valor, 0);
    }, [dividasPendentes]);
    
    // Total de dívidas pagas
    const totalPago = useMemo(() => {
        return dividasPagas.reduce((acc, d) => acc + d.valor, 0);
    }, [dividasPagas]);
    
    // Dívidas vencidas
    const dividasVencidas = useMemo(() => {
        const hoje = new Date().toISOString().split('T')[0];
        return dividasPendentes.filter(d => 
            d.dataVencimento && d.dataVencimento < hoje
        );
    }, [dividasPendentes]);
    
    // Dívidas a vencer (próximos 7 dias)
    const dividasAVencer = useMemo(() => {
        const hoje = new Date();
        const proximos7Dias = new Date();
        proximos7Dias.setDate(hoje.getDate() + 7);
        
        const hojeStr = hoje.toISOString().split('T')[0];
        const proximos7DiasStr = proximos7Dias.toISOString().split('T')[0];
        
        return dividasPendentes.filter(d => 
            d.dataVencimento && 
            d.dataVencimento >= hojeStr && 
            d.dataVencimento <= proximos7DiasStr
        );
    }, [dividasPendentes]);
    
    // Marcar como paga
    const marcarComoPaga = (id: string) => {
        editarDivida(id, {
            pago: true,
            dataPagamento: new Date().toISOString()
        });
    };
    
    // Marcar como pendente
    const marcarComoPendente = (id: string) => {
        editarDivida(id, {
            pago: false,
            dataPagamento: undefined
        });
    };
    
    return {
        dividas,
        dividasPendentes,
        dividasPagas,
        dividasVencidas,
        dividasAVencer,
        totalPendente,
        totalPago,
        carregado,
        adicionarDivida,
        editarDivida,
        excluirDivida,
        marcarComoPaga,
        marcarComoPendente
    };
}
