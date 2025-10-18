/**
 * Análise de Sensibilidade para Simulações Financeiras
 * Permite analisar como mudanças nos parâmetros afetam os resultados
 */

import { SimulacaoInput, ResultadoSimulacao } from '../types';
import { calcularJurosCompostos } from './calculations';

export interface ParametroSensibilidade {
  nome: string;
  valorBase: number;
  variacao: number; // Percentual de variação (ex: 10 para ±10%)
  unidade: string;
}

export interface ResultadoSensibilidade {
  parametro: string;
  cenarios: Array<{
    variacao: number; // Percentual de variação aplicado
    valor: number; // Valor do parâmetro
    resultado: ResultadoSimulacao;
    impacto: number; // Percentual de impacto no resultado final
  }>;
  elasticidade: number; // Sensibilidade do resultado em relação ao parâmetro
  risco: 'baixo' | 'medio' | 'alto'; // Classificação de risco baseada na sensibilidade
}

export interface AnaliseSensibilidadeCompleta {
  simulacaoBase: SimulacaoInput;
  resultadoBase: ResultadoSimulacao;
  parametros: ResultadoSensibilidade[];
  resumo: {
    parametroMaisSensivel: string;
    parametroMenosRiscoSo: string;
    impactoMaximo: number;
    impactoMinimo: number;
    recomendacoes: string[];
  };
}

// Configurações padrão para análise de sensibilidade
const VARIACOES_PADRAO = [-20, -10, -5, 0, 5, 10, 20]; // Percentuais de variação

/**
 * Realiza análise de sensibilidade para um parâmetro específico
 */
export function analisarSensibilidadeParametro(
  simulacaoBase: SimulacaoInput,
  parametro: keyof SimulacaoInput,
  variacoes: number[] = VARIACOES_PADRAO
): ResultadoSensibilidade {
  const resultadoBase = calcularJurosCompostos(simulacaoBase);
  const valorBase = simulacaoBase[parametro] as number;
  
  if (typeof valorBase !== 'number') {
    throw new Error(`Parâmetro ${String(parametro)} deve ser numérico`);
  }

  const cenarios = variacoes.map(variacao => {
    const novoValor = valorBase * (1 + variacao / 100);
    const simulacaoModificada = {
      ...simulacaoBase,
      [parametro]: novoValor
    };
    
    const resultado = calcularJurosCompostos(simulacaoModificada);
    const impacto = ((resultado.valorFinal - resultadoBase.valorFinal) / resultadoBase.valorFinal) * 100;
    
    return {
      variacao,
      valor: novoValor,
      resultado,
      impacto
    };
  });

  // Calcular elasticidade (sensibilidade média)
  const impactos = cenarios.filter(c => c.variacao !== 0).map(c => Math.abs(c.impacto / c.variacao));
  const elasticidade = impactos.reduce((acc, imp) => acc + imp, 0) / impactos.length;

  // Classificar risco baseado na elasticidade
  let risco: 'baixo' | 'medio' | 'alto';
  if (elasticidade < 0.5) risco = 'baixo';
  else if (elasticidade < 1.5) risco = 'medio';
  else risco = 'alto';

  return {
    parametro: String(parametro),
    cenarios,
    elasticidade,
    risco
  };
}

/**
 * Realiza análise de sensibilidade completa para todos os parâmetros relevantes
 */
export function analiseSensibilidadeCompleta(
  simulacaoBase: SimulacaoInput,
  parametrosPersonalizados?: Array<keyof SimulacaoInput>
): AnaliseSensibilidadeCompleta {
  const resultadoBase = calcularJurosCompostos(simulacaoBase);
  
  // Parâmetros padrão para análise
  const parametrosDefault: Array<keyof SimulacaoInput> = [
    'valorInicial',
    'valorMensal',
    'periodo',
    'taxaPersonalizada'
  ];
  
  const parametrosAnalise = parametrosPersonalizados || parametrosDefault;
  
  const parametros = parametrosAnalise
    .filter(param => typeof simulacaoBase[param] === 'number')
    .map(param => analisarSensibilidadeParametro(simulacaoBase, param));

  // Gerar resumo da análise
  const elasticidades = parametros.map(p => ({ nome: p.parametro, elasticidade: p.elasticidade }));
  const maisRiscoSo = elasticidades.reduce((max, curr) => curr.elasticidade > max.elasticidade ? curr : max);
  const menosRiscoSo = elasticidades.reduce((min, curr) => curr.elasticidade < min.elasticidade ? curr : min);
  
  const impactos = parametros.flatMap(p => p.cenarios.map(c => Math.abs(c.impacto)));
  const impactoMaximo = Math.max(...impactos);
  const impactoMinimo = Math.min(...impactos.filter(i => i > 0));

  // Gerar recomendações
  const recomendacoes = gerarRecomendacoes(parametros, simulacaoBase);

  return {
    simulacaoBase,
    resultadoBase,
    parametros,
    resumo: {
      parametroMaisSensivel: maisRiscoSo.nome,
      parametroMenosRiscoSo: menosRiscoSo.nome,
      impactoMaximo,
      impactoMinimo,
      recomendacoes
    }
  };
}

/**
 * Gera recomendações baseadas na análise de sensibilidade
 */
function gerarRecomendacoes(
  parametros: ResultadoSensibilidade[],
  simulacao: SimulacaoInput
): string[] {
  const recomendacoes: string[] = [];
  
  // Analisar cada parâmetro
  parametros.forEach(param => {
    switch (param.parametro) {
      case 'valorInicial':
        if (param.risco === 'alto') {
          recomendacoes.push('💰 Valor inicial tem alto impacto - considere aumentar o aporte inicial se possível');
        }
        break;
        
      case 'valorMensal':
        if (param.risco === 'alto') {
          recomendacoes.push('📈 Aportes mensais são críticos - mantenha consistência nos investimentos');
        }
        break;
        
      case 'periodo':
        if (param.risco === 'alto') {
          recomendacoes.push('⏰ Tempo de investimento é fundamental - quanto mais tempo, melhor o resultado');
        }
        break;
        
      case 'taxaPersonalizada':
        if (param.risco === 'alto') {
          recomendacoes.push('📊 Taxa de juros tem grande impacto - pesquise as melhores opções do mercado');
        }
        break;
    }
  });

  // Recomendações gerais
  const parametroMaisRiscoSo = parametros.reduce((max, curr) => 
    curr.elasticidade > max.elasticidade ? curr : max
  );
  
  if (parametroMaisRiscoSo.elasticidade > 2) {
    recomendacoes.push('⚠️ Resultado muito sensível a mudanças - considere diversificar estratégias');
  }
  
  if (simulacao.periodo < 12) {
    recomendacoes.push('📅 Período curto pode limitar ganhos - considere investimentos de longo prazo');
  }
  
  if (simulacao.valorMensal === 0) {
    recomendacoes.push('💡 Aportes mensais podem acelerar significativamente seus resultados');
  }

  return recomendacoes;
}

/**
 * Análise de cenários Monte Carlo simplificada
 */
export interface CenarioMonteCarlo {
  numeroSimulacoes: number;
  variacaoTaxa: number; // Desvio padrão da taxa de juros
  variacaoAportes: number; // Desvio padrão dos aportes
  resultados: Array<{
    valorFinal: number;
    probabilidade: number;
  }>;
  estatisticas: {
    media: number;
    mediana: number;
    desviopadrao: number;
    percentil5: number;
    percentil95: number;
    probabilidadePerda: number;
  };
}

/**
 * Executa simulação Monte Carlo para análise de risco
 */
