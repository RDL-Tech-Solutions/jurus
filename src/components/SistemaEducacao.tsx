// Sistema de Educação Financeira

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Lightbulb,
  Trophy,
  User,
  Search,
  Filter,
  Clock,
  Star,
  Play,
  CheckCircle,
  Target,
  TrendingUp,
  Award,
  Calendar,
  BarChart3,
  Brain,
  Zap,
  FileText,
  Video,
  Calculator,
  GraduationCap,
  Layers,
  PiggyBank,
  CreditCard,
  Shield,
  DollarSign
} from 'lucide-react';
import useEducacao from '../hooks/useEducacao';
import useGamification from '../hooks/useGamification';
import {
  TutorialInterativo,
  ArtigoEducativo,
  TermoGlossario,
  DicaFinanceira
} from '../types/educacao';
import RecursosInterativos from './educacao/RecursosInterativos';

// Módulos de Aprendizado
const MODULOS_APRENDIZADO = [
  {
    id: 'fundamentos',
    titulo: 'Fundamentos de Educação Financeira',
    descricao: 'Conceitos básicos que todo brasileiro deveria conhecer sobre dinheiro',
    icone: BookOpen,
    cor: 'blue',
    nivel: 'iniciante' as const,
    duracao: 120,
    topicos: [
      'O que é educação financeira',
      'Renda vs. Patrimônio',
      'Fluxo de caixa pessoal',
      'Juros simples vs. compostos',
      'Inflação e poder de compra'
    ],
    prerequisitos: [],
    recursos: {
      artigos: 5,
      videos: 3,
      quizzes: 2,
      calculadoras: 1
    },
    progresso: 0
  },
  {
    id: 'orcamento',
    titulo: 'Orçamento Pessoal e Familiar',
    descricao: 'Aprenda a criar e manter um orçamento eficiente para suas finanças',
    icone: Calculator,
    cor: 'green',
    nivel: 'iniciante' as const,
    duracao: 90,
    topicos: [
      'Como calcular sua renda líquida',
      'Categorização de gastos',
      'Regra 50-30-20',
      'Ferramentas de controle',
      'Ajustes e monitoramento'
    ],
    prerequisitos: ['fundamentos'],
    recursos: {
      artigos: 4,
      videos: 2,
      quizzes: 3,
      calculadoras: 2
    },
    progresso: 0
  },
  {
    id: 'poupanca',
    titulo: 'Poupança e Reserva de Emergência',
    descricao: 'Construa sua segurança financeira com estratégias de poupança',
    icone: PiggyBank,
    cor: 'purple',
    nivel: 'iniciante' as const,
    duracao: 75,
    topicos: [
      'Importância da reserva de emergência',
      'Quanto guardar',
      'Onde investir a reserva',
      'Estratégias de poupança',
      'Automatização de aportes'
    ],
    prerequisitos: ['orcamento'],
    recursos: {
      artigos: 3,
      videos: 4,
      quizzes: 2,
      calculadoras: 3
    },
    progresso: 0
  },
  {
    id: 'investimentos',
    titulo: 'Investimentos Básicos',
    descricao: 'Primeiros passos no mundo dos investimentos',
    icone: TrendingUp,
    cor: 'orange',
    nivel: 'intermediario' as const,
    duracao: 150,
    topicos: [
      'Tipos de investimentos',
      'Renda fixa vs. variável',
      'Perfil de investidor',
      'Diversificação',
      'Primeiros investimentos'
    ],
    prerequisitos: ['poupanca'],
    recursos: {
      artigos: 6,
      videos: 5,
      quizzes: 4,
      calculadoras: 4
    },
    progresso: 0
  },
  {
    id: 'dividas',
    titulo: 'Controle de Dívidas',
    descricao: 'Estratégias para quitar dívidas e evitar o endividamento',
    icone: CreditCard,
    cor: 'red',
    nivel: 'intermediario' as const,
    duracao: 100,
    topicos: [
      'Tipos de dívidas',
      'Estratégias de quitação',
      'Renegociação',
      'Prevenção do endividamento',
      'Uso consciente do crédito'
    ],
    prerequisitos: ['orcamento'],
    recursos: {
      artigos: 4,
      videos: 3,
      quizzes: 3,
      calculadoras: 2
    },
    progresso: 0
  },
  {
    id: 'aposentadoria',
    titulo: 'Planejamento para Aposentadoria',
    descricao: 'Prepare-se para uma aposentadoria tranquila e confortável',
    icone: Shield,
    cor: 'indigo',
    nivel: 'avancado' as const,
    duracao: 180,
    topicos: [
      'Previdência Social vs. Privada',
      'Cálculo da aposentadoria',
      'Estratégias de longo prazo',
      'Investimentos para aposentadoria',
      'Planejamento sucessório'
    ],
    prerequisitos: ['investimentos'],
    recursos: {
      artigos: 7,
      videos: 6,
      quizzes: 3,
      calculadoras: 5
    },
    progresso: 0
  }
];

