import { Clock, Trash2, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { useState } from 'react';
import { useHistorico } from '../store/useAppStore';
import { formatarMoeda } from '../utils/calculos';
import { exportarHistorico, ExportFormat } from '../utils/exportacao';
import { MenuExportacao } from '../components/MenuExportacao';
import { cn } from '../utils/cn';

export function Historico() {
  const { historico, removerHistorico, limparHistorico } = useHistorico();
  const [expandido, setExpandido] = useState<string | null>(null);

  const handleExportar = (formato: ExportFormat) => {
    exportarHistorico(historico, formato);
  };

  const toggleExpand = (id: string) => {
    setExpandido(expandido === id ? null : id);
  };

  return (
    <div className="page-container space-y-4">
      {/* Header compacto */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Histórico
            </h1>
            <p className="text-xs text-gray-500">
              {historico.length} {historico.length === 1 ? 'simulação' : 'simulações'}
            </p>
          </div>
        </div>

        {historico.length > 0 && (
          <div className="flex items-center gap-2">
            <MenuExportacao
              onExportar={handleExportar}
              label=""
              variant="secondary"
            />
            <button
              onClick={limparHistorico}
              className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {historico.length === 0 ? (
        <div className="card-mobile text-center py-12">
          <Clock className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <h3 className="text-base font-semibold text-gray-600 dark:text-gray-400 mb-1">
            Nenhuma simulação
          </h3>
          <p className="text-sm text-gray-500">
            Suas simulações aparecerão aqui
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {historico.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(item.id)}
                className="w-full p-3 flex items-center gap-3"
              >
                {/* Data */}
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    {new Date(item.data).getDate()}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase">
                    {new Date(item.data).toLocaleDateString('pt-BR', { month: 'short' })}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 text-left">
                  <p className="font-bold text-green-600 text-lg">
                    {formatarMoeda(item.resultado.valorFinal)}
                  </p>
                  <p className="text-xs text-gray-500">
                    +{formatarMoeda(item.resultado.totalJuros)} de juros
                  </p>
                </div>

                {/* Rentabilidade */}
                <div className="text-right">
                  <p className="font-bold text-purple-600 text-sm">
                    {((item.resultado.totalJuros / item.resultado.totalInvestido) * 100).toFixed(1)}%
                  </p>
                  <p className="text-[10px] text-gray-400">rentabilidade</p>
                </div>

                {expandido === item.id
                  ? <ChevronUp className="w-4 h-4 text-gray-400" />
                  : <ChevronDown className="w-4 h-4 text-gray-400" />
                }
              </button>

              {/* Detalhes expandidos */}
              {expandido === item.id && (
                <div className="px-3 pb-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-[10px] text-gray-400">Inicial</p>
                      <p className="text-xs font-medium">{formatarMoeda(item.simulacao.valorInicial)}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-[10px] text-gray-400">Mensal</p>
                      <p className="text-xs font-medium">{formatarMoeda(item.simulacao.valorMensal)}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-[10px] text-gray-400">Período</p>
                      <p className="text-xs font-medium">{item.simulacao.periodo}m</p>
                    </div>
                    <div className="text-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <p className="text-[10px] text-amber-600">Juros</p>
                      <p className="text-xs font-medium text-amber-600">{formatarMoeda(item.resultado.totalJuros)}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removerHistorico(item.id);
                    }}
                    className="w-full mt-2 flex items-center justify-center gap-1 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remover</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
