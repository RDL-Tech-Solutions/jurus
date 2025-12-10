# 🎯 PLANO DE AÇÃO - MIGRAÇÃO COMPLETA

## ✅ FASE 1: PREPARAÇÃO (CONCLUÍDA)

### **Arquivos criados:**
- [x] `src/contexts/FluxoCaixaContext.tsx`
- [x] `src/hooks/useFluxoCaixaV2.ts`
- [x] `src/hooks/useRecorrentesV2.ts`
- [x] `src/hooks/useDividasV2.ts`
- [x] `src/hooks/useCartaoCreditoV2.ts`
- [x] `src/App.tsx` (Provider adicionado)

### **Documentação criada:**
- [x] `CORRECAO_COMPLETA_FLUXO_CAIXA.md`
- [x] `GUIA_MIGRACAO_RAPIDA.md`
- [x] `RESUMO_CORRECAO_FLUXO_CAIXA.md`
- [x] `PLANO_ACAO_MIGRACAO.md` (este)

**Status:** ✅ COMPLETO

---

## 🔄 FASE 2: MIGRAÇÃO DE COMPONENTES

### **2.1 Componente Principal (15 min)**

#### **Arquivo:** `src/components/FluxoCaixa.tsx`

**Mudanças:**
```tsx
// LINHA ~1-10: Atualizar imports
import { useFluxoCaixa } from '../hooks/useFluxoCaixaV2';
import { useRecorrentes } from '../hooks/useRecorrentesV2';
import { useDividas } from '../hooks/useDividasV2';
import { useCartaoCredito } from '../hooks/useCartaoCreditoV2';
```

**Teste:**
- [ ] Abrir Fluxo de Caixa
- [ ] Adicionar transação
- [ ] Verificar se aparece imediatamente
- [ ] Editar transação
- [ ] Verificar se atualiza imediatamente
- [ ] Excluir transação
- [ ] Verificar se remove imediatamente

---

### **2.2 Área de Transações (10 min)**

#### **Arquivo:** `src/features/transacoes/components/AreaTransacoes.tsx`

**Mudanças:**
```tsx
// Atualizar import
import { useFluxoCaixa } from '../../../hooks/useFluxoCaixaV2';
```

**Teste:**
- [ ] Abrir área de transações
- [ ] Verificar lista de transações
- [ ] Adicionar nova transação
- [ ] Verificar atualização automática

---

### **2.3 Cards de Transações (20 min)**

#### **2.3.1 Card Dívidas Pendentes**
**Arquivo:** `src/features/transacoes/components/CardDividasPendentes.tsx`

```tsx
import { useDividas } from '../../../hooks/useDividasV2';
```

**Teste:**
- [ ] Adicionar dívida
- [ ] Verificar se aparece no card
- [ ] Marcar como paga
- [ ] Verificar atualização

#### **2.3.2 Card Cartões de Crédito**
**Arquivo:** `src/features/transacoes/components/CardCartoesCredito.tsx`

```tsx
import { useCartaoCredito } from '../../../hooks/useCartaoCreditoV2';
```

**Teste:**
- [ ] Adicionar cartão
- [ ] Adicionar gasto
- [ ] Verificar limite atualizado

#### **2.3.3 Card Recorrentes**
**Arquivo:** `src/features/transacoes/components/CardRecorrentes.tsx`

```tsx
import { useRecorrentes } from '../../../hooks/useRecorrentesV2';
```

**Teste:**
- [ ] Adicionar recorrente
- [ ] Efetivar ocorrência
- [ ] Verificar próxima data

#### **2.3.4 Card Previsão do Mês**
**Arquivo:** `src/features/transacoes/components/CardPrevisaoMes.tsx`

```tsx
import { useFluxoCaixa } from '../../../hooks/useFluxoCaixaV2';
import { useRecorrentes } from '../../../hooks/useRecorrentesV2';
import { useDividas } from '../../../hooks/useDividasV2';
import { useCartaoCredito } from '../../../hooks/useCartaoCreditoV2';
```

**Teste:**
- [ ] Verificar cálculo de previsão
- [ ] Adicionar transação
- [ ] Verificar recálculo automático

#### **2.3.5 Card Economia Mensal**
**Arquivo:** `src/features/transacoes/components/CardEconomiaMensal.tsx`

```tsx
import { useFluxoCaixa } from '../../../hooks/useFluxoCaixaV2';
```

**Teste:**
- [ ] Verificar cálculo de economia
- [ ] Adicionar transação
- [ ] Verificar recálculo

---