const SistemaEducacao: React.FC = () => {
  const {
    glossario,
    dicas,
    tutoriais,
    artigos,
    conquistas,
    perfil,
    sessaoAtual,
    estatisticas,
    conquistasDesbloqueadas,
    proximasConquistas,
    obterRecomendacoes,
    obterDicasContextuais,
    obterPlanoEstudos,
    obterProgressoAprendizado,
    iniciarSessao,
    finalizarSessao,
    completarTutorial,
    lerArtigo,
    setTutorialAtivo,
    tutorialAtivo
  } = useEducacao();

  // Hook de gamificação
  const {
    userProgress,
    badges,
    addXP,
    completeModule,
    getXPForNextLevel,
    getLevelFromXP
  } = useGamification();

  // Estados da interface
  const [abaSelecionada, setAbaSelecionada] = useState<string>('home');
  const [termoPesquisa, setTermoPesquisa] = useState<string>('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');
  const [filtroNivel, setFiltroNivel] = useState<string>('');
  const [tutorialSelecionado, setTutorialSelecionado] = useState<TutorialInterativo | null>(null);
  const [artigoSelecionado, setArtigoSelecionado] = useState<ArtigoEducativo | null>(null);
  const [moduloSelecionado, setModuloSelecionado] = useState<string | null>(null);
  const [recursoInterativo, setRecursoInterativo] = useState<'artigos' | 'videos' | 'quizzes' | 'calculadoras' | null>(null);

  // Dados computados
  const recomendacoes = useMemo(() => obterRecomendacoes(), [obterRecomendacoes]);
  const dicasContextuais = useMemo(() => obterDicasContextuais('geral'), [obterDicasContextuais]);
  const planoEstudos = useMemo(() => obterPlanoEstudos(), [obterPlanoEstudos]);
  const progressoAprendizado = useMemo(() => obterProgressoAprendizado(), [obterProgressoAprendizado]);

  // Filtrar dados baseado na pesquisa e filtros
  const dadosFiltrados = useMemo(() => {
    const filtrarPorTexto = (items: any[], campos: string[]) => {
      if (!termoPesquisa) return items;
      return items.filter(item =>
        campos.some(campo =>
          item[campo]?.toLowerCase().includes(termoPesquisa.toLowerCase())
        )
      );
    };

    const filtrarPorCategoria = (items: any[]) => {
      if (!filtroCategoria) return items;
      return items.filter(item => item.categoria === filtroCategoria);
    };

    const filtrarPorNivel = (items: any[]) => {
      if (!filtroNivel) return items;
      return items.filter(item => item.nivel === filtroNivel);
    };

    return {
      glossario: filtrarPorCategoria(filtrarPorTexto(glossario, ['termo', 'definicao'])),
      dicas: filtrarPorNivel(filtrarPorCategoria(filtrarPorTexto(dicas, ['titulo', 'conteudo']))),
      tutoriais: filtrarPorNivel(filtrarPorCategoria(filtrarPorTexto(tutoriais, ['titulo', 'descricao']))),
      artigos: filtrarPorNivel(filtrarPorCategoria(filtrarPorTexto(artigos, ['titulo', 'resumo'])))
    };
  }, [glossario, dicas, tutoriais, artigos, termoPesquisa, filtroCategoria, filtroNivel]);

  // Função para iniciar uma sessão de estudo
  const handleIniciarSessao = () => {
    if (!sessaoAtual) {
      iniciarSessao();
    }
  };

  // Função para finalizar sessão
  const handleFinalizarSessao = () => {
    if (sessaoAtual) {
      finalizarSessao();
    }
  };

  // Função para completar tutorial
  const handleCompletarTutorial = (tutorialId: string) => {
    completarTutorial(tutorialId);
    setTutorialSelecionado(null);
  };

  // Função para ler artigo
  const handleLerArtigo = (artigoId: string) => {
    lerArtigo(artigoId);
    setArtigoSelecionado(null);
  };

  if (!perfil || !estatisticas) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando sistema de educação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header com estatísticas do usuário */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold mb-2">Sistema de Educação Financeira</h1>
            <p className="text-blue-100">
              Aprenda sobre investimentos e construa seu conhecimento financeiro
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{userProgress.level}</div>
              <div className="text-sm text-blue-100">Nível</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{userProgress.xp}</div>
              <div className="text-sm text-blue-100">XP Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{badges.length}</div>
              <div className="text-sm text-blue-100">Badges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{userProgress.streakDays}</div>
              <div className="text-sm text-blue-100">Sequência</div>
            </div>
          </div>
        </div>

        {/* Barra de progresso do nível */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Progresso do Nível {userProgress.level}</span>
            <span>{userProgress.xp}/{getXPForNextLevel(userProgress.level)} XP</span>
          </div>
          <div className="w-full bg-blue-500/30 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ 
                width: `${Math.min(100, (userProgress.xp / getXPForNextLevel(userProgress.level)) * 100)}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Controle de Sessão */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${sessaoAtual ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="font-medium text-gray-900 dark:text-white">
              {sessaoAtual ? 'Sessão de Estudo Ativa' : 'Nenhuma Sessão Ativa'}
            </span>
            {sessaoAtual && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round((Date.now() - sessaoAtual.inicio) / 1000 / 60)} min
              </span>
            )}
          </div>
          <button
            onClick={sessaoAtual ? handleFinalizarSessao : handleIniciarSessao}
            className={`px-4 py-2 rounded-lg font-medium ${
              sessaoAtual
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {sessaoAtual ? 'Finalizar Sessão' : 'Iniciar Sessão'}
          </button>
        </div>
      </div>

      {/* Navegação por abas */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          {/* Gradiente de fade para indicar scroll no mobile */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none sm:hidden"></div>
          
          <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto scrollbar-hide pb-0">
            {[
              { id: 'home', label: 'Início', icon: BookOpen },
              { id: 'modulos', label: 'Módulos', icon: Layers },
              { id: 'recursos', label: 'Recursos', icon: GraduationCap },
              { id: 'gamificacao', label: 'Gamificação', icon: Trophy },
              { id: 'plano', label: 'Plano de Estudos', icon: Target },
              { id: 'progresso', label: 'Progresso', icon: TrendingUp },
              { id: 'glossario', label: 'Glossário', icon: BookOpen },
              { id: 'dicas', label: 'Dicas', icon: Lightbulb },
              { id: 'tutoriais', label: 'Tutoriais', icon: Play },
              { id: 'artigos', label: 'Artigos', icon: BookOpen },
              { id: 'conquistas', label: 'Conquistas', icon: Award },
              { id: 'perfil', label: 'Perfil', icon: User }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setAbaSelecionada(id)}
                className={`flex items-center space-x-1 sm:space-x-2 py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                  abaSelecionada === id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden xs:inline sm:inline">{label}</span>
                <span className="xs:hidden sm:hidden text-xs">{label.split(' ')[0]}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Conteúdo das abas */}
      <div className="min-h-96">
        {/* Aba Início */}
        {abaSelecionada === 'home' && (
          <div className="space-y-6">
            {/* Recomendações Personalizadas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-600" />
                Recomendações Personalizadas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recomendacoes.slice(0, 6).map((rec) => (
                  <div key={rec.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        rec.tipo === 'tutorial' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                      }`}>
                        {rec.tipo}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        rec.nivel === 'iniciante' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' :
                        rec.nivel === 'intermediario' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                      }`}>
                        {rec.nivel}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      {rec.titulo}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {rec.motivo}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{rec.tempoEstimado}min</span>
                      </div>
                      <button
                        onClick={() => {
                          if (rec.tipo === 'tutorial') {
                            setAbaSelecionada('tutoriais');
                            const tutorial = tutoriais.find(t => t.id === rec.id);
                            if (tutorial) setTutorialSelecionado(tutorial);
                          } else if (rec.tipo === 'artigo') {
                            setAbaSelecionada('artigos');
                            const artigo = artigos.find(a => a.id === rec.id);
                            if (artigo) setArtigoSelecionado(artigo);
                          }
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Começar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dicas Rápidas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                Dicas Rápidas
              </h3>
              <div className="space-y-3">
                {dicasContextuais.slice(0, 3).map((dica) => (
                  <div key={dica.id} className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {dica.titulo}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {dica.conteudo}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          {dica.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Próximas Conquistas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-purple-600" />
                Próximas Conquistas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {proximasConquistas.map((conquista) => (
                  <div key={conquista.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{conquista.icone}</span>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {conquista.nome}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {conquista.raridade}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {conquista.descricao}
                    </p>
                    <div className="space-y-1">
                      {conquista.criterios.map((criterio, index) => (
                        <div key={index} className="text-xs text-gray-500">
                          • {criterio.descricao}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Aba Módulos */}
        {abaSelecionada === 'modulos' && (
          <div className="space-y-6">
            {!moduloSelecionado ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Módulos de Aprendizado
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Trilha estruturada de educação financeira
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {MODULOS_APRENDIZADO.map((modulo) => {
                    const IconComponent = modulo.icone;
                    const podeAcessar = modulo.prerequisitos.length === 0 || 
                      modulo.prerequisitos.every(prereq => 
                        MODULOS_APRENDIZADO.find(m => m.id === prereq)?.progresso === 100
                      );

                    return (
                      <div
                        key={modulo.id}
                        className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 ${
                          podeAcessar ? 'cursor-pointer' : 'opacity-60'
                        }`}
                        onClick={() => podeAcessar && setModuloSelecionado(modulo.id)}
                      >
                        <div className={`h-2 bg-gradient-to-r ${
                          modulo.cor === 'blue' ? 'from-blue-500 to-blue-600' :
                          modulo.cor === 'green' ? 'from-green-500 to-green-600' :
                          modulo.cor === 'purple' ? 'from-purple-500 to-purple-600' :
                          modulo.cor === 'orange' ? 'from-orange-500 to-orange-600' :
                          modulo.cor === 'red' ? 'from-red-500 to-red-600' :
                          'from-indigo-500 to-indigo-600'
                        }`}></div>

                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${
                              modulo.cor === 'blue' ? 'bg-blue-100 dark:bg-blue-900/40' :
                              modulo.cor === 'green' ? 'bg-green-100 dark:bg-green-900/40' :
                              modulo.cor === 'purple' ? 'bg-purple-100 dark:bg-purple-900/40' :
                              modulo.cor === 'orange' ? 'bg-orange-100 dark:bg-orange-900/40' :
                              modulo.cor === 'red' ? 'bg-red-100 dark:bg-red-900/40' :
                              'bg-indigo-100 dark:bg-indigo-900/40'
                            }`}>
                              <IconComponent className={`w-6 h-6 ${
                                modulo.cor === 'blue' ? 'text-blue-600' :
                                modulo.cor === 'green' ? 'text-green-600' :
                                modulo.cor === 'purple' ? 'text-purple-600' :
                                modulo.cor === 'orange' ? 'text-orange-600' :
                                modulo.cor === 'red' ? 'text-red-600' :
                                'text-indigo-600'
                              }`} />
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${
                              modulo.nivel === 'iniciante' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' :
                              modulo.nivel === 'intermediario' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200' :
                              'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                            }`}>
                              {modulo.nivel}
                            </span>
                          </div>

                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {modulo.titulo}
                          </h3>

                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                            {modulo.descricao}
                          </p>

                          <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Progresso</span>
                              <span className="font-medium">{modulo.progresso}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  modulo.cor === 'blue' ? 'bg-blue-600' :
                                  modulo.cor === 'green' ? 'bg-green-600' :
                                  modulo.cor === 'purple' ? 'bg-purple-600' :
                                  modulo.cor === 'orange' ? 'bg-orange-600' :
                                  modulo.cor === 'red' ? 'bg-red-600' :
                                  'bg-indigo-600'
                                }`}
                                style={{ width: `${modulo.progresso}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {modulo.duracao} min
                            </div>
                            <div className="flex items-center">
                              <BookOpen className="w-4 h-4 mr-1" />
                              {modulo.topicos.length} tópicos
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                            <div className="flex items-center">
                              <FileText className="w-3 h-3 mr-1" />
                              {modulo.recursos.artigos} artigos
                            </div>
                            <div className="flex items-center">
                              <Video className="w-3 h-3 mr-1" />
                              {modulo.recursos.videos} vídeos
                            </div>
                            <div className="flex items-center">
                              <Brain className="w-3 h-3 mr-1" />
                              {modulo.recursos.quizzes} quizzes
                            </div>
                            <div className="flex items-center">
                              <Calculator className="w-3 h-3 mr-1" />
                              {modulo.recursos.calculadoras} calc.
                            </div>
                          </div>

                          {modulo.prerequisitos.length > 0 && (
                            <div className="mb-4">
                              <p className="text-xs text-gray-500 mb-1">Pré-requisitos:</p>
                              <div className="flex flex-wrap gap-1">
                                {modulo.prerequisitos.map((prereq) => {
                                  const prereqModulo = MODULOS_APRENDIZADO.find(m => m.id === prereq);
                                  const concluido = prereqModulo?.progresso === 100;
                                  return (
                                    <span
                                      key={prereq}
                                      className={`text-xs px-2 py-1 rounded ${
                                        concluido 
                                          ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                      }`}
                                    >
                                      {prereqModulo?.titulo.split(' ')[0]}
                                      {concluido && ' ✓'}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <button
                            disabled={!podeAcessar}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                              podeAcessar
                                ? `${
                                    modulo.cor === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                                    modulo.cor === 'green' ? 'bg-green-600 hover:bg-green-700' :
                                    modulo.cor === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
                                    modulo.cor === 'orange' ? 'bg-orange-600 hover:bg-orange-700' :
                                    modulo.cor === 'red' ? 'bg-red-600 hover:bg-red-700' :
                                    'bg-indigo-600 hover:bg-indigo-700'
                                  } text-white`
                                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {modulo.progresso === 0 ? 'Começar Módulo' : 
                             modulo.progresso === 100 ? 'Revisar Módulo' : 'Continuar Módulo'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              // Visualização detalhada do módulo
              (() => {
                const modulo = MODULOS_APRENDIZADO.find(m => m.id === moduloSelecionado);
                if (!modulo) return null;

                const IconComponent = modulo.icone;

                return (
                  <div className="max-w-4xl mx-auto">
                    <button
                      onClick={() => setModuloSelecionado(null)}
                      className="mb-6 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      ← Voltar aos módulos
                    </button>

                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className={`bg-gradient-to-r p-8 text-white ${
                        modulo.cor === 'blue' ? 'from-blue-600 to-blue-700' :
                        modulo.cor === 'green' ? 'from-green-600 to-green-700' :
                        modulo.cor === 'purple' ? 'from-purple-600 to-purple-700' :
                        modulo.cor === 'orange' ? 'from-orange-600 to-orange-700' :
                        modulo.cor === 'red' ? 'from-red-600 to-red-700' :
                        'from-indigo-600 to-indigo-700'
                      }`}>
                        <div className="flex items-center mb-4">
                          <IconComponent className="w-12 h-12 mr-4" />
                          <div>
                            <h1 className="text-3xl font-bold">{modulo.titulo}</h1>
                            <p className="text-blue-100">{modulo.descricao}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold">{modulo.duracao}</div>
                            <div className="text-sm text-blue-100">Minutos</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">{modulo.topicos.length}</div>
                            <div className="text-sm text-blue-100">Tópicos</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">{modulo.progresso}%</div>
                            <div className="text-sm text-blue-100">Concluído</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold capitalize">{modulo.nivel}</div>
                            <div className="text-sm text-blue-100">Nível</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Tópicos do Módulo */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                              Tópicos do Módulo
                            </h3>
                            <div className="space-y-3">
                              {modulo.topicos.map((topico, index) => (
                                <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3 ${
                                    modulo.cor === 'blue' ? 'bg-blue-600' :
                                    modulo.cor === 'green' ? 'bg-green-600' :
                                    modulo.cor === 'purple' ? 'bg-purple-600' :
                                    modulo.cor === 'orange' ? 'bg-orange-600' :
                                    modulo.cor === 'red' ? 'bg-red-600' :
                                    'bg-indigo-600'
                                  }`}>
                                    {index + 1}
                                  </div>
                                  <span className="text-gray-900 dark:text-white">{topico}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Recursos Disponíveis */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                              Recursos Disponíveis
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              <button
                                onClick={() => setRecursoInterativo('artigos')}
                                className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                              >
                                <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {modulo.recursos.artigos} Artigos
                                </div>
                              </button>

                              <button
                                onClick={() => setRecursoInterativo('videos')}
                                className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                              >
                                <Video className="w-8 h-8 text-red-600 mx-auto mb-2" />
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {modulo.recursos.videos} Vídeos
                                </div>
                              </button>

                              <button
                                onClick={() => setRecursoInterativo('quizzes')}
                                className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                              >
                                <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {modulo.recursos.quizzes} Quizzes
                                </div>
                              </button>

                              <button
                                onClick={() => setRecursoInterativo('calculadoras')}
                                className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                              >
                                <Calculator className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {modulo.recursos.calculadoras} Calculadoras
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        )}

        {/* Aba Recursos */}
        {abaSelecionada === 'recursos' && (
          <div className="space-y-6">
            {!recursoInterativo ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Recursos Interativos
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Ferramentas e conteúdos para acelerar seu aprendizado
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <button
                    onClick={() => setRecursoInterativo('artigos')}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 text-left"
                  >
                    <div className="bg-blue-100 dark:bg-blue-900/40 p-4 rounded-lg mb-4 w-fit">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Artigos Educativos
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Conteúdo detalhado sobre educação financeira
                    </p>
                  </button>

                  <button
                    onClick={() => setRecursoInterativo('videos')}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 text-left"
                  >
                    <div className="bg-red-100 dark:bg-red-900/40 p-4 rounded-lg mb-4 w-fit">
                      <Video className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Vídeos Educativos
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Aprenda com conteúdo audiovisual
                    </p>
                  </button>

                  <button
                    onClick={() => setRecursoInterativo('quizzes')}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 text-left"
                  >
                    <div className="bg-purple-100 dark:bg-purple-900/40 p-4 rounded-lg mb-4 w-fit">
                      <Brain className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Quizzes Interativos
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Teste seus conhecimentos
                    </p>
                  </button>

                  <button
                    onClick={() => setRecursoInterativo('calculadoras')}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 text-left"
                  >
                    <div className="bg-green-100 dark:bg-green-900/40 p-4 rounded-lg mb-4 w-fit">
                      <Calculator className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Calculadoras
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Ferramentas de planejamento
                    </p>
                  </button>
                </div>
              </>
            ) : (
              <RecursosInterativos
                tipo={recursoInterativo}
                onVoltar={() => setRecursoInterativo(null)}
              />
            )}
          </div>
        )}

        {/* Recursos Interativos dentro dos módulos */}
        {recursoInterativo && moduloSelecionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {recursoInterativo === 'artigos' ? 'Artigos Educativos' :
                   recursoInterativo === 'videos' ? 'Vídeos Educativos' :
                   recursoInterativo === 'quizzes' ? 'Quizzes Interativos' :
                   'Calculadoras Educacionais'}
                </h2>
                <button
                  onClick={() => setRecursoInterativo(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                <RecursosInterativos
                  tipo={recursoInterativo}
                  onVoltar={() => setRecursoInterativo(null)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Aba Gamificação */}
        {abaSelecionada === 'gamificacao' && (
          <div className="space-y-6">
            {/* Dashboard de Progresso */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Trophy className="w-6 h-6 mr-2" />
                Sistema de Gamificação
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{userProgress.level}</div>
                  <div className="text-sm text-purple-100">Nível Atual</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userProgress.xp}</div>
                  <div className="text-sm text-purple-100">XP Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{badges.length}</div>
                  <div className="text-sm text-purple-100">Badges</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userProgress.streakDays}</div>
                  <div className="text-sm text-purple-100">Dias Seguidos</div>
                </div>
              </div>
              
              {/* Barra de progresso para próximo nível */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Progresso para Nível {userProgress.level + 1}</span>
                  <span>{userProgress.xp}/{getXPForNextLevel(userProgress.level)} XP</span>
                </div>
                <div className="w-full bg-purple-500/30 rounded-full h-3">
                  <div
                    className="bg-white rounded-full h-3 transition-all duration-300"
                    style={{ 
                      width: `${Math.min(100, (userProgress.xp / getXPForNextLevel(userProgress.level)) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Badges Conquistados */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-600" />
                Badges Conquistados
              </h3>
              {badges.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {badges.map((badge) => (
                    <div key={badge.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700 text-center">
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">{badge.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{badge.description}</p>
                      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                        badge.rarity === 'common' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                        badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200' :
                        badge.rarity === 'epic' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200'
                      }`}>
                        {badge.rarity}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Nenhum badge conquistado ainda</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Complete módulos e atividades para ganhar badges!</p>
                </div>
              )}
            </div>

            {/* Módulos Completados */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Progresso dos Módulos
              </h3>
              <div className="space-y-3">
                {MODULOS_APRENDIZADO.map((modulo) => {
                  const isCompleted = userProgress.completedModules.includes(modulo.id);
                  return (
                    <div key={modulo.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          isCompleted ? 'bg-green-600 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                        }`}>
                          {isCompleted ? <CheckCircle className="w-4 h-4" /> : <modulo.icone className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{modulo.titulo}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{modulo.nivel} • {modulo.duracao} min</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                          {isCompleted ? 'Concluído' : 'Pendente'}
                        </div>
                        {isCompleted && (
                          <div className="text-xs text-gray-500">+{Math.floor(modulo.duracao * 2)} XP</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ações de Gamificação */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-600" />
                Ações Rápidas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => addXP(50, 'bonus_diario')}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors"
                >
                  <Star className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Bônus Diário</div>
                  <div className="text-sm opacity-90">+50 XP</div>
                </button>
                
                <button
                  onClick={() => completeModule('fundamentos', 'easy')}
                  className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors"
                >
                  <BookOpen className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Simular Módulo</div>
                  <div className="text-sm opacity-90">Teste de Progresso</div>
                </button>
                
                <button
                  onClick={() => {
                    // Simular conquista de badge
                    const newBadge = {
                      id: `badge-${Date.now()}`,
                      name: 'Estudante Dedicado',
                      description: 'Completou primeira sessão de estudos',
                      icon: '🎓',
                      rarity: 'common' as const,
                      category: 'progress' as const
                    };
                    // Esta funcionalidade seria implementada no hook useGamification
                    console.log('Badge conquistado:', newBadge);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-colors"
                >
                  <Trophy className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Ganhar Badge</div>
                  <div className="text-sm opacity-90">Demonstração</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Aba Plano de Estudos */}
        {abaSelecionada === 'plano' && planoEstudos && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Seu Plano de Estudos Personalizado
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tutoriais Recomendados */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Tutoriais Recomendados</h4>
                  <div className="space-y-3">
                    {planoEstudos.proximosTutoriais.map((tutorial) => (
                      <div key={tutorial.id} className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <h5 className="font-medium text-gray-900 dark:text-white">{tutorial.titulo}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tutorial.motivo}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{tutorial.tempoEstimado} min</span>
                          <button
                            onClick={() => {
                              setAbaSelecionada('tutoriais');
                              // Buscar o tutorial completo pelos dados
                              const tutorialCompleto = tutoriais.find(t => t.id === tutorial.id);
                              if (tutorialCompleto) {
                                setTutorialSelecionado(tutorialCompleto);
                              }
                            }}
                            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                          >
                            Começar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Artigos Recomendados */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Artigos Recomendados</h4>
                  <div className="space-y-3">
                    {planoEstudos.artigosRecomendados.map((artigo) => (
                      <div key={artigo.id} className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <h5 className="font-medium text-gray-900 dark:text-white">{artigo.titulo}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{artigo.motivo}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-green-600">{artigo.tempoEstimado} min</span>
                          <button
                            onClick={() => {
                              setAbaSelecionada('artigos');
                              // Buscar o artigo completo pelos dados
                              const artigoCompleto = artigos.find(a => a.id === artigo.id);
                              if (artigoCompleto) {
                                setArtigoSelecionado(artigoCompleto);
                              }
                            }}
                            className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                          >
                            Ler
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Meta Semanal */}
              <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                  Meta Semanal
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Tempo recomendado: {planoEstudos.metaSemanal.tempoRecomendado} minutos
                </p>
                <div className="space-y-1">
                  {planoEstudos.metaSemanal.objetivos.map((objetivo, index) => (
                    <div key={index} className="text-sm text-gray-700 dark:text-gray-300">
                      • {objetivo}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Aba Progresso */}
        {abaSelecionada === 'progresso' && progressoAprendizado && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                Seu Progresso de Aprendizado
              </h3>

              {/* Progresso Geral */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">Progresso Geral</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.round(progressoAprendizado.progressoGeral)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-green-600 rounded-full h-3 transition-all duration-300"
                    style={{ width: `${progressoAprendizado.progressoGeral}%` }}
                  ></div>
                </div>
              </div>

              {/* Progresso por Área */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(progressoAprendizado.progressoPorArea).map(([area, progresso]) => (
                  <div key={area} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white capitalize">{area}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {Math.round(progresso)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-blue-600 rounded-full h-2 transition-all duration-300"
                        style={{ width: `${progresso}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Estatísticas */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{progressoAprendizado.totalTutoriais}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tutoriais</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{progressoAprendizado.totalArtigos}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Artigos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{progressoAprendizado.totalConquistas}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Conquistas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{Math.round(progressoAprendizado.tempoTotal)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Minutos</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Outras abas simplificadas para manter o componente funcional */}
        {abaSelecionada === 'glossario' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar termos..."
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dadosFiltrados.glossario.map((termo) => (
                <div key={termo.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {termo.termo}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {termo.definicao}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {abaSelecionada === 'dicas' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dadosFiltrados.dicas.map((dica) => (
                <div key={dica.id} className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {dica.titulo}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {dica.conteudo}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {abaSelecionada === 'tutoriais' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dadosFiltrados.tutoriais.map((tutorial) => (
                <div key={tutorial.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {tutorial.titulo}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {tutorial.descricao}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{tutorial.duracao} min</span>
                    <button
                      onClick={() => handleCompletarTutorial(tutorial.id)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Completar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {abaSelecionada === 'artigos' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dadosFiltrados.artigos.map((artigo) => (
                <div key={artigo.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {artigo.titulo}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {artigo.resumo}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{artigo.tempoLeitura} min</span>
                    <button
                      onClick={() => handleLerArtigo(artigo.id)}
                      className="text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      Ler
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {abaSelecionada === 'conquistas' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {conquistasDesbloqueadas.map((conquista) => (
                <div key={conquista.id} className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{conquista.icone}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {conquista.nome}
                      </h4>
                      <p className="text-xs text-green-600">Desbloqueada</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {conquista.descricao}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {abaSelecionada === 'perfil' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Perfil do Usuário
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Estatísticas</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Nível:</span>
                      <span className="font-medium">{estatisticas.nivel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Experiência:</span>
                      <span className="font-medium">{estatisticas.experiencia} XP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tutoriais Completos:</span>
                      <span className="font-medium">{estatisticas.tutoriaisCompletos}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Artigos Lidos:</span>
                      <span className="font-medium">{estatisticas.artigosLidos}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Progresso por Área</h4>
                  <div className="space-y-2">
                    {Object.entries(perfil.areas).map(([area, dados]) => (
                      <div key={area} className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">{area}:</span>
                        <span className="font-medium">Nível {dados.nivel}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SistemaEducacao;