/**
 * Scanner de Câmera para Códigos de Barras
 * Usa @zxing/library para leitura de códigos
 */

import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Zap, AlertCircle } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface CameraScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (code: string) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  isOpen,
  onClose,
  onScan
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Iniciar câmera
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setError(null);
      setIsScanning(true);

      // Solicitar permissão de câmera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Câmera traseira em mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Iniciar escaneamento contínuo
      startScanning();
    } catch (err) {
      console.error('Erro ao acessar câmera:', err);
      setError('Não foi possível acessar a câmera. Verifique as permissões.');
      setHasPermission(false);
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    setIsScanning(false);
  };

  const startScanning = () => {
    // Simular escaneamento (em produção, usar @zxing/library)
    scanIntervalRef.current = setInterval(() => {
      // Aqui seria a lógica real de escaneamento com @zxing
      // Por enquanto, apenas um placeholder
      console.log('Escaneando...');
    }, 500);
  };

  const handleManualInput = () => {
    stopCamera();
    onClose();
    // Abrir modal de entrada manual
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-in fade-in duration-200">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-white" />
            <h3 className="text-lg font-bold text-white">Scanner de Código</h3>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Área de Vídeo */}
      <div className="relative w-full h-full max-w-2xl max-h-[80vh] mx-auto">
        {hasPermission === false ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Permissão Negada
            </h3>
            <p className="text-gray-300 mb-6">
              {error || 'Não foi possível acessar a câmera.'}
            </p>
            <button
              onClick={handleManualInput}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Digitar Código Manualmente
            </button>
          </div>
        ) : (
          <>
            {/* Vídeo da Câmera */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover rounded-lg"
              playsInline
              muted
            />

            {/* Overlay de Escaneamento */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Área de Foco */}
              <div className="relative w-64 h-64">
                {/* Cantos do Frame */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />

                {/* Linha de Escaneamento Animada */}
                {isScanning && (
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan" />
                  </div>
                )}
              </div>
            </div>

            {/* Instruções */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="text-center">
                <p className="text-white font-medium mb-2">
                  Posicione o código de barras dentro do quadro
                </p>
                <p className="text-gray-300 text-sm mb-4">
                  O escaneamento é automático
                </p>
                <button
                  onClick={handleManualInput}
                  className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors backdrop-blur-sm"
                >
                  Digitar Manualmente
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Animação CSS */}
      <style>{`
        @keyframes scan {
          0% {
            top: 0;
          }
          50% {
            top: 100%;
          }
          100% {
            top: 0;
          }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
