import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { cn } from '../utils/cn';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Verifica se já está em modo standalone (já instalado)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true;

        // Verifica se já foi dispensado anteriormente
        const wasDismissed = localStorage.getItem('pwa_install_dismissed');

        // Se já está instalado ou foi dispensado, não mostra
        if (isStandalone || wasDismissed) {
            setShowBanner(false);
            return;
        }

        // Detecta se é mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        // Só mostra em mobile
        if (!isMobile) {
            setShowBanner(false);
            return;
        }

        // Listener para o evento beforeinstallprompt (Android)
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Para iOS, mostra o banner com instruções manuais
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isIOS) {
            setShowBanner(true);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            // Android - usa o prompt nativo
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShowBanner(false);
            }
            setDeferredPrompt(null);
        } else {
            // iOS - mostra instruções
            alert('Para instalar:\n\n1. Toque no ícone de compartilhar (⬆️)\n2. Role e toque em "Adicionar à Tela de Início"');
        }
    };

    const handleDismiss = () => {
        setDismissed(true);
        setShowBanner(false);
        // Salva por 7 dias
        localStorage.setItem('pwa_install_dismissed', Date.now().toString());
        setTimeout(() => {
            localStorage.removeItem('pwa_install_dismissed');
        }, 7 * 24 * 60 * 60 * 1000);
    };

    if (!showBanner || dismissed) {
        return null;
    }

    return (
        <div className="fixed bottom-20 left-4 right-4 z-50 md:hidden animate-slide-up">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-2xl p-4 flex items-center gap-3">
                {/* Ícone */}
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Download className="w-6 h-6 text-white" />
                </div>

                {/* Texto */}
                <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">Instale o App</p>
                    <p className="text-white/80 text-xs">Acesse mais rápido pela sua tela inicial</p>
                </div>

                {/* Botões */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={handleInstall}
                        className="px-4 py-2 bg-white text-primary-600 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors"
                    >
                        Adicionar
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="p-2 text-white/70 hover:text-white transition-colors"
                        aria-label="Fechar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
