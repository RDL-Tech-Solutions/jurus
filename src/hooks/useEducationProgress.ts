import { useState, useEffect, useCallback } from 'react';
import { LearningTrack, Module, UserProgress } from '../types/educacaoFinanceira';
import { mockEducationalContent, mockFinancialTips, brazilianFinancialData } from '../data/mockEducationData';

interface EducationProgressState {
  currentModule: Module | null;
  learningTracks: LearningTrack[];
  userProgress: UserProgress;
  isLoading: boolean;
  error: string | null;
}

// Mock data - trilhas de aprendizado brasileiras com conteúdo realista
const mockLearningTracks: LearningTrack[] = [
  {
    id: 'basico-financas',
    title: 'Fundamentos das Finanças Pessoais',
    description: 'Aprenda os conceitos básicos para organizar sua vida financeira no contexto brasileiro',
    category: 'basics',
    difficulty: 'beginner',
    estimatedTime: 120,
    xpReward: 500,
    modules: [
      {
        id: 'mod-1',
        title: 'Orçamento Pessoal Brasileiro',
        description: 'Como criar um orçamento considerando a realidade econômica do Brasil',
        estimatedTime: 30,
        xpReward: 100,
        order: 1,
        isCompleted: false,
        progress: 0,
        content: `
# Orçamento Pessoal Brasileiro

## Introdução
Com o salário mínimo em R$ ${brazilianFinancialData.minimumWage} e renda média de R$ ${brazilianFinancialData.averageIncome}, é essencial saber organizar as finanças.

## Método 50-30-20 Adaptado
- **50% Gastos Essenciais**: Moradia, alimentação, transporte, saúde
- **30% Gastos Pessoais**: Lazer, roupas, hobbies
- **20% Poupança/Investimentos**: Reserva de emergência e investimentos

## Ferramentas Brasileiras
- **Aplicativos**: GuiaBolso, Mobills, Organizze
- **Bancos Digitais**: Nubank, Inter, C6 Bank
- **PIX**: Use para evitar taxas de transferência

## Dicas Práticas
1. Negocie contas mensais (telefone, internet, TV)
2. Use cartões com cashback
3. Aproveite programas de fidelidade
4. Compare preços antes de comprar
        `
      },
      {
        id: 'mod-2',
        title: 'Controle de Gastos no Brasil',
        description: 'Estratégias para reduzir gastos considerando a inflação brasileira',
        estimatedTime: 25,
        xpReward: 75,
        order: 2,
        isCompleted: false,
        progress: 0,
        content: `
# Controle de Gastos no Brasil

## Contexto Econômico
- **IPCA atual**: ${brazilianFinancialData.currentIPCA}%
- **Selic**: ${brazilianFinancialData.currentSelic}%
- **Impacto da inflação** nos gastos essenciais

## Estratégias de Economia
### Alimentação (30% do orçamento)
- Compre em atacados
- Use aplicativos de desconto (Méliuz, Picpay)
- Prefira marcas próprias
- Faça lista de compras

### Transporte (15% do orçamento)
- Use transporte público
- Considere bike/patinete
- Caronas solidárias
- Manutenção preventiva do carro

### Moradia (35% do orçamento)
- Renegocie aluguel anualmente
- Economize energia elétrica
- Use bandeira tarifária verde
- Considere dividir despesas

## Ferramentas de Controle
- Planilhas Google Sheets
- Apps de controle financeiro
- Extrato bancário mensal
- Método dos envelopes
        `
      },
      {
        id: 'mod-3',
        title: 'Reserva de Emergência Brasileira',
        description: 'Como construir uma reserva considerando a volatilidade econômica do país',
        estimatedTime: 35,
        xpReward: 125,
        order: 3,
        isCompleted: false,
        progress: 0,
        content: `
# Reserva de Emergência no Brasil

## Por que é Essencial?
- **Desemprego**: Taxa de 7,8% no país
- **Emergências médicas**: SUS nem sempre atende rapidamente
- **Instabilidade econômica**: Crises frequentes

## Quanto Guardar?
- **Mínimo**: 3 meses de gastos essenciais
- **Ideal**: 6 meses de gastos essenciais
- **Conservador**: 12 meses de gastos essenciais

## Onde Investir a Reserva?
### Opções com Liquidez Diária:
1. **Tesouro Selic**: Rentabilidade = Selic (${brazilianFinancialData.currentSelic}%)
2. **CDB Liquidez Diária**: 90-100% do CDI
3. **Conta Remunerada**: 70-80% do CDI
4. **Fundos DI**: Taxa de administração baixa

### Evite:
- Poupança (baixa rentabilidade)
- CDB com carência
- Ações (volatilidade alta)
- Conta corrente (sem rendimento)

## Como Construir?
1. **Defina a meta** (6x gastos essenciais)
2. **Automatize** transferências mensais
3. **Comece pequeno** (R$ 50-100/mês)
4. **Use 13º salário** e bonificações
5. **Aumente gradualmente** conforme renda cresce
        `
      },
      {
        id: 'mod-4',
        title: 'Planejamento Financeiro Brasileiro',
        description: 'Definindo metas financeiras realistas no contexto nacional',
        estimatedTime: 30,
        xpReward: 100,
        order: 4,
        isCompleted: false,
        progress: 0,
        content: `
# Planejamento Financeiro Brasileiro

## Metas por Faixa Etária

### 20-30 anos
- **Foco**: Educação e carreira
- **Meta**: 3 meses de reserva
- **Investimento**: 10% da renda
- **Prioridade**: Cursos e qualificação

### 30-40 anos
- **Foco**: Casa própria e família
- **Meta**: 6 meses de reserva
- **Investimento**: 15% da renda
- **Prioridade**: FGTS para casa própria

### 40-50 anos
- **Foco**: Educação dos filhos
- **Meta**: 12 meses de reserva
- **Investimento**: 20% da renda
- **Prioridade**: Diversificação

### 50+ anos
- **Foco**: Aposentadoria
- **Meta**: 24 meses de reserva
- **Investimento**: 25% da renda
- **Prioridade**: Renda passiva

## Objetivos Financeiros Comuns
1. **Casa própria**: Use FGTS + financiamento
2. **Carro**: Evite financiamento longo
3. **Viagem**: Planeje com antecedência
4. **Educação filhos**: Comece cedo
5. **Aposentadoria**: Previdência privada

## Ferramentas de Planejamento
- Calculadora do Tesouro Direto
- Simuladores de financiamento
- Planilhas de metas
- Apps de investimento
        `
      }
    ],
    prerequisites: [],
    isLocked: false
  },
  {
    id: 'investimentos-iniciantes',
    title: 'Investimentos para Iniciantes',
    description: 'Primeiros passos no mundo dos investimentos',
    difficulty: 'intermediate',
    category: 'investments',
    estimatedTime: 180,
    xpReward: 750,
    modules: [
      {
        id: 'tipos-investimento',
        title: 'Tipos de Investimento',
        description: 'Conheça as principais modalidades de investimento',
        estimatedTime: 50,
        xpReward: 120,
        order: 1,
        content: [],
        isCompleted: false,
        progress: 0
      },
      {
        id: 'perfil-investidor',
        title: 'Perfil do Investidor',
        description: 'Descubra qual é o seu perfil de risco',
        estimatedTime: 25,
        xpReward: 80,
        order: 2,
        content: [],
        isCompleted: false,
        progress: 0
      },
      {
        id: 'tesouro-direto',
        title: 'Tesouro Direto',
        description: 'Como investir em títulos públicos',
        estimatedTime: 40,
        xpReward: 110,
        order: 3,
        content: [],
        isCompleted: false,
        progress: 0
      }
    ],
    prerequisites: ['basico-financas'],
    isLocked: true
  },
  {
    id: 'planejamento-aposentadoria',
    title: 'Planejamento para Aposentadoria',
    description: 'Estratégias para garantir uma aposentadoria tranquila',
    difficulty: 'intermediate',
    category: 'planning',
    estimatedTime: 900,
    xpReward: 1000,
    modules: [
      {
        id: 'previdencia-social',
        title: 'Previdência Social',
        description: 'Entenda como funciona o INSS',
        estimatedTime: 45,
        xpReward: 100,
        order: 1,
        content: [],
        isCompleted: false,
        progress: 0
      },
      {
        id: 'previdencia-privada',
        title: 'Previdência Privada',
        description: 'PGBL vs VGBL: qual escolher?',
        estimatedTime: 55,
        xpReward: 130,
        order: 2,
        content: [],
        isCompleted: false,
        progress: 0
      },
      {
        id: 'simulacao-aposentadoria',
        title: 'Simulação de Aposentadoria',
        description: 'Calcule quanto precisa poupar',
        estimatedTime: 35,
        xpReward: 150,
        order: 3,
        content: [],
        isCompleted: false,
        progress: 0
      }
    ],
    prerequisites: ['track-1', 'investimentos-iniciantes'],
    isLocked: true
  },
  {
    id: 'credito-financiamento',
    title: 'Crédito e Financiamentos',
    description: 'Como usar o crédito de forma inteligente',
    difficulty: 'intermediate',
    category: 'credit',
    estimatedTime: 600,
    xpReward: 800,
    modules: [
      {
        id: 'tipos-credito',
        title: 'Tipos de Crédito',
        description: 'Conheça as modalidades de crédito disponíveis',
        estimatedTime: 40,
        xpReward: 90,
        order: 1,
        content: [],
        isCompleted: false,
        progress: 0
      },
      {
        id: 'score-credito',
        title: 'Score de Crédito',
        description: 'Como melhorar seu score',
        estimatedTime: 30,
        xpReward: 70,
        order: 2,
        content: [],
        isCompleted: false,
        progress: 0
      },
      {
        id: 'financiamento-imovel',
        title: 'Financiamento Imobiliário',
        description: 'Tudo sobre financiar seu imóvel',
        estimatedTime: 50,
        xpReward: 140,
        order: 3,
        content: [],
        isCompleted: false,
        progress: 0
      }
    ],
    prerequisites: ['track-1'],
    isLocked: false
  },
  {
    id: 'empreendedorismo-financas',
    title: 'Finanças para Empreendedores',
    description: 'Gestão financeira para seu negócio',
    difficulty: 'advanced',
    category: 'business',
    estimatedTime: 1200,
    xpReward: 1500,
    modules: [
      {
        id: 'fluxo-caixa',
        title: 'Fluxo de Caixa',
        description: 'Controle financeiro empresarial',
        estimatedTime: 60,
        xpReward: 160,
        order: 1,
        content: [],
        isCompleted: false,
        progress: 0
      },
      {
        id: 'capital-giro',
        title: 'Capital de Giro',
        description: 'Gestão do capital de giro',
        estimatedTime: 45,
        xpReward: 120,
        order: 2,
        content: [],
        isCompleted: false,
        progress: 0
      },
      {
        id: 'investimento-negocio',
        title: 'Investimento no Negócio',
        description: 'Como reinvestir nos lucros',
        estimatedTime: 55,
        xpReward: 180,
        order: 3,
        content: [],
        isCompleted: false,
        progress: 0
      }
    ],
    prerequisites: ['track-1', 'investimentos-iniciantes', 'credito-financiamento'],
    isLocked: true
  }
];

