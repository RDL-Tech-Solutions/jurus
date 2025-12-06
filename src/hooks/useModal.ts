import { useEffect } from 'react';
import { useNavbarVisibility } from './useNavbarVisibility';

/**
 * Hook para gerenciar o comportamento de modais
 * Automaticamente oculta a navbar quando o modal está aberto
 * e mostra novamente quando fecha
 */
export function useModal(isOpen: boolean) {
    const { hideNavbar, showNavbar } = useNavbarVisibility();

    useEffect(() => {
        if (isOpen) {
            hideNavbar();
            // Previne scroll do body quando modal está aberto
            document.body.style.overflow = 'hidden';
        } else {
            showNavbar();
            document.body.style.overflow = '';
        }

        // Cleanup
        return () => {
            showNavbar();
            document.body.style.overflow = '';
        };
    }, [isOpen, hideNavbar, showNavbar]);
}
