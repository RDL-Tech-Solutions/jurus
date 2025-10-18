import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

// Tipos para o sistema de recomendações de IA
export interface PerfilInvestidor {
  id: string;
  nome: string;
  idade: number;
  rendaMensal: number;
  patrimonioAtual: number;
  objetivos: ObjetivoFinanceiro[];
  toleranciaRisco: 'conservador' | 'moderado' | 'arrojado';
  horizonteTemporal: number; // em anos
  experienciaInvestimentos: 'iniciante' | 'intermediario' | 'avancado';
  situacaoFamiliar: 'solteiro' | 'casado' | 'filhos' | 'aposentado';
  preferenciasInvestimento: string[];
  comportamentoHistorico: ComportamentoInvestimento[];
  ultimaAtualizacao: Date;
}

export interface ObjetivoFinanceiro {
  id: string;
  tipo: 'aposentadoria' | 'casa' | 'educacao' | 'emergencia' | 'viagem' | 'outro';
  descricao: string;
  valorMeta: number;
  prazo: number; // em meses
  prioridade: 'alta' | 'media' | 'baixa';
  status: 'planejando' | 'em_andamento' | 'concluido' | 'pausado';
}

export interface ComportamentoInvestimento {
  data: Date;
  acao: 'investimento' | 'resgate' | 'transferencia' | 'consulta';
  valor?: number;
  tipoAtivo: string;
  emocao: 'confiante' | 'ansioso' | 'neutro' | 'eufórico' | 'temeroso';
  contextoMercado: 'alta' | 'baixa' | 'lateral' | 'volatil';
}

export interface RecomendacaoIA {
  id: string;
  tipo: 'investimento' | 'rebalanceamento' | 'resgate' | 'diversificacao' | 'alerta';
  titulo: string;
  descricao: string;
  justificativa: string;
  confianca: number; // 0-100
  impactoEstimado: number; // percentual
  urgencia: 'baixa' | 'media' | 'alta' | 'critica';
  categoria: string;
  acoes: AcaoRecomendada[];
  riscos: string[];
  beneficios: string[];
  dataGeracao: Date;
  dataExpiracao?: Date;
  status: 'nova' | 'visualizada' | 'aceita' | 'rejeitada' | 'expirada';
  feedback?: FeedbackRecomendacao;
}

export interface AcaoRecomendada {
  id: string;
  descricao: string;
  tipo: 'compra' | 'venda' | 'transferencia' | 'configuracao';
  parametros: Record<string, any>;
  prioridade: number;
}

export interface FeedbackRecomendacao {
  util: boolean;
  implementada: boolean;
  comentario?: string;
  resultadoObtido?: number;
  dataFeedback: Date;
}

export interface AlertaInteligente {
  id: string;
  tipo: 'mercado' | 'portfolio' | 'objetivo' | 'risco' | 'oportunidade';
  titulo: string;
  mensagem: string;
  severidade: 'info' | 'warning' | 'error' | 'success';
  dadosRelevantes: Record<string, any>;
  acoesSugeridas: string[];
  dataGeracao: Date;
  visualizado: boolean;
  ativo: boolean;
}

export interface AnaliseRiscoIA {
  pontuacaoRisco: number; // 0-100
  scoreRisco: number; // 0-100
  classificacao: 'muito_baixo' | 'baixo' | 'moderado' | 'alto' | 'muito_alto';
  fatoresRisco: FatorRisco[];
  recomendacoesMitigacao: string[];
  probabilidadePerda: number;
  perdaMaximaEstimada: number;
  diversificacaoAtual: number;
  correlacaoAtivos: number;
  volatilidade: number;
  sharpeRatio: number;
  dataAnalise: Date;
  detalhesAnalise: {
    riscoFinanceiro: number;
    riscoPsicologico: number;
    riscoTemporal: number;
    confiabilidade: number;
  };
}

export interface FatorRisco {
  id: string;
  nome: string;
  impacto: 'baixo' | 'medio' | 'alto';
  descricao: string;
  peso: number;
}

export interface RebalanceamentoIA {
  necessidadeRebalanceamento: 'alta' | 'media' | 'baixa';
  alocacaoAtual: Record<string, number>;
  alocacaoRecomendada: Record<string, number>;
  movimentacoes: MovimentacaoRebalanceamento[];
  beneficiosEsperados: {
    reducaoRisco: number;
    melhorDiversificacao: number;
    alinhamentoPerfil: number;
    otimizacaoRetorno: number;
  };
  custoEstimado: number;
  cronogramaExecucao: Array<{
    ordem: number;
    acao: string;
    prazoRecomendado: string;
    observacoes: string;
  }>;
  dataAnalise: Date;
  proximaRevisao: Date;
  observacoes: string[];
}

export interface MovimentacaoRebalanceamento {
  ativo: 'acoes' | 'fiis' | 'rendaFixa' | 'internacional';
  acao: 'comprar' | 'vender' | 'manter';
  percentualAtual: number;
  percentualAlvo: number;
  valorEstimado: number;
  prioridade: 'alta' | 'media' | 'baixa';
  justificativa: string;
}

export interface DadosMercadoIA {
  indices: Record<string, number>;
  sentimentoMercado: 'muito_pessimista' | 'pessimista' | 'neutro' | 'otimista' | 'muito_otimista';
  volatilidade: number;
  tendencias: string[];
  eventosRelevantes: EventoMercado[];
  previsoes: PrevisaoMercado[];
  ultimaAtualizacao: Date;
}

export interface EventoMercado {
  data: Date;
  tipo: 'economico' | 'politico' | 'corporativo' | 'internacional';
  descricao: string;
  impactoEstimado: 'baixo' | 'medio' | 'alto';
  setoresAfetados: string[];
}

export interface PrevisaoMercado {
  horizonte: '1m' | '3m' | '6m' | '1a' | '2a';
  cenario: 'pessimista' | 'base' | 'otimista';
  probabilidade: number;
  retornoEstimado: number;
  volatilidade: number;
  principais_drivers: string[];
}

export interface ConfiguracaoIA {
  frequenciaAnalise: 'diaria' | 'semanal' | 'mensal';
  tiposRecomendacao: string[];
  limiteRecomendacoes: number;
  alertasAtivos: boolean;
  nivelDetalhamento: 'basico' | 'intermediario' | 'avancado';
  considerarFiscal: boolean;
  considerarLiquidez: boolean;
  modeloRisco: 'conservador' | 'moderado' | 'agressivo';
}

export interface UseRecomendacoesIAReturn {
  // Estado
  perfil: PerfilInvestidor | null;
  recomendacoes: RecomendacaoIA[];
  alertas: AlertaInteligente[];
  analiseRisco: AnaliseRiscoIA | null;
  rebalanceamento: RebalanceamentoIA | null;
  dadosMercado: DadosMercadoIA | null;
  configuracao: ConfiguracaoIA;
  isLoading: boolean;
  error: string | null;

  // Funções de perfil
  criarPerfil: (dados: Partial<PerfilInvestidor>) => Promise<void>;
  atualizarPerfil: (dados: Partial<PerfilInvestidor>) => Promise<void>;
  analisarPerfil: () => Promise<AnaliseRiscoIA>;

  // Funções de recomendações
  gerarRecomendacoes: () => Promise<RecomendacaoIA[]>;
  gerarRecomendacoesRebalanceamento: (perfil: PerfilInvestidor, carteira?: any) => Promise<RebalanceamentoIA>;
  aceitarRecomendacao: (id: string) => Promise<void>;
  rejeitarRecomendacao: (id: string, motivo?: string) => Promise<void>;
  fornecerFeedback: (id: string, feedback: FeedbackRecomendacao) => Promise<void>;

  // Funções de alertas
  configurarAlertas: (tipos: string[]) => Promise<void>;
  marcarAlertaVisualizado: (id: string) => void;
  desativarAlerta: (id: string) => void;

  // Funções de rebalanceamento
  analisarRebalanceamento: () => Promise<RebalanceamentoIA>;
  executarRebalanceamento: (id: string) => Promise<void>;

  // Funções de mercado
  atualizarDadosMercado: () => Promise<void>;
  obterPrevisoes: (horizonte: string) => PrevisaoMercado[];

  // Configurações
  atualizarConfiguracao: (config: Partial<ConfiguracaoIA>) => void;
  resetarIA: () => Promise<void>;
}

export const useRecomendacoesIA = (): UseRecomendacoesIAReturn => {
  // Estados locais
  const [perfil, setPerfil] = useLocalStorage<PerfilInvestidor | null>('perfil-investidor', null);
  const [recomendacoes, setRecomendacoes] = useLocalStorage<RecomendacaoIA[]>('recomendacoes-ia', []);
  const [alertas, setAlertas] = useLocalStorage<AlertaInteligente[]>('alertas-ia', []);
  const [analiseRisco, setAnaliseRisco] = useState<AnaliseRiscoIA | null>(null);
  const [rebalanceamento, setRebalanceamento] = useState<RebalanceamentoIA | null>(null);
  const [dadosMercado, setDadosMercado] = useState<DadosMercadoIA | null>(null);
  const [configuracao, setConfiguracao] = useLocalStorage<ConfiguracaoIA>('config-ia', {
    frequenciaAnalise: 'semanal',
    tiposRecomendacao: ['investimento', 'rebalanceamento', 'diversificacao'],
    limiteRecomendacoes: 5,
    alertasAtivos: true,
    nivelDetalhamento: 'intermediario',
    considerarFiscal: true,
    considerarLiquidez: true,
    modeloRisco: 'moderado'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Algoritmo de análise de perfil
  const calcularToleranciaRisco = useCallback((perfil: PerfilInvestidor): number => {
    let pontuacao = 50; // Base neutra

    // Idade (quanto mais jovem, maior tolerância)
    if (perfil.idade < 30) pontuacao += 20;
    else if (perfil.idade < 40) pontuacao += 10;
    else if (perfil.idade < 50) pontuacao += 0;
    else if (perfil.idade < 60) pontuacao -= 10;
    else pontuacao -= 20;

    // Horizonte temporal
    if (perfil.horizonteTemporal > 10) pontuacao += 15;
    else if (perfil.horizonteTemporal > 5) pontuacao += 5;
    else if (perfil.horizonteTemporal < 2) pontuacao -= 15;

    // Experiência
    if (perfil.experienciaInvestimentos === 'avancado') pontuacao += 15;
    else if (perfil.experienciaInvestimentos === 'intermediario') pontuacao += 5;
    else pontuacao -= 10;

    // Situação financeira
    const patrimonioRenda = perfil.patrimonioAtual / (perfil.rendaMensal * 12);
    if (patrimonioRenda > 5) pontuacao += 10;
    else if (patrimonioRenda < 1) pontuacao -= 15;

    // Comportamento histórico
    const comportamentosRiscosos = perfil.comportamentoHistorico.filter(
      c => c.emocao === 'eufórico' || c.contextoMercado === 'volatil'
    ).length;
    if (comportamentosRiscosos > perfil.comportamentoHistorico.length * 0.3) {
      pontuacao += 10;
    }

    return Math.max(0, Math.min(100, pontuacao));
  }, []);

  // Algoritmo avançado de machine learning para recomendações baseadas em comportamento
  const gerarRecomendacoesML = useCallback(async (perfil: PerfilInvestidor): Promise<RecomendacaoIA[]> => {
    const recomendacoes: RecomendacaoIA[] = [];
    const toleranciaRisco = calcularToleranciaRisco(perfil);

    // Análise de padrões comportamentais
    const analisarPadroesComportamentais = (comportamentos: ComportamentoInvestimento[]) => {
      const padroes = {
        impulsividade: 0,
        consistencia: 0,
        sensibilidadeMercado: 0,
        disciplina: 0
      };

      comportamentos.forEach((comp, index) => {
        // Calcular impulsividade baseada em emoções extremas
        if (comp.emocao === 'eufórico' || comp.emocao === 'temeroso') {
          padroes.impulsividade += 1;
        }

        // Calcular consistência baseada na regularidade dos investimentos
        if (comp.acao === 'investimento' && index > 0) {
          const anterior = comportamentos[index - 1];
          const diasEntre = Math.abs(comp.data.getTime() - anterior.data.getTime()) / (1000 * 60 * 60 * 24);
          if (diasEntre <= 35) padroes.consistencia += 1; // Investimentos mensais regulares
        }

        // Calcular sensibilidade ao mercado
        if (comp.contextoMercado === 'volatil' && comp.acao === 'resgate') {
          padroes.sensibilidadeMercado += 1;
        }

        // Calcular disciplina (investimentos em momentos de baixa)
        if (comp.contextoMercado === 'baixa' && comp.acao === 'investimento') {
          padroes.disciplina += 1;
        }
      });

      // Normalizar valores
      const total = comportamentos.length || 1;
      return {
        impulsividade: padroes.impulsividade / total,
        consistencia: padroes.consistencia / total,
        sensibilidadeMercado: padroes.sensibilidadeMercado / total,
        disciplina: padroes.disciplina / total
      };
    };

    const padroes = analisarPadroesComportamentais(perfil.comportamentoHistorico);

    // Algoritmo de clustering simples para classificação de perfil
    const classificarPerfilML = () => {
      const features = [
        perfil.idade / 100,
        perfil.rendaMensal / 50000,
        perfil.patrimonioAtual / 1000000,
        perfil.horizonteTemporal / 30,
        padroes.impulsividade,
        padroes.consistencia,
        padroes.sensibilidadeMercado,
        padroes.disciplina
      ];

      // Centróides pré-definidos para diferentes perfis
      const centroides = {
        conservador: [0.6, 0.3, 0.2, 0.3, 0.2, 0.8, 0.3, 0.7],
        moderado: [0.4, 0.5, 0.4, 0.5, 0.3, 0.6, 0.4, 0.6],
        agressivo: [0.3, 0.7, 0.6, 0.7, 0.4, 0.5, 0.5, 0.8]
      };

      // Calcular distância euclidiana para cada centróide
      const distancias = Object.entries(centroides).map(([perfil, centroide]) => {
        const distancia = Math.sqrt(
          features.reduce((acc, feature, i) => acc + Math.pow(feature - centroide[i], 2), 0)
        );
        return { perfil, distancia };
      });

      return distancias.sort((a, b) => a.distancia - b.distancia)[0].perfil;
    };

    const perfilML = classificarPerfilML();

    // Algoritmo de recomendação baseado em similaridade
    const gerarRecomendacoesSimilaridade = () => {
      const usuarios_similares = [
        { perfil: 'conservador', recomendacoes: ['renda_fixa', 'fundos_multimercado', 'tesouro_direto'] },
        { perfil: 'moderado', recomendacoes: ['acoes_blue_chips', 'fiis', 'fundos_multimercado'] },
        { perfil: 'agressivo', recomendacoes: ['acoes_growth', 'internacional', 'criptomoedas'] }
      ];

      const recomendacoes_perfil = usuarios_similares.find(u => u.perfil === perfilML)?.recomendacoes || [];
      
      return recomendacoes_perfil.map((rec, index) => ({
        id: `ml-similarity-${index}`,
        tipo: 'investimento' as const,
        titulo: `Recomendação ML: ${rec.replace('_', ' ').toUpperCase()}`,
        descricao: `Baseado em usuários similares, recomendamos investir em ${rec.replace('_', ' ')}.`,
        justificativa: `Análise de similaridade com perfil ${perfilML}`,
        confianca: 80 - index * 5,
        impactoEstimado: 15 - index * 3,
        urgencia: 'media' as const,
        categoria: 'Alocação',
        acoes: [{
          id: `similarity-${index}`,
          descricao: `Alocar recursos em ${rec.replace('_', ' ')}`,
          tipo: 'compra' as const,
          parametros: { ativo: rec, percentual: 15 - index * 3 },
          prioridade: index + 1
        }],
        riscos: ['Volatilidade do mercado'],
        beneficios: ['Diversificação', 'Potencial de retorno'],
        dataGeracao: new Date(),
        status: 'nova' as const
      }));
    };

    // Algoritmo de otimização de portfólio simplificado
    const otimizarPortfolio = () => {
      const ativos = ['acoes', 'fiis', 'rendaFixa', 'internacional'];
      const retornos_esperados = [0.12, 0.08, 0.06, 0.10];
      const volatilidades = [0.25, 0.15, 0.05, 0.20];
      
      // Função objetivo simplificada (Sharpe Ratio)
      const calcularSharpe = (pesos: number[]) => {
        const retorno_portfolio = pesos.reduce((acc, peso, i) => acc + peso * retornos_esperados[i], 0);
        const volatilidade_portfolio = Math.sqrt(
          pesos.reduce((acc, peso, i) => acc + Math.pow(peso * volatilidades[i], 2), 0)
        );
        return retorno_portfolio / volatilidade_portfolio;
      };

      // Otimização simples por grid search
      let melhor_alocacao = [0.25, 0.25, 0.25, 0.25];
      let melhor_sharpe = calcularSharpe(melhor_alocacao);

      for (let i = 0; i <= 10; i++) {
        for (let j = 0; j <= 10 - i; j++) {
          for (let k = 0; k <= 10 - i - j; k++) {
            const l = 10 - i - j - k;
            const pesos = [i/10, j/10, k/10, l/10];
            const sharpe = calcularSharpe(pesos);
            
            if (sharpe > melhor_sharpe) {
              melhor_sharpe = sharpe;
              melhor_alocacao = pesos;
            }
          }
        }
      }

      return {
        alocacao: melhor_alocacao,
        sharpe: melhor_sharpe,
        retorno_esperado: melhor_alocacao.reduce((acc, peso, i) => acc + peso * retornos_esperados[i], 0)
      };
    };

    const portfolio_otimo = otimizarPortfolio();

    // Recomendação baseada em impulsividade
    if (padroes.impulsividade > 0.3) {
      recomendacoes.push({
        id: `impulse-${Date.now()}`,
        tipo: 'investimento',
        titulo: 'Estratégia Anti-Impulsividade',
        descricao: 'Implementar investimentos automáticos para reduzir decisões emocionais',
        justificativa: `Detectamos padrão de decisões impulsivas (${(padroes.impulsividade * 100).toFixed(1)}% das operações). Investimentos automáticos podem melhorar seus resultados.`,
        confianca: 88,
        impactoEstimado: 25,
        urgencia: 'alta',
        categoria: 'Comportamental',
        acoes: [{
          id: 'impulse-1',
          descricao: 'Configurar investimentos automáticos mensais',
          tipo: 'configuracao',
          parametros: { tipo: 'automatico', frequencia: 'mensal' },
          prioridade: 1
        }],
        riscos: ['Menor flexibilidade nas decisões'],
        beneficios: ['Redução de decisões emocionais', 'Maior disciplina', 'Melhor timing médio'],
        dataGeracao: new Date(),
        status: 'nova'
      });
    }

    // Recomendação baseada em consistência
    if (padroes.consistencia < 0.2 && perfil.rendaMensal > 0) {
      recomendacoes.push({
        id: `consistency-${Date.now()}`,
        tipo: 'investimento',
        titulo: 'Melhorar Consistência de Aportes',
        descricao: 'Estabelecer rotina de investimentos regulares',
        justificativa: `Sua consistência de aportes está em ${(padroes.consistencia * 100).toFixed(1)}%. Aportes regulares podem aumentar significativamente seus resultados.`,
        confianca: 82,
        impactoEstimado: 30,
        urgencia: 'media',
        categoria: 'Disciplina',
        acoes: [{
          id: 'consistency-1',
          descricao: 'Definir valor fixo mensal para investimentos',
          tipo: 'configuracao',
          parametros: { valor_sugerido: perfil.rendaMensal * 0.1 },
          prioridade: 1
        }],
        riscos: ['Necessidade de disciplina'],
        beneficios: ['Efeito do custo médio', 'Crescimento exponencial', 'Formação de hábito'],
        dataGeracao: new Date(),
        status: 'nova'
      });
    }

    // Recomendação baseada em sensibilidade ao mercado
    if (padroes.sensibilidadeMercado > 0.4) {
      recomendacoes.push({
        id: `market-sens-${Date.now()}`,
        tipo: 'diversificacao',
        titulo: 'Reduzir Sensibilidade ao Mercado',
        descricao: 'Diversificar para reduzir impacto da volatilidade',
        justificativa: `Você tende a reagir fortemente à volatilidade (${(padroes.sensibilidadeMercado * 100).toFixed(1)}% das vezes). Maior diversificação pode ajudar.`,
        confianca: 75,
        impactoEstimado: 20,
        urgencia: 'media',
        categoria: 'Estabilidade',
        acoes: [{
          id: 'market-sens-1',
          descricao: 'Adicionar ativos menos correlacionados',
          tipo: 'configuracao',
          parametros: { tipos: ['renda_fixa', 'internacional', 'commodities'] },
          prioridade: 1
        }],
        riscos: ['Maior complexidade'],
        beneficios: ['Menor volatilidade', 'Maior estabilidade emocional', 'Melhor sono'],
        dataGeracao: new Date(),
        status: 'nova'
      });
    }

    // Recomendação para investidores disciplinados
    if (padroes.disciplina > 0.3 && toleranciaRisco > 60) {
      recomendacoes.push({
        id: `discipline-${Date.now()}`,
        tipo: 'investimento',
        titulo: 'Aproveitar Disciplina para Maior Retorno',
        descricao: 'Sua disciplina permite estratégias mais agressivas',
        justificativa: `Você demonstra excelente disciplina (${(padroes.disciplina * 100).toFixed(1)}% de compras em baixa). Pode considerar estratégias mais agressivas.`,
        confianca: 90,
        impactoEstimado: 35,
        urgencia: 'baixa',
        categoria: 'Oportunidade',
        acoes: [{
          id: 'discipline-1',
          descricao: 'Aumentar exposição a ativos de crescimento',
          tipo: 'configuracao',
          parametros: { aumentar_acoes: 10, reduzir_renda_fixa: 10 },
          prioridade: 2
        }],
        riscos: ['Maior volatilidade'],
        beneficios: ['Maior potencial de retorno', 'Aproveitamento da disciplina'],
        dataGeracao: new Date(),
        status: 'nova'
      });
    }

    // Recomendação de diversificação baseada no perfil
    if (perfil.preferenciasInvestimento.length < 3) {
      recomendacoes.push({
        id: `div-${Date.now()}`,
        tipo: 'diversificacao',
        titulo: 'Diversificar Portfólio',
        descricao: 'Sua carteira pode se beneficiar de maior diversificação',
        justificativa: `Com base no seu perfil ${perfil.toleranciaRisco}, recomendamos diversificar em ${
          toleranciaRisco > 70 ? 'ações internacionais e fundos de crescimento' :
          toleranciaRisco > 40 ? 'fundos multimercado e títulos públicos' :
          'títulos de renda fixa e fundos conservadores'
        }`,
        confianca: 85,
        impactoEstimado: 12,
        urgencia: 'media',
        categoria: 'Diversificação',
        acoes: [{
          id: 'div-1',
          descricao: 'Adicionar novos tipos de investimento',
          tipo: 'configuracao',
          parametros: { tipos_sugeridos: toleranciaRisco > 70 ? ['acoes', 'fiis'] : ['cdb', 'lci'] },
          prioridade: 1
        }],
        riscos: ['Maior complexidade de gestão'],
        beneficios: ['Redução de risco', 'Potencial de maior retorno'],
        dataGeracao: new Date(),
        status: 'nova'
      });
    }

    // Recomendação de rebalanceamento baseada em objetivos
    const objetivosUrgentes = perfil.objetivos.filter(obj => 
      obj.prioridade === 'alta' && obj.status === 'em_andamento'
    );

    if (objetivosUrgentes.length > 0) {
      recomendacoes.push({
        id: `reb-${Date.now()}`,
        tipo: 'rebalanceamento',
        titulo: 'Ajustar Estratégia para Objetivos',
        descricao: 'Rebalancear carteira para focar nos objetivos prioritários',
        justificativa: `Você tem ${objetivosUrgentes.length} objetivo(s) de alta prioridade que podem se beneficiar de ajustes na alocação`,
        confianca: 78,
        impactoEstimado: 18,
        urgencia: 'alta',
        categoria: 'Rebalanceamento',
        acoes: [{
          id: 'reb-1',
          descricao: 'Realocar recursos para objetivos prioritários',
          tipo: 'transferencia',
          parametros: { objetivos: objetivosUrgentes.map(o => o.id) },
          prioridade: 1
        }],
        riscos: ['Custos de transação'],
        beneficios: ['Maior probabilidade de atingir objetivos', 'Otimização de recursos'],
        dataGeracao: new Date(),
        status: 'nova'
      });
    }

    // Recomendação baseada em comportamento histórico
    const comportamentosRecentes = perfil.comportamentoHistorico
      .filter(c => c.data > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))
      .slice(-10);

    if (comportamentosRecentes.length > 0) {
      const emocoesPredominantes = comportamentosRecentes.reduce((acc, c) => {
        acc[c.emocao] = (acc[c.emocao] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const emocaoPrincipal = Object.entries(emocoesPredominantes)
        .sort(([,a], [,b]) => b - a)[0][0];

      if (emocaoPrincipal === 'ansioso' || emocaoPrincipal === 'temeroso') {
        recomendacoes.push({
          id: `comp-${Date.now()}`,
          tipo: 'investimento',
          titulo: 'Estratégia para Reduzir Ansiedade',
          descricao: 'Investimentos mais estáveis para maior tranquilidade',
          justificativa: 'Detectamos padrão de ansiedade em seus investimentos recentes. Sugerimos uma abordagem mais conservadora.',
          confianca: 72,
          impactoEstimado: 8,
          urgencia: 'media',
          categoria: 'Comportamental',
          acoes: [{
            id: 'comp-1',
            descricao: 'Aumentar alocação em renda fixa',
            tipo: 'compra',
            parametros: { tipo: 'renda_fixa', percentual: 20 },
            prioridade: 1
          }],
          riscos: ['Menor potencial de retorno'],
          beneficios: ['Maior estabilidade', 'Redução de stress'],
          dataGeracao: new Date(),
          status: 'nova'
        });
      }
    }

    return recomendacoes;
  }, [calcularToleranciaRisco]);

  // Sistema avançado de análise de risco automatizada
  const analisarRiscoAutomatizado = useCallback(async (perfil: PerfilInvestidor): Promise<AnaliseRiscoIA> => {
    const toleranciaRisco = calcularToleranciaRisco(perfil);
    
    // Análise multidimensional de risco
     const analisarRiscoFinanceiro = () => {
       const ratioPatrimonio = perfil.patrimonioAtual > 0 ? perfil.rendaMensal * 12 / perfil.patrimonioAtual : 0;
       const estabilidadeRenda = perfil.rendaMensal > 5000 ? 0.8 : perfil.rendaMensal > 2000 ? 0.6 : 0.4;
       const capacidadeInvestimento = Math.min(perfil.rendaMensal * 0.3, 10000) / 10000;
       
       return {
         score: (estabilidadeRenda + capacidadeInvestimento + (ratioPatrimonio > 0.1 ? 0.8 : 0.4)) / 3,
         fatores: { ratioPatrimonio, estabilidadeRenda, capacidadeInvestimento }
       };
     };

    const analisarRiscoPsicologico = () => {
      const comportamentos = perfil.comportamentoHistorico;
      let volatilidade = 0;
      let consistencia = 0;
      let reacaoMercado = 0;

      if (comportamentos.length > 0) {
        // Calcular volatilidade emocional
        const emocoesExtremas = comportamentos.filter(c => 
          c.emocao === 'eufórico' || c.emocao === 'temeroso' || c.emocao === 'ansioso'
        ).length;
        volatilidade = emocoesExtremas / comportamentos.length;

        // Calcular consistência de decisões
        const decisoesConsistentes = comportamentos.filter((c, i) => {
          if (i === 0) return true;
          const anterior = comportamentos[i - 1];
          return c.acao === anterior.acao || Math.abs(c.data.getTime() - anterior.data.getTime()) > 30 * 24 * 60 * 60 * 1000;
        }).length;
        consistencia = decisoesConsistentes / comportamentos.length;

        // Calcular reação ao mercado
        const reacoesNegativas = comportamentos.filter(c => 
          (c.contextoMercado === 'volatil' || c.contextoMercado === 'baixa') && c.acao === 'resgate'
        ).length;
        reacaoMercado = reacoesNegativas / comportamentos.length;
      }

      return {
        score: Math.max(0, 1 - volatilidade - reacaoMercado + consistencia) / 2,
        fatores: { volatilidade, consistencia, reacaoMercado }
      };
    };

    const analisarRiscoTemporal = () => {
       const idadeScore = perfil.idade < 30 ? 0.9 : perfil.idade < 45 ? 0.7 : perfil.idade < 60 ? 0.5 : 0.3;
       const experienciaScore = perfil.experienciaInvestimentos === 'avancado' ? 1 : perfil.experienciaInvestimentos === 'intermediario' ? 0.6 : 0.3;
       const horizonteScore = perfil.objetivos.some(obj => obj.prazo > 10) ? 0.8 : 
                             perfil.objetivos.some(obj => obj.prazo > 5) ? 0.6 : 0.4;

       return {
         score: (idadeScore + experienciaScore + horizonteScore) / 3,
         fatores: { idadeScore, experienciaScore, horizonteScore }
       };
     };

    // Executar análises
    const riscoFinanceiro = analisarRiscoFinanceiro();
    const riscoPsicologico = analisarRiscoPsicologico();
    const riscoTemporal = analisarRiscoTemporal();

    // Simular análise de correlação e volatilidade
    const volatilidade = Math.random() * 0.3 + 0.1; // 10% a 40%
    const correlacao = Math.random() * 0.8 + 0.1; // 10% a 90%
    const diversificacao = Math.max(0, 100 - correlacao * 100);
    
    // Calcular score final ponderado
    const scoreRisco = Math.round(
      (riscoFinanceiro.score * 0.4 + riscoPsicologico.score * 0.35 + riscoTemporal.score * 0.25) * 100
    );
    
    // Definir fatores de risco detalhados
    const fatoresRisco: FatorRisco[] = [
      {
        id: 'financeiro',
        nome: 'Capacidade Financeira',
        impacto: riscoFinanceiro.score > 0.7 ? 'baixo' : riscoFinanceiro.score > 0.4 ? 'medio' : 'alto',
        descricao: `Renda: R$ ${perfil.rendaMensal.toLocaleString()}, Patrimônio: R$ ${perfil.patrimonioAtual.toLocaleString()}`,
        peso: 0.4
      },
      {
        id: 'psicologico',
        nome: 'Perfil Psicológico',
        impacto: riscoPsicologico.score > 0.7 ? 'baixo' : riscoPsicologico.score > 0.4 ? 'medio' : 'alto',
        descricao: `Volatilidade emocional: ${(riscoPsicologico.fatores.volatilidade * 100).toFixed(1)}%`,
        peso: 0.35
      },
      {
        id: 'temporal',
        nome: 'Horizonte Temporal',
        impacto: riscoTemporal.score > 0.7 ? 'baixo' : riscoTemporal.score > 0.4 ? 'medio' : 'alto',
        descricao: `Idade: ${perfil.idade} anos, Experiência: ${perfil.experienciaInvestimentos}`,
        peso: 0.25
      },
      {
        id: 'diversificacao',
        nome: 'Diversificação',
        impacto: perfil.preferenciasInvestimento.length > 3 ? 'baixo' : perfil.preferenciasInvestimento.length > 1 ? 'medio' : 'alto',
        descricao: `${perfil.preferenciasInvestimento.length} tipos de investimento preferidos`,
        peso: 0.2
      }
    ];

    // Gerar recomendações específicas de mitigação
    const recomendacoesMitigacao: string[] = [];
    
    if (riscoFinanceiro.score < 0.5) {
      recomendacoesMitigacao.push('Focar em investimentos de baixo risco até estabilizar situação financeira');
      recomendacoesMitigacao.push('Priorizar formação de reserva de emergência');
    }
    
    if (riscoPsicologico.score < 0.5) {
      recomendacoesMitigacao.push('Implementar investimentos automáticos para reduzir decisões emocionais');
      recomendacoesMitigacao.push('Estudar sobre psicologia dos investimentos');
    }
    
    if (riscoTemporal.score < 0.5) {
      recomendacoesMitigacao.push('Focar em investimentos de curto prazo e alta liquidez');
      recomendacoesMitigacao.push('Aumentar gradualmente a exposição a risco conforme ganha experiência');
    }
    
    if (perfil.preferenciasInvestimento.length < 2) {
      recomendacoesMitigacao.push('Diversificar entre diferentes classes de ativos');
      recomendacoesMitigacao.push('Estudar sobre correlação entre investimentos');
    }

    // Adicionar recomendações gerais
    recomendacoesMitigacao.push('Revisar carteira trimestralmente');
    recomendacoesMitigacao.push('Manter disciplina nos aportes mensais');
    recomendacoesMitigacao.push('Acompanhar indicadores econômicos relevantes');

    return {
      pontuacaoRisco: scoreRisco,
      scoreRisco,
      classificacao: scoreRisco > 75 ? 'muito_alto' : scoreRisco > 50 ? 'alto' : scoreRisco > 25 ? 'moderado' : 'baixo',
      fatoresRisco,
      recomendacoesMitigacao,
      probabilidadePerda: scoreRisco * 0.8,
      perdaMaximaEstimada: scoreRisco * 0.15,
      diversificacaoAtual: diversificacao,
      correlacaoAtivos: correlacao,
      volatilidade,
      sharpeRatio: Math.max(0.5, 2 - scoreRisco * 0.02),
      dataAnalise: new Date(),
      detalhesAnalise: {
        riscoFinanceiro: riscoFinanceiro.score,
        riscoPsicologico: riscoPsicologico.score,
        riscoTemporal: riscoTemporal.score,
        confiabilidade: Math.min(perfil.comportamentoHistorico.length / 10, 1) * 100
      }
    };
  }, [calcularToleranciaRisco]);

  // Sistema inteligente de recomendações de rebalanceamento
  const gerarRecomendacoesRebalanceamento = useCallback(async (perfil: PerfilInvestidor, carteira?: any): Promise<RebalanceamentoIA> => {
    const toleranciaRisco = calcularToleranciaRisco(perfil);
    
    // Definir alocação ideal baseada no perfil
    const definirAlocacaoIdeal = () => {
      if (toleranciaRisco > 80) {
        return { acoes: 70, fiis: 15, rendaFixa: 10, internacional: 5 };
      } else if (toleranciaRisco > 60) {
        return { acoes: 50, fiis: 20, rendaFixa: 25, internacional: 5 };
      } else if (toleranciaRisco > 40) {
        return { acoes: 30, fiis: 15, rendaFixa: 50, internacional: 5 };
      } else {
        return { acoes: 15, fiis: 10, rendaFixa: 70, internacional: 5 };
      }
    };

    // Simular carteira atual (em um cenário real, viria dos dados do usuário)
    const carteiraAtual = carteira || {
      acoes: 40 + (Math.random() - 0.5) * 20,
      fiis: 20 + (Math.random() - 0.5) * 10,
      rendaFixa: 35 + (Math.random() - 0.5) * 15,
      internacional: 5 + (Math.random() - 0.5) * 5
    };

    const alocacaoIdeal = definirAlocacaoIdeal();
    
    // Calcular desvios e necessidades de rebalanceamento
    const calcularDesvios = () => {
      const desvios = {
        acoes: alocacaoIdeal.acoes - carteiraAtual.acoes,
        fiis: alocacaoIdeal.fiis - carteiraAtual.fiis,
        rendaFixa: alocacaoIdeal.rendaFixa - carteiraAtual.rendaFixa,
        internacional: alocacaoIdeal.internacional - carteiraAtual.internacional
      };

      const desvioTotal = Object.values(desvios).reduce((acc, val) => acc + Math.abs(val), 0);
      const necessidadeRebalanceamento: 'alta' | 'media' | 'baixa' = desvioTotal > 10 ? 'alta' : desvioTotal > 5 ? 'media' : 'baixa';

      return { desvios, desvioTotal, necessidadeRebalanceamento };
    };

    const { desvios, desvioTotal, necessidadeRebalanceamento } = calcularDesvios();

    // Gerar movimentações específicas
    const movimentacoes: MovimentacaoRebalanceamento[] = [];
    
    Object.entries(desvios).forEach(([ativo, desvio]) => {
      if (Math.abs(desvio) > 2) { // Só rebalancear se desvio > 2%
        movimentacoes.push({
          ativo: ativo as 'acoes' | 'fiis' | 'rendaFixa' | 'internacional',
          acao: desvio > 0 ? 'comprar' : 'vender',
          percentualAtual: carteiraAtual[ativo as keyof typeof carteiraAtual],
          percentualAlvo: alocacaoIdeal[ativo as keyof typeof alocacaoIdeal],
          valorEstimado: Math.abs(desvio) * perfil.patrimonioAtual / 100,
          prioridade: Math.abs(desvio) > 10 ? 'alta' : Math.abs(desvio) > 5 ? 'media' : 'baixa',
          justificativa: desvio > 0 
            ? `Aumentar exposição em ${ativo} para ${alocacaoIdeal[ativo as keyof typeof alocacaoIdeal]}%`
            : `Reduzir exposição em ${ativo} para ${alocacaoIdeal[ativo as keyof typeof alocacaoIdeal]}%`
        });
      }
    });

    // Calcular benefícios esperados
    const beneficiosEsperados = {
      reducaoRisco: Math.min(15, desvioTotal * 0.5),
      melhorDiversificacao: Math.min(20, desvioTotal * 0.8),
      alinhamentoPerfil: Math.min(25, desvioTotal * 1.2),
      otimizacaoRetorno: Math.min(10, desvioTotal * 0.3)
    };

    // Gerar cronograma de execução
    const cronogramaExecucao = movimentacoes
      .sort((a, b) => {
        const prioridadeOrder = { alta: 3, media: 2, baixa: 1 };
        return prioridadeOrder[b.prioridade] - prioridadeOrder[a.prioridade];
      })
      .map((mov, index) => ({
        ordem: index + 1,
        acao: `${mov.acao} ${mov.ativo}`,
        prazoRecomendado: mov.prioridade === 'alta' ? '1 semana' : mov.prioridade === 'media' ? '2 semanas' : '1 mês',
        observacoes: mov.prioridade === 'alta' ? 'Executar prioritariamente' : 'Aguardar oportunidade de mercado'
      }));

    return {
      necessidadeRebalanceamento,
      alocacaoAtual: carteiraAtual,
      alocacaoRecomendada: alocacaoIdeal,
      movimentacoes,
      beneficiosEsperados,
      custoEstimado: movimentacoes.reduce((acc, mov) => acc + mov.valorEstimado * 0.005, 0), // 0.5% de custo
      cronogramaExecucao,
      dataAnalise: new Date(),
      proximaRevisao: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 meses
      observacoes: [
        necessidadeRebalanceamento === 'alta' 
          ? 'Rebalanceamento urgente recomendado'
          : necessidadeRebalanceamento === 'media'
          ? 'Rebalanceamento recomendado nas próximas semanas'
          : 'Carteira bem balanceada, monitorar mensalmente',
        'Considerar custos de transação',
        'Avaliar momento de mercado para execução',
        'Manter disciplina na estratégia de longo prazo'
      ]
    };
  }, [calcularToleranciaRisco]);

  // Simulação de dados de mercado
  const simularDadosMercado = useCallback((): DadosMercadoIA => {
    const sentimentos = ['muito_pessimista', 'pessimista', 'neutro', 'otimista', 'muito_otimista'] as const;
    const sentimentoAtual = sentimentos[Math.floor(Math.random() * sentimentos.length)];

    return {
      indices: {
        'IBOV': 118000 + (Math.random() - 0.5) * 10000,
        'IFIX': 2800 + (Math.random() - 0.5) * 200,
        'S&P500': 4200 + (Math.random() - 0.5) * 400
      },
      sentimentoMercado: sentimentoAtual,
      volatilidade: Math.random() * 0.3 + 0.1,
      tendencias: [
        'Alta do dólar',
        'Queda da Selic',
        'Crescimento do PIB',
        'Inflação controlada'
      ],
      eventosRelevantes: [
        {
          data: new Date(),
          tipo: 'economico',
          descricao: 'Reunião do COPOM',
          impactoEstimado: 'alto',
          setoresAfetados: ['Bancos', 'Imobiliário']
        }
      ],
      previsoes: [
        {
          horizonte: '3m',
          cenario: 'base',
          probabilidade: 60,
          retornoEstimado: 0.08,
          volatilidade: 0.15,
          principais_drivers: ['Política monetária', 'Cenário externo']
        }
      ],
      ultimaAtualizacao: new Date()
    };
  }, []);

  // Geração de alertas inteligentes
  const gerarAlertasInteligentes = useCallback((perfil?: PerfilInvestidor): AlertaInteligente[] => {
    const alertas: AlertaInteligente[] = [];
    const agora = new Date();
    const dadosMercado = simularDadosMercado();

    // Sistema de scoring para alertas baseado em múltiplos fatores
    const calcularScoreAlerta = (tipo: string, severidade: number, relevancia: number) => {
      return (severidade * 0.6 + relevancia * 0.4) * 100;
    };

    // Alertas baseados em volatilidade inteligente
    if (dadosMercado.volatilidade > 0.25) {
      const score = calcularScoreAlerta('volatilidade', dadosMercado.volatilidade, 0.8);
      alertas.push({
        id: `alert-volatility-${Date.now()}`,
        tipo: 'mercado',
        titulo: 'Volatilidade Elevada Detectada',
        mensagem: `Volatilidade atual de ${(dadosMercado.volatilidade * 100).toFixed(1)}% está acima do normal. ${perfil?.toleranciaRisco === 'conservador' ? 'Recomendamos cautela extra.' : 'Monitore oportunidades de entrada.'}`,
        severidade: dadosMercado.volatilidade > 0.3 ? 'error' : 'warning',
        dadosRelevantes: {
          volatilidade: `${(dadosMercado.volatilidade * 100).toFixed(1)}%`,
          indice_medo: Math.floor(dadosMercado.volatilidade * 100),
          setores_afetados: ['Tecnologia', 'Varejo', 'Financeiro'],
          score_alerta: score.toFixed(0)
        },
        acoesSugeridas: perfil?.toleranciaRisco === 'conservador' 
          ? [
              'Aumentar posição em renda fixa',
              'Reduzir exposição a ações',
              'Aguardar estabilização do mercado'
            ]
          : [
              'Revisar alocação de ativos',
              'Considerar oportunidades de compra',
              'Manter disciplina na estratégia'
            ],
        dataGeracao: agora,
        visualizado: false,
        ativo: true
      });
    }

    // Alertas baseados em sentimento de mercado
    if (dadosMercado.sentimentoMercado === 'muito_pessimista' || dadosMercado.sentimentoMercado === 'muito_otimista') {
      const isExtremo = true;
      alertas.push({
        id: `alert-sentiment-${Date.now()}`,
        tipo: dadosMercado.sentimentoMercado === 'muito_pessimista' ? 'oportunidade' : 'risco',
        titulo: `Sentimento ${dadosMercado.sentimentoMercado === 'muito_pessimista' ? 'Extremamente Pessimista' : 'Extremamente Otimista'}`,
        mensagem: `O mercado está ${dadosMercado.sentimentoMercado === 'muito_pessimista' ? 'em pânico - possível oportunidade de compra' : 'eufórico - considere realizar lucros'}.`,
        severidade: dadosMercado.sentimentoMercado === 'muito_pessimista' ? 'success' : 'warning',
        dadosRelevantes: {
          sentimento: dadosMercado.sentimentoMercado,
          indicador_contrario: dadosMercado.sentimentoMercado === 'muito_pessimista' ? 'Compra' : 'Venda',
          confiabilidade: '85%'
        },
        acoesSugeridas: dadosMercado.sentimentoMercado === 'muito_pessimista'
          ? [
              'Considerar compras graduais',
              'Aproveitar preços baixos',
              'Manter reserva de emergência'
            ]
          : [
              'Realizar lucros parciais',
              'Reduzir exposição a risco',
              'Aguardar correção'
            ],
        dataGeracao: agora,
        visualizado: false,
        ativo: true
      });
    }

    // Alertas de eventos econômicos
    dadosMercado.eventosRelevantes.forEach(evento => {
      if (evento.impactoEstimado === 'alto') {
        alertas.push({
          id: `alert-event-${Date.now()}-${Math.random()}`,
          tipo: 'mercado',
          titulo: `Evento Econômico: ${evento.descricao}`,
          mensagem: `${evento.descricao} pode impactar significativamente os setores: ${evento.setoresAfetados.join(', ')}.`,
          severidade: 'info',
          dadosRelevantes: {
            evento: evento.descricao,
            data: evento.data.toLocaleDateString(),
            setores: evento.setoresAfetados.join(', '),
            impacto: evento.impactoEstimado
          },
          acoesSugeridas: [
            'Monitorar setores afetados',
            'Avaliar posições relacionadas',
            'Preparar estratégia de hedge se necessário'
          ],
          dataGeracao: agora,
          visualizado: false,
          ativo: true
        });
      }
    });

    // Alertas personalizados baseados no perfil do usuário
    if (perfil) {
      // Alerta de rebalanceamento baseado no tempo
      const ultimaAtualizacao = perfil.ultimaAtualizacao;
      const diasSemAtualizacao = Math.floor((agora.getTime() - ultimaAtualizacao.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diasSemAtualizacao > 90) {
        alertas.push({
          id: `alert-rebalance-${Date.now()}`,
          tipo: 'portfolio',
          titulo: 'Revisão de Portfólio Necessária',
          mensagem: `Sua carteira não é revisada há ${diasSemAtualizacao} dias. Recomendamos uma análise.`,
          severidade: 'warning',
          dadosRelevantes: {
            dias_sem_revisao: diasSemAtualizacao.toString(),
            ultima_atualizacao: ultimaAtualizacao.toLocaleDateString(),
            recomendacao: 'Revisão trimestral'
          },
          acoesSugeridas: [
            'Analisar performance atual',
            'Verificar alinhamento com objetivos',
            'Considerar rebalanceamento'
          ],
          dataGeracao: agora,
          visualizado: false,
          ativo: true
        });
      }

      // Alerta de oportunidade baseado em tolerância a risco
      if (perfil.toleranciaRisco === 'arrojado' && dadosMercado.volatilidade > 0.2) {
        alertas.push({
          id: `alert-aggressive-opp-${Date.now()}`,
          tipo: 'oportunidade',
          titulo: 'Oportunidade para Perfil Agressivo',
          mensagem: 'A volatilidade atual pode oferecer oportunidades interessantes para seu perfil de risco.',
          severidade: 'success',
          dadosRelevantes: {
            perfil_risco: perfil.toleranciaRisco,
            volatilidade_atual: `${(dadosMercado.volatilidade * 100).toFixed(1)}%`,
            oportunidade: 'Alta'
          },
          acoesSugeridas: [
            'Analisar ações em queda',
            'Considerar dollar-cost averaging',
            'Manter disciplina de stop-loss'
          ],
          dataGeracao: agora,
          visualizado: false,
          ativo: true
        });
      }
    }

    // Alertas de tendências de mercado
    dadosMercado.tendencias.forEach((tendencia, index) => {
      if (index < 2) { // Apenas as 2 principais tendências
        alertas.push({
          id: `alert-trend-${Date.now()}-${index}`,
          tipo: 'mercado',
          titulo: `Tendência de Mercado: ${tendencia}`,
          mensagem: `Tendência identificada: ${tendencia}. Avalie o impacto em sua carteira.`,
          severidade: 'info',
          dadosRelevantes: {
            tendencia: tendencia,
            relevancia: index === 0 ? 'Alta' : 'Média',
            periodo: '30 dias'
          },
          acoesSugeridas: [
            'Analisar exposição aos setores afetados',
            'Considerar ajustes táticos',
            'Monitorar desenvolvimento da tendência'
          ],
          dataGeracao: agora,
          visualizado: false,
          ativo: true
        });
      }
    });

    // Filtrar e ordenar alertas por relevância
    return alertas
      .filter(alerta => alerta.ativo)
      .sort((a, b) => {
        const severidadeOrder = { error: 4, warning: 3, success: 2, info: 1 };
        return severidadeOrder[b.severidade] - severidadeOrder[a.severidade];
      })
      .slice(0, 10); // Limitar a 10 alertas mais relevantes
  }, [simularDadosMercado]);

  // Funções principais
  const criarPerfil = useCallback(async (dados: Partial<PerfilInvestidor>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const novoPerfil: PerfilInvestidor = {
        id: `perfil-${Date.now()}`,
        nome: dados.nome || '',
        idade: dados.idade || 30,
        rendaMensal: dados.rendaMensal || 5000,
        patrimonioAtual: dados.patrimonioAtual || 50000,
        objetivos: dados.objetivos || [],
        toleranciaRisco: dados.toleranciaRisco || 'moderado',
        horizonteTemporal: dados.horizonteTemporal || 5,
        experienciaInvestimentos: dados.experienciaInvestimentos || 'intermediario',
        situacaoFamiliar: dados.situacaoFamiliar || 'solteiro',
        preferenciasInvestimento: dados.preferenciasInvestimento || [],
        comportamentoHistorico: dados.comportamentoHistorico || [],
        ultimaAtualizacao: new Date()
      };

      setPerfil(novoPerfil);
      
      // Gerar análise inicial
      const analise = await analisarRiscoAutomatizado(novoPerfil);
      setAnaliseRisco(analise);
      
    } catch (err) {
      setError('Erro ao criar perfil');
    } finally {
      setIsLoading(false);
    }
  }, [analisarRiscoAutomatizado]);

  const atualizarPerfil = useCallback(async (dados: Partial<PerfilInvestidor>) => {
    if (!perfil) return;
    
    setIsLoading(true);
    try {
      const perfilAtualizado = {
        ...perfil,
        ...dados,
        ultimaAtualizacao: new Date()
      };
      
      setPerfil(perfilAtualizado);
      
      // Regenerar análise
      const analise = await analisarRiscoAutomatizado(perfilAtualizado);
      setAnaliseRisco(analise);
      
    } catch (err) {
      setError('Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  }, [perfil, analisarRiscoAutomatizado]);

  const analisarPerfil = useCallback(async (): Promise<AnaliseRiscoIA> => {
    if (!perfil) throw new Error('Perfil não encontrado');
    
    setIsLoading(true);
    try {
      const analise = await analisarRiscoAutomatizado(perfil);
      setAnaliseRisco(analise);
      return analise;
    } finally {
      setIsLoading(false);
    }
  }, [perfil, analisarRiscoAutomatizado]);

  const gerarRecomendacoes = useCallback(async (): Promise<RecomendacaoIA[]> => {
    if (!perfil) return [];
    
    setIsLoading(true);
    try {
      const novasRecomendacoes = await gerarRecomendacoesML(perfil);
      setRecomendacoes(prev => [...prev, ...novasRecomendacoes]);
      return novasRecomendacoes;
    } finally {
      setIsLoading(false);
    }
  }, [perfil, gerarRecomendacoesML]);

  const aceitarRecomendacao = useCallback(async (id: string) => {
    setRecomendacoes(prev => 
      prev.map(rec => 
        rec.id === id ? { ...rec, status: 'aceita' } : rec
      )
    );
  }, []);

  const rejeitarRecomendacao = useCallback(async (id: string, motivo?: string) => {
    setRecomendacoes(prev => 
      prev.map(rec => 
        rec.id === id ? { ...rec, status: 'rejeitada' } : rec
      )
    );
  }, []);

  const fornecerFeedback = useCallback(async (id: string, feedback: FeedbackRecomendacao) => {
    setRecomendacoes(prev => 
      prev.map(rec => 
        rec.id === id ? { ...rec, feedback } : rec
      )
    );
  }, []);

  const configurarAlertas = useCallback(async (tipos: string[]) => {
    setConfiguracao(prev => ({
      ...prev,
      tiposRecomendacao: tipos
    }));
  }, []);

  const marcarAlertaVisualizado = useCallback((id: string) => {
    setAlertas(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, visualizado: true } : alert
      )
    );
  }, []);

  const desativarAlerta = useCallback((id: string) => {
    setAlertas(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, ativo: false } : alert
      )
    );
  }, []);

  const analisarRebalanceamento = useCallback(async (): Promise<RebalanceamentoIA> => {
    if (!perfil) throw new Error('Perfil não encontrado');
    
    return await gerarRecomendacoesRebalanceamento(perfil);
  }, [perfil, gerarRecomendacoesRebalanceamento]);

  const executarRebalanceamento = useCallback(async (id: string) => {
    // Simulação de execução
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setRebalanceamento(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const atualizarDadosMercado = useCallback(async () => {
    setIsLoading(true);
    try {
      const dados = simularDadosMercado();
      setDadosMercado(dados);
      
      // Gerar alertas baseados nos dados
      const novosAlertas = gerarAlertasInteligentes(perfil || undefined);
      setAlertas(prev => [...prev, ...novosAlertas]);
      
    } finally {
      setIsLoading(false);
    }
  }, [simularDadosMercado, gerarAlertasInteligentes, perfil]);

  const obterPrevisoes = useCallback((horizonte: string): PrevisaoMercado[] => {
    return dadosMercado?.previsoes.filter(p => p.horizonte === horizonte) || [];
  }, [dadosMercado]);

  const atualizarConfiguracao = useCallback((config: Partial<ConfiguracaoIA>) => {
    setConfiguracao(prev => ({ ...prev, ...config }));
  }, []);

  const resetarIA = useCallback(async () => {
    setPerfil(null);
    setRecomendacoes([]);
    setAlertas([]);
    setAnaliseRisco(null);
    setRebalanceamento(null);
    setDadosMercado(null);
    setError(null);
  }, []);

  // Efeitos
  useEffect(() => {
    // Atualizar dados de mercado periodicamente
    const interval = setInterval(() => {
      if (configuracao.alertasAtivos) {
        atualizarDadosMercado();
      }
    }, 5 * 60 * 1000); // A cada 5 minutos

    return () => clearInterval(interval);
  }, [configuracao.alertasAtivos, atualizarDadosMercado]);

  useEffect(() => {
    // Gerar recomendações automaticamente
    if (perfil && configuracao.frequenciaAnalise === 'diaria') {
      const interval = setInterval(() => {
        gerarRecomendacoes();
      }, 24 * 60 * 60 * 1000); // Diário

      return () => clearInterval(interval);
    }
  }, [perfil, configuracao.frequenciaAnalise, gerarRecomendacoes]);

  return {
    // Estado
    perfil,
    recomendacoes: recomendacoes.filter(r => r.status !== 'expirada'),
    alertas: alertas.filter(a => a.ativo),
    analiseRisco,
    rebalanceamento,
    dadosMercado,
    configuracao,
    isLoading,
    error,

    // Funções
    criarPerfil,
    atualizarPerfil,
    analisarPerfil,
    gerarRecomendacoes,
    gerarRecomendacoesRebalanceamento,
    aceitarRecomendacao,
    rejeitarRecomendacao,
    fornecerFeedback,
    configurarAlertas,
    marcarAlertaVisualizado,
    desativarAlerta,
    analisarRebalanceamento,
    executarRebalanceamento,
    atualizarDadosMercado,
    obterPrevisoes,
    atualizarConfiguracao,
    resetarIA
  };
};