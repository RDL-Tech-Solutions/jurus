# 🧹 COMO REMOVER HOOKS ANTIGOS

## 🎯 OBJETIVO

Remover os hooks antigos (V1) e renomear os hooks V2 para V1, finalizando a migração.

---

## ⚠️ IMPORTANTE - LEIA ANTES DE EXECUTAR

### **Pré-requisitos:**
- ✅ Todos os testes devem ter passado
- ✅ Atualização automática deve estar funcionando
- ✅ Projeto deve compilar sem erros
- ✅ Faça backup ou commit no Git antes

### **O que será feito:**
1. Backup dos hooks antigos
2. Remoção dos hooks V1
3. Renomeação dos hooks V2 → V1
4. Atualização dos imports

---

## 🚀 MÉTODO 1: SCRIPT AUTOMATIZADO (RECOMENDADO)

### **Passo 1: Executar o Script**

```powershell
# No terminal PowerShell, na raiz do projeto:
.\remover-hooks-antigos.ps1
```

### **O que o script faz:**
1. ✅ Cria backup automático com timestamp
2. ✅ Remove hooks antigos (V1)
3. ✅ Renomeia hooks V2 → V1
4. ✅ Atualiza imports em todos os arquivos
5. ✅ Mostra resumo do que foi feito

### **Após executar:**
```bash
# Testar o projeto
npm run dev

# Se tudo funcionar:
# - Você pode deletar a pasta de backup
# - Fazer commit das mudanças

# Se algo der errado:
# - Restaurar do backup criado
# - Reportar o problema
```

---

## 🔧 MÉTODO 2: MANUAL (SE PREFERIR)

### **Passo 1: Criar Backup**

```powershell
# Criar pasta de backup
mkdir src\hooks\backup_v1

# Copiar hooks antigos
copy src\hooks\useFluxoCaixa.ts src\hooks\backup_v1\
copy src\hooks\useRecorrentes.ts src\hooks\backup_v1\
copy src\hooks\useDividas.ts src\hooks\backup_v1\
copy src\hooks\useCartaoCredito.ts src\hooks\backup_v1\
```

### **Passo 2: Remover Hooks Antigos**

```powershell
del src\hooks\useFluxoCaixa.ts
del src\hooks\useRecorrentes.ts
del src\hooks\useDividas.ts
del src\hooks\useCartaoCredito.ts
```

### **Passo 3: Renomear Hooks V2**

```powershell
ren src\hooks\useFluxoCaixaV2.ts useFluxoCaixa.ts
ren src\hooks\useRecorrentesV2.ts useRecorrentes.ts
ren src\hooks\useDividasV2.ts useDividas.ts
ren src\hooks\useCartaoCreditoV2.ts useCartaoCredito.ts
```

### **Passo 4: Atualizar Imports**

No VS Code, use **Buscar e Substituir** (Ctrl+Shift+H):

```
Buscar: from '../../../hooks/useFluxoCaixaV2'
Substituir: from '../../../hooks/useFluxoCaixa'

Buscar: from '../../../hooks/useRecorrentesV2'
Substituir: from '../../../hooks/useRecorrentes'

Buscar: from '../../../hooks/useDividasV2'
Substituir: from '../../../hooks/useDividas'

Buscar: from '../../../hooks/useCartaoCreditoV2'
Substituir: from '../../../hooks/useCartaoCredito'
```

**Arquivos a atualizar:**
1. src/components/FluxoCaixa.tsx
2. src/features/transacoes/hooks/useTransacoes.ts
3. src/features/transacoes/components/CardPrevisaoMes.tsx
4. src/features/transacoes/components/CardEconomiaMensal.tsx
5. src/features/transacoes/components/CardDividasPendentes.tsx
6. src/features/transacoes/components/CardCartoesCredito.tsx
7. src/features/transacoes/components/CardRecorrentes.tsx
8. src/features/transacoes/components/CardMetasMes.tsx
9. src/features/cards/hooks/useCards.ts

---

## 🧪 TESTES APÓS REMOÇÃO

### **Checklist de Validação:**

