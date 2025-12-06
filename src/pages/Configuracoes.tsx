import { useState, useRef } from 'react';
import { Settings, Moon, Sun, Info, Smartphone, Bell, Shield, Download, Upload, Check, AlertTriangle } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../utils/cn';

export function Configuracoes() {
  const { theme } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backupStatus, setBackupStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [restoreStatus, setRestoreStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Baixar backup de todos os dados do localStorage
  const handleBaixarBackup = () => {
    try {
      const backup: Record<string, string> = {};

      // Coletar todas as chaves do localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          backup[key] = localStorage.getItem(key) || '';
        }
      }

      // Criar arquivo JSON
      const dataStr = JSON.stringify(backup, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      // Gerar nome do arquivo com data
      const data = new Date();
      const dataFormatada = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
      const horaFormatada = `${String(data.getHours()).padStart(2, '0')}${String(data.getMinutes()).padStart(2, '0')}`;
      const nomeArquivo = `jurus-backup-${dataFormatada}-${horaFormatada}.json`;

      // Download
      const link = document.createElement('a');
      link.href = url;
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setBackupStatus('success');
      setStatusMessage(`Backup salvo: ${nomeArquivo}`);
      setTimeout(() => setBackupStatus('idle'), 3000);
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      setBackupStatus('error');
      setStatusMessage('Erro ao criar backup');
      setTimeout(() => setBackupStatus('idle'), 3000);
    }
  };

  // Restaurar backup
  const handleRestaurarBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backup = JSON.parse(content) as Record<string, string>;

        // Validar se é um backup válido
        if (typeof backup !== 'object' || backup === null) {
          throw new Error('Formato inválido');
        }

        // Restaurar cada chave
        let restaurados = 0;
        Object.entries(backup).forEach(([key, value]) => {
          if (typeof key === 'string' && typeof value === 'string') {
            localStorage.setItem(key, value);
            restaurados++;
          }
        });

        setRestoreStatus('success');
        setStatusMessage(`${restaurados} itens restaurados. Recarregue a página.`);

        // Recarregar após 2 segundos
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.error('Erro ao restaurar backup:', error);
        setRestoreStatus('error');
        setStatusMessage('Arquivo de backup inválido');
        setTimeout(() => setRestoreStatus('idle'), 3000);
      }
    };
    reader.readAsText(file);

    // Limpar input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="page-container space-y-4">
      {/* Header compacto */}
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Ajustes
          </h1>
          <p className="text-xs text-gray-500">Personalize seu app</p>
        </div>
      </div>

      {/* Tema */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              theme === 'dark' ? "bg-indigo-100 dark:bg-indigo-900/30" : "bg-amber-100"
            )}>
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-indigo-600" />
              ) : (
                <Sun className="w-5 h-5 text-amber-600" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">Tema</p>
              <p className="text-xs text-gray-500">
                {theme === 'dark' ? 'Modo escuro' : 'Modo claro'}
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Backup e Restauração */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-3 border-b border-gray-100 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white text-sm">Backup dos Dados</p>
          <p className="text-xs text-gray-500">Salvar e restaurar seus dados</p>
        </div>

        {/* Baixar Backup */}
        <div className="p-3 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700">
          <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Download className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white text-sm">Baixar Backup</p>
            <p className="text-xs text-gray-500">Salvar todos os dados em arquivo</p>
          </div>
          <button
            onClick={handleBaixarBackup}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              backupStatus === 'success'
                ? "bg-green-500 text-white"
                : backupStatus === 'error'
                  ? "bg-red-500 text-white"
                  : "bg-green-600 text-white hover:bg-green-700"
            )}
          >
            {backupStatus === 'success' ? (
              <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Salvo</span>
            ) : backupStatus === 'error' ? (
              <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Erro</span>
            ) : (
              'Baixar'
            )}
          </button>
        </div>

        {/* Restaurar Backup */}
        <div className="p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Upload className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white text-sm">Restaurar Backup</p>
            <p className="text-xs text-gray-500">Carregar dados de arquivo</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleRestaurarBackup}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              restoreStatus === 'success'
                ? "bg-green-500 text-white"
                : restoreStatus === 'error'
                  ? "bg-red-500 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {restoreStatus === 'success' ? (
              <span className="flex items-center gap-1"><Check className="w-3 h-3" /> OK</span>
            ) : restoreStatus === 'error' ? (
              <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Erro</span>
            ) : (
              'Restaurar'
            )}
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (backupStatus !== 'idle' || restoreStatus !== 'idle') && (
          <div className={cn(
            "mx-3 mb-3 p-2 rounded-lg text-xs",
            restoreStatus === 'success' || backupStatus === 'success'
              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
              : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
          )}>
            {statusMessage}
          </div>
        )}
      </div>

      {/* Outras opções */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
        <div className="p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white text-sm">Notificações</p>
            <p className="text-xs text-gray-500">Lembretes de metas</p>
          </div>
          <div className="w-10 h-6 rounded-full bg-green-500 p-0.5">
            <div className="w-5 h-5 rounded-full bg-white ml-auto" />
          </div>
        </div>

        <div className="p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white text-sm">Privacidade</p>
            <p className="text-xs text-gray-500">Dados locais apenas</p>
          </div>
          <span className="text-xs text-green-600 font-medium">✓ Ativo</span>
        </div>
      </div>

      {/* Sobre */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">Jurus</p>
            <p className="text-xs text-gray-500">Calculadora Financeira</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-[10px] text-gray-400">Versão</p>
            <p className="text-xs font-bold">2.0.0</p>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-[10px] text-gray-400">Dados</p>
            <p className="text-xs font-bold">Local</p>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-[10px] text-gray-400">PWA</p>
            <p className="text-xs font-bold text-green-600">✓</p>
          </div>
        </div>
      </div>

      {/* Dica */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-blue-700 dark:text-blue-300">
          Faça backup regularmente para não perder seus dados. O arquivo pode ser usado para restaurar em outro dispositivo.
        </p>
      </div>
    </div>
  );
}

