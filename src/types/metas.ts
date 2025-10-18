export interface MetaFinanceira {
  id: string;
  nome: string;
  descricao?: string;
  valorObjetivo: number;
  valorMeta: number; // Alias for valorObjetivo for compatibility
  valorAtual: number;
  dataInicio: Date;
  dataObjetivo: Date;
  dataLimite: Date; // Alias for dataObjetivo for compatibility
  categoria: 'aposentadoria' | 'casa' | 'carro' | 'viagem' | 'emergencia' | 'educacao' | 'outro';
  prioridade: 'baixa' | 'media' | 'alta';
  status: 'ativa' | 'pausada' | 'concluida' | 'cancelada' | 'em_andamento'; // Adicionado 'em_andamento'
  cor: string;
  icone?: string;
  contribuicaoMensal?: number;
  taxaJuros?: number;
  notificacoes: {
    marcos: boolean; // 25%, 50%, 75%, 90%
    prazo: boolean; // Quando próximo do prazo
    contribuicao: boolean; // Lembrete de contribuição
  };
  historico: Array<{
    data: Date;
    valor: number;
    tipo: 'deposito' | 'retirada' | 'rendimento';
    descricao?: string;
  }>;
  simulacao?: {
    valorInicial: number;
    valorMensal: number;
    taxaJuros: number;
    periodo: number;
  };
}

export interface ProgressoMeta {
  percentualConcluido: number;
  valorRestante: number;
  diasRestantes: number;
  valorNecessarioMensal: number;
  projecaoDataConclusao: Date;
  statusPrazo: 'no-prazo' | 'atrasado' | 'adiantado';
  marcos: Array<{
    percentual: number;
    atingido: boolean;
    data?: Date;
  }>;
}

export interface NotificacaoMeta {
  id: string;
  metaId: string;
  tipo: 'marco' | 'prazo' | 'contribuicao' | 'concluida' | 'meta_concluida' | 'marco_atingido'; // Tipos expandidos
  titulo: string;
  mensagem: string;
  data: Date;
  lida: boolean;
  prioridade: 'baixa' | 'media' | 'alta';
}

export interface EstatisticasMetas {
  totalMetas: number;
  metasAtivas: number;
  metasConcluidas: number;
  valorTotalObjetivos: number;
  valorTotalAtual: number;
  percentualGeralConcluido: number;
  metaProximaVencimento: MetaFinanceira | null;
  metaMaiorProgresso: MetaFinanceira | null;
}

// Tipos auxiliares para análise de viabilidade
export interface AnaliseViabilidadeMeta {
  viavel: boolean;
  motivoInviabilidade?: string;
  sugestoes: string[];
  valorMensalRecomendado: number;
  probabilidadeSucesso: number;
  cenarios: {
    otimista: { dataPrevisao: Date; valorMensal: number };
    realista: { dataPrevisao: Date; valorMensal: number };
    pessimista: { dataPrevisao: Date; valorMensal: number };
  };
}

// Tipos para sistema de notificações avançado
export interface ConfiguracaoNotificacoesMeta {
  marcos: {
    ativo: boolean;
    percentuais: number[]; // [25, 50, 75, 90]
  };
  prazo: {
    ativo: boolean;
    diasAntecedencia: number[];
  };
  contribuicao: {
    ativo: boolean;
    frequencia: 'semanal' | 'quinzenal' | 'mensal';
    diasLembrete: number[];
  };
  atraso: {
    ativo: boolean;
    diasTolerancia: number;
  };
}

// Tipos para integração com simulações
export interface IntegracaoSimulacaoMeta {
  metaId: string;
  simulacaoId: string;
  sincronizada: boolean;
  ultimaAtualizacao: Date;
  parametros: {
    valorInicial: number;
    valorMensal: number;
    taxaJuros: number;
    periodo: number;
  };
}