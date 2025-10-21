// Dados mock realistas para educação financeira brasileira

export interface EducationalContent {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'basico' | 'intermediario' | 'avancado';
  type: 'artigo' | 'video' | 'podcast' | 'infografico';
  duration: number; // em minutos
  tags: string[];
  author: string;
  publishDate: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  views: number;
  likes: number;
}

export interface FinancialTip {
  id: string;
  title: string;
  description: string;
  category: 'economia' | 'investimento' | 'planejamento' | 'dividas';
  impact: 'baixo' | 'medio' | 'alto';
  timeToImplement: string;
  potentialSavings: string;
}

export interface BrazilianFinancialData {
  currentSelic: number;
  currentCDI: number;
  currentIPCA: number;
  minimumWage: number;
  averageIncome: number;
  lastUpdate: string;
}

// Conteúdo educacional brasileiro
export const mockEducationalContent: EducationalContent[] = [
  {
    id: 'art-001',
    title: 'Como Organizar suas Finanças em 2024',
    description: 'Guia completo para organizar sua vida financeira considerando o cenário econômico brasileiro atual.',
    content: `
# Como Organizar suas Finanças em 2024

## Introdução
Com a Selic em alta e a inflação controlada, 2024 é um ano estratégico para organizar suas finanças pessoais.

## Passo 1: Mapeamento Financeiro
- Liste todas as suas receitas mensais
- Identifique todos os gastos fixos e variáveis
- Use aplicativos como GuiaBolso ou Mobills para controle

## Passo 2: Método 50-30-20
- 50% para gastos essenciais (moradia, alimentação, transporte)
- 30% para gastos pessoais (lazer, hobbies)
- 20% para poupança e investimentos

## Passo 3: Reserva de Emergência
- Meta: 6 meses de gastos essenciais
- Invista em CDB com liquidez diária ou Tesouro Selic
- Mantenha na conta corrente apenas 1 mês de gastos

## Passo 4: Investimentos
- Perfil conservador: CDB, LCI/LCA, Tesouro Direto
- Perfil moderado: Fundos multimercado, ações blue chips
- Perfil arrojado: Ações growth, fundos de ações, REITs

## Conclusão
A organização financeira é um processo contínuo. Revise seus objetivos trimestralmente.
    `,
    category: 'basico',
    type: 'artigo',
    duration: 15,
    tags: ['planejamento', 'organização', 'método 50-30-20', 'reserva de emergência'],
    author: 'Maria Silva, CFP',
    publishDate: '2024-01-15',
    difficulty: 2,
    views: 15420,
    likes: 892
  },
  {
    id: 'vid-001',
    title: 'Tesouro Direto: Guia Completo para Iniciantes',
    description: 'Aprenda a investir no Tesouro Direto de forma segura e rentável.',
    content: `
# Tesouro Direto: Guia Completo

## O que é o Tesouro Direto?
O Tesouro Direto é um programa do governo federal para venda de títulos públicos a pessoas físicas.

## Tipos de Títulos
1. **Tesouro Selic (LFT)**: Rentabilidade ligada à taxa Selic
2. **Tesouro Prefixado (LTN)**: Taxa de juros definida no momento da compra
3. **Tesouro IPCA+ (NTN-B)**: Proteção contra a inflação

## Como Investir
1. Abra conta em uma corretora
2. Acesse o site do Tesouro Direto
3. Escolha o título adequado ao seu perfil
4. Defina o valor do investimento

## Vantagens
- Segurança máxima (garantido pelo governo)
- Baixo valor mínimo (cerca de R$ 30)
- Liquidez diária
- Isento de IR para valores até R$ 35.000/mês

## Estratégias
- **Curto prazo**: Tesouro Selic
- **Médio prazo**: Tesouro Prefixado
- **Longo prazo**: Tesouro IPCA+
    `,
    category: 'intermediario',
    type: 'video',
    duration: 25,
    tags: ['tesouro direto', 'investimentos', 'renda fixa', 'governo'],
    author: 'João Santos, Analista CNPI',
    publishDate: '2024-01-20',
    difficulty: 3,
    views: 28750,
    likes: 1456
  },
  {
    id: 'pod-001',
    title: 'Podcast: Independência Financeira aos 40',
    description: 'Estratégias práticas para alcançar a independência financeira antes dos 40 anos.',
    content: `
# Independência Financeira aos 40

## Episódio: Estratégias Práticas

### Convidado: Carlos Mendes
Investidor que alcançou independência financeira aos 38 anos.

### Principais Tópicos:
1. **Mindset de Poupador vs Investidor**
2. **Estratégia dos 25x**
3. **Diversificação de Renda**
4. **Investimentos em Ações Pagadoras de Dividendos**

### Dicas Práticas:
- Automatize seus investimentos
- Viva com 70% da sua renda
- Invista em educação financeira
- Crie múltiplas fontes de renda

### Carteira Sugerida:
- 40% Renda Fixa (CDB, Tesouro)
- 35% Ações (dividendos)
- 15% Fundos Imobiliários
- 10% Reserva de Emergência

### Livros Recomendados:
- "O Investidor Inteligente" - Benjamin Graham
- "Pai Rico, Pai Pobre" - Robert Kiyosaki
- "Do Mil ao Milhão" - Thiago Nigro
    `,
    category: 'avancado',
    type: 'podcast',
    duration: 45,
    tags: ['independência financeira', 'aposentadoria', 'dividendos', 'estratégia'],
    author: 'Podcast FinanceirosBR',
    publishDate: '2024-01-25',
    difficulty: 4,
    views: 12300,
    likes: 678
  },
  {
    id: 'inf-001',
    title: 'Infográfico: Juros Compostos em Ação',
    description: 'Visualize o poder dos juros compostos com exemplos práticos brasileiros.',
    content: `
# O Poder dos Juros Compostos

## Exemplo Prático: R$ 500/mês por 30 anos

### Cenário 1: Poupança (6% ao ano)
- Valor investido: R$ 180.000
- Valor final: R$ 418.000
- Juros ganhos: R$ 238.000

### Cenário 2: CDB 100% CDI (12% ao ano)
- Valor investido: R$ 180.000
- Valor final: R$ 1.084.000
- Juros ganhos: R$ 904.000

### Cenário 3: Ações (15% ao ano histórico)
- Valor investido: R$ 180.000
- Valor final: R$ 1.978.000
- Juros ganhos: R$ 1.798.000

## Lições Importantes:
1. **Tempo é o fator mais importante**
2. **Consistência supera valor inicial**
3. **Taxa de retorno faz diferença exponencial**
4. **Comece hoje, mesmo com pouco**

## Regra dos 72:
Para descobrir em quantos anos seu dinheiro dobra:
**72 ÷ taxa de juros = anos para dobrar**

Exemplos:
- Poupança (6%): 72 ÷ 6 = 12 anos
- CDB (12%): 72 ÷ 12 = 6 anos
- Ações (15%): 72 ÷ 15 = 4,8 anos
    `,
    category: 'basico',
    type: 'infografico',
    duration: 10,
    tags: ['juros compostos', 'investimentos', 'tempo', 'matemática financeira'],
    author: 'Equipe EducaFinance',
    publishDate: '2024-02-01',
    difficulty: 2,
    views: 8950,
    likes: 445
  }
];

