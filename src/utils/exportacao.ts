import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { formatarMoeda, formatarPercentual } from './calculos';
import { ResultadoMensal, SimulacaoInput, ResultadoSimulacao } from '../types';

// Tipos de exportação
export type ExportFormat = 'csv' | 'excel' | 'pdf';

// Interface para dados de exportação
export interface DadosExportacao {
    titulo: string;
    subtitulo?: string;
    dados: Record<string, any>[];
    colunas: {
        key: string;
        header: string;
        format?: 'moeda' | 'percentual' | 'numero' | 'texto';
    }[];
    resumo?: {
        label: string;
        valor: string;
    }[];
    dataGeracao?: Date;
}

// Formatar valor baseado no tipo
function formatarValor(valor: any, format?: string): string {
    if (valor === null || valor === undefined) return '-';

    switch (format) {
        case 'moeda':
            return formatarMoeda(Number(valor));
        case 'percentual':
            return formatarPercentual(Number(valor));
        case 'numero':
            return Number(valor).toLocaleString('pt-BR');
        default:
            return String(valor);
    }
}

// ==================== EXPORTAÇÃO CSV ====================
export function exportarCSV(dados: DadosExportacao): void {
    const { titulo, colunas, dados: linhas, resumo } = dados;

    // Cabeçalho
    const headers = colunas.map(col => col.header);

    // Linhas de dados
    const rows = linhas.map(item =>
        colunas.map(col => {
            const valor = item[col.key];
            return formatarValor(valor, col.format);
        })
    );

    // Montar CSV
    let csvContent = '';

    // Título
    csvContent += `${titulo}\n`;
    csvContent += `Gerado em: ${new Date().toLocaleString('pt-BR')}\n\n`;

    // Resumo se houver
    if (resumo && resumo.length > 0) {
        csvContent += 'RESUMO\n';
        resumo.forEach(item => {
            csvContent += `${item.label};${item.valor}\n`;
        });
        csvContent += '\n';
    }

    // Dados
    csvContent += headers.join(';') + '\n';
    rows.forEach(row => {
        csvContent += row.join(';') + '\n';
    });

    // Download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `${titulo.toLowerCase().replace(/\s+/g, '_')}_${formatarDataArquivo()}.csv`;
    saveAs(blob, fileName);
}

