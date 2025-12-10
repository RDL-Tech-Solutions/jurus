/**
 * Card de Categoria - Componente Moderno
 */

import React, { memo } from 'react';
import { Trash2, Edit2, Lock } from 'lucide-react';
import { CategoriaFluxo } from '../../../types/fluxoCaixa';
import { cn } from '../../../utils/cn';

interface CategoryCardProps {
  category: CategoriaFluxo;
  isDefault?: boolean;
  onEdit?: (category: CategoriaFluxo) => void;
  onDelete?: (id: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = memo(({
  category,
  isDefault = false,
  onEdit,
  onDelete
}) => {
  return (
    <div
      className={cn(
        'group relative flex items-center justify-between p-4 rounded-xl transition-all duration-200',
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        'hover:shadow-md hover:scale-[1.02] hover:border-gray-300 dark:hover:border-gray-600'
      )}
    >
      {/* Conteúdo */}
      <div className="flex items-center gap-3 flex-1">
        {/* Ícone */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
          style={{ 
            backgroundColor: `${category.cor}15`,
            border: `2px solid ${category.cor}30`
          }}
        >
          {category.icone}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {category.nome}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: `${category.cor}20`,
                color: category.cor
              }}
            >
              {category.tipo === 'entrada' ? 'Entrada' : 'Saída'}
            </span>
            {isDefault && (
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Lock className="w-3 h-3" />
                Padrão
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Ações */}
      {!isDefault && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(category)}
              className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              title="Editar categoria"
            >
              <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(category.id)}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Excluir categoria"
            >
              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>
          )}
        </div>
      )}
    </div>
  );
});

CategoryCard.displayName = 'CategoryCard';
