import React, { useState, useMemo } from 'react';
import {
    BarChart3,
    Plus,
    Search,
    Filter,
    TrendingUp,
    TrendingDown,
    Calendar,
    Pencil,
    Trash2,
    X,
    Check,
    ChevronDown,
    Download,
    ArrowUpCircle,
    ArrowDownCircle,
    AlertCircle,
    Lightbulb,
    CreditCard,
    FileText,
    Wallet
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { useFluxoCaixa } from '../hooks/useFluxoCaixa';
import { ListaDividas } from './ListaDividas';
import { GerenciadorCartao } from './GerenciadorCartao';
import { AnalisesFluxo } from './AnalisesFluxo';
import { NovaTransacao, TipoTransacao, PeriodoFiltro } from '../types/fluxoCaixa';
import { formatarMoeda } from '../utils/calculos';
import { cn } from '../utils/cn';

// Modal de Adicionar/Editar Transação
interface ModalTransacaoProps {
    aberto: boolean;
    onFechar: () => void;
    onSalvar: (dados: NovaTransacao) => void;
    transacaoInicial?: Partial<NovaTransacao>;
    categorias: ReturnType<typeof useFluxoCaixa>['categorias'];
    titulo: string;
}

function ModalTransacao({ aberto, onFechar, onSalvar, transacaoInicial, categorias, titulo }: ModalTransacaoProps) {
    const [dados, setDados] = useState<Partial<NovaTransacao>>({
        descricao: '',
        valor: 0,
        tipo: 'saida',
        categoriaId: '',
        data: new Date().toISOString().split('T')[0],
        observacoes: '',
        ...transacaoInicial
    });

    const [erros, setErros] = useState<Record<string, string>>({});

    React.useEffect(() => {
        if (transacaoInicial) {
            setDados({
                descricao: '',
                valor: 0,
                tipo: 'saida',
                categoriaId: '',
                data: new Date().toISOString().split('T')[0],
                observacoes: '',
                ...transacaoInicial
            });
        }
    }, [transacaoInicial]);

    const categoriasFiltradas = useMemo(() =>
        categorias.filter(c => c.tipo === dados.tipo),
        [categorias, dados.tipo]
    );

    const validar = (): boolean => {
        const novosErros: Record<string, string> = {};

        if (!dados.descricao?.trim()) {
            novosErros.descricao = 'Descrição é obrigatória';
        }
        if (!dados.valor || dados.valor <= 0) {
            novosErros.valor = 'Valor deve ser maior que zero';
        }
        if (!dados.categoriaId) {
            novosErros.categoriaId = 'Selecione uma categoria';
        }
        if (!dados.data) {
            novosErros.data = 'Data é obrigatória';
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSalvar = () => {
        if (validar()) {
            onSalvar(dados as NovaTransacao);
            onFechar();
            // Limpar formulário
            setDados({
                descricao: '',
                valor: 0,
                tipo: 'saida',
                categoriaId: '',
                data: new Date().toISOString().split('T')[0],
                observacoes: ''
            });
        }
    };

    if (!aberto) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{titulo}</h3>
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
                                onClick={() => setDados(prev => ({ ...prev, tipo: 'entrada', categoriaId: '' }))}
                                className={cn(
                                    'flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all',
                                    dados.tipo === 'entrada'
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                                )}
                            >
                                <ArrowUpCircle className="w-5 h-5" />
                                <span className="font-medium">Entrada</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setDados(prev => ({ ...prev, tipo: 'saida', categoriaId: '' }))}
                                className={cn(
                                    'flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all',
                                    dados.tipo === 'saida'
                                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-red-300'
                                )}
                            >
                                <ArrowDownCircle className="w-5 h-5" />
                                <span className="font-medium">Saída</span>
                            </button>
                        </div>
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Descrição *
                        </label>
                        <input
                            type="text"
                            value={dados.descricao || ''}
                            onChange={(e) => setDados(prev => ({ ...prev, descricao: e.target.value }))}
                            className={cn('input-mobile', erros.descricao && 'border-red-500')}
                            placeholder="Ex: Salário, Aluguel, Mercado..."
                        />
                        {erros.descricao && <p className="text-red-500 text-xs mt-1">{erros.descricao}</p>}
                    </div>

                    {/* Valor e Data */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Valor (R$) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={dados.valor || ''}
                                onChange={(e) => setDados(prev => ({ ...prev, valor: parseFloat(e.target.value) || 0 }))}
                                className={cn('input-mobile', erros.valor && 'border-red-500')}
                                placeholder="0,00"
                            />
                            {erros.valor && <p className="text-red-500 text-xs mt-1">{erros.valor}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Data *
                            </label>
                            <input
                                type="date"
                                value={dados.data || ''}
                                onChange={(e) => setDados(prev => ({ ...prev, data: e.target.value }))}
                                className={cn('input-mobile', erros.data && 'border-red-500')}
                            />
                            {erros.data && <p className="text-red-500 text-xs mt-1">{erros.data}</p>}
                        </div>
                    </div>

                    {/* Categoria */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Categoria *
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {categoriasFiltradas.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setDados(prev => ({ ...prev, categoriaId: cat.id }))}
                                    className={cn(
                                        'flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all text-center',
                                        dados.categoriaId === cat.id
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                    )}
                                >
                                    <span className="text-xl mb-1">{cat.icone}</span>
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-1">
                                        {cat.nome}
                                    </span>
                                </button>
                            ))}
                        </div>
                        {erros.categoriaId && <p className="text-red-500 text-xs mt-1">{erros.categoriaId}</p>}
                    </div>

                    {/* Observações */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Observações
                        </label>
                        <textarea
                            value={dados.observacoes || ''}
                            onChange={(e) => setDados(prev => ({ ...prev, observacoes: e.target.value }))}
                            className="input-mobile"
                            rows={2}
                            placeholder="Notas adicionais (opcional)"
                        />
                    </div>

                    {/* Recorrência */}
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                🔄 Transação Recorrente
                            </label>
                            <button
                                type="button"
                                onClick={() => setDados(prev => ({ ...prev, recorrente: !prev.recorrente }))}
                                className={cn(
                                    'w-11 h-6 rounded-full transition-colors relative',
                                    dados.recorrente ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                                )}
                            >
                                <span className={cn(
                                    'absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow',
                                    dados.recorrente ? 'left-6' : 'left-1'
                                )} />
                            </button>
                        </div>
                        {dados.recorrente && (
                            <div className="mt-3">
                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                    Repetir a cada:
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { valor: 'diaria', label: 'Dia' },
                                        { valor: 'semanal', label: 'Semana' },
                                        { valor: 'mensal', label: 'Mês' },
                                        { valor: 'anual', label: 'Ano' }
                                    ].map(opt => (
                                        <button
                                            key={opt.valor}
                                            type="button"
                                            onClick={() => setDados(prev => ({ ...prev, recorrencia: opt.valor as any }))}
                                            className={cn(
                                                'px-2 py-1.5 rounded-lg text-xs font-medium transition-all border',
                                                dados.recorrencia === opt.valor
                                                    ? 'border-primary-500 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                                                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                                            )}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    💡 A transação será gerada automaticamente na próxima recorrência.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700">
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

// Modal de Confirmação de Exclusão
interface ModalConfirmacaoProps {
    aberto: boolean;
    onFechar: () => void;
    onConfirmar: () => void;
    titulo: string;
    mensagem: string;
}

function ModalConfirmacao({ aberto, onFechar, onConfirmar, titulo, mensagem }: ModalConfirmacaoProps) {
    if (!aberto) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm">
                <div className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{titulo}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{mensagem}</p>
                    <div className="flex items-center justify-center space-x-3">
                        <button
                            onClick={onFechar}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => {
                                onConfirmar();
                                onFechar();
                            }}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente Principal
export function FluxoCaixa() {
    const {
        transacoesAgrupadas,
        categorias,
        filtros,
        estatisticas,
        carregado,
        adicionarTransacao,
        editarTransacao,
        excluirTransacao,
        obterCategoria,
        atualizarFiltros,
        limparFiltros
    } = useFluxoCaixa();

    const [modalAberto, setModalAberto] = useState(false);
    const [modalEdicao, setModalEdicao] = useState<{ aberto: boolean; id: string; dados?: Partial<NovaTransacao> }>({
        aberto: false,
        id: ''
    });
    const [modalExclusao, setModalExclusao] = useState<{ aberto: boolean; id: string; descricao: string }>({
        aberto: false,
        id: '',
        descricao: ''
    });
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [abaAtiva, setAbaAtiva] = useState<'transacoes' | 'dividas' | 'cartoes' | 'analises'>('transacoes');

    const periodos: { valor: PeriodoFiltro; label: string }[] = [
        { valor: 'hoje', label: 'Hoje' },
        { valor: 'semana', label: 'Esta Semana' },
        { valor: 'mes', label: 'Este Mês' },
        { valor: 'ano', label: 'Este Ano' }
    ];

    const handleAdicionarTransacao = (dados: NovaTransacao) => {
        adicionarTransacao(dados);
    };

    const handleEditarTransacao = (dados: NovaTransacao) => {
        if (modalEdicao.id) {
            editarTransacao(modalEdicao.id, dados);
            setModalEdicao({ aberto: false, id: '' });
        }
    };

    const handleExcluirTransacao = () => {
        if (modalExclusao.id) {
            excluirTransacao(modalExclusao.id);
        }
    };

    // Dados para gráfico de pizza
    const dadosPizza = useMemo(() => {
        return estatisticas.transacoesPorCategoria
            .filter(c => c.tipo === 'saida')
            .slice(0, 5)
            .map(c => ({
                name: c.categoria.nome,
                value: c.total,
                color: c.categoria.cor,
                icone: c.categoria.icone
            }));
    }, [estatisticas.transacoesPorCategoria]);

    // Dados para gráfico de evolução
    const dadosEvolucao = useMemo(() => {
        return estatisticas.evolucaoSaldo.slice(-10);
    }, [estatisticas.evolucaoSaldo]);

    if (!carregado) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="card-mobile">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Fluxo de Caixa</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Controle suas finanças
                            </p>
                        </div>
                    </div>
                    {abaAtiva === 'transacoes' && (
                        <button
                            onClick={() => setModalAberto(true)}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/30"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="font-medium">Nova Transação</span>
                        </button>
                    )}
                </div>

                {/* Abas de Navegação */}
                <div className="flex items-center space-x-1 mt-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <button
                        onClick={() => setAbaAtiva('transacoes')}
                        className={cn(
                            'flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                            abaAtiva === 'transacoes'
                                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        )}
                    >
                        <Wallet className="w-4 h-4" />
                        <span>Transações</span>
                    </button>
                    <button
                        onClick={() => setAbaAtiva('dividas')}
                        className={cn(
                            'flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                            abaAtiva === 'dividas'
                                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        )}
                    >
                        <FileText className="w-4 h-4" />
                        <span>Dívidas</span>
                    </button>
                    <button
                        onClick={() => setAbaAtiva('cartoes')}
                        className={cn(
                            'flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                            abaAtiva === 'cartoes'
                                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        )}
                    >
                        <CreditCard className="w-4 h-4" />
                        <span>Cartões</span>
                    </button>
                    <button
                        onClick={() => setAbaAtiva('analises')}
                        className={cn(
                            'flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                            abaAtiva === 'analises'
                                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        )}
                    >
                        <BarChart3 className="w-4 h-4" />
                        <span>Análises</span>
                    </button>
                </div>
            </div>

            {/* Conteúdo baseado na aba ativa */}
            {abaAtiva === 'dividas' && (
                <div className="card-mobile">
                    <ListaDividas
                        onPagarDivida={(valor, descricao) => {
                            adicionarTransacao({
                                descricao,
                                valor,
                                tipo: 'saida',
                                categoriaId: 'contas',
                                data: new Date().toISOString().split('T')[0]
                            });
                        }}
                    />
                </div>
            )}

            {abaAtiva === 'cartoes' && (
                <div className="card-mobile">
                    <GerenciadorCartao
                        onPagarFatura={(valor, descricao) => {
                            adicionarTransacao({
                                descricao,
                                valor,
                                tipo: 'saida',
                                categoriaId: 'contas',
                                data: new Date().toISOString().split('T')[0]
                            });
                        }}
                    />
                </div>
            )}

            {abaAtiva === 'analises' && (
                <div className="card-mobile">
                    <AnalisesFluxo
                        transacoes={transacoesAgrupadas.flatMap(g => g.transacoes)}
                        estatisticas={estatisticas}
                    />
                </div>
            )}

            {abaAtiva === 'transacoes' && (
                <>
                    {/* Cards de Resumo */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Entradas */}
                        <div className="card-mobile bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Entradas</p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                                        {formatarMoeda(estatisticas.totalEntradas)}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/40">
                                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </div>

                        {/* Saídas */}
                        <div className="card-mobile bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-red-700 dark:text-red-300">Saídas</p>
                                    <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                                        {formatarMoeda(estatisticas.totalSaidas)}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/40">
                                    <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                        </div>

                        {/* Saldo */}
                        <div className={cn(
                            "card-mobile border",
                            estatisticas.saldo >= 0
                                ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800"
                                : "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800"
                        )}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={cn(
                                        "text-sm font-medium",
                                        estatisticas.saldo >= 0
                                            ? "text-blue-700 dark:text-blue-300"
                                            : "text-amber-700 dark:text-amber-300"
                                    )}>Saldo</p>
                                    <p className={cn(
                                        "text-2xl font-bold mt-1",
                                        estatisticas.saldo >= 0
                                            ? "text-blue-600 dark:text-blue-400"
                                            : "text-amber-600 dark:text-amber-400"
                                    )}>
                                        {formatarMoeda(estatisticas.saldo)}
                                    </p>
                                </div>
                                <div className={cn(
                                    "p-3 rounded-full",
                                    estatisticas.saldo >= 0
                                        ? "bg-blue-100 dark:bg-blue-900/40"
                                        : "bg-amber-100 dark:bg-amber-900/40"
                                )}>
                                    <BarChart3 className={cn(
                                        "w-6 h-6",
                                        estatisticas.saldo >= 0
                                            ? "text-blue-600 dark:text-blue-400"
                                            : "text-amber-600 dark:text-amber-400"
                                    )} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="card-mobile">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <Filter className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtros</span>
                            </div>
                            <button
                                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                                className="text-primary-600 dark:text-primary-400 text-sm"
                            >
                                {mostrarFiltros ? 'Ocultar' : 'Mostrar mais'}
                            </button>
                        </div>

                        {/* Período */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {periodos.map(p => (
                                <button
                                    key={p.valor}
                                    onClick={() => atualizarFiltros({ periodo: p.valor })}
                                    className={cn(
                                        'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                                        filtros.periodo === p.valor
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    )}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>

                        {mostrarFiltros && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                {/* Tipo */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Tipo
                                    </label>
                                    <select
                                        value={filtros.tipo}
                                        onChange={(e) => atualizarFiltros({ tipo: e.target.value as any })}
                                        className="input-mobile text-sm"
                                    >
                                        <option value="todos">Todos</option>
                                        <option value="entrada">Entradas</option>
                                        <option value="saida">Saídas</option>
                                    </select>
                                </div>

                                {/* Categoria */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Categoria
                                    </label>
                                    <select
                                        value={filtros.categoriaId || ''}
                                        onChange={(e) => atualizarFiltros({ categoriaId: e.target.value || undefined })}
                                        className="input-mobile text-sm"
                                    >
                                        <option value="">Todas</option>
                                        {categorias.map(c => (
                                            <option key={c.id} value={c.id}>{c.icone} {c.nome}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Busca */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Buscar
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={filtros.busca || ''}
                                            onChange={(e) => atualizarFiltros({ busca: e.target.value })}
                                            className="input-mobile text-sm pl-9"
                                            placeholder="Buscar transação..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Gráficos */}
                    {estatisticas.evolucaoSaldo.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Gráfico de Categorias */}
                            {dadosPizza.length > 0 && (
                                <div className="card-mobile">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                                        Gastos por Categoria
                                    </h3>
                                    <div className="h-[200px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={dadosPizza}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={40}
                                                    outerRadius={70}
                                                    dataKey="value"
                                                    label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                                    labelLine={false}
                                                >
                                                    {dadosPizza.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value: number) => formatarMoeda(value)}
                                                    contentStyle={{
                                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                        borderRadius: '8px',
                                                        border: 'none',
                                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}

                            {/* Gráfico de Evolução */}
                            {dadosEvolucao.length > 1 && (
                                <div className="card-mobile">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                                        Evolução do Saldo
                                    </h3>
                                    <div className="h-[200px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={dadosEvolucao}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                <XAxis dataKey="data" tick={{ fontSize: 10 }} />
                                                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                                                <Tooltip
                                                    formatter={(value: number) => formatarMoeda(value)}
                                                    contentStyle={{
                                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                        borderRadius: '8px',
                                                        border: 'none',
                                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="saldo"
                                                    stroke="#3b82f6"
                                                    strokeWidth={2}
                                                    dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Insights */}
                    {(estatisticas.categoriaMaisGastos || estatisticas.mediaDiariaGastos > 0) && (
                        <div className="card-mobile bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800">
                            <div className="flex items-center space-x-2 mb-3">
                                <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100">Insights</h3>
                            </div>
                            <div className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                                {estatisticas.categoriaMaisGastos && (
                                    <p>
                                        • Maior categoria de gastos: <strong>{estatisticas.categoriaMaisGastos.categoria.nome}</strong> ({formatarMoeda(estatisticas.categoriaMaisGastos.total)})
                                    </p>
                                )}
                                {estatisticas.mediaDiariaGastos > 0 && (
                                    <p>
                                        • Média diária de gastos: <strong>{formatarMoeda(estatisticas.mediaDiariaGastos)}</strong>
                                    </p>
                                )}
                                <p>
                                    • Projeção para fim do mês: <strong className={estatisticas.projecaoFimMes >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                                        {formatarMoeda(estatisticas.projecaoFimMes)}
                                    </strong>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Lista de Transações */}
                    <div className="card-mobile">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            Transações Recentes
                        </h3>

                        {transacoesAgrupadas.length === 0 ? (
                            <div className="text-center py-12">
                                <BarChart3 className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                                <p className="text-gray-600 dark:text-gray-400 mb-2">Nenhuma transação encontrada</p>
                                <p className="text-sm text-gray-500 dark:text-gray-500">
                                    Clique em "Nova Transação" para começar
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {transacoesAgrupadas.map(grupo => (
                                    <div key={grupo.data}>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                {grupo.data}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            {grupo.transacoes.map(transacao => {
                                                const categoria = obterCategoria(transacao.categoriaId);
                                                return (
                                                    <div
                                                        key={transacao.id}
                                                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div
                                                                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                                                                style={{ backgroundColor: `${categoria?.cor}20` }}
                                                            >
                                                                {categoria?.icone}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900 dark:text-white">
                                                                    {transacao.descricao}
                                                                </p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {categoria?.nome}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <span className={cn(
                                                                'font-semibold',
                                                                transacao.tipo === 'entrada'
                                                                    ? 'text-green-600 dark:text-green-400'
                                                                    : 'text-red-600 dark:text-red-400'
                                                            )}>
                                                                {transacao.tipo === 'entrada' ? '+' : '-'}{formatarMoeda(transacao.valor)}
                                                            </span>
                                                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => setModalEdicao({
                                                                        aberto: true,
                                                                        id: transacao.id,
                                                                        dados: {
                                                                            descricao: transacao.descricao,
                                                                            valor: transacao.valor,
                                                                            tipo: transacao.tipo,
                                                                            categoriaId: transacao.categoriaId,
                                                                            data: transacao.data.split('T')[0],
                                                                            observacoes: transacao.observacoes
                                                                        }
                                                                    })}
                                                                    className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                                >
                                                                    <Pencil className="w-4 h-4 text-gray-500" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setModalExclusao({
                                                                        aberto: true,
                                                                        id: transacao.id,
                                                                        descricao: transacao.descricao
                                                                    })}
                                                                    className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Modais */}
                    <ModalTransacao
                        aberto={modalAberto}
                        onFechar={() => setModalAberto(false)}
                        onSalvar={handleAdicionarTransacao}
                        categorias={categorias}
                        titulo="Nova Transação"
                    />

                    <ModalTransacao
                        aberto={modalEdicao.aberto}
                        onFechar={() => setModalEdicao({ aberto: false, id: '' })}
                        onSalvar={handleEditarTransacao}
                        transacaoInicial={modalEdicao.dados}
                        categorias={categorias}
                        titulo="Editar Transação"
                    />

                    <ModalConfirmacao
                        aberto={modalExclusao.aberto}
                        onFechar={() => setModalExclusao({ aberto: false, id: '', descricao: '' })}
                        onConfirmar={handleExcluirTransacao}
                        titulo="Excluir Transação"
                        mensagem={`Tem certeza que deseja excluir "${modalExclusao.descricao}"? Esta ação não pode ser desfeita.`}
                    />
                </>
            )}
        </div>
    );
}