// ==================== EXPORTAÇÃO EXCEL PROFISSIONAL ====================
export function exportarExcel(dados: DadosExportacao): void {
    const { titulo, subtitulo, colunas, dados: linhas, resumo } = dados;

    // Criar workbook
    const wb = XLSX.utils.book_new();

    // ========== PLANILHA DE RESUMO ==========
    if (resumo && resumo.length > 0) {
        const resumoData: any[][] = [];

        // Cabeçalho do documento
        resumoData.push([titulo.toUpperCase()]);
        resumoData.push([subtitulo || '']);
        resumoData.push([`Gerado em: ${new Date().toLocaleString('pt-BR')}`]);
        resumoData.push(['']);
        resumoData.push(['']);

        // Título da seção
        resumoData.push(['📊 RESUMO EXECUTIVO']);
        resumoData.push(['']);

        // Dados do resumo com formatação
        resumo.forEach(item => {
            resumoData.push([item.label, item.valor]);
        });

        resumoData.push(['']);
        resumoData.push(['']);

        // Informações adicionais
        resumoData.push(['📅 Informações do Relatório']);
        resumoData.push(['']);
        resumoData.push(['Data de Geração', new Date().toLocaleDateString('pt-BR')]);
        resumoData.push(['Hora de Geração', new Date().toLocaleTimeString('pt-BR')]);
        resumoData.push(['Total de Registros', String(linhas.length)]);
        resumoData.push(['Formato', 'Microsoft Excel (.xlsx)']);
        resumoData.push(['']);
        resumoData.push(['']);
        resumoData.push(['💡 Dica: Acesse a aba "Dados Detalhados" para ver a tabela completa']);

        const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);

        // Configurar larguras das colunas para resumo
        wsResumo['!cols'] = [
            { wch: 35 },  // Coluna A - Labels
            { wch: 30 }   // Coluna B - Valores
        ];

        // Merge das células do título
        wsResumo['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },  // Título
            { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },  // Subtítulo
            { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },  // Data
            { s: { r: 5, c: 0 }, e: { r: 5, c: 1 } },  // Seção Resumo
            { s: { r: resumo.length + 10, c: 0 }, e: { r: resumo.length + 10, c: 1 } },  // Seção Info
        ];

        XLSX.utils.book_append_sheet(wb, wsResumo, '📋 Resumo');
    }

    // ========== PLANILHA DE DADOS DETALHADOS ==========
    const wsData: any[][] = [];

    // Cabeçalho do documento
    wsData.push([titulo.toUpperCase()]);
    wsData.push([subtitulo || `Relatório gerado em ${new Date().toLocaleDateString('pt-BR')}`]);
    wsData.push(['']);
    wsData.push(['']);

    // Informações do relatório
    wsData.push(['📊 DADOS DETALHADOS']);
    wsData.push(['']);

    // Cabeçalhos da tabela com estilo
    const headers = colunas.map(col => col.header.toUpperCase());
    wsData.push(headers);

    // Linha separadora visual (marcador)
    const headerRowIndex = wsData.length - 1;

    // Dados formatados
    linhas.forEach((item, index) => {
        const row = colunas.map(col => {
            const valor = item[col.key];

            // Para Excel, mantemos valores numéricos para melhor formatação
            if (col.format === 'moeda') {
                return Number(valor) || 0;
            }
            if (col.format === 'percentual') {
                return (Number(valor) || 0) / 100;
            }
            if (col.format === 'numero') {
                return Number(valor) || 0;
            }
            return valor ?? '';
        });
        wsData.push(row);
    });

    // Linha de totais se houver colunas monetárias
    const colunasMonetarias = colunas.filter(col => col.format === 'moeda');
    if (colunasMonetarias.length > 0 && linhas.length > 0) {
        wsData.push(['']);  // Linha vazia

        const rowTotais = colunas.map((col, index) => {
            if (index === 0) return '📊 TOTAIS';
            if (col.format === 'moeda') {
                return linhas.reduce((sum, item) => sum + (Number(item[col.key]) || 0), 0);
            }
            return '';
        });
        wsData.push(rowTotais);
    }

    // Rodapé
    wsData.push(['']);
    wsData.push(['']);
    wsData.push([`Jurus - Simulador de Investimentos | Gerado em: ${new Date().toLocaleString('pt-BR')}`]);

    // Criar worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // ========== CONFIGURAR LARGURAS DE COLUNAS ==========
    const colWidths = colunas.map(col => {
        // Calcular largura baseada no conteúdo
        let maxWidth = col.header.length + 4;

        linhas.forEach(item => {
            const valor = item[col.key];
            let valorStr = '';

            if (col.format === 'moeda') {
                valorStr = formatarMoeda(Number(valor) || 0);
            } else if (col.format === 'percentual') {
                valorStr = formatarPercentual(Number(valor) || 0);
            } else {
                valorStr = String(valor || '');
            }

            if (valorStr.length > maxWidth) {
                maxWidth = valorStr.length;
            }
        });

        return { wch: Math.min(Math.max(maxWidth + 2, 12), 40) };
    });

    ws['!cols'] = colWidths;

    // ========== MERGE DE CÉLULAS DO TÍTULO ==========
    ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: colunas.length - 1 } },  // Título
        { s: { r: 1, c: 0 }, e: { r: 1, c: colunas.length - 1 } },  // Subtítulo
        { s: { r: 4, c: 0 }, e: { r: 4, c: colunas.length - 1 } },  // Seção dados
    ];

    // Merge do rodapé
    const lastRow = wsData.length - 1;
    ws['!merges'].push({ s: { r: lastRow, c: 0 }, e: { r: lastRow, c: colunas.length - 1 } });

    // ========== APLICAR FORMATOS NUMÉRICOS ==========
    const dataStartRow = 7;  // Linha onde começam os dados (após cabeçalhos)

    linhas.forEach((_, rowIndex) => {
        colunas.forEach((col, colIndex) => {
            const cellRef = XLSX.utils.encode_cell({ r: dataStartRow + rowIndex, c: colIndex });

            if (ws[cellRef]) {
                if (col.format === 'moeda') {
                    // Formato monetário brasileiro
                    ws[cellRef].z = '"R$" #,##0.00';
                } else if (col.format === 'percentual') {
                    // Formato percentual
                    ws[cellRef].z = '0.00%';
                } else if (col.format === 'numero') {
                    // Formato numérico com separadores
                    ws[cellRef].z = '#,##0';
                }
            }
        });
    });

    // Formatar linha de totais se existir
    if (colunasMonetarias.length > 0 && linhas.length > 0) {
        const totaisRow = dataStartRow + linhas.length + 1;
        colunas.forEach((col, colIndex) => {
            const cellRef = XLSX.utils.encode_cell({ r: totaisRow, c: colIndex });
            if (ws[cellRef] && col.format === 'moeda') {
                ws[cellRef].z = '"R$" #,##0.00';
            }
        });
    }

    // ========== CONFIGURAR ALTURA DAS LINHAS ==========
    ws['!rows'] = [
        { hpt: 30 },  // Título (mais alto)
        { hpt: 20 },  // Subtítulo
        { hpt: 15 },  // Vazia
        { hpt: 15 },  // Vazia
        { hpt: 25 },  // Seção dados
        { hpt: 15 },  // Vazia
        { hpt: 22 },  // Headers
    ];

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, '📈 Dados Detalhados');

    // ========== PLANILHA DE ESTATÍSTICAS (se houver dados suficientes) ==========
    if (linhas.length >= 5) {
        const statsData: any[][] = [];

        statsData.push(['📊 ESTATÍSTICAS DO RELATÓRIO']);
        statsData.push(['']);
        statsData.push(['']);

        statsData.push(['Métrica', 'Valor']);
        statsData.push(['']);

        // Estatísticas gerais
        statsData.push(['Total de Registros', linhas.length]);
        statsData.push(['']);

        // Estatísticas para cada coluna numérica
        colunas.forEach(col => {
            if (col.format === 'moeda' || col.format === 'numero') {
                const valores = linhas.map(item => Number(item[col.key]) || 0);
                const soma = valores.reduce((a, b) => a + b, 0);
                const media = soma / valores.length;
                const max = Math.max(...valores);
                const min = Math.min(...valores);

                statsData.push([`${col.header} - Soma`, soma]);
                statsData.push([`${col.header} - Média`, media]);
                statsData.push([`${col.header} - Máximo`, max]);
                statsData.push([`${col.header} - Mínimo`, min]);
                statsData.push(['']);
            }
        });

        statsData.push(['']);
        statsData.push([`Relatório gerado por Jurus - ${new Date().toLocaleString('pt-BR')}`]);

        const wsStats = XLSX.utils.aoa_to_sheet(statsData);

        wsStats['!cols'] = [
            { wch: 30 },
            { wch: 20 }
        ];

        // Aplicar formatos
        for (let i = 5; i < statsData.length - 2; i++) {
            const cellRef = XLSX.utils.encode_cell({ r: i, c: 1 });
            if (wsStats[cellRef] && typeof wsStats[cellRef].v === 'number') {
                wsStats[cellRef].z = '"R$" #,##0.00';
            }
        }

        XLSX.utils.book_append_sheet(wb, wsStats, '📉 Estatísticas');
    }

    // ========== GERAR ARQUIVO ==========
    const fileName = `${titulo.toLowerCase().replace(/\s+/g, '_')}_${formatarDataArquivo()}.xlsx`;

    // Configurar propriedades do workbook
    wb.Props = {
        Title: titulo,
        Subject: subtitulo || 'Relatório Financeiro',
        Author: 'Jurus - Simulador de Investimentos',
        CreatedDate: new Date()
    };

    XLSX.writeFile(wb, fileName);
}

