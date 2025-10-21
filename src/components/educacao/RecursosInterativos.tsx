// Componentes de Recursos Interativos para Educação Financeira

import React, { useState } from 'react';
import {
  Play,
  FileText,
  Calculator,
  Brain,
  CheckCircle,
  Clock,
  Star,
  BookOpen,
  Video,
  Award,
  Target,
  TrendingUp,
  DollarSign,
  PiggyBank,
  CreditCard,
  Shield
} from 'lucide-react';

// Tipos para os recursos
interface ArtigoEducativo {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  categoria: string;
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  tempoLeitura: number;
  autor: string;
  dataPublicacao: string;
  tags: string[];
  avaliacaoMedia: number;
  numeroAvaliacoes: number;
}

interface VideoEducativo {
  id: string;
  titulo: string;
  descricao: string;
  url: string;
  thumbnail: string;
  categoria: string;
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  duracao: number;
  instrutor: string;
  tags: string[];
  avaliacaoMedia: number;
  numeroAvaliacoes: number;
}

interface Quiz {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  perguntas: {
    id: string;
    pergunta: string;
    opcoes: string[];
    respostaCorreta: number;
    explicacao: string;
  }[];
  tempoLimite?: number;
  pontuacaoMaxima: number;
}

interface CalculadoraEducacional {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  tipo: 'juros_compostos' | 'aposentadoria' | 'financiamento' | 'investimento' | 'orcamento';
  icone: React.ComponentType<any>;
  campos: {
    id: string;
    label: string;
    tipo: 'number' | 'select' | 'range';
    opcoes?: string[];
    min?: number;
    max?: number;
    step?: number;
    valor?: number | string;
    unidade?: string;
  }[];
}

// Dados de exemplo
const ARTIGOS_EXEMPLO: ArtigoEducativo[] = [
  {
    id: 'art-001',
    titulo: 'Fundamentos da Educação Financeira',
    resumo: 'Aprenda os conceitos básicos que todo brasileiro deveria conhecer sobre dinheiro.',
    conteudo: `
# Fundamentos da Educação Financeira

A educação financeira é a base para uma vida financeira saudável e próspera. Neste artigo, vamos explorar os conceitos fundamentais que todo brasileiro deveria conhecer.

## O que é Educação Financeira?

Educação financeira é o processo de desenvolver conhecimentos, habilidades e atitudes necessárias para tomar decisões financeiras conscientes e responsáveis.

## Conceitos Básicos

### 1. Renda vs. Patrimônio
- **Renda**: Dinheiro que entra mensalmente
- **Patrimônio**: Total de bens e investimentos

### 2. Fluxo de Caixa
Entender a diferença entre entrada e saída de dinheiro é fundamental para o controle financeiro.

### 3. Juros Simples vs. Compostos
Os juros compostos são considerados a oitava maravilha do mundo quando trabalham a seu favor.

## Primeiros Passos

1. **Organize suas finanças**: Liste todas as receitas e despesas
2. **Crie um orçamento**: Planeje como usar seu dinheiro
3. **Construa uma reserva**: Tenha dinheiro para emergências
4. **Invista no seu conhecimento**: Continue aprendendo sobre finanças

## Conclusão

A educação financeira é um processo contínuo. Comece hoje mesmo aplicando esses conceitos básicos em sua vida.
    `,
    categoria: 'fundamentos',
    nivel: 'iniciante',
    tempoLeitura: 8,
    autor: 'Prof. Carlos Silva',
    dataPublicacao: '2024-01-15',
    tags: ['básico', 'conceitos', 'iniciante'],
    avaliacaoMedia: 4.8,
    numeroAvaliacoes: 156
  },
  {
    id: 'art-002',
    titulo: 'Como Criar um Orçamento Pessoal Eficiente',
    resumo: 'Passo a passo para criar e manter um orçamento que realmente funciona.',
    conteudo: `
# Como Criar um Orçamento Pessoal Eficiente

Um orçamento bem estruturado é a ferramenta mais importante para o controle financeiro pessoal.

## Por que ter um orçamento?

- Controle total sobre suas finanças
- Identificação de gastos desnecessários
- Planejamento para objetivos futuros
- Redução do estresse financeiro

## Passo a Passo

### 1. Calcule sua Renda Líquida
Some todas as fontes de renda após descontos de impostos.

### 2. Liste todas as Despesas
- **Fixas**: Aluguel, financiamentos, seguros
- **Variáveis**: Alimentação, transporte, lazer
- **Eventuais**: Presentes, viagens, reparos

### 3. Categorize os Gastos
Use a regra 50-30-20:
- 50% para necessidades
- 30% para desejos
- 20% para poupança e investimentos

### 4. Monitore e Ajuste
Revise seu orçamento mensalmente e faça ajustes conforme necessário.

## Ferramentas Úteis

- Planilhas eletrônicas
- Aplicativos de controle financeiro
- Método dos envelopes
- Conta separada para cada categoria

## Dicas Importantes

1. Seja realista com os valores
2. Inclua uma categoria para "imprevistos"
3. Comemore as pequenas vitórias
4. Não desista se não der certo no primeiro mês

## Conclusão

Um orçamento eficiente é aquele que você consegue seguir. Comece simples e vá aperfeiçoando com o tempo.
    `,
    categoria: 'orcamento',
    nivel: 'iniciante',
    tempoLeitura: 12,
    autor: 'Ana Financeira',
    dataPublicacao: '2024-01-20',
    tags: ['orçamento', 'planejamento', 'controle'],
    avaliacaoMedia: 4.9,
    numeroAvaliacoes: 203
  }
];

