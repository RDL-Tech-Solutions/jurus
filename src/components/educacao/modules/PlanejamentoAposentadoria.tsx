import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
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
  Target,
  Zap,
  Calendar,
  Percent,
  BarChart3,
  Shield,
  Building,
  Home,
  Heart,
  Briefcase,
  PiggyBank,
  Coins,
  CreditCard,
  Banknote,
  LineChart,
  TrendingDown,
  AlertTriangle,
  Info,
  Star,
  Users,
  Baby,
  GraduationCap
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { ModuleContent, ModuleSection, Quiz, QuizSet, Calculator } from './index';

const PlanejamentoAposentadoria: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  
  // Estados para calculadora
  const [idadeAtual, setIdadeAtual] = useState(30);
  const [idadeAposentadoria, setIdadeAposentadoria] = useState(65);
  const [rendaAtual, setRendaAtual] = useState(5000);
  const [percentualDesejado, setPercentualDesejado] = useState(80);
  const [valorMensal, setValorMensal] = useState(500);
  const [rentabilidade, setRentabilidade] = useState(8);
  const [inflacao, setInflacao] = useState(4);

  const moduleInfo: ModuleContent = {
    id: 'planejamento-aposentadoria',
    title: 'Planejamento para Aposentadoria',
    description: 'Construa um futuro financeiro seguro e planeje sua aposentadoria com tranquilidade',
    duration: '3-4 horas',
    level: 'Intermediário',
    topics: [
      'Previdência Social vs Previdência Privada',
      'Cálculo da aposentadoria necessária',
      'Estratégias de investimento de longo prazo',
      'Diversificação de carteira',
      'Planejamento sucessório',
      'Simulações e projeções'
    ],
    objectives: [
      'Entender os sistemas previdenciários',
      'Calcular quanto precisa para se aposentar',
      'Criar estratégia de investimento de longo prazo',
      'Diversificar investimentos adequadamente',
      'Planejar sucessão patrimonial',
      'Monitorar e ajustar o plano regularmente'
    ]
  };

  const sections: ModuleSection[] = [
    {
      id: 'sistemas-previdencia',
      title: 'Sistemas Previdenciários',
      content: `
        <h3>🏛️ Entendendo os Sistemas de Aposentadoria</h3>
        
        <p>No Brasil, temos diferentes sistemas previdenciários. É fundamental entender cada um para fazer o melhor planejamento para seu futuro.</p>
        
        <h4 class="mt-6">🇧🇷 Previdência Social (INSS)</h4>
        
        <div class="bg-blue-50 p-4 rounded-lg">
          <h5 class="font-bold text-blue-700 mb-3">📊 Como Funciona</h5>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h6 class="font-semibold text-blue-700 mb-2">✅ Características</h6>
              <ul class="text-blue-600 text-sm space-y-1">
                <li>• Sistema público obrigatório</li>
                <li>• Regime de repartição simples</li>
                <li>• Quem trabalha hoje paga quem se aposentou</li>
                <li>• Benefício definido</li>
                <li>• Teto de contribuição e benefício</li>
                <li>• Reajuste pela inflação + crescimento do PIB</li>
              </ul>
            </div>
            
            <div>
              <h6 class="font-semibold text-blue-700 mb-2">📋 Regras Atuais (2024)</h6>
              <ul class="text-blue-600 text-sm space-y-1">
                <li>• Idade mínima: 65 anos (homens), 62 anos (mulheres)</li>
                <li>• Tempo mínimo: 15 anos de contribuição</li>
                <li>• Teto: R$ 7.786,02 (2024)</li>
                <li>• Alíquota: 7,5% a 14% da renda</li>
                <li>• Fator previdenciário aplicado</li>
              </ul>
            </div>
          </div>
          
          <div class="mt-4 p-3 bg-blue-100 rounded">
            <h6 class="font-semibold text-blue-700">💰 Cálculo do Benefício</h6>
            <p class="text-blue-600 text-sm mt-1">
              <strong>Fórmula:</strong> 60% da média + 2% por ano que exceder 15 anos de contribuição (mulheres) ou 20 anos (homens)
            </p>
            <p class="text-blue-600 text-sm">
              <strong>Exemplo:</strong> Mulher com 25 anos de contribuição = 60% + (10 × 2%) = 80% da média
            </p>
          </div>
        </div>

        <h4 class="mt-6">🏢 Previdência Privada</h4>
        
        <div class="space-y-4 mt-4">
          <div class="bg-green-50 p-4 rounded-lg">
            <h5 class="font-bold text-green-700 mb-3">📈 PGBL (Plano Gerador de Benefício Livre)</h5>
            
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <h6 class="font-semibold text-green-700 mb-2">✅ Vantagens</h6>
                <ul class="text-green-600 text-sm space-y-1">
                  <li>• Dedução no IR até 12% da renda bruta</li>
                  <li>• Ideal para quem faz declaração completa</li>
                  <li>• Flexibilidade de aportes</li>
                  <li>• Portabilidade entre fundos</li>
                </ul>
              </div>
              
              <div>
                <h6 class="font-semibold text-green-700 mb-2">⚠️ Desvantagens</h6>
                <ul class="text-green-600 text-sm space-y-1">
                  <li>• IR incide sobre todo valor no resgate</li>
                  <li>• Taxas de administração e carregamento</li>
                  <li>• Menor liquidez</li>
                  <li>• Come-cotas a cada 6 meses</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="bg-purple-50 p-4 rounded-lg">
            <h5 class="font-bold text-purple-700 mb-3">📊 VGBL (Vida Gerador de Benefício Livre)</h5>
            
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <h6 class="font-semibold text-purple-700 mb-2">✅ Vantagens</h6>
                <ul class="text-purple-600 text-sm space-y-1">
                  <li>• IR apenas sobre rendimentos</li>
                  <li>• Ideal para declaração simplificada</li>
                  <li>• Não há limite de contribuição</li>
                  <li>• Flexibilidade de aportes</li>
                </ul>
              </div>
              
              <div>
                <h6 class="font-semibold text-purple-700 mb-2">⚠️ Desvantagens</h6>
                <ul class="text-purple-600 text-sm space-y-1">
                  <li>• Sem dedução no IR</li>
                  <li>• Taxas de administração</li>
                  <li>• Come-cotas a cada 6 meses</li>
                  <li>• Menor liquidez</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 p-4 rounded-lg mt-6">
          <h4>💡 Dica Importante</h4>
          <p>Não dependa apenas do INSS! O teto atual representa uma queda significativa no padrão de vida para quem ganha mais. Complemente sempre com previdência privada e investimentos próprios.</p>
        </div>
      `,
      type: 'text'
    },
    {
      id: 'calculo-aposentadoria',
      title: 'Calculando sua Aposentadoria',
      content: `
        <h3>🧮 Quanto Você Precisa para se Aposentar?</h3>
        
        <p>Calcular quanto você precisa para se aposentar é fundamental para definir sua estratégia. Vamos aprender os métodos mais eficazes.</p>
        
        <h4 class="mt-6">🎯 Regra dos 25x</h4>
        
        <div class="bg-blue-50 p-4 rounded-lg">
          <h5 class="font-bold text-blue-700 mb-3">📊 Como Funciona</h5>
          
          <p class="text-blue-600 mb-3">Multiplique seus gastos anuais por 25. Esse valor, investido a 4% ao ano acima da inflação, durará para sempre.</p>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="p-3 bg-blue-100 rounded">
              <h6 class="font-semibold text-blue-700">📋 Exemplo Prático</h6>
              <div class="text-blue-600 text-sm mt-2 space-y-1">
                <p>• Gastos mensais: R$ 8.000</p>
                <p>• Gastos anuais: R$ 96.000</p>
                <p>• Patrimônio necessário: R$ 2.400.000</p>
                <p>• Renda mensal (4%): R$ 8.000</p>
              </div>
            </div>
            
            <div class="p-3 bg-blue-100 rounded">
              <h6 class="font-semibold text-blue-700">🎯 Vantagens</h6>
              <div class="text-blue-600 text-sm mt-2 space-y-1">
                <p>• Método simples e conservador</p>
                <p>• Preserva o patrimônio</p>
                <p>• Protege contra inflação</p>
                <p>• Margem de segurança</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 p-4 rounded-lg mt-6">
          <h4>🎯 Lembre-se</h4>
          <p>O tempo é seu maior aliado! Comece cedo, seja consistente e mantenha a disciplina. Os juros compostos farão o trabalho pesado para você.</p>
        </div>
      `,
      type: 'text'
    },
    {
      id: 'calculadora',
      title: 'Calculadora de Aposentadoria',
      content: '',
      type: 'calculator'
    },
    {
      id: 'quiz-aposentadoria',
      title: 'Quiz: Planejamento para Aposentadoria',
      content: '',
      type: 'quiz'
    }
  ];

  const calcularAposentadoria = () => {
    const anosParaAposentar = idadeAposentadoria - idadeAtual;
    const rendaDesejada = (rendaAtual * percentualDesejado) / 100;
    const patrimonioNecessario = rendaDesejada * 12 * 25; // Regra dos 25x
    
    // Cálculo do valor futuro com aportes mensais
    const taxaMensal = rentabilidade / 100 / 12;
    const meses = anosParaAposentar * 12;
    const valorFuturo = valorMensal * (((1 + taxaMensal) ** meses - 1) / taxaMensal);
    
    const deficit = patrimonioNecessario - valorFuturo;
    
    return {
      anosParaAposentar,
      rendaDesejada,
      patrimonioNecessario,
      valorFuturo,
      deficit
    };
  };

  const resultados = calcularAposentadoria();

  const quiz: QuizSet = {
    id: 'quiz-aposentadoria',
    title: 'Quiz: Planejamento para Aposentadoria',
    questions: [
      {
        id: 'q1',
        question: 'Qual é a principal vantagem da Regra dos 25x para calcular aposentadoria?',
        options: [
          'Permite sacar todo o dinheiro rapidamente',
          'Preserva o patrimônio para sempre com saques de 4% ao ano',
          'Garante retorno de 25% ao ano',
          'Elimina a necessidade de outros investimentos'
        ],
        correctAnswer: 1,
        explanation: 'A Regra dos 25x permite sacar 4% ao ano do patrimônio indefinidamente, preservando o capital principal.',
        points: 10
      },
      {
        id: 'q2',
        question: 'Para um jovem de 25 anos, qual deve ser o foco principal dos investimentos?',
        options: [
          'Renda fixa para segurança',
          'Ações para crescimento de longo prazo',
          'Poupança pela garantia',
          'Imóveis para aluguel'
        ],
        correctAnswer: 1,
        explanation: 'Jovens têm muito tempo até a aposentadoria, permitindo assumir mais risco em ações para maior crescimento.',
        points: 10
      },
      {
        id: 'q3',
        question: 'Qual é a diferença principal entre PGBL e VGBL?',
        options: [
          'PGBL é para jovens, VGBL para idosos',
          'PGBL permite dedução no IR, VGBL não',
          'VGBL tem maior rentabilidade',
          'Não há diferença significativa'
        ],
        correctAnswer: 1,
        explanation: 'PGBL permite dedução de até 12% da renda bruta no IR, enquanto VGBL não oferece essa vantagem.',
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

  const renderCalculadora = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
          <DollarSign className="mr-2" />
          Calculadora de Aposentadoria
        </h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Idade Atual
              </label>
              <input
                type="number"
                value={idadeAtual}
                onChange={(e) => setIdadeAtual(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
                min="18"
                max="80"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Idade Desejada para Aposentadoria
              </label>
              <input
                type="number"
                value={idadeAposentadoria}
                onChange={(e) => setIdadeAposentadoria(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
                min="50"
                max="80"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Renda Atual (R$)
              </label>
              <input
                type="number"
                value={rendaAtual}
                onChange={(e) => setRendaAtual(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
                min="1000"
                step="100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Percentual da Renda Desejado na Aposentadoria (%)
              </label>
              <input
                type="number"
                value={percentualDesejado}
                onChange={(e) => setPercentualDesejado(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
                min="50"
                max="100"
                step="5"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Mensal de Investimento (R$)
              </label>
              <input
                type="number"
                value={valorMensal}
                onChange={(e) => setValorMensal(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
                min="100"
                step="50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rentabilidade Anual Esperada (%)
              </label>
              <input
                type="number"
                value={rentabilidade}
                onChange={(e) => setRentabilidade(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
                min="1"
                max="20"
                step="0.5"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="mt-6 p-4 bg-white rounded-lg border">
              <h5 className="text-lg font-bold text-gray-800 mb-4">📊 Resultados da Simulação</h5>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Anos para aposentar:</span>
                  <span className="font-bold">{resultados.anosParaAposentar} anos</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Renda desejada:</span>
                  <span className="font-bold text-green-600">
                    R$ {resultados.rendaDesejada.toLocaleString('pt-BR')}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Patrimônio necessário:</span>
                  <span className="font-bold text-blue-600">
                    R$ {resultados.patrimonioNecessario.toLocaleString('pt-BR')}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor acumulado:</span>
                  <span className="font-bold text-purple-600">
                    R$ {resultados.valorFuturo.toLocaleString('pt-BR')}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Déficit/Superávit:</span>
                  <span className={`font-bold ${resultados.deficit > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    R$ {Math.abs(resultados.deficit).toLocaleString('pt-BR')}
                    {resultados.deficit > 0 ? ' (déficit)' : ' (superávit)'}
                  </span>
                </div>
              </div>
              
              {resultados.deficit > 0 && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg">
                  <p className="text-red-700 text-sm">
                    <strong>⚠️ Atenção:</strong> Você precisa aumentar seus aportes mensais ou ajustar suas expectativas para atingir sua meta de aposentadoria.
                  </p>
                </div>
              )}
              
              {resultados.deficit <= 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-green-700 text-sm">
                    <strong>✅ Parabéns!</strong> Você está no caminho certo para atingir sua meta de aposentadoria!
                  </p>
                </div>
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
              <p className="text-green-600 text-sm mt-1">✅ Excelente! Você domina os conceitos de planejamento para aposentadoria.</p>
            ) : (
              <p className="text-orange-600 text-sm mt-1">📚 Continue estudando para melhorar seu conhecimento sobre aposentadoria.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderSection = () => {
    const section = sections[currentSection];
    
    if (section.type === 'calculator') {
      return renderCalculadora();
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
          <PiggyBank className="mr-3" size={32} />
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
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(completedSections.size / sections.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default PlanejamentoAposentadoria;