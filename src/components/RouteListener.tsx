/**
 * 🔄 ROUTE LISTENER
 * 
 * Componente que detecta mudanças de rota e dispara evento
 * para revalidar dados do Context Global
 * 
 * CORREÇÃO: Problema de navegação sem F5
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function RouteListener() {
    const location = useLocation();

    useEffect(() => {
        // Disparar evento customizado quando a rota mudar
        const event = new CustomEvent('route-changed', {
            detail: { pathname: location.pathname }
        });
        window.dispatchEvent(event);
        
        // Log para debug (remover em produção se necessário)
        console.log('🔄 Rota mudou:', location.pathname);
    }, [location.pathname]);

    return null; // Componente não renderiza nada
}
