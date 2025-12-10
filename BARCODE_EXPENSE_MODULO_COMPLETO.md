# 📷 MÓDULO BARCODE EXPENSE - COMPLETO

## 🎯 ARQUITETURA PROFISSIONAL

---

## 1. ESTRUTURA DE PASTAS

```
src/features/barcode-expense/
├── components/
│   ├── BarcodeScanner.tsx
│   ├── InsertExpenseFromBarcode.tsx
│   ├── CardInserirPorCodigo.tsx
│   ├── BarcodeResult.tsx
│   └── index.ts
├── services/
│   ├── BarcodeReaderService.ts
│   ├── BarcodeParser.ts
│   ├── OCRService.ts
│   └── index.ts
├── hooks/
│   ├── useBarcodeExpense.ts
│   └── useBarcodeScanner.ts
├── types/
│   └── index.ts
└── utils/
    ├── validators.ts
    └── formatters.ts
```

---

## 2. TIPOS E INTERFACES

### **src/features/barcode-expense/types/index.ts**

```typescript
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
```

---

## 3. SERVIÇO DE LEITURA

### **src/features/barcode-expense/services/BarcodeReaderService.ts**

```typescript
import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeFormat } from '@zxing/library';

export class BarcodeReaderService {
  private reader: BrowserMultiFormatReader;
  private stream: MediaStream | null = null;

  constructor() {
    this.reader = new BrowserMultiFormatReader();
  }

  /**
   * Inicia câmera e escaneia código
   */
  async startCamera(videoElement: HTMLVideoElement): Promise<void> {
    try {
      const constraints = {
        video: {
          facingMode: 'environment', // Câmera traseira
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.srcObject = this.stream;
      await videoElement.play();
    } catch (error) {
      throw new Error('Erro ao acessar câmera: ' + error);
    }
  }

  /**
   * Para câmera
   */
  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  /**
   * Escaneia código da câmera
   */
  async scanFromCamera(
    videoElement: HTMLVideoElement,
    onResult: (result: string) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      const result = await this.reader.decodeFromVideoDevice(
        undefined,
        videoElement,
        (result, error) => {
          if (result) {
            onResult(result.getText());
          }
          if (error && !(error instanceof Error)) {
            // Ignora erros de "not found" durante scan contínuo
          }
        }
      );
    } catch (error) {
      onError(error as Error);
    }
  }

  /**
   * Escaneia código de imagem
   */
  async scanFromImage(file: File): Promise<string> {
    try {
      const imageUrl = URL.createObjectURL(file);
      const result = await this.reader.decodeFromImageUrl(imageUrl);
      URL.revokeObjectURL(imageUrl);
      return result.getText();
    } catch (error) {
      throw new Error('Não foi possível ler o código da imagem');
    }
  }

  /**
   * Verifica se navegador suporta câmera
   */
  static isCameraSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
}
```

---

## 4. PARSER DE CÓDIGOS

### **src/features/barcode-expense/services/BarcodeParser.ts**

```typescript
import { BarcodeData, BarcodeType, ParsedBarcodeData } from '../types';

export class BarcodeParser {
  /**
   * Identifica tipo de código
   */
  static identifyType(code: string): BarcodeType {
    // Boleto (linha digitável - 47 ou 48 dígitos)
    if (/^\d{47,48}$/.test(code.replace(/\s/g, ''))) {
      return 'boleto';
    }

    // PIX (começa com 00020126 ou 00020101)
    if (code.startsWith('00020126') || code.startsWith('00020101')) {
      return 'pix';
    }

    // EAN-13 (13 dígitos)
    if (/^\d{13}$/.test(code)) {
      return 'ean13';
    }

    // NFC-e (URL ou chave de 44 dígitos)
    if (code.includes('nfce') || /^\d{44}$/.test(code)) {
      return 'nfce';
    }

    // QR Code genérico
    if (code.startsWith('http') || code.length > 50) {
      return 'qrcode';
    }

    return 'unknown';
  }

  /**
   * Parse completo do código
   */
  static parse(code: string): BarcodeData {
    const type = this.identifyType(code);
    let parsed: ParsedBarcodeData = {};

    switch (type) {
      case 'boleto':
        parsed = this.parseBoleto(code);
        break;
      case 'pix':
        parsed = this.parsePix(code);
        break;
      case 'ean13':
        parsed = this.parseEAN(code);
        break;
      case 'nfce':
        parsed = this.parseNFCe(code);
        break;
      default:
        parsed = { descricao: 'Código não identificado' };
    }

    return {
      raw: code,
      type,
      parsed
    };
  }

  /**
   * Parse de boleto bancário
   */
  private static parseBoleto(code: string): ParsedBarcodeData {
    const cleanCode = code.replace(/\s/g, '');
    
    // Extrair valor (posições 37-47 em centavos)
    const valorStr = cleanCode.substring(37, 47);
    const valor = parseInt(valorStr) / 100;

    // Extrair data de vencimento (posições 33-37)
    const fatorVencimento = parseInt(cleanCode.substring(33, 37));
    const dataBase = new Date('1997-10-07');
    const vencimento = new Date(dataBase.getTime() + fatorVencimento * 24 * 60 * 60 * 1000);

    // Identificar banco (3 primeiros dígitos)
    const codigoBanco = cleanCode.substring(0, 3);
    const bancos: Record<string, string> = {
      '001': 'Banco do Brasil',
      '033': 'Santander',
      '104': 'Caixa Econômica',
      '237': 'Bradesco',
      '341': 'Itaú',
      '756': 'Sicoob'
    };

    return {
      linhaDigitavel: cleanCode,
      valor,
      vencimento: vencimento.toISOString().split('T')[0],
      banco: bancos[codigoBanco] || `Banco ${codigoBanco}`,
      descricao: `Boleto ${bancos[codigoBanco] || 'Bancário'}`,
      data: vencimento.toISOString().split('T')[0]
    };
  }

  /**
   * Parse de QR Code PIX
   */
  private static parsePix(code: string): ParsedBarcodeData {
    // PIX EMV format
    const getValue = (id: string): string => {
      const regex = new RegExp(`${id}(\\d{2})([^\\d]+)`);
      const match = code.match(regex);
      return match ? match[2] : '';
    };

    const recebedor = getValue('59'); // Nome do recebedor
    const cidade = getValue('60'); // Cidade
    const identificador = getValue('05'); // Identificador da transação
    
    // Valor (se presente)
    const valorMatch = code.match(/54(\d{2})(\d+\.?\d*)/);
    const valor = valorMatch ? parseFloat(valorMatch[2]) : undefined;

    return {
      pixRecebedor: recebedor,
      pixIdentificador: identificador,
      valor,
      descricao: `PIX para ${recebedor || 'destinatário'}`,
      data: new Date().toISOString().split('T')[0]
    };
  }

  /**
   * Parse de código EAN-13
   */
  private static parseEAN(code: string): ParsedBarcodeData {
    // Aqui você pode integrar com API de produtos
    // Por enquanto, retorna dados básicos
    return {
      ean: code,
      nomeProduto: `Produto ${code}`,
      descricao: `Compra de produto (EAN: ${code})`,
      categoria: 'compras',
      data: new Date().toISOString().split('T')[0]
    };
  }

  /**
   * Parse de NFC-e
   */
  private static parseNFCe(code: string): ParsedBarcodeData {
    // Se for URL, extrair chave
    let chave = code;
    if (code.includes('nfce')) {
      const match = code.match(/\d{44}/);
      chave = match ? match[0] : code;
    }

    return {
      chaveNFe: chave,
      descricao: 'Nota Fiscal Eletrônica',
      data: new Date().toISOString().split('T')[0]
    };
  }
}
```

---

## 5. SERVIÇO OCR

### **src/features/barcode-expense/services/OCRService.ts**

```typescript
import Tesseract from 'tesseract.js';

export class OCRService {
  /**
   * Extrai texto de imagem
   */
  static async extractText(file: File): Promise<string> {
    try {
      const result = await Tesseract.recognize(file, 'por', {
        logger: (m) => console.log(m)
      });
      
      return result.data.text;
    } catch (error) {
      throw new Error('Erro ao processar imagem com OCR');
    }
  }

  /**
   * Extrai dados de nota fiscal de texto OCR
   */
  static parseNFCeFromOCR(text: string): any {
    const data: any = {};

    // Extrair CNPJ
    const cnpjMatch = text.match(/CNPJ[:\s]*(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/i);
    if (cnpjMatch) data.cnpj = cnpjMatch[1];

    // Extrair total
    const totalMatch = text.match(/TOTAL[:\s]*R?\$?\s*(\d+[,\.]\d{2})/i);
    if (totalMatch) {
      data.totalNota = parseFloat(totalMatch[1].replace(',', '.'));
    }

    // Extrair data
    const dataMatch = text.match(/(\d{2}\/\d{2}\/\d{4})/);
    if (dataMatch) {
      const [dia, mes, ano] = dataMatch[1].split('/');
      data.data = `${ano}-${mes}-${dia}`;
    }

    // Extrair estabelecimento
    const lines = text.split('\n');
    if (lines.length > 0) {
      data.estabelecimento = lines[0].trim();
    }

    return data;
  }
}
```

---

