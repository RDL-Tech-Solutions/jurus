/**
 * Types for simulation functionality
 */

export interface Simulacao {
  id: string;
  nome: string;
  tipo: 'juros_compostos' | 'juros_simples' | 'financiamento' | 'investimento';
  parametros: SimulacaoParametros;
  resultado?: ResultadoSimulacao;
  dataCreacao: Date;
  dataAtualizacao?: Date;
  // Propriedades do SimulacaoInput para compatibilidade
  valorInicial: number;
  valorMensal: number;
  periodo: number;
  modalidade?: {
    id: string;
    nome: string;
    taxaAnual: number;
    tipo: 'poupanca' | 'cdb' | 'lci_lca' | 'tesouro';
  };
}

export interface SimulacaoParametros {
  valorInicial: number;
  valorMensal?: number;
  taxa: number;
  periodo: number;
  tipoTaxa: 'mensal' | 'anual';
  tipoCalculo?: 'juros_compostos' | 'juros_simples';
}

export interface ResultadoSimulacao {
  valorFinal: number;
  saldoFinal: number; // Alias para valorFinal
  totalInvestido: number;
  totalJuros: number;
  rendimentoTotal: number; // Alias para totalJuros
  jurosGanhos: number; // Alias para totalJuros
  taxaEfetiva?: number;
  evolucaoMensal: Array<{
    mes: number;
    contribuicao: number;
    juros: number;
    saldoAcumulado: number;
    valorInvestido?: number;
    valorAcumulado?: number;
  }>;
}

export interface SimulacaoJuros extends Simulacao {
  tipo: 'juros_compostos' | 'juros_simples';
}

export interface SimulacaoInvestimento extends Simulacao {
  tipo: 'investimento';
  parametros: SimulacaoParametros & {
    valorMensal: number;
    inflacao?: number;
  };
}

export interface SimulacaoFinanciamento extends Simulacao {
  tipo: 'financiamento';
  parametros: SimulacaoParametros & {
    valorFinanciado: number;
    entrada?: number;
    sistemaAmortizacao: 'SAC' | 'PRICE';
  };
}

export interface CenarioSimulacao {
  id: string;
  nome: string;
  descricao?: string;
  simulacoes: Simulacao[];
  comparacao?: {
    melhorOpcao: string;
    diferencaValor: number;
    diferencaPercentual: number;
  };
}