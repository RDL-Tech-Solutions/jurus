# 📦 INSTALAÇÃO DE DEPENDÊNCIAS

## 🎯 DEPENDÊNCIAS NECESSÁRIAS PARA PRODUÇÃO

Este guia mostra como instalar as bibliotecas necessárias para ativar todas as funcionalidades do projeto.

---

## 📋 LISTA DE DEPENDÊNCIAS

### **1. Scanner de Código de Barras** ⭐ RECOMENDADO
```bash
npm install @zxing/library
```

**Uso:**
- Scanner de câmera
- Leitura de imagem
- Múltiplos formatos de código

**Formatos Suportados:**
- Código de Barras (EAN-13, EAN-8, UPC-A, UPC-E)
- QR Code
- Code 128
- Code 39
- ITF
- Codabar
- E mais...

### **2. OCR para Nota Fiscal** 🔧 OPCIONAL
```bash
npm install tesseract.js
```

**Uso:**
- Extrair texto de imagens
- Ler dados de nota fiscal
- Processar documentos

**Idiomas Suportados:**
- Português
- Inglês
- Espanhol
- E mais...

### **3. Exportação PDF** ✅ JÁ INSTALADO
```bash
npm install jspdf
npm install jspdf-autotable
```

**Uso:**
- Gerar PDFs
- Tabelas formatadas
- Relatórios

### **4. Exportação Excel** ✅ JÁ INSTALADO
```bash
npm install xlsx
```

**Uso:**
- Gerar arquivos Excel
- Múltiplas planilhas
- Formatação

---

## 🚀 INSTALAÇÃO RÁPIDA

### **Instalar Todas (Recomendado):**
```bash
npm install @zxing/library tesseract.js jspdf jspdf-autotable xlsx
```

### **Instalar Apenas Essenciais:**
```bash
npm install @zxing/library jspdf jspdf-autotable xlsx
```

### **Instalar Apenas Scanner:**
```bash
npm install @zxing/library
```

---

## 🔧 CONFIGURAÇÃO

### **1. Integrar @zxing no CameraScanner**

**Arquivo:** `src/features/barcode-expense/components/CameraScanner.tsx`

**Substituir a função `startScanning`:**

```typescript
import { BrowserMultiFormatReader } from '@zxing/library';

const startScanning = async () => {
  try {
    const codeReader = new BrowserMultiFormatReader();
    
    // Escanear continuamente
    const controls = await codeReader.decodeFromVideoDevice(
      undefined, // deviceId (undefined = padrão)
      videoRef.current!,
      (result, error) => {
        if (result) {
          // Código detectado!
          const code = result.getText();
          console.log('Código detectado:', code);
          
          // Parar escaneamento
          controls.stop();
          stopCamera();
          
          // Processar código
          onScan(code);
        }
        
        if (error && error.name !== 'NotFoundException') {
          console.error('Erro ao escanear:', error);
        }
      }
    );
    
    // Guardar referência para parar depois
    scanIntervalRef.current = controls as any;
  } catch (err) {
    console.error('Erro ao iniciar scanner:', err);
    setError('Erro ao iniciar o scanner');
  }
};
```

### **2. Integrar @zxing no ImageUploader**

**Arquivo:** `src/features/barcode-expense/components/ImageUploader.tsx`

**Substituir a função `processImage`:**

```typescript
import { BrowserMultiFormatReader } from '@zxing/library';

const processImage = async (imageData: string) => {
  setIsProcessing(true);
  setError(null);

  try {
    const codeReader = new BrowserMultiFormatReader();
    
    // Criar elemento de imagem
    const img = new Image();
    img.src = imageData;
    
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    
    // Detectar código
    const result = await codeReader.decodeFromImageElement(img);
    const detectedCode = result.getText();
    
    console.log('Código detectado:', detectedCode);
    
    setSuccess(true);
    
    // Aguardar um pouco para mostrar o sucesso
    setTimeout(() => {
      onScan(detectedCode);
      handleClose();
    }, 1000);
  } catch (err) {
    console.error('Erro ao processar imagem:', err);
    setError('Não foi possível detectar o código de barras na imagem');
  } finally {
    setIsProcessing(false);
  }
};
```

### **3. Integrar Tesseract.js (OCR) - OPCIONAL**

**Criar novo arquivo:** `src/features/barcode-expense/utils/ocr.ts`

```typescript
import Tesseract from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
}

export async function extractTextFromImage(
  imageData: string,
  onProgress?: (progress: number) => void
): Promise<OCRResult> {
  const { data } = await Tesseract.recognize(
    imageData,
    'por', // Português
    {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          onProgress?.(m.progress * 100);
        }
      }
    }
  );

  return {
    text: data.text,
    confidence: data.confidence
  };
}

export function parseNotaFiscal(text: string) {
  // Extrair informações da nota fiscal
  const patterns = {
    valor: /R\$\s*(\d+[.,]\d{2})/,
    data: /(\d{2}\/\d{2}\/\d{4})/,
    cnpj: /(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/
  };

  const valor = text.match(patterns.valor)?.[1];
  const data = text.match(patterns.data)?.[1];
  const cnpj = text.match(patterns.cnpj)?.[1];

  return {
    valor: valor ? parseFloat(valor.replace(',', '.')) : null,
    data: data || null,
    cnpj: cnpj || null
  };
}
```

---

## 🧪 TESTAR INSTALAÇÃO

### **1. Testar @zxing:**

```typescript
import { BrowserMultiFormatReader } from '@zxing/library';

// Verificar se importou corretamente
console.log('ZXing instalado:', typeof BrowserMultiFormatReader);
```

### **2. Testar Tesseract.js:**

```typescript
import Tesseract from 'tesseract.js';

// Verificar se importou corretamente
console.log('Tesseract instalado:', typeof Tesseract);
```

---

## 📊 TAMANHO DAS BIBLIOTECAS

### **Bundle Size:**
- `@zxing/library`: ~150KB (gzipped)
- `tesseract.js`: ~2MB (gzipped) + ~10MB (worker)
- `jspdf`: ~150KB (gzipped)
- `xlsx`: ~400KB (gzipped)

### **Otimização:**
- Usar code splitting
- Carregar sob demanda
- Lazy loading de componentes

**Exemplo:**
```typescript
// Carregar apenas quando necessário
const CameraScanner = lazy(() => 
  import('./components/CameraScanner')
);
```

---

## 🔍 TROUBLESHOOTING

### **Erro: Module not found**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### **Erro: Camera permission denied**
```
Solução:
1. Verificar se está em HTTPS
2. Verificar permissões do navegador
3. Testar em outro navegador
```

### **Erro: ZXing não detecta código**
```
Solução:
1. Verificar iluminação
2. Código deve estar nítido
3. Testar com código de teste
4. Verificar formato suportado
```

### **Erro: Tesseract muito lento**
```
Solução:
1. Reduzir tamanho da imagem
2. Usar apenas português
3. Processar em background
4. Mostrar loading
```

---

## 📝 PACKAGE.JSON COMPLETO

```json
{
  "name": "jurus",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "@zxing/library": "^0.20.0",
    "tesseract.js": "^5.0.0",
    "jspdf": "^2.5.1",
    "jspdf-autotable": "^3.8.0",
    "xlsx": "^0.18.5",
    "recharts": "^2.10.0",
    "lucide-react": "^0.300.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "vite": "^5.0.0"
  }
}
```

---

## 🎯 CHECKLIST DE INSTALAÇÃO

### **Antes de Instalar:**
- [ ] Node.js instalado (v16+)
- [ ] npm ou yarn instalado
- [ ] Projeto React configurado
- [ ] TypeScript configurado

### **Instalação:**
- [ ] Instalar @zxing/library
- [ ] Instalar tesseract.js (opcional)
- [ ] Instalar jspdf e xlsx
- [ ] Verificar package.json

### **Configuração:**
- [ ] Integrar @zxing no CameraScanner
- [ ] Integrar @zxing no ImageUploader
- [ ] Configurar OCR (opcional)
- [ ] Testar funcionalidades

### **Testes:**
- [ ] Testar scanner de câmera
- [ ] Testar upload de imagem
- [ ] Testar exportação PDF
- [ ] Testar exportação Excel

---

## 🚀 COMANDOS ÚTEIS

### **Verificar versões instaladas:**
```bash
npm list @zxing/library
npm list tesseract.js
npm list jspdf
npm list xlsx
```

### **Atualizar dependências:**
```bash
npm update @zxing/library
npm update tesseract.js
```

### **Remover dependência:**
```bash
npm uninstall tesseract.js
```

### **Verificar tamanho do bundle:**
```bash
npm run build
npm run analyze
```

---

## 📚 DOCUMENTAÇÃO OFICIAL

### **@zxing/library:**
- GitHub: https://github.com/zxing-js/library
- Docs: https://zxing-js.github.io/library/

### **Tesseract.js:**
- GitHub: https://github.com/naptha/tesseract.js
- Docs: https://tesseract.projectnaptha.com/

### **jsPDF:**
- GitHub: https://github.com/parallax/jsPDF
- Docs: https://artskydj.github.io/jsPDF/docs/

### **XLSX:**
- GitHub: https://github.com/SheetJS/sheetjs
- Docs: https://docs.sheetjs.com/

---

## ✅ PRÓXIMOS PASSOS

Após instalar as dependências:

1. **Integrar @zxing** nos componentes
2. **Testar** com códigos reais
3. **Configurar OCR** (se necessário)
4. **Otimizar** bundle size
5. **Deploy** em produção

---

**📦 INSTALAÇÃO COMPLETA!**

**Execute:**
```bash
npm install @zxing/library tesseract.js
```

**E siga os passos de configuração acima!**

**Documentação completa disponível nos links oficiais.**
