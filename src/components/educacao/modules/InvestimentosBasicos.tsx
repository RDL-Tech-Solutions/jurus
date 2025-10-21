import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Brain,
  Lightbulb,
  FileText,
  Award,
  Clock,
  Target,
  AlertTriangle,
  Zap,
  Calendar,
  Percent,
  Shield,
  Building,
  Landmark,
  CreditCard,
  Home,
  Coins,
  TrendingDown,
  Eye,
  Lock,
  Unlock,
  Star,
  Info
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { ModuleContent, ModuleSection, Quiz, QuizSet, Calculator } from './index';

const InvestimentosBasicos: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  
  // Estados para calculadoras
  const [valorInicial, setValorInicial] = useState(1000);
  const [aportesMensais, setAportesMensais] = useState(500);
  const [taxaJuros, setTaxaJuros] = useState(10);
  const [prazoAnos, setPrazoAnos] = useState(10);
  const [inflacao, setInflacao] = useState(4);
  const [perfilRisco, setPerfilRisco] = useState('moderado');

  const moduleInfo: ModuleContent = {
    id: 'investimentos-basicos',
    title: 'Investimentos Básicos',
    description: 'Aprenda os fundamentos dos investimentos e como fazer seu dinheiro trabalhar para você',
    duration: '3-4 horas',
    level: 'Iniciante',
    topics: [
      'Por que investir?',
      'Perfil de investidor',
      'Tipos de investimentos',
      'Renda fixa vs Renda variável',
      'Diversificação',
      'Como começar a investir'
    ],
    objectives: [
      'Compreender a importância dos investimentos',
      'Identificar seu perfil de investidor',
      'Conhecer os principais tipos de investimentos',
      'Entender conceitos de risco e retorno',
      'Aprender a diversificar investimentos',
      'Dar os primeiros passos como investidor'
    ]
  };

  const sections: ModuleSection[] = [
    {
      id: 'por-que-investir',
      title: 'Por que Investir?',
      content: `
        <h3>💰 O Poder dos Investimentos</h3>
        <p>Investir é fazer seu dinheiro trabalhar para você, gerando mais dinheiro ao longo do tempo. É a diferença entre <strong>trabalhar pelo dinheiro</strong> e fazer o <strong>dinheiro trabalhar para você</strong>.</p>
        
        <h4>🔥 A Inflação: Seu Inimigo Silencioso</h4>
        
        <div class="bg-red-50 p-4 rounded-lg mt-4">
          <h5 class="font-bold text-red-700 mb-2">⚠️ O que acontece se você NÃO investir?</h5>
          <p class="text-red-600 mb-3">Seu dinheiro perde valor todos os dias por causa da inflação!</p>
          
          <div class="bg-red-100 p-3 rounded">
            <p class="font-semibold text-red-700">Exemplo Prático:</p>
            <ul class="text-red-600 text-sm mt-1">
              <li>• R$ 10.000 hoje</li>
              <li>• Inflação de 4% ao ano</li>
              <li>• Em 10 anos: poder de compra de apenas R$ 6.756</li>
              <li>• <strong>Perda real: R$ 3.244!</strong></li>
            </ul>
          </div>
        </div>

        <h4 class="mt-6">📈 O Milagre dos Juros Compostos</h4>
        
        <div class="bg-green-50 p-4 rounded-lg">
          <p class="text-green-700 mb-3">Einstein chamou os juros compostos de "a oitava maravilha do mundo"</p>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-green-100 p-3 rounded">
              <h6 class="font-bold text-green-700">💸 Sem Investir</h6>
              <p class="text-sm text-green-600">R$ 500/mês por 20 anos</p>
              <p class="text-lg font-bold text-green-600">Total: R$ 120.000</p>
            </div>
            
            <div class="bg-green-100 p-3 rounded">
              <h6 class="font-bold text-green-700">📈 Investindo a 10% a.a.</h6>
              <p class="text-sm text-green-600">R$ 500/mês por 20 anos</p>
              <p class="text-lg font-bold text-green-600">Total: R$ 379.684</p>
              <p class="text-xs text-green-500">Ganho extra: R$ 259.684!</p>
            </div>
          </div>
        </div>

        <div class="bg-yellow-50 p-4 rounded-lg mt-6">
          <h4>💡 Lembre-se</h4>
          <p>Não existe investimento sem risco, mas o <strong>maior risco é não investir</strong>. Comece pequeno, aprenda gradualmente e seja consistente. O tempo e a disciplina são seus maiores aliados!</p>
        </div>
      `,
      type: 'text'
    },
    {
      id: 'tipos-investimentos',
      title: 'Tipos de Investimentos',
      content: `
        <h3>🏦 Renda Fixa vs Renda Variável</h3>
        
        <p>Existem duas grandes categorias de investimentos. Entender a diferença é fundamental para construir uma carteira equilibrada.</p>
        
        <h4 class="mt-6">🛡️ Renda Fixa</h4>
        
        <div class="bg-blue-50 p-4 rounded-lg">
          <h5 class="font-bold text-blue-700 mb-3">📊 Características</h5>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h6 class="font-semibold text-blue-700 mb-2">✅ Vantagens</h6>
              <ul class="text-blue-600 text-sm space-y-1">
                <li>• Previsibilidade de retorno</li>
                <li>• Menor risco</li>
                <li>• Proteção do capital</li>
                <li>• Ideal para reserva de emergência</li>
                <li>• Garantia do FGC até R$ 250.000</li>
              </ul>
            </div>
            
            <div>
              <h6 class="font-semibold text-blue-700 mb-2">⚠️ Desvantagens</h6>
              <ul class="text-blue-600 text-sm space-y-1">
                <li>• Retorno limitado</li>
                <li>• Pode perder para a inflação</li>
                <li>• Menor potencial de crescimento</li>
                <li>• Tributação regressiva do IR</li>
              </ul>
            </div>
          </div>
          
          <div class="mt-4 space-y-3">
            <div class="p-3 bg-blue-100 rounded">
              <h6 class="font-semibold text-blue-700">🏛️ Tesouro Direto</h6>
              <p class="text-blue-600 text-sm">Títulos do governo federal. Maior segurança do país.</p>
              <p class="text-blue-500 text-xs">• Selic, IPCA+, Prefixado</p>
            </div>
            
            <div class="p-3 bg-blue-100 rounded">
              <h6 class="font-semibold text-blue-700">🏦 CDB/LCI/LCA</h6>
              <p class="text-blue-600 text-sm">Títulos bancários com garantia do FGC.</p>
              <p class="text-blue-500 text-xs">• LCI/LCA isentos de IR</p>
            </div>
          </div>
        </div>

        <h4 class="mt-6">📈 Renda Variável</h4>
        
        <div class="bg-green-50 p-4 rounded-lg">
          <h5 class="font-bold text-green-700 mb-3">📊 Características</h5>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h6 class="font-semibold text-green-700 mb-2">✅ Vantagens</h6>
              <ul class="text-green-600 text-sm space-y-1">
                <li>• Maior potencial de retorno</li>
                <li>• Proteção contra inflação</li>
                <li>• Participação no crescimento da economia</li>
                <li>• Dividendos isentos de IR</li>
                <li>• Liquidez diária</li>
              </ul>
            </div>
            
            <div>
              <h6 class="font-semibold text-green-700 mb-2">⚠️ Desvantagens</h6>
              <ul class="text-green-600 text-sm space-y-1">
                <li>• Maior volatilidade</li>
                <li>• Risco de perdas</li>
                <li>• Requer conhecimento</li>
                <li>• Influência emocional</li>
                <li>• Sem garantias</li>
              </ul>
            </div>
          </div>
          
          <div class="mt-4 space-y-3">
            <div class="p-3 bg-green-100 rounded">
              <h6 class="font-semibold text-green-700">📊 Ações</h6>
              <p class="text-green-600 text-sm">Participação no capital de empresas.</p>
              <p class="text-green-500 text-xs">• Dividendos + valorização</p>
            </div>
            
            <div class="p-3 bg-green-100 rounded">
              <h6 class="font-semibold text-green-700">🏢 Fundos Imobiliários (FIIs)</h6>
              <p class="text-green-600 text-sm">Investimento em imóveis via cotas.</p>
              <p class="text-green-500 text-xs">• Renda mensal isenta de IR</p>
            </div>
          </div>
        </div>

        <div class="bg-purple-50 p-4 rounded-lg mt-6">
          <h4>🎯 Estratégia de Diversificação</h4>
          <p>A regra de ouro: <strong>nunca coloque todos os ovos na mesma cesta</strong>. Diversifique entre renda fixa e variável conforme seu perfil de risco e objetivos.</p>
          
          <div class="grid md:grid-cols-3 gap-3 mt-3">
            <div class="p-3 bg-purple-100 rounded text-center">
              <h6 class="font-semibold text-purple-700">Conservador</h6>
              <p class="text-purple-600 text-sm">80% RF + 20% RV</p>
            </div>
            <div class="p-3 bg-purple-100 rounded text-center">
              <h6 class="font-semibold text-purple-700">Moderado</h6>
              <p class="text-purple-600 text-sm">60% RF + 40% RV</p>
            </div>
            <div class="p-3 bg-purple-100 rounded text-center">
              <h6 class="font-semibold text-purple-700">Arrojado</h6>
              <p class="text-purple-600 text-sm">40% RF + 60% RV</p>
            </div>
          </div>
        </div>
      `,
      type: 'text'
    },
    {
      id: 'calculadora-investimentos',
      title: 'Calculadora: Simulação de Investimentos',
      content: '',
      type: 'calculator'
    },
    {
      id: 'quiz-investimentos',
      title: 'Quiz: Investimentos Básicos',
      content: '',
      type: 'quiz'
    }
  ];

  const quiz: QuizSet = {
    id: 'quiz-investimentos',
    title: 'Quiz: Investimentos Básicos',
    questions: [
      {
        id: 'q1',
        question: 'Qual é o principal benefício dos juros compostos?',
        options: [
          'Ganhar dinheiro rapidamente',
          'Rendimento sobre rendimento ao longo do tempo',
          'Garantia de não ter perdas',
          'Isenção de impostos'
        ],
        correctAnswer: 1,
        explanation: 'Os juros compostos permitem que você ganhe rendimento não apenas sobre o valor inicial, mas também sobre os rendimentos acumulados.',
        points: 10
      },
      {
        id: 'q2',
        question: 'Qual investimento é mais adequado para reserva de emergência?',
        options: [
          'Ações',
          'Fundos imobiliários',
          'Tesouro Selic',
          'Criptomoedas'
        ],
        correctAnswer: 2,
        explanation: 'O Tesouro Selic oferece liquidez diária, baixo risco e rendimento que acompanha a taxa básica de juros.',
        points: 10
      },
      {
        id: 'q3',
        question: 'O que caracteriza um investidor conservador?',
        options: [
          'Busca altos retornos rapidamente',
          'Aceita perdas para ganhar mais',
          'Prioriza segurança e preservação do capital',
          'Investe apenas em ações'
        ],
        correctAnswer: 2,
        explanation: 'O investidor conservador prioriza a segurança e preservação do capital, aceitando retornos menores em troca de menor risco.',
        points: 10
      }
    ]
  };

  const calcularInvestimento = () => {
    const taxaMensal = taxaJuros / 100 / 12;
    const meses = prazoAnos * 12;
    
    // Cálculo do valor futuro com aportes mensais
    const valorFuturo = valorInicial * Math.pow(1 + taxaMensal, meses) +
      aportesMensais * ((Math.pow(1 + taxaMensal, meses) - 1) / taxaMensal);
    
    const totalInvestido = valorInicial + (aportesMensais * meses);
    const rendimento = valorFuturo - totalInvestido;
    
    // Valor real descontando inflação
    const taxaInflacaoMensal = inflacao / 100 / 12;
    const valorReal = valorFuturo / Math.pow(1 + taxaInflacaoMensal, meses);
    
    return {
      valorFuturo,
      totalInvestido,
      rendimento,
      valorReal
    };
  };

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const calculateQuizScore = () => {
    const correctAnswers = quiz.questions.filter(q => 
      quizAnswers[q.id] === q.correctAnswer
    ).length;
    return (correctAnswers / quiz.questions.length) * 100;
  };

  const handleSectionComplete = (sectionIndex: number) => {
    setCompletedSections(prev => new Set([...prev, sectionIndex]));
  };

  const renderCalculadoraInvestimentos = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-6 rounded-lg">
        <h4 className="text-xl font-bold text-green-700 mb-4 flex items-center">
          <DollarSign className="mr-2" />
          Simulador de Investimentos
        </h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Inicial (R$)
              </label>
              <input
                type="number"
                value={valorInicial || ''}
                onChange={(e) => setValorInicial(Number(e.target.value))}
                className="w-full p-3 border rounded-lg"
                placeholder="Ex: 1000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aportes Mensais (R$)
              </label>
              <input
                type="number"
                value={aportesMensais || ''}
                onChange={(e) => setAportesMensais(Number(e.target.value))}
                className="w-full p-3 border rounded-lg"
                placeholder="Ex: 500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taxa de Juros Anual (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={taxaJuros || ''}
                onChange={(e) => setTaxaJuros(Number(e.target.value))}
                className="w-full p-3 border rounded-lg"
                placeholder="Ex: 10"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prazo (anos)
              </label>
              <input
                type="number"
                value={prazoAnos || ''}
                onChange={(e) => setPrazoAnos(Number(e.target.value))}
                className="w-full p-3 border rounded-lg"
                placeholder="Ex: 10"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inflação Anual (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={inflacao || ''}
                onChange={(e) => setInflacao(Number(e.target.value))}
                className="w-full p-3 border rounded-lg"
                placeholder="Ex: 4"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            {valorInicial > 0 && aportesMensais > 0 && taxaJuros > 0 && prazoAnos > 0 && (
              <>
                <div className="bg-blue-50 p-4 rounded">
                  <p className="font-semibold text-blue-700">Total Investido</p>
                  <p className="text-2xl font-bold text-blue-600">
                    R$ {calcularInvestimento().totalInvestido.toLocaleString('pt-BR')}
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded">
                  <p className="font-semibold text-green-700">Valor Futuro (Nominal)</p>
                  <p className="text-2xl font-bold text-green-600">
                    R$ {calcularInvestimento().valorFuturo.toLocaleString('pt-BR')}
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded">
                  <p className="font-semibold text-purple-700">Rendimento</p>
                  <p className="text-2xl font-bold text-purple-600">
                    R$ {calcularInvestimento().rendimento.toLocaleString('pt-BR')}
                  </p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded">
                  <p className="font-semibold text-orange-700">Valor Real (Descontando Inflação)</p>
                  <p className="text-xl font-bold text-orange-600">
                    R$ {calcularInvestimento().valorReal.toLocaleString('pt-BR')}
                  </p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded">
                  <p className="font-semibold text-yellow-700">Rentabilidade Total</p>
                  <p className="text-xl font-bold text-yellow-600">
                    {((calcularInvestimento().valorFuturo / calcularInvestimento().totalInvestido - 1) * 100).toFixed(1)}%
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-bold text-gray-700 mb-2">💡 Dicas de Investimento por Perfil</h5>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-100 p-3 rounded">
              <h6 className="font-semibold text-blue-700">Conservador</h6>
              <p className="text-sm text-blue-600">Tesouro Selic, CDB, LCI/LCA</p>
              <p className="text-xs text-blue-500">Retorno: 8-10% a.a.</p>
            </div>
            <div className="bg-green-100 p-3 rounded">
              <h6 className="font-semibold text-green-700">Moderado</h6>
              <p className="text-sm text-green-600">60% RF + 40% RV</p>
              <p className="text-xs text-green-500">Retorno: 10-12% a.a.</p>
            </div>
            <div className="bg-red-100 p-3 rounded">
              <h6 className="font-semibold text-red-700">Arrojado</h6>
              <p className="text-sm text-red-600">40% RF + 60% RV</p>
              <p className="text-xs text-red-500">Retorno: 12-15%+ a.a.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuiz = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 p-6 rounded-lg">
        <h4 className="text-xl font-bold text-purple-700 mb-4 flex items-center">
          <Brain className="mr-2" />
          {quiz.title}
        </h4>
        
        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="bg-white p-4 rounded-lg border">
              <h5 className="font-semibold text-gray-800 mb-3">
                {index + 1}. {question.question}
              </h5>
              
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={question.id}
                      value={optionIndex}
                      checked={quizAnswers[question.id] === optionIndex}
                      onChange={() => handleQuizAnswer(question.id, optionIndex)}
                      className="text-purple-600"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              
              {quizAnswers[question.id] !== undefined && (
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">
                    <strong>Explicação:</strong> {question.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {Object.keys(quizAnswers).length === quiz.questions.length && (
          <div className="mt-6 p-4 bg-white rounded-lg border">
            <h5 className="font-bold text-gray-800 mb-2">📊 Resultado do Quiz</h5>
            <p className="text-lg">
              Sua pontuação: <span className="font-bold text-purple-600">{calculateQuizScore().toFixed(0)}%</span>
            </p>
            {calculateQuizScore() >= 70 ? (
              <p className="text-green-600 text-sm mt-1">✅ Excelente! Você domina os conceitos básicos de investimentos.</p>
            ) : (
              <p className="text-orange-600 text-sm mt-1">📚 Continue estudando para melhorar seu conhecimento sobre investimentos.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderSection = () => {
    const section = sections[currentSection];
    
    if (section.type === 'calculator') {
      return renderCalculadoraInvestimentos();
    }
    
    if (section.type === 'quiz') {
      return renderQuiz();
    }
    
    return (
      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: section.content }} />
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header do módulo */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="mr-3" size={32} />
          <div>
            <h1 className="text-2xl font-bold">{moduleInfo.title}</h1>
            <p className="text-green-100">{moduleInfo.description}</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <Clock className="mr-2" size={16} />
            <span>Duração: {moduleInfo.duration}</span>
          </div>
          <div className="flex items-center">
            <Target className="mr-2" size={16} />
            <span>Nível: {moduleInfo.level}</span>
          </div>
          <div className="flex items-center">
            <Award className="mr-2" size={16} />
            <span>Progresso: {completedSections.size}/{sections.length}</span>
          </div>
        </div>
      </div>

      {/* Navegação das seções */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="flex overflow-x-auto">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setCurrentSection(index)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                currentSection === index
                  ? 'border-green-500 text-green-600 bg-green-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                {completedSections.has(index) && <CheckCircle size={16} className="text-green-500" />}
                <span>{section.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo da seção */}
      <Card className="mb-6">
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </Card>

      {/* Navegação inferior */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2" size={16} />
          Anterior
        </Button>

        <div className="flex space-x-2">
          {sections.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentSection
                  ? 'bg-green-500'
                  : completedSections.has(index)
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={() => {
            if (currentSection < sections.length - 1) {
              handleSectionComplete(currentSection);
              setCurrentSection(currentSection + 1);
            } else {
              handleSectionComplete(currentSection);
            }
          }}
          disabled={currentSection === sections.length - 1 && completedSections.has(currentSection)}
          className="flex items-center"
        >
          {currentSection === sections.length - 1 ? (
            <>
              <Trophy className="mr-2" size={16} />
              Concluir
            </>
          ) : (
            <>
              Próximo
              <ArrowRight className="ml-2" size={16} />
            </>
          )}
        </Button>
      </div>

      {/* Barra de progresso */}
      <div className="mt-6 bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(completedSections.size / sections.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default InvestimentosBasicos;