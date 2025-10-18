import { useCallback, useRef, useEffect } from 'react';
import { useSpring, useTransition, config } from '@react-spring/web';

export interface MicroInteractionConfig {
  haptic?: boolean;
  sound?: boolean;
  animation?: 'bounce' | 'scale' | 'shake' | 'pulse' | 'glow';
  duration?: number;
  intensity?: 'subtle' | 'medium' | 'strong';
}

export const useMicroInteractions = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  // Inicializar contexto de áudio
  useEffect(() => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      audioContextRef.current = new AudioContext();
    }
  }, []);

  // Feedback háptico
  const triggerHaptic = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: 10,
        medium: 20,
        heavy: 50
      };
      navigator.vibrate(patterns[intensity]);
    }
  }, []);

  // Feedback sonoro
  const playSound = useCallback((frequency: number = 800, duration: number = 100) => {
    if (!audioContextRef.current) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000);

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Erro ao reproduzir som:', error);
    }
  }, []);

  // Animações de micro-interação
  const useButtonInteraction = (interactionConfig: MicroInteractionConfig = {}) => {
    const [springs, api] = useSpring(() => ({
      scale: 1,
      rotate: 0,
      opacity: 1,
      config: interactionConfig.duration ? { duration: interactionConfig.duration } : interactionConfig.animation === 'bounce' ? config.wobbly : config.gentle
    }));

    const handlePress = useCallback(() => {
      if (interactionConfig.haptic) triggerHaptic('light');
      if (interactionConfig.sound) playSound(600, 80);

      switch (interactionConfig.animation) {
        case 'bounce':
          api.start({ scale: 0.95, config: config.wobbly });
          setTimeout(() => api.start({ scale: 1.05 }), 100);
          setTimeout(() => api.start({ scale: 1 }), 200);
          break;
        case 'scale':
          api.start({ scale: 0.95 });
          break;
        case 'shake':
          api.start({ rotate: -2 });
          setTimeout(() => api.start({ rotate: 2 }), 50);
          setTimeout(() => api.start({ rotate: 0 }), 100);
          break;
        case 'pulse':
          api.start({ scale: 1.1, opacity: 0.8 });
          break;
        default:
          api.start({ scale: 0.98 });
      }
    }, [api, interactionConfig]);

    const handleRelease = useCallback(() => {
      api.start({ scale: 1, rotate: 0, opacity: 1 });
    }, [api]);

    return { springs, handlePress, handleRelease };
  };

  // Animação de hover
  const useHoverInteraction = (interactionConfig: MicroInteractionConfig = {}) => {
    const [springs, api] = useSpring(() => ({
      scale: 1,
      y: 0,
      shadow: 0,
      glow: 0,
      config: config.gentle
    }));

    const handleHover = useCallback(() => {
      if (interactionConfig.haptic) triggerHaptic('light');
      
      switch (interactionConfig.animation) {
        case 'glow':
          api.start({ glow: 1, shadow: 10 });
          break;
        case 'scale':
          api.start({ scale: 1.05, y: -2, shadow: 15 });
          break;
        default:
          api.start({ scale: 1.02, y: -1, shadow: 8 });
      }
    }, [api, interactionConfig]);

    const handleLeave = useCallback(() => {
      api.start({ scale: 1, y: 0, shadow: 0, glow: 0 });
    }, [api]);

    return { springs, handleHover, handleLeave };
  };

  // Animação de foco para acessibilidade
  const useFocusInteraction = () => {
    const [springs, api] = useSpring(() => ({
      outline: 0,
      outlineColor: 'rgba(59, 130, 246, 0)',
      config: config.gentle
    }));

    const handleFocus = useCallback(() => {
      api.start({
        outline: 2,
        outlineColor: 'rgba(59, 130, 246, 1)'
      });
    }, [api]);

    const handleBlur = useCallback(() => {
      api.start({
        outline: 0,
        outlineColor: 'rgba(59, 130, 246, 0)'
      });
    }, [api]);

    return { springs, handleFocus, handleBlur };
  };

  // Animação de loading
  const useLoadingInteraction = (isLoading: boolean) => {
    const [springs, api] = useSpring(() => ({
      rotate: 0,
      scale: 1,
      opacity: 1,
      config: config.slow
    }));

    useEffect(() => {
      if (isLoading) {
        const interval = setInterval(() => {
          api.start({ rotate: springs.rotate.get() + 360 });
        }, 1000);
        return () => clearInterval(interval);
      } else {
        api.start({ rotate: 0 });
      }
    }, [isLoading, api, springs.rotate]);

    return springs;
  };

  // Animação de sucesso/erro
  const useStatusInteraction = (status: 'success' | 'error' | 'warning' | null) => {
    const [springs, api] = useSpring(() => ({
      scale: 1,
      color: 'rgb(107, 114, 128)',
      config: config.wobbly
    }));

    useEffect(() => {
      if (status) {
        const colors = {
          success: 'rgb(34, 197, 94)',
          error: 'rgb(239, 68, 68)',
          warning: 'rgb(245, 158, 11)'
        };

        if (status === 'success') {
          playSound(800, 100);
          triggerHaptic('light');
        } else if (status === 'error') {
          playSound(400, 200);
          triggerHaptic('medium');
        }

        api.start({ 
          scale: 1.1, 
          color: colors[status],
          config: config.wobbly
        });
        
        setTimeout(() => {
          api.start({ scale: 1 });
        }, 300);
      }
    }, [status, api]);

    return springs;
  };

  // Animação de entrada/saída
  const useEntranceTransition = (items: any[], interactionConfig: MicroInteractionConfig = {}) => {
    const transitions = useTransition(items, {
      from: { opacity: 0, transform: 'translateY(20px) scale(0.9)' },
      enter: { opacity: 1, transform: 'translateY(0px) scale(1)' },
      leave: { opacity: 0, transform: 'translateY(-20px) scale(0.9)' },
      config: interactionConfig.duration ? { duration: interactionConfig.duration } : config.gentle,
      trail: 100
    });

    return transitions;
  };

  // Animação de progresso
  const useProgressInteraction = (progress: number) => {
    const [springs, api] = useSpring(() => ({
      width: '0%',
      backgroundColor: 'rgb(59, 130, 246)',
      config: config.gentle
    }));

    useEffect(() => {
      api.start({ 
        width: `${progress}%`,
        backgroundColor: progress === 100 ? 'rgb(34, 197, 94)' : 'rgb(59, 130, 246)'
      });

      if (progress === 100) {
        playSound(800, 150);
        triggerHaptic('light');
      }
    }, [progress, api]);

    return springs;
  };

  return {
    triggerHaptic,
    playSound,
    useButtonInteraction,
    useHoverInteraction,
    useFocusInteraction,
    useLoadingInteraction,
    useStatusInteraction,
    useEntranceTransition,
    useProgressInteraction
  };
};

// Hook para animações de página
export const usePageTransitions = () => {
  const [springs, api] = useSpring(() => ({
    opacity: 0,
    transform: 'translateY(20px)',
    config: config.gentle
  }));

  const animateIn = useCallback(() => {
    api.start({
      opacity: 1,
      transform: 'translateY(0px)'
    });
  }, [api]);

  const animateOut = useCallback(() => {
    api.start({
      opacity: 0,
      transform: 'translateY(-20px)'
    });
  }, [api]);

  useEffect(() => {
    animateIn();
  }, [animateIn]);

  return { springs, animateIn, animateOut };
};

// Hook para animações de scroll
export const useScrollAnimations = () => {
  const [springs, api] = useSpring(() => ({
    opacity: 0,
    transform: 'translateY(50px)',
    config: config.gentle
  }));

  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          api.start({
            opacity: 1,
            transform: 'translateY(0px)'
          });
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(elementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [api]);

  return { springs, elementRef };
};