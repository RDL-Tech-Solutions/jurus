import { 
  PadraoInvestimento, 
  SugestaoPersonalizada, 
  MetricaPerformance, 
  AlertaOportunidade,
  AnaliseComportamental,
  DashboardInsights,
  PrevisaoTendencia,
  CorrelacaoVariaveis,
  ConquistaInsights,
  PontuacaoUsuario
} from '../types/insights';
import { SimulacaoJuros, ResultadoSimulacao } from '../types/simulacao';
import { HistoricoItem } from '../types/historico';

// Análise avançada de padrões de investimento
export const analisarPadroes = (historico: HistoricoItem[]): PadraoInvestimento[] => {
  const padroes: PadraoInvestimento[] = [];
  
  if (historico.length < 3) return padroes;

  // Analisar tendência de valor inicial com análise estatística avançada
  const valoresIniciais = historico.map(item => {
    const simulacao = item.dados.simulacao as SimulacaoJuros;
    return simulacao.parametros.valorInicial;
  });
  const tendenciaValorInicial = calcularTendenciaAvancada(valoresIniciais);
  
  if (Math.abs(tendenciaValorInicial.variacao) > 5) {
    padroes.push({
      id: 'valor_inicial_trend',
      tipo: 'valor_inicial',
      tendencia: tendenciaValorInicial.variacao > 0 ? 'crescente' : 'decrescente',
      variacao: Math.abs(tendenciaValorInicial.variacao),
      frequencia: historico.length,
      ultimaOcorrencia: new Date(Math.max(...historico.map(h => h.dataCreacao.getTime()))),
      confianca: Math.min(95, tendenciaValorInicial.confianca * 100)
    });
  }

  // Analisar padrões sazonais
  const padroesSazonais = detectarSazonalidade(historico);
  padroes.push(...padroesSazonais);

  // Analisar correlações entre variáveis
  const correlacoes = analisarCorrelacoes(historico);
  padroes.push(...correlacoes);

  // Detectar anomalias nos padrões
  const anomalias = detectarAnomalias(historico);
  padroes.push(...anomalias);

  return padroes;
};

// Análise estatística avançada de tendências
const calcularTendenciaAvancada = (valores: number[]) => {
  if (valores.length < 2) return { variacao: 0, confianca: 0, volatilidade: 0 };
  
  const n = valores.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const y = valores;
  
  // Regressão linear com análise de volatilidade
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Calcular R² e volatilidade
  const yMean = sumY / n;
  const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
  const ssRes = y.reduce((sum, yi, i) => {
    const predicted = slope * x[i] + intercept;
    return sum + Math.pow(yi - predicted, 2);
  }, 0);
  
  const rSquared = 1 - (ssRes / ssTotal);
  
  // Calcular volatilidade (desvio padrão dos resíduos)
  const residuos = y.map((yi, i) => yi - (slope * x[i] + intercept));
  const volatilidade = Math.sqrt(residuos.reduce((sum, r) => sum + r * r, 0) / n);
  
  // Variação percentual
  const valorInicial = valores[0];
  const valorFinal = slope * (n - 1) + intercept;
  const variacao = valorInicial !== 0 ? ((valorFinal - valorInicial) / valorInicial) * 100 : 0;
  
  return {
    variacao,
    confianca: Math.max(0, rSquared),
    volatilidade: volatilidade / yMean * 100 // Coeficiente de variação
  };
};

// Detectar padrões sazonais
const detectarSazonalidade = (historico: HistoricoItem[]): PadraoInvestimento[] => {
  const padroes: PadraoInvestimento[] = [];
  
  if (historico.length < 12) return padroes;

  // Agrupar por mês
  const dadosPorMes = new Map<number, number[]>();
  
  historico.forEach(item => {
    const mes = item.dataCreacao.getMonth();
    const simulacao = item.dados.simulacao as SimulacaoJuros;
    const valor = simulacao.parametros.valorInicial;
    
    if (!dadosPorMes.has(mes)) {
      dadosPorMes.set(mes, []);
    }
    dadosPorMes.get(mes)!.push(valor);
  });

  // Calcular médias mensais
  const mediasPorMes = Array.from(dadosPorMes.entries()).map(([mes, valores]) => ({
    mes,
    media: valores.reduce((a, b) => a + b, 0) / valores.length,
    count: valores.length
  }));

  // Detectar sazonalidade significativa
  if (mediasPorMes.length >= 6) {
    const medias = mediasPorMes.map(m => m.media);
    const mediaGeral = medias.reduce((a, b) => a + b, 0) / medias.length;
    const variacao = Math.max(...medias) - Math.min(...medias);
    const coeficienteVariacao = (variacao / mediaGeral) * 100;

    if (coeficienteVariacao > 20) {
      padroes.push({
        id: 'sazonalidade_mensal',
        tipo: 'valor_inicial',
        tendencia: 'estavel',
        variacao: coeficienteVariacao,
        frequencia: mediasPorMes.length,
        ultimaOcorrencia: new Date(),
        confianca: Math.min(90, coeficienteVariacao * 2)
      });
    }
  }

  return padroes;
};

// Analisar correlações entre variáveis
const analisarCorrelacoes = (historico: HistoricoItem[]): PadraoInvestimento[] => {
  const padroes: PadraoInvestimento[] = [];
  
  if (historico.length < 5) return padroes;

  const dados = historico.map(item => {
    const simulacao = item.dados.simulacao as SimulacaoJuros;
    const resultado = item.dados.resultado as ResultadoSimulacao;
    
    return {
      valorInicial: simulacao.parametros.valorInicial,
      valorMensal: simulacao.parametros.valorMensal || 0,
      periodo: simulacao.parametros.periodo,
      taxa: simulacao.parametros.taxa,
      rendimento: resultado?.valorFinal ? (resultado.valorFinal - simulacao.parametros.valorInicial) : 0
    };
  });

  // Correlação período vs rendimento
  const correlacaoPeriodoRendimento = calcularCorrelacao(
    dados.map(d => d.periodo),
    dados.map(d => d.rendimento)
  );

  if (Math.abs(correlacaoPeriodoRendimento) > 0.7) {
    padroes.push({
      id: 'correlacao_periodo_rendimento',
      tipo: 'periodo',
      tendencia: correlacaoPeriodoRendimento > 0 ? 'crescente' : 'decrescente',
      variacao: Math.abs(correlacaoPeriodoRendimento) * 100,
      frequencia: dados.length,
      ultimaOcorrencia: new Date(),
      confianca: Math.abs(correlacaoPeriodoRendimento) * 100
    });
  }

  return padroes;
};

// Calcular correlação de Pearson
const calcularCorrelacao = (x: number[], y: number[]): number => {
  const n = x.length;
  if (n !== y.length || n < 2) return 0;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerador = n * sumXY - sumX * sumY;
  const denominador = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

  return denominador === 0 ? 0 : numerador / denominador;
};

// Detectar anomalias nos padrões
const detectarAnomalias = (historico: HistoricoItem[]): PadraoInvestimento[] => {
  const padroes: PadraoInvestimento[] = [];
  
  if (historico.length < 10) return padroes;

  const valores = historico.map(item => {
    const simulacao = item.dados.simulacao as SimulacaoJuros;
    return simulacao.parametros.valorInicial;
  });

  const media = valores.reduce((a, b) => a + b, 0) / valores.length;
  const desvio = Math.sqrt(valores.reduce((sum, v) => sum + Math.pow(v - media, 2), 0) / valores.length);
  
  // Detectar outliers (valores fora de 2 desvios padrão)
  const outliers = valores.filter(v => Math.abs(v - media) > 2 * desvio);
  
  if (outliers.length > 0) {
    padroes.push({
      id: 'anomalias_detectadas',
      tipo: 'valor_inicial',
      tendencia: 'estavel',
      variacao: (outliers.length / valores.length) * 100,
      frequencia: outliers.length,
      ultimaOcorrencia: new Date(),
      confianca: Math.min(95, (outliers.length / valores.length) * 200)
    });
  }

  return padroes;
};

// Gerar sugestões inteligentes baseadas em análise comportamental
export const gerarSugestoes = (
  historico: HistoricoItem[],
  padroes: PadraoInvestimento[]
): SugestaoPersonalizada[] => {
  const sugestoes: SugestaoPersonalizada[] = [];
  
  if (historico.length === 0) return sugestoes;

  const ultimaSimulacao = historico[historico.length - 1];
  const simulacao = ultimaSimulacao.dados.simulacao as SimulacaoJuros;
  const resultado = ultimaSimulacao.dados.resultado as ResultadoSimulacao;

  // Análise comportamental para sugestões personalizadas
  const analiseComportamental = analisarComportamento(historico);
  
  // Sugestões baseadas no perfil comportamental
  if (analiseComportamental.perfil === 'conservador') {
    sugestoes.push(...gerarSugestoesConservadoras(simulacao, resultado, historico));
  } else if (analiseComportamental.perfil === 'arrojado') {
    sugestoes.push(...gerarSugestoesArrojadas(simulacao, resultado, historico));
  } else {
    sugestoes.push(...gerarSugestoesModeradas(simulacao, resultado, historico));
  }

  // Sugestões baseadas em padrões identificados
  sugestoes.push(...gerarSugestoesPorPadroes(padroes, simulacao, resultado));

  // Sugestões de otimização baseadas em machine learning simulado
  sugestoes.push(...gerarSugestoesOtimizacao(historico));

  return sugestoes.slice(0, 10); // Limitar a 10 sugestões mais relevantes
};

// Análise comportamental avançada
export const analisarComportamento = (historico: HistoricoItem[]): AnaliseComportamental => {
  if (historico.length === 0) {
    return {
      id: 'analise_inicial',
      perfil: 'moderado',
      caracteristicas: {
        frequenciaSimulacoes: 0,
        valorMedioInvestido: 0,
        periodoMedioInvestimento: 0,
        diversificacao: 0,
        consistencia: 0,
        toleranciaRisco: 50
      },
      tendencias: {
        aumentoAportes: false,
        extensaoPrazos: false,
        diversificacaoModalidades: false,
        buscaMaiorRentabilidade: false
      },
      recomendacoes: ['Comece criando algumas simulações para entender melhor seu perfil']
    };
  }

  const agora = new Date();
  const primeiraSimulacao = new Date(Math.min(...historico.map(h => h.dataCreacao.getTime())));
  const diasAtivos = Math.max(1, (agora.getTime() - primeiraSimulacao.getTime()) / (1000 * 60 * 60 * 24));
  
  const frequenciaSimulacoes = (historico.length / diasAtivos) * 30; // Por mês

  const valores = historico.map(item => {
    const simulacao = item.dados.simulacao as SimulacaoJuros;
    return simulacao.parametros.valorInicial + (simulacao.parametros.valorMensal || 0) * simulacao.parametros.periodo;
  });

  const periodos = historico.map(item => {
    const simulacao = item.dados.simulacao as SimulacaoJuros;
    return simulacao.parametros.periodo;
  });

  const taxas = historico.map(item => {
    const simulacao = item.dados.simulacao as SimulacaoJuros;
    return simulacao.parametros.taxa;
  });

  const valorMedioInvestido = valores.reduce((a, b) => a + b, 0) / valores.length;
  const periodoMedioInvestimento = periodos.reduce((a, b) => a + b, 0) / periodos.length;
  
  // Calcular diversificação (variação nas modalidades)
  const modalidades = new Set(historico.map(item => {
    const simulacao = item.dados.simulacao as SimulacaoJuros;
    return simulacao.modalidade?.id || 'default';
  }));
  const diversificacao = Math.min(100, (modalidades.size / Math.max(1, historico.length)) * 100);

  // Calcular consistência (regularidade nas simulações)
  const intervalos = [];
  for (let i = 1; i < historico.length; i++) {
    const intervalo = historico[i].dataCreacao.getTime() - historico[i-1].dataCreacao.getTime();
    intervalos.push(intervalo / (1000 * 60 * 60 * 24)); // Em dias
  }
  const mediaIntervalos = intervalos.length > 0 ? intervalos.reduce((a, b) => a + b, 0) / intervalos.length : 0;
  const desvioIntervalos = intervalos.length > 0 ? Math.sqrt(intervalos.reduce((sum, i) => sum + Math.pow(i - mediaIntervalos, 2), 0) / intervalos.length) : 0;
  const consistencia = Math.max(0, 100 - (desvioIntervalos / Math.max(1, mediaIntervalos)) * 100);

  // Calcular tolerância ao risco (baseado nas taxas escolhidas)
  const taxaMedia = taxas.reduce((a, b) => a + b, 0) / taxas.length;
  const toleranciaRisco = Math.min(100, Math.max(0, (taxaMedia - 8) * 10)); // Normalizar para 0-100

  // Determinar perfil
  let perfil: 'conservador' | 'moderado' | 'arrojado' = 'moderado';
  if (toleranciaRisco < 30 && periodoMedioInvestimento > 36) {
    perfil = 'conservador';
  } else if (toleranciaRisco > 70 && diversificacao > 60) {
    perfil = 'arrojado';
  }

  // Analisar tendências
  const tendencias = {
    aumentoAportes: analisarTendenciaAportes(historico),
    extensaoPrazos: analisarTendenciaPrazos(historico),
    diversificacaoModalidades: modalidades.size > 1,
    buscaMaiorRentabilidade: analisarTendenciaRentabilidade(historico)
  };

  // Gerar recomendações personalizadas
  const recomendacoes = gerarRecomendacoesComportamentais(perfil, tendencias, {
    frequenciaSimulacoes,
    valorMedioInvestido,
    periodoMedioInvestimento,
    diversificacao,
    consistencia,
    toleranciaRisco
  });

  return {
    id: `analise_${Date.now()}`,
    perfil,
    caracteristicas: {
      frequenciaSimulacoes,
      valorMedioInvestido,
      periodoMedioInvestimento,
      diversificacao,
      consistencia,
      toleranciaRisco
    },
    tendencias,
    recomendacoes
  };
};

