# 🔄 MÓDULO COMPLETO DE TRANSAÇÕES RECORRENTES

## 📋 ARQUITETURA COMPLETA

---

## 1. TIPOS E INTERFACES

### **src/types/recorrentes.ts**

```typescript
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
  numero: number; // 1, 2, 3...
  dataPrevisao: string; // ISO date
  dataEfetivacao?: string; // ISO date quando efetivada
  valor: number;
  status: StatusParcela;
  transacaoId?: string; // ID da transação gerada
}

export interface TransacaoRecorrente {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'entrada' | 'saida';
  categoriaId: string;
  contaId?: string;
  cartaoId?: string;
  dividaId?: string;
  frequencia: FrequenciaRecorrente;
  dataInicio: string; // ISO date
  dataFim?: string; // ISO date (opcional)
  numeroParcelas?: number; // Alternativa a dataFim
  ativa: boolean;
  observacoes?: string;
  parcelas: ParcelaRecorrente[];
  criadoEm: string;
  atualizadoEm: string;
}

export interface EfetivarParcelaData {
  parcelaId: string;
  recorrenteId: string;
  dataEfetivacao?: string; // Opcional, usa hoje se não fornecido
  valorAjustado?: number; // Opcional, permite ajustar valor
  categoriaIdAjustada?: string; // Opcional, permite mudar categoria
}

export interface EditarRecorrenteData {
  modo: 'individual' | 'todos';
  parcelaId?: string; // Obrigatório se modo = 'individual'
  dados: Partial<TransacaoRecorrente>;
}
```

---

## 2. HOOK CENTRALIZADO

### **src/hooks/useRecorrentes.ts**

```typescript
import { useState, useEffect, useCallback } from 'react';
import { 
  TransacaoRecorrente, 
  ParcelaRecorrente, 
  EfetivarParcelaData,
  EditarRecorrenteData,
  FrequenciaRecorrente
} from '../types/recorrentes';
import { useFluxoCaixa } from './useFluxoCaixa';
import { useCartaoCredito } from './useCartaoCredito';
import { useDividas } from './useDividas';

const STORAGE_KEY = 'jurus_recorrentes';

export function useRecorrentes() {
  const [recorrentes, setRecorrentes] = useState<TransacaoRecorrente[]>([]);
  const [carregado, setCarregado] = useState(false);
  
  const { adicionarTransacao } = useFluxoCaixa();
  const { adicionarGasto } = useCartaoCredito();
  const { adicionarPagamento } = useDividas();

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

  /**
   * Calcula próxima data baseado na frequência
   */
  const calcularProximaData = useCallback((
    dataBase: string, 
    frequencia: FrequenciaRecorrente
  ): string => {
    const data = new Date(dataBase);
    
    switch (frequencia) {
      case 'diario':
        data.setDate(data.getDate() + 1);
        break;
      case 'semanal':
        data.setDate(data.getDate() + 7);
        break;
      case 'quinzenal':
        data.setDate(data.getDate() + 15);
        break;
      case 'mensal':
        data.setMonth(data.getMonth() + 1);
        break;
      case 'bimestral':
        data.setMonth(data.getMonth() + 2);
        break;
      case 'trimestral':
        data.setMonth(data.getMonth() + 3);
        break;
      case 'semestral':
        data.setMonth(data.getMonth() + 6);
        break;
      case 'anual':
        data.setFullYear(data.getFullYear() + 1);
        break;
    }
    
    return data.toISOString().split('T')[0];
  }, []);

  /**
   * Gera parcelas futuras
   */
  const gerarParcelas = useCallback((recorrente: TransacaoRecorrente): ParcelaRecorrente[] => {
    const parcelas: ParcelaRecorrente[] = [];
    let dataAtual = recorrente.dataInicio;
    let numero = 1;

    const limite = recorrente.numeroParcelas || 120; // Máximo 10 anos se não definido
    const dataFimLimite = recorrente.dataFim 
      ? new Date(recorrente.dataFim) 
      : new Date(Date.now() + 365 * 10 * 24 * 60 * 60 * 1000);

    while (numero <= limite) {
      const data = new Date(dataAtual);
      
      if (data > dataFimLimite) break;

      parcelas.push({
        id: `${recorrente.id}-parcela-${numero}`,
        recorrenteId: recorrente.id,
        numero,
        dataPrevisao: dataAtual,
        valor: recorrente.valor,
        status: 'pendente'
      });

      dataAtual = calcularProximaData(dataAtual, recorrente.frequencia);
      numero++;
    }

    return parcelas;
  }, [calcularProximaData]);

  /**
   * Criar nova recorrente
   */
  const criarRecorrente = useCallback((dados: Omit<TransacaoRecorrente, 'id' | 'parcelas' | 'criadoEm' | 'atualizadoEm'>) => {
    const novaRecorrente: TransacaoRecorrente = {
      ...dados,
      id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      parcelas: [],
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };

    novaRecorrente.parcelas = gerarParcelas(novaRecorrente);

    setRecorrentes(prev => [...prev, novaRecorrente]);
    return novaRecorrente;
  }, [gerarParcelas]);

  /**
   * Efetivar parcela individual
   */
  const efetivarParcela = useCallback((dados: EfetivarParcelaData) => {
    const recorrente = recorrentes.find(r => r.id === dados.recorrenteId);
    if (!recorrente) return;

    const parcela = recorrente.parcelas.find(p => p.id === dados.parcelaId);
    if (!parcela || parcela.status === 'efetivada') return;

    const dataEfetivacao = dados.dataEfetivacao || new Date().toISOString().split('T')[0];
    const valor = dados.valorAjustado || parcela.valor;
    const categoriaId = dados.categoriaIdAjustada || recorrente.categoriaId;

    // Criar transação no fluxo de caixa
    const transacao = adicionarTransacao({
      descricao: `${recorrente.descricao} (${parcela.numero}/${recorrente.parcelas.length})`,
      valor,
      tipo: recorrente.tipo,
      categoriaId,
      data: dataEfetivacao,
      observacoes: `Recorrente efetivada - ${recorrente.observacoes || ''}`
    });

    // Se for em cartão, adicionar gasto
    if (recorrente.cartaoId && recorrente.tipo === 'saida') {
      adicionarGasto({
        cartaoId: recorrente.cartaoId,
        descricao: recorrente.descricao,
        valor,
        data: dataEfetivacao,
        parcelas: 1,
        categoriaId
      });
    }

    // Se for dívida, adicionar pagamento
    if (recorrente.dividaId) {
      adicionarPagamento(recorrente.dividaId, valor, dataEfetivacao);
    }

    // Atualizar parcela
    setRecorrentes(prev => prev.map(r => {
      if (r.id === dados.recorrenteId) {
        return {
          ...r,
          parcelas: r.parcelas.map(p => {
            if (p.id === dados.parcelaId) {
              return {
                ...p,
                status: 'efetivada' as const,
                dataEfetivacao,
                transacaoId: transacao.id
              };
            }
            return p;
          }),
          atualizadoEm: new Date().toISOString()
        };
      }
      return r;
    }));
  }, [recorrentes, adicionarTransacao, adicionarGasto, adicionarPagamento]);

  /**
   * Efetivar todas do mês atual
   */
  const efetivarTodasDoMes = useCallback(() => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    recorrentes.forEach(recorrente => {
      if (!recorrente.ativa) return;

      recorrente.parcelas.forEach(parcela => {
        if (parcela.status !== 'pendente') return;

        const dataParcela = new Date(parcela.dataPrevisao);
        if (dataParcela.getMonth() === mesAtual && dataParcela.getFullYear() === anoAtual) {
          efetivarParcela({
            parcelaId: parcela.id,
            recorrenteId: recorrente.id
          });
        }
      });
    });
  }, [recorrentes, efetivarParcela]);

  /**
   * Editar recorrente
   */
  const editarRecorrente = useCallback((dados: EditarRecorrenteData) => {
    if (dados.modo === 'individual' && dados.parcelaId) {
      // Editar apenas uma parcela
      setRecorrentes(prev => prev.map(r => ({
        ...r,
        parcelas: r.parcelas.map(p => {
          if (p.id === dados.parcelaId) {
            return {
              ...p,
              valor: dados.dados.valor || p.valor,
              dataPrevisao: dados.dados.dataInicio || p.dataPrevisao
            };
          }
          return p;
        }),
        atualizadoEm: new Date().toISOString()
      })));
    } else {
      // Editar todas as parcelas futuras
      setRecorrentes(prev => prev.map(r => {
        const recorrenteAtualizado = {
          ...r,
          ...dados.dados,
          atualizadoEm: new Date().toISOString()
        };

        // Regenerar parcelas se mudou frequência ou valor
        if (dados.dados.frequencia || dados.dados.valor || dados.dados.dataInicio) {
          recorrenteAtualizado.parcelas = gerarParcelas(recorrenteAtualizado);
        }

        return recorrenteAtualizado;
      }));
    }
  }, [gerarParcelas]);

  /**
   * Excluir recorrente
   */
  const excluirRecorrente = useCallback((id: string) => {
    setRecorrentes(prev => prev.filter(r => r.id !== id));
  }, []);

  /**
   * Pausar/Ativar recorrente
   */
  const toggleAtiva = useCallback((id: string) => {
    setRecorrentes(prev => prev.map(r => 
      r.id === id 
        ? { ...r, ativa: !r.ativa, atualizadoEm: new Date().toISOString() }
        : r
    ));
  }, []);

  // Estatísticas
  const recorrentesAtivas = recorrentes.filter(r => r.ativa);
  const parcelasPendentes = recorrentes.flatMap(r => 
    r.parcelas.filter(p => p.status === 'pendente')
  );
  const totalMensal = recorrentesAtivas
    .filter(r => r.frequencia === 'mensal')
    .reduce((acc, r) => acc + r.valor, 0);

  return {
    recorrentes,
    recorrentesAtivas,
    parcelasPendentes,
    totalMensal,
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

---

## 3. COMPONENTES DE UI

### **RecorrentesManager.tsx**

```typescript
import React, { useState } from 'react';
import { Repeat, Play, Pause, Edit, Trash2, CheckCircle } from 'lucide-react';
import { useRecorrentes } from '../hooks/useRecorrentes';
import { TransacaoRecorrente, ParcelaRecorrente } from '../types/recorrentes';

export const RecorrentesManager: React.FC = () => {
  const {
    recorrentes,
    efetivarParcela,
    efetivarTodasDoMes,
    toggleAtiva,
    excluirRecorrente
  } = useRecorrentes();

  const [filtro, setFiltro] = useState<'todas' | 'ativas' | 'pausadas'>('ativas');

  const recorrentesFiltradas = recorrentes.filter(r => {
    if (filtro === 'ativas') return r.ativa;
    if (filtro === 'pausadas') return !r.ativa;
    return true;
  });

  const handleEfetivar = (recorrenteId: string, parcelaId: string) => {
    if (confirm('Efetivar esta parcela?')) {
      efetivarParcela({ recorrenteId, parcelaId });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Transações Recorrentes</h2>
        <button
          onClick={() => {
            if (confirm('Efetivar todas as recorrentes deste mês?')) {
              efetivarTodasDoMes();
            }
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Efetivar Todas do Mês
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <button
          onClick={() => setFiltro('todas')}
          className={`px-4 py-2 rounded-lg ${
            filtro === 'todas' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFiltro('ativas')}
          className={`px-4 py-2 rounded-lg ${
            filtro === 'ativas' ? 'bg-green-600 text-white' : 'bg-gray-200'
          }`}
        >
          Ativas
        </button>
        <button
          onClick={() => setFiltro('pausadas')}
          className={`px-4 py-2 rounded-lg ${
            filtro === 'pausadas' ? 'bg-gray-600 text-white' : 'bg-gray-200'
          }`}
        >
          Pausadas
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {recorrentesFiltradas.map(recorrente => (
          <RecorrenteCard
            key={recorrente.id}
            recorrente={recorrente}
            onEfetivar={handleEfetivar}
            onToggle={() => toggleAtiva(recorrente.id)}
            onDelete={() => {
              if (confirm('Excluir esta recorrente?')) {
                excluirRecorrente(recorrente.id);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

interface RecorrenteCardProps {
  recorrente: TransacaoRecorrente;
  onEfetivar: (recorrenteId: string, parcelaId: string) => void;
  onToggle: () => void;
  onDelete: () => void;
}

const RecorrenteCard: React.FC<RecorrenteCardProps> = ({
  recorrente,
  onEfetivar,
  onToggle,
  onDelete
}) => {
  const proximasParcelas = recorrente.parcelas
    .filter(p => p.status === 'pendente')
    .slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Repeat className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-semibold">{recorrente.descricao}</h3>
            <p className="text-sm text-gray-500">
              {recorrente.frequencia} • R$ {recorrente.valor.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onToggle} className="p-2 hover:bg-gray-100 rounded-lg">
            {recorrente.ativa ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button onClick={onDelete} className="p-2 hover:bg-red-100 rounded-lg">
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* Próximas Parcelas */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-500">Próximas Parcelas:</p>
        {proximasParcelas.map(parcela => (
          <div
            key={parcela.id}
            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div>
              <p className="text-sm font-medium">
                Parcela {parcela.numero} - {new Date(parcela.dataPrevisao).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500">R$ {parcela.valor.toFixed(2)}</p>
            </div>
            <button
              onClick={() => onEfetivar(recorrente.id, parcela.id)}
              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
            >
              <CheckCircle className="w-3 h-3" />
              Efetivar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 4. INTEGRAÇÃO COM SISTEMA

### **Atualizar FluxoCaixa.tsx**

```typescript
// Adicionar no FluxoCaixa.tsx
import { useRecorrentes } from '../hooks/useRecorrentes';

// No componente
const { efetivarTodasDoMes, parcelasPendentes } = useRecorrentes();

// Executar ao trocar de mês
useEffect(() => {
  // Verificar se há parcelas do mês para efetivar
  const hoje = new Date();
  const parcelasDoMes = parcelasPendentes.filter(p => {
    const data = new Date(p.dataPrevisao);
    return data.getMonth() === hoje.getMonth() && 
           data.getFullYear() === hoje.getFullYear();
  });

  if (parcelasDoMes.length > 0) {
    // Mostrar notificação ou modal
    console.log(`${parcelasDoMes.length} parcelas recorrentes pendentes este mês`);
  }
}, [parcelasPendentes]);
```

---

## 5. TESTES E VALIDAÇÃO

### **Casos de Teste:**

1. **Criar Recorrente Mensal**
   - Criar recorrente de R$ 100,00 mensal
   - Verificar se gera 12 parcelas
   - Verificar datas corretas

2. **Efetivar Parcela**
   - Efetivar parcela 1
   - Verificar se cria transação
   - Verificar se atualiza status
   - Verificar se atualiza dashboard

3. **Efetivar Todas do Mês**
   - Criar 3 recorrentes diferentes
   - Efetivar todas do mês
   - Verificar se não duplica
   - Verificar totais

4. **Editar Individual**
   - Editar valor de uma parcela
   - Verificar se não afeta outras
   - Efetivar e verificar valor correto

5. **Editar em Massa**
   - Editar valor base
   - Verificar se atualiza todas futuras
   - Verificar se não afeta efetivadas

6. **Último Dia do Mês**
   - Criar recorrente dia 31
   - Verificar fevereiro (28/29)
   - Verificar meses com 30 dias

7. **Cartão de Crédito**
   - Criar recorrente em cartão
   - Efetivar parcela
   - Verificar fatura atualizada

8. **Dívida**
   - Criar recorrente vinculada a dívida
   - Efetivar parcela
   - Verificar saldo da dívida

---

## 6. DOCUMENTAÇÃO DE USO

### **Como Usar:**

1. **Criar Recorrente:**
```typescript
const { criarRecorrente } = useRecorrentes();

criarRecorrente({
  descricao: 'Aluguel',
  valor: 1500,
  tipo: 'saida',
  categoriaId: 'moradia',
  frequencia: 'mensal',
  dataInicio: '2025-01-05',
  numeroParcelas: 12,
  ativa: true
});
```

2. **Efetivar Parcela:**
```typescript
const { efetivarParcela } = useRecorrentes();

efetivarParcela({
  recorrenteId: 'rec-123',
  parcelaId: 'rec-123-parcela-1',
  valorAjustado: 1550 // Opcional
});
```

3. **Editar Recorrente:**
```typescript
const { editarRecorrente } = useRecorrentes();

// Editar apenas uma parcela
editarRecorrente({
  modo: 'individual',
  parcelaId: 'rec-123-parcela-2',
  dados: { valor: 1600 }
});

// Editar todas
editarRecorrente({
  modo: 'todos',
  dados: { valor: 1600, frequencia: 'mensal' }
});
```

---

**🎉 Módulo Completo de Recorrentes Documentado!**

**Próximo passo: Implementar os componentes e integrar!**
