/**
 * Export Service - Orquestrador de exportações
 */

import { PDFExporter } from './PDFExporter';
import { ExcelExporter } from './ExcelExporter';
import { CSVExporter } from './CSVExporter';
import { ExportOptions, ReportMetadata, ExportFormat, ExportProgress } from '../../types/export';

export class ExportService {
  /**
   * Exporta dados no formato especificado
   */
  public static async export(
    data: any,
    options: ExportOptions,
    metadata: ReportMetadata,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<void> {
    try {
      // Preparando
      onProgress?.({
        stage: 'preparing',
        progress: 10,
        message: 'Preparando dados...'
      });

      await new Promise(resolve => setTimeout(resolve, 300));

      // Gerando
      onProgress?.({
        stage: 'generating',
        progress: 50,
        message: `Gerando ${options.format.toUpperCase()}...`
      });

      const filename = this.generateFilename(metadata.title);

      switch (options.format) {
        case 'pdf':
          await this.exportPDF(data, options, metadata, filename);
          break;
        case 'excel':
          await this.exportExcel(data, options, metadata, filename);
          break;
        case 'csv':
          await this.exportCSV(data, options, metadata, filename);
          break;
      }

      // Baixando
      onProgress?.({
        stage: 'downloading',
        progress: 90,
        message: 'Baixando arquivo...'
      });

      await new Promise(resolve => setTimeout(resolve, 300));

      // Completo
      onProgress?.({
        stage: 'complete',
        progress: 100,
        message: 'Exportação concluída!'
      });
    } catch (error) {
      onProgress?.({
        stage: 'error',
        progress: 0,
        message: `Erro ao exportar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      });
      throw error;
    }
  }

  /**
   * Exporta para PDF
   */
  private static async exportPDF(
    data: any,
    options: ExportOptions,
    metadata: ReportMetadata,
    filename: string
  ): Promise<void> {
    const exporter = new PDFExporter(options, metadata);

    // Adicionar conteúdo baseado no tipo de dados
    if (data.summary) {
      exporter.addText(data.summary.title, { fontSize: 14, bold: true });
      exporter.addText(data.summary.description);
    }

    if (data.tables) {
      data.tables.forEach((table: any) => {
        exporter.addTable(table.headers, table.rows, table.title);
      });
    }

    await exporter.generate(filename);
  }

  /**
   * Exporta para Excel
   */
  private static async exportExcel(
    data: any,
    options: ExportOptions,
    metadata: ReportMetadata,
    filename: string
  ): Promise<void> {
    const exporter = new ExcelExporter(options, metadata);

    // Adicionar planilha de resumo
    exporter.addSummarySheet();

    // Adicionar planilhas de dados
    if (data.sheets) {
      data.sheets.forEach((sheet: any) => {
        if (sheet.json) {
          exporter.addSheetFromJSON(sheet.name, sheet.json);
        } else if (sheet.data) {
          exporter.addSheet(sheet.name, sheet.data, sheet.headers);
        }
      });
    }

    await exporter.generate(filename);
  }

  /**
   * Exporta para CSV
   */
  private static async exportCSV(
    data: any,
    options: ExportOptions,
    metadata: ReportMetadata,
    filename: string
  ): Promise<void> {
    const exporter = new CSVExporter(options, metadata);

    if (data.headers && data.rows) {
      exporter.addData(data.headers, data.rows);
    }

    await exporter.generate(filename);
  }

  /**
   * Gera nome de arquivo baseado no título e data
   */
  private static generateFilename(title: string): string {
    const date = new Date().toISOString().split('T')[0];
    const sanitized = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `${sanitized}-${date}`;
  }
}
