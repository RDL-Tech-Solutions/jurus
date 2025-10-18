import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface Tema {
  id: string;
  nome: string;
  descricao: string;
  autor?: string;
  categoria: 'claro' | 'escuro' | 'colorido' | 'minimalista' | 'profissional' | 'personalizado' | 'sazonal' | 'acessibilidade';
  cores: {
    primaria: string;
    secundaria: string;
    acento: string;
    fundo: string;
    superficie: string;
    texto: string;
    textoSecundario: string;
    borda: string;
    sucesso: string;
    aviso: string;
    erro: string;
    info: string;
    gradiente?: string;
    overlay?: string;
  };
  tipografia: {
    fontePrimaria: string;
    fonteSecundaria: string;
    tamanhoBase: number;
    espacamento: number;
    alturaLinha: number;
    peso: 'normal' | 'medium' | 'semibold' | 'bold';
  };
  espacamento: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  bordas: {
    raio: string;
    largura: string;
    estilo: 'solid' | 'dashed' | 'dotted';
  };
  sombras: {
    pequena: string;
    media: string;
    grande: string;
    interna: string;
  };
  animacoes: {
    duracao: string;
    easing: string;
    habilitadas: boolean;
    reducaoMovimento: boolean;
  };
  acessibilidade: {
    altoContraste: boolean;
    tamanhoTextoGrande: boolean;
    reducaoMovimento: boolean;
    focusVisivel: boolean;
    daltonismo: 'nenhum' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  };
  personalizado?: boolean;
  favorito?: boolean;
  dataCreacao?: string;
  ultimaModificacao?: string;
  versao?: string;
  compatibilidade?: string[];
  tags?: string[];
}

export interface ConfiguracaoTema {
  temaAtivo: string;
  modoEscuroAutomatico: boolean;
  horarioModoEscuro: { inicio: string; fim: string };
  transicaoSuave: boolean;
  salvarPreferencia: boolean;
  sincronizarSistema: boolean;
  sincronizarDispositivos: boolean;
  temasSazonais: boolean;
  acessibilidadeAutomatica: boolean;
  preferenciaContraste: 'normal' | 'alto' | 'maximo';
  tamanhoTexto: 'pequeno' | 'normal' | 'grande' | 'extra-grande';
  reducaoMovimento: boolean;
  notificacoesTema: boolean;
}

export interface TemaSazonal {
  id: string;
  nome: string;
  periodo: {
    inicio: { mes: number; dia: number };
    fim: { mes: number; dia: number };
  };
  tema: Tema;
  ativo: boolean;
}

export interface SincronizacaoDispositivo {
  id: string;
  nome: string;
  ultimaSync: string;
  configuracao: ConfiguracaoTema;
  temas: Tema[];
}