// Funções auxiliares para análise de tendências
const analisarTendenciaAportes = (historico: HistoricoItem[]): boolean => {
  if (historico.length < 3) return false;
  
  const aportes = historico.map(item => {
    const simulacao = item.dados.simulacao as SimulacaoJuros;
    return simulacao.parametros.valorMensal || 0;
  });
  
  const tendencia = calcularTendenciaAvancada(aportes);
  return tendencia.variacao > 10 && tendencia.confianca > 0.6;
};

const analisarTendenciaPrazos = (historico: HistoricoItem[]): boolean => {
  if (historico.length < 3) return false;
  
  const prazos = historico.map(item => {
    const simulacao = item.dados.simulacao as SimulacaoJuros;
    return simulacao.parametros.periodo;
  });
  
  const tendencia = calcularTendenciaAvancada(prazos);
  return tendencia.variacao > 15 && tendencia.confianca > 0.6;
};

const analisarTendenciaRentabilidade = (historico: HistoricoItem[]): boolean => {
  if (historico.length < 3) return false;
  
  const taxas = historico.map(item => {
    const simulacao = item.dados.simulacao as SimulacaoJuros;
    return simulacao.parametros.taxa;
  });
  
  const tendencia = calcularTendenciaAvancada(taxas);
  return tendencia.variacao > 5 && tendencia.confianca > 0.6;
};

// Gerar recomendações comportamentais
const gerarRecomendacoesComportamentais = (
  perfil: 'conservador' | 'moderado' | 'arrojado',
  tendencias: any,
  caracteristicas: any
): string[] => {
  const recomendacoes: string[] = [];

  if (perfil === 'conservador') {
    recomendacoes.push('Considere diversificar em produtos de renda fixa com diferentes prazos');
    recomendacoes.push('Mantenha uma reserva de emergência antes de investir');
    if (caracteristicas.periodoMedioInvestimento < 24) {
      recomendacoes.push('Pense em prazos mais longos para potencializar os juros compostos');
    }
  } else if (perfil === 'arrojado') {
    recomendacoes.push('Explore diferentes modalidades de investimento para maximizar retornos');
    recomendacoes.push('Considere aumentar aportes mensais em momentos de oportunidade');
    if (caracteristicas.diversificacao < 50) {
      recomendacoes.push('Aumente a diversificação para reduzir riscos');
    }
  } else {
    recomendacoes.push('Equilibre investimentos conservadores e moderados');
    recomendacoes.push('Monitore regularmente o desempenho de seus investimentos');
  }

  if (caracteristicas.consistencia < 60) {
    recomendacoes.push('Tente manter uma frequência regular de análise de investimentos');
  }

  if (tendencias.aumentoAportes) {
    recomendacoes.push('Excelente! Continue aumentando seus aportes gradualmente');
  }

  return recomendacoes;
};

// Gerar sugestões por perfil
const gerarSugestoesConservadoras = (
  simulacao: SimulacaoJuros,
  resultado: ResultadoSimulacao,
  historico: HistoricoItem[]
): SugestaoPersonalizada[] => {
  const sugestoes: SugestaoPersonalizada[] = [];

  // Sugestão de prazo mais longo para conservadores
  if (simulacao.parametros.periodo < 36) {
    sugestoes.push({
      id: 'conservador_prazo_longo',
      tipo: 'otimizacao',
      titulo: 'Considere um prazo mais longo',
      descricao: 'Para seu perfil conservador, prazos mais longos oferecem maior segurança e melhor aproveitamento dos juros compostos.',
      impacto: 'medio',
      prioridade: 'alta',
      categoria: 'Otimização Conservadora',
      acoes: [{
        id: 'aumentar_prazo_conservador',
        descricao: 'Aumentar prazo para 36-60 meses',
        tipo: 'mudanca_periodo',
        parametros: { periodo: 48 },
        impactoEstimado: { rendimentoAdicional: 0 }
      }],
      baseadoEm: [historico[historico.length - 1]?.id || ''],
      dataCriacao: new Date(),
      visualizada: false,
      aplicada: false
    });
  }

  return sugestoes;
};

const gerarSugestoesArrojadas = (
  simulacao: SimulacaoJuros,
  resultado: ResultadoSimulacao,
  historico: HistoricoItem[]
): SugestaoPersonalizada[] => {
  const sugestoes: SugestaoPersonalizada[] = [];

  // Sugestão de diversificação para arrojados
  sugestoes.push({
    id: 'arrojado_diversificacao',
    tipo: 'diversificacao',
    titulo: 'Explore diferentes modalidades',
    descricao: 'Seu perfil arrojado permite explorar diferentes tipos de investimento para maximizar retornos.',
    impacto: 'alto',
    prioridade: 'alta',
    categoria: 'Diversificação Arrojada',
    acoes: [{
      id: 'diversificar_modalidades',
      descricao: 'Experimentar diferentes modalidades de investimento',
      tipo: 'nova_modalidade',
      parametros: { explorarNovasModalidades: true },
      impactoEstimado: { rendimentoAdicional: 0 }
    }],
    baseadoEm: [historico[historico.length - 1]?.id || ''],
    dataCriacao: new Date(),
    visualizada: false,
    aplicada: false
  });

  return sugestoes;
};

const gerarSugestoesModeradas = (
  simulacao: SimulacaoJuros,
  resultado: ResultadoSimulacao,
  historico: HistoricoItem[]
): SugestaoPersonalizada[] => {
  const sugestoes: SugestaoPersonalizada[] = [];

  // Sugestão de equilíbrio para moderados
  sugestoes.push({
    id: 'moderado_equilibrio',
    tipo: 'otimizacao',
    titulo: 'Mantenha o equilíbrio',
    descricao: 'Seu perfil moderado está bem balanceado. Continue diversificando com prudência.',
    impacto: 'medio',
    prioridade: 'media',
    categoria: 'Estratégia Moderada',
    acoes: [{
      id: 'manter_equilibrio',
      descricao: 'Manter estratégia equilibrada',
      tipo: 'ajuste_valor',
      parametros: { manterEstrategia: true },
      impactoEstimado: { rendimentoAdicional: 0 }
    }],
    baseadoEm: [historico[historico.length - 1]?.id || ''],
    dataCriacao: new Date(),
    visualizada: false,
    aplicada: false
  });

  return sugestoes;
};

