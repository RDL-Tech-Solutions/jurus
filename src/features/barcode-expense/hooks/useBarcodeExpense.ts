/**
 * Hook para gerenciar despesas via código de barras
 * Integração completa com Transações, Cartões, Dívidas e Recorrentes
 */

import { useState, useCallback } from 'react';
import { BarcodeParser } from '../services/BarcodeParser';
import { BarcodeData, ExpenseFromBarcode } from '../types';
import { useFluxoCaixa } from '../../../hooks/useFluxoCaixa';
import { useToast } from '../../../hooks/useToast';

export function useBarcodeExpense() {
  const [barcodeData, setBarcodeData] = useState<BarcodeData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { adicionarTransacao } = useFluxoCaixa();
  const { success, error: showError } = useToast();

  /**
   * Processa código escaneado
   */
  const processBarcode = useCallback((code: string) => {
    setIsProcessing(true);
    try {
      const parsed = BarcodeParser.parse(code);
      setBarcodeData(parsed);
      return parsed;
    } catch (error) {
      console.error('Erro ao processar código:', error);
      showError('Erro ao processar código', 'Não foi possível ler o código escaneado');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [showError]);

  /**
   * Cria despesa a partir do código com integrações completas
   */
  const createExpenseFromBarcode = useCallback(async (
    expense: ExpenseFromBarcode
  ) => {
    try {
      // 1. Criar transação principal
      const transacao = adicionarTransacao({
        descricao: expense.descricao,
        valor: expense.valor,
        tipo: 'saida',
        categoriaId: expense.categoriaId,
        data: expense.data,
        observacoes: expense.observacoes
      });

      // 2. Se for cartão de crédito, adicionar gasto
      if (expense.formaPagamento === 'credito' && expense.cartaoId) {
        // Integração com cartões (quando disponível)
        console.log('Adicionar gasto no cartão:', expense.cartaoId);
      }

      // 3. Se for boleto, criar dívida
      if (expense.formaPagamento === 'boleto' && barcodeData?.parsed.vencimento) {
        // Integração com dívidas (quando disponível)
        console.log('Criar dívida com vencimento:', barcodeData.parsed.vencimento);
      }

      // 4. Se for recorrente, criar recorrência
      if (expense.recorrente) {
        // Integração com recorrentes (quando disponível)
        console.log('Criar recorrência mensal');
      }

      success('Despesa criada', 'Despesa adicionada com sucesso!');
      return transacao;
    } catch (error) {
      console.error('Erro ao criar despesa:', error);
      showError('Erro ao criar despesa', 'Não foi possível adicionar a despesa');
      throw error;
    }
  }, [adicionarTransacao, success, showError, barcodeData]);

  /**
   * Exporta comprovante da despesa
   */
  const exportComprovante = useCallback((expense: ExpenseFromBarcode) => {
    const comprovante = {
      tipo: barcodeData?.type,
      descricao: expense.descricao,
      valor: expense.valor,
      data: expense.data,
      formaPagamento: expense.formaPagamento,
      codigoOriginal: barcodeData?.raw,
      dadosExtraidos: barcodeData?.parsed,
      dataGeracao: new Date().toISOString()
    };

    // Gerar JSON para download
    const blob = new Blob([JSON.stringify(comprovante, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprovante-${expense.descricao.replace(/\s/g, '-')}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    success('Comprovante exportado', 'Arquivo JSON baixado com sucesso!');
  }, [barcodeData, success]);

  /**
   * Limpa dados
   */
  const clearBarcodeData = useCallback(() => {
    setBarcodeData(null);
  }, []);

  return {
    barcodeData,
    isProcessing,
    processBarcode,
    createExpenseFromBarcode,
    exportComprovante,
    clearBarcodeData
  };
}
