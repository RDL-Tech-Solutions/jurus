import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  Settings,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Share2,
  Printer,
  RefreshCw,
  Target,
  DollarSign,
  Activity,
  Users,
  Building
} from 'lucide-react';

interface RelatoriosAvancadosProps {
  simulacao?: any;
}

interface TipoRelatorio {
  id: string;
  nome: string;
  descricao: string;
  icon: React.ComponentType<any>;
  categoria: 'performance' | 'risco' | 'compliance' | 'estrategico';
  tempoGeracao: string;
  formatos: string[];
}

interface RelatorioGerado {
  id: string;
  tipo: string;
  nome: string;
  dataGeracao: Date;
  status: 'gerando' | 'concluido' | 'erro';
  tamanho: string;
  formato: string;
  url?: string;
}

interface ConfiguracaoRelatorio {
  periodo: string;
  formato: string;
  incluirGraficos: boolean;
  incluirBenchmarks: boolean;
  incluirRecomendacoes: boolean;
  incluirRiscos: boolean;
  frequenciaAutomatica?: string;
  emailDestino?: string;
}

const RelatoriosAvancados: React.FC<RelatoriosAvancadosProps> = ({ simulacao }) => {
  const [tipoSelecionado, setTipoSelecionado] = useState<string>('');
  const [configuracao, setConfiguracao] = useState<ConfiguracaoRelatorio>({
    periodo: '12m',
    formato: 'pdf',
    incluirGraficos: true,
    incluirBenchmarks: true,
    incluirRecomendacoes: true,
    incluirRiscos: true
  });
  const [relatoriosGerados, setRelatoriosGerados] = useState<RelatorioGerado[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');

  // Tipos de relatórios disponíveis
  const tiposRelatorios: TipoRelatorio[] = [
    {
      id: 'performance_completo',
      nome: 'Relatório de Performance Completo',
      descricao: 'Análise detalhada de performance com benchmarks e métricas avançadas',
      icon: TrendingUp,
      categoria: 'performance',
      tempoGeracao: '3-5 min',
      formatos: ['pdf', 'excel', 'powerpoint']
    },
    {
      id: 'analise_risco',
      nome: 'Análise de Risco Avançada',
      descricao: 'VaR, stress testing, correlações e análise de cenários',
      icon: AlertCircle,
      categoria: 'risco',
      tempoGeracao: '5-8 min',
      formatos: ['pdf', 'excel']
    },
    {
      id: 'compliance_regulatorio',
      nome: 'Relatório de Compliance',
      descricao: 'Adequação regulatória, limites e políticas de investimento',
      icon: CheckCircle,
      categoria: 'compliance',
      tempoGeracao: '2-3 min',
      formatos: ['pdf', 'word']
    },
    {
      id: 'estrategico_executivo',
      nome: 'Relatório Estratégico Executivo',
      descricao: 'Visão estratégica para tomada de decisão executiva',
      icon: Target,
      categoria: 'estrategico',
      tempoGeracao: '4-6 min',
      formatos: ['pdf', 'powerpoint']
    },
    {
      id: 'alocacao_setorial',
      nome: 'Análise de Alocação Setorial',
      descricao: 'Distribuição setorial, concentrações e oportunidades',
      icon: PieChart,
      categoria: 'performance',
      tempoGeracao: '2-4 min',
      formatos: ['pdf', 'excel']
    },
    {
      id: 'benchmark_comparativo',
      nome: 'Benchmark Comparativo',
      descricao: 'Comparação detalhada com índices e carteiras modelo',
      icon: BarChart3,
      categoria: 'performance',
      tempoGeracao: '3-5 min',
      formatos: ['pdf', 'excel', 'powerpoint']
    },
    {
      id: 'due_diligence',
      nome: 'Due Diligence de Fundos',
      descricao: 'Análise qualitativa e quantitativa de fundos de investimento',
      icon: Building,
      categoria: 'risco',
      tempoGeracao: '8-12 min',
      formatos: ['pdf', 'word']
    },
    {
      id: 'cliente_personalizado',
      nome: 'Relatório Personalizado para Cliente',
      descricao: 'Relatório customizado com branding e conteúdo específico',
      icon: Users,
      categoria: 'estrategico',
      tempoGeracao: '5-10 min',
      formatos: ['pdf', 'powerpoint', 'word']
    }
  ];

  const relatoriosFiltrados = useMemo(() => {
    if (filtroCategoria === 'todos') return tiposRelatorios;
    return tiposRelatorios.filter(relatorio => relatorio.categoria === filtroCategoria);
  }, [filtroCategoria]);

  const handleGerarRelatorio = async () => {
    if (!tipoSelecionado) return;

    setIsGenerating(true);
    
    const novoRelatorio: RelatorioGerado = {
      id: Date.now().toString(),
      tipo: tipoSelecionado,
      nome: tiposRelatorios.find(t => t.id === tipoSelecionado)?.nome || '',
      dataGeracao: new Date(),
      status: 'gerando',
      tamanho: '',
      formato: configuracao.formato,
    };

    setRelatoriosGerados(prev => [novoRelatorio, ...prev]);

    // Simular geração do relatório
    setTimeout(() => {
      setRelatoriosGerados(prev => 
        prev.map(rel => 
          rel.id === novoRelatorio.id 
            ? { ...rel, status: 'concluido', tamanho: '2.4 MB', url: '#' }
            : rel
        )
      );
      setIsGenerating(false);
    }, 3000);
  };

  const handleDownload = (relatorio: RelatorioGerado) => {
    // Simular download
    console.log(`Baixando relatório: ${relatorio.nome}`);
  };

  const handleShare = (relatorio: RelatorioGerado) => {
    // Simular compartilhamento
    console.log(`Compartilhando relatório: ${relatorio.nome}`);
  };

  const handlePrint = (relatorio: RelatorioGerado) => {
    // Simular impressão
    console.log(`Imprimindo relatório: ${relatorio.nome}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Relatórios Avançados
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gere relatórios profissionais personalizados com análises detalhadas
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Atualizar</span>
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoria:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['todos', 'performance', 'risco', 'compliance', 'estrategico'].map((categoria) => (
              <button
                key={categoria}
                onClick={() => setFiltroCategoria(categoria)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filtroCategoria === categoria
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {categoria === 'todos' ? 'Todos' : categoria.charAt(0).toUpperCase() + categoria.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seleção de Relatório */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Tipos de Relatório
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatoriosFiltrados.map((tipo) => (
                <motion.div
                  key={tipo.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    tipoSelecionado === tipo.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  onClick={() => setTipoSelecionado(tipo.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      tipoSelecionado === tipo.id
                        ? 'bg-blue-100 dark:bg-blue-800'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <tipo.icon className={`w-5 h-5 ${
                        tipoSelecionado === tipo.id
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                          {tipo.nome}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {tipo.descricao}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {tipo.tempoGeracao}
                        </span>
                        <div className="flex space-x-1">
                          {tipo.formatos.map((formato) => (
                            <span
                              key={formato}
                              className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs"
                            >
                              {formato.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Configurações */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Configurações
            </h2>
            
            <div className="space-y-4">
              {/* Período */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Período
                </label>
                <select
                  value={configuracao.periodo}
                  onChange={(e) => setConfiguracao(prev => ({ ...prev, periodo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="1m">Último mês</option>
                  <option value="3m">Últimos 3 meses</option>
                  <option value="6m">Últimos 6 meses</option>
                  <option value="12m">Último ano</option>
                  <option value="24m">Últimos 2 anos</option>
                  <option value="custom">Período customizado</option>
                </select>
              </div>

              {/* Formato */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Formato
                </label>
                <select
                  value={configuracao.formato}
                  onChange={(e) => setConfiguracao(prev => ({ ...prev, formato: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="powerpoint">PowerPoint</option>
                  <option value="word">Word</option>
                </select>
              </div>

              {/* Opções */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Incluir no relatório:
                </label>
                
                {[
                  { key: 'incluirGraficos', label: 'Gráficos e visualizações' },
                  { key: 'incluirBenchmarks', label: 'Comparações com benchmarks' },
                  { key: 'incluirRecomendacoes', label: 'Recomendações' },
                  { key: 'incluirRiscos', label: 'Análise de riscos' }
                ].map((opcao) => (
                  <label key={opcao.key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={configuracao[opcao.key as keyof ConfiguracaoRelatorio] as boolean}
                      onChange={(e) => setConfiguracao(prev => ({ 
                        ...prev, 
                        [opcao.key]: e.target.checked 
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {opcao.label}
                    </span>
                  </label>
                ))}
              </div>

              {/* Botão Gerar */}
              <button
                onClick={handleGerarRelatorio}
                disabled={!tipoSelecionado || isGenerating}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gerando...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Gerar Relatório</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Relatórios Gerados */}
      {relatoriosGerados.length > 0 && (
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Relatórios Gerados
            </h2>
            
            <div className="space-y-3">
              {relatoriosGerados.map((relatorio) => (
                <motion.div
                  key={relatorio.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      relatorio.status === 'concluido' ? 'bg-green-100 dark:bg-green-900' :
                      relatorio.status === 'gerando' ? 'bg-yellow-100 dark:bg-yellow-900' :
                      'bg-red-100 dark:bg-red-900'
                    }`}>
                      {relatorio.status === 'concluido' ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : relatorio.status === 'gerando' ? (
                        <RefreshCw className="w-5 h-5 text-yellow-600 dark:text-yellow-400 animate-spin" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {relatorio.nome}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{relatorio.dataGeracao.toLocaleDateString()}</span>
                        <span>{relatorio.formato.toUpperCase()}</span>
                        {relatorio.tamanho && <span>{relatorio.tamanho}</span>}
                      </div>
                    </div>
                  </div>
                  
                  {relatorio.status === 'concluido' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownload(relatorio)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleShare(relatorio)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Compartilhar"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePrint(relatorio)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Imprimir"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatoriosAvancados;