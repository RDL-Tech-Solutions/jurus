import { useState } from 'react';
import { Table, ChevronDown, ChevronUp } from 'lucide-react';
import { useSimulacao } from '../store/useAppStore';
import { formatarMoeda } from '../utils/calculos';
import { exportarEvolucaoInvestimento, ExportFormat } from '../utils/exportacao';
import { MenuExportacao } from './MenuExportacao';
import { cn } from '../utils/cn';

export function TabelaEvolucao() {
  const { resultado, simulacao } = useSimulacao();
  const [filtro, setFiltro] = useState<'mensal' | 'anual'>('mensal');
  const [expandido, setExpandido] = useState(false);

  if (!resultado || !simulacao) return null;

  const dados = filtro === 'anual'
    ? resultado.evolucaoMensal.filter((_, index) => index % 12 === 11 || index === resultado.evolucaoMensal.length - 1)
    : resultado.evolucaoMensal;

  const dadosVisiveis = expandido ? dados : dados.slice(0, 5);

  const handleExportar = (formato: ExportFormat) => {
    exportarEvolucaoInvestimento(resultado.evolucaoMensal, simulacao, resultado, formato);
  };

  return (
    <div className="card-mobile space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-2">
          <Table className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tabela de Evolução
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          {/* Filtro */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setFiltro('mensal')}
              className={cn(
                'px-3 py-1.5 rounded text-sm font-medium transition-colors',
                filtro === 'mensal'
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            >
              Mensal
            </button>
            <button
              onClick={() => setFiltro('anual')}
              className={cn(
                'px-3 py-1.5 rounded text-sm font-medium transition-colors',
                filtro === 'anual'
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            >
              Anual
            </button>
          </div>

          {/* Exportar */}
          <MenuExportacao
            onExportar={handleExportar}
            label="Exportar"
            variant="primary"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">Período</th>
              <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">Contribuição</th>
              <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">Juros</th>
              <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">Saldo</th>
              <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">Rent. %</th>
            </tr>
          </thead>
          <tbody>
            {dadosVisiveis.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-3 px-2 text-gray-900 dark:text-white">
                  {filtro === 'anual' ? `Ano ${Math.ceil(item.mes / 12)}` : `Mês ${item.mes}`}
                </td>
                <td className="py-3 px-2 text-right text-blue-600 dark:text-blue-400">
                  {formatarMoeda(item.contribuicao)}
                </td>
                <td className="py-3 px-2 text-right text-amber-600 dark:text-amber-400">
                  {formatarMoeda(item.juros)}
                </td>
                <td className="py-3 px-2 text-right font-semibold text-green-600 dark:text-green-400">
                  {formatarMoeda(item.saldoAcumulado)}
                </td>
                <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">
                  {item.contribuicao > 0 ? ((item.juros / item.contribuicao) * 100).toFixed(2) : '0.00'}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botão Expandir */}
      {dados.length > 5 && (
        <button
          onClick={() => setExpandido(!expandido)}
          className="w-full flex items-center justify-center space-x-2 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
        >
          {expandido ? (
            <>
              <ChevronUp className="w-4 h-4" />
              <span>Mostrar menos</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              <span>Mostrar todos ({dados.length} períodos)</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
