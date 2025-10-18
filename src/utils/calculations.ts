import { SimulacaoInput, ResultadoSimulacao, ResultadoMensal } from '../types';
import { CDI_ATUAL_PADRAO, INFLACAO_PADRAO } from '../constants';
import { buscarModalidadePorId } from '../constants/bancosDigitais';

// Conversão de taxa anual para mensal
export function taxaAnualParaMensal(taxaAnual: number): number {
  return Math.pow(1 + taxaAnual / 100, 1 / 12) - 1;
}

// Conversão de taxa anual para diária
export function taxaAnualParaDiaria(taxaAnual: number): number {
  return Math.pow(1 + taxaAnual / 100, 1 / 365) - 1;
}

// Obter taxa efetiva baseada no tipo selecionado
export function obterTaxaEfetiva(input: SimulacaoInput): number {
  switch (input.taxaType) {
    case 'banco':
      return input.modalidade?.taxaAnual || 0;
    case 'banco_digital':
      if (input.bancoDigitalId && input.modalidadeBancoId) {
        const modalidade = buscarModalidadePorId(input.bancoDigitalId, input.modalidadeBancoId);
        return modalidade?.taxaAnual || 0;
      }
      return 0;
    case 'cdi':
      const cdiAtual = input.cdiAtual || CDI_ATUAL_PADRAO;
      const percentualCdi = input.percentualCdi || 100;
      return (cdiAtual * percentualCdi) / 100;
    case 'personalizada':
      return input.taxaPersonalizada || 0;
    default:
      return 0;
  }
}

// Calcular taxa real (descontando inflação)
export function calcularTaxaReal(taxaNominal: number, taxaInflacao: number): number {
  return ((1 + taxaNominal / 100) / (1 + taxaInflacao / 100) - 1) * 100;
}

// Função principal de cálculo de juros compostos
export function calcularJurosCompostos(input: SimulacaoInput): ResultadoSimulacao {
  const taxaAnual = obterTaxaEfetiva(input);
  const taxaMensal = taxaAnualParaMensal(taxaAnual);
  const taxaDiaria = taxaAnualParaDiaria(taxaAnual);
  
  // Configurações de inflação
  const considerarInflacao = input.considerarInflacao || false;
  const taxaInflacaoAnual = input.taxaInflacao || INFLACAO_PADRAO;
  const taxaInflacaoMensal = considerarInflacao ? taxaAnualParaMensal(taxaInflacaoAnual) : 0;
  
  // Converter período para meses
  const periodoMeses = input.unidadePeriodo === 'anos' 
    ? input.periodo * 12 
    : input.periodo;
  
  let saldoAtual = input.valorInicial;
  const evolucaoMensal: ResultadoMensal[] = [];
  let totalContribuicoes = input.valorInicial;
  let perdaTotalInflacao = 0;
  
  // Calcular evolução mês a mês
  for (let mes = 1; mes <= periodoMeses; mes++) {
    // Aplicar juros sobre o saldo atual
    const jurosDoMes = saldoAtual * taxaMensal;
    
    // Adicionar contribuição mensal (exceto no primeiro mês se já tiver valor inicial)
    const contribuicaoDoMes = mes === 1 && input.valorInicial > 0 
      ? input.valorInicial 
      : input.valorMensal;
    
    if (mes > 1) {
      totalContribuicoes += input.valorMensal;
    }
    
    // Atualizar saldo
    saldoAtual = saldoAtual + jurosDoMes + (mes === 1 ? 0 : input.valorMensal);
    
    // Cálculos de inflação
    let saldoReal = saldoAtual;
    let perdaInflacao = 0;
    let ganhoRealMensal = jurosDoMes;
    
    if (considerarInflacao) {
      // Calcular o valor real descontando a inflação acumulada
      const fatorInflacaoAcumulada = Math.pow(1 + taxaInflacaoMensal, mes);
      saldoReal = saldoAtual / fatorInflacaoAcumulada;
      
      // Perda mensal por inflação
      perdaInflacao = saldoAtual * taxaInflacaoMensal;
      perdaTotalInflacao += perdaInflacao;
      
      // Ganho real mensal (juros - inflação)
      ganhoRealMensal = jurosDoMes - perdaInflacao;
    }
    
    evolucaoMensal.push({
      mes,
      contribuicao: contribuicaoDoMes,
      juros: jurosDoMes,
      saldoAcumulado: saldoAtual,
      saldoReal: considerarInflacao ? saldoReal : undefined,
      perdaInflacao: considerarInflacao ? perdaInflacao : undefined,
      ganhoRealMensal: considerarInflacao ? ganhoRealMensal : undefined
    });
  }
  
  // Calcular totais finais
  const totalInvestido = input.valorInicial + (input.valorMensal * (periodoMeses - 1));
  const saldoFinal = saldoAtual;
  const totalJuros = saldoFinal - totalInvestido;
  
  // Calcular ganhos estimados
  const ganhoMensal = saldoFinal * taxaMensal;
  const ganhoDiario = saldoFinal * taxaDiaria;
  const ganhoAnual = saldoFinal * (taxaAnual / 100);
  
  // Calcular rentabilidade total (percentual de retorno sobre o investimento)
  const rentabilidadeTotal = totalInvestido > 0 ? (totalJuros / totalInvestido) * 100 : 0;
  
  // Cálculos específicos de inflação
  let saldoFinalReal: number | undefined;
  let totalJurosReais: number | undefined;
  let rentabilidadeReal: number | undefined;
  let taxaRealAnual: number | undefined;
  
  if (considerarInflacao) {
    const fatorInflacaoTotal = Math.pow(1 + taxaInflacaoMensal, periodoMeses);
    saldoFinalReal = saldoFinal / fatorInflacaoTotal;
    totalJurosReais = saldoFinalReal - totalInvestido;
    rentabilidadeReal = totalInvestido > 0 ? (totalJurosReais / totalInvestido) * 100 : 0;
    taxaRealAnual = calcularTaxaReal(taxaAnual, taxaInflacaoAnual);
  }
  
  return {
    totalInvestido,
    totalJuros,
    valorFinal: saldoFinal,
    saldoFinal: saldoFinal, // Alias para valorFinal
    rendimentoTotal: totalJuros, // Alias para totalJuros
    jurosGanhos: totalJuros, // Alias para totalJuros
    ganhoDiario,
    ganhoMensal,
    ganhoAnual,
    evolucaoMensal,
    taxaEfetivaMensal: taxaMensal * 100,
    taxaEfetivaDiaria: taxaDiaria * 100,
    rentabilidadeTotal,
    // Campos de inflação
    saldoFinalReal,
    totalJurosReais,
    rentabilidadeReal,
    taxaRealAnual,
    perdaTotalInflacao: considerarInflacao ? perdaTotalInflacao : undefined
  };
}

