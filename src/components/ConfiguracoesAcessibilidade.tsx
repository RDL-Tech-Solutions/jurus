import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Type, 
  Contrast, 
  MousePointer,
  Keyboard,
  Monitor,
  Settings,
  Save,
  RotateCcw
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface ConfiguracaoAcessibilidade {
  altoContraste: boolean;
  tamanhoFonte: 'pequeno' | 'medio' | 'grande' | 'extra-grande';
  reducaoMovimento: boolean;
  leituraAutomatica: boolean;
  navegacaoTeclado: boolean;
  focusVisivel: boolean;
  modoEscuroAutomatico: boolean;
  alertasSonoros: boolean;
  tempoSessaoEstendido: boolean;
  simplificarInterface: boolean;
}

export function ConfiguracoesAcessibilidade() {
  const { configuracoes, updateConfiguracoes } = useAppStore();
  
  const [config, setConfig] = useState<ConfiguracaoAcessibilidade>({
    altoContraste: false,
    tamanhoFonte: 'medio',
    reducaoMovimento: false,
    leituraAutomatica: false,
    navegacaoTeclado: true,
    focusVisivel: true,
    modoEscuroAutomatico: false,
    alertasSonoros: false,
    tempoSessaoEstendido: false,
    simplificarInterface: false
  });

  const [salvo, setSalvo] = useState(false);

  const handleConfigChange = (key: keyof ConfiguracaoAcessibilidade, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const aplicarConfiguracoes = () => {
    // Aplicar configurações ao documento
    const root = document.documentElement;
    
    // Alto contraste
    if (config.altoContraste) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Tamanho da fonte
    root.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large');
    root.classList.add(`font-${config.tamanhoFonte}`);
    
    // Redução de movimento
    if (config.reducaoMovimento) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Focus visível
    if (config.focusVisivel) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }
    
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  };

  const resetarConfiguracoes = () => {
    setConfig({
      altoContraste: false,
      tamanhoFonte: 'medio',
      reducaoMovimento: false,
      leituraAutomatica: false,
      navegacaoTeclado: true,
      focusVisivel: true,
      modoEscuroAutomatico: false,
      alertasSonoros: false,
      tempoSessaoEstendido: false,
      simplificarInterface: false
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Configurações de Acessibilidade
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Personalize a interface para melhor experiência de uso
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Visual */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Monitor className="w-5 h-5" />
              <span>Configurações Visuais</span>
            </h3>
            
            {/* Alto Contraste */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Contrast className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Alto Contraste</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Aumenta o contraste das cores</p>
                </div>
              </div>
              <button
                onClick={() => handleConfigChange('altoContraste', !config.altoContraste)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.altoContraste ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.altoContraste ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Tamanho da Fonte */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Type className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Tamanho da Fonte</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ajuste o tamanho do texto</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['pequeno', 'medio', 'grande', 'extra-grande'].map((tamanho) => (
                  <button
                    key={tamanho}
                    onClick={() => handleConfigChange('tamanhoFonte', tamanho)}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      config.tamanhoFonte === tamanho
                        ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-300'
                        : 'bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {tamanho.charAt(0).toUpperCase() + tamanho.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Redução de Movimento */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <MousePointer className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Reduzir Movimento</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Minimiza animações e transições</p>
                </div>
              </div>
              <button
                onClick={() => handleConfigChange('reducaoMovimento', !config.reducaoMovimento)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.reducaoMovimento ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.reducaoMovimento ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Navegação e Interação */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Keyboard className="w-5 h-5" />
              <span>Navegação e Interação</span>
            </h3>

            {/* Navegação por Teclado */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Keyboard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Navegação por Teclado</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Habilita atalhos de teclado</p>
                </div>
              </div>
              <button
                onClick={() => handleConfigChange('navegacaoTeclado', !config.navegacaoTeclado)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.navegacaoTeclado ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.navegacaoTeclado ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Focus Visível */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Focus Visível</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Destaca elementos em foco</p>
                </div>
              </div>
              <button
                onClick={() => handleConfigChange('focusVisivel', !config.focusVisivel)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.focusVisivel ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.focusVisivel ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Alertas Sonoros */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Alertas Sonoros</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sons para notificações importantes</p>
                </div>
              </div>
              <button
                onClick={() => handleConfigChange('alertasSonoros', !config.alertasSonoros)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.alertasSonoros ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.alertasSonoros ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Simplificar Interface */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Simplificar Interface</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Remove elementos decorativos</p>
                </div>
              </div>
              <button
                onClick={() => handleConfigChange('simplificarInterface', !config.simplificarInterface)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.simplificarInterface ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.simplificarInterface ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={resetarConfiguracoes}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Resetar</span>
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={aplicarConfiguracoes}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              salvo
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{salvo ? 'Salvo!' : 'Aplicar Configurações'}</span>
          </motion.button>
        </div>

        {/* Informações de Atalhos */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Atalhos de Teclado</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800 dark:text-blue-400">
            <div>• Tab: Navegar entre elementos</div>
            <div>• Enter/Space: Ativar botões</div>
            <div>• Esc: Fechar modais</div>
            <div>• Alt + T: Alternar tema</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}