import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  X,
  User,
  Bell,
  BellOff,
  Settings,
  PieChart,
  Target,
  Activity,
  Shield,
  Edit,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Lightbulb,
  Star,
  DollarSign,
  Clock,
  BarChart3
} from 'lucide-react';
import { useRecomendacoesIA, RecomendacaoIA, AlertaInteligente, AnaliseRiscoIA } from '../hooks/useRecomendacoesIA';

interface RecomendacoesIAProps {
  className?: string;
  simulacao?: any; // Propriedade opcional para compatibilidade
}

const RecomendacoesIA: React.FC<RecomendacoesIAProps> = ({ className = '' }) => {
  const {
    // Estado
    perfil,
    recomendacoes,
    alertas,
    analiseRisco,
    configuracao,
    isLoading,
    
    // Funções de perfil
    criarPerfil,
    atualizarPerfil,
    
    // Funções de recomendações
    gerarRecomendacoes,
    aceitarRecomendacao,
    rejeitarRecomendacao,
    
    // Funções de alertas
    marcarAlertaVisualizado,
    desativarAlerta,
    
    // Funções de análise
    analisarPerfil,
    
    // Funções de configuração
    atualizarConfiguracao,
    resetarIA
  } = useRecomendacoesIA();

  const [activeTab, setActiveTab] = useState<'recomendacoes' | 'alertas' | 'perfil' | 'analise' | 'configuracoes'>('recomendacoes');
  const [showPerfilForm, setShowPerfilForm] = useState(false);

  // Gerar recomendações automaticamente quando o perfil estiver configurado
  useEffect(() => {
    if (perfil && recomendacoes.length === 0 && !isLoading) {
      gerarRecomendacoes();
    }
  }, [perfil, recomendacoes.length, isLoading, gerarRecomendacoes]);

  const handleCriarPerfil = async (dadosPerfil: any) => {
    await criarPerfil(dadosPerfil);
    setShowPerfilForm(false);
  };

  const handleAtualizarPerfil = async (dadosPerfil: any) => {
    await atualizarPerfil(dadosPerfil);
    setShowPerfilForm(false);
  };

  const tabs = [
    { id: 'recomendacoes', label: 'Recomendações', icon: Brain },
    { id: 'alertas', label: 'Alertas', icon: Bell },
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'analise', label: 'Análise de Risco', icon: Shield },
    { id: 'configuracoes', label: 'Configurações', icon: Settings }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Recomendações de IA</h2>
            <p className="text-purple-100">
              Análises inteligentes e recomendações personalizadas para seus investimentos
            </p>
          </div>
          <div className="flex items-center gap-4">
            {perfil && (
              <div className="text-right">
                <div className="text-sm text-purple-100">Perfil: {perfil.nome}</div>
                <div className="text-xs text-purple-200">
                  Risco: {perfil.toleranciaRisco} | Experiência: {perfil.experienciaInvestimentos}
                </div>
              </div>
            )}
            <Brain className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === 'alertas' && alertas.filter(a => !a.visualizado).length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                      {alertas.filter(a => !a.visualizado).length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'recomendacoes' && (
              <motion.div
                key="recomendacoes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Recomendações Personalizadas
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={gerarRecomendacoes}
                      disabled={isLoading || !perfil}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      {isLoading ? 'Gerando...' : 'Atualizar'}
                    </button>
                  </div>
                </div>

                {!perfil ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      Configure seu perfil
                    </h3>
                    <p className="text-blue-700 mb-4">
                      Para receber recomendações personalizadas, configure seu perfil de investidor.
                    </p>
                    <button
                      onClick={() => {
                        setActiveTab('perfil');
                        setShowPerfilForm(true);
                      }}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Configurar Perfil
                    </button>
                  </div>
                ) : recomendacoes.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Nenhuma recomendação disponível
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Clique em "Atualizar" para gerar novas recomendações baseadas no seu perfil.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {recomendacoes.map((recomendacao) => (
                      <RecomendacaoCard
                        key={recomendacao.id}
                        recomendacao={recomendacao}
                        onAceitar={() => aceitarRecomendacao(recomendacao.id)}
                        onRejeitar={() => rejeitarRecomendacao(recomendacao.id)}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'alertas' && (
              <motion.div
                key="alertas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Alertas Inteligentes
                </h3>

                {alertas.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Nenhum alerta ativo
                    </h3>
                    <p className="text-gray-600">
                      Os alertas inteligentes aparecerão aqui quando detectarmos oportunidades ou riscos.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alertas.map((alerta) => (
                      <AlertaCard
                        key={alerta.id}
                        alerta={alerta}
                        onMarcarVisualizado={() => marcarAlertaVisualizado(alerta.id)}
                        onDesativar={() => desativarAlerta(alerta.id)}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'perfil' && (
              <motion.div
                key="perfil"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {showPerfilForm ? (
                  <PerfilForm
                    perfil={perfil}
                    onSalvar={perfil ? handleAtualizarPerfil : handleCriarPerfil}
                    onCancelar={() => setShowPerfilForm(false)}
                  />
                ) : perfil ? (
                  <PerfilDisplay
                    perfil={perfil}
                    onEditar={() => setShowPerfilForm(true)}
                  />
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      Perfil não configurado
                    </h3>
                    <p className="text-blue-700 mb-4">
                      Configure seu perfil para receber recomendações personalizadas.
                    </p>
                    <button
                      onClick={() => setShowPerfilForm(true)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Criar Perfil
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'analise' && (
              <motion.div
                key="analise"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Análise de Risco
                  </h3>
                  {perfil && (
                    <button
                      onClick={analisarPerfil}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      <Shield className="w-4 h-4" />
                      {isLoading ? 'Analisando...' : 'Gerar Análise'}
                    </button>
                  )}
                </div>

                {!perfil ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      Configure seu perfil
                    </h3>
                    <p className="text-blue-700 mb-4">
                      Para gerar uma análise de risco, configure seu perfil primeiro.
                    </p>
                    <button
                      onClick={() => {
                        setActiveTab('perfil');
                        setShowPerfilForm(true);
                      }}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Configurar Perfil
                    </button>
                  </div>
                ) : analiseRisco ? (
                  <AnaliseRiscoDisplay analise={analiseRisco} />
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Análise de risco não disponível
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Clique em "Gerar Análise" para criar uma análise de risco personalizada.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'configuracoes' && (
              <motion.div
                key="configuracoes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ConfiguracoesIA
                  configuracao={configuracao}
                  onAtualizarConfiguracao={atualizarConfiguracao}
                  onResetar={resetarIA}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Componente para exibir uma recomendação
const RecomendacaoCard: React.FC<{
  recomendacao: RecomendacaoIA;
  onAceitar: () => void;
  onRejeitar: () => void;
}> = ({ recomendacao, onAceitar, onRejeitar }) => {
  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'critica': return 'text-red-600';
      case 'alta': return 'text-orange-600';
      case 'media': return 'text-yellow-600';
      case 'baixa': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getConfiancaColor = (confianca: number) => {
    if (confianca >= 80) return 'text-green-600';
    if (confianca >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      layout
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            {recomendacao.tipo === 'investimento' && <TrendingUp className="w-5 h-5 text-blue-600" />}
            {recomendacao.tipo === 'rebalanceamento' && <BarChart3 className="w-5 h-5 text-blue-600" />}
            {recomendacao.tipo === 'resgate' && <DollarSign className="w-5 h-5 text-blue-600" />}
            {recomendacao.tipo === 'diversificacao' && <Shield className="w-5 h-5 text-blue-600" />}
            {recomendacao.tipo === 'alerta' && <AlertTriangle className="w-5 h-5 text-blue-600" />}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">
              {recomendacao.titulo}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {recomendacao.tipo.toUpperCase()} • {recomendacao.categoria}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getConfiancaColor(recomendacao.confianca)}`}>
            {recomendacao.confianca}%
          </div>
          <div className="text-xs text-gray-500">Confiança</div>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4">
        {recomendacao.descricao}
      </p>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">
            {recomendacao.impactoEstimado.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">Impacto</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-semibold ${getUrgenciaColor(recomendacao.urgencia)}`}>
            {recomendacao.urgencia}
          </div>
          <div className="text-xs text-gray-500">Urgência</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-600">
            {recomendacao.status}
          </div>
          <div className="text-xs text-gray-500">Status</div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
          Justificativa
        </h4>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {recomendacao.justificativa}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Gerada em: {new Date(recomendacao.dataGeracao).toLocaleDateString()}
        </div>

        {recomendacao.status === 'nova' && (
          <div className="flex gap-2">
            <button
              onClick={onRejeitar}
              className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <ThumbsDown className="w-4 h-4" />
              Rejeitar
            </button>
            <button
              onClick={onAceitar}
              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
              Aceitar
            </button>
          </div>
        )}

        {recomendacao.status !== 'nova' && (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            recomendacao.status === 'aceita' ? 'bg-green-100 text-green-800' :
            recomendacao.status === 'rejeitada' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {recomendacao.status === 'aceita' && <CheckCircle className="w-3 h-3" />}
            {recomendacao.status === 'rejeitada' && <X className="w-3 h-3" />}
            {recomendacao.status === 'aceita' ? 'Aceita' :
             recomendacao.status === 'rejeitada' ? 'Rejeitada' :
             recomendacao.status}
          </span>
        )}
      </div>
    </motion.div>
  );
};

// Componente para exibir um alerta
const AlertaCard: React.FC<{
  alerta: AlertaInteligente;
  onMarcarVisualizado: () => void;
  onDesativar: () => void;
}> = ({ alerta, onMarcarVisualizado, onDesativar }) => {
  const getSeveridadeColor = (severidade: string) => {
    switch (severidade) {
      case 'baixa': return 'bg-green-100 text-green-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'alta': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      layout
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getSeveridadeColor(alerta.severidade)}`}>
            {alerta.tipo === 'mercado' && <Activity className="w-5 h-5" />}
            {alerta.tipo === 'portfolio' && <PieChart className="w-5 h-5" />}
            {alerta.tipo === 'objetivo' && <Target className="w-5 h-5" />}
            {alerta.tipo === 'risco' && <AlertTriangle className="w-5 h-5" />}
            {alerta.tipo === 'oportunidade' && <TrendingUp className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">
              {alerta.titulo}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {alerta.tipo.charAt(0).toUpperCase() + alerta.tipo.slice(1)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!alerta.visualizado && (
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          )}
          <button
            onClick={onDesativar}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4">
        {alerta.mensagem}
      </p>

      {Object.keys(alerta.dadosRelevantes).length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
            Dados Relevantes
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(alerta.dadosRelevantes).map(([key, value]) => (
              <div key={key}>
                <span className="text-gray-600 dark:text-gray-400">
                  {key.replace('_', ' ')}:
                </span>
                <span className="ml-1 font-medium">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {alerta.acoesSugeridas.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
            Ações Sugeridas
          </h4>
          <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
            {alerta.acoesSugeridas.map((acao, index) => (
              <li key={index}>{acao}</li>
            ))}
          </ul>
        </div>
      )}

      {!alerta.visualizado && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onMarcarVisualizado}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Marcar como visualizado
          </button>
        </div>
      )}
    </motion.div>
  );
};

// Componente para exibir o perfil do investidor
const PerfilDisplay: React.FC<{
  perfil: any;
  onEditar: () => void;
}> = ({ perfil, onEditar }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Perfil do Investidor
        </h3>
        <button
          onClick={onEditar}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Editar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Informações Básicas
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Nome:</span>
              <span className="font-medium">{perfil.nome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Idade:</span>
              <span className="font-medium">{perfil.idade} anos</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Renda Mensal:</span>
              <span className="font-medium">
                R$ {perfil.rendaMensal.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Patrimônio:</span>
              <span className="font-medium">
                R$ {perfil.patrimonioAtual.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Perfil de Investimento
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tolerância ao Risco:</span>
              <span className="font-medium capitalize">{perfil.toleranciaRisco}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Horizonte Temporal:</span>
              <span className="font-medium">{perfil.horizonteTemporal} anos</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Experiência:</span>
              <span className="font-medium capitalize">{perfil.experienciaInvestimentos}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Situação Familiar:</span>
              <span className="font-medium capitalize">{perfil.situacaoFamiliar}</span>
            </div>
          </div>
        </div>
      </div>

      {perfil.objetivos && perfil.objetivos.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Objetivos Financeiros
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {perfil.objetivos.map((objetivo: any, index: number) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{objetivo.descricao}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    objetivo.prioridade === 'alta' ? 'bg-red-100 text-red-800' :
                    objetivo.prioridade === 'media' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {objetivo.prioridade}
                  </span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Meta: R$ {objetivo.valorMeta.toLocaleString('pt-BR')} em {objetivo.prazo} meses
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para exibir análise de risco
const AnaliseRiscoDisplay: React.FC<{
  analise: AnaliseRiscoIA;
}> = ({ analise }) => {
  const getRiscoColor = (classificacao: string) => {
    switch (classificacao) {
      case 'muito_baixo': return 'text-green-600';
      case 'baixo': return 'text-green-500';
      case 'medio': return 'text-yellow-600';
      case 'alto': return 'text-orange-600';
      case 'muito_alto': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Resumo da Análise */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Análise de Risco do Portfólio
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getRiscoColor(analise.classificacao)}`}>
              {analise.pontuacaoRisco.toFixed(0)}
            </div>
            <div className="text-sm text-gray-500">Pontuação de Risco</div>
            <div className={`text-sm font-medium ${getRiscoColor(analise.classificacao)}`}>
              {analise.classificacao.replace('_', ' ').toUpperCase()}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {analise.diversificacaoAtual.toFixed(0)}%
            </div>
            <div className="text-sm text-gray-500">Diversificação</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {(analise.volatilidade * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">Volatilidade</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Métricas de Risco
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Probabilidade de Perda:</span>
                <span className="font-medium">{analise.probabilidadePerda.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Perda Máxima Estimada:</span>
                <span className="font-medium">
                  R$ {analise.perdaMaximaEstimada.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Correlação entre Ativos:</span>
                <span className="font-medium">{(analise.correlacaoAtivos * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sharpe Ratio:</span>
                <span className="font-medium">{analise.sharpeRatio.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Recomendações de Mitigação
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
              {analise.recomendacoesMitigacao.map((recomendacao, index) => (
                <li key={index}>{recomendacao}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Fatores de Risco */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Fatores de Risco Identificados
        </h3>
        
        <div className="space-y-4">
          {analise.fatoresRisco.map((fator, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {fator.nome}
                </h4>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                    Impacto: {fator.impacto}
                  </span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                    Peso: {(fator.peso * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                {fator.descricao}
              </p>
              
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {fator.descricao}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente para configurações da IA
const ConfiguracoesIA: React.FC<{
  configuracao: any;
  onAtualizarConfiguracao: (config: any) => void;
  onResetar: () => void;
}> = ({ configuracao, onAtualizarConfiguracao, onResetar }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Configurações da IA
      </h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Frequência de Análise
          </label>
          <select
            value={configuracao.frequenciaAnalise}
            onChange={(e) => onAtualizarConfiguracao({ 
              frequenciaAnalise: e.target.value as any 
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="diaria">Diária</option>
            <option value="semanal">Semanal</option>
            <option value="mensal">Mensal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Limite de Recomendações
          </label>
          <input
            type="number"
            value={configuracao.limiteRecomendacoes}
            onChange={(e) => onAtualizarConfiguracao({ 
              limiteRecomendacoes: Number(e.target.value) 
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            min="1"
            max="20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nível de Detalhamento
          </label>
          <select
            value={configuracao.nivelDetalhamento}
            onChange={(e) => onAtualizarConfiguracao({ 
              nivelDetalhamento: e.target.value as any 
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="basico">Básico</option>
            <option value="intermediario">Intermediário</option>
            <option value="avancado">Avançado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Modelo de Risco
          </label>
          <select
            value={configuracao.modeloRisco}
            onChange={(e) => onAtualizarConfiguracao({ 
              modeloRisco: e.target.value as any 
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="conservador">Conservador</option>
            <option value="moderado">Moderado</option>
            <option value="agressivo">Agressivo</option>
          </select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Alertas Ativos
            </label>
            <button
              onClick={() => onAtualizarConfiguracao({ 
                alertasAtivos: !configuracao.alertasAtivos 
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                configuracao.alertasAtivos ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  configuracao.alertasAtivos ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Considerar Impacto Fiscal
            </label>
            <button
              onClick={() => onAtualizarConfiguracao({ 
                considerarFiscal: !configuracao.considerarFiscal 
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                configuracao.considerarFiscal ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  configuracao.considerarFiscal ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Considerar Liquidez
            </label>
            <button
              onClick={() => onAtualizarConfiguracao({ 
                considerarLiquidez: !configuracao.considerarLiquidez 
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                configuracao.considerarLiquidez ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  configuracao.considerarLiquidez ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onResetar}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Resetar Configurações da IA
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente de formulário de perfil
const PerfilForm: React.FC<{
  perfil?: any | null;
  onSalvar: (perfil: any) => void;
  onCancelar: () => void;
}> = ({ perfil, onSalvar, onCancelar }) => {
  const [formData, setFormData] = useState({
    nome: perfil?.nome || '',
    idade: perfil?.idade || 30,
    rendaMensal: perfil?.rendaMensal || 5000,
    patrimonioAtual: perfil?.patrimonioAtual || 50000,
    toleranciaRisco: perfil?.toleranciaRisco || 'moderado' as const,
    horizonteTemporal: perfil?.horizonteTemporal || 5,
    experienciaInvestimentos: perfil?.experienciaInvestimentos || 'intermediario' as const,
    situacaoFamiliar: perfil?.situacaoFamiliar || 'solteiro' as const,
    preferenciasInvestimento: perfil?.preferenciasInvestimento || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSalvar(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {perfil ? 'Editar Perfil' : 'Criar Perfil do Investidor'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Idade
            </label>
            <input
              type="number"
              value={formData.idade}
              onChange={(e) => setFormData(prev => ({ ...prev, idade: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              min="18"
              max="100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Renda Mensal (R$)
            </label>
            <input
              type="number"
              value={formData.rendaMensal}
              onChange={(e) => setFormData(prev => ({ ...prev, rendaMensal: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Patrimônio Atual (R$)
            </label>
            <input
              type="number"
              value={formData.patrimonioAtual}
              onChange={(e) => setFormData(prev => ({ ...prev, patrimonioAtual: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tolerância ao Risco
            </label>
            <select
              value={formData.toleranciaRisco}
              onChange={(e) => setFormData(prev => ({ ...prev, toleranciaRisco: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="conservador">Conservador</option>
              <option value="moderado">Moderado</option>
              <option value="arrojado">Arrojado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Horizonte Temporal (anos)
            </label>
            <input
              type="number"
              value={formData.horizonteTemporal}
              onChange={(e) => setFormData(prev => ({ ...prev, horizonteTemporal: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              min="1"
              max="50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Experiência
            </label>
            <select
              value={formData.experienciaInvestimentos}
              onChange={(e) => setFormData(prev => ({ ...prev, experienciaInvestimentos: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Situação Familiar
            </label>
            <select
              value={formData.situacaoFamiliar}
              onChange={(e) => setFormData(prev => ({ ...prev, situacaoFamiliar: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="solteiro">Solteiro</option>
              <option value="casado">Casado</option>
              <option value="filhos">Com Filhos</option>
              <option value="aposentado">Aposentado</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {perfil ? 'Atualizar Perfil' : 'Criar Perfil'}
          </button>
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default RecomendacoesIA;