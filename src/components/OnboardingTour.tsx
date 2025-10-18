import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Play, 
  Pause,
  RotateCcw,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Target,
  Zap
} from 'lucide-react';
import { Z_INDEX } from '../constants/zIndex';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'input' | 'scroll';
  actionText?: string;
  tip?: string;
  highlight?: boolean;
  autoAdvance?: boolean;
  delay?: number;
}

interface OnboardingTourProps {
  steps: OnboardingStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  autoStart?: boolean;
  showProgress?: boolean;
  theme?: 'light' | 'dark';
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  steps,
  isActive,
  onComplete,
  onSkip,
  autoStart = false,
  showProgress = true,
  theme = 'dark'
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const overlayRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStepData = steps[currentStep];

  // Encontrar elemento alvo e calcular posição
  useEffect(() => {
    if (!isActive || !currentStepData) return;

    const findTarget = () => {
      const element = document.querySelector(currentStepData.target) as HTMLElement;
      if (element) {
        setTargetElement(element);
        calculateTooltipPosition(element);
        
        // Scroll para o elemento se necessário
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        });

        // Destacar elemento
        if (currentStepData.highlight) {
          element.style.position = 'relative';
          element.style.zIndex = '1001';
          element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
          element.style.borderRadius = '8px';
        }
      }
    };

    // Tentar encontrar imediatamente e depois com delay
    findTarget();
    const timeout = setTimeout(findTarget, 100);

    return () => {
      clearTimeout(timeout);
      // Remover destaque
      if (targetElement && currentStepData?.highlight) {
        targetElement.style.position = '';
        targetElement.style.zIndex = '';
        targetElement.style.boxShadow = '';
        targetElement.style.borderRadius = '';
      }
    };
  }, [currentStep, isActive, currentStepData]);

  // Auto-advance
  useEffect(() => {
    if (!isPlaying || !currentStepData?.autoAdvance) return;

    const timer = setTimeout(() => {
      handleNext();
    }, currentStepData.delay || 3000);

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, currentStepData]);

  const calculateTooltipPosition = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 200;
    const padding = 20;

    let x = 0;
    let y = 0;

    switch (currentStepData.position) {
      case 'top':
        x = rect.left + rect.width / 2 - tooltipWidth / 2;
        y = rect.top - tooltipHeight - padding;
        break;
      case 'bottom':
        x = rect.left + rect.width / 2 - tooltipWidth / 2;
        y = rect.bottom + padding;
        break;
      case 'left':
        x = rect.left - tooltipWidth - padding;
        y = rect.top + rect.height / 2 - tooltipHeight / 2;
        break;
      case 'right':
        x = rect.right + padding;
        y = rect.top + rect.height / 2 - tooltipHeight / 2;
        break;
      case 'center':
        x = window.innerWidth / 2 - tooltipWidth / 2;
        y = window.innerHeight / 2 - tooltipHeight / 2;
        break;
    }

    // Ajustar para manter dentro da viewport
    x = Math.max(padding, Math.min(x, window.innerWidth - tooltipWidth - padding));
    y = Math.max(padding, Math.min(y, window.innerHeight - tooltipHeight - padding));

    setTooltipPosition({ x, y });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStepData.id]));
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setCompletedSteps(prev => new Set([...prev, currentStepData.id]));
    onComplete();
  };

  const handleSkip = () => {
    onSkip();
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setIsPlaying(true);
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  if (!isActive || !currentStepData) return null;

  const themeClasses = theme === 'dark' 
    ? 'bg-gray-900 text-white border-gray-700' 
    : 'bg-white text-gray-900 border-gray-200';

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: Z_INDEX.ONBOARDING }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-black/50 pointer-events-auto" />

        {/* Spotlight no elemento alvo */}
        {targetElement && currentStepData.highlight && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: targetElement.getBoundingClientRect().left - 8,
              top: targetElement.getBoundingClientRect().top - 8,
              width: targetElement.getBoundingClientRect().width + 16,
              height: targetElement.getBoundingClientRect().height + 16,
              background: 'transparent',
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
              borderRadius: '12px',
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Tooltip */}
        <motion.div
          ref={tooltipRef}
          className={`absolute pointer-events-auto w-80 ${themeClasses} rounded-xl shadow-2xl border backdrop-blur-sm`}
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {currentStep + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-lg">{currentStepData.title}</h3>
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={handleRestart}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSkip}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            {showProgress && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progresso</span>
                  <span>{currentStep + 1} de {steps.length}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage()}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {currentStepData.description}
            </p>

            {/* Action instruction */}
            {currentStepData.action && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {currentStepData.actionText || `${currentStepData.action} no elemento destacado`}
                  </span>
                </div>
              </div>
            )}

            {/* Tip */}
            {currentStepData.tip && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mb-4">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <span className="text-sm text-yellow-700 dark:text-yellow-300">
                    {currentStepData.tip}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSkip}
                  className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Pular Tour
                </button>
                
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <span>
                    {currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
                  </span>
                  {currentStep === steps.length - 1 ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingTour;