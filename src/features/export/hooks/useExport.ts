/**
 * Hook para gerenciar exportações
 */

import { useState, useCallback } from 'react';
import { ExportService } from '../../../services/exporter/ExportService';
import { ExportFormat, ReportType } from '../../../types/export';
import { useToast } from '../../../hooks/useToast';

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { success, error: showError } = useToast();

  /**
   * Exporta dados no formato especificado
   */
  const exportData = useCallback(async (
    type: ReportType,
    data: any,
    format: ExportFormat,
    options?: any
  ) => {
    setIsExporting(true);
    setProgress(0);

    try {
      // Callback de progresso
      const onProgress = (prog: any) => {
        setProgress(prog.progress || 0);
      };

      const metadata = {
        title: getTitleByType(type),
        author: 'Jurus App',
        createdAt: new Date().toISOString(),
        appName: 'Jurus - Controle Financeiro',
        version: '1.0.0'
      };

      const exportOptions = {
        format,
        ...options
      };

      // Chamar método estático
      await ExportService.export(data, exportOptions, metadata, onProgress);

      setProgress(100);
      success('✅ Exportação concluída', 'Arquivo baixado com sucesso!');
    } catch (err) {
      console.error('Erro ao exportar:', err);
      showError('❌ Erro na exportação', 'Não foi possível exportar os dados');
      throw err;
    } finally {
      setIsExporting(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [success, showError]);

  /**
   * Obtém título baseado no tipo de relatório
   */
  const getTitleByType = (type: ReportType): string => {
    const titles: Record<string, string> = {
      'transacoes': 'Relatório de Transações',
      'dividas': 'Relatório de Dívidas',
      'cartoes': 'Relatório de Cartões de Crédito',
      'dashboard': 'Dashboard Completo',
      'monthly-summary': 'Resumo Mensal',
      'transactions': 'Transactions Report',
      'debts': 'Debts Report',
      'invoices': 'Invoices Report',
      'goals': 'Goals Report',
      'item-detail': 'Item Detail'
    };

    return titles[type] || 'Relatório';
  };

  return {
    exportData,
    isExporting,
    progress
  };
}
