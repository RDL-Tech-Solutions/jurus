import { useState } from 'react';
import { TrendingUp, DollarSign, Percent, ChevronDown, ChevronUp, FileDown } from 'lucide-react';
import { useSimulacao } from '../store/useAppStore';
import { formatarMoeda } from '../utils/calculos';
import { exportarRelatorioCompleto, ExportFormat } from '../utils/exportacao';
import { MenuExportacao } from './MenuExportacao';
import { GraficoEvolucao } from './GraficoEvolucao';
import { TabelaEvolucao } from './TabelaEvolucao';
import { EstatisticasAvancadas } from './EstatisticasAvancadas';
import { CalculadoraIR } from './CalculadoraIR';
import { cn } from '../utils/cn';

export function ResultadoSimulacao() {
  const { resultado, simulacao } = useSimulacao();
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

  const handleExportarRelatorio = (formato: ExportFormat) => {
    if (resultado && simulacao) {
      exportarRelatorioCompleto(simulacao, resultado, formato);
    }
  };

  if (!resultado) {
    return (
      <div className="card-mobile text-center py-8">
        <TrendingUp className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
        <h3 className="text-base font-semibold text-gray-600 dark:text-gray-400 mb-1">
          Resultado da Simulação
        </h3>
        <p className="text-sm text-gray-500">
          Preencha os dados e clique em Calcular
        </p>
      </div>
    );
  }

  const rentabilidade = resultado.totalInvestido > 0
    ? ((resultado.totalJuros / resultado.totalInvestido) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-4">
      {/* Resultado Principal - Compacto */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            <span className="font-medium">Resultado</span>
          </div>
          <MenuExportacao
            onExportar={handleExportarRelatorio}
            label=""
            variant="secondary"
          />
        </div>

        <div className="text-center mb-4">
          <p className="text-white/70 text-sm">Valor Final</p>
          <p className="text-3xl font-bold">{formatarMoeda(resultado.valorFinal)}</p>
        </div>

        {/* Mini cards de resumo */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/20 rounded-lg p-2 text-center">
            <p className="text-[10px] text-white/70">Investido</p>
            <p className="text-sm font-bold">{formatarMoeda(resultado.totalInvestido)}</p>
          </div>
          <div className="bg-white/20 rounded-lg p-2 text-center">
            <p className="text-[10px] text-white/70">Juros</p>
            <p className="text-sm font-bold">{formatarMoeda(resultado.totalJuros)}</p>
          </div>
          <div className="bg-white/20 rounded-lg p-2 text-center">
            <p className="text-[10px] text-white/70">Rent.</p>
            <p className="text-sm font-bold">{rentabilidade}%</p>
          </div>
        </div>
      </div>

      {/* Toggle para detalhes */}
      <button
        onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
        className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        <span>{mostrarDetalhes ? 'Ocultar detalhes' : 'Ver detalhes completos'}</span>
        {mostrarDetalhes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Detalhes expandidos */}
      {mostrarDetalhes && (
        <div className="space-y-4">
          {/* Gráfico de Evolução */}
          <GraficoEvolucao />

          {/* Tabela de Evolução */}
          <TabelaEvolucao />

          {/* Estatísticas Avançadas */}
          <EstatisticasAvancadas />

          {/* Calculadora de IR */}
          <CalculadoraIR />
        </div>
      )}
    </div>
  );
}
