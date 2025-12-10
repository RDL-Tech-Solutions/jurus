/**
 * Componente de navegação entre meses
 * Design moderno e responsivo
 */

import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface SeletorMesProps {
  nomeMes: string;
  ano: number;
  isMesAtual: boolean;
  onMesAnterior: () => void;
  onProximoMes: () => void;
  onIrParaHoje: () => void;
}

export const SeletorMes: React.FC<SeletorMesProps> = ({
  nomeMes,
  ano,
  isMesAtual,
  onMesAnterior,
  onProximoMes,
  onIrParaHoje
}) => {
  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Botão Mês Anterior */}
      <button
        onClick={onMesAnterior}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Mês anterior"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>
      
      {/* Display do Mês/Ano */}
      <div className="flex-1 text-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {nomeMes} {ano}
        </h3>
        {!isMesAtual && (
          <button
            onClick={onIrParaHoje}
            className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1 mx-auto"
          >
            <Calendar className="w-3 h-3" />
            Voltar para hoje
          </button>
        )}
      </div>
      
      {/* Botão Próximo Mês */}
      <button
        onClick={onProximoMes}
        className={cn(
          "p-2 rounded-lg transition-colors",
          isMesAtual 
            ? "opacity-50 cursor-not-allowed" 
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
        )}
        disabled={isMesAtual}
        aria-label="Próximo mês"
      >
        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>
    </div>
  );
};
