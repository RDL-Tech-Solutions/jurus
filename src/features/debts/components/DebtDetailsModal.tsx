/**
 * Modal de Detalhes e Edição de Dívida
 */

import React, { memo, useState } from 'react';
import { X, Edit2, Trash2, Check, Calendar, DollarSign, FileText, AlertCircle } from 'lucide-react';
import { DebtWithStatus } from '../types';
import { formatCurrency, formatDate, getDaysUntilDue } from '../utils/debtHelpers';

interface DebtDetailsModalProps {
  debt: DebtWithStatus | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (debtId: string) => void;
  onDelete: (debtId: string) => void;
  onMarkAsPaid: (debtId: string) => void;
}

export const DebtDetailsModal: React.FC<DebtDetailsModalProps> = memo(({
  debt,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onMarkAsPaid
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !debt) return null;

  const daysUntilDue = getDaysUntilDue(debt.dataVencimento || '');
  const isOverdue = daysUntilDue < 0;
  const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 7;

  const getStatusColor = () => {
    if (isOverdue) return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
    if (isDueSoon) return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
    return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
  };

  const getStatusText = () => {
    if (isOverdue) return `Atrasada (${Math.abs(daysUntilDue)} dias)`;
    if (daysUntilDue === 0) return 'Vence hoje';
    if (daysUntilDue === 1) return 'Vence amanhã';
    if (isDueSoon) return `Vence em ${daysUntilDue} dias`;
    return `Vence em ${daysUntilDue} dias`;
  };

  const handleDelete = () => {
    onDelete(debt.id);
    onClose();
  };

  const handleMarkAsPaid = () => {
    onMarkAsPaid(debt.id);
    onClose();
  };

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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Detalhes da Dívida
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* Status Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor()}`}>
              <AlertCircle className="w-4 h-4" />
              {getStatusText()}
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Descrição
              </label>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {debt.descricao}
              </p>
            </div>

            {/* Valor */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Valor
              </label>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(debt.valor)}
              </p>
            </div>

            {/* Data de Vencimento */}
            {debt.dataVencimento && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Data de Vencimento
                </label>
                <p className="text-lg text-gray-900 dark:text-white">
                  {formatDate(debt.dataVencimento)}
                </p>
              </div>
            )}

            {/* Parcelas */}
            {debt.numeroParcelas && debt.numeroParcelas > 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Parcelas
                </label>
                <div className="flex items-center gap-4">
                  <p className="text-lg text-gray-900 dark:text-white">
                    {debt.parcelaAtual} de {debt.numeroParcelas}
                  </p>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${((debt.parcelaAtual || 1) / debt.numeroParcelas) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Credor */}
            {debt.credor && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Credor
                </label>
                <p className="text-lg text-gray-900 dark:text-white">
                  {debt.credor}
                </p>
              </div>
            )}

            {/* Observações */}
            {debt.observacoes && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Observações
                </label>
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  {debt.observacoes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Ações */}
        {!showDeleteConfirm ? (
          <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Excluir</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onEdit(debt.id);
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Editar</span>
              </button>
              <button
                onClick={handleMarkAsPaid}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-medium"
              >
                <Check className="w-4 h-4" />
                <span>Marcar como Paga</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
            <p className="text-sm text-red-900 dark:text-red-100 mb-4 font-medium">
              Tem certeza que deseja excluir esta dívida?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

DebtDetailsModal.displayName = 'DebtDetailsModal';
