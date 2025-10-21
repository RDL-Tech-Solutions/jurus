import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Download,
  Share2,
  Bookmark,
  BookmarkCheck,
  ThumbsUp,
  MessageCircle,
  Clock,
  User,
  Calendar,
  Eye,
  Headphones,
  Mic,
  Radio,
  Music
} from 'lucide-react';

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  coverImageUrl: string;
  duration: number;
  host: string;
  guests?: string[];
  publishDate: Date;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  likes: number;
  listens: number;
  isBookmarked: boolean;
  chapters: {
    time: number;
    title: string;
    description?: string;
  }[];
  transcript?: string;
  relatedEpisodes: string[];
}

interface PodcastPlayerProps {
  episode: PodcastEpisode;
  onBookmark?: (episodeId: string) => void;
  onLike?: (episodeId: string) => void;
  onShare?: (episodeId: string) => void;
  onProgress?: (progress: number) => void;
  autoPlay?: boolean;
}

const mockEpisode: PodcastEpisode = {
  id: '1',
  title: 'Planejamento Financeiro Pessoal: Como Organizar suas Finanças',
  description: `Neste episódio, conversamos sobre a importância do planejamento financeiro pessoal e como você pode organizar suas finanças de forma eficiente. Discutimos estratégias práticas para controle de gastos, criação de orçamento e estabelecimento de metas financeiras.

Tópicos abordados:
• Importância do planejamento financeiro
• Como criar um orçamento eficiente
• Estratégias para controle de gastos
• Estabelecimento de metas financeiras
• Ferramentas úteis para organização
• Dicas práticas para o dia a dia

Este episódio é ideal para quem quer começar a organizar melhor suas finanças pessoais e criar um plano sólido para o futuro.`,
  audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder
  coverImageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=financial%20podcast%20cover%20art%20with%20microphone%20and%20money%20symbols&image_size=square',
  duration: 2400, // 40 minutes
  host: 'Ana Financeira',
  guests: ['Carlos Planejador', 'Maria Consultora'],
  publishDate: new Date('2024-01-25'),
  category: 'Planejamento',
  tags: ['planejamento', 'orçamento', 'controle de gastos', 'metas financeiras'],
  difficulty: 'beginner',
  likes: 189,
  listens: 1340,
  isBookmarked: false,
  chapters: [
    { time: 0, title: 'Introdução', description: 'Apresentação do episódio e convidados' },
    { time: 180, title: 'Importância do Planejamento', description: 'Por que planejar é fundamental' },
    { time: 480, title: 'Criando um Orçamento', description: 'Passo a passo para criar seu orçamento' },
    { time: 960, title: 'Controle de Gastos', description: 'Estratégias para controlar despesas' },
    { time: 1440, title: 'Metas Financeiras', description: 'Como estabelecer e alcançar objetivos' },
    { time: 1920, title: 'Ferramentas Úteis', description: 'Apps e planilhas recomendados' },
    { time: 2160, title: 'Dicas Práticas', description: 'Conselhos para implementar no dia a dia' }
  ],
  transcript: `[00:00] Ana: Bem-vindos ao nosso podcast sobre educação financeira...
[00:15] Carlos: Obrigado por me convidar, Ana. É um prazer estar aqui...
[00:30] Maria: Vamos falar sobre um tema muito importante hoje...`,
  relatedEpisodes: ['2', '3', '4']
};

