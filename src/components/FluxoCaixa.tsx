import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
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
    Printer,
    Settings,
    Tag
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
import { useDividas } from '../hooks/useDividas';
import { useCartaoCredito } from '../hooks/useCartaoCredito';
import { useMetas } from '../hooks/useMetas';
import { useRecorrentes } from '../hooks/useRecorrentes';
import { useTransacoesPendentes } from '../hooks/useTransacoesPendentes';
import { useToast } from '../hooks/useToast';
import { ExportButton, ExportModal } from '../features/export/components';
import { useExport } from '../features/export/hooks/useExport';
import { useModal } from '../hooks/useModal';
import { ToastContainer } from './Toast';
import { CategoriesManager } from '../features/categories/components';
import { NovaTransacao, TipoTransacao, PeriodoFiltro, EstatisticasFluxo, DashboardConfig, DASHBOARD_CONFIG_PADRAO } from '../types/fluxoCaixa';
import { formatarMoeda, calcularProximaData, formatarData, obterDataHoje } from '../utils/calculos';
import { exportarCSV, exportarJSON, imprimirPDF } from '../utils/exportar';
import { cn } from '../utils/cn';
import {
    ModalMeta,
    ModalRecorrente,
    ModalConfigDashboard,
    ModalDivida,
    ModalCartao
} from './FluxoCaixa/index';
import { AreaTransacoes } from '../features/transacoes';
import { DashboardFinanceiro } from '../features/dashboard';
import { DebtsManager } from '../features/debts';
import { CardsManager } from '../features/cards';

// Modal de Adicionar/Editar Transação
interface ModalTransacaoProps {
    aberto: boolean;
    onFechar: () => void;
    onSalvar: (dados: NovaTransacao & { diaDoMes?: number; diaDaSemana?: number; dataFim?: string; ativa?: boolean }) => void;
    transacaoInicial?: Partial<NovaTransacao>;
    categorias: ReturnType<typeof useFluxoCaixa>['categorias'];
    titulo: string;
}

