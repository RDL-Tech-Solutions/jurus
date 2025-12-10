/**
 * CONTEXT GLOBAL DO FLUXO DE CAIXA
 * Sincroniza TODOS os dados em um único lugar
 * Atualização automática sem F5
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import {
    Transacao,
    NovaTransacao,
    CategoriaFluxo,
    CATEGORIAS_PADRAO,
    FiltrosFluxo,
    FILTROS_PADRAO
} from '../types/fluxoCaixa';
import type {
    TransacaoRecorrente,
    NovaTransacaoRecorrente,
    Divida,
    NovaDivida,
    CartaoCredito,
    GastoCartao,
    NovoGastoCartao
} from '../types/fluxoCaixa';

// Tipo para novo cartão
interface NovoCartaoCredito {
    nome: string;
    bandeira: 'visa' | 'mastercard' | 'elo' | 'amex' | 'hipercard' | 'outro';
    limite: number;
    diaFechamento: number;
    diaVencimento: number;
    cor: string;
}

// ============================================================================
// TYPES
// ============================================================================

interface FluxoCaixaState {
    transacoes: Transacao[];
    categorias: CategoriaFluxo[];
    recorrentes: TransacaoRecorrente[];
    dividas: Divida[];
    cartoes: CartaoCredito[];
    gastosCartao: GastoCartao[];
    filtros: FiltrosFluxo;
    carregado: boolean;
}

type FluxoCaixaAction =
    | { type: 'CARREGAR_DADOS'; payload: Partial<FluxoCaixaState> }
    | { type: 'ADICIONAR_TRANSACAO'; payload: Transacao }
    | { type: 'EDITAR_TRANSACAO'; payload: { id: string; dados: Partial<Transacao> } }
    | { type: 'EXCLUIR_TRANSACAO'; payload: string }
    | { type: 'ADICIONAR_RECORRENTE'; payload: TransacaoRecorrente }
    | { type: 'EDITAR_RECORRENTE'; payload: { id: string; dados: Partial<TransacaoRecorrente> } }
    | { type: 'EXCLUIR_RECORRENTE'; payload: string }
    | { type: 'TOGGLE_RECORRENTE'; payload: string }
    | { type: 'ADICIONAR_DIVIDA'; payload: Divida }
    | { type: 'EDITAR_DIVIDA'; payload: { id: string; dados: Partial<Divida> } }
    | { type: 'EXCLUIR_DIVIDA'; payload: string }
    | { type: 'ADICIONAR_CARTAO'; payload: CartaoCredito }
    | { type: 'EDITAR_CARTAO'; payload: { id: string; dados: Partial<CartaoCredito> } }
    | { type: 'EXCLUIR_CARTAO'; payload: string }
    | { type: 'ADICIONAR_GASTO_CARTAO'; payload: GastoCartao }
    | { type: 'EXCLUIR_GASTO_CARTAO'; payload: string }
    | { type: 'ADICIONAR_CATEGORIA'; payload: CategoriaFluxo }
    | { type: 'EXCLUIR_CATEGORIA'; payload: string }
    | { type: 'ATUALIZAR_FILTROS'; payload: Partial<FiltrosFluxo> }
    | { type: 'LIMPAR_FILTROS' };

interface FluxoCaixaContextType extends FluxoCaixaState {
    // Transações
    adicionarTransacao: (nova: NovaTransacao) => Transacao;
    editarTransacao: (id: string, dados: Partial<NovaTransacao>) => void;
    excluirTransacao: (id: string) => void;
    
    // Recorrentes
    adicionarRecorrente: (nova: NovaTransacaoRecorrente) => TransacaoRecorrente;
    editarRecorrente: (id: string, dados: Partial<TransacaoRecorrente>) => void;
    excluirRecorrente: (id: string) => void;
    toggleRecorrente: (id: string) => void;
    
    // Dívidas
    adicionarDivida: (nova: NovaDivida) => Divida;
    editarDivida: (id: string, dados: Partial<Divida>) => void;
    excluirDivida: (id: string) => void;
    
    // Cartões
    adicionarCartao: (novo: NovoCartaoCredito) => CartaoCredito;
    editarCartao: (id: string, dados: Partial<CartaoCredito>) => void;
    excluirCartao: (id: string) => void;
    adicionarGastoCartao: (novo: NovoGastoCartao) => GastoCartao;
    excluirGastoCartao: (id: string) => void;
    
    // Categorias
    adicionarCategoria: (categoria: Omit<CategoriaFluxo, 'id'>) => CategoriaFluxo;
    excluirCategoria: (id: string) => void;
    obterCategoria: (id: string) => CategoriaFluxo | undefined;
    
    // Filtros
    atualizarFiltros: (filtros: Partial<FiltrosFluxo>) => void;
    limparFiltros: () => void;
    
    // Forçar atualização
    forcarAtualizacao: () => void;
}

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEYS = {
    TRANSACOES: 'jurus_fluxo_caixa',
    RECORRENTES: 'jurus_recorrentes',
    DIVIDAS: 'jurus_dividas',
    CARTOES: 'jurus_cartoes',
    GASTOS_CARTAO: 'jurus_gastos_cartao'
};

// ============================================================================
// HELPERS
// ============================================================================

const gerarId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const getDataAtual = () => new Date().toISOString();

// Carregar dados do localStorage
const carregarDados = (): Partial<FluxoCaixaState> => {
    try {
        // Transações e categorias
        const dadosFluxo = localStorage.getItem(STORAGE_KEYS.TRANSACOES);
        const parsedFluxo = dadosFluxo ? JSON.parse(dadosFluxo) : {};
        
        // Recorrentes
        const dadosRecorrentes = localStorage.getItem(STORAGE_KEYS.RECORRENTES);
        const recorrentes = dadosRecorrentes ? JSON.parse(dadosRecorrentes) : [];
        
        // Dívidas
        const dadosDividas = localStorage.getItem(STORAGE_KEYS.DIVIDAS);
        const dividas = dadosDividas ? JSON.parse(dadosDividas) : [];
        
        // Cartões
        const dadosCartoes = localStorage.getItem(STORAGE_KEYS.CARTOES);
        const cartoes = dadosCartoes ? JSON.parse(dadosCartoes) : [];
        
        // Gastos de cartão
        const dadosGastos = localStorage.getItem(STORAGE_KEYS.GASTOS_CARTAO);
        const gastosCartao = dadosGastos ? JSON.parse(dadosGastos) : [];
        
        return {
            transacoes: parsedFluxo.transacoes || [],
            categorias: parsedFluxo.categorias || CATEGORIAS_PADRAO,
            recorrentes,
            dividas,
            cartoes,
            gastosCartao
        };
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        return {
            transacoes: [],
            categorias: CATEGORIAS_PADRAO,
            recorrentes: [],
            dividas: [],
            cartoes: [],
            gastosCartao: []
        };
    }
};

// Salvar dados no localStorage
const salvarDados = (state: FluxoCaixaState) => {
    try {
        // Transações e categorias
        localStorage.setItem(STORAGE_KEYS.TRANSACOES, JSON.stringify({
            transacoes: state.transacoes,
            categorias: state.categorias
        }));
        
        // Recorrentes
        localStorage.setItem(STORAGE_KEYS.RECORRENTES, JSON.stringify(state.recorrentes));
        
        // Dívidas
        localStorage.setItem(STORAGE_KEYS.DIVIDAS, JSON.stringify(state.dividas));
        
        // Cartões
        localStorage.setItem(STORAGE_KEYS.CARTOES, JSON.stringify(state.cartoes));
        
        // Gastos de cartão
        localStorage.setItem(STORAGE_KEYS.GASTOS_CARTAO, JSON.stringify(state.gastosCartao));
        
        // Disparar evento customizado para sincronizar outras abas
        window.dispatchEvent(new CustomEvent('fluxocaixa-updated', { detail: state }));
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
    }
};

// ============================================================================
// REDUCER
// ============================================================================

const initialState: FluxoCaixaState = {
    transacoes: [],
    categorias: CATEGORIAS_PADRAO,
    recorrentes: [],
    dividas: [],
    cartoes: [],
    gastosCartao: [],
    filtros: FILTROS_PADRAO,
    carregado: false
};

function fluxoCaixaReducer(state: FluxoCaixaState, action: FluxoCaixaAction): FluxoCaixaState {
    switch (action.type) {
        case 'CARREGAR_DADOS':
            return {
                ...state,
                ...action.payload,
                carregado: true
            };
            
        // TRANSAÇÕES
        case 'ADICIONAR_TRANSACAO':
            return {
                ...state,
                transacoes: [action.payload, ...state.transacoes]
            };
            
        case 'EDITAR_TRANSACAO':
            return {
                ...state,
                transacoes: state.transacoes.map(t =>
                    t.id === action.payload.id
                        ? { ...t, ...action.payload.dados, atualizadoEm: getDataAtual() }
                        : t
                )
            };
            
        case 'EXCLUIR_TRANSACAO':
            return {
                ...state,
                transacoes: state.transacoes.filter(t => t.id !== action.payload)
            };
            
        // RECORRENTES
        case 'ADICIONAR_RECORRENTE':
            return {
                ...state,
                recorrentes: [...state.recorrentes, action.payload]
            };
            
        case 'EDITAR_RECORRENTE':
            return {
                ...state,
                recorrentes: state.recorrentes.map(r =>
                    r.id === action.payload.id
                        ? { ...r, ...action.payload.dados }
                        : r
                )
            };
            
        case 'EXCLUIR_RECORRENTE':
            return {
                ...state,
                recorrentes: state.recorrentes.filter(r => r.id !== action.payload)
            };
            
        case 'TOGGLE_RECORRENTE':
            return {
                ...state,
                recorrentes: state.recorrentes.map(r =>
                    r.id === action.payload ? { ...r, ativa: !r.ativa } : r
                )
            };
            
        // DÍVIDAS
        case 'ADICIONAR_DIVIDA':
            return {
                ...state,
                dividas: [...state.dividas, action.payload]
            };
            
        case 'EDITAR_DIVIDA':
            return {
                ...state,
                dividas: state.dividas.map(d =>
                    d.id === action.payload.id
                        ? { ...d, ...action.payload.dados }
                        : d
                )
            };
            
        case 'EXCLUIR_DIVIDA':
            return {
                ...state,
                dividas: state.dividas.filter(d => d.id !== action.payload)
            };
            
        // CARTÕES
        case 'ADICIONAR_CARTAO':
            return {
                ...state,
                cartoes: [...state.cartoes, action.payload]
            };
            
        case 'EDITAR_CARTAO':
            return {
                ...state,
                cartoes: state.cartoes.map(c =>
                    c.id === action.payload.id
                        ? { ...c, ...action.payload.dados }
                        : c
                )
            };
            
        case 'EXCLUIR_CARTAO':
            return {
                ...state,
                cartoes: state.cartoes.filter(c => c.id !== action.payload)
            };
            
        case 'ADICIONAR_GASTO_CARTAO':
            return {
                ...state,
                gastosCartao: [...state.gastosCartao, action.payload]
            };
            
        case 'EXCLUIR_GASTO_CARTAO':
            return {
                ...state,
                gastosCartao: state.gastosCartao.filter(g => g.id !== action.payload)
            };
            
        // CATEGORIAS
        case 'ADICIONAR_CATEGORIA':
            return {
                ...state,
                categorias: [...state.categorias, action.payload]
            };
            
        case 'EXCLUIR_CATEGORIA':
            return {
                ...state,
                categorias: state.categorias.filter(c => c.id !== action.payload)
            };
            
        // FILTROS
        case 'ATUALIZAR_FILTROS':
            return {
                ...state,
                filtros: { ...state.filtros, ...action.payload }
            };
            
        case 'LIMPAR_FILTROS':
            return {
                ...state,
                filtros: FILTROS_PADRAO
            };
            
        default:
            return state;
    }
}

// ============================================================================
// CONTEXT
// ============================================================================

const FluxoCaixaContext = createContext<FluxoCaixaContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

export function FluxoCaixaProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(fluxoCaixaReducer, initialState);
    
    // Carregar dados iniciais
    useEffect(() => {
        const dados = carregarDados();
        dispatch({ type: 'CARREGAR_DADOS', payload: dados });
    }, []);
    
    // Salvar sempre que houver mudanças
    useEffect(() => {
        if (state.carregado) {
            salvarDados(state);
        }
    }, [state]);
    
    // Listener para sincronizar entre abas
    useEffect(() => {
        const handleStorageChange = () => {
            const dados = carregarDados();
            dispatch({ type: 'CARREGAR_DADOS', payload: dados });
        };
        
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('fluxocaixa-updated', handleStorageChange as EventListener);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('fluxocaixa-updated', handleStorageChange as EventListener);
        };
    }, []);
    
    // ========================================================================
    // ACTIONS - TRANSAÇÕES
    // ========================================================================
    
    const adicionarTransacao = useCallback((nova: NovaTransacao): Transacao => {
        const transacao: Transacao = {
            id: gerarId(),
            ...nova,
            criadoEm: getDataAtual(),
            atualizadoEm: getDataAtual()
        };
        dispatch({ type: 'ADICIONAR_TRANSACAO', payload: transacao });
        return transacao;
    }, []);
    
    const editarTransacao = useCallback((id: string, dados: Partial<NovaTransacao>) => {
        dispatch({ type: 'EDITAR_TRANSACAO', payload: { id, dados } });
    }, []);
    
    const excluirTransacao = useCallback((id: string) => {
        dispatch({ type: 'EXCLUIR_TRANSACAO', payload: id });
    }, []);
    
    // ========================================================================
    // ACTIONS - RECORRENTES
    // ========================================================================
    
    const adicionarRecorrente = useCallback((nova: NovaTransacaoRecorrente): TransacaoRecorrente => {
        const recorrente: TransacaoRecorrente = {
            ...nova,
            id: gerarId(),
            proximaData: nova.dataInicio,
            ativa: nova.ativa ?? true,
            criadoEm: getDataAtual()
        };
        dispatch({ type: 'ADICIONAR_RECORRENTE', payload: recorrente });
        return recorrente;
    }, []);
    
    const editarRecorrente = useCallback((id: string, dados: Partial<TransacaoRecorrente>) => {
        dispatch({ type: 'EDITAR_RECORRENTE', payload: { id, dados } });
    }, []);
    
    const excluirRecorrente = useCallback((id: string) => {
        dispatch({ type: 'EXCLUIR_RECORRENTE', payload: id });
    }, []);
    
    const toggleRecorrente = useCallback((id: string) => {
        dispatch({ type: 'TOGGLE_RECORRENTE', payload: id });
    }, []);
    
    // ========================================================================
    // ACTIONS - DÍVIDAS
    // ========================================================================
    
    const adicionarDivida = useCallback((nova: NovaDivida): Divida => {
        const divida: Divida = {
            ...nova,
            id: gerarId(),
            pago: false,
            criadoEm: getDataAtual(),
            atualizadoEm: getDataAtual()
        };
        dispatch({ type: 'ADICIONAR_DIVIDA', payload: divida });
        return divida;
    }, []);
    
    const editarDivida = useCallback((id: string, dados: Partial<Divida>) => {
        dispatch({ type: 'EDITAR_DIVIDA', payload: { id, dados } });
    }, []);
    
    const excluirDivida = useCallback((id: string) => {
        dispatch({ type: 'EXCLUIR_DIVIDA', payload: id });
    }, []);
    
    // ========================================================================
    // ACTIONS - CARTÕES
    // ========================================================================
    
    const adicionarCartao = useCallback((novo: NovoCartaoCredito): CartaoCredito => {
        const cartao: CartaoCredito = {
            ...novo,
            id: gerarId(),
            ativo: true,
            criadoEm: getDataAtual()
        };
        dispatch({ type: 'ADICIONAR_CARTAO', payload: cartao });
        return cartao;
    }, []);
    
    const editarCartao = useCallback((id: string, dados: Partial<CartaoCredito>) => {
        dispatch({ type: 'EDITAR_CARTAO', payload: { id, dados } });
    }, []);
    
    const excluirCartao = useCallback((id: string) => {
        dispatch({ type: 'EXCLUIR_CARTAO', payload: id });
    }, []);
    
    const adicionarGastoCartao = useCallback((novo: NovoGastoCartao): GastoCartao => {
        const gasto: GastoCartao = {
            ...novo,
            id: gerarId(),
            valorParcela: novo.valor / novo.parcelas,
            parcelaAtual: 1,
            criadoEm: getDataAtual()
        };
        dispatch({ type: 'ADICIONAR_GASTO_CARTAO', payload: gasto });
        return gasto;
    }, []);
    
    const excluirGastoCartao = useCallback((id: string) => {
        dispatch({ type: 'EXCLUIR_GASTO_CARTAO', payload: id });
    }, []);
    
    // ========================================================================
    // ACTIONS - CATEGORIAS
    // ========================================================================
    
    const adicionarCategoria = useCallback((categoria: Omit<CategoriaFluxo, 'id'>): CategoriaFluxo => {
        const novaCategoria: CategoriaFluxo = {
            id: gerarId(),
            ...categoria
        };
        dispatch({ type: 'ADICIONAR_CATEGORIA', payload: novaCategoria });
        return novaCategoria;
    }, []);
    
    const excluirCategoria = useCallback((id: string) => {
        if (CATEGORIAS_PADRAO.some(c => c.id === id)) return;
        dispatch({ type: 'EXCLUIR_CATEGORIA', payload: id });
    }, []);
    
    const obterCategoria = useCallback((id: string): CategoriaFluxo | undefined => {
        return state.categorias.find(c => c.id === id);
    }, [state.categorias]);
    
    // ========================================================================
    // ACTIONS - FILTROS
    // ========================================================================
    
    const atualizarFiltros = useCallback((filtros: Partial<FiltrosFluxo>) => {
        dispatch({ type: 'ATUALIZAR_FILTROS', payload: filtros });
    }, []);
    
    const limparFiltros = useCallback(() => {
        dispatch({ type: 'LIMPAR_FILTROS' });
    }, []);
    
    // ========================================================================
    // FORÇAR ATUALIZAÇÃO
    // ========================================================================
    
    const forcarAtualizacao = useCallback(() => {
        const dados = carregarDados();
        dispatch({ type: 'CARREGAR_DADOS', payload: dados });
    }, []);
    
    // ========================================================================
    // CONTEXT VALUE
    // ========================================================================
    
    const value = useMemo<FluxoCaixaContextType>(() => ({
        ...state,
        adicionarTransacao,
        editarTransacao,
        excluirTransacao,
        adicionarRecorrente,
        editarRecorrente,
        excluirRecorrente,
        toggleRecorrente,
        adicionarDivida,
        editarDivida,
        excluirDivida,
        adicionarCartao,
        editarCartao,
        excluirCartao,
        adicionarGastoCartao,
        excluirGastoCartao,
        adicionarCategoria,
        excluirCategoria,
        obterCategoria,
        atualizarFiltros,
        limparFiltros,
        forcarAtualizacao
    }), [
        state,
        adicionarTransacao,
        editarTransacao,
        excluirTransacao,
        adicionarRecorrente,
        editarRecorrente,
        excluirRecorrente,
        toggleRecorrente,
        adicionarDivida,
        editarDivida,
        excluirDivida,
        adicionarCartao,
        editarCartao,
        excluirCartao,
        adicionarGastoCartao,
        excluirGastoCartao,
        adicionarCategoria,
        excluirCategoria,
        obterCategoria,
        atualizarFiltros,
        limparFiltros,
        forcarAtualizacao
    ]);
    
    return (
        <FluxoCaixaContext.Provider value={value}>
            {children}
        </FluxoCaixaContext.Provider>
    );
}

// ============================================================================
// HOOK
// ============================================================================

export function useFluxoCaixaContext() {
    const context = useContext(FluxoCaixaContext);
    if (!context) {
        throw new Error('useFluxoCaixaContext deve ser usado dentro de FluxoCaixaProvider');
    }
    return context;
}
