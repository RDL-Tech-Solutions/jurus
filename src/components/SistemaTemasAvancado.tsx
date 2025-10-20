import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Settings,
  Download,
  Upload,
  Sparkles,
  Grid,
  Edit3,
  X,
  Eye,
  Save,
  RotateCcw,
  Zap,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { TemaAvancado, ConfiguracaoTema } from '../types/temas';
import { AnimatedContainer, AnimatedItem } from './AnimatedContainer';
import { AnimatedButton } from './AnimatedButton';
import { GaleriaTemas } from './GaleriaTemas';
import { EditorTemas } from './EditorTemas';
import { ConfiguracoesAvancadas } from './ConfiguracoesAvancadas';
import { ImportExportTemas } from './ImportExportTemas';
import { FuncionalidadesInteligentes } from './FuncionalidadesInteligentes';

interface SistemaTemasAvancadoProps {
  onFechar: () => void;
}

interface HistoricoAcao {
  id: string;
  tipo: 'criar' | 'editar' | 'deletar' | 'importar';
  tema: TemaAvancado;
  timestamp: number;
  descricao: string;
}

export const SistemaTemasAvancado: React.FC<SistemaTemasAvancadoProps> = ({ onFechar }) => {
  // Estados principais
  const [temas, setTemas] = useState<TemaAvancado[]>([]);
  const [temaAtivo, setTemaAtivo] = useState<string>('padrao');
  const [configuracao, setConfiguracao] = useState<ConfiguracaoTema>({
    temaAtivo: 'padrao',
    modoEscuroAutomatico: false,
    horarioModoEscuro: { inicio: '18:00', fim: '06:00' },
    sincronizarSistema: false,
    transicaoSuave: true,
    velocidadeTransicao: 200,
    salvarPreferencia: true,
    backupAutomatico: true,
    validacaoContraste: true,
    sugestoesCores: true,
    previewTempoReal: true
  });

  // Estados da interface
  const [abaAtiva, setAbaAtiva] = useState<'galeria' | 'editor' | 'configuracoes' | 'importar' | 'inteligentes'>('galeria');
  const [temaEditando, setTemaEditando] = useState<TemaAvancado | null>(null);
  const [modoPreview, setModoPreview] = useState(false);
  const [dispositivoPreview, setDispositivoPreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [historico, setHistorico] = useState<HistoricoAcao[]>([]);
  const [indiceHistorico, setIndiceHistorico] = useState(-1);

  // Temas predefinidos
  const temasPredefinidos: TemaAvancado[] = [
    {
      id: 'padrao',
      nome: 'Padrão',
      descricao: 'Tema padrão do sistema com cores equilibradas',
      categoria: 'Business',
      autor: 'Sistema',
      personalizado: false,
      favorito: false,
      rating: 4.5,
      popularidade: 95,
      dataCreacao: new Date().toISOString(),
      dataModificacao: new Date().toISOString(),
      paleta: {
        primaria: '#3B82F6',
        secundaria: '#6366F1',
        terciaria: '#8B5CF6',
        acento: '#F59E0B',
        fundo: '#FFFFFF',
        fundoSecundario: '#F8FAFC',
        superficie: '#FFFFFF',
        texto: '#1F2937',
        textoSecundario: '#6B7280',
        textoTerciario: '#9CA3AF',
        borda: '#E5E7EB',
        bordaSecundaria: '#D1D5DB',
        sucesso: '#10B981',
        aviso: '#F59E0B',
        erro: '#EF4444',
        info: '#3B82F6',
        destaque: '#8B5CF6',
        sombra: 'rgba(0, 0, 0, 0.1)',
        overlay: 'rgba(0, 0, 0, 0.5)',
        gradientes: {
          primario: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
          secundario: 'linear-gradient(135deg, #8B5CF6 0%, #F59E0B 100%)',
          fundo: 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)'
        }
      },
      tipografia: {
        fontePrimaria: 'Inter, system-ui, sans-serif',
        fonteSecundaria: 'JetBrains Mono, monospace',
        fonteTerciaria: 'Inter, system-ui, sans-serif',
        tamanhoBase: 16,
        escalaModular: 1.25,
        pesoTitulo: 600,
        pesoTexto: 400,
        pesoDestaque: 500,
        alturaLinha: 1.5,
        alturaLinhaCompacta: 1.25,
        espacamentoLetras: 0,
        espacamentoLetrasDestaque: 0.025
      },
      espacamento: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem'
      },
      bordas: {
        raio: '0.5rem',
        raioSecundario: '0.25rem',
        raioPequeno: '0.125rem',
        raioGrande: '1rem',
        largura: '1px',
        larguraDestaque: '2px',
        estilo: 'solid'
      },
      sombras: {
        pequena: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        media: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        grande: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        interna: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        destaque: '0 0 0 3px rgba(59, 130, 246, 0.1)',
        colorida: '0 4px 14px 0 rgba(59, 130, 246, 0.15)'
      },
      animacoes: {
        duracao: '200ms',
        duracaoLenta: '300ms',
        duracaoRapida: '150ms',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easingEntrada: 'cubic-bezier(0, 0, 0.2, 1)',
        easingSaida: 'cubic-bezier(0.4, 0, 1, 1)',
        habilitadas: true
      }
    }
  ];

  // Carregar dados iniciais
  useEffect(() => {
    carregarTemas();
    carregarConfiguracao();
  }, []);

  const carregarTemas = useCallback(() => {
    const temasLocal = localStorage.getItem('jurus-temas');
    if (temasLocal) {
      try {
        const temasCarregados = JSON.parse(temasLocal);
        setTemas([...temasPredefinidos, ...temasCarregados]);
      } catch (error) {
        console.error('Erro ao carregar temas:', error);
        setTemas(temasPredefinidos);
      }
    } else {
      setTemas(temasPredefinidos);
    }
  }, []);

  const carregarConfiguracao = useCallback(() => {
    const configLocal = localStorage.getItem('jurus-config-temas');
    if (configLocal) {
      try {
        const configCarregada = JSON.parse(configLocal);
        setConfiguracao(prev => ({ ...prev, ...configCarregada }));
        setTemaAtivo(configCarregada.temaAtivo || 'padrao');
      } catch (error) {
        console.error('Erro ao carregar configuração:', error);
      }
    }
  }, []);

  const salvarTemas = useCallback((novosTemas: TemaAvancado[]) => {
    const temasPersonalizados = novosTemas.filter(tema => tema.personalizado);
    localStorage.setItem('jurus-temas', JSON.stringify(temasPersonalizados));
    setTemas(novosTemas);
  }, []);

  const salvarConfiguracao = useCallback((novaConfig: ConfiguracaoTema) => {
    localStorage.setItem('jurus-config-temas', JSON.stringify(novaConfig));
    setConfiguracao(novaConfig);
  }, []);

  // Handlers dos componentes
  const handleSelecionarTema = useCallback((temaId: string) => {
    setTemaAtivo(temaId);
    const novaConfig = { ...configuracao, temaAtivo: temaId };
    salvarConfiguracao(novaConfig);
    aplicarTema(temaId);
  }, [configuracao, salvarConfiguracao]);

  const handleEditarTema = useCallback((tema: TemaAvancado) => {
    setTemaEditando(tema);
    setAbaAtiva('editor');
  }, []);

  const handleSalvarTema = useCallback((tema: TemaAvancado) => {
    const temasAtualizados = temas.map(t => t.id === tema.id ? tema : t);
    if (!temas.find(t => t.id === tema.id)) {
      temasAtualizados.push(tema);
    }
    
    salvarTemas(temasAtualizados);
    
    // Adicionar ao histórico
    const novaAcao: HistoricoAcao = {
      id: Date.now().toString(),
      tipo: temas.find(t => t.id === tema.id) ? 'editar' : 'criar',
      tema,
      timestamp: Date.now(),
      descricao: `${temas.find(t => t.id === tema.id) ? 'Editou' : 'Criou'} o tema "${tema.nome}"`
    };
    
    setHistorico(prev => [novaAcao, ...prev.slice(0, 49)]);
    setTemaEditando(null);
    setAbaAtiva('galeria');
  }, [temas, salvarTemas]);

  const handleDeletarTema = useCallback((temaId: string) => {
    const tema = temas.find(t => t.id === temaId);
    if (!tema || !tema.personalizado) return;
    
    const temasAtualizados = temas.filter(t => t.id !== temaId);
    salvarTemas(temasAtualizados);
    
    // Adicionar ao histórico
    const novaAcao: HistoricoAcao = {
      id: Date.now().toString(),
      tipo: 'deletar',
      tema,
      timestamp: Date.now(),
      descricao: `Deletou o tema "${tema.nome}"`
    };
    
    setHistorico(prev => [novaAcao, ...prev.slice(0, 49)]);
    
    // Se o tema ativo foi deletado, voltar ao padrão
    if (temaAtivo === temaId) {
      handleSelecionarTema('padrao');
    }
  }, [temas, temaAtivo, salvarTemas, handleSelecionarTema]);

  const handleFavoritarTema = useCallback((temaId: string) => {
    const temasAtualizados = temas.map(tema => 
      tema.id === temaId ? { ...tema, favorito: !tema.favorito } : tema
    );
    salvarTemas(temasAtualizados);
  }, [temas, salvarTemas]);

  const handleCompartilharTema = useCallback((tema: TemaAvancado) => {
    const dadosTema = JSON.stringify(tema, null, 2);
    const blob = new Blob([dadosTema], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tema-${tema.nome.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleDuplicarTema = useCallback((tema: TemaAvancado) => {
    const novoTema: TemaAvancado = {
      ...tema,
      id: `${tema.id}-copia-${Date.now()}`,
      nome: `${tema.nome} (Cópia)`,
      personalizado: true,
      dataCreacao: new Date().toISOString(),
      dataModificacao: new Date().toISOString()
    };
    
    const temasAtualizados = [...temas, novoTema];
    salvarTemas(temasAtualizados);
  }, [temas, salvarTemas]);

  const handleImportarTemas = useCallback((novosTemasImportados: TemaAvancado[]) => {
    const temasAtualizados = [...temas];
    
    novosTemasImportados.forEach(tema => {
      const temaExistente = temasAtualizados.find(t => t.id === tema.id);
      if (temaExistente) {
        // Atualizar tema existente
        const index = temasAtualizados.findIndex(t => t.id === tema.id);
        temasAtualizados[index] = { ...tema, dataModificacao: new Date().toISOString() };
      } else {
        // Adicionar novo tema
        temasAtualizados.push({ ...tema, personalizado: true, dataCreacao: new Date().toISOString() });
      }
    });
    
    salvarTemas(temasAtualizados);
    
    // Adicionar ao histórico
    const novaAcao: HistoricoAcao = {
      id: Date.now().toString(),
      tipo: 'importar',
      tema: novosTemasImportados[0], // Usar o primeiro tema como referência
      timestamp: Date.now(),
      descricao: `Importou ${novosTemasImportados.length} tema(s)`
    };
    
    setHistorico(prev => [novaAcao, ...prev.slice(0, 49)]);
  }, [temas, salvarTemas]);

  const aplicarTema = useCallback((temaId: string) => {
    const tema = temas.find(t => t.id === temaId);
    if (!tema) return;

    // Aplicar variáveis CSS do tema
    const root = document.documentElement;
    
    // Cores
    Object.entries(tema.paleta).forEach(([chave, valor]) => {
      if (typeof valor === 'string') {
        root.style.setProperty(`--cor-${chave}`, valor);
      }
    });

    // Gradientes
    if (tema.paleta.gradientes) {
      Object.entries(tema.paleta.gradientes).forEach(([chave, valor]) => {
        root.style.setProperty(`--gradiente-${chave}`, valor);
      });
    }

    // Tipografia
    root.style.setProperty('--fonte-primaria', tema.tipografia.fontePrimaria);
    root.style.setProperty('--fonte-secundaria', tema.tipografia.fonteSecundaria);
    root.style.setProperty('--tamanho-base', `${tema.tipografia.tamanhoBase}px`);
    root.style.setProperty('--altura-linha', tema.tipografia.alturaLinha.toString());

    // Espaçamento
    Object.entries(tema.espacamento).forEach(([chave, valor]) => {
      root.style.setProperty(`--espacamento-${chave}`, valor);
    });

    // Bordas
    Object.entries(tema.bordas).forEach(([chave, valor]) => {
      root.style.setProperty(`--borda-${chave}`, valor);
    });

    // Sombras
    Object.entries(tema.sombras).forEach(([chave, valor]) => {
      root.style.setProperty(`--sombra-${chave}`, valor);
    });

    // Animações
    root.style.setProperty('--duracao-animacao', tema.animacoes.duracao);
    root.style.setProperty('--easing-animacao', tema.animacoes.easing);
  }, [temas]);

  const renderizarConteudo = () => {
    switch (abaAtiva) {
      case 'galeria':
        return (
          <GaleriaTemas
            temas={temas}
            temaAtivo={temaAtivo}
            onSelecionarTema={handleSelecionarTema}
            onEditarTema={handleEditarTema}
            onDeletarTema={handleDeletarTema}
            onFavoritarTema={handleFavoritarTema}
            onCompartilharTema={handleCompartilharTema}
            onDuplicarTema={handleDuplicarTema}
          />
        );
      
      case 'editor':
        return temaEditando ? (
          <EditorTemas
            tema={temaEditando}
            onSalvarTema={handleSalvarTema}
            onCancelar={() => {
              setTemaEditando(null);
              setAbaAtiva('galeria');
            }}
            onPreview={(tema) => {
              // Implementar preview temporário
              aplicarTema(tema.id);
            }}
            historico={[]}
            indiceHistorico={-1}
            onUndo={() => {}}
            onRedo={() => {}}
            podeUndo={false}
            podeRedo={false}
          />
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Selecione um tema para editar</p>
          </div>
        );
      
      case 'configuracoes':
        return (
          <ConfiguracoesAvancadas
            configuracao={configuracao}
            onAtualizarConfiguracao={salvarConfiguracao}
            temas={temas}
            onFechar={() => setAbaAtiva('galeria')}
          />
        );
      
      case 'importar':
        return (
          <ImportExportTemas
            temas={temas}
            configuracao={configuracao}
            onImportarTemas={handleImportarTemas}
            onImportarConfiguracao={salvarConfiguracao}
            onFechar={() => setAbaAtiva('galeria')}
          />
        );
      
      case 'inteligentes':
        return (
          <FuncionalidadesInteligentes
            configuracao={configuracao}
            onAtualizarConfiguracao={salvarConfiguracao}
            temas={temas}
            temaAtivo={temaAtivo}
            onMudarTema={handleSelecionarTema}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <Palette className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sistema de Temas Avançado</h1>
              <p className="text-sm text-gray-600">
                Personalize completamente a aparência da aplicação
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Preview Controls */}
            {modoPreview && (
              <div className="flex items-center space-x-2 mr-4">
                <AnimatedButton
                  variant={dispositivoPreview === 'desktop' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setDispositivoPreview('desktop')}
                >
                  <Monitor className="w-4 h-4" />
                </AnimatedButton>
                <AnimatedButton
                  variant={dispositivoPreview === 'tablet' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setDispositivoPreview('tablet')}
                >
                  <Tablet className="w-4 h-4" />
                </AnimatedButton>
                <AnimatedButton
                  variant={dispositivoPreview === 'mobile' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setDispositivoPreview('mobile')}
                >
                  <Smartphone className="w-4 h-4" />
                </AnimatedButton>
              </div>
            )}
            
            <AnimatedButton
              variant={modoPreview ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setModoPreview(!modoPreview)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </AnimatedButton>
            
            <AnimatedButton
              variant="ghost"
              size="sm"
              onClick={onFechar}
            >
              <X className="w-4 h-4" />
            </AnimatedButton>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'galeria', label: 'Galeria', icon: Grid },
            { id: 'editor', label: 'Editor', icon: Edit3 },
            { id: 'inteligentes', label: 'Inteligentes', icon: Sparkles },
            { id: 'importar', label: 'Importar/Exportar', icon: Download },
            { id: 'configuracoes', label: 'Configurações', icon: Settings }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setAbaAtiva(id as any)}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                abaAtiva === id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={abaAtiva}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderizarConteudo()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Tema ativo: <strong>{temas.find(t => t.id === temaAtivo)?.nome || 'Padrão'}</strong></span>
            <span>•</span>
            <span>{temas.length} temas disponíveis</span>
            <span>•</span>
            <span>{temas.filter(t => t.personalizado).length} personalizados</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <AnimatedButton
              variant="ghost"
              size="sm"
              onClick={() => {
                setTemas(temasPredefinidos);
                setTemaAtivo('padrao');
                localStorage.removeItem('jurus-temas');
                localStorage.removeItem('jurus-config-temas');
              }}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Resetar
            </AnimatedButton>
            
            <AnimatedButton
              variant="primary"
              size="sm"
              onClick={() => {
                // Salvar configurações atuais
                salvarConfiguracao(configuracao);
                onFechar();
              }}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar e Fechar
            </AnimatedButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SistemaTemasAvancado;