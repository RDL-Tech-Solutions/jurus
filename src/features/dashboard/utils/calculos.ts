/**
 * Funções de cálculo para o dashboard
 */

import { Transacao, CategoriaFluxo } from '../../../types/fluxoCaixa';
import { BalancoDiario, DistribuicaoCategoria, DespesasPorTipo } from '../types';

/**
 * Calcula o balanço diário do mês
 */
export function calcularBalancoDiario(
  transacoes: Transacao[],
  mes: number,
  ano: number
): BalancoDiario[] {
  const diasNoMes = new Date(ano, mes, 0).getDate();
  const balanco: BalancoDiario[] = [];
  
  let saldoAcumulado = 0;
  
  for (let dia = 1; dia <= diasNoMes; dia++) {
    const dataStr = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    
    // Filtra transações do dia
    const transacoesDia = transacoes.filter(t => {
      const dataTransacao = new Date(t.data);
      return (
        dataTransacao.getFullYear() === ano &&
        dataTransacao.getMonth() + 1 === mes &&
        dataTransacao.getDate() === dia
      );
    });
    
    const receitas = transacoesDia
      .filter(t => t.tipo === 'entrada')
      .reduce((sum, t) => sum + t.valor, 0);
    
    const despesas = transacoesDia
      .filter(t => t.tipo === 'saida')
      .reduce((sum, t) => sum + t.valor, 0);
    
    const saldo = receitas - despesas;
    saldoAcumulado += saldo;
    
    balanco.push({
      dia,
      data: dataStr,
      receitas,
      despesas,
      saldo,
      saldoAcumulado
    });
  }
  
  return balanco;
}

/**
 * Calcula distribuição por categoria
 */
export function calcularDistribuicaoPorCategoria(
  transacoes: Transacao[],
  categorias: CategoriaFluxo[],
  tipo: 'entrada' | 'saida' = 'saida'
): DistribuicaoCategoria[] {
  const transacoesFiltradas = transacoes.filter(t => t.tipo === tipo);
  const totalGeral = transacoesFiltradas.reduce((sum, t) => sum + t.valor, 0);
  
  // Agrupa por categoria
  const porCategoria = new Map<string, { valor: number; quantidade: number }>();
  
  transacoesFiltradas.forEach(t => {
    const atual = porCategoria.get(t.categoriaId) || { valor: 0, quantidade: 0 };
    porCategoria.set(t.categoriaId, {
      valor: atual.valor + t.valor,
      quantidade: atual.quantidade + 1
    });
  });
  
  // Converte para array e adiciona informações da categoria
  const distribuicao: DistribuicaoCategoria[] = [];
  
  porCategoria.forEach((dados, categoriaId) => {
    const categoria = categorias.find(c => c.id === categoriaId);
    if (categoria) {
      distribuicao.push({
        categoriaId,
        categoriaNome: categoria.nome,
        categoriaIcone: categoria.icone,
        categoriaCor: categoria.cor,
        valor: dados.valor,
        percentual: totalGeral > 0 ? (dados.valor / totalGeral) * 100 : 0,
        quantidade: dados.quantidade
      });
    }
  });
  
  // Ordena por valor decrescente
  return distribuicao.sort((a, b) => b.valor - a.valor);
}

/**
 * Calcula despesas fixas vs variáveis
 * Considera fixas: moradia, contas, transporte (categorias recorrentes)
 */
export function calcularDespesasPorTipo(
  transacoes: Transacao[]
): DespesasPorTipo {
  const despesas = transacoes.filter(t => t.tipo === 'saida');
  const totalDespesas = despesas.reduce((sum, t) => sum + t.valor, 0);
  
  // Categorias consideradas fixas
  const categoriasFixas = ['moradia', 'contas', 'saude', 'educacao'];
  
  const fixas = despesas
    .filter(t => categoriasFixas.includes(t.categoriaId))
    .reduce((sum, t) => sum + t.valor, 0);
  
  const variaveis = totalDespesas - fixas;
  
  return {
    fixas,
    variaveis,
    percentualFixas: totalDespesas > 0 ? (fixas / totalDespesas) * 100 : 0,
    percentualVariaveis: totalDespesas > 0 ? (variaveis / totalDespesas) * 100 : 0
  };
}

/**
 * Calcula média diária de gastos
 */
export function calcularMediaDiariaGastos(
  transacoes: Transacao[],
  mes: number,
  ano: number
): number {
  const hoje = new Date();
  const diaAtual = hoje.getFullYear() === ano && hoje.getMonth() + 1 === mes
    ? hoje.getDate()
    : new Date(ano, mes, 0).getDate();
  
  const despesas = transacoes
    .filter(t => t.tipo === 'saida')
    .reduce((sum, t) => sum + t.valor, 0);
  
  return diaAtual > 0 ? despesas / diaAtual : 0;
}

/**
 * Calcula saldo real (até hoje)
 */
export function calcularSaldoReal(
  transacoes: Transacao[],
  mes: number,
  ano: number
): number {
  const hoje = new Date();
  const ehMesAtual = hoje.getFullYear() === ano && hoje.getMonth() + 1 === mes;
  
  if (!ehMesAtual) {
    // Se não é o mês atual, retorna o saldo total do mês
    const receitas = transacoes
      .filter(t => t.tipo === 'entrada')
      .reduce((sum, t) => sum + t.valor, 0);
    const despesas = transacoes
      .filter(t => t.tipo === 'saida')
      .reduce((sum, t) => sum + t.valor, 0);
    return receitas - despesas;
  }
  
  // Filtra apenas transações até hoje
  const transacoesAteHoje = transacoes.filter(t => {
    const dataTransacao = new Date(t.data);
    return dataTransacao <= hoje;
  });
  
  const receitas = transacoesAteHoje
    .filter(t => t.tipo === 'entrada')
    .reduce((sum, t) => sum + t.valor, 0);
  const despesas = transacoesAteHoje
    .filter(t => t.tipo === 'saida')
    .reduce((sum, t) => sum + t.valor, 0);
  
  return receitas - despesas;
}

/**
 * Formata valor para exibição
 */
export function formatarValorDashboard(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

/**
 * Formata percentual
 */
export function formatarPercentual(valor: number): string {
  return `${valor >= 0 ? '+' : ''}${valor.toFixed(1)}%`;
}