// Gerar métricas de performance avançadas
export const gerarMetricasPerformance = (historico: HistoricoItem[]): MetricaPerformance[] => {
  const metricas: MetricaPerformance[] = [];
  
  if (historico.length === 0) return metricas;

  // Métrica de rendimento médio
  const rendimentos = historico.map(item => {
    const simulacao = item.dados.simulacao as SimulacaoJuros;
    const resultado = item.dados.resultado as ResultadoSimulacao;
    if (!resultado) return 0;
    
    const investido = simulacao.parametros.valorInicial + (simulacao.parametros.valorMensal || 0) * simulacao.parametros.periodo;
    return ((resultado.valorFinal - investido) / investido) * 100;
  }).filter(r => r > 0);

  if (rendimentos.length > 0) {
    const rendimentoMedio = rendimentos.reduce((a, b) => a + b, 0) / rendimentos.length;
    const benchmark = 12; // CDI médio como benchmark
    
    metricas.push({
      id: 'rendimento_medio',
      nome: 'Rendimento Médio',
      valor: rendimentoMedio,
      unidade: '%',
      tendencia: rendimentoMedio > benchmark ? 'positiva' : 'negativa',
      variacao: rendimentoMedio - benchmark,
      benchmark,
      categoria: 'rentabilidade',
      descricao: 'Rendimento médio projetado dos seus investimentos'
    });
  }

  // Métrica de consistência
  if (historico.length >= 3) {
    const intervalos = [];
    for (let i = 1; i < historico.length; i++) {
      const intervalo = historico[i].dataCreacao.getTime() - historico[i-1].dataCreacao.getTime();
      intervalos.push(intervalo / (1000 * 60 * 60 * 24)); // Em dias
    }
    
    const mediaIntervalos = intervalos.reduce((a, b) => a + b, 0) / intervalos.length;
    const desvioIntervalos = Math.sqrt(intervalos.reduce((sum, i) => sum + Math.pow(i - mediaIntervalos, 2), 0) / intervalos.length);
    const consistencia = Math.max(0, 100 - (desvioIntervalos / Math.max(1, mediaIntervalos)) * 100);
    
    metricas.push({
      id: 'consistencia',
      nome: 'Consistência',
      valor: consistencia,
      unidade: '%',
      tendencia: consistencia > 70 ? 'positiva' : consistencia > 40 ? 'neutra' : 'negativa',
      variacao: 0,
      benchmark: 70,
      categoria: 'diversificacao',
      descricao: 'Regularidade na análise de investimentos'
    });
  }

  // Métrica de diversificação
  const modalidades = new Set(historico.map(item => {
    const simulacao = item.dados.simulacao as SimulacaoJuros;
    return simulacao.modalidade?.id || 'default';
  }));
  
  const diversificacao = Math.min(100, (modalidades.size / Math.max(1, historico.length)) * 100);
  
  metricas.push({
    id: 'diversificacao',
    nome: 'Diversificação',
    valor: diversificacao,
    unidade: '%',
    tendencia: diversificacao > 50 ? 'positiva' : diversificacao > 25 ? 'neutra' : 'negativa',
    variacao: 0,
    benchmark: 50,
    categoria: 'diversificacao',
    descricao: 'Nível de diversificação dos seus investimentos'
  });

  // Métrica de valor médio investido
  const valores = historico.map(item => {
    const simulacao = item.dados.simulacao as SimulacaoJuros;
    return simulacao.parametros.valorInicial + (simulacao.parametros.valorMensal || 0) * simulacao.parametros.periodo;
  });
  
  const valorMedio = valores.reduce((a, b) => a + b, 0) / valores.length;
  
  metricas.push({
    id: 'valor_medio_investido',
    nome: 'Valor Médio Investido',
    valor: valorMedio,
    unidade: 'R$',
    tendencia: 'neutra',
    variacao: 0,
    categoria: 'liquidez',
    descricao: 'Valor médio dos seus investimentos'
  });

  return metricas;
};

// Gerar alertas inteligentes
export const gerarAlertas = (
  historico: HistoricoItem[],
  padroes: PadraoInvestimento[]
): AlertaOportunidade[] => {
  const alertas: AlertaOportunidade[] = [];
  
  if (historico.length === 0) return alertas;

  // Alerta de oportunidade de aumento de aportes
  const ultimaSimulacao = historico[historico.length - 1];
  const simulacao = ultimaSimulacao.dados.simulacao as SimulacaoJuros;
  
  if ((simulacao.parametros.valorMensal || 0) < 1000) {
    alertas.push({
      id: 'oportunidade_aumento_aportes',
      tipo: 'rebalanceamento',
      titulo: 'Oportunidade de Aumento de Aportes',
      descricao: 'Aumentar seus aportes mensais pode significativamente melhorar seus resultados.',
      urgencia: 'media',
      categoria: 'Otimização',
      acaoRecomendada: 'Considere aumentar o valor mensal investido',
      parametros: { valorSugerido: Math.min((simulacao.parametros.valorMensal || 0) * 1.5, 2000) },
      visualizado: false,
      descartado: false
    });
  }

  // Alerta baseado em padrões
  const padraoDecrescente = padroes.find(p => p.tendencia === 'decrescente' && p.confianca > 70);
  if (padraoDecrescente) {
    alertas.push({
      id: 'alerta_tendencia_negativa',
      tipo: 'rebalanceamento',
      titulo: 'Tendência Negativa Detectada',
      descricao: `Foi detectada uma tendência decrescente em ${padraoDecrescente.tipo.replace('_', ' ')}.`,
      urgencia: 'alta',
      categoria: 'Análise de Padrões',
      acaoRecomendada: 'Revisar estratégia de investimento',
      parametros: { padrao: padraoDecrescente.id },
      visualizado: false,
      descartado: false
    });
  }

  return alertas;
};

