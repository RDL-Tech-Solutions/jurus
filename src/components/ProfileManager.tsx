import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  Download, 
  Upload, 
  Clock, 
  BarChart3,
  Settings,
  X,
  Check,
  AlertTriangle,
  Users
} from 'lucide-react';
import { useProfiles, UserProfile } from '../hooks/useProfiles';
import { useMicroInteractions } from '../hooks/useMicroInteractions';
import { Z_INDEX } from '../constants/zIndex';

interface ProfileManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({ isOpen, onClose }) => {
  const {
    profiles,
    currentProfile,
    isLoading,
    createProfile,
    switchProfile,
    updateProfile,
    deleteProfile,
    duplicateProfile,
    exportProfile,
    importProfile,
  } = useProfiles();

  const { playSound, triggerHaptic } = useMicroInteractions();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [newProfileName, setNewProfileName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      createProfile(newProfileName.trim());
      setNewProfileName('');
      setShowCreateForm(false);
      playSound(800, 200);
      triggerHaptic('medium');
    }
  };

  const handleSwitchProfile = (profileId: string) => {
    if (switchProfile(profileId)) {
      playSound(600, 100);
      triggerHaptic('light');
      onClose();
    }
  };

  const handleUpdateProfile = (profileId: string, name: string) => {
    updateProfile(profileId, { name: name.trim() });
    setEditingProfile(null);
    playSound(800, 200);
    triggerHaptic('light');
  };

  const handleDeleteProfile = (profileId: string) => {
    try {
      deleteProfile(profileId);
      setDeleteConfirm(null);
      playSound(800, 200);
      triggerHaptic('medium');
    } catch (error) {
      alert((error as Error).message);
      playSound(400, 300);
      triggerHaptic('heavy');
    }
  };

  const handleDuplicateProfile = (profileId: string) => {
    const originalProfile = profiles.find(p => p.id === profileId);
    if (originalProfile) {
      const newName = `${originalProfile.name} (Cópia)`;
      duplicateProfile(profileId, newName);
      playSound(800, 200);
      triggerHaptic('medium');
    }
  };

  const handleExportProfile = (profileId: string) => {
    exportProfile(profileId);
    playSound(800, 200);
    triggerHaptic('medium');
  };

  const handleImportProfile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    importProfile(file)
      .then(() => {
        playSound(800, 200);
        triggerHaptic('medium');
      })
      .catch((error) => {
        alert(error.message);
        playSound(400, 300);
        triggerHaptic('heavy');
      });

    // Reset input
    event.target.value = '';
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

  const formatUsageTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (isLoading) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
          style={{ zIndex: Z_INDEX.PROFILE_PANEL }}
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
                Carregando perfis...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: Z_INDEX.PROFILE_PANEL }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Gerenciar Perfis
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <label className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                  <Upload size={20} />
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportProfile}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  title="Criar Novo Perfil"
                >
                  <Plus size={20} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
              {/* Create Profile Form */}
              <AnimatePresence>
                {showCreateForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-3">
                      Criar Novo Perfil
                    </h3>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newProfileName}
                        onChange={(e) => setNewProfileName(e.target.value)}
                        placeholder="Nome do perfil"
                        className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                        onKeyPress={(e) => e.key === 'Enter' && handleCreateProfile()}
                        autoFocus
                      />
                      <button
                        onClick={handleCreateProfile}
                        disabled={!newProfileName.trim()}
                        className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setShowCreateForm(false);
                          setNewProfileName('');
                        }}
                        className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Profiles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profiles.map((profile) => (
                  <motion.div
                    key={profile.id}
                    layout
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      currentProfile?.id === profile.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => handleSwitchProfile(profile.id)}
                  >
                    {/* Profile Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {profile.avatar || profile.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          {editingProfile === profile.id ? (
                            <input
                              type="text"
                              defaultValue={profile.name}
                              className="text-sm font-medium bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                              onBlur={(e) => handleUpdateProfile(profile.id, e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleUpdateProfile(profile.id, (e.target as HTMLInputElement).value);
                                }
                              }}
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                              {profile.name}
                            </h3>
                          )}
                          {currentProfile?.id === profile.id && (
                            <span className="text-xs text-blue-600 font-medium">
                              Perfil Atual
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Profile Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingProfile(profile.id);
                          }}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                          title="Editar Nome"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateProfile(profile.id);
                          }}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                          title="Duplicar Perfil"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExportProfile(profile.id);
                          }}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                          title="Exportar Perfil"
                        >
                          <Download size={14} />
                        </button>
                        {profiles.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm(profile.id);
                            }}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded transition-colors"
                            title="Deletar Perfil"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Profile Stats */}
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <BarChart3 size={14} />
                        <span>
                          {profile.stats.totalSimulacoes} simulações, {profile.stats.totalPortfolios} portfólios
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>
                          Tempo de uso: {formatUsageTime(profile.stats.tempoUso)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        <span>
                          Criado em: {formatDate(profile.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Settings size={14} />
                        <span>
                          Último acesso: {formatDate(profile.lastAccessed)}
                        </span>
                      </div>
                    </div>

                    {/* Delete Confirmation */}
                    <AnimatePresence>
                      {deleteConfirm === profile.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-2">
                            <AlertTriangle size={16} />
                            <span className="text-sm font-medium">
                              Confirmar exclusão?
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteProfile(profile.id)}
                              className="flex-1 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                            >
                              Deletar
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="flex-1 px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
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

              {/* Empty State */}
              {profiles.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Nenhum perfil encontrado
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Crie seu primeiro perfil para começar a usar o Jurus
                  </p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Criar Primeiro Perfil
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileManager;