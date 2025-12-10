/**
 * Hook principal para gerenciamento de transações
 * Centraliza toda a lógica de transações, filtros e navegação de meses
 */

import { useState, useMemo, useCallback } from 'react';
import { useFluxoCaixa } from '../../../hooks/useFluxoCaixaV2';
import { useRecorrentes } from '../../../hooks/useRecorrentesV2';
import { TransacaoExpandida, ResumoMensal } from '../types';
import {
  filtrarPorMes,
  expandirRecorrentes,
  groupByDate,
  calcularResumoMensal,
  obterMesAnoAtual,
  mesAnterior as calcMesAnterior,
  proximoMes as calcProximoMes,
  formatarMesAno,
  parseMesAno,
  obterNomeMes
} from '../utils/transacoes';

export function useTransacoes() {
  // Hooks base
  const {
    transacoes: transacoesBase,
    categorias,
    obterCategoria,
    adicionarTransacao,
    editarTransacao,
    excluirTransacao
  } = useFluxoCaixa();
  
  const { recorrentes } = useRecorrentes();
  
  // Estado de navegação de mês
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const { mes, ano } = obterMesAnoAtual();
    return formatarMesAno(mes, ano);
  });
  
  // Parse do mês selecionado
  const { mes: mesSelecionado, ano: anoSelecionado } = useMemo(
    () => parseMesAno(selectedMonth),
    [selectedMonth]
  );
  
  // Nome do mês atual
  const nomeMesAtual = useMemo(
    () => obterNomeMes(mesSelecionado),
    [mesSelecionado]
  );
  
  // Transações filtradas por mês (apenas transações normais)
  const transacoesDoMes = useMemo(() => {
    return filtrarPorMes(transacoesBase, mesSelecionado, anoSelecionado);
  }, [transacoesBase, mesSelecionado, anoSelecionado]);
  
  // Transações recorrentes expandidas para o mês
  const transacoesRecorrentesExpandidas = useMemo(() => {
    return expandirRecorrentes(recorrentes, mesSelecionado, anoSelecionado);
  }, [recorrentes, mesSelecionado, anoSelecionado]);
  
  // TODO: Adicionar suporte a parceladas quando necessário
  // const transacoesParceladasExpandidas = useMemo(() => {
  //   return expandirParceladas(parceladas, mesSelecionado, anoSelecionado);
  // }, [parceladas, mesSelecionado, anoSelecionado]);
  
  // Todas as transações do mês (normais + recorrentes + parceladas)
  const todasTransacoesDoMes = useMemo(() => {
    const todas: TransacaoExpandida[] = [
      // Transações normais
      ...transacoesDoMes.map(t => ({
        ...t,
        isRecorrente: false,
        isParcelada: false
      } as TransacaoExpandida)),
      // Recorrentes expandidas
      ...transacoesRecorrentesExpandidas
      // TODO: Adicionar parceladas quando necessário
      // ...transacoesParceladasExpandidas
    ];
    
    // Ordena por data decrescente
    return todas.sort((a, b) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }, [transacoesDoMes, transacoesRecorrentesExpandidas]);
  
  // Transações agrupadas por dia
  const transacoesAgrupadasPorDia = useMemo(() => {
    return groupByDate(todasTransacoesDoMes);
  }, [todasTransacoesDoMes]);
  
  // Resumo mensal
  const resumoMensal = useMemo((): ResumoMensal => {
    const resumo = calcularResumoMensal(todasTransacoesDoMes);
    return {
      mes: mesSelecionado,
      ano: anoSelecionado,
      ...resumo
    };
  }, [todasTransacoesDoMes, mesSelecionado, anoSelecionado]);
  
  // Valores individuais para fácil acesso
  const somaReceitas = resumoMensal.totalReceitas;
  const somaDespesas = resumoMensal.totalDespesas;
  const saldoDoMes = resumoMensal.saldo;
  
  // Navegação de meses
  const navigateMonth = useCallback((direction: 1 | -1) => {
    setSelectedMonth(current => {
      const { mes, ano } = parseMesAno(current);
      const novoMesAno = direction === 1 
        ? calcProximoMes(mes, ano)
        : calcMesAnterior(mes, ano);
      return formatarMesAno(novoMesAno.mes, novoMesAno.ano);
    });
  }, []);
  
  const irParaMesAnterior = useCallback(() => {
    navigateMonth(-1);
  }, [navigateMonth]);
  
  const irParaProximoMes = useCallback(() => {
    navigateMonth(1);
  }, [navigateMonth]);
  
  const irParaMes = useCallback((mes: number, ano: number) => {
    setSelectedMonth(formatarMesAno(mes, ano));
  }, []);
  
  const irParaHoje = useCallback(() => {
    const { mes, ano } = obterMesAnoAtual();
    setSelectedMonth(formatarMesAno(mes, ano));
  }, []);
  
  // Verifica se está no mês atual
  const isMesAtual = useMemo(() => {
    const { mes, ano } = obterMesAnoAtual();
    return mesSelecionado === mes && anoSelecionado === ano;
  }, [mesSelecionado, anoSelecionado]);
  
  return {
    // Dados
    transacoes: todasTransacoesDoMes,
    transacoesAgrupadasPorDia,
    categorias,
    
    // Resumo
    somaReceitas,
    somaDespesas,
    saldoDoMes,
    resumoMensal,
    
    // Navegação
    selectedMonth,
    mesSelecionado,
    anoSelecionado,
    nomeMesAtual,
    isMesAtual,
    navigateMonth,
    irParaMesAnterior,
    irParaProximoMes,
    irParaMes,
    irParaHoje,
    
    // Funções de manipulação
    obterCategoria,
    adicionarTransacao,
    editarTransacao,
    excluirTransacao
  };
}
