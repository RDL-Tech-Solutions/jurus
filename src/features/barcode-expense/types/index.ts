/**
 * Tipos para Módulo Barcode Expense
 */

export type BarcodeType = 
  | 'boleto'
  | 'pix'
  | 'ean13'
  | 'nfce'
  | 'qrcode'
  | 'unknown';

export type PaymentMethod = 
  | 'dinheiro'
  | 'debito'
  | 'credito'
  | 'pix'
  | 'boleto';

export interface BarcodeData {
  raw: string;
  type: BarcodeType;
  parsed: ParsedBarcodeData;
}

export interface ParsedBarcodeData {
  // Comum
  valor?: number;
  descricao?: string;
  data?: string;
  
  // Boleto
  linhaDigitavel?: string;
  vencimento?: string;
  banco?: string;
  beneficiario?: string;
  
  // PIX
  pixKey?: string;
  pixRecebedor?: string;
  pixIdentificador?: string;
  
  // Produto (EAN)
  ean?: string;
  nomeProduto?: string;
  categoria?: string;
  
  // NFC-e
  chaveNFe?: string;
  cnpj?: string;
  estabelecimento?: string;
  itens?: NFCeItem[];
  totalNota?: number;
}

export interface NFCeItem {
  codigo: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface ExpenseFromBarcode {
  descricao: string;
  valor: number;
  data: string;
  categoriaId: string;
  formaPagamento: PaymentMethod;
  parcelas?: number;
  recorrente: boolean;
  observacoes?: string;
  cartaoId?: string;
  barcodeData?: BarcodeData;
}

export interface ScannerConfig {
  enableCamera: boolean;
  enableUpload: boolean;
  enableOCR: boolean;
  autoDetect: boolean;
}
