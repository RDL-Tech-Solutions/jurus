/**
 * Seção de Gráficos do Dashboard
 */

import React, { memo } from 'react';
import { BarChart3 } from 'lucide-react';
import { GraficoPizza, GraficoLinha, GraficoBarras } from '../charts';
import { BalancoDiario, DistribuicaoCategoria, ReceitasVsDespesas } from '../types';

interface DashboardGraficosProps {
  balancoPorDia: BalancoDiario[];
  distribuicaoPorCategoria: DistribuicaoCategoria[];
  receitasVsDespesas: ReceitasVsDespesas[];
}

export const DashboardGraficos: React.FC<DashboardGraficosProps> = memo(({
  balancoPorDia,
  distribuicaoPorCategoria,
  receitasVsDespesas
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <BarChart3 className="w-6 h-6" />
        Análise Gráfica
      </h2>
      
      {/* Grid de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pizza */}
        <GraficoPizza 
          dados={distribuicaoPorCategoria}
          titulo="Gastos por Categoria"
        />
        
        {/* Gráfico de Linha */}
        <GraficoLinha 
          dados={balancoPorDia}
          titulo="Evolução do Saldo Diário"
        />
      </div>
      
      {/* Gráfico de Barras - Full Width */}
      <div className="w-full">
        <GraficoBarras 
          dados={receitasVsDespesas}
          titulo="Receitas vs Despesas (Últimos Meses)"
        />
      </div>
    </div>
  );
});

DashboardGraficos.displayName = 'DashboardGraficos';
