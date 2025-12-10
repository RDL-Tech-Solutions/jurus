/**
 * Componente de resumo financeiro do mês
 * Cards com receitas, despesas e saldo
 */

import React, { memo } from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatarValor } from '../utils/transacoes';
import { cn } from '../../../utils/cn';

interface ResumoMensalProps {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export const ResumoMensal: React.FC<ResumoMensalProps> = memo(({
  totalReceitas,
  totalDespesas,
  saldo
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Card Receitas */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-green-700 dark:text-green-300">
            Receitas
          </span>
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <p className="text-xl font-bold text-green-700 dark:text-green-300">
          {formatarValor(totalReceitas)}
        </p>
      </div>
      
      {/* Card Despesas */}
      <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-red-700 dark:text-red-300">
            Despesas
          </span>
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <p className="text-xl font-bold text-red-700 dark:text-red-300">
          {formatarValor(totalDespesas)}
        </p>
      </div>
      
      {/* Card Saldo */}
      <div className={cn(
        "rounded-xl p-4 border",
        saldo >= 0
          ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800"
          : "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800"
      )}>
        <div className="flex items-center justify-between mb-2">
          <span className={cn(
            "text-xs font-medium",
            saldo >= 0
              ? "text-blue-700 dark:text-blue-300"
              : "text-orange-700 dark:text-orange-300"
          )}>
            Saldo do Mês
          </span>
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            saldo >= 0
              ? "bg-blue-500/20"
              : "bg-orange-500/20"
          )}>
            <Wallet className={cn(
              "w-4 h-4",
              saldo >= 0
                ? "text-blue-600 dark:text-blue-400"
                : "text-orange-600 dark:text-orange-400"
            )} />
          </div>
        </div>
        <p className={cn(
          "text-xl font-bold",
          saldo >= 0
            ? "text-blue-700 dark:text-blue-300"
            : "text-orange-700 dark:text-orange-300"
        )}>
          {formatarValor(saldo)}
        </p>
      </div>
    </div>
  );
});

ResumoMensal.displayName = 'ResumoMensal';
