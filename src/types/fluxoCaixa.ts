// Tipos para o módulo de Fluxo de Caixa

export type TipoTransacao = 'entrada' | 'saida';

export type RecorrenciaTransacao = 'diaria' | 'semanal' | 'mensal' | 'anual';

export type PeriodoFiltro = 'hoje' | 'semana' | 'mes' | 'ano' | 'personalizado';

export interface CategoriaFluxo {
    id: string;
    nome: string;
    icone: string;
    cor: string;
    tipo: TipoTransacao;
}

export interface Transacao {
    id: string;
    descricao: string;
    valor: number;
    tipo: TipoTransacao;
    categoriaId: string;
    data: string; // ISO string para facilitar serialização
    observacoes?: string;
    recorrente?: boolean;
    recorrencia?: RecorrenciaTransacao;
    criadoEm: string;
    atualizadoEm: string;
}

export interface FiltrosFluxo {
    periodo: PeriodoFiltro;
    dataInicio?: string;
    dataFim?: string;
    tipo: 'todos' | TipoTransacao;
    categoriaId?: string;
    busca?: string;
}

export interface EstatisticasFluxo {
    totalEntradas: number;
    totalSaidas: number;
    saldo: number;
    variacaoEntradas: number; // % comparado ao período anterior
    variacaoSaidas: number;
    variacaoSaldo: number;
    maiorEntrada?: Transacao;
    maiorSaida?: Transacao;
    categoriaMaisGastos?: {
        categoria: CategoriaFluxo;
        total: number;
        percentual: number;
    };
    mediaDiariaGastos: number;
    projecaoFimMes: number;
    transacoesPorCategoria: {
        categoria: CategoriaFluxo;
        total: number;
        percentual: number;
        tipo: TipoTransacao;
    }[];
    evolucaoSaldo: {
        data: string;
        saldo: number;
        entradas: number;
        saidas: number;
    }[];
}

export interface NovaTransacao {
    descricao: string;
    valor: number;
    tipo: TipoTransacao;
    categoriaId: string;
    data: string;
    observacoes?: string;
    recorrente?: boolean;
    recorrencia?: RecorrenciaTransacao;
}

export interface FluxoCaixaState {
    transacoes: Transacao[];
    categorias: CategoriaFluxo[];
    filtros: FiltrosFluxo;
}

// Categorias padrão
export const CATEGORIAS_PADRAO: CategoriaFluxo[] = [
    // Entradas
    { id: 'salario', nome: 'Salário', icone: '💰', cor: '#10b981', tipo: 'entrada' },
    { id: 'freelance', nome: 'Freelance', icone: '💼', cor: '#34d399', tipo: 'entrada' },
    { id: 'investimentos', nome: 'Investimentos', icone: '📈', cor: '#3b82f6', tipo: 'entrada' },
    { id: 'vendas', nome: 'Vendas', icone: '🛒', cor: '#14b8a6', tipo: 'entrada' },
    { id: 'outros_entrada', nome: 'Outros Recebimentos', icone: '➕', cor: '#6b7280', tipo: 'entrada' },

    // Saídas
    { id: 'moradia', nome: 'Moradia', icone: '🏠', cor: '#ef4444', tipo: 'saida' },
    { id: 'alimentacao', nome: 'Alimentação', icone: '🍽️', cor: '#f97316', tipo: 'saida' },
    { id: 'transporte', nome: 'Transporte', icone: '🚗', cor: '#eab308', tipo: 'saida' },
    { id: 'saude', nome: 'Saúde', icone: '🏥', cor: '#ec4899', tipo: 'saida' },
    { id: 'educacao', nome: 'Educação', icone: '📚', cor: '#8b5cf6', tipo: 'saida' },
    { id: 'lazer', nome: 'Lazer', icone: '🎉', cor: '#d946ef', tipo: 'saida' },
    { id: 'compras', nome: 'Compras', icone: '🛍️', cor: '#06b6d4', tipo: 'saida' },
    { id: 'contas', nome: 'Contas', icone: '📄', cor: '#64748b', tipo: 'saida' },
    { id: 'outros_saida', nome: 'Outros Gastos', icone: '➖', cor: '#475569', tipo: 'saida' }
];

// Filtros padrão
export const FILTROS_PADRAO: FiltrosFluxo = {
    periodo: 'mes',
    tipo: 'todos'
};

// ==========================================
// TIPOS PARA METAS DE GASTOS
// ==========================================

export interface MetaGasto {
    id: string;
    categoriaId: string;
    limite: number;
    mes: number;
    ano: number;
    alertar80: boolean; // Alertar ao atingir 80%
    alertar100: boolean; // Alertar ao ultrapassar
    criadoEm: string;
}

// ==========================================
// TIPOS PARA TRANSAÇÕES RECORRENTES
// ==========================================

export interface TransacaoRecorrente {
    id: string;
    descricao: string;
    valor: number;
    tipo: TipoTransacao;
    categoriaId: string;
    frequencia: RecorrenciaTransacao;
    diaDoMes?: number; // Para mensal (1-31)
    diaDaSemana?: number; // Para semanal (0-6, domingo=0)
    proximaData: string;
    ativa: boolean;
    dataInicio: string;
    dataFim?: string;
    observacoes?: string;
    criadoEm: string;
}

export interface NovaTransacaoRecorrente {
    descricao: string;
    valor: number;
    tipo: TipoTransacao;
    categoriaId: string;
    frequencia: RecorrenciaTransacao;
    diaDoMes?: number;
    diaDaSemana?: number;
    dataInicio: string;
    dataFim?: string;
    observacoes?: string;
}

// ==========================================
// TIPOS PARA DASHBOARD PERSONALIZÁVEL
// ==========================================

