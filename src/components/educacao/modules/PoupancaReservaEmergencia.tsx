import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PiggyBank,
  Shield,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Trophy,
  DollarSign,
  TrendingUp,
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
  BarChart3,
  TrendingDown,
  Home,
  Car,
  Heart,
  Briefcase
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { ModuleContent, ModuleSection, Quiz, QuizSet, Calculator } from './index';

const PoupancaReservaEmergencia: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  
  // Estados para calculadora
  const [gastosMensais, setGastosMensais] = useState(0);
  const [rendaMensal, setRendaMensal] = useState(0);
  const [valorPoupanca, setValorPoupanca] = useState(0);
  const [prazoMeses, setPrazoMeses] = useState(12);
  const [taxaJuros, setTaxaJuros] = useState(0.5);

  const moduleInfo: ModuleContent = {
    id: 'poupanca-emergencia',
    title: 'Poupança e Reserva de Emergência',
    description: 'Aprenda a criar e manter uma reserva de emergência sólida para sua segurança financeira',
    duration: '2-3 horas',
    level: 'Iniciante',
    topics: [
      'Importância da reserva de emergência',
      'Como calcular o valor ideal',
      'Onde guardar a reserva',
      'Estratégias de poupança',
      'Quando usar a reserva',
      'Como reconstruir após uso'
    ],
    objectives: [
      'Compreender a importância da reserva de emergência',
      'Calcular o valor ideal para sua situação',
      'Escolher os melhores investimentos para reserva',
      'Desenvolver estratégias eficazes de poupança',
      'Saber quando e como usar a reserva'
    ]
  };

  const sections: ModuleSection[] = [
    {
      id: 'importancia-reserva',
      title: 'Por que ter uma Reserva de Emergência?',
      content: `
        <h3>🛡️ Sua Proteção Financeira</h3>
        <p>A reserva de emergência é como um seguro financeiro que você faz para si mesmo. É o dinheiro guardado especificamente para situações imprevistas que podem afetar sua renda ou gerar gastos inesperados.</p>
        
        <h4>🚨 Situações que exigem reserva de emergência:</h4>
        
        <div class="grid md:grid-cols-2 gap-4 mt-4">
          <div class="bg-red-50 p-4 rounded-lg">
            <h5 class="font-bold text-red-700 mb-2">💼 Problemas de Renda</h5>
            <ul class="text-red-600 space-y-1">
              <li>• Perda do emprego</li>
              <li>• Redução de salário</li>
              <li>• Doença que impede trabalhar</li>
              <li>• Fechamento da empresa</li>
              <li>• Crise econômica</li>
            </ul>
          </div>
          
          <div class="bg-orange-50 p-4 rounded-lg">
            <h5 class="font-bold text-orange-700 mb-2">🏥 Gastos Inesperados</h5>
            <ul class="text-orange-600 space-y-1">
              <li>• Emergências médicas</li>
              <li>• Reparos urgentes em casa</li>
              <li>• Problemas no carro</li>
              <li>• Morte na família</li>
              <li>• Questões legais</li>
            </ul>
          </div>
        </div>

        <h4 class="mt-6">📊 Estatísticas Alarmantes</h4>
        <div class="bg-yellow-50 p-4 rounded-lg mt-4">
          <p><strong>🇧🇷 No Brasil:</strong></p>
          <ul class="mt-2 space-y-1">
            <li>• <strong>65%</strong> dos brasileiros não têm reserva de emergência</li>
            <li>• <strong>40%</strong> não conseguiriam pagar uma emergência de R$ 1.000</li>
            <li>• <strong>78%</strong> se endividariam em caso de perda de emprego</li>
            <li>• <strong>52%</strong> usariam cartão de crédito para emergências</li>
          </ul>
        </div>

        <h4 class="mt-6">✅ Benefícios de ter reserva de emergência:</h4>
        
        <div class="grid md:grid-cols-3 gap-4 mt-4">
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-3xl mb-2">😌</div>
            <h5 class="font-bold text-green-700">Paz de Espírito</h5>
            <p class="text-green-600 text-sm">Dormir tranquilo sabendo que está protegido</p>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-3xl mb-2">🚫</div>
            <h5 class="font-bold text-blue-700">Evita Dívidas</h5>
            <p class="text-blue-600 text-sm">Não precisa usar cartão ou empréstimos</p>
          </div>
          
          <div class="bg-purple-50 p-4 rounded-lg text-center">
            <div class="text-3xl mb-2">🎯</div>
            <h5 class="font-bold text-purple-700">Mantém Objetivos</h5>
            <p class="text-purple-600 text-sm">Não precisa quebrar investimentos</p>
          </div>
        </div>

        <div class="bg-blue-50 p-4 rounded-lg mt-6">
          <h4>💡 Lembre-se</h4>
          <p>A reserva de emergência não é para realizar sonhos ou fazer compras. É exclusivamente para <strong>emergências reais</strong> que ameaçam sua estabilidade financeira.</p>
        </div>
      `,
      type: 'text'
    },
    {
      id: 'calculando-valor-ideal',
      title: 'Calculando o Valor Ideal',
      content: `
        <h3>🧮 Quanto Guardar na Reserva?</h3>
        
        <p>O valor da reserva de emergência deve ser baseado nos seus <strong>gastos mensais essenciais</strong>, não na sua renda. A regra geral é ter entre 3 a 6 meses de gastos guardados.</p>
        
        <h4>📏 Fatores que influenciam o tamanho da reserva:</h4>
        
        <div class="space-y-4 mt-4">
          <div class="border-l-4 border-green-500 pl-4">
            <h5 class="font-bold text-green-700">🟢 3 meses de gastos</h5>
            <p class="text-green-600">Para quem tem:</p>
            <ul class="text-green-600 text-sm mt-1">
              <li>• Emprego estável (CLT)</li>
              <li>• Múltiplas fontes de renda</li>
              <li>• Facilidade para conseguir novo emprego</li>
              <li>• Apoio familiar forte</li>
            </ul>
          </div>
          
          <div class="border-l-4 border-yellow-500 pl-4">
            <h5 class="font-bold text-yellow-700">🟡 4-5 meses de gastos</h5>
            <p class="text-yellow-600">Para quem tem:</p>
            <ul class="text-yellow-600 text-sm mt-1">
              <li>• Emprego razoavelmente estável</li>
              <li>• Renda variável</li>
              <li>• Dependentes financeiros</li>
              <li>• Mercado de trabalho competitivo</li>
            </ul>
          </div>
          
          <div class="border-l-4 border-red-500 pl-4">
            <h5 class="font-bold text-red-700">🔴 6+ meses de gastos</h5>
            <p class="text-red-600">Para quem tem:</p>
            <ul class="text-red-600 text-sm mt-1">
              <li>• Trabalho autônomo/freelancer</li>
              <li>• Renda muito variável</li>
              <li>• Área de atuação específica</li>
              <li>• Problemas de saúde</li>
              <li>• Muitos dependentes</li>
            </ul>
          </div>
        </div>

        <h4 class="mt-6">💰 Como calcular seus gastos essenciais:</h4>
        
        <div class="bg-gray-50 p-4 rounded-lg mt-4">
          <h5 class="font-bold mb-3">📋 Lista de Gastos Essenciais</h5>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h6 class="font-semibold text-blue-700">🏠 Moradia</h6>
              <ul class="text-sm text-gray-600">
                <li>• Aluguel ou financiamento</li>
                <li>• Condomínio</li>
                <li>• IPTU</li>
                <li>• Energia, água, gás</li>
                <li>• Internet básica</li>
              </ul>
            </div>
            
            <div>
              <h6 class="font-semibold text-green-700">🍽️ Alimentação</h6>
              <ul class="text-sm text-gray-600">
                <li>• Supermercado básico</li>
                <li>• Produtos de limpeza</li>
                <li>• Produtos de higiene</li>
                <li>• Medicamentos contínuos</li>
              </ul>
            </div>
            
            <div>
              <h6 class="font-semibold text-purple-700">🚗 Transporte</h6>
              <ul class="text-sm text-gray-600">
                <li>• Combustível ou transporte público</li>
                <li>• Seguro obrigatório</li>
                <li>• Manutenção básica</li>
              </ul>
            </div>
            
            <div>
              <h6 class="font-semibold text-red-700">🏥 Saúde</h6>
              <ul class="text-sm text-gray-600">
                <li>• Plano de saúde</li>
                <li>• Medicamentos essenciais</li>
                <li>• Consultas de rotina</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-yellow-50 p-4 rounded-lg mt-6">
          <h4>⚠️ Não inclua na conta:</h4>
          <ul class="mt-2">
            <li>• <strong>Lazer e entretenimento</strong> (cinema, restaurantes, viagens)</li>
            <li>• <strong>Compras não essenciais</strong> (roupas, eletrônicos)</li>
            <li>• <strong>Investimentos</strong> (você pode pausar temporariamente)</li>
            <li>• <strong>Gastos supérfluos</strong> (streaming múltiplo, academia premium)</li>
          </ul>
        </div>

        <h4 class="mt-6">📊 Exemplo Prático</h4>
        <div class="bg-blue-50 p-4 rounded-lg">
          <p><strong>Gastos essenciais mensais:</strong></p>
          <ul class="mt-2">
            <li>Moradia: R$ 1.500</li>
            <li>Alimentação: R$ 600</li>
            <li>Transporte: R$ 300</li>
            <li>Saúde: R$ 200</li>
            <li><strong>Total: R$ 2.600</strong></li>
          </ul>
          <p class="mt-3 font-bold">Reserva recomendada: R$ 7.800 a R$ 15.600 (3 a 6 meses)</p>
        </div>
      `,
      type: 'text'
    },
    {
      id: 'calculadora-reserva',
      title: 'Calculadora: Sua Reserva Ideal',
      content: '',
      type: 'calculator'
    },
    {
      id: 'quiz-poupanca',
      title: 'Quiz: Poupança e Reserva de Emergência',
      content: '',
      type: 'quiz'
    }
  ];

  const calcularReservaIdeal = () => {
    return {
      minima: gastosMensais * 3,
      maxima: gastosMensais * 6
    };
  };

  const calcularTempoFormacao = () => {
    if (valorPoupanca <= 0) return 0;
    return Math.ceil((gastosMensais * 3) / valorPoupanca);
  };

  const calcularRendimento = () => {
    const montante = valorPoupanca * Math.pow(1 + taxaJuros / 100, prazoMeses);
    return montante - valorPoupanca;
  };

  const quiz: QuizSet = {
    id: 'quiz-poupanca',
    title: 'Quiz: Poupança e Reserva de Emergência',
    questions: [
      {
        id: 'q1',
        question: 'Qual é o valor ideal para uma reserva de emergência?',
        options: [
          '1 a 2 meses de gastos essenciais',
          '3 a 6 meses de gastos essenciais',
          '12 meses de salário',
          'R$ 10.000 fixos'
        ],
        correctAnswer: 1,
        explanation: 'A reserva ideal deve cobrir de 3 a 6 meses dos seus gastos essenciais, não do salário total.',
        points: 10
      },
      {
        id: 'q2',
        question: 'Onde é melhor guardar a reserva de emergência?',
        options: [
          'Poupança tradicional',
          'Tesouro Selic',
          'Ações',
          'Debaixo do colchão'
        ],
        correctAnswer: 1,
        explanation: 'O Tesouro Selic oferece liquidez diária, segurança e rentabilidade adequada para reserva de emergência.',
        points: 10
      },
      {
        id: 'q3',
        question: 'Quando devo usar minha reserva de emergência?',
        options: [
          'Para comprar algo que sempre quis',
          'Para fazer uma viagem dos sonhos',
          'Apenas em emergências reais como perda de emprego ou gastos médicos urgentes',
          'Para investir em uma oportunidade'
        ],
        correctAnswer: 2,
        explanation: 'A reserva deve ser usada apenas em emergências reais, como perda de emprego ou gastos médicos urgentes.',
        points: 10
      }
    ]
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

  const renderCalculadoraReserva = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
          <DollarSign className="mr-2" />
          Calculadora de Reserva de Emergência
        </h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gastos Essenciais Mensais (R$)
              </label>
              <input
                type="number"
                value={gastosMensais || ''}
                onChange={(e) => setGastosMensais(Number(e.target.value))}
                className="w-full p-3 border rounded-lg"
                placeholder="Ex: 3000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Inclua apenas gastos essenciais: moradia, alimentação, transporte, saúde
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quanto pode poupar por mês (R$)
              </label>
              <input
                type="number"
                value={valorPoupanca || ''}
                onChange={(e) => setValorPoupanca(Number(e.target.value))}
                className="w-full p-3 border rounded-lg"
                placeholder="Ex: 500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taxa de juros mensal (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={taxaJuros}
                onChange={(e) => setTaxaJuros(Number(e.target.value))}
                className="w-full p-3 border rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tesouro Selic: ~0.5% | CDB: ~0.6% | Poupança: ~0.3%
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            {gastosMensais > 0 && (
              <>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="font-semibold text-blue-700">Reserva Mínima (3 meses)</p>
                  <p className="text-2xl font-bold text-blue-600">
                    R$ {calcularReservaIdeal().minima.toLocaleString('pt-BR')}
                  </p>
                </div>
                
                <div className="bg-green-50 p-3 rounded">
                  <p className="font-semibold text-green-700">Reserva Ideal (6 meses)</p>
                  <p className="text-2xl font-bold text-green-600">
                    R$ {calcularReservaIdeal().maxima.toLocaleString('pt-BR')}
                  </p>
                </div>
                
                {valorPoupanca > 0 && (
                  <div className="bg-purple-50 p-3 rounded">
                    <p className="font-semibold text-purple-700">Tempo para formar reserva mínima</p>
                    <p className="text-xl font-bold text-purple-600">
                      {calcularTempoFormacao()} meses
                    </p>
                  </div>
                )}
              </>
            )}
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
              <p className="text-green-600 text-sm mt-1">✅ Excelente! Você domina os conceitos de poupança e reserva de emergência.</p>
            ) : (
              <p className="text-orange-600 text-sm mt-1">📚 Continue estudando para melhorar seu conhecimento sobre reserva de emergência.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderSection = () => {
    const section = sections[currentSection];
    
    if (section.type === 'calculator') {
      return renderCalculadoraReserva();
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
          <PiggyBank className="mr-3" size={32} />
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

export default PoupancaReservaEmergencia;