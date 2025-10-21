import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  Filter,
  Grid,
  List,
  BookOpen,
  Play,
  Headphones,
  Clock,
  User,
  Calendar,
  Eye,
  ThumbsUp,
  Bookmark,
  Star,
  TrendingUp,
  Award,
  Target,
  ChevronDown,
  X,
  SortAsc,
  SortDesc
} from 'lucide-react';

interface ContentItem {
  id: string;
  type: 'article' | 'video' | 'podcast';
  title: string;
  description: string;
  author: string;
  publishDate: Date;
  duration?: number; // in minutes for videos/podcasts
  readTime?: number; // in minutes for articles
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  views: number;
  likes: number;
  rating: number;
  isBookmarked: boolean;
  isFeatured: boolean;
  thumbnailUrl: string;
  contentUrl: string;
}

interface ContentLibraryProps {
  onContentSelect?: (content: ContentItem) => void;
  initialFilter?: {
    type?: string;
    category?: string;
    difficulty?: string;
  };
}

const mockContent: ContentItem[] = [
  {
    id: '1',
    type: 'article',
    title: 'Guia Completo de Planejamento Financeiro Pessoal',
    description: 'Aprenda a organizar suas finanças pessoais com estratégias práticas e eficientes para alcançar seus objetivos financeiros.',
    author: 'Ana Silva',
    publishDate: new Date('2024-01-20'),
    readTime: 12,
    difficulty: 'beginner',
    category: 'Planejamento',
    tags: ['planejamento', 'orçamento', 'metas'],
    views: 2340,
    likes: 189,
    rating: 4.8,
    isBookmarked: false,
    isFeatured: true,
    thumbnailUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=financial%20planning%20guide%20book%20with%20charts%20and%20calculator&image_size=landscape_4_3',
    contentUrl: '/content/article/1'
  },
  {
    id: '2',
    type: 'video',
    title: 'Como Investir na Bolsa de Valores - Curso Completo',
    description: 'Curso completo sobre investimentos em ações, desde conceitos básicos até estratégias avançadas de análise.',
    author: 'Carlos Investidor',
    publishDate: new Date('2024-01-18'),
    duration: 45,
    difficulty: 'intermediate',
    category: 'Investimentos',
    tags: ['ações', 'bolsa', 'análise'],
    views: 5670,
    likes: 423,
    rating: 4.9,
    isBookmarked: true,
    isFeatured: true,
    thumbnailUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=stock%20market%20investment%20course%20with%20charts%20and%20graphs&image_size=landscape_4_3',
    contentUrl: '/content/video/2'
  },
  {
    id: '3',
    type: 'podcast',
    title: 'Educação Financeira para Jovens',
    description: 'Discussão sobre a importância da educação financeira desde cedo e como os jovens podem começar a investir.',
    author: 'Maria Educadora',
    publishDate: new Date('2024-01-15'),
    duration: 32,
    difficulty: 'beginner',
    category: 'Educação',
    tags: ['jovens', 'educação', 'primeiros passos'],
    views: 1890,
    likes: 156,
    rating: 4.7,
    isBookmarked: false,
    isFeatured: false,
    thumbnailUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=young%20people%20learning%20about%20money%20and%20finance&image_size=landscape_4_3',
    contentUrl: '/content/podcast/3'
  },
  {
    id: '4',
    type: 'article',
    title: 'Estratégias Avançadas de Diversificação de Portfólio',
    description: 'Técnicas sofisticadas para diversificar investimentos e reduzir riscos em diferentes cenários econômicos.',
    author: 'Roberto Analista',
    publishDate: new Date('2024-01-12'),
    readTime: 18,
    difficulty: 'advanced',
    category: 'Investimentos',
    tags: ['diversificação', 'portfólio', 'risco'],
    views: 1234,
    likes: 98,
    rating: 4.6,
    isBookmarked: true,
    isFeatured: false,
    thumbnailUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=investment%20portfolio%20diversification%20strategy%20charts&image_size=landscape_4_3',
    contentUrl: '/content/article/4'
  },
  {
    id: '5',
    type: 'video',
    title: 'Criptomoedas: Guia para Iniciantes',
    description: 'Introdução ao mundo das criptomoedas, blockchain e como começar a investir com segurança.',
    author: 'João Crypto',
    publishDate: new Date('2024-01-10'),
    duration: 28,
    difficulty: 'beginner',
    category: 'Criptomoedas',
    tags: ['bitcoin', 'blockchain', 'crypto'],
    views: 3456,
    likes: 267,
    rating: 4.5,
    isBookmarked: false,
    isFeatured: false,
    thumbnailUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=cryptocurrency%20bitcoin%20blockchain%20beginner%20guide&image_size=landscape_4_3',
    contentUrl: '/content/video/5'
  },
  {
    id: '6',
    type: 'podcast',
    title: 'Aposentadoria: Planejando o Futuro',
    description: 'Como planejar uma aposentadoria confortável através de investimentos de longo prazo e previdência.',
    author: 'Sandra Previdência',
    publishDate: new Date('2024-01-08'),
    duration: 41,
    difficulty: 'intermediate',
    category: 'Aposentadoria',
    tags: ['aposentadoria', 'previdência', 'longo prazo'],
    views: 2100,
    likes: 178,
    rating: 4.8,
    isBookmarked: false,
    isFeatured: false,
    thumbnailUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=retirement%20planning%20elderly%20couple%20financial%20security&image_size=landscape_4_3',
    contentUrl: '/content/podcast/6'
  }
];

