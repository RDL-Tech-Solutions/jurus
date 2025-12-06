import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, PieChartIcon, BarChart3 } from 'lucide-react';
import { useSimulacao } from '../store/useAppStore';
import { formatarMoeda } from '../utils/calculos';
import { cn } from '../utils/cn';

const CORES = ['#3b82f6', '#10b981', '#f59e0b'];

type TipoGrafico = 'pizza' | 'barras';

export function GraficoResumoHome() {
  const { resultado, simulacao } = useSimulacao();
  const [tipoGrafico, setTipoGrafico] = useState<TipoGrafico>('pizza');

  if (!resultado || !simulacao) {
    return (
      <div className="card-mobile text-center py-8">
        <TrendingUp className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
        <h3 className="text-base font-semibold text-gray-600 dark:text-gray-400 mb-1">
          Gráfico de Resumo
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Realize uma simulação para ver o gráfico
        </p>
      </div>
    );
  }

  // Dados para o gráfico
  const dadosGrafico = [
    {
      nome: 'Valor Inicial',
      valor: simulacao.valorInicial,
      percentual: ((simulacao.valorInicial / resultado.valorFinal) * 100).toFixed(1),
      cor: CORES[0]
    },
    {
      nome: 'Aportes',
      valor: resultado.totalInvestido - simulacao.valorInicial,
      percentual: (((resultado.totalInvestido - simulacao.valorInicial) / resultado.valorFinal) * 100).toFixed(1),
      cor: CORES[1]
    },
    {
      nome: 'Juros',
      valor: resultado.totalJuros,
      percentual: ((resultado.totalJuros / resultado.valorFinal) * 100).toFixed(1),
      cor: CORES[2]
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-sm">
          <p className="font-semibold text-gray-900 dark:text-white">{data.nome}</p>
          <p className="text-gray-600 dark:text-gray-400">
            {formatarMoeda(data.valor)} ({data.percentual}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-mobile">
      {/* Header com toggle */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Composição
          </h3>
        </div>

        {/* Toggle tipo de gráfico */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setTipoGrafico('pizza')}
            className={cn(
              'p-1.5 rounded-md transition-all',
              tipoGrafico === 'pizza'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600'
                : 'text-gray-500'
            )}
          >
            <PieChartIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTipoGrafico('barras')}
            className={cn(
              'p-1.5 rounded-md transition-all',
              tipoGrafico === 'barras'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600'
                : 'text-gray-500'
            )}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Valor Total Destacado */}
      <div className="text-center mb-4 p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white">
        <p className="text-xs font-medium opacity-90">Valor Final</p>
        <p className="text-2xl font-bold">{formatarMoeda(resultado.valorFinal)}</p>
        <p className="text-xs opacity-80">
          Rendimento: +{formatarMoeda(resultado.totalJuros)} ({dadosGrafico[2].percentual}%)
        </p>
      </div>

      {/* Gráfico - Altura maior no mobile */}
      <div className="w-full h-[280px] sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          {tipoGrafico === 'pizza' ? (
            <PieChart>
              <Pie
                data={dadosGrafico}
                cx="50%"
                cy="45%"
                innerRadius="35%"
                outerRadius="70%"
                paddingAngle={3}
                dataKey="valor"
                label={({ percentual }) => `${percentual}%`}
                labelLine={false}
              >
                {dadosGrafico.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={50}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
                )}
              />
            </PieChart>
          ) : (
            <BarChart
              data={dadosGrafico}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                type="number"
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                fontSize={12}
              />
              <YAxis
                type="category"
                dataKey="nome"
                width={60}
                fontSize={12}
              />
              <Tooltip
                formatter={(value: number) => formatarMoeda(value)}
                labelStyle={{ color: '#374151' }}
              />
              <Bar dataKey="valor" radius={[0, 4, 4, 0]}>
                {dadosGrafico.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.cor} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Cards de resumo - Layout horizontal em mobile */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {dadosGrafico.map((item, index) => (
          <div
            key={item.nome}
            className="p-2 rounded-lg text-center"
            style={{ backgroundColor: `${item.cor}15` }}
          >
            <div
              className="w-3 h-3 rounded-full mx-auto mb-1"
              style={{ backgroundColor: item.cor }}
            />
            <p className="text-[10px] text-gray-600 dark:text-gray-400 font-medium truncate">
              {item.nome}
            </p>
            <p
              className="text-sm font-bold"
              style={{ color: item.cor }}
            >
              {formatarMoeda(item.valor)}
            </p>
            <p className="text-[10px] text-gray-500">{item.percentual}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
