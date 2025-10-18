import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  X, 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2, 
  Clock, 
  HardDrive, 
  Settings, 
  Play, 
  Pause,
  AlertTriangle,
  CheckCircle,
  FileText,
  Calendar,
  Database
} from 'lucide-react';
import { useAutoBackup } from '../hooks/useAutoBackup';
import { useMicroInteractions } from '../hooks/useMicroInteractions';
import { Z_INDEX } from '../constants/zIndex';

interface BackupManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupManager: React.FC<BackupManagerProps> = ({ isOpen, onClose }) => {
  const {
    backups,
    settings,
    isBackingUp,
    lastBackup,
    stats,
    updateSettings,
    createBackup,
    restoreBackup,
    deleteBackup,
    exportBackup,
    importBackup,
    clearAllBackups,
  } = useAutoBackup();

  const { playSound, triggerHaptic } = useMicroInteractions();

  const [showSettings, setShowSettings] = useState(false);
  const [restoreConfirm, setRestoreConfirm] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleCreateBackup = async () => {
    const backup = await createBackup('manual');
    if (backup) {
      playSound(800, 100);
      triggerHaptic('medium');
    } else {
      playSound(400, 200);
      triggerHaptic('heavy');
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    const success = await restoreBackup(backupId);
    if (success) {
      playSound(800, 100);
      triggerHaptic('medium');
      setRestoreConfirm(null);
    } else {
      playSound(400, 200);
      triggerHaptic('heavy');
      alert('Erro ao restaurar backup');
    }
  };

  const handleDeleteBackup = (backupId: string) => {
    deleteBackup(backupId);
    setDeleteConfirm(null);
    playSound(800, 100);
    triggerHaptic('light');
  };

  const handleExportBackup = (backupId: string) => {
    exportBackup(backupId);
    playSound(800, 100);
    triggerHaptic('medium');
  };

  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    importBackup(file)
      .then(() => {
        playSound(800, 100);
        triggerHaptic('medium');
      })
      .catch((error) => {
        alert(error.message);
        playSound(400, 200);
        triggerHaptic('heavy');
      });

    event.target.value = '';
  };

  const handleClearAllBackups = () => {
    if (confirm('Tem certeza que deseja deletar todos os backups? Esta ação não pode ser desfeita.')) {
      clearAllBackups();
      playSound(800, 100);
      triggerHaptic('medium');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getBackupTypeIcon = (type: 'auto' | 'manual') => {
    return type === 'auto' ? <Clock size={16} /> : <FileText size={16} />;
  };

  const getBackupTypeColor = (type: 'auto' | 'manual') => {
    return type === 'auto' ? 'text-blue-600' : 'text-green-600';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: Z_INDEX.BACKUP_PANEL }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Gerenciador de Backups
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-2 rounded-lg transition-colors ${
                    showSettings 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  title="Configurações"
                >
                  <Settings size={20} />
                </button>
                <label className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                  <Upload size={20} />
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleCreateBackup}
                  disabled={isBackingUp}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Criar Backup Manual"
                >
                  {isBackingUp ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Download size={20} />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex h-[calc(90vh-140px)]">
              {/* Sidebar - Estatísticas e Configurações */}
              <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6">
                {/* Estatísticas */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Estatísticas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total de Backups</span>
                      <span className="font-medium">{stats.totalBackups}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Tamanho Total</span>
                      <span className="font-medium">{formatSize(stats.totalSize)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Automáticos</span>
                      <span className="font-medium text-blue-600">{stats.autoBackups}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Manuais</span>
                      <span className="font-medium text-green-600">{stats.manualBackups}</span>
                    </div>
                    {lastBackup && (
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Último Backup</span>
                        <p className="text-sm font-medium">{formatDate(lastBackup)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Configurações */}
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        Configurações
                      </h3>

                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Backup Automático
                        </span>
                        <input
                          type="checkbox"
                          checked={settings.enabled}
                          onChange={(e) => updateSettings({ enabled: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>

                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Frequência: {settings.frequency} min
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="120"
                          step="5"
                          value={settings.frequency}
                          onChange={(e) => updateSettings({ frequency: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Máximo de Backups: {settings.maxBackups}
                        </label>
                        <input
                          type="range"
                          min="3"
                          max="50"
                          step="1"
                          value={settings.maxBackups}
                          onChange={(e) => updateSettings({ maxBackups: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Incluir nos Backups:
                        </h4>
                        
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.includeProfiles}
                            onChange={(e) => updateSettings({ includeProfiles: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm">Perfis</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.includeSettings}
                            onChange={(e) => updateSettings({ includeSettings: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm">Configurações</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.includeSimulacoes}
                            onChange={(e) => updateSettings({ includeSimulacoes: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm">Simulações</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.includePortfolios}
                            onChange={(e) => updateSettings({ includePortfolios: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm">Portfólios</span>
                        </label>
                      </div>

                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Limpeza Automática
                        </span>
                        <input
                          type="checkbox"
                          checked={settings.autoCleanup}
                          onChange={(e) => updateSettings({ autoCleanup: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Ações Globais */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleClearAllBackups}
                    className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Limpar Todos os Backups
                  </button>
                </div>
              </div>

              {/* Lista de Backups */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Backups Disponíveis
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>Automático</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText size={14} />
                      <span>Manual</span>
                    </div>
                  </div>
                </div>

                {backups.length === 0 ? (
                  <div className="text-center py-12">
                    <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Nenhum backup encontrado
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Crie seu primeiro backup para proteger seus dados
                    </p>
                    <button
                      onClick={handleCreateBackup}
                      disabled={isBackingUp}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                    >
                      Criar Primeiro Backup
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {backups.map((backup) => (
                      <motion.div
                        key={backup.id}
                        layout
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${getBackupTypeColor(backup.type)} bg-gray-100 dark:bg-gray-700`}>
                              {getBackupTypeIcon(backup.type)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                  {backup.type === 'auto' ? 'Backup Automático' : 'Backup Manual'}
                                </h4>
                                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                  {formatSize(backup.size)}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  <span>{formatDate(backup.timestamp)}</span>
                                </div>
                                <span>v{backup.version}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleExportBackup(backup.id)}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title="Exportar Backup"
                            >
                              <Download size={16} />
                            </button>
                            <button
                              onClick={() => setRestoreConfirm(backup.id)}
                              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 rounded-lg transition-colors"
                              title="Restaurar Backup"
                            >
                              <RotateCcw size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(backup.id)}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-colors"
                              title="Deletar Backup"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Confirmações */}
                        <AnimatePresence>
                          {restoreConfirm === backup.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"
                            >
                              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200 mb-2">
                                <AlertTriangle size={16} />
                                <span className="text-sm font-medium">
                                  Confirmar restauração?
                                </span>
                              </div>
                              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                                Todos os dados atuais serão substituídos pelos dados do backup.
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleRestoreBackup(backup.id)}
                                  className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                                >
                                  Restaurar
                                </button>
                                <button
                                  onClick={() => setRestoreConfirm(null)}
                                  className="flex-1 px-3 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </motion.div>
                          )}

                          {deleteConfirm === backup.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800"
                            >
                              <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-2">
                                <AlertTriangle size={16} />
                                <span className="text-sm font-medium">
                                  Confirmar exclusão?
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleDeleteBackup(backup.id)}
                                  className="flex-1 px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                                >
                                  Deletar
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="flex-1 px-3 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackupManager;