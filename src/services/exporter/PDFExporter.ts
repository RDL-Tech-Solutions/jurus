/**
 * PDF Exporter - Geração de PDFs profissionais
 * Usa jsPDF para geração client-side
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportOptions, ReportMetadata } from '../../types/export';

export class PDFExporter {
  private doc: jsPDF;
  private pageNumber: number = 1;
  private readonly margin = 20;
  private readonly lineHeight = 7;

  constructor(private options: ExportOptions, private metadata: ReportMetadata) {
    const orientation = options.orientation || 'portrait';
    const format = options.pageSize || 'a4';

    this.doc = new jsPDF({
      orientation,
      unit: 'mm',
      format
    });
  }

  /**
   * Adiciona cabeçalho ao documento
   */
  private addHeader(): void {
    const { title } = this.metadata;
    const pageWidth = this.doc.internal.pageSize.getWidth();

    // Logo (se incluído)
    if (this.options.includeLogo) {
      try {
        // Placeholder - substituir com logo real
        this.doc.setFontSize(20);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('💰', this.margin, this.margin);
      } catch (error) {
        console.warn('Logo não carregado:', error);
      }
    }

    // Título
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, pageWidth / 2, this.margin + 5, { align: 'center' });

    // Data de geração
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(
      `Gerado em: ${new Date(this.metadata.createdAt).toLocaleString('pt-BR')}`,
      pageWidth / 2,
      this.margin + 12,
      { align: 'center' }
    );

    // Filtros aplicados
    if (this.metadata.filters && this.metadata.filters.length > 0) {
      this.doc.setFontSize(9);
      this.doc.setTextColor(100);
      this.doc.text(
        `Filtros: ${this.metadata.filters.join(', ')}`,
        pageWidth / 2,
        this.margin + 18,
        { align: 'center' }
      );
      this.doc.setTextColor(0);
    }
  }

  /**
   * Adiciona rodapé ao documento
   */
  private addFooter(): void {
    const pageHeight = this.doc.internal.pageSize.getHeight();
    const pageWidth = this.doc.internal.pageSize.getWidth();

    this.doc.setFontSize(8);
    this.doc.setTextColor(150);

    // Número da página
    this.doc.text(
      `Página ${this.pageNumber}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    // App info
    this.doc.text(
      `${this.metadata.appName} v${this.metadata.version}`,
      this.margin,
      pageHeight - 10
    );

    this.doc.setTextColor(0);
  }

  /**
   * Adiciona uma tabela ao documento
   */
  public addTable(headers: string[], rows: any[][], title?: string): void {
    if (title) {
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(title, this.margin, (this.doc as any).lastAutoTable ? (this.doc as any).lastAutoTable.finalY + 15 : 40);
    }

    autoTable(this.doc, {
      head: [headers],
      body: rows,
      startY: (this.doc as any).lastAutoTable ? (this.doc as any).lastAutoTable.finalY + (title ? 20 : 10) : (title ? 45 : 40),
      margin: { left: this.margin, right: this.margin },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [79, 70, 229], // Indigo
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      didDrawPage: (data) => {
        this.addHeader();
        this.addFooter();
        this.pageNumber++;
      }
    });
  }

  /**
   * Adiciona texto ao documento
   */
  public addText(text: string, options?: { fontSize?: number; bold?: boolean }): void {
    const fontSize = options?.fontSize || 11;
    const bold = options?.bold || false;

    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', bold ? 'bold' : 'normal');

    const y = (this.doc as any).lastAutoTable ? (this.doc as any).lastAutoTable.finalY + 10 : 40;
    this.doc.text(text, this.margin, y);
  }

  /**
   * Adiciona uma nova página
   */
  public addPage(): void {
    this.doc.addPage();
    this.pageNumber++;
  }

  /**
   * Gera e baixa o PDF
   */
  public async generate(filename: string): Promise<void> {
    this.addHeader();
    this.addFooter();
    this.doc.save(`${filename}.pdf`);
  }

  /**
   * Retorna o blob do PDF
   */
  public getBlob(): Blob {
    return this.doc.output('blob');
  }

  /**
   * Retorna a URL do PDF
   */
  public getDataURL(): string {
    return this.doc.output('dataurlstring');
  }
}
