/**
 * Dashboard Financeiro Principal
 * Componente completo e profissional
 */

import React, { memo } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useTransacoes } from '../../transacoes';
import { DashboardResumoMensal } from './DashboardResumoMensal';
import { DashboardGraficos } from './DashboardGraficos';
import { DashboardInsights } from './DashboardInsights';
import { DashboardFluxoDoMes } from './DashboardFluxoDoMes';

export const DashboardFinanceiro: React.FC = memo(() => {
  const {
    receitasDoMes,
    despesasDoMes,
    saldoPrevisto,
    saldoReal,
    mediaDiariaGastos,
    despesasPorTipo,
    balancoPorDia,
    distribuicaoPorCategoria,
    receitasVsDespesas,
    insights,
    transacoesAgrupadas
  } = useDashboard();
  
  const { obterCategoria } = useTransacoes();
  
  return (
    <div className="space-y-8 pb-8">
      {/* Resumo Mensal - Cards de Indicadores */}
      <DashboardResumoMensal
        receitasDoMes={receitasDoMes}
        despesasDoMes={despesasDoMes}
        saldoPrevisto={saldoPrevisto}
        saldoReal={saldoReal}
        despesasPorTipo={despesasPorTipo}
        mediaDiariaGastos={mediaDiariaGastos}
      />
      
      {/* Insights Financeiros */}
      {insights.length > 0 && (
        <DashboardInsights insights={insights} />
      )}
      
      {/* Gráficos */}
      <DashboardGraficos
        balancoPorDia={balancoPorDia}
        distribuicaoPorCategoria={distribuicaoPorCategoria}
        receitasVsDespesas={receitasVsDespesas}
      />
      
      {/* Fluxo do Mês - Timeline */}
      <DashboardFluxoDoMes
        transacoesAgrupadas={transacoesAgrupadas}
        obterCategoria={obterCategoria}
        limite={10}
      />
    </div>
  );
});

DashboardFinanceiro.displayName = 'DashboardFinanceiro';
