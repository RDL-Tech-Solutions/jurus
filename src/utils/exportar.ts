import { Transacao } from '../types/fluxoCaixa';
import { formatarMoeda } from './calculos';

interface EstatisticasExport {
    totalEntradas: number;
    totalSaidas: number;
    saldo: number;
    periodo: string;
}

export function exportarCSV(
    transacoes: Transacao[],
    estatisticas: EstatisticasExport,
    nomeArquivo: string = 'fluxo-caixa.csv'
) {
    // Cabeçalho
    const headers = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor'];

    // Dados
    const rows = transacoes.map(t => [
        new Date(t.data).toLocaleDateString('pt-BR'),
        t.descricao,
        t.categoriaId,
        t.tipo === 'entrada' ? 'Entrada' : 'Saída',
        t.valor.toFixed(2).replace('.', ',')
    ]);

    // Resumo
    const resumo = [
        [],
        ['RESUMO'],
        ['Total Entradas', estatisticas.totalEntradas.toFixed(2).replace('.', ',')],
        ['Total Saídas', estatisticas.totalSaidas.toFixed(2).replace('.', ',')],
        ['Saldo', estatisticas.saldo.toFixed(2).replace('.', ',')],
    ];

    // Combinar tudo
    const csvContent = [
        headers.join(';'),
        ...rows.map(row => row.join(';')),
        ...resumo.map(row => row.join(';'))
    ].join('\n');

    // Adicionar BOM para UTF-8
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

    // Download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nomeArquivo;
    link.click();
    URL.revokeObjectURL(link.href);
}

export function exportarJSON(
    transacoes: Transacao[],
    estatisticas: EstatisticasExport,
    nomeArquivo: string = 'fluxo-caixa.json'
) {
    const data = {
        exportadoEm: new Date().toISOString(),
        periodo: estatisticas.periodo,
        resumo: {
            totalEntradas: estatisticas.totalEntradas,
            totalSaidas: estatisticas.totalSaidas,
            saldo: estatisticas.saldo,
            totalTransacoes: transacoes.length
        },
        transacoes: transacoes
    };

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nomeArquivo;
    link.click();
    URL.revokeObjectURL(link.href);
}

export function gerarRelatorioPDF(
    transacoes: Transacao[],
    estatisticas: EstatisticasExport
): string {
    // Gera HTML para impressão/PDF
    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório - Fluxo de Caixa</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; }
    .header { margin-bottom: 30px; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; }
    .header h1 { color: #1e40af; font-size: 28px; margin-bottom: 10px; }
    .header .info { color: #666; font-size: 14px; }
    .resumo { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
    .resumo-card { padding: 20px; border-radius: 8px; border: 2px solid #e5e7eb; }
    .resumo-card.entradas { background: #dcfce7; border-color: #86efac; }
    .resumo-card.saidas { background: #fee2e2; border-color: #fca5a5; }
    .resumo-card.saldo { background: #dbeafe; border-color: #93c5fd; }
    .resumo-card .label { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px; }
    .resumo-card .valor { font-size: 24px; font-weight: bold; }
    .entradas .valor { color: #16a34a; }
    .saidas .valor { color: #dc2626; }
    .saldo .valor { color: #2563eb; }
    .transacoes { margin-top: 30px; }
    .transacoes h2 { font-size: 20px; margin-bottom: 15px; color: #1e40af; }
    table { width: 100%; border-collapse: collapse; }
    thead { background: #f3f4f6; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { font-weight: 600; color: #374151; font-size: 14px; }
    td { font-size: 13px; color: #4b5563; }
    .entrada { color: #16a34a; font-weight: 600; }
    .saida { color: #dc2626; font-weight: 600; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px; }
    @media print {
      body { padding: 20px; }
      .resumo { page-break-inside: avoid; }
      table { page-break-inside: auto; }
      tr { page-break-inside: avoid; page-break-after: auto; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📊 Relatório de Fluxo de Caixa</h1>
    <div class="info">
      <p>Período: <strong>${estatisticas.periodo}</strong></p>
      <p>Gerado em: <strong>${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</strong></p>
    </div>
  </div>
  
  <div class="resumo">
    <div class="resumo-card entradas">
      <div class="label">Total Entradas</div>
      <div class="valor">${formatarMoeda(estatisticas.totalEntradas)}</div>
    </div>
    <div class="resumo-card saidas">
      <div class="label">Total Saídas</div>
      <div class="valor">${formatarMoeda(estatisticas.totalSaidas)}</div>
    </div>
    <div class="resumo-card saldo">
      <div class="label">Saldo</div>
      <div class="valor">${formatarMoeda(estatisticas.saldo)}</div>
    </div>
  </div>
  
  <div class="transacoes">
    <h2>Transações (${transacoes.length})</h2>
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Descrição</th>
          <th>Categoria</th>
          <th>Tipo</th>
          <th style="text-align: right;">Valor</th>
        </tr>
      </thead>
      <tbody>
        ${transacoes.map(t => `
          <tr>
            <td>${new Date(t.data).toLocaleDateString('pt-BR')}</td>
            <td>${t.descricao}</td>
            <td>${t.categoriaId}</td>
            <td>${t.tipo === 'entrada' ? 'Entrada' : 'Saída'}</td>
            <td class="${t.tipo}" style="text-align: right;">
              ${t.tipo === 'entrada' ? '+' : '-'}${formatarMoeda(t.valor)}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  
  <div class="footer">
    <p>Relatório gerado automaticamente pelo sistema de Fluxo de Caixa</p>
  </div>
</body>
</html>
  `;

    return html;
}

export function imprimirPDF(
    transacoes: Transacao[],
    estatisticas: EstatisticasExport
) {
    const html = gerarRelatorioPDF(transacoes, estatisticas);
    const printWindow = window.open('', '_blank');

    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();

        // Aguardar o carregamento e imprimir
        printWindow.onload = () => {
            printWindow.print();
        };
    }
}
