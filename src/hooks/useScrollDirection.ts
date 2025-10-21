import { useState, useEffect } from 'react';

interface UseScrollDirectionOptions {
  threshold?: number;
  initialDirection?: 'up' | 'down';
}

interface ScrollDirectionState {
  scrollDirection: 'up' | 'down';
  isScrolled: boolean;
  scrollY: number;
  isHidden: boolean;
}

export const useScrollDirection = (options: UseScrollDirectionOptions = {}): ScrollDirectionState => {
  const { threshold = 10, initialDirection = 'up' } = options;
  
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>(initialDirection);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      
      // Atualiza o estado do scroll
      setScrollY(currentScrollY);
      setIsScrolled(currentScrollY > threshold);
      
      // Se estamos no topo da página, sempre mostrar
      if (currentScrollY <= threshold) {
        setIsHidden(false);
        setScrollDirection('up');
        setLastScrollY(currentScrollY);
        return;
      }
      
      // Calcula a diferença do scroll
      const scrollDifference = Math.abs(currentScrollY - lastScrollY);
      
      // Só atualiza a direção se passou do threshold
      if (scrollDifference >= threshold) {
        const direction = currentScrollY > lastScrollY ? 'down' : 'up';
        setScrollDirection(direction);
        setIsHidden(direction === 'down' && currentScrollY > threshold);
        setLastScrollY(currentScrollY);
      }
    };

    // Throttle para melhor performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollDirection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Inicializa o estado
    updateScrollDirection();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold, lastScrollY]);

  return {
    scrollDirection,
    isScrolled,
    scrollY,
    isHidden
  };
};