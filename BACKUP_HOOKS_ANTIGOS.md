# 📦 BACKUP DOS HOOKS ANTIGOS

## ⚠️ IMPORTANTE

Os hooks antigos (V1) foram **SUBSTITUÍDOS** pelos hooks V2.

**NÃO DELETE MANUALMENTE** - Use os comandos abaixo para fazer backup primeiro.

---

## 🗂️ HOOKS QUE SERÃO SUBSTITUÍDOS

### **Hooks Antigos (V1) - Para Backup:**
1. `useFluxoCaixa.ts` → Substituído por `useFluxoCaixaV2.ts`
2. `useRecorrentes.ts` → Substituído por `useRecorrentesV2.ts`
3. `useDividas.ts` → Substituído por `useDividasV2.ts`
4. `useCartaoCredito.ts` → Substituído por `useCartaoCreditoV2.ts`

### **Hooks que PERMANECEM:**
- ✅ `useMetas.ts` (não foi alterado)
- ✅ `useTransacoesPendentes.ts` (não foi alterado)
- ✅ Todos os outros hooks (não relacionados ao fluxo de caixa)

---

## 📋 COMANDOS PARA BACKUP E RENOMEAÇÃO

### **Opção 1: Backup Manual (Recomendado)**

```bash
# 1. Criar pasta de backup
mkdir src/hooks/backup_v1

# 2. Copiar hooks antigos para backup
copy src\hooks\useFluxoCaixa.ts src\hooks\backup_v1\useFluxoCaixa.ts
copy src\hooks\useRecorrentes.ts src\hooks\backup_v1\useRecorrentes.ts
copy src\hooks\useDividas.ts src\hooks\backup_v1\useDividas.ts
copy src\hooks\useCartaoCredito.ts src\hooks\backup_v1\useCartaoCredito.ts

# 3. Deletar hooks antigos
del src\hooks\useFluxoCaixa.ts
del src\hooks\useRecorrentes.ts
del src\hooks\useDividas.ts
del src\hooks\useCartaoCredito.ts

# 4. Renomear hooks V2 para V1
ren src\hooks\useFluxoCaixaV2.ts useFluxoCaixa.ts
ren src\hooks\useRecorrentesV2.ts useRecorrentes.ts
ren src\hooks\useDividasV2.ts useDividas.ts
ren src\hooks\useCartaoCreditoV2.ts useCartaoCredito.ts
```

### **Opção 2: Usando Git (Se você usa controle de versão)**

```bash
# 1. Fazer commit do estado atual
git add .
git commit -m "Backup antes de remover hooks V1"

# 2. Deletar hooks antigos
git rm src/hooks/useFluxoCaixa.ts
git rm src/hooks/useRecorrentes.ts
git rm src/hooks/useDividas.ts
git rm src/hooks/useCartaoCredito.ts

# 3. Renomear hooks V2 para V1
git mv src/hooks/useFluxoCaixaV2.ts src/hooks/useFluxoCaixa.ts
git mv src/hooks/useRecorrentesV2.ts src/hooks/useRecorrentes.ts
git mv src/hooks/useDividasV2.ts src/hooks/useDividas.ts
git mv src/hooks/useCartaoCreditoV2.ts src/hooks/useCartaoCredito.ts

# 4. Commit das mudanças
git add .
git commit -m "Renomear hooks V2 para V1 - Migração completa"
```

---

## 🔄 ATUALIZAR IMPORTS APÓS RENOMEAÇÃO

Após renomear os hooks V2 para V1, você precisa atualizar os imports em todos os componentes:

### **Buscar e Substituir (Ctrl+Shift+H no VS Code):**

```
Buscar: useFluxoCaixaV2
Substituir por: useFluxoCaixa

Buscar: useRecorrentesV2
Substituir por: useRecorrentes

Buscar: useDividasV2
Substituir por: useDividas

Buscar: useCartaoCreditoV2
Substituir por: useCartaoCredito
```