// Função principal para gerar dashboard completo
export const gerarDashboardInsights = (historico: HistoricoItem[]): DashboardInsights => {
  const padroes = analisarPadroes(historico);
  const sugestoes = gerarSugestoes(historico, padroes);
  const metricas = gerarMetricasPerformance(historico);
  const alertas = gerarAlertas(historico, padroes);
  const analiseComportamental = analisarComportamento(historico);

  // Calcular resumo executivo
  const resumoExecutivo = {
    totalSimulacoes: historico.length,
    rendimentoMedioProjetado: metricas.find(m => m.id === 'rendimento_medio')?.valor || 0,
    metasProximas: 0, // Será implementado quando integrar com metas
    oportunidadesIdentificadas: alertas.length,
    pontuacaoGeral: calcularPontuacaoGeral(metricas, analiseComportamental)
  };

  return {
    padroes,
    sugestoes,
    metricas,
    alertas,
    analiseComportamental,
    resumoExecutivo
  };
};

// Calcular pontuação geral
const calcularPontuacaoGeral = (
  metricas: MetricaPerformance[],
  analiseComportamental: AnaliseComportamental
): number => {
  const rendimento = metricas.find(m => m.id === 'rendimento_medio')?.valor || 0;
  const consistencia = metricas.find(m => m.id === 'consistencia')?.valor || 0;
  const diversificacao = metricas.find(m => m.id === 'diversificacao')?.valor || 0;
  
  // Fórmula ponderada para pontuação geral
  const pontuacao = (
    (Math.min(100, Math.max(0, rendimento * 5)) * 0.4) + // 40% rendimento
    (consistencia * 0.3) + // 30% consistência
    (diversificacao * 0.3) // 30% diversificação
  );
  
  return Math.round(pontuacao);
};

// Funções auxiliares para formatação
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

export const formatarPorcentagem = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  }).format(valor / 100);
};

// Verificar conquistas
export const verificarConquistas = (
  historico: HistoricoItem[],
  conquistasExistentes: ConquistaInsights[]
): ConquistaInsights[] => {
  const novasConquistas: ConquistaInsights[] = [];
  const idsExistentes = new Set(conquistasExistentes.map(c => c.id));

  // Conquista: Primeira simulação
  if (historico.length >= 1 && !idsExistentes.has('primeira_simulacao')) {
    novasConquistas.push({
      id: 'primeira_simulacao',
      nome: 'Primeiro Passo',
      descricao: 'Criou sua primeira simulação de investimento',
      icone: '🎯',
      categoria: 'simulacoes',
      criterio: { minSimulacoes: 1 },
      recompensa: { pontos: 10 },
      desbloqueada: true,
      dataDesbloqueio: new Date()
    });
  }

  // Conquista: 10 simulações
  if (historico.length >= 10 && !idsExistentes.has('dez_simulacoes')) {
    novasConquistas.push({
      id: 'dez_simulacoes',
      nome: 'Explorador',
      descricao: 'Criou 10 simulações de investimento',
      icone: '🔍',
      categoria: 'simulacoes',
      criterio: { minSimulacoes: 10 },
      recompensa: { pontos: 50 },
      desbloqueada: true,
      dataDesbloqueio: new Date()
    });
  }

  // Conquista: Consistência
  const analise = analisarComportamento(historico);
  if (analise.caracteristicas.consistencia > 80 && !idsExistentes.has('consistente')) {
    novasConquistas.push({
      id: 'consistente',
      nome: 'Disciplinado',
      descricao: 'Mantém alta consistência nas análises',
      icone: '📈',
      categoria: 'consistencia',
      criterio: { minConsistencia: 80 },
      recompensa: { pontos: 100 },
      desbloqueada: true,
      dataDesbloqueio: new Date()
    });
  }

  return novasConquistas;
};