// ==================== EXPORTAÇÃO PDF ====================
export function exportarPDF(dados: DadosExportacao): void {
    const { titulo, subtitulo, colunas, dados: linhas, resumo } = dados;

    // Criar documento PDF
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // Título
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(33, 37, 41);
    doc.text(titulo, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;

    // Subtítulo
    if (subtitulo) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(108, 117, 125);
        doc.text(subtitulo, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 6;
    }

    // Data de geração
    doc.setFontSize(10);
    doc.setTextColor(108, 117, 125);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    // Resumo
    if (resumo && resumo.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(33, 37, 41);
        doc.text('Resumo', 14, yPosition);
        yPosition += 6;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        const resumoData = resumo.map(item => [item.label, item.valor]);

        autoTable(doc, {
            startY: yPosition,
            head: [],
            body: resumoData,
            theme: 'plain',
            styles: {
                fontSize: 10,
                cellPadding: 3,
            },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 80 },
                1: { halign: 'right' }
            },
            margin: { left: 14, right: 14 }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 10;
    }

    // Tabela de dados
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(33, 37, 41);
    doc.text('Dados Detalhados', 14, yPosition);
    yPosition += 6;

    // Preparar dados da tabela
    const headers = colunas.map(col => col.header);
    const tableData = linhas.map(item =>
        colunas.map(col => formatarValor(item[col.key], col.format))
    );

    // Gerar tabela
    autoTable(doc, {
        startY: yPosition,
        head: [headers],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: [59, 130, 246], // primary blue
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 9
        },
        bodyStyles: {
            fontSize: 8,
            cellPadding: 2
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252]
        },
        styles: {
            overflow: 'linebreak',
            cellWidth: 'wrap'
        },
        margin: { left: 14, right: 14 },
        didDrawPage: (data) => {
            // Rodapé em cada página
            const pageNumber = doc.getNumberOfPages();
            doc.setFontSize(8);
            doc.setTextColor(156, 163, 175);
            doc.text(
                `Página ${data.pageNumber} de ${pageNumber}`,
                pageWidth / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
            doc.text(
                'Jurus - Simulador de Investimentos',
                14,
                doc.internal.pageSize.getHeight() - 10
            );
        }
    });

    // Salvar PDF
    const fileName = `${titulo.toLowerCase().replace(/\s+/g, '_')}_${formatarDataArquivo()}.pdf`;
    doc.save(fileName);
}

