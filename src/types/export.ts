/**
 * Tipos para Sistema de Exportação
 */

export type ExportFormat = 'pdf' | 'excel' | 'csv';
export type PageOrientation = 'portrait' | 'landscape';
export type PageSize = 'a4' | 'letter';

export interface ExportOptions {
  format: ExportFormat;
  includeCharts?: boolean;
  includeLogo?: boolean;
  pageSize?: PageSize;
  orientation?: PageOrientation;
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: Record<string, any>;
}

export interface ReportMetadata {
  title: string;
  author: string;
  createdAt: string;
  appName: string;
  version: string;
  filters?: string[];
}

export type ReportType = 
  | 'monthly-summary'
  | 'transactions'
  | 'transacoes'
  | 'debts'
  | 'dividas'
  | 'invoices'
  | 'cartoes'
  | 'goals'
  | 'dashboard'
  | 'item-detail';

export interface ExportRequest {
  type: ReportType;
  options: ExportOptions;
  data: any;
  metadata: ReportMetadata;
}

export interface ExportProgress {
  stage: 'preparing' | 'generating' | 'downloading' | 'complete' | 'error';
  progress: number;
  message: string;
}