// Calcular pontuação do usuário
export const calcularPontuacaoUsuario = (
  historico: HistoricoItem[],
  conquistas: ConquistaInsights[]
): PontuacaoUsuario => {
  const analise = analisarComportamento(historico);
  
  const pontosPorConquistas = conquistas.reduce((total, c) => total + c.recompensa.pontos, 0);
  const pontosPorSimulacoes = historico.length * 5;
  const pontosPorConsistencia = Math.round(analise.caracteristicas.consistencia);
  const pontosPorDiversificacao = Math.round(analise.caracteristicas.diversificacao);
  
  const categorias = {
    planejamento: pontosPorSimulacoes,
    consistencia: pontosPorConsistencia,
    otimizacao: pontosPorConquistas,
    diversificacao: pontosPorDiversificacao
  };
  
  const total = Object.values(categorias).reduce((a, b) => a + b, 0);
  
  // Calcular nível (a cada 100 pontos)
  const nivel = Math.floor(total / 100) + 1;
  const pontosProximoNivel = (nivel * 100) - total;
  
  return {
    total,
    categorias,
    nivel,
    proximoNivel: {
      pontosNecessarios: pontosProximoNivel,
      beneficios: [`Nível ${nivel + 1}`, 'Novas funcionalidades', 'Análises mais detalhadas']
    },
    conquistas
  };
};

// Implementar funções que estavam faltando
const gerarSugestoesPorPadroes = (
  padroes: PadraoInvestimento[],
  simulacao: SimulacaoJuros,
  resultado: ResultadoSimulacao
): SugestaoPersonalizada[] => {
  const sugestoes: SugestaoPersonalizada[] = [];
  
  padroes.forEach(padrao => {
    if (padrao.confianca > 70) {
      sugestoes.push({
        id: `padrao_${padrao.id}`,
        tipo: 'otimizacao',
        titulo: `Padrão identificado: ${padrao.tipo.replace('_', ' ')}`,
        descricao: `Foi detectado um padrão ${padrao.tendencia} com ${padrao.confianca.toFixed(0)}% de confiança.`,
        impacto: padrao.confianca > 85 ? 'alto' : 'medio',
        prioridade: padrao.confianca > 85 ? 'alta' : 'media',
        categoria: 'Análise de Padrões',
        acoes: [{
          id: `acao_${padrao.id}`,
          descricao: `Aproveitar padrão ${padrao.tendencia}`,
          tipo: 'ajuste_valor',
          parametros: { padrao: padrao.id },
          impactoEstimado: { rendimentoAdicional: 0 }
        }],
        baseadoEm: [],
        dataCriacao: new Date(),
        visualizada: false,
        aplicada: false
      });
    }
  });
  
  return sugestoes;
};

const gerarSugestoesOtimizacao = (historico: HistoricoItem[]): SugestaoPersonalizada[] => {
  const sugestoes: SugestaoPersonalizada[] = [];
  
  if (historico.length < 3) return sugestoes;
  
  // Análise de otimização baseada em machine learning simulado
  const analise = analisarComportamento(historico);
  
  if (analise.caracteristicas.valorMedioInvestido < 10000) {
    sugestoes.push({
      id: 'otimizacao_ml_valor',
      tipo: 'otimizacao',
      titulo: 'Oportunidade de Crescimento',
      descricao: 'Baseado em análise preditiva, aumentar o valor investido pode gerar melhores resultados.',
      impacto: 'alto',
      prioridade: 'media',
      categoria: 'Machine Learning',
      acoes: [{
        id: 'aumentar_investimento',
        descricao: 'Aumentar valor investido gradualmente',
        tipo: 'ajuste_valor',
        parametros: { sugestaoML: true },
        impactoEstimado: { rendimentoAdicional: 0 }
      }],
      baseadoEm: [],
      dataCriacao: new Date(),
      visualizada: false,
      aplicada: false
    });
  }
  
  return sugestoes;
};

// Função auxiliar para calcular métricas (compatibilidade)
export const calcularMetricas = gerarMetricasPerformance;