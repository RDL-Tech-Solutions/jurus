import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Palette, Settings, Download, Upload } from 'lucide-react';

interface SistemaTemasProps {
  onClose: () => void;
}

const SistemaTemas: React.FC<SistemaTemasProps> = ({ onClose }) => {
  const [abaSelecionada, setAbaSelecionada] = useState<'galeria' | 'editor' | 'configuracoes' | 'importar'>('galeria');

  const renderConteudo = () => {
    switch (abaSelecionada) {
      case 'galeria':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Galeria de Temas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Tema Padrão */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded mb-3"></div>
                <h4 className="font-medium">Tema Padrão</h4>
                <p className="text-sm text-gray-600">Tema padrão do sistema</p>
              </div>
              
              {/* Tema Escuro */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="h-20 bg-gradient-to-r from-gray-800 to-gray-900 rounded mb-3"></div>
                <h4 className="font-medium">Modo Escuro</h4>
                <p className="text-sm text-gray-600">Tema escuro elegante</p>
              </div>
              
              {/* Tema Oceano */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded mb-3"></div>
                <h4 className="font-medium">Oceano</h4>
                <p className="text-sm text-gray-600">Inspirado no oceano</p>
              </div>
            </div>
          </div>
        );
      
      case 'editor':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Editor de Temas</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Cor Primária</label>
                <input type="color" className="w-full h-10 rounded border" placeholder="Selecione a cor primária" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cor Secundária</label>
                <input type="color" className="w-full h-10 rounded border" placeholder="Selecione a cor secundária" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cor de Fundo</label>
                <input type="color" className="w-full h-10 rounded border" placeholder="Selecione a cor de fundo" />
              </div>
            </div>
          </div>
        );
      
      case 'configuracoes':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Configurações</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Modo escuro automático</span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span>Transições suaves</span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span>Salvar preferências</span>
                <input type="checkbox" className="rounded" />
              </div>
            </div>
          </div>
        );
      
      case 'importar':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Importar/Exportar</h3>
            <div className="space-y-4">
              <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                <Upload className="mx-auto mb-2" size={24} />
                <span>Importar Tema</span>
              </button>
              <button className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <Download className="mx-auto mb-2" size={24} />
                <span>Exportar Tema Atual</span>
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Palette className="text-blue-500" size={24} />
            Sistema de Temas Avançado
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b">
          {[
            { id: 'galeria', label: 'Galeria', icon: Palette },
            { id: 'editor', label: 'Editor', icon: Settings },
            { id: 'configuracoes', label: 'Configurações', icon: Settings },
            { id: 'importar', label: 'Import/Export', icon: Download }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setAbaSelecionada(id as any)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                abaSelecionada === id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          {renderConteudo()}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Aplicar Tema
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SistemaTemas;