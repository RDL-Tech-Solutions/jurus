/**
 * Resumo Mensal do Dashboard
 * Cards com indicadores principais
 */

import React, { memo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  DollarSign,
  Home,
  ShoppingCart,
  Calendar
} from 'lucide-react';
import { CardIndicador } from './CardIndicador';
import { DespesasPorTipo } from '../types';

interface DashboardResumoMensalProps {
  receitasDoMes: number;
  despesasDoMes: number;
  saldoPrevisto: number;
  saldoReal: number;
  despesasPorTipo: DespesasPorTipo;
  mediaDiariaGastos: number;
}

export const DashboardResumoMensal: React.FC<DashboardResumoMensalProps> = memo(({
  receitasDoMes,
  despesasDoMes,
  saldoPrevisto,
  saldoReal,
  despesasPorTipo,
  mediaDiariaGastos
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <DollarSign className="w-6 h-6" />
        Resumo Mensal
      </h2>
      
      {/* Grid de Cards Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardIndicador
          titulo="Receitas do Mês"
          valor={receitasDoMes}
          icone={TrendingUp}
          tipo="receita"
        />
        
        <CardIndicador
          titulo="Despesas do Mês"
          valor={despesasDoMes}
          icone={TrendingDown}
          tipo="despesa"
        />
        
        <CardIndicador
          titulo="Saldo Previsto"
          valor={saldoPrevisto}
          icone={Wallet}
          tipo="saldo"
          subtitulo="Fim do mês"
        />
        
        <CardIndicador
          titulo="Saldo Real"
          valor={saldoReal}
          icone={DollarSign}
          tipo="saldo"
          subtitulo="Até hoje"
        />
      </div>
      
      {/* Grid de Cards Secundários */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CardIndicador
          titulo="Despesas Fixas"
          valor={despesasPorTipo.fixas}
          icone={Home}
          tipo="info"
          subtitulo={`${despesasPorTipo.percentualFixas.toFixed(0)}% do total`}
        />
        
        <CardIndicador
          titulo="Despesas Variáveis"
          valor={despesasPorTipo.variaveis}
          icone={ShoppingCart}
          tipo="info"
          subtitulo={`${despesasPorTipo.percentualVariaveis.toFixed(0)}% do total`}
        />
        
        <CardIndicador
          titulo="Média Diária"
          valor={mediaDiariaGastos}
          icone={Calendar}
          tipo="info"
          subtitulo="Gastos por dia"
        />
      </div>
    </div>
  );
});

DashboardResumoMensal.displayName = 'DashboardResumoMensal';