// ==================== FUNÇÕES AUXILIARES ====================
function formatarDataArquivo(): string {
    const data = new Date();
    return `${data.getFullYear()}${String(data.getMonth() + 1).padStart(2, '0')}${String(data.getDate()).padStart(2, '0')}_${String(data.getHours()).padStart(2, '0')}${String(data.getMinutes()).padStart(2, '0')}`;
}

// ==================== EXPORTAÇÕES ESPECÍFICAS ====================

// Exportar evolução do investimento
export function exportarEvolucaoInvestimento(
    evolucao: ResultadoMensal[],
    simulacao: SimulacaoInput,
    resultado: ResultadoSimulacao,
    formato: ExportFormat
): void {
    const dados: DadosExportacao = {
        titulo: 'Evolução do Investimento',
        subtitulo: `Simulação de ${simulacao.periodo} meses`,
        colunas: [
            { key: 'mes', header: 'Mês', format: 'numero' },
            { key: 'contribuicao', header: 'Contribuição', format: 'moeda' },
            { key: 'juros', header: 'Juros do Mês', format: 'moeda' },
            { key: 'saldoAcumulado', header: 'Saldo Acumulado', format: 'moeda' },
            { key: 'rentabilidade', header: 'Rentabilidade', format: 'percentual' }
        ],
        dados: evolucao.map(item => ({
            ...item,
            rentabilidade: item.contribuicao > 0 ? (item.juros / item.contribuicao) * 100 : 0
        })),
        resumo: [
            { label: 'Valor Inicial', valor: formatarMoeda(simulacao.valorInicial) },
            { label: 'Aporte Mensal', valor: formatarMoeda(simulacao.valorMensal) },
            { label: 'Período', valor: `${simulacao.periodo} meses` },
            { label: 'Total Investido', valor: formatarMoeda(resultado.totalInvestido) },
            { label: 'Total de Juros', valor: formatarMoeda(resultado.totalJuros) },
            { label: 'Valor Final', valor: formatarMoeda(resultado.valorFinal) },
            { label: 'Rentabilidade Total', valor: formatarPercentual(resultado.rentabilidadeTotal) }
        ]
    };

    switch (formato) {
        case 'csv':
            exportarCSV(dados);
            break;
        case 'excel':
            exportarExcel(dados);
            break;
        case 'pdf':
            exportarPDF(dados);
            break;
    }
}