### **2.4 Gerenciador de Cartões (10 min)**

#### **Arquivo:** `src/features/cards/components/CardsManager.tsx`

```tsx
import { useCartaoCredito } from '../../../hooks/useCartaoCreditoV2';
```

**Teste:**
- [ ] Listar cartões
- [ ] Adicionar cartão
- [ ] Editar cartão
- [ ] Excluir cartão
- [ ] Adicionar gasto
- [ ] Verificar fatura

---

### **2.5 Modais (15 min)**

#### **Modais a atualizar:**
1. `ModalTransacao.tsx`
2. `ModalDivida.tsx`
3. `ModalCartao.tsx`
4. `ModalRecorrente.tsx`
5. `ModalMeta.tsx`

**Para cada modal:**
```tsx
// Atualizar imports conforme necessário
import { useFluxoCaixa } from '../../../hooks/useFluxoCaixaV2';
// ou
import { useDividas } from '../../../hooks/useDividasV2';
// ou
import { useCartaoCredito } from '../../../hooks/useCartaoCreditoV2';
// ou
import { useRecorrentes } from '../../../hooks/useRecorrentesV2';
```

**Teste:**
- [ ] Abrir modal
- [ ] Preencher dados
- [ ] Salvar
- [ ] Verificar atualização imediata

---

## 🧪 FASE 3: TESTES COMPLETOS (30 min)

### **3.1 Testes de Transações**
- [ ] Adicionar transação de entrada
- [ ] Adicionar transação de saída
- [ ] Editar transação
- [ ] Excluir transação
- [ ] Filtrar transações
- [ ] Buscar transações
- [ ] Exportar transações

### **3.2 Testes de Recorrentes**
- [ ] Adicionar recorrente diária
- [ ] Adicionar recorrente semanal
- [ ] Adicionar recorrente mensal
- [ ] Adicionar recorrente anual
- [ ] Efetivar ocorrência
- [ ] Editar recorrente
- [ ] Desativar recorrente
- [ ] Excluir recorrente

### **3.3 Testes de Dívidas**
- [ ] Adicionar dívida simples
- [ ] Adicionar dívida parcelada
- [ ] Marcar como paga
- [ ] Editar dívida
- [ ] Excluir dívida
- [ ] Verificar totais

### **3.4 Testes de Cartões**
- [ ] Adicionar cartão
- [ ] Adicionar gasto à vista
- [ ] Adicionar gasto parcelado
- [ ] Verificar limite disponível
- [ ] Verificar fatura
- [ ] Editar cartão
- [ ] Desativar cartão
- [ ] Excluir cartão

### **3.5 Testes de Sincronização**
- [ ] Abrir em 2 abas
- [ ] Adicionar transação na aba 1
- [ ] Verificar atualização na aba 2
- [ ] Editar na aba 2
- [ ] Verificar atualização na aba 1

### **3.6 Testes de Dashboard**
- [ ] Verificar totais
- [ ] Verificar gráficos
- [ ] Verificar insights
- [ ] Adicionar transação
- [ ] Verificar recálculo automático

---

## 🧹 FASE 4: LIMPEZA (10 min)

### **4.1 Remover hooks antigos**
```bash
rm src/hooks/useFluxoCaixa.ts
rm src/hooks/useRecorrentes.ts
rm src/hooks/useDividas.ts
rm src/hooks/useCartaoCredito.ts
```

### **4.2 Renomear hooks V2**
```bash
mv src/hooks/useFluxoCaixaV2.ts src/hooks/useFluxoCaixa.ts
mv src/hooks/useRecorrentesV2.ts src/hooks/useRecorrentes.ts
mv src/hooks/useDividasV2.ts src/hooks/useDividas.ts
mv src/hooks/useCartaoCreditoV2.ts src/hooks/useCartaoCredito.ts
```

### **4.3 Atualizar imports novamente**

**Em TODOS os arquivos migrados, trocar de volta:**
```tsx
// DE:
import { useFluxoCaixa } from '../../../hooks/useFluxoCaixaV2';

// PARA:
import { useFluxoCaixa } from '../../../hooks/useFluxoCaixa';
```

**Usar Find & Replace global:**
1. Buscar: `useFluxoCaixaV2`
2. Substituir: `useFluxoCaixa`
3. Buscar: `useRecorrentesV2`
4. Substituir: `useRecorrentes`
5. Buscar: `useDividasV2`
6. Substituir: `useDividas`
7. Buscar: `useCartaoCreditoV2`
8. Substituir: `useCartaoCredito`

---

