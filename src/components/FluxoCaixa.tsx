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
    Wallet,
    FileDown,
    FileSpreadsheet,
    Printer
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
import { useToast } from '../hooks/useToast';
import { useModal } from '../hooks/useModal';
import { ToastContainer } from './Toast';
import { ListaDividas } from './ListaDividas';
import { GerenciadorCartao } from './GerenciadorCartao';
import { AnalisesFluxo } from './AnalisesFluxo';
import { NovaTransacao, TipoTransacao, PeriodoFiltro, EstatisticasFluxo } from '../types/fluxoCaixa';
import { formatarMoeda } from '../utils/calculos';
import { exportarCSV, exportarJSON, imprimirPDF } from '../utils/exportar';
import { cn } from '../utils/cn';
import { calcularTendencia, calcularMediaDiaria, calcularRunway, calcularBreakEven, encontrarMaiorGasto, gerarAlertas } from '../utils/analiseFinanceira';
import {
    CardTendencia,
    CardMediaDiaria,
    CardComparativo,
    GraficoBarrasComparativo,
    GraficoTopCategorias,
    CardRunway,
    CardBreakEven,
    CardMaiorGasto,
    CardAlertas
} from './FluxoCaixa/index';

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

    // Hook para ocultar navbar quando modal está aberto
    useModal(aberto);

    if (!aberto) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget) onFechar();
            }}
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] overflow-y-auto animate-in zoom-in-95 fade-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{titulo}</h3>
                    <button
                        onClick={onFechar}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
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
                <div className="flex items-center justify-end space-x-2 sm:space-x-3 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
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
    // Hook para ocultar navbar quando modal está aberto
    useModal(aberto);

    if (!aberto) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget) onFechar();
            }}
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 fade-in duration-200">
                <div className="p-4 sm:p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 sm:mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">{titulo}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">{mensagem}</p>
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                        <button
                            onClick={onFechar}
                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => {
                                onConfirmar();
                                onFechar();
                            }}
                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
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
    const [mostrarMenuExportar, setMostrarMenuExportar] = useState(false);
    const { success, error, toasts, removeToast } = useToast();

    const periodos: { valor: PeriodoFiltro; label: string }[] = [
        { valor: 'hoje', label: 'Hoje' },
        { valor: 'semana', label: 'Esta Semana' },
        { valor: 'mes', label: 'Este Mês' },
        { valor: 'ano', label: 'Este Ano' }
    ];

    const handleAdicionarTransacao = (dados: NovaTransacao) => {
        adicionarTransacao(dados);
        success('✅ Transação adicionada!', 'Sua transação foi registrada com sucesso.');
    };

    const handleEditarTransacao = (dados: NovaTransacao) => {
        if (modalEdicao.id) {
            editarTransacao(modalEdicao.id, dados);
            setModalEdicao({ aberto: false, id: '' });
            success('✏️ Transação atualizada!', 'As alterações foram salvas.');
        }
    };

    const handleExcluirTransacao = () => {
        if (modalExclusao.id) {
            excluirTransacao(modalExclusao.id);
            success('🗑️ Transação excluída!', 'A transação foi removida.');
        }
    };

    // Funções de exportação
    const handleExportarCSV = () => {
        try {
            const todasTransacoes = transacoesAgrupadas.flatMap(g => g.transacoes);
            exportarCSV(todasTransacoes, {
                totalEntradas: estatisticas.totalEntradas,
                totalSaidas: estatisticas.totalSaidas,
                saldo: estatisticas.saldo,
                periodo: periodos.find(p => p.valor === filtros.periodo)?.label || 'Personalizado'
            });
            success('📊 Exportado!', 'Arquivo CSV baixado com sucesso.');
            setMostrarMenuExportar(false);
        } catch (err) {
            error('❌ Erro ao exportar', 'Não foi possível gerar o arquivo CSV.');
        }
    };

    const handleExportarJSON = () => {
        try {
            const todasTransacoes = transacoesAgrupadas.flatMap(g => g.transacoes);
            exportarJSON(todasTransacoes, {
                totalEntradas: estatisticas.totalEntradas,
                totalSaidas: estatisticas.totalSaidas,
                saldo: estatisticas.saldo,
                periodo: periodos.find(p => p.valor === filtros.periodo)?.label || 'Personalizado'
            });
            success('📊 Exportado!', 'Arquivo JSON baixado com sucesso.');
            setMostrarMenuExportar(false);
        } catch (err) {
            error('❌ Erro ao exportar', 'Não foi possível gerar o arquivo JSON.');
        }
    };

    const handleImprimirPDF = () => {
        try {
            const todasTransacoes = transacoesAgrupadas.flatMap(g => g.transacoes);
            imprimirPDF(todasTransacoes, {
                totalEntradas: estatisticas.totalEntradas,
                totalSaidas: estatisticas.totalSaidas,
                saldo: estatisticas.saldo,
                periodo: periodos.find(p => p.valor === filtros.periodo)?.label || 'Personalizado'
            });
            setMostrarMenuExportar(false);
        } catch (err) {
            error('❌ Erro ao imprimir', 'Não foi possível gerar o relatório.');
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

    // Dados para os novos componentes de insights
    const todasTransacoes = useMemo(() =>
        transacoesAgrupadas.flatMap(g => g.transacoes),
        [transacoesAgrupadas]
    );

    // Estatísticas do período anterior (simulação - TODO: implementar com dados reais)
    const estatisticasAnterior: EstatisticasFluxo = useMemo(() => ({
        totalEntradas: estatisticas.totalEntradas * 0.8,
        totalSaidas: estatisticas.totalSaidas * 0.9,
        saldo: estatisticas.saldo * 0.7,
        variacaoEntradas: 0,
        variacaoSaidas: 0,
        variacaoSaldo: 0,
        mediaDiariaGastos: estatisticas.mediaDiariaGastos * 0.9,
        projecaoFimMes: estatisticas.projecaoFimMes * 0.85,
        transacoesPorCategoria: estatisticas.transacoesPorCategoria,
        evolucaoSaldo: estatisticas.evolucaoSaldo
    }), [estatisticas]);

    // Calcular tendência
    const tendencia = useMemo(() =>
        calcularTendencia(estatisticas, estatisticasAnterior),
        [estatisticas, estatisticasAnterior]
    );

    // Calcular média diária
    const mediaDiaria = useMemo(() =>
        calcularMediaDiaria(estatisticas, todasTransacoes),
        [estatisticas, todasTransacoes]
    );

    // Dados para gráfico comparativo (últimos 6 meses)
    const dadosGraficoComparativo = useMemo(() => {
        return estatisticas.evolucaoSaldo.slice(-6).map((item, index) => {
            const data = new Date(item.data);
            const mes = data.toLocaleDateString('pt-BR', { month: 'short' });

            // Simular entradas/saídas baseado na posição (TODO: usar dados reais se disponível)
            const baseEntradas = estatisticas.totalEntradas / 6;
            const baseSaidas = estatisticas.totalSaidas / 6;

            return {
                mes: mes.charAt(0).toUpperCase() + mes.slice(1),
                entradas: baseEntradas * (0.8 + (index * 0.08)),
                saidas: baseSaidas * (1.2 - (index * 0.06))
            };
        });
    }, [estatisticas]);

    // Dados para gráfico de top categorias (Fase 2)
    const dadosTopCategorias = useMemo(() => {
        return estatisticas.transacoesPorCategoria
            .filter(c => c.tipo === 'saida')
            .slice(0, 5)
            .map(c => ({
                nome: c.categoria.nome,
                valor: c.total,
                cor: c.categoria.cor,
                icone: c.categoria.icone
            }));
    }, [estatisticas.transacoesPorCategoria]);

    // Calcular runway (Fase 3)
    const runway = useMemo(() => {
        const gastoMensal = estatisticas.totalSaidas;
        const receitaMensal = estatisticas.totalEntradas;
        return calcularRunway(estatisticas.saldo, gastoMensal, receitaMensal);
    }, [estatisticas]);

    // Calcular break-even (Fase 3)
    const breakEven = useMemo(() =>
        calcularBreakEven(estatisticas),
        [estatisticas]
    );

    // Encontrar maior gasto (Fase 3)
    const maiorGasto = useMemo(() =>
        encontrarMaiorGasto(todasTransacoes, estatisticas.totalSaidas),
        [todasTransacoes, estatisticas.totalSaidas]
    );

    // Gerar alertas (Fase 3)
    const alertas = useMemo(() =>
        gerarAlertas(estatisticas, todasTransacoes, runway, breakEven),
        [estatisticas, todasTransacoes, runway, breakEven]
    );

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
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Fluxo de Caixa</h2>
                            <p className="text-xs text-gray-500">Controle financeiro</p>
                        </div>
                    </div>
                    {abaAtiva === 'transacoes' && (
                        <div className="flex items-center gap-2">
                            {/* Botão Exportar */}
                            <div className="relative">
                                <button
                                    onClick={() => setMostrarMenuExportar(!mostrarMenuExportar)}
                                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    <span className="hidden sm:inline">Exportar</span>
                                </button>

                                {/* Menu Exportar */}
                                {mostrarMenuExportar && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setMostrarMenuExportar(false)} />
                                        <div className="absolute right-0 top-12 z-50 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                                            <button
                                                onClick={handleExportarCSV}
                                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <FileSpreadsheet className="w-4 h-4" />
                                                <span>Exportar CSV</span>
                                            </button>
                                            <button
                                                onClick={handleExportarJSON}
                                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <FileDown className="w-4 h-4" />
                                                <span>Exportar JSON</span>
                                            </button>
                                            <button
                                                onClick={handleImprimirPDF}
                                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-200 dark:border-gray-700"
                                            >
                                                <Printer className="w-4 h-4" />
                                                <span>Imprimir PDF</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Botão Nova Transação */}
                            <button
                                onClick={() => setModalAberto(true)}
                                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Nova</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Abas de Navegação - Scroll Horizontal */}
                <div className="flex gap-2 overflow-x-auto pb-2 mt-4 -mx-4 px-4">
                    <button
                        onClick={() => setAbaAtiva('transacoes')}
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-medium whitespace-nowrap transition-all',
                            abaAtiva === 'transacoes'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700'
                                : 'border-gray-200 dark:border-gray-700 text-gray-500'
                        )}
                    >
                        <Wallet className="w-4 h-4" />
                        <span>Transações</span>
                    </button>
                    <button
                        onClick={() => setAbaAtiva('dividas')}
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-medium whitespace-nowrap transition-all',
                            abaAtiva === 'dividas'
                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700'
                                : 'border-gray-200 dark:border-gray-700 text-gray-500'
                        )}
                    >
                        <FileText className="w-4 h-4" />
                        <span>Dívidas</span>
                    </button>
                    <button
                        onClick={() => setAbaAtiva('cartoes')}
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-medium whitespace-nowrap transition-all',
                            abaAtiva === 'cartoes'
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700'
                                : 'border-gray-200 dark:border-gray-700 text-gray-500'
                        )}
                    >
                        <CreditCard className="w-4 h-4" />
                        <span>Cartões</span>
                    </button>
                    <button
                        onClick={() => setAbaAtiva('analises')}
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-medium whitespace-nowrap transition-all',
                            abaAtiva === 'analises'
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700'
                                : 'border-gray-200 dark:border-gray-700 text-gray-500'
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
                    {/* Cards de Resumo - Compacto */}
                    <div className="flex sm:grid sm:grid-cols-3 gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 snap-x hide-scrollbar">
                        {/* Entradas */}
                        <div className="min-w-[130px] sm:min-w-0 snap-center p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                            <TrendingUp className="w-5 h-5 text-green-600 mb-1" />
                            <p className="text-[10px] text-green-600 font-medium">Entradas</p>
                            <p className="text-sm font-bold text-green-700 dark:text-green-400">
                                {formatarMoeda(estatisticas.totalEntradas)}
                            </p>
                        </div>

                        {/* Saídas */}
                        <div className="min-w-[130px] sm:min-w-0 snap-center p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <TrendingDown className="w-5 h-5 text-red-600 mb-1" />
                            <p className="text-[10px] text-red-600 font-medium">Saídas</p>
                            <p className="text-sm font-bold text-red-700 dark:text-red-400">
                                {formatarMoeda(estatisticas.totalSaidas)}
                            </p>
                        </div>

                        {/* Saldo */}
                        <div className={cn(
                            "min-w-[130px] sm:min-w-0 snap-center p-3 rounded-xl border",
                            estatisticas.saldo >= 0
                                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                                : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                        )}>
                            <BarChart3 className={cn(
                                "w-5 h-5 mb-1",
                                estatisticas.saldo >= 0 ? "text-blue-600" : "text-amber-600"
                            )} />
                            <p className={cn(
                                "text-[10px] font-medium",
                                estatisticas.saldo >= 0 ? "text-blue-600" : "text-amber-600"
                            )}>Saldo</p>
                            <p className={cn(
                                "text-sm font-bold",
                                estatisticas.saldo >= 0 ? "text-blue-700 dark:text-blue-400" : "text-amber-700 dark:text-amber-400"
                            )}>
                                {formatarMoeda(estatisticas.saldo)}
                            </p>
                        </div>
                    </div>

                    {/* Filtros - Compacto */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                        {/* Período - Scroll Horizontal */}
                        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 mb-2">
                            {periodos.map(p => (
                                <button
                                    key={p.valor}
                                    onClick={() => atualizarFiltros({ periodo: p.valor })}
                                    className={cn(
                                        'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
                                        filtros.periodo === p.valor
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                    )}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>

                        {/* Filtros Expandidos */}
                        <button
                            onClick={() => setMostrarFiltros(!mostrarFiltros)}
                            className="flex items-center gap-1 text-xs text-gray-500"
                        >
                            <Filter className="w-3 h-3" />
                            <span>{mostrarFiltros ? 'Ocultar filtros' : 'Mais filtros'}</span>
                            <ChevronDown className={cn("w-3 h-3 transition-transform", mostrarFiltros && "rotate-180")} />
                        </button>

                        {mostrarFiltros && (
                            <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                <div>
                                    <label className="block text-[10px] text-gray-500 mb-1">Tipo</label>
                                    <select
                                        value={filtros.tipo}
                                        onChange={(e) => atualizarFiltros({ tipo: e.target.value as any })}
                                        className="w-full px-2 py-1.5 border rounded-lg text-xs bg-gray-50 dark:bg-gray-700"
                                    >
                                        <option value="todos">Todos</option>
                                        <option value="entrada">Entradas</option>
                                        <option value="saida">Saídas</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 mb-1">Categoria</label>
                                    <select
                                        value={filtros.categoriaId || ''}
                                        onChange={(e) => atualizarFiltros({ categoriaId: e.target.value || undefined })}
                                        className="w-full px-2 py-1.5 border rounded-lg text-xs bg-gray-50 dark:bg-gray-700"
                                    >
                                        <option value="">Todas</option>
                                        {categorias.map(c => (
                                            <option key={c.id} value={c.id}>{c.icone} {c.nome}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 mb-1">Buscar</label>
                                    <div className="relative">
                                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                                        <input
                                            type="text"
                                            value={filtros.busca || ''}
                                            onChange={(e) => atualizarFiltros({ busca: e.target.value })}
                                            className="w-full pl-6 pr-2 py-1.5 border rounded-lg text-xs bg-gray-50 dark:bg-gray-700"
                                            placeholder="Buscar..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Insights Financeiros - NOVO */}
                    <div className="space-y-3">
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 px-1">
                            💡 Insights Financeiros
                        </h2>

                        {/* Grid de Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <CardTendencia tendencia={tendencia} />
                            <CardMediaDiaria media={mediaDiaria} />
                            <CardComparativo
                                atual={estatisticas}
                                anterior={estatisticasAnterior}
                                periodoAtual={periodos.find(p => p.valor === filtros.periodo)?.label || 'Atual'}
                                periodoAnterior="Anterior"
                            />
                        </div>

                        {/* Gráfico Comparativo */}
                        {dadosGraficoComparativo.length > 0 && (
                            <GraficoBarrasComparativo dados={dadosGraficoComparativo} />
                        )}
                    </div>

                    {/* Analytics Avançados - Fases 2 e 3 */}
                    <div className="space-y-3">
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 px-1">
                            🔬 Analytics Avançados
                        </h2>

                        {/* Gráfico Top Categorias (Fase 2) */}
                        {dadosTopCategorias.length > 0 && (
                            <GraficoTopCategorias dados={dadosTopCategorias} limite={5} />
                        )}

                        {/* Grid de Cards Avançados (Fase 3) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <CardRunway
                                runway={runway}
                                saldoAtual={estatisticas.saldo}
                                gastoMensal={estatisticas.totalSaidas}
                            />
                            <CardBreakEven breakEven={breakEven} />
                            <CardMaiorGasto maiorGasto={maiorGasto} />
                            <CardAlertas alertas={alertas} />
                        </div>
                    </div>

                    {/* Gráficos - Responsivo */}
                    {estatisticas.evolucaoSaldo.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Gráfico de Categorias */}
                            {dadosPizza.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
                                        Gastos por Categoria
                                    </h3>
                                    <div className="h-[140px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={dadosPizza}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={30}
                                                    outerRadius={50}
                                                    dataKey="value"
                                                    labelLine={false}
                                                >
                                                    {dadosPizza.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value: number) => formatarMoeda(value)}
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', fontSize: '11px' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}

                            {/* Gráfico de Evolução */}
                            {dadosEvolucao.length > 1 && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
                                        Evolução do Saldo
                                    </h3>
                                    <div className="h-[140px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={dadosEvolucao}>
                                                <XAxis dataKey="data" tick={{ fontSize: 8 }} axisLine={false} />
                                                <YAxis tick={{ fontSize: 8 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} axisLine={false} />
                                                <Tooltip
                                                    formatter={(value: number) => formatarMoeda(value)}
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', fontSize: '11px' }}
                                                />
                                                <Line type="monotone" dataKey="saldo" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Insights - Compacto */}
                    {(estatisticas.categoriaMaisGastos || estatisticas.mediaDiariaGastos > 0) && (
                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                            <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="w-4 h-4 text-amber-600" />
                                <h3 className="text-xs font-semibold text-amber-900 dark:text-amber-100">Insights</h3>
                            </div>
                            <div className="space-y-1 text-xs text-amber-800 dark:text-amber-200">
                                {estatisticas.categoriaMaisGastos && (
                                    <p>• Maior gasto: <strong>{estatisticas.categoriaMaisGastos.categoria.nome}</strong> ({formatarMoeda(estatisticas.categoriaMaisGastos.total)})</p>
                                )}
                                {estatisticas.mediaDiariaGastos > 0 && (
                                    <p>• Média/dia: <strong>{formatarMoeda(estatisticas.mediaDiariaGastos)}</strong></p>
                                )}
                                <p>• Projeção mês: <strong className={estatisticas.projecaoFimMes >= 0 ? 'text-green-700' : 'text-red-700'}>{formatarMoeda(estatisticas.projecaoFimMes)}</strong></p>
                            </div>
                        </div>
                    )}

                    {/* Lista de Transações - Compacto */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                        <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-3">
                            Transações Recentes
                        </h3>

                        {transacoesAgrupadas.length === 0 ? (
                            <div className="text-center py-8">
                                <BarChart3 className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                                <p className="text-xs text-gray-500">Nenhuma transação</p>
                                <p className="text-[10px] text-gray-400">Clique em "Nova" para começar</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {transacoesAgrupadas.map(grupo => (
                                    <div key={grupo.data}>
                                        <div className="flex items-center gap-1 mb-1.5">
                                            <Calendar className="w-3 h-3 text-gray-400" />
                                            <span className="text-[10px] font-medium text-gray-500">
                                                {grupo.data}
                                            </span>
                                        </div>
                                        <div className="space-y-1.5">
                                            {grupo.transacoes.map(transacao => {
                                                const categoria = obterCategoria(transacao.categoriaId);
                                                return (
                                                    <div
                                                        key={transacao.id}
                                                        className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 group"
                                                    >
                                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                                            <div
                                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                                                                style={{ backgroundColor: `${categoria?.cor}20` }}
                                                            >
                                                                {categoria?.icone}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                    {transacao.descricao}
                                                                </p>
                                                                <p className="text-[10px] text-gray-500 truncate">
                                                                    {categoria?.nome}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-shrink-0">
                                                            <span className={cn(
                                                                'text-sm font-semibold',
                                                                transacao.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                                                            )}>
                                                                {transacao.tipo === 'entrada' ? '+' : '-'}{formatarMoeda(transacao.valor)}
                                                            </span>
                                                            <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
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
                                                                    aria-label="Editar transação"
                                                                >
                                                                    <Pencil className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setModalExclusao({
                                                                        aberto: true,
                                                                        id: transacao.id,
                                                                        descricao: transacao.descricao
                                                                    })}
                                                                    className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                                                    aria-label="Excluir transação"
                                                                >
                                                                    <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
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

            {/* Toast Container */}
            <ToastContainer toasts={toasts} onClose={removeToast} />
        </div>
    );
}
