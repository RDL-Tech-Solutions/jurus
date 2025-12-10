/**
 * Gerenciador de Categorias - Design Moderno
 * Inspirado em Mobills, Organizze, Meu Dinheiro
 */

import React, { useState, useCallback } from 'react';
import { Plus, TrendingUp, TrendingDown, Tag, Search, Filter } from 'lucide-react';
import { CategoriaFluxo, CATEGORIAS_PADRAO } from '../../../types/fluxoCaixa';
import { CategoryCard } from './CategoryCard';
import { CategoryModal } from './CategoryModal';
import { cn } from '../../../utils/cn';

interface CategoriesManagerProps {
  categories: CategoriaFluxo[];
  onAddCategory: (category: Omit<CategoriaFluxo, 'id'>) => void;
  onEditCategory?: (id: string, data: Partial<CategoriaFluxo>) => void;
  onDeleteCategory: (id: string) => void;
}

export const CategoriesManager: React.FC<CategoriesManagerProps> = ({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoriaFluxo | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'entrada' | 'saida'>('all');

  // Filtrar categorias
  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || cat.tipo === filterType;
    return matchesSearch && matchesType;
  });

  const entriesCategories = filteredCategories.filter(c => c.tipo === 'entrada');
  const expensesCategories = filteredCategories.filter(c => c.tipo === 'saida');

  const handleEdit = useCallback((category: CategoriaFluxo) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    const isDefault = CATEGORIAS_PADRAO.some(c => c.id === id);
    
    if (isDefault) {
      alert('❌ Não é possível excluir categorias padrão do sistema.');
      return;
    }

    if (confirm('🗑️ Tem certeza que deseja excluir esta categoria?\n\nEsta ação não pode ser desfeita.')) {
      onDeleteCategory(id);
    }
  }, [onDeleteCategory]);

  const handleSave = useCallback((categoryData: Omit<CategoriaFluxo, 'id'>) => {
    if (editingCategory && onEditCategory) {
      onEditCategory(editingCategory.id, categoryData);
    } else {
      onAddCategory(categoryData);
    }
    setIsModalOpen(false);
    setEditingCategory(undefined);
  }, [editingCategory, onAddCategory, onEditCategory]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingCategory(undefined);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Tag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Categorias
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {categories.length} {categories.length === 1 ? 'categoria' : 'categorias'}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => {
            setEditingCategory(undefined);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Categoria</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar categoria..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
          />
        </div>

        {/* Filter */}
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setFilterType('all')}
            className={cn(
              'px-4 py-2 rounded-lg font-medium text-sm transition-all',
              filterType === 'all'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            Todas
          </button>
          <button
            onClick={() => setFilterType('entrada')}
            className={cn(
              'px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-1',
              filterType === 'entrada'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-green-600'
            )}
          >
            <TrendingUp className="w-4 h-4" />
            Entradas
          </button>
          <button
            onClick={() => setFilterType('saida')}
            className={cn(
              'px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-1',
              filterType === 'saida'
                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-red-600'
            )}
          >
            <TrendingDown className="w-4 h-4" />
            Saídas
          </button>
        </div>
      </div>

      {/* Categories List */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Tag className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {searchTerm ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria criada'}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {searchTerm ? 'Tente buscar por outro termo' : 'Clique em "Nova Categoria" para começar'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Entradas */}
          {(filterType === 'all' || filterType === 'entrada') && entriesCategories.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Entradas
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({entriesCategories.length})
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {entriesCategories.map(category => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    isDefault={CATEGORIAS_PADRAO.some(c => c.id === category.id)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Saídas */}
          {(filterType === 'all' || filterType === 'saida') && expensesCategories.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Saídas
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({expensesCategories.length})
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {expensesCategories.map(category => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    isDefault={CATEGORIAS_PADRAO.some(c => c.id === category.id)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialCategory={editingCategory}
      />
    </div>
  );
};
