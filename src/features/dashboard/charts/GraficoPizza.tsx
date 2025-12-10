/**
 * Gráfico de Pizza - Distribuição por Categoria
 */

import React, { memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DistribuicaoCategoria } from '../types';
import { formatarValorDashboard } from '../utils/calculos';

interface GraficoPizzaProps {
  dados: DistribuicaoCategoria[];
  titulo?: string;
}

export const GraficoPizza: React.FC<GraficoPizzaProps> = memo(({ dados, titulo = 'Distribuição por Categoria' }) => {
  if (dados.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{titulo}</h3>
        <div className="flex items-center justify-center h-64 text-gray-400">
          <p className="text-sm">Sem dados para exibir</p>
        </div>
      </div>
    );
  }
  
  // Pega apenas top 5 categorias
  const top5 = dados.slice(0, 5);
  
  const dadosGrafico = top5.map(item => ({
    name: item.categoriaNome,
    value: item.valor,
    color: item.categoriaCor,
    icone: item.categoriaIcone,
    percentual: item.percentual
  }));
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">
            {data.icone} {data.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatarValorDashboard(data.value)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {data.percentual.toFixed(1)}% do total
          </p>
        </div>
      );
    }
    return null;
  };
  
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-col gap-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-700 dark:text-gray-300">
                {entry.payload.icone} {entry.value}
              </span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              {entry.payload.percentual.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{titulo}</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dadosGrafico}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={50}
              fill="#8884d8"
              dataKey="value"
              label={(entry: any) => `${entry.percentual.toFixed(0)}%`}
            >
              {dadosGrafico.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

GraficoPizza.displayName = 'GraficoPizza';
