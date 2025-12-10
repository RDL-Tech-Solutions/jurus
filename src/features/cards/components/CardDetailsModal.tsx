/**
 * Modal de Detalhes e Gerenciamento de Cartão
 */

import React, { memo, useState } from 'react';
import { X, Edit2, Trash2, CreditCard, DollarSign, Calendar, TrendingUp, AlertTriangle, Plus } from 'lucide-react';
import { CardWithStats } from '../types';
import { formatCurrency, getBrandInfo, getLimitStatusColor } from '../utils/cardHelpers';

interface CardDetailsModalProps {
  card: CardWithStats | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (cardId: string) => void;
  onDelete: (cardId: string) => void;
  onAddExpense: (cardId: string) => void;
}

export const CardDetailsModal: React.FC<CardDetailsModalProps> = memo(({
  card,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onAddExpense
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !card) return null;

  const brandInfo = getBrandInfo(card.bandeira);
  const limitStatus = card.percentualUtilizado >= 90 ? 'critical' : card.percentualUtilizado >= 70 ? 'warning' : 'healthy';
  const statusColor = getLimitStatusColor(limitStatus);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-600" />
            Detalhes do Cartão
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
            {/* Card Visual */}
            <div
              className="h-48 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg"
              style={{ background: `linear-gradient(135deg, ${card.cor} 0%, ${card.cor}dd 100%)` }}
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
              </div>
              <div className="relative h-full flex flex-col justify-between">
                <div>
                  <p className="text-sm opacity-80">Cartão de Crédito</p>
                  <h3 className="text-2xl font-bold mt-2">{card.nome}</h3>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs opacity-70">Limite Disponível</p>
                    <p className="text-xl font-bold">{formatCurrency(card.limiteDisponivel)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-80">{brandInfo.name}</p>
                    <p className="text-xs opacity-70">Fecha: {card.diaFechamento} | Vence: {card.diaVencimento}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações do Limite */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Limite Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(card.limite)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Limite Usado</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(card.limiteUtilizado)}
                </p>
              </div>
            </div>

            {/* Barra de Uso do Limite */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Utilização do Limite
                </span>
                <span className={`text-sm font-bold ${statusColor.text}`}>
                  {card.percentualUtilizado.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${statusColor.bar}`}
                  style={{ width: `${Math.min(100, card.percentualUtilizado)}%` }}
                />
              </div>
              {card.percentualUtilizado >= 80 && (
                <div className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  card.percentualUtilizado >= 90
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                }`}>
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {card.percentualUtilizado >= 90
                      ? 'Atenção! Limite quase esgotado'
                      : 'Cuidado com o limite'}
                  </span>
                </div>
              )}
            </div>

            {/* Fatura Atual */}
            {card.faturaAtual && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Fatura Atual
                  </h3>
                  <button
                    onClick={() => onAddExpense(card.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Adicionar Gasto
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Total da Fatura</p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      {formatCurrency(card.faturaAtual.total)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Número de Gastos</p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      {card.faturaAtual.gastos.length}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Informações Adicionais */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Dia de Fechamento
                </label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Dia {card.diaFechamento}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Dia de Vencimento
                </label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Dia {card.diaVencimento}
                </p>
              </div>
            </div>

            {/* Bandeira */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Bandeira
              </label>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{brandInfo.icon}</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {brandInfo.name}
                </span>
              </div>
            </div>
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
                  onEdit(card.id);
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Editar</span>
              </button>
              <button
                onClick={() => onAddExpense(card.id)}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Gasto</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
            <p className="text-sm text-red-900 dark:text-red-100 mb-4 font-medium">
              Tem certeza que deseja excluir este cartão? Todos os gastos associados também serão removidos.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDelete(card.id);
                  onClose();
                }}
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

CardDetailsModal.displayName = 'CardDetailsModal';
