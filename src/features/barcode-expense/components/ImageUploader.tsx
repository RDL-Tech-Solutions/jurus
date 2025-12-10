/**
 * Upload de Imagem para Leitura de Código de Barras
 * Permite upload de foto ou screenshot
 */

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, FileImage, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface ImageUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (code: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  isOpen,
  onClose,
  onScan
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Simular processamento (em produção, usar @zxing/library ou Tesseract.js)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Código de exemplo detectado (em produção, seria o resultado real)
      const detectedCode = '34191790010104351004791020150008291070026000';
      
      setSuccess(true);
      
      // Aguardar um pouco para mostrar o sucesso
      setTimeout(() => {
        onScan(detectedCode);
        handleClose();
      }, 1000);
    } catch (err) {
      console.error('Erro ao processar imagem:', err);
      setError('Não foi possível detectar o código de barras na imagem');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    
    if (file && file.type.startsWith('image/')) {
      // Processar arquivo diretamente
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem válida');
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB');
      return;
    }

    setError(null);

    // Ler arquivo
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setSelectedImage(imageData);
      processImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleClose = () => {
    setSelectedImage(null);
    setError(null);
    setSuccess(false);
    setIsProcessing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Upload de Imagem
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Envie uma foto do código de barras
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {!selectedImage ? (
            /* Área de Upload */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all',
                'hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10',
                error
                  ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10'
                  : 'border-gray-300 dark:border-gray-600'
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>

                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Clique para selecionar ou arraste a imagem
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    PNG, JPG ou JPEG até 5MB
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}

                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <FileImage className="w-5 h-5" />
                    <span className="text-sm">Foto do celular</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-sm">Screenshot</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Preview e Processamento */
            <div className="space-y-6">
              {/* Imagem Preview */}
              <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-auto max-h-96 object-contain bg-gray-100 dark:bg-gray-900"
                />
                
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
                      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Processando imagem...
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Detectando código de barras
                      </p>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="absolute inset-0 bg-green-500/90 flex items-center justify-center">
                    <div className="text-center text-white">
                      <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg font-bold">Código Detectado!</p>
                      <p className="text-sm opacity-90 mt-1">Processando despesa...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Ações */}
              {!isProcessing && !success && (
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setError(null);
                    }}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Escolher Outra Imagem
                  </button>

                  <button
                    onClick={() => processImage(selectedImage)}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                  >
                    Processar Novamente
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Dicas */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              💡 Dicas para melhor leitura:
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Certifique-se de que o código está nítido e bem iluminado</li>
              <li>• Evite reflexos ou sombras sobre o código</li>
              <li>• Mantenha a câmera paralela ao código</li>
              <li>• Capture todo o código de barras na foto</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
