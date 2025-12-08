// Re-exporta tudo de calculations.ts
export * from './calculations';

// Função para formatar valores monetários
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

// Função para formatar percentual
export function formatarPercentual(valor: number, casasDecimais: number = 2): string {
  return `${valor.toFixed(casasDecimais)}%`;
}

// Função para formatar número
export function formatarNumero(valor: number, casasDecimais: number = 0): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais
  }).format(valor);
}

// Função para converter string de data YYYY-MM-DD para Date local (sem problema de timezone)
export function parseDataLocal(dataString: string): Date {
  // Split YYYY-MM-DD e cria data no timezone local
  const [ano, mes, dia] = dataString.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

// Função para formatar data para exibição (DD/MM/YYYY)
export function formatarData(dataString: string): string {
  const data = parseDataLocal(dataString);
  return data.toLocaleDateString('pt-BR');
}

// Função para formatar data curta (ex: 08 dez)
export function formatarDataCurta(dataString: string): string {
  const data = parseDataLocal(dataString);
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}
