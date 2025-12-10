/**
 * Modal de Criar/Editar Categoria - Design Moderno
 */

import React, { useState, useEffect } from 'react';
import { X, Check, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { CategoriaFluxo } from '../../../types/fluxoCaixa';
import { cn } from '../../../utils/cn';
import { useModal } from '../../../hooks/useModal';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<CategoriaFluxo, 'id'>) => void;
  initialCategory?: CategoriaFluxo;
}

const ICONS = [
  '💰', '💼', '📈', '🛒', '➕', '🏠', '🍽️', '🚗', '🏥', '📚',
  '🎉', '🛍️', '📄', '➖', '💳', '🎮', '🎬', '✈️', '🏋️', '💊',
  '🔧', '⚡', '💡', '📱', '💻', '🎵', '📺', '🍕', '☕', '🎨',
  '📖', '🏃', '🚴', '🏊', '⚽', '🎾', '🏀', '🎯', '🎲', '🎪',
  '🎭', '🎤', '🎧', '🎸', '🎹', '🎺', '🎻', '🥁', '🎼', '🎬'
];

const COLORS = [
  { name: 'Verde', value: '#10b981', light: '#d1fae5' },
  { name: 'Azul', value: '#3b82f6', light: '#dbeafe' },
  { name: 'Roxo', value: '#8b5cf6', light: '#ede9fe' },
  { name: 'Rosa', value: '#ec4899', light: '#fce7f3' },
  { name: 'Vermelho', value: '#ef4444', light: '#fee2e2' },
  { name: 'Laranja', value: '#f97316', light: '#ffedd5' },
  { name: 'Amarelo', value: '#eab308', light: '#fef3c7' },
  { name: 'Ciano', value: '#06b6d4', light: '#cffafe' },
  { name: 'Índigo', value: '#6366f1', light: '#e0e7ff' },
  { name: 'Esmeralda', value: '#059669', light: '#d1fae5' }
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCategory
}) => {
  const [data, setData] = useState<Omit<CategoriaFluxo, 'id'>>({
    nome: '',
    icone: '📁',
    cor: '#6b7280',
    tipo: 'saida'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useModal(isOpen);

  useEffect(() => {
    if (isOpen) {
      if (initialCategory) {
        setData({
          nome: initialCategory.nome,
          icone: initialCategory.icone,
          cor: initialCategory.cor,
          tipo: initialCategory.tipo
        });
      } else {
        setData({
          nome: '',
          icone: '📁',
          cor: '#6b7280',
          tipo: 'saida'
        });
      }
      setErrors({});
    }
  }, [isOpen, initialCategory]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.nome?.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    if (!data.icone) {
      newErrors.icone = 'Selecione um ícone';
    }
    if (!data.cor) {
      newErrors.cor = 'Selecione uma cor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(data);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {initialCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Personalize sua categoria
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Tipo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Tipo de Transação
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setData(prev => ({ ...prev, tipo: 'entrada' }))}
                  className={cn(
                    'flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all',
                    data.tipo === 'entrada'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 shadow-lg shadow-green-500/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700'
                  )}
                >
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">Entrada</span>
                </button>
                <button
                  type="button"
                  onClick={() => setData(prev => ({ ...prev, tipo: 'saida' }))}
                  className={cn(
                    'flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all',
                    data.tipo === 'saida'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 shadow-lg shadow-red-500/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700'
                  )}
                >
                  <TrendingDown className="w-5 h-5" />
                  <span className="font-semibold">Saída</span>
                </button>
              </div>
            </div>

            {/* Nome */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nome da Categoria *
              </label>
              <input
                type="text"
                value={data.nome}
                onChange={(e) => setData(prev => ({ ...prev, nome: e.target.value }))}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all',
                  errors.nome
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                )}
                placeholder="Ex: Academia, Streaming, Mercado..."
              />
              {errors.nome && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.nome}
                </p>
              )}
            </div>

            {/* Ícone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Escolha um Ícone *
              </label>
              <div className="grid grid-cols-10 gap-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto">
                {ICONS.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setData(prev => ({ ...prev, icone: icon }))}
                    className={cn(
                      'w-10 h-10 flex items-center justify-center text-2xl rounded-lg border-2 transition-all hover:scale-110',
                      data.icone === icon
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                    )}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              {errors.icone && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.icone}
                </p>
              )}
            </div>

            {/* Cor */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Escolha uma Cor *
              </label>
              <div className="grid grid-cols-5 gap-3">
                {COLORS.map(({ name, value, light }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setData(prev => ({ ...prev, cor: value }))}
                    className={cn(
                      'h-12 rounded-xl border-2 transition-all hover:scale-105 relative overflow-hidden',
                      data.cor === value
                        ? 'border-gray-900 dark:border-white scale-105 shadow-lg'
                        : 'border-gray-200 dark:border-gray-700'
                    )}
                    style={{ backgroundColor: value }}
                    title={name}
                  >
                    {data.cor === value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {errors.cor && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.cor}
                </p>
              )}
            </div>

            {/* Preview */}
            <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">
                ✨ Preview da Categoria
              </p>
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-lg"
                  style={{ 
                    backgroundColor: `${data.cor}20`,
                    border: `2px solid ${data.cor}40`
                  }}
                >
                  {data.icone}
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-900 dark:text-white">
                    {data.nome || 'Nome da categoria'}
                  </p>
                  <span
                    className="inline-block text-xs px-3 py-1 rounded-full font-medium mt-1"
                    style={{
                      backgroundColor: `${data.cor}20`,
                      color: data.cor
                    }}
                  >
                    {data.tipo === 'entrada' ? '📈 Entrada' : '📉 Saída'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg shadow-blue-500/30 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{initialCategory ? 'Salvar Alterações' : 'Criar Categoria'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
