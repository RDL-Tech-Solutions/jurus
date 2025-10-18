import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { SimulacaoInput } from '../types';

export interface CenarioEconomico {
  id: string;
  nome: string;
  descricao: string;
  parametros: {
    inflacao: number;
    cdi: number;
    selic: number;
    crescimentoPIB: number;
    volatilidade: number;
  };
  probabilidade: number;
  impacto: 'positivo' | 'negativo' | 'neutro';
  cor: string;
}

export interface ResultadoCenario {
  cenario: CenarioEconomico;
  valorFinal: number;
  rendimentoReal: number;
  perdaPoder: number;
  risco: number;
  recomendacao: string;
  trajetoria?: number[];
  var95?: number;
  var99?: number;
}

export interface StressTesting {
  cenarioOtimista: ResultadoCenario;
  cenarioRealista: ResultadoCenario;
  cenarioPessimista: ResultadoCenario;
  worstCase: ResultadoCenario;
  bestCase: ResultadoCenario;
  probabilidadePerda: number;
  maxDrawdown: number;
}

export interface MonteCarloResult {
  simulacoes: number[];
  percentis: {
    p5: number;
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p95: number;
  };
  probabilidadeObjetivo: number;
  valorEsperado: number;
  desvio: number;
  sharpeRatio: number;
}

export interface BacktestResult {
  periodo: string;
  retornoAnualizado: number;
  volatilidade: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  trajetoriaHistorica: number[];
}

export interface CorrelacaoAtivos {
  ativo1: string;
  ativo2: string;
  correlacao: number;
  beta: number;
  risco: 'baixo' | 'medio' | 'alto';
}

export const useSimuladorCenarios = (simulacao: SimulacaoInput) => {
  const [cenarios, setCenarios] = useState<CenarioEconomico[]>([]);
  const [resultados, setResultados] = useState<ResultadoCenario[]>([]);
  const [stressTesting, setStressTesting] = useState<StressTesting | null>(null);
  const [monteCarloResult, setMonteCarloResult] = useState<MonteCarloResult | null>(null);
  const [backtestResults, setBacktestResults] = useState<BacktestResult[]>([]);
  const [correlacoes, setCorrelacoes] = useState<CorrelacaoAtivos[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cenarioSelecionado, setCenarioSelecionado] = useState<string>('');

  const [configuracoes, setConfiguracoes] = useLocalStorage('cenarios-config', {
    incluirInflacao: true,
    incluirVolatilidade: true,
    periodoAnalise: 12,
    nivelConfianca: 95,
    numeroSimulacoes: 10000,
    objetivoValor: 0,
    incluirMonteCarlo: true,
    incluirBacktest: true,
    incluirCorrelacao: true
  });

  // Cenários pré-definidos expandidos
  const cenariosBase: CenarioEconomico[] = [
    {
      id: 'otimista',
      nome: 'Cenário Otimista',
      descricao: 'Economia em crescimento, inflação controlada',
      parametros: {
        inflacao: 3.5,
        cdi: 12.0,
        selic: 12.0,
        crescimentoPIB: 3.0,
        volatilidade: 8.0
      },
      probabilidade: 25,
      impacto: 'positivo',
      cor: '#10B981'
    },
    {
      id: 'realista',
      nome: 'Cenário Realista',
      descricao: 'Condições econômicas atuais mantidas',
      parametros: {
        inflacao: 4.5,
        cdi: 13.75,
        selic: 13.75,
        crescimentoPIB: 1.5,
        volatilidade: 12.0
      },
      probabilidade: 50,
      impacto: 'neutro',
      cor: '#3B82F6'
    },
    {
      id: 'pessimista',
      nome: 'Cenário Pessimista',
      descricao: 'Recessão econômica, alta inflação',
      parametros: {
        inflacao: 7.0,
        cdi: 15.0,
        selic: 15.0,
        crescimentoPIB: -1.0,
        volatilidade: 18.0
      },
      probabilidade: 20,
      impacto: 'negativo',
      cor: '#F59E0B'
    },
    {
      id: 'crise',
      nome: 'Crise Severa',
      descricao: 'Crise econômica profunda, hiperinflação',
      parametros: {
        inflacao: 12.0,
        cdi: 20.0,
        selic: 20.0,
        crescimentoPIB: -3.0,
        volatilidade: 25.0
      },
      probabilidade: 5,
      impacto: 'negativo',
      cor: '#EF4444'
    },
    {
      id: 'boom',
      nome: 'Boom Econômico',
      descricao: 'Crescimento acelerado, mercado aquecido',
      parametros: {
        inflacao: 2.5,
        cdi: 10.0,
        selic: 10.0,
        crescimentoPIB: 5.0,
        volatilidade: 15.0
      },
      probabilidade: 10,
      impacto: 'positivo',
      cor: '#8B5CF6'
    },
    {
      id: 'estagflacao',
      nome: 'Estagflação',
      descricao: 'Alta inflação com baixo crescimento',
      parametros: {
        inflacao: 9.0,
        cdi: 16.0,
        selic: 16.0,
        crescimentoPIB: 0.5,
        volatilidade: 20.0
      },
      probabilidade: 8,
      impacto: 'negativo',
      cor: '#DC2626'
    },
    {
      id: 'deflacao',
      nome: 'Deflação',
      descricao: 'Queda de preços, recessão prolongada',
      parametros: {
        inflacao: -1.0,
        cdi: 8.0,
        selic: 8.0,
        crescimentoPIB: -2.0,
        volatilidade: 22.0
      },
      probabilidade: 3,
      impacto: 'negativo',
      cor: '#7C2D12'
    }
  ];

  // Função para gerar números aleatórios com distribuição normal
  const boxMullerTransform = useCallback(() => {
    const u = 0.5 - Math.random();
    const v = 0.5 - Math.random();
    const z = Math.sqrt(-2.0 * Math.log(Math.sqrt(u * u + v * v))) * (u / Math.sqrt(u * u + v * v));
    return z;
  }, []);

  // Calcular resultado para um cenário específico com trajetória
  const calcularResultadoCenario = useCallback((cenario: CenarioEconomico, incluirTrajetoria = false): ResultadoCenario => {
    const { valorInicial, valorMensal, periodo } = simulacao;
    const { inflacao, cdi, volatilidade } = cenario.parametros;
    
    let valorFinal = valorInicial;
    let totalAportes = 0;
    const trajetoria: number[] = incluirTrajetoria ? [valorInicial] : [];
    const retornosMensais: number[] = [];
    
    for (let mes = 1; mes <= periodo; mes++) {
      // Adicionar aporte mensal
      valorFinal += valorMensal;
      totalAportes += valorMensal;
      
      // Aplicar rendimento com volatilidade usando distribuição normal
      const rendimentoMes = (cdi/100) / 12;
      const volatilidade_mes = (volatilidade/100) / Math.sqrt(12);
      const fatorVolatilidade = 1 + boxMullerTransform() * volatilidade_mes;
      
      const retornoMes = rendimentoMes * fatorVolatilidade;
      valorFinal *= (1 + retornoMes);
      retornosMensais.push(retornoMes);
      
      if (incluirTrajetoria) {
        trajetoria.push(valorFinal);
      }
    }
    
    const totalInvestido = valorInicial + totalAportes;
    const rendimentoReal = ((valorFinal - totalInvestido) / totalInvestido) * 100;
    
    // Calcular perda de poder de compra
    const valorFinalReal = valorFinal / Math.pow(1 + inflacao/100, periodo/12);
    const perdaPoder = ((valorFinal - valorFinalReal) / valorFinal) * 100;
    
    // Calcular risco (baseado na volatilidade e cenário)
    const risco = volatilidade * (cenario.impacto === 'negativo' ? 1.5 : cenario.impacto === 'positivo' ? 0.8 : 1);
    
    // Calcular VaR (Value at Risk)
    const retornosOrdenados = retornosMensais.sort((a, b) => a - b);
    const var95 = retornosOrdenados[Math.floor(retornosOrdenados.length * 0.05)] * valorFinal;
    const var99 = retornosOrdenados[Math.floor(retornosOrdenados.length * 0.01)] * valorFinal;
    
    // Gerar recomendação
    let recomendacao = '';
    if (rendimentoReal > 15) {
      recomendacao = 'Excelente oportunidade de investimento com alto potencial';
    } else if (rendimentoReal > 10) {
      recomendacao = 'Boa rentabilidade esperada, risco controlado';
    } else if (rendimentoReal > 5) {
      recomendacao = 'Rentabilidade moderada, considere diversificar';
    } else if (rendimentoReal > 0) {
      recomendacao = 'Baixa rentabilidade, avalie outras opções';
    } else {
      recomendacao = 'Alto risco de perda, considere investimentos mais conservadores';
    }
    
    return {
      cenario,
      valorFinal,
      rendimentoReal,
      perdaPoder,
      risco,
      recomendacao,
      trajetoria: incluirTrajetoria ? trajetoria : undefined,
      var95,
      var99
    };
  }, [simulacao, boxMullerTransform]);

  // Simulação Monte Carlo
  const executarMonteCarlo = useCallback(async (): Promise<MonteCarloResult> => {
    const numeroSimulacoes = configuracoes.numeroSimulacoes;
    const simulacoes: number[] = [];
    const cenarioBase = cenariosBase.find(c => c.id === 'realista')!;
    
    for (let i = 0; i < numeroSimulacoes; i++) {
      const resultado = calcularResultadoCenario(cenarioBase);
      simulacoes.push(resultado.valorFinal);
    }
    
    simulacoes.sort((a, b) => a - b);
    
    const percentis = {
      p5: simulacoes[Math.floor(numeroSimulacoes * 0.05)],
      p10: simulacoes[Math.floor(numeroSimulacoes * 0.10)],
      p25: simulacoes[Math.floor(numeroSimulacoes * 0.25)],
      p50: simulacoes[Math.floor(numeroSimulacoes * 0.50)],
      p75: simulacoes[Math.floor(numeroSimulacoes * 0.75)],
      p90: simulacoes[Math.floor(numeroSimulacoes * 0.90)],
      p95: simulacoes[Math.floor(numeroSimulacoes * 0.95)]
    };
    
    const valorEsperado = simulacoes.reduce((a, b) => a + b, 0) / numeroSimulacoes;
    const variancia = simulacoes.reduce((acc, val) => acc + Math.pow(val - valorEsperado, 2), 0) / numeroSimulacoes;
    const desvio = Math.sqrt(variancia);
    
    const probabilidadeObjetivo = configuracoes.objetivoValor > 0 
      ? (simulacoes.filter(s => s >= configuracoes.objetivoValor).length / numeroSimulacoes) * 100
      : 0;
    
    // Calcular Sharpe Ratio simplificado
    const retornoEsperado = ((valorEsperado - simulacao.valorInicial) / simulacao.valorInicial) * 100;
    const sharpeRatio = retornoEsperado / (desvio / valorEsperado * 100);
    
    return {
      simulacoes,
      percentis,
      probabilidadeObjetivo,
      valorEsperado,
      desvio,
      sharpeRatio
    };
  }, [configuracoes, calcularResultadoCenario, simulacao.valorInicial, cenariosBase]);

  // Backtesting histórico
  const executarBacktest = useCallback(async (): Promise<BacktestResult[]> => {
    const periodosHistoricos = [
      { nome: '2020-2021 (Pandemia)', retorno: 8.5, volatilidade: 25.0 },
      { nome: '2018-2019 (Estabilidade)', retorno: 12.3, volatilidade: 15.0 },
      { nome: '2015-2016 (Crise)', retorno: 15.8, volatilidade: 30.0 },
      { nome: '2010-2014 (Crescimento)', retorno: 11.2, volatilidade: 18.0 },
      { nome: '2008-2009 (Crise Global)', retorno: 18.5, volatilidade: 35.0 }
    ];
    
    return periodosHistoricos.map(periodo => {
      // Simular trajetória histórica
      const trajetoria: number[] = [];
      let valor = simulacao.valorInicial;
      let somaRetornos = 0;
      let retornosPositivos = 0;
      let maxValor = valor;
      let maxDrawdown = 0;
      
      for (let mes = 1; mes <= simulacao.periodo; mes++) {
        valor += simulacao.valorMensal;
        const retornoMes = (periodo.retorno/100) / 12 + 
          boxMullerTransform() * (periodo.volatilidade/100) / Math.sqrt(12);
        
        valor *= (1 + retornoMes);
        trajetoria.push(valor);
        
        somaRetornos += retornoMes;
        if (retornoMes > 0) retornosPositivos++;
        
        if (valor > maxValor) {
          maxValor = valor;
        } else {
          const drawdown = (maxValor - valor) / maxValor;
          if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
          }
        }
      }
      
      const retornoAnualizado = (somaRetornos / simulacao.periodo) * 12 * 100;
      const winRate = (retornosPositivos / simulacao.periodo) * 100;
      const sharpeRatio = retornoAnualizado / periodo.volatilidade;
      
      return {
        periodo: periodo.nome,
        retornoAnualizado,
        volatilidade: periodo.volatilidade,
        sharpeRatio,
        maxDrawdown: maxDrawdown * 100,
        winRate,
        trajetoriaHistorica: trajetoria
      };
    });
  }, [simulacao, boxMullerTransform]);

  // Análise de correlação entre ativos
  const analisarCorrelacoes = useCallback((): CorrelacaoAtivos[] => {
    const ativos = [
      { nome: 'CDI', retorno: 13.75, volatilidade: 2.0 },
      { nome: 'IPCA+', retorno: 6.5, volatilidade: 8.0 },
      { nome: 'Ibovespa', retorno: 12.0, volatilidade: 25.0 },
      { nome: 'Dólar', retorno: 8.0, volatilidade: 20.0 },
      { nome: 'Ouro', retorno: 10.0, volatilidade: 18.0 },
      { nome: 'Bitcoin', retorno: 25.0, volatilidade: 60.0 }
    ];
    
    const correlacoes: CorrelacaoAtivos[] = [];
    
    for (let i = 0; i < ativos.length; i++) {
      for (let j = i + 1; j < ativos.length; j++) {
        const ativo1 = ativos[i];
        const ativo2 = ativos[j];
        
        // Correlação simulada baseada em características dos ativos
        let correlacao = 0;
        if (ativo1.nome === 'CDI' && ativo2.nome === 'IPCA+') correlacao = 0.3;
        else if (ativo1.nome === 'Ibovespa' && ativo2.nome === 'Dólar') correlacao = -0.4;
        else if (ativo1.nome === 'Ouro' && ativo2.nome === 'Dólar') correlacao = 0.6;
        else if (ativo1.nome === 'Bitcoin' && ativo2.nome === 'Ibovespa') correlacao = 0.2;
        else correlacao = (Math.random() - 0.5) * 0.8; // Correlação aleatória entre -0.4 e 0.4
        
        const beta = (correlacao * ativo2.volatilidade) / ativo1.volatilidade;
        
        let risco: 'baixo' | 'medio' | 'alto';
        if (Math.abs(correlacao) < 0.3) risco = 'baixo';
        else if (Math.abs(correlacao) < 0.7) risco = 'medio';
        else risco = 'alto';
        
        correlacoes.push({
          ativo1: ativo1.nome,
          ativo2: ativo2.nome,
          correlacao,
          beta,
          risco
        });
      }
    }
    
    return correlacoes;
  }, []);

  // Executar stress testing avançado
  const executarStressTesting = useCallback((): StressTesting => {
    const resultados = cenariosBase.map(c => calcularResultadoCenario(c, true));
    
    const otimista = resultados.find(r => r.cenario.id === 'otimista')!;
    const realista = resultados.find(r => r.cenario.id === 'realista')!;
    const pessimista = resultados.find(r => r.cenario.id === 'pessimista')!;
    
    // Worst case: cenário mais extremo negativo
    const worstCase = resultados.reduce((worst, current) => 
      current.valorFinal < worst.valorFinal ? current : worst
    );
    
    // Best case: cenário mais extremo positivo
    const bestCase = resultados.reduce((best, current) => 
      current.valorFinal > best.valorFinal ? current : best
    );
    
    // Calcular probabilidade de perda
    const cenariosPerdas = resultados.filter(r => r.rendimentoReal < 0);
    const probabilidadePerda = (cenariosPerdas.length / resultados.length) * 100;
    
    // Calcular máximo drawdown
    let maxDrawdown = 0;
    resultados.forEach(resultado => {
      if (resultado.trajetoria) {
        let maxValor = resultado.trajetoria[0];
        resultado.trajetoria.forEach(valor => {
          if (valor > maxValor) {
            maxValor = valor;
          } else {
            const drawdown = (maxValor - valor) / maxValor;
            if (drawdown > maxDrawdown) {
              maxDrawdown = drawdown;
            }
          }
        });
      }
    });
    
    return {
      cenarioOtimista: otimista,
      cenarioRealista: realista,
      cenarioPessimista: pessimista,
      worstCase,
      bestCase,
      probabilidadePerda,
      maxDrawdown: maxDrawdown * 100
    };
  }, [cenariosBase, calcularResultadoCenario]);

  // Simular todos os cenários com funcionalidades avançadas
  const simularCenarios = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const resultadosCalculados = cenariosBase.map(c => calcularResultadoCenario(c, true));
      const stressTest = executarStressTesting();
      
      setResultados(resultadosCalculados);
      setStressTesting(stressTest);
      setCenarios(cenariosBase);
      
      // Executar Monte Carlo se habilitado
      if (configuracoes.incluirMonteCarlo) {
        const monteCarloRes = await executarMonteCarlo();
        setMonteCarloResult(monteCarloRes);
      }
      
      // Executar Backtesting se habilitado
      if (configuracoes.incluirBacktest) {
        const backtestRes = await executarBacktest();
        setBacktestResults(backtestRes);
      }
      
      // Analisar correlações se habilitado
      if (configuracoes.incluirCorrelacao) {
        const correlacoesRes = analisarCorrelacoes();
        setCorrelacoes(correlacoesRes);
      }
      
      if (!cenarioSelecionado && resultadosCalculados.length > 0) {
        setCenarioSelecionado(resultadosCalculados[1].cenario.id); // Cenário realista como padrão
      }
    } catch (error) {
      console.error('Erro ao simular cenários:', error);
    } finally {
      setIsLoading(false);
    }
  }, [
    cenariosBase, 
    calcularResultadoCenario, 
    executarStressTesting, 
    configuracoes, 
    executarMonteCarlo, 
    executarBacktest, 
    analisarCorrelacoes, 
    cenarioSelecionado
  ]);

  // Criar cenário personalizado
  const criarCenarioPersonalizado = useCallback((
    nome: string,
    parametros: CenarioEconomico['parametros']
  ) => {
    const novoCenario: CenarioEconomico = {
      id: `custom-${Date.now()}`,
      nome,
      descricao: 'Cenário personalizado',
      parametros,
      probabilidade: 0,
      impacto: 'neutro',
      cor: '#6B7280'
    };
    
    const resultado = calcularResultadoCenario(novoCenario, true);
    
    setCenarios(prev => [...prev, novoCenario]);
    setResultados(prev => [...prev, resultado]);
    
    return resultado;
  }, [calcularResultadoCenario]);

  // Métricas calculadas avançadas
  const metricas = useMemo(() => {
    if (resultados.length === 0) return null;
    
    const valores = resultados.map(r => r.valorFinal);
    const rendimentos = resultados.map(r => r.rendimentoReal);
    const riscos = resultados.map(r => r.risco);
    
    const valorMedio = valores.reduce((a, b) => a + b, 0) / valores.length;
    const rendimentoMedio = rendimentos.reduce((a, b) => a + b, 0) / rendimentos.length;
    const riscoMedio = riscos.reduce((a, b) => a + b, 0) / riscos.length;
    
    const valorMinimo = Math.min(...valores);
    const valorMaximo = Math.max(...valores);
    
    const desvio = Math.sqrt(
      valores.reduce((acc, val) => acc + Math.pow(val - valorMedio, 2), 0) / valores.length
    );
    
    const probabilidadePerda = resultados.filter(r => r.rendimentoReal < 0).length / resultados.length * 100;
    
    // Calcular Sharpe Ratio médio
    const sharpeRatio = rendimentoMedio / (desvio / valorMedio * 100);
    
    // Calcular índice de diversificação
    const indiceDiversificacao = 1 - (desvio / Math.sqrt(riscos.reduce((acc, r) => acc + r * r, 0) / riscos.length));
    
    return {
      valorMedio,
      rendimentoMedio,
      riscoMedio,
      valorMinimo,
      valorMaximo,
      desvio,
      probabilidadePerda,
      sharpeRatio,
      indiceDiversificacao,
      melhorCenario: resultados.find(r => r.valorFinal === valorMaximo)?.cenario.nome || '',
      piorCenario: resultados.find(r => r.valorFinal === valorMinimo)?.cenario.nome || '',
      eficiencia: sharpeRatio > 1 ? 'Alta' : sharpeRatio > 0.5 ? 'Média' : 'Baixa'
    };
  }, [resultados]);

  // Carregar cenários iniciais
  useEffect(() => {
    simularCenarios();
  }, [simulacao.valorInicial, simulacao.valorMensal, simulacao.periodo]);

  return {
    cenarios,
    resultados,
    stressTesting,
    monteCarloResult,
    backtestResults,
    correlacoes,
    metricas,
    isLoading,
    cenarioSelecionado,
    configuracoes,
    setCenarioSelecionado,
    setConfiguracoes,
    simularCenarios,
    criarCenarioPersonalizado,
    executarMonteCarlo,
    executarBacktest,
    analisarCorrelacoes
  };
};