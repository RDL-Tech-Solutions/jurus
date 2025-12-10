/**
 * CSV Exporter - Geração de arquivos CSV
 */

import { ExportOptions, ReportMetadata } from '../../types/export';

export class CSVExporter {
  private csvContent: string = '';

  constructor(private options: ExportOptions, private metadata: ReportMetadata) {
    // Adicionar metadados como comentários
    this.csvContent += `# ${metadata.title}\n`;
    this.csvContent += `# Gerado em: ${new Date(metadata.createdAt).toLocaleString('pt-BR')}\n`;
    if (metadata.filters && metadata.filters.length > 0) {
      this.csvContent += `# Filtros: ${metadata.filters.join(', ')}\n`;
    }
    this.csvContent += '\n';
  }

  /**
   * Adiciona dados ao CSV
   */
  public addData(headers: string[], rows: any[][]): void {
    // Adicionar cabeçalhos
    this.csvContent += this.escapeCSVRow(headers) + '\n';

    // Adicionar linhas
    rows.forEach(row => {
      this.csvContent += this.escapeCSVRow(row) + '\n';
    });
  }

  /**
   * Escapa uma linha CSV
   */
  private escapeCSVRow(row: any[]): string {
    return row.map(cell => {
      if (cell === null || cell === undefined) return '';
      
      const cellStr = String(cell);
      
      // Se contém vírgula, aspas ou quebra de linha, precisa escapar
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      
      return cellStr;
    }).join(',');
  }

  /**
   * Gera e baixa o arquivo CSV
   */
  public async generate(filename: string): Promise<void> {
    const blob = new Blob([this.csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Retorna o blob do CSV
   */
  public getBlob(): Blob {
    return new Blob([this.csvContent], { type: 'text/csv;charset=utf-8;' });
  }

  /**
   * Retorna o conteúdo CSV como string
   */
  public getContent(): string {
    return this.csvContent;
  }
}
