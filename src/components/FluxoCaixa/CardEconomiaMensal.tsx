import { useMemo, useState, useRef, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChevronRight, AlertTriangle, X, Pencil, Trash2, MoreVertical, TrendingUp, TrendingDown, Settings } from 'lucide-react';
import { formatarMoeda } from '../../utils/calculos';
import { cn } from '../../utils/cn';
import { Transacao, CategoriaFluxo } from '../../types/fluxoCaixa';
import { useModal } from '../../hooks/useModal';

interface CardEconomiaMensalProps {
    receitasConsideradas: number;
    despesasConsideradas: number;
    transacoesEntrada: Transacao[];
    transacoesSaida: Transacao[];
    categorias: CategoriaFluxo[];
    onEditarTransacao: (id: string, dados: { descricao?: string; valor?: number }) => void;
    onExcluirTransacao: (id: string) => void;
}

// Modal de lista de transações
function ModalListaTransacoes({
    aberto,
    onFechar,
    tipo,
    transacoes,
    categorias,
    onEditar,
    onExcluir
}: {
    aberto: boolean;
    onFechar: () => void;
    tipo: 'entrada' | 'saida';
    transacoes: Transacao[];
    categorias: CategoriaFluxo[];
    onEditar: (id: string, dados: { descricao?: string; valor?: number }) => void;
    onExcluir: (id: string) => void;
}) {
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{ descricao: string; valor: number }>({ descricao: '', valor: 0 });

    useModal(aberto);

    if (!aberto) return null;

    const total = transacoes.reduce((a, t) => a + t.valor, 0);
    const corTipo = tipo === 'entrada' ? 'green' : 'red';
    const titulo = tipo === 'entrada' ? 'Receitas Consideradas' : 'Despesas Consideradas';
    const IconeTipo = tipo === 'entrada' ? TrendingUp : TrendingDown;

    const iniciarEdicao = (t: Transacao) => {
        setEditandoId(t.id);
        setEditForm({ descricao: t.descricao, valor: t.valor });
    };

    const salvarEdicao = () => {
        if (editandoId) {
            onEditar(editandoId, editForm);
            setEditandoId(null);
        }
    };

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'short'
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => e.target === e.currentTarget && onFechar()}
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                {/* Header */}
                <div className={cn(
                    "p-4 border-b border-gray-200 dark:border-gray-700",
                    tipo === 'entrada' ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
                )}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <IconeTipo className={cn("w-5 h-5", `text-${corTipo}-600`)} />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {titulo}
                            </h3>
                        </div>
                        <button
                            onClick={onFechar}
                            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <p className={cn("text-2xl font-bold mt-2", `text-${corTipo}-600`)}>
                        {formatarMoeda(total)}
                    </p>
                    <p className="text-sm text-gray-500">
                        {transacoes.length} transaç{transacoes.length === 1 ? 'ão' : 'ões'}
                    </p>
                </div>

                {/* Lista */}
                <div className="overflow-y-auto max-h-[50vh] p-4 space-y-2">
                    {transacoes.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                            Nenhuma {tipo === 'entrada' ? 'receita' : 'despesa'} encontrada
                        </p>
                    ) : (
                        transacoes.map(t => {
                            const cat = categorias.find(c => c.id === t.categoriaId);
                            const isEditando = editandoId === t.id;

                            return (
                                <div
                                    key={t.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl group"
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <span className="text-xl">{cat?.icone || '💰'}</span>
                                        {isEditando ? (
                                            <div className="flex-1 flex gap-2">
                                                <input
                                                    type="text"
                                                    value={editForm.descricao}
                                                    onChange={(e) => setEditForm(p => ({ ...p, descricao: e.target.value }))}
                                                    className="flex-1 px-2 py-1 text-sm border rounded dark:bg-gray-800 dark:border-gray-600"
                                                />
                                                <input
                                                    type="number"
                                                    value={editForm.valor}
                                                    onChange={(e) => setEditForm(p => ({ ...p, valor: parseFloat(e.target.value) || 0 }))}
                                                    className="w-24 px-2 py-1 text-sm border rounded dark:bg-gray-800 dark:border-gray-600"
                                                    step="0.01"
                                                />
                                                <button
                                                    onClick={salvarEdicao}
                                                    className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                                                >
                                                    Salvar
                                                </button>
                                                <button
                                                    onClick={() => setEditandoId(null)}
                                                    className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded text-xs"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                    {t.descricao}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {cat?.nome} • {formatarData(t.data)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    {!isEditando && (
                                        <div className="flex items-center gap-2">
                                            <span className={cn("font-semibold", `text-${corTipo}-600`)}>
                                                {formatarMoeda(t.valor)}
                                            </span>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => iniciarEdicao(t)}
                                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-3.5 h-3.5 text-gray-500" />
                                                </button>
                                                <button
                                                    onClick={() => onExcluir(t.id)}
                                                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

export function CardEconomiaMensal({
    receitasConsideradas,
    despesasConsideradas,
    transacoesEntrada,
    transacoesSaida,
    categorias,
    onEditarTransacao,
    onExcluirTransacao
}: CardEconomiaMensalProps) {
    const [menuAberto, setMenuAberto] = useState(false);
    const [modalReceitas, setModalReceitas] = useState(false);
    const [modalDespesas, setModalDespesas] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Fechar menu ao clicar fora
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuAberto(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const dados = useMemo(() => {
        const economizado = receitasConsideradas - despesasConsideradas;
        const percentual = receitasConsideradas > 0
            ? Math.round((economizado / receitasConsideradas) * 100)
            : 0;

        const dadosGrafico = [
            { name: 'Economizado', value: Math.max(0, economizado), color: '#f97316' },
            { name: 'Gasto', value: despesasConsideradas, color: '#374151' }
        ];

        return {
            economizado,
            percentual: Math.max(-100, Math.min(100, percentual)),
            dadosGrafico
        };
    }, [receitasConsideradas, despesasConsideradas]);

    const dica = useMemo(() => {
        if (dados.percentual < 10) {
            return "Analise suas despesas variáveis e veja o que pode ser cortado no futuro.";
        } else if (dados.percentual < 30) {
            return "Você está economizando, mas ainda há espaço para melhorar!";
        } else {
            return "Excelente! Continue mantendo esse padrão de economia.";
        }
    }, [dados.percentual]);

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Economia mensal
                    </h3>
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setMenuAberto(!menuAberto)}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                        {/* Menu Dropdown */}
                        {menuAberto && (
                            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[160px] z-10 animate-in fade-in slide-in-from-top-2 duration-200">
                                <button
                                    onClick={() => { setModalReceitas(true); setMenuAberto(false); }}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    Ver receitas
                                </button>
                                <button
                                    onClick={() => { setModalDespesas(true); setMenuAberto(false); }}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                    <TrendingDown className="w-4 h-4 text-red-600" />
                                    Ver despesas
                                </button>
                                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                                <button
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-500"
                                >
                                    <Settings className="w-4 h-4" />
                                    Configurar metas
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-4">
                    {/* Gráfico Circular */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-28 h-28">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dados.dadosGrafico}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={35}
                                        outerRadius={50}
                                        startAngle={90}
                                        endAngle={-270}
                                        dataKey="value"
                                        strokeWidth={0}
                                    >
                                        {dados.dadosGrafico.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    {dados.percentual}%
                                </span>
                            </div>
                        </div>
                        <p className={cn(
                            "text-lg font-bold mt-2",
                            dados.economizado >= 0 ? "text-green-500" : "text-red-500"
                        )}>
                            {formatarMoeda(dados.economizado)}
                        </p>
                        <p className="text-xs text-gray-500">Valor economizado</p>
                    </div>

                    {/* Detalhes */}
                    <div className="flex-1 space-y-3">
                        {/* Receitas */}
                        <button
                            onClick={() => setModalReceitas(true)}
                            className="w-full text-left group hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 -m-2 rounded-lg transition-colors"
                        >
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Receitas consideradas
                            </p>
                            <div className="flex items-center gap-1">
                                <span className="text-base font-semibold text-green-600 dark:text-green-500">
                                    {formatarMoeda(receitasConsideradas)}
                                </span>
                                <ChevronRight className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </button>

                        {/* Despesas */}
                        <button
                            onClick={() => setModalDespesas(true)}
                            className="w-full text-left group hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 -m-2 rounded-lg transition-colors"
                        >
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Despesas consideradas
                            </p>
                            <div className="flex items-center gap-1">
                                <span className="text-base font-semibold text-red-600 dark:text-red-500">
                                    {formatarMoeda(despesasConsideradas)}
                                </span>
                                <ChevronRight className="w-4 h-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </button>

                        {/* Dica */}
                        <div className="p-2.5 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                            <div className="flex gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                                    {dica}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Receitas */}
            <ModalListaTransacoes
                aberto={modalReceitas}
                onFechar={() => setModalReceitas(false)}
                tipo="entrada"
                transacoes={transacoesEntrada}
                categorias={categorias}
                onEditar={onEditarTransacao}
                onExcluir={onExcluirTransacao}
            />

            {/* Modal de Despesas */}
            <ModalListaTransacoes
                aberto={modalDespesas}
                onFechar={() => setModalDespesas(false)}
                tipo="saida"
                transacoes={transacoesSaida}
                categorias={categorias}
                onEditar={onEditarTransacao}
                onExcluir={onExcluirTransacao}
            />
        </>
    );
}
