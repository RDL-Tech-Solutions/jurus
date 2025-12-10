# 🧪 GUIA COMPLETO DE TESTES - FLUXO DE CAIXA

## 🎯 OBJETIVO

Validar que a atualização automática sem F5 está funcionando em todos os componentes migrados.

---

## ✅ CHECKLIST DE TESTES

### **TESTE 1: Transações Básicas** 🔴 CRÍTICO

#### **1.1 Adicionar Transação de Entrada**
```
1. Abrir Fluxo de Caixa
2. Clicar em "Nova Transação"
3. Preencher:
   - Descrição: "Salário Teste"
   - Valor: R$ 5.000,00
   - Tipo: Entrada
   - Categoria: Salário
   - Data: Hoje
4. Salvar

✅ ESPERADO:
- Transação aparece IMEDIATAMENTE na lista
- Resumo mensal atualiza (Total Receitas)
- Saldo do mês atualiza
- Card Previsão do Mês recalcula
- Card Economia Mensal atualiza
- SEM necessidade de F5
```

#### **1.2 Adicionar Transação de Saída**
```
1. Clicar em "Nova Transação"
2. Preencher:
   - Descrição: "Compra Teste"
   - Valor: R$ 500,00
   - Tipo: Saída
   - Categoria: Compras
   - Data: Hoje
3. Salvar

✅ ESPERADO:
- Transação aparece IMEDIATAMENTE
- Total Despesas atualiza
- Saldo do mês recalcula
- Todos os cards atualizam
- SEM F5
```

#### **1.3 Editar Transação**
```
1. Clicar em uma transação existente
2. Alterar valor de R$ 500 para R$ 800
3. Salvar

✅ ESPERADO:
- Valor atualiza IMEDIATAMENTE na lista
- Totais recalculam
- Cards atualizam
- SEM F5
```

#### **1.4 Excluir Transação**
```
1. Clicar no ícone de lixeira em uma transação
2. Confirmar exclusão

✅ ESPERADO:
- Transação desaparece IMEDIATAMENTE
- Totais recalculam
- Cards atualizam
- SEM F5
```

---

### **TESTE 2: Recorrentes** 🟡 IMPORTANTE

#### **2.1 Adicionar Recorrente**
```
1. Ir para área de Recorrentes
2. Clicar em "Nova Recorrente"
3. Preencher:
   - Descrição: "Aluguel Teste"
   - Valor: R$ 1.500,00
   - Tipo: Saída
   - Frequência: Mensal
   - Dia do mês: 5
4. Salvar

✅ ESPERADO:
- Recorrente aparece no Card Recorrentes
- Lista de recorrentes atualiza
- SEM F5
```

#### **2.2 Efetivar Recorrente**
```
1. Clicar em "Efetivar" em uma recorrente vencida
2. Confirmar

✅ ESPERADO:
- Transação criada IMEDIATAMENTE
- Próxima data atualiza
- Lista de transações atualiza
- Totais recalculam
- SEM F5
```

#### **2.3 Desativar/Ativar Recorrente**
```
1. Clicar no toggle de ativar/desativar
2. Observar mudança

✅ ESPERADO:
- Status muda IMEDIATAMENTE
- Visual atualiza (cor/opacidade)
- SEM F5
```

---

### **TESTE 3: Dívidas** 🟡 IMPORTANTE

#### **3.1 Adicionar Dívida**
```
1. Ir para área de Dívidas
2. Clicar em "Nova Dívida"
3. Preencher:
   - Descrição: "Empréstimo Teste"
   - Valor: R$ 2.000,00
   - Credor: "Banco XYZ"
   - Vencimento: Próxima semana
4. Salvar

✅ ESPERADO:
- Dívida aparece no Card Dívidas Pendentes
- Total Pendente atualiza
- Lista atualiza
- SEM F5
```

#### **3.2 Marcar Dívida como Paga**
```
1. Clicar em "Marcar como Paga" em uma dívida
2. Confirmar

✅ ESPERADO:
- Dívida sai das pendentes IMEDIATAMENTE
- Total Pendente recalcula
- Total Pago atualiza
- SEM F5
```

---

### **TESTE 4: Cartões de Crédito** 🟡 IMPORTANTE

#### **4.1 Adicionar Cartão**
```
1. Ir para área de Cartões
2. Clicar em "Novo Cartão"
3. Preencher:
   - Nome: "Cartão Teste"
   - Bandeira: Visa
   - Limite: R$ 5.000,00
   - Dia Fechamento: 10
   - Dia Vencimento: 15
4. Salvar

✅ ESPERADO:
- Cartão aparece na lista IMEDIATAMENTE
- Card Cartões atualiza
- Limite total recalcula
- SEM F5
```

#### **4.2 Adicionar Gasto no Cartão**
```
1. Clicar em um cartão
2. Clicar em "Novo Gasto"
3. Preencher:
   - Descrição: "Compra Teste"
   - Valor: R$ 300,00
   - Parcelas: 3x
   - Categoria: Compras
4. Salvar

✅ ESPERADO:
- Gasto aparece IMEDIATAMENTE
- Limite disponível recalcula
- Percentual usado atualiza
- Fatura atualiza
- SEM F5
```

---

### **TESTE 5: Dashboard e Cards** 🟢 SECUNDÁRIO

#### **5.1 Sincronização de Cards**
```
1. Adicionar uma transação
2. Observar TODOS os cards

✅ ESPERADO:
- Card Previsão do Mês recalcula
- Card Economia Mensal atualiza
- Card Dívidas (se relevante)
- Card Cartões (se relevante)
- Card Recorrentes (se relevante)
- TODOS atualizam IMEDIATAMENTE
- SEM F5
```

#### **5.2 Navegação de Meses**
```
1. Mudar para mês anterior
2. Observar dados
3. Voltar para mês atual

✅ ESPERADO:
- Dados filtram corretamente
- Transações do mês correto aparecem
- Totais corretos para cada mês
- Navegação fluida
```

---

### **TESTE 6: Filtros e Busca** 🟢 SECUNDÁRIO

#### **6.1 Filtrar por Tipo**
```
1. Selecionar filtro "Apenas Entradas"
2. Observar lista

✅ ESPERADO:
- Apenas entradas aparecem
- Totais recalculam para filtro
- Atualização imediata
```

#### **6.2 Buscar Transação**
```
1. Digitar termo de busca
2. Observar resultados

✅ ESPERADO:
- Resultados filtram em tempo real
- Busca funciona em descrição e categoria
- Performance boa
```

---

### **TESTE 7: Exportação** 🟢 SECUNDÁRIO

#### **7.1 Exportar Transações**
```
1. Clicar em "Exportar"
2. Selecionar formato (PDF/Excel/CSV)
3. Confirmar

✅ ESPERADO:
- Exportação funciona
- Dados corretos no arquivo
- Sem erros
```

---

### **TESTE 8: Sincronização entre Abas** 🔴 CRÍTICO

#### **8.1 Duas Abas Abertas**
```
1. Abrir aplicação em 2 abas do navegador
2. Na Aba 1: Adicionar transação
3. Observar Aba 2

✅ ESPERADO:
- Aba 2 atualiza AUTOMATICAMENTE
- Transação aparece em ambas
- Sincronização perfeita
- SEM F5 em nenhuma
```

---

### **TESTE 9: Performance** 🟢 SECUNDÁRIO

#### **9.1 Adicionar Múltiplas Transações**
```
1. Adicionar 10 transações rapidamente
2. Observar comportamento

✅ ESPERADO:
- Todas aparecem imediatamente
- Sem lag ou travamento
- Interface responsiva
- Cálculos corretos
```

---

### **TESTE 10: Casos Extremos** 🟡 IMPORTANTE

#### **10.1 Transação com Valor Zero**
```
1. Tentar adicionar transação com R$ 0,00

✅ ESPERADO:
- Validação impede ou aceita conforme regra
- Sem crash
```

#### **10.2 Data Futura**
```
1. Adicionar transação com data futura
2. Observar comportamento

✅ ESPERADO:
- Aceita data futura
- Aparece na lista
- Cálculos corretos
```

#### **10.3 Valores Muito Altos**
```
1. Adicionar transação com R$ 999.999.999,00

✅ ESPERADO:
- Aceita valor
- Formatação correta
- Sem overflow
```

---

## 📊 TEMPLATE DE RELATÓRIO