// Formatação de valores monetários
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

// Formatação de percentual
export function formatarPercentual(valor: number, casasDecimais: number = 2): string {
  // Validação para valores undefined, null ou NaN
  if (valor === undefined || valor === null || isNaN(valor)) {
    return '0.00%';
  }
  
  return `${valor.toFixed(casasDecimais)}%`;
}

// Formatação de números grandes
export function formatarNumero(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor);
}

// Formatação de números grandes com abreviações
export function formatarNumeroGrande(valor: number): string {
  if (valor >= 1000000000) {
    return `${(valor / 1000000000).toFixed(1)}B`;
  } else if (valor >= 1000000) {
    return `${(valor / 1000000).toFixed(1)}M`;
  } else if (valor >= 1000) {
    return `${(valor / 1000).toFixed(1)}K`;
  }
  return formatarNumero(valor);
}

// ===== CÁLCULOS AVANÇADOS DE INFLAÇÃO =====

/**
 * Calcula o poder de compra futuro considerando inflação
 */
export function calcularPoderCompra(valorAtual: number, taxaInflacao: number, periodoAnos: number): number {
  return valorAtual / Math.pow(1 + taxaInflacao / 100, periodoAnos);
}

/**
 * Calcula a inflação acumulada em um período
 */
export function calcularInflacaoAcumulada(taxaInflacaoAnual: number, periodoMeses: number): number {
  const taxaMensal = taxaAnualParaMensal(taxaInflacaoAnual);
  return (Math.pow(1 + taxaMensal, periodoMeses) - 1) * 100;
}

/**
 * Calcula o valor necessário futuro para manter o mesmo poder de compra
 */
export function calcularValorFuturoInflacao(valorAtual: number, taxaInflacao: number, periodoAnos: number): number {
  return valorAtual * Math.pow(1 + taxaInflacao / 100, periodoAnos);
}

/**
 * Calcula a taxa de juros necessária para vencer a inflação
 */
export function calcularTaxaParaVencerInflacao(taxaInflacao: number, margemSeguranca: number = 2): number {
  return taxaInflacao + margemSeguranca;
}

// ===== MÉTRICAS DE PERFORMANCE =====

export interface MetricasPerformance {
  roi: number; // Return on Investment
  cagr: number; // Compound Annual Growth Rate
  sharpeRatio: number; // Índice Sharpe simplificado
  volatilidade: number; // Volatilidade estimada
  tempoRecuperacao: number; // Tempo para recuperar investimento inicial
  eficienciaCapital: number; // Eficiência do capital investido
  riscoBeneficio: 'baixo' | 'medio' | 'alto';
  classificacao: 'conservador' | 'moderado' | 'agressivo';
}

