import { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText, Table2, ChevronDown, X } from 'lucide-react';
import { cn } from '../utils/cn';
import { ExportFormat } from '../utils/exportacao';

interface MenuExportacaoProps {
    onExportar: (formato: ExportFormat) => void;
    className?: string;
    disabled?: boolean;
    label?: string;
    showLabel?: boolean;
    variant?: 'primary' | 'secondary' | 'minimal';
}

const FORMATOS = [
    {
        key: 'csv' as ExportFormat,
        label: 'CSV',
        descricao: 'Arquivo de texto simples',
        icon: Table2,
        color: 'text-green-600 dark:text-green-400'
    },
    {
        key: 'excel' as ExportFormat,
        label: 'Excel',
        descricao: 'Planilha formatada (.xlsx)',
        icon: FileSpreadsheet,
        color: 'text-emerald-600 dark:text-emerald-400'
    },
    {
        key: 'pdf' as ExportFormat,
        label: 'PDF',
        descricao: 'Documento para impressão',
        icon: FileText,
        color: 'text-red-600 dark:text-red-400'
    }
];

export function MenuExportacao({
    onExportar,
    className,
    disabled = false,
    label = 'Exportar',
    showLabel = true,
    variant = 'primary'
}: MenuExportacaoProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Fechar menu ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExportar = async (formato: ExportFormat) => {
        setIsExporting(true);
        try {
            await onExportar(formato);
        } finally {
            setIsExporting(false);
            setIsOpen(false);
        }
    };

    const buttonStyles = {
        primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm',
        secondary: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
        minimal: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
    };

    return (
        <div className={cn('relative inline-block', className)} ref={menuRef}>
            {/* Botão principal */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled || isExporting}
                className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200',
                    buttonStyles[variant],
                    disabled && 'opacity-50 cursor-not-allowed',
                    isExporting && 'animate-pulse'
                )}
            >
                <Download className={cn('w-4 h-4', isExporting && 'animate-bounce')} />
                {showLabel && <span className="text-sm">{isExporting ? 'Exportando...' : label}</span>}
                <ChevronDown className={cn(
                    'w-4 h-4 transition-transform duration-200',
                    isOpen && 'rotate-180'
                )} />
            </button>

            {/* Menu dropdown */}
            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right animate-in fade-in-0 zoom-in-95 duration-200">
                    <div className="rounded-xl bg-white dark:bg-gray-900 shadow-xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                    Escolha o formato
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    Selecione como deseja exportar
                                </p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Opções */}
                        <div className="p-2">
                            {FORMATOS.map((formato) => {
                                const Icon = formato.icon;
                                return (
                                    <button
                                        key={formato.key}
                                        onClick={() => handleExportar(formato.key)}
                                        className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                                    >
                                        <div className={cn(
                                            'p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:scale-110 transition-transform',
                                            formato.color
                                        )}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                {formato.label}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {formato.descricao}
                                            </p>
                                        </div>
                                        <Download className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                💡 Excel é ideal para análises, PDF para impressão
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Componente simplificado para botões inline
interface BotaoExportacaoProps {
    formato: ExportFormat;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
}

export function BotaoExportacao({ formato, onClick, className, disabled }: BotaoExportacaoProps) {
    const config = FORMATOS.find(f => f.key === formato);
    if (!config) return null;

    const Icon = config.icon;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                'hover:scale-105 active:scale-95',
                config.color,
                'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700',
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
        >
            <Icon className="w-4 h-4" />
            <span>{config.label}</span>
        </button>
    );
}
