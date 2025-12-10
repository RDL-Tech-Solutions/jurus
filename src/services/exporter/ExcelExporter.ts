/**
 * Excel Exporter - Geração de arquivos XLSX
 * Usa SheetJS (xlsx) para geração client-side
 */

import * as XLSX from 'xlsx';
import { ExportOptions, ReportMetadata } from '../../types/export';

export class ExcelExporter {
  private workbook: XLSX.WorkBook;

  constructor(private options: ExportOptions, private metadata: ReportMetadata) {
    this.workbook = XLSX.utils.book_new();
    
    // Adicionar metadados
    this.workbook.Props = {
      Title: metadata.title,
      Subject: metadata.title,
      Author: metadata.author,
      CreatedDate: new Date(metadata.createdAt),
      Company: metadata.appName
    };
  }

  /**
   * Adiciona uma planilha ao workbook
   */
  public addSheet(name: string, data: any[][], headers?: string[]): void {
    const wsData = headers ? [headers, ...data] : data;
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Congelar cabeçalho
    if (headers) {
      ws['!freeze'] = { xSplit: 0, ySplit: 1 };
    }

    // Auto-ajustar largura das colunas
    const colWidths = this.calculateColumnWidths(wsData);
    ws['!cols'] = colWidths;

    // Adicionar ao workbook
    XLSX.utils.book_append_sheet(this.workbook, ws, name);
  }

  /**
   * Adiciona uma planilha a partir de objetos JSON
   */
  public addSheetFromJSON(name: string, data: any[]): void {
    const ws = XLSX.utils.json_to_sheet(data);

    // Congelar cabeçalho
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };

    // Auto-ajustar largura das colunas
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    const colWidths: { wch: number }[] = [];
    
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxWidth = 10;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = ws[cellAddress];
        if (cell && cell.v) {
          const cellLength = cell.v.toString().length;
          maxWidth = Math.max(maxWidth, cellLength);
        }
      }
      colWidths.push({ wch: Math.min(maxWidth + 2, 50) });
    }
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(this.workbook, ws, name);
  }

  /**
   * Calcula larguras ideais das colunas
   */
  private calculateColumnWidths(data: any[][]): { wch: number }[] {
    if (data.length === 0) return [];

    const colCount = data[0].length;
    const widths: { wch: number }[] = [];

    for (let col = 0; col < colCount; col++) {
      let maxWidth = 10;
      for (const row of data) {
        if (row[col]) {
          const cellLength = row[col].toString().length;
          maxWidth = Math.max(maxWidth, cellLength);
        }
      }
      widths.push({ wch: Math.min(maxWidth + 2, 50) });
    }

    return widths;
  }

  /**
   * Adiciona planilha de resumo/metadados
   */
  public addSummarySheet(): void {
    const summaryData = [
      ['Relatório', this.metadata.title],
      ['Gerado em', new Date(this.metadata.createdAt).toLocaleString('pt-BR')],
      ['Autor', this.metadata.author],
      ['Aplicativo', this.metadata.appName],
      ['Versão', this.metadata.version],
      [],
      ['Filtros Aplicados'],
      ...(this.metadata.filters || []).map(f => ['', f])
    ];

    const ws = XLSX.utils.aoa_to_sheet(summaryData);
    ws['!cols'] = [{ wch: 20 }, { wch: 40 }];

    XLSX.utils.book_append_sheet(this.workbook, ws, 'Resumo', true);
  }

  /**
   * Gera e baixa o arquivo Excel
   */
  public async generate(filename: string): Promise<void> {
    XLSX.writeFile(this.workbook, `${filename}.xlsx`);
  }

  /**
   * Retorna o blob do Excel
   */
  public getBlob(): Blob {
    const wbout = XLSX.write(this.workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  /**
   * Retorna o buffer do Excel
   */
  public getBuffer(): ArrayBuffer {
    return XLSX.write(this.workbook, { bookType: 'xlsx', type: 'array' });
  }
}
