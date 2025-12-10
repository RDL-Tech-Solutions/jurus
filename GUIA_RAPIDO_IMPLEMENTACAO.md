# ⚡ GUIA RÁPIDO DE IMPLEMENTAÇÃO

## 🎯 PRÓXIMOS PASSOS - CÓDIGO PRONTO PARA COPIAR

---

## 1️⃣ IMPLEMENTAR RECORRENTES (PRIORIDADE MÁXIMA)

### **Passo 1: Criar Hook useRecorrentes**

**Arquivo:** `src/hooks/useRecorrentes.ts`

```typescript
/**
 * Hook para gerenciar transações recorrentes
 * COPIAR CÓDIGO COMPLETO DE: RECORRENTES_MODULO_COMPLETO.md (linhas 50-200)
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  TransacaoRecorrente, 
  ParcelaRecorrente, 
  EfetivarParcelaData,
  EditarRecorrenteData,
  FrequenciaRecorrente
} from '../types/recorrentes';
import { useFluxoCaixa } from './useFluxoCaixa';
import { useToast } from './useToast';

const STORAGE_KEY = 'jurus_recorrentes';

export function useRecorrentes() {
  const [recorrentes, setRecorrentes] = useState<TransacaoRecorrente[]>([]);
  const [carregado, setCarregado] = useState(false);
  
  const { adicionarTransacao } = useFluxoCaixa();
  const { success, error: showError } = useToast();

  // Carregar do localStorage
  useEffect(() => {
    const dados = localStorage.getItem(STORAGE_KEY);
    if (dados) {
      setRecorrentes(JSON.parse(dados));
    }
    setCarregado(true);
  }, []);

  // Salvar no localStorage
  useEffect(() => {
    if (carregado) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recorrentes));
    }
  }, [recorrentes, carregado]);

  // ... resto do código em RECORRENTES_MODULO_COMPLETO.md

  return {
    recorrentes,
    criarRecorrente,
    efetivarParcela,
    efetivarTodasDoMes,
    editarRecorrente,
    excluirRecorrente,
    toggleAtiva,
    carregado
  };
}
```

**Referência completa:** `RECORRENTES_MODULO_COMPLETO.md` (linhas 50-200)

---

### **Passo 2: Criar Tipos**

**Arquivo:** `src/types/recorrentes.ts`

```typescript
/**
 * COPIAR DE: RECORRENTES_MODULO_COMPLETO.md (linhas 15-45)
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
```

---

### **Passo 3: Criar Componentes**

**Arquivo:** `src/features/recorrentes/components/RecorrentesManager.tsx`

```typescript
/**
 * COPIAR DE: RECORRENTES_MODULO_COMPLETO.md (linhas 210-280)
 */

import React, { useState } from 'react';
import { Repeat, Play, Pause, Edit, Trash2, CheckCircle } from 'lucide-react';
import { useRecorrentes } from '../../../hooks/useRecorrentes';

export const RecorrentesManager: React.FC = () => {
  const {
    recorrentes,
    efetivarParcela,
    efetivarTodasDoMes,
    toggleAtiva,
    excluirRecorrente
  } = useRecorrentes();

  const [filtro, setFiltro] = useState<'todas' | 'ativas' | 'pausadas'>('ativas');

  // ... resto do código
};
```

---

## 2️⃣ INTEGRAR EXPORTAÇÃO EM DÍVIDAS

### **Código Completo para Copiar:**

```typescript
// 1. IMPORTS (adicionar no topo do arquivo)
import { ExportButton, ExportModal } from '../../export/components';
import { useExport } from '../../export/hooks/useExport';

// 2. HOOK (adicionar no componente)
const { exportData, isExporting } = useExport();
const [showExportModal, setShowExportModal] = useState(false);

// 3. HANDLER (adicionar com outros handlers)
const handleExport = useCallback(async (config: any) => {
  await exportData('dividas', dividasData, config.format, config);
}, [exportData, dividasData]);

// 4. BOTÃO NO HEADER (adicionar ao lado de outros botões)
<ExportButton
  onClick={() => setShowExportModal(true)}
  label="Exportar"
  variant="outline"
  size="md"
  loading={isExporting}
/>

// 5. MODAL (adicionar antes do fechamento do return)
<ExportModal
  isOpen={showExportModal}
  onClose={() => setShowExportModal(false)}
  onExport={handleExport}
  reportType="dividas"
  title="Exportar Dívidas"
/>
```

**Tempo estimado:** 15-30 minutos

---

## 3️⃣ INTEGRAR EXPORTAÇÃO EM CARTÕES

### **Código Completo para Copiar:**

```typescript
// EXATAMENTE IGUAL AO DE DÍVIDAS, mudando apenas:

// Handler
const handleExport = useCallback(async (config: any) => {
  await exportData('cartoes', cartoesData, config.format, config);
}, [exportData, cartoesData]);

// Modal
<ExportModal
  isOpen={showExportModal}
  onClose={() => setShowExportModal(false)}
  onExport={handleExport}
  reportType="cartoes"
  title="Exportar Faturas de Cartões"
/>
```

**Tempo estimado:** 15-30 minutos

---

## 4️⃣ INTEGRAR EXPORTAÇÃO NO DASHBOARD

### **Código para FluxoCaixa.tsx:**

```typescript
// 1. IMPORTS
import { ExportButton, ExportModal } from '../features/export/components';
import { useExport } from '../features/export/hooks/useExport';

// 2. HOOK
const { exportData, isExporting } = useExport();
const [showExportModal, setShowExportModal] = useState(false);

// 3. HANDLER (consolidar todos os dados)
const handleExportDashboard = useCallback(async (config: any) => {
  const dashboardData = {
    periodo: {
      mes: nomeMesAtual,
      ano: anoSelecionado
    },
    resumo: {
      receitas: somaReceitas,
      despesas: somaDespesas,
      saldo: saldoDoMes
    },
    transacoes: transacoesData,
    dividas: dividasData,
    cartoes: cartoesData,
    config: dashboardConfig
  };
  
  await exportData('dashboard', dashboardData, config.format, config);
}, [exportData, nomeMesAtual, anoSelecionado, somaReceitas, somaDespesas, saldoDoMes]);

// 4. BOTÃO (adicionar no header principal)
<ExportButton
  onClick={() => setShowExportModal(true)}
  label="Exportar Dashboard"
  variant="primary"
  size="md"
  loading={isExporting}
/>

// 5. MODAL
<ExportModal
  isOpen={showExportModal}
  onClose={() => setShowExportModal(false)}
  onExport={handleExportDashboard}
  reportType="dashboard"
  title="Exportar Dashboard Completo"
/>
```

**Tempo estimado:** 30-45 minutos

---

## 📋 CHECKLIST DE EXECUÇÃO

### **Hoje (2-3 horas):**
- [ ] Criar `src/types/recorrentes.ts`
- [ ] Criar `src/hooks/useRecorrentes.ts`
- [ ] Testar hook isoladamente
- [ ] Integrar exportação em Dívidas
- [ ] Integrar exportação em Cartões

### **Amanhã (2-3 horas):**
- [ ] Criar componentes de Recorrentes
- [ ] Integrar Recorrentes no sistema
- [ ] Integrar exportação no Dashboard
- [ ] Testes básicos

### **Depois (4-6 horas):**
- [ ] Testes completos
- [ ] Correções de bugs
- [ ] Scanner de câmera (opcional)
- [ ] OCR completo (opcional)

---

## 🚀 ORDEM DE IMPLEMENTAÇÃO RECOMENDADA

### **Fase 1 (Hoje):**
```
1. Exportação Dívidas (30min)
2. Exportação Cartões (30min)
3. Exportação Dashboard (45min)
4. Tipos Recorrentes (15min)
5. Hook Recorrentes (1h)
```

### **Fase 2 (Amanhã):**
```
1. Componentes Recorrentes (2h)
2. Integração Recorrentes (1h)
3. Testes básicos (1h)
```

---

## 💡 DICAS IMPORTANTES

### **Para Recorrentes:**
1. ✅ Copiar código exato do documento
2. ✅ Ajustar apenas imports
3. ✅ Testar geração de parcelas primeiro
4. ✅ Validar cálculo de datas
5. ✅ Depois criar UI

### **Para Exportação:**
1. ✅ Usar código de AreaTransacoes como base
2. ✅ Mudar apenas `reportType` e dados
3. ✅ Testar um formato por vez
4. ✅ Validar arquivo gerado
5. ✅ Documentar problemas

### **Para Testes:**
1. ✅ Testar cada módulo isoladamente
2. ✅ Validar integrações
3. ✅ Verificar persistência
4. ✅ Testar edge cases
5. ✅ Documentar bugs

---

## 📁 ARQUIVOS A CRIAR

```
src/
├── types/
│   └── recorrentes.ts ⏳ CRIAR
├── hooks/
│   └── useRecorrentes.ts ⏳ CRIAR
└── features/
    └── recorrentes/
        └── components/
            ├── RecorrentesManager.tsx ⏳ CRIAR
            ├── RecorrenteCard.tsx ⏳ CRIAR
            └── index.ts ⏳ CRIAR
```

---

## 📁 ARQUIVOS A ATUALIZAR

```
src/
├── features/
│   ├── dividas/
│   │   └── [componente].tsx ⏳ ATUALIZAR
│   └── cartoes/
│       └── [componente].tsx ⏳ ATUALIZAR
└── components/
    └── FluxoCaixa.tsx ⏳ ATUALIZAR
```

---

## 🎯 METAS DE HOJE

### **Objetivo:** Completar Exportação
- [ ] Dívidas integrado
- [ ] Cartões integrado
- [ ] Dashboard integrado
- [ ] Tipos Recorrentes criados
- [ ] Hook Recorrentes criado

**Tempo total:** 3-4 horas
**Resultado:** 80% do projeto completo

---

## 📞 REFERÊNCIAS RÁPIDAS

### **Documentação:**
- Recorrentes: `RECORRENTES_MODULO_COMPLETO.md`
- Exportação: `SISTEMA_EXPORTACAO_COMPLETO.md`
- Barcode: `BARCODE_EXPENSE_GUIA_INTEGRACAO.md`
- Projeto: `PROJETO_JURUS_COMPLETO.md`

### **Exemplos de Código:**
- Exportação: `src/features/transacoes/components/AreaTransacoes.tsx`
- Hook: `src/hooks/useExport.ts`
- Componentes: `src/features/export/components/`

---

**⚡ GUIA RÁPIDO - USE PARA IMPLEMENTAÇÃO IMEDIATA!**

**Copie e cole os códigos fornecidos!**

**Siga a ordem recomendada!**

**Documente problemas encontrados!**
