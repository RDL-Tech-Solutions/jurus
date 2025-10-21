import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  DollarSign,
  AlertTriangle,
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
  TrendingDown,
  Shield,
  Calculator,
  PieChart,
  BarChart3,
  Zap,
  Calendar,
  Percent,
  Building,
  Landmark,
  Home,
  Coins,
  Eye,
  Lock,
  Unlock,
  Star,
  Info
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { ModuleContent, ModuleSection, Quiz, QuizSet } from './index';

const ControleDividas: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  
  // Estados para calculadoras
  const [valorDivida, setValorDivida] = useState(5000);
  const [taxaJuros, setTaxaJuros] = useState(15);
  const [prazoMeses, setPrazoMeses] = useState(12);
  const [rendaMensal, setRendaMensal] = useState(3000);
  const [gastosMensais, setGastosMensais] = useState(2500);
  const [valorPagamento, setValorPagamento] = useState(500);

  const moduleInfo: ModuleContent = {
    id: 'controle-dividas',
    title: 'Controle de Dívidas',
    description: 'Aprenda estratégias eficazes para quitar dívidas e manter sua vida financeira saudável',
    duration: '2-3 horas',
    level: 'Iniciante',
    topics: [
      'Tipos de dívidas',
      'Estratégias de quitação',
      'Negociação com credores',
      'Prevenção de endividamento',
      'Reorganização financeira',
      'Planejamento pós-quitação'
    ],
    objectives: [
      'Identificar e categorizar suas dívidas',
      'Aprender estratégias de quitação eficazes',
      'Dominar técnicas de negociação',
      'Criar um plano de pagamento sustentável',
      'Prevenir futuro endividamento',
      'Reorganizar completamente suas finanças'
    ]
  };

  const sections: ModuleSection[] = [
    {
      id: 'tipos-dividas',
      title: 'Tipos de Dívidas',
      content: `
        <h3>💳 Conhecendo Suas Dívidas</h3>
        <p>O primeiro passo para controlar dívidas é entender que nem todas são iguais. Cada tipo tem características específicas e requer estratégias diferentes.</p>
        
        <h4 class="mt-6">🔴 Dívidas Ruins (Prioritárias)</h4>
        
        <div class="bg-red-50 p-4 rounded-lg">
          <h5 class="font-bold text-red-700 mb-3">⚠️ Características das Dívidas Ruins</h5>
          
          <div class="space-y-3">
            <div class="p-3 bg-red-100 rounded">
              <h6 class="font-semibold text-red-700">💳 Cartão de Crédito (Rotativo)</h6>
              <p class="text-red-600 text-sm">Juros: 300-400% ao ano</p>
              <p class="text-red-500 text-xs">• Maior prioridade de quitação</p>
              <p class="text-red-500 text-xs">• Juros compostos devastadores</p>
            </div>
            
            <div class="p-3 bg-red-100 rounded">
              <h6 class="font-semibold text-red-700">🏪 Cheque Especial</h6>
              <p class="text-red-600 text-sm">Juros: 200-300% ao ano</p>
              <p class="text-red-500 text-xs">• Segunda prioridade</p>
              <p class="text-red-500 text-xs">• Desconto automático na conta</p>
            </div>
            
            <div class="p-3 bg-red-100 rounded">
              <h6 class="font-semibold text-red-700">🛒 Crediário/Financiamentos</h6>
              <p class="text-red-600 text-sm">Juros: 50-150% ao ano</p>
              <p class="text-red-500 text-xs">• Terceira prioridade</p>
              <p class="text-red-500 text-xs">• Risco de perda do bem</p>
            </div>
          </div>
        </div>

        <h4 class="mt-6">🟡 Dívidas Neutras</h4>
        
        <div class="bg-yellow-50 p-4 rounded-lg">
          <div class="space-y-3">
            <div class="p-3 bg-yellow-100 rounded">
              <h6 class="font-semibold text-yellow-700">🚗 Financiamento de Veículo</h6>
              <p class="text-yellow-600 text-sm">Juros: 15-30% ao ano</p>
              <p class="text-yellow-500 text-xs">• Bem que se desvaloriza</p>
              <p class="text-yellow-500 text-xs">• Avalie necessidade real</p>
            </div>
            
            <div class="p-3 bg-yellow-100 rounded">
              <h6 class="font-semibold text-yellow-700">🎓 Financiamento Estudantil</h6>
              <p class="text-yellow-600 text-sm">Juros: 3-6% ao ano</p>
              <p class="text-yellow-500 text-xs">• Investimento em educação</p>
              <p class="text-yellow-500 text-xs">• Condições especiais de pagamento</p>
            </div>
          </div>
        </div>

        <h4 class="mt-6">🟢 Dívidas Boas</h4>
        
        <div class="bg-green-50 p-4 rounded-lg">
          <div class="space-y-3">
            <div class="p-3 bg-green-100 rounded">
              <h6 class="font-semibold text-green-700">🏠 Financiamento Imobiliário</h6>
              <p class="text-green-600 text-sm">Juros: 8-12% ao ano</p>
              <p class="text-green-500 text-xs">• Bem que se valoriza</p>
              <p class="text-green-500 text-xs">• Prazo longo (até 35 anos)</p>
              <p class="text-green-500 text-xs">• Possibilidade de amortização</p>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 p-4 rounded-lg mt-6">
          <h4>📊 Estratégia de Priorização</h4>
          <ol class="text-blue-700 space-y-2">
            <li><strong>1º:</strong> Quite dívidas com juros acima de 100% a.a.</li>
            <li><strong>2º:</strong> Negocie parcelamentos de dívidas altas</li>
            <li><strong>3º:</strong> Mantenha financiamentos de bens que se valorizam</li>
            <li><strong>4º:</strong> Avalie antecipação de financiamentos neutros</li>
          </ol>
        </div>
      `,
      type: 'text'
    },
    {
      id: 'estrategias-quitacao',
      title: 'Estratégias de Quitação',
      content: `
        <h3>🎯 Métodos Comprovados de Quitação</h3>
        <p>Existem diferentes estratégias para quitar dívidas. Escolha a que melhor se adapta ao seu perfil psicológico e situação financeira.</p>
        
        <h4 class="mt-6">❄️ Método Bola de Neve (Snowball)</h4>
        
        <div class="bg-blue-50 p-4 rounded-lg">
          <h5 class="font-bold text-blue-700 mb-3">Como Funciona</h5>
          <p class="text-blue-600 mb-3">Quite primeiro as dívidas menores, independente dos juros.</p>
          
          <div class="bg-blue-100 p-3 rounded mb-3">
            <h6 class="font-semibold text-blue-700">✅ Vantagens</h6>
            <ul class="text-blue-600 text-sm space-y-1">
              <li>• Motivação psicológica rápida</li>
              <li>• Sensação de progresso constante</li>
              <li>• Reduz número de credores rapidamente</li>
              <li>• Ideal para quem precisa de motivação</li>
            </ul>
          </div>
          
          <div class="bg-blue-100 p-3 rounded">
            <h6 class="font-semibold text-blue-700">📋 Passo a Passo</h6>
            <ol class="text-blue-600 text-sm space-y-1">
              <li>1. Liste todas as dívidas do menor para o maior valor</li>
              <li>2. Pague o mínimo de todas as dívidas</li>
              <li>3. Use toda sobra para quitar a menor dívida</li>
              <li>4. Após quitar, use o valor liberado para a próxima</li>
              <li>5. Repita até quitar todas</li>
            </ol>
          </div>
        </div>

        <h4 class="mt-6">🏔️ Método Avalanche</h4>
        
        <div class="bg-purple-50 p-4 rounded-lg">
          <h5 class="font-bold text-purple-700 mb-3">Como Funciona</h5>
          <p class="text-purple-600 mb-3">Quite primeiro as dívidas com maiores juros.</p>
          
          <div class="bg-purple-100 p-3 rounded mb-3">
            <h6 class="font-semibold text-purple-700">✅ Vantagens</h6>
            <ul class="text-purple-600 text-sm space-y-1">
              <li>• Economiza mais dinheiro em juros</li>
              <li>• Matematicamente mais eficiente</li>
              <li>• Reduz o custo total das dívidas</li>
              <li>• Ideal para pessoas disciplinadas</li>
            </ul>
          </div>
          
          <div class="bg-purple-100 p-3 rounded">
            <h6 class="font-semibold text-purple-700">📋 Passo a Passo</h6>
            <ol class="text-purple-600 text-sm space-y-1">
              <li>1. Liste dívidas da maior para menor taxa de juros</li>
              <li>2. Pague o mínimo de todas as dívidas</li>
              <li>3. Use toda sobra para quitar a de maior juros</li>
              <li>4. Após quitar, ataque a próxima maior taxa</li>
              <li>5. Continue até eliminar todas</li>
            </ol>
          </div>
        </div>

        <h4 class="mt-6">🤝 Método Híbrido</h4>
        
        <div class="bg-green-50 p-4 rounded-lg">
          <h5 class="font-bold text-green-700 mb-3">Melhor dos Dois Mundos</h5>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-green-100 p-3 rounded">
              <h6 class="font-semibold text-green-700">🎯 Estratégia</h6>
              <ul class="text-green-600 text-sm space-y-1">
                <li>• Quite 1-2 dívidas pequenas primeiro</li>
                <li>• Ganhe motivação inicial</li>
                <li>• Depois foque nas maiores taxas</li>
                <li>• Combine psicologia + matemática</li>
              </ul>
            </div>
            
            <div class="bg-green-100 p-3 rounded">
              <h6 class="font-semibold text-green-700">💡 Quando Usar</h6>
              <ul class="text-green-600 text-sm space-y-1">
                <li>• Muitas dívidas pequenas</li>
                <li>• Precisa de motivação inicial</li>
                <li>• Quer otimizar custos depois</li>
                <li>• Perfil equilibrado</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-orange-50 p-4 rounded-lg mt-6">
          <h4>⚡ Dicas Extras para Acelerar</h4>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h6 class="font-semibold text-orange-700">💰 Aumente a Renda</h6>
              <ul class="text-orange-600 text-sm space-y-1">
                <li>• Freelances e trabalhos extras</li>
                <li>• Venda de itens não utilizados</li>
                <li>• Monetize hobbies e habilidades</li>
                <li>• Renda passiva (aluguéis, etc.)</li>
              </ul>
            </div>
            
            <div>
              <h6 class="font-semibold text-orange-700">✂️ Corte Gastos</h6>
              <ul class="text-orange-600 text-sm space-y-1">
                <li>• Cancele assinaturas desnecessárias</li>
                <li>• Renegocie contratos (internet, celular)</li>
                <li>• Cozinhe mais em casa</li>
                <li>• Use transporte público</li>
              </ul>
            </div>
          </div>
        </div>
      `,
      type: 'text'
    },
    {
      id: 'calculadora-dividas',
      title: 'Calculadora: Simulação de Quitação',
      content: '',
      type: 'calculator'
    },
    {
      id: 'quiz-dividas',
      title: 'Quiz: Controle de Dívidas',
      content: '',
      type: 'quiz'
    }
  ];

  const quiz: QuizSet = {
    id: 'quiz-dividas',
    title: 'Quiz: Controle de Dívidas',
    questions: [
      {
        id: 'q1',
        question: 'Qual tipo de dívida deve ser priorizada para quitação?',
        options: [
          'Financiamento imobiliário',
          'Cartão de crédito rotativo',
          'Financiamento estudantil',
          'Financiamento de veículo'
        ],
        correctAnswer: 1,
        explanation: 'O cartão de crédito rotativo tem as maiores taxas de juros (300-400% a.a.) e deve ser a primeira prioridade de quitação.',
        points: 10
      },
      {
        id: 'q2',
        question: 'No método "Bola de Neve", qual dívida você deve quitar primeiro?',
        options: [
          'A de maior valor',
          'A de menor valor',
          'A de maior taxa de juros',
          'A mais antiga'
        ],
        correctAnswer: 1,
        explanation: 'No método Bola de Neve, você quite primeiro as dívidas menores para ganhar motivação psicológica e momentum.',
        points: 10
      },
      {
        id: 'q3',
        question: 'Qual é a principal vantagem do método Avalanche?',
        options: [
          'Motivação psicológica rápida',
          'Economia máxima em juros',
          'Reduz número de credores',
          'É mais fácil de executar'
        ],
        correctAnswer: 1,
        explanation: 'O método Avalanche foca nas dívidas com maiores juros primeiro, resultando na máxima economia de dinheiro em juros.',
        points: 10
      }
    ]
  };

  const calcularQuitacao = () => {
    const jurosMensal = taxaJuros / 100 / 12;
    
    // Cálculo da parcela usando fórmula de financiamento
    const parcela = valorDivida * (jurosMensal * Math.pow(1 + jurosMensal, prazoMeses)) / 
                   (Math.pow(1 + jurosMensal, prazoMeses) - 1);
    
    const totalPago = parcela * prazoMeses;
    const totalJuros = totalPago - valorDivida;
    
    // Capacidade de pagamento
    const sobra = rendaMensal - gastosMensais;
    const comprometimento = (valorPagamento / rendaMensal) * 100;
    
    // Tempo para quitar com pagamento específico
    const tempoQuitacao = Math.log(1 + (valorDivida * jurosMensal) / valorPagamento) / 
                         Math.log(1 + jurosMensal);
    
    return {
      parcela,
      totalPago,
      totalJuros,
      sobra,
      comprometimento,
      tempoQuitacao: Math.ceil(tempoQuitacao)
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

  const renderCalculadoraDividas = () => (
    <div className="space-y-6">
      <div className="bg-red-50 p-6 rounded-lg">
        <h4 className="text-xl font-bold text-red-700 mb-4 flex items-center">
          <DollarSign className="mr-2" />
          Simulador de Quitação de Dívidas
        </h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor da Dívida (R$)
              </label>
              <input
                type="number"
                value={valorDivida || ''}
                onChange={(e) => setValorDivida(Number(e.target.value))}
                className="w-full p-3 border rounded-lg"
                placeholder="Ex: 5000"
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
                placeholder="Ex: 15"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prazo Atual (meses)
              </label>
              <input
                type="number"
                value={prazoMeses || ''}
                onChange={(e) => setPrazoMeses(Number(e.target.value))}
                className="w-full p-3 border rounded-lg"
                placeholder="Ex: 12"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Renda Mensal (R$)
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
                Gastos Mensais (R$)
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
                Valor que Pode Pagar (R$)
              </label>
              <input
                type="number"
                value={valorPagamento || ''}
                onChange={(e) => setValorPagamento(Number(e.target.value))}
                className="w-full p-3 border rounded-lg"
                placeholder="Ex: 500"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            {valorDivida > 0 && taxaJuros > 0 && prazoMeses > 0 && (
              <>
                <div className="bg-blue-50 p-4 rounded">
                  <p className="font-semibold text-blue-700">Parcela Atual</p>
                  <p className="text-2xl font-bold text-blue-600">
                    R$ {calcularQuitacao().parcela.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                  </p>
                </div>
                
                <div className="bg-red-50 p-4 rounded">
                  <p className="font-semibold text-red-700">Total de Juros</p>
                  <p className="text-2xl font-bold text-red-600">
                    R$ {calcularQuitacao().totalJuros.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded">
                  <p className="font-semibold text-green-700">Sobra Mensal</p>
                  <p className="text-2xl font-bold text-green-600">
                    R$ {calcularQuitacao().sobra.toLocaleString('pt-BR')}
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded">
                  <p className="font-semibold text-purple-700">Comprometimento da Renda</p>
                  <p className="text-xl font-bold text-purple-600">
                    {calcularQuitacao().comprometimento.toFixed(1)}%
                  </p>
                </div>
                
                {valorPagamento > 0 && (
                  <div className="bg-orange-50 p-4 rounded">
                    <p className="font-semibold text-orange-700">Tempo para Quitar</p>
                    <p className="text-xl font-bold text-orange-600">
                      {calcularQuitacao().tempoQuitacao} meses
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-bold text-gray-700 mb-2">💡 Análise da Situação</h5>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h6 className="font-semibold text-gray-700">📊 Indicadores</h6>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Comprometimento ideal: até 30% da renda</li>
                <li>• Sobra mínima recomendada: R$ 300</li>
                <li>• Reserva de emergência: 3-6 meses de gastos</li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-semibold text-gray-700">🎯 Recomendações</h6>
              {calcularQuitacao().comprometimento > 30 ? (
                <p className="text-red-600 text-sm">⚠️ Comprometimento alto! Renegocie ou aumente renda.</p>
              ) : calcularQuitacao().comprometimento > 20 ? (
                <p className="text-yellow-600 text-sm">⚡ Comprometimento moderado. Monitore de perto.</p>
              ) : (
                <p className="text-green-600 text-sm">✅ Comprometimento saudável!</p>
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
              <p className="text-green-600 text-sm mt-1">✅ Excelente! Você domina as estratégias de controle de dívidas.</p>
            ) : (
              <p className="text-orange-600 text-sm mt-1">📚 Continue estudando para melhorar seu conhecimento sobre controle de dívidas.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderSection = () => {
    const section = sections[currentSection];
    
    if (section.type === 'calculator') {
      return renderCalculadoraDividas();
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
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center mb-4">
          <CreditCard className="mr-3" size={32} />
          <div>
            <h1 className="text-2xl font-bold">{moduleInfo.title}</h1>
            <p className="text-red-100">{moduleInfo.description}</p>
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
                  ? 'border-red-500 text-red-600 bg-red-50'
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
                  ? 'bg-red-500'
                  : completedSections.has(index)
                  ? 'bg-red-500'
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
          className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(completedSections.size / sections.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ControleDividas;