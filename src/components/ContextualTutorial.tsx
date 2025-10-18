import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw,
  Lightbulb,
  Target,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useMicroInteractions } from '../hooks/useMicroInteractions';

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'input' | 'scroll' | 'wait';
  duration?: number;
  highlight?: boolean;
  interactive?: boolean;
  validation?: () => boolean;
  tips?: string[];
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  steps: TutorialStep[];
  prerequisites?: string[];
  rewards?: string[];
}

interface ContextualTutorialProps {
  tutorial: Tutorial;
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  onClose: () => void;
  autoPlay?: boolean;
  showProgress?: boolean;
}

export const ContextualTutorial: React.FC<ContextualTutorialProps> = ({
  tutorial,
  isActive,
  onComplete,
  onSkip,
  onClose,
  autoPlay = false,
  showProgress = true
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout>();

  const { useButtonInteraction, triggerHaptic, playSound } = useMicroInteractions();
  const buttonInteraction = useButtonInteraction({ animation: 'scale', haptic: true });

  // Verificações de segurança para evitar erros de null
  const steps = tutorial?.steps || [];
  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const progress = steps.length > 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  // Destacar elemento alvo
  useEffect(() => {
    if (!isActive || !currentStep?.target) return;

    const targetElement = document.querySelector(currentStep.target) as HTMLElement;
    if (targetElement) {
      setHighlightedElement(targetElement);
      
      // Calcular posição do tooltip
      const rect = targetElement.getBoundingClientRect();
      const tooltipRect = tooltipRef.current?.getBoundingClientRect();
      
      let x = rect.left + rect.width / 2;
      let y = rect.top;

      if (tooltipRect) {
        switch (currentStep?.position) {
          case 'top':
            y = rect.top - tooltipRect.height - 10;
            break;
          case 'bottom':
            y = rect.bottom + 10;
            break;
          case 'left':
            x = rect.left - tooltipRect.width - 10;
            y = rect.top + rect.height / 2 - tooltipRect.height / 2;
            break;
          case 'right':
            x = rect.right + 10;
            y = rect.top + rect.height / 2 - tooltipRect.height / 2;
            break;
          case 'center':
            x = window.innerWidth / 2 - tooltipRect.width / 2;
            y = window.innerHeight / 2 - tooltipRect.height / 2;
            break;
        }
      }

      setTooltipPosition({ x, y });

      // Scroll para o elemento se necessário
      targetElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      });

      // Adicionar classe de destaque
      if (currentStep?.highlight) {
        targetElement.classList.add('tutorial-highlight');
      }
    }

    return () => {
      if (targetElement && currentStep?.highlight) {
        targetElement.classList.remove('tutorial-highlight');
      }
    };
  }, [currentStep, isActive]);

  // Auto-play
  useEffect(() => {
    if (!isActive || !isPlaying || !currentStep) return;

    const duration = currentStep?.duration || 3000;
    
    autoPlayTimeoutRef.current = setTimeout(() => {
      if (currentStep?.validation && !currentStep.validation()) {
        setIsPlaying(false);
        return;
      }
      
      nextStep();
    }, duration);

    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, [currentStepIndex, isPlaying, isActive]);

  const nextStep = () => {
    if (isLastStep) {
      // Garantir que o tutorial seja marcado como completado
      if (currentStep?.id) {
        setCompletedSteps(prev => new Set([...prev, currentStep.id]));
      }
      // Chamar onComplete que irá marcar o tutorial como completado
      onComplete();
    } else {
      if (currentStep?.id) {
        setCompletedSteps(prev => new Set([...prev, currentStep.id]));
      }
      setCurrentStepIndex(prev => prev + 1);
      playSound(600, 100);
      triggerHaptic('light');
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      playSound(500, 100);
    }
  };

  const goToStep = (index: number) => {
    setCurrentStepIndex(index);
    setIsPlaying(false);
  };

  const completeTutorial = () => {
    if (currentStep?.id) {
      setCompletedSteps(prev => new Set([...prev, currentStep.id]));
    }
    playSound(800, 200);
    triggerHaptic('medium');
    onComplete();
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const restartTutorial = () => {
    setCurrentStepIndex(0);
    setCompletedSteps(new Set());
    setIsPlaying(autoPlay);
  };

  if (!isActive || steps.length === 0 || !currentStep) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        {/* Overlay */}
        <motion.div
          ref={overlayRef}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Spotlight para elemento destacado */}
        {highlightedElement && currentStep?.highlight && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: highlightedElement.getBoundingClientRect().left - 8,
              top: highlightedElement.getBoundingClientRect().top - 8,
              width: highlightedElement.getBoundingClientRect().width + 16,
              height: highlightedElement.getBoundingClientRect().height + 16,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
              borderRadius: '8px',
              border: '2px solid #3b82f6'
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Tooltip */}
        <motion.div
          ref={tooltipRef}
          className="absolute bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: currentStep?.position === 'center' ? 'none' : 'translateX(-50%)'
          }}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  tutorial.category === 'beginner' ? 'bg-green-500' :
                  tutorial.category === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {currentStep?.title || 'Tutorial'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Fechar tutorial"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {showProgress && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Progresso</span>
                  <span>{currentStepIndex + 1} de {steps.length}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {currentStep?.content || 'Conteúdo não disponível'}
            </p>

            {/* Tips */}
            {currentStep?.tips && currentStep.tips.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg mb-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Dicas
                    </h4>
                    <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                      {currentStep.tips.map((tip, index) => (
                        <li key={index}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Action Required */}
            {currentStep?.action && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-lg mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                    {currentStep?.action === 'click' && 'Clique no elemento destacado'}
                    {currentStep?.action === 'hover' && 'Passe o mouse sobre o elemento'}
                    {currentStep?.action === 'input' && 'Digite no campo destacado'}
                    {currentStep?.action === 'scroll' && 'Role a página para baixo'}
                    {currentStep?.action === 'wait' && 'Aguarde um momento...'}
                  </span>
                </div>
              </div>
            )}

            {/* Validation Status */}
            {currentStep?.validation && (
              <div className="mb-4">
                {currentStep.validation() ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Ação concluída!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full animate-spin border-t-blue-600" />
                    <span className="text-sm">Aguardando ação...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.button
                  {...buttonInteraction}
                  onClick={previousStep}
                  disabled={currentStepIndex === 0}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Passo anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>

                <motion.button
                  onClick={togglePlayPause}
                  className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </motion.button>

                <motion.button
                  onClick={restartTutorial}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Reiniciar tutorial"
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  onClick={onSkip}
                  className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Pular
                </motion.button>

                <motion.button
                  {...buttonInteraction}
                  onClick={nextStep}
                  disabled={currentStep?.validation && !currentStep.validation()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isLastStep ? 'Concluir' : 'Próximo'}
                  {!isLastStep && <ArrowRight className="w-4 h-4" />}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Step Indicators */}
        {showProgress && (
          <motion.div
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-900 rounded-full px-4 py-2 shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <motion.button
                  key={step.id}
                  onClick={() => goToStep(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStepIndex
                      ? 'bg-blue-600'
                      : completedSteps.has(step.id)
                      ? 'bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Ir para passo ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

// Hook para gerenciar tutoriais contextuais
export const useContextualTutorials = () => {
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);
  const [completedTutorials, setCompletedTutorials] = useState<Set<string>>(
    () => {
      if (typeof window === 'undefined') return new Set();
      try {
        const saved = localStorage.getItem('completed-tutorials');
        if (saved) {
          const parsed = JSON.parse(saved);
          return new Set(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.warn('Erro ao carregar tutoriais completados:', error);
        localStorage.removeItem('completed-tutorials');
      }
      return new Set();
    }
  );

  useEffect(() => {
    try {
      const tutorialsArray = [...completedTutorials];
      localStorage.setItem('completed-tutorials', JSON.stringify(tutorialsArray));
      
      // Verificar se foi salvo corretamente
      const verification = localStorage.getItem('completed-tutorials');
      if (!verification) {
        throw new Error('Falha ao verificar salvamento de tutoriais');
      }
    } catch (error) {
      console.warn('Erro ao salvar tutoriais completados:', error);
      // Tentar novamente após um pequeno delay
      setTimeout(() => {
        try {
          localStorage.setItem('completed-tutorials', JSON.stringify([...completedTutorials]));
        } catch (retryError) {
          console.error('Falha crítica ao salvar tutoriais:', retryError);
        }
      }, 100);
    }
  }, [completedTutorials]);

  const startTutorial = (tutorial: Tutorial) => {
    setActiveTutorial(tutorial);
  };

  const completeTutorial = (tutorialId?: string) => {
    const idToComplete = tutorialId || activeTutorial?.id;
    if (idToComplete) {
      setCompletedTutorials(prev => new Set([...prev, idToComplete]));
    }
    setActiveTutorial(null);
  };

  const skipTutorial = () => {
    setActiveTutorial(null);
  };

  const closeTutorial = () => {
    setActiveTutorial(null);
  };

  const isCompleted = (tutorialId: string) => {
    return completedTutorials.has(tutorialId);
  };

  // Função para forçar uma re-verificação do localStorage
  const refreshCompletedTutorials = useCallback(() => {
    try {
      const saved = localStorage.getItem('completed-tutorials');
      if (saved) {
        const parsed = JSON.parse(saved);
        const newSet = new Set(Array.isArray(parsed) ? parsed : []);
        setCompletedTutorials(newSet);
      }
    } catch (error) {
      console.warn('Erro ao atualizar tutoriais completados:', error);
    }
  }, []);

  // Função de debug para verificar estado atual
  const debugTutorialState = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Estado atual dos tutoriais:', {
        activeTutorial: activeTutorial?.id,
        completedTutorials: Array.from(completedTutorials),
        localStorage: localStorage.getItem('completed-tutorials')
      });
    }
  }, [activeTutorial, completedTutorials]);

  return {
      activeTutorial,
      startTutorial,
      completeTutorial,
      skipTutorial,
      closeTutorial,
      isCompleted,
      completedTutorials,
      refreshCompletedTutorials,
      debugTutorialState
    };
};