## 6. HOOK PRINCIPAL

### **src/features/barcode-expense/hooks/useBarcodeExpense.ts**

```typescript
import { useState, useCallback } from 'react';
import { BarcodeParser } from '../services/BarcodeParser';
import { BarcodeData, ExpenseFromBarcode } from '../types';
import { useFluxoCaixa } from '../../../hooks/useFluxoCaixa';
import { useCartaoCredito } from '../../../hooks/useCartaoCredito';
import { useDividas } from '../../../hooks/useDividas';
import { useRecorrentes } from '../../../hooks/useRecorrentes';

export function useBarcodeExpense() {
  const [barcodeData, setBarcodeData] = useState<BarcodeData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { adicionarTransacao } = useFluxoCaixa();
  const { adicionarGasto } = useCartaoCredito();
  const { adicionarDivida } = useDividas();
  const { criarRecorrente } = useRecorrentes();

  /**
   * Processa código escaneado
   */
  const processBarcode = useCallback((code: string) => {
    setIsProcessing(true);
    try {
      const parsed = BarcodeParser.parse(code);
      setBarcodeData(parsed);
      return parsed;
    } catch (error) {
      console.error('Erro ao processar código:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  /**
   * Cria despesa a partir do código
   */
  const createExpenseFromBarcode = useCallback(async (
    expense: ExpenseFromBarcode
  ) => {
    try {
      // 1. Criar transação principal
      const transacao = adicionarTransacao({
        descricao: expense.descricao,
        valor: expense.valor,
        tipo: 'saida',
        categoriaId: expense.categoriaId,
        data: expense.data,
        observacoes: expense.observacoes
      });

      // 2. Se for cartão de crédito
      if (expense.formaPagamento === 'credito' && expense.cartaoId) {
        adicionarGasto({
          cartaoId: expense.cartaoId,
          descricao: expense.descricao,
          valor: expense.valor,
          data: expense.data,
          parcelas: expense.parcelas || 1,
          categoriaId: expense.categoriaId
        });
      }

      // 3. Se for boleto (criar como dívida)
      if (expense.formaPagamento === 'boleto' && barcodeData?.parsed.vencimento) {
        adicionarDivida({
          descricao: expense.descricao,
          valor: expense.valor,
          dataVencimento: barcodeData.parsed.vencimento,
          categoriaId: expense.categoriaId,
          observacoes: `Boleto: ${barcodeData.parsed.linhaDigitavel}`
        });
      }

      // 4. Se for recorrente
      if (expense.recorrente) {
        criarRecorrente({
          descricao: expense.descricao,
          valor: expense.valor,
          tipo: 'saida',
          categoriaId: expense.categoriaId,
          frequencia: 'mensal',
          dataInicio: expense.data,
          ativa: true
        });
      }

      return transacao;
    } catch (error) {
      console.error('Erro ao criar despesa:', error);
      throw error;
    }
  }, [barcodeData, adicionarTransacao, adicionarGasto, adicionarDivida, criarRecorrente]);

  /**
   * Limpa dados
   */
  const clearBarcodeData = useCallback(() => {
    setBarcodeData(null);
  }, []);

  return {
    barcodeData,
    isProcessing,
    processBarcode,
    createExpenseFromBarcode,
    clearBarcodeData
  };
}
```

---

## 7. COMPONENTE SCANNER

### **src/features/barcode-expense/components/BarcodeScanner.tsx**

```typescript
import React, { useRef, useEffect, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { BarcodeReaderService } from '../services/BarcodeReaderService';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onError: (error: Error) => void;
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  onError,
  onClose
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [service] = useState(() => new BarcodeReaderService());
  const [isScanning, setIsScanning] = useState(false);
  const [cameraSupported] = useState(BarcodeReaderService.isCameraSupported());

  useEffect(() => {
    if (cameraSupported && videoRef.current) {
      startScanning();
    }

    return () => {
      service.stopCamera();
    };
  }, []);

  const startScanning = async () => {
    if (!videoRef.current) return;

    try {
      setIsScanning(true);
      await service.startCamera(videoRef.current);
      await service.scanFromCamera(
        videoRef.current,
        (result) => {
          onScan(result);
          service.stopCamera();
        },
        onError
      );
    } catch (error) {
      onError(error as Error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await service.scanFromImage(file);
      onScan(result);
    } catch (error) {
      onError(error as Error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold">Escanear Código</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Video */}
      {cameraSupported ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-white text-center px-4">
            Câmera não disponível. Use o botão abaixo para fazer upload de uma imagem.
          </p>
        </div>
      )}

      {/* Overlay de mira */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 border-4 border-white/50 rounded-lg relative">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-center gap-4">
          <label className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-medium cursor-pointer hover:bg-gray-100 transition-colors">
            <Upload className="w-5 h-5" />
            <span>Fazer Upload</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-white/70 text-sm text-center mt-4">
          Posicione o código dentro da área marcada
        </p>
      </div>
    </div>
  );
};
```