```markdown
# RELATÓRIO DE TESTES - [DATA]

## Resumo
- Testes Realizados: X/10
- Testes Passou: X
- Testes Falhou: X
- Taxa de Sucesso: X%

## Resultados Detalhados

### ✅ PASSOU
- [ ] Teste 1.1: Adicionar Entrada
- [ ] Teste 1.2: Adicionar Saída
- [ ] Teste 1.3: Editar Transação
- [ ] Teste 1.4: Excluir Transação
- [ ] Teste 2.1: Adicionar Recorrente
- [ ] Teste 2.2: Efetivar Recorrente
- [ ] Teste 3.1: Adicionar Dívida
- [ ] Teste 3.2: Marcar como Paga
- [ ] Teste 4.1: Adicionar Cartão
- [ ] Teste 4.2: Adicionar Gasto
- [ ] Teste 5.1: Sincronização Cards
- [ ] Teste 8.1: Sincronização Abas

### ❌ FALHOU
(Listar testes que falharam com descrição do problema)

### ⚠️ PROBLEMAS ENCONTRADOS
(Listar bugs, erros, comportamentos inesperados)

### 💡 OBSERVAÇÕES
(Notas adicionais, sugestões, melhorias)

## Conclusão
(Resumo geral dos testes)
```

---

## 🎯 PRIORIDADE DE TESTES

### **Prioridade ALTA (Fazer Primeiro):**
1. ✅ Teste 1: Transações Básicas
2. ✅ Teste 8: Sincronização entre Abas

### **Prioridade MÉDIA:**
3. ✅ Teste 2: Recorrentes
4. ✅ Teste 3: Dívidas
5. ✅ Teste 4: Cartões
6. ✅ Teste 10: Casos Extremos

### **Prioridade BAIXA:**
7. ✅ Teste 5: Dashboard
8. ✅ Teste 6: Filtros
9. ✅ Teste 7: Exportação
10. ✅ Teste 9: Performance

---

## 🐛 COMO REPORTAR BUGS

### **Template de Bug:**
```markdown
## BUG: [Título curto]

**Severidade:** 🔴 Crítico / 🟡 Médio / 🟢 Baixo

**Descrição:**
(O que aconteceu)

**Passos para Reproduzir:**
1. ...
2. ...
3. ...

**Resultado Esperado:**
(O que deveria acontecer)

**Resultado Atual:**
(O que realmente aconteceu)

**Componente Afetado:**
(Nome do componente)

**Console Errors:**
(Se houver erros no console)

**Screenshots:**
(Se aplicável)
```

---

## ✅ CRITÉRIOS DE SUCESSO

### **Para considerar a migração bem-sucedida:**

1. ✅ **Atualização Automática:**
   - 100% das operações atualizam sem F5
   - Sincronização instantânea

2. ✅ **Sincronização:**
   - Todos os componentes sincronizados
   - Dados consistentes em toda a app

3. ✅ **Performance:**
   - Sem lag perceptível
   - Interface responsiva
   - Cálculos rápidos

4. ✅ **Estabilidade:**
   - Sem crashes
   - Sem erros no console
   - Sem bugs críticos

5. ✅ **Funcionalidades:**
   - Todas as features funcionando
   - Nenhuma regressão
   - Comportamento esperado

---

## 🚀 PRÓXIMOS PASSOS APÓS TESTES

### **Se TODOS os testes passarem:**
1. ✅ Remover hooks antigos (V1)
2. ✅ Renomear hooks V2 → V1
3. ✅ Atualizar imports finais
4. ✅ Documentação final
5. ✅ Celebrar! 🎉

### **Se ALGUNS testes falharem:**
1. 🔍 Identificar causa raiz
2. 🔧 Corrigir problemas
3. 🧪 Re-testar
4. 📝 Documentar correções
5. ✅ Validar novamente

### **Se MUITOS testes falharem:**
1. 🚨 Avaliar se migração está correta
2. 🔍 Revisar implementação
3. 📚 Consultar documentação
4. 🔧 Ajustar conforme necessário
5. 🧪 Testar incrementalmente

---

## 📝 NOTAS IMPORTANTES

### **Durante os Testes:**
- ✅ Abrir console do navegador (F12)
- ✅ Observar erros/warnings
- ✅ Testar em modo normal e dark
- ✅ Testar em diferentes tamanhos de tela
- ✅ Limpar cache se necessário

### **Ambiente de Teste:**
- ✅ Usar dados de teste (não produção)
- ✅ Fazer backup antes de testar
- ✅ Testar em navegador atualizado
- ✅ Verificar conexão com internet

---

**🧪 GUIA DE TESTES COMPLETO!**

**📋 Use este guia para validar a migração!**

**✅ Marque cada teste conforme completa!**

**🎯 Objetivo: 100% de sucesso!**
