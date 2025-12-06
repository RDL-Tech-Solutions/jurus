import { TrendingUp, DollarSign, Calendar, Percent, FileDown } from 'lucide-react';
import { useSimulacao } from '../store/useAppStore';
import { formatarMoeda } from '../utils/calculos';
import { exportarRelatorioCompleto, ExportFormat } from '../utils/exportacao';
import { MenuExportacao } from './MenuExportacao';
import { GraficoEvolucao } from './GraficoEvolucao';
import { TabelaEvolucao } from './TabelaEvolucao';
import { EstatisticasAvancadas } from './EstatisticasAvancadas';
import { CalculadoraIR } from './CalculadoraIR';

export function ResultadoSimulacao() {
  const { resultado, simulacao } = useSimulacao();

  const handleExportarRelatorio = (formato: ExportFormat) => {
    if (resultado && simulacao) {
      exportarRelatorioCompleto(simulacao, resultado, formato);
    }
  };

  if (!resultado) {
    return (
      <div className="card-mobile text-center py-12">
        <TrendingUp className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
          Nenhuma simulação realizada
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Preencha o formulário acima e clique em "Calcular" para ver os resultados
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Exportação */}
      <div className="card-mobile">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
              <FileDown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Resultado da Simulação
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Período de {simulacao?.periodo} {simulacao?.unidadePeriodo}
              </p>
            </div>
          </div>
          <MenuExportacao
            onExportar={handleExportarRelatorio}
            label="Exportar Relatório"
            variant="primary"
          />
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Valor Final */}
        <div className="card-mobile">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Valor Final</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatarMoeda(resultado.valorFinal)}
              </p>
            </div>
          </div>
        </div>

        {/* Total Investido */}
        <div className="card-mobile">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Investido</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatarMoeda(resultado.totalInvestido)}
              </p>
            </div>
          </div>
        </div>

        {/* Total de Juros */}
        <div className="card-mobile">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Percent className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Juros</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {formatarMoeda(resultado.totalJuros)}
              </p>
            </div>
          </div>
        </div>

        {/* Rentabilidade */}
        <div className="card-mobile">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Rentabilidade</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {resultado.totalInvestido > 0 ? ((resultado.totalJuros / resultado.totalInvestido) * 100).toFixed(2) : '0.00'}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Evolução */}
      <GraficoEvolucao />

      {/* Tabela de Evolução */}
      <TabelaEvolucao />

      {/* Estatísticas Avançadas */}
      <EstatisticasAvancadas />

      {/* Calculadora de IR */}
      <CalculadoraIR />
    </div>
  );
}