// Exportar comparação de investimentos
export function exportarComparacao(
    comparacoes: Array<{
        nome: string;
        valorFinal: number;
        totalJuros: number;
        rentabilidade: number;
        taxaAnual: number;
    }>,
    formato: ExportFormat
): void {
    const dados: DadosExportacao = {
        titulo: 'Comparação de Investimentos',
        subtitulo: `${comparacoes.length} investimentos comparados`,
        colunas: [
            { key: 'nome', header: 'Investimento', format: 'texto' },
            { key: 'taxaAnual', header: 'Taxa Anual (%)', format: 'percentual' },
            { key: 'valorFinal', header: 'Valor Final', format: 'moeda' },
            { key: 'totalJuros', header: 'Total de Juros', format: 'moeda' },
            { key: 'rentabilidade', header: 'Rentabilidade', format: 'percentual' }
        ],
        dados: comparacoes,
        resumo: [
            { label: 'Melhor Investimento', valor: comparacoes[0]?.nome || '-' },
            { label: 'Maior Valor Final', valor: formatarMoeda(Math.max(...comparacoes.map(c => c.valorFinal))) }
        ]
    };

    switch (formato) {
        case 'csv':
            exportarCSV(dados);
            break;
        case 'excel':
            exportarExcel(dados);
            break;
        case 'pdf':
            exportarPDF(dados);
            break;
    }
}

// Exportar histórico de simulações
export function exportarHistorico(
    historico: Array<{
        id: string;
        data: Date;
        simulacao: SimulacaoInput;
        resultado: ResultadoSimulacao;
    }>,
    formato: ExportFormat
): void {
    const dados: DadosExportacao = {
        titulo: 'Histórico de Simulações',
        subtitulo: `${historico.length} simulações realizadas`,
        colunas: [
            { key: 'data', header: 'Data', format: 'texto' },
            { key: 'valorInicial', header: 'Valor Inicial', format: 'moeda' },
            { key: 'valorMensal', header: 'Aporte Mensal', format: 'moeda' },
            { key: 'periodo', header: 'Período (meses)', format: 'numero' },
            { key: 'valorFinal', header: 'Valor Final', format: 'moeda' },
            { key: 'totalJuros', header: 'Total Juros', format: 'moeda' },
            { key: 'rentabilidade', header: 'Rentabilidade', format: 'percentual' }
        ],
        dados: historico.map(item => ({
            data: new Date(item.data).toLocaleDateString('pt-BR'),
            valorInicial: item.simulacao.valorInicial,
            valorMensal: item.simulacao.valorMensal,
            periodo: item.simulacao.periodo,
            valorFinal: item.resultado.valorFinal,
            totalJuros: item.resultado.totalJuros,
            rentabilidade: item.resultado.rentabilidadeTotal
        }))
    };

    switch (formato) {
        case 'csv':
            exportarCSV(dados);
            break;
        case 'excel':
            exportarExcel(dados);
            break;
        case 'pdf':
            exportarPDF(dados);
            break;
    }
}