## ✅ FASE 5: VALIDAÇÃO FINAL (15 min)

### **5.1 Checklist Final**
- [ ] Todos os imports atualizados
- [ ] Hooks antigos removidos
- [ ] Hooks V2 renomeados
- [ ] Todos os testes passando
- [ ] Sem erros no console
- [ ] Sem warnings de TypeScript
- [ ] Atualização automática funcionando
- [ ] Sincronização entre abas funcionando

### **5.2 Teste Completo de Fluxo**
```
1. Abrir aplicação
2. Adicionar 5 transações diferentes
3. Editar 2 transações
4. Excluir 1 transação
5. Adicionar 1 recorrente
6. Adicionar 1 dívida
7. Adicionar 1 cartão
8. Adicionar 1 gasto no cartão
9. Verificar Dashboard
10. Verificar todos os cards
11. Exportar relatório
12. ✅ TUDO deve funcionar sem F5
```

---

## 📊 CRONOGRAMA

### **Tempo Total Estimado: 2 horas**

| Fase | Tempo | Descrição |
|------|-------|-----------|
| Fase 1 | ✅ Concluída | Preparação e criação de arquivos |
| Fase 2.1 | 15 min | FluxoCaixa.tsx |
| Fase 2.2 | 10 min | AreaTransacoes.tsx |
| Fase 2.3 | 20 min | Cards (5 arquivos) |
| Fase 2.4 | 10 min | CardsManager.tsx |
| Fase 2.5 | 15 min | Modais (5 arquivos) |
| Fase 3 | 30 min | Testes completos |
| Fase 4 | 10 min | Limpeza |
| Fase 5 | 15 min | Validação final |
| **TOTAL** | **~2h** | **Migração completa** |

---

## 🎯 PRIORIDADES

### **Alta Prioridade (Fazer primeiro):**
1. FluxoCaixa.tsx
2. AreaTransacoes.tsx
3. CardDividasPendentes.tsx
4. CardCartoesCredito.tsx
5. CardRecorrentes.tsx

### **Média Prioridade (Fazer depois):**
6. CardPrevisaoMes.tsx
7. CardEconomiaMensal.tsx
8. CardsManager.tsx
9. Modais

### **Baixa Prioridade (Fazer por último):**
10. Outros componentes que usam os hooks
11. Limpeza e renomeação

---

## 🚨 PONTOS DE ATENÇÃO

### **Cuidados durante a migração:**
- ⚠️ NÃO misturar hooks V1 e V2 no mesmo componente
- ⚠️ NÃO remover hooks antigos antes de terminar
- ⚠️ SEMPRE testar após cada mudança
- ⚠️ Verificar caminhos relativos dos imports

### **Se algo der errado:**
1. Reverter mudanças do arquivo problemático
2. Verificar console para erros
3. Verificar se Provider está no App.tsx
4. Verificar se imports estão corretos
5. Testar novamente

---

## 📝 CHECKLIST DE PROGRESSO

### **Componentes Migrados:**
- [ ] FluxoCaixa.tsx
- [ ] AreaTransacoes.tsx
- [ ] CardDividasPendentes.tsx
- [ ] CardCartoesCredito.tsx
- [ ] CardRecorrentes.tsx
- [ ] CardPrevisaoMes.tsx
- [ ] CardEconomiaMensal.tsx
- [ ] CardsManager.tsx
- [ ] ModalTransacao.tsx
- [ ] ModalDivida.tsx
- [ ] ModalCartao.tsx
- [ ] ModalRecorrente.tsx
- [ ] ModalMeta.tsx

### **Testes Realizados:**
- [ ] Transações
- [ ] Recorrentes
- [ ] Dívidas
- [ ] Cartões
- [ ] Sincronização
- [ ] Dashboard

### **Limpeza:**
- [ ] Hooks antigos removidos
- [ ] Hooks V2 renomeados
- [ ] Imports atualizados

---

## 🎉 CONCLUSÃO

**Objetivo:** Atualização automática sem F5

**Método:** Context Global com Reducer

**Status Atual:** Preparação completa, pronto para migração

**Próximo Passo:** Começar Fase 2.1 (FluxoCaixa.tsx)

**Tempo Estimado:** 2 horas

**Dificuldade:** Baixa (apenas trocar imports)

**Benefício:** Atualização automática PARA SEMPRE!

---

**🚀 VAMOS COMEÇAR A MIGRAÇÃO!**

**📖 Consulte os guias conforme necessário**

**✅ Marque cada item conforme completa**

**🎯 Foco no objetivo: ZERO necessidade de F5!**
