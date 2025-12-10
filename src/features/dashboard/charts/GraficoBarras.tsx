/**
 * Gráfico de Barras - Receitas vs Despesas
 */

import React, { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ReceitasVsDespesas } from '../types';
import { formatarValorDashboard } from '../utils/calculos';

interface GraficoBarrasProps {
  dados: ReceitasVsDespesas[];
  titulo?: string;
}

export const GraficoBarras: React.FC<GraficoBarrasProps> = memo(({ dados, titulo = 'Receitas vs Despesas' }) => {
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
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-green-600 dark:text-green-400">
              Receitas: {formatarValorDashboard(payload[0].value)}
            </p>
            <p className="text-red-600 dark:text-red-400">
              Despesas: {formatarValorDashboard(payload[1].value)}
            </p>
            <p className="font-semibold text-blue-600 dark:text-blue-400 pt-1 border-t border-gray-200 dark:border-gray-700">
              Saldo: {formatarValorDashboard(payload[0].value - payload[1].value)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{titulo}</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="mes" 
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                return value.toString();
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => {
                if (value === 'receitas') return 'Receitas';
                if (value === 'despesas') return 'Despesas';
                return value;
              }}
            />
            <Bar 
              dataKey="receitas" 
              fill="#10b981" 
              radius={[8, 8, 0, 0]}
              name="receitas"
            />
            <Bar 
              dataKey="despesas" 
              fill="#ef4444" 
              radius={[8, 8, 0, 0]}
              name="despesas"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

GraficoBarras.displayName = 'GraficoBarras';