const PodcastPlayer: React.FC<PodcastPlayerProps> = ({
  episode = mockEpisode,
  onBookmark,
  onLike,
  onShare,
  onProgress,
  autoPlay = false
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(episode.isBookmarked);
  const [activeChapter, setActiveChapter] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const updateTime = () => {
      setCurrentTime(audioElement.currentTime);
      onProgress?.(audioElement.currentTime / audioElement.duration);
      
      // Update active chapter
      const currentChapter = episode.chapters.findIndex((chapter, index) => {
        const nextChapter = episode.chapters[index + 1];
        return audioElement.currentTime >= chapter.time && 
               (!nextChapter || audioElement.currentTime < nextChapter.time);
      });
      setActiveChapter(Math.max(0, currentChapter));
    };

    const updateDuration = () => {
      setDuration(audioElement.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audioElement.addEventListener('timeupdate', updateTime);
    audioElement.addEventListener('loadedmetadata', updateDuration);
    audioElement.addEventListener('ended', handleEnded);

    return () => {
      audioElement.removeEventListener('timeupdate', updateTime);
      audioElement.removeEventListener('loadedmetadata', updateDuration);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, [episode.chapters, onProgress]);

  const togglePlay = () => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    
    audioElement.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (newVolume: number) => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    
    audioElement.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    
    if (isMuted) {
      audioElement.volume = volume;
      setIsMuted(false);
    } else {
      audioElement.volume = 0;
      setIsMuted(true);
    }
  };

  const skipTime = (seconds: number) => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    handleSeek(newTime);
  };

  const changePlaybackRate = (rate: number) => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    
    audioElement.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const jumpToChapter = (chapterTime: number) => {
    handleSeek(chapterTime);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(episode.id);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(episode.id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: episode.title,
        text: `Confira este podcast: ${episode.title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    onShare?.(episode.id);
  };

  const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        autoPlay={autoPlay}
        preload="metadata"
      >
        <source src={episode.audioUrl} type="audio/mpeg" />
        Seu navegador não suporta o elemento de áudio.
      </audio>

      {/* Player Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-8 text-white"
      >
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
            <img
              src={episode.coverImageUrl}
              alt={episode.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Radio className="w-6 h-6" />
              </div>
              <span className="font-medium">Podcast</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white/20`}>
                {getDifficultyLabel(episode.difficulty)}
              </span>
            </div>
            
            <h1 className="text-2xl font-bold mb-3">
              {episode.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm opacity-90 mb-4">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                <span>{episode.host}</span>
              </div>
              {episode.guests && episode.guests.length > 0 && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{episode.guests.join(', ')}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{episode.publishDate.toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(episode.duration / 60)} min</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4" />
                <span>{episode.listens.toLocaleString()} reproduções</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {episode.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/20 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Player Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
      >
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer">
            <div
              className="absolute h-full bg-purple-500 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-6 mb-6">
          {/* Rewind 30s */}
          <motion.button
            onClick={() => skipTime(-30)}
            className="p-3 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <RotateCcw className="w-6 h-6" />
          </motion.button>

          {/* Skip Back 15s */}
          <motion.button
            onClick={() => skipTime(-15)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <SkipBack className="w-5 h-5" />
          </motion.button>

          {/* Play/Pause */}
          <motion.button
            onClick={togglePlay}
            className="p-4 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </motion.button>

          {/* Skip Forward 15s */}
          <motion.button
            onClick={() => skipTime(15)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <SkipForward className="w-5 h-5" />
          </motion.button>

          {/* Forward 30s */}
          <motion.button
            onClick={() => skipTime(30)}
            className="p-3 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <RotateCw className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-20"
              />
            </div>

            {/* Playback Speed */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Velocidade:</span>
              <select
                value={playbackRate}
                onChange={(e) => changePlaybackRate(Number(e.target.value))}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={handleLike}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isLiked 
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{episode.likes + (isLiked ? 1 : 0)}</span>
            </motion.button>

            <motion.button
              onClick={handleBookmark}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked 
                  ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </motion.button>

            <motion.button
              onClick={handleShare}
              className="p-2 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-4 h-4" />
            </motion.button>

            <motion.button
              className="p-2 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Episode Info */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Sobre este episódio
            </h2>
            
            <div className="prose dark:prose-invert max-w-none">
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {episode.description}
              </div>
            </div>
          </motion.div>

          {/* Transcript */}
          {episode.transcript && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
            >
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="flex items-center justify-between w-full text-left mb-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Transcrição
                </h3>
                <motion.div
                  animate={{ rotate: showTranscript ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <SkipForward className="w-5 h-5 text-gray-500 rotate-90" />
                </motion.div>
              </button>

              <motion.div
                initial={false}
                animate={{ height: showTranscript ? 'auto' : 0, opacity: showTranscript ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="max-h-96 overflow-y-auto text-sm text-gray-700 dark:text-gray-300 font-mono">
                  {episode.transcript}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Comments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Comentários
              </h3>
            </div>
            
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              Sistema de comentários será implementado em breve
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Chapters */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Capítulos
            </h3>
            
            <div className="space-y-2">
              {episode.chapters.map((chapter, index) => (
                <button
                  key={index}
                  onClick={() => jumpToChapter(chapter.time)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeChapter === index
                      ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">{chapter.title}</span>
                    <span className="text-sm text-gray-500">
                      {formatTime(chapter.time)}
                    </span>
                  </div>
                  {chapter.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {chapter.description}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Related Episodes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Episódios Relacionados
            </h3>
            
            <div className="space-y-4">
              {[
                { id: '2', title: 'Investimentos para Aposentadoria', duration: 2100 },
                { id: '3', title: 'Como Sair das Dívidas', duration: 1800 },
                { id: '4', title: 'Educação Financeira para Jovens', duration: 2700 }
              ].map((relatedEpisode) => (
                <motion.div
                  key={relatedEpisode.id}
                  className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                      {relatedEpisode.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{Math.floor(relatedEpisode.duration / 60)} min</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PodcastPlayer;