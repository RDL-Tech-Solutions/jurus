/**
 * Componente principal da área de transações
 * Integra todos os subcomponentes e gerencia estado
 */

import React, { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useTransacoes } from '../hooks/useTransacoes';
import { SeletorMes } from './SeletorMes';
import { ResumoMensal } from './ResumoMensal';
import { ListaTransacoes } from './ListaTransacoes';
import { CardDividasPendentes } from './CardDividasPendentes';
import { CardCartoesCredito } from './CardCartoesCredito';
import { CardMetasMes } from './CardMetasMes';
import { CardRecorrentes } from './CardRecorrentes';
import { CardPrevisaoMes } from './CardPrevisaoMes';
import { CardEconomiaMensal } from './CardEconomiaMensal';
import {
  CardInserirPorCodigo,
  ModalDigitarCodigo,
  InsertExpenseFromBarcode,
  CameraScanner,
  ImageUploader
} from '../../barcode-expense/components';
import { useBarcodeExpense } from '../../barcode-expense/hooks/useBarcodeExpense';
import { ExportButton, ExportModal } from '../../export/components';
import { useExport } from '../../export/hooks/useExport';
import { TransacaoExpandida } from '../types';
import { NovaTransacao } from '../../../types/fluxoCaixa';

interface AreaTransacoesProps {
  onNovaTransacao: () => void;
  onEditarTransacao: (id: string, dados: Partial<NovaTransacao>) => void;
  onExcluirTransacao: (id: string, descricao: string) => void;
  onAdicionarMeta?: () => void;
  onEditarMeta?: (metaId: string) => void;
  onExcluirMeta?: (metaId: string) => void;
  onAdicionarRecorrente?: () => void;
  onEditarRecorrente?: (recorrenteId: string) => void;
  onExcluirRecorrente?: (recorrenteId: string) => void;
  onToggleRecorrente?: (recorrenteId: string) => void;
}

