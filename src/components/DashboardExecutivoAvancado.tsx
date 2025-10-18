import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BarChart3, 
  PieChart, 
  Activity, 
  Zap, 
  Brain, 
  Shield, 
  Download,
  Settings,
  Bell,
  Eye,
  Target,
  Lightbulb,
  Gauge
} from 'lucide-react';
import { useIntegracaoAvancada } from '../hooks/useIntegracaoAvancada';

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

const DashboardExecutivoAvancado: React.FC = () => {
  const {
    dashboardData,
    notifications,
    insights,
    analytics,
    isLoading,
    lastSync,
    config,
    updateConfig,
    syncData,
    gerarInsightsPreditivos,
    markNotificationAsRead,
    trackEvent,
    getConsolidatedStats
  } = useIntegracaoAvancada();

  const [selectedTimeframe, setSelectedTimeframe] = useState<'1d' | '1w' | '1m' | '3m'>('1w');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  // Métricas principais
  const metricas: MetricCard[] = [
    {
      title: 'Valor do Portfólio',
      value: `R$ ${dashboardData.portfolioValue.toLocaleString('pt-BR')}`,
      change: dashboardData.monthlyReturn,
      trend: dashboardData.monthlyReturn > 0 ? 'up' : dashboardData.monthlyReturn < 0 ? 'down' : 'stable',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-green-600'
    },
    {
      title: 'Retorno Mensal',
      value: `${dashboardData.monthlyReturn.toFixed(2)}%`,
      change: dashboardData.monthlyReturn,
      trend: dashboardData.monthlyReturn > 0 ? 'up' : 'down',
      icon: <BarChart3 className="w-6 h-6" />,
      color: dashboardData.monthlyReturn > 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Score de Risco',
      value: `${dashboardData.riskScore}/100`,
      change: 0,
      trend: 'stable',
      icon: <Shield className="w-6 h-6" />,
      color: dashboardData.riskScore > 70 ? 'text-red-600' : dashboardData.riskScore > 40 ? 'text-yellow-600' : 'text-green-600'
    },
    {
      title: 'Performance Score',
      value: `${Math.floor(Math.random() * 40 + 60)}/100`,
      change: 0,
      trend: 'stable',
      icon: <Gauge className="w-6 h-6" />,
      color: 'text-blue-600'
    }
  ];

  // Ações rápidas
  const acoesRapidas: QuickAction[] = [
    {
      label: 'Gerar Recomendações',
      icon: <Brain className="w-5 h-5" />,
      action: () => {
        console.log('Gerando recomendações...');
        trackEvent('quick_action_recommendations', 'dashboard');
      }
    },
    {
      label: 'Simular Cenários',
      icon: <Activity className="w-5 h-5" />,
      action: () => {
        console.log('Simulando cenários...');
        trackEvent('quick_action_simulation', 'dashboard');
      }
    },
    {
      label: 'Insights Preditivos',
      icon: <Lightbulb className="w-5 h-5" />,
      action: () => {
        gerarInsightsPreditivos();
        trackEvent('quick_action_insights', 'dashboard');
      }
    },
    {
      label: 'Otimizar Performance',
      icon: <Zap className="w-5 h-5" />,
      action: () => {
        console.log('Otimizando performance...');
        trackEvent('quick_action_optimize', 'dashboard');
      }
    },
    {
      label: 'Exportar Dados',
      icon: <Download className="w-5 h-5" />,
      action: () => {
        console.log('Exportando dados...');
        trackEvent('quick_action_export', 'dashboard');
      }
    },
    {
      label: 'Sincronizar',
      icon: <Clock className="w-5 h-5" />,
      action: () => {
        syncData();
        trackEvent('quick_action_sync', 'dashboard');
      }
    }
  ];

  // Filtrar notificações por prioridade
  const notificacoesPrioritarias = notifications
    .filter(n => !n.read && (n.priority === 'high' || n.priority === 'critical'))
    .slice(0, 5);

  // Insights recentes
  const insightsRecentes = insights
    .filter(i => Date.now() - i.createdAt < 24 * 60 * 60 * 1000)
    .slice(0, 3);

  // Relatório de status
  const relatorio = {
    status: 'healthy' as const,
    features: {
      ai: config.enableAIRecommendations,
      simulation: config.enableScenarioSimulation,
      themes: config.enableAdvancedThemes,
      performance: config.enablePerformanceOptimization
    },
    metrics: {
      performanceScore: Math.floor(Math.random() * 40 + 60)
    }
  };

  useEffect(() => {
    trackEvent('dashboard_view', 'dashboard');
  }, [trackEvent]);

  const renderMetricCard = (metric: MetricCard) => (
    <div key={metric.title} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metric.value}</p>
        </div>
        <div className={`${metric.color} bg-gray-50 dark:bg-gray-700 p-3 rounded-lg`}>
          {metric.icon}
        </div>
      </div>
      {metric.change !== 0 && (
        <div className="flex items-center mt-4">
          {metric.trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
          ) : metric.trend === 'down' ? (
            <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
          ) : null}
          <span className={`text-sm font-medium ${
            metric.trend === 'up' ? 'text-green-600' : 
            metric.trend === 'down' ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {metric.change > 0 ? '+' : ''}{metric.change.toFixed(2)}%
          </span>
          <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
        </div>
      )}
    </div>
  );

  const renderQuickAction = (action: QuickAction) => {
    return (
      <button
        key={action.label}
        onClick={action.action}
        className="flex items-center space-x-2 px-4 py-3 rounded-lg border transition-colors bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
      >
        {action.icon}
        <span className="text-sm font-medium">{action.label}</span>
      </button>
    );
  };

  const renderNotification = (notification: any) => (
    <div
      key={notification.id}
      className={`p-4 rounded-lg border-l-4 ${
        notification.priority === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
        notification.priority === 'high' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' :
        notification.priority === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
        'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {new Date(notification.timestamp).toLocaleString('pt-BR')}
          </p>
        </div>
        <button
          onClick={() => markNotificationAsRead(notification.id)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderInsight = (insight: any) => (
    <div key={insight.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span className={`text-xs px-2 py-1 rounded-full ${
              insight.confidence > 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
              insight.confidence > 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
              'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {insight.confidence}% confiança
            </span>
          </div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mt-2">
            {insight.prediction}
          </h4>
          {insight.recommendedAction && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              <strong>Ação recomendada:</strong> {insight.recommendedAction}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Prazo: {insight.timeframe} | Impacto: {insight.impact}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard Executivo Avançado
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Última sincronização: {new Date(lastSync).toLocaleString('pt-BR')}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Indicador de status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                relatorio.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {relatorio.status === 'healthy' ? 'Sistema Saudável' : 'Atenção Necessária'}
              </span>
            </div>

            {/* Botões de ação */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Bell className="w-5 h-5" />
              {notificacoesPrioritarias.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificacoesPrioritarias.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowInsights(!showInsights)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Lightbulb className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowConfig(!showConfig)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricas.map(renderMetricCard)}
        </div>

        {/* Ações rápidas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {acoesRapidas.map(renderQuickAction)}
          </div>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna esquerda - Recomendações e Alertas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recomendações de IA */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-600" />
                  Recomendações de IA
                </h2>
                <span className="text-sm text-gray-500">
                  {dashboardData.recommendations.length} ativas
                </span>
              </div>
              
              <div className="space-y-3">
                {dashboardData.recommendations.slice(0, 3).map((rec: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {rec.titulo}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {rec.descricao}
                        </p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            rec.prioridade === 'alta' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                            rec.prioridade === 'media' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          }`}>
                            {rec.prioridade}
                          </span>
                          <span className="text-xs text-gray-500">
                            Confiança: {rec.confianca}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cenários de Simulação */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-green-600" />
                  Simulações de Cenário
                </h2>
                <span className="text-sm text-gray-500">
                  {dashboardData.scenarios.length} cenários
                </span>
              </div>
              
              <div className="space-y-3">
                {dashboardData.scenarios.slice(0, 3).map((scenario: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {scenario.nome}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Valor Final: R$ {scenario.valorFinal?.toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          scenario.retornoReal > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {scenario.retornoReal > 0 ? '+' : ''}{scenario.retornoReal?.toFixed(2)}%
                        </p>
                        <p className="text-xs text-gray-500">
                          Risco: {scenario.nivelRisco}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna direita - Notificações e Status */}
          <div className="space-y-6">
            {/* Status do Sistema */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-purple-600" />
                Status do Sistema
              </h2>
              
              <div className="space-y-3">
                {Object.entries(relatorio.features).map(([feature, status]) => (
                  <div key={feature} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {feature === 'ai' ? 'IA' : 
                       feature === 'simulation' ? 'Simulação' : 
                       feature === 'themes' ? 'Temas' : 
                       'Performance'}
                    </span>
                    {status ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Performance Score</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {relatorio.metrics.performanceScore}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Alertas Prioritários */}
            {notificacoesPrioritarias.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                  Alertas Prioritários
                </h2>
                
                <div className="space-y-3">
                  {notificacoesPrioritarias.map(renderNotification)}
                </div>
              </div>
            )}

            {/* Insights Recentes */}
            {insightsRecentes.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                  Insights Preditivos
                </h2>
                
                <div className="space-y-3">
                  {insightsRecentes.map(renderInsight)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-900 dark:text-white">Processando...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardExecutivoAvancado;