import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  User, 
  Calendar,
  Share2,
  Bookmark,
  BookmarkCheck,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Target,
  TrendingUp,
  DollarSign,
  PieChart
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: Date;
  readTime: number;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  likes: number;
  views: number;
  isBookmarked: boolean;
  relatedArticles: string[];
}

interface ArticleViewerProps {
  article: Article;
  onBookmark?: (articleId: string) => void;
  onLike?: (articleId: string) => void;
  onShare?: (articleId: string) => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  hasNavigation?: boolean;
}

const mockArticle: Article = {
  id: '1',
  title: 'Como Começar a Investir: Guia Completo para Iniciantes',
  content: `
# Como Começar a Investir: Guia Completo para Iniciantes

Investir pode parecer intimidante no início, mas com o conhecimento certo e uma estratégia bem definida, qualquer pessoa pode começar a construir patrimônio através dos investimentos.

## Por que Investir?

Investir é fundamental para:
- **Proteção contra a inflação**: Manter o poder de compra do seu dinheiro
- **Crescimento patrimonial**: Fazer seu dinheiro trabalhar para você
- **Realização de objetivos**: Aposentadoria, casa própria, educação dos filhos
- **Independência financeira**: Reduzir a dependência de renda ativa

## Primeiros Passos

### 1. Organize suas Finanças
Antes de investir, é essencial ter:
- Reserva de emergência (6 a 12 meses de gastos)
- Controle das despesas mensais
- Quitação de dívidas com juros altos

### 2. Defina seus Objetivos
Estabeleça metas claras:
- **Curto prazo** (até 2 anos): Viagem, curso, equipamentos
- **Médio prazo** (2 a 10 anos): Casa própria, carro, casamento
- **Longo prazo** (mais de 10 anos): Aposentadoria, educação dos filhos

### 3. Conheça seu Perfil de Risco
- **Conservador**: Prioriza segurança, aceita rentabilidade menor
- **Moderado**: Equilibra segurança e rentabilidade
- **Arrojado**: Aceita maior risco em busca de maior retorno

## Tipos de Investimentos

### Renda Fixa
Investimentos com rentabilidade previsível:
- **Poupança**: Mais segura, mas com baixa rentabilidade
- **CDB**: Certificado de Depósito Bancário
- **Tesouro Direto**: Títulos públicos do governo
- **LCI/LCA**: Isentos de Imposto de Renda

### Renda Variável
Investimentos com rentabilidade variável:
- **Ações**: Participação em empresas
- **Fundos de Investimento**: Gestão profissional
- **ETFs**: Fundos que replicam índices
- **REITs**: Fundos Imobiliários

## Como Começar

### 1. Abra uma Conta em Corretora
Escolha uma corretora confiável considerando:
- Taxas e custos
- Plataforma de investimento
- Atendimento ao cliente
- Variedade de produtos

### 2. Comece Pequeno
- Inicie com valores baixos
- Diversifique gradualmente
- Aprenda com a experiência
- Aumente os aportes conforme a confiança

### 3. Estude Continuamente
- Leia livros sobre investimentos
- Acompanhe notícias econômicas
- Participe de cursos e webinars
- Consulte profissionais qualificados

## Erros Comuns a Evitar

1. **Não ter reserva de emergência**
2. **Investir sem objetivos claros**
3. **Colocar todos os ovos na mesma cesta**
4. **Tomar decisões baseadas em emoções**
5. **Não diversificar adequadamente**
6. **Ignorar taxas e impostos**

## Dicas Importantes

- **Comece hoje**: O tempo é seu maior aliado
- **Seja consistente**: Aportes regulares fazem diferença
- **Mantenha a disciplina**: Não se deixe levar por modismos
- **Revise periodicamente**: Ajuste sua estratégia conforme necessário

## Conclusão

Investir é uma jornada de aprendizado contínuo. Comece com o básico, mantenha-se informado e seja paciente. Lembre-se: não existe investimento perfeito, mas existe o investimento adequado para cada perfil e objetivo.

O importante é dar o primeiro passo e manter a consistência. Com o tempo e conhecimento, você desenvolverá confiança para tomar decisões mais complexas e construir um patrimônio sólido.
  `,
  author: 'Maria Silva',
  publishDate: new Date('2024-01-15'),
  readTime: 8,
  category: 'Investimentos',
  tags: ['iniciantes', 'investimentos', 'renda fixa', 'renda variável', 'planejamento'],
  difficulty: 'beginner',
  likes: 245,
  views: 1520,
  isBookmarked: false,
  relatedArticles: ['2', '3', '4']
};

const ArticleViewer: React.FC<ArticleViewerProps> = ({
  article = mockArticle,
  onBookmark,
  onLike,
  onShare,
  onNavigate,
  hasNavigation = true
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(article.isBookmarked);
  const [readingProgress, setReadingProgress] = useState(0);
  const [estimatedTimeLeft, setEstimatedTimeLeft] = useState(article.readTime);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
      
      // Calculate estimated time left based on reading progress
      const timeLeft = Math.max(0, Math.ceil(article.readTime * (1 - progress / 100)));
      setEstimatedTimeLeft(timeLeft);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article.readTime]);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(article.id);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(article.id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: `Confira este artigo: ${article.title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
    onShare?.(article.id);
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

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'investimentos': return TrendingUp;
      case 'planejamento': return Target;
      case 'economia': return DollarSign;
      case 'análise': return PieChart;
      default: return BookOpen;
    }
  };

  const CategoryIcon = getCategoryIcon(article.category);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
        <motion.div
          className="h-full bg-blue-500"
          style={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Navigation */}
      {hasNavigation && (
        <div className="flex justify-between items-center mb-6">
          <motion.button
            onClick={() => onNavigate?.('prev')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5" />
            Artigo Anterior
          </motion.button>

          <motion.button
            onClick={() => onNavigate?.('next')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Próximo Artigo
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      )}

      {/* Article Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <CategoryIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {article.category}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(article.difficulty)}`}>
            {getDifficultyLabel(article.difficulty)}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{article.publishDate.toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{estimatedTimeLeft} min restantes</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{article.views.toLocaleString()} visualizações</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isLiked 
                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{article.likes + (isLiked ? 1 : 0)}</span>
          </motion.button>

          <motion.button
            onClick={handleBookmark}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isBookmarked 
                ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            <span>{isBookmarked ? 'Salvo' : 'Salvar'}</span>
          </motion.button>

          <motion.button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 className="w-4 h-4" />
            <span>Compartilhar</span>
          </motion.button>

          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Comentários</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Article Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8"
      >
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {article.content.split('\n').map((paragraph, index) => {
            if (paragraph.startsWith('# ')) {
              return (
                <h1 key={index} className="text-3xl font-bold text-gray-900 dark:text-white mb-6 mt-8">
                  {paragraph.substring(2)}
                </h1>
              );
            }
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 mt-6">
                  {paragraph.substring(3)}
                </h2>
              );
            }
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-4">
                  {paragraph.substring(4)}
                </h3>
              );
            }
            if (paragraph.startsWith('- **')) {
              const match = paragraph.match(/- \*\*(.*?)\*\*: (.*)/);
              if (match) {
                return (
                  <li key={index} className="mb-2">
                    <strong className="text-gray-900 dark:text-white">{match[1]}</strong>: {match[2]}
                  </li>
                );
              }
            }
            if (paragraph.startsWith('- ')) {
              return (
                <li key={index} className="mb-1 text-gray-700 dark:text-gray-300">
                  {paragraph.substring(2)}
                </li>
              );
            }
            if (paragraph.trim() === '') {
              return <br key={index} />;
            }
            return (
              <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>
      </motion.div>

      {/* Related Articles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Artigos Relacionados
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { id: '2', title: 'Diversificação de Investimentos: Como Reduzir Riscos', readTime: 6 },
            { id: '3', title: 'Tesouro Direto: Guia Completo para Iniciantes', readTime: 5 },
            { id: '4', title: 'Como Montar uma Carteira de Investimentos', readTime: 7 }
          ].map((relatedArticle) => (
            <motion.div
              key={relatedArticle.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                {relatedArticle.title}
              </h4>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{relatedArticle.readTime} min de leitura</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ArticleViewer;