export const useTemas = () => {
  const [temas, setTemas] = useLocalStorage<Tema[]>('temas-personalizados', []);
  const [configuracao, setConfiguracao] = useLocalStorage<ConfiguracaoTema>('configuracao-temas', {
    temaAtivo: 'padrao',
    modoEscuroAutomatico: false,
    horarioModoEscuro: { inicio: '18:00', fim: '06:00' },
    transicaoSuave: true,
    salvarPreferencia: true,
    sincronizarSistema: true,
    sincronizarDispositivos: false,
    temasSazonais: true,
    acessibilidadeAutomatica: true,
    preferenciaContraste: 'normal',
    tamanhoTexto: 'normal',
    reducaoMovimento: false,
    notificacoesTema: true
  });

  const [temasSazonais, setTemasSazonais] = useLocalStorage<TemaSazonal[]>('temas-sazonais', []);
  const [dispositivosSincronizados, setDispositivosSincronizados] = useLocalStorage<SincronizacaoDispositivo[]>('dispositivos-sync', []);
  const [temaAtivo, setTemaAtivo] = useState<string>(configuracao.temaAtivo);
  const [modoEscuroSistema, setModoEscuroSistema] = useState<boolean>(false);
  const [preferenciaAcessibilidade, setPreferenciaAcessibilidade] = useState<MediaQueryList | null>(null);

  // Temas predefinidos expandidos
  const temasPredefinidos: Tema[] = [
    {
      id: 'padrao',
      nome: 'Padrão',
      descricao: 'Tema padrão do sistema com cores equilibradas',
      categoria: 'profissional',
      cores: {
        primaria: '#3B82F6',
        secundaria: '#6366F1',
        acento: '#8B5CF6',
        fundo: '#FFFFFF',
        superficie: '#F8FAFC',
        texto: '#1F2937',
        textoSecundario: '#6B7280',
        borda: '#E5E7EB',
        sucesso: '#10B981',
        aviso: '#F59E0B',
        erro: '#EF4444',
        info: '#3B82F6',
        gradiente: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
        overlay: 'rgba(59, 130, 246, 0.1)'
      },
      tipografia: {
        fontePrimaria: 'Inter, system-ui, sans-serif',
        fonteSecundaria: 'JetBrains Mono, monospace',
        tamanhoBase: 16,
        espacamento: 0,
        alturaLinha: 1.5,
        peso: 'normal'
      },
      espacamento: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        xxl: '3rem'
      },
      bordas: {
        raio: '0.5rem',
        largura: '1px',
        estilo: 'solid'
      },
      sombras: {
        pequena: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        media: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        grande: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        interna: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
      },
      animacoes: {
        duracao: '200ms',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        habilitadas: true,
        reducaoMovimento: false
      },
      acessibilidade: {
        altoContraste: false,
        tamanhoTextoGrande: false,
        reducaoMovimento: false,
        focusVisivel: true,
        daltonismo: 'nenhum'
      },
      versao: '1.0.0',
      compatibilidade: ['web', 'mobile'],
      tags: ['profissional', 'moderno', 'azul']
    },
    {
      id: 'escuro',
      nome: 'Modo Escuro',
      descricao: 'Tema escuro elegante para reduzir o cansaço visual',
      categoria: 'escuro',
      cores: {
        primaria: '#60A5FA',
        secundaria: '#818CF8',
        acento: '#A78BFA',
        fundo: '#111827',
        superficie: '#1F2937',
        texto: '#F9FAFB',
        textoSecundario: '#D1D5DB',
        borda: '#374151',
        sucesso: '#34D399',
        aviso: '#FBBF24',
        erro: '#F87171',
        info: '#60A5FA',
        gradiente: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
        overlay: 'rgba(96, 165, 250, 0.1)'
      },
      tipografia: {
        fontePrimaria: 'Inter, system-ui, sans-serif',
        fonteSecundaria: 'JetBrains Mono, monospace',
        tamanhoBase: 16,
        espacamento: 0,
        alturaLinha: 1.5,
        peso: 'normal'
      },
      espacamento: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        xxl: '3rem'
      },
      bordas: {
        raio: '0.5rem',
        largura: '1px',
        estilo: 'solid'
      },
      sombras: {
        pequena: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        media: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
        grande: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        interna: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)'
      },
      animacoes: {
        duracao: '200ms',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        habilitadas: true,
        reducaoMovimento: false
      },
      acessibilidade: {
        altoContraste: false,
        tamanhoTextoGrande: false,
        reducaoMovimento: false,
        focusVisivel: true,
        daltonismo: 'nenhum'
      },
      versao: '1.0.0',
      compatibilidade: ['web', 'mobile'],
      tags: ['escuro', 'noturno', 'elegante']
    },
    {
      id: 'alto-contraste',
      nome: 'Alto Contraste',
      descricao: 'Tema com alto contraste para melhor acessibilidade',
      categoria: 'acessibilidade',
      cores: {
        primaria: '#000000',
        secundaria: '#FFFFFF',
        acento: '#FFFF00',
        fundo: '#FFFFFF',
        superficie: '#F0F0F0',
        texto: '#000000',
        textoSecundario: '#333333',
        borda: '#000000',
        sucesso: '#008000',
        aviso: '#FF8000',
        erro: '#FF0000',
        info: '#0000FF',
        gradiente: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
        overlay: 'rgba(0, 0, 0, 0.1)'
      },
      tipografia: {
        fontePrimaria: 'Arial, sans-serif',
        fonteSecundaria: 'Courier New, monospace',
        tamanhoBase: 18,
        espacamento: 0.5,
        alturaLinha: 1.6,
        peso: 'semibold'
      },
      espacamento: {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1.25rem',
        lg: '2rem',
        xl: '2.5rem',
        xxl: '3.5rem'
      },
      bordas: {
        raio: '0.25rem',
        largura: '2px',
        estilo: 'solid'
      },
      sombras: {
        pequena: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
        media: '0 6px 12px -2px rgba(0, 0, 0, 0.6)',
        grande: '0 25px 35px -5px rgba(0, 0, 0, 0.7)',
        interna: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)'
      },
      animacoes: {
        duracao: '100ms',
        easing: 'linear',
        habilitadas: false,
        reducaoMovimento: true
      },
      acessibilidade: {
        altoContraste: true,
        tamanhoTextoGrande: true,
        reducaoMovimento: true,
        focusVisivel: true,
        daltonismo: 'nenhum'
      },
      versao: '1.0.0',
      compatibilidade: ['web', 'mobile'],
      tags: ['acessibilidade', 'contraste', 'legibilidade']
    }
  ];

  // Temas sazonais predefinidos
  const temasSazonaisPredefinidos: TemaSazonal[] = [
    {
      id: 'natal',
      nome: 'Natal',
      periodo: {
        inicio: { mes: 12, dia: 1 },
        fim: { mes: 12, dia: 31 }
      },
      tema: {
        id: 'natal',
        nome: 'Espírito Natalino',
        descricao: 'Cores festivas para a época natalina',
        categoria: 'sazonal',
        cores: {
          primaria: '#DC2626',
          secundaria: '#059669',
          acento: '#D97706',
          fundo: '#FEF2F2',
          superficie: '#FEFEFE',
          texto: '#1F2937',
          textoSecundario: '#6B7280',
          borda: '#FCA5A5',
          sucesso: '#059669',
          aviso: '#D97706',
          erro: '#DC2626',
          info: '#2563EB',
          gradiente: 'linear-gradient(135deg, #DC2626 0%, #059669 100%)',
          overlay: 'rgba(220, 38, 38, 0.1)'
        },
        tipografia: {
          fontePrimaria: 'Inter, system-ui, sans-serif',
          fonteSecundaria: 'JetBrains Mono, monospace',
          tamanhoBase: 16,
          espacamento: 0,
          alturaLinha: 1.5,
          peso: 'normal'
        },
        espacamento: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
          xxl: '3rem'
        },
        bordas: {
          raio: '0.75rem',
          largura: '1px',
          estilo: 'solid'
        },
        sombras: {
          pequena: '0 1px 2px 0 rgba(220, 38, 38, 0.1)',
          media: '0 4px 6px -1px rgba(220, 38, 38, 0.2)',
          grande: '0 20px 25px -5px rgba(220, 38, 38, 0.3)',
          interna: 'inset 0 2px 4px 0 rgba(220, 38, 38, 0.1)'
        },
        animacoes: {
          duracao: '300ms',
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          habilitadas: true,
          reducaoMovimento: false
        },
        acessibilidade: {
          altoContraste: false,
          tamanhoTextoGrande: false,
          reducaoMovimento: false,
          focusVisivel: true,
          daltonismo: 'nenhum'
        },
        versao: '1.0.0',
        compatibilidade: ['web', 'mobile'],
        tags: ['natal', 'festivo', 'vermelho', 'verde']
      },
      ativo: true
    }
  ];

  // Todos os temas disponíveis
  const todosOsTemas = useMemo(() => {
    return [...temasPredefinidos, ...temas];
  }, [temas]);

  // Tema atual
  const temaAtual = useMemo(() => {
    return todosOsTemas.find(t => t.id === temaAtivo) || temasPredefinidos[0];
  }, [todosOsTemas, temaAtivo]);

  // Detectar preferências do sistema
  useEffect(() => {
    // Detectar modo escuro do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setModoEscuroSistema(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setModoEscuroSistema(e.matches);
      if (configuracao.sincronizarSistema) {
        aplicarTemaAutomatico();
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Detectar preferências de acessibilidade
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPreferenciaAcessibilidade(prefersReducedMotion);

    if (prefersReducedMotion.matches && configuracao.acessibilidadeAutomatica) {
      atualizarConfiguracaoAcessibilidade({ reducaoMovimento: true });
    }

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [configuracao.sincronizarSistema, configuracao.acessibilidadeAutomatica]);

  // Aplicar tema automaticamente baseado no horário
  const aplicarTemaAutomatico = useCallback(() => {
    if (!configuracao.modoEscuroAutomatico) return;

    const agora = new Date();
    const horaAtual = agora.getHours() * 60 + agora.getMinutes();
    
    const [inicioHora, inicioMin] = configuracao.horarioModoEscuro.inicio.split(':').map(Number);
    const [fimHora, fimMin] = configuracao.horarioModoEscuro.fim.split(':').map(Number);
    
    const inicioMinutos = inicioHora * 60 + inicioMin;
    const fimMinutos = fimHora * 60 + fimMin;
    
    let deveUsarModoEscuro = false;
    
    if (inicioMinutos > fimMinutos) {
      // Período atravessa meia-noite
      deveUsarModoEscuro = horaAtual >= inicioMinutos || horaAtual <= fimMinutos;
    } else {
      // Período normal
      deveUsarModoEscuro = horaAtual >= inicioMinutos && horaAtual <= fimMinutos;
    }
    
    if (configuracao.sincronizarSistema) {
      deveUsarModoEscuro = modoEscuroSistema;
    }
    
    const novoTema = deveUsarModoEscuro ? 'escuro' : 'padrao';
    if (novoTema !== temaAtivo) {
      alterarTema(novoTema);
    }
  }, [configuracao, modoEscuroSistema, temaAtivo]);

  // Verificar temas sazonais
  const verificarTemasSazonais = useCallback(() => {
    if (!configuracao.temasSazonais) return;

    const agora = new Date();
    const mesAtual = agora.getMonth() + 1;
    const diaAtual = agora.getDate();

    const temaSazonalAtivo = temasSazonais.find(ts => {
      const { inicio, fim } = ts.periodo;
      
      if (inicio.mes === fim.mes) {
        return mesAtual === inicio.mes && diaAtual >= inicio.dia && diaAtual <= fim.dia;
      } else if (inicio.mes < fim.mes) {
        return (mesAtual === inicio.mes && diaAtual >= inicio.dia) ||
               (mesAtual > inicio.mes && mesAtual < fim.mes) ||
               (mesAtual === fim.mes && diaAtual <= fim.dia);
      } else {
        // Período atravessa o ano
        return (mesAtual === inicio.mes && diaAtual >= inicio.dia) ||
               (mesAtual > inicio.mes || mesAtual < fim.mes) ||
               (mesAtual === fim.mes && diaAtual <= fim.dia);
      }
    });

    if (temaSazonalAtivo && temaSazonalAtivo.ativo) {
      alterarTema(temaSazonalAtivo.tema.id);
    }
  }, [configuracao.temasSazonais, temasSazonais]);

  // Aplicar tema ao DOM
  const aplicarTema = useCallback((tema: Tema) => {
    if (!tema) {
      console.warn('🎨 Tema não fornecido para aplicarTema');
      return;
    }
    
    console.log('🎨 Aplicando tema ao DOM:', tema.nome);
    const root = document.documentElement;
    
    // Aplicar variáveis CSS
    if (tema.cores) {
      console.log('🎨 Aplicando cores:', tema.cores);
      Object.entries(tema.cores).forEach(([chave, valor]) => {
        root.style.setProperty(`--cor-${chave}`, valor);
      });
    }
    
    if (tema.espacamento) {
      Object.entries(tema.espacamento).forEach(([chave, valor]) => {
        root.style.setProperty(`--espacamento-${chave}`, valor);
      });
    }
    
    if (tema.tipografia) {
      root.style.setProperty('--fonte-primaria', tema.tipografia.fontePrimaria);
      root.style.setProperty('--fonte-secundaria', tema.tipografia.fonteSecundaria);
      root.style.setProperty('--tamanho-base', `${tema.tipografia.tamanhoBase}px`);
      root.style.setProperty('--altura-linha', tema.tipografia.alturaLinha.toString());
      root.style.setProperty('--peso-fonte', tema.tipografia.peso);
    }
    
    if (tema.bordas) {
      root.style.setProperty('--raio-borda', tema.bordas.raio);
      root.style.setProperty('--largura-borda', tema.bordas.largura);
    }
    
    if (tema.sombras) {
      root.style.setProperty('--sombra-pequena', tema.sombras.pequena);
      root.style.setProperty('--sombra-media', tema.sombras.media);
      root.style.setProperty('--sombra-grande', tema.sombras.grande);
      root.style.setProperty('--sombra-interna', tema.sombras.interna);
    }
    
    if (tema.animacoes) {
      root.style.setProperty('--duracao-animacao', tema.animacoes.duracao);
      root.style.setProperty('--easing-animacao', tema.animacoes.easing);
    }
    
    // Aplicar configurações de acessibilidade
    if (tema.acessibilidade) {
      if (tema.acessibilidade.reducaoMovimento || configuracao.reducaoMovimento) {
        root.style.setProperty('--duracao-animacao', '0ms');
      }
      
      if (tema.acessibilidade.altoContraste) {
        root.classList.add('alto-contraste');
      } else {
        root.classList.remove('alto-contraste');
      }
      
      // Aplicar filtros para daltonismo
      if (tema.acessibilidade.daltonismo && tema.acessibilidade.daltonismo !== 'nenhum') {
        const filtros = {
          protanopia: 'url(#protanopia)',
          deuteranopia: 'url(#deuteranopia)',
          tritanopia: 'url(#tritanopia)'
        };
        root.style.filter = filtros[tema.acessibilidade.daltonismo];
      } else {
        root.style.filter = 'none';
      }
    }
    
    // Adicionar classe do tema
    if (tema.id) {
      root.className = root.className.replace(/tema-\w+/g, '');
      root.classList.add(`tema-${tema.id}`);
    }
    
    // Transição suave
    if (configuracao.transicaoSuave && tema.animacoes && tema.animacoes.habilitadas) {
      root.style.transition = 'all 300ms ease-in-out';
      setTimeout(() => {
        root.style.transition = '';
      }, 300);
    }
  }, [configuracao.transicaoSuave, configuracao.reducaoMovimento]);

  // Alterar tema
  const alterarTema = useCallback((temaId: string) => {
    const tema = todosOsTemas.find(t => t.id === temaId);
    if (!tema) return;

    setTemaAtivo(temaId);
    aplicarTema(tema);
    
    if (configuracao.salvarPreferencia) {
      setConfiguracao(prev => ({ ...prev, temaAtivo: temaId }));
    }
    
    // Notificar mudança se habilitado
    if (configuracao.notificacoesTema && 'Notification' in window) {
      new Notification(`Tema alterado para: ${tema.nome}`, {
        icon: '/favicon.ico',
        tag: 'tema-alterado'
      });
    }
  }, [todosOsTemas, aplicarTema, configuracao.salvarPreferencia, configuracao.notificacoesTema]);

  // Criar tema personalizado
  const criarTema = useCallback((tema: Omit<Tema, 'id' | 'dataCreacao' | 'ultimaModificacao'>) => {
    const novoTema: Tema = {
      ...tema,
      id: `tema-${Date.now()}`,
      personalizado: true,
      dataCreacao: new Date().toISOString(),
      ultimaModificacao: new Date().toISOString(),
      versao: '1.0.0'
    };
    
    setTemas(prev => [...prev, novoTema]);
    return novoTema;
  }, [setTemas]);

  // Atualizar tema
  const atualizarTema = useCallback((temaId: string, atualizacoes: Partial<Tema>) => {
    setTemas(prev => prev.map(tema => 
      tema.id === temaId 
        ? { ...tema, ...atualizacoes, ultimaModificacao: new Date().toISOString() }
        : tema
    ));
  }, [setTemas]);

  // Excluir tema
  const excluirTema = useCallback((temaId: string) => {
    setTemas(prev => prev.filter(tema => tema.id !== temaId));
    
    if (temaAtivo === temaId) {
      alterarTema('padrao');
    }
  }, [setTemas, temaAtivo, alterarTema]);

  // Duplicar tema
  const duplicarTema = useCallback((temaId: string) => {
    const tema = todosOsTemas.find(t => t.id === temaId);
    if (!tema) return null;
    
    return criarTema({
      ...tema,
      nome: `${tema.nome} (Cópia)`,
      categoria: 'personalizado'
    });
  }, [todosOsTemas, criarTema]);

  // Favoritar tema
  const alternarFavorito = useCallback((temaId: string) => {
    atualizarTema(temaId, { favorito: !todosOsTemas.find(t => t.id === temaId)?.favorito });
  }, [atualizarTema, todosOsTemas]);

  // Exportar tema
  const exportarTema = useCallback((temaId: string) => {
    const tema = todosOsTemas.find(t => t.id === temaId);
    if (!tema) return;
    
    const dadosExportacao = {
      tema,
      versaoExportacao: '1.0.0',
      dataExportacao: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dadosExportacao, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tema-${tema.nome.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }, [todosOsTemas]);

  // Importar tema
  const importarTema = useCallback(async (arquivo: File) => {
    try {
      const texto = await arquivo.text();
      const dados = JSON.parse(texto);
      
      if (dados.tema && typeof dados.tema === 'object') {
        const temaImportado = {
          ...dados.tema,
          id: `tema-${Date.now()}`,
          personalizado: true,
          dataCreacao: new Date().toISOString(),
          ultimaModificacao: new Date().toISOString()
        };
        
        setTemas(prev => [...prev, temaImportado]);
        return temaImportado;
      }
    } catch (error) {
      console.error('Erro ao importar tema:', error);
      throw new Error('Arquivo de tema inválido');
    }
  }, [setTemas]);

  // Atualizar configuração
  const atualizarConfiguracao = useCallback((novaConfiguracao: Partial<ConfiguracaoTema>) => {
    setConfiguracao(prev => ({ ...prev, ...novaConfiguracao }));
  }, [setConfiguracao]);

  // Atualizar configuração de acessibilidade
  const atualizarConfiguracaoAcessibilidade = useCallback((configuracaoAcess: Partial<ConfiguracaoTema>) => {
    atualizarConfiguracao(configuracaoAcess);
    
    // Aplicar imediatamente ao tema atual
    if (temaAtual) {
      aplicarTema(temaAtual);
    }
  }, [atualizarConfiguracao, temaAtual, aplicarTema]);

  // Sincronizar com dispositivos
  const sincronizarDispositivos = useCallback(async () => {
    if (!configuracao.sincronizarDispositivos) return;
    
    const dadosSincronizacao = {
      configuracao,
      temas,
      temaAtivo,
      timestamp: new Date().toISOString()
    };
    
    // Simular sincronização (implementar com API real)
    localStorage.setItem('sync-dados', JSON.stringify(dadosSincronizacao));
    
    return dadosSincronizacao;
  }, [configuracao, temas, temaAtivo]);

  // Restaurar de sincronização
  const restaurarSincronizacao = useCallback(async () => {
    try {
      const dadosSalvos = localStorage.getItem('sync-dados');
      if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        
        setConfiguracao(dados.configuracao);
        setTemas(dados.temas);
        alterarTema(dados.temaAtivo);
        
        return true;
      }
    } catch (error) {
      console.error('Erro ao restaurar sincronização:', error);
    }
    
    return false;
  }, [setConfiguracao, setTemas, alterarTema]);

  // Sincronizar temaAtivo com configuração
  useEffect(() => {
    if (configuracao.temaAtivo !== temaAtivo) {
      setTemaAtivo(configuracao.temaAtivo);
    }
  }, [configuracao.temaAtivo]);

  // Escutar mudanças do sistema básico de temas
  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      const { temaId } = event.detail;
      if (temaId && temaId !== temaAtivo) {
        alterarTema(temaId);
      }
    };

    window.addEventListener('themeChange', handleThemeChange as EventListener);
    
    return () => {
      window.removeEventListener('themeChange', handleThemeChange as EventListener);
    };
  }, [temaAtivo, alterarTema]);

  // Inicialização
  useEffect(() => {
    console.log('🎨 Inicializando sistema de temas...');
    console.log('🎨 Tema atual:', temaAtual?.nome, 'ID:', temaAtual?.id);
    console.log('🎨 Configuração:', configuracao);
    
    // Aplicar tema inicial
    if (temaAtual) {
      console.log('🎨 Aplicando tema inicial:', temaAtual.nome);
      aplicarTema(temaAtual);
    }
    
    // Configurar temas sazonais se não existirem
    if (temasSazonais.length === 0) {
      setTemasSazonais(temasSazonaisPredefinidos);
    }
    
    // Verificar tema automático
    aplicarTemaAutomatico();
    verificarTemasSazonais();
    
    // Configurar intervalos
    const intervalTemaAutomatico = setInterval(aplicarTemaAutomatico, 60000); // Verificar a cada minuto
    const intervalTemaSazonal = setInterval(verificarTemasSazonais, 3600000); // Verificar a cada hora
    
    return () => {
      clearInterval(intervalTemaAutomatico);
      clearInterval(intervalTemaSazonal);
    };
  }, [temaAtual, aplicarTema, aplicarTemaAutomatico, verificarTemasSazonais]);

  return {
    // Estados
    temas: todosOsTemas,
    temaAtual,
    temaAtivo,
    configuracao,
    temasSazonais,
    dispositivosSincronizados,
    modoEscuroSistema,
    preferenciaAcessibilidade,
    
    // Ações
    alterarTema,
    criarTema,
    atualizarTema,
    excluirTema,
    duplicarTema,
    alternarFavorito,
    exportarTema,
    importarTema,
    atualizarConfiguracao,
    atualizarConfiguracaoAcessibilidade,
    aplicarTema,
    sincronizarDispositivos,
    restaurarSincronizacao,
    
    // Utilitários
    aplicarTemaAutomatico,
    verificarTemasSazonais
  };
};