import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart,
  Calculator,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Trophy,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Brain,
  Lightbulb,
  FileText,
  Award,
  Clock,
  Plus,
  Minus,
  Edit,
  Save,
  BarChart3,
  Target,
  AlertTriangle,
  Home,
  Car,
  ShoppingCart,
  Coffee,
  Gamepad2,
  BookOpen,
  Wallet,
  CreditCard,
  Building,
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
import { ModuleContent, ModuleSection, Quiz, QuizSet } from './index';

const OrcamentoPessoalFamiliar: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  
  // Estados para o simulador de orçamento
  const [receitas, setReceitas] = useState([
    { id: 1, descricao: 'Salário', valor: 0 }
  ]);
  const [despesasFixas, setDespesasFixas] = useState([
    { id: 1, descricao: 'Aluguel/Financiamento', valor: 0 },
    { id: 2, descricao: 'Energia Elétrica', valor: 0 },
    { id: 3, descricao: 'Água', valor: 0 },
    { id: 4, descricao: 'Internet', valor: 0 }
  ]);
  const [despesasVariaveis, setDespesasVariaveis] = useState([
    { id: 1, descricao: 'Alimentação', valor: 0 },
    { id: 2, descricao: 'Transporte', valor: 0 },
    { id: 3, descricao: 'Lazer', valor: 0 }
  ]);

  const moduleInfo: ModuleContent = {
    id: 'orcamento-pessoal',
    title: 'Orçamento Pessoal e Familiar',
    description: 'Aprenda a criar e gerenciar um orçamento eficiente para sua família',
    duration: '3-4 horas',
    level: 'Iniciante',
    topics: [
      'Conceitos de orçamento familiar',
      'Categorização de receitas e despesas',
      'Métodos de controle orçamentário',
      'Ferramentas de planejamento',
      'Análise de gastos',
      'Estratégias de economia'
    ],
    objectives: [
      'Compreender a importância do orçamento familiar',
      'Aprender a categorizar receitas e despesas',
      'Dominar métodos de controle orçamentário',
      'Criar um orçamento personalizado',
      'Identificar oportunidades de economia',
      'Desenvolver disciplina financeira'
    ]
  };

  const sections: ModuleSection[] = [
    {
      id: 'introducao-orcamento',
      title: 'Introdução ao Orçamento Familiar',
      content: `
        <h3>🏠 O que é um Orçamento Familiar?</h3>
        <p>O orçamento familiar é um plano financeiro que organiza todas as receitas e despesas da família em um período determinado, geralmente mensal. É a ferramenta fundamental para o controle financeiro doméstico.</p>
        
        <h4 class="mt-6">🎯 Por que fazer um orçamento?</h4>
        
        <div class="grid md:grid-cols-2 gap-4 mt-4">
          <div class="bg-green-50 p-4 rounded-lg">
            <h5 class="font-bold text-green-700 mb-3">✅ Benefícios do Orçamento</h5>
            <ul class="text-green-600 space-y-2">
              <li>• Controle total sobre as finanças</li>
              <li>• Identificação de gastos desnecessários</li>
              <li>• Planejamento para objetivos</li>
              <li>• Redução do estresse financeiro</li>
              <li>• Capacidade de poupança</li>
              <li>• Prevenção de dívidas</li>
            </ul>
          </div>
          
          <div class="bg-red-50 p-4 rounded-lg">
            <h5 class="font-bold text-red-700 mb-3">❌ Sem Orçamento</h5>
            <ul class="text-red-600 space-y-2">
              <li>• Gastos descontrolados</li>
              <li>• Dinheiro "sumindo"</li>
              <li>• Dificuldade para poupar</li>
              <li>• Endividamento frequente</li>
              <li>• Estresse e brigas familiares</li>
              <li>• Objetivos não alcançados</li>
            </ul>
          </div>
        </div>

        <h4 class="mt-6">📊 Estatísticas Importantes</h4>
        
        <div class="bg-blue-50 p-4 rounded-lg">
          <h5 class="font-bold text-blue-700 mb-3">📈 Dados do Brasil</h5>
          <div class="grid md:grid-cols-3 gap-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600">76%</p>
              <p class="text-blue-700 text-sm">das famílias não fazem orçamento</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600">58%</p>
              <p class="text-blue-700 text-sm">gastam mais do que ganham</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600">82%</p>
              <p class="text-blue-700 text-sm">não sabem onde gastam o dinheiro</p>
            </div>
          </div>
        </div>

        <div class="bg-yellow-50 p-4 rounded-lg mt-6">
          <h4>💡 Regra de Ouro</h4>
          <p class="text-yellow-700">Um orçamento bem feito não limita sua liberdade - ele a aumenta! Quando você sabe exatamente onde seu dinheiro está indo, pode fazer escolhas mais conscientes e alcançar seus objetivos mais rapidamente.</p>
        </div>
      `,
      type: 'text'
    },
    {
      id: 'estrutura-orcamento',
      title: 'Estrutura do Orçamento',
      content: `
        <h3>🏗️ Como Estruturar seu Orçamento</h3>
        <p>Um orçamento eficiente deve ser organizado em categorias claras e bem definidas. Vamos aprender a estrutura ideal:</p>
        
        <h4 class="mt-6">💰 1. RECEITAS (Entradas)</h4>
        
        <div class="space-y-4">
          <div class="border border-green-300 p-4 rounded-lg bg-green-50">
            <h5 class="font-bold text-green-700">💵 Receitas Fixas</h5>
            <p class="text-green-600 mb-2">Valores que você recebe regularmente todos os meses:</p>
            <ul class="text-green-600 space-y-1">
              <li>• Salário líquido</li>
              <li>• Aposentadoria/Pensão</li>
              <li>• Aluguel recebido</li>
              <li>• Rendimentos de investimentos</li>
            </ul>
          </div>
          
          <div class="border border-green-300 p-4 rounded-lg bg-green-50">
            <h5 class="font-bold text-green-700">💸 Receitas Variáveis</h5>
            <p class="text-green-600 mb-2">Valores que podem variar ou não ocorrer todo mês:</p>
            <ul class="text-green-600 space-y-1">
              <li>• Freelances/Trabalhos extras</li>
              <li>• Comissões</li>
              <li>• 13º salário</li>
              <li>• Vendas eventuais</li>
            </ul>
          </div>
        </div>

        <h4 class="mt-6">💸 2. DESPESAS (Saídas)</h4>
        
        <div class="space-y-4">
          <div class="border border-red-300 p-4 rounded-lg bg-red-50">
            <h5 class="font-bold text-red-700">🏠 Despesas Fixas (50-60% da renda)</h5>
            <p class="text-red-600 mb-2">Gastos obrigatórios que não mudam muito:</p>
            <div class="grid md:grid-cols-2 gap-4">
              <ul class="text-red-600 space-y-1">
                <li>• Aluguel/Financiamento</li>
                <li>• Condomínio</li>
                <li>• Energia elétrica</li>
                <li>• Água e esgoto</li>
                <li>• Internet/Telefone</li>
              </ul>
              <ul class="text-red-600 space-y-1">
                <li>• Seguros (saúde, vida, auto)</li>
                <li>• Financiamentos</li>
                <li>• Mensalidades escolares</li>
                <li>• Assinaturas</li>
                <li>• IPTU/IPVA</li>
              </ul>
            </div>
          </div>
          
          <div class="border border-orange-300 p-4 rounded-lg bg-orange-50">
            <h5 class="font-bold text-orange-700">🛒 Despesas Variáveis (20-30% da renda)</h5>
            <p class="text-orange-600 mb-2">Gastos que você pode controlar e variam mensalmente:</p>
            <div class="grid md:grid-cols-2 gap-4">
              <ul class="text-orange-600 space-y-1">
                <li>• Alimentação</li>
                <li>• Transporte</li>
                <li>• Vestuário</li>
                <li>• Produtos de limpeza</li>
                <li>• Farmácia</li>
              </ul>
              <ul class="text-orange-600 space-y-1">
                <li>• Lazer e entretenimento</li>
                <li>• Restaurantes</li>
                <li>• Presentes</li>
                <li>• Cabeleireiro/Estética</li>
                <li>• Gastos pessoais</li>
              </ul>
            </div>
          </div>
          
          <div class="border border-purple-300 p-4 rounded-lg bg-purple-50">
            <h5 class="font-bold text-purple-700">🚨 Despesas Eventuais</h5>
            <p class="text-purple-600 mb-2">Gastos esporádicos que devem ser planejados:</p>
            <ul class="text-purple-600 space-y-1">
              <li>• Médico/Dentista</li>
              <li>• Consertos e manutenções</li>
              <li>• Viagens</li>
              <li>• Presentes de aniversário/Natal</li>
              <li>• Emergências</li>
            </ul>
          </div>
        </div>

        <h4 class="mt-6">💰 3. POUPANÇA E INVESTIMENTOS (10-20% da renda)</h4>
        
        <div class="border border-blue-300 p-4 rounded-lg bg-blue-50">
          <h5 class="font-bold text-blue-700">🎯 Objetivos Financeiros</h5>
          <ul class="text-blue-600 space-y-1">
            <li>• Reserva de emergência</li>
            <li>• Aposentadoria</li>
            <li>• Objetivos de curto prazo</li>
            <li>• Objetivos de médio prazo</li>
            <li>• Objetivos de longo prazo</li>
          </ul>
        </div>

        <div class="bg-green-50 p-4 rounded-lg mt-6">
          <h4>📏 Regra 50-30-20</h4>
          <p class="text-green-700 mb-2">Uma fórmula simples para distribuir sua renda:</p>
          <div class="grid md:grid-cols-3 gap-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-green-600">50%</p>
              <p class="text-green-700 text-sm">Necessidades básicas</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-green-600">30%</p>
              <p class="text-green-700 text-sm">Desejos e lazer</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-green-600">20%</p>
              <p class="text-green-700 text-sm">Poupança e investimentos</p>
            </div>
          </div>
        </div>
      `,
      type: 'text'
    },
    {
      id: 'simulador-orcamento',
      title: 'Simulador: Monte seu Orçamento',
      content: '',
      type: 'calculator'
    },
    {
      id: 'quiz-orcamento',
      title: 'Quiz: Orçamento Familiar',
      content: '',
      type: 'quiz'
    }
  ];

  const quiz: QuizSet = {
    id: 'quiz-orcamento',
    title: 'Quiz: Orçamento Pessoal e Familiar',
    questions: [
      {
        id: 'q1',
        question: 'Qual é a principal função de um orçamento familiar?',
        options: [
          'Limitar os gastos da família',
          'Organizar e controlar receitas e despesas',
          'Aumentar a renda familiar',
          'Eliminar todos os gastos com lazer'
        ],
        correctAnswer: 1,
        explanation: 'O orçamento familiar serve para organizar e controlar todas as receitas e despesas, proporcionando visibilidade e controle sobre as finanças.',
        points: 10
      },
      {
        id: 'q2',
        question: 'Segundo a regra 50-30-20, qual percentual da renda deve ser destinado à poupança?',
        options: [
          '10%',
          '15%',
          '20%',
          '25%'
        ],
        correctAnswer: 2,
        explanation: 'Na regra 50-30-20, 20% da renda deve ser destinada à poupança e investimentos para garantir a segurança financeira futura.',
        points: 10
      },
      {
        id: 'q3',
        question: 'Qual tipo de despesa representa o aluguel da casa?',
        options: [
          'Despesa variável',
          'Despesa eventual',
          'Despesa fixa',
          'Despesa de investimento'
        ],
        correctAnswer: 2,
        explanation: 'O aluguel é uma despesa fixa porque tem valor constante e é obrigatória todos os meses.',
        points: 10
      },
      {
        id: 'q4',
        question: 'Qual é o percentual ideal de despesas fixas em relação à renda?',
        options: [
          '30-40%',
          '50-60%',
          '70-80%',
          '80-90%'
        ],
        correctAnswer: 1,
        explanation: 'O ideal é que as despesas fixas não ultrapassem 50-60% da renda, deixando espaço para despesas variáveis e poupança.',
        points: 10
      }
    ]
  };

  const calcularTotais = () => {
    const totalReceitas = receitas.reduce((sum, item) => sum + (item.valor || 0), 0);
    const totalDespesasFixas = despesasFixas.reduce((sum, item) => sum + (item.valor || 0), 0);
    const totalDespesasVariaveis = despesasVariaveis.reduce((sum, item) => sum + (item.valor || 0), 0);
    const totalDespesas = totalDespesasFixas + totalDespesasVariaveis;
    const saldo = totalReceitas - totalDespesas;
    
    return {
      totalReceitas,
      totalDespesasFixas,
      totalDespesasVariaveis,
      totalDespesas,
      saldo,
      percentualDespesasFixas: totalReceitas > 0 ? (totalDespesasFixas / totalReceitas) * 100 : 0,
      percentualDespesasVariaveis: totalReceitas > 0 ? (totalDespesasVariaveis / totalReceitas) * 100 : 0,
      percentualSaldo: totalReceitas > 0 ? (saldo / totalReceitas) * 100 : 0
    };
  };

  const adicionarItem = (tipo: 'receitas' | 'despesasFixas' | 'despesasVariaveis') => {
    const novoId = Date.now();
    const novoItem = { id: novoId, descricao: '', valor: 0 };
    
    if (tipo === 'receitas') {
      setReceitas([...receitas, novoItem]);
    } else if (tipo === 'despesasFixas') {
      setDespesasFixas([...despesasFixas, novoItem]);
    } else {
      setDespesasVariaveis([...despesasVariaveis, novoItem]);
    }
  };

  const removerItem = (tipo: 'receitas' | 'despesasFixas' | 'despesasVariaveis', id: number) => {
    if (tipo === 'receitas') {
      setReceitas(receitas.filter(item => item.id !== id));
    } else if (tipo === 'despesasFixas') {
      setDespesasFixas(despesasFixas.filter(item => item.id !== id));
    } else {
      setDespesasVariaveis(despesasVariaveis.filter(item => item.id !== id));
    }
  };

  const atualizarItem = (tipo: 'receitas' | 'despesasFixas' | 'despesasVariaveis', id: number, campo: 'descricao' | 'valor', valor: any) => {
    const atualizarLista = (lista: any[]) => 
      lista.map(item => 
        item.id === id ? { ...item, [campo]: valor } : item
      );

    if (tipo === 'receitas') {
      setReceitas(atualizarLista(receitas));
    } else if (tipo === 'despesasFixas') {
      setDespesasFixas(atualizarLista(despesasFixas));
    } else {
      setDespesasVariaveis(atualizarLista(despesasVariaveis));
    }
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

  const renderSimuladorOrcamento = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
          <Calculator className="mr-2" />
          Simulador de Orçamento Familiar
        </h4>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Lado esquerdo - Entradas */}
          <div className="space-y-6">
            {/* Receitas */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-bold text-green-700">💰 Receitas</h5>
                <Button
                  size="sm"
                  onClick={() => adicionarItem('receitas')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus size={16} className="mr-1" />
                  Adicionar
                </Button>
              </div>
              
              <div className="space-y-2">
                {receitas.map((item) => (
                  <div key={item.id} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Descrição"
                      value={item.descricao}
                      onChange={(e) => atualizarItem('receitas', item.id, 'descricao', e.target.value)}
                      className="flex-1 p-2 border rounded text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Valor"
                      value={item.valor || ''}
                      onChange={(e) => atualizarItem('receitas', item.id, 'valor', Number(e.target.value))}
                      className="w-24 p-2 border rounded text-sm"
                    />
                    {receitas.length > 1 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removerItem('receitas', item.id)}
                      >
                        <Minus size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t border-green-200">
                <p className="font-bold text-green-700">
                  Total: R$ {calcularTotais().totalReceitas.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Despesas Fixas */}
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-bold text-red-700">🏠 Despesas Fixas</h5>
                <Button
                  size="sm"
                  onClick={() => adicionarItem('despesasFixas')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Plus size={16} className="mr-1" />
                  Adicionar
                </Button>
              </div>
              
              <div className="space-y-2">
                {despesasFixas.map((item) => (
                  <div key={item.id} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Descrição"
                      value={item.descricao}
                      onChange={(e) => atualizarItem('despesasFixas', item.id, 'descricao', e.target.value)}
                      className="flex-1 p-2 border rounded text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Valor"
                      value={item.valor || ''}
                      onChange={(e) => atualizarItem('despesasFixas', item.id, 'valor', Number(e.target.value))}
                      className="w-24 p-2 border rounded text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removerItem('despesasFixas', item.id)}
                    >
                      <Minus size={16} />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t border-red-200">
                <p className="font-bold text-red-700">
                  Total: R$ {calcularTotais().totalDespesasFixas.toLocaleString('pt-BR')}
                </p>
                <p className="text-red-600 text-sm">
                  {calcularTotais().percentualDespesasFixas.toFixed(1)}% da renda
                </p>
              </div>
            </div>

            {/* Despesas Variáveis */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-bold text-orange-700">🛒 Despesas Variáveis</h5>
                <Button
                  size="sm"
                  onClick={() => adicionarItem('despesasVariaveis')}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus size={16} className="mr-1" />
                  Adicionar
                </Button>
              </div>
              
              <div className="space-y-2">
                {despesasVariaveis.map((item) => (
                  <div key={item.id} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Descrição"
                      value={item.descricao}
                      onChange={(e) => atualizarItem('despesasVariaveis', item.id, 'descricao', e.target.value)}
                      className="flex-1 p-2 border rounded text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Valor"
                      value={item.valor || ''}
                      onChange={(e) => atualizarItem('despesasVariaveis', item.id, 'valor', Number(e.target.value))}
                      className="w-24 p-2 border rounded text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removerItem('despesasVariaveis', item.id)}
                    >
                      <Minus size={16} />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t border-orange-200">
                <p className="font-bold text-orange-700">
                  Total: R$ {calcularTotais().totalDespesasVariaveis.toLocaleString('pt-BR')}
                </p>
                <p className="text-orange-600 text-sm">
                  {calcularTotais().percentualDespesasVariaveis.toFixed(1)}% da renda
                </p>
              </div>
            </div>
          </div>

          {/* Lado direito - Resumo */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border">
              <h5 className="font-bold text-gray-700 mb-4">📊 Resumo do Orçamento</h5>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-green-600">Total de Receitas:</span>
                  <span className="font-bold text-green-600">
                    R$ {calcularTotais().totalReceitas.toLocaleString('pt-BR')}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-red-600">Total de Despesas:</span>
                  <span className="font-bold text-red-600">
                    R$ {calcularTotais().totalDespesas.toLocaleString('pt-BR')}
                  </span>
                </div>
                
                <hr />
                
                <div className={`flex justify-between ${
                  calcularTotais().saldo >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span className="font-bold">Saldo:</span>
                  <span className="font-bold text-lg">
                    R$ {Math.abs(calcularTotais().saldo).toLocaleString('pt-BR')}
                    {calcularTotais().saldo < 0 && ' (déficit)'}
                  </span>
                </div>
                
                {calcularTotais().saldo >= 0 && (
                  <p className="text-green-600 text-sm">
                    {calcularTotais().percentualSaldo.toFixed(1)}% da renda disponível para poupança
                  </p>
                )}
              </div>
            </div>

            {/* Análise */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-bold text-gray-700 mb-3">🎯 Análise do Orçamento</h5>
              
              <div className="space-y-2">
                {calcularTotais().percentualDespesasFixas > 60 && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertTriangle size={16} className="mr-2" />
                    Despesas fixas muito altas ({calcularTotais().percentualDespesasFixas.toFixed(1)}%)
                  </div>
                )}
                
                {calcularTotais().saldo < 0 && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertTriangle size={16} className="mr-2" />
                    Orçamento no vermelho! Revise seus gastos.
                  </div>
                )}
                
                {calcularTotais().percentualSaldo < 10 && calcularTotais().saldo >= 0 && (
                  <div className="flex items-center text-yellow-600 text-sm">
                    <AlertTriangle size={16} className="mr-2" />
                    Pouca margem para poupança ({calcularTotais().percentualSaldo.toFixed(1)}%)
                  </div>
                )}
                
                {calcularTotais().percentualSaldo >= 20 && (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle size={16} className="mr-2" />
                    Excelente! Você está poupando {calcularTotais().percentualSaldo.toFixed(1)}%
                  </div>
                )}
              </div>
            </div>

            {/* Dicas */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-bold text-blue-700 mb-3">💡 Dicas</h5>
              <ul className="text-blue-600 text-sm space-y-1">
                <li>• Despesas fixas: máximo 60% da renda</li>
                <li>• Poupança: mínimo 10% da renda</li>
                <li>• Revise seu orçamento mensalmente</li>
                <li>• Priorize necessidades sobre desejos</li>
                <li>• Tenha uma reserva de emergência</li>
              </ul>
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
              <p className="text-green-600 text-sm mt-1">✅ Excelente! Você domina os conceitos de orçamento familiar.</p>
            ) : (
              <p className="text-orange-600 text-sm mt-1">📚 Continue estudando para melhorar seu conhecimento sobre orçamento.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderSection = () => {
    const section = sections[currentSection];
    
    if (section.type === 'calculator') {
      return renderSimuladorOrcamento();
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
          <PieChart className="mr-3" size={32} />
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

export default OrcamentoPessoalFamiliar;