// Dicas financeiras brasileiras
export const mockFinancialTips: FinancialTip[] = [
  {
    id: 'tip-001',
    title: 'Negocie suas contas mensais',
    description: 'Ligue para operadoras de telefone, internet e TV para renegociar valores. Muitas vezes consegue-se desconto de 20-30%.',
    category: 'economia',
    impact: 'medio',
    timeToImplement: '2 horas',
    potentialSavings: 'R$ 50-150/mês'
  },
  {
    id: 'tip-002',
    title: 'Use o PIX para tudo',
    description: 'Evite taxas de TED/DOC usando PIX. Economize até R$ 20 por transferência.',
    category: 'economia',
    impact: 'baixo',
    timeToImplement: '5 minutos',
    potentialSavings: 'R$ 20-100/mês'
  },
  {
    id: 'tip-003',
    title: 'Invista na alta da Selic',
    description: 'Com a Selic em alta, CDBs e Tesouro Selic oferecem boa rentabilidade com baixo risco.',
    category: 'investimento',
    impact: 'alto',
    timeToImplement: '30 minutos',
    potentialSavings: '2-5% a mais que poupança'
  },
  {
    id: 'tip-004',
    title: 'Quite dívidas do cartão',
    description: 'Juros do cartão podem chegar a 400% ao ano. Priorize quitar essas dívidas.',
    category: 'dividas',
    impact: 'alto',
    timeToImplement: '1 dia',
    potentialSavings: 'Até 400% ao ano em juros'
  },
  {
    id: 'tip-005',
    title: 'Planeje aposentadoria cedo',
    description: 'Comece a investir para aposentadoria aos 25 anos. Cada ano de atraso custa caro.',
    category: 'planejamento',
    impact: 'alto',
    timeToImplement: '1 semana',
    potentialSavings: 'Milhões no longo prazo'
  }
];

