import { useState, useEffect, useCallback } from 'react';

let globalNavbarVisible = true;
const listeners = new Set<(visible: boolean) => void>();

export function useNavbarVisibility() {
    const [isVisible, setIsVisible] = useState(globalNavbarVisible);

    useEffect(() => {
        listeners.add(setIsVisible);
        return () => {
            listeners.delete(setIsVisible);
        };
    }, []);

    const hideNavbar = useCallback(() => {
        globalNavbarVisible = false;
        listeners.forEach(listener => listener(false));
    }, []);

    const showNavbar = useCallback(() => {
        globalNavbarVisible = true;
        listeners.forEach(listener => listener(true));
    }, []);

    return { isVisible, hideNavbar, showNavbar };
}
