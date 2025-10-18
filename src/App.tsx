import './styles/animations.css';
import './styles/accessibility.css';
import './styles/responsive.css';
import { AppRouter } from './router/AppRouter';
import PWAControls from './components/PWAControls';
import { useGlobalSettings, useSettingsWatcher } from './hooks/useGlobalSettings';
import { useAccessibility } from './hooks/useAccessibility';
import { useTemas } from './hooks/useTemas';
import { useEffect } from 'react';

function App() {
  console.log('🚀 App iniciando...');
  
  // Inicializar configurações globais
  const { isInitialized, validatePersistence } = useGlobalSettings();
  const { useKeyboardNavigation } = useAccessibility();
  
  // Inicializar sistema de temas
  const { temaAtivo, aplicarTema } = useTemas();
  
  console.log('📊 Configurações inicializadas:', isInitialized);
  console.log('🎨 Tema ativo:', temaAtivo?.nome || 'Nenhum');
  console.log('🎨 Sistema de temas carregado!');
  
  // Monitorar mudanças nas configurações
  useSettingsWatcher();
  
  // Ativar navegação por teclado
  useKeyboardNavigation();

  // Aplicar tema ativo na inicialização
  useEffect(() => {
    if (temaAtivo) {
      console.log('🎨 Aplicando tema:', temaAtivo.nome);
      aplicarTema(temaAtivo);
    }
  }, [temaAtivo, aplicarTema]);

  // Validar persistência das configurações após inicialização
  useEffect(() => {
    if (isInitialized) {
      const validation = validatePersistence();
      if (!validation.isValid) {
        console.warn('Problemas de persistência detectados:', validation.issues);
      } else {
        console.log('✅ Todas as configurações foram carregadas corretamente');
      }
    }
  }, [isInitialized, validatePersistence]);

  return (
    <>
      <AppRouter />
      <PWAControls />
    </>
  );
}

export default App;
