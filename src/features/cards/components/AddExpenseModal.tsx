/**
 * Modal de Adicionar Gasto ao Cartão
 */

import React, { memo, useState, useEffect } from 'react';
import { X, DollarSign, FileText, Calendar, Hash, AlertCircle } from 'lucide-react';
import { useModal } from '../../../hooks/useModal';

interface AddExpenseModalProps {
  cardId: string | null;
  cardName: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: ExpenseData) => void;
}

export interface ExpenseData {
  cartaoId: string;
  descricao: string;
  valor: number;
  data: string;
  parcelas: number;
  categoria?: string;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = memo(({
  cardId,
  cardName,
  isOpen,
  onClose,
  onSave
}) => {
  useModal(isOpen);

  const [dados, setDados] = useState<ExpenseData>({
    cartaoId: cardId || '',
    descricao: '',
    valor: 0,
    data: new Date().toISOString().split('T')[0],
    parcelas: 1,
    categoria: ''
  });

  const [erros, setErros] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cardId) {
      setDados(prev => ({ ...prev, cartaoId: cardId }));
    }
  }, [cardId]);

  useEffect(() => {
    if (isOpen) {
      setDados({
        cartaoId: cardId || '',
        descricao: '',
        valor: 0,
        data: new Date().toISOString().split('T')[0],
        parcelas: 1,
        categoria: ''
      });
      setErros({});
    }
  }, [isOpen, cardId]);

  const validar = (): boolean => {
    const novosErros: Record<string, string> = {};

    if (!dados.descricao.trim()) {
      novosErros.descricao = 'Descrição é obrigatória';
    }

    if (dados.valor <= 0) {
      novosErros.valor = 'Valor deve ser maior que zero';
    }

    if (!dados.data) {
      novosErros.data = 'Data é obrigatória';
    }

    if (dados.parcelas < 1 || dados.parcelas > 48) {
      novosErros.parcelas = 'Parcelas devem estar entre 1 e 48';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = () => {
    if (validar()) {
      onSave(dados);
      onClose();
    }
  };

  const valorParcela = dados.parcelas > 0 ? dados.valor / dados.parcelas : 0;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-blue-600" />
              Adicionar Gasto
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {cardName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-4">
            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Descrição *
              </label>
              <input
                type="text"
                value={dados.descricao}
                onChange={(e) => setDados({ ...dados, descricao: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  erros.descricao ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Ex: Compra no supermercado"
              />
              {erros.descricao && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {erros.descricao}
                </p>
              )}
            </div>

            {/* Valor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Valor Total *
              </label>
              <input
                type="number"
                step="0.01"
                value={dados.valor || ''}
                onChange={(e) => setDados({ ...dados, valor: parseFloat(e.target.value) || 0 })}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  erros.valor ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="0.00"
              />
              {erros.valor && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {erros.valor}
                </p>
              )}
            </div>

            {/* Data */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Data da Compra *
              </label>
              <input
                type="date"
                value={dados.data}
                onChange={(e) => setDados({ ...dados, data: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  erros.data ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {erros.data && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {erros.data}
                </p>
              )}
            </div>

            {/* Parcelas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                Número de Parcelas
              </label>
              <input
                type="number"
                min="1"
                max="48"
                value={dados.parcelas}
                onChange={(e) => setDados({ ...dados, parcelas: parseInt(e.target.value) || 1 })}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  erros.parcelas ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {erros.parcelas && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {erros.parcelas}
                </p>
              )}
            </div>

            {/* Preview do Parcelamento */}
            {dados.parcelas > 1 && dados.valor > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  💡 Valor Parcelado
                </p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {dados.parcelas}x de R$ {valorParcela.toFixed(2)}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Total: R$ {dados.valor.toFixed(2)}
                </p>
              </div>
            )}

            {/* Categoria (opcional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoria (opcional)
              </label>
              <input
                type="text"
                value={dados.categoria}
                onChange={(e) => setDados({ ...dados, categoria: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Ex: Alimentação, Transporte..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
          >
            Adicionar Gasto
          </button>
        </div>
      </div>
    </div>
  );
});

AddExpenseModal.displayName = 'AddExpenseModal';
