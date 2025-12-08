import { useState, useEffect } from 'react';
import { X, Target, AlertCircle } from 'lucide-react';
import { MetaGasto, CategoriaFluxo, CATEGORIAS_PADRAO } from '../../types/fluxoCaixa';
import { cn } from '../../utils/cn';
import { useModal } from '../../hooks/useModal';

interface ModalMetaProps {
    aberto: boolean;
    onFechar: () => void;
    onSalvar: (meta: Omit<MetaGasto, 'id' | 'criadoEm'>) => void;
    onExcluir?: (id: string) => void;
    metaInicial?: MetaGasto;
    categoriasUsadas: string[];
}

export function ModalMeta({ aberto, onFechar, onSalvar, onExcluir, metaInicial, categoriasUsadas }: ModalMetaProps) {
    const [categoriaId, setCategoriaId] = useState('');
    const [limite, setLimite] = useState('');
    const [alertar80, setAlertar80] = useState(true);
    const [alertar100, setAlertar100] = useState(true);
    const [erro, setErro] = useState('');

    // Oculta navbar quando modal abre
    useModal(aberto);

    const agora = new Date();
    const mes = agora.getMonth() + 1;
    const ano = agora.getFullYear();

    // Categorias de saída disponíveis (não usadas em outras metas)
    const categoriasSaida = CATEGORIAS_PADRAO.filter(c => c.tipo === 'saida');
    const categoriasDisponiveis = metaInicial
        ? categoriasSaida
        : categoriasSaida.filter(c => !categoriasUsadas.includes(c.id));

    useEffect(() => {
        if (metaInicial) {
            setCategoriaId(metaInicial.categoriaId);
            setLimite(metaInicial.limite.toString());
            setAlertar80(metaInicial.alertar80);
            setAlertar100(metaInicial.alertar100);
        } else {
            setCategoriaId(categoriasDisponiveis[0]?.id || '');
            setLimite('');
            setAlertar80(true);
            setAlertar100(true);
        }
        setErro('');
    }, [aberto, metaInicial]);

    const handleSalvar = () => {
        if (!categoriaId) {
            setErro('Selecione uma categoria');
            return;
        }

        const valorLimite = parseFloat(limite.replace(',', '.'));
        if (isNaN(valorLimite) || valorLimite <= 0) {
            setErro('Digite um limite válido');
            return;
        }

        onSalvar({
            categoriaId,
            limite: valorLimite,
            mes,
            ano,
            alertar80,
            alertar100
        });
        onFechar();
    };

    const handleExcluir = () => {
        if (metaInicial && onExcluir) {
            if (confirm('Excluir esta meta?')) {
                onExcluir(metaInicial.id);
                onFechar();
            }
        }
    };

    if (!aberto) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={onFechar} />

            <div className="relative w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {metaInicial ? 'Editar Meta' : 'Nova Meta'}
                        </h2>
                    </div>
                    <button onClick={onFechar} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Erro */}
                    {erro && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-600 dark:text-red-400">{erro}</p>
                        </div>
                    )}

                    {/* Categoria */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Categoria
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {categoriasDisponiveis.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategoriaId(cat.id)}
                                    disabled={metaInicial && cat.id !== metaInicial.categoriaId}
                                    className={cn(
                                        'p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1',
                                        categoriaId === cat.id
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300',
                                        metaInicial && cat.id !== metaInicial.categoriaId && 'opacity-50 cursor-not-allowed'
                                    )}
                                >
                                    <span className="text-2xl">{cat.icone}</span>
                                    <span className="text-[10px] text-gray-600 dark:text-gray-400 truncate w-full text-center">
                                        {cat.nome}
                                    </span>
                                </button>
                            ))}
                        </div>
                        {categoriasDisponiveis.length === 0 && (
                            <p className="text-center text-sm text-gray-500 py-4">
                                Todas as categorias já têm metas definidas
                            </p>
                        )}
                    </div>

                    {/* Limite */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Limite Mensal
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                            <input
                                type="text"
                                inputMode="decimal"
                                value={limite}
                                onChange={(e) => setLimite(e.target.value)}
                                placeholder="0,00"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg"
                            />
                        </div>
                    </div>

                    {/* Alertas */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Alertas
                        </label>

                        <label className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={alertar80}
                                onChange={(e) => setAlertar80(e.target.checked)}
                                className="w-5 h-5 rounded text-orange-600"
                            />
                            <div>
                                <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                                    ⚠️ Alertar em 80%
                                </p>
                                <p className="text-xs text-orange-600 dark:text-orange-400">
                                    Aviso quando atingir 80% do limite
                                </p>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={alertar100}
                                onChange={(e) => setAlertar100(e.target.checked)}
                                className="w-5 h-5 rounded text-red-600"
                            />
                            <div>
                                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                                    🔴 Alertar ao ultrapassar
                                </p>
                                <p className="text-xs text-red-600 dark:text-red-400">
                                    Aviso quando exceder o limite
                                </p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                    {metaInicial && onExcluir && (
                        <button
                            onClick={handleExcluir}
                            className="px-4 py-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium"
                        >
                            Excluir
                        </button>
                    )}
                    <button
                        onClick={onFechar}
                        className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSalvar}
                        disabled={!categoriaId || !limite}
                        className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium disabled:opacity-50"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
}