```bash
# 1. Compilar projeto
npm run dev

# 2. Verificar se não há erros de compilação
# Abrir console (F12) e verificar erros

# 3. Testar funcionalidades básicas:
✅ Adicionar transação → Atualiza sem F5?
✅ Editar transação → Atualiza sem F5?
✅ Excluir transação → Atualiza sem F5?
✅ Adicionar recorrente → Funciona?
✅ Adicionar dívida → Funciona?
✅ Adicionar cartão → Funciona?
✅ Todos os cards atualizam?
✅ Dashboard sincronizado?

# 4. Se TUDO funcionar:
✅ Migração completa!
✅ Pode deletar backup
✅ Fazer commit
```

---

## 🚨 SE ALGO DER ERRADO

### **Restaurar do Backup:**

```powershell
# Copiar hooks antigos de volta
copy src\hooks\backup_v1\useFluxoCaixa.ts src\hooks\
copy src\hooks\backup_v1\useRecorrentes.ts src\hooks\
copy src\hooks\backup_v1\useDividas.ts src\hooks\
copy src\hooks\backup_v1\useCartaoCredito.ts src\hooks\

# Deletar hooks V2 renomeados
del src\hooks\useFluxoCaixa.ts
del src\hooks\useRecorrentes.ts
del src\hooks\useDividas.ts
del src\hooks\useCartaoCredito.ts

# Restaurar nomes V2
ren src\hooks\useFluxoCaixaV2.ts.bak useFluxoCaixaV2.ts
# (se você fez backup dos V2 também)
```

### **Ou usar Git:**

```bash
# Reverter todas as mudanças
git reset --hard HEAD

# Ou reverter commit específico
git reset --hard HEAD~1
```

---

## 📊 RESUMO

### **Hooks a Remover:**
- ❌ useFluxoCaixa.ts (V1)
- ❌ useRecorrentes.ts (V1)
- ❌ useDividas.ts (V1)
- ❌ useCartaoCredito.ts (V1)

### **Hooks a Renomear:**
- ✅ useFluxoCaixaV2.ts → useFluxoCaixa.ts
- ✅ useRecorrentesV2.ts → useRecorrentes.ts
- ✅ useDividasV2.ts → useDividas.ts
- ✅ useCartaoCreditoV2.ts → useCartaoCredito.ts

### **Arquivos a Atualizar:**
- ✅ 9 arquivos com imports

---

## ✅ RESULTADO FINAL

Após completar:
- ✅ Hooks antigos removidos
- ✅ Hooks V2 agora são V1
- ✅ Imports atualizados
- ✅ Código limpo
- ✅ Sem referências a "V2"
- ✅ Migração 100% completa!

---

## 🎯 ESCOLHA SEU MÉTODO

### **Método 1: Script Automatizado** ⭐ RECOMENDADO
```powershell
.\remover-hooks-antigos.ps1
```
**Vantagens:**
- ✅ Automático
- ✅ Cria backup com timestamp
- ✅ Atualiza tudo de uma vez
- ✅ Menos chance de erro

### **Método 2: Manual**
```powershell
# Seguir passos do Método 2 acima
```
**Vantagens:**
- ✅ Mais controle
- ✅ Entende cada passo
- ✅ Pode fazer aos poucos

---

## 📝 CHECKLIST FINAL

### **Antes de Executar:**
- [ ] Projeto compila sem erros
- [ ] Todos os testes passaram
- [ ] Atualização automática funciona
- [ ] Fez backup ou commit

### **Durante a Execução:**
- [ ] Backup criado
- [ ] Hooks antigos removidos
- [ ] Hooks V2 renomeados
- [ ] Imports atualizados

### **Após Execução:**
- [ ] Projeto compila sem erros
- [ ] Testes passam novamente
- [ ] Atualização automática funciona
- [ ] Commit das mudanças

---

**🎯 ESCOLHA SEU MÉTODO E EXECUTE!**

**✅ SCRIPT AUTOMATIZADO É MAIS SEGURO!**

**🧪 TESTE TUDO DEPOIS!**

**🎉 BOA SORTE!**
