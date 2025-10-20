import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Heart,
  Download,
  Eye,
  Palette,
  Sparkles,
  TrendingUp,
  Clock,
  User,
  Tag,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Share2,
  Copy,
  Edit3,
  Trash2
} from 'lucide-react';
import { TemaAvancado, CategoriasTema, FiltrosTema } from '../types/temas';
import { AnimatedContainer, AnimatedItem } from './AnimatedContainer';
import { AnimatedButton } from './AnimatedButton';

interface GaleriaTemasProps {
  temas: TemaAvancado[];
  temaAtivo: string;
  onSelecionarTema: (temaId: string) => void;
  onEditarTema: (tema: TemaAvancado) => void;
  onDeletarTema: (temaId: string) => void;
  onFavoritarTema: (temaId: string) => void;
  onCompartilharTema: (tema: TemaAvancado) => void;
  onDuplicarTema: (tema: TemaAvancado) => void;
}

const categorias: { valor: CategoriasTema | 'todas'; label: string; icon: any }[] = [
  { valor: 'todas', label: 'Todas', icon: Grid },
  { valor: 'Business', label: 'Negócios', icon: TrendingUp },
  { valor: 'Creative', label: 'Criativo', icon: Sparkles },
  { valor: 'Accessibility', label: 'Acessibilidade', icon: Eye },
  { valor: 'Modern', label: 'Moderno', icon: Palette },
  { valor: 'Classic', label: 'Clássico', icon: Clock },
  { valor: 'Nature', label: 'Natureza', icon: Sparkles },
  { valor: 'Dark', label: 'Escuro', icon: Palette },
  { valor: 'Light', label: 'Claro', icon: Palette },
  { valor: 'Colorful', label: 'Colorido', icon: Palette },
  { valor: 'Minimal', label: 'Minimalista', icon: Palette },
  { valor: 'Professional', label: 'Profissional', icon: TrendingUp },
  { valor: 'Custom', label: 'Personalizado', icon: Edit3 }
];

const opcoesOrdenacao = [
  { valor: 'popularidade', label: 'Popularidade', icon: TrendingUp },
  { valor: 'rating', label: 'Avaliação', icon: Star },
  { valor: 'recente', label: 'Mais Recente', icon: Clock },
  { valor: 'alfabetico', label: 'A-Z', icon: SortAsc },
  { valor: 'nome', label: 'Nome', icon: SortAsc }
];

export const GaleriaTemas: React.FC<GaleriaTemasProps> = ({
  temas,
  temaAtivo,
  onSelecionarTema,
  onEditarTema,
  onDeletarTema,
  onFavoritarTema,
  onCompartilharTema,
  onDuplicarTema
}) => {
  const [filtros, setFiltros] = useState<FiltrosTema>({
    categoria: 'todas',
    busca: '',
    ordenacao: 'popularidade',
    favoritos: false,
    personalizados: false,
    acessibilidade: false
  });

  const [visualizacao, setVisualizacao] = useState<'grid' | 'lista'>('grid');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [temaHover, setTemaHover] = useState<string | null>(null);

  // Filtrar e ordenar temas
  const temasFiltrados = useMemo(() => {
    let resultado = [...temas];

    // Filtro por categoria
    if (filtros.categoria !== 'todas') {
      resultado = resultado.filter(tema => tema.categoria === filtros.categoria);
    }

    // Filtro por busca
    if (filtros.busca) {
      const busca = filtros.busca.toLowerCase();
      resultado = resultado.filter(tema => 
        tema.nome.toLowerCase().includes(busca) ||
        tema.descricao.toLowerCase().includes(busca) ||
        tema.autor?.toLowerCase().includes(busca) ||
        tema.tags?.some(tag => tag.toLowerCase().includes(busca))
      );
    }

    // Filtro por favoritos
    if (filtros.favoritos) {
      resultado = resultado.filter(tema => tema.favorito);
    }

    // Filtro por personalizados
    if (filtros.personalizados) {
      resultado = resultado.filter(tema => tema.personalizado);
    }

    // Filtro por acessibilidade
    if (filtros.acessibilidade) {
      resultado = resultado.filter(tema => tema.acessibilidade.altoContraste);
    }

    // Ordenação
    resultado.sort((a, b) => {
      switch (filtros.ordenacao) {
        case 'popularidade':
          return (b.popularidade || 0) - (a.popularidade || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'recente':
          return new Date(b.ultimaModificacao).getTime() - new Date(a.ultimaModificacao).getTime();
        case 'alfabetico':
        case 'nome':
          return a.nome.localeCompare(b.nome);
        default:
          return 0;
      }
    });

    return resultado;
  }, [temas, filtros]);

  const atualizarFiltro = useCallback((campo: keyof FiltrosTema, valor: any) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  }, []);

  const limparFiltros = useCallback(() => {
    setFiltros({
      categoria: 'todas',
      busca: '',
      ordenacao: 'popularidade',
      favoritos: false,
      personalizados: false,
      acessibilidade: false
    });
  }, []);

  const renderizarEstrelas = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderizarCardTema = (tema: TemaAvancado) => {
    const isAtivo = tema.id === temaAtivo;
    const isHover = temaHover === tema.id;

    return (
      <motion.div
        key={tema.id}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -4 }}
        onHoverStart={() => setTemaHover(tema.id)}
        onHoverEnd={() => setTemaHover(null)}
        className={`
          relative group cursor-pointer rounded-xl overflow-hidden
          transition-all duration-300 transform
          ${isAtivo 
            ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/25' 
            : 'hover:shadow-xl'
          }
          ${visualizacao === 'grid' ? 'aspect-[4/3]' : 'h-24 flex'}
        `}
        style={{
          background: `linear-gradient(135deg, ${tema.cores.fundo} 0%, ${tema.cores.fundoSecundario || tema.cores.superficie} 100%)`
        }}
        onClick={() => onSelecionarTema(tema.id)}
      >
        {/* Preview das cores */}
        <div className={`
          ${visualizacao === 'grid' 
            ? 'absolute inset-0' 
            : 'w-24 h-full flex-shrink-0'
          }
        `}>
          <div className="flex h-full">
            <div 
              className="flex-1" 
              style={{ backgroundColor: tema.cores.primaria }}
            />
            <div 
              className="flex-1" 
              style={{ backgroundColor: tema.cores.secundaria }}
            />
            <div 
              className="flex-1" 
              style={{ backgroundColor: tema.cores.acento }}
            />
            {tema.cores.terciaria && (
              <div 
                className="flex-1" 
                style={{ backgroundColor: tema.cores.terciaria }}
              />
            )}
          </div>
        </div>

        {/* Overlay com informações */}
        <div className={`
          absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
          ${visualizacao === 'grid' ? '' : 'from-black/40'}
        `}>
          <div className={`
            absolute bottom-0 left-0 right-0 p-4 text-white
            ${visualizacao === 'lista' ? 'flex items-center justify-between' : ''}
          `}>
            <div className={visualizacao === 'lista' ? 'flex-1 ml-4' : ''}>
              <h3 className="font-semibold text-sm mb-1 truncate">
                {tema.nome}
              </h3>
              
              {visualizacao === 'grid' && (
                <>
                  <p className="text-xs text-gray-200 mb-2 line-clamp-2">
                    {tema.descricao}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {tema.rating && renderizarEstrelas(tema.rating)}
                      {tema.rating && (
                        <span className="text-xs ml-1">
                          {tema.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1 text-xs">
                      {tema.favorito && (
                        <Heart className="w-3 h-3 text-red-400 fill-current" />
                      )}
                      {tema.personalizado && (
                        <Edit3 className="w-3 h-3 text-blue-400" />
                      )}
                      {tema.acessibilidade.altoContraste && (
                        <Eye className="w-3 h-3 text-green-400" />
                      )}
                    </div>
                  </div>
                </>
              )}

              {visualizacao === 'lista' && (
                <div className="flex items-center space-x-4 text-xs text-gray-300">
                  <span>{tema.categoria}</span>
                  {tema.autor && <span>por {tema.autor}</span>}
                  {tema.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{tema.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Ações rápidas */}
            <AnimatePresence>
              {(isHover || isAtivo) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`
                    flex space-x-1
                    ${visualizacao === 'grid' 
                      ? 'absolute top-2 right-2' 
                      : 'flex-shrink-0'
                    }
                  `}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFavoritarTema(tema.id);
                    }}
                    className="p-1.5 bg-black/20 backdrop-blur-sm rounded-lg hover:bg-black/40 transition-colors"
                  >
                    <Heart className={`w-3 h-3 ${tema.favorito ? 'text-red-400 fill-current' : 'text-white'}`} />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditarTema(tema);
                    }}
                    className="p-1.5 bg-black/20 backdrop-blur-sm rounded-lg hover:bg-black/40 transition-colors"
                  >
                    <Edit3 className="w-3 h-3 text-white" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCompartilharTema(tema);
                    }}
                    className="p-1.5 bg-black/20 backdrop-blur-sm rounded-lg hover:bg-black/40 transition-colors"
                  >
                    <Share2 className="w-3 h-3 text-white" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Indicador de tema ativo */}
        {isAtivo && (
          <div className="absolute top-2 left-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Barra de ferramentas */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Busca */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar temas..."
            value={filtros.busca}
            onChange={(e) => atualizarFiltro('busca', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Controles */}
        <div className="flex items-center space-x-2">
          {/* Filtros rápidos */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => atualizarFiltro('favoritos', !filtros.favoritos)}
              className={`p-2 rounded-lg transition-colors ${
                filtros.favoritos 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Favoritos"
            >
              <Heart className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => atualizarFiltro('personalizados', !filtros.personalizados)}
              className={`p-2 rounded-lg transition-colors ${
                filtros.personalizados 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Personalizados"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => atualizarFiltro('acessibilidade', !filtros.acessibilidade)}
              className={`p-2 rounded-lg transition-colors ${
                filtros.acessibilidade 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Acessibilidade"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Filtros avançados */}
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className={`p-2 rounded-lg transition-colors ${
              mostrarFiltros 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>

          {/* Visualização */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setVisualizacao('grid')}
              className={`p-1.5 rounded transition-colors ${
                visualizacao === 'grid' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setVisualizacao('lista')}
              className={`p-1.5 rounded transition-colors ${
                visualizacao === 'lista' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filtros avançados */}
      <AnimatePresence>
        {mostrarFiltros && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 rounded-lg p-4 space-y-4"
          >
            {/* Categorias */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <div className="flex flex-wrap gap-2">
                {categorias.map(categoria => {
                  const Icon = categoria.icon;
                  return (
                    <button
                      key={categoria.valor}
                      onClick={() => atualizarFiltro('categoria', categoria.valor)}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        filtros.categoria === categoria.valor
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{categoria.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ordenação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <div className="flex flex-wrap gap-2">
                {opcoesOrdenacao.map(opcao => {
                  const Icon = opcao.icon;
                  return (
                    <button
                      key={opcao.valor}
                      onClick={() => atualizarFiltro('ordenacao', opcao.valor)}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        filtros.ordenacao === opcao.valor
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{opcao.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ações */}
            <div className="flex justify-end">
              <button
                onClick={limparFiltros}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resultados */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {temasFiltrados.length} tema{temasFiltrados.length !== 1 ? 's' : ''} encontrado{temasFiltrados.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid/Lista de temas */}
        <AnimatedContainer>
          <motion.div
            layout
            className={`
              ${visualizacao === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
                : 'space-y-2'
              }
            `}
          >
            <AnimatePresence mode="popLayout">
              {temasFiltrados.map(tema => (
                <AnimatedItem key={tema.id}>
                  {renderizarCardTema(tema)}
                </AnimatedItem>
              ))}
            </AnimatePresence>
          </motion.div>
        </AnimatedContainer>

        {/* Estado vazio */}
        {temasFiltrados.length === 0 && (
          <div className="text-center py-12">
            <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum tema encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Tente ajustar os filtros ou criar um novo tema personalizado.
            </p>
            <button
              onClick={limparFiltros}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};