/**
 * Card para Inserir Despesa por Código de Barras
 */

import React, { memo, useState } from 'react';
import { Camera, Upload, Keyboard } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface CardInserirPorCodigoProps {
  onScanClick?: () => void;
  onUploadClick?: () => void;
  onManualClick?: () => void;
}

export const CardInserirPorCodigo: React.FC<CardInserirPorCodigoProps> = memo(({
  onScanClick,
  onUploadClick,
  onManualClick
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        📷 Inserir por Código
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Escanear */}
        <button
          onClick={onScanClick}
          className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all group"
        >
          <Camera className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            Escanear
          </span>
          <span className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Câmera
          </span>
        </button>

        {/* Upload */}
        <button
          onClick={onUploadClick}
          className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all group"
        >
          <Upload className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
            Upload
          </span>
          <span className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            Foto/Imagem
          </span>
        </button>

        {/* Manual */}
        <button
          onClick={onManualClick}
          className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
        >
          <Keyboard className="w-8 h-8 text-gray-600 dark:text-gray-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Digitar
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Manualmente
          </span>
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
        Suporta: Boletos, PIX, NFC-e, Códigos de Barras
      </p>
    </div>
  );
});

CardInserirPorCodigo.displayName = 'CardInserirPorCodigo';
