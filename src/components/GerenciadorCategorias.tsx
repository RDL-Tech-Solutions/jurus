import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, Tag, TrendingUp, TrendingDown } from 'lucide-react';
import { CategoriaFluxo, TipoTransacao, CATEGORIAS_PADRAO } from '../types/fluxoCaixa';
import { cn } from '../utils/cn';
import { useModal } from '../hooks/useModal';

interface GerenciadorCategoriasProps {
    categorias: CategoriaFluxo[];
    onAdicionarCategoria: (categoria: Omit<CategoriaFluxo, 'id'>) => void;
    onEditarCategoria?: (id: string, dados: Partial<CategoriaFluxo>) => void;
    onExcluirCategoria: (id: string) => void;
}

interface ModalCategoriaProps {
    aberto: boolean;
    onFechar: () => void;
    onSalvar: (categoria: Omit<CategoriaFluxo, 'id'>) => void;
    categoriaInicial?: CategoriaFluxo;
}

const ICONES_DISPONIVEIS = [
    '💰', '💼', '📈', '🛒', '➕', '🏠', '🍽️', '🚗', '🏥', '📚',
    '🎉', '🛍️', '📄', '➖', '💳', '🎮', '🎬', '✈️', '🏋️', '💊',
    '🔧', '⚡', '💡', '📱', '💻', '🎵', '📺', '🍕', '☕', '🎨',
    '📖', '🏃', '🚴', '🏊', '⚽', '🎾', '🏀', '🎯', '🎲', '🎪'
];

const CORES_DISPONIVEIS = [
    { nome: 'Verde', cor: '#10b981' },
    { nome: 'Azul', cor: '#3b82f6' },
    { nome: 'Roxo', cor: '#8b5cf6' },
    { nome: 'Rosa', cor: '#ec4899' },
    { nome: 'Vermelho', cor: '#ef4444' },
    { nome: 'Laranja', cor: '#f97316' },
    { nome: 'Amarelo', cor: '#eab308' },
    { nome: 'Ciano', cor: '#06b6d4' },
    { nome: 'Cinza', cor: '#6b7280' },
    { nome: 'Índigo', cor: '#6366f1' }
];