// Dados financeiros brasileiros atuais
export const brazilianFinancialData: BrazilianFinancialData = {
  currentSelic: 11.75, // Taxa Selic atual
  currentCDI: 11.65,  // CDI atual
  currentIPCA: 4.62,  // IPCA acumulado 12 meses
  minimumWage: 1412,  // Salário mínimo 2024
  averageIncome: 2800, // Renda média brasileira
  lastUpdate: '2024-02-01'
};

// Simulações de investimento
export const investmentSimulations = {
  conservative: {
    name: 'Perfil Conservador',
    allocation: {
      'CDB 100% CDI': 40,
      'Tesouro Selic': 30,
      'LCI/LCA': 20,
      'Poupança': 10
    },
    expectedReturn: 10.5, // % ao ano
    risk: 'Baixo',
    liquidity: 'Alta'
  },
  moderate: {
    name: 'Perfil Moderado',
    allocation: {
      'CDB/Tesouro': 50,
      'Fundos Multimercado': 25,
      'Ações Blue Chips': 15,
      'FIIs': 10
    },
    expectedReturn: 13.5, // % ao ano
    risk: 'Médio',
    liquidity: 'Média'
  },
  aggressive: {
    name: 'Perfil Arrojado',
    allocation: {
      'Ações': 40,
      'FIIs': 20,
      'Fundos de Ações': 20,
      'Renda Fixa': 20
    },
    expectedReturn: 16.5, // % ao ano
    risk: 'Alto',
    liquidity: 'Baixa'
  }
};

// Metas financeiras por idade
export const financialGoalsByAge = {
  '20-25': {
    emergency: '3 meses de gastos',
    investment: '10% da renda',
    focus: 'Educação e carreira',
    tips: ['Crie o hábito de poupar', 'Invista em cursos', 'Evite dívidas']
  },
  '26-35': {
    emergency: '6 meses de gastos',
    investment: '15% da renda',
    focus: 'Casa própria e família',
    tips: ['Use FGTS para casa', 'Planeje filhos', 'Aumente renda']
  },
  '36-45': {
    emergency: '6-12 meses de gastos',
    investment: '20% da renda',
    focus: 'Educação dos filhos',
    tips: ['Diversifique investimentos', 'Planeje aposentadoria', 'Proteja patrimônio']
  },
  '46-55': {
    emergency: '12 meses de gastos',
    investment: '25% da renda',
    focus: 'Aposentadoria',
    tips: ['Acelere investimentos', 'Quite financiamentos', 'Considere previdência']
  },
  '55+': {
    emergency: '12-24 meses de gastos',
    investment: '30% da renda',
    focus: 'Preservação de capital',
    tips: ['Reduza riscos', 'Gere renda passiva', 'Planeje sucessão']
  }
};