function ModalTransacao({ aberto, onFechar, onSalvar, transacaoInicial, categorias, titulo }: ModalTransacaoProps) {
    const [dados, setDados] = useState<Partial<NovaTransacao> & { diaDoMes?: number; diaDaSemana?: number; dataFim?: string; ativa?: boolean }>({
        descricao: '',
        valor: 0,
        tipo: 'saida',
        categoriaId: '',
        data: obterDataHoje(),
        observacoes: '',
        recorrencia: 'mensal',
        ativa: true,
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
                data: obterDataHoje(),
                observacoes: '',
                recorrencia: 'mensal',
                ativa: true,
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
            onSalvar(dados as NovaTransacao & { diaDoMes?: number; diaDaSemana?: number; dataFim?: string; ativa?: boolean });
            onFechar();
            // Limpar formulário
            setDados({
                descricao: '',
                valor: 0,
                tipo: 'saida',
                categoriaId: '',
                data: obterDataHoje(),
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
                            <div className="mt-3 space-y-4">
                                {/* Status Ativo/Inativo */}
                                <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Status</span>
                                    <button
                                        type="button"
                                        onClick={() => setDados(prev => ({ ...prev, ativa: !prev.ativa }))}
                                        className={cn(
                                            "px-2 py-1 rounded text-xs font-medium transition-colors",
                                            dados.ativa
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                                        )}
                                    >
                                        {dados.ativa ? 'Ativa' : 'Pausada'}
                                    </button>
                                </div>

                                <div>
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
                                </div>

                                {/* Configurações Específicas */}
                                {dados.recorrencia === 'mensal' && (
                                    <div>
                                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                            Dia do Mês
                                        </label>
                                        <select
                                            value={dados.diaDoMes || new Date(dados.data!).getDate()}
                                            onChange={(e) => setDados(prev => ({ ...prev, diaDoMes: parseInt(e.target.value) }))}
                                            className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs bg-white dark:bg-gray-800"
                                        >
                                            {Array.from({ length: 31 }, (_, i) => i + 1).map(dia => (
                                                <option key={dia} value={dia}>Dia {dia}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {dados.recorrencia === 'semanal' && (
                                    <div>
                                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                            Dia da Semana
                                        </label>
                                        <div className="flex gap-1 overflow-x-auto pb-1">
                                            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((label, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => setDados(prev => ({ ...prev, diaDaSemana: idx }))}
                                                    className={cn(
                                                        'flex-1 py-1.5 px-2 rounded-lg text-[10px] font-medium transition-colors whitespace-nowrap',
                                                        (dados.diaDaSemana ?? new Date(dados.data!).getDay()) === idx
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600'
                                                    )}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        Data Final (Opcional)
                                    </label>
                                    <input
                                        type="date"
                                        value={dados.dataFim || ''}
                                        onChange={(e) => setDados(prev => ({ ...prev, dataFim: e.target.value }))}
                                        className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs bg-white dark:bg-gray-800"
                                    />
                                </div>

                                {/* Previsão de Lançamentos */}
                                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-primary-600" />
                                        Previsão (Próximas 5)
                                    </h4>
                                    <div className="space-y-1">
                                        {(() => {
                                            const prevs = [];
                                            let data = dados.data!;
                                            const limite = new Date();
                                            limite.setFullYear(limite.getFullYear() + 1);

                                            for (let i = 0; i < 5; i++) {
                                                prevs.push(data);
                                                data = calcularProximaData(
                                                    data,
                                                    dados.recorrencia as any,
                                                    dados.recorrencia === 'mensal' ? (dados.diaDoMes || new Date(dados.data!).getDate()) : undefined,
                                                    dados.recorrencia === 'semanal' ? (dados.diaDaSemana ?? new Date(dados.data!).getDay()) : undefined
                                                );
                                                if (dados.dataFim && new Date(data) > new Date(dados.dataFim)) break;
                                            }

                                            return prevs.map((data, idx) => (
                                                <div key={idx} className="flex items-center justify-between text-[10px]">
                                                    <span className="text-gray-500">
                                                        {idx + 1}ª
                                                    </span>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {formatarData(data)}
                                                    </span>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                </div>
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
        transacoes,
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
        limparFiltros,
        adicionarCategoria,
        excluirCategoria
    } = useFluxoCaixa();

    // Ref para rastrear recorrências já processadas hoje
    const recorrentesProcessadasRef = React.useRef<Set<string>>(new Set());

    // Hooks para Dívidas e Cartões
    const {
        dividasPendentes,
        estatisticas: estatisticasDividas,
        marcarComoPago: marcarDividaComoPago,
        adicionarDivida,
        editarDivida,
        excluirDivida
    } = useDividas();

    const {
        cartoes,
        gastos: gastosCartao,
        estatisticas: estatisticasCartoes,
        obterFaturaAtual,
        pagarFatura,
        faturasPagas,
        adicionarCartao,
        editarCartao,
        excluirCartao
    } = useCartaoCredito();

    // Hooks para Metas e Recorrentes
    const {
        metas,
        adicionarMeta,
        editarMeta,
        excluirMeta
    } = useMetas();

    const {
        recorrentes,
        adicionarRecorrente,
        editarRecorrente,
        excluirRecorrente,
        toggleAtiva,
        atualizarProximaData
    } = useRecorrentes();

    const {
        pendentes,
        pendentesPorData,
        estatisticas: estatisticasPendentes,
        adicionarPendente,
        editarPendente,
        excluirPendente
    } = useTransacoesPendentes();

    // Hook de Exportação
    const { exportData, isExporting } = useExport();
    const [showExportModal, setShowExportModal] = useState(false);

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
    const [abaAtiva, setAbaAtiva] = useState<'dashboard' | 'transacoes' | 'dividas' | 'cartoes' | 'categorias'>('dashboard');
    const [mostrarMenuExportar, setMostrarMenuExportar] = useState(false);
    const [modalMeta, setModalMeta] = useState<{ aberto: boolean; meta?: any }>({ aberto: false });
    const [modalRecorrente, setModalRecorrente] = useState<{ aberto: boolean; recorrente?: any }>({ aberto: false });
    const [modalConfigDashboard, setModalConfigDashboard] = useState(false);
    const [modalDivida, setModalDivida] = useState(false);
    const [modalCartao, setModalCartao] = useState(false);
    const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>(() => {
        const saved = localStorage.getItem('jurus_dashboard_config');
        return saved ? JSON.parse(saved) : DASHBOARD_CONFIG_PADRAO;
    });
    const { success, error, toasts, removeToast } = useToast();

    // Funções para gerenciar transações pendentes
    const handleEfetivarPendente = useCallback((id: string) => {
        const pendente = pendentes.find(p => p.id === id);
        if (!pendente) return;

        // Criar transação efetiva
        adicionarTransacao({
            descricao: pendente.descricao,
            valor: pendente.valor,
            tipo: pendente.tipo,
            categoriaId: pendente.categoriaId,
            data: obterDataHoje(),
            observacoes: pendente.observacoes
        });

        // Remover da lista de pendentes
        excluirPendente(id);

        // Se veio de recorrente, atualizar próxima data
        if (pendente.recorrenteId) {
            atualizarProximaData(pendente.recorrenteId);
        }

        success('✅ Transação efetivada', `${pendente.descricao} foi registrada.`);
    }, [pendentes, adicionarTransacao, excluirPendente, atualizarProximaData, success]);

    const handleAnteciparPendente = useCallback((id: string, novaData: string) => {
        editarPendente(id, { dataAgendada: novaData });
        success('📅 Transação antecipada', 'Data atualizada com sucesso.');
    }, [editarPendente, success]);

    const handleCancelarPendente = useCallback((id: string) => {
        excluirPendente(id);
        success('❌ Transação cancelada', 'Transação pendente removida.');
    }, [excluirPendente, success]);

    // Calcular gastos por categoria (incluindo dívidas e cartões) - com useMemo para reatividade
    const gastosPorCategoria = useMemo(() => {
        // Gastos por categoria de transações
        const gastos = transacoesAgrupadas.flatMap(g => g.transacoes)
            .filter(t => t.tipo === 'saida')
            .reduce((acc, t) => {
                acc[t.categoriaId] = (acc[t.categoriaId] || 0) + t.valor;
                return acc;
            }, {} as Record<string, number>);

        // Adicionar dívidas por categoria
        dividasPendentes.forEach(divida => {
            if (divida.categoriaId) {
                // Dívida tem categoria específica
                gastos[divida.categoriaId] = (gastos[divida.categoriaId] || 0) + divida.valor;
            } else {
                // Dívida sem categoria vai para 'dividas'
                gastos['dividas'] = (gastos['dividas'] || 0) + divida.valor;
            }
        });

        // Adicionar total de gastos em cartões (faturas atuais)
        const totalCartoes = cartoes.reduce((sum, cartao) => {
            const fatura = obterFaturaAtual(cartao.id);
            return sum + (fatura?.total || 0);
        }, 0);
        if (totalCartoes > 0) {
            gastos['cartoes'] = totalCartoes;
        }

        return Object.entries(gastos).map(([categoriaId, total]) => ({ categoriaId, total }));
    }, [transacoesAgrupadas, dividasPendentes, cartoes, gastosCartao, obterFaturaAtual]);

    // Sincronizar recorrentes pendentes - Otimizado
    useEffect(() => {
        if (!carregado) return;

        const hoje = obterDataHoje();
        const hojeKey = hoje;

        // Resetar processadas se mudou o dia
        const ultimoDiaProcessado = localStorage.getItem('jurus_ultimo_dia_processado');
        if (ultimoDiaProcessado !== hojeKey) {
            recorrentesProcessadasRef.current.clear();
            localStorage.setItem('jurus_ultimo_dia_processado', hojeKey);
        }

        recorrentes.forEach(rec => {
            // Pular se inativa, expirada ou já processada hoje
            if (!rec.ativa) return;
            if (rec.dataFim && rec.proximaData > rec.dataFim) return;

            const chaveProcessamento = `${rec.id}_${rec.proximaData}`;
            if (recorrentesProcessadasRef.current.has(chaveProcessamento)) return;

            // Se a próxima data já chegou ou passou
            if (rec.proximaData <= hoje) {
                // Verificação mais eficiente: busca direta nas transações
                const jaExiste = transacoes.some(t =>
                    t.descricao === rec.descricao &&
                    t.valor === rec.valor &&
                    t.categoriaId === rec.categoriaId &&
                    t.data.startsWith(rec.proximaData)
                );

                if (!jaExiste) {
                    // Marcar como processada antes de adicionar
                    recorrentesProcessadasRef.current.add(chaveProcessamento);

                    adicionarTransacao({
                        descricao: rec.descricao,
                        valor: rec.valor,
                        tipo: rec.tipo,
                        categoriaId: rec.categoriaId,
                        data: rec.proximaData,
                        observacoes: rec.observacoes ? `${rec.observacoes} (Recorrente)` : 'Transação Recorrente',
                        recorrente: false
                    });

                    // Atualizar a próxima data da recorrência
                    atualizarProximaData(rec.id);

                    success('🔄 Recorrência gerada', `Transação "${rec.descricao}" foi gerada.`);
                }
            }
        });
    }, [recorrentes, carregado, transacoes, adicionarTransacao, atualizarProximaData, success]);

    // Funções para controlar visibilidade dos cards
    const handleToggleInsight = (key: keyof DashboardConfig['insights']) => {
        setDashboardConfig(prev => {
            const newConfig = { ...prev, insights: { ...prev.insights, [key]: !prev.insights[key] } };
            localStorage.setItem('jurus_dashboard_config', JSON.stringify(newConfig));
            return newConfig;
        });
    };

    const handleToggleAnalytic = (key: keyof DashboardConfig['analytics']) => {
        setDashboardConfig(prev => {
            const newConfig = { ...prev, analytics: { ...prev.analytics, [key]: !prev.analytics[key] } };
            localStorage.setItem('jurus_dashboard_config', JSON.stringify(newConfig));
            return newConfig;
        });
    };

    const handleToggleGrafico = (key: keyof DashboardConfig['graficos']) => {
        setDashboardConfig(prev => {
            const newConfig = { ...prev, graficos: { ...prev.graficos, [key]: !prev.graficos[key] } };
            localStorage.setItem('jurus_dashboard_config', JSON.stringify(newConfig));
            return newConfig;
        });
    };

    const handleToggleCardTransacao = (key: keyof DashboardConfig['cardsTransacoes']) => {
        setDashboardConfig(prev => {
            const newConfig = { ...prev, cardsTransacoes: { ...prev.cardsTransacoes, [key]: !prev.cardsTransacoes[key] } };
            localStorage.setItem('jurus_dashboard_config', JSON.stringify(newConfig));
            return newConfig;
        });
    };

    const handleRestaurarPadrao = () => {
        setDashboardConfig(DASHBOARD_CONFIG_PADRAO);
        localStorage.setItem('jurus_dashboard_config', JSON.stringify(DASHBOARD_CONFIG_PADRAO));
    };

    const handleMostrarTodos = () => {
        const allTrue: DashboardConfig = {
            insights: { tendencia: true, mediaDiaria: true, comparativo: true },
            analytics: { runway: true, breakEven: true, maiorGasto: true, alertas: true, topCategorias: true },
            graficos: { barrasComparativo: true, pizza: true, evolucao: true },
            cardsTransacoes: { previsaoMes: true, economiaMensal: true, dividasPendentes: true, cartoesCredito: true, metasMes: true, recorrentes: true }
        };
        setDashboardConfig(allTrue);
        localStorage.setItem('jurus_dashboard_config', JSON.stringify(allTrue));
    };

    const handleOcultarTodos = () => {
        const allFalse: DashboardConfig = {
            insights: { tendencia: false, mediaDiaria: false, comparativo: false },
            analytics: { runway: false, breakEven: false, maiorGasto: false, alertas: false, topCategorias: false },
            graficos: { barrasComparativo: false, pizza: false, evolucao: false },
            cardsTransacoes: { previsaoMes: false, economiaMensal: false, dividasPendentes: false, cartoesCredito: false, metasMes: false, recorrentes: false }
        };
        setDashboardConfig(allFalse);
        localStorage.setItem('jurus_dashboard_config', JSON.stringify(allFalse));
    };

    const periodos: { valor: PeriodoFiltro; label: string }[] = [
        { valor: 'hoje', label: 'Hoje' },
        { valor: 'semana', label: 'Esta Semana' },
        { valor: 'mes', label: 'Este Mês' },
        { valor: 'ano', label: 'Este Ano' }
    ];

    const handleAdicionarTransacao = (dados: NovaTransacao & { diaDoMes?: number; diaDaSemana?: number; dataFim?: string; ativa?: boolean }) => {
        if (dados.recorrente) {
            // Adicionar à lista de regras recorrentes
            adicionarRecorrente({
                descricao: dados.descricao,
                valor: dados.valor,
                tipo: dados.tipo,
                categoriaId: dados.categoriaId,
                frequencia: dados.recorrencia!,
                diaDoMes: dados.diaDoMes,
                diaDaSemana: dados.diaDaSemana,
                dataInicio: dados.data,
                dataFim: dados.dataFim,
                observacoes: dados.observacoes,
                ativa: dados.ativa
            });

            // Se a data for hoje ou anterior, adicionar também a transação imediata
            const hoje = obterDataHoje();
            if (dados.data <= hoje && (dados.ativa ?? true)) {
                adicionarTransacao({
                    ...dados,
                    recorrente: false // Importante: marcar como não recorrente na lista de transações para não duplicar lógica
                });
            }

            success('✅ Recorrência criada!', 'A regra de recorrência foi configurada.');
        } else {
            adicionarTransacao(dados);
            success('✅ Transação adicionada!', 'Sua transação foi registrada com sucesso.');
        }
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

    // Handler de exportação do dashboard completo
    const handleExportDashboard = useCallback(async (config: any) => {
        const periodoLabel = periodos.find(p => p.valor === filtros.periodo)?.label || 'Personalizado';
        const transacoesList = transacoesAgrupadas.flatMap(g => g.transacoes);
        
        // Formatar dados para exportação
        const dashboardData = {
            summary: {
                title: 'Dashboard Completo - Jurus',
                description: `Período: ${periodoLabel} | Gerado em: ${new Date().toLocaleDateString('pt-BR')}`
            },
            tables: [
                {
                    title: 'Resumo Financeiro',
                    headers: ['Item', 'Valor'],
                    rows: [
                        ['Receitas', formatarMoeda(estatisticas.totalEntradas)],
                        ['Despesas', formatarMoeda(estatisticas.totalSaidas)],
                        ['Saldo', formatarMoeda(estatisticas.saldo)]
                    ]
                },
                {
                    title: 'Transações Recentes',
                    headers: ['Data', 'Descrição', 'Categoria', 'Valor', 'Tipo'],
                    rows: transacoesList.slice(0, 20).map(t => [
                        formatarData(t.data),
                        t.descricao,
                        obterCategoria(t.categoriaId)?.nome || 'Sem categoria',
                        formatarMoeda(t.valor),
                        t.tipo === 'entrada' ? 'Entrada' : 'Saída'
                    ])
                }
            ],
            sheets: [
                {
                    name: 'Resumo',
                    data: [
                        ['Receitas', estatisticas.totalEntradas],
                        ['Despesas', estatisticas.totalSaidas],
                        ['Saldo', estatisticas.saldo]
                    ],
                    headers: ['Item', 'Valor']
                },
                {
                    name: 'Transações',
                    json: transacoesList.map(t => ({
                        Data: formatarData(t.data),
                        Descrição: t.descricao,
                        Categoria: obterCategoria(t.categoriaId)?.nome || 'Sem categoria',
                        Valor: t.valor,
                        Tipo: t.tipo === 'entrada' ? 'Entrada' : 'Saída'
                    }))
                }
            ],
            headers: ['Data', 'Descrição', 'Categoria', 'Valor', 'Tipo'],
            rows: transacoesList.map(t => [
                formatarData(t.data),
                t.descricao,
                obterCategoria(t.categoriaId)?.nome || 'Sem categoria',
                t.valor,
                t.tipo === 'entrada' ? 'Entrada' : 'Saída'
            ])
        };

        await exportData('dashboard', dashboardData, config.format, config);
    }, [exportData, filtros, periodos, estatisticas, transacoesAgrupadas, obterCategoria]);

    // Dados para gráfico de pizza
    const dadosPizza = useMemo(() => {
        return estatisticas.transacoesPorCategoria
            .filter(c => c.tipo === 'saida')
            .slice(0, 5)
            .map(c => ({
                name: c.categoria?.nome || 'Outros',
                value: c.total,
                color: c.categoria?.cor || '#9CA3AF',
                icone: c.categoria?.icone || 'help-circle'
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
                    {abaAtiva === 'dashboard' && (
                        <div className="flex items-center gap-2">
                            <ExportButton
                                onClick={() => setShowExportModal(true)}
                                label="Exportar Dashboard"
                                variant="outline"
                                size="md"
                                loading={isExporting}
                            />
                        </div>
                    )}
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

                {/* Abas de Navegação - Desktop Only */}
                <div className="hidden md:flex gap-2 overflow-x-auto pb-2 mt-4 -mx-4 px-4">
                    <button
                        onClick={() => setAbaAtiva('dashboard')}
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-medium whitespace-nowrap transition-all',
                            abaAtiva === 'dashboard'
                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700'
                                : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                        )}
                    >
                        <BarChart3 className="w-4 h-4" />
                        <span>Dashboard</span>
                    </button>
                    <button
                        onClick={() => setAbaAtiva('transacoes')}
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-medium whitespace-nowrap transition-all',
                            abaAtiva === 'transacoes'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700'
                                : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
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
                                : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
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
                                : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                        )}
                    >
                        <CreditCard className="w-4 h-4" />
                        <span>Cartões</span>
                    </button>
                    <button
                        onClick={() => setAbaAtiva('categorias')}
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-medium whitespace-nowrap transition-all',
                            abaAtiva === 'categorias'
                                ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700'
                                : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                        )}
                    >
                        <Tag className="w-4 h-4" />
                        <span>Categorias</span>
                    </button>
                    <button
                        onClick={() => setModalConfigDashboard(true)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-medium whitespace-nowrap transition-all border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                        title="Personalizar Dashboard"
                    >
                        <Settings className="w-4 h-4" />
                        <span>Configurações</span>
                    </button>
                </div>

                {/* Navegação Mobile - Sidebar Style */}
                <div className="md:hidden mt-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-2 border border-gray-200 dark:border-gray-700">
                    <nav className="space-y-1">
                        <button
                            onClick={() => setAbaAtiva('dashboard')}
                            className={cn(
                                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                                abaAtiva === 'dashboard'
                                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            )}
                        >
                            <BarChart3 className="w-5 h-5" />
                            <span>Dashboard</span>
                        </button>
                        <button
                            onClick={() => setAbaAtiva('transacoes')}
                            className={cn(
                                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                                abaAtiva === 'transacoes'
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            )}
                        >
                            <Wallet className="w-5 h-5" />
                            <span>Transações</span>
                        </button>
                        <button
                            onClick={() => setAbaAtiva('dividas')}
                            className={cn(
                                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                                abaAtiva === 'dividas'
                                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            )}
                        >
                            <FileText className="w-5 h-5" />
                            <span>Dívidas</span>
                        </button>
                        <button
                            onClick={() => setAbaAtiva('cartoes')}
                            className={cn(
                                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                                abaAtiva === 'cartoes'
                                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            )}
                        >
                            <CreditCard className="w-5 h-5" />
                            <span>Cartões</span>
                        </button>
                        <button
                            onClick={() => setAbaAtiva('categorias')}
                            className={cn(
                                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                                abaAtiva === 'categorias'
                                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            )}
                        >
                            <Tag className="w-5 h-5" />
                            <span>Categorias</span>
                        </button>
                        <button
                            onClick={() => setModalConfigDashboard(true)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border-t border-gray-200 dark:border-gray-700 mt-2 pt-3"
                        >
                            <Settings className="w-5 h-5" />
                            <span>Configurações</span>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Conteúdo baseado na aba ativa */}
            {abaAtiva === 'dashboard' && (
                <div className="card-mobile">
                    <DashboardFinanceiro />
                </div>
            )}

            {abaAtiva === 'categorias' && (
                <div className="card-mobile">
                    <CategoriesManager
                        categories={categorias}
                        onAddCategory={adicionarCategoria}
                        onDeleteCategory={excluirCategoria}
                    />
                </div>
            )}

            {abaAtiva === 'dividas' && (
                <div className="card-mobile">
                    <DebtsManager
                        onAddDebt={() => setModalDivida(true)}
                        onEditDebt={(debtId) => {
                            // TODO: Implementar edição de dívida
                            console.log('Edit debt:', debtId);
                        }}
                        onDeleteDebt={(debtId) => {
                            success('🗑️ Dívida excluída', 'Dívida removida com sucesso!');
                        }}
                        onMarkAsPaid={(debtId) => {
                            marcarDividaComoPago(debtId);
                            success('✅ Dívida paga', 'Dívida marcada como paga com sucesso!');
                        }}
                    />
                </div>
            )}

            {abaAtiva === 'cartoes' && (
                <div className="card-mobile">
                    <CardsManager
                        onAddCard={() => setModalCartao(true)}
                        onEditCard={(cardId) => {
                            // TODO: Implementar edição de cartão
                            console.log('Edit card:', cardId);
                        }}
                        onDeleteCard={(cardId) => {
                            success('🗑️ Cartão excluído', 'Cartão removido com sucesso!');
                        }}
                        onAddExpense={(cardId) => {
                            success('💳 Gasto adicionado', 'Gasto registrado no cartão com sucesso!');
                        }}
                    />
                </div>
            )}

            {abaAtiva === 'transacoes' && (
                <>
                    {/* NOVA ÁREA DE TRANSAÇÕES REFATORADA */}
                    <div className="card-mobile">
                        <AreaTransacoes
                            onNovaTransacao={() => setModalAberto(true)}
                            onEditarTransacao={(id, dados) => {
                                setModalEdicao({
                                    aberto: true,
                                    id,
                                    dados
                                });
                            }}
                            onExcluirTransacao={(id, descricao) => {
                                setModalExclusao({
                                    aberto: true,
                                    id,
                                    descricao
                                });
                            }}
                            onAdicionarMeta={() => setModalMeta({ aberto: true })}
                            onEditarMeta={(metaId) => {
                                const meta = metas.find(m => m.id === metaId);
                                if (meta) setModalMeta({ aberto: true, meta });
                            }}
                            onExcluirMeta={(metaId) => {
                                excluirMeta(metaId);
                                success('🗑️ Meta excluída', 'Meta removida com sucesso!');
                            }}
                            onAdicionarRecorrente={() => setModalRecorrente({ aberto: true })}
                            onEditarRecorrente={(recorrenteId) => {
                                const recorrente = recorrentes.find(r => r.id === recorrenteId);
                                if (recorrente) setModalRecorrente({ aberto: true, recorrente });
                            }}
                            onExcluirRecorrente={(recorrenteId) => {
                                excluirRecorrente(recorrenteId);
                                success('🗑️ Recorrente excluída', 'Transação recorrente removida com sucesso!');
                            }}
                            onToggleRecorrente={(recorrenteId) => {
                                toggleAtiva(recorrenteId);
                            }}
                        />
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

            {/* Modais de Metas e Recorrentes */}
            <ModalMeta
                aberto={modalMeta.aberto}
                onFechar={() => setModalMeta({ aberto: false })}
                onSalvar={(dados) => {
                    if (modalMeta.meta) {
                        editarMeta(modalMeta.meta.id, dados);
                    } else {
                        adicionarMeta(dados);
                    }
                    setModalMeta({ aberto: false });
                }}
                metaInicial={modalMeta.meta}
                categoriasUsadas={metas.map(m => m.categoriaId)}
                categorias={categorias}
            />
            <ModalRecorrente
                aberto={modalRecorrente.aberto}
                onFechar={() => setModalRecorrente({ aberto: false })}
                onSalvar={(dados) => {
                    if (modalRecorrente.recorrente) {
                        editarRecorrente(modalRecorrente.recorrente.id, dados);
                    } else {
                        adicionarRecorrente(dados);
                    }
                    setModalRecorrente({ aberto: false });
                }}
                onToggleAtiva={toggleAtiva}
                recorrenteInicial={modalRecorrente.recorrente}
                categorias={categorias}
            />

            {/* Modal de Configuração do Dashboard */}
            <ModalConfigDashboard
                aberto={modalConfigDashboard}
                onFechar={() => setModalConfigDashboard(false)}
                config={dashboardConfig}
                onToggleInsight={handleToggleInsight}
                onToggleAnalytic={handleToggleAnalytic}
                onToggleGrafico={handleToggleGrafico}
                onToggleCardTransacao={handleToggleCardTransacao}
                onRestaurarPadrao={handleRestaurarPadrao}
                onMostrarTodos={handleMostrarTodos}
                onOcultarTodos={handleOcultarTodos}
            />

            {/* Modal de Adicionar Dívida */}
            <ModalDivida
                aberto={modalDivida}
                onFechar={() => setModalDivida(false)}
                onSalvar={(dados) => {
                    adicionarDivida({
                        descricao: dados.descricao,
                        valor: dados.valor,
                        credor: '',
                        categoriaId: dados.categoriaId || '',
                        dataVencimento: dados.dataVencimento,
                        observacoes: dados.observacoes,
                        numeroParcelas: dados.parcelas
                    });
                    success('✅ Dívida adicionada', 'Dívida cadastrada com sucesso!');
                }}
            />

            {/* Modal de Adicionar Cartão */}
            <ModalCartao
                aberto={modalCartao}
                onFechar={() => setModalCartao(false)}
                onSalvar={(dados) => {
                    adicionarCartao({
                        nome: dados.nome,
                        limite: dados.limite,
                        diaFechamento: dados.diaFechamento,
                        diaVencimento: dados.diaVencimento,
                        bandeira: dados.bandeira as any,
                        cor: dados.cor
                    });
                    success('✅ Cartão adicionado', 'Cartão cadastrado com sucesso!');
                }}
            />

            {/* Modal de Exportação do Dashboard */}
            <ExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                onExport={handleExportDashboard}
                reportType="dashboard"
                title="Exportar Dashboard Completo"
            />

            {/* Toast Container */}
            <ToastContainer toasts={toasts} onClose={removeToast} />
        </div>
    );
}
