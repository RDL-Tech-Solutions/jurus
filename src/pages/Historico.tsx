import { Clock, Trash2 } from 'lucide-react';
import { useHistorico } from '../store/useAppStore';
import { formatarMoeda } from '../utils/calculos';
import { exportarHistorico, ExportFormat } from '../utils/exportacao';
import { MenuExportacao } from '../components/MenuExportacao';

export function Historico() {
  const { historico, removerHistorico, limparHistorico } = useHistorico();

  const handleExportar = (formato: ExportFormat) => {
    exportarHistorico(historico, formato);
  };

  return (
    <div className="page-container space-y-4">
      <div className="card-mobile">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <Clock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Histórico de Simulações
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {historico.length} {historico.length === 1 ? 'simulação' : 'simulações'} realizadas
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {historico.length > 0 && (
              <>
                <MenuExportacao
                  onExportar={handleExportar}
                  label="Exportar"
                  variant="secondary"
                />
                <button
                  onClick={limparHistorico}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Limpar</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {historico.length === 0 ? (
        <div className="card-mobile text-center py-16">
          <Clock className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Nenhuma simulação realizada
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Suas simulações aparecerão aqui para consulta futura
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {historico.map((item) => (
            <div key={item.id} className="card-mobile hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(item.data).toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {formatarMoeda(item.resultado.valorFinal)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Rentabilidade</p>
                  <p className="font-bold text-purple-600 dark:text-purple-400">
                    {((item.resultado.totalJuros / item.resultado.totalInvestido) * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Valor Inicial</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatarMoeda(item.simulacao.valorInicial)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Aporte Mensal</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatarMoeda(item.simulacao.valorMensal)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Período</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.simulacao.periodo} {item.simulacao.unidadePeriodo}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total de Juros</p>
                  <p className="font-medium text-amber-600 dark:text-amber-400">
                    {formatarMoeda(item.resultado.totalJuros)}
                  </p>
                </div>
                <div className="flex items-end justify-end md:justify-start">
                  <button
                    onClick={() => removerHistorico(item.id)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remover</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
