import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Target,
  DollarSign,
  CheckCircle,
  Circle,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Star,
  PiggyBank,
  TrendingUp,
  Shield,
  Brain,
  Lightbulb,
  FileText,
  Award,
  Clock,
  Calculator,
  BarChart3,
  Coins,
  Wallet,
  CreditCard,
  Building,
  Home,
  Car,
  Zap,
  Calendar,
  Percent,
  Eye,
  Lock,
  Unlock,
  Info
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { ModuleContent, ModuleSection, Quiz, QuizSet, Exercise } from './index';

const FundamentosEducacaoFinanceira: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [exerciseProgress, setExerciseProgress] = useState<Record<string, boolean>>({});
  
  // Estados para calculadoras
  const [rendaMensal, setRendaMensal] = useState(3000);
  const [gastosMensais, setGastosMensais] = useState(2500);
  const [metaEconomia, setMetaEconomia] = useState(10);

  const moduleInfo: ModuleContent = {
    id: 'fundamentos',
    title: 'Fundamentos de Educação Financeira',
    description: 'Aprenda os conceitos básicos essenciais para uma vida financeira saudável',
    duration: '2-3 horas',
    level: 'Iniciante',
    topics: [
      'Conceitos básicos de finanças pessoais',
      'Importância da educação financeira',
      'Planejamento financeiro pessoal',
      'Controle de gastos e receitas',
      'Objetivos financeiros',
      'Mentalidade financeira'
    ],
    objectives: [
      'Compreender a importância da educação financeira',
      'Identificar conceitos fundamentais de finanças pessoais',
      'Desenvolver uma mentalidade financeira saudável',
      'Aprender a definir objetivos financeiros',
      'Conhecer ferramentas básicas de controle financeiro',
      'Criar uma base sólida para decisões financeiras'
    ]
  };

  const sections: ModuleSection[] = [
    {
      id: 'introducao',
      title: 'Introdução à Educação Financeira',
      content: `
        <h3>💡 Por que a Educação Financeira é Importante?</h3>
        <p>A educação financeira é a base para uma vida próspera e tranquila. Ela nos ensina a tomar decisões conscientes sobre dinheiro, evitar armadilhas financeiras e construir um futuro seguro.</p>
        
        <h4 class="mt-6">🎯 Benefícios da Educação Financeira</h4>
        
        <div class="grid md:grid-cols-2 gap-4 mt-4">
          <div class="bg-green-50 p-4 rounded-lg">
            <h5 class="font-bold text-green-700 mb-3">✅ Benefícios Pessoais</h5>
            <ul class="text-green-600 space-y-2">
              <li>• Redução do estresse financeiro</li>
              <li>• Maior controle sobre o dinheiro</li>
              <li>• Capacidade de realizar sonhos</li>
              <li>• Segurança para emergências</li>
              <li>• Aposentadoria tranquila</li>
              <li>• Liberdade de escolhas</li>
            </ul>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-lg">
            <h5 class="font-bold text-blue-700 mb-3">🏆 Benefícios Familiares</h5>
            <ul class="text-blue-600 space-y-2">
              <li>• Harmonia familiar</li>
              <li>• Educação dos filhos</li>
              <li>• Planejamento de viagens</li>
              <li>• Casa própria</li>
              <li>• Investimento em educação</li>
              <li>• Legado para próximas gerações</li>
            </ul>
          </div>
        </div>

        <h4 class="mt-6">📊 Dados Importantes</h4>
        
        <div class="bg-yellow-50 p-4 rounded-lg">
          <h5 class="font-bold text-yellow-700 mb-3">⚠️ Realidade Brasileira</h5>
          <div class="grid md:grid-cols-3 gap-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-yellow-600">65%</p>
              <p class="text-yellow-700 text-sm">dos brasileiros não controlam suas finanças</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-yellow-600">70%</p>
              <p class="text-yellow-700 text-sm">não têm reserva de emergência</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-yellow-600">40%</p>
              <p class="text-yellow-700 text-sm">estão endividados</p>
            </div>
          </div>
        </div>

        <div class="bg-purple-50 p-4 rounded-lg mt-6">
          <h4>🚀 Sua Jornada Começa Aqui</h4>
          <p class="text-purple-700">Este módulo é o primeiro passo para transformar sua relação com o dinheiro. Você aprenderá conceitos fundamentais que servirão de base para todos os outros módulos.</p>
        </div>
      `,
      type: 'text'
    },
    {
      id: 'conceitos-basicos',
      title: 'Conceitos Básicos',
      content: `
        <h3>📚 Vocabulário Financeiro Essencial</h3>
        <p>Conhecer os termos básicos é fundamental para entender o mundo das finanças. Vamos aprender os conceitos mais importantes:</p>
        
        <h4 class="mt-6">💰 Conceitos de Renda e Gastos</h4>
        
        <div class="space-y-4">
          <div class="border border-green-300 p-4 rounded-lg bg-green-50">
            <h5 class="font-bold text-green-700">💵 Renda Bruta vs Renda Líquida</h5>
            <div class="grid md:grid-cols-2 gap-4 mt-3">
              <div>
                <h6 class="font-semibold text-green-600">Renda Bruta</h6>
                <p class="text-green-600 text-sm">Valor total antes dos descontos (impostos, INSS, etc.)</p>
                <p class="text-green-500 text-xs">Exemplo: Salário de R$ 5.000</p>
              </div>
              <div>
                <h6 class="font-semibold text-green-600">Renda Líquida</h6>
                <p class="text-green-600 text-sm">Valor que realmente recebe após descontos</p>
                <p class="text-green-500 text-xs">Exemplo: R$ 4.200 na conta</p>
              </div>
            </div>
          </div>
          
          <div class="border border-red-300 p-4 rounded-lg bg-red-50">
            <h5 class="font-bold text-red-700">💸 Tipos de Gastos</h5>
            <div class="grid md:grid-cols-3 gap-4 mt-3">
              <div>
                <h6 class="font-semibold text-red-600">Gastos Fixos</h6>
                <p class="text-red-600 text-sm">Valores que não mudam mensalmente</p>
                <ul class="text-red-500 text-xs space-y-1">
                  <li>• Aluguel</li>
                  <li>• Financiamentos</li>
                  <li>• Seguros</li>
                  <li>• Assinaturas</li>
                </ul>
              </div>
              <div>
                <h6 class="font-semibold text-red-600">Gastos Variáveis</h6>
                <p class="text-red-600 text-sm">Valores que mudam a cada mês</p>
                <ul class="text-red-500 text-xs space-y-1">
                  <li>• Alimentação</li>
                  <li>• Transporte</li>
                  <li>• Lazer</li>
                  <li>• Roupas</li>
                </ul>
              </div>
              <div>
                <h6 class="font-semibold text-red-600">Gastos Eventuais</h6>
                <p class="text-red-600 text-sm">Gastos esporádicos ou emergenciais</p>
                <ul class="text-red-500 text-xs space-y-1">
                  <li>• Médico</li>
                  <li>• Consertos</li>
                  <li>• Presentes</li>
                  <li>• Viagens</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <h4 class="mt-6">🎯 Conceitos de Planejamento</h4>
        
        <div class="space-y-4">
          <div class="border border-blue-300 p-4 rounded-lg bg-blue-50">
            <h5 class="font-bold text-blue-700">📊 Fluxo de Caixa</h5>
            <p class="text-blue-600 mb-3">Controle de entradas e saídas de dinheiro ao longo do tempo.</p>
            <div class="bg-blue-100 p-3 rounded">
              <p class="text-blue-700 font-semibold">Fórmula Básica:</p>
              <p class="text-blue-600">Fluxo de Caixa = Receitas - Despesas</p>
              <p class="text-blue-500 text-sm">Se positivo: sobra dinheiro | Se negativo: falta dinheiro</p>
            </div>
          </div>
          
          <div class="border border-purple-300 p-4 rounded-lg bg-purple-50">
            <h5 class="font-bold text-purple-700">🎯 Objetivos Financeiros</h5>
            <div class="grid md:grid-cols-3 gap-4 mt-3">
              <div>
                <h6 class="font-semibold text-purple-600">Curto Prazo</h6>
                <p class="text-purple-600 text-sm">Até 1 ano</p>
                <ul class="text-purple-500 text-xs space-y-1">
                  <li>• Reserva emergência</li>
                  <li>• Quitar dívidas</li>
                  <li>• Viagem</li>
                </ul>
              </div>
              <div>
                <h6 class="font-semibold text-purple-600">Médio Prazo</h6>
                <p class="text-purple-600 text-sm">1 a 5 anos</p>
                <ul class="text-purple-500 text-xs space-y-1">
                  <li>• Casa própria</li>
                  <li>• Carro</li>
                  <li>• Curso superior</li>
                </ul>
              </div>
              <div>
                <h6 class="font-semibold text-purple-600">Longo Prazo</h6>
                <p class="text-purple-600 text-sm">Mais de 5 anos</p>
                <ul class="text-purple-500 text-xs space-y-1">
                  <li>• Aposentadoria</li>
                  <li>• Independência financeira</li>
                  <li>• Educação dos filhos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-orange-50 p-4 rounded-lg mt-6">
          <h4>💡 Dica Importante</h4>
          <p class="text-orange-700">Comece sempre pelo básico: controle suas receitas e despesas. Sem isso, qualquer planejamento financeiro será ineficaz.</p>
        </div>
      `,
      type: 'text'
    },
    {
      id: 'calculadora-basica',
      title: 'Calculadora: Análise Financeira Básica',
      content: '',
      type: 'calculator'
    },
    {
      id: 'quiz-fundamentos',
      title: 'Quiz: Fundamentos',
      content: '',
      type: 'quiz'
    }
  ];

  const quiz: QuizSet = {
    id: 'quiz-fundamentos',
    title: 'Quiz: Fundamentos de Educação Financeira',
    questions: [
      {
        id: 'q1',
        question: 'Qual é a diferença entre renda bruta e renda líquida?',
        options: [
          'Não há diferença, são a mesma coisa',
          'Renda bruta é antes dos descontos, líquida é após os descontos',
          'Renda líquida é sempre maior que a bruta',
          'Renda bruta inclui investimentos'
        ],
        correctAnswer: 1,
        explanation: 'Renda bruta é o valor total antes dos descontos (impostos, INSS, etc.), enquanto renda líquida é o que realmente recebemos após todos os descontos.',
        points: 10
      },
      {
        id: 'q2',
        question: 'Qual tipo de gasto representa o aluguel da casa?',
        options: [
          'Gasto variável',
          'Gasto eventual',
          'Gasto fixo',
          'Gasto de investimento'
        ],
        correctAnswer: 2,
        explanation: 'O aluguel é um gasto fixo porque tem o mesmo valor todos os meses e é uma despesa obrigatória.',
        points: 10
      },
      {
        id: 'q3',
        question: 'Um objetivo financeiro de comprar uma casa própria é classificado como:',
        options: [
          'Curto prazo (até 1 ano)',
          'Médio prazo (1 a 5 anos)',
          'Longo prazo (mais de 5 anos)',
          'Não é um objetivo financeiro'
        ],
        correctAnswer: 1,
        explanation: 'Comprar uma casa própria geralmente é um objetivo de médio prazo (1 a 5 anos), pois requer planejamento e acúmulo de recursos para entrada e financiamento.',
        points: 10
      }
    ]
  };

  const calcularAnaliseFinanceira = () => {
    const sobra = rendaMensal - gastosMensais;
    const percentualEconomia = (sobra / rendaMensal) * 100;
    const valorMetaEconomia = (rendaMensal * metaEconomia) / 100;
    const diferenca = sobra - valorMetaEconomia;
    
    return {
      sobra,
      percentualEconomia,
      valorMetaEconomia,
      diferenca,
      situacao: sobra > 0 ? 'positiva' : sobra === 0 ? 'equilibrada' : 'negativa'
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

  const renderCalculadoraBasica = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
          <Calculator className="mr-2" />
          Análise Financeira Básica
        </h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Renda Mensal Líquida (R$)
              </label>
              <input
                type="number"
                value={rendaMensal || ''}
                onChange={(e) => setRendaMensal(Number(e.target.value))}
                className="w-full p-3 border rounded-lg"
                placeholder="Ex: 3000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gastos Mensais Totais (R$)
              </label>
              <input
                type="number"
                value={gastosMensais || ''}
                onChange={(e) => setGastosMensais(Number(e.target.value))}
                className="w-full p-3 border rounded-lg"
                placeholder="Ex: 2500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta de Economia (% da renda)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={metaEconomia || ''}
                onChange={(e) => setMetaEconomia(Number(e.target.value))}
                className="w-full p-3 border rounded-lg"
                placeholder="Ex: 10"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            {rendaMensal > 0 && gastosMensais >= 0 && (
              <>
                <div className={`p-4 rounded ${
                  calcularAnaliseFinanceira().situacao === 'positiva' ? 'bg-green-50' :
                  calcularAnaliseFinanceira().situacao === 'equilibrada' ? 'bg-yellow-50' : 'bg-red-50'
                }`}>
                  <p className={`font-semibold ${
                    calcularAnaliseFinanceira().situacao === 'positiva' ? 'text-green-700' :
                    calcularAnaliseFinanceira().situacao === 'equilibrada' ? 'text-yellow-700' : 'text-red-700'
                  }`}>
                    Sobra/Falta Mensal
                  </p>
                  <p className={`text-2xl font-bold ${
                    calcularAnaliseFinanceira().situacao === 'positiva' ? 'text-green-600' :
                    calcularAnaliseFinanceira().situacao === 'equilibrada' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    R$ {Math.abs(calcularAnaliseFinanceira().sobra).toLocaleString('pt-BR')}
                    {calcularAnaliseFinanceira().situacao === 'negativa' && ' (déficit)'}
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded">
                  <p className="font-semibold text-blue-700">Percentual de Economia Atual</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {calcularAnaliseFinanceira().percentualEconomia.toFixed(1)}%
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded">
                  <p className="font-semibold text-purple-700">Meta de Economia (R$)</p>
                  <p className="text-xl font-bold text-purple-600">
                    R$ {calcularAnaliseFinanceira().valorMetaEconomia.toLocaleString('pt-BR')}
                  </p>
                </div>
                
                <div className={`p-4 rounded ${
                  calcularAnaliseFinanceira().diferenca >= 0 ? 'bg-green-50' : 'bg-orange-50'
                }`}>
                  <p className={`font-semibold ${
                    calcularAnaliseFinanceira().diferenca >= 0 ? 'text-green-700' : 'text-orange-700'
                  }`}>
                    {calcularAnaliseFinanceira().diferenca >= 0 ? 'Superou a meta!' : 'Falta para a meta'}
                  </p>
                  <p className={`text-xl font-bold ${
                    calcularAnaliseFinanceira().diferenca >= 0 ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    R$ {Math.abs(calcularAnaliseFinanceira().diferenca).toLocaleString('pt-BR')}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-bold text-gray-700 mb-2">💡 Análise da Situação</h5>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h6 className="font-semibold text-gray-700">📊 Indicadores Ideais</h6>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Economia: 10-20% da renda</li>
                <li>• Gastos fixos: máximo 60% da renda</li>
                <li>• Reserva emergência: 3-6 meses de gastos</li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-semibold text-gray-700">🎯 Recomendações</h6>
              {calcularAnaliseFinanceira().situacao === 'negativa' ? (
                <p className="text-red-600 text-sm">⚠️ Situação crítica! Revise seus gastos urgentemente.</p>
              ) : calcularAnaliseFinanceira().percentualEconomia < 10 ? (
                <p className="text-yellow-600 text-sm">⚡ Tente economizar pelo menos 10% da renda.</p>
              ) : (
                <p className="text-green-600 text-sm">✅ Parabéns! Você está no caminho certo.</p>
              )}
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
              <p className="text-green-600 text-sm mt-1">✅ Excelente! Você domina os fundamentos da educação financeira.</p>
            ) : (
              <p className="text-orange-600 text-sm mt-1">📚 Continue estudando para melhorar seu conhecimento sobre os fundamentos.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderSection = () => {
    const section = sections[currentSection];
    
    if (section.type === 'calculator') {
      return renderCalculadoraBasica();
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center mb-4">
          <BookOpen className="mr-3" size={32} />
          <div>
            <h1 className="text-2xl font-bold">{moduleInfo.title}</h1>
            <p className="text-blue-100">{moduleInfo.description}</p>
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
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
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
                  ? 'bg-blue-500'
                  : completedSections.has(index)
                  ? 'bg-blue-500'
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
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(completedSections.size / sections.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default FundamentosEducacaoFinanceira;