export interface DashboardConfig {
    insights: {
        tendencia: boolean;
        mediaDiaria: boolean;
        comparativo: boolean;
    };
    analytics: {
        runway: boolean;
        breakEven: boolean;
        maiorGasto: boolean;
        alertas: boolean;
        topCategorias: boolean;
    };
    graficos: {
        barrasComparativo: boolean;
        pizza: boolean;
        evolucao: boolean;
    };
}

export const DASHBOARD_CONFIG_PADRAO: DashboardConfig = {
    insights: {
        tendencia: true,
        mediaDiaria: true,
        comparativo: true
    },
    analytics: {
        runway: true,
        breakEven: true,
        maiorGasto: true,
        alertas: true,
        topCategorias: true
    },
    graficos: {
        barrasComparativo: true,
        pizza: true,
        evolucao: true
    }
};

// ==========================================
// TIPOS PARA CLASSIFICAÇÃO 50/30/20
// ==========================================

export type Classificacao5030 = 'necessidades' | 'desejos' | 'poupanca';

export interface Classificacao5030Config {
    categoriaId: string;
    classificacao: Classificacao5030;
}

// Classificação padrão das categorias
export const CLASSIFICACAO_CATEGORIAS_PADRAO: Classificacao5030Config[] = [
    // Necessidades (50%)
    { categoriaId: 'moradia', classificacao: 'necessidades' },
    { categoriaId: 'alimentacao', classificacao: 'necessidades' },
    { categoriaId: 'transporte', classificacao: 'necessidades' },
    { categoriaId: 'saude', classificacao: 'necessidades' },
    { categoriaId: 'educacao', classificacao: 'necessidades' },
    { categoriaId: 'contas', classificacao: 'necessidades' },

    // Desejos (30%)
    { categoriaId: 'lazer', classificacao: 'desejos' },
    { categoriaId: 'compras', classificacao: 'desejos' },
    { categoriaId: 'outros_saida', classificacao: 'desejos' },

    // Poupança (20%) - entradas não contam, são receitas
    { categoriaId: 'investimentos', classificacao: 'poupanca' }
];

// ==========================================
// TIPOS PARA COMPARATIVO MENSAL
// ==========================================

export interface ComparativoMensal {
    mesAtual: {
        mes: number;
        ano: number;
        entradas: number;
        saidas: number;
        saldo: number;
        porCategoria: { categoriaId: string; total: number }[];
    };
    mesAnterior: {
        mes: number;
        ano: number;
        entradas: number;
        saidas: number;
        saldo: number;
        porCategoria: { categoriaId: string; total: number }[];
    };
    variacaoEntradas: number;
    variacaoSaidas: number;
    variacaoSaldo: number;
}
// ==========================================
// TIPOS PARA LISTA DE DÍVIDAS
// ==========================================

export interface Divida {
    id: string;
    descricao: string;
    valor: number;
    credor: string;
    dataVencimento?: string;
    pago: boolean;
    dataPagamento?: string;
    observacoes?: string;
    // Campos de parcelamento
    numeroParcelas?: number;
    parcelaAtual?: number;
    dividaPaiId?: string; // Para vincular parcelas à dívida original
    criadoEm: string;
    atualizadoEm: string;
}

export interface NovaDivida {
    descricao: string;
    valor: number;
    credor: string;
    dataVencimento?: string;
    observacoes?: string;
    // Campos de parcelamento
    numeroParcelas?: number;
}

// ==========================================
// TIPOS PARA CARTÃO DE CRÉDITO
// ==========================================

export interface CartaoCredito {
    id: string;
    nome: string;
    bandeira: 'visa' | 'mastercard' | 'elo' | 'amex' | 'hipercard' | 'outro';
    limite: number;
    diaFechamento: number;
    diaVencimento: number;
    cor: string;
    ativo: boolean;
    criadoEm: string;
}

export interface NovoCartao {
    nome: string;
    bandeira: CartaoCredito['bandeira'];
    limite: number;
    diaFechamento: number;
    diaVencimento: number;
    cor: string;
}

export interface GastoCartao {
    id: string;
    cartaoId: string;
    descricao: string;
    valor: number;
    valorParcela: number;
    parcelas: number;
    parcelaAtual: number;
    data: string;
    categoriaId: string;
    observacoes?: string;
    criadoEm: string;
}

export interface NovoGastoCartao {
    cartaoId: string;
    descricao: string;
    valor: number;
    parcelas: number;
    data: string;
    categoriaId: string;
    observacoes?: string;
}

export interface Fatura {
    cartaoId: string;
    mes: number;
    ano: number;
    gastos: GastoCartao[];
    total: number;
    paga: boolean;
    dataPagamento?: string;
    dataFechamento: string;
    dataVencimento: string;
}

// Cores padrão para cartões
export const CORES_CARTAO = [
    { nome: 'Roxo', cor: '#8b5cf6' },
    { nome: 'Laranja', cor: '#f97316' },
    { nome: 'Verde', cor: '#10b981' },
    { nome: 'Azul', cor: '#3b82f6' },
    { nome: 'Rosa', cor: '#ec4899' },
    { nome: 'Vermelho', cor: '#ef4444' },
    { nome: 'Amarelo', cor: '#eab308' },
    { nome: 'Ciano', cor: '#06b6d4' }
];

// Bandeiras de cartão
export const BANDEIRAS_CARTAO = [
    { id: 'visa', nome: 'Visa', icone: '💳' },
    { id: 'mastercard', nome: 'Mastercard', icone: '💳' },
    { id: 'elo', nome: 'Elo', icone: '💳' },
    { id: 'amex', nome: 'American Express', icone: '💳' },
    { id: 'hipercard', nome: 'Hipercard', icone: '💳' },
    { id: 'outro', nome: 'Outro', icone: '💳' }
];
