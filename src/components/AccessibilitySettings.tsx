import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Eye, 
  Type, 
  MousePointer, 
  Volume2, 
  Contrast, 
  Zap,
  X,
  Check,
  Info,
  Palette,
  Monitor,
  Keyboard
} from 'lucide-react';
import { useAccessibility } from '../hooks/useAccessibility';
import { useMicroInteractions } from '../hooks/useMicroInteractions';
import { getZIndexClass } from '../constants/zIndex';

interface AccessibilitySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({
  isOpen,
  onClose
}) => {
  const { settings, updateSetting, announce } = useAccessibility();
  const { useButtonInteraction, useHoverInteraction } = useMicroInteractions();
  
  const [activeSection, setActiveSection] = useState<string>('visual');

  const buttonInteraction = useButtonInteraction({ 
    animation: 'scale', 
    haptic: true, 
    sound: true 
  });

  const sections = [
    {
      id: 'visual',
      label: 'Visual',
      icon: Eye,
      description: 'Configurações de aparência e contraste'
    },
    {
      id: 'text',
      label: 'Texto',
      icon: Type,
      description: 'Tamanho e espaçamento do texto'
    },
    {
      id: 'interaction',
      label: 'Interação',
      icon: MousePointer,
      description: 'Navegação e controles'
    },
    {
      id: 'audio',
      label: 'Áudio',
      icon: Volume2,
      description: 'Feedback sonoro e leitores de tela'
    }
  ];

  const handleSettingChange = (key: string, value: any) => {
    updateSetting(key as any, value);
    announce(`Configuração ${key} alterada para ${value}`);
  };

  const resetSettings = () => {
    const defaultSettings = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      focusIndicators: true,
      colorBlindMode: 'none' as const,
      fontSize: 'medium' as const,
      lineHeight: 'normal' as const,
      letterSpacing: 'normal' as const
    };

    Object.entries(defaultSettings).forEach(([key, value]) => {
      updateSetting(key as any, value);
    });

    announce('Configurações de acessibilidade redefinidas para o padrão');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm ${getZIndexClass('MODAL')} flex items-center justify-center p-4`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-title"
        aria-describedby="accessibility-description"
      >
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 id="accessibility-title" className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Settings className="w-6 h-6 text-blue-600" />
                Configurações de Acessibilidade
              </h2>
              <p id="accessibility-description" className="text-gray-600 dark:text-gray-400 mt-1">
                Personalize a experiência para suas necessidades
              </p>
            </div>
            <motion.button
              {...buttonInteraction}
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Fechar configurações de acessibilidade"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="flex h-[calc(90vh-120px)]">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 dark:bg-gray-800 p-4 overflow-y-auto">
              <nav role="navigation" aria-label="Seções de configuração">
                <ul className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    
                    return (
                      <li key={section.id}>
                        <motion.button
                          className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                            isActive 
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => setActiveSection(section.id)}
                          aria-current={isActive ? 'page' : undefined}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className="w-5 h-5" />
                          <div>
                            <div className="font-medium">{section.label}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {section.description}
                            </div>
                          </div>
                        </motion.button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Reset Button */}
              <motion.button
                onClick={resetSettings}
                className="w-full mt-6 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors flex items-center gap-2 justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Settings className="w-4 h-4" />
                Redefinir Tudo
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeSection === 'visual' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        Configurações Visuais
                      </h3>

                      {/* Alto Contraste */}
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <label htmlFor="high-contrast" className="font-medium flex items-center gap-2">
                            <Contrast className="w-4 h-4" />
                            Alto Contraste
                          </label>
                          <motion.button
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              settings.highContrast ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                            onClick={() => handleSettingChange('highContrast', !settings.highContrast)}
                            whileTap={{ scale: 0.95 }}
                            role="switch"
                            aria-checked={settings.highContrast}
                            aria-labelledby="high-contrast"
                          >
                            <motion.div
                              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                              animate={{ x: settings.highContrast ? 24 : 2 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          </motion.button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Aumenta o contraste entre texto e fundo para melhor legibilidade
                        </p>
                      </div>

                      {/* Movimento Reduzido */}
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <label htmlFor="reduced-motion" className="font-medium flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Reduzir Movimento
                          </label>
                          <motion.button
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              settings.reducedMotion ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                            onClick={() => handleSettingChange('reducedMotion', !settings.reducedMotion)}
                            whileTap={{ scale: 0.95 }}
                            role="switch"
                            aria-checked={settings.reducedMotion}
                            aria-labelledby="reduced-motion"
                          >
                            <motion.div
                              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                              animate={{ x: settings.reducedMotion ? 24 : 2 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          </motion.button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Reduz animações e transições para usuários sensíveis ao movimento
                        </p>
                      </div>

                      {/* Modo Daltônico */}
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <label className="font-medium flex items-center gap-2 mb-3">
                          <Palette className="w-4 h-4" />
                          Modo para Daltonismo
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: 'none', label: 'Nenhum' },
                            { value: 'protanopia', label: 'Protanopia' },
                            { value: 'deuteranopia', label: 'Deuteranopia' },
                            { value: 'tritanopia', label: 'Tritanopia' }
                          ].map((option) => (
                            <motion.button
                              key={option.value}
                              className={`p-2 rounded border-2 transition-colors ${
                                settings.colorBlindMode === option.value
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                              onClick={() => handleSettingChange('colorBlindMode', option.value)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {option.label}
                              {settings.colorBlindMode === option.value && (
                                <Check className="w-4 h-4 ml-2 inline" />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'text' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Type className="w-5 h-5" />
                        Configurações de Texto
                      </h3>

                      {/* Tamanho da Fonte */}
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <label className="font-medium mb-3 block">Tamanho da Fonte</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { value: 'small', label: 'Pequeno', size: '14px' },
                            { value: 'medium', label: 'Médio', size: '16px' },
                            { value: 'large', label: 'Grande', size: '18px' },
                            { value: 'extra-large', label: 'Extra Grande', size: '20px' }
                          ].map((option) => (
                            <motion.button
                              key={option.value}
                              className={`p-3 rounded border-2 transition-colors ${
                                settings.fontSize === option.value
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                              onClick={() => handleSettingChange('fontSize', option.value)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              style={{ fontSize: option.size }}
                            >
                              {option.label}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Altura da Linha */}
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <label className="font-medium mb-3 block">Altura da Linha</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: 'normal', label: 'Normal' },
                            { value: 'relaxed', label: 'Relaxado' },
                            { value: 'loose', label: 'Espaçoso' }
                          ].map((option) => (
                            <motion.button
                              key={option.value}
                              className={`p-3 rounded border-2 transition-colors ${
                                settings.lineHeight === option.value
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                              onClick={() => handleSettingChange('lineHeight', option.value)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {option.label}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Espaçamento entre Letras */}
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <label className="font-medium mb-3 block">Espaçamento entre Letras</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: 'normal', label: 'Normal' },
                            { value: 'wide', label: 'Amplo' },
                            { value: 'wider', label: 'Mais Amplo' }
                          ].map((option) => (
                            <motion.button
                              key={option.value}
                              className={`p-3 rounded border-2 transition-colors ${
                                settings.letterSpacing === option.value
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                              onClick={() => handleSettingChange('letterSpacing', option.value)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              style={{ 
                                letterSpacing: option.value === 'normal' ? '0' : 
                                              option.value === 'wide' ? '0.025em' : '0.05em' 
                              }}
                            >
                              {option.label}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'interaction' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <MousePointer className="w-5 h-5" />
                        Configurações de Interação
                      </h3>

                      {/* Navegação por Teclado */}
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <label htmlFor="keyboard-nav" className="font-medium flex items-center gap-2">
                            <Keyboard className="w-4 h-4" />
                            Navegação por Teclado
                          </label>
                          <motion.button
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              settings.keyboardNavigation ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                            onClick={() => handleSettingChange('keyboardNavigation', !settings.keyboardNavigation)}
                            whileTap={{ scale: 0.95 }}
                            role="switch"
                            aria-checked={settings.keyboardNavigation}
                            aria-labelledby="keyboard-nav"
                          >
                            <motion.div
                              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                              animate={{ x: settings.keyboardNavigation ? 24 : 2 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          </motion.button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Habilita navegação completa usando apenas o teclado
                        </p>
                      </div>

                      {/* Indicadores de Foco */}
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <label htmlFor="focus-indicators" className="font-medium flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            Indicadores de Foco Aprimorados
                          </label>
                          <motion.button
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              settings.focusIndicators ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                            onClick={() => handleSettingChange('focusIndicators', !settings.focusIndicators)}
                            whileTap={{ scale: 0.95 }}
                            role="switch"
                            aria-checked={settings.focusIndicators}
                            aria-labelledby="focus-indicators"
                          >
                            <motion.div
                              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                              animate={{ x: settings.focusIndicators ? 24 : 2 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          </motion.button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Melhora a visibilidade dos elementos em foco
                        </p>
                      </div>
                    </div>
                  )}

                  {activeSection === 'audio' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Volume2 className="w-5 h-5" />
                        Configurações de Áudio
                      </h3>

                      {/* Suporte a Leitor de Tela */}
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <label htmlFor="screen-reader" className="font-medium">
                            Suporte a Leitor de Tela
                          </label>
                          <motion.button
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              settings.screenReader ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                            onClick={() => handleSettingChange('screenReader', !settings.screenReader)}
                            whileTap={{ scale: 0.95 }}
                            role="switch"
                            aria-checked={settings.screenReader}
                            aria-labelledby="screen-reader"
                          >
                            <motion.div
                              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                              animate={{ x: settings.screenReader ? 24 : 2 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          </motion.button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Habilita anúncios de voz e compatibilidade com leitores de tela
                        </p>
                      </div>

                      {/* Informações sobre Leitores de Tela */}
                      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                              Leitores de Tela Compatíveis
                            </h4>
                            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                              <li>• NVDA (Windows)</li>
                              <li>• JAWS (Windows)</li>
                              <li>• VoiceOver (macOS/iOS)</li>
                              <li>• TalkBack (Android)</li>
                              <li>• Orca (Linux)</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};