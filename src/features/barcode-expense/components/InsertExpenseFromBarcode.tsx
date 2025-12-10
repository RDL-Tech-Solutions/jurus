/**
 * Modal de Inserção de Despesa via Código de Barras
 */

import React, { useState } from 'react';
import { Check, X, Download } from 'lucide-react';
import { BarcodeData, ExpenseFromBarcode, PaymentMethod } from '../types';
import { useBarcodeExpense } from '../hooks/useBarcodeExpense';
import { cn } from '../../../utils/cn';

interface InsertExpenseFromBarcodeProps {
  barcodeData: BarcodeData;
  onConfirm: () => void;
  onCancel: () => void;
}

export const InsertExpenseFromBarcode: React.FC<InsertExpenseFromBarcodeProps> = ({
  barcodeData,
  onConfirm,
  onCancel
}) => {
  const { createExpenseFromBarcode, exportComprovante } = useBarcodeExpense();
  
  const [expense, setExpense] = useState<ExpenseFromBarcode>({
    descricao: barcodeData.parsed.descricao || '',
    valor: barcodeData.parsed.valor || 0,
    data: barcodeData.parsed.data || new Date().toISOString().split('T')[0],
    categoriaId: barcodeData.parsed.categoria || 'outros',
    formaPagamento: 'dinheiro',
    recorrente: false,
    barcodeData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!expense.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (expense.valor <= 0) {
      newErrors.valor = 'Valor deve ser maior que zero';
    }

    if (!expense.data) {
      newErrors.data = 'Data é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await createExpenseFromBarcode(expense);
      onConfirm();
    } catch (error) {
      console.error('Erro ao criar despesa:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Confirmar Despesa
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Tipo: <span className="font-semibold uppercase">{barcodeData.type}</span>
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição *
            </label>
            <input
              type="text"
              value={expense.descricao}
              onChange={(e) => setExpense({ ...expense, descricao: e.target.value })}
              className={cn(
                'w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                errors.descricao ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              )}
              placeholder="Ex: Conta de luz, Supermercado..."
            />
            {errors.descricao && (
              <p className="text-xs text-red-500 mt-1">{errors.descricao}</p>
            )}
          </div>

          {/* Valor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valor *
            </label>
            <input
              type="number"
              step="0.01"
              value={expense.valor || ''}
              onChange={(e) => setExpense({ ...expense, valor: parseFloat(e.target.value) || 0 })}
              className={cn(
                'w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                errors.valor ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              )}
              placeholder="0.00"
            />
            {errors.valor && (
              <p className="text-xs text-red-500 mt-1">{errors.valor}</p>
            )}
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data *
            </label>
            <input
              type="date"
              value={expense.data}
              onChange={(e) => setExpense({ ...expense, data: e.target.value })}
              className={cn(
                'w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                errors.data ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              )}
            />
            {errors.data && (
              <p className="text-xs text-red-500 mt-1">{errors.data}</p>
            )}
          </div>

          {/* Forma de Pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Forma de Pagamento *
            </label>
            <select
              value={expense.formaPagamento}
              onChange={(e) => setExpense({ ...expense, formaPagamento: e.target.value as PaymentMethod })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="dinheiro">💵 Dinheiro</option>
              <option value="debito">💳 Débito</option>
              <option value="credito">💳 Crédito</option>
              <option value="pix">📱 PIX</option>
              <option value="boleto">📄 Boleto</option>
            </select>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Observações
            </label>
            <textarea
              value={expense.observacoes || ''}
              onChange={(e) => setExpense({ ...expense, observacoes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
              placeholder="Informações adicionais..."
            />
          </div>

          {/* Recorrente */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="recorrente"
              checked={expense.recorrente}
              onChange={(e) => setExpense({ ...expense, recorrente: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600"
            />
            <label htmlFor="recorrente" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Despesa recorrente (mensal)
            </label>
          </div>

          {/* Info do código */}
          {barcodeData.parsed.linhaDigitavel && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Linha Digitável:
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 font-mono">
                {barcodeData.parsed.linhaDigitavel}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={() => exportComprovante(expense)}
            className="px-4 py-2 border-2 border-green-300 dark:border-green-600 rounded-lg text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors font-medium flex items-center gap-2"
            title="Exportar comprovante JSON"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Confirmar e Criar Despesa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