### **Arquivos que precisam ser atualizados:**
1. FluxoCaixa.tsx
2. useTransacoes.ts
3. CardPrevisaoMes.tsx
4. CardEconomiaMensal.tsx
5. CardDividasPendentes.tsx
6. CardCartoesCredito.tsx
7. CardRecorrentes.tsx
8. CardMetasMes.tsx
9. useCards.ts
10. CardsManager.tsx (indireto)
11. AreaTransacoes.tsx (indireto)

---

## ⚠️ IMPORTANTE: TESTE ANTES DE DELETAR

### **Antes de deletar os hooks antigos:**

1. ✅ Certifique-se que o projeto compila sem erros
2. ✅ Execute `npm run dev` e teste todas as funcionalidades
3. ✅ Verifique que a atualização automática funciona
4. ✅ Faça backup ou commit no Git

### **Só delete os hooks antigos se:**

- ✅ Todos os testes passaram
- ✅ Não há erros de compilação
- ✅ Atualização automática funciona perfeitamente
- ✅ Você tem backup ou controle de versão

---

## 📝 CHECKLIST DE REMOÇÃO

### **Antes de Remover:**
- [ ] Projeto compila sem erros
- [ ] Todos os testes passaram
- [ ] Atualização automática funciona
- [ ] Backup criado ou commit feito

### **Processo de Remoção:**
- [ ] Criar pasta de backup
- [ ] Copiar hooks antigos para backup
- [ ] Deletar hooks antigos
- [ ] Renomear hooks V2 para V1
- [ ] Atualizar imports nos componentes
- [ ] Testar novamente

### **Após Remoção:**
- [ ] Projeto compila sem erros
- [ ] Todas as funcionalidades funcionam
- [ ] Atualização automática funciona
- [ ] Commit das mudanças

---

## 🚨 SE ALGO DER ERRADO

### **Restaurar do Backup:**

```bash
# Se você fez backup manual:
copy src\hooks\backup_v1\useFluxoCaixa.ts src\hooks\useFluxoCaixa.ts
copy src\hooks\backup_v1\useRecorrentes.ts src\hooks\useRecorrentes.ts
copy src\hooks\backup_v1\useDividas.ts src\hooks\useDividas.ts
copy src\hooks\backup_v1\useCartaoCredito.ts src\hooks\useCartaoCredito.ts
```

### **Se você usa Git:**

```bash
# Reverter para o commit anterior
git reset --hard HEAD~1

# Ou restaurar arquivos específicos
git checkout HEAD -- src/hooks/useFluxoCaixa.ts
git checkout HEAD -- src/hooks/useRecorrentes.ts
git checkout HEAD -- src/hooks/useDividas.ts
git checkout HEAD -- src/hooks/useCartaoCredito.ts
```

---

## 📊 RESUMO

### **Hooks a Remover (4):**
1. ❌ useFluxoCaixa.ts (V1)
2. ❌ useRecorrentes.ts (V1)
3. ❌ useDividas.ts (V1)
4. ❌ useCartaoCredito.ts (V1)

### **Hooks a Renomear (4):**
1. ✅ useFluxoCaixaV2.ts → useFluxoCaixa.ts
2. ✅ useRecorrentesV2.ts → useRecorrentes.ts
3. ✅ useDividasV2.ts → useDividas.ts
4. ✅ useCartaoCreditoV2.ts → useCartaoCredito.ts

### **Imports a Atualizar (11 arquivos):**
- Buscar: "V2"
- Substituir por: "" (vazio)
- Em todos os imports de hooks

---

## ✅ RESULTADO FINAL

Após completar este processo:

- ✅ Hooks antigos removidos
- ✅ Hooks V2 renomeados para V1
- ✅ Imports atualizados
- ✅ Código limpo e organizado
- ✅ Sem referências a "V2"
- ✅ Projeto funcionando perfeitamente

---

**⚠️ FAÇA BACKUP ANTES DE DELETAR!**

**✅ TESTE TUDO ANTES DE FINALIZAR!**

**🎯 BOA SORTE COM A LIMPEZA!**
