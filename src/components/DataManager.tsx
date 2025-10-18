import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Download,
  Upload,
  Save,
  RotateCcw,
  Trash2,
  User,
  Settings,
  Calendar,
  Shield,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { useDataManager, UserProfile, BackupData } from '../hooks/useDataManager';
import { AnimatedButton } from './AnimatedButton';
import { AnimatedModal } from './AnimatedModal';

interface DataManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataManager: React.FC<DataManagerProps> = ({ isOpen, onClose }) => {
  const {
    profiles,
    currentProfile,
    backups,
    createProfile,
    switchProfile,
    deleteProfile,
    createBackup,
    restoreBackup,
    exportData,
    importData
  } = useDataManager();

  const [activeTab, setActiveTab] = useState<'profiles' | 'backups' | 'import-export'>('profiles');
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileEmail, setNewProfileEmail] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) return;
    
    try {
      const newProfile = createProfile(newProfileName.trim(), newProfileEmail.trim() || undefined);
      switchProfile(newProfile.id);
      setNewProfileName('');
      setNewProfileEmail('');
      setShowCreateProfile(false);
      showNotification('success', 'Perfil criado com sucesso!');
    } catch (error) {
      showNotification('error', 'Erro ao criar perfil');
    }
  };

  const handleDeleteProfile = (profileId: string) => {
    try {
      deleteProfile(profileId);
      setShowDeleteConfirm(null);
      showNotification('success', 'Perfil excluído com sucesso!');
    } catch (error) {
      showNotification('error', 'Erro ao excluir perfil');
    }
  };

  const handleCreateBackup = () => {
    try {
      const backup = createBackup(true);
      if (backup) {
        showNotification('success', 'Backup criado com sucesso!');
      } else {
        showNotification('error', 'Erro ao criar backup');
      }
    } catch (error) {
      showNotification('error', 'Erro ao criar backup');
    }
  };

  const handleRestoreBackup = (backupId: string) => {
    try {
      const success = restoreBackup(backupId);
      if (success) {
        showNotification('success', 'Backup restaurado com sucesso!');
      } else {
        showNotification('error', 'Erro ao restaurar backup');
      }
    } catch (error) {
      showNotification('error', 'Erro ao restaurar backup');
    }
  };

  const handleExportData = () => {
    try {
      const exported = exportData(true);
      if (exported) {
        showNotification('success', 'Dados exportados com sucesso!');
      } else {
        showNotification('error', 'Erro ao exportar dados');
      }
    } catch (error) {
      showNotification('error', 'Erro ao exportar dados');
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const success = await importData(file);
      if (success) {
        showNotification('success', 'Dados importados com sucesso!');
      } else {
        showNotification('error', 'Erro ao importar dados');
      }
    } catch (error) {
      showNotification('error', 'Erro ao importar dados');
    }

    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatFileSize = (data: any) => {
    const size = new Blob([JSON.stringify(data)]).size;
    return size < 1024 ? `${size} B` : `${(size / 1024).toFixed(1)} KB`;
  };

  return (
    <>
      <AnimatedModal
        isOpen={isOpen}
        onClose={onClose}
        title="Gerenciador de Dados"
        size="xl"
      >
        <div className="space-y-6">
          {/* Notificação */}
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-4 rounded-lg flex items-center space-x-3 ${
                  notification.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                }`}
              >
                {notification.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span>{notification.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {[
                { id: 'profiles', label: 'Perfis', icon: Users },
                { id: 'backups', label: 'Backups', icon: Shield },
                { id: 'import-export', label: 'Importar/Exportar', icon: Download }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Conteúdo das Tabs */}
          <div className="min-h-[400px]">
            {/* Tab Perfis */}
            {activeTab === 'profiles' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Perfis de Usuário
                  </h3>
                  <AnimatedButton
                    onClick={() => setShowCreateProfile(true)}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Novo Perfil</span>
                  </AnimatedButton>
                </div>

                <div className="grid gap-4">
                  {profiles.map(profile => (
                    <motion.div
                      key={profile.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 border rounded-lg transition-colors ${
                        currentProfile?.id === profile.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {profile.name}
                            </h4>
                            {profile.email && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {profile.email}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              Último acesso: {formatDate(profile.lastAccess)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {currentProfile?.id !== profile.id && (
                            <AnimatedButton
                              variant="secondary"
                              size="sm"
                              onClick={() => switchProfile(profile.id)}
                            >
                              Ativar
                            </AnimatedButton>
                          )}
                          {currentProfile?.id === profile.id && (
                            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                              Ativo
                            </span>
                          )}
                          <button
                            onClick={() => setShowDeleteConfirm(profile.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            disabled={profiles.length === 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Backups */}
            {activeTab === 'backups' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Backups do Perfil Atual
                  </h3>
                  <AnimatedButton
                    onClick={handleCreateBackup}
                    disabled={!currentProfile}
                    className="flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Criar Backup</span>
                  </AnimatedButton>
                </div>

                {!currentProfile ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Selecione um perfil para ver os backups
                  </div>
                ) : backups.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Nenhum backup encontrado
                  </div>
                ) : (
                  <div className="space-y-3">
                    {backups
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map(backup => (
                        <motion.div
                          key={backup.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {formatDate(backup.timestamp)}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Tamanho: {formatFileSize(backup.data)} • Versão: {backup.version}
                                </p>
                              </div>
                            </div>
                            <AnimatedButton
                              variant="secondary"
                              size="sm"
                              onClick={() => handleRestoreBackup(backup.id)}
                              className="flex items-center space-x-2"
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>Restaurar</span>
                            </AnimatedButton>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab Importar/Exportar */}
            {activeTab === 'import-export' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Importar/Exportar Dados
                </h3>

                {/* Exportar */}
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Exportar Dados
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Exporte todos os seus dados incluindo perfil, investimentos e backups.
                  </p>
                  <AnimatedButton
                    onClick={handleExportData}
                    disabled={!currentProfile}
                    className="flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exportar Dados</span>
                  </AnimatedButton>
                </div>

                {/* Importar */}
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Importar Dados
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Importe dados de um arquivo de backup do Jurus.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                  <AnimatedButton
                    onClick={() => fileInputRef.current?.click()}
                    variant="secondary"
                    className="flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Selecionar Arquivo</span>
                  </AnimatedButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </AnimatedModal>

      {/* Modal Criar Perfil */}
      <AnimatedModal
        isOpen={showCreateProfile}
        onClose={() => setShowCreateProfile(false)}
        title="Criar Novo Perfil"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Perfil *
            </label>
            <input
              type="text"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: João Silva"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email (opcional)
            </label>
            <input
              type="email"
              value={newProfileEmail}
              onChange={(e) => setNewProfileEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="joao@email.com"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <AnimatedButton
              variant="secondary"
              onClick={() => setShowCreateProfile(false)}
            >
              Cancelar
            </AnimatedButton>
            <AnimatedButton
              onClick={handleCreateProfile}
              disabled={!newProfileName.trim()}
            >
              Criar Perfil
            </AnimatedButton>
          </div>
        </div>
      </AnimatedModal>

      {/* Modal Confirmar Exclusão */}
      <AnimatedModal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Confirmar Exclusão"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
            <AlertCircle className="w-6 h-6" />
            <p>Tem certeza que deseja excluir este perfil?</p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Esta ação não pode ser desfeita. Todos os dados do perfil serão perdidos permanentemente.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <AnimatedButton
              variant="secondary"
              onClick={() => setShowDeleteConfirm(null)}
            >
              Cancelar
            </AnimatedButton>
            <AnimatedButton
              variant="danger"
              onClick={() => showDeleteConfirm && handleDeleteProfile(showDeleteConfirm)}
            >
              Excluir Perfil
            </AnimatedButton>
          </div>
        </div>
      </AnimatedModal>
    </>
  );
};