const categories = [
  'Todos',
  'Planejamento',
  'Investimentos',
  'Educação',
  'Criptomoedas',
  'Aposentadoria'
];

const difficulties = [
  'Todos',
  'Iniciante',
  'Intermediário',
  'Avançado'
];

const sortOptions = [
  { value: 'newest', label: 'Mais Recentes' },
  { value: 'oldest', label: 'Mais Antigos' },
  { value: 'popular', label: 'Mais Populares' },
  { value: 'rating', label: 'Melhor Avaliados' },
  { value: 'title', label: 'Título A-Z' }
];

const ContentLibrary: React.FC<ContentLibraryProps> = ({
  onContentSelect,
  initialFilter = {}
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>(initialFilter.type || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialFilter.category || 'Todos');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(initialFilter.difficulty || 'Todos');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedContent = useMemo(() => {
    let filtered = mockContent.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === 'all' || item.type === selectedType;
      
      const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
      
      const matchesDifficulty = selectedDifficulty === 'Todos' || 
                               (selectedDifficulty === 'Iniciante' && item.difficulty === 'beginner') ||
                               (selectedDifficulty === 'Intermediário' && item.difficulty === 'intermediate') ||
                               (selectedDifficulty === 'Avançado' && item.difficulty === 'advanced');

      return matchesSearch && matchesType && matchesCategory && matchesDifficulty;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.publishDate.getTime() - a.publishDate.getTime();
        case 'oldest':
          return a.publishDate.getTime() - b.publishDate.getTime();
        case 'popular':
          return b.views - a.views;
        case 'rating':
          return b.rating - a.rating;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedType, selectedCategory, selectedDifficulty, sortBy]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return BookOpen;
      case 'video': return Play;
      case 'podcast': return Headphones;
      default: return BookOpen;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'article': return 'Artigo';
      case 'video': return 'Vídeo';
      case 'podcast': return 'Podcast';
      default: return type;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return 'N/A';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedCategory('Todos');
    setSelectedDifficulty('Todos');
    setSortBy('newest');
  };

  const ContentCard: React.FC<{ item: ContentItem; isListView?: boolean }> = ({ 
    item, 
    isListView = false 
  }) => {
    const TypeIcon = getTypeIcon(item.type);
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -4 }}
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden ${
          isListView ? 'flex gap-4' : ''
        }`}
        onClick={() => onContentSelect?.(item)}
      >
        <div className={`relative ${isListView ? 'w-48 flex-shrink-0' : 'w-full h-48'}`}>
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          
          {/* Type Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/70 text-white rounded-lg text-xs font-medium">
            <TypeIcon className="w-3 h-3" />
            <span>{getTypeLabel(item.type)}</span>
          </div>

          {/* Featured Badge */}
          {item.isFeatured && (
            <div className="absolute top-3 right-3 p-1 bg-yellow-500 text-white rounded-lg">
              <Star className="w-3 h-3" />
            </div>
          )}

          {/* Bookmark */}
          {item.isBookmarked && (
            <div className="absolute bottom-3 right-3 p-1 bg-blue-500 text-white rounded-lg">
              <Bookmark className="w-3 h-3" />
            </div>
          )}

          {/* Duration/Read Time */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/70 text-white rounded-lg text-xs">
            <Clock className="w-3 h-3" />
            <span>
              {item.type === 'article' 
                ? `${item.readTime} min leitura`
                : `${item.duration} min`
              }
            </span>
          </div>
        </div>

        <div className={`p-4 ${isListView ? 'flex-1' : ''}`}>
          <div className="flex items-start justify-between mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
              {getDifficultyLabel(item.difficulty)}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{item.rating}</span>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {item.title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {item.description}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{item.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{item.publishDate.toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{item.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" />
                <span>{item.likes}</span>
              </div>
            </div>

            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
              {item.category}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Biblioteca de Conteúdo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Explore artigos, vídeos e podcasts sobre educação financeira
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por título, descrição ou tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
            <motion.div
              animate={{ rotate: showFilters ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>{filteredAndSortedContent.length} resultados</span>
            {(searchTerm || selectedType !== 'all' || selectedCategory !== 'Todos' || selectedDifficulty !== 'Todos') && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-2 py-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Limpar</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tipo de Conteúdo
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="all">Todos os tipos</option>
                      <option value="article">Artigos</option>
                      <option value="video">Vídeos</option>
                      <option value="podcast">Podcasts</option>
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Categoria
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dificuldade
                    </label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {difficulties.map((difficulty) => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Featured Content */}
      {!searchTerm && selectedType === 'all' && selectedCategory === 'Todos' && selectedDifficulty === 'Todos' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Conteúdo em Destaque
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockContent.filter(item => item.isFeatured).map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Content Grid/List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {searchTerm ? 'Resultados da Busca' : 'Todos os Conteúdos'}
        </h2>
        
        <AnimatePresence mode="wait">
          {filteredAndSortedContent.length > 0 ? (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredAndSortedContent.map((item) => (
                <ContentCard 
                  key={item.id} 
                  item={item} 
                  isListView={viewMode === 'list'} 
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhum conteúdo encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Tente ajustar os filtros ou termos de busca
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Limpar Filtros
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContentLibrary;