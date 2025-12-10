/**
 * Tipos do Dashboard Financeiro
 */

export interface IndicadorFinanceiro {
  titulo: string;
  valor: number;
  variacao?: number; // Percentual de variação
  icone: string;
  cor: string;
  tipo: 'receita' | 'despesa' | 'saldo' | 'meta' | 'info';
}

export interface BalancoDiario {
  dia: number;
  data: string;
  receitas: number;
  despesas: number;
  saldo: number;
  saldoAcumulado: number;
}

export interface DistribuicaoCategoria {
  categoriaId: string;
  categoriaNome: string;
  categoriaIcone: string;
  categoriaCor: string;
  valor: number;
  percentual: number;
  quantidade: number;
}

export interface ReceitasVsDespesas {
  mes: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

export interface InsightFinanceiro {
  id: string;
  tipo: 'alerta' | 'sucesso' | 'info' | 'atencao';
  titulo: string;
  descricao: string;
  icone: string;
  cor: string;
}

export interface DespesasPorTipo {
  fixas: number;
  variaveis: number;
  percentualFixas: number;
  percentualVariaveis: number;
}

export interface MetaMensal {
  valor: number;
  atingido: number;
  percentual: number;
  faltam: number;
}

export interface DadosDashboard {
  // Indicadores principais
  receitasDoMes: number;
  despesasDoMes: number;
  saldoPrevisto: number;
  saldoReal: number;
  mediaDiariaGastos: number;
  
  // Despesas
  despesasPorTipo: DespesasPorTipo;
  
  // Gráficos
  balancoPorDia: BalancoDiario[];
  distribuicaoPorCategoria: DistribuicaoCategoria[];
  receitasVsDespesas: ReceitasVsDespesas[];
  
  // Insights
  insights: InsightFinanceiro[];
  
  // Meta
  meta?: MetaMensal;
  
  // Transações agrupadas
  transacoesAgrupadas: any[];
}
