/**
 * Gerenciador de Cartões - Componente Principal
 * Integra todos os subcomponentes
 */

import React, { memo, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useCards } from '../hooks/useCards';
import { CardSummary } from './CardSummary';
import { CardList } from './CardList';
import { CardDetailsModal } from './CardDetailsModal';
import { AddExpenseModal, ExpenseData } from './AddExpenseModal';
import { CardWithStats } from '../types';
import { ExportButton, ExportModal } from '../../export/components';
import { useExport } from '../../export/hooks/useExport';

interface CardsManagerProps {
  onAddCard?: () => void;
  onEditCard?: (cardId: string) => void;
  onDeleteCard?: (cardId: string) => void;
  onAddExpense?: (cardId: string) => void;
}

export const CardsManager: React.FC<CardsManagerProps> = memo(({
  onAddCard,
  onEditCard,
  onDeleteCard,
  onAddExpense
}) => {
  const {
    cardsWithStats,
    activeCards,
    summary,
    excluirCartao,
    adicionarGasto
  } = useCards();
  
  const [selectedCard, setSelectedCard] = useState<CardWithStats | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseCardId, setExpenseCardId] = useState<string | null>(null);
  const { exportData, isExporting } = useExport();
  const [showExportModal, setShowExportModal] = useState(false);

  const handleExportCards = useCallback(async (config: any) => {
    const formatarMoeda = (valor: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valor);
    };

    // Formatar dados para exportação
    const cartoesData = {
      summary: {
        title: 'Relatório de Cartões de Crédito',
        description: `Total: ${cardsWithStats.length} cartões | Limite Total: ${formatarMoeda(summary.totalLimit)}`
      },
      tables: [
        {
          title: 'Cartões de Crédito',
          headers: ['Nome', 'Limite', 'Utilizado', 'Disponível', 'Percentual'],
          rows: cardsWithStats.map(c => [
            c.nome,
            formatarMoeda(c.limite),
            formatarMoeda(c.limiteUtilizado),
            formatarMoeda(c.limiteDisponivel),
            `${c.percentualUtilizado.toFixed(1)}%`
          ])
        }
      ],
      sheets: [
        {
          name: 'Cartões',
          json: cardsWithStats.map(c => ({
            Nome: c.nome,
            Limite: c.limite,
            Utilizado: c.limiteUtilizado,
            Disponível: c.limiteDisponivel,
            'Percentual Utilizado': `${c.percentualUtilizado.toFixed(1)}%`,
            'Dia Fechamento': c.diaFechamento,
            'Dia Vencimento': c.diaVencimento,
            Status: c.statusLimite
          }))
        }
      ],
      headers: ['Nome', 'Limite', 'Utilizado', 'Disponível'],
      rows: cardsWithStats.map(c => [
        c.nome,
        c.limite,
        c.limiteUtilizado,
        c.limiteDisponivel
      ])
    };
    await exportData('cartoes', cartoesData, config.format, config);
  }, [exportData, cardsWithStats, summary]);
  
  const handleCardClick = useCallback((card: CardWithStats) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  }, []);
  
  const handleEdit = useCallback((cardId: string) => {
    onEditCard?.(cardId);
  }, [onEditCard]);
  
  const handleDelete = useCallback((cardId: string) => {
    excluirCartao(cardId);
    onDeleteCard?.(cardId);
  }, [excluirCartao, onDeleteCard]);
  
  const handleAddExpense = useCallback((cardId: string) => {
    setExpenseCardId(cardId);
    setIsExpenseModalOpen(true);
    setIsModalOpen(false); // Fecha o modal de detalhes
  }, []);
  
  const handleSaveExpense = useCallback((expense: ExpenseData) => {
    adicionarGasto({
      cartaoId: expense.cartaoId,
      descricao: expense.descricao,
      valor: expense.valor,
      data: expense.data,
      parcelas: expense.parcelas,
      categoriaId: expense.categoria || 'outros'
    });
    onAddExpense?.(expense.cartaoId);
  }, [adicionarGasto, onAddExpense]);
  
  return (
    <div className="space-y-6">
      {/* Header com Botão */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Cartões de Crédito
        </h1>
        <div className="flex items-center gap-2">
          <ExportButton
            onClick={() => setShowExportModal(true)}
            label="Exportar"
            variant="outline"
            size="md"
            loading={isExporting}
          />
          {onAddCard && (
            <button
              onClick={onAddCard}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Cartão</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Dashboard de Resumo */}
      <CardSummary summary={summary} />
      
      {/* Lista de Cartões */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Meus Cartões
        </h2>
        <CardList
          cards={activeCards}
          onCardClick={handleCardClick}
        />
      </div>
      
      {/* Modal de Detalhes */}
      <CardDetailsModal
        card={selectedCard}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCard(null);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddExpense={handleAddExpense}
      />
      
      {/* Modal de Adicionar Gasto */}
      <AddExpenseModal
        cardId={expenseCardId}
        cardName={activeCards.find(c => c.id === expenseCardId)?.nome || ''}
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setExpenseCardId(null);
        }}
        onSave={handleSaveExpense}
      />
      
      {/* Modal de Exportação */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExportCards}
        reportType="cartoes"
        title="Exportar Cartões de Crédito"
      />
    </div>
  );
});

CardsManager.displayName = 'CardsManager';
