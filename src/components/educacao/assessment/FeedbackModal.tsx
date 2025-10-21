import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Lightbulb,
  BookOpen,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Star,
  TrendingUp
} from 'lucide-react';
import { Question, QuestionAnswer } from '../../../types/educacaoFinanceira';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  userAnswer: QuestionAnswer;
  isCorrect: boolean;
  explanation?: string;
  additionalResources?: Array<{
    title: string;
    url: string;
    type: 'article' | 'video' | 'external';
  }>;
  onFeedback?: (helpful: boolean) => void;
  className?: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  question,
  userAnswer,
  isCorrect,
  explanation,
  additionalResources = [],
  onFeedback,
  className = ''
}) => {
  const [feedbackGiven, setFeedbackGiven] = React.useState(false);

  const handleFeedback = (helpful: boolean) => {
    setFeedbackGiven(true);
    onFeedback?.(helpful);
  };

  const getCorrectAnswerText = () => {
    switch (question.type) {
      case 'multiple_choice':
        const correctOption = question.options?.find(opt => opt.isCorrect);
        return correctOption?.text || 'N/A';
      
      case 'multiple_select':
        const correctOptions = question.options?.filter(opt => opt.isCorrect) || [];
        return correctOptions.map(opt => opt.text).join(', ');
      
      case 'true_false':
        return question.correctAnswer.value === 'true' ? 'Verdadeiro' : 'Falso';
      
      case 'numeric':
        return question.correctAnswer.value?.toString() || 'N/A';
      
      case 'text':
        return question.correctAnswer.value?.toString() || 'Resposta modelo disponível';
      
      default:
        return 'N/A';
    }
  };

  const getUserAnswerText = () => {
    switch (question.type) {
      case 'multiple_choice':
        if (typeof userAnswer.value === 'string') {
          const selectedOption = question.options?.find(opt => opt.value === userAnswer.value);
          return selectedOption?.text || userAnswer.value;
        }
        return 'Nenhuma resposta selecionada';
      
      case 'multiple_select':
        if (Array.isArray(userAnswer.value)) {
          const selectedOptions = question.options?.filter(opt => 
            (userAnswer.value as string[]).includes(opt.value)
          ) || [];
          return selectedOptions.map(opt => opt.text).join(', ') || 'Nenhuma resposta selecionada';
        }
        return 'Nenhuma resposta selecionada';
      
      case 'true_false':
        return userAnswer.value === 'true' ? 'Verdadeiro' : 'Falso';
      
      case 'numeric':
      case 'text':
        return userAnswer.value?.toString() || 'Nenhuma resposta fornecida';
      
      default:
        return 'N/A';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <BookOpen className="w-4 h-4" />;
      case 'video':
        return <Star className="w-4 h-4" />;
      case 'external':
        return <ExternalLink className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className={`
              relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl 
              max-w-2xl w-full max-h-[90vh] overflow-y-auto ${className}
            `}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className={`
              p-6 border-b border-gray-200 dark:border-gray-700
              ${isCorrect 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' 
                : 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20'
              }
            `}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isCorrect ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-500" />
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {isCorrect ? 'Resposta Correta!' : 'Resposta Incorreta'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {isCorrect 
                        ? 'Parabéns! Você acertou esta questão.' 
                        : 'Não se preocupe, vamos aprender juntos.'
                      }
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Question */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Pergunta:
                </h3>
                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  {question.text}
                </p>
              </div>

              {/* Answers comparison */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* User answer */}
                <div className={`
                  p-4 rounded-lg border-2
                  ${isCorrect 
                    ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800' 
                    : 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
                  }
                `}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Sua Resposta
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {getUserAnswerText()}
                  </p>
                </div>

                {/* Correct answer */}
                <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Resposta Correta
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {getCorrectAnswerText()}
                  </p>
                </div>
              </div>

              {/* Explanation */}
              {explanation && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-blue-500" />
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Explicação
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {explanation}
                  </p>
                </div>
              )}

              {/* Additional resources */}
              {additionalResources.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-purple-500" />
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Recursos Adicionais
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {additionalResources.map((resource, index) => (
                      <motion.a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-purple-500">
                          {getResourceIcon(resource.type)}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                          {resource.title}
                        </span>
                        <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips for improvement */}
              {!isCorrect && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Dicas para Melhorar
                    </h4>
                  </div>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-1">•</span>
                      <span>Revise o conceito relacionado a esta questão</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-1">•</span>
                      <span>Pratique exercícios similares</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-1">•</span>
                      <span>Consulte os recursos adicionais disponíveis</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* Feedback section */}
              {onFeedback && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle className="w-5 h-5 text-gray-500" />
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Esta explicação foi útil?
                    </h4>
                  </div>
                  
                  {!feedbackGiven ? (
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => handleFeedback(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Sim, foi útil
                      </motion.button>
                      
                      <motion.button
                        onClick={() => handleFeedback(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        Não foi útil
                      </motion.button>
                    </div>
                  ) : (
                    <div className="text-green-600 dark:text-green-400 font-medium">
                      ✓ Obrigado pelo seu feedback!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex justify-end">
                <motion.button
                  onClick={onClose}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Continuar
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;