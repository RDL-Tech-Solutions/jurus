import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Flag,
  Star,
  HelpCircle,
  Calculator,
  Type,
  List,
  ToggleLeft
} from 'lucide-react';
import { Question, QuestionAnswer, QuestionType } from '../../../types/educacaoFinanceira';

interface QuestionCardProps {
  question: Question;
  answer?: QuestionAnswer;
  onAnswerChange: (answer: QuestionAnswer) => void;
  isReviewing?: boolean;
  showCorrectAnswer?: boolean;
  questionNumber: number;
  totalQuestions: number;
  isFlagged?: boolean;
  onToggleFlag?: () => void;
  className?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answer,
  onAnswerChange,
  isReviewing = false,
  showCorrectAnswer = false,
  questionNumber,
  totalQuestions,
  isFlagged = false,
  onToggleFlag,
  className = ''
}) => {
  const [localAnswer, setLocalAnswer] = useState<string | string[]>(() => {
    if (answer?.value) {
      return typeof answer.value === 'number' ? answer.value.toString() : answer.value;
    }
    return question.type === 'multiple_select' ? [] : '';
  });

  const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
      case 'multiple_choice':
        return <List className="w-5 h-5" />;
      case 'multiple_select':
        return <CheckCircle className="w-5 h-5" />;
      case 'true_false':
        return <ToggleLeft className="w-5 h-5" />;
      case 'numeric':
        return <Calculator className="w-5 h-5" />;
      case 'text':
        return <Type className="w-5 h-5" />;
      default:
        return <HelpCircle className="w-5 h-5" />;
    }
  };

  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case 'multiple_choice':
        return 'Múltipla Escolha';
      case 'multiple_select':
        return 'Múltipla Seleção';
      case 'true_false':
        return 'Verdadeiro/Falso';
      case 'numeric':
        return 'Numérica';
      case 'text':
        return 'Texto';
      default:
        return 'Pergunta';
    }
  };

  const handleAnswerChange = (value: string | string[]) => {
    setLocalAnswer(value);
    onAnswerChange({
      type: question.type,
      value
    });
  };

  const isCorrectAnswer = (optionValue: string): boolean => {
    if (!showCorrectAnswer) return false;
    
    if (question.type === 'multiple_select') {
      const correctValues = Array.isArray(question.correctAnswer.value) 
        ? question.correctAnswer.value 
        : [question.correctAnswer.value];
      return correctValues.includes(optionValue);
    }
    
    return question.correctAnswer.value === optionValue;
  };

  const isUserAnswer = (optionValue: string): boolean => {
    if (question.type === 'multiple_select') {
      const userValues = Array.isArray(localAnswer) ? localAnswer : [localAnswer];
      return userValues.includes(optionValue);
    }
    
    return localAnswer === optionValue;
  };

  const getOptionStyle = (optionValue: string) => {
    const isCorrect = isCorrectAnswer(optionValue);
    const isUser = isUserAnswer(optionValue);
    
    if (showCorrectAnswer) {
      if (isCorrect && isUser) {
        return 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
      } else if (isCorrect) {
        return 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
      } else if (isUser) {
        return 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
      }
    } else if (isUser) {
      return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300';
    }
    
    return 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600';
  };

  const renderMultipleChoice = () => (
    <div className="space-y-3">
      {question.options?.map((option, index) => {
        const isSelected = localAnswer === option.value;
        const isCorrect = isCorrectAnswer(option.value);
        const isUser = isUserAnswer(option.value);
        
        return (
          <motion.button
            key={index}
            className={`
              w-full p-4 rounded-lg border-2 text-left transition-all duration-200
              ${getOptionStyle(option.value)}
              ${isReviewing ? 'cursor-default' : 'cursor-pointer hover:scale-[1.02]'}
            `}
            onClick={() => !isReviewing && handleAnswerChange(option.value)}
            whileHover={!isReviewing ? { scale: 1.02 } : {}}
            whileTap={!isReviewing ? { scale: 0.98 } : {}}
            disabled={isReviewing}
          >
            <div className="flex items-center gap-3">
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${isSelected 
                  ? showCorrectAnswer && isCorrect
                    ? 'border-green-500 bg-green-500'
                    : showCorrectAnswer && !isCorrect
                      ? 'border-red-500 bg-red-500'
                      : 'border-blue-500 bg-blue-500'
                  : 'border-gray-300 dark:border-gray-600'
                }
              `}>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              
              <span className="flex-1 font-medium">{option.text}</span>
              
              {showCorrectAnswer && isCorrect && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {showCorrectAnswer && isUser && !isCorrect && (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
            
            {option.explanation && showCorrectAnswer && (isCorrect || isUser) && (
              <div className="mt-2 text-sm opacity-80">
                {option.explanation}
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );

  const renderMultipleSelect = () => (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Selecione todas as opções corretas:
      </p>
      
      {question.options?.map((option, index) => {
        const userValues = Array.isArray(localAnswer) ? localAnswer : [];
        const isSelected = userValues.includes(option.value);
        const isCorrect = isCorrectAnswer(option.value);
        const isUser = isUserAnswer(option.value);
        
        return (
          <motion.button
            key={index}
            className={`
              w-full p-4 rounded-lg border-2 text-left transition-all duration-200
              ${getOptionStyle(option.value)}
              ${isReviewing ? 'cursor-default' : 'cursor-pointer hover:scale-[1.02]'}
            `}
            onClick={() => {
              if (isReviewing) return;
              
              const newValues = [...userValues];
              if (isSelected) {
                const index = newValues.indexOf(option.value);
                newValues.splice(index, 1);
              } else {
                newValues.push(option.value);
              }
              handleAnswerChange(newValues);
            }}
            whileHover={!isReviewing ? { scale: 1.02 } : {}}
            whileTap={!isReviewing ? { scale: 0.98 } : {}}
            disabled={isReviewing}
          >
            <div className="flex items-center gap-3">
              <div className={`
                w-5 h-5 rounded border-2 flex items-center justify-center
                ${isSelected 
                  ? showCorrectAnswer && isCorrect
                    ? 'border-green-500 bg-green-500'
                    : showCorrectAnswer && !isCorrect
                      ? 'border-red-500 bg-red-500'
                      : 'border-blue-500 bg-blue-500'
                  : 'border-gray-300 dark:border-gray-600'
                }
              `}>
                {isSelected && (
                  <CheckCircle className="w-3 h-3 text-white" />
                )}
              </div>
              
              <span className="flex-1 font-medium">{option.text}</span>
              
              {showCorrectAnswer && isCorrect && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {showCorrectAnswer && isUser && !isCorrect && (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
            
            {option.explanation && showCorrectAnswer && (isCorrect || isUser) && (
              <div className="mt-2 text-sm opacity-80">
                {option.explanation}
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );

  const renderTrueFalse = () => (
    <div className="space-y-3">
      {[
        { value: 'true', text: 'Verdadeiro' },
        { value: 'false', text: 'Falso' }
      ].map((option) => {
        const isSelected = localAnswer === option.value;
        const isCorrect = isCorrectAnswer(option.value);
        const isUser = isUserAnswer(option.value);
        
        return (
          <motion.button
            key={option.value}
            className={`
              w-full p-4 rounded-lg border-2 text-left transition-all duration-200
              ${getOptionStyle(option.value)}
              ${isReviewing ? 'cursor-default' : 'cursor-pointer hover:scale-[1.02]'}
            `}
            onClick={() => !isReviewing && handleAnswerChange(option.value)}
            whileHover={!isReviewing ? { scale: 1.02 } : {}}
            whileTap={!isReviewing ? { scale: 0.98 } : {}}
            disabled={isReviewing}
          >
            <div className="flex items-center gap-3">
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${isSelected 
                  ? showCorrectAnswer && isCorrect
                    ? 'border-green-500 bg-green-500'
                    : showCorrectAnswer && !isCorrect
                      ? 'border-red-500 bg-red-500'
                      : 'border-blue-500 bg-blue-500'
                  : 'border-gray-300 dark:border-gray-600'
                }
              `}>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              
              <span className="flex-1 font-medium">{option.text}</span>
              
              {showCorrectAnswer && isCorrect && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {showCorrectAnswer && isUser && !isCorrect && (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );

  const renderNumeric = () => {
    const isCorrect = showCorrectAnswer && answer && 
      Math.abs(parseFloat(answer.value as string) - parseFloat(question.correctAnswer.value as string)) <= (question.tolerance || 0.01);
    
    return (
      <div className="space-y-4">
        <div className="relative">
          <input
            type="number"
            step="any"
            value={localAnswer as string}
            onChange={(e) => handleAnswerChange(e.target.value)}
            disabled={isReviewing}
            placeholder="Digite sua resposta..."
            className={`
              w-full p-4 rounded-lg border-2 text-lg font-medium transition-all duration-200
              ${showCorrectAnswer 
                ? isCorrect
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800'
              }
              ${isReviewing ? 'cursor-default' : ''}
            `}
          />
          
          {question.unit && (
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              {question.unit}
            </span>
          )}
        </div>
        
        {showCorrectAnswer && (
          <div className={`
            p-3 rounded-lg border
            ${isCorrect 
              ? 'border-green-200 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              : 'border-red-200 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            }
          `}>
            <div className="flex items-center gap-2 mb-1">
              {isCorrect ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="font-medium">
                {isCorrect ? 'Correto!' : 'Incorreto'}
              </span>
            </div>
            <p className="text-sm">
              Resposta correta: {question.correctAnswer.value} {question.unit}
              {question.tolerance && ` (±${question.tolerance})`}
            </p>
          </div>
        )}
        
        {question.hint && !showCorrectAnswer && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Dica:</span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              {question.hint}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderText = () => {
    const isCorrect = showCorrectAnswer && answer && 
      (answer.value as string).toLowerCase().trim() === (question.correctAnswer.value as string).toLowerCase().trim();
    
    return (
      <div className="space-y-4">
        <textarea
          value={localAnswer as string}
          onChange={(e) => handleAnswerChange(e.target.value)}
          disabled={isReviewing}
          placeholder="Digite sua resposta..."
          rows={4}
          className={`
            w-full p-4 rounded-lg border-2 resize-none transition-all duration-200
            ${showCorrectAnswer 
              ? isCorrect
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
              : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800'
            }
            ${isReviewing ? 'cursor-default' : ''}
          `}
        />
        
        {showCorrectAnswer && (
          <div className={`
            p-3 rounded-lg border
            ${isCorrect 
              ? 'border-green-200 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              : 'border-red-200 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            }
          `}>
            <div className="flex items-center gap-2 mb-1">
              {isCorrect ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="font-medium">
                {isCorrect ? 'Correto!' : 'Incorreto'}
              </span>
            </div>
            <p className="text-sm">
              Resposta esperada: {question.correctAnswer.value}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderQuestion = () => {
    switch (question.type) {
      case 'multiple_choice':
        return renderMultipleChoice();
      case 'multiple_select':
        return renderMultipleSelect();
      case 'true_false':
        return renderTrueFalse();
      case 'numeric':
        return renderNumeric();
      case 'text':
        return renderText();
      default:
        return <div>Tipo de pergunta não suportado</div>;
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${className}`}>
      {/* Question header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              {getQuestionTypeIcon(question.type)}
              <span className="text-sm font-medium">
                {getQuestionTypeLabel(question.type)}
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">{question.points} pts</span>
            </div>
            
            {question.difficulty && (
              <span className={`
                px-2 py-1 rounded-md text-xs font-medium
                ${question.difficulty === 'easy' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : question.difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                }
              `}>
                {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Médio' : 'Difícil'}
              </span>
            )}
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {question.text}
          </h2>
          
          {question.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {question.description}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {questionNumber}/{totalQuestions}
          </span>
          
          {onToggleFlag && (
            <motion.button
              className={`
                p-2 rounded-lg transition-colors
                ${isFlagged 
                  ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400' 
                  : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                }
              `}
              onClick={onToggleFlag}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Flag className={`w-5 h-5 ${isFlagged ? 'fill-current' : ''}`} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Question content */}
      {question.image && (
        <div className="mb-6">
          <img
            src={question.image}
            alt="Imagem da pergunta"
            className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
          />
        </div>
      )}

      {/* Answer options */}
      <div className="mb-6">
        {renderQuestion()}
      </div>

      {/* Explanation */}
      {question.explanation && showCorrectAnswer && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium">Explicação:</span>
          </div>
          <p className="text-blue-600 dark:text-blue-400 text-sm">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;