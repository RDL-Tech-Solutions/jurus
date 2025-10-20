// Tipos e interfaces avançadas para o sistema de temas

export type CategoriasTema = 
  | 'Business' 
  | 'Creative' 
  | 'Accessibility' 
  | 'Modern' 
  | 'Classic' 
  | 'Nature' 
  | 'Dark' 
  | 'Light' 
  | 'Colorful' 
  | 'Minimal' 
  | 'Professional' 
  | 'Custom';

export type TipoHarmoniaCor = 
  | 'complementary' 
  | 'triadic' 
  | 'analogous' 
  | 'monochromatic' 
  | 'split-complementary' 
  | 'tetradic';

export interface PaletaCores {
  primaria: string;
  secundaria: string;
  terciaria?: string;
  acento: string;
  fundo: string;
  fundoSecundario?: string;
  superficie: string;
  texto: string;
  textoSecundario: string;
  borda: string;
  sucesso: string;
  aviso: string;
  erro: string;
  info: string;
  // Cores adicionais para temas avançados
  destaque?: string;
  sombra?: string;
  overlay?: string;
  gradiente?: {
    inicio: string;
    fim: string;
    direcao?: string;
  };
}

export interface TipografiaAvancada {
  fontePrimaria: string;
  fonteSecundaria: string;
  fonteTitulos?: string;
  fonteMonospace?: string;
  tamanhoBase: string;
  escalaTipografica: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  pesos: {
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
    extrabold: string;
  };
  espacamento: string;
  alturaLinha: {
    tight: string;
    normal: string;
    relaxed: string;
    loose: string;
  };
}

export interface EspacamentoAvancado {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
}

export interface BordasAvancadas {
  raio: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    full: string;
  };
  largura: {
    none: string;
    thin: string;
    normal: string;
    thick: string;
    extra: string;
  };
  estilo: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
}

export interface SombrasAvancadas {
  none: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  // Sombras coloridas
  colored?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface AnimacoesAvancadas {
  duracao: {
    instant: string;
    fast: string;
    normal: string;
    slow: string;
    slower: string;
  };
  easing: {
    linear: string;
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    bounce: string;
    elastic: string;
  };
  habilitadas: boolean;
  reducedMotion: boolean;
  transicoes: {
    all: string;
    colors: string;
    opacity: string;
    shadow: string;
    transform: string;
  };
}

export interface ValidacaoContraste {
  ratio: number;
  nivel: 'AA' | 'AAA' | 'fail';
  recomendacao?: string;
}

export interface TemaAvancado {
  id: string;
  nome: string;
  descricao: string;
  autor?: string;
  categoria: CategoriasTema;
  versao: string;
  
  // Propriedades visuais
  cores: PaletaCores;
  tipografia: TipografiaAvancada;
  espacamento: EspacamentoAvancado;
  bordas: BordasAvancadas;
  sombras: SombrasAvancadas;
  animacoes: AnimacoesAvancadas;
  
  // Metadados
  personalizado: boolean;
  favorito: boolean;
  rating?: number;
  popularidade?: number;
  downloads?: number;
  dataCreacao: string;
  ultimaModificacao: string;
  tags?: string[];
  
  // Configurações avançadas
  modoEscuro?: boolean;
  responsivo: boolean;
  acessibilidade: {
    altoContraste: boolean;
    validacaoContraste: { [key: string]: ValidacaoContraste };
    suporteScreenReader: boolean;
    reducedMotion: boolean;
  };
  
  // Herança e variações
  temaBase?: string;
  variacoes?: string[];
  
  // Configurações de exportação
  exportavel: boolean;
  compartilhavel: boolean;
  
  // CSS customizado
  cssCustomizado?: string;
  
  // Preview
  preview?: {
    imagem?: string;
    componentes?: string[];
  };
}

export interface ConfiguracaoTemaAvancada {
  temaAtivo: string;
  
  // Modo automático
  modoEscuroAutomatico: boolean;
  horarioModoEscuro: { 
    inicio: string; 
    fim: string; 
  };
  sincronizarSistema: boolean;
  
  // Transições e animações
  transicaoSuave: boolean;
  velocidadeTransicao: number;
  animacoesHabilitadas: boolean;
  reducedMotion: boolean;
  
  // Persistência
  salvarPreferencia: boolean;
  backupAutomatico: boolean;
  sincronizarNuvem?: boolean;
  
  // Validação e sugestões
  validacaoContraste: boolean;
  sugestoesCores: boolean;
  alertasAcessibilidade: boolean;
  
  // Preview e desenvolvimento
  previewTempoReal: boolean;
  modoDesenvolvedor: boolean;
  
  // Performance
  otimizacaoPerformance: boolean;
  carregamentoLazy: boolean;
  
  // Marketplace
  atualizacoesAutomaticas: boolean;
  notificacoesNovosTemas: boolean;
}

export interface HistoricoAcao {
  id: string;
  tipo: 'criar' | 'editar' | 'deletar' | 'aplicar' | 'importar' | 'exportar';
  temaId: string;
  temaNome: string;
  timestamp: string;
  detalhes?: any;
  reversivel: boolean;
}

export interface FiltrosTema {
  categoria: CategoriasTema | 'todas';
  busca: string;
  ordenacao: 'nome' | 'popularidade' | 'rating' | 'recente' | 'alfabetico';
  favoritos: boolean;
  personalizados: boolean;
  acessibilidade: boolean;
  tags?: string[];
}

export interface SugestaoHarmonia {
  tipo: TipoHarmoniaCor;
  cores: string[];
  descricao: string;
  adequadoPara: string[];
}

export interface ExportacaoTema {
  formato: 'json' | 'css' | 'scss' | 'tailwind' | 'styled-components';
  incluirMetadados: boolean;
  incluirComentarios: boolean;
  minificar: boolean;
  compatibilidade?: string[];
}

export interface ImportacaoTema {
  origem: 'arquivo' | 'url' | 'codigo' | 'imagem';
  dados: any;
  validacao: {
    valido: boolean;
    erros: string[];
    avisos: string[];
  };
  preview?: TemaAvancado;
}

export interface MarketplaceTema {
  id: string;
  tema: TemaAvancado;
  preco?: number;
  gratuito: boolean;
  licenca: string;
  screenshots: string[];
  demo?: string;
  compatibilidade: string[];
  requisitos: string[];
  changelog?: string;
}

export interface PerfilUsuario {
  id: string;
  nome: string;
  avatar?: string;
  temasPublicados: string[];
  temasFavoritos: string[];
  configuracoes: ConfiguracaoTemaAvancada;
  estatisticas: {
    temasUsados: number;
    temasCriados: number;
    tempoUso: number;
  };
}