/**
 * Calcula métricas de performance de um investimento
 */
export function calcularMetricasPerformance(
  valorInicial: number,
  valorFinal: number,
  periodoMeses: number,
  taxaLivreRisco: number = 10.75, // Selic atual
  aportesMensais: number = 0
): MetricasPerformance {
  const periodoAnos = periodoMeses / 12;
  const totalInvestido = valorInicial + (aportesMensais * periodoMeses);
  
  // ROI (Return on Investment)
  const roi = totalInvestido > 0 ? ((valorFinal - totalInvestido) / totalInvestido) * 100 : 0;
  
  // CAGR (Compound Annual Growth Rate)
  const cagr = periodoAnos > 0 ? (Math.pow(valorFinal / totalInvestido, 1 / periodoAnos) - 1) * 100 : 0;
  
  // Volatilidade estimada (baseada no tipo de investimento)
  let volatilidade = 0;
  if (cagr > 15) volatilidade = 20; // Alto risco
  else if (cagr > 10) volatilidade = 12; // Médio risco
  else volatilidade = 5; // Baixo risco
  
  // Sharpe Ratio simplificado
  const excessoRetorno = cagr - taxaLivreRisco;
  const sharpeRatio = volatilidade > 0 ? excessoRetorno / volatilidade : 0;
  
  // Tempo de recuperação (em meses)
  let tempoRecuperacao = 0;
  if (aportesMensais > 0) {
    // Aproximação para tempo de recuperação com aportes mensais
    const taxaMensal = Math.pow(valorFinal / totalInvestido, 1 / periodoMeses) - 1;
    if (taxaMensal > 0) {
      tempoRecuperacao = Math.log(1 + (valorInicial * taxaMensal) / aportesMensais) / Math.log(1 + taxaMensal);
    }
  } else {
    tempoRecuperacao = periodoMeses; // Sem aportes, recupera apenas no final
  }
  
  // Eficiência do capital
  const eficienciaCapital = totalInvestido > 0 ? (valorFinal / totalInvestido) : 1;
  
  // Classificação de risco-benefício
  let riscoBeneficio: 'baixo' | 'medio' | 'alto';
  if (sharpeRatio > 1) riscoBeneficio = 'baixo';
  else if (sharpeRatio > 0.5) riscoBeneficio = 'medio';
  else riscoBeneficio = 'alto';
  
  // Classificação do perfil
  let classificacao: 'conservador' | 'moderado' | 'agressivo';
  if (cagr <= 12 && volatilidade <= 8) classificacao = 'conservador';
  else if (cagr <= 18 && volatilidade <= 15) classificacao = 'moderado';
  else classificacao = 'agressivo';
  
  return {
    roi,
    cagr,
    sharpeRatio,
    volatilidade,
    tempoRecuperacao,
    eficienciaCapital,
    riscoBeneficio,
    classificacao
  };
}

/**
 * Calcula o valor presente líquido (VPL) de um investimento
 */
export function calcularVPL(
  fluxosCaixa: number[],
  taxaDesconto: number
): number {
  return fluxosCaixa.reduce((vpl, fluxo, periodo) => {
    return vpl + fluxo / Math.pow(1 + taxaDesconto / 100, periodo);
  }, 0);
}

/**
 * Calcula a taxa interna de retorno (TIR) simplificada
 */
export function calcularTIR(
  valorInicial: number,
  valorFinal: number,
  periodoAnos: number
): number {
  if (periodoAnos <= 0 || valorInicial <= 0) return 0;
  return (Math.pow(valorFinal / valorInicial, 1 / periodoAnos) - 1) * 100;
}

/**
 * Calcula o payback simples (tempo de retorno do investimento)
 */
export function calcularPayback(
  investimentoInicial: number,
  fluxoCaixaMensal: number
): number {
  if (fluxoCaixaMensal <= 0) return Infinity;
  return investimentoInicial / fluxoCaixaMensal;
}

// ===== CÁLCULOS DE CENÁRIOS =====

export interface CenarioInvestimento {
  nome: string;
  taxaAnual: number;
  risco: 'baixo' | 'medio' | 'alto';
  liquidez: 'alta' | 'media' | 'baixa';
  tributacao: number; // Percentual de imposto
  resultado: ResultadoSimulacao;
}

/**
 * Gera cenários de investimento para comparação
 */
