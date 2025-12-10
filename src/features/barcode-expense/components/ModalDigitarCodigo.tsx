/**
 * Modal para Digitação Manual de Código
 */

import React, { useState } from 'react';
import { Keyboard, X, Check } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface ModalDigitarCodigoProps {
  onSubmit: (code: string) => void;
  onCancel: () => void;
}

export const ModalDigitarCodigo: React.FC<ModalDigitarCodigoProps> = ({
  onSubmit,
  onCancel
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!code.trim()) {
      setError('Digite um código válido');
      return;
    }

    if (code.length < 10) {
      setError('Código muito curto');
      return;
    }

    onSubmit(code);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Keyboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Digitar Código
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Boleto, PIX, EAN ou NFC-e
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Código *
            </label>
            <textarea
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              className={cn(
                'w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm',
                error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              )}
              rows={4}
              placeholder="Cole ou digite o código aqui..."
              autoFocus
            />
            {error && (
              <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
          </div>

          {/* Dicas */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">
              💡 Dicas:
            </p>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Boleto: 47 ou 48 dígitos</li>
              <li>• PIX: Começa com 00020126 ou 00020101</li>
              <li>• Produto: 13 dígitos (EAN-13)</li>
              <li>• NFC-e: 44 dígitos ou URL</li>
            </ul>
          </div>

          {/* Info do código digitado */}
          {code.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Caracteres: <span className="font-semibold">{code.length}</span>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
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
            Processar Código
          </button>
        </div>
      </div>
    </div>
  );
};
