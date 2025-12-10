/**
 * Botão de Exportação
 * Componente reutilizável para exportar dados
 */

import React, { useState } from 'react';
import { Download, FileDown, Loader2 } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface ExportButtonProps {
  onClick: () => void | Promise<void>;
  label?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  onClick,
  label = 'Exportar',
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  className
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:ring-blue-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const isDisabled = disabled || loading || isLoading;

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {(loading || isLoading) ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        icon || <Download className="w-4 h-4" />
      )}
      <span>{label}</span>
    </button>
  );
};