export function gerarCenariosInvestimento(input: SimulacaoInput): CenarioInvestimento[] {
  const cenarios: Omit<CenarioInvestimento, 'resultado'>[] = [
    {
      nome: 'Poupança',
      taxaAnual: 6.17,
      risco: 'baixo',
      liquidez: 'alta',
      tributacao: 0
    },
    {
      nome: 'CDB 100% CDI',
      taxaAnual: 10.75,
      risco: 'baixo',
      liquidez: 'media',
      tributacao: 15
    },
    {
      nome: 'LCI/LCA',
      taxaAnual: 9.5,
      risco: 'baixo',
      liquidez: 'baixa',
      tributacao: 0
    },
    {
      nome: 'Tesouro Selic',
      taxaAnual: 10.75,
      risco: 'baixo',
      liquidez: 'alta',
      tributacao: 15
    },
    {
      nome: 'Fundos DI',
      taxaAnual: 9.8,
      risco: 'baixo',
      liquidez: 'alta',
      tributacao: 15
    },
    {
      nome: 'Tesouro IPCA+',
      taxaAnual: 12.5,
      risco: 'medio',
      liquidez: 'media',
      tributacao: 15
    },
    {
      nome: 'Fundos Multimercado',
      taxaAnual: 14.2,
      risco: 'medio',
      liquidez: 'media',
      tributacao: 15
    },
    {
      nome: 'Ações (Ibovespa)',
      taxaAnual: 16.8,
      risco: 'alto',
      liquidez: 'alta',
      tributacao: 15
    }
  ];
  
  return cenarios.map(cenario => {
    const inputCenario: SimulacaoInput = {
      ...input,
      taxaType: 'personalizada',
      taxaPersonalizada: cenario.taxaAnual
    };
    
    const resultado = calcularJurosCompostos(inputCenario);
    
    // Aplicar tributação se houver
    if (cenario.tributacao > 0) {
      const impostoSobreGanhos = resultado.totalJuros * (cenario.tributacao / 100);
      resultado.valorFinal -= impostoSobreGanhos;
      resultado.totalJuros -= impostoSobreGanhos;
      resultado.saldoFinal = resultado.valorFinal;
      resultado.rendimentoTotal = resultado.totalJuros;
      resultado.jurosGanhos = resultado.totalJuros;
    }
    
    return {
      ...cenario,
      resultado
    };
  });
}

/**
 * Calcula a diversificação ótima entre diferentes tipos de investimento
 */
export interface AlocacaoOtima {
  conservador: number; // Percentual em investimentos conservadores
  moderado: number; // Percentual em investimentos moderados
  agressivo: number; // Percentual em investimentos agressivos
  retornoEsperado: number;
  riscoEstimado: number;
  recomendacao: string;
}

export function calcularAlocacaoOtima(
  idade: number,
  perfilRisco: 'conservador' | 'moderado' | 'agressivo',
  horizonte: number // em anos
): AlocacaoOtima {
  let conservador = 0;
  let moderado = 0;
  let agressivo = 0;
  
  // Regra básica: 100 - idade = % em renda variável
  const baseAgressivo = Math.max(0, Math.min(80, 100 - idade));
  
  // Ajustar baseado no perfil de risco
  switch (perfilRisco) {
    case 'conservador':
      conservador = 70;
      moderado = 25;
      agressivo = 5;
      break;
    case 'moderado':
      conservador = 50;
      moderado = 30;
      agressivo = 20;
      break;
    case 'agressivo':
      conservador = 20;
      moderado = 30;
      agressivo = 50;
      break;
  }
  
  // Ajustar baseado no horizonte de tempo
  if (horizonte > 10) {
    agressivo += 10;
    conservador -= 10;
  } else if (horizonte < 3) {
    conservador += 15;
    agressivo -= 15;
  }
  
  // Garantir que soma 100%
  const total = conservador + moderado + agressivo;
  conservador = Math.round((conservador / total) * 100);
  moderado = Math.round((moderado / total) * 100);
  agressivo = 100 - conservador - moderado;
  
  // Calcular retorno esperado e risco
  const retornoEsperado = (conservador * 8 + moderado * 12 + agressivo * 16) / 100;
  const riscoEstimado = (conservador * 3 + moderado * 8 + agressivo * 20) / 100;
  
  // Gerar recomendação
  let recomendacao = '';
  if (conservador > 60) {
    recomendacao = 'Foque em renda fixa e investimentos seguros';
  } else if (agressivo > 40) {
    recomendacao = 'Diversifique em ações e fundos de crescimento';
  } else {
    recomendacao = 'Mantenha equilíbrio entre segurança e crescimento';
  }
  
  return {
    conservador,
    moderado,
    agressivo,
    retornoEsperado,
    riscoEstimado,
    recomendacao
  };
}