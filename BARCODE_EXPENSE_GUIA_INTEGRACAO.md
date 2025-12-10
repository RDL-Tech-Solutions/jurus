# 📘 BARCODE EXPENSE - GUIA DE INTEGRAÇÃO

## 🎯 COMO USAR O MÓDULO

---

## 1. IMPORTAR COMPONENTES

### **Em qualquer componente:**

```typescript
import { CardInserirPorCodigo, InsertExpenseFromBarcode } from '../features/barcode-expense/components';
import { useBarcodeExpense } from '../features/barcode-expense/hooks/useBarcodeExpense';
```

---

## 2. USAR O HOOK

### **Setup básico:**

```typescript
function MeuComponente() {
  const { 
    barcodeData, 
    processBarcode, 
    createExpenseFromBarcode,
    clearBarcodeData 
  } = useBarcodeExpense();

  const [showModal, setShowModal] = useState(false);

  // Processar código manualmente
  const handleCode = (code: string) => {
    const result = processBarcode(code);
    setShowModal(true);
  };

  return (
    <>
      {/* Card de ação */}
      <CardInserirPorCodigo
        onScanClick={() => {
          // Abrir scanner (quando implementado)
          console.log('Scanner');
        }}
        onUploadClick={() => {
          // Upload de imagem
          console.log('Upload');
        }}
        onManualClick={() => {
          // Input manual
          const code = prompt('Digite o código:');
          if (code) handleCode(code);
        }}
      />

      {/* Modal de confirmação */}
      {barcodeData && showModal && (
        <InsertExpenseFromBarcode
          barcodeData={barcodeData}
          onConfirm={() => {
            setShowModal(false);
            clearBarcodeData();
          }}
          onCancel={() => {
            setShowModal(false);
            clearBarcodeData();
          }}
        />
      )}
    </>
  );
}
```

---

## 3. TESTAR CÓDIGOS

### **Códigos de teste disponíveis:**

```typescript
import { TEST_CODES } from '../features/barcode-expense/utils/testCodes';

// Testar boleto
processBarcode(TEST_CODES.boleto);

// Testar PIX
processBarcode(TEST_CODES.pix);

// Testar EAN-13
processBarcode(TEST_CODES.ean13);

// Testar NFC-e
processBarcode(TEST_CODES.nfce);
```

---

## 4. EXEMPLO COMPLETO DE INTEGRAÇÃO

### **FluxoCaixa.tsx ou AreaTransacoes.tsx:**

```typescript
import React, { useState } from 'react';
import { CardInserirPorCodigo, InsertExpenseFromBarcode } from '../features/barcode-expense/components';
import { useBarcodeExpense } from '../features/barcode-expense/hooks/useBarcodeExpense';
import { TEST_CODES } from '../features/barcode-expense/utils/testCodes';

export function AreaTransacoes() {
  const { barcodeData, processBarcode, clearBarcodeData } = useBarcodeExpense();
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);

  const handleManualInput = () => {
    const options = `
Escolha um código de teste:
1 - Boleto
2 - PIX
3 - Produto (EAN-13)
4 - Nota Fiscal (NFC-e)
    `;
    
    const choice = prompt(options);
    let code = '';

    switch (choice) {
      case '1':
        code = TEST_CODES.boleto;
        break;
      case '2':
        code = TEST_CODES.pix;
        break;
      case '3':
        code = TEST_CODES.ean13;
        break;
      case '4':
        code = TEST_CODES.nfce;
        break;
      default:
        code = prompt('Digite o código:') || '';
    }

    if (code) {
      processBarcode(code);
      setShowBarcodeModal(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Outros componentes... */}

      {/* Card Inserir por Código */}
      <CardInserirPorCodigo
        onScanClick={() => alert('Scanner em desenvolvimento')}
        onUploadClick={() => alert('Upload em desenvolvimento')}
        onManualClick={handleManualInput}
      />

      {/* Modal de Confirmação */}
      {barcodeData && showBarcodeModal && (
        <InsertExpenseFromBarcode
          barcodeData={barcodeData}
          onConfirm={() => {
            setShowBarcodeModal(false);
            clearBarcodeData();
            // Atualizar lista de transações
          }}
          onCancel={() => {
            setShowBarcodeModal(false);
            clearBarcodeData();
          }}
        />
      )}
    </div>
  );
}
```

---

## 5. VALIDAÇÃO DE CÓDIGOS

### **Verificar tipo detectado:**

```typescript
const { barcodeData } = useBarcodeExpense();

if (barcodeData) {
  console.log('Tipo:', barcodeData.type);
  console.log('Dados:', barcodeData.parsed);

  switch (barcodeData.type) {
    case 'boleto':
      console.log('Valor:', barcodeData.parsed.valor);
      console.log('Vencimento:', barcodeData.parsed.vencimento);
      console.log('Banco:', barcodeData.parsed.banco);
      break;
    
    case 'pix':
      console.log('Recebedor:', barcodeData.parsed.pixRecebedor);
      console.log('Valor:', barcodeData.parsed.valor);
      break;
    
    case 'ean13':
      console.log('Produto:', barcodeData.parsed.nomeProduto);
      console.log('EAN:', barcodeData.parsed.ean);
      break;
    
    case 'nfce':
      console.log('Chave:', barcodeData.parsed.chaveNFe);
      break;
  }
}
```

---

## 6. PERSONALIZAR DESPESA

### **Antes de salvar:**

```typescript
<InsertExpenseFromBarcode
  barcodeData={barcodeData}
  onConfirm={() => {
    // A despesa já foi criada pelo componente
    // Aqui você pode adicionar lógica extra
    console.log('Despesa criada com sucesso!');
  }}
  onCancel={() => {
    console.log('Cancelado');
  }}
/>
```

---

## 7. FLUXO COMPLETO

### **Passo a passo:**

1. **Usuário clica em "Digitar Manualmente"**
   ```typescript
   onManualClick={handleManualInput}
   ```

2. **Sistema processa código**
   ```typescript
   processBarcode(code);
   ```

3. **Parser identifica tipo**
   ```typescript
   BarcodeParser.parse(code)
   // Retorna: { type: 'boleto', parsed: {...} }
   ```

4. **Modal abre com dados**
   ```typescript
   <InsertExpenseFromBarcode barcodeData={barcodeData} />
   ```

5. **Usuário confirma ou edita**
   - Descrição: "Boleto Banco do Brasil"
   - Valor: R$ 123,45
   - Data: 2025-01-15
   - Forma: Boleto

6. **Despesa é criada**
   ```typescript
   createExpenseFromBarcode(expense)
   ```

7. **Sistema atualiza**
   - Transações
   - Dashboard
   - Saldos

---

## 8. TESTES MANUAIS

### **Teste 1: Boleto**
```
Código: 23793381286000001234567890123456789012345678
Esperado: 
- Tipo: boleto
- Valor extraído
- Vencimento calculado
- Banco identificado
```

### **Teste 2: PIX**
```
Código: 00020126580014br.gov.bcb.pix...
Esperado:
- Tipo: pix
- Recebedor extraído
- Descrição gerada
```

### **Teste 3: Produto**
```
Código: 7891234567890
Esperado:
- Tipo: ean13
- EAN armazenado
- Categoria: compras
```

### **Teste 4: NFC-e**
```
Código: 35210112345678901234550010000123451234567890
Esperado:
- Tipo: nfce
- Chave armazenada
- Descrição: Nota Fiscal
```

---

## 9. TROUBLESHOOTING

### **Problema: Código não identificado**
```typescript
if (barcodeData.type === 'unknown') {
  console.log('Código não reconhecido:', barcodeData.raw);
  // Permitir entrada manual
}
```

### **Problema: Valor não extraído**
```typescript
if (!barcodeData.parsed.valor) {
  console.log('Valor não encontrado, solicitar entrada manual');
  // Campo valor fica editável
}
```

### **Problema: Data inválida**
```typescript
if (!barcodeData.parsed.data) {
  // Usa data atual como padrão
  const hoje = new Date().toISOString().split('T')[0];
}
```

---

## 10. PRÓXIMAS MELHORIAS

### **Fase 2 - Scanner:**
- Implementar BarcodeScanner.tsx
- Usar @zxing/browser
- Acesso à câmera
- Scan contínuo

### **Fase 3 - OCR:**
- Implementar OCRService.ts
- Usar tesseract.js
- Parse de NFC-e completo
- Extração de itens

### **Fase 4 - Integrações:**
- Cartões de crédito
- Dívidas
- Recorrentes
- Exportação de comprovantes

---

**🎉 Módulo Pronto para Uso!**

**Teste com códigos de exemplo e valide a integração!**