const VIDEOS_EXEMPLO: VideoEducativo[] = [
  {
    id: 'vid-001',
    titulo: 'Juros Compostos: O Milagre dos Investimentos',
    descricao: 'Entenda como os juros compostos podem multiplicar seu dinheiro ao longo do tempo.',
    url: 'https://example.com/video1',
    thumbnail: '/api/placeholder/320/180',
    categoria: 'investimentos',
    nivel: 'iniciante',
    duracao: 15,
    instrutor: 'Dr. Pedro Investimentos',
    tags: ['juros', 'investimentos', 'longo prazo'],
    avaliacaoMedia: 4.7,
    numeroAvaliacoes: 89
  },
  {
    id: 'vid-002',
    titulo: 'Como Sair das Dívidas em 6 Passos',
    descricao: 'Estratégias práticas para quitar suas dívidas e recuperar o controle financeiro.',
    url: 'https://example.com/video2',
    thumbnail: '/api/placeholder/320/180',
    categoria: 'dividas',
    nivel: 'intermediario',
    duracao: 22,
    instrutor: 'Maria Quitação',
    tags: ['dívidas', 'estratégia', 'recuperação'],
    avaliacaoMedia: 4.6,
    numeroAvaliacoes: 134
  }
];

const QUIZZES_EXEMPLO: Quiz[] = [
  {
    id: 'quiz-001',
    titulo: 'Teste seus Conhecimentos: Fundamentos Financeiros',
    descricao: 'Avalie seu conhecimento sobre os conceitos básicos de educação financeira.',
    categoria: 'fundamentos',
    nivel: 'iniciante',
    perguntas: [
      {
        id: 'q1',
        pergunta: 'O que são juros compostos?',
        opcoes: [
          'Juros calculados apenas sobre o valor inicial',
          'Juros calculados sobre o valor inicial + juros anteriores',
          'Juros que diminuem com o tempo',
          'Juros fixos que nunca mudam'
        ],
        respostaCorreta: 1,
        explicacao: 'Juros compostos são calculados sobre o valor inicial mais os juros acumulados dos períodos anteriores, criando um efeito de "juros sobre juros".'
      },
      {
        id: 'q2',
        pergunta: 'Qual é a regra básica para uma reserva de emergência?',
        opcoes: [
          '1-2 meses de gastos',
          '3-6 meses de gastos',
          '12 meses de gastos',
          'Não é necessário ter reserva'
        ],
        respostaCorreta: 1,
        explicacao: 'A regra geral é ter entre 3 a 6 meses de gastos essenciais guardados para emergências.'
      },
      {
        id: 'q3',
        pergunta: 'O que é inflação?',
        opcoes: [
          'Aumento geral dos preços',
          'Diminuição dos preços',
          'Estabilidade dos preços',
          'Variação da taxa de juros'
        ],
        respostaCorreta: 0,
        explicacao: 'Inflação é o aumento generalizado e contínuo dos preços de bens e serviços em uma economia.'
      }
    ],
    tempoLimite: 300, // 5 minutos
    pontuacaoMaxima: 100
  }
];

