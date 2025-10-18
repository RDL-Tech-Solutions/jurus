import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Eye, 
  Type, 
  MousePointer, 
  Volume2, 
  Palette, 
  Monitor,
  Sun,
  Moon,
  RotateCcw,
  Check,
  X,
  Accessibility,
  Keyboard,
  Focus
} from 'lucide-react';
import { useAccessibility } from '../hooks/useAccessibility';
import { useMicroInteractions } from '../hooks/useMicroInteractions';
import { Z_INDEX } from '../constants/zIndex';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  isOpen,
  onClose
}) => {
  const {
    settings,
    updateSetting,
    announce
  } = useAccessibility();

  const { playSound, triggerHaptic } = useMicroInteractions();

  const [activeSection, setActiveSection] = useState<string>('visual');

  const sections = [
    { id: 'visual', label: 'Visual', icon: Eye },
    { id: 'text', label: 'Texto', icon: Type },
    { id: 'interaction', label: 'Interação', icon: MousePointer },
    { id: 'audio', label: 'Áudio', icon: Volume2 }
  ];

  const handleSettingChange = (key: string, value: any) => {
    updateSetting(key as any, value);
    playSound(600, 80);
    triggerHaptic('light');
    announce(`${key} ${value ? 'ativado' : 'desativado'}`);
  };

  const handleReset = () => {
    // Reset manual das configurações
    updateSetting('highContrast', false);
    updateSetting('fontSize', 'medium');
    updateSetting('reducedMotion', false);
    updateSetting('screenReader', false);
    updateSetting('keyboardNavigation', false);
    updateSetting('focusIndicators', true);
    playSound(800, 100);
    triggerHaptic('medium');
    announce('Configurações de acessibilidade redefinidas');
  };

  const handleValidate = () => {
    // Validação simples
    const issues = [];
    if (!settings.focusIndicators) issues.push('Indicador de foco desabilitado');
    if (!settings.keyboardNavigation) issues.push('Navegação por teclado desabilitada');
    
    playSound(440, 150);
    announce(`${issues.length} problemas de acessibilidade encontrados`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            style={{ zIndex: Z_INDEX.ACCESSIBILITY_OVERLAY }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl overflow-hidden"
            style={{ zIndex: Z_INDEX.ACCESSIBILITY_OVERLAY }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Accessibility className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Acessibilidade
                </h2>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Fechar painel de acessibilidade"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Section Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {sections.map((section) => (
                <motion.button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    playSound(600, 80);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-pressed={activeSection === section.id}
                >
                  <section.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{section.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Visual Section */}
                  {activeSection === 'visual' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Configurações Visuais
                      </h3>

                      {/* High Contrast */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Alto Contraste
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Aumenta o contraste para melhor visibilidade
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleSettingChange('highContrast', !settings.highContrast)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.highContrast ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-pressed={settings.highContrast}
                          aria-label="Alternar alto contraste"
                        >
                          <motion.div
                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                            animate={{ x: settings.highContrast ? 24 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>

                      {/* Reduced Motion */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Reduzir Movimento
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Minimiza animações e transições
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleSettingChange('reducedMotion', !settings.reducedMotion)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.reducedMotion ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-pressed={settings.reducedMotion}
                        >
                          <motion.div
                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                            animate={{ x: settings.reducedMotion ? 24 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>

                      {/* Color Blind Mode */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Modo Daltonismo
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: 'none', label: 'Normal' },
                            { value: 'protanopia', label: 'Protanopia' },
                            { value: 'deuteranopia', label: 'Deuteranopia' },
                            { value: 'tritanopia', label: 'Tritanopia' }
                          ].map((option) => (
                            <motion.button
                              key={option.value}
                              onClick={() => handleSettingChange('colorBlindMode', option.value)}
                              className={`p-2 text-xs rounded-lg border transition-colors ${
                                settings.colorBlindMode === option.value
                                  ? 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300'
                                  : 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {option.label}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Text Section */}
                  {activeSection === 'text' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Configurações de Texto
                      </h3>

                      {/* Large Text */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Texto Grande
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Aumenta o tamanho do texto
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleSettingChange('largeText', !settings.largeText)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.largeText ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                            animate={{ x: settings.largeText ? 24 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>

                      {/* Font Size */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tamanho da Fonte: {settings.fontSize}px
                        </label>
                        <input
                          type="range"
                          min="12"
                          max="24"
                          value={settings.fontSize}
                          onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                      </div>

                      {/* Line Height */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Altura da Linha: {settings.lineHeight}
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="2"
                          step="0.1"
                          value={settings.lineHeight}
                          onChange={(e) => handleSettingChange('lineHeight', parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                      </div>

                      {/* Letter Spacing */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Espaçamento: {settings.letterSpacing}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="3"
                          step="0.5"
                          value={settings.letterSpacing}
                          onChange={(e) => handleSettingChange('letterSpacing', parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                      </div>
                    </div>
                  )}

                  {/* Interaction Section */}
                  {activeSection === 'interaction' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Configurações de Interação
                      </h3>

                      {/* Keyboard Navigation */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Navegação por Teclado
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Habilita navegação completa por teclado
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleSettingChange('keyboardNavigation', !settings.keyboardNavigation)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.keyboardNavigation ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                            animate={{ x: settings.keyboardNavigation ? 24 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>

                      {/* Focus Indicators */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Indicadores de Foco
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Destaca elementos focados
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleSettingChange('focusIndicators', !settings.focusIndicators)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.focusIndicators ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                            animate={{ x: settings.focusIndicators ? 24 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {/* Audio Section */}
                  {activeSection === 'audio' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Configurações de Áudio
                      </h3>

                      {/* Screen Reader */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Leitor de Tela
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Anuncia mudanças na interface
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleSettingChange('screenReader', !settings.screenReader)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.screenReader ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                            animate={{ x: settings.screenReader ? 24 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <motion.button
                onClick={handleValidate}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Check className="w-4 h-4" />
                Validar Acessibilidade
              </motion.button>

              <motion.button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="w-4 h-4" />
                Redefinir Configurações
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AccessibilityPanel;