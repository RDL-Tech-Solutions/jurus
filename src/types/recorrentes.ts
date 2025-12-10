/**
 * Tipos para Transações Recorrentes
 */

export type FrequenciaRecorrente = 
  | 'diario'
  | 'semanal'
  | 'quinzenal'
  | 'mensal'
  | 'bimestral'
  | 'trimestral'
  | 'semestral'
  | 'anual';

export type StatusParcela = 'pendente' | 'efetivada' | 'vencida';

export interface ParcelaRecorrente {
  id: string;
  recorrenteId: string;
  numero: number;
  dataPrevisao: string;
  dataEfetivacao?: string;
  valor: number;
  status: StatusParcela;
  transacaoId?: string;
}

export interface TransacaoRecorrente {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'entrada' | 'saida';
  categoriaId: string;
  contaId?: string;
  cartaoId?: string;
  dividaId?: string;
  frequencia: FrequenciaRecorrente;
  dataInicio: string;
  dataFim?: string;
  numeroParcelas?: number;
  ativa: boolean;
  observacoes?: string;
  parcelas: ParcelaRecorrente[];
  criadoEm: string;
  atualizadoEm: string;
}

export interface EfetivarParcelaData {
  parcelaId: string;
  recorrenteId: string;
  dataEfetivacao?: string;
  valorAjustado?: number;
  categoriaIdAjustada?: string;
}

export interface EditarRecorrenteData {
  modo: 'individual' | 'todos';
  parcelaId?: string;
  dados: Partial<TransacaoRecorrente>;
}
