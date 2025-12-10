/**
 * Lista de Cartões - Grid otimizado
 */

import React, { memo } from 'react';
import { CardWithStats } from '../types';
import { CardItem } from './CardItem';

interface CardListProps {
  cards: CardWithStats[];
  onCardClick: (card: CardWithStats) => void;
}

export const CardList: React.FC<CardListProps> = memo(({ cards, onCardClick }) => {
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <span className="text-3xl">💳</span>
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          Nenhum cartão cadastrado
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Adicione um cartão para começar
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map(card => (
        <CardItem
          key={card.id}
          card={card}
          onClick={() => onCardClick(card)}
        />
      ))}
    </div>
  );
});

CardList.displayName = 'CardList';
