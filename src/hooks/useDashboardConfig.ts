import { useState, useEffect, useCallback } from 'react';
import { DashboardConfig, DASHBOARD_CONFIG_PADRAO } from '../types/fluxoCaixa';

const STORAGE_KEY = 'jurus_dashboard_config';

export function useDashboardConfig() {
    const [config, setConfig] = useState<DashboardConfig>(DASHBOARD_CONFIG_PADRAO);
    const [carregado, setCarregado] = useState(false);

    // Carregar do localStorage
    useEffect(() => {
        const salva = localStorage.getItem(STORAGE_KEY);
        if (salva) {
            try {
                setConfig(JSON.parse(salva));
            } catch {
                setConfig(DASHBOARD_CONFIG_PADRAO);
            }
        }
        setCarregado(true);
    }, []);

    // Salvar sempre que mudar
    useEffect(() => {
        if (carregado) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        }
    }, [config, carregado]);

    const atualizarConfig = useCallback((novaConfig: Partial<DashboardConfig>) => {
        setConfig(prev => ({
            insights: { ...prev.insights, ...(novaConfig.insights || {}) },
            analytics: { ...prev.analytics, ...(novaConfig.analytics || {}) },
            graficos: { ...prev.graficos, ...(novaConfig.graficos || {}) },
            cardsTransacoes: { ...prev.cardsTransacoes, ...(novaConfig.cardsTransacoes || {}) }
        }));
    }, []);

    const toggleInsight = useCallback((key: keyof DashboardConfig['insights']) => {
        setConfig(prev => ({
            ...prev,
            insights: { ...prev.insights, [key]: !prev.insights[key] }
        }));
    }, []);

    const toggleAnalytic = useCallback((key: keyof DashboardConfig['analytics']) => {
        setConfig(prev => ({
            ...prev,
            analytics: { ...prev.analytics, [key]: !prev.analytics[key] }
        }));
    }, []);

    const toggleGrafico = useCallback((key: keyof DashboardConfig['graficos']) => {
        setConfig(prev => ({
            ...prev,
            graficos: { ...prev.graficos, [key]: !prev.graficos[key] }
        }));
    }, []);

    const restaurarPadrao = useCallback(() => {
        setConfig(DASHBOARD_CONFIG_PADRAO);
    }, []);

    const mostrarTodos = useCallback(() => {
        setConfig({
            insights: {
                tendencia: true,
                mediaDiaria: true,
                comparativo: true
            },
            analytics: {
                runway: true,
                breakEven: true,
                maiorGasto: true,
                alertas: true,
                topCategorias: true
            },
            graficos: {
                barrasComparativo: true,
                pizza: true,
                evolucao: true
            },
            cardsTransacoes: {
                previsaoMes: true,
                economiaMensal: true,
                dividasPendentes: true,
                cartoesCredito: true,
                metasMes: true,
                recorrentes: true
            }
        });
    }, []);

    const ocultarTodos = useCallback(() => {
        setConfig({
            insights: {
                tendencia: false,
                mediaDiaria: false,
                comparativo: false
            },
            analytics: {
                runway: false,
                breakEven: false,
                maiorGasto: false,
                alertas: false,
                topCategorias: false
            },
            graficos: {
                barrasComparativo: false,
                pizza: false,
                evolucao: false
            },
            cardsTransacoes: {
                previsaoMes: false,
                economiaMensal: false,
                dividasPendentes: false,
                cartoesCredito: false,
                metasMes: false,
                recorrentes: false
            }
        });
    }, []);

    const contarAtivos = useCallback(() => {
        const insights = Object.values(config.insights).filter(Boolean).length;
        const analytics = Object.values(config.analytics).filter(Boolean).length;
        const graficos = Object.values(config.graficos).filter(Boolean).length;
        return { insights, analytics, graficos, total: insights + analytics + graficos };
    }, [config]);

    return {
        config,
        carregado,
        atualizarConfig,
        toggleInsight,
        toggleAnalytic,
        toggleGrafico,
        restaurarPadrao,
        mostrarTodos,
        ocultarTodos,
        contarAtivos
    };
}
