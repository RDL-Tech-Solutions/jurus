import { Target, Plus, AlertTriangle, CheckCircle, TrendingUp, Pencil, Trash2 } from 'lucide-react';
import { MetaGasto, CategoriaFluxo, CATEGORIAS_PADRAO } from '../../types/fluxoCaixa';
import { formatarMoeda } from '../../utils/calculos';
import { cn } from '../../utils/cn';

interface MetaComProgresso {
    meta: MetaGasto;
    categoria: CategoriaFluxo;
    valorGasto: number;
    percentual: number;
    status: 'ok' | 'atencao' | 'ultrapassado';
}

interface CardMetasProps {
    metas: MetaGasto[];
    gastosPorCategoria: { categoriaId: string; total: number }[];
    categorias?: CategoriaFluxo[]; // Todas as categorias disponíveis
    onNovaMeta: () => void;
    onEditarMeta: (meta: MetaGasto) => void;
    onExcluirMeta?: (id: string) => void;
}

export function CardMetas({ metas, gastosPorCategoria, categorias, onNovaMeta, onEditarMeta, onExcluirMeta }: CardMetasProps) {
    // Usar categorias fornecidas ou padrão como fallback
    const todasCategorias = categorias || CATEGORIAS_PADRAO;
    
    const metasComProgresso: MetaComProgresso[] = metas.map(meta => {
        // Buscar categoria nas categorias fornecidas
        let categoria = todasCategorias.find(c => c.id === meta.categoriaId);
        
        // Se não encontrou, pode ser uma categoria especial (dívidas/cartões)
        if (!categoria) {
            // Categorias especiais para dívidas e cartões
            if (meta.categoriaId === 'dividas') {
                categoria = { id: 'dividas', nome: 'Dívidas', icone: '📝', cor: '#ef4444', tipo: 'saida' as const };
            } else if (meta.categoriaId === 'cartoes') {
                categoria = { id: 'cartoes', nome: 'Cartões', icone: '💳', cor: '#8b5cf6', tipo: 'saida' as const };
            } else {
                categoria = { id: meta.categoriaId, nome: 'Outro', icone: '📌', cor: '#6b7280', tipo: 'saida' as const };
            }
        }
        
        const gasto = gastosPorCategoria.find(g => g.categoriaId === meta.categoriaId);
        const valorGasto = gasto?.total || 0;
        const percentual = meta.limite > 0 ? (valorGasto / meta.limite) * 100 : 0;

        let status: 'ok' | 'atencao' | 'ultrapassado' = 'ok';
        if (percentual >= 100) status = 'ultrapassado';
        else if (percentual >= 80) status = 'atencao';

        return {
            meta,
            categoria,
            valorGasto,
            percentual,
            status
        };
    });

    const resumo = {
        total: metas.length,
        ok: metasComProgresso.filter(m => m.status === 'ok').length,
        atencao: metasComProgresso.filter(m => m.status === 'atencao').length,
        ultrapassado: metasComProgresso.filter(m => m.status === 'ultrapassado').length
    };

    return (
        <div className="card-mobile">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    🎯 Metas do Mês
                </h3>
                <button
                    onClick={onNovaMeta}
                    className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {metas.length === 0 ? (
                <div className="text-center py-6">
                    <Target className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Nenhuma meta definida
                    </p>
                    <button
                        onClick={onNovaMeta}
                        className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                        + Criar primeira meta
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {metasComProgresso.map(({ meta, categoria, valorGasto, percentual, status }) => (
                        <div
                            key={meta.id}
                            className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 flex-1">
                                    <span className="text-lg">{categoria.icone}</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {categoria.nome}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {status === 'ultrapassado' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                                    {status === 'atencao' && <TrendingUp className="w-4 h-4 text-orange-500" />}
                                    {status === 'ok' && <CheckCircle className="w-4 h-4 text-green-500" />}
                                    <button
                                        onClick={() => onEditarMeta(meta)}
                                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        title="Editar meta"
                                    >
                                        <Pencil className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                                    </button>
                                    {onExcluirMeta && (
                                        <button
                                            onClick={() => onExcluirMeta(meta.id)}
                                            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                            title="Excluir meta"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Barra de Progresso */}
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                                <div
                                    className={cn(
                                        'h-full rounded-full transition-all duration-500',
                                        status === 'ultrapassado' ? 'bg-red-500' :
                                            status === 'atencao' ? 'bg-orange-500' : 'bg-green-500'
                                    )}
                                    style={{ width: `${Math.min(percentual, 100)}%` }}
                                />
                            </div>

                            <div className="flex items-center justify-between text-xs">
                                <span className={cn(
                                    'font-bold',
                                    status === 'ultrapassado' ? 'text-red-600 dark:text-red-400' :
                                        status === 'atencao' ? 'text-orange-600 dark:text-orange-400' :
                                            'text-green-600 dark:text-green-400'
                                )}>
                                    {percentual.toFixed(0)}%
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">
                                    {formatarMoeda(valorGasto)} / {formatarMoeda(meta.limite)}
                                </span>
                            </div>

                            {status === 'ultrapassado' && (
                                <p className="text-[10px] text-red-600 dark:text-red-400 mt-1">
                                    ⚠️ Ultrapassou {formatarMoeda(valorGasto - meta.limite)}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Resumo */}
            {metas.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center gap-4 text-xs">
                        {resumo.ok > 0 && (
                            <span className="text-green-600 dark:text-green-400">
                                ✅ {resumo.ok} ok
                            </span>
                        )}
                        {resumo.atencao > 0 && (
                            <span className="text-orange-600 dark:text-orange-400">
                                ⚠️ {resumo.atencao} atenção
                            </span>
                        )}
                        {resumo.ultrapassado > 0 && (
                            <span className="text-red-600 dark:text-red-400">
                                🔴 {resumo.ultrapassado} ultrapassado
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