// Exportar metas financeiras
export function exportarMetas(
    metas: Array<{
        nome: string;
        valorObjetivo: number;
        valorAtual: number;
        dataObjetivo: string | Date;
        categoria: string;
    }>,
    formato: ExportFormat
): void {
    const dados: DadosExportacao = {
        titulo: 'Metas Financeiras',
        subtitulo: `${metas.length} metas cadastradas`,
        colunas: [
            { key: 'nome', header: 'Nome da Meta', format: 'texto' },
            { key: 'categoria', header: 'Categoria', format: 'texto' },
            { key: 'valorObjetivo', header: 'Valor Objetivo', format: 'moeda' },
            { key: 'valorAtual', header: 'Valor Atual', format: 'moeda' },
            { key: 'progresso', header: 'Progresso (%)', format: 'percentual' },
            { key: 'dataObjetivo', header: 'Data Objetivo', format: 'texto' }
        ],
        dados: metas.map(meta => ({
            ...meta,
            progresso: meta.valorObjetivo > 0 ? (meta.valorAtual / meta.valorObjetivo) * 100 : 0,
            dataObjetivo: new Date(meta.dataObjetivo).toLocaleDateString('pt-BR')
        })),
        resumo: [
            { label: 'Total de Metas', valor: String(metas.length) },
            { label: 'Valor Total Objetivos', valor: formatarMoeda(metas.reduce((sum, m) => sum + m.valorObjetivo, 0)) },
            { label: 'Valor Total Atual', valor: formatarMoeda(metas.reduce((sum, m) => sum + m.valorAtual, 0)) }
        ]
    };

    switch (formato) {
        case 'csv':
            exportarCSV(dados);
            break;
        case 'excel':
            exportarExcel(dados);
            break;
        case 'pdf':
            exportarPDF(dados);
            break;
    }
}

// Exportar relatório completo
export function exportarRelatorioCompleto(
    simulacao: SimulacaoInput,
    resultado: ResultadoSimulacao,
    formato: ExportFormat
): void {
    const dados: DadosExportacao = {
        titulo: 'Relatório Completo de Investimento',
        subtitulo: 'Análise detalhada da simulação',
        colunas: [
            { key: 'indicador', header: 'Indicador', format: 'texto' },
            { key: 'valor', header: 'Valor', format: 'texto' }
        ],
        dados: [
            { indicador: 'Valor Inicial', valor: formatarMoeda(simulacao.valorInicial) },
            { indicador: 'Aporte Mensal', valor: formatarMoeda(simulacao.valorMensal) },
            { indicador: 'Período', valor: `${simulacao.periodo} meses` },
            { indicador: 'Total Investido', valor: formatarMoeda(resultado.totalInvestido) },
            { indicador: 'Total de Juros', valor: formatarMoeda(resultado.totalJuros) },
            { indicador: 'Valor Final Bruto', valor: formatarMoeda(resultado.valorFinal) },
            { indicador: 'Rentabilidade Total', valor: formatarPercentual(resultado.rentabilidadeTotal) },
            { indicador: 'Taxa Efetiva Mensal', valor: formatarPercentual(resultado.taxaEfetivaMensal) },
            { indicador: 'Taxa Efetiva Diária', valor: formatarPercentual(resultado.taxaEfetivaDiaria) },
            { indicador: 'Ganho Mensal Estimado', valor: formatarMoeda(resultado.ganhoMensal) },
            { indicador: 'Ganho Diário Estimado', valor: formatarMoeda(resultado.ganhoDiario) },
            { indicador: 'Ganho Anual Estimado', valor: formatarMoeda(resultado.ganhoAnual) }
        ]
    };

    switch (formato) {
        case 'csv':
            exportarCSV(dados);
            break;
        case 'excel':
            exportarExcel(dados);
            break;
        case 'pdf':
            exportarPDF(dados);
            break;
    }
}