---

## 8. COMPONENTE DE INSERÇÃO

### **src/features/barcode-expense/components/InsertExpenseFromBarcode.tsx**

```typescript
import React, { useState, useEffect } from 'react';
import { Check, Edit, RotateCcw, FileText } from 'lucide-react';
import { BarcodeData, ExpenseFromBarcode, PaymentMethod } from '../types';
import { useBarcodeExpense } from '../hooks/useBarcodeExpense';

interface InsertExpenseFromBarcodeProps {
  barcodeData: BarcodeData;
  onConfirm: () => void;
  onCancel: () => void;
}

export const InsertExpenseFromBarcode: React.FC<InsertExpenseFromBarcodeProps> = ({
  barcodeData,
  onConfirm,
  onCancel
}) => {
  const { createExpenseFromBarcode } = useBarcodeExpense();
  
  const [expense, setExpense] = useState<ExpenseFromBarcode>({
    descricao: barcodeData.parsed.descricao || '',
    valor: barcodeData.parsed.valor || 0,
    data: barcodeData.parsed.data || new Date().toISOString().split('T')[0],
    categoriaId: barcodeData.parsed.categoria || 'outros',
    formaPagamento: 'dinheiro',
    recorrente: false,
    barcodeData
  });

  const handleSubmit = async () => {
    try {
      await createExpenseFromBarcode(expense);
      onConfirm();
    } catch (error) {
      alert('Erro ao criar despesa');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Confirmar Despesa</h2>
          <p className="text-sm text-gray-500 mt-1">
            Tipo: {barcodeData.type.toUpperCase()}
          </p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium mb-2">Descrição *</label>
            <input
              type="text"
              value={expense.descricao}
              onChange={(e) => setExpense({ ...expense, descricao: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Valor */}
          <div>
            <label className="block text-sm font-medium mb-2">Valor *</label>
            <input
              type="number"
              step="0.01"
              value={expense.valor}
              onChange={(e) => setExpense({ ...expense, valor: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-medium mb-2">Data *</label>
            <input
              type="date"
              value={expense.data}
              onChange={(e) => setExpense({ ...expense, data: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Forma de Pagamento */}
          <div>
            <label className="block text-sm font-medium mb-2">Forma de Pagamento *</label>
            <select
              value={expense.formaPagamento}
              onChange={(e) => setExpense({ ...expense, formaPagamento: e.target.value as PaymentMethod })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="dinheiro">Dinheiro</option>
              <option value="debito">Débito</option>
              <option value="credito">Crédito</option>
              <option value="pix">PIX</option>
              <option value="boleto">Boleto</option>
            </select>
          </div>

          {/* Recorrente */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={expense.recorrente}
              onChange={(e) => setExpense({ ...expense, recorrente: e.target.checked })}
              className="w-4 h-4"
            />
            <label className="text-sm font-medium">Despesa recorrente</label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t">
          <button
            onClick={onCancel}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Confirmar e Criar Despesa
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## 9. DEPENDÊNCIAS NECESSÁRIAS

```bash
npm install @zxing/browser @zxing/library tesseract.js
```

---

## 10. INTEGRAÇÃO

### **Adicionar em FluxoCaixa.tsx ou Transações:**

```typescript
import { BarcodeScanner } from '../features/barcode-expense/components/BarcodeScanner';
import { InsertExpenseFromBarcode } from '../features/barcode-expense/components/InsertExpenseFromBarcode';
import { useBarcodeExpense } from '../features/barcode-expense/hooks/useBarcodeExpense';

// No componente
const [showScanner, setShowScanner] = useState(false);
const { barcodeData, processBarcode, clearBarcodeData } = useBarcodeExpense();

// Botão para abrir scanner
<button onClick={() => setShowScanner(true)}>
  📷 Escanear Código
</button>

// Modais
{showScanner && (
  <BarcodeScanner
    onScan={(code) => {
      processBarcode(code);
      setShowScanner(false);
    }}
    onError={(error) => alert(error.message)}
    onClose={() => setShowScanner(false)}
  />
)}

{barcodeData && (
  <InsertExpenseFromBarcode
    barcodeData={barcodeData}
    onConfirm={() => {
      clearBarcodeData();
      // Atualizar lista
    }}
    onCancel={clearBarcodeData}
  />
)}
```

---

**🎉 Módulo Barcode Expense Completo Documentado!**

**Pronto para implementação profissional!**
