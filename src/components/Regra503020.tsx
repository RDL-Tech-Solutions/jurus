import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Wallet, TrendingUp, Check, Settings, Plus, X, Sparkles } from 'lucide-react';
import { useSimuladorPlanejamento } from '../hooks/useSimulador5030';
import { METODOS_PLANEJAMENTO, MetodoPlanejamento } from '../types/educacaoFinanceira';
import { cn } from '../utils/cn';

const CORES = {
  necessidades: '#ef4444',
  desejos: '#f59e0b',
  poupanca: '#10b981'
};

interface CategoriaPersonalizada {
  id: string;
  nome: string;
  percentual: number;
  cor: string;
}

export function Regra503020() {
  const {
    rendaMensal,
    metodoSelecionado,
    errors,
    setRendaMensal,
    selecionarMetodo,
    applyCustomConfig,
    calculations,
    formattedData
  } = useSimuladorPlanejamento();

  const [modoPersonalizado, setModoPersonalizado] = useState(false);
  const [categorias, setCategorias] = useState<CategoriaPersonalizada[]>([
    { id: '1', nome: 'Essenciais', percentual: 50, cor: '#ef4444' },
    { id: '2', nome: 'Desejos', percentual: 30, cor: '#f59e0b' },
    { id: '3', nome: 'Investimentos', percentual: 20, cor: '#10b981' }
  ]);

  const metodo = METODOS_PLANEJAMENTO[metodoSelecionado];
  const totalPercentual = categorias.reduce((acc, cat) => acc + cat.percentual, 0);
  const rendaNumeric = parseFloat(rendaMensal.replace(',', '.')) || 0;

  const dadosGrafico = modoPersonalizado
    ? categorias.map(cat => ({
      nome: cat.nome,
      valor: (rendaNumeric * cat.percentual) / 100,
      cor: cat.cor,
      perc: cat.percentual
    }))
    : [
      { nome: 'Necessidades', valor: calculations.divisao.necessidades, cor: CORES.necessidades, perc: metodo.necessidades },
      { nome: 'Desejos', valor: calculations.divisao.desejos, cor: CORES.desejos, perc: metodo.desejos },
      { nome: 'Poupança', valor: calculations.divisao.poupanca, cor: CORES.poupanca, perc: metodo.poupanca }
    ];

  const adicionarCategoria = () => {
    const novaCategoria: CategoriaPersonalizada = {
      id: Date.now().toString(),
      nome: 'Nova Categoria',
      percentual: 0,
      cor: '#6366f1'
    };
    setCategorias([...categorias, novaCategoria]);
  };

  const removerCategoria = (id: string) => {
    if (categorias.length > 2) {
      setCategorias(categorias.filter(c => c.id !== id));
    }
  };

  const atualizarCategoria = (id: string, campo: keyof CategoriaPersonalizada, valor: string | number) => {
    setCategorias(categorias.map(c =>
      c.id === id ? { ...c, [campo]: valor } : c
    ));
  };

  const aplicarPersonalizado = () => {
    if (totalPercentual === 100 && categorias.length >= 3) {
      // Mapear para o formato do hook (simplificado)
      const nec = categorias[0]?.percentual || 50;
      const des = categorias[1]?.percentual || 30;
      const pou = categorias[2]?.percentual || 20;
      applyCustomConfig(nec, des, pou);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border text-sm">
          <p className="font-bold">{item.nome}</p>
          <p>R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-gray-500">{item.perc}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Card Principal */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Regra 50/30/20
              </h2>
              <p className="text-xs text-gray-500">Distribua sua renda</p>
            </div>
          </div>

          {/* Toggle Personalizado */}
          <button
            onClick={() => setModoPersonalizado(!modoPersonalizado)}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all',
              modoPersonalizado
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
            )}
          >
            <Sparkles className="w-3 h-3" />
            <span>Personalizar</span>
          </button>
        </div>

        {/* Input Renda */}
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-1">
            Sua renda mensal (R$)
          </label>
          <input
            type="number"
            value={rendaMensal}
            onChange={(e) => setRendaMensal(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-lg font-bold"
            placeholder="5000"
          />
          {errors.rendaMensal && (
            <p className="text-red-500 text-xs mt-1">{errors.rendaMensal}</p>
          )}
        </div>

        {/* Seletor de Método - Se não personalizado */}
        {!modoPersonalizado && (
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-2">Método</label>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {(Object.keys(METODOS_PLANEJAMENTO) as MetodoPlanejamento[])
                .filter(key => key !== 'personalizado')
                .map((key) => {
                  const m = METODOS_PLANEJAMENTO[key];
                  const isSelected = metodoSelecionado === key;
                  return (
                    <button
                      key={key}
                      onClick={() => selecionarMetodo(key)}
                      className={cn(
                        'flex-shrink-0 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all',
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600'
                      )}
                    >
                      {m.necessidades}/{m.desejos}/{m.poupanca}
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {/* Modo Personalizado */}
        {modoPersonalizado && (
          <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-900 dark:text-purple-100 text-sm">Categorias Personalizadas</span>
              </div>
              <button
                onClick={adicionarCategoria}
                className="flex items-center gap-1 px-2 py-1 bg-purple-600 text-white rounded-lg text-xs"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>

            {/* Alerta Total */}
            <div className={cn(
              'flex items-center gap-2 p-2 rounded-lg mb-3 text-xs',
              totalPercentual === 100
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
            )}>
              {totalPercentual === 100 ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Total: 100% ✓</span>
                </>
              ) : (
                <>
                  <span>Total: {totalPercentual}% (deve ser 100%)</span>
                </>
              )}
            </div>

            {/* Lista de Categorias */}
            <div className="space-y-2">
              {categorias.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg">
                  <input
                    type="color"
                    value={cat.cor}
                    onChange={(e) => atualizarCategoria(cat.id, 'cor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={cat.nome}
                    onChange={(e) => atualizarCategoria(cat.id, 'nome', e.target.value)}
                    className="flex-1 px-2 py-1 border rounded text-sm bg-transparent"
                    placeholder="Nome"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={cat.percentual}
                      onChange={(e) => atualizarCategoria(cat.id, 'percentual', Number(e.target.value))}
                      className="w-14 px-2 py-1 border rounded text-sm text-center"
                      min={0}
                      max={100}
                    />
                    <span className="text-xs text-gray-500">%</span>
                  </div>
                  <span className="text-xs text-gray-500 w-20 text-right">
                    R$ {((rendaNumeric * cat.percentual) / 100).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </span>
                  {categorias.length > 2 && (
                    <button
                      onClick={() => removerCategoria(cat.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Aplicar */}
            <button
              onClick={aplicarPersonalizado}
              disabled={totalPercentual !== 100}
              className={cn(
                'w-full mt-3 py-2 rounded-lg font-medium text-sm transition-all',
                totalPercentual === 100
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              Aplicar Configuração
            </button>
          </div>
        )}

        {/* Gráfico */}
        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dadosGrafico}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={3}
                dataKey="valor"
              >
                {dadosGrafico.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Cards de Distribuição */}
        <div className={cn(
          'grid gap-2',
          modoPersonalizado ? 'grid-cols-2' : 'grid-cols-3'
        )}>
          {dadosGrafico.map((item, i) => (
            <div
              key={i}
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: item.cor + '15' }}
            >
              <div
                className="w-3 h-3 rounded-full mx-auto mb-1"
                style={{ backgroundColor: item.cor }}
              />
              <p className="text-[10px] text-gray-500 truncate">{item.nome}</p>
              <p className="text-sm font-bold" style={{ color: item.cor }}>
                R$ {item.valor.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-[10px] text-gray-400">{item.perc}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dicas - Se não personalizado */}
      {!modoPersonalizado && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
          <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">
            💡 {metodo.nome}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            {metodo.descricao}
          </p>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong className="text-red-600">{metodo.necessidades}%</strong> para gastos essenciais
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong className="text-amber-600">{metodo.desejos}%</strong> para desejos
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong className="text-green-600">{metodo.poupanca}%</strong> para poupança
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Projeção Anual */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Projeção Anual
        </h3>
        <div className={cn(
          'grid gap-2 text-center',
          modoPersonalizado ? 'grid-cols-2' : 'grid-cols-3'
        )}>
          {dadosGrafico.map((item, i) => (
            <div key={i} className="bg-white/20 rounded-lg p-2">
              <p className="text-[10px] opacity-80 truncate">{item.nome}</p>
              <p className="text-sm font-bold">
                R$ {(item.valor * 12).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