export const AreaTransacoes: React.FC<AreaTransacoesProps> = ({
  onNovaTransacao,
  onEditarTransacao,
  onExcluirTransacao,
  onAdicionarMeta,
  onEditarMeta,
  onExcluirMeta,
  onAdicionarRecorrente,
  onEditarRecorrente,
  onExcluirRecorrente,
  onToggleRecorrente
}) => {
  const {
    transacoesAgrupadasPorDia,
    somaReceitas,
    somaDespesas,
    saldoDoMes,
    nomeMesAtual,
    anoSelecionado,
    isMesAtual,
    irParaMesAnterior,
    irParaProximoMes,
    irParaHoje,
    obterCategoria
  } = useTransacoes();

  // Barcode Expense
  const {
    barcodeData,
    processBarcode,
    clearBarcodeData
  } = useBarcodeExpense();

  const [showModalDigitar, setShowModalDigitar] = useState(false);
  const [showModalConfirmar, setShowModalConfirmar] = useState(false);
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);

  // Export
  const { exportData, isExporting } = useExport();
  const [showExportModal, setShowExportModal] = useState(false);

  // Handlers
  const handleEditar = useCallback((transacao: TransacaoExpandida) => {
    // Só permite editar transações normais (não recorrentes/parceladas)
    if (transacao.isRecorrente || transacao.isParcelada) {
      return;
    }

    onEditarTransacao(transacao.id, {
      descricao: transacao.descricao,
      valor: transacao.valor,
      tipo: transacao.tipo,
      categoriaId: transacao.categoriaId,
      data: transacao.data.split('T')[0],
      observacoes: transacao.observacoes
    });
  }, [onEditarTransacao]);

  const handleExcluir = useCallback((transacao: TransacaoExpandida) => {
    onExcluirTransacao(transacao.id, transacao.descricao);
  }, [onExcluirTransacao]);

  // Handlers do Barcode
  const handleProcessCode = useCallback((code: string) => {
    processBarcode(code);
    setShowModalDigitar(false);
    setShowModalConfirmar(true);
  }, [processBarcode]);

  const handleConfirmExpense = useCallback(() => {
    setShowModalConfirmar(false);
    clearBarcodeData();
    // A despesa já foi criada pelo modal
  }, [clearBarcodeData]);

  const handleCancelExpense = useCallback(() => {
    setShowModalConfirmar(false);
    clearBarcodeData();
  }, [clearBarcodeData]);

  // Handler de exportação
  const handleExport = useCallback(async (config: any) => {
    await exportData('transacoes', transacoesAgrupadasPorDia, config.format, config);
  }, [exportData, transacoesAgrupadasPorDia]);

  return (
    <div className="space-y-4">
      {/* Header com Botões */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Transações
        </h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <ExportButton
            onClick={() => setShowExportModal(true)}
            label="Exportar"
            variant="outline"
            size="sm"
            loading={isExporting}
            className="flex-1 sm:flex-none"
          />
          <button
            onClick={onNovaTransacao}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex-1 sm:flex-none whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Nova Transação</span>
            <span className="xs:hidden">Nova</span>
          </button>
        </div>
      </div>

      {/* Modal de Exportação */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        reportType="transacoes"
        title="Exportar Transações"
      />

      {/* Seletor de Mês */}
      <SeletorMes
        nomeMes={nomeMesAtual}
        ano={anoSelecionado}
        isMesAtual={isMesAtual}
        onMesAnterior={irParaMesAnterior}
        onProximoMes={irParaProximoMes}
        onIrParaHoje={irParaHoje}
      />

      {/* Resumo Mensal */}
      <ResumoMensal
        totalReceitas={somaReceitas}
        totalDespesas={somaDespesas}
        saldo={saldoDoMes}
      />

      {/* Cards de Previsão e Economia */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CardPrevisaoMes />
        <CardEconomiaMensal />
      </div>

      {/* Cards Extras - Dívidas, Cartões, Metas e Recorrentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardDividasPendentes />
        <CardCartoesCredito />
        <CardMetasMes
          onAdicionarMeta={onAdicionarMeta}
          onEditarMeta={onEditarMeta}
          onExcluirMeta={onExcluirMeta}
        />
        <CardRecorrentes
          onAdicionarRecorrente={onAdicionarRecorrente}
          onEditarRecorrente={onEditarRecorrente}
          onExcluirRecorrente={onExcluirRecorrente}
          onToggleAtiva={onToggleRecorrente}
        />
      </div>

      {/* Card Inserir por Código */}
      <CardInserirPorCodigo
        onScanClick={() => setShowCameraScanner(true)}
        onUploadClick={() => setShowImageUploader(true)}
        onManualClick={() => setShowModalDigitar(true)}
      />

      {/* Scanner de Câmera */}
      <CameraScanner
        isOpen={showCameraScanner}
        onClose={() => setShowCameraScanner(false)}
        onScan={handleProcessCode}
      />

      {/* Upload de Imagem */}
      <ImageUploader
        isOpen={showImageUploader}
        onClose={() => setShowImageUploader(false)}
        onScan={handleProcessCode}
      />

      {/* Modal de Digitação */}
      {showModalDigitar && (
        <ModalDigitarCodigo
          onSubmit={handleProcessCode}
          onCancel={() => setShowModalDigitar(false)}
        />
      )}

      {/* Modal de Confirmação */}
      {barcodeData && showModalConfirmar && (
        <InsertExpenseFromBarcode
          barcodeData={barcodeData}
          onConfirm={handleConfirmExpense}
          onCancel={handleCancelExpense}
        />
      )}

      {/* Lista de Transações */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <ListaTransacoes
          transacoesAgrupadas={transacoesAgrupadasPorDia}
          obterCategoria={obterCategoria}
          onEditar={handleEditar}
          onExcluir={handleExcluir}
        />
      </div>
    </div>
  );
};