const CALCULADORAS_EXEMPLO: CalculadoraEducacional[] = [
  {
    id: 'calc-001',
    titulo: 'Calculadora de Juros Compostos',
    descricao: 'Veja como seu dinheiro pode crescer com o tempo através dos juros compostos.',
    categoria: 'investimentos',
    tipo: 'juros_compostos',
    icone: TrendingUp,
    campos: [
      {
        id: 'valorInicial',
        label: 'Valor Inicial',
        tipo: 'number',
        valor: 1000,
        unidade: 'R$',
        min: 0
      },
      {
        id: 'aporteMensal',
        label: 'Aporte Mensal',
        tipo: 'number',
        valor: 200,
        unidade: 'R$',
        min: 0
      },
      {
        id: 'taxaJuros',
        label: 'Taxa de Juros Anual',
        tipo: 'range',
        valor: 10,
        unidade: '%',
        min: 0,
        max: 30,
        step: 0.5
      },
      {
        id: 'periodo',
        label: 'Período',
        tipo: 'range',
        valor: 10,
        unidade: 'anos',
        min: 1,
        max: 50,
        step: 1
      }
    ]
  },
  {
    id: 'calc-002',
    titulo: 'Calculadora de Aposentadoria',
    descricao: 'Planeje sua aposentadoria e descubra quanto precisa poupar mensalmente.',
    categoria: 'aposentadoria',
    tipo: 'aposentadoria',
    icone: Shield,
    campos: [
      {
        id: 'idadeAtual',
        label: 'Idade Atual',
        tipo: 'number',
        valor: 30,
        unidade: 'anos',
        min: 18,
        max: 65
      },
      {
        id: 'idadeAposentadoria',
        label: 'Idade para Aposentadoria',
        tipo: 'number',
        valor: 65,
        unidade: 'anos',
        min: 50,
        max: 80
      },
      {
        id: 'rendaMensal',
        label: 'Renda Mensal Desejada',
        tipo: 'number',
        valor: 5000,
        unidade: 'R$',
        min: 1000
      },
      {
        id: 'taxaRetorno',
        label: 'Taxa de Retorno Esperada',
        tipo: 'range',
        valor: 8,
        unidade: '%',
        min: 3,
        max: 15,
        step: 0.5
      }
    ]
  }
];

// Componente principal
interface RecursosInterativosProps {
  tipo: 'artigos' | 'videos' | 'quizzes' | 'calculadoras';
  onVoltar?: () => void;
}

