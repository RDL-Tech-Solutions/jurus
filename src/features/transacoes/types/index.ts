/**
 * Tipos específicos do módulo de Transações
 * Isolado de dívidas e cartões
 */

import { TipoTransacao, RecorrenciaTransacao } from '../../../types/fluxoCaixa';

export interface TransacaoExpandida {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoriaId: string;
  data: string;
  observacoes?: string;
  
  // Flags de tipo
  isRecorrente?: boolean;
  isParcelada?: boolean;
  
  // Dados de recorrência
  recorrenciaId?: string;
  recorrenciaFrequencia?: RecorrenciaTransacao;
  recorrenciaDataInicio?: string;
  
  // Dados de parcelamento
  parcelaAtual?: number;
  totalParcelas?: number;
  valorParcela?: number;
  
  criadoEm: string;
  atualizadoEm: string;
}

export interface FiltrosMes {
  mes: number; // 1-12
  ano: number;
}

export interface ResumoMensal {
  mes: number;
  ano: number;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  quantidadeTransacoes: number;
}

export interface TransacoesPorDia {
  data: string; // YYYY-MM-DD
  transacoes: TransacaoExpandida[];
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface NavegacaoMes {
  mesAtual: string; // YYYY-MM
  mesAnterior: () => void;
  proximoMes: () => void;
  irParaMes: (mes: number, ano: number) => void;
  irParaHoje: () => void;
}
