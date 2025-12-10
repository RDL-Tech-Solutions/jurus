/**
 * Card Bancário - Design moderno estilo cartão de crédito real
 */

import React, { memo } from 'react';
import { CreditCard, TrendingUp, AlertCircle } from 'lucide-react';
import { CardWithStats } from '../types';
import { 
  formatCurrency, 
  getBrandInfo, 
  getLimitStatusColor 
} from '../utils/cardHelpers';
import { cn } from '../../../utils/cn';

interface CardItemProps {
  card: CardWithStats;
  onClick?: () => void;
}

export const CardItem: React.FC<CardItemProps> = memo(({ card, onClick }) => {
  const brand = getBrandInfo(card.bandeira);
  const statusColors = getLimitStatusColor(card.statusLimite);
  
  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer group"
    >
      {/* Card Bancário */}
      <div
        className="relative h-52 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${card.cor} 0%, ${card.cor}dd 100%)`
        }}
      >
        {/* Padrão de fundo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
        </div>
        
        {/* Conteúdo do Card */}
        <div className="relative h-full flex flex-col justify-between text-white">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs opacity-80 mb-1">Cartão de Crédito</p>
              <h3 className="text-lg font-bold">{card.nome}</h3>
            </div>
            <div className="text-2xl">{brand.icon}</div>
          </div>
          
          {/* Chip simulado */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-10 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-400 opacity-80" />
            <div className="flex-1">
              <p className="text-xs opacity-70">Limite disponível</p>
              <p className="text-xl font-bold">
                {formatCurrency(card.limiteDisponivel)}
              </p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs opacity-70">Limite total</p>
              <p className="text-sm font-semibold">{formatCurrency(card.limite)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-70">{brand.name}</p>
              <p className="text-xs font-medium">
                {card.diaFechamento}/{card.diaVencimento}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Barra de Uso do Limite */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Limite utilizado</span>
          <span className={cn('font-semibold', statusColors.text)}>
            {card.percentualUtilizado.toFixed(1)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', statusColors.bar)}
            style={{ width: `${Math.min(100, card.percentualUtilizado)}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{formatCurrency(card.limiteUtilizado)} usado</span>
          <span>{formatCurrency(card.limiteDisponivel)} disponível</span>
        </div>
      </div>
      
      {/* Alerta de Limite */}
      {card.statusLimite !== 'healthy' && (
        <div className={cn(
          'mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
          card.statusLimite === 'critical' 
            ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
        )}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>
            {card.statusLimite === 'critical' 
              ? 'Limite quase esgotado!' 
              : 'Atenção ao limite'}
          </span>
        </div>
      )}
      
      {/* Fatura Atual */}
      {card.faturaAtual && card.faturaAtual.total > 0 && (
        <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
              Fatura Atual
            </span>
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
            {formatCurrency(card.faturaAtual.total)}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Vence em {new Date(card.faturaAtual.dataVencimento).toLocaleDateString('pt-BR')}
          </p>
        </div>
      )}
    </div>
  );
});

CardItem.displayName = 'CardItem';
