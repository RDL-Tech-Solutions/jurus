/**
 * Utilitários para manipulação de transações
 * Funções puras e reutilizáveis
 */

import { Transacao, RecorrenciaTransacao } from '../../../types/fluxoCaixa';
import { TransacaoExpandida, TransacoesPorDia } from '../types';

/**
 * Formata valor monetário
 */
export function formatarValor(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

/**
 * Formata data para exibição
 */
export function formatarData(data: string): string {
  const date = new Date(data);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formata data para exibição curta (sem ano)
 */
export function formatarDataCurta(data: string): string {
  const date = new Date(data);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  });
}

/**
 * Formata data para exibição do dia da semana
 */
export function formatarDiaSemana(data: string): string {
  const date = new Date(data);
  const hoje = new Date();
  const ontem = new Date(hoje);
  ontem.setDate(ontem.getDate() - 1);
  
  // Remove horas para comparação
  date.setHours(0, 0, 0, 0);
  hoje.setHours(0, 0, 0, 0);
  ontem.setHours(0, 0, 0, 0);
  
  if (date.getTime() === hoje.getTime()) {
    return 'Hoje';
  } else if (date.getTime() === ontem.getTime()) {
    return 'Ontem';
  }
  
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'short'
  });
}

/**
 * Verifica se uma data pertence ao mesmo mês/ano
 */
export function isSameMonth(data: string, mes: number, ano: number): boolean {
  const date = new Date(data);
  return date.getFullYear() === ano && (date.getMonth() + 1) === mes;
}

/**
 * Obtém mês e ano de uma string YYYY-MM
 */
export function parseMesAno(mesAno: string): { mes: number; ano: number } {
  const [ano, mes] = mesAno.split('-').map(Number);
  return { mes, ano };
}

/**
 * Formata mês/ano para string YYYY-MM
 */
export function formatarMesAno(mes: number, ano: number): string {
  return `${ano}-${String(mes).padStart(2, '0')}`;
}

/**
 * Obtém o nome do mês
 */
export function obterNomeMes(mes: number): string {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return meses[mes - 1] || '';
}

/**
 * Filtra transações por mês/ano
 */
export function filtrarPorMes(
  transacoes: Transacao[],
  mes: number,
  ano: number
): Transacao[] {
  return transacoes.filter(t => isSameMonth(t.data, mes, ano));
}

/**
 * Expande transações recorrentes para um mês específico
 */
export function expandirRecorrentes(
  recorrentes: any[],
  mes: number,
  ano: number
): TransacaoExpandida[] {
  const resultado: TransacaoExpandida[] = [];
  const dataReferencia = new Date(ano, mes - 1, 1);
  
  recorrentes.forEach(rec => {
    if (!rec.ativa) return;
    
    const dataInicio = new Date(rec.dataInicio);
    const dataFim = rec.dataFim ? new Date(rec.dataFim) : null;
    
    // Verifica se a recorrência está ativa neste mês
    if (dataInicio > dataReferencia) return;
    if (dataFim && dataFim < dataReferencia) return;
    
    // Gera a transação para este mês
    let diaDoMes = rec.diaDoMes || dataInicio.getDate();
    
    // Ajusta para o último dia do mês se necessário
    const ultimoDia = new Date(ano, mes, 0).getDate();
    if (diaDoMes > ultimoDia) {
      diaDoMes = ultimoDia;
    }
    
    const dataTransacao = new Date(ano, mes - 1, diaDoMes);
    
    resultado.push({
      id: `recorrente-${rec.id}-${mes}-${ano}`,
      descricao: rec.descricao,
      valor: rec.valor,
      tipo: rec.tipo,
      categoriaId: rec.categoriaId,
      data: dataTransacao.toISOString(),
      observacoes: rec.observacoes,
      isRecorrente: true,
      recorrenciaId: rec.id,
      recorrenciaFrequencia: rec.frequencia,
      recorrenciaDataInicio: rec.dataInicio,
      criadoEm: rec.criadoEm,
      atualizadoEm: new Date().toISOString()
    });
  });
  
  return resultado;
}

/**
 * Expande transações parceladas para um mês específico
 */
export function expandirParceladas(
  parceladas: any[],
  mes: number,
  ano: number
): TransacaoExpandida[] {
  const resultado: TransacaoExpandida[] = [];
  
  parceladas.forEach(parc => {
    const dataCompra = new Date(parc.data);
    const mesCompra = dataCompra.getMonth() + 1;
    const anoCompra = dataCompra.getFullYear();
    
    // Calcula qual parcela corresponde a este mês
    const mesesDiferenca = (ano - anoCompra) * 12 + (mes - mesCompra);
    
    if (mesesDiferenca >= 0 && mesesDiferenca < parc.parcelas) {
      const parcelaAtual = mesesDiferenca + 1;
      const valorParcela = parc.valor / parc.parcelas;
      
      // Data da parcela é sempre no mesmo dia da compra
      const diaParcela = dataCompra.getDate();
      const ultimoDia = new Date(ano, mes, 0).getDate();
      const diaAjustado = Math.min(diaParcela, ultimoDia);
      
      const dataParcela = new Date(ano, mes - 1, diaAjustado);
      
      resultado.push({
        id: `parcelada-${parc.id}-${parcelaAtual}`,
        descricao: `${parc.descricao} (${parcelaAtual}/${parc.parcelas})`,
        valor: valorParcela,
        tipo: parc.tipo,
        categoriaId: parc.categoriaId,
        data: dataParcela.toISOString(),
        observacoes: parc.observacoes,
        isParcelada: true,
        parcelaAtual,
        totalParcelas: parc.parcelas,
        valorParcela,
        criadoEm: parc.criadoEm,
        atualizadoEm: new Date().toISOString()
      });
    }
  });
  
  return resultado;
}

/**
 * Agrupa transações por dia
 */
export function groupByDate(transacoes: TransacaoExpandida[]): TransacoesPorDia[] {
  const grupos = new Map<string, TransacaoExpandida[]>();
  
  // Agrupa por data
  transacoes.forEach(t => {
    const data = t.data.split('T')[0]; // YYYY-MM-DD
    if (!grupos.has(data)) {
      grupos.set(data, []);
    }
    grupos.get(data)!.push(t);
  });
  
  // Converte para array e calcula totais
  const resultado: TransacoesPorDia[] = Array.from(grupos.entries()).map(([data, trans]) => {
    const totalReceitas = trans
      .filter(t => t.tipo === 'entrada')
      .reduce((sum, t) => sum + t.valor, 0);
    
    const totalDespesas = trans
      .filter(t => t.tipo === 'saida')
      .reduce((sum, t) => sum + t.valor, 0);
    
    return {
      data,
      transacoes: trans,
      totalReceitas,
      totalDespesas,
      saldo: totalReceitas - totalDespesas
    };
  });
  
  // Ordena por data decrescente (mais recente primeiro)
  resultado.sort((a, b) => b.data.localeCompare(a.data));
  
  return resultado;
}

/**
 * Calcula resumo mensal
 */
export function calcularResumoMensal(transacoes: TransacaoExpandida[]) {
  const totalReceitas = transacoes
    .filter(t => t.tipo === 'entrada')
    .reduce((sum, t) => sum + t.valor, 0);
  
  const totalDespesas = transacoes
    .filter(t => t.tipo === 'saida')
    .reduce((sum, t) => sum + t.valor, 0);
  
  return {
    totalReceitas,
    totalDespesas,
    saldo: totalReceitas - totalDespesas,
    quantidadeTransacoes: transacoes.length
  };
}

/**
 * Obtém mês/ano atual
 */
export function obterMesAnoAtual(): { mes: number; ano: number } {
  const hoje = new Date();
  return {
    mes: hoje.getMonth() + 1,
    ano: hoje.getFullYear()
  };
}

/**
 * Navega para o mês anterior
 */
export function mesAnterior(mes: number, ano: number): { mes: number; ano: number } {
  if (mes === 1) {
    return { mes: 12, ano: ano - 1 };
  }
  return { mes: mes - 1, ano };
}

/**
 * Navega para o próximo mês
 */
export function proximoMes(mes: number, ano: number): { mes: number; ano: number } {
  if (mes === 12) {
    return { mes: 1, ano: ano + 1 };
  }
  return { mes: mes + 1, ano };
}
