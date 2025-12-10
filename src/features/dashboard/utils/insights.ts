/**
 * Gerador de insights financeiros inteligentes
 */

import { Transacao, CategoriaFluxo } from '../../../types/fluxoCaixa';
import { InsightFinanceiro, DespesasPorTipo } from '../types';
import { formatarValorDashboard } from './calculos';

/**
 * Gera insights automáticos baseados nos dados financeiros
 */
export function gerarInsights(
  transacoes: Transacao[],
  categorias: CategoriaFluxo[],
  despesasPorTipo: DespesasPorTipo,
  saldoPrevisto: number,
  mediaDiariaGastos: number,
  mes: number,
  ano: number
): InsightFinanceiro[] {
  const insights: InsightFinanceiro[] = [];
  
  // 1. Categoria com maior gasto
  const categoriaMaiorGasto = encontrarCategoriaMaiorGasto(transacoes, categorias);
  if (categoriaMaiorGasto) {
    insights.push({
      id: 'maior-gasto',
      tipo: 'info',
      titulo: 'Maior Gasto',
      descricao: `Você gastou mais em ${categoriaMaiorGasto.nome} este mês (${formatarValorDashboard(categoriaMaiorGasto.valor)})`,
      icone: '📊',
      cor: 'blue'
    });
  }
  
  // 2. Despesas fixas
  if (despesasPorTipo.percentualFixas > 60) {
    insights.push({
      id: 'despesas-fixas',
      tipo: 'atencao',
      titulo: 'Despesas Fixas Altas',
      descricao: `Suas despesas fixas representam ${despesasPorTipo.percentualFixas.toFixed(0)}% dos seus gastos`,
      icone: '⚠️',
      cor: 'orange'
    });
  }
  
  // 3. Projeção de fim de mês
  const diasNoMes = new Date(ano, mes, 0).getDate();
  const hoje = new Date();
  const diaAtual = hoje.getFullYear() === ano && hoje.getMonth() + 1 === mes
    ? hoje.getDate()
    : diasNoMes;
  const diasRestantes = diasNoMes - diaAtual;
  
  if (diasRestantes > 0) {
    const projecaoGastos = mediaDiariaGastos * diasRestantes;
    const saldoProjetado = saldoPrevisto - projecaoGastos;
    
    if (saldoProjetado < 0) {
      insights.push({
        id: 'projecao-negativa',
        tipo: 'alerta',
        titulo: 'Atenção ao Saldo',
        descricao: `Se continuar nesse ritmo, pode fechar o mês com saldo negativo de ${formatarValorDashboard(Math.abs(saldoProjetado))}`,
        icone: '🚨',
        cor: 'red'
      });
    } else if (saldoProjetado > 0) {
      insights.push({
        id: 'projecao-positiva',
        tipo: 'sucesso',
        titulo: 'Projeção Positiva',
        descricao: `Mantendo esse ritmo, você pode fechar o mês com ${formatarValorDashboard(saldoProjetado)} de saldo`,
        icone: '✅',
        cor: 'green'
      });
    }
  }
  
  // 4. Economia comparada ao mês anterior (simulado)
  // TODO: Implementar comparação real quando houver dados históricos
  
  // 5. Receitas vs Despesas
  const receitas = transacoes
    .filter(t => t.tipo === 'entrada')
    .reduce((sum, t) => sum + t.valor, 0);
  const despesas = transacoes
    .filter(t => t.tipo === 'saida')
    .reduce((sum, t) => sum + t.valor, 0);
  
  if (receitas > despesas) {
    const economia = receitas - despesas;
    insights.push({
      id: 'economia',
      tipo: 'sucesso',
      titulo: 'Parabéns!',
      descricao: `Você está economizando ${formatarValorDashboard(economia)} este mês`,
      icone: '💰',
      cor: 'green'
    });
  }
  
  // 6. Média diária
  if (mediaDiariaGastos > 0) {
    insights.push({
      id: 'media-diaria',
      tipo: 'info',
      titulo: 'Média Diária',
      descricao: `Você está gastando em média ${formatarValorDashboard(mediaDiariaGastos)} por dia`,
      icone: '📅',
      cor: 'blue'
    });
  }
  
  // 7. Alerta de gastos excessivos
  if (despesas > receitas * 0.9) {
    insights.push({
      id: 'gastos-altos',
      tipo: 'atencao',
      titulo: 'Gastos Elevados',
      descricao: 'Suas despesas estão próximas das suas receitas. Considere reduzir gastos variáveis',
      icone: '⚡',
      cor: 'orange'
    });
  }
  
  return insights;
}

/**
 * Encontra a categoria com maior gasto
 */
function encontrarCategoriaMaiorGasto(
  transacoes: Transacao[],
  categorias: CategoriaFluxo[]
): { nome: string; valor: number } | null {
  const despesas = transacoes.filter(t => t.tipo === 'saida');
  
  const porCategoria = new Map<string, number>();
  despesas.forEach(t => {
    const atual = porCategoria.get(t.categoriaId) || 0;
    porCategoria.set(t.categoriaId, atual + t.valor);
  });
  
  let maiorCategoria: { id: string; valor: number } | null = null;
  porCategoria.forEach((valor, id) => {
    if (!maiorCategoria || valor > maiorCategoria.valor) {
      maiorCategoria = { id, valor };
    }
  });
  
  if (maiorCategoria) {
    const categoria = categorias.find(c => c.id === maiorCategoria!.id);
    if (categoria) {
      return { nome: categoria.nome, valor: maiorCategoria.valor };
    }
  }
  
  return null;
}
