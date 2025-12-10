/**
 * Hook principal do Dashboard Financeiro
 * Centraliza todos os cálculos e dados do dashboard
 */

import { useMemo } from 'react';
import { useTransacoes } from '../../transacoes';
import { DadosDashboard, ReceitasVsDespesas } from '../types';
import {
  calcularBalancoDiario,
  calcularDistribuicaoPorCategoria,
  calcularDespesasPorTipo,
  calcularMediaDiariaGastos,
  calcularSaldoReal
} from '../utils/calculos';
import { gerarInsights } from '../utils/insights';

export function useDashboard() {
  const {
    transacoes,
    transacoesAgrupadasPorDia,
    categorias,
    somaReceitas,
    somaDespesas,
    saldoDoMes,
    mesSelecionado,
    anoSelecionado
  } = useTransacoes();
  
  // Cálculo de despesas por tipo
  const despesasPorTipo = useMemo(() => {
    return calcularDespesasPorTipo(transacoes);
  }, [transacoes]);
  
  // Balanço diário
  const balancoPorDia = useMemo(() => {
    return calcularBalancoDiario(transacoes, mesSelecionado, anoSelecionado);
  }, [transacoes, mesSelecionado, anoSelecionado]);
  
  // Distribuição por categoria
  const distribuicaoPorCategoria = useMemo(() => {
    return calcularDistribuicaoPorCategoria(transacoes, categorias, 'saida');
  }, [transacoes, categorias]);
  
  // Média diária de gastos
  const mediaDiariaGastos = useMemo(() => {
    return calcularMediaDiariaGastos(transacoes, mesSelecionado, anoSelecionado);
  }, [transacoes, mesSelecionado, anoSelecionado]);
  
  // Saldo real (até hoje)
  const saldoReal = useMemo(() => {
    return calcularSaldoReal(transacoes, mesSelecionado, anoSelecionado);
  }, [transacoes, mesSelecionado, anoSelecionado]);
  
  // Receitas vs Despesas (últimos meses - simulado)
  const receitasVsDespesas = useMemo((): ReceitasVsDespesas[] => {
    // TODO: Implementar com dados reais de múltiplos meses
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    return meses.map(mes => ({
      mes,
      receitas: somaReceitas * (0.8 + Math.random() * 0.4),
      despesas: somaDespesas * (0.8 + Math.random() * 0.4),
      saldo: 0
    })).map(item => ({
      ...item,
      saldo: item.receitas - item.despesas
    }));
  }, [somaReceitas, somaDespesas]);
  
  // Insights automáticos
  const insights = useMemo(() => {
    return gerarInsights(
      transacoes,
      categorias,
      despesasPorTipo,
      saldoDoMes,
      mediaDiariaGastos,
      mesSelecionado,
      anoSelecionado
    );
  }, [transacoes, categorias, despesasPorTipo, saldoDoMes, mediaDiariaGastos, mesSelecionado, anoSelecionado]);
  
  // Dados consolidados do dashboard
  const dadosDashboard = useMemo((): DadosDashboard => {
    return {
      receitasDoMes: somaReceitas,
      despesasDoMes: somaDespesas,
      saldoPrevisto: saldoDoMes,
      saldoReal,
      mediaDiariaGastos,
      despesasPorTipo,
      balancoPorDia,
      distribuicaoPorCategoria,
      receitasVsDespesas,
      insights,
      transacoesAgrupadas: transacoesAgrupadasPorDia
    };
  }, [
    somaReceitas,
    somaDespesas,
    saldoDoMes,
    saldoReal,
    mediaDiariaGastos,
    despesasPorTipo,
    balancoPorDia,
    distribuicaoPorCategoria,
    receitasVsDespesas,
    insights,
    transacoesAgrupadasPorDia
  ]);
  
  return {
    // Dados consolidados
    dados: dadosDashboard,
    
    // Acesso direto aos principais indicadores
    receitasDoMes: somaReceitas,
    despesasDoMes: somaDespesas,
    saldoPrevisto: saldoDoMes,
    saldoReal,
    mediaDiariaGastos,
    
    // Gráficos
    balancoPorDia,
    distribuicaoPorCategoria,
    receitasVsDespesas,
    
    // Análises
    despesasPorTipo,
    insights,
    
    // Transações
    transacoesAgrupadas: transacoesAgrupadasPorDia
  };
}
