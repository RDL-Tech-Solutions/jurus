/**
 * Gráfico de Linha - Saldo Diário do Mês
 */

import React, { memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { BalancoDiario } from '../types';
import { formatarValorDashboard } from '../utils/calculos';

interface GraficoLinhaProps {
  dados: BalancoDiario[];
  titulo?: string;
}

export const GraficoLinha: React.FC<GraficoLinhaProps> = memo(({ dados, titulo = 'Evolução do Saldo' }) => {
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
  
  // Filtra apenas dias com transações ou a cada 5 dias para não poluir o gráfico
  const dadosFiltrados = dados.filter((item, index) => 
    item.receitas > 0 || item.despesas > 0 || index % 5 === 0
  );
  
  const dadosGrafico = dadosFiltrados.map(item => ({
    dia: `${item.dia}`,
    saldo: item.saldoAcumulado,
    receitas: item.receitas,
    despesas: item.despesas
  }));
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">
            Dia {data.dia}
          </p>
          <div className="space-y-1 text-sm">
            <p className="text-green-600 dark:text-green-400">
              Receitas: {formatarValorDashboard(data.receitas)}
            </p>
            <p className="text-red-600 dark:text-red-400">
              Despesas: {formatarValorDashboard(data.despesas)}
            </p>
            <p className="font-semibold text-blue-600 dark:text-blue-400">
              Saldo: {formatarValorDashboard(data.saldo)}
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
          <AreaChart data={dadosGrafico}>
            <defs>
              <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="dia" 
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
            <Area
              type="monotone"
              dataKey="saldo"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#colorSaldo)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

GraficoLinha.displayName = 'GraficoLinha';