function ModalCategoria({ aberto, onFechar, onSalvar, categoriaInicial }: ModalCategoriaProps) {
    const [dados, setDados] = useState<Omit<CategoriaFluxo, 'id'>>({
        nome: categoriaInicial?.nome || '',
        icone: categoriaInicial?.icone || '📁',
        cor: categoriaInicial?.cor || '#6b7280',
        tipo: categoriaInicial?.tipo || 'saida'
    });

    const [erros, setErros] = useState<Record<string, string>>({});

    useModal(aberto);

    const validar = (): boolean => {
        const novosErros: Record<string, string> = {};

        if (!dados.nome?.trim()) {
            novosErros.nome = 'Nome é obrigatório';
        }
        if (!dados.icone) {
            novosErros.icone = 'Selecione um ícone';
        }
        if (!dados.cor) {
            novosErros.cor = 'Selecione uma cor';
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSalvar = () => {
        if (validar()) {
            onSalvar(dados);
            onFechar();
            setDados({
                nome: '',
                icone: '📁',
                cor: '#6b7280',
                tipo: 'saida'
            });
        }
    };

    if (!aberto) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => e.target === e.currentTarget && onFechar()}
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-in zoom-in-95 fade-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {categoriaInicial ? 'Editar Categoria' : 'Nova Categoria'}
                    </h3>
                    <button
                        onClick={onFechar}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="p-4 space-y-4">
                    {/* Tipo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tipo
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setDados(prev => ({ ...prev, tipo: 'entrada' }))}
                                className={cn(
                                    'flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all',
                                    dados.tipo === 'entrada'
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                                )}
                            >
                                <TrendingUp className="w-5 h-5" />
                                <span className="font-medium">Entrada</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setDados(prev => ({ ...prev, tipo: 'saida' }))}
                                className={cn(
                                    'flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all',
                                    dados.tipo === 'saida'
                                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-red-300'
                                )}
                            >
                                <TrendingDown className="w-5 h-5" />
                                <span className="font-medium">Saída</span>
                            </button>
                        </div>
                    </div>

                    {/* Nome */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nome *
                        </label>
                        <input
                            type="text"
                            value={dados.nome}
                            onChange={(e) => setDados(prev => ({ ...prev, nome: e.target.value }))}
                            className={cn('input-mobile', erros.nome && 'border-red-500')}
                            placeholder="Ex: Academia, Streaming, etc."
                        />
                        {erros.nome && <p className="text-red-500 text-xs mt-1">{erros.nome}</p>}
                    </div>

                    {/* Ícone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Ícone *
                        </label>
                        <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                            {ICONES_DISPONIVEIS.map(icone => (
                                <button
                                    key={icone}
                                    type="button"
                                    onClick={() => setDados(prev => ({ ...prev, icone }))}
                                    className={cn(
                                        'w-10 h-10 flex items-center justify-center text-2xl rounded-lg border-2 transition-all hover:scale-110',
                                        dados.icone === icone
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                            : 'border-gray-200 dark:border-gray-700'
                                    )}
                                >
                                    {icone}
                                </button>
                            ))}
                        </div>
                        {erros.icone && <p className="text-red-500 text-xs mt-1">{erros.icone}</p>}
                    </div>

                    {/* Cor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Cor *
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {CORES_DISPONIVEIS.map(({ nome, cor }) => (
                                <button
                                    key={cor}
                                    type="button"
                                    onClick={() => setDados(prev => ({ ...prev, cor }))}
                                    className={cn(
                                        'h-10 rounded-lg border-2 transition-all hover:scale-105',
                                        dados.cor === cor
                                            ? 'border-gray-900 dark:border-white scale-105'
                                            : 'border-gray-200 dark:border-gray-700'
                                    )}
                                    style={{ backgroundColor: cor }}
                                    title={nome}
                                />
                            ))}
                        </div>
                        {erros.cor && <p className="text-red-500 text-xs mt-1">{erros.cor}</p>}
                    </div>

                    {/* Preview */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
                        <div className="flex items-center gap-3">
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                                style={{ backgroundColor: `${dados.cor}20` }}
                            >
                                {dados.icone}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {dados.nome || 'Nome da categoria'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {dados.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
                    <button
                        onClick={onFechar}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSalvar}
                        className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center space-x-2"
                    >
                        <Check className="w-4 h-4" />
                        <span>Salvar</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export function GerenciadorCategorias({ categorias, onAdicionarCategoria, onExcluirCategoria }: GerenciadorCategoriasProps) {
    const [modalAberto, setModalAberto] = useState(false);
    const [categoriaEditando, setCategoriaEditando] = useState<CategoriaFluxo | undefined>();

    const categoriasEntrada = categorias.filter(c => c.tipo === 'entrada');
    const categoriasSaida = categorias.filter(c => c.tipo === 'saida');

    const handleExcluir = (id: string) => {
        if (CATEGORIAS_PADRAO.some(c => c.id === id)) {
            alert('Não é possível excluir categorias padrão');
            return;
        }
        if (confirm('Tem certeza que deseja excluir esta categoria?')) {
            onExcluirCategoria(id);
        }
    };

    const renderCategoria = (categoria: CategoriaFluxo) => {
        const ehPadrao = CATEGORIAS_PADRAO.some(c => c.id === categoria.id);
        
        return (
            <div
                key={categoria.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                        style={{ backgroundColor: `${categoria.cor}20` }}
                    >
                        {categoria.icone}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                            {categoria.nome}
                        </p>
                        {ehPadrao && (
                            <p className="text-xs text-gray-500">Categoria padrão</p>
                        )}
                    </div>
                </div>
                {!ehPadrao && (
                    <button
                        onClick={() => handleExcluir(categoria.id)}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
                        title="Excluir categoria"
                    >
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Categorias
                    </h3>
                </div>
                <button
                    onClick={() => {
                        setCategoriaEditando(undefined);
                        setModalAberto(true);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Nova Categoria</span>
                </button>
            </div>

            {/* Categorias de Entrada */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Entradas ({categoriasEntrada.length})
                    </h4>
                </div>
                <div className="space-y-2">
                    {categoriasEntrada.map(renderCategoria)}
                </div>
            </div>

            {/* Categorias de Saída */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Saídas ({categoriasSaida.length})
                    </h4>
                </div>
                <div className="space-y-2">
                    {categoriasSaida.map(renderCategoria)}
                </div>
            </div>

            {/* Modal */}
            <ModalCategoria
                aberto={modalAberto}
                onFechar={() => {
                    setModalAberto(false);
                    setCategoriaEditando(undefined);
                }}
                onSalvar={(categoria) => {
                    onAdicionarCategoria(categoria);
                    setModalAberto(false);
                }}
                categoriaInicial={categoriaEditando}
            />
        </div>
    );
}