export function simulacaoMonteCarlo(
  simulacaoBase: SimulacaoInput,
  numeroSimulacoes: number = 1000,
  variacaoTaxa: number = 0.02, // 2% de desvio padrão
  variacaoAportes: number = 0.1 // 10% de desvio padrão
): CenarioMonteCarlo {
  const resultados: number[] = [];
  
  for (let i = 0; i < numeroSimulacoes; i++) {
    // Gerar variações aleatórias (distribuição normal simplificada)
    const fatorTaxa = 1 + (Math.random() - 0.5) * 2 * variacaoTaxa;
    const fatorAportes = 1 + (Math.random() - 0.5) * 2 * variacaoAportes;
    
    const simulacaoVariada: SimulacaoInput = {
      ...simulacaoBase,
      taxaPersonalizada: (simulacaoBase.taxaPersonalizada || 0) * fatorTaxa,
      valorMensal: simulacaoBase.valorMensal * fatorAportes
    };
    
    const resultado = calcularJurosCompostos(simulacaoVariada);
    resultados.push(resultado.valorFinal);
  }
  
  // Ordenar resultados para cálculos estatísticos
  resultados.sort((a, b) => a - b);
  
  const media = resultados.reduce((acc, val) => acc + val, 0) / resultados.length;
  const mediana = resultados[Math.floor(resultados.length / 2)];
  
  const variancia = resultados.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / resultados.length;
  const desviopadrao = Math.sqrt(variancia);
  
  const percentil5 = resultados[Math.floor(resultados.length * 0.05)];
  const percentil95 = resultados[Math.floor(resultados.length * 0.95)];
  
  const valorBase = calcularJurosCompostos(simulacaoBase).valorFinal;
  const probabilidadePerda = resultados.filter(r => r < valorBase * 0.9).length / resultados.length;
  
  // Agrupar resultados em faixas para visualização
  const faixas = 20;
  const min = Math.min(...resultados);
  const max = Math.max(...resultados);
  const tamanhoFaixa = (max - min) / faixas;
  
  const distribuicao = Array.from({ length: faixas }, (_, i) => {
    const inicio = min + i * tamanhoFaixa;
    const fim = inicio + tamanhoFaixa;
    const count = resultados.filter(r => r >= inicio && r < fim).length;
    
    return {
      valorFinal: inicio + tamanhoFaixa / 2,
      probabilidade: count / numeroSimulacoes
    };
  });
  
  return {
    numeroSimulacoes,
    variacaoTaxa,
    variacaoAportes,
    resultados: distribuicao,
    estatisticas: {
      media,
      mediana,
      desviopadrao,
      percentil5,
      percentil95,
      probabilidadePerda
    }
  };
}

/**
 * Análise de break-even (ponto de equilíbrio)
 */
export interface AnaliseBreakEven {
  tempoBreakEven: number; // Meses para recuperar investimento inicial
  valorBreakEven: number; // Valor necessário para atingir meta
  taxaBreakEven: number; // Taxa necessária para atingir meta
  viabilidade: 'viavel' | 'dificil' | 'inviavel';
  recomendacoes: string[];
}

/**
 * Calcula análise de break-even para uma meta específica
 */
export function analisarBreakEven(
  simulacao: SimulacaoInput,
  valorMeta: number
): AnaliseBreakEven {
  const resultadoAtual = calcularJurosCompostos(simulacao);
  
  // Calcular tempo para break-even (recuperar investimento inicial)
  let tempoBreakEven = 0;
  if (simulacao.valorMensal > 0) {
    // Aproximação para tempo de recuperação
    const taxaMensal = (simulacao.taxaPersonalizada || 0) / 100 / 12;
    if (taxaMensal > 0) {
      tempoBreakEven = Math.log(1 + (simulacao.valorInicial * taxaMensal) / simulacao.valorMensal) / Math.log(1 + taxaMensal);
    }
  }
  
  // Calcular valor necessário para atingir meta
  const valorBreakEven = valorMeta - resultadoAtual.valorFinal;
  
  // Calcular taxa necessária para atingir meta
  let taxaBreakEven = 0;
  if (simulacao.periodo > 0) {
    const fatorTempo = simulacao.unidadePeriodo === 'anos' ? simulacao.periodo * 12 : simulacao.periodo;
    const valorTotal = simulacao.valorInicial + (simulacao.valorMensal * fatorTempo);
    if (valorTotal > 0) {
      taxaBreakEven = (Math.pow(valorMeta / valorTotal, 1 / fatorTempo) - 1) * 12 * 100;
    }
  }
  
  // Avaliar viabilidade
  let viabilidade: 'viavel' | 'dificil' | 'inviavel';
  if (taxaBreakEven <= 15) viabilidade = 'viavel';
  else if (taxaBreakEven <= 30) viabilidade = 'dificil';
  else viabilidade = 'inviavel';
  
  // Gerar recomendações
  const recomendacoes: string[] = [];
  
  if (viabilidade === 'inviavel') {
    recomendacoes.push('🎯 Meta muito ambiciosa - considere ajustar o valor ou prazo');
    recomendacoes.push('💰 Aumente o valor inicial ou aportes mensais');
    recomendacoes.push('⏰ Estenda o prazo de investimento');
  } else if (viabilidade === 'dificil') {
    recomendacoes.push('⚠️ Meta desafiadora - requer disciplina e boas oportunidades');
    recomendacoes.push('📈 Busque investimentos com maior rentabilidade');
  } else {
    recomendacoes.push('✅ Meta viável com a estratégia atual');
    recomendacoes.push('🎯 Mantenha consistência nos aportes');
  }
  
  return {
    tempoBreakEven,
    valorBreakEven,
    taxaBreakEven,
    viabilidade,
    recomendacoes
  };
}