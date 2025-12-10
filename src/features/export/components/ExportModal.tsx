/**
 * Modal de Exportação
 * Interface completa para configurar e exportar relatórios
 */

import React, { useState } from 'react';
import { X, FileText, Download, Check } from 'lucide-react';
import { ExportFormat, PageOrientation, PageSize, ReportType } from '../../../types/export';
import { ExportButton } from './ExportButton';
import { cn } from '../../../utils/cn';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (config: ExportConfig) => Promise<void>;
  reportType: ReportType;
  title?: string;
}

interface ExportConfig {
  format: ExportFormat;
  orientation?: PageOrientation;
  pageSize?: PageSize;
  includeCharts?: boolean;
  includeDetails?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  reportType,
  title
}) => {
  const [config, setConfig] = useState<ExportConfig>({
    format: 'pdf',
    orientation: 'portrait',
    pageSize: 'a4',
    includeCharts: true,
    includeDetails: true
  });

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(config);
      onClose();
    } catch (error) {
      console.error('Erro ao exportar:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  const reportTitles: Record<ReportType, string> = {
    'monthly-summary': 'Resumo Mensal',
    transactions: 'Transações',
    transacoes: 'Transações',
    debts: 'Dívidas',
    dividas: 'Dívidas',
    invoices: 'Faturas',
    cartoes: 'Cartões de Crédito',
    goals: 'Metas',
    dashboard: 'Dashboard Completo',
    'item-detail': 'Detalhes do Item'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {title || `Exportar ${reportTitles[reportType]}`}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Configure as opções de exportação
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Formato */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Formato de Exportação
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['pdf', 'excel', 'csv'] as ExportFormat[]).map((format) => (
                <button
                  key={format}
                  onClick={() => setConfig({ ...config, format })}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-all text-center',
                    config.format === format
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                  )}
                >
                  <div className="text-2xl mb-1">
                    {format === 'pdf' && '📄'}
                    {format === 'excel' && '📊'}
                    {format === 'csv' && '📋'}
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white uppercase">
                    {format}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Opções de PDF */}
          {config.format === 'pdf' && (
            <>
              {/* Orientação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Orientação
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['portrait', 'landscape'] as PageOrientation[]).map((orientation) => (
                    <button
                      key={orientation}
                      onClick={() => setConfig({ ...config, orientation })}
                      className={cn(
                        'p-3 rounded-lg border-2 transition-all',
                        config.orientation === orientation
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      )}
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {orientation === 'portrait' ? '📄 Retrato' : '📃 Paisagem'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tamanho da Página */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Tamanho da Página
                </label>
                <select
                  value={config.pageSize}
                  onChange={(e) => setConfig({ ...config, pageSize: e.target.value as PageSize })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="a4">A4</option>
                  <option value="letter">Carta</option>
                  <option value="legal">Ofício</option>
                </select>
              </div>
            </>
          )}

          {/* Opções de Conteúdo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Conteúdo
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <input
                  type="checkbox"
                  checked={config.includeCharts}
                  onChange={(e) => setConfig({ ...config, includeCharts: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Incluir Gráficos
                  </div>
                  <div className="text-xs text-gray-500">
                    Adiciona visualizações gráficas ao relatório
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <input
                  type="checkbox"
                  checked={config.includeDetails}
                  onChange={(e) => setConfig({ ...config, includeDetails: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Incluir Detalhes
                  </div>
                  <div className="text-xs text-gray-500">
                    Adiciona informações detalhadas de cada item
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">
              📄 Preview da Exportação:
            </p>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Formato: {config.format.toUpperCase()}</li>
              {config.format === 'pdf' && (
                <>
                  <li>• Orientação: {config.orientation === 'portrait' ? 'Retrato' : 'Paisagem'}</li>
                  <li>• Tamanho: {config.pageSize?.toUpperCase()}</li>
                </>
              )}
              <li>• Gráficos: {config.includeCharts ? 'Sim' : 'Não'}</li>
              <li>• Detalhes: {config.includeDetails ? 'Sim' : 'Não'}</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={onClose}
            className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
          >
            Cancelar
          </button>
          <ExportButton
            onClick={handleExport}
            label="Exportar Agora"
            loading={isExporting}
            icon={<Download className="w-4 h-4" />}
          />
        </div>
      </div>
    </div>
  );
};