export const useEducationProgress = () => {
  const [state, setState] = useState<EducationProgressState>({
    currentModule: null,
    learningTracks: mockLearningTracks,
    userProgress: {
      id: 'default-user',
      level: 1,
      xp: 0,
      completedModules: [],
      completedTracks: [],
      completedQuizzes: [],
      badges: [],
      certificates: [],
      streakDays: 0,
      lastActivity: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    isLoading: true,
    error: null
  });

  // Carregar dados do localStorage
  useEffect(() => {
    const loadProgress = () => {
      try {
        const savedProgress = localStorage.getItem('education-progress');
        const savedTracks = localStorage.getItem('learning-tracks');
        
        let userProgress = state.userProgress;
        let tracks = mockLearningTracks;

        if (savedProgress) {
          userProgress = { ...userProgress, ...JSON.parse(savedProgress) };
        }

        if (savedTracks) {
          const savedTracksData = JSON.parse(savedTracks);
          tracks = tracks.map(track => {
            const savedTrack = savedTracksData.find((st: any) => st.id === track.id);
            return savedTrack ? { ...track, ...savedTrack } : track;
          });
        }

        // Atualizar progresso das trilhas baseado nos módulos completados
        tracks = tracks.map(track => {
          const completedModules = track.modules.filter(module => 
            userProgress.completedModules.includes(module.id)
          );
          const progress = (completedModules.length / track.modules.length) * 100;
          const isCompleted = progress === 100;
          
          // Verificar se a trilha deve ser desbloqueada
          const isUnlocked = track.prerequisites.length === 0 || 
            track.prerequisites.every(prereq => 
              userProgress.completedTracks.includes(prereq)
            );

          return {
            ...track,
            progress,
            isCompleted,
            isUnlocked,
            modules: track.modules.map(module => ({
              ...module,
              isCompleted: userProgress.completedModules.includes(module.id)
            }))
          };
        });

        setState(prev => ({
          ...prev,
          userProgress,
          learningTracks: tracks,
          isLoading: false
        }));
      } catch (error) {
        console.error('Erro ao carregar progresso:', error);
        setState(prev => ({
          ...prev,
          error: 'Erro ao carregar dados de progresso',
          isLoading: false
        }));
      }
    };

    loadProgress();
  }, []);

  // Salvar progresso no localStorage
  const saveProgress = useCallback((newProgress: Partial<UserProgress>) => {
    const updatedProgress = { ...state.userProgress, ...newProgress };
    localStorage.setItem('education-progress', JSON.stringify(updatedProgress));
    
    setState(prev => ({
      ...prev,
      userProgress: updatedProgress
    }));
  }, [state.userProgress]);

  // Salvar trilhas no localStorage
  const saveTracks = useCallback((tracks: LearningTrack[]) => {
    localStorage.setItem('learning-tracks', JSON.stringify(tracks));
    setState(prev => ({
      ...prev,
      learningTracks: tracks
    }));
  }, []);

  // Completar módulo
  const completeModule = useCallback((moduleId: string, trackId: string) => {
    const track = state.learningTracks.find(t => t.id === trackId);
    const module = track?.modules.find(m => m.id === moduleId);
    
    if (!module || module.isCompleted) return;

    const newCompletedModules = [...state.userProgress.completedModules, moduleId];
    const newXP = state.userProgress.xp + module.xpReward;
    const newLevel = Math.floor(newXP / 1000) + 1;

    // Atualizar progresso do usuário
    const updatedProgress = {
      ...state.userProgress,
      completedModules: newCompletedModules,
      xp: newXP,
      level: newLevel,
      lastActivity: new Date()
    };

    // Atualizar trilhas
    const updatedTracks = state.learningTracks.map(track => {
      if (track.id !== trackId) return track;

      const updatedModules = track.modules.map(m => 
        m.id === moduleId ? { ...m, isCompleted: true } : m
      );
      
      const completedCount = updatedModules.filter(m => m.isCompleted).length;
      const progress = (completedCount / updatedModules.length) * 100;
      const isCompleted = progress === 100;

      return {
        ...track,
        modules: updatedModules,
        progress,
        isCompleted
      };
    });

    // Verificar se alguma trilha foi completada
    const completedTrack = updatedTracks.find(t => t.id === trackId && t.isCompleted);
    if (completedTrack && !state.userProgress.completedTracks.includes(trackId)) {
      updatedProgress.completedTracks = [...state.userProgress.completedTracks, trackId];
    }

    saveProgress(updatedProgress);
    saveTracks(updatedTracks);

    // Retornar informações sobre a conclusão
    return {
      xpGained: module.xpReward,
      levelUp: newLevel > state.userProgress.level,
      trackCompleted: completedTrack !== undefined
    };
  }, [state.learningTracks, state.userProgress, saveProgress, saveTracks]);

  // Iniciar trilha
  const startTrack = useCallback((trackId: string) => {
    const track = state.learningTracks.find(t => t.id === trackId);
    if (!track || !track.isUnlocked) return;

    const firstModule = track.modules.find(m => !m.isCompleted);
    
    setState(prev => ({
      ...prev,
      currentModule: firstModule || null
    }));

    saveProgress({
      currentTrack: trackId,
      lastActivity: new Date()
    });
  }, [state.learningTracks, saveProgress]);

  // Continuar trilha
  const continueTrack = useCallback((trackId: string) => {
    const track = state.learningTracks.find(t => t.id === trackId);
    if (!track) return;

    const nextModule = track.modules.find(m => !m.isCompleted);
    
    setState(prev => ({
      ...prev,
      currentModule: nextModule || null
    }));

    saveProgress({
      currentTrack: trackId,
      lastActivity: new Date()
    });
  }, [state.learningTracks, saveProgress]);

  // Resetar progresso (para desenvolvimento/teste)
  const resetProgress = useCallback(() => {
    localStorage.removeItem('education-progress');
    localStorage.removeItem('learning-tracks');
    
    setState(prev => ({
      ...prev,
      userProgress: {
        id: 'user-1',
        level: 1,
        xp: 0,
        completedModules: [],
        completedTracks: [],
        completedQuizzes: [],
        badges: [],
        certificates: [],
        streakDays: 0,
        lastActivity: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      learningTracks: mockLearningTracks,
      currentModule: null
    }));
  }, []);

  return {
    ...state,
    completeModule,
    startTrack,
    continueTrack,
    resetProgress,
    saveProgress
  };
};