const RecursosInterativos: React.FC<RecursosInterativosProps> = ({ tipo, onVoltar }) => {
  const [itemSelecionado, setItemSelecionado] = useState<string | null>(null);
  const [respostasQuiz, setRespostasQuiz] = useState<Record<string, number>>({});
  const [quizFinalizado, setQuizFinalizado] = useState(false);
  const [calculadoraValores, setCalculadoraValores] = useState<Record<string, number>>({});

  // Renderizar artigos
  const renderArtigos = () => (
    <div className="space-y-6">
      {!itemSelecionado ? (
        <>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Artigos Educativos
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Conteúdo detalhado sobre educação financeira
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ARTIGOS_EXEMPLO.map((artigo) => (
              <div
                key={artigo.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setItemSelecionado(artigo.id)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      artigo.nivel === 'iniciante' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' :
                      artigo.nivel === 'intermediario' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                    }`}>
                      {artigo.nivel}
                    </span>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm ml-1">{artigo.avaliacaoMedia}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {artigo.titulo}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {artigo.resumo}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {artigo.tempoLeitura} min
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      {artigo.autor}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {artigo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // Visualização do artigo selecionado
        (() => {
          const artigo = ARTIGOS_EXEMPLO.find(a => a.id === itemSelecionado);
          if (!artigo) return null;

          return (
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => setItemSelecionado(null)}
                className="mb-6 text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Voltar aos artigos
              </button>

              <article className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        artigo.nivel === 'iniciante' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' :
                        artigo.nivel === 'intermediario' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                      }`}>
                        {artigo.nivel}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {artigo.tempoLeitura} min de leitura
                      </div>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="ml-1">{artigo.avaliacaoMedia}</span>
                      <span className="text-gray-500 text-sm ml-1">({artigo.numeroAvaliacoes})</span>
                    </div>
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {artigo.titulo}
                  </h1>

                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-8">
                    <span>Por {artigo.autor}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(artigo.dataPublicacao).toLocaleDateString('pt-BR')}</span>
                  </div>

                  <div className="prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: artigo.conteudo.replace(/\n/g, '<br>') }} />
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-2">
                      {artigo.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-sm bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </div>
          );
        })()
      )}
    </div>
  );

  // Renderizar vídeos
  const renderVideos = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Vídeos Educativos
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Aprenda com conteúdo audiovisual de qualidade
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {VIDEOS_EXEMPLO.map((video) => (
          <div
            key={video.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img
                src={video.thumbnail}
                alt={video.titulo}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Play className="w-12 h-12 text-white" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {video.duracao} min
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  video.nivel === 'iniciante' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' :
                  video.nivel === 'intermediario' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                }`}>
                  {video.nivel}
                </span>
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm ml-1">{video.avaliacaoMedia}</span>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {video.titulo}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {video.descricao}
              </p>

              <div className="text-sm text-gray-500 mb-3">
                Instrutor: {video.instrutor}
              </div>

              <div className="flex flex-wrap gap-1">
                {video.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Renderizar quizzes
  const renderQuizzes = () => (
    <div className="space-y-6">
      {!itemSelecionado ? (
        <>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Quizzes Educativos
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Teste seus conhecimentos e aprenda com feedback imediato
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {QUIZZES_EXEMPLO.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setItemSelecionado(quiz.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs px-2 py-1 rounded ${
                    quiz.nivel === 'iniciante' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' :
                    quiz.nivel === 'intermediario' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                  }`}>
                    {quiz.nivel}
                  </span>
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {quiz.titulo}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {quiz.descricao}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{quiz.perguntas.length} perguntas</span>
                  {quiz.tempoLimite && (
                    <span>{Math.round(quiz.tempoLimite / 60)} min</span>
                  )}
                  <span>{quiz.pontuacaoMaxima} pts</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // Quiz selecionado
        (() => {
          const quiz = QUIZZES_EXEMPLO.find(q => q.id === itemSelecionado);
          if (!quiz) return null;

          const handleResposta = (perguntaId: string, resposta: number) => {
            setRespostasQuiz(prev => ({ ...prev, [perguntaId]: resposta }));
          };

          const finalizarQuiz = () => {
            setQuizFinalizado(true);
          };

          const calcularPontuacao = () => {
            let acertos = 0;
            quiz.perguntas.forEach(pergunta => {
              if (respostasQuiz[pergunta.id] === pergunta.respostaCorreta) {
                acertos++;
              }
            });
            return Math.round((acertos / quiz.perguntas.length) * quiz.pontuacaoMaxima);
          };

          return (
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => {
                  setItemSelecionado(null);
                  setRespostasQuiz({});
                  setQuizFinalizado(false);
                }}
                className="mb-6 text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Voltar aos quizzes
              </button>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {quiz.titulo}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {quiz.descricao}
                  </p>
                </div>

                {!quizFinalizado ? (
                  <div className="space-y-8">
                    {quiz.perguntas.map((pergunta, index) => (
                      <div key={pergunta.id} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                          {index + 1}. {pergunta.pergunta}
                        </h3>

                        <div className="space-y-2">
                          {pergunta.opcoes.map((opcao, opcaoIndex) => (
                            <label
                              key={opcaoIndex}
                              className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name={pergunta.id}
                                value={opcaoIndex}
                                checked={respostasQuiz[pergunta.id] === opcaoIndex}
                                onChange={() => handleResposta(pergunta.id, opcaoIndex)}
                                className="mr-3"
                              />
                              <span className="text-gray-900 dark:text-white">{opcao}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="text-center">
                      <button
                        onClick={finalizarQuiz}
                        disabled={Object.keys(respostasQuiz).length < quiz.perguntas.length}
                        className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Finalizar Quiz
                      </button>
                    </div>
                  </div>
                ) : (
                  // Resultado do quiz
                  <div className="text-center space-y-6">
                    <div className="text-6xl text-purple-600 mb-4">
                      <Award />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Quiz Finalizado!
                    </h2>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {calcularPontuacao()}/{quiz.pontuacaoMaxima} pontos
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {Math.round((calcularPontuacao() / quiz.pontuacaoMaxima) * 100)}% de aproveitamento
                      </div>
                    </div>

                    <div className="space-y-4">
                      {quiz.perguntas.map((pergunta, index) => {
                        const respostaUsuario = respostasQuiz[pergunta.id];
                        const acertou = respostaUsuario === pergunta.respostaCorreta;

                        return (
                          <div key={pergunta.id} className="text-left border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              {acertou ? (
                                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                              ) : (
                                <div className="w-5 h-5 bg-red-600 rounded-full mr-2 flex items-center justify-center">
                                  <span className="text-white text-xs">✕</span>
                                </div>
                              )}
                              <span className="font-medium text-gray-900 dark:text-white">
                                Pergunta {index + 1}
                              </span>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              {pergunta.pergunta}
                            </p>

                            <div className="text-sm">
                              <p className="text-gray-500 mb-1">
                                Sua resposta: {pergunta.opcoes[respostaUsuario]}
                              </p>
                              {!acertou && (
                                <p className="text-green-600 mb-2">
                                  Resposta correta: {pergunta.opcoes[pergunta.respostaCorreta]}
                                </p>
                              )}
                              <p className="text-gray-600 dark:text-gray-400 italic">
                                {pergunta.explicacao}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()
      )}
    </div>
  );

  // Renderizar calculadoras
  const renderCalculadoras = () => (
    <div className="space-y-6">
      {!itemSelecionado ? (
        <>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Calculadoras Educacionais
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Ferramentas práticas para planejamento financeiro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CALCULADORAS_EXEMPLO.map((calc) => {
              const IconComponent = calc.icone;
              return (
                <div
                  key={calc.id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setItemSelecionado(calc.id)}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-lg mr-4">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {calc.titulo}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">{calc.categoria}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {calc.descricao}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium">Calcular →</span>
                    <Calculator className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        // Calculadora selecionada
        (() => {
          const calc = CALCULADORAS_EXEMPLO.find(c => c.id === itemSelecionado);
          if (!calc) return null;

          const IconComponent = calc.icone;

          const handleValorChange = (campoId: string, valor: number) => {
            setCalculadoraValores(prev => ({ ...prev, [campoId]: valor }));
          };

          const calcularResultado = () => {
            const valores = { ...calculadoraValores };
            
            // Preencher valores padrão se não estiverem definidos
            calc.campos.forEach(campo => {
              if (valores[campo.id] === undefined) {
                valores[campo.id] = campo.valor as number;
              }
            });

            if (calc.tipo === 'juros_compostos') {
              const valorInicial = valores.valorInicial || 0;
              const aporteMensal = valores.aporteMensal || 0;
              const taxaAnual = (valores.taxaJuros || 0) / 100;
              const periodo = valores.periodo || 0;

              const taxaMensal = taxaAnual / 12;
              const meses = periodo * 12;

              // Fórmula de juros compostos com aportes mensais
              const valorFinal = valorInicial * Math.pow(1 + taxaMensal, meses) +
                aporteMensal * ((Math.pow(1 + taxaMensal, meses) - 1) / taxaMensal);

              const totalInvestido = valorInicial + (aporteMensal * meses);
              const rendimento = valorFinal - totalInvestido;

              return {
                valorFinal: valorFinal.toFixed(2),
                totalInvestido: totalInvestido.toFixed(2),
                rendimento: rendimento.toFixed(2),
                percentualGanho: ((rendimento / totalInvestido) * 100).toFixed(1)
              };
            }

            if (calc.tipo === 'aposentadoria') {
              const idadeAtual = valores.idadeAtual || 30;
              const idadeAposentadoria = valores.idadeAposentadoria || 65;
              const rendaMensal = valores.rendaMensal || 5000;
              const taxaRetorno = (valores.taxaRetorno || 8) / 100;

              const anosContribuicao = idadeAposentadoria - idadeAtual;
              const mesesContribuicao = anosContribuicao * 12;
              const taxaMensal = taxaRetorno / 12;

              // Assumindo 25 anos de aposentadoria
              const anosAposentadoria = 25;
              const mesesAposentadoria = anosAposentadoria * 12;

              // Valor necessário para gerar a renda desejada
              const valorNecessario = rendaMensal * ((1 - Math.pow(1 + taxaMensal, -mesesAposentadoria)) / taxaMensal);

              // Aporte mensal necessário
              const aporteMensal = valorNecessario / (((Math.pow(1 + taxaMensal, mesesContribuicao) - 1) / taxaMensal));

              return {
                aporteMensal: aporteMensal.toFixed(2),
                valorNecessario: valorNecessario.toFixed(2),
                totalContribuido: (aporteMensal * mesesContribuicao).toFixed(2),
                anosContribuicao: anosContribuicao.toString()
              };
            }

            return {};
          };

          const resultado = calcularResultado();

          return (
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => {
                  setItemSelecionado(null);
                  setCalculadoraValores({});
                }}
                className="mb-6 text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Voltar às calculadoras
              </button>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                  <div className="flex items-center">
                    <IconComponent className="w-8 h-8 mr-4" />
                    <div>
                      <h1 className="text-2xl font-bold">{calc.titulo}</h1>
                      <p className="text-blue-100">{calc.descricao}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Formulário */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Parâmetros
                      </h3>

                      <div className="space-y-4">
                        {calc.campos.map((campo) => (
                          <div key={campo.id}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              {campo.label} {campo.unidade && `(${campo.unidade})`}
                            </label>

                            {campo.tipo === 'number' && (
                              <input
                                type="number"
                                min={campo.min}
                                max={campo.max}
                                step={campo.step}
                                value={calculadoraValores[campo.id] ?? campo.valor}
                                onChange={(e) => handleValorChange(campo.id, parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                              />
                            )}

                            {campo.tipo === 'range' && (
                              <div>
                                <input
                                  type="range"
                                  min={campo.min}
                                  max={campo.max}
                                  step={campo.step}
                                  value={calculadoraValores[campo.id] ?? campo.valor}
                                  onChange={(e) => handleValorChange(campo.id, parseFloat(e.target.value))}
                                  className="w-full"
                                />
                                <div className="flex justify-between text-sm text-gray-500 mt-1">
                                  <span>{campo.min}{campo.unidade}</span>
                                  <span className="font-medium">
                                    {calculadoraValores[campo.id] ?? campo.valor}{campo.unidade}
                                  </span>
                                  <span>{campo.max}{campo.unidade}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resultados */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Resultados
                      </h3>

                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        {calc.tipo === 'juros_compostos' && (
                          <div className="space-y-4">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-green-600 mb-1">
                                R$ {resultado.valorFinal}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Valor Final
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-center">
                              <div>
                                <div className="text-xl font-semibold text-blue-600">
                                  R$ {resultado.totalInvestido}
                                </div>
                                <div className="text-xs text-gray-500">Total Investido</div>
                              </div>
                              <div>
                                <div className="text-xl font-semibold text-purple-600">
                                  R$ {resultado.rendimento}
                                </div>
                                <div className="text-xs text-gray-500">Rendimento</div>
                              </div>
                            </div>

                            <div className="text-center">
                              <div className="text-lg font-semibold text-orange-600">
                                +{resultado.percentualGanho}%
                              </div>
                              <div className="text-xs text-gray-500">Ganho Total</div>
                            </div>
                          </div>
                        )}

                        {calc.tipo === 'aposentadoria' && (
                          <div className="space-y-4">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-blue-600 mb-1">
                                R$ {resultado.aporteMensal}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Aporte Mensal Necessário
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 text-center">
                              <div>
                                <div className="text-xl font-semibold text-green-600">
                                  R$ {resultado.valorNecessario}
                                </div>
                                <div className="text-xs text-gray-500">Valor Total Necessário</div>
                              </div>
                              <div>
                                <div className="text-xl font-semibold text-purple-600">
                                  R$ {resultado.totalContribuido}
                                </div>
                                <div className="text-xs text-gray-500">Total que Você Contribuirá</div>
                              </div>
                            </div>

                            <div className="text-center">
                              <div className="text-lg font-semibold text-orange-600">
                                {resultado.anosContribuicao} anos
                              </div>
                              <div className="text-xs text-gray-500">Tempo de Contribuição</div>
                            </div>
                          </div>
                        )}
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
  );

  // Renderizar conteúdo baseado no tipo
  const renderConteudo = () => {
    switch (tipo) {
      case 'artigos':
        return renderArtigos();
      case 'videos':
        return renderVideos();
      case 'quizzes':
        return renderQuizzes();
      case 'calculadoras':
        return renderCalculadoras();
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {onVoltar && (
        <button
          onClick={onVoltar}
          className="mb-6 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Voltar
        </button>
      )}
      {renderConteudo()}
    </div>
  );
};

export default RecursosInterativos;